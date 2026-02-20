import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepicker, NgbDatepickerMonth, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import { WorkCenterDocument, WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../models';
import { fromIsoDate, toIsoDate } from '../../utils/date-utils';
import { DATEPICKER_MONTH_OPTIONS, WORK_ORDER_STATUS_OPTIONS } from '../../work-order.constants';
import { DotDateParserFormatter } from './dot-date-parser-formatter';

export interface WorkOrderPanelSubmitEvent {
  payload: WorkOrderData;
  existingOrderId?: string;
}

function isRangeValid(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value as NgbDateStruct | null;
  const end = control.get('endDate')?.value as NgbDateStruct | null;

  if (!start || !end) {
    return null;
  }

  const startDate = new Date(start.year, start.month - 1, start.day);
  const endDate = new Date(end.year, end.month - 1, end.day);

  return endDate >= startDate ? null : { invalidRange: true };
}

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgbInputDatepicker, NgbDatepickerMonth],
  providers: [{ provide: NgbDateParserFormatter, useClass: DotDateParserFormatter }],
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss'
})
export class WorkOrderPanelComponent implements OnChanges {
  @ViewChild('startDateInput') startDateInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInputRef?: ElementRef<HTMLInputElement>;

  @Input({ required: true }) isOpen = false;
  @Input({ required: true }) mode: 'create' | 'edit' = 'create';
  @Input() workCenterName = '';
  @Input() workCenters: WorkCenterDocument[] = [];
  @Input() defaultWorkCenterId: string | null = null;
  @Input() overlapError: string | null = null;
  @Input() defaultStartDate = '';
  @Input() defaultEndDate = '';
  @Input() editingOrder: WorkOrderDocument | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<WorkOrderPanelSubmitEvent>();

  readonly statuses = WORK_ORDER_STATUS_OPTIONS;
  readonly pickerMonthOptions = DATEPICKER_MONTH_OPTIONS;
  readonly pickerYearOptions = Array.from({ length: 61 }, (_, index) => 2000 + index);
  readonly closeAnimationMs = 180;
  isPanelVisible = false;
  isPanelClosing = false;

  private closeAnimationTimeoutId: number | null = null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly dateParserFormatter = inject(NgbDateParserFormatter);

  readonly form = this.formBuilder.group(
    {
      name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(70)]),
      workCenterId: this.formBuilder.control<string | null>(null, Validators.required),
      status: this.formBuilder.nonNullable.control<WorkOrderStatus>('open', Validators.required),
      startDate: this.formBuilder.control<NgbDateStruct | null>(null, Validators.required),
      endDate: this.formBuilder.control<NgbDateStruct | null>(null, Validators.required)
    },
    {
      validators: [isRangeValid]
    }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.closeAnimationTimeoutId !== null) {
        window.clearTimeout(this.closeAnimationTimeoutId);
        this.closeAnimationTimeoutId = null;
      }

      if (this.isOpen) {
        this.isPanelVisible = true;
        this.isPanelClosing = false;
      } else if (this.isPanelVisible) {
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

    if (
      changes['isOpen'] ||
      changes['editingOrder'] ||
      changes['defaultStartDate'] ||
      changes['defaultEndDate'] ||
      changes['defaultWorkCenterId']
    ) {
      this.resetFormValues();
    }
  }

  ngOnDestroy(): void {
    if (this.closeAnimationTimeoutId !== null) {
      window.clearTimeout(this.closeAnimationTimeoutId);
      this.closeAnimationTimeoutId = null;
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.syncDateControlFromInput('startDate', this.startDateInputRef);
    this.syncDateControlFromInput('endDate', this.endDateInputRef);

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

    const payload: WorkOrderData = {
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

  hasFieldError(fieldName: 'name' | 'workCenterId' | 'status' | 'startDate' | 'endDate'): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.touched || field.dirty);
  }

  get actionLabel(): string {
    return this.mode === 'edit' ? 'Save' : 'Create';
  }

  statusChipClass(status: WorkOrderStatus): string {
    return `chip-${status}`;
  }

  onWorkCenterChange(workCenterId: string | null): void {
    this.form.controls.workCenterId.setValue(workCenterId);
    this.form.controls.workCenterId.markAsDirty();
    this.form.controls.workCenterId.markAsTouched();
  }

  pickerMonth(datepicker: NgbDatepicker): number {
    return this.getPickerAnchor(datepicker).month;
  }

  pickerYear(datepicker: NgbDatepicker): number {
    return this.getPickerAnchor(datepicker).year;
  }

  onPickerMonthChange(datepicker: NgbDatepicker, month: number): void {
    const anchor = this.getPickerAnchor(datepicker);
    datepicker.navigateTo({ year: anchor.year, month, day: 1 });
  }

  onPickerYearChange(datepicker: NgbDatepicker, year: number): void {
    const anchor = this.getPickerAnchor(datepicker);
    datepicker.navigateTo({ year, month: anchor.month, day: 1 });
  }

  shiftPickerMonth(datepicker: NgbDatepicker, offset: number): void {
    const anchor = this.getPickerAnchor(datepicker);
    const shifted = new Date(anchor.year, anchor.month - 1 + offset, 1);
    datepicker.navigateTo({ year: shifted.getFullYear(), month: shifted.getMonth() + 1, day: 1 });
  }

  private resetFormValues(): void {
    const resolvedStartDate =
      (this.mode === 'edit' && this.editingOrder
        ? this.toDateStruct(this.editingOrder.data.startDate)
        : this.toDateStruct(this.defaultStartDate)) ?? null;
    const resolvedEndDate =
      (this.mode === 'edit' && this.editingOrder
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

  private toDateStruct(value: string): NgbDateStruct | null {
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

  private getPickerAnchor(datepicker: NgbDatepicker): NgbDateStruct {
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

  private syncDateControlFromInput(
    controlName: 'startDate' | 'endDate',
    inputRef: ElementRef<HTMLInputElement> | undefined
  ): void {
    const inputValue = inputRef?.nativeElement.value ?? '';
    const parsed = this.dateParserFormatter.parse(inputValue.trim());
    this.form.controls[controlName].setValue(parsed);
    this.form.controls[controlName].markAsTouched();
  }
}
