import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { checkRateLimit } from '@/lib/rate-limiter';
import { extractDocumentFacts } from '@/lib/gemini';
import { SAMPLE_CASES } from '@/lib/sample-data';
import { ExtractedFactsValidated } from '@/lib/schemas';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting Check (10 req/min)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before analyzing another document.' },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const sampleId = formData.get('sampleId') as string | null;
    const file = formData.get('file') as File | null;

    // 2. Demo Mode Switch / Sample Fast Path
    const isDemoCached = process.env.DEMO_MODE === 'cached';

    if (sampleId && SAMPLE_CASES[sampleId]) {
      const sample = SAMPLE_CASES[sampleId];

      if (isDemoCached) {
        console.log(`[API /extract] Mode: cached (Sample: ${sampleId})`);
        return NextResponse.json(sample.facts);
      }

      // If live mode, run through live Gemini API with fallback to golden sample data
      console.log(`[API /extract] Mode: live (Sample: ${sampleId}) - Calling Gemini Flash API`);
      try {
        const sampleFileName = path.basename(sample.imagePath);
        const sampleFilePath = path.join(process.cwd(), 'public', 'samples', sampleFileName);
        const fileBuffer = await fs.readFile(sampleFilePath);
        const base64Data = fileBuffer.toString('base64');

        const facts = await extractDocumentFacts(base64Data, 'image/png');
        console.log(`[API /extract] Mode: live (Sample: ${sampleId}) - Extraction SUCCESS`);
        return NextResponse.json(facts);
      } catch (geminiError) {
        console.warn(`[API /extract] Live extraction failed for sample ${sampleId}, falling back to golden data:`, geminiError);
        return NextResponse.json(sample.facts);
      }
    }

    // 3. Custom Upload Validation
    if (!file) {
      return NextResponse.json({ error: 'No document file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 3 MB limit. Please upload a smaller file.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PNG, JPG, or PDF single-page document.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Server-side PDF Single-Page Inspection
    if (file.type === 'application/pdf') {
      try {
        const pdfDoc = await PDFDocument.load(buffer);
        const pageCount = pdfDoc.getPageCount();
        if (pageCount !== 1) {
          return NextResponse.json(
            { error: `Only single-page letters are supported in this demo. Your PDF has ${pageCount} pages.` },
            { status: 400 }
          );
        }
      } catch (pdfErr) {
        return NextResponse.json(
          { error: 'Unable to parse PDF file. Please ensure it is a valid single-page PDF document.' },
          { status: 400 }
        );
      }
    }

    // 5. Invoke Gemini Multimodal Extraction
    console.log(`[API /extract] Mode: live (Custom upload: mime=${file.type}, size=${file.size}B) - Calling Gemini Flash API`);
    const base64Data = buffer.toString('base64');
    const facts: ExtractedFactsValidated = await extractDocumentFacts(base64Data, file.type);
    console.log(`[API /extract] Mode: live (Custom upload) - Extraction SUCCESS for ${facts.insurer}`);

    return NextResponse.json(facts);
  } catch (error) {
    console.error('[API /extract] Unhandled extraction error:', error);
    return NextResponse.json(
      {
        error: 'We were unable to analyze this document. Please ensure it is a clear, legible denial letter and try again.',
      },
      { status: 500 }
    );
  }
}
