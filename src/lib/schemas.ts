import { z } from 'zod';

export const DenialCodeSchema = z.object({
  code: z.string().default(''),
  term: z.string().default(''),
  plainMeaning: z.string().default(''),
});

export const ExtractedFactsSchema = z.object({
  insurer: z.string().default('Unknown Insurer'),
  claimNumber: z.string().default('Not Specified'),
  disputedAmount: z.string().default('$0.00'),
  letterDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  denialReasonRaw: z.string().default('No specific reason identified'),
  denialCodes: z.array(DenialCodeSchema).default([]),
  deadlinePhrase: z.string().nullable().default(null),
  deadlineType: z.enum(['explicit', 'relative', 'missing']).default('missing'),
  explicitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  relativeDays: z.number().int().positive().nullable().default(null),
});

export const GeneratedKitSchema = z.object({
  plainEnglishSummary: z.string(),
  whatThisMeans: z.string(),
  appealLetterTemplate: z.string(),
  phoneScript: z.object({
    beforeYouCall: z.array(z.string()).default([]),
    whatToSay: z.string().default(''),
    ifTheySay: z.array(z.object({
      objection: z.string(),
      response: z.string(),
    })).default([]),
    beforeYouHangUp: z.array(z.string()).default([]),
  }),
  calendarEvent: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export type ExtractedFactsValidated = z.infer<typeof ExtractedFactsSchema>;
export type GeneratedKitValidated = z.infer<typeof GeneratedKitSchema>;
