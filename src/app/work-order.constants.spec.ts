import {
  DATEPICKER_MONTH_OPTIONS,
  TIMELINE_MONTH_OPTIONS,
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUS_OPTIONS
} from './work-order.constants';

describe('work-order.constants', () => {
  it('exposes month options with expected mapping', () => {
    expect(TIMELINE_MONTH_OPTIONS).toHaveSize(12);
    expect(TIMELINE_MONTH_OPTIONS[0]).toEqual({ value: 0, label: 'Jan' });
    expect(TIMELINE_MONTH_OPTIONS[11]).toEqual({ value: 11, label: 'Dec' });

    expect(DATEPICKER_MONTH_OPTIONS).toHaveSize(12);
    expect(DATEPICKER_MONTH_OPTIONS[0]).toEqual({ value: 1, label: 'Jan' });
    expect(DATEPICKER_MONTH_OPTIONS[11]).toEqual({ value: 12, label: 'Dec' });
  });

  it('exposes status options and labels', () => {
    expect(WORK_ORDER_STATUS_OPTIONS.map((item) => item.value)).toEqual(['open', 'in-progress', 'complete', 'blocked']);
    expect(WORK_ORDER_STATUS_LABELS['in-progress']).toBe('In progress');
  });
});
