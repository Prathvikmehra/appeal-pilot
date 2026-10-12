import { describe, it, expect } from 'vitest';
import {
  parseDateParts,
  formatDateParts,
  addDays,
  getDaysDifference,
  calculateDeadline,
  createManualDeadline,
} from '@/lib/date-calculator';

describe('Date Calculator — Deterministic Arithmetic', () => {
  describe('Parsing and Formatting (Date-Only)', () => {
    it('parses valid ISO YYYY-MM-DD into integer parts', () => {
      const parts = parseDateParts('2027-03-14');
      expect(parts).toEqual({ year: 2027, month: 3, day: 14 });
    });

    it('returns null for invalid date strings', () => {
      expect(parseDateParts('')).toBeNull();
      expect(parseDateParts('invalid-date')).toBeNull();
      expect(parseDateParts('2027-13-40')).toBeNull();
    });

    it('formats date parts to zero-padded ISO string', () => {
      expect(formatDateParts(2027, 3, 4)).toBe('2027-03-04');
    });
  });

  describe('addDays — Calendar Boundaries and Leap Years', () => {
    it('handles normal month transitions', () => {
      expect(addDays('2026-10-01', 31)).toBe('2026-11-01');
    });

    it('handles non-leap year February transition (2027)', () => {
      expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
    });

    it('handles leap year February transition (2028)', () => {
      expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
      expect(addDays('2028-02-28', 2)).toBe('2028-03-01');
    });

    it('handles year-end transitions', () => {
      expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    });
  });

  describe('calculateDeadline — Explicit Dates', () => {
    const today = '2026-10-12';

    it('computes days remaining and non-urgent status when > 14 days', () => {
      const result = calculateDeadline({
        deadlineType: 'explicit',
        explicitDate: '2026-10-27', // 15 days away
        relativeDays: null,
        letterDate: '2026-10-01',
        todayStr: today,
      });

      expect(result.targetDate).toBe('2026-10-27');
      expect(result.daysRemaining).toBe(15);
      expect(result.isUrgent).toBe(false);
      expect(result.isEstimated).toBe(false);
      expect(result.statusText).toBe('15 days left');
      expect(result.alarmDaysPrior).toEqual([7, 1]);
    });

    it('activates urgent status at the 14-day boundary', () => {
      const result = calculateDeadline({
        deadlineType: 'explicit',
        explicitDate: '2026-10-26', // exactly 14 days away
        relativeDays: null,
        letterDate: '2026-10-01',
        todayStr: today,
      });

      expect(result.daysRemaining).toBe(14);
      expect(result.isUrgent).toBe(true);
      expect(result.statusText).toBe('14 days left');
    });

    it('handles passed deadline correctly', () => {
      const result = calculateDeadline({
        deadlineType: 'explicit',
        explicitDate: '2026-10-01', // 11 days in the past
        relativeDays: null,
        letterDate: '2026-09-15',
        todayStr: today,
      });

      expect(result.daysRemaining).toBe(-11);
      expect(result.isUrgent).toBe(false);
      expect(result.statusText).toBe('Deadline passed');
    });
  });

  describe('calculateDeadline — Relative Dates (180 Days)', () => {
    const today = '2026-10-12';

    it('calculates 180 days accurately from letter date with estimated status and alarms', () => {
      const letterDate = '2026-10-06';
      // 2026-10-06 + 180 days:
      // Oct: 25 days left, Nov: 30, Dec: 31, Jan: 31, Feb: 28, Mar: 31 => 176 days. Remaining 4 days -> Apr 05, 2027.
      const result = calculateDeadline({
        deadlineType: 'relative',
        explicitDate: null,
        relativeDays: 180,
        letterDate,
        todayStr: today,
      });

      expect(result.targetDate).toBe('2027-04-04');
      expect(result.isEstimated).toBe(true);
      expect(result.calculationMath).toContain('180 days from Oct 6, 2026 notice');
      expect(result.alarmDaysPrior).toEqual([14, 3]);
      expect(result.daysRemaining).toBe(174);
    });

    it('falls back safely to missing state if letter date is null', () => {
      const result = calculateDeadline({
        deadlineType: 'relative',
        explicitDate: null,
        relativeDays: 180,
        letterDate: null,
        todayStr: today,
      });

      expect(result.targetDate).toBeNull();
      expect(result.daysRemaining).toBeNull();
      expect(result.isEstimated).toBe(true);
      expect(result.statusText).toContain('Relative deadline noted, but letter date was unreadable');
    });
  });

  describe('calculateDeadline — Missing Date', () => {
    it('returns missing deadline state without guessing', () => {
      const result = calculateDeadline({
        deadlineType: 'missing',
        explicitDate: null,
        relativeDays: null,
        letterDate: '2026-10-01',
      });

      expect(result.targetDate).toBeNull();
      expect(result.daysRemaining).toBeNull();
      expect(result.isUrgent).toBe(false);
      expect(result.isEstimated).toBe(false);
      expect(result.statusText).toContain('No deadline found');
    });
  });

  describe('createManualDeadline — User Override', () => {
    it('sets manual date and recalculates countdown and urgency', () => {
      const today = '2026-10-12';
      const manualDate = '2026-10-20'; // 8 days away -> urgent
      const result = createManualDeadline(manualDate, today);

      expect(result.targetDate).toBe(manualDate);
      expect(result.daysRemaining).toBe(8);
      expect(result.isUrgent).toBe(true);
      expect(result.isEstimated).toBe(false);
      expect(result.alarmDaysPrior).toEqual([7, 1]);
    });
  });
});
