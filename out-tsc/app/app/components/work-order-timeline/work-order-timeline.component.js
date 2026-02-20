import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';
import { WorkOrderStoreService } from '../../services/work-order-store.service';
import { TIMELINE_MONTH_OPTIONS, WORK_ORDER_STATUS_LABELS } from '../../work-order.constants';
import { addDays, addMonths, clampDate, daysInMonth, diffInDays, diffInMonths, endOfMonth, endOfWeek, formatDayLabel, formatDateLong, formatMonthLabel, formatWeekLabel, fromIsoDate, startOfDay, startOfMonth, startOfWeek, toIsoDate } from '../../utils/date-utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
const _c0 = ["timelineHorizontalScroll"];
const _c1 = ["headerTrackContent"];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.index;
function WorkOrderTimelineComponent_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ngb-alert", 7)(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const notification_r2 = ctx.$implicit;
    i0.ɵɵproperty("dismissible", false)("ngClass", notification_r2.tone === "complete" ? "app-alert app-alert--complete" : "app-alert app-alert--default");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", notification_r2.title, "!");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", notification_r2.message, " ");
} }
function WorkOrderTimelineComponent_Conditional_4_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 39);
} if (rf & 2) {
    const piece_r3 = ctx.$implicit;
    i0.ɵɵstyleProp("left", piece_r3.leftPercent, "%")("width", piece_r3.sizePx, "px")("height", piece_r3.sizePx * 0.58, "px")("animation-delay", piece_r3.delayMs, "ms")("animation-duration", piece_r3.durationMs, "ms")("background", piece_r3.color)("--drift", piece_r3.driftPx + "px")("--rotation", piece_r3.rotationDeg + "deg");
} }
function WorkOrderTimelineComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8);
    i0.ɵɵrepeaterCreate(1, WorkOrderTimelineComponent_Conditional_4_For_2_Template, 1, 16, "span", 38, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r3.confettiPieces());
} }
function WorkOrderTimelineComponent_For_34_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 40)(1, "div", 41);
    i0.ɵɵlistener("mouseenter", function WorkOrderTimelineComponent_For_34_Template_div_mouseenter_1_listener() { const center_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onHoverCenter(center_r6.docId)); })("mouseleave", function WorkOrderTimelineComponent_For_34_Template_div_mouseleave_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onHoverCenter(null)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const center_r6 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("row-hovered", ctx_r3.hoveredCenterId() === center_r6.docId);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", center_r6.data.name, " ");
} }
function WorkOrderTimelineComponent_For_41_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 44);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r7 = i0.ɵɵnextContext().$implicit;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(column_r7.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r3.weekdayLabel(column_r7.startDate));
} }
function WorkOrderTimelineComponent_For_41_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const column_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵtextInterpolate1(" ", column_r7.label, " ");
} }
function WorkOrderTimelineComponent_For_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42);
    i0.ɵɵconditionalCreate(1, WorkOrderTimelineComponent_For_41_Conditional_1_Template, 4, 2)(2, WorkOrderTimelineComponent_For_41_Conditional_2_Template, 1, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r7 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("left", column_r7.left, "px")("width", column_r7.width, "px");
    i0.ɵɵclassProp("current-header-column", ctx_r3.isCurrentColumn(column_r7.index));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.timescale() === "day" ? 1 : 2);
} }
function WorkOrderTimelineComponent_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 45);
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("left", ctx_r3.todayX(), "px");
} }
function WorkOrderTimelineComponent_For_47_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 48);
} if (rf & 2) {
    const column_r10 = ctx.$implicit;
    i0.ɵɵstyleProp("left", column_r10.left, "px")("width", column_r10.width, "px");
} }
function WorkOrderTimelineComponent_For_47_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵtext(1, "Click to add dates");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(2, "div", 50);
} if (rf & 2) {
    const slot_r11 = ctx;
    i0.ɵɵstyleProp("left", slot_r11.left + slot_r11.width / 2, "px");
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("left", slot_r11.left, "px")("width", slot_r11.width, "px");
} }
function WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 54);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const order_r14 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", ctx_r3.statusClass(order_r14.data.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r3.statusLabel(order_r14.data.status));
} }
function WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 52, 4);
    i0.ɵɵlistener("shown", function WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Template_div_shown_0_listener() { i0.ɵɵrestoreView(_r12); const orderPopover_r13 = i0.ɵɵreference(1); const ctx_r3 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r3.onOrderPopoverShown(orderPopover_r13)); })("hidden", function WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Template_div_hidden_0_listener() { i0.ɵɵrestoreView(_r12); const orderPopover_r13 = i0.ɵɵreference(1); const ctx_r3 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r3.onOrderPopoverHidden(orderPopover_r13)); })("click", function WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r12); const orderPopover_r13 = i0.ɵɵreference(1); const order_r14 = i0.ɵɵnextContext().$implicit; const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onOrderCardClick($event, order_r14, orderPopover_r13)); });
    i0.ɵɵelementStart(2, "span", 53);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Conditional_4_Template, 2, 2, "span", 54);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const order_r14 = i0.ɵɵnextContext().$implicit;
    const ctx_r3 = i0.ɵɵnextContext(2);
    const orderPopoverTemplate_r15 = i0.ɵɵreference(49);
    i0.ɵɵproperty("ngClass", ctx_r3.statusClass(order_r14.data.status))("ngStyle", ctx_r3.orderStyle(order_r14))("ngbPopover", orderPopoverTemplate_r15)("placement", ctx_r3.orderPopoverPlacement())("popoverClass", "work-order-popover")("autoClose", "outside")("container", "body")("title", order_r14.data.name);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("order-name--no-status", !ctx_r3.shouldShowInlineStatus(order_r14));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(order_r14.data.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.shouldShowInlineStatus(order_r14) ? 4 : -1);
} }
function WorkOrderTimelineComponent_For_47_For_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, WorkOrderTimelineComponent_For_47_For_6_Conditional_0_Template, 5, 12, "div", 51);
} if (rf & 2) {
    const order_r14 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(ctx_r3.isOrderVisible(order_r14) ? 0 : -1);
} }
function WorkOrderTimelineComponent_For_47_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 40)(1, "div", 46);
    i0.ɵɵlistener("mouseenter", function WorkOrderTimelineComponent_For_47_Template_div_mouseenter_1_listener($event) { const center_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onTrackEnter($event, center_r9.docId)); })("mousemove", function WorkOrderTimelineComponent_For_47_Template_div_mousemove_1_listener($event) { const center_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onTrackHover($event, center_r9.docId)); })("mouseleave", function WorkOrderTimelineComponent_For_47_Template_div_mouseleave_1_listener() { i0.ɵɵrestoreView(_r8); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onTrackLeave()); })("click", function WorkOrderTimelineComponent_For_47_Template_div_click_1_listener($event) { const center_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onTrackClick($event, center_r9.docId)); });
    i0.ɵɵrepeaterCreate(2, WorkOrderTimelineComponent_For_47_For_3_Template, 1, 4, "div", 47, _forTrack1);
    i0.ɵɵconditionalCreate(4, WorkOrderTimelineComponent_For_47_Conditional_4_Template, 3, 6);
    i0.ɵɵrepeaterCreate(5, WorkOrderTimelineComponent_For_47_For_6_Template, 1, 1, null, null, i0.ɵɵcomponentInstance().trackOrder, true);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_18_0;
    const center_r9 = ctx.$implicit;
    const ɵ$index_99_r16 = ctx.$index;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("timeline-row--first", ɵ$index_99_r16 === 0)("row-hovered", ctx_r3.hoveredCenterId() === center_r9.docId);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("width", ctx_r3.timelineWidth(), "px");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r3.columns());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional((tmp_18_0 = ctx_r3.hoveredSlotForCenter(center_r9.docId)) ? 4 : -1, tmp_18_0);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r3.getOrdersForCenter(center_r9.docId));
} }
function WorkOrderTimelineComponent_ng_template_48_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 55)(1, "div", 56);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 57);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 58)(6, "div")(7, "strong");
    i0.ɵɵtext(8, "Start:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div")(11, "strong");
    i0.ɵɵtext(12, "End:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 59)(15, "button", 60);
    i0.ɵɵlistener("click", function WorkOrderTimelineComponent_ng_template_48_Conditional_0_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r17); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onOrderPopoverEdit()); });
    i0.ɵɵtext(16, "Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "button", 61);
    i0.ɵɵlistener("click", function WorkOrderTimelineComponent_ng_template_48_Conditional_0_Template_button_click_17_listener() { i0.ɵɵrestoreView(_r17); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onOrderPopoverDelete()); });
    i0.ɵɵtext(18, "Delete");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const order_r18 = ctx;
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(order_r18.data.name);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r3.statusClass(order_r18.data.status));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r3.statusLabel(order_r18.data.status), " ");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r3.orderDateLabel(order_r18.data.startDate));
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r3.orderDateLabel(order_r18.data.endDate));
} }
function WorkOrderTimelineComponent_ng_template_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, WorkOrderTimelineComponent_ng_template_48_Conditional_0_Template, 19, 5, "div", 55);
} if (rf & 2) {
    let tmp_5_0;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵconditional((tmp_5_0 = ctx_r3.activePopoverOrder()) ? 0 : -1, tmp_5_0);
} }
const SCALE_OPTIONS = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
];
const STATUS_CLASS = {
    open: 'status-open',
    'in-progress': 'status-in-progress',
    complete: 'status-complete',
    blocked: 'status-blocked'
};
const STATUS_PILL_MIN_WIDTH = {
    open: 51,
    'in-progress': 87,
    complete: 63,
    blocked: 67
};
const CARD_HORIZONTAL_PADDING = 20;
const CARD_CONTENT_GAP = 12;
const MIN_NAME_WIDTH_WITH_STATUS = 56;
export class WorkOrderTimelineComponent {
    constructor() {
        this.store = inject(WorkOrderStoreService);
        this.ngZone = inject(NgZone);
        this.detachHorizontalScrollSync = null;
        this.timelineResizeObserver = null;
        this.hoverClearTimeoutId = null;
        this.popoverClickAnchorEl = null;
        this.activeOrderPopover = null;
        this.pendingPopoverOpenRequest = null;
        this.notificationTimeoutIds = new Map();
        this.confettiResetTimeoutId = null;
        this.timelineViewportWidth = signal(0, ...(ngDevMode ? [{ debugName: "timelineViewportWidth" }] : []));
        this.weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
        this.timescaleOptions = SCALE_OPTIONS;
        this.monthOptions = TIMELINE_MONTH_OPTIONS;
        this.yearOptions = this.buildYearOptions();
        this.timescale = signal('day', ...(ngDevMode ? [{ debugName: "timescale" }] : []));
        this.selectedYear = signal(new Date().getFullYear(), ...(ngDevMode ? [{ debugName: "selectedYear" }] : []));
        this.selectedMonth = signal(new Date().getMonth(), ...(ngDevMode ? [{ debugName: "selectedMonth" }] : []));
        this.hoveredCenterId = signal(null, ...(ngDevMode ? [{ debugName: "hoveredCenterId" }] : []));
        this.hoveredSlot = signal(null, ...(ngDevMode ? [{ debugName: "hoveredSlot" }] : []));
        this.activePopoverOrder = signal(null, ...(ngDevMode ? [{ debugName: "activePopoverOrder" }] : []));
        this.orderPopoverPlacement = signal('top', ...(ngDevMode ? [{ debugName: "orderPopoverPlacement" }] : []));
        this.notifications = signal([], ...(ngDevMode ? [{ debugName: "notifications" }] : []));
        this.confettiActive = signal(false, ...(ngDevMode ? [{ debugName: "confettiActive" }] : []));
        this.confettiPieces = signal([], ...(ngDevMode ? [{ debugName: "confettiPieces" }] : []));
        this.panelOpen = signal(false, ...(ngDevMode ? [{ debugName: "panelOpen" }] : []));
        this.panelMode = signal('create', ...(ngDevMode ? [{ debugName: "panelMode" }] : []));
        this.panelWorkCenterId = signal(null, ...(ngDevMode ? [{ debugName: "panelWorkCenterId" }] : []));
        this.panelDefaultStartDate = signal('', ...(ngDevMode ? [{ debugName: "panelDefaultStartDate" }] : []));
        this.panelDefaultEndDate = signal('', ...(ngDevMode ? [{ debugName: "panelDefaultEndDate" }] : []));
        this.panelOverlapError = signal(null, ...(ngDevMode ? [{ debugName: "panelOverlapError" }] : []));
        this.editingOrder = signal(null, ...(ngDevMode ? [{ debugName: "editingOrder" }] : []));
        this.workCenterSortOrder = signal('default', ...(ngDevMode ? [{ debugName: "workCenterSortOrder" }] : []));
        this.workCenters = this.store.workCenters;
        this.workOrdersByCenter = this.store.workOrdersByCenter;
        this.displayedWorkCenters = computed(() => {
            const centers = this.workCenters();
            const sortOrder = this.workCenterSortOrder();
            if (sortOrder === 'default') {
                return centers;
            }
            const sorted = [...centers].sort((a, b) => a.data.name.localeCompare(b.data.name, undefined, { numeric: true, sensitivity: 'base' }));
            return sortOrder === 'asc' ? sorted : sorted.reverse();
        }, ...(ngDevMode ? [{ debugName: "displayedWorkCenters" }] : []));
        this.projection = computed(() => this.buildProjection(this.timescale()), ...(ngDevMode ? [{ debugName: "projection" }] : []));
        this.columns = computed(() => this.projection().columns, ...(ngDevMode ? [{ debugName: "columns" }] : []));
        this.timelineWidth = computed(() => this.projection().width, ...(ngDevMode ? [{ debugName: "timelineWidth" }] : []));
        this.todayDate = startOfDay(new Date());
        this.isTodayVisible = computed(() => this.selectedYear() === this.todayDate.getFullYear(), ...(ngDevMode ? [{ debugName: "isTodayVisible" }] : []));
        this.todayX = computed(() => {
            const periodStart = this.timescale() === 'day'
                ? startOfDay(this.todayDate)
                : this.timescale() === 'week'
                    ? startOfWeek(this.todayDate)
                    : startOfMonth(this.todayDate);
            return this.clampPixel(this.dateToPixel(periodStart));
        }, ...(ngDevMode ? [{ debugName: "todayX" }] : []));
        this.currentColumnIndex = computed(() => {
            if (!this.isTodayVisible()) {
                return null;
            }
            const projection = this.projection();
            let index = 0;
            if (this.timescale() === 'day') {
                index = diffInDays(this.todayDate, projection.startDate);
            }
            else if (this.timescale() === 'week') {
                index = Math.floor(diffInDays(startOfWeek(this.todayDate), projection.startDate) / 7);
            }
            else {
                index = diffInMonths(startOfMonth(this.todayDate), projection.startDate);
            }
            if (index < 0 || index >= this.columns().length) {
                return null;
            }
            return index;
        }, ...(ngDevMode ? [{ debugName: "currentColumnIndex" }] : []));
        this.selectedWorkCenterName = computed(() => {
            const id = this.panelWorkCenterId();
            if (!id) {
                return '';
            }
            return this.workCenters().find((center) => center.docId === id)?.data.name ?? '';
        }, ...(ngDevMode ? [{ debugName: "selectedWorkCenterName" }] : []));
        this.workCenterSortLabel = computed(() => {
            const sortOrder = this.workCenterSortOrder();
            if (sortOrder === 'asc') {
                return 'Work Center (A-Z)';
            }
            if (sortOrder === 'desc') {
                return 'Work Center (Z-A)';
            }
            return 'Work Center';
        }, ...(ngDevMode ? [{ debugName: "workCenterSortLabel" }] : []));
        effect(() => {
            this.timescale();
            this.selectedYear();
            this.selectedMonth();
            queueMicrotask(() => this.centerTimelineOnToday());
        });
    }
    ngAfterViewInit() {
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
    ngOnDestroy() {
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
        if (this.confettiResetTimeoutId !== null) {
            window.clearTimeout(this.confettiResetTimeoutId);
            this.confettiResetTimeoutId = null;
        }
    }
    trackCenter(_index, center) {
        return center.docId;
    }
    trackOrder(_index, order) {
        return order.docId;
    }
    isCurrentColumn(columnIndex) {
        return this.currentColumnIndex() === columnIndex;
    }
    onSelectTimescale(value) {
        this.timescale.set(value);
    }
    onSelectYear(year) {
        this.selectedYear.set(year);
    }
    onSelectMonth(month) {
        this.selectedMonth.set(month);
    }
    onToggleWorkCenterSort() {
        const nextSortOrder = {
            default: 'asc',
            asc: 'desc',
            desc: 'default'
        };
        this.workCenterSortOrder.set(nextSortOrder[this.workCenterSortOrder()]);
    }
    weekdayLabel(date) {
        return this.weekdayFormatter.format(date);
    }
    onTrackClick(event, centerId) {
        const target = event.target;
        if (target.closest('.work-order-card')) {
            return;
        }
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const clickedDate = this.pixelToDate(x);
        const { start, end } = this.resolveRangeForDate(clickedDate);
        this.panelMode.set('create');
        this.panelWorkCenterId.set(centerId);
        this.panelDefaultStartDate.set(toIsoDate(start));
        this.panelDefaultEndDate.set(toIsoDate(end));
        this.editingOrder.set(null);
        this.panelOverlapError.set(null);
        this.panelOpen.set(true);
    }
    onCreateButtonClick() {
        // Open panel from global Create action without a preselected center.
        this.panelMode.set('create');
        this.panelWorkCenterId.set(null);
        this.panelDefaultStartDate.set('');
        this.panelDefaultEndDate.set('');
        this.editingOrder.set(null);
        this.panelOverlapError.set(null);
        this.panelOpen.set(true);
    }
    onHoverCenter(centerId) {
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
    onTrackHover(event, centerId) {
        this.onHoverCenter(centerId);
        const container = event.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        this.hoveredSlot.set(this.computeHoverSlot(centerId, x));
    }
    onTrackEnter(event, centerId) {
        // Resolve the hover slot on initial entry so the "Click to add dates" hint
        // appears immediately without requiring an extra mousemove.
        this.onTrackHover(event, centerId);
    }
    onTrackLeave() {
        this.onHoverCenter(null);
        this.hoveredSlot.set(null);
    }
    onOrderCardClick(event, order, popover) {
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
    onOrderPopoverShown(popover) {
        this.activeOrderPopover = popover;
    }
    onOrderPopoverHidden(popover) {
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
    onOrderPopoverEdit() {
        const order = this.activePopoverOrder();
        if (!order) {
            return;
        }
        this.activeOrderPopover?.close();
        this.onEditOrder(order);
    }
    onOrderPopoverDelete() {
        const order = this.activePopoverOrder();
        if (!order) {
            return;
        }
        this.activeOrderPopover?.close();
        this.onDeleteOrder(order.docId);
    }
    onEditOrder(order) {
        this.panelMode.set('edit');
        this.panelWorkCenterId.set(order.data.workCenterId);
        this.panelDefaultStartDate.set(order.data.startDate);
        this.panelDefaultEndDate.set(order.data.endDate);
        this.editingOrder.set(order);
        this.panelOverlapError.set(null);
        this.panelOpen.set(true);
    }
    onDeleteOrder(orderId) {
        this.store.deleteWorkOrder(orderId);
    }
    onPanelClose() {
        this.panelOpen.set(false);
        this.panelOverlapError.set(null);
    }
    onPanelSubmit(event) {
        // Use selected center from panel form so top-level Create can target any center.
        if (!event.payload.workCenterId) {
            return;
        }
        const candidate = event.payload;
        const conflictingOrder = this.store.findOverlap(candidate, event.existingOrderId);
        if (conflictingOrder) {
            this.panelOverlapError.set(`This work order conflicts with "${conflictingOrder.data.name}" (${formatDateLong(fromIsoDate(conflictingOrder.data.startDate))} to ${formatDateLong(fromIsoDate(conflictingOrder.data.endDate))}) in the selected work center.`);
            return;
        }
        const isUpdate = this.panelMode() === 'edit' && !!event.existingOrderId;
        if (isUpdate && event.existingOrderId) {
            this.store.updateWorkOrder(event.existingOrderId, candidate);
        }
        else {
            this.store.createWorkOrder(candidate);
        }
        this.panelOpen.set(false);
        this.panelOverlapError.set(null);
        const workCenterName = this.resolveWorkCenterName(candidate.workCenterId);
        if (candidate.status === 'complete') {
            const verb = isUpdate ? 'updated' : 'created';
            this.pushNotification('All Done', `"${candidate.name}" in ${workCenterName} was ${verb} as complete. Good work, you crushed it.`, 'complete');
            this.triggerConfetti();
            return;
        }
        if (isUpdate) {
            this.pushNotification('Updated', `"${candidate.name}" in ${workCenterName} updated successfully.`);
            return;
        }
        this.pushNotification('Created', `"${candidate.name}" created in ${workCenterName} successfully.`);
    }
    getOrdersForCenter(centerId) {
        return this.workOrdersByCenter().get(centerId) ?? [];
    }
    isOrderVisible(order) {
        const { start: rangeStart, end: rangeEnd } = this.getVisibleRange();
        const orderStart = fromIsoDate(order.data.startDate);
        const orderEnd = fromIsoDate(order.data.endDate);
        return orderEnd >= rangeStart && orderStart <= rangeEnd;
    }
    orderStyle(order) {
        const placement = this.getOrderPlacement(order);
        return {
            left: `${placement.left}px`,
            width: `${placement.width}px`
        };
    }
    statusLabel(status) {
        return WORK_ORDER_STATUS_LABELS[status];
    }
    statusClass(status) {
        return STATUS_CLASS[status];
    }
    shouldShowInlineStatus(order) {
        const width = this.getOrderPlacement(order).width;
        const requiredWidth = STATUS_PILL_MIN_WIDTH[order.data.status] + CARD_HORIZONTAL_PADDING + CARD_CONTENT_GAP + MIN_NAME_WIDTH_WITH_STATUS;
        return width >= requiredWidth;
    }
    orderDateLabel(value) {
        return formatDateLong(fromIsoDate(value));
    }
    hoveredSlotForCenter(centerId) {
        const slot = this.hoveredSlot();
        if (!slot || slot.centerId !== centerId) {
            return null;
        }
        return slot;
    }
    buildProjection(scale) {
        const yearStart = new Date(this.selectedYear(), 0, 1);
        const yearEnd = new Date(this.selectedYear(), 11, 31);
        if (scale === 'day') {
            const columnWidth = 96;
            const startDate = yearStart;
            const endDate = yearEnd;
            const columns = [];
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
            const columns = [];
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
        const columns = [];
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
    dateToPixel(date) {
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
    pixelToDate(pixel) {
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
    clampPixel(value) {
        return Math.min(Math.max(value, 0), this.timelineWidth());
    }
    getVisibleRange() {
        const projection = this.projection();
        const yearStart = new Date(this.selectedYear(), 0, 1);
        const yearEnd = new Date(this.selectedYear(), 11, 31);
        const start = projection.startDate > yearStart ? projection.startDate : yearStart;
        const end = projection.endDate < yearEnd ? projection.endDate : yearEnd;
        return { start, end };
    }
    getOrderPlacement(order) {
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
    computeHoverSlot(centerId, x) {
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
    hasOrderInRange(centerId, start, end) {
        const orders = this.getOrdersForCenter(centerId);
        return orders.some((order) => {
            const orderStart = fromIsoDate(order.data.startDate);
            const orderEnd = fromIsoDate(order.data.endDate);
            return orderEnd >= start && orderStart <= end;
        });
    }
    resolveRangeForDate(date) {
        if (this.timescale() === 'day') {
            const day = startOfDay(date);
            return { start: day, end: day };
        }
        if (this.timescale() === 'week') {
            return { start: startOfWeek(date), end: endOfWeek(date) };
        }
        return { start: startOfMonth(date), end: endOfMonth(date) };
    }
    openOrderPopover(order, popover, clickX, clickY) {
        this.activePopoverOrder.set(order);
        this.orderPopoverPlacement.set(this.resolvePopoverPlacement(clickX, clickY));
        popover.positionTarget = this.createPopoverClickAnchor(clickX, clickY);
        // Open in next macrotask so this click is not interpreted as immediate outside-click autoclose.
        window.setTimeout(() => {
            popover.open();
            this.activeOrderPopover = popover;
        }, 0);
    }
    resolvePopoverPlacement(clickX, clickY) {
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
    createPopoverClickAnchor(clickX, clickY) {
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
    destroyPopoverClickAnchor() {
        this.popoverClickAnchorEl?.remove();
        this.popoverClickAnchorEl = null;
    }
    centerTimelineOnToday() {
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
    getAnchorDate() {
        const today = startOfDay(new Date());
        if (this.selectedYear() === today.getFullYear() && this.selectedMonth() === today.getMonth()) {
            return today;
        }
        return new Date(this.selectedYear(), this.selectedMonth(), 1);
    }
    buildYearOptions() {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 11 }, (_unused, index) => currentYear - 5 + index);
    }
    bindTimelineResizeSync() {
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
    bindHorizontalScrollSync() {
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
    syncHeaderScroll(scrollLeft) {
        const headerContent = this.headerTrackContentRef?.nativeElement;
        if (!headerContent) {
            return;
        }
        headerContent.style.transform = `translate3d(${-scrollLeft}px, 0, 0)`;
    }
    resolveWorkCenterName(centerId) {
        return this.workCenters().find((center) => center.docId === centerId)?.data.name ?? 'selected work center';
    }
    pushNotification(title, message, tone = 'default') {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        this.notifications.update((current) => [...current, { id, title, message, tone }]);
        const timeoutId = window.setTimeout(() => this.removeNotification(id), 4200);
        this.notificationTimeoutIds.set(id, timeoutId);
    }
    removeNotification(id) {
        const timeoutId = this.notificationTimeoutIds.get(id);
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            this.notificationTimeoutIds.delete(id);
        }
        this.notifications.update((current) => current.filter((item) => item.id !== id));
    }
    triggerConfetti() {
        this.confettiPieces.set(this.buildConfettiPieces());
        this.confettiActive.set(true);
        if (this.confettiResetTimeoutId !== null) {
            window.clearTimeout(this.confettiResetTimeoutId);
        }
        this.confettiResetTimeoutId = window.setTimeout(() => {
            this.confettiActive.set(false);
            this.confettiPieces.set([]);
            this.confettiResetTimeoutId = null;
        }, 2800);
    }
    buildConfettiPieces() {
        const colors = ['#4b57f5', '#00b0bf', '#08a268', '#f59e0b', '#ef4444', '#8b5cf6'];
        return Array.from({ length: 120 }, (_unused, index) => ({
            id: index,
            leftPercent: Math.random() * 100,
            sizePx: 6 + Math.random() * 8,
            delayMs: Math.random() * 260,
            durationMs: 1400 + Math.random() * 1200,
            driftPx: -160 + Math.random() * 320,
            rotationDeg: Math.floor(Math.random() * 720),
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
    }
    static { this.ɵfac = function WorkOrderTimelineComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WorkOrderTimelineComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WorkOrderTimelineComponent, selectors: [["app-work-order-timeline"]], viewQuery: function WorkOrderTimelineComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 7)(_c1, 7);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.timelineScrollRef = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.headerTrackContentRef = _t.first);
        } }, decls: 51, vars: 32, consts: [["timelineScroll", ""], ["headerTrackContent", ""], ["timelineHorizontalScroll", ""], ["orderPopoverTemplate", ""], ["orderPopover", "ngbPopover"], [1, "timeline-content"], ["aria-live", "polite", "aria-atomic", "true", 1, "notification-stack"], ["type", "light", 3, "dismissible", "ngClass"], ["aria-hidden", "true", 1, "confetti-overlay"], [1, "work-order-title"], [1, "toolbar"], [1, "toolbar-row"], [1, "toolbar-controls"], [1, "timescale-selector"], [1, "timescale-label"], [1, "timescale-select", "select--timescale", 3, "ngModelChange", "items", "bindLabel", "bindValue", "clearable", "searchable", "ngModel"], [1, "timescale-selector", "selector--year"], [1, "timescale-select", "select--year", 3, "ngModelChange", "items", "clearable", "searchable", "ngModel"], [1, "timescale-selector", "selector--month"], [1, "timescale-select", "select--month", 3, "ngModelChange", "items", "bindLabel", "bindValue", "clearable", "searchable", "ngModel"], ["type", "button", 1, "timeline-create-btn", 3, "click"], [1, "timeline-shell"], [1, "timeline-body"], [1, "timeline-left-pane"], [1, "timeline-row", "timeline-header-row"], [1, "work-center-cell", "work-center-header-cell"], ["type", "button", 1, "work-center-header-button", 3, "click"], [1, "timeline-row", 3, "row-hovered"], [1, "timeline-right-pane"], [1, "timeline-row", "timeline-header-row", "timeline-right-header"], [1, "track-cell", "header-track-viewport"], [1, "header-track-content"], [1, "header-column", 3, "left", "width", "current-header-column"], [1, "timeline-scroll-pane"], [1, "timeline-grid"], [1, "today-guide", 3, "left"], [1, "timeline-row", 3, "timeline-row--first", "row-hovered"], [3, "closed", "submitted", "isOpen", "mode", "workCenterName", "workCenters", "defaultWorkCenterId", "defaultStartDate", "defaultEndDate", "editingOrder", "overlapError"], [1, "confetti-piece", 3, "left", "width", "height", "animation-delay", "animation-duration", "background", "--drift", "--rotation"], [1, "confetti-piece"], [1, "timeline-row"], [1, "work-center-cell", 3, "mouseenter", "mouseleave"], [1, "header-column"], [1, "header-label-date"], [1, "header-label-weekday"], [1, "today-guide"], [1, "track-cell", 3, "mouseenter", "mousemove", "mouseleave", "click"], [1, "track-column", 3, "left", "width"], [1, "track-column"], [1, "add-dates-hint"], [1, "add-dates-slot"], ["triggers", "manual", 1, "work-order-card", 3, "ngClass", "ngStyle", "ngbPopover", "placement", "popoverClass", "autoClose", "container", "title"], ["triggers", "manual", 1, "work-order-card", 3, "shown", "hidden", "click", "ngClass", "ngStyle", "ngbPopover", "placement", "popoverClass", "autoClose", "container", "title"], [1, "order-name"], [1, "status-pill", 3, "ngClass"], [1, "order-popover-content"], [1, "order-popover-name"], [1, "order-popover-status", 3, "ngClass"], [1, "order-popover-dates"], [1, "order-popover-actions"], ["type", "button", 3, "click"], ["type", "button", 1, "danger", 3, "click"]], template: function WorkOrderTimelineComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "section", 5)(1, "div", 6);
            i0.ɵɵrepeaterCreate(2, WorkOrderTimelineComponent_For_3_Template, 4, 4, "ngb-alert", 7, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, WorkOrderTimelineComponent_Conditional_4_Template, 3, 0, "div", 8);
            i0.ɵɵelementStart(5, "div", 9)(6, "h1");
            i0.ɵɵtext(7, "Work Orders");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(8, "div", 10)(9, "div", 11)(10, "div", 12)(11, "div", 13)(12, "span", 14);
            i0.ɵɵtext(13, "Timescale");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "ng-select", 15);
            i0.ɵɵlistener("ngModelChange", function WorkOrderTimelineComponent_Template_ng_select_ngModelChange_14_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSelectTimescale($event)); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "div", 16)(16, "span", 14);
            i0.ɵɵtext(17, "Year");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "ng-select", 17);
            i0.ɵɵlistener("ngModelChange", function WorkOrderTimelineComponent_Template_ng_select_ngModelChange_18_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSelectYear($event)); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 18)(20, "span", 14);
            i0.ɵɵtext(21, "Month");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "ng-select", 19);
            i0.ɵɵlistener("ngModelChange", function WorkOrderTimelineComponent_Template_ng_select_ngModelChange_22_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSelectMonth($event)); });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "button", 20);
            i0.ɵɵlistener("click", function WorkOrderTimelineComponent_Template_button_click_23_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onCreateButtonClick()); });
            i0.ɵɵtext(24, "Create");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(25, "div", 21, 0)(27, "div", 22)(28, "div", 23)(29, "div", 24)(30, "div", 25)(31, "button", 26);
            i0.ɵɵlistener("click", function WorkOrderTimelineComponent_Template_button_click_31_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onToggleWorkCenterSort()); });
            i0.ɵɵtext(32);
            i0.ɵɵelementEnd()()();
            i0.ɵɵrepeaterCreate(33, WorkOrderTimelineComponent_For_34_Template, 3, 3, "div", 27, ctx.trackCenter, true);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "div", 28)(36, "div", 29)(37, "div", 30)(38, "div", 31, 1);
            i0.ɵɵrepeaterCreate(40, WorkOrderTimelineComponent_For_41_Template, 3, 7, "div", 32, _forTrack1);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(42, "div", 33, 2)(44, "div", 34);
            i0.ɵɵconditionalCreate(45, WorkOrderTimelineComponent_Conditional_45_Template, 1, 2, "div", 35);
            i0.ɵɵrepeaterCreate(46, WorkOrderTimelineComponent_For_47_Template, 7, 7, "div", 36, ctx.trackCenter, true);
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵtemplate(48, WorkOrderTimelineComponent_ng_template_48_Template, 1, 1, "ng-template", null, 3, i0.ɵɵtemplateRefExtractor);
            i0.ɵɵelementStart(50, "app-work-order-panel", 37);
            i0.ɵɵlistener("closed", function WorkOrderTimelineComponent_Template_app_work_order_panel_closed_50_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPanelClose()); })("submitted", function WorkOrderTimelineComponent_Template_app_work_order_panel_submitted_50_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPanelSubmit($event)); });
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.notifications());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.confettiActive() ? 4 : -1);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("items", ctx.timescaleOptions)("bindLabel", "label")("bindValue", "value")("clearable", false)("searchable", false)("ngModel", ctx.timescale());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("items", ctx.yearOptions)("clearable", false)("searchable", false)("ngModel", ctx.selectedYear());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("items", ctx.monthOptions)("bindLabel", "label")("bindValue", "value")("clearable", false)("searchable", false)("ngModel", ctx.selectedMonth());
            i0.ɵɵadvance(10);
            i0.ɵɵtextInterpolate1(" ", ctx.workCenterSortLabel(), " ");
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.displayedWorkCenters());
            i0.ɵɵadvance(5);
            i0.ɵɵstyleProp("width", ctx.timelineWidth(), "px");
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.columns());
            i0.ɵɵadvance(4);
            i0.ɵɵstyleProp("width", ctx.timelineWidth(), "px");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isTodayVisible() ? 45 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.displayedWorkCenters());
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("isOpen", ctx.panelOpen())("mode", ctx.panelMode())("workCenterName", ctx.selectedWorkCenterName())("workCenters", ctx.workCenters())("defaultWorkCenterId", ctx.panelWorkCenterId())("defaultStartDate", ctx.panelDefaultStartDate())("defaultEndDate", ctx.panelDefaultEndDate())("editingOrder", ctx.editingOrder())("overlapError", ctx.panelOverlapError());
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgStyle, FormsModule, i2.NgControlStatus, i2.NgModel, NgSelectModule, i3.NgSelectComponent, NgbPopover, NgbAlert, WorkOrderPanelComponent], styles: [".timeline-content[_ngcontent-%COMP%] {\n  margin: 0;\n  position: relative;\n}\n\n.notification-stack[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n  z-index: 1200;\n  display: flex;\n  flex-direction: column;\n  gap: 0.625rem;\n  width: min(440px, calc(100vw - 2rem));\n  pointer-events: none;\n}\n\n.app-alert[_ngcontent-%COMP%] {\n  margin: 0;\n  pointer-events: none;\n  border: 1px solid rgba(204, 211, 236, 0.9);\n  border-radius: 14px;\n  background: linear-gradient(180deg, #ffffff 0%, #f9faff 100%);\n  color: #1f2a52;\n  font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  line-height: 1.4;\n  box-shadow:\n    0 8px 18px rgba(27, 39, 84, 0.14),\n    0 0 0 1px rgba(79, 93, 171, 0.04);\n  animation: _ngcontent-%COMP%_notification-in 340ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.app-alert[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #111f4a;\n  font-weight: 600;\n}\n\n.app-alert--default[_ngcontent-%COMP%] {\n  border-left: 4px solid #4b57f5;\n}\n\n.app-alert--complete[_ngcontent-%COMP%] {\n  border-left: 4px solid #08a268;\n  background: linear-gradient(180deg, #f5fff9 0%, #eefcf4 100%);\n}\n\n.confetti-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1150;\n  pointer-events: none;\n  overflow: hidden;\n}\n\n.confetti-piece[_ngcontent-%COMP%] {\n  --drift: 0px;\n  --rotation: 360deg;\n  position: absolute;\n  top: -12px;\n  border-radius: 2px;\n  opacity: 0;\n  animation-name: _ngcontent-%COMP%_confetti-fall;\n  animation-timing-function: cubic-bezier(0.2, 0.72, 0.27, 1);\n  animation-fill-mode: forwards;\n}\n\n.work-order-title[_ngcontent-%COMP%] {\n  h1 {\n    margin: 0;\n    width: 142px;\n    height: 34px;\n    color: rgba(3, 9, 41, 1);\n    font-family: 'CircularStd-Medium', 'Circular-Std', 'Segoe UI', sans-serif;\n    font-size: 24px;\n    font-weight: 500;\n    font-style: normal;\n  }\n}\n\n.toolbar[_ngcontent-%COMP%] {\n  margin-top: 1.625rem;\n  margin-bottom: 1.125rem;\n}\n\n.toolbar-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  max-width: calc(100vw - 10rem);\n}\n\n.toolbar-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n}\n\n.timeline-create-btn[_ngcontent-%COMP%] {\n  height: 34px;\n  min-width: 68px;\n  border-radius: 9px;\n  border: 1px solid #4b57f5;\n  background: #4b57f5;\n  color: #ffffff;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 120ms ease;\n}\n\n.timeline-create-btn[_ngcontent-%COMP%]:hover {\n  background: #404de8;\n}\n\n.timescale-selector[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  height: 1.5625rem;\n  padding: 0;\n  box-sizing: border-box;\n  gap: 0;\n  border-radius: 0.3125rem;\n  background-color: #ffffff;\n  box-shadow: 1px 2.5px 3px -1.5px rgba(200, 207, 233, 1);\n}\n\n.timescale-label[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  height: 100%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.3125rem 0.5rem;\n  background-color: rgba(241, 243, 248, 0.75);\n  color: #687196;\n  font-size: 0.8125rem;\n  font-weight: 400;\n  border-radius: 0.3125rem 0 0 0.3125rem;\n}\n\n.timescale-select[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: auto;\n  height: 100%;\n}\n\n[_nghost-%COMP%]     .timescale-select.ng-select {\n  font-size: 0.8125rem;\n  width: auto;\n  position: static;\n\n\n  .ng-clear-wrapper {\n    display: none;\n  }\n\n  .ng-select-container {\n    min-height: 1.5625rem !important;\n    height: 1.5625rem !important;\n    border: 0 !important;\n    border-radius: 0 0.3125rem 0.3125rem 0;\n    background: #ffffff !important;\n    box-shadow: none !important;\n  }\n\n  .ng-value-container {\n    padding: 0.25rem 0 0.25rem 0.5rem !important;\n    justify-content: flex-start;\n    align-items: center;\n    overflow: visible !important;\n    box-sizing: border-box;\n  }\n\n  .ng-input {\n    padding: 0 !important;\n  }\n\n  .ng-value {\n    color: #3e40db !important;\n    font-size: 0.8125rem !important;\n    font-weight: 500;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    line-height: 1;\n    overflow: visible !important;\n    max-width: none !important;\n    height: 1rem;\n    display: inline-flex;\n    align-items: center;\n  }\n\n  .ng-value-label {\n    overflow: visible !important;\n    text-overflow: clip !important;\n    white-space: nowrap !important;\n  }\n\n  .ng-arrow-wrapper {\n    padding: 0 !important;\n    margin-left: 0.40625rem;\n    margin-right: 0.5rem;\n    display: inline-flex;\n    align-items: center;\n    width: auto !important;\n    height: 100%;\n  }\n\n  .ng-arrow {\n    border: 0 !important;\n    width: 0.5625rem;\n    height: 0.375rem;\n    background: url('/assets/images/Down.svg') center / contain no-repeat;\n    transform: rotate(0deg);\n    margin: 0 !important;\n  }\n\n  &.ng-select-opened .ng-arrow {\n    transform: rotate(180deg);\n  }\n}\n\n[_nghost-%COMP%]     .timescale-select.select--timescale.ng-select {\n  min-width: 4.4375rem;\n}\n\n[_nghost-%COMP%]     .timescale-select.select--year.ng-select {\n  min-width: 3.875rem;\n}\n\n[_nghost-%COMP%]     .timescale-select.select--month.ng-select {\n  min-width: 3.375rem;\n}\n\n[_nghost-%COMP%]     .timescale-select.ng-select .ng-dropdown-panel {\n  margin-top: 0.3125rem !important;\n  border: 0 !important;\n  border-radius: 0.3125rem;\n  background: #ffffff !important;\n  width: 12.5rem;\n  left: 0 !important;\n  box-shadow:\n    0 0 0 1px rgba(104, 113, 150, 0.1),\n    0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n    0 4.5px 5px -1px rgba(216, 220, 235, 1);\n  padding: 0.75rem !important;\n}\n\n[_nghost-%COMP%]     .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n  min-height: 1.75rem !important;\n  height: 1.75rem !important;\n  padding: 0.3125rem 0.75rem !important;\n  font-size: 0.875rem !important;\n  line-height: 1.125rem;\n  color: #2f3059;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n[_nghost-%COMP%]     .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n  background: #f3f5ff;\n}\n\n[_nghost-%COMP%]     .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n  color: #3e40db;\n  background: #ffffff;\n  font-weight: 400;\n}\n\n.timeline-shell[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: calc(100vw - 10rem);\n  height: calc(100vh - 15.3125rem);\n  min-height: 32.5rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  border: 1px solid #d9deeb;\n  background: #ffffff;\n}\n\n.timeline-body[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 100%;\n}\n\n.timeline-left-pane[_ngcontent-%COMP%] {\n  flex: 0 0 23.75rem;\n  background: #ffffff;\n  z-index: 14;\n}\n\n.timeline-scroll-pane[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  overflow-x: auto;\n  overflow-y: visible;\n  min-width: 0;\n}\n\n.timeline-right-pane[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n\n.timeline-right-header[_ngcontent-%COMP%] {\n  z-index: 13;\n}\n\n.timeline-grid[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.timeline-row[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  height: 48px;\n  min-height: 48px;\n  border-bottom: 1px solid #dde2ef;\n}\n\n.timeline-row.row-hovered[_ngcontent-%COMP%]:not(.timeline-header-row) {\n  z-index: 16;\n}\n\n.timeline-scroll-pane[_ngcontent-%COMP%]   .timeline-row[_ngcontent-%COMP%]:hover:not(.timeline-header-row)   .track-cell[_ngcontent-%COMP%] {\n  background-color: rgba(238, 240, 255, 1);\n}\n\n.timeline-row.row-hovered[_ngcontent-%COMP%]:not(.timeline-header-row)   .work-center-cell[_ngcontent-%COMP%], \n.timeline-row.row-hovered[_ngcontent-%COMP%]:not(.timeline-header-row)   .track-cell[_ngcontent-%COMP%] {\n  background-color: rgba(250, 251, 253, 1);\n}\n\n.timeline-row.row-hovered[_ngcontent-%COMP%]:not(.timeline-header-row)   .track-cell[_ngcontent-%COMP%] {\n  background-color: rgba(238, 240, 255, 1);\n}\n\n.timeline-header-row[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 12;\n  height: 48px;\n  min-height: 48px;\n  border-bottom: 1px solid #dde2ef;\n\n  .work-center-cell,\n  .track-cell {\n    background: #ffffff;\n  }\n}\n\n.work-center-cell[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 23.75rem;\n  min-width: 23.75rem;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 1);\n  border-right: 1px solid #dde2ef;\n  display: flex;\n  align-items: center;\n  padding: 0 1.9375rem;\n  color: #030929;\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1rem;\n}\n\n.timeline-header-row[_ngcontent-%COMP%]   .work-center-cell[_ngcontent-%COMP%] {\n  color: #8c95b2;\n  font-weight: 400;\n}\n\n.work-center-header-cell[_ngcontent-%COMP%] {\n  padding: 0;\n}\n\n.work-center-header-button[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  color: #8c95b2;\n  font-size: 0.875rem;\n  font-weight: 400;\n  text-align: left;\n  padding: 0 1.9375rem;\n  cursor: pointer;\n}\n\n.track-cell[_ngcontent-%COMP%] {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  overflow: visible;\n}\n\n.header-track-viewport[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n\n.header-track-content[_ngcontent-%COMP%] {\n  position: relative;\n  height: 100%;\n  will-change: transform;\n}\n\n.header-column[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-right: 1px solid #dde2ef;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #7b86a8;\n  font-size: 14px;\n}\n\n.header-column.current-header-column[_ngcontent-%COMP%] {\n  background: #5659ff;\n  color: #ffffff;\n}\n\n.header-column.current-header-column[_ngcontent-%COMP%]   .header-label-date[_ngcontent-%COMP%], \n.header-column.current-header-column[_ngcontent-%COMP%]   .header-label-weekday[_ngcontent-%COMP%] {\n  color: #ffffff;\n}\n\n.header-label-date[_ngcontent-%COMP%], \n.header-label-weekday[_ngcontent-%COMP%] {\n  line-height: 1.1;\n}\n\n.header-label-weekday[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #8c95b2;\n}\n\n.track-column[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-right: 1px solid #e2e6f1;\n  pointer-events: none;\n}\n\n.today-guide[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  background: #c8ccff;\n  z-index: 5;\n  pointer-events: none;\n}\n\n.add-dates-slot[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 5px;\n  width: 113px;\n  height: 38px;\n  border: 1px solid rgba(195, 199, 255, 1);\n  border-radius: 8px;\n  background-color: rgba(101, 112, 255, 0.1);\n  pointer-events: none;\n  z-index: 9;\n}\n\n.add-dates-hint[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -31px;\n  transform: translateX(-50%);\n  background: #49516e;\n  color: #ffffff;\n  border-radius: 10px;\n  padding: 6px 10px;\n  font-size: 12px;\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: 9999;\n}\n\n\n\n\n.timeline-row.timeline-row--first[_ngcontent-%COMP%]   .add-dates-hint[_ngcontent-%COMP%] {\n  top: 6px;\n}\n\n.work-order-card[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 5px;\n  height: 38px;\n  border-radius: 8px;\n  border: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 8px 10px;\n  z-index: 6;\n  cursor: pointer;\n}\n\n.order-name[_ngcontent-%COMP%] {\n  width: 111px;\n  height: 18px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: rgba(3, 9, 41, 1);\n  font-family: 'CircularStd-Book', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 18px;\n}\n\n.order-name--no-status[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.status-pill[_ngcontent-%COMP%] {\n  margin-left: auto;\n  height: 22px;\n  border-radius: 5px;\n  padding: 2px 8px;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family: 'CircularStd-Book', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  white-space: nowrap;\n}\n\n.work-order-card.status-open[_ngcontent-%COMP%] {\n  box-shadow: 0 0 0 1px rgba(206, 251, 255, 1);\n  background-color: rgba(246, 255, 255, 1);\n}\n\n.status-pill.status-open[_ngcontent-%COMP%] {\n  min-width: 51px;\n  background-color: rgba(228, 253, 255, 1);\n  color: rgba(0, 176, 191, 1);\n  font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  text-align: center;\n}\n\n.work-order-card.status-in-progress[_ngcontent-%COMP%] {\n  box-shadow: 0 0 0 1px rgba(222, 224, 255, 1);\n  background-color: rgba(237, 238, 255, 1);\n}\n\n.status-pill.status-in-progress[_ngcontent-%COMP%] {\n  min-width: 87px;\n  background-color: rgba(214, 216, 255, 1);\n  color: rgba(62, 64, 219, 1);\n}\n\n.work-order-card.status-complete[_ngcontent-%COMP%] {\n  box-shadow: 0 0 0 1px rgba(209, 250, 179, 1);\n  background-color: rgba(248, 255, 243, 1);\n}\n\n.status-pill.status-complete[_ngcontent-%COMP%] {\n  min-width: 63px;\n  background-color: rgba(225, 255, 204, 1);\n  color: rgba(8, 162, 104, 1);\n}\n\n.work-order-card.status-blocked[_ngcontent-%COMP%] {\n  box-shadow: 0 0 0 1px rgba(255, 245, 207, 1);\n  background-color: rgba(255, 252, 241, 1);\n}\n\n.status-pill.status-blocked[_ngcontent-%COMP%] {\n  min-width: 67px;\n  background-color: rgba(252, 238, 181, 1);\n  color: rgba(177, 54, 0, 1);\n}\n\n  .work-order-popover.popover {\n  --bs-popover-bg: #ffffff;\n  --bs-popover-border-color: #d7ddef;\n  --bs-popover-max-width: min(320px, calc(100vw - 24px));\n  --bs-popover-border-radius: 10px;\n  --bs-popover-header-bg: #ffffff;\n  --bs-popover-body-color: #1a233d;\n  --bs-popover-body-padding-x: 0;\n  --bs-popover-body-padding-y: 0;\n  --bs-popover-arrow-width: 1rem;\n  --bs-popover-arrow-height: 0.55rem;\n  box-shadow: 0 8px 20px rgba(34, 45, 76, 0.16);\n}\n\n  .work-order-popover.popover .popover-body {\n  background: #ffffff;\n  border-radius: 10px;\n  padding: 10px;\n}\n\n.order-popover-content[_ngcontent-%COMP%] {\n  min-width: 230px;\n  max-width: min(320px, calc(100vw - 24px));\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.order-popover-name[_ngcontent-%COMP%] {\n  color: #172147;\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 1.25;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n\n.order-popover-status[_ngcontent-%COMP%] {\n  width: fit-content;\n  border-radius: 7px;\n  padding: 4px 10px;\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.order-popover-status.status-open[_ngcontent-%COMP%] {\n  color: #0085af;\n  background: #d2f1ff;\n}\n\n.order-popover-status.status-in-progress[_ngcontent-%COMP%] {\n  color: #4d58df;\n  background: #c6cbff;\n}\n\n.order-popover-status.status-complete[_ngcontent-%COMP%] {\n  color: #3aa05f;\n  background: #d9f2ca;\n}\n\n.order-popover-status.status-blocked[_ngcontent-%COMP%] {\n  color: #cd5b0d;\n  background: #f4df9a;\n}\n\n.order-popover-dates[_ngcontent-%COMP%] {\n  color: #5f6f95;\n  font-size: 13px;\n  line-height: 1.35;\n}\n\n.order-popover-dates[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #243056;\n}\n\n.order-popover-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n\n  button {\n    border: 1px solid #d6deef;\n    border-radius: 6px;\n    padding: 6px 10px;\n    background: #ffffff;\n    color: #2a3170;\n    font-size: 13px;\n    font-weight: 500;\n    cursor: pointer;\n  }\n\n  button.danger {\n    color: #3340f2;\n  }\n}\n\n@media (max-width: 1024px) {\n  .timeline-shell[_ngcontent-%COMP%] {\n    max-width: calc(100vw - 32px);\n  }\n\n  .timeline-left-pane[_ngcontent-%COMP%] {\n    flex-basis: 17.5rem;\n  }\n\n  .work-center-cell[_ngcontent-%COMP%] {\n    width: 17.5rem;\n    min-width: 17.5rem;\n    padding: 0 16px;\n  }\n}\n\n@keyframes _ngcontent-%COMP%_notification-in {\n  from {\n    transform: translate3d(24px, -12px, 0) scale(0.98);\n    opacity: 0;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0) scale(1);\n    opacity: 1;\n  }\n}\n\n@keyframes _ngcontent-%COMP%_confetti-fall {\n  0% {\n    transform: translate3d(0, -8vh, 0) rotate(0deg);\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n  }\n\n  100% {\n    transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rotation));\n    opacity: 0;\n  }\n}"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WorkOrderTimelineComponent, [{
        type: Component,
        args: [{ selector: 'app-work-order-timeline', standalone: true, imports: [CommonModule, FormsModule, NgSelectModule, NgbPopover, NgbAlert, WorkOrderPanelComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<section class=\"timeline-content\">\n  <div class=\"notification-stack\" aria-live=\"polite\" aria-atomic=\"true\">\n    @for (notification of notifications(); track notification.id) {\n      <ngb-alert [dismissible]=\"false\" type=\"light\" [ngClass]=\"notification.tone === 'complete' ? 'app-alert app-alert--complete' : 'app-alert app-alert--default'\">\n        <strong>{{ notification.title }}!</strong> {{ notification.message }}\n      </ngb-alert>\n    }\n  </div>\n\n  @if (confettiActive()) {\n    <div class=\"confetti-overlay\" aria-hidden=\"true\">\n      @for (piece of confettiPieces(); track piece.id) {\n        <span\n          class=\"confetti-piece\"\n          [style.left.%]=\"piece.leftPercent\"\n          [style.width.px]=\"piece.sizePx\"\n          [style.height.px]=\"piece.sizePx * 0.58\"\n          [style.animation-delay.ms]=\"piece.delayMs\"\n          [style.animation-duration.ms]=\"piece.durationMs\"\n          [style.background]=\"piece.color\"\n          [style.--drift]=\"piece.driftPx + 'px'\"\n          [style.--rotation]=\"piece.rotationDeg + 'deg'\"\n        ></span>\n      }\n    </div>\n  }\n\n  <div class=\"work-order-title\">\n    <h1>Work Orders</h1>\n  </div>\n\n  <div class=\"toolbar\">\n    <div class=\"toolbar-row\">\n      <div class=\"toolbar-controls\">\n        <div class=\"timescale-selector\">\n          <span class=\"timescale-label\">Timescale</span>\n          <ng-select\n            class=\"timescale-select select--timescale\"\n            [items]=\"timescaleOptions\"\n            [bindLabel]=\"'label'\"\n            [bindValue]=\"'value'\"\n            [clearable]=\"false\"\n            [searchable]=\"false\"\n            [ngModel]=\"timescale()\"\n            (ngModelChange)=\"onSelectTimescale($event)\"\n          >\n          </ng-select>\n        </div>\n\n        <div class=\"timescale-selector selector--year\">\n          <span class=\"timescale-label\">Year</span>\n          <ng-select\n            class=\"timescale-select select--year\"\n            [items]=\"yearOptions\"\n            [clearable]=\"false\"\n            [searchable]=\"false\"\n            [ngModel]=\"selectedYear()\"\n            (ngModelChange)=\"onSelectYear($event)\"\n          >\n          </ng-select>\n        </div>\n\n        <div class=\"timescale-selector selector--month\">\n          <span class=\"timescale-label\">Month</span>\n          <ng-select\n            class=\"timescale-select select--month\"\n            [items]=\"monthOptions\"\n            [bindLabel]=\"'label'\"\n            [bindValue]=\"'value'\"\n            [clearable]=\"false\"\n            [searchable]=\"false\"\n            [ngModel]=\"selectedMonth()\"\n            (ngModelChange)=\"onSelectMonth($event)\"\n          >\n          </ng-select>\n        </div>\n      </div>\n      <button type=\"button\" class=\"timeline-create-btn\" (click)=\"onCreateButtonClick()\">Create</button>\n    </div>\n  </div>\n\n  <div class=\"timeline-shell\" #timelineScroll>\n    <div class=\"timeline-body\">\n      <div class=\"timeline-left-pane\">\n        <div class=\"timeline-row timeline-header-row\">\n          <div class=\"work-center-cell work-center-header-cell\">\n            <button\n              type=\"button\"\n              class=\"work-center-header-button\"\n              (click)=\"onToggleWorkCenterSort()\"\n            >\n              {{ workCenterSortLabel() }}\n            </button>\n          </div>\n        </div>\n\n        @for (center of displayedWorkCenters(); track trackCenter($index, center)) {\n          <div\n            class=\"timeline-row\"\n            [class.row-hovered]=\"hoveredCenterId() === center.docId\"\n          >\n            <div class=\"work-center-cell\" (mouseenter)=\"onHoverCenter(center.docId)\" (mouseleave)=\"onHoverCenter(null)\">\n              {{ center.data.name }}\n            </div>\n          </div>\n        }\n      </div>\n\n      <div class=\"timeline-right-pane\">\n        <div class=\"timeline-row timeline-header-row timeline-right-header\">\n          <div class=\"track-cell header-track-viewport\">\n            <div\n              #headerTrackContent\n              class=\"header-track-content\"\n              [style.width.px]=\"timelineWidth()\"\n            >\n              @for (column of columns(); track column.index) {\n                <div\n                  class=\"header-column\"\n                  [style.left.px]=\"column.left\"\n                  [style.width.px]=\"column.width\"\n                  [class.current-header-column]=\"isCurrentColumn(column.index)\"\n                >\n                  @if (timescale() === 'day') {\n                    <div class=\"header-label-date\">{{ column.label }}</div>\n                    <div class=\"header-label-weekday\">{{ weekdayLabel(column.startDate) }}</div>\n                  } @else {\n                    {{ column.label }}\n                  }\n                </div>\n              }\n            </div>\n          </div>\n        </div>\n\n        <div class=\"timeline-scroll-pane\" #timelineHorizontalScroll>\n          <div class=\"timeline-grid\" [style.width.px]=\"timelineWidth()\">\n            @if (isTodayVisible()) {\n              <div class=\"today-guide\" [style.left.px]=\"todayX()\"></div>\n            }\n\n            @for (center of displayedWorkCenters(); track trackCenter($index, center)) {\n            <div\n              class=\"timeline-row\"\n              [class.timeline-row--first]=\"$first\"\n              [class.row-hovered]=\"hoveredCenterId() === center.docId\"\n            >\n                <div\n                  class=\"track-cell\"\n                  [style.width.px]=\"timelineWidth()\"\n                  (mouseenter)=\"onTrackEnter($event, center.docId)\"\n                  (mousemove)=\"onTrackHover($event, center.docId)\"\n                  (mouseleave)=\"onTrackLeave()\"\n                  (click)=\"onTrackClick($event, center.docId)\"\n                >\n                  @for (column of columns(); track column.index) {\n                    <div class=\"track-column\" [style.left.px]=\"column.left\" [style.width.px]=\"column.width\"></div>\n                  }\n\n                  @if (hoveredSlotForCenter(center.docId); as slot) {\n                    <div class=\"add-dates-hint\" [style.left.px]=\"slot.left + slot.width / 2\">Click to add dates</div>\n                    <div class=\"add-dates-slot\" [style.left.px]=\"slot.left\" [style.width.px]=\"slot.width\"></div>\n                  }\n\n                  @for (order of getOrdersForCenter(center.docId); track trackOrder($index, order)) {\n                    @if (isOrderVisible(order)) {\n                      <div\n                        class=\"work-order-card\"\n                        #orderPopover=\"ngbPopover\"\n                        [ngClass]=\"statusClass(order.data.status)\"\n                        [ngStyle]=\"orderStyle(order)\"\n                        [ngbPopover]=\"orderPopoverTemplate\"\n                        [placement]=\"orderPopoverPlacement()\"\n                        [popoverClass]=\"'work-order-popover'\"\n                        [autoClose]=\"'outside'\"\n                        [container]=\"'body'\"\n                        triggers=\"manual\"\n                        (shown)=\"onOrderPopoverShown(orderPopover)\"\n                        (hidden)=\"onOrderPopoverHidden(orderPopover)\"\n                        [title]=\"order.data.name\"\n                        (click)=\"onOrderCardClick($event, order, orderPopover)\"\n                      >\n                        <span class=\"order-name\" [class.order-name--no-status]=\"!shouldShowInlineStatus(order)\">{{ order.data.name }}</span>\n                        @if (shouldShowInlineStatus(order)) {\n                          <span class=\"status-pill\" [ngClass]=\"statusClass(order.data.status)\">{{ statusLabel(order.data.status) }}</span>\n                        }\n                      </div>\n                    }\n                  }\n                </div>\n              </div>\n            }\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<ng-template #orderPopoverTemplate>\n  @if (activePopoverOrder(); as order) {\n    <div class=\"order-popover-content\">\n      <div class=\"order-popover-name\">{{ order.data.name }}</div>\n      <div class=\"order-popover-status\" [ngClass]=\"statusClass(order.data.status)\">\n        {{ statusLabel(order.data.status) }}\n      </div>\n      <div class=\"order-popover-dates\">\n        <div><strong>Start:</strong> {{ orderDateLabel(order.data.startDate) }}</div>\n        <div><strong>End:</strong> {{ orderDateLabel(order.data.endDate) }}</div>\n      </div>\n      <div class=\"order-popover-actions\">\n        <button type=\"button\" (click)=\"onOrderPopoverEdit()\">Edit</button>\n        <button type=\"button\" class=\"danger\" (click)=\"onOrderPopoverDelete()\">Delete</button>\n      </div>\n    </div>\n  }\n</ng-template>\n\n<app-work-order-panel\n  [isOpen]=\"panelOpen()\"\n  [mode]=\"panelMode()\"\n  [workCenterName]=\"selectedWorkCenterName()\"\n  [workCenters]=\"workCenters()\"\n  [defaultWorkCenterId]=\"panelWorkCenterId()\"\n  [defaultStartDate]=\"panelDefaultStartDate()\"\n  [defaultEndDate]=\"panelDefaultEndDate()\"\n  [editingOrder]=\"editingOrder()\"\n  [overlapError]=\"panelOverlapError()\"\n  (closed)=\"onPanelClose()\"\n  (submitted)=\"onPanelSubmit($event)\"\n/>\n", styles: [".timeline-content {\n  margin: 0;\n  position: relative;\n}\n\n.notification-stack {\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n  z-index: 1200;\n  display: flex;\n  flex-direction: column;\n  gap: 0.625rem;\n  width: min(440px, calc(100vw - 2rem));\n  pointer-events: none;\n}\n\n.app-alert {\n  margin: 0;\n  pointer-events: none;\n  border: 1px solid rgba(204, 211, 236, 0.9);\n  border-radius: 14px;\n  background: linear-gradient(180deg, #ffffff 0%, #f9faff 100%);\n  color: #1f2a52;\n  font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  line-height: 1.4;\n  box-shadow:\n    0 8px 18px rgba(27, 39, 84, 0.14),\n    0 0 0 1px rgba(79, 93, 171, 0.04);\n  animation: notification-in 340ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.app-alert strong {\n  color: #111f4a;\n  font-weight: 600;\n}\n\n.app-alert--default {\n  border-left: 4px solid #4b57f5;\n}\n\n.app-alert--complete {\n  border-left: 4px solid #08a268;\n  background: linear-gradient(180deg, #f5fff9 0%, #eefcf4 100%);\n}\n\n.confetti-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 1150;\n  pointer-events: none;\n  overflow: hidden;\n}\n\n.confetti-piece {\n  --drift: 0px;\n  --rotation: 360deg;\n  position: absolute;\n  top: -12px;\n  border-radius: 2px;\n  opacity: 0;\n  animation-name: confetti-fall;\n  animation-timing-function: cubic-bezier(0.2, 0.72, 0.27, 1);\n  animation-fill-mode: forwards;\n}\n\n.work-order-title {\n  h1 {\n    margin: 0;\n    width: 142px;\n    height: 34px;\n    color: rgba(3, 9, 41, 1);\n    font-family: 'CircularStd-Medium', 'Circular-Std', 'Segoe UI', sans-serif;\n    font-size: 24px;\n    font-weight: 500;\n    font-style: normal;\n  }\n}\n\n.toolbar {\n  margin-top: 1.625rem;\n  margin-bottom: 1.125rem;\n}\n\n.toolbar-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  max-width: calc(100vw - 10rem);\n}\n\n.toolbar-controls {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  flex-wrap: wrap;\n}\n\n.timeline-create-btn {\n  height: 34px;\n  min-width: 68px;\n  border-radius: 9px;\n  border: 1px solid #4b57f5;\n  background: #4b57f5;\n  color: #ffffff;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 120ms ease;\n}\n\n.timeline-create-btn:hover {\n  background: #404de8;\n}\n\n.timescale-selector {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  height: 1.5625rem;\n  padding: 0;\n  box-sizing: border-box;\n  gap: 0;\n  border-radius: 0.3125rem;\n  background-color: #ffffff;\n  box-shadow: 1px 2.5px 3px -1.5px rgba(200, 207, 233, 1);\n}\n\n.timescale-label {\n  flex: 0 0 auto;\n  height: 100%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.3125rem 0.5rem;\n  background-color: rgba(241, 243, 248, 0.75);\n  color: #687196;\n  font-size: 0.8125rem;\n  font-weight: 400;\n  border-radius: 0.3125rem 0 0 0.3125rem;\n}\n\n.timescale-select {\n  flex: 0 0 auto;\n  width: auto;\n  height: 100%;\n}\n\n:host ::ng-deep .timescale-select.ng-select {\n  font-size: 0.8125rem;\n  width: auto;\n  position: static;\n\n\n  .ng-clear-wrapper {\n    display: none;\n  }\n\n  .ng-select-container {\n    min-height: 1.5625rem !important;\n    height: 1.5625rem !important;\n    border: 0 !important;\n    border-radius: 0 0.3125rem 0.3125rem 0;\n    background: #ffffff !important;\n    box-shadow: none !important;\n  }\n\n  .ng-value-container {\n    padding: 0.25rem 0 0.25rem 0.5rem !important;\n    justify-content: flex-start;\n    align-items: center;\n    overflow: visible !important;\n    box-sizing: border-box;\n  }\n\n  .ng-input {\n    padding: 0 !important;\n  }\n\n  .ng-value {\n    color: #3e40db !important;\n    font-size: 0.8125rem !important;\n    font-weight: 500;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    line-height: 1;\n    overflow: visible !important;\n    max-width: none !important;\n    height: 1rem;\n    display: inline-flex;\n    align-items: center;\n  }\n\n  .ng-value-label {\n    overflow: visible !important;\n    text-overflow: clip !important;\n    white-space: nowrap !important;\n  }\n\n  .ng-arrow-wrapper {\n    padding: 0 !important;\n    margin-left: 0.40625rem;\n    margin-right: 0.5rem;\n    display: inline-flex;\n    align-items: center;\n    width: auto !important;\n    height: 100%;\n  }\n\n  .ng-arrow {\n    border: 0 !important;\n    width: 0.5625rem;\n    height: 0.375rem;\n    background: url('/assets/images/Down.svg') center / contain no-repeat;\n    transform: rotate(0deg);\n    margin: 0 !important;\n  }\n\n  &.ng-select-opened .ng-arrow {\n    transform: rotate(180deg);\n  }\n}\n\n:host ::ng-deep .timescale-select.select--timescale.ng-select {\n  min-width: 4.4375rem;\n}\n\n:host ::ng-deep .timescale-select.select--year.ng-select {\n  min-width: 3.875rem;\n}\n\n:host ::ng-deep .timescale-select.select--month.ng-select {\n  min-width: 3.375rem;\n}\n\n:host ::ng-deep .timescale-select.ng-select .ng-dropdown-panel {\n  margin-top: 0.3125rem !important;\n  border: 0 !important;\n  border-radius: 0.3125rem;\n  background: #ffffff !important;\n  width: 12.5rem;\n  left: 0 !important;\n  box-shadow:\n    0 0 0 1px rgba(104, 113, 150, 0.1),\n    0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n    0 4.5px 5px -1px rgba(216, 220, 235, 1);\n  padding: 0.75rem !important;\n}\n\n:host ::ng-deep .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n  min-height: 1.75rem !important;\n  height: 1.75rem !important;\n  padding: 0.3125rem 0.75rem !important;\n  font-size: 0.875rem !important;\n  line-height: 1.125rem;\n  color: #2f3059;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n:host ::ng-deep .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n  background: #f3f5ff;\n}\n\n:host ::ng-deep .timescale-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n  color: #3e40db;\n  background: #ffffff;\n  font-weight: 400;\n}\n\n.timeline-shell {\n  position: relative;\n  max-width: calc(100vw - 10rem);\n  height: calc(100vh - 15.3125rem);\n  min-height: 32.5rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  border: 1px solid #d9deeb;\n  background: #ffffff;\n}\n\n.timeline-body {\n  display: flex;\n  min-width: 100%;\n}\n\n.timeline-left-pane {\n  flex: 0 0 23.75rem;\n  background: #ffffff;\n  z-index: 14;\n}\n\n.timeline-scroll-pane {\n  flex: 1 1 auto;\n  overflow-x: auto;\n  overflow-y: visible;\n  min-width: 0;\n}\n\n.timeline-right-pane {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n\n.timeline-right-header {\n  z-index: 13;\n}\n\n.timeline-grid {\n  position: relative;\n}\n\n.timeline-row {\n  position: relative;\n  display: flex;\n  height: 48px;\n  min-height: 48px;\n  border-bottom: 1px solid #dde2ef;\n}\n\n.timeline-row.row-hovered:not(.timeline-header-row) {\n  z-index: 16;\n}\n\n.timeline-scroll-pane .timeline-row:hover:not(.timeline-header-row) .track-cell {\n  background-color: rgba(238, 240, 255, 1);\n}\n\n.timeline-row.row-hovered:not(.timeline-header-row) .work-center-cell,\n.timeline-row.row-hovered:not(.timeline-header-row) .track-cell {\n  background-color: rgba(250, 251, 253, 1);\n}\n\n.timeline-row.row-hovered:not(.timeline-header-row) .track-cell {\n  background-color: rgba(238, 240, 255, 1);\n}\n\n.timeline-header-row {\n  position: sticky;\n  top: 0;\n  z-index: 12;\n  height: 48px;\n  min-height: 48px;\n  border-bottom: 1px solid #dde2ef;\n\n  .work-center-cell,\n  .track-cell {\n    background: #ffffff;\n  }\n}\n\n.work-center-cell {\n  box-sizing: border-box;\n  width: 23.75rem;\n  min-width: 23.75rem;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 1);\n  border-right: 1px solid #dde2ef;\n  display: flex;\n  align-items: center;\n  padding: 0 1.9375rem;\n  color: #030929;\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1rem;\n}\n\n.timeline-header-row .work-center-cell {\n  color: #8c95b2;\n  font-weight: 400;\n}\n\n.work-center-header-cell {\n  padding: 0;\n}\n\n.work-center-header-button {\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  color: #8c95b2;\n  font-size: 0.875rem;\n  font-weight: 400;\n  text-align: left;\n  padding: 0 1.9375rem;\n  cursor: pointer;\n}\n\n.track-cell {\n  position: relative;\n  height: 100%;\n  min-height: 0;\n  overflow: visible;\n}\n\n.header-track-viewport {\n  overflow: hidden;\n}\n\n.header-track-content {\n  position: relative;\n  height: 100%;\n  will-change: transform;\n}\n\n.header-column {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-right: 1px solid #dde2ef;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: #7b86a8;\n  font-size: 14px;\n}\n\n.header-column.current-header-column {\n  background: #5659ff;\n  color: #ffffff;\n}\n\n.header-column.current-header-column .header-label-date,\n.header-column.current-header-column .header-label-weekday {\n  color: #ffffff;\n}\n\n.header-label-date,\n.header-label-weekday {\n  line-height: 1.1;\n}\n\n.header-label-weekday {\n  font-size: 12px;\n  color: #8c95b2;\n}\n\n.track-column {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  border-right: 1px solid #e2e6f1;\n  pointer-events: none;\n}\n\n.today-guide {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  background: #c8ccff;\n  z-index: 5;\n  pointer-events: none;\n}\n\n.add-dates-slot {\n  position: absolute;\n  top: 5px;\n  width: 113px;\n  height: 38px;\n  border: 1px solid rgba(195, 199, 255, 1);\n  border-radius: 8px;\n  background-color: rgba(101, 112, 255, 0.1);\n  pointer-events: none;\n  z-index: 9;\n}\n\n.add-dates-hint {\n  position: absolute;\n  top: -31px;\n  transform: translateX(-50%);\n  background: #49516e;\n  color: #ffffff;\n  border-radius: 10px;\n  padding: 6px 10px;\n  font-size: 12px;\n  white-space: nowrap;\n  pointer-events: none;\n  z-index: 9999;\n}\n\n/* Keep the hint visible for the first data row where \"top: -31px\" can be\n   occluded by the sticky header/scroll container stacking. */\n.timeline-row.timeline-row--first .add-dates-hint {\n  top: 6px;\n}\n\n.work-order-card {\n  position: absolute;\n  top: 5px;\n  height: 38px;\n  border-radius: 8px;\n  border: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 8px 10px;\n  z-index: 6;\n  cursor: pointer;\n}\n\n.order-name {\n  width: 111px;\n  height: 18px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: rgba(3, 9, 41, 1);\n  font-family: 'CircularStd-Book', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 18px;\n}\n\n.order-name--no-status {\n  width: 100%;\n}\n\n.status-pill {\n  margin-left: auto;\n  height: 22px;\n  border-radius: 5px;\n  padding: 2px 8px;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-family: 'CircularStd-Book', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  white-space: nowrap;\n}\n\n.work-order-card.status-open {\n  box-shadow: 0 0 0 1px rgba(206, 251, 255, 1);\n  background-color: rgba(246, 255, 255, 1);\n}\n\n.status-pill.status-open {\n  min-width: 51px;\n  background-color: rgba(228, 253, 255, 1);\n  color: rgba(0, 176, 191, 1);\n  font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  text-align: center;\n}\n\n.work-order-card.status-in-progress {\n  box-shadow: 0 0 0 1px rgba(222, 224, 255, 1);\n  background-color: rgba(237, 238, 255, 1);\n}\n\n.status-pill.status-in-progress {\n  min-width: 87px;\n  background-color: rgba(214, 216, 255, 1);\n  color: rgba(62, 64, 219, 1);\n}\n\n.work-order-card.status-complete {\n  box-shadow: 0 0 0 1px rgba(209, 250, 179, 1);\n  background-color: rgba(248, 255, 243, 1);\n}\n\n.status-pill.status-complete {\n  min-width: 63px;\n  background-color: rgba(225, 255, 204, 1);\n  color: rgba(8, 162, 104, 1);\n}\n\n.work-order-card.status-blocked {\n  box-shadow: 0 0 0 1px rgba(255, 245, 207, 1);\n  background-color: rgba(255, 252, 241, 1);\n}\n\n.status-pill.status-blocked {\n  min-width: 67px;\n  background-color: rgba(252, 238, 181, 1);\n  color: rgba(177, 54, 0, 1);\n}\n\n::ng-deep .work-order-popover.popover {\n  --bs-popover-bg: #ffffff;\n  --bs-popover-border-color: #d7ddef;\n  --bs-popover-max-width: min(320px, calc(100vw - 24px));\n  --bs-popover-border-radius: 10px;\n  --bs-popover-header-bg: #ffffff;\n  --bs-popover-body-color: #1a233d;\n  --bs-popover-body-padding-x: 0;\n  --bs-popover-body-padding-y: 0;\n  --bs-popover-arrow-width: 1rem;\n  --bs-popover-arrow-height: 0.55rem;\n  box-shadow: 0 8px 20px rgba(34, 45, 76, 0.16);\n}\n\n::ng-deep .work-order-popover.popover .popover-body {\n  background: #ffffff;\n  border-radius: 10px;\n  padding: 10px;\n}\n\n.order-popover-content {\n  min-width: 230px;\n  max-width: min(320px, calc(100vw - 24px));\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.order-popover-name {\n  color: #172147;\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 1.25;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n\n.order-popover-status {\n  width: fit-content;\n  border-radius: 7px;\n  padding: 4px 10px;\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.order-popover-status.status-open {\n  color: #0085af;\n  background: #d2f1ff;\n}\n\n.order-popover-status.status-in-progress {\n  color: #4d58df;\n  background: #c6cbff;\n}\n\n.order-popover-status.status-complete {\n  color: #3aa05f;\n  background: #d9f2ca;\n}\n\n.order-popover-status.status-blocked {\n  color: #cd5b0d;\n  background: #f4df9a;\n}\n\n.order-popover-dates {\n  color: #5f6f95;\n  font-size: 13px;\n  line-height: 1.35;\n}\n\n.order-popover-dates strong {\n  color: #243056;\n}\n\n.order-popover-actions {\n  display: flex;\n  gap: 8px;\n\n  button {\n    border: 1px solid #d6deef;\n    border-radius: 6px;\n    padding: 6px 10px;\n    background: #ffffff;\n    color: #2a3170;\n    font-size: 13px;\n    font-weight: 500;\n    cursor: pointer;\n  }\n\n  button.danger {\n    color: #3340f2;\n  }\n}\n\n@media (max-width: 1024px) {\n  .timeline-shell {\n    max-width: calc(100vw - 32px);\n  }\n\n  .timeline-left-pane {\n    flex-basis: 17.5rem;\n  }\n\n  .work-center-cell {\n    width: 17.5rem;\n    min-width: 17.5rem;\n    padding: 0 16px;\n  }\n}\n\n@keyframes notification-in {\n  from {\n    transform: translate3d(24px, -12px, 0) scale(0.98);\n    opacity: 0;\n  }\n\n  to {\n    transform: translate3d(0, 0, 0) scale(1);\n    opacity: 1;\n  }\n}\n\n@keyframes confetti-fall {\n  0% {\n    transform: translate3d(0, -8vh, 0) rotate(0deg);\n    opacity: 0;\n  }\n\n  10% {\n    opacity: 1;\n  }\n\n  100% {\n    transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rotation));\n    opacity: 0;\n  }\n}\n"] }]
    }], () => [], { timelineScrollRef: [{
            type: ViewChild,
            args: ['timelineHorizontalScroll', { static: true }]
        }], headerTrackContentRef: [{
            type: ViewChild,
            args: ['headerTrackContent', { static: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WorkOrderTimelineComponent, { className: "WorkOrderTimelineComponent", filePath: "src/app/components/work-order-timeline/work-order-timeline.component.ts", lineNumber: 126 }); })();
