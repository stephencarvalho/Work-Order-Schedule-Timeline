import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import confetti from 'canvas-confetti';

import { WorkOrderPanelComponent, WorkOrderPanelSubmitEvent } from '../work-order-panel/work-order-panel.component';
import { Timescale, TimelineColumn, WorkCenterDocument, WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../models';
import { WorkOrderStoreService } from '../../services/work-order-store.service';
import {
  TIMELINE_MONTH_OPTIONS,
  WORK_ORDER_STATUS_LABELS
} from '../../work-order.constants';
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
  formatDateLong,
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

interface OrderPlacement {
  left: number;
  width: number;
}

interface HoverSlot {
  centerId: string;
  left: number;
  width: number;
  startDate: Date;
  endDate: Date;
}

interface PendingPopoverOpenRequest {
  order: WorkOrderDocument;
  popover: NgbPopover;
  clickX: number;
  clickY: number;
}

interface PushNotification {
  id: number;
  title: string;
  message: string;
  tone: 'default' | 'complete' | 'warning';
}

type WorkCenterSortOrder = 'default' | 'asc' | 'desc';

const SCALE_OPTIONS: Array<{ value: Timescale; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
];

const STATUS_CLASS: Record<WorkOrderStatus, string> = {
  open: 'status-open',
  'in-progress': 'status-in-progress',
  complete: 'status-complete',
  blocked: 'status-blocked'
};

const STATUS_PILL_MIN_WIDTH: Record<WorkOrderStatus, number> = {
  open: 51,
  'in-progress': 87,
  complete: 63,
  blocked: 67
};
const CARD_HORIZONTAL_PADDING = 20;
const CARD_CONTENT_GAP = 12;
const MIN_NAME_WIDTH_WITH_STATUS = 56;

@Component({
  selector: 'app-work-order-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbPopover, NgbAlert, WorkOrderPanelComponent],
  templateUrl: './work-order-timeline.component.html',
  styleUrl: './work-order-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkOrderTimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timelineHorizontalScroll', { static: true }) timelineScrollRef!: ElementRef<HTMLDivElement>;
  @ViewChild('headerTrackContent', { static: true }) headerTrackContentRef!: ElementRef<HTMLDivElement>;
  private readonly store = inject(WorkOrderStoreService);
  private readonly ngZone = inject(NgZone);
  private detachHorizontalScrollSync: (() => void) | null = null;
  private timelineResizeObserver: ResizeObserver | null = null;
  private hoverClearTimeoutId: number | null = null;
  private popoverClickAnchorEl: HTMLElement | null = null;
  private activeOrderPopover: NgbPopover | null = null;
  private pendingPopoverOpenRequest: PendingPopoverOpenRequest | null = null;
  private readonly notificationTimeoutIds = new Map<number, number>();
  private fireworksIntervalId: number | null = null;
  private readonly notificationDurationMs = 5000;
  private readonly timelineViewportWidth = signal(0);
  private readonly weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

  readonly timescaleOptions = SCALE_OPTIONS;
  readonly monthOptions = TIMELINE_MONTH_OPTIONS;
  readonly yearOptions = this.buildYearOptions();
  readonly timescale = signal<Timescale>('day');
  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth());

  readonly hoveredCenterId = signal<string | null>(null);
  readonly hoveredSlot = signal<HoverSlot | null>(null);
  readonly activePopoverOrder = signal<WorkOrderDocument | null>(null);
  readonly orderPopoverPlacement = signal<'top' | 'bottom' | 'start' | 'end'>('top');
  readonly notifications = signal<PushNotification[]>([]);

  readonly panelOpen = signal(false);
  readonly panelMode = signal<'create' | 'edit'>('create');
  readonly panelWorkCenterId = signal<string | null>(null);
  readonly panelDefaultStartDate = signal('');
  readonly panelDefaultEndDate = signal('');
  readonly panelOverlapError = signal<string | null>(null);
  readonly editingOrder = signal<WorkOrderDocument | null>(null);
  readonly workCenterSortOrder = signal<WorkCenterSortOrder>('default');

  readonly workCenters = this.store.workCenters;
  readonly workOrdersByCenter = this.store.workOrdersByCenter;
  readonly displayedWorkCenters = computed(() => {
    const centers = this.workCenters();
    const sortOrder = this.workCenterSortOrder();

    if (sortOrder === 'default') {
      return centers;
    }

    const sorted = [...centers].sort((a, b) =>
      a.data.name.localeCompare(b.data.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    return sortOrder === 'asc' ? sorted : sorted.reverse();
  });

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

  readonly workCenterSortLabel = computed(() => {
    const sortOrder = this.workCenterSortOrder();
    if (sortOrder === 'asc') {
      return 'Work Center (A-Z)';
    }
    if (sortOrder === 'desc') {
      return 'Work Center (Z-A)';
    }
    return 'Work Center';
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
    queueMicrotask(() => {
      const container = this.timelineScrollRef?.nativeElement;
      if (container) {
        this.syncHeaderScroll(container.scrollLeft);
      }
    });
  }

  ngOnDestroy(): void {
    this.detachHorizontalScrollSync?.();
    this.timelineResizeObserver?.disconnect();
    if (this.hoverClearTimeoutId !== null) {
      window.clearTimeout(this.hoverClearTimeoutId);
      this.hoverClearTimeoutId = null;
    }
    this.activeOrderPopover?.close();
    this.activeOrderPopover = null;
    this.destroyPopoverClickAnchor();
    for (const timeoutId of this.notificationTimeoutIds.values()) {
      window.clearTimeout(timeoutId);
    }
    this.notificationTimeoutIds.clear();
    if (this.fireworksIntervalId !== null) {
      window.clearInterval(this.fireworksIntervalId);
      this.fireworksIntervalId = null;
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

  onToggleWorkCenterSort(): void {
    const nextSortOrder: Record<WorkCenterSortOrder, WorkCenterSortOrder> = {
      default: 'asc',
      asc: 'desc',
      desc: 'default'
    };
    this.workCenterSortOrder.set(nextSortOrder[this.workCenterSortOrder()]);
  }

  weekdayLabel(date: Date): string {
    return this.weekdayFormatter.format(date);
  }

  onTrackClick(event: MouseEvent, centerId: string): void {
    const target = event.target as HTMLElement;
    if (target.closest('.work-order-card')) {
      return;
    }

    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const slot = this.computeHoverSlot(centerId, x);
    if (!slot) {
      this.pushNotification(
        'Busy Slot',
        `That time range in ${this.resolveWorkCenterName(centerId)} is already occupied. Pick an empty slot.`,
        'warning'
      );
      return;
    }

    this.panelMode.set('create');
    this.panelWorkCenterId.set(centerId);
    this.panelDefaultStartDate.set(toIsoDate(slot.startDate));
    this.panelDefaultEndDate.set(toIsoDate(slot.endDate));
    this.editingOrder.set(null);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  onCreateButtonClick(): void {
    // Open panel from global Create action without a preselected center.
    this.panelMode.set('create');
    this.panelWorkCenterId.set(null);
    this.panelDefaultStartDate.set('');
    this.panelDefaultEndDate.set('');
    this.editingOrder.set(null);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  onHoverCenter(centerId: string | null): void {
    if (centerId) {
      if (this.hoverClearTimeoutId !== null) {
        window.clearTimeout(this.hoverClearTimeoutId);
        this.hoverClearTimeoutId = null;
      }
      this.hoveredCenterId.set(centerId);
      return;
    }

    if (this.hoverClearTimeoutId !== null) {
      window.clearTimeout(this.hoverClearTimeoutId);
    }

    this.hoverClearTimeoutId = window.setTimeout(() => {
      this.hoveredCenterId.set(null);
      this.hoverClearTimeoutId = null;
    }, 40);
  }

  onTrackHover(event: MouseEvent, centerId: string): void {
    this.onHoverCenter(centerId);

    const container = event.currentTarget as HTMLDivElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.hoveredSlot.set(this.computeHoverSlot(centerId, x));
  }

  onTrackEnter(event: MouseEvent, centerId: string): void {
    // Resolve the hover slot on initial entry so the "Click to add dates" hint
    // appears immediately without requiring an extra mousemove.
    this.onTrackHover(event, centerId);
  }

  onTrackLeave(): void {
    this.onHoverCenter(null);
    this.hoveredSlot.set(null);
  }

  onOrderCardClick(event: MouseEvent, order: WorkOrderDocument, popover: NgbPopover): void {
    event.stopPropagation();

    if (this.activeOrderPopover && this.activeOrderPopover !== popover) {
      // Queue the next popover request so switching work orders happens in one click.
      this.pendingPopoverOpenRequest = {
        order,
        popover,
        clickX: event.clientX,
        clickY: event.clientY
      };
      this.activeOrderPopover.close();
      return;
    }

    const samePopoverOpen = this.activeOrderPopover === popover && popover.isOpen();
    if (samePopoverOpen) {
      popover.close();
      this.activeOrderPopover = null;
      this.activePopoverOrder.set(null);
      return;
    }

    this.openOrderPopover(order, popover, event.clientX, event.clientY);
  }

  onOrderPopoverShown(popover: NgbPopover): void {
    this.activeOrderPopover = popover;
  }

  onOrderPopoverHidden(popover: NgbPopover): void {
    // Always detach hidden popover from its anchor before a later reuse.
    popover.positionTarget = undefined;

    if (this.activeOrderPopover === popover) {
      this.activeOrderPopover = null;
    }

    // If a WO was clicked while this popover was closing, open it immediately now.
    if (this.pendingPopoverOpenRequest) {
      const request = this.pendingPopoverOpenRequest;
      this.pendingPopoverOpenRequest = null;
      this.openOrderPopover(request.order, request.popover, request.clickX, request.clickY);
      return;
    }

    this.activePopoverOrder.set(null);
    this.destroyPopoverClickAnchor();
  }

  onOrderPopoverEdit(): void {
    const order = this.activePopoverOrder();
    if (!order) {
      return;
    }

    this.activeOrderPopover?.close();
    this.onEditOrder(order);
  }

  onOrderPopoverDelete(): void {
    const order = this.activePopoverOrder();
    if (!order) {
      return;
    }

    this.activeOrderPopover?.close();
    this.onDeleteOrder(order);
  }

  onEditOrder(order: WorkOrderDocument): void {
    this.panelMode.set('edit');
    this.panelWorkCenterId.set(order.data.workCenterId);
    this.panelDefaultStartDate.set(order.data.startDate);
    this.panelDefaultEndDate.set(order.data.endDate);
    this.editingOrder.set(order);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  onDeleteOrder(order: WorkOrderDocument): void {
    this.store.deleteWorkOrder(order.docId);
    const workCenterName = this.resolveWorkCenterName(order.data.workCenterId);
    this.pushNotification('Deleted', `"${order.data.name}" in ${workCenterName} deleted successfully.`);
  }

  onPanelClose(): void {
    this.panelOpen.set(false);
    this.panelOverlapError.set(null);
  }

  onPanelSubmit(event: WorkOrderPanelSubmitEvent): void {
    // Use selected center from panel form so top-level Create can target any center.
    if (!event.payload.workCenterId) {
      return;
    }

    const candidate: WorkOrderData = event.payload;

    const conflictingOrder = this.store.findOverlap(candidate, event.existingOrderId);
    if (conflictingOrder) {
      this.panelOverlapError.set(
        `This work order conflicts with "${conflictingOrder.data.name}" (${formatDateLong(fromIsoDate(conflictingOrder.data.startDate))} to ${formatDateLong(fromIsoDate(conflictingOrder.data.endDate))}) in the selected work center.`
      );
      this.pushNotification(
        'Schedule Conflict',
        `Dates conflict with "${conflictingOrder.data.name}" in ${this.resolveWorkCenterName(candidate.workCenterId)}.`,
        'warning'
      );
      return;
    }

    const isUpdate = this.panelMode() === 'edit' && !!event.existingOrderId;
    if (isUpdate && event.existingOrderId) {
      this.store.updateWorkOrder(event.existingOrderId, candidate);
    } else {
      this.store.createWorkOrder(candidate);
    }

    this.panelOpen.set(false);
    this.panelOverlapError.set(null);

    const workCenterName = this.resolveWorkCenterName(candidate.workCenterId);
    if (candidate.status === 'complete') {
      const verb = isUpdate ? 'updated' : 'created';
      this.pushNotification(
        'All Done',
        `"${candidate.name}" in ${workCenterName} was ${verb} as complete. Good work, you crushed it.`,
        'complete'
      );
      this.triggerFireworks();
      return;
    }

    if (isUpdate) {
      this.pushNotification('Updated', `"${candidate.name}" in ${workCenterName} updated successfully.`);
      return;
    }

    this.pushNotification('Created', `"${candidate.name}" created in ${workCenterName} successfully.`);
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
    const placement = this.getOrderPlacement(order);

    return {
      left: `${placement.left}px`,
      width: `${placement.width}px`
    };
  }

  statusLabel(status: WorkOrderStatus): string {
    return WORK_ORDER_STATUS_LABELS[status];
  }

  statusClass(status: WorkOrderStatus): string {
    return STATUS_CLASS[status];
  }

  shouldShowInlineStatus(order: WorkOrderDocument): boolean {
    const width = this.getOrderPlacement(order).width;
    const requiredWidth = STATUS_PILL_MIN_WIDTH[order.data.status] + CARD_HORIZONTAL_PADDING + CARD_CONTENT_GAP + MIN_NAME_WIDTH_WITH_STATUS;
    return width >= requiredWidth;
  }

  orderDateLabel(value: string): string {
    return formatDateLong(fromIsoDate(value));
  }

  hoveredSlotForCenter(centerId: string): HoverSlot | null {
    const slot = this.hoveredSlot();
    if (!slot || slot.centerId !== centerId) {
      return null;
    }
    return slot;
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

  private getOrderPlacement(order: WorkOrderDocument): OrderPlacement {
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
    let width = Math.max(minWidth, right - left);
    const maxLeft = Math.max(0, this.timelineWidth() - width);
    left = Math.min(left, maxLeft);

    // Keep each card slightly inside its computed bounds so adjacent work orders
    // don't visually touch/overlap on shared grid boundaries.
    const horizontalInset = 2;
    if (width > horizontalInset * 2) {
      left += horizontalInset;
      width -= horizontalInset * 2;
    }

    return { left, width };
  }

  private computeHoverSlot(centerId: string, x: number): HoverSlot | null {
    const columns = this.columns();
    if (!columns.length) {
      return null;
    }

    const column = columns.find((item) => x >= item.left && x < item.left + item.width) ?? columns[columns.length - 1];
    const { start, end } = this.resolveRangeForDate(column.startDate);

    if (this.hasOrderInRange(centerId, start, end)) {
      return null;
    }

    const inset = 5;
    const slotWidth = Math.max(1, column.width - inset * 2);
    const rawLeft = column.left + inset;
    const left = Math.min(Math.max(0, rawLeft), Math.max(0, this.timelineWidth() - slotWidth));

    return {
      centerId,
      left,
      width: slotWidth,
      startDate: start,
      endDate: end
    };
  }

  private hasOrderInRange(centerId: string, start: Date, end: Date): boolean {
    const orders = this.getOrdersForCenter(centerId);
    return orders.some((order) => {
      const orderStart = fromIsoDate(order.data.startDate);
      const orderEnd = fromIsoDate(order.data.endDate);
      return orderEnd >= start && orderStart <= end;
    });
  }

  private resolveRangeForDate(date: Date): { start: Date; end: Date } {
    if (this.timescale() === 'day') {
      const day = startOfDay(date);
      return { start: day, end: day };
    }

    if (this.timescale() === 'week') {
      return { start: startOfWeek(date), end: endOfWeek(date) };
    }

    return { start: startOfMonth(date), end: endOfMonth(date) };
  }

  private openOrderPopover(order: WorkOrderDocument, popover: NgbPopover, clickX: number, clickY: number): void {
    this.activePopoverOrder.set(order);
    this.orderPopoverPlacement.set(this.resolvePopoverPlacement(clickX, clickY));
    popover.positionTarget = this.createPopoverClickAnchor(clickX, clickY);

    // Open in next macrotask so this click is not interpreted as immediate outside-click autoclose.
    window.setTimeout(() => {
      popover.open();
      this.activeOrderPopover = popover;
    }, 0);
  }

  private resolvePopoverPlacement(clickX: number, clickY: number): 'top' | 'bottom' | 'start' | 'end' {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const estimatedPopoverWidth = 320;
    const estimatedPopoverHeight = 280;

    const roomRight = viewportWidth - clickX;
    const roomLeft = clickX;
    const roomBottom = viewportHeight - clickY;
    const roomTop = clickY;

    if (roomRight < estimatedPopoverWidth && roomLeft >= estimatedPopoverWidth) {
      return 'start';
    }

    if (roomLeft < estimatedPopoverWidth && roomRight >= estimatedPopoverWidth) {
      return 'end';
    }

    if (roomBottom < estimatedPopoverHeight && roomTop >= estimatedPopoverHeight) {
      return 'top';
    }

    if (roomTop < estimatedPopoverHeight && roomBottom >= estimatedPopoverHeight) {
      return 'bottom';
    }

    return roomRight >= roomLeft ? 'end' : 'start';
  }

  private createPopoverClickAnchor(clickX: number, clickY: number): HTMLElement {
    this.destroyPopoverClickAnchor();

    const anchor = document.createElement('span');
    anchor.className = 'work-order-popover-click-anchor';
    anchor.style.position = 'fixed';
    anchor.style.left = `${clickX}px`;
    anchor.style.top = `${clickY}px`;
    anchor.style.width = '1px';
    anchor.style.height = '1px';
    anchor.style.pointerEvents = 'none';
    anchor.style.opacity = '0';
    anchor.style.zIndex = '-1';
    document.body.appendChild(anchor);

    this.popoverClickAnchorEl = anchor;
    return anchor;
  }

  private destroyPopoverClickAnchor(): void {
    this.popoverClickAnchorEl?.remove();
    this.popoverClickAnchorEl = null;
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
      const onScroll = () => {
        this.syncHeaderScroll(container.scrollLeft);
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      this.detachHorizontalScrollSync = () => {
        container.removeEventListener('scroll', onScroll);
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

  private resolveWorkCenterName(centerId: string): string {
    return this.workCenters().find((center) => center.docId === centerId)?.data.name ?? 'selected work center';
  }

  private pushNotification(title: string, message: string, tone: PushNotification['tone'] = 'default'): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    this.notifications.update((current) => [...current, { id, title, message, tone }]);

    const timeoutId = window.setTimeout(() => this.removeNotification(id), this.notificationDurationMs);
    this.notificationTimeoutIds.set(id, timeoutId);
  }

  onNotificationClosed(id: number): void {
    this.removeNotification(id);
  }

  private removeNotification(id: number): void {
    const timeoutId = this.notificationTimeoutIds.get(id);
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      this.notificationTimeoutIds.delete(id);
    }
    this.notifications.update((current) => current.filter((item) => item.id !== id));
  }

  private triggerFireworks(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.fireworksIntervalId !== null) {
      window.clearInterval(this.fireworksIntervalId);
      this.fireworksIntervalId = null;
    }

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    this.fireworksIntervalId = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (this.fireworksIntervalId !== null) {
          window.clearInterval(this.fireworksIntervalId);
          this.fireworksIntervalId = null;
        }
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  private randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
