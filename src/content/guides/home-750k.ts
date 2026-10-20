import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, F = P.firstYear;
const V = 750000;
// Worked case of the page: a 79-year-old with a $750,000 home and $240,000 still owed.
const AGE = 79, DEBT = 240000;
const base = K.loan({ age: AGE, value: V });
const c = K.loan({ age: AGE, value: V, liens: DEBT });
const fixedCost = K.imip(V) + K.orig(V);
const debts = [0, 75000, 150000, 200000, 240000, 300000, 350000];
const dRows = debts.map((d) => ({ d, o: K.loan({ age: AGE, value: V, liens: d }) }));
// Debt at which obligations reach half the principal limit (switch to obligations + 10 %),
// and the most debt the loan can clear with no cash brought to closing.
const switchAt = (o: ReturnType<typeof K.loan>) => Math.max(0, (F.base - F.extra) * o.pl - o.imip - o.origination);
const clearAt = (o: ReturnType<typeof K.loan>) => o.pl - o.imip - o.origination;
const ages = [62, 66, 70, 74, 79, 84, 88];
const aRows = ages.map((a) => ({ a, o: K.loan({ age: a, value: V }) }));
const big = dRows.find((r) => r.o.shortfall > 0)!;
const cap90 = (o: ReturnType<typeof K.loan>) => (1 - F.extra) * o.pl - o.imip - o.origination;
const fit300 = Array.from({ length: 38 }, (_, i) => 62 + i).find((a) => clearAt(K.loan({ age: a, value: V })) >= 300000)!;

