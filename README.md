# Appeal Pilot 🛡️

> **Turn confusing health insurance denials into clear, actionable appeal plans.**  
> Built for the Devpost hackathon *Build With AI: Basics*.

---

## Overview

Every year, millions of patients receive bewildering health insurance denial notices filled with cryptic billing codes, tight appeal windows, and legalese. Most never appeal because they don't understand why they were denied or what to do next.

**Appeal Pilot** bridges this gap in under 60 seconds. A patient selects one of three realistic sample denial cases or uploads a single-page notice (PNG, JPG, or PDF). Appeal Pilot:

1. **Decodes the denial** into plain English without jargon.
2. **Calculates the exact appeal deadline** using deterministic date-only mathematics.
3. **Generates a 3-piece Action Kit**:
   - ✉️ **Dispute Letter**: An assertive, formal appeal letter template with live reactive field interpolation and patient placeholder chips (`[Your Name]`, `[Policy ID]`).
   - 📞 **Phone Script**: A practical 4-stage call guide with counter-responses to common insurer objections.
   - 📅 **Calendar Reminder**: An RFC 5545 `.ics` file with built-in reminder alarms to ensure the deadline is never missed.

---

## System Architecture

Appeal Pilot uses a **2-stage decoupled pipeline** that separates multimodal vision extraction from action kit text generation, connected by deterministic TypeScript date calculations:

```
┌────────────────────────────────────────────────────────┐
│                   Uploaded Letter                      │
│             (PNG / JPG / Single-page PDF)              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Stage 1: Multimodal Extraction (/api/extract)        │
│   • Google Gemini Flash (Vision)                       │
│   • System Prompt Injection Defense                    │
│   • Native JSON Schema: ExtractedFactsSchema           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Deterministic Date Engine (TypeScript in Code)       │
│   • Integer date-only math (zero UTC timezone drift)   │
│   • Explicit dates, relative 180-day calculations      │
│   • Alarm schedules (14/3 days or 7/1 days prior)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│   Stage 2: Action Kit Generation (/api/generate)       │
│   • Google Gemini Flash (Text)                         │
│   • Structured Response: GeneratedKitSchema            │
│   • Injects editable tokens ({{INSURER}}, etc.)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Interactive Client UI                  │
│   • Sticky side-by-side letter preview                 │
│   • Real-time reactive facts row token propagation     │
│   • "Change date" modal with instant urgency shifts    │
│   • RFC 5545 .ics download & clipboard export          │
└────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Two-Column Results Layout
- **Sticky Original Letter**: Stays visible on the left side of desktop screens (and top banner on mobile) so the patient can always compare the plain-English explanation against the insurer's actual wording.
- **Deadline Banner**: High-priority alert banner that dynamically shifts to a warm amber urgency badge whenever the deadline is within 14 days or marked as estimated.

### 2. Live Reactive Token Replacement
- Edits made in the **Verified Case Facts** row (Insurer Name, Claim / Reference #, Disputed Amount, or Letter Date) instantly update the appeal letter in real time without needing a new AI call.

### 3. Three-Case Deterministic Deadline Engine
Appeal Pilot never presents a guessed deadline as certain:
1. **Explicit Date**: Stated directly in the letter (`2027-04-01`). Alarms set for 7 days and 1 day prior.
2. **Relative Deadline**: Phrased as a timeframe (e.g., *"within 180 days"*). Calculated from the letter date with an *"Estimated"* badge, showing the math (`180 days from Oct 6, 2026 notice`). Alarms set for 14 days and 3 days prior.
3. **Missing Date**: When no deadline is found, a neutral notice is displayed and an inline date picker allows the patient to choose their own deadline.

### 4. 3-Piece Action Kit
- **Appeal Letter Tab**: One-click **Copy to Clipboard** and **Download .txt**.
- **Phone Script Tab**: Four structured sections: *"Before you call"*, *"What to say"*, *"If they say..."*, and *"Before you hang up"*.
- **Calendar Reminder Tab**: Instant **Add to Calendar** button generating an RFC 5545 compliant `.ics` calendar event with RFC 5545 line folding and character escaping.

---

## Important Disclosures & Privacy

### Privacy & Data Handling
> **We don't store your uploads.** Letters are sent to an AI service for analysis, so please don't upload real personal or medical information in this demo. Appeal Pilot provides guidance and templates, not legal or medical advice.

- **Zero Persistence**: All application state resides exclusively in memory in the client browser session. Clicking **Start over** or refreshing immediately clears all data.
- **Single-Page Safety**: Uploads are restricted to 3 MB and validated on the server. Multi-page PDFs are rejected by `pdf-lib` to protect serverless quotas.

### Sourced Research Context
The explanation card includes a verified, static benchmark statistic:
> *"In Medicare Advantage, only about 11.5% of denials were appealed in 2024, yet about 80% of those appeals were overturned ([KFF, 2024](https://www.kff.org/medicare/issue-brief/overturned-denials-in-medicare-advantage/)). Appeals are often worth trying, though this figure covers Medicare Advantage and offers no guarantee for your specific case."*

### Demo Recording Mode & Fallback Architecture
- **`DEMO_MODE=cached`**: When set in `.env.local`, the server routes immediately return the deterministic golden sample data for the three sample cases. This guarantees 100% reproducible demo video recordings without API latency or rate limit surprises.
- **Live Mode with Fallback**: When `DEMO_MODE` is disabled, the sample cases run through the live Gemini API. If the API key is unconfigured, rate-limited, or fails validation, the system automatically falls back to golden sample data to prevent a broken demo.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **AI SDK**: `@google/genai` (Official Google GenAI SDK, Gemini Flash)
- **Validation**: Zod (Runtime JSON schema validation)
- **Document Processing**: `pdf-lib` (Single-page PDF inspection & fixtures)
- **Icons**: Lucide React
- **Testing**: Vitest (29 unit & route integration tests)

---

## Getting Started

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- (Optional) Google AI Studio API Key for live extraction

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/appeal-pilot.git
cd appeal-pilot

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root (see `.env.example`):
```bash
# Google Gemini API Key (optional for sample cases in DEMO_MODE)
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model (defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash

# Set to "cached" for reproducible demo recordings
DEMO_MODE=cached
```

### 4. Run Test Suite
```bash
npm test
```
All 29 unit and route integration tests should pass:
- `tests/date-calculator.test.ts` (14 tests)
- `tests/ics-generator.test.ts` (5 tests)
- `tests/server-validation.test.ts` (5 tests)
- `tests/routes.test.ts` (5 tests)

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License
MIT License. Built with ❤️ for everyday patients navigating health insurance.
