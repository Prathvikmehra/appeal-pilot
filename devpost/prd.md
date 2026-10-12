---
doc: prd
status: approved
---

# Appeal Pilot — Product Requirements

Appeal Pilot turns a confusing health insurance denial letter into a plan you can act on today, with the deadline already on your calendar.
Source: `scope.md > # Appeal Pilot`, `scope.md > The Unique Kernel`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **Arrival**: The user arrives at a calm, single-screen landing page with a clear value proposition, three realistic preloaded sample case cards ("Prior Auth Denied", "Not Medically Necessary", "Out-of-Network Surprise Bill"), and a secondary upload box for a single-page document.
2. **Trigger**: The user clicks one of the sample cards (the primary happy path) or uploads a single-page PNG/JPG/PDF.
3. **Analysis Transition**: The landing content fades out. A continuous analysis view opens without full-page reload, showing the selected letter on the left and a 4-step progress list on the right:
   - "Reading your letter"
   - "Finding the denial reason, amount, and deadline"
   - "Translating it into plain English"
   - "Building your action kit"
4. **Staged Reveal**: Under 10 seconds, the Plain-English Explanation card slides in first, followed by the complete 3-piece Action Kit below it. The progress list collapses into a clean "Analysis complete" status indicator.
5. **Review Explanation**: The user sees the prominent deadline banner at the top (with days remaining), a 1-sentence plain-English summary, a quick facts row, translated denial codes/jargon, and a "What this means for you" advisory note.
6. **Act with the Action Kit**: The user reviews the 3 tabs:
   - **Appeal letter**: Inspects formatted text with highlighted placeholder fields (`[Your Name]`, etc.), clicks **Copy** or **Download**.
   - **Phone script**: Reads talking points ("Before you call", exact opening words, objection replies, "Before you hang up" checklist) and clicks **Copy**.
   - **Calendar reminder**: Views deadline event details and clicks **Add to calendar** to download the `.ics` reminder file.
7. **Reset or Repeat**: The user clicks **Start over** in the footer to return to the landing cards with zero saved state.

## Screens and Layout
Source: `scope.md > Inspiration & Identity`.

Appeal Pilot is a responsive, single-page web app with two visual states connected by smooth transitions:

### 1. Landing View
- **Header**: Minimal Appeal Pilot logo/wordmark.
- **Hero**: Clear headline: *"Got a confusing health insurance denial? Let's turn it into a plan."* Supported by a subhead outlining the explanation + Action Kit.
- **Sample Selection Grid**: Three sample cards displayed side-by-side on desktop (stacked on mobile). Each card mimics a physical letter with simulated insurer header, cropped/blurred dense text snippet, a scenario badge (e.g., *"Prior Auth Denied"*), and a 1-line hint (e.g., *"Denied $4,200 MRI"*). Subtle hover lift.
- **Upload Area**: Separated by an *"or"* divider; a dashed upload box with instructions: *"Upload a single-page letter (PNG, JPG, or 1-page PDF)"*, max file size indicator, and drag-and-drop support.
- **Footer**: Persistent notice: *"We don't store your uploads. Letters are sent to an AI service for analysis, so please don't upload real personal or medical information in this demo. Appeal Pilot provides guidance and templates, not legal or medical advice."*

### 2. Analysis & Results View
- Two-column desktop layout (stacked vertically on mobile):
  - **Left Column**: Sticky preview of the document being analyzed, allowing the user to cross-reference extracted terms against the source text.
  - **Right Column**:
    - *Top*: 4-step progress list during processing, collapsing to a compact badge upon completion.
    - *Middle*: Plain-English Explanation card with urgent deadline banner at top.
    - *Bottom*: 3-tab Action Kit (Appeal Letter, Phone Script, Calendar Reminder).
- **Footer**: Fixed/persistent footer with **Start over** button and the same persistent privacy/advice notice.