export default defineGuide({
  id: 'home-750k',
  group: 'home',
  order: 40,
  slug: 'reverse-mortgage-on-750000-home',
  nav: 'Reverse mortgage on a $750,000 home',
  card: 'A costly home under the limit: first-year dollars and a large payoff',
  title: 'Reverse Mortgage on a $750,000 Home 2026: First Year, US',
  description: `Reverse mortgage on a $750,000 home in 2026: the first-year limit in dollars at 79, a fee capped at ${K.usd(P.origination.cap)}, and how much a large mortgage payoff eats into it.`,
  h1: 'A reverse mortgage on a $750,000 home',
  intro: `A valuable house still under the FHA limit: what the first-year rule lets you take in dollars, and what happens when a big mortgage has to be paid off first.`,
  resume: `On a $750,000 home the whole value counts toward a HECM, since it sits well under the ${K.usd(K.LIMIT)} limit of 2026, and the fixed charges are light: ${K.usd(K.imip(V))} of upfront mortgage insurance and an origination fee capped at ${K.usd(K.orig(V))}, together ${K.pct(fixedCost / V, 1)} of the value. The question that decides the cash is the first-year limit. At 79, with an expected rate of ${K.pp(K.EXP)} (10-year Treasury plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the principal limit is ${K.usd(base.pl)}. With no mortgage, ${K.usd(base.idl)} can be disbursed in the first 12 months, ${K.pct(F.base, 0)} of the principal limit, of which ${K.usd(base.firstYearCash)} reaches you after the charges. With ${K.usd(DEBT)} still owed, the obligations take ${K.pct(c.mo / c.pl, 0)} of the principal limit: the first year is then capped at the obligations plus ${K.pct(F.extra, 0)}, which leaves ${K.usd(c.firstYearCash)} of cash and ${K.usd(c.laterCash)} for month 13 onward.`,
  faqs: [
    { q: 'At what mortgage balance does the 10 % rule start on a $750,000 home?', a: `When the payoff plus the charges passes half of the principal limit. At 79 that happens once more than ${K.usd(switchAt(base))} is owed. Below it, the first-year cash is ${K.pct(F.base, 0)} of the principal limit minus the obligations. Above it, the first-year cash is stuck at ${K.usd(F.extra * base.pl)}, ${K.pct(F.extra, 0)} of the principal limit, whatever the size of the debt.` },
    { q: 'Can a reverse mortgage pay off a $300,000 mortgage on a $750,000 house?', a: `It depends on the age. The loan can clear, with no cash from you, the principal limit minus the insurance and the fee: ${K.usd(clearAt(aRows[0].o))} at 62, ${K.usd(clearAt(aRows[2].o))} at 70 and ${K.usd(clearAt(base))} at ${AGE}, before other closing costs. So a ${K.usd(300000)} payoff needs cash at closing at the younger ages, and fits without it from age ${fit300}.` },
    { q: 'Does the money I cannot take in year one disappear?', a: `No, not on an adjustable HECM. What the first-year rule holds back stays in the principal limit and becomes available in month 13, and it grows each month while unused. On a fixed-rate HECM the whole amount is paid once at closing, so the part above the first-year limit is lost for good. That is why large payoffs and fixed rates combine badly.` },
  ],
  body: (h) => `
<h2>The first-year limit, line by line, on a $750,000 house</h2>
<p>HUD's payment plan form sets the first-year limit in three lines. Line 17 is ${K.pct(F.base, 0)} of the principal limit. Line 18 is the mandatory obligations (the mortgage payoff, the upfront mortgage insurance premium or MIP, the origination fee, other closing costs) plus ${K.pct(F.extra, 0)} of the principal limit. Line 19 keeps the larger of the two, and line 21, the initial disbursement limit, is the lesser of line 19 and the principal limit net of any set-aside: no more than that can be disbursed in the first 12 months (${h.src('hud_payplan', 'HUD payment plan form')}). On a ${K.usd(V)} house at age ${AGE}, line 17 is ${K.usd(base.l17)}. As long as the debt is small, line 17 wins and the cap is a fixed dollar figure; once the debt is large, line 18 wins and the cap moves with the debt.</p>
<p>The table follows the same house, the same ${AGE}-year-old and the same rate, with a mortgage balance that grows from zero.</p>
${h.table(['Mortgage owed', 'Obligations', 'Line that applies', 'First 12 months', 'From month 13', 'Cash to bring'], dRows.map(({ d, o }) => [K.usd(d), K.usd(o.mo), o.l18 > o.l17 ? 'Line 18' : 'Line 17', K.usd(o.firstYearCash), K.usd(o.laterCash), K.usd(o.shortfall)]), `${K.usd(V)} home, borrower aged ${AGE}, principal limit ${K.usd(base.pl)} at an expected rate of ${K.pp(K.EXP)}. Obligations include ${K.usd(K.imip(V))} of upfront MIP and ${K.usd(K.orig(V))} of origination; no other closing cost entered.`, ['l', 'r', 'l', 'r', 'r', 'r'])}
<p>Three zones show up. Up to about ${K.usd(switchAt(base))} of debt, each dollar of payoff removes a dollar of first-year cash. From there to about ${K.usd(cap90(base))}, the first-year cash holds at ${K.usd(F.extra * base.pl)} while the room after month 12 shrinks. Then line 18 runs into the principal limit itself, and the first-year cash falls to zero at ${K.usd(clearAt(base))} of debt. Beyond, the payoff is larger than the loan can cover: at ${K.usd(big.d)} owed, ${K.usd(big.o.shortfall)} is due in cash at closing.</p>
${h.mini('firstyear', { t: 'Enter your payoff on a $750,000 home', p: ['liens'], d: { value: V, age: AGE, liens: 180000 } })}

<h2>Why the capped fee weighs little here</h2>
<p>On a ${K.usd(V)} appraisal, the origination formula of ${h.src('cfr_206_31', '24 CFR 206.31')} would give more than ${K.usd(P.origination.cap)}, but the rule stops there. The fee is ${K.pct(K.orig(V) / V, 1)} of the value, against ${K.pct(K.orig(400000) / 400000, 1)} on a ${K.usd(400000)} house. The upfront MIP does not have a cap of its own: it is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, so ${K.usd(K.imip(V))} here, more than twice the fee. Together they take ${K.pct(fixedCost / base.pl, 1)} of the principal limit at ${AGE}.</p>
<p>The cost that matters on a house like this is not the fee but the interest on a large payoff. A ${K.usd(DEBT)} mortgage moved into a HECM keeps accruing at the note rate plus ${K.pct(P.mip.annual, 1)} of annual MIP, with no payment. At a note rate of ${K.pp(K.NOTE)} held steady, that payoff alone would grow to about ${K.usd(K.balance(DEBT, K.NOTE, 120).balance)} in ten years. The ${h.a('loan-balance', 'loan balance page')} shows the curve.</p>
${h.mini('balance', { t: 'Growth of the payoff with no payment', p: ['amt', 'yrs'], d: { amt: DEBT, yrs: 12 } })}

<h2>The debt a $750,000 house can absorb, by age</h2>
<p>Younger borrowers get a smaller factor, so the same debt hits the limits sooner. The table gives, for each age, the principal limit, the debt above which the ${K.pct(F.extra, 0)} rule takes over, and the largest debt the loan can pay off with no cash from you. Other closing costs would lower both debt columns by their amount.</p>
${h.table(['Age', 'Principal limit', 'Line 18 takes over above', 'Largest payoff, no cash in', 'First 12 months, no debt'], aRows.map(({ a, o }) => [String(a), K.usd(o.pl), K.usd(switchAt(o)), K.usd(clearAt(o)), K.usd(o.firstYearCash)]), `${K.usd(V)} home at an expected rate of ${K.pp(K.EXP)}, upfront MIP and origination at the cap financed. HUD principal limit factors.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At 62 the house clears ${K.usd(clearAt(aRows[0].o))} of debt; at ${ages[ages.length - 1]}, ${K.usd(clearAt(aRows[aRows.length - 1].o))}. A borrower who comes up short has to find the gap in cash or reduce the mortgage before closing. The age that counts is that of the youngest borrower or eligible non-borrowing spouse, so a younger spouse moves the whole row.</p>
<p>The same arithmetic decides monthly payments. Spread over the months HUD uses for tenure, the ${AGE}-year-old with no debt could receive about ${K.usd(base.tenure)} a month for as long as the house stays the main residence. With the ${K.usd(DEBT)} payoff taken first, only the net principal limit of ${K.usd(c.npl)} is left to spread, and the payment drops to about ${K.usd(c.tenure)}. A large payoff does not only cut the first year; it shrinks every later way of drawing the money. The ${h.a('monthly-payments', 'monthly payments page')} explains the sizing.</p>

<h2>Our worked case: 79, $240,000 still owed</h2>
<p>The principal limit at ${AGE} is ${K.usd(c.pl)}. Obligations come to ${K.usd(c.mo)}: the ${K.usd(DEBT)} payoff, ${K.usd(c.imip)} of MIP and ${K.usd(c.origination)} of fee. That is above half the principal limit, so line 18 applies: obligations plus ${K.usd(F.extra * c.pl)}, a first-year limit of ${K.usd(c.idl)}. After the payoff and the charges, ${K.usd(c.firstYearCash)} is left to use in year one, and ${K.usd(c.laterCash)} more becomes available in month 13. The monthly payment on the old mortgage ends at closing; property taxes, insurance and upkeep stay with the owner. The ${h.a('existing-mortgage', 'existing mortgage page')} and the ${h.a('first-year-limit', 'first-year limit page')} go further.</p>
<p>One check before relying on these numbers: the appraisal. The maximum claim amount uses the appraised value, and when HUD's collateral risk assessment calls for a second appraisal, the lender must use the lower of the two (${h.src('handbook', 'HUD Handbook 4000.1')}). On a large debt, an appraisal ${K.usd(50000)} lower at ${AGE} cuts the principal limit by ${K.usd(50000 * c.factor)}, and with line 18 in force most of that loss comes out of the room after month 12.</p>`,
  tool: 'firstyear',
  toolArg: { age: AGE, value: V, liens: DEBT },
  related: ['first-year-limit', 'existing-mortgage', 'origination-fee', 'loan-balance', 'home-at-limit', 'age-80'],
  sources: ['hud_payplan', 'cfr_206_31', 'handbook', 'hud_plf'],
});
