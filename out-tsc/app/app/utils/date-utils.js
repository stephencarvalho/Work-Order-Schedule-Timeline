const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
export function addDays(date, amount) {
    const clone = startOfDay(date);
    clone.setDate(clone.getDate() + amount);
    return clone;
}
export function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
export function startOfWeek(date) {
    const dayStart = startOfDay(date);
    const day = dayStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(dayStart, diff);
}
export function endOfWeek(date) {
    return addDays(startOfWeek(date), 6);
}
export function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function daysInMonth(date) {
    return endOfMonth(date).getDate();
}
export function diffInDays(later, earlier) {
    const a = startOfDay(later).getTime();
    const b = startOfDay(earlier).getTime();
    return Math.round((a - b) / MILLIS_PER_DAY);
}
export function diffInMonths(later, earlier) {
    return (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
}
export function clampDate(date, start, end) {
    if (date < start) {
        return startOfDay(start);
    }
    if (date > end) {
        return startOfDay(end);
    }
    return startOfDay(date);
}
export function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export function fromIsoDate(value) {
    const [yearRaw, monthRaw, dayRaw] = value.split('-').map(Number);
    if (!yearRaw || !monthRaw || !dayRaw) {
        return startOfDay(new Date());
    }
    return new Date(yearRaw, monthRaw - 1, dayRaw);
}
export function formatDayLabel(date) {
    return DAY_LABEL_FORMATTER.format(date);
}
export function formatWeekLabel(date) {
    return DAY_LABEL_FORMATTER.format(date);
}
export function formatMonthLabel(date) {
    return MONTH_LABEL_FORMATTER.format(date);
}
export function formatDateLong(date) {
    return LONG_DATE_FORMATTER.format(date);
}
