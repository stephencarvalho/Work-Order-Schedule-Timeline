import {
  addDays,
  addMonths,
  clampDate,
  daysInMonth,
  diffInDays,
  diffInMonths,
  endOfMonth,
  endOfWeek,
  formatDateLong,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  fromIsoDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toIsoDate
} from './date-utils';

describe('date-utils', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 1, 20));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('normalizes to start of day and adds days/months', () => {
    const date = new Date(2026, 1, 20, 15, 30);
    expect(startOfDay(date)).toEqual(new Date(2026, 1, 20));
    expect(addDays(date, 3)).toEqual(new Date(2026, 1, 23));
    expect(addMonths(date, 2)).toEqual(new Date(2026, 3, 1));
  });

  it('computes week and month boundaries', () => {
    const sunday = new Date(2026, 1, 22);
    const wednesday = new Date(2026, 1, 18);

    expect(startOfWeek(sunday)).toEqual(new Date(2026, 1, 16));
    expect(startOfWeek(wednesday)).toEqual(new Date(2026, 1, 16));
    expect(endOfWeek(wednesday)).toEqual(new Date(2026, 1, 22));

    expect(startOfMonth(new Date(2026, 1, 9))).toEqual(new Date(2026, 1, 1));
    expect(endOfMonth(new Date(2026, 1, 9))).toEqual(new Date(2026, 1, 28));
    expect(daysInMonth(new Date(2024, 1, 1))).toBe(29);
  });

  it('calculates date diffs and clamps ranges', () => {
    expect(diffInDays(new Date(2026, 1, 20), new Date(2026, 1, 15))).toBe(5);
    expect(diffInMonths(new Date(2026, 5, 1), new Date(2025, 10, 1))).toBe(7);

    const start = new Date(2026, 1, 10);
    const end = new Date(2026, 1, 12);

    expect(clampDate(new Date(2026, 1, 9), start, end)).toEqual(start);
    expect(clampDate(new Date(2026, 1, 13), start, end)).toEqual(end);
    expect(clampDate(new Date(2026, 1, 11, 11), start, end)).toEqual(new Date(2026, 1, 11));
  });

  it('handles ISO conversion and invalid ISO fallbacks', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(fromIsoDate('2026-02-20')).toEqual(new Date(2026, 1, 20));

    const fallback = new Date(2026, 1, 20);
    expect(fromIsoDate('bad-value')).toEqual(fallback);
    expect(fromIsoDate('2026-02-31')).toEqual(fallback);
  });

  it('formats labels and long dates', () => {
    const date = new Date(2026, 1, 20);
    expect(formatDayLabel(date)).toBe('Feb 20');
    expect(formatWeekLabel(date)).toBe('Feb 20');
    expect(formatMonthLabel(date)).toBe('Feb 2026');
    expect(formatDateLong(date)).toBe('Feb 20, 2026');
  });
});
