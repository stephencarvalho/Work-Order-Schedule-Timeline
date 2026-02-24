import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import confetti from 'canvas-confetti';

import { WorkOrderPanelComponent, WorkOrderPanelSubmitEvent } from '../work-order-panel/work-order-panel.component';
import { Timescale, WorkCenterDocument, WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../models';
import { WorkOrderStoreService } from '../../services/work-order-store.service';
import { TIMELINE_MONTH_OPTIONS, WORK_ORDER_STATUS_LABELS } from '../../work-order.constants';
import { formatDateLong, fromIsoDate, startOfDay, startOfMonth, startOfWeek, toIsoDate } from '../../utils/date-utils';
import { PopoverPlacement, createPopoverClickAnchor, resolvePopoverPlacement } from './work-order-timeline.popover';
import {
  CARD_CONTENT_GAP,
  CARD_HORIZONTAL_PADDING,
  HoverSlot,
  MIN_NAME_WIDTH_WITH_STATUS,
  PushNotification,
  SCALE_OPTIONS,
  STATUS_CLASS,
  STATUS_PILL_MIN_WIDTH,
  WorkCenterSortOrder
} from './work-order-timeline.types';
import {
  buildTimelineProjection,
  clampPixel,
  computeHoverSlot,
  dateToPixel,
  getCurrentColumnIndex,
  getOrderPlacement,
  getVisibleRange
} from './work-order-timeline.utils';

interface PendingPopoverOpenRequest {
  order: WorkOrderDocument;
  popover: NgbPopover;
  clickX: number;
  clickY: number;
}

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

  private readonly store = inject(WorkOrderStoreService);

  private timelineResizeObserver: ResizeObserver | null = null;
  private hoverClearTimeoutId: number | null = null;
  private orderHoverTooltipTimeoutId: number | null = null;
  private pendingHoveredOrderId: string | null = null;
  private popoverClickAnchorEl: HTMLElement | null = null;
  private activeOrderPopover: NgbPopover | null = null;
  private pendingPopoverOpenRequest: PendingPopoverOpenRequest | null = null;
  private readonly notificationTimeoutIds = new Map<number, number>();
  private fireworksIntervalId: number | null = null;
  private nextTimelineScrollAlignment: 'start' | 'center' = 'start';
  private timelineScrollRequestId = 0;

  private readonly notificationDurationMs = 5000;
  private readonly orderHoverTooltipDelayMs = 1000;
  private readonly timelineViewportWidth = signal(0);
  private readonly weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  private readonly todayTooltipFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  private readonly todayDate = startOfDay(new Date());

  readonly timescaleOptions = SCALE_OPTIONS;
  readonly monthOptions = TIMELINE_MONTH_OPTIONS;
  readonly yearOptions = this.buildYearOptions();
  readonly timescale = signal<Timescale>('day');
  readonly selectedYear = signal(new Date().getFullYear());
  readonly selectedMonth = signal(new Date().getMonth());

  readonly hoveredCenterId = signal<string | null>(null);
  readonly hoveredSlot = signal<HoverSlot | null>(null);
  readonly hoveredOrderId = signal<string | null>(null);
  readonly isTodayButtonTooltipVisible = signal(false);
  readonly activePopoverOrder = signal<WorkOrderDocument | null>(null);
  readonly orderPopoverPlacement = signal<PopoverPlacement>('top');
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

  readonly displayedWorkCenters = computed(() => this.getDisplayedWorkCenters(this.workCenters(), this.workCenterSortOrder()));

  readonly projection = computed(() =>
    buildTimelineProjection({
      scale: this.timescale(),
      year: this.selectedYear(),
      viewportWidth: this.timelineViewportWidth()
    })
  );

  readonly columns = computed(() => this.projection().columns);
  readonly timelineWidth = computed(() => this.projection().width);
  readonly isTodayVisible = computed(() => this.selectedYear() === this.todayDate.getFullYear());
  readonly todayButtonTooltip = computed(() => `Go to today ${this.todayTooltipFormatter.format(this.todayDate)}`);

  readonly todayX = computed(() => {
    const periodStart =
      this.timescale() === 'day'
        ? startOfDay(this.todayDate)
        : this.timescale() === 'week'
          ? startOfWeek(this.todayDate)
          : startOfMonth(this.todayDate);

    return clampPixel(dateToPixel(periodStart, this.projection(), this.timescale()), this.timelineWidth());
  });

  readonly currentColumnIndex = computed(() =>
    getCurrentColumnIndex({
      isTodayVisible: this.isTodayVisible(),
      timescale: this.timescale(),
      todayDate: this.todayDate,
      projection: this.projection()
    })
  );

  readonly selectedWorkCenterName = computed(() => {
    const id = this.panelWorkCenterId();
    return id ? this.resolveWorkCenterName(id) : '';
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
      const requestId = ++this.timelineScrollRequestId;
      queueMicrotask(() => {
        if (requestId !== this.timelineScrollRequestId) {
          return;
        }

        const alignment = this.nextTimelineScrollAlignment;
        this.nextTimelineScrollAlignment = 'start';

        if (alignment === 'center') {
          this.scrollTimelineToDate(this.todayDate, 'center');
          return;
        }

        this.scrollTimelineToSelectionStart();
      });
    });
  }

  ngAfterViewInit(): void {
    this.bindTimelineResizeSync();
    this.timelineScrollRequestId++;
    this.goToToday();
  }

  ngOnDestroy(): void {
    this.timelineResizeObserver?.disconnect();

    if (this.hoverClearTimeoutId !== null) {
      window.clearTimeout(this.hoverClearTimeoutId);
      this.hoverClearTimeoutId = null;
    }

    if (this.orderHoverTooltipTimeoutId !== null) {
      window.clearTimeout(this.orderHoverTooltipTimeoutId);
      this.orderHoverTooltipTimeoutId = null;
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

    this.openCreatePanel(centerId, slot.startDate, slot.endDate);
  }

  onCreateButtonClick(): void {
    this.openCreatePanel(null, null, null);
  }

  goToToday(): void {
    const yearChanged = this.selectedYear() !== this.todayDate.getFullYear();
    const monthChanged = this.selectedMonth() !== this.todayDate.getMonth();

    this.nextTimelineScrollAlignment = 'center';
    this.selectedYear.set(this.todayDate.getFullYear());
    this.selectedMonth.set(this.todayDate.getMonth());

    if (!yearChanged && !monthChanged) {
      this.scrollTimelineToDate(this.todayDate, 'center');
      this.nextTimelineScrollAlignment = 'start';
    }
  }

  onTodayButtonTooltipVisibleChange(isVisible: boolean): void {
    this.isTodayButtonTooltipVisible.set(isVisible);
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
    this.onTrackHover(event, centerId);
  }

  onTrackLeave(): void {
    this.onHoverCenter(null);
    this.hoveredSlot.set(null);
    this.pendingHoveredOrderId = null;
    if (this.orderHoverTooltipTimeoutId !== null) {
      window.clearTimeout(this.orderHoverTooltipTimeoutId);
      this.orderHoverTooltipTimeoutId = null;
    }
    this.hoveredOrderId.set(null);
  }

  onOrderBarEnter(order: WorkOrderDocument): void {
    if (this.activePopoverOrder()) {
      this.pendingHoveredOrderId = null;
      if (this.orderHoverTooltipTimeoutId !== null) {
        window.clearTimeout(this.orderHoverTooltipTimeoutId);
        this.orderHoverTooltipTimeoutId = null;
      }
      this.hoveredOrderId.set(null);
      return;
    }

    this.pendingHoveredOrderId = order.docId;
    if (this.orderHoverTooltipTimeoutId !== null) {
      window.clearTimeout(this.orderHoverTooltipTimeoutId);
      this.orderHoverTooltipTimeoutId = null;
    }

    this.orderHoverTooltipTimeoutId = window.setTimeout(() => {
      this.orderHoverTooltipTimeoutId = null;
      if (this.pendingHoveredOrderId === order.docId) {
        this.hoveredOrderId.set(order.docId);
      }
    }, this.orderHoverTooltipDelayMs);
  }

  onOrderBarLeave(): void {
    this.pendingHoveredOrderId = null;
    if (this.orderHoverTooltipTimeoutId !== null) {
      window.clearTimeout(this.orderHoverTooltipTimeoutId);
      this.orderHoverTooltipTimeoutId = null;
    }
    this.hoveredOrderId.set(null);
  }

  onOrderCardClick(event: MouseEvent, order: WorkOrderDocument, popover: NgbPopover): void {
    event.stopPropagation();

    if (this.activeOrderPopover && this.activeOrderPopover !== popover) {
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
    this.pendingHoveredOrderId = null;
    if (this.orderHoverTooltipTimeoutId !== null) {
      window.clearTimeout(this.orderHoverTooltipTimeoutId);
      this.orderHoverTooltipTimeoutId = null;
    }
    this.hoveredOrderId.set(null);
  }

  onOrderPopoverHidden(popover: NgbPopover): void {
    popover.positionTarget = undefined;

    if (this.activeOrderPopover === popover) {
      this.activeOrderPopover = null;
    }

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
    this.closePanel();
  }

  onPanelSubmit(event: WorkOrderPanelSubmitEvent): void {
    if (!event.payload.workCenterId) {
      return;
    }

    const candidate: WorkOrderData = this.normalizeCandidateToTimelineYear(event.payload);
    const editingOrderId = event.existingOrderId ?? (this.panelMode() === 'edit' ? this.editingOrder()?.docId : undefined);

    const conflictingOrder = this.store.findOverlap(candidate, editingOrderId);
    if (conflictingOrder) {
      this.panelOverlapError.set(
        `This work order overlaps with "${conflictingOrder.data.name}" (${formatDateLong(fromIsoDate(conflictingOrder.data.startDate))} to ${formatDateLong(fromIsoDate(conflictingOrder.data.endDate))}) in the selected work center.`
      );
      this.pushNotification(
        'Schedule Overlap',
        `The selected dates overlap with "${conflictingOrder.data.name}" in ${this.resolveWorkCenterName(candidate.workCenterId)}.`,
        'warning'
      );
      return;
    }

    const isUpdate = this.panelMode() === 'edit' && !!editingOrderId;
    if (isUpdate && editingOrderId) {
      this.store.updateWorkOrder(editingOrderId, candidate);
    } else {
      this.store.createWorkOrder(candidate);
    }

    this.closePanel();

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
    const range = this.getVisibleRange();
    const orderStart = fromIsoDate(order.data.startDate);
    const orderEnd = fromIsoDate(order.data.endDate);

    return orderEnd >= range.start && orderStart <= range.end;
  }

  orderStyle(order: WorkOrderDocument): Record<string, string> {
    const placement = getOrderPlacement({
      order,
      projection: this.projection(),
      timelineWidth: this.timelineWidth(),
      visibleRange: this.getVisibleRange(),
      timescale: this.timescale()
    });

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
    const placement = getOrderPlacement({
      order,
      projection: this.projection(),
      timelineWidth: this.timelineWidth(),
      visibleRange: this.getVisibleRange(),
      timescale: this.timescale()
    });

    const requiredWidth =
      STATUS_PILL_MIN_WIDTH[order.data.status] + CARD_HORIZONTAL_PADDING + CARD_CONTENT_GAP + MIN_NAME_WIDTH_WITH_STATUS;

    return placement.width >= requiredWidth;
  }

  orderDateLabel(value: string): string {
    return formatDateLong(fromIsoDate(value));
  }

  hoveredSlotForCenter(centerId: string): HoverSlot | null {
    const slot = this.hoveredSlot();
    return slot && slot.centerId === centerId ? slot : null;
  }

  onNotificationClosed(id: number): void {
    this.removeNotification(id);
  }

  private computeHoverSlot(centerId: string, x: number): HoverSlot | null {
    return computeHoverSlot({
      centerId,
      x,
      columns: this.columns(),
      timelineWidth: this.timelineWidth(),
      timescale: this.timescale(),
      orders: this.getOrdersForCenter(centerId)
    });
  }

  private openCreatePanel(centerId: string | null, start: Date | null, end: Date | null): void {
    this.panelMode.set('create');
    this.panelWorkCenterId.set(centerId);
    this.panelDefaultStartDate.set(start ? toIsoDate(start) : '');
    this.panelDefaultEndDate.set(end ? toIsoDate(end) : '');
    this.editingOrder.set(null);
    this.panelOverlapError.set(null);
    this.panelOpen.set(true);
  }

  private openOrderPopover(order: WorkOrderDocument, popover: NgbPopover, clickX: number, clickY: number): void {
    this.activePopoverOrder.set(order);
    this.orderPopoverPlacement.set(resolvePopoverPlacement(clickX, clickY));
    this.popoverClickAnchorEl = createPopoverClickAnchor(clickX, clickY, this.popoverClickAnchorEl);
    popover.positionTarget = this.popoverClickAnchorEl;

    window.setTimeout(() => {
      popover.open();
      this.activeOrderPopover = popover;
    }, 0);
  }

  private destroyPopoverClickAnchor(): void {
    this.popoverClickAnchorEl?.remove();
    this.popoverClickAnchorEl = null;
  }

  private scrollTimelineToSelectionStart(): void {
    const anchorDate = new Date(this.selectedYear(), this.selectedMonth(), 1);
    const focusDate = this.timescale() === 'month' ? startOfMonth(anchorDate) : startOfDay(anchorDate);
    this.scrollTimelineToDate(focusDate, 'start');
  }

  private scrollTimelineToDate(date: Date, align: 'start' | 'center'): void {
    const container = this.timelineScrollRef?.nativeElement;
    if (!container) {
      return;
    }

    const target = clampPixel(dateToPixel(date, this.projection(), this.timescale()), this.timelineWidth());
    const rawScrollLeft = align === 'center' ? target - container.clientWidth / 2 : target;
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);

    container.scrollLeft = Math.min(Math.max(0, rawScrollLeft), maxScrollLeft);
  }

  private normalizeCandidateToTimelineYear(payload: WorkOrderData): WorkOrderData {
    const selectedTimelineYear = this.selectedYear();
    const start = fromIsoDate(payload.startDate);
    const end = fromIsoDate(payload.endDate);

    if (start.getFullYear() === selectedTimelineYear) {
      return payload;
    }

    const adjustedStart = new Date(selectedTimelineYear, start.getMonth(), start.getDate());
    if (adjustedStart > end) {
      return payload;
    }

    return {
      ...payload,
      startDate: toIsoDate(adjustedStart)
    };
  }

  private closePanel(): void {
    this.panelOpen.set(false);
    this.panelOverlapError.set(null);
    this.editingOrder.set(null);
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
    };

    updateViewportWidth();
    this.timelineResizeObserver = new ResizeObserver(updateViewportWidth);
    this.timelineResizeObserver.observe(container);
  }

  private getVisibleRange(): { start: Date; end: Date } {
    return getVisibleRange(this.selectedYear(), this.projection());
  }

  private getDisplayedWorkCenters(
    centers: WorkCenterDocument[],
    sortOrder: WorkCenterSortOrder
  ): WorkCenterDocument[] {
    if (sortOrder === 'default') {
      return centers;
    }

    const sorted = [...centers].sort((a, b) =>
      a.data.name.localeCompare(b.data.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    return sortOrder === 'asc' ? sorted : sorted.reverse();
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

  private removeNotification(id: number): void {
    const timeoutId = this.notificationTimeoutIds.get(id);
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      this.notificationTimeoutIds.delete(id);
    }

    this.notifications.update((current) => current.filter((item) => item.id !== id));
  }

  private triggerFireworks(): void {
    /* istanbul ignore next */
    if (typeof window === 'undefined') {
      return;
    }

    if (this.fireworksIntervalId !== null) {
      window.clearInterval(this.fireworksIntervalId);
      this.fireworksIntervalId = null;
    }

    const duration = 5_000;
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
