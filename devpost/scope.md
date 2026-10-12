---
doc: scope
status: approved
---

# Appeal Pilot

Appeal Pilot turns a confusing health insurance denial letter into a plan you can act on today, with the deadline already on your calendar.

## The Unique Kernel
Turning an intimidating denial letter into an immediate, dated action plan: "here's what this means, here's what to do, and here's the deadline." The centerpiece is the **3-piece Action Kit** (ready-to-send appeal letter, word-for-word phone script with rebuttal points, and a downloadable `.ics` calendar deadline reminder)—delivering an organized, actionable next step that generic chatbots don't provide in one coherent flow.

## Who It's For
An everyday insured patient or caregiver who received a confusing denial letter or surprise out-of-network bill, feels overwhelmed by legalistic medical jargon, and risks missing strict appeal deadlines because they don't know what to say or where to start. Today, they either give up and pay out of pocket or spend hours searching generic forum advice.

## The Core Loop
The user opens the app, chooses one of three realistic preloaded sample letters (or uploads a single-page document) -> the AI decodes the denial in seconds into a plain-English explanation card -> the app generates the 3-piece Action Kit -> the user reviews the letter and phone script, and downloads the `.ics` calendar reminder and documents with one click.

## Inspiration & Identity
- **Tone & Mood**: Reassuring, clear, trustworthy, and actionable. Like having an advocate friend who knows health insurance rules on speed dial.
- **Visual Feel**: High-craft, clean health-tech aesthetic with calm typography, generous spacing, and clear visual hierarchy (distinguishing explanation from concrete action items).
- **Guardrails**: Prominent, persistent disclaimer that the tool provides guidance and templates, not legal or medical advice.

## Why This Matters to the Learner
Demystifying bureaucratic insurance processes so people don't abandon valid appeals out of frustration; practicing tight AI coding agent direction and spec-driven development to build a rock-solid product without scope creep or agent regressions.

## What "Working" Looks Like
In a 2–3 minute video demo, a viewer sees:
1. The app open with three realistic synthetic sample denial cards ("Prior Auth Denied", "Not Medically Necessary", "Out-of-Network Surprise Bill").
2. Clicking a sample (or uploading a 1-page synthetic letter) instantly runs the extraction pipeline.
3. A clear plain-English breakdown displays insurer, denial code/reason, billed amount, and appeal deadline.
4. The 3-piece Action Kit is generated and tabbed/previewed: an appeal letter, a phone script with dialogue, and a one-click download for the `.ics` calendar deadline file.
5. Opening the `.ics` file confirms the deadline event is on the user's calendar.

## The POC Boundary
- **Included (Now)**:
  - 3 preloaded synthetic denial letter cases with realistic sample images/text.
  - Pre-saved fallback results for sample cases: if the AI API fails, times out, or is rate-limited, the three sample cases seamlessly fall back to pre-saved golden results so the demo/video never breaks on camera. Uploads display a friendly, clear error message.
  - Single-page file upload (PNG, JPG, or 1-page PDF) with client-side file size and type validation.
  - Unified AI processing pipeline (same extraction logic for samples and uploads).
  - Structured extraction: insurer name, denial reason, disputed amount, deadline date.
  - Plain-English explanation view.
  - 3-piece Action Kit generator:
    1. Formatted appeal letter.
    2. Phone call script (talking points and representative objection handling).
    3. Standard `.ics` iCalendar file download with alarm/reminder.
  - Prominent "Not legal or medical advice" notice.
  - Zero storage / ephemeral state: no database, no uploads saved.

## Later
- Hospital bill line-item error checking.
- "Worth appealing?" appeal win-rate confidence score.
- Multi-letter case timeline tracker.

## Explicitly Cut
- **User accounts & authentication**: Unnecessary for proving the core value, introduces auth friction.
- **Database / server storage**: Privacy liability; ephemeral processing keeps user data safe.
- **Real medical data**: Strictly synthetic test fixtures to avoid HIPAA/privacy risks.
- **Native mobile app**: Responsive web app covers all demo needs with zero app store overhead.
- **Multi-insurer custom policy rules / legal advice**: Avoids false promises; provides structured templates rather than legal representation.
