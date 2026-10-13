import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { extractDocumentFacts, generateActionKit } from '../src/lib/gemini';
import { calculateDeadline } from '../src/lib/date-calculator';

// Attempt to load .env.local if present so test:live can run seamlessly without manually exporting env vars in terminal
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.trim().replace(/^['"](.*)['"]$/, '$1');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Only run live network tests against Gemini when explicitly requested via "npm run test:live"
// or RUN_LIVE_TESTS=true, and a live GEMINI_API_KEY is present and DEMO_MODE is not cached.
const isLiveRequested = process.env.RUN_LIVE_TESTS === 'true' || process.env.npm_lifecycle_event === 'test:live';
const shouldSkip = !process.env.GEMINI_API_KEY || process.env.DEMO_MODE === 'cached' || !isLiveRequested;

describe('Live Gemini Pipeline (Slice 4 Proof)', () => {
  it.skipIf(shouldSkip)('extracts real facts from 4th synthetic test PDF and generates Action Kit', async () => {
    const pdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-denial-letter.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    const base64 = pdfBytes.toString('base64');

    console.log('[Live Test: PDF] Calling extractDocumentFacts on test-denial-letter.pdf...');
    const facts = await extractDocumentFacts(base64, 'application/pdf');
    console.log('[Live Test: PDF] Extracted facts:', facts);

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

    console.log('[Live Test: PDF] Calling generateActionKit with extracted facts...');
    const kit = await generateActionKit(facts, computed);
    console.log('[Live Test: PDF] Action Kit summary:', kit.plainEnglishSummary);

    expect(kit.plainEnglishSummary.length).toBeGreaterThan(10);
    expect(kit.appealLetterTemplate).toContain('{{INSURER}}');
    expect(kit.appealLetterTemplate).toContain('{{CLAIM_NUMBER}}');
    expect(kit.phoneScript.whatToSay.length).toBeGreaterThan(10);
  }, 120000);

  it.skipIf(shouldSkip)('extracts real facts from synthetic sample PNG letter through live upload path', async () => {
    const pngPath = path.join(process.cwd(), 'public', 'samples', 'prior-auth.png');
    const pngBytes = fs.readFileSync(pngPath);
    const base64 = pngBytes.toString('base64');

    console.log('[Live Test: PNG] Calling extractDocumentFacts on prior-auth.png...');
    const facts = await extractDocumentFacts(base64, 'image/png');
    console.log('[Live Test: PNG] Extracted facts:', facts);

    // Verify key facts match the printed synthetic letter image
    expect(facts.insurer.toLowerCase()).toContain('apex');
    expect(facts.disputedAmount).toContain('4,200');
    expect(facts.letterDate).toBe('2026-10-03');
    expect(facts.deadlineType).toBe('explicit');
    expect(facts.explicitDate).toBe('2027-04-01');

    // Compute deadline for explicit date: 2027-04-01
    const computed = calculateDeadline({
      deadlineType: facts.deadlineType,
      explicitDate: facts.explicitDate,
      relativeDays: facts.relativeDays,
      letterDate: facts.letterDate,
      todayStr: '2026-10-12',
    });

    expect(computed.targetDate).toBe('2027-04-01');
    expect(computed.isEstimated).toBe(false);

    console.log('[Live Test: PNG] Calling generateActionKit for PNG facts...');
    const kit = await generateActionKit(facts, computed);
    console.log('[Live Test: PNG] Action Kit summary:', kit.plainEnglishSummary);
    expect(kit.plainEnglishSummary.length).toBeGreaterThan(10);
    expect(kit.appealLetterTemplate).toContain('{{INSURER}}');
  }, 120000);
});
