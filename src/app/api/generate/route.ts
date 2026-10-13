import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { generateActionKit } from '@/lib/gemini';
import { SAMPLE_CASES } from '@/lib/sample-data';
import { ExtractedFactsSchema } from '@/lib/schemas';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting Check (10 req/min)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.headers.get('x-real-ip') || '127.0.0.1';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before generating another kit.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { facts, deadlineInfo, sampleId } = body;

    // 2. Demo Mode Switch / Sample Fast Path
    const isDemoCached = process.env.DEMO_MODE === 'cached';

    if (sampleId && SAMPLE_CASES[sampleId]) {
      const sample = SAMPLE_CASES[sampleId];

      if (isDemoCached) {
        return NextResponse.json(sample.kit);
      }

      // Live mode with fallback to cached golden data on failure
      try {
        const validatedFacts = ExtractedFactsSchema.parse(facts || sample.facts);
        const kit = await generateActionKit(validatedFacts, deadlineInfo);
        return NextResponse.json(kit);
      } catch (geminiError) {
        console.warn(`[API /generate] Live generation failed for sample ${sampleId}, falling back to golden data:`, geminiError);
        return NextResponse.json(sample.kit);
      }
    }

    // 3. Custom Upload Generation
    if (!facts) {
      return NextResponse.json({ error: 'Missing extracted facts in request body.' }, { status: 400 });
    }

    const validatedFacts = ExtractedFactsSchema.parse(facts);
    const kit = await generateActionKit(validatedFacts, deadlineInfo || {
      targetDate: null,
      deadlineType: 'missing',
      isEstimated: false,
      daysRemaining: null,
    });

    return NextResponse.json(kit);
  } catch (error) {
    console.error('[API /generate] Unhandled generation error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'We were unable to generate your action kit. Please try again.',
      },
      { status: 500 }
    );
  }
}
