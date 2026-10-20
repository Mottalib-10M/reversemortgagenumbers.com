import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: an 80-year-old with a $275,000 home, no mortgage, who draws all the first-year room at closing.
const V = 275000, AGE = 80;
const rT = K.rateT(K.EXP);
const big = K.loan({ age: AGE, value: V, draw: 'max' });
const f70 = K.plf(70, K.EXP), f75 = K.plf(75, K.EXP), f80 = big.factor, f81 = K.plf(81, K.EXP);
const maxRun = K.project({ age: AGE, value: V, draw: 'max' }, 15);
const locRun = K.project({ age: AGE, value: V }, 15);
const at = (rows: typeof maxRun, age: number) => rows.find((r) => r.age === age)!;
const m90 = at(maxRun, 90), m95 = at(maxRun, 95), l90 = at(locRun, 90), l95 = at(locRun, 95);
const heirs95 = K.heirs(m95.balance, V);
const values = [180000, V, 425000, 600000];
// The same home at 70 and 75, to show what ten and five more years of age add.
const s70 = K.loan({ age: 70, value: V }), s75 = K.loan({ age: 75, value: V });
const OWED = 70000, owed = K.loan({ age: AGE, value: V, liens: OWED, draw: 'max' });
const shareFirst = big.firstYearCash / big.pl;

