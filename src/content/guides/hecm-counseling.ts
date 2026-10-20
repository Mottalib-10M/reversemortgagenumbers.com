import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: the comparison a counselor prints for an 80-year-old, a $260,000 home, $15,000 still owed.
const IN = { age: 80, value: 260000, liens: 15000 };
const arm = K.loan(IN), fix = K.loan({ ...IN, fixed: true });
const term10 = K.pay(arm.npl, 120, K.EXP);
const W = P.refi;

export default defineGuide({
  id: 'hecm-counseling',
  group: 'situation',
  order: 60,
  slug: 'hecm-counseling',
  nav: 'HUD-approved counseling',
  card: 'Who must attend, what the certificate is, which fees may come first, and when it can be waived',
  title: 'HECM Counseling 2026: HUD-Approved Counselor Rules, US',
  description: `HECM counseling in 2026: who must attend, the HUD-92902 certificate, what a lender may charge first, and the refinance waiver within ${W.counselingWaiverYears} years of a first loan.`,
  h1: 'HUD-approved reverse mortgage counseling',
  intro: `The session every HECM borrower goes through before a loan can be insured: who runs it, who has to be there, and what may or may not happen before it.`,
  resume: `Every FHA-insured reverse mortgage requires counseling with a counselor on HUD's HECM roster, employed by a HUD-approved housing counseling agency, before the loan can close. Each borrower attends, and so do a spouse who stays off the loan and any other owner on title. The counselor issues a Certificate of HECM Counseling (form HUD-92902), signed by everyone who took part, and the lender keeps a copy in the file it sends to the FHA. Before counseling, a lender may order a credit report for a preliminary review, but it can collect that cost only at closing, and nothing if the loan never closes. The session compares payment plans on FHA software printouts: for an 80-year-old with a ${K.usd(IN.value)} home and ${K.usd(IN.liens)} owed, ${K.usd(arm.firstYearCash)} in year one on a credit line, ${K.usd(arm.tenure)} a month for life, or a single ${K.usd(fix.firstYearCash)} on a fixed rate. A HECM-to-HECM refinance can skip counseling only within ${W.counselingWaiverYears} years of the first loan and under cost conditions.`,
  faqs: [
    { q: 'Who has to attend HECM counseling?', a: 'Every borrower, any spouse who will not sign the loan, whether or not that spouse qualifies for the deferral, and any other owner of the home who is not a borrower. The certificate lists all of them and each one signs it. When one of them lacks the capacity to take part, the lender must keep evidence of that in the file, because the endorsement review checks who received counseling.' },
    { q: 'Can I do HECM counseling by phone?', a: 'Yes. Counselors on HUD’s HECM roster are approved to counsel either face to face or by telephone, as the regulation on the HECM roster states. The roster is open only to counselors who work for a HUD-approved housing counseling agency or an approved affiliate, so you pick the agency first, then agree with it on the format and the time of the session.' },
    { q: 'Can a lender charge me for a credit report before counseling?', a: 'It can order one, not bill it upfront. HUD lets a lender pull a credit report before counseling for an optional preliminary review of your debts, which never replaces the full financial assessment. The cost of that report may be collected only at closing, and if the HECM does not close, you owe nothing for it. Any request to pay for it earlier goes against that rule.' },
    { q: 'Does a HUD counselor tell me whether to take the loan?', a: 'No. The counselor explains how a HECM works, what it costs and what else could meet the need, then issues the certificate. The decision stays with you. HUD also states that listing a counselor on its roster is not an endorsement of that counselor. The lender, for its part, must give you an analysis of the costs against the benefits so you can make an informed choice.' },
  ],
  body: (h) => `
<h2>Why counseling comes before anything else</h2>
<p>A reverse mortgage cannot be insured by the FHA without proof of counseling. At the first contact, the lender must give you a list of HUD-approved HECM counselors with their agencies, addresses and phone numbers, and HUD publishes the list itself (${h.src('hud_counselors', 'HUD list of approved housing counseling agencies')}). Counseling is then a precondition the lender cannot work around: the Certificate of HECM Counseling is one of the documents the FHA checks before it endorses the loan for insurance.</p>
<p>The roster is narrow on purpose. To be listed, a counselor must work for a HUD-approved housing counseling agency, or an affiliate of a HUD-approved intermediary or state housing finance agency, pass FHA's standardized HECM exam every 3 years and have had HECM training in the past 2 years. Counselors on federal debarment or HUD denial lists are excluded. Only counselors on this roster may provide the session, face to face or by phone.</p>

<h2>Who must be in the session</h2>
<p>The rule covers more people than the borrowers. Each borrower attends, and so does any non-borrowing spouse, whether that spouse qualifies as eligible for the deferral or not, and any person who owns part of the home without being on the loan. A spouse under ${P.eligibility.borrowerMinAge} hears, in addition, what it takes to stay in the home after the borrower's death: legal ownership or a lifelong right to remain established within 90 days, the home kept as a principal residence, taxes and insurance kept paid. An ineligible spouse hears that the loan will be due at the last borrower's death.</p>

<h2>What the counselor goes through</h2>
<p>The content is set by section 255(f) of the National Housing Act and HUD's rules. The counselor must also ask whether you have signed a contract with an estate planning service firm, a company that charges a fee contingent on your getting the loan, or for the same information counseling provides, and explain whether those services are needed or available at little or no cost elsewhere. A HECM's first payout may not be used to pay such a firm.</p>
<p>The numbers come from FHA's HECM calculator software, or from software that produces the same results; HUD requires lenders and counselors alike to work from those printouts. For an 80-year-old with a ${K.usd(IN.value)} home and ${K.usd(IN.liens)} to pay off, at an expected rate of ${K.pp(K.EXP)}, the comparison looks like this:</p>
${h.table(['Payment plan', 'What it gives', 'What remains'], [
  ['Adjustable, credit line', `${K.usd(arm.firstYearCash)} in year one`, `${K.usd(arm.laterCash)} more after month 12, growing while unused`],
  ['Adjustable, tenure', `${K.usd(arm.tenure)} a month while you live in the home`, 'Nothing else unless the plan is changed'],
  ['Adjustable, 10-year term', `${K.usd(term10)} a month for 120 months`, 'The balance stays due when the loan ends'],
  ['Fixed rate, lump sum', `${K.usd(fix.firstYearCash)} at closing`, `${K.usd(fix.forfeited)} never available`],
], `Principal limit ${K.usd(arm.pl)} at HUD factor ${K.f(arm.factor)}, after a ${K.usd(arm.imip)} upfront premium and a ${K.usd(arm.origination)} origination fee. Example margin ${K.pp(P.rates.exampleMargin, 1)}.`, ['l', 'l', 'l'])}
${h.mini('hecm', { t: 'Bring your own numbers to the session', p: ['age', 'value'], d: { age: 80, value: 260000, liens: 15000 } })}

<h2>The certificate</h2>
<p>At the end, the counselor issues the Certificate of HECM Counseling, form HUD-92902. It names the borrowers, non-borrowing spouse and non-borrowing owners who were counseled; the counselor and each of them sign and date it. You give the lender a physical copy, and the lender checks that the file holds the signed certificate before submitting the loan for insurance.</p>

<h2>What may happen before counseling, and what it may cost</h2>
<p>The rules leave room for a few steps. A lender may pull a credit report before counseling to make a preliminary review of your obligations; that review is optional and does not replace the full financial assessment. The lender may collect the cost of that report only at closing, and if the HECM does not close, you cannot be charged for it. For a HECM for Purchase, the lender may take the application before or after counseling.</p>
<p>The counseling fee itself, when an agency charges one, is listed by HUD among the mandatory obligations of the loan. That means it can be paid from the HECM at closing, like the premium and the origination fee, rather than out of pocket. HUD's rules used here do not set its amount, so ask the agency what it charges before the session.</p>

<h2>When a refinance can skip counseling</h2>
<p>A borrower who replaces one HECM with another may waive counseling, but only if four conditions hold. The first loan must have an FHA case number from August 4, 2014 or later with counseling received by the borrower and any non-borrowing spouse, or an older case number with no non-borrowing spouse. The lender must have given the anti-churning disclosure, which sets the cost of the refinance against the gain in principal limit. That gain must exceed the cost by ${W.costMultiple} times the cost. And no more than ${W.counselingWaiverYears} years may separate the closing of the first loan from the new application. The ${h.a('hecm-refinance', 'refinance page')} runs that test.</p>
${h.mini('refi', { t: 'Does your refinance pass the cost test?', p: ['opl'], d: { age: 79, value: 650000, ob: 150000, om: 420000, opl: 240000 } })}`,
  tool: 'hecm',
  toolArg: { age: 80, value: 260000, liens: 15000 },
  related: ['how-reverse-mortgage-works', 'non-borrowing-spouse', 'hecm-refinance', 'reverse-mortgage-costs', 'hecm-for-purchase'],
  sources: ['hud_counselors', 'cfr_206', 'handbook', 'hud_payplan', 'hud_plf'],
});
