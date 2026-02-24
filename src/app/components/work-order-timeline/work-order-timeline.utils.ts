import { Timescale, TimelineColumn, WorkOrderDocument } from '../../models';
import {
  addDays,
  addMonths,
  clampDate,
  daysInMonth,
  diffInDays,
  diffInMonths,
  endOfMonth,
  endOfWeek,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  fromIsoDate,
  startOfDay,
  startOfMonth,
  startOfWeek
} from '../../utils/date-utils';
import {
  HoverSlot,
  OrderPlacement,
  TimelineProjection,
  MONTH_VIEW_MOBILE_BREAKPOINT,
  MONTH_VIEW_MOBILE_VISIBLE_COLUMNS,
  MONTH_VIEW_VISIBLE_COLUMNS
} from './work-order-timeline.types';

const DAY_COLUMN_WIDTH = 96;
const WEEK_COLUMN_WIDTH = 160;
const MONTH_BASE_COLUMN_WIDTH = 171;
const MONTH_MIN_ORDER_WIDTH = 36;
const NON_MONTH_MIN_ORDER_WIDTH = 1;
const ORDER_HORIZONTAL_INSET = 2;

interface BuildProjectionParams {
  scale: Timescale;
  year: number;
  viewportWidth: number;
}

interface HoverSlotParams {
  centerId: string;
  x: number;
  columns: TimelineColumn[];
  timelineWidth: number;
  timescale: Timescale;
  orders: WorkOrderDocument[];
}

export function buildTimelineProjection(params: BuildProjectionParams): TimelineProjection {
  const { scale, year, viewportWidth } = params;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  if (scale === 'day') {
    const columns = buildColumns({
      startDate: yearStart,
      endDate: yearEnd,
      stepDays: 1,
      columnWidth: DAY_COLUMN_WIDTH,
      labelBuilder: (date) => formatDayLabel(date),
      periodEndBuilder: (date) => date
    });

    return {
      startDate: yearStart,
      endDate: yearEnd,
      columns,
      width: columns.length * DAY_COLUMN_WIDTH,
      columnWidth: DAY_COLUMN_WIDTH
    };
  }

  if (scale === 'week') {
    const startDate = startOfWeek(yearStart);
    const endDate = endOfWeek(yearEnd);
    const columns = buildColumns({
      startDate,
      endDate,
      stepDays: 7,
      columnWidth: WEEK_COLUMN_WIDTH,
      labelBuilder: (date) => `${formatWeekLabel(date)} - ${formatWeekLabel(endOfWeek(date))}`,
      periodEndBuilder: (date) => endOfWeek(date)
    });

    return {
      startDate,
      endDate,
      columns,
      width: columns.length * WEEK_COLUMN_WIDTH,
      columnWidth: WEEK_COLUMN_WIDTH
    };
  }

  const visibleMonthColumns =
    viewportWidth > 0 && viewportWidth <= MONTH_VIEW_MOBILE_BREAKPOINT
      ? MONTH_VIEW_MOBILE_VISIBLE_COLUMNS
      : MONTH_VIEW_VISIBLE_COLUMNS;
  const columnWidth = viewportWidth > 0 ? viewportWidth / visibleMonthColumns : MONTH_BASE_COLUMN_WIDTH;
  const startDate = startOfMonth(yearStart);
  const endDate = endOfMonth(yearEnd);
  const columns = buildMonthColumns(startDate, endDate, columnWidth);

  return {
    startDate,
    endDate,
    columns,
    width: columns.length * columnWidth,
    columnWidth
  };
}

export function getCurrentColumnIndex(params: {
  isTodayVisible: boolean;
  timescale: Timescale;
  todayDate: Date;
  projection: TimelineProjection;
}): number | null {
  const { isTodayVisible, timescale, todayDate, projection } = params;
  if (!isTodayVisible) {
    return null;
  }

  let index = 0;
  if (timescale === 'day') {
    index = diffInDays(todayDate, projection.startDate);
  } else if (timescale === 'week') {
    index = Math.floor(diffInDays(startOfWeek(todayDate), projection.startDate) / 7);
  } else {
    index = diffInMonths(startOfMonth(todayDate), projection.startDate);
  }

  return index >= 0 && index < projection.columns.length ? index : null;
}

