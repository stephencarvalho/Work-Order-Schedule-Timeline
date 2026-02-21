import {
  CARD_CONTENT_GAP,
  CARD_HORIZONTAL_PADDING,
  MIN_NAME_WIDTH_WITH_STATUS,
  MONTH_VIEW_VISIBLE_COLUMNS,
  SCALE_OPTIONS,
  STATUS_CLASS,
  STATUS_PILL_MIN_WIDTH
} from './work-order-timeline.types';

describe('work-order-timeline.types', () => {
  it('exposes scale options and status mappings', () => {
    expect(SCALE_OPTIONS.map((s) => s.value)).toEqual(['day', 'week', 'month']);
    expect(STATUS_CLASS.complete).toBe('status-complete');
    expect(STATUS_PILL_MIN_WIDTH['in-progress']).toBe(87);
  });

  it('exposes layout constants', () => {
    expect(CARD_HORIZONTAL_PADDING).toBe(20);
    expect(CARD_CONTENT_GAP).toBe(12);
    expect(MIN_NAME_WIDTH_WITH_STATUS).toBe(56);
    expect(MONTH_VIEW_VISIBLE_COLUMNS).toBe(6);
  });
});
