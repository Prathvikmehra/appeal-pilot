import { addDays, parseDateParts } from './date-calculator';

export interface IcsEventParams {
  title: string;
  description: string;
  targetDate: string; // ISO YYYY-MM-DD
  isEstimated?: boolean;
  alarmDaysPrior?: number[]; // e.g. [14, 3] or [7, 1]
}

/**
 * Escapes characters for text values in iCalendar per RFC 5545 §3.3.11:
 * Backslash, semicolon, comma, and newline.
 */
export function escapeIcsText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Folds a content line at 75 octets using CRLF followed by a single space per RFC 5545 §3.1.
 */
export function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;

  const chunks: string[] = [];
  let remaining = line;

  // First chunk: up to 75 characters
  chunks.push(remaining.substring(0, 75));
  remaining = remaining.substring(75);

  // Subsequent folded chunks: up to 74 characters (because of leading space)
  while (remaining.length > 74) {
    chunks.push(' ' + remaining.substring(0, 74));
    remaining = remaining.substring(74);
  }
  if (remaining.length > 0) {
    chunks.push(' ' + remaining);
  }

  return chunks.join('\r\n');
}

/**
 * Generates an RFC 5545 compliant .ics string for an appeal deadline event.
 */
export function generateIcsString(event: IcsEventParams): string {
  const parts = parseDateParts(event.targetDate);
  if (!parts) {
    throw new Error(`Invalid targetDate: ${event.targetDate}`);
  }

  // All-day event start: YYYYMMDD
  const y = String(parts.year).padStart(4, '0');
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  const dtStart = `${y}${m}${d}`;

  // Next day for all-day DTEND
  const nextDayStr = addDays(event.targetDate, 1) || event.targetDate;
  const nextParts = parseDateParts(nextDayStr)!;
  const dtEnd = `${String(nextParts.year).padStart(4, '0')}${String(nextParts.month).padStart(2, '0')}${String(nextParts.day).padStart(2, '0')}`;

  const now = new Date();
  const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `appeal-pilot-${Date.now()}-${dtStart}@appealpilot.local`;

  let desc = event.description || 'Insurance appeal deadline.';
  if (event.isEstimated && !desc.includes('Estimated deadline')) {
    desc = `Estimated deadline, confirm with your insurer.\\n\\n${desc}`;
  }

  const alarms = event.alarmDaysPrior && event.alarmDaysPrior.length > 0
    ? event.alarmDaysPrior
    : (event.isEstimated ? [14, 3] : [7, 1]);

  const alarmBlocks = alarms.map((days) => [
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    foldIcsLine(`DESCRIPTION:${escapeIcsText(`Appeal reminder: ${days} days until deadline`)}`),
    `TRIGGER:-P${days}D`,
    'END:VALARM',
  ].join('\r\n')).join('\r\n');

  const rawLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Appeal Pilot//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(event.title)}`),
    foldIcsLine(`DESCRIPTION:${escapeIcsText(desc)}`),
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    alarmBlocks,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return rawLines.join('\r\n') + '\r\n';
}

/**
 * Triggers a browser download of the generated .ics file.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
