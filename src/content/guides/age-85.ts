import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, T = P.tenure;
// Worked case of the page: an 85-year-old with a $240,000 home, no mortgage, adjustable rate, monthly payments.
const V = 240000, AGE = 85;
const rT = K.rateT(K.EXP);
const o = K.loan({ age: AGE, value: V });
const n = o.tenureMonths;
const terms = [5, 8, 10];
const termPay = (y: number) => K.pay(o.npl, y * 12, K.EXP);
const t10 = termPay(10);
const runTen = K.project({ age: AGE, value: V }, 15, o.tenure, 1200);
const runT10 = K.project({ age: AGE, value: V }, 15, t10, 120);
const at = (rows: typeof runTen, age: number) => rows.find((r) => r.age === age)!;
const topAge = T.ageCap, topRow = P.plf.ageMax;
const fTop = K.plf(topRow, K.EXP), fCap = K.plf(topAge, K.EXP), f90 = K.plf(90, K.EXP);
const fMax = K.plf(topRow, P.plf.rateMin);
const ladder = [80, 85, 88, 90, 93, topAge, topRow];
const hiRate = K.loan({ age: AGE, value: V, expected: K.EXP + 1 }), loRate = K.loan({ age: AGE, value: V, expected: K.EXP - 1 });
const ten95 = at(runTen, 95), t95 = at(runT10, 95), ten100 = at(runTen, 100);

