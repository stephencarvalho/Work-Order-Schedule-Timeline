import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerMonth, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { fromIsoDate, toIsoDate } from '../../utils/date-utils';
import { DATEPICKER_MONTH_OPTIONS, WORK_ORDER_STATUS_OPTIONS } from '../../work-order.constants';
import { DotDateParserFormatter } from './dot-date-parser-formatter';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "@ng-select/ng-select";
const _c0 = () => ({ standalone: true });
const _forTrack0 = ($index, $item) => $item.year + "-" + $item.month;
function WorkOrderPanelComponent_Conditional_0_Conditional_14_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 13);
    i0.ɵɵtext(1, "Work center is required.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 10)(1, "label", 24);
    i0.ɵɵtext(2, "Work center name");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ng-select", 25);
    i0.ɵɵlistener("ngModelChange", function WorkOrderPanelComponent_Conditional_0_Conditional_14_Template_ng_select_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onWorkCenterChange($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, WorkOrderPanelComponent_Conditional_0_Conditional_14_Conditional_4_Template, 2, 0, "small", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("items", ctx_r1.workCenters)("searchable", false)("clearable", false)("ngModel", ctx_r1.form.controls.workCenterId.value)("ngModelOptions", i0.ɵɵpureFunction0(6, _c0));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.hasFieldError("workCenterId") ? 4 : -1);
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10)(1, "label", 24);
    i0.ɵɵtext(2, "Work center name");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 26);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r1.workCenterName || "Not selected");
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 13);
    i0.ɵɵtext(1, "Name is required.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_ng_template_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = ctx.item;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngClass", ctx_r1.statusChipClass(item_r4.value));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r4.label);
} }
function WorkOrderPanelComponent_Conditional_0_ng_template_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r5 = ctx.item;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("status-option-label--selected", item_r5.value === ctx_r1.form.controls.status.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r5.label, " ");
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 13);
    i0.ɵɵtext(1, "Status is required.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 13);
    i0.ɵɵtext(1, "End date is required.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "small", 13);
    i0.ɵɵtext(1, "Start date is required.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 22);
    i0.ɵɵtext(1, "End date must be after start date.");
    i0.ɵɵelementEnd();
} }
function WorkOrderPanelComponent_Conditional_0_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.overlapError);
} }
function WorkOrderPanelComponent_Conditional_0_ng_template_44_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 37);
    i0.ɵɵelement(1, "ngb-datepicker-month", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const month_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("month", month_r10);
} }
function WorkOrderPanelComponent_Conditional_0_ng_template_44_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 29)(1, "button", 30);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_ng_template_44_Template_button_click_1_listener() { const datepicker_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.shiftPickerMonth(datepicker_r9, -1)); });
    i0.ɵɵelement(2, "span", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ng-select", 32);
    i0.ɵɵlistener("ngModelChange", function WorkOrderPanelComponent_Conditional_0_ng_template_44_Template_ng_select_ngModelChange_3_listener($event) { const datepicker_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPickerMonthChange(datepicker_r9, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ng-select", 33);
    i0.ɵɵlistener("ngModelChange", function WorkOrderPanelComponent_Conditional_0_ng_template_44_Template_ng_select_ngModelChange_4_listener($event) { const datepicker_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPickerYearChange(datepicker_r9, $event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 34);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_ng_template_44_Template_button_click_5_listener() { const datepicker_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.shiftPickerMonth(datepicker_r9, 1)); });
    i0.ɵɵelement(6, "span", 35);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 36);
    i0.ɵɵrepeaterCreate(8, WorkOrderPanelComponent_Conditional_0_ng_template_44_For_9_Template, 2, 1, "div", 37, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const datepicker_r9 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("items", ctx_r1.pickerMonthOptions)("searchable", false)("clearable", false)("ngModel", ctx_r1.pickerMonth(datepicker_r9))("ngModelOptions", i0.ɵɵpureFunction0(10, _c0));
    i0.ɵɵadvance();
    i0.ɵɵproperty("items", ctx_r1.pickerYearOptions)("searchable", false)("clearable", false)("ngModel", ctx_r1.pickerYear(datepicker_r9))("ngModelOptions", i0.ɵɵpureFunction0(11, _c0));
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(datepicker_r9.state.months);
} }
function WorkOrderPanelComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelementStart(1, "aside", 4);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_aside_click_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "header", 5)(3, "div")(4, "h2");
    i0.ɵɵtext(5, "Work Order Details");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7, "Specify the dates, name and status for this order");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 6)(9, "button", 7);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(10, "Cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 8);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmit()); });
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(13, "form", 9);
    i0.ɵɵlistener("ngSubmit", function WorkOrderPanelComponent_Conditional_0_Template_form_ngSubmit_13_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onSubmit()); });
    i0.ɵɵconditionalCreate(14, WorkOrderPanelComponent_Conditional_0_Conditional_14_Template, 5, 7, "div", 10)(15, WorkOrderPanelComponent_Conditional_0_Conditional_15_Template, 4, 1, "div", 10);
    i0.ɵɵelementStart(16, "div", 10)(17, "label", 11);
    i0.ɵɵtext(18, "Work Order Name");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(19, "input", 12);
    i0.ɵɵconditionalCreate(20, WorkOrderPanelComponent_Conditional_0_Conditional_20_Template, 2, 0, "small", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "div", 10)(22, "label", 14);
    i0.ɵɵtext(23, "Status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "ng-select", 15);
    i0.ɵɵtemplate(25, WorkOrderPanelComponent_Conditional_0_ng_template_25_Template, 2, 2, "ng-template", 16)(26, WorkOrderPanelComponent_Conditional_0_ng_template_26_Template, 2, 3, "ng-template", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(27, WorkOrderPanelComponent_Conditional_0_Conditional_27_Template, 2, 0, "small", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div", 10)(29, "label", 18);
    i0.ɵɵtext(30, "End date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "input", 19, 0);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_input_click_31_listener() { i0.ɵɵrestoreView(_r1); const endDatePicker_r6 = i0.ɵɵreference(32); return i0.ɵɵresetView(endDatePicker_r6.toggle()); });
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(33, WorkOrderPanelComponent_Conditional_0_Conditional_33_Template, 2, 0, "small", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div", 10)(35, "label", 20);
    i0.ɵɵtext(36, "Start date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(37, "input", 21, 1);
    i0.ɵɵlistener("click", function WorkOrderPanelComponent_Conditional_0_Template_input_click_37_listener() { i0.ɵɵrestoreView(_r1); const startDatePicker_r7 = i0.ɵɵreference(38); return i0.ɵɵresetView(startDatePicker_r7.toggle()); });
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(39, WorkOrderPanelComponent_Conditional_0_Conditional_39_Template, 2, 0, "small", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(40, WorkOrderPanelComponent_Conditional_0_Conditional_40_Template, 2, 0, "p", 22);
    i0.ɵɵconditionalCreate(41, WorkOrderPanelComponent_Conditional_0_Conditional_41_Template, 2, 1, "p", 22);
    i0.ɵɵelementStart(42, "button", 23);
    i0.ɵɵtext(43, "Submit");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(44, WorkOrderPanelComponent_Conditional_0_ng_template_44_Template, 10, 12, "ng-template", null, 2, i0.ɵɵtemplateRefExtractor);
} if (rf & 2) {
    const datepickerContent_r11 = i0.ɵɵreference(45);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("panel-overlay--closing", ctx_r1.isPanelClosing);
    i0.ɵɵadvance(12);
    i0.ɵɵtextInterpolate(ctx_r1.actionLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.mode === "create" && !ctx_r1.defaultWorkCenterId ? 14 : 15);
    i0.ɵɵadvance(6);
    i0.ɵɵconditional(ctx_r1.hasFieldError("name") ? 20 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("items", ctx_r1.statuses)("searchable", false)("clearable", false);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.hasFieldError("status") ? 27 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("contentTemplate", datepickerContent_r11);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.hasFieldError("endDate") ? 33 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("contentTemplate", datepickerContent_r11);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.hasFieldError("startDate") ? 39 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r1.form.errors == null ? null : ctx_r1.form.errors["invalidRange"]) ? 40 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.overlapError ? 41 : -1);
} }
function isRangeValid(control) {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;
    if (!start || !end) {
        return null;
    }
    const startDate = new Date(start.year, start.month - 1, start.day);
    const endDate = new Date(end.year, end.month - 1, end.day);
    return endDate >= startDate ? null : { invalidRange: true };
}
export class WorkOrderPanelComponent {
    constructor() {
        this.isOpen = false;
        this.mode = 'create';
        this.workCenterName = '';
        this.workCenters = [];
        this.defaultWorkCenterId = null;
        this.overlapError = null;
        this.defaultStartDate = '';
        this.defaultEndDate = '';
        this.editingOrder = null;
        this.closed = new EventEmitter();
        this.submitted = new EventEmitter();
        this.statuses = WORK_ORDER_STATUS_OPTIONS;
        this.pickerMonthOptions = DATEPICKER_MONTH_OPTIONS;
        this.pickerYearOptions = Array.from({ length: 61 }, (_, index) => 2000 + index);
        this.closeAnimationMs = 240;
        this.isPanelVisible = false;
        this.isPanelClosing = false;
        this.closeAnimationTimeoutId = null;
        this.formBuilder = inject(FormBuilder);
        this.form = this.formBuilder.group({
            name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(70)]),
            workCenterId: this.formBuilder.control(null, Validators.required),
            status: this.formBuilder.nonNullable.control('open', Validators.required),
            startDate: this.formBuilder.control(null, Validators.required),
            endDate: this.formBuilder.control(null, Validators.required)
        }, {
            validators: [isRangeValid]
        });
    }
    ngOnChanges(changes) {
        if (changes['isOpen']) {
            if (this.closeAnimationTimeoutId !== null) {
                window.clearTimeout(this.closeAnimationTimeoutId);
                this.closeAnimationTimeoutId = null;
            }
            if (this.isOpen) {
                this.isPanelVisible = true;
                this.isPanelClosing = false;
            }
            else if (this.isPanelVisible) {
                this.isPanelClosing = true;
                this.closeAnimationTimeoutId = window.setTimeout(() => {
                    this.isPanelVisible = false;
                    this.isPanelClosing = false;
                    this.closeAnimationTimeoutId = null;
                }, this.closeAnimationMs);
            }
        }
        if (!this.isOpen) {
            return;
        }
        if (changes['isOpen'] ||
            changes['editingOrder'] ||
            changes['defaultStartDate'] ||
            changes['defaultEndDate'] ||
            changes['defaultWorkCenterId']) {
            this.resetFormValues();
        }
    }
    ngOnDestroy() {
        if (this.closeAnimationTimeoutId !== null) {
            window.clearTimeout(this.closeAnimationTimeoutId);
            this.closeAnimationTimeoutId = null;
        }
    }
    onClose() {
        this.closed.emit();
    }
    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const trimmedName = this.form.controls.name.value.trim();
        if (!trimmedName) {
            this.form.controls.name.setErrors({ required: true });
            this.form.controls.name.markAsTouched();
            return;
        }
        const start = this.form.controls.startDate.value;
        const end = this.form.controls.endDate.value;
        const workCenterId = this.form.controls.workCenterId.value;
        if (!start || !end || !workCenterId) {
            return;
        }
        const payload = {
            name: trimmedName,
            workCenterId,
            status: this.form.controls.status.value,
            startDate: toIsoDate(new Date(start.year, start.month - 1, start.day)),
            endDate: toIsoDate(new Date(end.year, end.month - 1, end.day)),
        };
        this.submitted.emit({
            payload,
            existingOrderId: this.mode === 'edit' ? this.editingOrder?.docId : undefined
        });
    }
    hasFieldError(fieldName) {
        const field = this.form.get(fieldName);
        return !!field && field.invalid && (field.touched || field.dirty);
    }
    get actionLabel() {
        return this.mode === 'edit' ? 'Save' : 'Create';
    }
    statusChipClass(status) {
        return `chip-${status}`;
    }
    onWorkCenterChange(workCenterId) {
        this.form.controls.workCenterId.setValue(workCenterId);
        this.form.controls.workCenterId.markAsDirty();
        this.form.controls.workCenterId.markAsTouched();
    }
    pickerMonth(datepicker) {
        return this.getPickerAnchor(datepicker).month;
    }
    pickerYear(datepicker) {
        return this.getPickerAnchor(datepicker).year;
    }
    onPickerMonthChange(datepicker, month) {
        const anchor = this.getPickerAnchor(datepicker);
        datepicker.navigateTo({ year: anchor.year, month, day: 1 });
    }
    onPickerYearChange(datepicker, year) {
        const anchor = this.getPickerAnchor(datepicker);
        datepicker.navigateTo({ year, month: anchor.month, day: 1 });
    }
    shiftPickerMonth(datepicker, offset) {
        const anchor = this.getPickerAnchor(datepicker);
        const shifted = new Date(anchor.year, anchor.month - 1 + offset, 1);
        datepicker.navigateTo({ year: shifted.getFullYear(), month: shifted.getMonth() + 1, day: 1 });
    }
    resetFormValues() {
        const resolvedStartDate = (this.mode === 'edit' && this.editingOrder
            ? this.toDateStruct(this.editingOrder.data.startDate)
            : this.toDateStruct(this.defaultStartDate)) ?? null;
        const resolvedEndDate = (this.mode === 'edit' && this.editingOrder
            ? this.toDateStruct(this.editingOrder.data.endDate)
            : this.toDateStruct(this.defaultEndDate)) ?? null;
        if (this.mode === 'edit' && this.editingOrder) {
            this.form.reset({
                name: this.editingOrder.data.name,
                workCenterId: this.editingOrder.data.workCenterId,
                status: this.editingOrder.data.status,
                startDate: resolvedStartDate,
                endDate: resolvedEndDate
            });
            this.form.markAsPristine();
            return;
        }
        this.form.reset({
            name: '',
            workCenterId: this.defaultWorkCenterId ?? null,
            status: 'open',
            startDate: resolvedStartDate,
            endDate: resolvedEndDate
        });
        this.form.markAsPristine();
    }
    toDateStruct(value) {
        if (!value) {
            return null;
        }
        const date = fromIsoDate(value);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }
    getPickerAnchor(datepicker) {
        const firstDate = datepicker.state.firstDate;
        if (firstDate) {
            return { year: firstDate.year, month: firstDate.month, day: firstDate.day };
        }
        const today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            day: today.getDate()
        };
    }
    static { this.ɵfac = function WorkOrderPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WorkOrderPanelComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WorkOrderPanelComponent, selectors: [["app-work-order-panel"]], inputs: { isOpen: "isOpen", mode: "mode", workCenterName: "workCenterName", workCenters: "workCenters", defaultWorkCenterId: "defaultWorkCenterId", overlapError: "overlapError", defaultStartDate: "defaultStartDate", defaultEndDate: "defaultEndDate", editingOrder: "editingOrder" }, outputs: { closed: "closed", submitted: "submitted" }, features: [i0.ɵɵProvidersFeature([{ provide: NgbDateParserFormatter, useClass: DotDateParserFormatter }]), i0.ɵɵNgOnChangesFeature], decls: 1, vars: 1, consts: [["endDatePicker", "ngbDatepicker"], ["startDatePicker", "ngbDatepicker"], ["datepickerContent", ""], [1, "panel-overlay", 3, "click"], [1, "panel", 3, "click"], [1, "panel-header"], [1, "header-actions"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "button", 1, "btn", "btn-primary", 3, "click"], ["novalidate", "", 1, "panel-form", 3, "ngSubmit", "formGroup"], [1, "field-group"], ["for", "work-order-name"], ["id", "work-order-name", "type", "text", "formControlName", "name", "placeholder", "Acme Inc.", 1, "text-input"], [1, "field-error"], ["for", "work-order-status"], ["id", "work-order-status", "bindLabel", "label", "bindValue", "value", "formControlName", "status", 1, "status-select", 3, "items", "searchable", "clearable"], ["ng-label-tmp", ""], ["ng-option-tmp", ""], ["for", "work-order-end-date"], ["id", "work-order-end-date", "placeholder", "mm.dd.yyyy", "formControlName", "endDate", "ngbDatepicker", "", "navigation", "none", 1, "text-input", "form-control", 3, "click", "contentTemplate"], ["for", "work-order-start-date"], ["id", "work-order-start-date", "placeholder", "mm.dd.yyyy", "formControlName", "startDate", "ngbDatepicker", "", "navigation", "none", 1, "text-input", "form-control", 3, "click", "contentTemplate"], [1, "panel-error"], ["type", "submit", 1, "hidden-submit"], ["for", "work-center-name"], ["id", "work-center-name", "bindLabel", "data.name", "bindValue", "docId", "placeholder", "Select work center", 1, "work-center-select", 3, "ngModelChange", "items", "searchable", "clearable", "ngModel", "ngModelOptions"], ["id", "work-center-name", "type", "text", "disabled", "", 1, "text-input", 3, "value"], [1, "status-chip", 3, "ngClass"], [1, "status-option-label"], [1, "datepicker-custom-header"], ["type", "button", "aria-label", "Previous month", 1, "datepicker-nav-button", 3, "click"], ["aria-hidden", "true", 1, "datepicker-chevron", "datepicker-chevron--left"], ["bindLabel", "label", "bindValue", "value", 1, "datepicker-nav-select", "datepicker-nav-select--month", 3, "ngModelChange", "items", "searchable", "clearable", "ngModel", "ngModelOptions"], [1, "datepicker-nav-select", "datepicker-nav-select--year", 3, "ngModelChange", "items", "searchable", "clearable", "ngModel", "ngModelOptions"], ["type", "button", "aria-label", "Next month", 1, "datepicker-nav-button", 3, "click"], ["aria-hidden", "true", 1, "datepicker-chevron", "datepicker-chevron--right"], [1, "ngb-dp-months"], [1, "ngb-dp-month"], [3, "month"]], template: function WorkOrderPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, WorkOrderPanelComponent_Conditional_0_Template, 46, 16);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isPanelVisible ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, ReactiveFormsModule, i2.ɵNgNoValidate, i2.DefaultValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.FormGroupDirective, i2.FormControlName, FormsModule, i2.NgModel, NgSelectModule, i3.NgSelectComponent, i3.NgOptionTemplateDirective, i3.NgLabelTemplateDirective, NgbInputDatepicker, NgbDatepickerMonth], styles: [".panel-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 60;\n  display: flex;\n  justify-content: flex-end;\n  background: rgba(10, 17, 42, 0.18);\n  animation: _ngcontent-%COMP%_fade-in 140ms ease-out;\n}\n\n.panel[_ngcontent-%COMP%] {\n  width: min(100vw, 590px);\n  height: 100%;\n  background: #ffffff;\n  border-left: 1px solid #d8deef;\n  box-shadow: -8px 0 24px rgba(34, 45, 76, 0.1);\n  display: flex;\n  flex-direction: column;\n  will-change: transform;\n  animation: _ngcontent-%COMP%_slide-in 240ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.panel-overlay--closing[_ngcontent-%COMP%] {\n  pointer-events: none;\n  animation: _ngcontent-%COMP%_fade-out 180ms ease-in forwards;\n}\n\n.panel-overlay--closing[_ngcontent-%COMP%]   .panel[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slide-out 220ms cubic-bezier(0.4, 0, 1, 1) forwards;\n}\n\n.panel-header[_ngcontent-%COMP%] {\n  padding: 20px 22px 16px;\n  border-bottom: 1px solid #d8deef;\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n\n  h2 {\n    margin: 0;\n    font-size: 20px;\n    line-height: 1.25;\n    font-weight: 500;\n    color: #212a56;\n  }\n\n  p {\n    margin: 6px 0 0;\n    font-size: 16px;\n    color: #626f95;\n  }\n}\n\n.header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n\n.btn[_ngcontent-%COMP%] {\n  height: 34px;\n  min-width: 68px;\n  border-radius: 9px;\n  border: 1px solid #d8deef;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.btn-secondary[_ngcontent-%COMP%] {\n  background: #ffffff;\n  color: #2f3861;\n\n  &:hover {\n    background: #f5f7ff;\n  }\n}\n\n.btn-primary[_ngcontent-%COMP%] {\n  background: #4b57f5;\n  border-color: #4b57f5;\n  color: #ffffff;\n\n  &:hover {\n    background: #404de8;\n  }\n}\n\n.panel-form[_ngcontent-%COMP%] {\n  padding: 22px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n\n.field-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n\n  label {\n    font-size: 14px;\n    color: #596487;\n  }\n}\n\n.text-input[_ngcontent-%COMP%] {\n  height: 38px;\n  border-radius: 6px;\n  border: 1px solid #bec8df;\n  padding: 0 12px;\n  background: #ffffff;\n  color: #1e2648;\n  font-size: 15px;\n  transition: border-color 120ms ease, box-shadow 120ms ease;\n\n  &:focus-visible {\n    outline: none;\n    border-color: #8c97ff;\n    box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n  }\n\n  &::placeholder {\n    color: #9aa3bf;\n  }\n\n  &:disabled {\n    background: #f3f5fb;\n    border-color: #d8deef;\n    color: #8d97b6;\n    cursor: not-allowed;\n    opacity: 1;\n  }\n}\n\n[_nghost-%COMP%]     {\n  .status-select {\n    .ng-select-container {\n      min-height: 38px;\n      border-radius: 6px;\n      border-color: #bec8df;\n      box-shadow: none;\n\n      .ng-value-container {\n        padding-left: 10px;\n      }\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n    }\n  }\n\n  .work-center-select {\n    .ng-select-container {\n      min-height: 38px;\n      border-radius: 6px;\n      border-color: #bec8df;\n      box-shadow: none;\n\n      .ng-value-container {\n        padding-left: 10px;\n      }\n\n      .ng-placeholder {\n        color: #9aa3bf;\n        font-size: 15px;\n        font-weight: 400;\n        line-height: 38px;\n        font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n      }\n\n      .ng-value {\n        color: rgba(3, 9, 41, 1);\n        font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n        font-size: 14px;\n        font-weight: 500;\n        line-height: 16px;\n      }\n\n      .ng-value-label {\n        color: rgba(3, 9, 41, 1);\n        font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n        font-size: 14px;\n        font-weight: 500;\n        line-height: 16px;\n      }\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n    }\n  }\n\n  .ng-dropdown-panel {\n    border-radius: 8px;\n    border: 1px solid #d8deef;\n    box-shadow: 0 6px 20px rgba(33, 42, 86, 0.14);\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n    min-height: 40px;\n    display: flex;\n    align-items: center;\n    padding: 0 12px;\n    font-size: 14px;\n    color: #1e2648;\n    font-weight: 400;\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n    background: #f3f5ff;\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n    color: rgba(62, 64, 219, 1);\n    background: #ffffff;\n  }\n\n  .status-option-label {\n    display: inline-block;\n    width: 150px;\n    height: 18px;\n    color: #1e2648;\n    font-size: 14px;\n    font-weight: 400;\n    font-style: normal;\n    line-height: 18px;\n  }\n\n  .status-option-label--selected {\n    color: rgba(62, 64, 219, 1);\n    font-family: 'CircularStd-Book', sans-serif;\n    font-weight: 400;\n  }\n\n  .ngb-dp-popup {\n    z-index: 80;\n    margin-top: 8px;\n    border: 1px solid #c9d1e6;\n    border-radius: 14px;\n    background: #ffffff;\n    box-shadow:\n      0 0 0 1px rgba(104, 113, 150, 0.08),\n      0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n      0 12px 28px rgba(35, 47, 92, 0.16);\n    overflow: visible;\n    width: max-content;\n    min-width: 0;\n  }\n\n  \n\n\n  ngb-datepicker {\n    display: inline-block;\n    border: 1px solid #c9d1e6;\n    border-radius: 14px;\n    background: #ffffff;\n    box-shadow:\n      0 0 0 1px rgba(104, 113, 150, 0.08),\n      0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n      0 12px 28px rgba(35, 47, 92, 0.16);\n    overflow: visible;\n    width: max-content;\n    min-width: 0;\n  }\n\n  ngb-datepicker.dropdown-menu {\n    border: 0;\n    border-radius: 14px;\n    padding: 0;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    color: #1e2648;\n    overflow: visible;\n    background: #ffffff;\n    width: max-content;\n    min-width: 0;\n  }\n\n  .dropdown-menu.show ngb-datepicker {\n    margin-top: 8px;\n  }\n\n  .ngb-dp-header {\n    display: none;\n  }\n\n  .datepicker-custom-header {\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n    gap: 6px;\n    padding: 6px 8px 8px;\n    border-bottom: 1px solid #d9deeb;\n    background: #ffffff;\n  }\n\n  .datepicker-nav-button {\n    width: 30px;\n    height: 30px;\n    flex: 0 0 30px;\n    border: 0;\n    border-radius: 8px;\n    background: transparent;\n    color: #4b57f5;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n  }\n\n  .datepicker-nav-button:hover {\n    background: #f3f5ff;\n  }\n\n  .datepicker-chevron {\n    width: 10px;\n    height: 10px;\n    border-top: 2px solid currentColor;\n    border-right: 2px solid currentColor;\n    display: inline-block;\n  }\n\n  .datepicker-chevron--left {\n    transform: rotate(-135deg);\n  }\n\n  .datepicker-chevron--right {\n    transform: rotate(45deg);\n  }\n\n  .datepicker-nav-select {\n    height: 34px;\n  }\n\n  .datepicker-nav-select.datepicker-nav-select--month {\n    width: 68px;\n  }\n\n  .datepicker-nav-select.datepicker-nav-select--year {\n    width: 82px;\n  }\n\n  .datepicker-nav-select.ng-select {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n\n    .ng-clear-wrapper {\n      display: none;\n    }\n\n    .ng-select-container {\n      min-height: 34px !important;\n      height: 34px !important;\n      border: 1px solid #bec8df !important;\n      border-radius: 10px;\n      background: #ffffff !important;\n      box-shadow: 1px 2.5px 3px -1.5px rgba(200, 207, 233, 1) !important;\n    }\n\n    .ng-value-container {\n      padding-left: 8px !important;\n      padding-right: 0 !important;\n      align-items: center;\n    }\n\n    .ng-value {\n      color: #3e40db;\n      font-size: 14px !important;\n      font-weight: 500;\n    }\n\n    .ng-arrow-wrapper {\n      padding-right: 6px;\n      padding-left: 2px;\n    }\n\n    .ng-arrow {\n      border: 0 !important;\n      width: 9px;\n      height: 6px;\n      background: url('/assets/images/Down.svg') center / contain no-repeat;\n      margin: 0 !important;\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff !important;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35) !important;\n    }\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel {\n    margin-top: 6px !important;\n    border-radius: 8px;\n    border: 1px solid #d8deef;\n    box-shadow: 0 6px 20px rgba(33, 42, 86, 0.14);\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n    min-height: 34px !important;\n    display: flex;\n    align-items: center;\n    padding: 0 12px !important;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    font-size: 14px;\n    color: #1e2648;\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n    color: #3e40db;\n    background: #ffffff;\n    font-weight: 400;\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n    background: #eef2ff;\n  }\n\n  .ngb-dp-weekdays {\n    background: #ffffff;\n    border-bottom: 1px solid #d9deeb;\n    margin-bottom: 4px;\n  }\n\n  .ngb-dp-weekday {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    color: #4b57f5;\n    font-style: italic;\n    font-weight: 600;\n    font-size: 15px;\n  }\n\n  .ngb-dp-day,\n  .ngb-dp-week-number,\n  .ngb-dp-weekday-number {\n    width: 2.2rem;\n    height: 2.2rem;\n  }\n\n  .ngb-dp-day .btn-light {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    width: 2.2rem;\n    height: 2.2rem;\n    border-radius: 9px;\n    border: 0;\n    color: #232733;\n    font-size: 18px;\n    font-weight: 500;\n    background: transparent;\n    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;\n  }\n\n  .ngb-dp-day .btn-light:hover {\n    background: #eef1ff;\n    color: #2e3ba8;\n  }\n\n  .ngb-dp-day .btn-light.text-muted,\n  .ngb-dp-day .btn-light.outside {\n    color: #a8acb3;\n  }\n\n  .ngb-dp-day .btn-light.bg-primary,\n  .ngb-dp-day .btn-light.btn-primary {\n    background: #4b57f5 !important;\n    color: #ffffff !important;\n    box-shadow: 0 4px 12px rgba(75, 87, 245, 0.3);\n  }\n\n  .ngb-dp-content {\n    padding: 4px 8px 8px;\n  }\n\n  .ngb-dp-month:first-child .ngb-dp-week {\n    padding-left: 0;\n  }\n\n  .ngb-dp-month:last-child .ngb-dp-week {\n    padding-right: 0;\n  }\n\n}\n\n.status-chip[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  padding: 2px 10px;\n  font-size: 14px;\n  font-weight: 500;\n  display: inline-flex;\n  align-items: center;\n}\n\n.chip-open[_ngcontent-%COMP%] {\n  color: #0088af;\n  background: #d5f2fe;\n}\n\n.chip-in-progress[_ngcontent-%COMP%] {\n  color: #4d58df;\n  background: #ccd0ff;\n}\n\n.chip-complete[_ngcontent-%COMP%] {\n  color: #3d9a5f;\n  background: #d9f2c9;\n}\n\n.chip-blocked[_ngcontent-%COMP%] {\n  color: #cd5b0d;\n  background: #f4df9a;\n}\n\n.field-error[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #b42318;\n}\n\n.panel-error[_ngcontent-%COMP%] {\n  margin: 0;\n  border: 1px solid #ffb8ad;\n  border-radius: 8px;\n  background: #ffefec;\n  color: #9f2d20;\n  font-size: 13px;\n  padding: 10px;\n}\n\n.hidden-submit[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.field-group[_ngcontent-%COMP%]   .text-input[ngbDatepicker][_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n\n@keyframes _ngcontent-%COMP%_fade-in {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes _ngcontent-%COMP%_slide-in {\n  from {\n    transform: translateX(100%);\n  }\n\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes _ngcontent-%COMP%_fade-out {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes _ngcontent-%COMP%_slide-out {\n  from {\n    transform: translateX(0);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n\n@media (max-width: 900px) {\n  .panel[_ngcontent-%COMP%] {\n    width: 100vw;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WorkOrderPanelComponent, [{
        type: Component,
        args: [{ selector: 'app-work-order-panel', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgbInputDatepicker, NgbDatepickerMonth], providers: [{ provide: NgbDateParserFormatter, useClass: DotDateParserFormatter }], template: "@if (isPanelVisible) {\n  <div class=\"panel-overlay\" [class.panel-overlay--closing]=\"isPanelClosing\" (click)=\"onClose()\">\n    <aside class=\"panel\" (click)=\"$event.stopPropagation()\">\n      <header class=\"panel-header\">\n        <div>\n          <h2>Work Order Details</h2>\n          <p>Specify the dates, name and status for this order</p>\n        </div>\n        <div class=\"header-actions\">\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onClose()\">Cancel</button>\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"onSubmit()\">{{ actionLabel }}</button>\n        </div>\n      </header>\n\n      <form class=\"panel-form\" [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\" novalidate>\n        @if (mode === 'create' && !defaultWorkCenterId) {\n          <div class=\"field-group\">\n            <label for=\"work-center-name\">Work center name</label>\n            <ng-select\n              id=\"work-center-name\"\n              class=\"work-center-select\"\n              [items]=\"workCenters\"\n              bindLabel=\"data.name\"\n              bindValue=\"docId\"\n              [searchable]=\"false\"\n              [clearable]=\"false\"\n              [ngModel]=\"form.controls.workCenterId.value\"\n              [ngModelOptions]=\"{ standalone: true }\"\n              (ngModelChange)=\"onWorkCenterChange($event)\"\n              placeholder=\"Select work center\"\n            ></ng-select>\n            @if (hasFieldError('workCenterId')) {\n              <small class=\"field-error\">Work center is required.</small>\n            }\n          </div>\n        } @else {\n          <div class=\"field-group\">\n            <label for=\"work-center-name\">Work center name</label>\n            <input\n              id=\"work-center-name\"\n              class=\"text-input\"\n              type=\"text\"\n              [value]=\"workCenterName || 'Not selected'\"\n              disabled\n            >\n          </div>\n        }\n\n        <div class=\"field-group\">\n          <label for=\"work-order-name\">Work Order Name</label>\n          <input id=\"work-order-name\" class=\"text-input\" type=\"text\" formControlName=\"name\" placeholder=\"Acme Inc.\">\n          @if (hasFieldError('name')) {\n            <small class=\"field-error\">Name is required.</small>\n          }\n        </div>\n\n        <div class=\"field-group\">\n          <label for=\"work-order-status\">Status</label>\n          <ng-select\n            id=\"work-order-status\"\n            class=\"status-select\"\n            [items]=\"statuses\"\n            bindLabel=\"label\"\n            bindValue=\"value\"\n            [searchable]=\"false\"\n            [clearable]=\"false\"\n            formControlName=\"status\"\n          >\n            <ng-template ng-label-tmp let-item=\"item\">\n              <span class=\"status-chip\" [ngClass]=\"statusChipClass(item.value)\">{{ item.label }}</span>\n            </ng-template>\n            <ng-template ng-option-tmp let-item=\"item\">\n              <span\n                class=\"status-option-label\"\n                [class.status-option-label--selected]=\"item.value === form.controls.status.value\"\n              >\n                {{ item.label }}\n              </span>\n            </ng-template>\n          </ng-select>\n          @if (hasFieldError('status')) {\n            <small class=\"field-error\">Status is required.</small>\n          }\n        </div>\n\n        <div class=\"field-group\">\n          <label for=\"work-order-end-date\">End date</label>\n          <input\n            id=\"work-order-end-date\"\n            class=\"text-input form-control\"\n            placeholder=\"mm.dd.yyyy\"\n            formControlName=\"endDate\"\n            ngbDatepicker\n            navigation=\"none\"\n            [contentTemplate]=\"datepickerContent\"\n            #endDatePicker=\"ngbDatepicker\"\n            (click)=\"endDatePicker.toggle()\"\n          >\n          @if (hasFieldError('endDate')) {\n            <small class=\"field-error\">End date is required.</small>\n          }\n        </div>\n\n        <div class=\"field-group\">\n          <label for=\"work-order-start-date\">Start date</label>\n          <input\n            id=\"work-order-start-date\"\n            class=\"text-input form-control\"\n            placeholder=\"mm.dd.yyyy\"\n            formControlName=\"startDate\"\n            ngbDatepicker\n            navigation=\"none\"\n            [contentTemplate]=\"datepickerContent\"\n            #startDatePicker=\"ngbDatepicker\"\n            (click)=\"startDatePicker.toggle()\"\n          >\n          @if (hasFieldError('startDate')) {\n            <small class=\"field-error\">Start date is required.</small>\n          }\n        </div>\n\n        @if (form.errors?.['invalidRange']) {\n          <p class=\"panel-error\">End date must be after start date.</p>\n        }\n\n        @if (overlapError) {\n          <p class=\"panel-error\">{{ overlapError }}</p>\n        }\n\n        <button type=\"submit\" class=\"hidden-submit\">Submit</button>\n      </form>\n    </aside>\n  </div>\n\n  <ng-template #datepickerContent let-datepicker>\n    <div class=\"datepicker-custom-header\">\n      <button\n        type=\"button\"\n        class=\"datepicker-nav-button\"\n        aria-label=\"Previous month\"\n        (click)=\"shiftPickerMonth(datepicker, -1)\"\n      >\n        <span class=\"datepicker-chevron datepicker-chevron--left\" aria-hidden=\"true\"></span>\n      </button>\n\n      <ng-select\n        class=\"datepicker-nav-select datepicker-nav-select--month\"\n        [items]=\"pickerMonthOptions\"\n        bindLabel=\"label\"\n        bindValue=\"value\"\n        [searchable]=\"false\"\n        [clearable]=\"false\"\n        [ngModel]=\"pickerMonth(datepicker)\"\n        [ngModelOptions]=\"{ standalone: true }\"\n        (ngModelChange)=\"onPickerMonthChange(datepicker, $event)\"\n      ></ng-select>\n\n      <ng-select\n        class=\"datepicker-nav-select datepicker-nav-select--year\"\n        [items]=\"pickerYearOptions\"\n        [searchable]=\"false\"\n        [clearable]=\"false\"\n        [ngModel]=\"pickerYear(datepicker)\"\n        [ngModelOptions]=\"{ standalone: true }\"\n        (ngModelChange)=\"onPickerYearChange(datepicker, $event)\"\n      ></ng-select>\n\n      <button\n        type=\"button\"\n        class=\"datepicker-nav-button\"\n        aria-label=\"Next month\"\n        (click)=\"shiftPickerMonth(datepicker, 1)\"\n      >\n        <span class=\"datepicker-chevron datepicker-chevron--right\" aria-hidden=\"true\"></span>\n      </button>\n    </div>\n\n    <div class=\"ngb-dp-months\">\n      @for (month of datepicker.state.months; track month.year + '-' + month.month) {\n        <div class=\"ngb-dp-month\">\n          <ngb-datepicker-month [month]=\"month\" />\n        </div>\n      }\n    </div>\n  </ng-template>\n}\n", styles: [".panel-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 60;\n  display: flex;\n  justify-content: flex-end;\n  background: rgba(10, 17, 42, 0.18);\n  animation: fade-in 140ms ease-out;\n}\n\n.panel {\n  width: min(100vw, 590px);\n  height: 100%;\n  background: #ffffff;\n  border-left: 1px solid #d8deef;\n  box-shadow: -8px 0 24px rgba(34, 45, 76, 0.1);\n  display: flex;\n  flex-direction: column;\n  will-change: transform;\n  animation: slide-in 240ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.panel-overlay--closing {\n  pointer-events: none;\n  animation: fade-out 180ms ease-in forwards;\n}\n\n.panel-overlay--closing .panel {\n  animation: slide-out 220ms cubic-bezier(0.4, 0, 1, 1) forwards;\n}\n\n.panel-header {\n  padding: 20px 22px 16px;\n  border-bottom: 1px solid #d8deef;\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n\n  h2 {\n    margin: 0;\n    font-size: 20px;\n    line-height: 1.25;\n    font-weight: 500;\n    color: #212a56;\n  }\n\n  p {\n    margin: 6px 0 0;\n    font-size: 16px;\n    color: #626f95;\n  }\n}\n\n.header-actions {\n  display: flex;\n  gap: 8px;\n}\n\n.btn {\n  height: 34px;\n  min-width: 68px;\n  border-radius: 9px;\n  border: 1px solid #d8deef;\n  font-size: 14px;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.btn-secondary {\n  background: #ffffff;\n  color: #2f3861;\n\n  &:hover {\n    background: #f5f7ff;\n  }\n}\n\n.btn-primary {\n  background: #4b57f5;\n  border-color: #4b57f5;\n  color: #ffffff;\n\n  &:hover {\n    background: #404de8;\n  }\n}\n\n.panel-form {\n  padding: 22px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n\n.field-group {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n\n  label {\n    font-size: 14px;\n    color: #596487;\n  }\n}\n\n.text-input {\n  height: 38px;\n  border-radius: 6px;\n  border: 1px solid #bec8df;\n  padding: 0 12px;\n  background: #ffffff;\n  color: #1e2648;\n  font-size: 15px;\n  transition: border-color 120ms ease, box-shadow 120ms ease;\n\n  &:focus-visible {\n    outline: none;\n    border-color: #8c97ff;\n    box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n  }\n\n  &::placeholder {\n    color: #9aa3bf;\n  }\n\n  &:disabled {\n    background: #f3f5fb;\n    border-color: #d8deef;\n    color: #8d97b6;\n    cursor: not-allowed;\n    opacity: 1;\n  }\n}\n\n:host ::ng-deep {\n  .status-select {\n    .ng-select-container {\n      min-height: 38px;\n      border-radius: 6px;\n      border-color: #bec8df;\n      box-shadow: none;\n\n      .ng-value-container {\n        padding-left: 10px;\n      }\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n    }\n  }\n\n  .work-center-select {\n    .ng-select-container {\n      min-height: 38px;\n      border-radius: 6px;\n      border-color: #bec8df;\n      box-shadow: none;\n\n      .ng-value-container {\n        padding-left: 10px;\n      }\n\n      .ng-placeholder {\n        color: #9aa3bf;\n        font-size: 15px;\n        font-weight: 400;\n        line-height: 38px;\n        font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n      }\n\n      .ng-value {\n        color: rgba(3, 9, 41, 1);\n        font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n        font-size: 14px;\n        font-weight: 500;\n        line-height: 16px;\n      }\n\n      .ng-value-label {\n        color: rgba(3, 9, 41, 1);\n        font-family: 'CircularStd-Regular', 'Circular-Std', 'Segoe UI', sans-serif;\n        font-size: 14px;\n        font-weight: 500;\n        line-height: 16px;\n      }\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35);\n    }\n  }\n\n  .ng-dropdown-panel {\n    border-radius: 8px;\n    border: 1px solid #d8deef;\n    box-shadow: 0 6px 20px rgba(33, 42, 86, 0.14);\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n    min-height: 40px;\n    display: flex;\n    align-items: center;\n    padding: 0 12px;\n    font-size: 14px;\n    color: #1e2648;\n    font-weight: 400;\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n    background: #f3f5ff;\n  }\n\n  .work-center-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n    color: rgba(62, 64, 219, 1);\n    background: #ffffff;\n  }\n\n  .status-option-label {\n    display: inline-block;\n    width: 150px;\n    height: 18px;\n    color: #1e2648;\n    font-size: 14px;\n    font-weight: 400;\n    font-style: normal;\n    line-height: 18px;\n  }\n\n  .status-option-label--selected {\n    color: rgba(62, 64, 219, 1);\n    font-family: 'CircularStd-Book', sans-serif;\n    font-weight: 400;\n  }\n\n  .ngb-dp-popup {\n    z-index: 80;\n    margin-top: 8px;\n    border: 1px solid #c9d1e6;\n    border-radius: 14px;\n    background: #ffffff;\n    box-shadow:\n      0 0 0 1px rgba(104, 113, 150, 0.08),\n      0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n      0 12px 28px rgba(35, 47, 92, 0.16);\n    overflow: visible;\n    width: max-content;\n    min-width: 0;\n  }\n\n  /* Apply panel styling on the datepicker root as a fallback because ng-bootstrap\n     popup wrapper classes vary by version and can bypass .ngb-dp-popup styles. */\n  ngb-datepicker {\n    display: inline-block;\n    border: 1px solid #c9d1e6;\n    border-radius: 14px;\n    background: #ffffff;\n    box-shadow:\n      0 0 0 1px rgba(104, 113, 150, 0.08),\n      0 2.5px 3px -1.5px rgba(200, 207, 233, 1),\n      0 12px 28px rgba(35, 47, 92, 0.16);\n    overflow: visible;\n    width: max-content;\n    min-width: 0;\n  }\n\n  ngb-datepicker.dropdown-menu {\n    border: 0;\n    border-radius: 14px;\n    padding: 0;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    color: #1e2648;\n    overflow: visible;\n    background: #ffffff;\n    width: max-content;\n    min-width: 0;\n  }\n\n  .dropdown-menu.show ngb-datepicker {\n    margin-top: 8px;\n  }\n\n  .ngb-dp-header {\n    display: none;\n  }\n\n  .datepicker-custom-header {\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n    gap: 6px;\n    padding: 6px 8px 8px;\n    border-bottom: 1px solid #d9deeb;\n    background: #ffffff;\n  }\n\n  .datepicker-nav-button {\n    width: 30px;\n    height: 30px;\n    flex: 0 0 30px;\n    border: 0;\n    border-radius: 8px;\n    background: transparent;\n    color: #4b57f5;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n  }\n\n  .datepicker-nav-button:hover {\n    background: #f3f5ff;\n  }\n\n  .datepicker-chevron {\n    width: 10px;\n    height: 10px;\n    border-top: 2px solid currentColor;\n    border-right: 2px solid currentColor;\n    display: inline-block;\n  }\n\n  .datepicker-chevron--left {\n    transform: rotate(-135deg);\n  }\n\n  .datepicker-chevron--right {\n    transform: rotate(45deg);\n  }\n\n  .datepicker-nav-select {\n    height: 34px;\n  }\n\n  .datepicker-nav-select.datepicker-nav-select--month {\n    width: 68px;\n  }\n\n  .datepicker-nav-select.datepicker-nav-select--year {\n    width: 82px;\n  }\n\n  .datepicker-nav-select.ng-select {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n\n    .ng-clear-wrapper {\n      display: none;\n    }\n\n    .ng-select-container {\n      min-height: 34px !important;\n      height: 34px !important;\n      border: 1px solid #bec8df !important;\n      border-radius: 10px;\n      background: #ffffff !important;\n      box-shadow: 1px 2.5px 3px -1.5px rgba(200, 207, 233, 1) !important;\n    }\n\n    .ng-value-container {\n      padding-left: 8px !important;\n      padding-right: 0 !important;\n      align-items: center;\n    }\n\n    .ng-value {\n      color: #3e40db;\n      font-size: 14px !important;\n      font-weight: 500;\n    }\n\n    .ng-arrow-wrapper {\n      padding-right: 6px;\n      padding-left: 2px;\n    }\n\n    .ng-arrow {\n      border: 0 !important;\n      width: 9px;\n      height: 6px;\n      background: url('/assets/images/Down.svg') center / contain no-repeat;\n      margin: 0 !important;\n    }\n\n    &.ng-select-opened > .ng-select-container {\n      border-color: #8c97ff !important;\n      box-shadow: 0 0 0 1px rgba(140, 151, 255, 0.35) !important;\n    }\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel {\n    margin-top: 6px !important;\n    border-radius: 8px;\n    border: 1px solid #d8deef;\n    box-shadow: 0 6px 20px rgba(33, 42, 86, 0.14);\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n    min-height: 34px !important;\n    display: flex;\n    align-items: center;\n    padding: 0 12px !important;\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    font-size: 14px;\n    color: #1e2648;\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected {\n    color: #3e40db;\n    background: #ffffff;\n    font-weight: 400;\n  }\n\n  .datepicker-nav-select.ng-select .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n    background: #eef2ff;\n  }\n\n  .ngb-dp-weekdays {\n    background: #ffffff;\n    border-bottom: 1px solid #d9deeb;\n    margin-bottom: 4px;\n  }\n\n  .ngb-dp-weekday {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    color: #4b57f5;\n    font-style: italic;\n    font-weight: 600;\n    font-size: 15px;\n  }\n\n  .ngb-dp-day,\n  .ngb-dp-week-number,\n  .ngb-dp-weekday-number {\n    width: 2.2rem;\n    height: 2.2rem;\n  }\n\n  .ngb-dp-day .btn-light {\n    font-family: 'Circular-Std', 'Segoe UI', sans-serif;\n    width: 2.2rem;\n    height: 2.2rem;\n    border-radius: 9px;\n    border: 0;\n    color: #232733;\n    font-size: 18px;\n    font-weight: 500;\n    background: transparent;\n    transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;\n  }\n\n  .ngb-dp-day .btn-light:hover {\n    background: #eef1ff;\n    color: #2e3ba8;\n  }\n\n  .ngb-dp-day .btn-light.text-muted,\n  .ngb-dp-day .btn-light.outside {\n    color: #a8acb3;\n  }\n\n  .ngb-dp-day .btn-light.bg-primary,\n  .ngb-dp-day .btn-light.btn-primary {\n    background: #4b57f5 !important;\n    color: #ffffff !important;\n    box-shadow: 0 4px 12px rgba(75, 87, 245, 0.3);\n  }\n\n  .ngb-dp-content {\n    padding: 4px 8px 8px;\n  }\n\n  .ngb-dp-month:first-child .ngb-dp-week {\n    padding-left: 0;\n  }\n\n  .ngb-dp-month:last-child .ngb-dp-week {\n    padding-right: 0;\n  }\n\n}\n\n.status-chip {\n  border-radius: 6px;\n  padding: 2px 10px;\n  font-size: 14px;\n  font-weight: 500;\n  display: inline-flex;\n  align-items: center;\n}\n\n.chip-open {\n  color: #0088af;\n  background: #d5f2fe;\n}\n\n.chip-in-progress {\n  color: #4d58df;\n  background: #ccd0ff;\n}\n\n.chip-complete {\n  color: #3d9a5f;\n  background: #d9f2c9;\n}\n\n.chip-blocked {\n  color: #cd5b0d;\n  background: #f4df9a;\n}\n\n.field-error {\n  font-size: 12px;\n  color: #b42318;\n}\n\n.panel-error {\n  margin: 0;\n  border: 1px solid #ffb8ad;\n  border-radius: 8px;\n  background: #ffefec;\n  color: #9f2d20;\n  font-size: 13px;\n  padding: 10px;\n}\n\n.hidden-submit {\n  display: none;\n}\n\n.field-group .text-input[ngbDatepicker] {\n  cursor: pointer;\n}\n\n@keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes slide-in {\n  from {\n    transform: translateX(100%);\n  }\n\n  to {\n    transform: translateX(0);\n  }\n}\n\n@keyframes fade-out {\n  from {\n    opacity: 1;\n  }\n\n  to {\n    opacity: 0;\n  }\n}\n\n@keyframes slide-out {\n  from {\n    transform: translateX(0);\n  }\n\n  to {\n    transform: translateX(100%);\n  }\n}\n\n@media (max-width: 900px) {\n  .panel {\n    width: 100vw;\n  }\n}\n"] }]
    }], null, { isOpen: [{
            type: Input,
            args: [{ required: true }]
        }], mode: [{
            type: Input,
            args: [{ required: true }]
        }], workCenterName: [{
            type: Input
        }], workCenters: [{
            type: Input
        }], defaultWorkCenterId: [{
            type: Input
        }], overlapError: [{
            type: Input
        }], defaultStartDate: [{
            type: Input
        }], defaultEndDate: [{
            type: Input
        }], editingOrder: [{
            type: Input
        }], closed: [{
            type: Output
        }], submitted: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WorkOrderPanelComponent, { className: "WorkOrderPanelComponent", filePath: "src/app/components/work-order-panel/work-order-panel.component.ts", lineNumber: 39 }); })();
