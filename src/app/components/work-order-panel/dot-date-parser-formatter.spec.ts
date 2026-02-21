import { DotDateParserFormatter } from './dot-date-parser-formatter';

describe('DotDateParserFormatter', () => {
  let formatter: DotDateParserFormatter;

  beforeEach(() => {
    formatter = new DotDateParserFormatter();
  });

  it('parses a valid dot-separated date string', () => {
    expect(formatter.parse('02.14.2026')).toEqual({
      month: 2,
      day: 14,
      year: 2026
    });
  });

  it('returns null for invalid parse inputs', () => {
    expect(formatter.parse('')).toBeNull();
    expect(formatter.parse('  ')).toBeNull();
    expect(formatter.parse('02-14-2026')).toBeNull();
    expect(formatter.parse('02.14')).toBeNull();
    expect(formatter.parse('aa.14.2026')).toBeNull();
    expect(formatter.parse('13.01.2026')).toBeNull();
    expect(formatter.parse('00.01.2026')).toBeNull();
    expect(formatter.parse('02.30.2026')).toBeNull();
    expect(formatter.parse('02.29.2025')).toBeNull();
    expect(formatter.parse('02.10.0999')).toBeNull();
  });

  it('formats null and date struct values', () => {
    expect(formatter.format(null)).toBe('');
    expect(formatter.format({ year: 2026, month: 2, day: 4 })).toBe('02.04.2026');
  });
});
