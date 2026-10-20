import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, R = P.refi;
// Worked case of the page: a borrower now 79, whose HECM closed four years ago on a home then counted at $380,000
// (upfront MIP 2 %), with a principal limit of $189,000 at closing; the home is now appraised at $640,000.
const AGE = 79, VALUE = 640000, OLD_MCA = 380000, OLD_RATE = P.mip.upfront, OLD_PL0 = 189000, YEARS = 4, OLD_BAL = 150000;
const OLD_PL = Math.round(K.credit(OLD_PL0, K.NOTE, YEARS * 12));
const case_ = (value: number, oldRate = OLD_RATE) => {
  const n = K.loan({ age: AGE, value });
  const r = K.refi(n.mca, OLD_MCA, oldRate);
  const cost = r.due + n.origination;
  const gain = n.pl - OLD_PL;
  return { n, r, cost, gain, passes: gain - cost >= R.costMultiple * cost };
};
const c = case_(VALUE);
const cHalf = case_(VALUE, 0.005);
const values = [520000, 580000, 640000, 720000, 850000, 1000000];
const imipRows = values.map((v) => { const x = case_(v); return [K.usd(v), K.usd(x.r.imipNew), K.usd((x.n.mca - OLD_MCA) * R.imipLimitFactor), K.usd(x.r.limit), K.usd(x.r.due)]; });
const testRows = values.map((v) => { const x = case_(v); return [K.usd(v), K.usd(x.n.pl), K.usd(x.gain), K.usd(x.cost), x.passes ? 'met' : 'not met']; });
const net = c.n.pl - OLD_BAL - c.cost;
const fromOldValue = OLD_MCA * c.n.factor, fromRise = (c.n.mca - OLD_MCA) * c.n.factor;

