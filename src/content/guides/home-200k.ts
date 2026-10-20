import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.origination;
// Worked case of the page: a 71-year-old with a $200,000 house and $50,000 of mortgage left.
const V = 200000, AGE = 71, OWED = 50000;
const rT = K.rateT(K.EXP);
const c = K.loan({ age: AGE, value: V, liens: OWED });
const free = K.loan({ age: AGE, value: V });
const fee = K.orig(V), mip = K.imip(V);
const per10Below = O.tier1Rate * 10000, per10Above = O.tier2Rate * 10000;
const values = [160000, 180000, V, 220000, 250000, 300000];
const ages = [64, 67, 71, 74, 77, 80, 83, 86, 90];
const debtAges = [64, AGE, 77, 83];
const debts = [25000, OWED, 75000];
const half = (P.firstYear.base - P.firstYear.extra);
const clear = (a: number) => { const x = K.loan({ age: a, value: V }); return x.pl - x.imip - x.origination; };
const g10 = K.project({ age: AGE, value: V }, 10)[9], g10d = K.project({ age: AGE, value: V, liens: OWED }, 10)[9];
const small64 = K.loan({ age: 64, value: V, liens: 25000 });
const big64 = K.loan({ age: 64, value: V, liens: 75000 });

export default defineGuide({
  id: 'home-200k',
  group: 'home',
  order: 20,
  slug: 'reverse-mortgage-on-200000-home',
  nav: 'Reverse mortgage on a $200,000 home',
  card: 'Where the origination fee rate drops from 2 % to 1 %, and what the house gives',
  title: 'Reverse Mortgage on a $200,000 Home 2026: Fee and Cash, US',
  description: `Reverse mortgage on a $200,000 home in 2026: the origination fee cap is ${K.usd(fee)}, the point where its rate falls to 1 %, and the HECM gives ${K.usd(K.loan({ age: 64, value: V }).pl)} at 64.`,
  h1: 'A reverse mortgage on a $200,000 home',
  intro: `A $200,000 appraisal is where the HECM fee formula changes rate; here is what that means for the fee, and what the house gives at each age with or without a mortgage left on it.`,
  resume: `On a ${K.usd(V)} home, the most a lender may charge as a HECM origination fee is ${K.usd(fee)}: ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} of value, and this value uses up that first band exactly. Each ${K.usd(10000)} of appraisal above it adds only ${K.usd(per10Above)} to the cap, against ${K.usd(per10Below)} below it. With ${K.usd(mip)} of upfront mortgage insurance, the two charges come to ${K.usd(fee + mip)}. At an expected rate of ${K.pp(K.EXP)}, the principal limit is ${K.usd(K.loan({ age: 64, value: V }).pl)} at 64, ${K.usd(free.pl)} at ${AGE} and ${K.usd(K.loan({ age: 90, value: V }).pl)} at 90. A debt still owed changes the first year most. A ${AGE}-year-old with no mortgage can use ${K.usd(free.firstYearCash)} in the first 12 months; with ${K.usd(OWED)} owed, the obligations pass half the principal limit, and the first year leaves only ${K.usd(c.firstYearCash)} on top of the payoff, with ${K.usd(c.laterCash)} more from month 13. At 64, a ${K.usd(75000)} mortgage would require ${K.usd(big64.shortfall)} in cash at closing.`,
  faqs: [
    { q: 'Does an appraisal above $200,000 raise the origination fee as fast?', a: `No, half as fast. Up to ${K.usd(O.tier1Limit)}, the cap grows by ${K.pct(O.tier1Rate, 0)} of the value, ${K.usd(per10Below)} per ${K.usd(10000)}. Above it, the rate is ${K.pct(O.tier2Rate, 0)}, so an appraisal of ${K.usd(220000)} allows ${K.usd(K.orig(220000))}, not ${K.usd(O.tier1Rate * 220000)}. The upfront insurance keeps its ${K.pct(P.mip.upfront, 0)} rate on the whole value, which is why it overtakes the fee above this point.` },
    { q: 'Can a reverse mortgage pay off $75,000 owed on a $200,000 house?', a: `It depends on age. With no other closing costs, the loan clears that payoff with no cash from you from about 77 on in our table. At 64 the obligations exceed the principal limit by ${K.usd(big64.shortfall)}, at ${AGE} by ${K.usd(K.loan({ age: AGE, value: V, liens: 75000 }).shortfall)}. That difference has to be brought to closing, from savings or another source, before the HECM can be made.` },
    { q: `Why would a ${AGE}-year-old with $50,000 owed get only ${K.usd(c.firstYearCash)} in year one?`, a: `Because the obligations, ${K.usd(c.mo)} with the payoff and the two charges, are more than half of the ${K.usd(c.pl)} principal limit. The first-year limit then becomes the obligations plus ${K.pct(P.firstYear.extra, 0)} of the principal limit. That ${K.pct(P.firstYear.extra, 0)} is the cash. The rest, ${K.usd(c.laterCash)}, is not lost: it opens in month 13 and grows while unused.` },
  ],
  body: (h) => `
<h2>Exactly at the bend of the fee formula</h2>
<p>The origination fee of a HECM (Home Equity Conversion Mortgage, the FHA-insured reverse mortgage) is capped by a formula in ${h.src('cfr_206_31', '24 CFR 206.31')}: ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} of the maximum claim amount (MCA), plus ${K.pct(O.tier2Rate, 0)} of anything above it, no less than ${K.usd(O.floor)} and no more than ${K.usd(O.cap)}. The MCA is the appraised value, up to the national limit of ${K.usd(P.limits.mca2026)} in 2026. A ${K.usd(V)} house fills the first band to the dollar, which gives ${K.usd(fee)}.</p>
<p>Below this value, every ${K.usd(10000)} of appraisal moves the allowed fee by ${K.usd(per10Below)}. Above it, by ${K.usd(per10Above)}. The upfront mortgage insurance premium (MIP) does not bend: it stays at ${K.pct(P.mip.upfront, 0)} of the MCA, ${K.usd(mip)} here. So ${K.usd(V)} is also the last value at which the fee and the insurance are the same amount; above it, the insurance is the larger of the two.</p>
${h.table(['Appraised value', 'Origination cap', 'Fee added per $10,000 more', 'Upfront MIP', 'Both, share of value'], values.map((v) => [K.usd(v), K.usd(K.orig(v)), K.usd(v < O.tier1Limit ? per10Below : per10Above), K.usd(K.imip(v)), K.pct((K.orig(v) + K.imip(v)) / v, 2)]), 'Legal maximum origination fee (24 CFR 206.31) and upfront MIP at 2 % of the maximum claim amount. Appraisal, title and other third-party charges are not included.', ['l', 'r', 'r', 'r', 'r'])}
<p>The cap is a ceiling, not a price list. The same section lets a lender charge less. When two offers differ, one with a lower fee and the other with a lower margin, the margin matters too: it feeds the expected rate, and the expected rate sets the factor. Comparing them in dollars of principal limit is the fair test, and the full calculator lets you do it.</p>
${h.mini('origination', { t: 'Move the appraisal around $200,000', p: ['value'], d: { value: 212500 } })}

<h2>What a ${K.usd(V)} house gives from 64 to 90</h2>
<p>The principal limit is the MCA times HUD's principal limit factor (PLF) for the youngest borrower's age and the expected rate (${h.src('hud_plf', 'HUD factor table')}). The expected rate used here is ${K.pp(K.EXP)}: the 10-year Treasury rate (CMT) at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}, read in HUD's ${K.pp(rT)} column. The house carries no mortgage in this table.</p>
${h.table(['Age', 'Factor', 'Principal limit', 'First 12 months', 'From month 13'], ages.map((a) => { const x = K.loan({ age: a, value: V }); return [String(a), K.f(x.factor), K.usd(x.pl), K.usd(x.firstYearCash), K.usd(x.laterCash)]; }), `${K.usd(V)} home, no mortgage, expected rate ${K.pp(K.EXP)}, upfront MIP ${K.usd(mip)} and origination ${K.usd(fee)} financed. HUD principal limit factor table in force since ${K.day(P.plf.effective)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Between 64 and 90 the principal limit grows by ${K.usd(K.loan({ age: 90, value: V }).pl - K.loan({ age: 64, value: V }).pl)} on the same house. With nothing to pay off, the first-year amount is ${K.pct(P.firstYear.base, 0)} of the principal limit minus the ${K.usd(fee + mip)} of charges.</p>
<p>The month-13 column is not a fixed sum. On an adjustable HECM, the unused part of the line grows each month at the note rate plus ${K.pct(P.mip.annual, 1)} of annual MIP. If our ${AGE}-year-old, debt-free, drew nothing for ten years at a note rate held at ${K.pp(K.NOTE)}, the line would stand near ${K.usd(g10.credit)}, against a balance of about ${K.usd(g10.balance)} made of the financed charges and their growth. Read it as an order of size: the note rate follows the 1-year Treasury index and will move.</p>
<p>A monthly payment for life is the other way to use the same principal limit. With no mortgage, it would be about ${K.usd(K.loan({ age: 64, value: V }).tenure)} at 64, ${K.usd(free.tenure)} at ${AGE} and ${K.usd(K.loan({ age: 83, value: V }).tenure)} at 83, each sized on the months left to age 100. A payoff at closing lowers it, because less of the principal limit is left to spread: at ${AGE} with ${K.usd(OWED)} owed, about ${K.usd(c.tenure)}.</p>

<h2>With a mortgage still owed</h2>
<p>A remaining mortgage must be paid off at closing, and the payoff joins the charges as a mandatory obligation (${h.src('hud_payplan', 'HUD payment plan')}, line 5). Once the obligations pass ${K.pct(half, 0)} of the principal limit, the first-year rule switches from ${K.pct(P.firstYear.base, 0)} of the principal limit to the obligations plus ${K.pct(P.firstYear.extra, 0)} of it (${h.src('handbook', 'HUD Handbook 4000.1')}). On a ${K.usd(V)} house that threshold is reached with fairly small balances, as the table shows.</p>
${h.table(['Age', 'Owed', 'Obligations', 'First 12 months', 'From month 13', 'Cash to bring'], debtAges.flatMap((a) => debts.map((d) => { const x = K.loan({ age: a, value: V, liens: d }); return [String(a), K.usd(d), K.usd(x.mo), K.usd(x.firstYearCash), K.usd(x.laterCash), K.usd(x.shortfall)]; })), `${K.usd(V)} home, mortgage paid off at closing plus upfront MIP and origination at the cap, no other closing cost. Expected rate ${K.pp(K.EXP)}.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>For our ${AGE}-year-old owing ${K.usd(OWED)}, the obligations are ${K.usd(c.mo)} against a principal limit of ${K.usd(c.pl)}, so the ${K.pct(P.firstYear.extra, 0)} branch applies: ${K.usd(c.firstYearCash)} of cash in the first year, ${K.usd(c.laterCash)} from month 13. Without the debt, the same owner would have ${K.usd(free.firstYearCash)} in year one. Ten years on, with nothing drawn, the line would be about ${K.usd(g10d.credit)} instead of ${K.usd(g10.credit)}. A smaller balance can stay under the threshold: at 64 with ${K.usd(25000)} owed, the obligations of ${K.usd(small64.mo)} are below half of the ${K.usd(small64.pl)} principal limit, so the ${K.pct(P.firstYear.base, 0)} branch still applies and leaves ${K.usd(small64.firstYearCash)}. What the loan still buys is the end of the monthly mortgage payment, which the ${h.a('existing-mortgage', 'existing mortgage page')} weighs in more detail.</p>
${h.mini('firstyear', { t: 'Your payoff on a $200,000 house', p: ['liens', 'age'], d: { value: V, age: AGE, liens: 42000 } })}

<h2>The largest payoff with no cash at closing</h2>
<p>A quick test before applying: the principal limit minus the two charges is the largest mortgage the loan can clear on its own. For this house, that is ${K.usd(clear(64))} at 64, ${K.usd(clear(AGE))} at ${AGE}, ${K.usd(clear(77))} at 77 and ${K.usd(clear(83))} at 83. Appraisal and title charges come off each figure dollar for dollar. Above that line, the gap is due in cash at closing, and the loan cannot close without it. A lender that waives its fee would raise each figure by ${K.usd(fee)}. The ${h.a('first-year-limit', 'first-year limit page')} explains the rule in full, and the ${h.a('origination-fee', 'origination fee page')} has the fee for any value.</p>`,
  tool: 'origination',
  toolArg: { value: V },
  related: ['origination-fee', 'existing-mortgage', 'first-year-limit', 'home-150k', 'home-400k'],
  sources: ['cfr_206_31', 'hud_plf', 'hud_payplan', 'handbook'],
});