export function dateToPixel(date: Date, projection: TimelineProjection, timescale: Timescale): number {
  const normalizedDate = clampDate(startOfDay(date), projection.startDate, addDays(projection.endDate, 1));

  if (timescale === 'day') {
    return diffInDays(normalizedDate, projection.startDate) * projection.columnWidth;
  }

  if (timescale === 'week') {
    return (diffInDays(normalizedDate, projection.startDate) / 7) * projection.columnWidth;
  }

  const monthStart = startOfMonth(normalizedDate);
  const monthIndex = diffInMonths(monthStart, projection.startDate);
  const dayOffset = normalizedDate.getDate() - 1;
  const monthDays = daysInMonth(normalizedDate);

  return monthIndex * projection.columnWidth + (dayOffset / monthDays) * projection.columnWidth;
}

export function clampPixel(value: number, timelineWidth: number): number {
  return Math.min(Math.max(value, 0), timelineWidth);
}

export function getVisibleRange(year: number, projection: TimelineProjection): { start: Date; end: Date } {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  return {
    start: projection.startDate > yearStart ? projection.startDate : yearStart,
    end: projection.endDate < yearEnd ? projection.endDate : yearEnd
  };
}

export function getOrderPlacement(params: {
  order: WorkOrderDocument;
  projection: TimelineProjection;
  timelineWidth: number;
  visibleRange: { start: Date; end: Date };
  timescale: Timescale;
}): OrderPlacement {
  const { order, projection, timelineWidth, visibleRange, timescale } = params;
  const orderStart = fromIsoDate(order.data.startDate);
  const orderEnd = fromIsoDate(order.data.endDate);

  const clippedStart = orderStart < visibleRange.start ? visibleRange.start : orderStart;
  const clippedEnd = orderEnd > visibleRange.end ? visibleRange.end : orderEnd;

  let left = clampPixel(dateToPixel(clippedStart, projection, timescale), timelineWidth);
  const right = clampPixel(dateToPixel(addDays(clippedEnd, 1), projection, timescale), timelineWidth);
  const minWidth = timescale === 'month' ? MONTH_MIN_ORDER_WIDTH : NON_MONTH_MIN_ORDER_WIDTH;
  let width = Math.max(minWidth, right - left);
  const maxLeft = Math.max(0, timelineWidth - width);
  left = Math.min(left, maxLeft);

  if (width > ORDER_HORIZONTAL_INSET * 2) {
    left += ORDER_HORIZONTAL_INSET;
    width -= ORDER_HORIZONTAL_INSET * 2;
  }

  return { left, width };
}

export function computeHoverSlot(params: HoverSlotParams): HoverSlot | null {
  const { centerId, x, columns, timelineWidth, timescale, orders } = params;
  if (!columns.length) {
    return null;
  }

  const column = columns.find((item) => x >= item.left && x < item.left + item.width) ?? columns[columns.length - 1];
  const { start, end } = resolveRangeForDate(column.startDate, timescale);

  const hasConflict = orders.some((order) => {
    const orderStart = fromIsoDate(order.data.startDate);
    const orderEnd = fromIsoDate(order.data.endDate);
    return orderEnd >= start && orderStart <= end;
  });
  if (hasConflict) {
    return null;
  }

  const inset = 5;
  const slotWidth = Math.max(1, column.width - inset * 2);
  const rawLeft = column.left + inset;
  const left = Math.min(Math.max(0, rawLeft), Math.max(0, timelineWidth - slotWidth));

  return { centerId, left, width: slotWidth, startDate: start, endDate: end };
}

export function resolveRangeForDate(date: Date, timescale: Timescale): { start: Date; end: Date } {
  if (timescale === 'day') {
    const day = startOfDay(date);
    return { start: day, end: day };
  }

  if (timescale === 'week') {
    return { start: startOfWeek(date), end: endOfWeek(date) };
  }

  return { start: startOfMonth(date), end: endOfMonth(date) };
}

function buildColumns(params: {
  startDate: Date;
  endDate: Date;
  stepDays: number;
  columnWidth: number;
  labelBuilder: (date: Date) => string;
  periodEndBuilder: (date: Date) => Date;
}): TimelineColumn[] {
  const { startDate, endDate, stepDays, columnWidth, labelBuilder, periodEndBuilder } = params;
  const columns: TimelineColumn[] = [];

  let cursor = startDate;
  let left = 0;
  let index = 0;

  while (cursor <= endDate) {
    columns.push({
      index,
      label: labelBuilder(cursor),
      startDate: cursor,
      endDate: periodEndBuilder(cursor),
      left,
      width: columnWidth
    });

    cursor = addDays(cursor, stepDays);
    left += columnWidth;
    index += 1;
  }

  return columns;
}

function buildMonthColumns(startDate: Date, endDate: Date, columnWidth: number): TimelineColumn[] {
  const columns: TimelineColumn[] = [];

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

  return columns;
}
