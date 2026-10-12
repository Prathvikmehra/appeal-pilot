import { describe, it, expect } from 'vitest';
import {
  escapeIcsText,
  foldIcsLine,
  generateIcsString,
} from '@/lib/ics-generator';

describe('ICS Generator — RFC 5545 Compliance', () => {
  describe('escapeIcsText', () => {
    it('escapes special characters per RFC 5545 §3.3.11', () => {
      const raw = 'Appeal for MRI, denial code: 99214; check\\verify\nNext step.';
      const escaped = escapeIcsText(raw);
      expect(escaped).toBe('Appeal for MRI\\, denial code: 99214\\; check\\\\verify\\nNext step.');
    });
  });

  describe('foldIcsLine', () => {
    it('does not fold lines 75 characters or shorter', () => {
      const short = 'SUMMARY:Appeal Deadline for Anthem Claim #49821';
      expect(foldIcsLine(short)).toBe(short);
    });

    it('folds lines exceeding 75 characters with CRLF and leading space', () => {
      const long = 'DESCRIPTION:This is a very detailed explanation of why the health insurance claim must be appealed before the statutory deadline passes.';
      const folded = foldIcsLine(long);
      expect(folded).toContain('\r\n ');
      const lines = folded.split('\r\n');
      expect(lines[0].length).toBeLessThanOrEqual(75);
      expect(lines[1].startsWith(' ')).toBe(true);
    });
  });

  describe('generateIcsString', () => {
    it('produces a valid RFC 5545 calendar file for an explicit deadline', () => {
      const ics = generateIcsString({
        title: 'Appeal Deadline - BlueCross Claim #12345',
        description: 'Submit formal appeal letter and medical records.',
        targetDate: '2027-04-18',
        isEstimated: false,
        alarmDaysPrior: [7, 1],
      });

      expect(ics).toContain('BEGIN:VCALENDAR\r\n');
      expect(ics).toContain('VERSION:2.0\r\n');
      expect(ics).toContain('PRODID:-//Appeal Pilot//EN\r\n');
      expect(ics).toContain('BEGIN:VEVENT\r\n');
      expect(ics).toContain('DTSTART;VALUE=DATE:20270418\r\n');
      expect(ics).toContain('DTEND;VALUE=DATE:20270419\r\n');
      expect(ics).toContain('SUMMARY:Appeal Deadline - BlueCross Claim #12345');
      expect(ics).toContain('TRIGGER:-P7D\r\n');
      expect(ics).toContain('TRIGGER:-P1D\r\n');
      expect(ics).toContain('END:VEVENT\r\n');
      expect(ics).toContain('END:VCALENDAR\r\n');
    });

    it('includes estimated notices and default [14, 3] alarms for estimated deadlines', () => {
      const ics = generateIcsString({
        title: 'Estimated Appeal Deadline - Aetna Claim #9876',
        description: 'Dispute out-of-network balance bill.',
        targetDate: '2027-04-05',
        isEstimated: true,
      });

      expect(ics).toContain('Estimated deadline\\, confirm with your insurer');
      expect(ics).toContain('TRIGGER:-P14D\r\n');
      expect(ics).toContain('TRIGGER:-P3D\r\n');
    });
  });
});
