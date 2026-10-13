import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { extractDocumentFacts, generateActionKit } from '../src/lib/gemini';
import { calculateDeadline } from '../src/lib/date-calculator';

describe('Live Gemini Pipeline (Slice 4 Proof)', () => {
  it('extracts real facts from 4th synthetic test PDF and generates Action Kit', async () => {
    // Only run if key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log('Skipping live test because GEMINI_API_KEY is not set');
      return;
    }

    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-denial-letter.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    const base64 = pdfBytes.toString('base64');

    console.log('Calling extractDocumentFacts on test-denial-letter.pdf...');
    const facts = await extractDocumentFacts(base64, 'application/pdf');
    console.log('Extracted facts from live model:', facts);

    expect(facts.insurer.toLowerCase()).toContain('summit');
    expect(facts.claimNumber).toContain('SH-551920-RX');
    expect(facts.disputedAmount).toContain('150');
    expect(facts.letterDate).toBe('2026-10-10');
    expect(facts.deadlineType).toBe('relative');
    expect(facts.relativeDays).toBe(180);

    // Date engine calculates deadline: 2026-10-10 + 180 days = 2027-04-08
    const computed = calculateDeadline({
      deadlineType: facts.deadlineType,
      explicitDate: facts.explicitDate,
      relativeDays: facts.relativeDays,
      letterDate: facts.letterDate,
      todayStr: '2026-10-12',
    });

    expect(computed.targetDate).toBe('2027-04-08');
    expect(computed.isEstimated).toBe(true);

    console.log('Calling generateActionKit with extracted facts...');
    const kit = await generateActionKit(facts, computed);
    console.log('Generated Action Kit summary:', kit.plainEnglishSummary);

    expect(kit.plainEnglishSummary.length).toBeGreaterThan(10);
    expect(kit.appealLetterTemplate).toContain('{{INSURER}}');
    expect(kit.appealLetterTemplate).toContain('{{CLAIM_NUMBER}}');
    expect(kit.phoneScript.whatToSay.length).toBeGreaterThan(10);
  }, 60000); // 60s timeout for live API
});
