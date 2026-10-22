import { ComputedDeadline, DeadlineType } from '@/types/appeal';

/**
 * Parses an ISO YYYY-MM-DD string into discrete year, month, and day integers.
 * Strictly avoids UTC conversion to prevent off-by-one timezone shift errors.
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/**
 * Formats discrete date parts to ISO YYYY-MM-DD.
 */
export function formatDateParts(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Adds an integer number of days to an ISO YYYY-MM-DD date using local calendar math.
 */
export function addDays(dateStr: string, daysToAdd: number): string | null {
  const parts = parseDateParts(dateStr);
  if (!parts) return null;
  const dateObj = new Date(parts.year, parts.month - 1, parts.day + daysToAdd);
  return formatDateParts(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate());
}

/**
 * Calculates calendar day difference (targetDate - fromDate).
 */
export function getDaysDifference(fromDateStr: string, toDateStr: string): number | null {
  const fromParts = parseDateParts(fromDateStr);
  const toParts = parseDateParts(toDateStr);
  if (!fromParts || !toParts) return null;

  const fromUtc = Date.UTC(fromParts.year, fromParts.month - 1, fromParts.day);
  const toUtc = Date.UTC(toParts.year, toParts.month - 1, toParts.day);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((toUtc - fromUtc) / msPerDay);
}

/**
 * Formats ISO YYYY-MM-DD to a human-readable string: "Mar 14, 2027"
 */
export function formatDisplayDate(dateStr: string | null): string {
  if (!dateStr) return 'Not specified';
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

/**
 * Gets the user's current local date as ISO YYYY-MM-DD.
 */
export function getLocalTodayStr(): string {
  const now = new Date();
  return formatDateParts(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export interface CalculateDeadlineParams {
  deadlineType: DeadlineType;
  explicitDate: string | null;
  relativeDays: number | null;
  letterDate: string | null;
  todayStr?: string; // Optional anchor date for deterministic testing
}

/**
 * Computes deadline details deterministically in code (not the LLM).
 */
export function calculateDeadline(params: CalculateDeadlineParams): ComputedDeadline {
  const today = params.todayStr || getLocalTodayStr();
  const { deadlineType, explicitDate, relativeDays, letterDate } = params;

  // Case 1: Explicit Date
  if (deadlineType === 'explicit' && explicitDate) {
    const validExplicit = parseDateParts(explicitDate);
    if (validExplicit) {
      const daysRemaining = getDaysDifference(today, explicitDate);
      const isUrgent = daysRemaining !== null && daysRemaining <= 14 && daysRemaining >= 0;
      let statusText = '';
      if (daysRemaining !== null) {
        if (daysRemaining < 0) statusText = 'Deadline passed';
        else if (daysRemaining === 0) statusText = 'Due today';
        else statusText = `${daysRemaining} days left`;
      }

      return {
        targetDate: explicitDate,
        daysRemaining,
        isUrgent,
        isEstimated: false,
        statusText,
        alarmDaysPrior: [7, 1],
      };
    }
  }

  // Case 2: Relative Deadline (e.g. within 180 days)
  if (deadlineType === 'relative') {
    if (relativeDays && relativeDays > 0 && letterDate && parseDateParts(letterDate)) {
      const targetDate = addDays(letterDate, relativeDays);
      if (targetDate) {
        const daysRemaining = getDaysDifference(today, targetDate);
        const isUrgent = daysRemaining !== null && daysRemaining <= 14 && daysRemaining >= 0;
        const formattedLetterDate = formatDisplayDate(letterDate);
        const math = `${relativeDays} days from ${formattedLetterDate} notice`;

        return {
          targetDate,
          daysRemaining,
          isUrgent,
          isEstimated: true,
          statusText: daysRemaining !== null ? `${daysRemaining} days left (Estimated)` : 'Estimated deadline',
          calculationMath: math,
          alarmDaysPrior: [14, 3],
        };
      }
    }

    // Relative but letter date missing: Fall back to missing
    return {
      targetDate: null,
      daysRemaining: null,
      isUrgent: false,
      isEstimated: true,
      statusText: 'Relative deadline noted, but letter date was unreadable. Please confirm with insurer.',
      calculationMath: 'Relative window without start date',
      alarmDaysPrior: [14, 3],
    };
  }

  // Case 3: Missing / Unspecified Deadline
  return {
    targetDate: null,
    daysRemaining: null,
    isUrgent: false,
    isEstimated: false,
    statusText: 'No deadline found in letter. Many insurers allow ~180 days. Please verify.',
    alarmDaysPrior: [7, 1],
  };
}

/**
 * Creates a ComputedDeadline from an explicit manual date override.
 */
export function createManualDeadline(newDateStr: string, todayStr?: string): ComputedDeadline {
  const today = todayStr || getLocalTodayStr();
  const valid = parseDateParts(newDateStr);
  if (!valid) {
    return {
      targetDate: null,
      daysRemaining: null,
      isUrgent: false,
      isEstimated: false,
      statusText: 'Invalid date format',
      alarmDaysPrior: [7, 1],
    };
  }

  const daysRemaining = getDaysDifference(today, newDateStr);
  const isUrgent = daysRemaining !== null && daysRemaining <= 14 && daysRemaining >= 0;
  let statusText = '';
  if (daysRemaining !== null) {
    if (daysRemaining < 0) statusText = 'Deadline passed';
    else if (daysRemaining === 0) statusText = 'Due today';
    else statusText = `${daysRemaining} days left`;
  }

  return {
    targetDate: newDateStr,
    daysRemaining,
    isUrgent,
    isEstimated: false,
    statusText,
    alarmDaysPrior: [7, 1],
  };
}

export interface DeadlineBannerState {
  isPast: boolean;
  useUrgentStyle: boolean;
  headline: string;
  badgeText: string | null;
  guidanceText: string;
}

/**
 * Computes banner display state for a deadline, ensuring passed deadlines are clearly visible in urgent style.
 */
export function getDeadlineBannerState(deadline: ComputedDeadline): DeadlineBannerState {
  const isPast = deadline.daysRemaining !== null && deadline.daysRemaining < 0;
  const useUrgentStyle = deadline.isUrgent || isPast;

  let headline = 'Deadline Not Found in Letter';
  if (isPast) {
    headline = 'Appeal deadline may have passed';
  } else if (deadline.targetDate) {
    headline = `Appeal by ${formatDisplayDate(deadline.targetDate)}`;
  }

  let badgeText: string | null = null;
  if (deadline.daysRemaining !== null) {
    if (isPast) {
      badgeText = 'Deadline May Have Passed';
    } else if (deadline.daysRemaining === 0) {
      badgeText = 'Due Today';
    } else {
      badgeText = `${deadline.daysRemaining} days left`;
    }
  }

  let guidanceText = 'Many insurers allow roughly 180 days, but verify your policy or call your insurer.';
  if (isPast) {
    guidanceText = 'This deadline may have passed. Call your insurer to ask about late appeals or external review. Your appeal letter and kit are still generated below.';
  } else if (deadline.calculationMath) {
    guidanceText = `Based on: ${deadline.calculationMath}. Confirm with your insurer.`;
  } else if (deadline.targetDate) {
    guidanceText = 'Formal statutory appeal deadline stated in notice.';
  }

  return {
    isPast,
    useUrgentStyle,
    headline,
    badgeText,
    guidanceText,
  };
}