export default defineGuide({
  id: 'age-85',
  group: 'age',
  order: 85,
  slug: 'reverse-mortgage-at-85',
  nav: 'Reverse mortgage at 85',
  card: 'Payments for life sized on 180 months, against fixed-term payments',
  title: 'Reverse Mortgage at 85 in 2026: Monthly Payments, US',
  description: `Reverse mortgage at 85 in 2026: a HECM tenure payment is sized on ${n} months, about ${K.usd(o.tenure)} a month for life on a ${K.usd(V)} home, against the term plans.`,
  h1: 'A reverse mortgage at 85, paid by the month',
  intro: `At 85, a HECM can pay a fixed amount every month for life, and HUD sizes it as if the loan ran to age 100: here is what that gives and how it compares with a fixed term.`,
  resume: `At 85, the monthly payment for life on an adjustable HECM, called tenure, is sized by spreading the net principal limit over ${n} months, the ${T.endAge - AGE} years left to age ${T.endAge} in HUD's rule. On a ${K.usd(V)} home with no mortgage, HUD's factor of ${K.f(o.factor)} at an expected rate of ${K.pp(K.EXP)} gives a principal limit of ${K.usd(o.pl)}; after ${K.usd(o.imip)} of upfront mortgage insurance and ${K.usd(o.origination)} of origination fee, ${K.usd(o.npl)} is left, which pays about ${K.usd(o.tenure)} a month for as long as the home is your residence. A ten-year term pays more, about ${K.usd(t10)}, but stops after 120 payments. A 15-year term gives exactly the tenure amount, because both use ${n} months; the difference is that tenure keeps paying past 100. With the note rate held at ${K.pp(K.NOTE)}, the tenure balance would be about ${K.usd(ten95.balance)} at 95.`,
  faqs: [
    { q: 'What happens to tenure payments if I live past 100?', a: `They continue. Tenure is sized on ${n} months at 85, but HUD's handbook defines it as fixed monthly payments for as long as the loan is not repaid and not due, within the maximum amount written in the mortgage. A 100th birthday does not end them. The balance keeps growing past the home's value in that case, and the FHA insurance, not you or your heirs, absorbs the difference.` },
    { q: 'Can I switch from tenure to a line of credit after a few years?', a: `Yes, on an adjustable HECM you may change the payment plan at any time while funds remain, according to HUD's handbook. What is left to draw is the principal limit, which has grown since closing, minus the balance and any set-aside. The new plan is written on the same HUD payment plan form used at closing.` },
    { q: 'How much more is a tenure payment at 85 than at 80?', a: `About ${K.usd(o.tenure)} against ${K.usd(K.loan({ age: 80, value: V }).tenure)} on the same ${K.usd(V)} home. Two things move together. The factor rises from ${K.f(K.plf(80, K.EXP))} to ${K.f(o.factor)}, and the number of months falls from ${K.tenureMonths(80)} to ${n}. The shorter horizon does most of the work, as the table on this page shows age by age.` },
    { q: 'Is a term payment at 85 riskier than tenure?', a: `The risk is outliving it. A ten-year term at 85 pays about ${K.usd(t10)} a month until 95 and then nothing, while the loan stays in place and the balance keeps growing. You can still stay in the home, and any credit line set aside under a modified term plan remains. Tenure pays less each month, about ${K.usd(o.tenure)}, but never stops while you live there.` },
  ],
  body: (h) => `
<h2>Why HUD counts ${n} months at 85</h2>
<p>A HECM (Home Equity Conversion Mortgage, the FHA-insured reverse mortgage) with an adjustable rate can pay you a fixed amount each month instead of a lump sum or a credit line. Tenure is the version that lasts as long as you live in the home. To size it, HUD treats the loan as if it ran until the youngest borrower turned ${T.endAge}: the month count is 12 × (${T.endAge} − age), the same horizon the ${h.src('handbook', 'HUD Handbook 4000.1')} uses for the remaining term of a tenure loan. At 85 that is ${T.endAge - AGE} years, or ${n} months. From age ${topAge}, the count stops shrinking and stays at ${K.tenureMonths(topAge)} months, a floor set by ${h.src('cfr_206', '24 CFR part 206')}.</p>
<p>The payment is the amount that would use up the net principal limit over those months, at the expected rate plus the ${K.pct(P.mip.annual, 1)} annual mortgage insurance premium (MIP), with each payment made at the start of a month. For our 85-year-old, the expected rate is ${K.pp(K.EXP)}: the 10-year Treasury rate (CMT) of ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}. Spread over ${n} months, ${K.usd(o.npl)} gives about ${K.usd(o.tenure)} a month, or ${K.usd(12 * o.tenure)} a year.</p>
<p>The expected rate enters twice, and the two effects pull against each other: a higher rate picks a lower factor in HUD's table, but each dollar left then buys a larger monthly amount. One point higher, at ${K.pp(K.EXP + 1)}, and the same home pays about ${K.usd(hiRate.tenure)} a month; one point lower, about ${K.usd(loRate.tenure)}. At 85 the gap is small. The rate is fixed when the loan is sized. Afterwards the note rate of an adjustable HECM moves with the index, which changes how fast the balance grows but not the amount of each payment.</p>

<h2>Tenure next to fixed terms of 5, 8 and 10 years</h2>
<p>A term plan pays equal monthly amounts for a number of months you choose, then stops. It is computed with the same formula, only the month count changes. The first-year limit does not bind here: twelve payments stay under the ${K.usd(o.firstYearCash)} the rule allows in year one even for the shortest term, so every plan below pays its full amount from the start.</p>
${h.table(['Plan', 'Months', 'Monthly payment', 'Paid in a year', 'Stops at age'], [['Tenure', String(n), K.usd(o.tenure), K.usd(12 * o.tenure), 'Never, while you live there'], ...terms.map((y) => [`Term, ${y} years`, String(y * 12), K.usd(termPay(y)), K.usd(12 * termPay(y)), String(AGE + y)])], `${K.usd(V)} home, age ${AGE}, no mortgage, net principal limit ${K.usd(o.npl)} after upfront MIP and origination at the legal maximum. Expected rate ${K.pp(K.EXP)} plus ${K.pct(P.mip.annual, 1)} MIP.`, ['l', 'r', 'r', 'r', 'l'])}
<p>A five-year term more than doubles the monthly amount. That suits a need with an end date, such as bridging the years until another income starts. The payment for life is the one that does not run out. Both can be combined with a credit line kept aside, which HUD calls modified tenure and modified term.</p>
${h.mini('payments', { t: 'Pick a term at 85', p: ['term'], d: { age: AGE, value: V, pt: 'term', term: 7 } })}

<h2>A 15-year term pays the same as tenure</h2>
<p>At 85, a term of ${T.endAge - AGE} years and the tenure plan count the same ${n} months, so the formula gives the same payment to the cent. The two part ways only at ${T.endAge}. A term borrower who reaches that age stops receiving money. A tenure borrower keeps getting ${K.usd(o.tenure)} a month for as long as the loan is not due and the payments stay within the maximum amount stated in the mortgage, as the handbook words it. The plan chosen is recorded on lines 29 and 30 of the ${h.src('hud_payplan', 'HUD payment plan')} form. That extra time is the reason to choose tenure at this age when the amounts are equal.</p>

<h2>The balance under each plan</h2>
<p>Each payment is added to the balance, and so are the interest and the annual MIP on everything already paid. With the note rate held at ${K.pp(K.NOTE)}, the tenure balance reaches ${K.usd(ten95.balance)} at 95 and ${K.usd(ten100.balance)} at 100. The ten-year term, larger each month but shorter, ends at 95 with ${K.usd(t95.balance)}, and from then on only interest and MIP add to it.</p>
${h.table(['Age', 'Balance with tenure', 'Balance with a 10-year term', 'Principal limit'], [88, 90, 95, 100].map((a) => { const x = at(runTen, a), y = at(runT10, a); return [String(a), K.usd(x.balance), K.usd(y.balance), K.usd(x.limit)]; }), `${K.usd(V)} home, borrower aged ${AGE} at closing, note rate ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} MIP held constant. The principal limit grows at the same rate. Projection, not a loan offer.`, ['l', 'r', 'r', 'r'])}
<p>The last column is the principal limit, which grows at the same monthly rate. By design, a tenure balance catches up with it near ${T.endAge}. A balance above the home's value is not a debt for you or your heirs: the loan is non-recourse, and the ${h.a('heirs', 'heirs page')} explains the ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} rule that applies when it ends.</p>

<h2>Close to the top of the factor table</h2>
<p>HUD's principal limit factor (PLF) table keeps rising with age, but it flattens near the end (${h.src('hud_plf', 'HUD factor table')}). In the ${K.pp(rT)} column, the factor is ${K.f(o.factor)} at 85, ${K.f(f90)} at 90, ${K.f(fCap)} at ${topAge} and ${K.f(fTop)} at ${topRow}, the last row. No cell of the whole table goes above ${K.f(fMax)}. An 85-year-old already gets about ${K.pct(o.factor / fTop, 0)} of the most this column allows at any age.</p>
${h.table(['Age', 'Factor', 'Months used', 'Tenure payment'], ladder.map((a) => { const x = K.loan({ age: a, value: V }); return [String(a), K.f(x.factor), String(x.tenureMonths), K.usd(x.tenure)]; }), `${K.usd(V)} home, no mortgage, expected rate ${K.pp(K.EXP)}. Months used: 12 × (${T.endAge} − age), with ages above ${topAge} counted as ${topAge}.`, ['l', 'r', 'r', 'r'])}
<p>Waiting a few years therefore adds less from the factor than from the month count: the payment climbs fast after 90 because the horizon shrinks, not because the factor does. The ${h.a('monthly-payments', 'monthly payments page')} covers the formula for every age, and the ${h.a('reverse-mortgage-age-requirement', 'age rules page')} explains how HUD rounds your age.</p>
${h.mini('payments', { t: 'Tenure on your home at 85', p: ['value'], d: { age: AGE, value: 205000 } })}`,
  tool: 'payments',
  toolArg: { age: AGE, value: V },
  related: ['monthly-payments', 'line-of-credit', 'heirs', 'age-80', 'reverse-mortgage-age-requirement'],
  sources: ['handbook', 'hud_payplan', 'hud_plf', 'cfr_206'],
});
