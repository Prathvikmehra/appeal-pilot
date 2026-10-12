---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Project setup, types, and Zod schemas**
  Becomes usable: A clean Next.js project with TypeScript, Tailwind CSS, Lucide React, `@google/genai`, `pdf-lib`, `zod`, and `vitest` installed and configured, with core domain types (`types/appeal.ts`), Zod validation schemas (`lib/schemas.ts`), and `.env.example`.
  Why now: Proves project setup and scaffolding first, establishing strict shared type and schema contracts that every later slice builds upon without ambiguity.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Initialize Next.js App Router scaffold, install dependencies, configure Tailwind and TypeScript, create `types/appeal.ts`, `lib/schemas.ts`, and `.env.example`.
  Verify (mechanical): Run `npx tsc --noEmit` and confirm zero TypeScript errors.
  Learner check: Inspect `types/appeal.ts` and `lib/schemas.ts` and confirm all fields match the spec.
  Commit: `Initialize project with Next.js, Tailwind, types, and Zod schemas`

- [ ] **2. Date calculator, ics generator, and passing Vitest test suite**
  Becomes usable: A thoroughly tested, pure TypeScript date calculation engine (`lib/date-calculator.ts`) handling explicit dates, 180-day relative projections, and missing dates with date-only math (no UTC timezone shifts), plus RFC 5545 `.ics` builder (`lib/ics-generator.ts`) with line-folding and automated alarm triggers, all verified green by Vitest.
  Why now: Risk-first. Date arithmetic and calendar generation are critical algorithms that must never be wrong or hallucinated; proving them in isolation with automated tests ensures bulletproof reliability before building the UI.
  PRD ref: `prd.md > Features and Behavior > 3. Plain-English Explanation Card`, `prd.md > Features and Behavior > 4. 3-Piece Action Kit`
  Spec ref: `spec.md > Date Engine Specification`, `spec.md > Components > 10. CalendarTab`, `spec.md > Verification Plan & Unit Testing`
  Build: Implement `lib/date-calculator.ts`, `lib/ics-generator.ts`, `tests/date-calculator.test.ts`, `tests/ics-generator.test.ts`, and `vitest.config.ts`.
  Verify (mechanical): Run `npx vitest run` and confirm all unit tests pass with 100% success.
  Learner check: Run `npm test` in your terminal and verify all date edge cases and calendar formatting tests pass.
  Commit: `Add date calculator, ics generator, and passing Vitest test suite`

- [ ] **3a. Sample letter PNGs, sample data, landing view, upload dropzone, letter preview, and progress tracker**
  Becomes usable: Visual shell and document intake. Three realistic synthetic denial letter PNGs in `public/samples/` (fictional insurers, fake claim numbers, dates in early Oct 2026), `lib/sample-data.ts`, the landing page hero, sample selector cards, secondary upload dropzone, sticky letter viewer, and 4-step progress tracker.
  Why now: De-risks the visual intake layout and asset generation before building the complex result cards and interactive tabs.
  PRD ref: `prd.md > Screens and Layout > 1. Landing View`, `prd.md > Features and Behavior > 1. Sample Case & Upload Intake`
  Spec ref: `spec.md > Components > 1-5`, `spec.md > Sample Cases Configuration`
  Build: Generate three synthetic sample letter PNGs in `public/samples/`, build `lib/sample-data.ts`, implement `Header.tsx`, `SampleSelector.tsx`, `FileUploader.tsx`, `LetterPreview.tsx`, and `ProgressTracker.tsx`.
  Verify (mechanical): Start Next.js dev server, verify compilation, confirm all 3 sample images load and sample selection triggers the progress tracker view.
  Learner check: Open `http://localhost:3000`, see the landing cards with mini letter previews, click a card, and see the letter preview and progress tracker animate.
  Commit: `Build landing view, sample letter cards, uploader, preview, and progress tracker`

- [ ] **3b. Plain-English explanation card, reactive facts row, Action Kit tabs, and .ics download**
  Becomes usable: Complete end-to-end interactive UI powered by golden data. Renders the Plain-English card (with deadline countdown and sourced KFF statistic) and 3-tab Action Kit (Appeal Letter, Phone Script, Calendar Reminder). Fact edits in the facts row reactively update the letter text in real time; "Change date" shifts urgency states; and `.ics` files download directly.
  Why now: Completes the full user journey on screen, enabling immediate hands-on verification of interactive token replacement and calendar export before connecting live network APIs.
  PRD ref: `prd.md > Features and Behavior > 3. Plain-English Explanation Card`, `prd.md > Features and Behavior > 4. 3-Piece Action Kit`
  Spec ref: `spec.md > Components > 6-11`, `spec.md > Data Model`
  Build: Implement `ExplanationCard.tsx`, `ActionKit.tsx`, `AppealLetterTab.tsx`, `PhoneScriptTab.tsx`, `CalendarTab.tsx`, `DatePickerModal.tsx`, `Footer.tsx`, and wire state in `app/page.tsx`.
  Verify (mechanical): Run dev server, simulate sample selection, edit facts row to verify instant letter updates, test date change urgency shift, and verify `.ics` download trigger.
  Learner check: Open `http://localhost:3000`, test editing facts row fields, switch between the 3 tabs, test the "Change date" modal, download the `.ics` file, and test "Start over".
  Commit: `Add explanation card, reactive token replacement, Action Kit tabs, and ics download`

