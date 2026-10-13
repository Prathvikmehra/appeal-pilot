import { ExtractedFacts, GeneratedKit } from '@/types/appeal';

export interface SampleCase {
  id: string;
  title: string;
  subtitle: string;
  imagePath: string;
  badge: string;
  facts: ExtractedFacts;
  kit: GeneratedKit;
}

export const SAMPLES: SampleCase[] = [
  {
    id: 'prior-auth',
    title: 'Prior Auth Denied',
    subtitle: 'Denied $4,200 Lumbar Spine MRI',
    imagePath: '/samples/prior-auth.png',
    badge: 'Prior Authorization',
    facts: {
      insurer: 'ApexCare Health Plan',
      claimNumber: 'AC-892104-M',
      disputedAmount: '$4,200.00',
      letterDate: '2026-10-03',
      denialReasonRaw: 'Coverage of CPT 72148 Lumbar Spine MRI has been denied due to a lack of prior authorization under Plan Section 4.2.',
      denialCodes: [
        {
          code: 'PA-04',
          term: 'Prior Authorization Required',
          plainMeaning: 'Your plan requires pre-approval from the insurer before this scan can be scheduled.',
        },
        {
          code: 'CPT 72148',
          term: 'Lumbar Spine MRI Scan',
          plainMeaning: 'Magnetic resonance imaging scan of your lower spine requested by your physician.',
        },
      ],
      deadlinePhrase: 'You have the right to appeal this decision before April 1, 2027.',
      deadlineType: 'explicit',
      explicitDate: '2027-04-01',
      relativeDays: null,
    },
    kit: {
      plainEnglishSummary: 'ApexCare refused to pay for your $4,200 lower back MRI because your doctor did not submit a pre-approval request before the scan was performed.',
      whatThisMeans: 'This is an administrative denial, not a clinical determination that you didn’t need the MRI. In most cases, having your ordering physician submit retroactive clinical notes and medical records overturns this denial.',
      appealLetterTemplate: `ApexCare Health Plan
Appeals and Grievance Department
P.O. Box 41208
Springfield, IL 62704

Date: [Today's Date]
Patient Name: [Your Name]
Member ID: [Your Member ID]
Group Number: [Your Group Number]
Claim Number: {{CLAIM_NUMBER}}
Date of Service: 09/24/2026
Disputed Amount: {{DISPUTED_AMOUNT}}

RE: FORMAL EXPEDITED FIRST-LEVEL APPEAL FOR CLAIM {{CLAIM_NUMBER}}

Dear Appeals Committee,

I am writing to formally appeal the denial of coverage for my lumbar spine MRI (CPT 72148) performed on 09/24/2026 in the amount of {{DISPUTED_AMOUNT}}, which {{INSURER}} denied citing lack of prior authorization under Plan Section 4.2.

This scan was ordered urgently by my treating physician, [Doctor Name], due to progressive neurological radiculopathy and severe pain that failed conservative therapy. Because this service was medically necessary and delayed authorization would have jeopardized my care, administrative pre-authorization rules should be waived retroactively.

Attached to this appeal, please find:
1. Letter of Medical Necessity from Dr. [Doctor Name] detailing clinical history.
2. Clinical chart notes from the initial consultation showing failed conservative treatment.
3. A copy of the denial letter dated October 3, 2026.

According to plan documentation, the formal deadline for this appeal is {{DEADLINE_DATE}}. I respectfully request a complete redetermination and full retroactive authorization for this medically necessary procedure.

Sincerely,

[Your Name]
[Your Phone Number]
[Your Address]`,
      phoneScript: {
        beforeYouCall: [
          'Denial letter dated Oct 3, 2026',
          'Member ID: [Your Member ID]',
          'Claim number: AC-892104-M',
          'Name of ordering physician and facility where MRI occurred',
        ],
        whatToSay: 'Hello, I am calling regarding claim AC-892104-M for a denied MRI. It was denied for lack of prior authorization, and I want to submit a retroactive authorization and peer-to-peer review.',
        ifTheySay: [
          {
            objection: 'Retroactive authorization is not permitted under your plan rules.',
            response: 'My physician ordered this scan urgently based on acute symptoms. Can you check if a peer-to-peer physician review or retrospective medical necessity review can be opened?',
          },
          {
            objection: 'You must pay the provider directly.',
            response: 'I am actively appealing this claim within my statutory appeal period. Please place a temporary hold on collections while this appeal is reviewed.',
          },
        ],
        beforeYouHangUp: [
          'Ask for the representative’s full name and employee ID',
          'Ask for the call reference number',
          'Confirm the fax number and mailing address for the appeals department',
        ],
      },
      calendarEvent: {
        title: 'Appeal Deadline - ApexCare Claim AC-892104-M',
        description: 'Final deadline to submit formal appeal for MRI claim denial to ApexCare Health Plan.',
      },
    },
  },
  {
    id: 'medical-necessity',
    title: 'Not Medically Necessary',
    subtitle: 'Denied $1,850 Physical Therapy',
    imagePath: '/samples/medical-necessity.png',
    badge: 'Medical Necessity',
    facts: {
      insurer: 'Beacon Mutual Assurance',
      claimNumber: 'BM-441092-PT',
      disputedAmount: '$1,850.00',
      letterDate: '2026-10-06',
      denialReasonRaw: 'Coverage for Physical Therapy sessions (CPT 97110) in the amount of $1,850.00 is denied as not medically necessary beyond the initial benefit period.',
      denialCodes: [
        {
          code: 'MN-02',
          term: 'Not Medically Necessary',
          plainMeaning: 'The insurance company’s reviewer believes continuing physical therapy will no longer yield measurable clinical improvement.',
        },
        {
          code: 'CPT 97110',
          term: 'Therapeutic Exercise Sessions',
          plainMeaning: 'Professional one-on-one guided exercises aimed at restoring strength and range of motion.',
        },
      ],
      deadlinePhrase: 'Critical Notice: You have the right to request an internal appeal within 180 days of the date of this notice.',
      deadlineType: 'relative',
      explicitDate: null,
      relativeDays: 180,
    },
    kit: {
      plainEnglishSummary: 'Beacon Mutual stopped paying for your physical therapy visits because their internal reviewer decided you had reached a recovery plateau and did not need further sessions.',
      whatThisMeans: 'Medical necessity denials are clinical disagreements. You can overturn this by having your physical therapist provide functional progress scores proving you were continuing to make measurable gains.',
      appealLetterTemplate: `Beacon Mutual Assurance
Grievance and Appeals Department
1 Beacon Plaza
Boston, MA 02108

Date: [Today's Date]
Patient Name: [Your Name]
Member ID: [Your Member ID]
Claim Number: {{CLAIM_NUMBER}}
Dates of Service: 09/15/2026 - 09/29/2026
Disputed Amount: {{DISPUTED_AMOUNT}}

RE: APPEAL OF MEDICAL NECESSITY DENIAL FOR CLAIM {{CLAIM_NUMBER}}

Dear Appeals Committee,

I am writing to formally appeal {{INSURER}}'s determination denying coverage for my ongoing physical therapy rehabilitation (CPT 97110) in the amount of {{DISPUTED_AMOUNT}}. Your notice dated October 6, 2026 stated that further care is not medically necessary.

I disagree with this clinical determination. My physical therapy is active rehabilitation necessary to regain mobility following my injury. Objective functional evaluations performed by my therapist demonstrate consistent, documented progress toward restorative functional goals. Terminating therapy prematurely would cause functional regression.

Enclosed with this appeal:
1. Physical therapy evaluation reports showing baseline versus current range-of-motion scores.
2. Letter from my treating therapist outlining specific remaining functional milestones.
3. Prescription for continued therapy from my physician, Dr. [Doctor Name].

Per your notice, the appeal window extends to {{DEADLINE_DATE}}. I request that a licensed specialist in physical medicine re-examine this claim and authorize the remaining sessions.

Sincerely,

[Your Name]
[Your Phone Number]
[Your Address]`,
      phoneScript: {
        beforeYouCall: [
          'Denial notice dated Oct 6, 2026',
          'Claim number: BM-441092-PT',
          'Physical therapy clinic name and therapist notes',
        ],
        whatToSay: 'I am calling regarding claim BM-441092-PT. My therapy was denied as not medically necessary, but my therapist has documented objective functional progress. I want to initiate a formal level-one clinical appeal.',
        ifTheySay: [
          {
            objection: 'Our clinical guidelines cap this condition at 12 therapy visits.',
            response: 'My plan allows exceptions when objective functional gains are documented. Can you send me the specific clinical criteria document your medical director used for this determination?',
          },
          {
            objection: 'Appeals take up to 60 days to process.',
            response: 'I understand. Please confirm that my account is marked as under active dispute so no balance billing occurs during review.',
          },
        ],
        beforeYouHangUp: [
          'Confirm where clinical documentation should be faxed',
          'Record the customer service agent’s name and call reference ID',
        ],
      },
      calendarEvent: {
        title: 'Appeal Deadline - Beacon Mutual Claim BM-441092-PT',
        description: 'Estimated deadline (180 days from Oct 6, 2026 notice) to file physical therapy appeal with Beacon Mutual Assurance.',
      },
    },
  },
  {
    id: 'surprise-bill',
    title: 'Out-of-Network Surprise Bill',
    subtitle: 'Denied $6,450 Emergency Doctor',
    imagePath: '/samples/surprise-bill.png',
    badge: 'Surprise Balance Bill',
    facts: {
      insurer: 'Crestview Health Network',
      claimNumber: 'CV-773910-ER',
      disputedAmount: '$6,450.00',
      letterDate: '2026-10-09',
      denialReasonRaw: 'Emergency physician fees totaling $6,450.00 are denied as non-contracted out-of-network provider rates under Clause 11.3.',
      denialCodes: [
        {
          code: 'OON-01',
          term: 'Out-of-Network Non-Participating Provider',
          plainMeaning: 'The emergency physician on duty was not contracted directly with your insurance network.',
        },
        {
          code: 'NSA-DISP',
          term: 'No Surprises Act Eligible Dispute',
          plainMeaning: 'Under federal law, emergency room care cannot be balance-billed at out-of-network rates.',
        },
      ],
      deadlinePhrase: 'Your formal appeal must be received by April 7, 2027.',
      deadlineType: 'explicit',
      explicitDate: '2027-04-07',
      relativeDays: null,
    },
    kit: {
      plainEnglishSummary: 'You went to the emergency room and your insurer refused to cover the doctor’s $6,450 bill because that specific doctor was out-of-network—leaving you with the entire balance.',
      whatThisMeans: 'Under the federal No Surprises Act, patients cannot be balance-billed for emergency medical services even if an out-of-network doctor treats them. Your insurer is legally required to cover this at in-network cost-sharing levels.',
      appealLetterTemplate: `Crestview Health Network
Appeals and Compliance Office
P.O. Box 9200
Springfield, IL 62704

Date: [Today's Date]
Patient Name: [Your Name]
Member ID: [Your Member ID]
Claim Number: {{CLAIM_NUMBER}}
Date of Service: 09/22/2026
Disputed Balance: {{DISPUTED_AMOUNT}}

RE: FORMAL DISPUTE UNDER THE NO SURPRISES ACT (P.L. 116-260) - CLAIM {{CLAIM_NUMBER}}

Dear Appeals Reviewer,

I am writing to formally dispute the out-of-network denial and balance bill of {{DISPUTED_AMOUNT}} for emergency physician services received on 09/22/2026 at an emergency facility. {{INSURER}} denied payment citing non-contracted provider rates.

Under the federal No Surprises Act (45 C.F.R. § 149.110), emergency services must be covered without prior authorization and at in-network cost-sharing rates, regardless of whether the attending physician is participating in your network. Balance billing a patient for emergency care in this manner is a direct violation of federal statutory protections.

I request that {{INSURER}} immediately:
1. Re-adjudicate claim {{CLAIM_NUMBER}} under the Qualifying Payment Amount (QPA) at the in-network cost-sharing rate.
2. Issue a revised Explanation of Benefits reflecting correct patient in-network responsibility.
3. Notify the billing provider that this claim is subject to Independent Dispute Resolution (IDR) and hold all collection actions.

My deadline to submit this formal notice is {{DEADLINE_DATE}}. Please confirm receipt and provide written status within 30 days.

Sincerely,

[Your Name]
[Your Phone Number]
[Your Address]`,
      phoneScript: {
        beforeYouCall: [
          'Denial notice dated Oct 9, 2026',
          'Claim number: CV-773910-ER',
          'Name of hospital and emergency physician group',
        ],
        whatToSay: 'I am calling about claim CV-773910-ER. This is a balance bill for emergency services, which is covered under the federal No Surprises Act. I need this claim reprocessed at in-network benefit levels.',
        ifTheySay: [
          {
            objection: 'The physician group does not participate with our insurance network.',
            response: 'Under the No Surprises Act, emergency medical care cannot be balance billed, even if the attending ER doctor is out of network. Cost sharing must be calculated at in-network rates.',
          },
          {
            objection: 'You must dispute this with the doctor’s billing office, not with insurance.',
            response: 'The health plan is responsible for calculating the Qualifying Payment Amount and paying the initial amount. Please escalate this to your No Surprises Act compliance coordinator.',
          },
        ],
        beforeYouHangUp: [
          'Ask for the representative’s name and reference number',
          'Confirm the claim has been re-routed for NSA re-adjudication',
        ],
      },
      calendarEvent: {
        title: 'Appeal Deadline - Crestview NSA Claim CV-773910-ER',
        description: 'Deadline to submit formal No Surprises Act balance bill appeal to Crestview Health Network.',
      },
    },
  },
];