export default defineGuide({
  id: 'age-80',
  group: 'age',
  order: 80,
  slug: 'reverse-mortgage-at-80',
  nav: 'Reverse mortgage at 80',
  card: 'The factor at 80, the largest first-year draw and the balance at 90 and 95',
  title: 'Reverse Mortgage at 80 in 2026: Largest Draw and Balance, US',
  description: `Reverse mortgage at 80 in 2026: HUD's factor reaches ${K.f(f80)}, a ${K.usd(V)} home gives ${K.usd(big.firstYearCash)} in year one, and what that full draw owes at age 90 and at age 95.`,
  h1: 'A reverse mortgage at 80: the most cash in year one',
  intro: `What turning 80 does to a HECM: a higher HUD factor, the largest amount you can take in the first year, and what that draw has become by 90 and 95.`,
  resume: `At 80, HUD's principal limit factor at an expected rate of ${K.pp(K.EXP)} is ${K.f(f80)}, against ${K.f(f70)} at 70, so a ${K.usd(V)} home with no mortgage gives a principal limit of ${K.usd(big.pl)}. Taking the most allowed in the first 12 months means ${K.usd(big.firstYearCash)} at closing: ${K.pct(P.firstYear.base, 0)} of the principal limit, less ${K.usd(big.imip)} of upfront mortgage insurance and ${K.usd(big.origination)} of origination fee, both financed. Another ${K.usd(big.laterCash)} opens in month 13 and grows while unused. With the note rate held at ${K.pp(K.NOTE)}, the balance of that full draw plus costs would be about ${K.usd(m90.balance)} at 90 and ${K.usd(m95.balance)} at 95, still below ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of a home worth the same ${K.usd(V)}. Leaving everything in the credit line instead, the balance at 95 would be ${K.usd(l95.balance)} and the unused credit ${K.usd(l95.credit)}. Those are projections at a constant rate, not offers.`,
  faqs: [
    { q: 'How much more does an 80-year-old get than a 75-year-old?', a: `At ${K.pp(K.EXP)}, the factor is ${K.f(f75)} at 75 and ${K.f(f80)} at 80. On a ${K.usd(V)} home, that is ${K.usd(s75.pl)} against ${K.usd(big.pl)} of principal limit, ${K.usd(big.pl - s75.pl)} more for the same house. The upfront insurance and the fee stay the same, since they depend on the home value, not on age, so the whole gain is cash or credit.` },
    { q: 'Can I take everything at closing at 80 with an adjustable rate?', a: `No. On an adjustable HECM, the first 12 months are capped at ${K.pct(P.firstYear.base, 0)} of the principal limit, or the obligations plus ${K.pct(P.firstYear.extra, 0)} of it if those are higher. The rest, ${K.usd(big.laterCash)} in our example, becomes available from month 13. A fixed-rate HECM pays one advance at closing under the same cap, and the remainder can never be drawn.` },
    { q: 'If I draw the maximum at 80, will my heirs inherit anything?', a: `That depends on the home's value when the loan ends. If the ${K.usd(V)} house were worth exactly that at 95, the balance of about ${K.usd(m95.balance)} would leave roughly ${K.usd(V - m95.balance)} of equity before sale costs. If the balance ever exceeds the value, heirs who keep the home settle for ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value at most.` },
    { q: 'How does a payment for life at 80 compare with the full draw?', a: `It spreads the money instead of front-loading it. With the same ${K.usd(V)} home and no draw at closing, the payment for life would be about ${K.usd(big.tenure)} a month, sized on ${big.tenureMonths} months to age 100. Twelve of those come to ${K.usd(12 * big.tenure)} in year one, far below the ${K.usd(big.firstYearCash)} lump drawn at closing, but they keep coming for as long as the home is your residence.` },
  ],
  body: (h) => `
<h2>What ten more years add to the factor</h2>
<p>HUD's principal limit factor (PLF) table gives a larger share of the home to an older borrower, because the loan is expected to run for fewer years before it is repaid. In the ${K.pp(rT)} column, which is where an expected rate of ${K.pp(K.EXP)} is read, the factor is ${K.f(f70)} at 70, ${K.f(f75)} at 75 and ${K.f(f80)} at 80 (${h.src('hud_plf', 'HUD factor table')}). At this age the curve is steepening: one more year, to 81, takes it to ${K.f(f81)}.</p>
<p>On a ${K.usd(V)} home, the factor turns into ${K.usd(s70.pl)} of principal limit at 70 and ${K.usd(big.pl)} at 80. The costs taken from it do not change with age. The upfront mortgage insurance premium (MIP) is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount (MCA), here ${K.usd(big.imip)}, and the origination fee is capped at ${K.usd(big.origination)} for this value under ${h.src('cfr_206_31', '24 CFR 206.31')}. So every extra dollar of principal limit that age brings is a dollar you can use.</p>

<h2>The largest draw the first-year rule allows</h2>
<p>On an adjustable HECM, what you can receive in the first 12 months is capped. The cap is the greater of ${K.pct(P.firstYear.base, 0)} of the principal limit and the mandatory obligations plus ${K.pct(P.firstYear.extra, 0)} of it, and the obligations come out first (${h.src('handbook', 'HUD Handbook 4000.1')}). With no mortgage, the obligations are only the insurance and the fee, ${K.usd(big.mo)} in all, so the ${K.pct(P.firstYear.base, 0)} branch applies: ${K.usd(big.l17)} minus ${K.usd(big.mo)} leaves ${K.usd(big.firstYearCash)}. That is ${K.pct(shareFirst, 1)} of the principal limit, in cash, on the day the loan funds.</p>
${h.table(['Home value', 'Principal limit at 80', 'Most cash in year one', 'Opens in month 13'], values.map((v) => { const o = K.loan({ age: AGE, value: v, draw: 'max' }); return [K.usd(v), K.usd(o.pl), K.usd(o.firstYearCash), K.usd(o.laterCash)]; }), `Age 80, no mortgage, expected rate ${K.pp(K.EXP)}, upfront MIP and origination at the legal maximum financed, no other closing cost. HUD principal limit factor table in force since ${K.day(P.plf.effective)}.`, ['l', 'r', 'r', 'r'])}
<p>You do not have to take it all at once. The HUD payment plan form asks how much you draw at closing and keeps the remainder of the first-year room available as a credit line until the year ends (${h.src('hud_payplan', 'HUD payment plan')}). Drawing less keeps the balance lower, because interest and the annual MIP run only on what has been paid out.</p>
<p>A mortgage still on the house changes the branch. Say our 80-year-old owes ${K.usd(OWED)}. The obligations become ${K.usd(owed.mo)}, more than half of the ${K.usd(owed.pl)} principal limit, so the cap switches to the obligations plus ${K.pct(P.firstYear.extra, 0)} of the principal limit. The loan pays off the mortgage and the costs, and the cash on top is ${K.usd(owed.firstYearCash)} for the whole first year. The remaining ${K.usd(owed.laterCash)} waits until month 13. The monthly mortgage payment is gone, which for many owners at this age matters more than the cash.</p>
${h.mini('hecm', { t: 'The full draw at 80 on your home', p: ['value'], d: { age: AGE, value: 230000, plan: 'max' } })}

<h2>The balance at 90 and at 95</h2>
<p>A balance grows each month by one twelfth of the note rate plus ${K.pct(P.mip.annual, 1)} of annual MIP. Starting from the ${K.usd(big.firstYearCash)} drawn plus the ${K.usd(big.mo)} of financed costs, and holding the note rate at ${K.pp(K.NOTE)} (1-year Treasury at ${K.pp(P.rates.cmt1Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the projection below compares that full draw with a borrower who leaves everything in the credit line.</p>
${h.table(['Age', 'Balance, full draw', 'Credit left, full draw', 'Balance, nothing drawn', 'Credit, nothing drawn'], [85, 90, 95].map((a) => { const m = at(maxRun, a), l = at(locRun, a); return [String(a), K.usd(m.balance), K.usd(m.credit), K.usd(l.balance), K.usd(l.credit)]; }), `${K.usd(V)} home, borrower aged 80 at closing, note rate ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} MIP held constant. The credit left also grows at that rate. Projection, not a loan offer.`, ['l', 'r', 'r', 'r', 'r'])}
<p>By 90 the full draw has become ${K.usd(m90.balance)}, and by 95 ${K.usd(m95.balance)}. The credit line that was not used keeps growing next to it, which is why ${K.usd(m95.credit)} would still be available at 95 even after the large first draw. The borrower who drew nothing owes only the financed costs and their growth, ${K.usd(l90.balance)} at 90, and has a line of ${K.usd(l90.credit)} at that age.</p>
<p>Real note rates on an adjustable HECM move with the index. A rate one point higher for the whole period would make each balance noticeably larger, and a lower one smaller, so treat the table as a scale, not a schedule.</p>
${h.mini('balance', { t: 'What the first draw owes later', p: ['yrs'], d: { amt: Math.round(big.firstYearCash + big.mo), nr: K.NOTE, yrs: 10 } })}

<h2>Against the home's value at the end</h2>
<p>A HECM is non-recourse: when it ends, the debt is limited to the home. Heirs who want to keep the house can settle for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value, a rule written in ${h.src('cfr_206', '24 CFR part 206')}. If our ${K.usd(V)} house is still worth that at 95, ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of it is ${K.usd(heirs95.floor)}, and the balance of ${K.usd(m95.balance)} is below it: the heirs would repay the balance and keep the difference. Should prices fall or the rate climb, the cap would protect them. The ${h.a('heirs', 'heirs page')} has the calculator for that case.</p>

<h2>Cash now or room later</h2>
<p>A large first draw at 80 usually has a purpose, such as repairs or a debt that is not secured by the house. The cost is the interest and premium on money you may not spend for a while. The other route is to leave it in the line, where the unused part grows at the same rate as a balance would, and draw when needed. The ${h.a('line-of-credit', 'line of credit page')} explains that growth, and the ${h.a('first-year-limit', 'first-year limit page')} shows how a mortgage payoff changes the cap.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, plan: 'max', value: V },
  related: ['first-year-limit', 'loan-balance', 'line-of-credit', 'heirs', 'age-75', 'age-85'],
  sources: ['hud_plf', 'handbook', 'hud_payplan', 'cfr_206', 'cfr_206_31'],
});
