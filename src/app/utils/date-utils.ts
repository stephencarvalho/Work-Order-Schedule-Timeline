const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const clone = startOfDay(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfWeek(date: Date): Date {
  const dayStart = startOfDay(date);
  const day = dayStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(dayStart, diff);
}

export function endOfWeek(date: Date): Date {
  return addDays(startOfWeek(date), 6);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function daysInMonth(date: Date): number {
  return endOfMonth(date).getDate();
}

export function diffInDays(later: Date, earlier: Date): number {
  const a = startOfDay(later).getTime();
  const b = startOfDay(earlier).getTime();
  return Math.round((a - b) / MILLIS_PER_DAY);
}

export function diffInMonths(later: Date, earlier: Date): number {
  return (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
}

export function clampDate(date: Date, start: Date, end: Date): Date {
  if (date < start) {
    return startOfDay(start);
  }
  if (date > end) {
    return startOfDay(end);
  }
  return startOfDay(date);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromIsoDate(value: string): Date {
  if (!ISO_DATE_PATTERN.test(value)) {
    return startOfDay(new Date());
  }

  const [yearRaw, monthRaw, dayRaw] = value.split('-').map(Number);
  const candidate = new Date(yearRaw, monthRaw - 1, dayRaw);
  const isValid =
    candidate.getFullYear() === yearRaw &&
    candidate.getMonth() === monthRaw - 1 &&
    candidate.getDate() === dayRaw;

  return isValid ? candidate : startOfDay(new Date());
}

export function formatDayLabel(date: Date): string {
  return DAY_LABEL_FORMATTER.format(date);
}

export function formatWeekLabel(date: Date): string {
  return DAY_LABEL_FORMATTER.format(date);
}

export function formatMonthLabel(date: Date): string {
  return MONTH_LABEL_FORMATTER.format(date);
}

export function formatDateLong(date: Date): string {
  return LONG_DATE_FORMATTER.format(date);
}