export default defineGuide({
  id: 'hecm-refinance',
  group: 'situation',
  order: 40,
  slug: 'hecm-to-hecm-refinance',
  nav: 'HECM to HECM refinance',
  card: 'The premium credit, the anti-churning test and the 5-year window',
  title: 'HECM to HECM Refinance 2026: MIP Credit and Gain Test, US',
  description: `HECM to HECM refinance in 2026: the upfront MIP credit of 24 CFR 206.53, here ${K.usd(c.r.due)} due instead of ${K.usd(c.r.imipNew)}, and the gain test behind HUD's anti-churning form.`,
  h1: 'Refinancing a HECM into a new HECM',
  intro: `When a new reverse mortgage on the same home is worth its cost: the premium credit formula, the gain in principal limit and the rule that can waive counseling.`,
  resume: `A HECM-to-HECM refinance pays off the old reverse mortgage with a new one on the same home, and the upfront mortgage insurance premium (MIP) is capped by a formula in 24 CFR 206.53: ${K.pct(R.imipLimitFactor, 0)} of the increase in the maximum claim amount (MCA), minus the upfront premium paid on the old loan. A borrower aged ${AGE} whose old loan was counted at ${K.usd(OLD_MCA)}, with ${K.pct(OLD_RATE, 0)} paid upfront, and whose home is now appraised at ${K.usd(VALUE)} owes ${K.usd(c.r.due)} of upfront MIP instead of ${K.usd(c.r.imipNew)}. The new principal limit is ${K.usd(c.n.pl)}, against ${K.usd(OLD_PL)} on the old loan today, a gain of ${K.usd(c.gain)} for ${K.usd(c.cost)} of premium and origination fee. The lender must show both figures on HUD's anti-churning disclosure, form HUD-92901. Counseling can be waived only when the gain exceeds the cost by ${R.costMultiple} times the cost and the application comes within ${R.counselingWaiverYears} years of the first closing.`,
  faqs: [
    { q: 'Do I pay the full 2 % upfront premium again on a HECM refinance?', a: `Rarely. The premium on the new loan cannot exceed ${K.pct(R.imipLimitFactor, 0)} of the increase in the maximum claim amount minus the upfront premium already paid on the old loan. When the home value has not risen much, that formula gives zero. HUD gives no refund when the old premium is larger than the new one, and the credit applies only to a refinance on the same property.` },
    { q: 'Can I skip HECM counseling when I refinance?', a: `Only when four conditions hold: the first HECM's case number dates from August 4, 2014 or later and its borrowers were counseled (or it is older and there is no non-borrowing spouse), you received the anti-churning disclosure, the gain in principal limit exceeds the cost by the amount HUD sets, ${R.costMultiple} times the cost in the calculator, and you apply within ${R.counselingWaiverYears} years of the first closing.` },
    { q: 'Can a HECM refinance move the loan to a different house?', a: 'No. The refinance authority applies only when the home that secures the loan stays the same. Moving means paying off the existing HECM and, if you want a reverse mortgage on the new home, using HECM for Purchase. That purchase does not receive the upfront premium credit: 24 CFR 206.53 excludes it explicitly.' },
    { q: 'What numbers are on the HUD-92901 anti-churning disclosure?', a: 'Two estimates by the lender: the total cost of the refinance, meaning the allowed fees and charges plus the upfront premium due, and the increase in principal limit, the new loan’s initial principal limit minus the current principal limit of the old loan. It comes with the other loan disclosures, and the lender keeps the calculations behind both figures in the case file.' },
  ],
  body: (h) => `
<h2>The premium credit formula, line by line</h2>
<p>The regulation (${h.src('cfr_206', '24 CFR 206.53(c)')}) caps the upfront premium the lender remits on the new loan at the difference between ${K.pct(R.imipLimitFactor, 0)} of the increase in the maximum claim amount and the upfront premium already charged and paid on the existing HECM. Written out, with the figures of the borrower aged ${AGE}:</p>
<ul>
<li>IMIP limit = (MCA new − MCA old) × ${K.dec(R.imipLimitFactor, 2)} − IMIP old;</li>
<li>IMIP old = ${K.usd(OLD_MCA)} × ${K.pct(OLD_RATE, 0)} = ${K.usd(c.r.imipOld)};</li>
<li>IMIP limit = (${K.usd(c.n.mca)} − ${K.usd(OLD_MCA)}) × ${K.dec(R.imipLimitFactor, 2)} − ${K.usd(c.r.imipOld)} = ${K.usd(c.r.limit)};</li>
<li>IMIP due = the lesser of that limit and ${K.pct(P.mip.upfront, 0)} of the new MCA, ${K.usd(c.r.imipNew)}, never below zero: ${K.usd(c.r.due)}.</li>
</ul>
<p>Loans with case numbers assigned before ${K.day(P.plf.effective)}, when ${h.src('ml_2017_12', 'Mortgagee Letter 2017-12')} set the upfront rate at ${K.pct(P.mip.upfront, 0)} for everyone, could have paid an upfront rate of ${K.pct(0.005, 1)}. Had the old loan been one of them, the old premium would be ${K.usd(cHalf.r.imipOld)} and the premium due ${K.usd(cHalf.r.due)}. The table keeps the old MCA at ${K.usd(OLD_MCA)} with ${K.pct(OLD_RATE, 0)} paid, and changes the new appraisal.</p>
${h.table(['New appraised value', '2 % of the new MCA', `${K.pct(R.imipLimitFactor, 0)} of the MCA increase`, 'Formula result', 'Upfront MIP due'], imipRows, `Old MCA ${K.usd(OLD_MCA)}, old upfront MIP ${K.usd(OLD_MCA * OLD_RATE)}. A negative result means no premium is due; HUD refunds nothing.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The rule rewards a real rise in value. Below about ${K.usd(OLD_MCA + (OLD_MCA * OLD_RATE) / R.imipLimitFactor)} of new MCA, the formula is negative and the new premium is zero; above it, the premium climbs by ${K.pct(R.imipLimitFactor, 0)} of each extra dollar of MCA until it meets the full ${K.pct(P.mip.upfront, 0)}.</p>

<h2>The gain is smaller than the new loan suggests</h2>
<p>The old principal limit did not stay where it was at closing. It grows each month by one twelfth of the note rate plus the annual MIP, as the ${h.src('handbook', 'Handbook')} sets for every adjustable HECM. A principal limit of ${K.usd(OLD_PL0)} at closing, at a note rate of ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)}, has become ${K.usd(OLD_PL)} after ${YEARS} years. That current figure, from the annual statement, is what the anti-churning disclosure subtracts.</p>
${h.table(['New appraised value', 'New principal limit', 'Gain over the old loan', 'Cost of the refinance', `Gain above ${R.costMultiple} × the cost`], testRows, `Borrower aged ${AGE}, old principal limit today ${K.usd(OLD_PL)}, cost = upfront MIP due + origination fee at its cap, other closing costs not included. Factors at ${K.pp(K.rateT(K.EXP))}.`, ['l', 'r', 'r', 'r', 'l'])}
<p>At ${K.usd(520000)} the new loan lends less than the old one already allows, so a refinance would only add costs. At ${K.usd(VALUE)} the gain is ${K.usd(c.gain)}. After the old balance of ${K.usd(OLD_BAL)} is paid off as a lien (line 5 of the ${h.src('hud_payplan', 'HUD payment plan')}) and the costs are paid, ${K.usd(net)} of the new principal limit is left. The first-year limit then applies to the new loan as to any HECM, with the payoff counted among the costs paid at closing.</p>
<p>Where does the gain come from? The new loan reads HUD's table at the borrower's age today, ${AGE}, and the expected rate today: a factor of ${K.f(c.n.factor)}. Applied to the old value of ${K.usd(OLD_MCA)}, it would give ${K.usd(fromOldValue)}, less than the ${K.usd(OLD_PL)} the old loan already allows. The rise in value carries the whole case: ${K.usd(c.n.mca - OLD_MCA)} more of MCA times ${K.f(c.n.factor)} adds ${K.usd(fromRise)}. Being four years older helps less than it seems, because the old principal limit kept growing for those four years.</p>
${h.mini('refi', { t: 'Your new appraisal', p: ['value', 'opl'], d: { age: AGE, value: VALUE, ob: OLD_BAL, om: OLD_MCA, opl: OLD_PL, or: String(OLD_RATE) } })}

