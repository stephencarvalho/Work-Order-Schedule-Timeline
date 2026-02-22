import { FormControl, FormGroup } from '@angular/forms';

import { isoToNgbDateStruct, ngbDateStructToIso, workOrderDateRangeValidator } from './work-order-panel.form';

describe('work-order-panel.form', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 1, 20));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('validates date range as inclusive and rejects inverted ranges', () => {
    const form = new FormGroup({
      startDate: new FormControl<{ year: number; month: number; day: number } | null>(null),
      endDate: new FormControl<{ year: number; month: number; day: number } | null>(null)
    });

    expect(workOrderDateRangeValidator(form)).toBeNull();

    form.patchValue({
      startDate: { year: 2026, month: 3, day: 10 },
      endDate: { year: 2026, month: 3, day: 10 }
    });
    expect(workOrderDateRangeValidator(form)).toBeNull();

    form.patchValue({
      startDate: { year: 2026, month: 3, day: 12 },
      endDate: { year: 2026, month: 3, day: 10 }
    });
    expect(workOrderDateRangeValidator(form)).toEqual({ invalidRange: true });
  });

  it('converts between ISO strings and ng-bootstrap date structs', () => {
    expect(isoToNgbDateStruct('2026-03-10')).toEqual({ year: 2026, month: 3, day: 10 });
    expect(isoToNgbDateStruct('')).toBeNull();
    // Current behavior: invalid ISO falls back to "today" via shared date util.
    expect(isoToNgbDateStruct('bad-date')).toEqual({ year: 2026, month: 2, day: 20 });

    expect(ngbDateStructToIso({ year: 2026, month: 3, day: 10 })).toBe('2026-03-10');
  });
});

