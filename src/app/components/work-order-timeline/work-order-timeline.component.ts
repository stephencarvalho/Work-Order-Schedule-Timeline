import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Popover, PopoverModule } from 'primeng/popover';

import { WorkOrderPanelComponent, WorkOrderPanelSubmitEvent } from '../work-order-panel/work-order-panel.component';
import { Timescale, TimelineColumn, WorkCenterDocument, WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../models';
import { WorkOrderStoreService } from '../../services/work-order-store.service';
import {
  addDays,
  addMonths,
  clampDate,
  daysInMonth,
  diffInDays,
  diffInMonths,
  endOfMonth,
  endOfWeek,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  fromIsoDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toIsoDate
} from '../../utils/date-utils';

interface TimelineProjection {
  startDate: Date;
  endDate: Date;
  columns: TimelineColumn[];
  width: number;
  columnWidth: number;
}

const SCALE_OPTIONS: Array<{ value: Timescale; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
];
const MONTH_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Jan' },
  { value: 1, label: 'Feb' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Apr' },
  { value: 4, label: 'May' },
  { value: 5, label: 'Jun' },
  { value: 6, label: 'Jul' },
  { value: 7, label: 'Aug' },
  { value: 8, label: 'Sep' },
  { value: 9, label: 'Oct' },
  { value: 10, label: 'Nov' },
  { value: 11, label: 'Dec' }
];

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  complete: 'Complete',
  blocked: 'Blocked'
};

const STATUS_CLASS: Record<WorkOrderStatus, string> = {
  open: 'status-open',
  'in-progress': 'status-in-progress',
  complete: 'status-complete',
  blocked: 'status-blocked'
};