<h2>The anti-churning disclosure, HUD-92901</h2>
<p>The disclosure exists so that a refinance is weighed against what it costs. It is given together with the other loan disclosures, in which the lender states its best estimate of two numbers: the total cost of the refinance, defined as the fees allowed by 24 CFR 206.31 plus the upfront premium of the formula above, and the increase in principal limit. The Handbook lists form HUD-92901 and all supporting calculations for its first two blocks among the documents of every HECM-to-HECM case. The form compares; it does not decide. A borrower can still refinance when the gain is thin, and then counseling is required.</p>

<h2>When counseling can be waived</h2>
<p>Counseling is otherwise required for every HECM. On a refinance, the borrower and any non-borrowing spouse may decline it only when all of these hold (${h.src('cfr_206', '24 CFR 206.53(e)')}):</p>
<ul>
<li>the first HECM got its case number on or after August 4, 2014 and its borrowers and any non-borrowing spouse were counseled, or it is older and there is no non-borrowing spouse;</li>
<li>the borrower received the anti-churning disclosure;</li>
<li>the gain in principal limit exceeds the cost by the amount HUD sets by notice, which the calculator applies as ${R.costMultiple} times the cost;</li>
<li>no more than ${R.counselingWaiverYears} years separate the closing of the first HECM from the refinance application, even if an earlier refinance came in between.</li>
</ul>
<p>In the ${K.usd(VALUE)} case, ${R.costMultiple} times the ${K.usd(c.cost)} cost is ${K.usd(R.costMultiple * c.cost)}, and the gain minus the cost is ${K.usd(c.gain - c.cost)}: the test is ${c.passes ? 'met' : 'not met'}. The four-year-old loan is inside the ${R.counselingWaiverYears}-year window. The ${h.a('hecm-counseling', 'counseling page')} explains the session for those who take it, and the ${h.a('reverse-mortgage-mip', 'MIP page')} the premium itself.</p>`,
  tool: 'refi',
  toolArg: { age: AGE, value: VALUE, ob: OLD_BAL, om: OLD_MCA, opl: OLD_PL, or: String(OLD_RATE) },
  related: ['reverse-mortgage-mip', 'hecm-counseling', 'principal-limit-factor', 'first-year-limit', 'hecm-for-purchase'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'ml_2017_12', 'cfr_206_31'],
});
