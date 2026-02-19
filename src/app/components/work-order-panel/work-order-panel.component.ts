import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker, NgbDatepickerMonth, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

import { WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../models';
import { fromIsoDate, toIsoDate } from '../../utils/date-utils';

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
  templateUrl: './work-order-panel.component.html',
  styleUrl: './work-order-panel.component.scss'
})
export class WorkOrderPanelComponent implements OnChanges {
  @Input({ required: true }) isOpen = false;
  @Input({ required: true }) mode: 'create' | 'edit' = 'create';
  @Input() workCenterName = '';
  @Input() overlapError: string | null = null;
  @Input() defaultStartDate = '';
  @Input() defaultEndDate = '';
  @Input() editingOrder: WorkOrderDocument | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<WorkOrderPanelSubmitEvent>();

  readonly statuses: Array<{ value: WorkOrderStatus; label: string }> = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'blocked', label: 'Blocked' }
  ];
  readonly pickerMonthOptions: Array<{ label: string; value: number }> = [
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 8 },
    { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 12 }
  ];
  readonly pickerYearOptions = Array.from({ length: 61 }, (_, index) => 2000 + index);

  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.group(
    {
      name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(70)]),
      status: this.formBuilder.nonNullable.control<WorkOrderStatus>('open', Validators.required),
      startDate: this.formBuilder.control<NgbDateStruct | null>(null, Validators.required),
      endDate: this.formBuilder.control<NgbDateStruct | null>(null, Validators.required)
    },
    {
      validators: [isRangeValid]
    }
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isOpen) {
      return;
    }

    if (changes['isOpen'] || changes['editingOrder'] || changes['defaultStartDate'] || changes['defaultEndDate']) {
      this.resetFormValues();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onSubmit(): void {
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

    if (!start || !end) {
      return;
    }

    const payload: WorkOrderData = {
      name: trimmedName,
      status: this.form.controls.status.value,
      startDate: toIsoDate(new Date(start.year, start.month - 1, start.day)),
      endDate: toIsoDate(new Date(end.year, end.month - 1, end.day)),
      workCenterId: this.editingOrder?.data.workCenterId ?? ''
    };

    this.submitted.emit({
      payload,
      existingOrderId: this.mode === 'edit' ? this.editingOrder?.docId : undefined
    });
  }

  hasFieldError(fieldName: 'name' | 'status' | 'startDate' | 'endDate'): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && (field.touched || field.dirty);
  }

  get actionLabel(): string {
    return this.mode === 'edit' ? 'Save' : 'Create';
  }

  statusChipClass(status: WorkOrderStatus): string {
    return `chip-${status}`;
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
        status: this.editingOrder.data.status,
        startDate: resolvedStartDate,
        endDate: resolvedEndDate
      });
      this.form.markAsPristine();
      return;
    }

    this.form.reset({
      name: '',
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
}