@Component({
  selector: 'app-work-order-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, PopoverModule, WorkOrderPanelComponent],
  templateUrl: './work-order-timeline.component.html',
  styleUrl: './work-order-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkOrderTimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timelineHorizontalScroll', { static: true }) timelineScrollRef!: ElementRef<HTMLDivElement>;
  @ViewChild('headerTrackContent', { static: true }) headerTrackContentRef!: ElementRef<HTMLDivElement>;
  @ViewChild('monthOrderPopover') monthOrderPopoverRef?: Popover;
  private readonly store = inject(WorkOrderStoreService);
  private readonly ngZone = inject(NgZone);
  private detachHorizontalScrollSync: (() => void) | null = null;
  private timelineResizeObserver: ResizeObserver | null = null;
  private readonly timelineViewportWidth = signal(0);

  readonly timescaleOptions = SCALE_OPTIONS;
  readonly monthOptions = MONTH_OPTIONS;
  readonly yearOptions = this.buildYearOptions();
  readonly timescale = signal<Timescale>('day');
  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth());

  readonly hoveredCenterId = signal<string | null>(null);
  readonly activeMenuOrderId = signal<string | null>(null);
  readonly monthPopoverOrder = signal<WorkOrderDocument | null>(null);

  readonly panelOpen = signal(false);
  readonly panelMode = signal<'create' | 'edit'>('create');
  readonly panelWorkCenterId = signal<string | null>(null);
  readonly panelDefaultStartDate = signal('');
  readonly panelDefaultEndDate = signal('');
  readonly panelOverlapError = signal<string | null>(null);
  readonly editingOrder = signal<WorkOrderDocument | null>(null);

  readonly workCenters = this.store.workCenters;
  readonly workOrdersByCenter = this.store.workOrdersByCenter;

  readonly projection = computed(() => this.buildProjection(this.timescale()));
  readonly columns = computed(() => this.projection().columns);
  readonly timelineWidth = computed(() => this.projection().width);
  private readonly todayDate = startOfDay(new Date());
  readonly isTodayVisible = computed(() => this.selectedYear() === this.todayDate.getFullYear());
  readonly todayX = computed(() => {
    const periodStart =
      this.timescale() === 'day'
        ? startOfDay(this.todayDate)
        : this.timescale() === 'week'
          ? startOfWeek(this.todayDate)
          : startOfMonth(this.todayDate);

    return this.clampPixel(this.dateToPixel(periodStart));
  });
  readonly currentColumnIndex = computed(() => {
    if (!this.isTodayVisible()) {
      return null;
    }

    const projection = this.projection();
    let index = 0;

    if (this.timescale() === 'day') {
      index = diffInDays(this.todayDate, projection.startDate);
    } else if (this.timescale() === 'week') {
      index = Math.floor(diffInDays(startOfWeek(this.todayDate), projection.startDate) / 7);
    } else {
      index = diffInMonths(startOfMonth(this.todayDate), projection.startDate);
    }

    if (index < 0 || index >= this.columns().length) {
      return null;
    }

    return index;
  });

  readonly selectedWorkCenterName = computed(() => {
    const id = this.panelWorkCenterId();
    if (!id) {
      return '';
    }

    return this.workCenters().find((center) => center.docId === id)?.data.name ?? '';
  });

  constructor() {
    effect(() => {
      this.timescale();
      this.selectedYear();
      this.selectedMonth();
      queueMicrotask(() => this.centerTimelineOnToday());
    });
  }

  ngAfterViewInit(): void {
    this.bindTimelineResizeSync();
    this.centerTimelineOnToday();
    this.bindHorizontalScrollSync();
  }

  ngOnDestroy(): void {
    this.detachHorizontalScrollSync?.();
    this.timelineResizeObserver?.disconnect();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.work-order-menu')) {
      this.activeMenuOrderId.set(null);
    }
  }

  trackCenter(_index: number, center: WorkCenterDocument): string {
    return center.docId;
  }

  trackOrder(_index: number, order: WorkOrderDocument): string {
    return order.docId;
  }

  isCurrentColumn(columnIndex: number): boolean {
    return this.currentColumnIndex() === columnIndex;
  }

  onSelectTimescale(value: Timescale): void {
    this.timescale.set(value);
  }

  onSelectYear(year: number): void {
    this.selectedYear.set(year);
  }

  onSelectMonth(month: number): void {
    this.selectedMonth.set(month);
  }

  weekdayLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  }

  onTrackClick(event: MouseEvent, centerId: string): void {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-card') || target.closest('.work-order-menu') || target.closest('.order-menu-dropdown')) {
      return;
    }

    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickedDate = this.pixelToDate(x);

    this.panelMode.set('create');
    this.panelWorkCenterId.set(centerId);
    this.panelDefaultStartDate.set(toIsoDate(clickedDate));
    this.panelDefaultEndDate.set(toIsoDate(addDays(clickedDate, 7)));
    this.editingOrder.set(null);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  onHoverCenter(centerId: string | null): void {
    this.hoveredCenterId.set(centerId);
  }

  onToggleOrderMenu(event: MouseEvent, orderId: string): void {
    event.stopPropagation();
    this.activeMenuOrderId.update((current) => (current === orderId ? null : orderId));
  }

  onOrderCardClick(event: MouseEvent, order: WorkOrderDocument): void {
    event.stopPropagation();

    if (this.timescale() !== 'month') {
      return;
    }

    this.activeMenuOrderId.set(null);
    this.monthPopoverOrder.set(order);
    const anchor = event.currentTarget as HTMLElement | null;
    this.monthOrderPopoverRef?.toggle(event, anchor ?? undefined);
  }

  onMonthPopoverHide(): void {
    this.monthPopoverOrder.set(null);
  }

  onMonthPopoverEdit(): void {
    const order = this.monthPopoverOrder();
    if (!order) {
      return;
    }

    this.monthOrderPopoverRef?.hide();
    this.onEditOrder(order);
  }

  onMonthPopoverDelete(): void {
    const order = this.monthPopoverOrder();
    if (!order) {
      return;
    }

    this.monthOrderPopoverRef?.hide();
    this.onDeleteOrder(order.docId);
  }

  onEditOrder(order: WorkOrderDocument): void {
    this.activeMenuOrderId.set(null);
    this.panelMode.set('edit');
    this.panelWorkCenterId.set(order.data.workCenterId);
    this.panelDefaultStartDate.set(order.data.startDate);
    this.panelDefaultEndDate.set(order.data.endDate);
    this.editingOrder.set(order);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  onDeleteOrder(orderId: string): void {
    this.store.deleteWorkOrder(orderId);
    this.activeMenuOrderId.set(null);
  }

  onPanelClose(): void {
    this.panelOpen.set(false);
    this.panelOverlapError.set(null);
  }

  onPanelSubmit(event: WorkOrderPanelSubmitEvent): void {
    const centerId = this.panelWorkCenterId();
    if (!centerId) {
      return;
    }

    const candidate: WorkOrderData = {
      ...event.payload,
      workCenterId: centerId
    };

    if (this.store.hasOverlap(candidate, event.existingOrderId)) {
      this.panelOverlapError.set('This work order overlaps an existing item on the same work center.');
      return;
    }

    if (this.panelMode() === 'edit' && event.existingOrderId) {
      this.store.updateWorkOrder(event.existingOrderId, candidate);
    } else {
      this.store.createWorkOrder(candidate);
    }

    this.panelOpen.set(false);
    this.panelOverlapError.set(null);
  }

  getOrdersForCenter(centerId: string): WorkOrderDocument[] {
    return this.workOrdersByCenter().get(centerId) ?? [];
  }

  isOrderVisible(order: WorkOrderDocument): boolean {
    const { start: rangeStart, end: rangeEnd } = this.getVisibleRange();
    const orderStart = fromIsoDate(order.data.startDate);
    const orderEnd = fromIsoDate(order.data.endDate);

    return orderEnd >= rangeStart && orderStart <= rangeEnd;
  }

  orderStyle(order: WorkOrderDocument): Record<string, string> {
    const { start: rangeStart, end: rangeEnd } = this.getVisibleRange();
    const orderStart = fromIsoDate(order.data.startDate);
    const orderEnd = fromIsoDate(order.data.endDate);

    const clippedStart = orderStart < rangeStart ? rangeStart : orderStart;
    const clippedEnd = orderEnd > rangeEnd ? rangeEnd : orderEnd;

    const start = clippedStart;
    const end = addDays(clippedEnd, 1);

    let left = this.clampPixel(this.dateToPixel(start));
    const right = this.clampPixel(this.dateToPixel(end));
    const minWidth = this.timescale() === 'month' ? 36 : 1;
    const width = Math.max(minWidth, right - left);
    const maxLeft = Math.max(0, this.timelineWidth() - width);
    left = Math.min(left, maxLeft);

    return {
      left: `${left}px`,
      width: `${width}px`
    };
  }

  statusLabel(status: WorkOrderStatus): string {
    return STATUS_LABELS[status];
  }

  statusClass(status: WorkOrderStatus): string {
    return STATUS_CLASS[status];
  }

  private buildProjection(scale: Timescale): TimelineProjection {
    const yearStart = new Date(this.selectedYear(), 0, 1);
    const yearEnd = new Date(this.selectedYear(), 11, 31);

    if (scale === 'day') {
      const columnWidth = 96;
      const startDate = yearStart;
      const endDate = yearEnd;
      const columns: TimelineColumn[] = [];

      let cursor = startDate;
      let left = 0;
      let index = 0;

      while (cursor <= endDate) {
        columns.push({
          index,
          label: formatDayLabel(cursor),
          startDate: cursor,
          endDate: cursor,
          left,
          width: columnWidth
        });

        cursor = addDays(cursor, 1);
        left += columnWidth;
        index += 1;
      }

      return {
        startDate,
        endDate,
        columns,
        width: columns.length * columnWidth,
        columnWidth
      };
    }

    if (scale === 'week') {
      const columnWidth = 160;
      const startDate = startOfWeek(yearStart);
      const endDate = endOfWeek(yearEnd);
      const columns: TimelineColumn[] = [];

      let cursor = startDate;
      let left = 0;
      let index = 0;

      while (cursor <= endDate) {
        const currentStart = cursor;
        const currentEnd = endOfWeek(cursor);

        columns.push({
          index,
          label: `${formatWeekLabel(currentStart)} - ${formatWeekLabel(currentEnd)}`,
          startDate: currentStart,
          endDate: currentEnd,
          left,
          width: columnWidth
        });

        cursor = addDays(cursor, 7);
        left += columnWidth;
        index += 1;
      }

      return {
        startDate,
        endDate,
        columns,
        width: columns.length * columnWidth,
        columnWidth
      };
    }

    const baseColumnWidth = 171;
    const viewportWidth = this.timelineViewportWidth();
    const columnWidth = viewportWidth > 0 ? viewportWidth / 12 : baseColumnWidth;
    const startDate = startOfMonth(yearStart);
    const endDate = endOfMonth(yearEnd);
    const columns: TimelineColumn[] = [];

    let cursor = startDate;
    let left = 0;
    let index = 0;

    while (cursor <= endDate) {
      const currentStart = startOfMonth(cursor);
      const currentEnd = endOfMonth(cursor);

      columns.push({
        index,
        label: formatMonthLabel(currentStart),
        startDate: currentStart,
        endDate: currentEnd,
        left,
        width: columnWidth
      });

      cursor = startOfMonth(addMonths(cursor, 1));
      left += columnWidth;
      index += 1;
    }

    return {
      startDate,
      endDate,
      columns,
      width: columns.length * columnWidth,
      columnWidth
    };
  }

  private dateToPixel(date: Date): number {
    const projection = this.projection();
    const normalizedDate = clampDate(startOfDay(date), projection.startDate, addDays(projection.endDate, 1));

    if (this.timescale() === 'day') {
      return diffInDays(normalizedDate, projection.startDate) * projection.columnWidth;
    }

    if (this.timescale() === 'week') {
      return (diffInDays(normalizedDate, projection.startDate) / 7) * projection.columnWidth;
    }

    const monthStart = startOfMonth(normalizedDate);
    const monthIndex = diffInMonths(monthStart, projection.startDate);
    const dayOffset = normalizedDate.getDate() - 1;
    const monthDays = daysInMonth(normalizedDate);

    return monthIndex * projection.columnWidth + (dayOffset / monthDays) * projection.columnWidth;
  }

  private pixelToDate(pixel: number): Date {
    const projection = this.projection();
    const safePixel = Math.min(Math.max(pixel, 0), Math.max(0, this.timelineWidth() - 1));

    if (this.timescale() === 'day') {
      const offsetDays = Math.floor(safePixel / projection.columnWidth);
      return addDays(projection.startDate, offsetDays);
    }

    if (this.timescale() === 'week') {
      const weekFraction = safePixel / projection.columnWidth;
      const offsetDays = Math.floor(weekFraction * 7);
      return addDays(projection.startDate, offsetDays);
    }

    const monthIndex = Math.floor(safePixel / projection.columnWidth);
    const monthStart = addMonths(projection.startDate, monthIndex);
    const ratioInMonth = (safePixel - monthIndex * projection.columnWidth) / projection.columnWidth;
    const dayIndex = Math.min(daysInMonth(monthStart) - 1, Math.floor(ratioInMonth * daysInMonth(monthStart)));

    return addDays(monthStart, dayIndex);
  }

  private clampPixel(value: number): number {
    return Math.min(Math.max(value, 0), this.timelineWidth());
  }

  private getVisibleRange(): { start: Date; end: Date } {
    const projection = this.projection();
    const yearStart = new Date(this.selectedYear(), 0, 1);
    const yearEnd = new Date(this.selectedYear(), 11, 31);

    const start = projection.startDate > yearStart ? projection.startDate : yearStart;
    const end = projection.endDate < yearEnd ? projection.endDate : yearEnd;

    return { start, end };
  }

  private centerTimelineOnToday(): void {
    const container = this.timelineScrollRef?.nativeElement;
    if (!container) {
      return;
    }

    const anchorDate = this.getAnchorDate();
    const focusDate = this.timescale() === 'month' ? startOfMonth(anchorDate) : startOfWeek(anchorDate);
    const target = this.clampPixel(this.dateToPixel(focusDate)) - container.clientWidth / 2;
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const scrollLeft = Math.min(Math.max(0, target), maxScrollLeft);
    container.scrollLeft = scrollLeft;
    this.syncHeaderScroll(container.scrollLeft);
  }

  private getAnchorDate(): Date {
    const today = startOfDay(new Date());
    if (this.selectedYear() === today.getFullYear() && this.selectedMonth() === today.getMonth()) {
      return today;
    }
    return new Date(this.selectedYear(), this.selectedMonth(), 1);
  }

  private buildYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_unused, index) => currentYear - 5 + index);
  }

  private bindTimelineResizeSync(): void {
    const container = this.timelineScrollRef?.nativeElement;
    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateViewportWidth = () => {
      this.timelineViewportWidth.set(container.clientWidth);
      this.syncHeaderScroll(container.scrollLeft);
    };

    updateViewportWidth();

    this.timelineResizeObserver = new ResizeObserver(() => updateViewportWidth());
    this.timelineResizeObserver.observe(container);
  }

  private bindHorizontalScrollSync(): void {
    const container = this.timelineScrollRef?.nativeElement;
    if (!container) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      let rafId = 0;
      const onScroll = () => {
        if (rafId) {
          return;
        }

        rafId = requestAnimationFrame(() => {
          rafId = 0;
          this.syncHeaderScroll(container.scrollLeft);
        });
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      this.detachHorizontalScrollSync = () => {
        container.removeEventListener('scroll', onScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    });
  }

  private syncHeaderScroll(scrollLeft: number): void {
    const headerContent = this.headerTrackContentRef?.nativeElement;
    if (!headerContent) {
      return;
    }

    headerContent.style.transform = `translate3d(${-scrollLeft}px, 0, 0)`;
  }
}
