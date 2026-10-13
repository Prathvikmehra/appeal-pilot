import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { POST as extractHandler } from '../src/app/api/extract/route';
import { POST as generateHandler } from '../src/app/api/generate/route';
import { SAMPLE_CASES } from '../src/lib/sample-data';

describe('Route Handlers: /api/extract & /api/generate', () => {
  const originalEnv = process.env.DEMO_MODE;

  beforeEach(() => {
    process.env.DEMO_MODE = 'cached';
  });

  afterEach(() => {
    process.env.DEMO_MODE = originalEnv;
  });

  it('DEMO_MODE=cached returns deterministic golden facts for sample cases without AI calls', async () => {
    const formData = new FormData();
    formData.append('sampleId', 'prior-auth');

    const req = new NextRequest('http://localhost:3000/api/extract', {
      method: 'POST',
      body: formData,
    });

    const res = await extractHandler(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.insurer).toBe('ApexCare Health Plan');
    expect(json.claimNumber).toBe('AC-892104-M');
    expect(json.disputedAmount).toBe('$4,200.00');
  });

  it('DEMO_MODE=cached returns deterministic golden Action Kit for sample cases', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sampleId: 'prior-auth',
        facts: SAMPLE_CASES['prior-auth'].facts,
      }),
    });

    const res = await generateHandler(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.appealLetterTemplate).toContain('ApexCare Health Plan');
    expect(json.plainEnglishSummary).toContain('ApexCare refused to pay');
  });

  it('Rejects multi-page PDF with 400 error and single-page policy message', async () => {
    const multiPdfPath = path.join(process.cwd(), 'tests', 'fixtures', 'multi-page.pdf');
    const multiPdfBuffer = fs.readFileSync(multiPdfPath);
    const file = new File([multiPdfBuffer], 'multi-page.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/extract', {
      method: 'POST',
      body: formData,
    });

    const res = await extractHandler(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('Only single-page letters are supported in this demo');
    expect(json.error).toContain('2 pages');
  });

  it('Rejects files exceeding 3 MB limit with 400 error', async () => {
    // 3.5 MB dummy buffer
    const largeBuffer = Buffer.alloc(3.5 * 1024 * 1024);
    const file = new File([largeBuffer], 'giant-document.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/extract', {
      method: 'POST',
      body: formData,
    });

    const res = await extractHandler(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('File size exceeds the 3 MB limit');
  });

  it('Rejects unsupported file types (e.g. text/plain) with 400 error', async () => {
    const textBuffer = Buffer.from('Just text');
    const file = new File([textBuffer], 'notes.txt', { type: 'text/plain' });

    const formData = new FormData();
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/extract', {
      method: 'POST',
      body: formData,
    });

    const res = await extractHandler(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain('Unsupported file format');
  });
});