- [ ] **4. Gemini extract and generate server routes, live upload test fixture, and live pipeline connection**
  Becomes usable: Live AI processing pipeline. Server routes `/api/extract` (multimodal `@google/genai`) and `/api/generate` (text `@google/genai` with prompt defense and native responseSchema) connected sequentially to the UI. Includes a 4th standalone synthetic test letter (not in the sample cards) to prove the live upload path, plus a 2-page PDF fixture for rejection testing.
  Why now: Connects the live AI intelligence to an already tested UI foundation and proves both sample and custom file upload flows work end to end.
  PRD ref: `prd.md > Features and Behavior > 2. Analysis Pipeline & Progress Display`
  Spec ref: `spec.md > External Services and Dependencies`, `spec.md > Server-Side Safety & Security Policies`
  Build: Implement `lib/gemini.ts`, `lib/rate-limiter.ts`, `src/app/api/extract/route.ts`, `src/app/api/generate/route.ts`, generate 4th test letter and 2-page test PDF in `tests/fixtures/`, and connect client coordinator.
  Verify (mechanical): Send test requests to `/api/extract` and `/api/generate` and verify validated responses; test uploading the 4th synthetic letter via the live route.
  Learner check: Add your `GEMINI_API_KEY` to `.env.local` and test analyzing the 4th synthetic letter through the upload box.
  Commit: `Implement Gemini extract and generate routes and connect live pipeline`

- [ ] **5. Demo-recording switch (DEMO_MODE=cached), golden fallback safety net, and server-side PDF validation**
  Becomes usable: Demo safety and validation engine. Adding `DEMO_MODE=cached` to `.env.local` forces the 3 samples to return deterministic golden data for video recording. Without it, live pipeline runs with automatic fallback to golden data on failure. Server-side `pdf-lib` inspects PDFs, rejecting multi-page files with a 400 error, and enforces the 3 MB upload limit.
  Why now: Ensures 100% reproducible video recording while protecting production deployments from invalid uploads or rate-limit failures.
  PRD ref: `prd.md > States and Boundaries > Upload Error State & API Error State`
  Spec ref: `spec.md > Important Failure Modes`, `spec.md > Server-Side Safety & Security Policies`
  Build: Implement `DEMO_MODE=cached` toggle in server routes, integrate `pdf-lib` page-count check, 3 MB body limit, error try/catch fallback handlers, and friendly error banners.
  Verify (mechanical): Test `DEMO_MODE=cached` to verify guaranteed sample return; test simulated API failure fallback; upload multi-page PDF fixture and verify rejection.
  Learner check: Set `DEMO_MODE=cached` in `.env.local` and confirm sample analysis is instant and deterministic for your video demo.
  Commit: `Add DEMO_MODE switch, sample fallback safety net, and pdf-lib page validation`

- [ ] **6. Design polish, accessibility, external checks (KFF link, Gemini model, repo prep), and README**
  Becomes usable: Hackathon-ready production repository. Verified KFF link and statistic, verified model name in `GEMINI_MODEL`, verified zero personal data in any fixture or doc, keyboard-navigable tabs and focus rings, WCAG color contrast, and complete `README.md` with architecture diagram, demo video protocol, and transparent disclosures.
  Why now: Final polish and validation required for Devpost judging and repository release.
  PRD ref: `prd.md > Look and Feel`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Add keyboard focus outlines and ARIA tab roles, verify KFF stat against kff.org, check `GEMINI_MODEL` compatibility, audit repo for secrets/PII, and write production `README.md`.
  Verify (mechanical): Run full project build (`npm run build`) and test suite (`npm test`) with zero warnings or errors; verify `.gitignore` excludes `.env*` and `learner-profile.md`.
  Learner check: Tab through the entire app using only the keyboard, inspect mobile layout, and review the README.
  Commit: `Refine accessibility, verify external sources and model, and add comprehensive README`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 3b (Full interactive UI running on golden data)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be recorded upon completion]
Route and stops: [to be recorded upon completion]
Edit outcome: [to be recorded upon completion]
Reflection: [to be recorded upon completion]
Activity mode: [to be recorded upon completion]

## Revisions