## Look and Feel
- **Aesthetic**: Calm, reassuring health-advocate feel; trustworthy, modern, and clinical without looking cold or bureaucratic.
- **Palette**: Off-white/slate background, deep navy/slate typography, soft muted teal primary accent for actions and checkmarks, and a warm amber/coral accent reserved strictly for deadline urgency.
- **Typography**: Clean, highly legible sans-serif typeface (e.g., Inter) with distinct visual weights separating legal jargon excerpts from plain-English interpretations.
- **Spacing**: Generous breathing room, rounded card containers, subtle borders, and smooth CSS transitions.

## Features and Behavior

### 1. Sample Case & Upload Intake
Source: `scope.md > The POC Boundary > Included (Now)`.
- **Preloaded Synthetic Cases**:
  1. *Prior Auth Denied*: Routine MRI denied for lack of pre-approval; explicit deadline date set comfortably in the future.
  2. *Not Medically Necessary*: Physical therapy claim denied as "not medically indicated"; relative deadline (*"within 180 days of this notice"*).
  3. *Out-of-Network Surprise Bill*: Emergency room visit balance-billed out-of-network; explicit deadline date set comfortably in the future.
  *Note*: Explicit deadlines compute days-left at runtime relative to `today`. In the demo video, shifting into the amber urgent state (<14 days) is shown via the inline "Change date" control.
- **Single-Page File Upload**: Client validates file format (`.png`, `.jpg`, `.jpeg`, `.pdf`) and size (<5MB). Files exceeding limits trigger an immediate inline error.

### 2. Analysis Pipeline & Progress Display
- Real pipeline stages reflected in the UI with animated state transitions.
- Staged disclosure: renders the explanation card as soon as parsing completes, loading the Action Kit immediately after.
- Typical completion target: < 10 seconds.

### 3. Plain-English Explanation Card
- **Deadline Banner**:
  - *Explicit Date*: Displays exact date, countdown of days remaining computed at runtime (`"Appeal by Mar 14, 2027 • 38 days left"`), and color shift (amber/coral) when < 14 days.
  - *Relative Date*: Displays calculated date, `"Estimated"` badge, explanation of the math (`"180 days from Sept 15 notice"`), and a note to confirm with the insurer.
  - *Missing Date*: Displays neutral notice: *"We couldn't find a deadline in this letter. Many insurers allow about 180 days, but check the letter or call your insurer to confirm."*
  - *Inline Date Editor*: A small `"Change date"` control allows manual date override across all three modes, updating banner, letter, and `.ics` synchronously.
- **One-Sentence Summary**: Conversational takeaway (e.g., *"Your insurer refused to pay for your MRI because they claim it wasn't pre-approved."*).
- **Facts Row**: Badges for Insurer Name, Claim/Reference Number, Disputed Amount, and Letter Date.
- **Why They Denied It**: Jargon/code tags with inline conversational explanations.
- **What This Means for You**: Short advisory summary of user options (appeal, peer-to-peer review, hospital dispute).
- **"Good to Know" Note**: Sourced industry statistic: *"In Medicare Advantage, only about 11.5% of denials were appealed in 2024, yet about 80% of those appeals were overturned (KFF)."* Framed as *"Appeals are often worth trying"* while explicitly noting that this figure covers Medicare Advantage and offers no promise or guarantee for the user's specific case.

### 4. 3-Piece Action Kit
Source: `scope.md > The Unique Kernel`.
- **Tab 1: Appeal Letter**:
  - Formatted dispute letter referencing patient details, claim number, and grounds for dispute.
  - Clearly styled placeholder chips (`[Your Name]`, `[Policy ID]`) to prompt personal completion.
  - **Copy to Clipboard** button (with confirmation toast) and **Download** button (`.txt`).
- **Tab 2: Phone Script**:
  - Structured conversation guide:
    - *Before you call*: Checklist of documents and numbers to have ready.
    - *What to say*: Word-for-word opening statement.
    - *If they say...*: 2–3 common representative pushbacks with prepared rebuttal points.
    - *Before you hang up*: Checklist (rep name, call reference ID, next date).
  - **Copy to Clipboard** button.
