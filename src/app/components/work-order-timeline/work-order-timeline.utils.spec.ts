import { TimelineColumn, WorkOrderDocument } from '../../models';
import {
  buildTimelineProjection,
  clampPixel,
  computeHoverSlot,
  dateToPixel,
  getCurrentColumnIndex,
  getOrderPlacement,
  getVisibleRange,
  resolveRangeForDate
} from './work-order-timeline.utils';

describe('work-order-timeline.utils', () => {
  const order = (startDate: string, endDate: string, workCenterId = 'wc-001'): WorkOrderDocument => ({
    docId: `${startDate}-${endDate}`,
    docType: 'workOrder',
    data: { name: 'Order', workCenterId, status: 'open', startDate, endDate }
  });

  it('builds projections for day/week/month', () => {
    const dayProjection = buildTimelineProjection({ scale: 'day', year: 2026, viewportWidth: 0 });
    expect(dayProjection.columnWidth).toBe(96);
    expect(dayProjection.columns[0].index).toBe(0);
    expect(dayProjection.columns.length).toBeGreaterThan(360);

    const weekProjection = buildTimelineProjection({ scale: 'week', year: 2026, viewportWidth: 0 });
    expect(weekProjection.columnWidth).toBe(160);
    expect(weekProjection.columns[0].startDate.getDay()).toBe(1);

    const monthProjection = buildTimelineProjection({ scale: 'month', year: 2026, viewportWidth: 1200 });
    expect(monthProjection.columnWidth).toBeCloseTo(200, 5);
    expect(monthProjection.columns).toHaveSize(12);

    const mobileMonthProjection = buildTimelineProjection({ scale: 'month', year: 2026, viewportWidth: 500 });
    expect(mobileMonthProjection.columnWidth).toBeCloseTo(250, 5);
  });

  it('computes current column index for all scales and visibility checks', () => {
    const projection = buildTimelineProjection({ scale: 'day', year: 2026, viewportWidth: 0 });
    expect(
      getCurrentColumnIndex({
        isTodayVisible: false,
        timescale: 'day',
        todayDate: new Date(2026, 0, 1),
        projection
      })
    ).toBeNull();

    expect(
      getCurrentColumnIndex({
        isTodayVisible: true,
        timescale: 'day',
        todayDate: new Date(2026, 0, 2),
        projection
      })
    ).toBe(1);

    const weekProjection = buildTimelineProjection({ scale: 'week', year: 2026, viewportWidth: 0 });
    expect(
      getCurrentColumnIndex({
        isTodayVisible: true,
        timescale: 'week',
        todayDate: new Date(2026, 0, 7),
        projection: weekProjection
      })
    ).toBeGreaterThanOrEqual(0);

    const monthProjection = buildTimelineProjection({ scale: 'month', year: 2026, viewportWidth: 0 });
    expect(
      getCurrentColumnIndex({
        isTodayVisible: true,
        timescale: 'month',
        todayDate: new Date(2027, 0, 1),
        projection: monthProjection
      })
    ).toBeNull();
  });

  it('maps dates to pixels and clamps values', () => {
    const projection = buildTimelineProjection({ scale: 'day', year: 2026, viewportWidth: 0 });
    expect(dateToPixel(new Date(2026, 0, 1), projection, 'day')).toBe(0);
    expect(dateToPixel(new Date(2025, 0, 1), projection, 'day')).toBe(0);

    const weekProjection = buildTimelineProjection({ scale: 'week', year: 2026, viewportWidth: 0 });
    expect(dateToPixel(new Date(2026, 0, 5), weekProjection, 'week')).toBeCloseTo(160, 5);

    const monthProjection = buildTimelineProjection({ scale: 'month', year: 2026, viewportWidth: 1200 });
    expect(dateToPixel(new Date(2026, 1, 15), monthProjection, 'month')).toBeGreaterThan(monthProjection.columnWidth);

    expect(clampPixel(-20, 500)).toBe(0);
    expect(clampPixel(700, 500)).toBe(500);
  });

  it('computes visible range and order placement', () => {
    const projection = buildTimelineProjection({ scale: 'month', year: 2026, viewportWidth: 1200 });
    const visibleRange = getVisibleRange(2026, projection);

    expect(visibleRange.start).toEqual(new Date(2026, 0, 1));
    expect(visibleRange.end).toEqual(new Date(2026, 11, 31));

    const placementMonth = getOrderPlacement({
      order: order('2025-12-15', '2026-01-02'),
      projection,
      timelineWidth: projection.width,
      visibleRange,
      timescale: 'month'
    });
    expect(placementMonth.width).toBeGreaterThanOrEqual(32);

    const placementClippedEnd = getOrderPlacement({
      order: order('2026-12-15', '2027-01-15'),
      projection,
      timelineWidth: projection.width,
      visibleRange,
      timescale: 'month'
    });
    expect(placementClippedEnd.width).toBeGreaterThan(0);

    const dayProjection = buildTimelineProjection({ scale: 'day', year: 2026, viewportWidth: 0 });
    const dayVisible = getVisibleRange(2026, dayProjection);
    const placementDay = getOrderPlacement({
      order: order('2026-01-01', '2026-01-01'),
      projection: dayProjection,
      timelineWidth: dayProjection.width,
      visibleRange: dayVisible,
      timescale: 'day'
    });
    expect(placementDay.width).toBeGreaterThan(0);

    const tinyPlacement = getOrderPlacement({
      order: order('2026-01-01', '2026-01-01'),
      projection: dayProjection,
      timelineWidth: 1,
      visibleRange: dayVisible,
      timescale: 'day'
    });
    expect(tinyPlacement.width).toBe(1);

    const clippedRange = getVisibleRange(2026, {
      ...projection,
      startDate: new Date(2026, 1, 1),
      endDate: new Date(2026, 10, 30)
    });
    expect(clippedRange.start).toEqual(new Date(2026, 1, 1));
    expect(clippedRange.end).toEqual(new Date(2026, 10, 30));
  });

  it('computes hover slot and range resolution', () => {
    const columns: TimelineColumn[] = [
      { index: 0, label: 'A', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 0, 1), left: 0, width: 100 },
      { index: 1, label: 'B', startDate: new Date(2026, 0, 2), endDate: new Date(2026, 0, 2), left: 100, width: 100 }
    ];

    expect(
      computeHoverSlot({
        centerId: 'wc-001',
        x: 10,
        columns: [],
        timelineWidth: 200,
        timescale: 'day',
        orders: []
      })
    ).toBeNull();

    expect(
      computeHoverSlot({
        centerId: 'wc-001',
        x: 10,
        columns,
        timelineWidth: 200,
        timescale: 'day',
        orders: [order('2026-01-01', '2026-01-01')]
      })
    ).toBeNull();

    const slot = computeHoverSlot({
      centerId: 'wc-001',
      x: 180,
      columns,
      timelineWidth: 200,
      timescale: 'week',
      orders: []
    });

    expect(slot).toBeTruthy();
    expect(slot?.left).toBeLessThanOrEqual(200);

    const fallbackColumnSlot = computeHoverSlot({
      centerId: 'wc-001',
      x: 500,
      columns,
      timelineWidth: 200,
      timescale: 'day',
      orders: []
    });
    expect(fallbackColumnSlot?.centerId).toBe('wc-001');

    const dayRange = resolveRangeForDate(new Date(2026, 0, 1, 15), 'day');
    const weekRange = resolveRangeForDate(new Date(2026, 0, 1), 'week');
    const monthRange = resolveRangeForDate(new Date(2026, 0, 1), 'month');

    expect(dayRange.start).toEqual(dayRange.end);
    expect(weekRange.end.getTime()).toBeGreaterThan(weekRange.start.getTime());
    expect(monthRange.start.getDate()).toBe(1);
  });
});
