import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

import { fromIsoDate, toIsoDate } from '../../utils/date-utils';

export function workOrderDateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('startDate')?.value as NgbDateStruct | null;
  const end = control.get('endDate')?.value as NgbDateStruct | null;

  if (!start || !end) {
    return null;
  }

  const startDate = new Date(start.year, start.month - 1, start.day);
  const endDate = new Date(end.year, end.month - 1, end.day);

  return endDate >= startDate ? null : { invalidRange: true };
}

export function isoToNgbDateStruct(value: string): NgbDateStruct | null {
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

export function ngbDateStructToIso(value: NgbDateStruct): string {
  return toIsoDate(new Date(value.year, value.month - 1, value.day));
}

