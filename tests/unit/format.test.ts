import { describe, expect, it } from 'vitest';
import { formatMonth, formatPeriod, formatYear, withBase } from '../../src/lib/format';

describe('formatMonth', () => {
  it('formats YYYY-MM', () => expect(formatMonth('2024-08')).toBe('Aug 2024'));
  it('throws on bad input', () => {
    expect(() => formatMonth('2024-13')).toThrow();
    expect(() => formatMonth('Aug 2024')).toThrow();
  });
});

describe('formatPeriod', () => {
  it('handles ongoing', () => expect(formatPeriod('2026-01', null)).toBe('Jan 2026 – Present'));
  it('handles ranges', () =>
    expect(formatPeriod('2025-08', '2025-12')).toBe('Aug 2025 – Dec 2025'));
  it('collapses single month', () => expect(formatPeriod('2025-08', '2025-08')).toBe('Aug 2025'));
});

describe('formatYear', () => {
  it('collapses same year', () => expect(formatYear('2025-08', '2025-12')).toBe('2025'));
  it('spans years', () => expect(formatYear('2024-08', '2025-08')).toBe('2024 – 2025'));
  it('handles ongoing', () => expect(formatYear('2026-01', null)).toBe('2026 – now'));
});

describe('withBase', () => {
  it('joins with and without slashes', () => {
    expect(withBase('/work/a/', '/site')).toBe('/site/work/a/');
    expect(withBase('work/a/', '/site/')).toBe('/site/work/a/');
    expect(withBase('/', '/')).toBe('/');
  });
});
