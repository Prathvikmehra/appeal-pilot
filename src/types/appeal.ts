export type DeadlineType = 'explicit' | 'relative' | 'missing';

export interface DenialCodeInfo {
  code: string;
  term: string;
  plainMeaning: string;
}

export interface ExtractedFacts {
  insurer: string;
  claimNumber: string;
  disputedAmount: string;
  letterDate: string | null; // ISO YYYY-MM-DD or null
  denialReasonRaw: string;
  denialCodes: DenialCodeInfo[];
  deadlinePhrase: string | null;
  deadlineType: DeadlineType;
  explicitDate: string | null; // ISO YYYY-MM-DD or null
  relativeDays: number | null; // e.g. 180 if "within 180 days"
}

export interface ComputedDeadline {
  targetDate: string | null; // ISO YYYY-MM-DD or null
  daysRemaining: number | null;
  isUrgent: boolean; // true if daysRemaining !== null && daysRemaining <= 14
  isEstimated: boolean;
  statusText: string;
  calculationMath?: string;
  alarmDaysPrior: number[]; // e.g. [14, 3] for estimated; [7, 1] for explicit
}

export interface PhoneScriptData {
  beforeYouCall: string[];
  whatToSay: string;
  ifTheySay: Array<{ objection: string; response: string }>;
  beforeYouHangUp: string[];
}

export interface GeneratedKit {
  plainEnglishSummary: string;
  whatThisMeans: string;
  appealLetterTemplate: string; // contains {{INSURER}}, {{CLAIM_NUMBER}}, {{DISPUTED_AMOUNT}}, {{DEADLINE_DATE}}
  phoneScript: PhoneScriptData;
  calendarEvent: {
    title: string;
    description: string;
  };
}

export interface FullAnalysisState {
  sampleId?: string;
  fileName?: string;
  previewUrl: string;
  facts: ExtractedFacts;
  deadline: ComputedDeadline;
  kit: GeneratedKit;
}
