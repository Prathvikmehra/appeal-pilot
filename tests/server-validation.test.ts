import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { checkRateLimit } from '../src/lib/rate-limiter';
import { ExtractedFactsSchema, GeneratedKitSchema } from '../src/lib/schemas';

describe('Server-side PDF Validation & Security Policies', () => {
  it('detects and counts 2 pages in multi-page.pdf fixture (for 400 rejection)', async () => {
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'multi-page.pdf');
    const bytes = fs.readFileSync(pdfPath);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(2);
  });

  it('detects exactly 1 page in test-denial-letter.pdf fixture', async () => {
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-denial-letter.pdf');
    const bytes = fs.readFileSync(pdfPath);
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });
});

describe('In-Memory Sliding-Window Rate Limiter', () => {
  it('permits up to 10 requests within a window and blocks the 11th', () => {
    const testIp = '192.168.1.100';
    for (let i = 0; i < 10; i++) {
      const res = checkRateLimit(testIp);
      expect(res.allowed).toBe(true);
    }

    const blockedRes = checkRateLimit(testIp);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});

describe('Zod Schema Validation for Route Payloads', () => {
  it('validates a complete extraction payload with null explicitDate', () => {
    const mockExtraction = {
      insurer: 'Summit Health Care',
      claimNumber: 'SH-551920-RX',
      disputedAmount: '$3,150.00',
      letterDate: '2026-10-10',
      denialReasonRaw: 'Non-formulary medication / step therapy required',
      denialCodes: [
        {
          code: 'PR-204',
          term: 'Step Therapy / Prior Authorization',
          plainMeaning: 'Insurer requires patient to try lower-cost drugs first.',
        },
      ],
      deadlinePhrase: 'within 180 days of receipt of this notice',
      deadlineType: 'relative',
      explicitDate: null,
      relativeDays: 180,
    };

    const parsed = ExtractedFactsSchema.parse(mockExtraction);
    expect(parsed.insurer).toBe('Summit Health Care');
    expect(parsed.relativeDays).toBe(180);
    expect(parsed.explicitDate).toBeNull();
  });

  it('validates a complete generated Action Kit payload with tokens', () => {
    const mockKit = {
      plainEnglishSummary: 'Summit Health Care refused to cover your prescription because they want you to try preferred alternatives first.',
      whatThisMeans: 'You have the right to request a formal exception. Your prescribing doctor can submit clinical records showing alternative medications failed.',
      appealLetterTemplate: 'Dear Appeals Department at {{INSURER}},\n\nI am appealing denial for claim {{CLAIM_NUMBER}} in the amount of {{DISPUTED_AMOUNT}}. Please review before {{DEADLINE_DATE}}.\n\nSincerely,\n[Your Name]',
      phoneScript: {
        beforeYouCall: ['Gather prescription history', 'Have policy number ready'],
        whatToSay: 'I am calling to appeal the formulary denial for claim SH-551920-RX.',
        ifTheySay: [
          {
            objection: 'Step therapy is required by policy.',
            response: 'My physician has documented contraindications to the formulary alternatives.',
          },
        ],
        beforeYouHangUp: ['Record reference number', 'Confirm fax number'],
      },
      calendarEvent: {
        title: 'Appeal Deadline: Summit Health Care SH-551920-RX',
        description: 'Estimated deadline (180 days). Confirm with insurer.',
      },
    };

    const parsed = GeneratedKitSchema.parse(mockKit);
    expect(parsed.appealLetterTemplate).toContain('{{INSURER}}');
    expect(parsed.phoneScript.ifTheySay).toHaveLength(1);
  });
});