- **Tab 3: Calendar Reminder**:
  - Event summary card with reminder date and time.
  - If deadline is missing, renders an interactive date picker before allowing download.
  - **Add to Calendar** button generating a standard `.ics` file with title, description, and automated alert alarms (14 days and 3 days prior for estimated; 7 days and 1 day prior for explicit).

## States and Boundaries

- **First Use (Landing)**: Clean slate, 3 prominent sample cards, secondary upload zone.
- **Processing State**: 4-step progress list active; letter preview locked in place; cancel/start over accessible.
- **Success State**: Complete explanation and Action Kit populated, reactive date updates enabled.
- **Upload Error State**: Unsupported format, multi-page file, or file >5MB shows clear inline message: *"We couldn't read that file. Try a sample case instead."*
- **API Error / Rate Limit State**:
  - For preloaded samples: transparently falls back to pre-saved golden JSON/text results; demo continues uninterrupted.
  - For custom uploads: displays graceful error notice with 1-click option to try a preloaded sample.
- **Persistence Boundary**: Zero local storage persistence, zero server database storage, zero cookie tracking. Refreshing or clicking "Start over" clears all session state.

## Product Decisions

- **Preloaded samples as first-class citizens**: Ensures reliable, zero-friction demonstration without requiring judges to find or generate synthetic medical documents.
- **Two-column results layout**: Keeps source letter visible side-by-side with analysis to build user trust and allow immediate verification of extracted details.
- **Multi-scenario deadline engine**: Explicit handling for exact dates, relative deadlines, and missing deadlines prevents dangerous AI hallucinations on strict legal timelines.
- **Pre-saved fallback safety net & Live pipeline transparency**: Protects live video recording and hackathon judging against transient third-party LLM outages. Uploads always execute through the live pipeline. This distinction is clearly disclosed in the repository README and Devpost submission.

## What We're Building
- [ ] Landing screen with hero, 3 sample cards, and secondary upload box.
- [ ] Document viewer component for sample images and user uploads.
- [ ] 4-step progress indicator with staged card reveal.
- [ ] Deadline intelligence module handling explicit, relative, missing, and manually edited dates.
- [ ] Plain-English explanation card with facts row and jargon translator.
- [ ] 3-tab Action Kit:
  - [ ] Appeal letter viewer with highlighted placeholder tokens, Copy, and Download (.txt).
  - [ ] Phone script viewer with call checklists, dialog script, and Copy.
  - [ ] Calendar reminder tab with `.ics` generator and download.
- [ ] Offline/golden fallback dataset for all 3 sample scenarios.
- [ ] Persistent privacy and "Not legal or medical advice" notice in landing and results views.

## Deferred From the POC
- **Line-item hospital bill dispute**: Auditing detailed CPT codes against chargemaster pricing; deferred to maintain focus on the single denial appeal flow.
- **Appeal success probability scoring**: Requires complex statistical training data; deferred to avoid misleading users.
- **Multi-document timeline tracker**: Managing back-and-forth correspondence over months; deferred for single-session scope.

## Possible Later Enhancements
- Exporting Appeal Letter directly to formatted PDF or DOCX.
- Email integration to send draft directly to the user's inbox.
- State-specific Department of Insurance external review guidance.

## Non-Goals
- **User authentication and profiles**: Adds friction and security overhead; not required for POC value.
- **Storing uploaded health records**: Strict zero-storage policy avoids HIPAA exposure and privacy concerns.
- **Legal representation or guaranteed outcomes**: Explicitly prohibited by product principles and disclaimer.
- **Native mobile applications**: Responsive web design covers desktop and mobile web cleanly.

## Open Questions
- **Deterministic Date Arithmetic**: All date math (180-day projection from letter date, days-left countdown computed from today's runtime date, and `.ics` reminder alarm triggers) must be calculated in deterministic TypeScript/JavaScript code, NOT generated or guessed by the LLM. The AI only extracts the raw letter date and the literal deadline clause. To be implemented in `4-spec`.

