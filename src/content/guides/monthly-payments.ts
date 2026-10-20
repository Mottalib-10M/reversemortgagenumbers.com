import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: a $350,000 home, adjustable HECM, maximum origination fee, no mortgage left.
const VALUE = 350000, AGE = 70;
const ages = [62, 65, 68, 70, 73, 76, 80, 85, 90, 95];
const at = (a: number) => K.loan({ age: a, value: VALUE });
const o = at(AGE);
const term = (n: number, x = o) => K.pay(x.npl, n * 12, K.EXP);
const KEEP = 40000;
const modT = K.pay(o.npl - KEEP, o.tenureMonths, K.EXP);
const o62 = at(62), o90 = at(90), o95 = at(95);
const CAPLIEN = 60000;
const yearCap = K.loan({ age: 66, value: VALUE, liens: CAPLIEN });
const capPay = K.pay(yearCap.npl, 12 * 3, K.EXP);

export default defineGuide({
  id: 'monthly-payments',
  group: 'payout',
  order: 30,
  slug: 'reverse-mortgage-monthly-payments',
  nav: 'Monthly payments: tenure and term',
  card: 'Tenure and term payments by age, with the HUD formula behind them',
  title: 'Reverse Mortgage Monthly Payments 2026: Tenure, Term, US',
  description: `Reverse mortgage monthly payments in 2026: tenure is sized on 12 × (100 − age) months, ${K.usd(o.tenure)} a month at ${AGE} on a ${K.usd(VALUE)} home. Term and modified plans by age.`,
  h1: 'Monthly payments from a HECM: tenure and term',
  intro: `What an adjustable HECM can pay you every month, for life or for a set number of years, worked out with the month count and the rate that the regulation prescribes.`,
  resume: `A HECM paid monthly for life, the tenure plan, is sized as if payments ran for 12 × (100 − age) months, with the age capped at ${P.tenure.ageCap}, at the expected rate plus ${K.pct(P.mip.annual, 1)} of mortgage insurance (MIP), yet it keeps paying for as long as the loan is not due. On a ${K.usd(VALUE)} home with an expected rate of ${K.pp(K.EXP)} (10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), and after the upfront MIP and the maximum origination fee, the tenure payment is ${K.usd(o62.tenure)} a month at 62, ${K.usd(o.tenure)} at ${AGE}, ${K.usd(at(80).tenure)} at 80 and ${K.usd(o90.tenure)} at 90. The term plan spreads the same net principal limit over the years you choose: ${K.usd(term(10))} a month for 10 years at ${AGE}. A modified plan keeps part of the money as a line of credit and pays the rest monthly. Payments stay level; they are not indexed to prices.`,
  faqs: [
    { q: 'Do tenure payments stop if I live past 100?', a: `No. The age of 100 is only the end of the period used to size the payment. 24 CFR 206.25(f) says payments "shall continue until the mortgage becomes due and payable", that is, until the last borrower dies, sells or leaves the home, or another default occurs. They can stop earlier only if they would push the balance above the maximum amount written in the security instrument.` },
    { q: 'Do monthly payments stop when the balance passes the principal limit?', a: `Not on a term or tenure plan. The regulation tells the lender to make every scheduled payment even if the balance overtakes the principal limit because the actual rate turned out higher than the expected rate. A line of credit is different: once the balance plus set-asides reach the principal limit, nothing is left to draw.` },
    { q: 'Which pays more each month, tenure or a 10-year term?', a: `The term, because the same net principal limit is spread over fewer months. At ${AGE}, on a ${K.usd(VALUE)} home, tenure pays ${K.usd(o.tenure)} a month and a 10-year term ${K.usd(term(10))}. The term stops after 120 payments, though the balance still falls due only when you leave the home; tenure goes on for as long as you live in the home. At ${P.tenure.ageCap} and over, tenure is sized on ${o95.tenureMonths} months, so a 5-year term gives the same payment.` },
    { q: 'Can a reverse mortgage monthly payment be raised later?', a: `Not automatically: tenure and term pay equal monthly amounts. After the first 12 months, an adjustable-rate borrower whose balance is below the principal limit can ask the lender to recalculate the payment or change plans, and the lender may charge a fee for it. A recalculation uses the room left at that date, so it raises the payment only when unused principal limit remains.` },
  ],
  body: (h) => `
<h2>The tenure payment, age by age</h2>
<p>The table applies HUD's formula to one home at ten ages. The net principal limit is what remains after the upfront premium of ${K.usd(o.imip)} and an origination fee of ${K.usd(o.origination)}; the tenure payment spreads it over the regulation's month count, and the 10-year term over 120 months, both at ${K.pp(K.EXP)} + ${K.pp(P.mip.annual * 100, 1)}.</p>
${h.table(['Age', 'Months used', 'Net principal limit', 'Tenure payment', '10-year term'], ages.map((a) => { const x = at(a); return [String(a), String(x.tenureMonths), K.usd(x.npl), K.usd(x.tenure), K.usd(term(10, x))]; }), `${K.usd(VALUE)} home, adjustable HECM, expected rate ${K.pp(K.EXP)}, maximum origination fee, no mortgage to pay off, no set-aside. Payments made at the start of each month.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two forces lift the payment with age: the principal limit factor is higher, and the month count is shorter. At 62 the payment is sized on ${o62.tenureMonths} months; at 90, on ${o90.tenureMonths}. From ${P.tenure.ageCap} on, the count stays at ${o95.tenureMonths} months, which is why a 95-year-old's tenure payment of ${K.usd(o95.tenure)} equals a five-year term.</p>
${h.mini('payments', { t: 'Your tenure payment', p: ['age'], d: { age: 83, value: VALUE } })}

<h2>The formula in the regulation</h2>
<p>24 CFR 206.25(f) sets the tenure calculation: monthly payments are computed "as if the number of months in the payment term equals 100 minus the lesser of the age of the youngest borrower or 95, multiplied by 12". Term payments, under 206.25(e), are sized so that the initial disbursement, the set-asides, the MIP and all interest through the end of the term add up to the principal limit at that date, using "the expected average mortgage interest rate" (${h.src('cfr_206', '24 CFR part 206')}). In both cases the rate is the expected rate, the one that also picks the column of the factor table, and each payment is due on the first business day of the month (206.27(b)(1)).</p>
<p>Because the payment is sized on a rate rather than tied to it, a later change in the note rate does not change the check. It changes how fast the balance grows. When the borrower asks the lender to pay property taxes and insurance from the monthly payments, HUD's form deducts one twelfth of the yearly charges from each payment on line 32 and prints the net amount on line 33; the withheld money joins the balance only when the bills are actually paid (${h.src('hud_payplan', 'HUD payment plan form')}). For a term plan, 206.25(e)(2) makes the lender pay "all monthly disbursements through the payment term even if the outstanding loan balance exceeds the principal limit".</p>

<h2>Term payments: choose the number of years</h2>
<p>A term plan pays more each month and stops on a date you pick. At ${AGE} on the same home, the net principal limit of ${K.usd(o.npl)} gives ${K.usd(term(5))} a month over 5 years, ${K.usd(term(10))} over 10 and ${K.usd(term(15))} over 15. Once the term ends, no more money comes, but the loan does not become due: you keep living in the home and the balance keeps growing until you leave. A term can make sense to bridge a gap with a known end date, such as years before a pension starts; tenure is built for income that lasts.</p>
${h.mini('payments', { t: 'Try a term payment', p: ['term'], d: { pt: 'term', term: 7, age: 72, value: VALUE } })}

<h2>The first 12 months can cap the payment</h2>
<p>Monthly payments count against the initial disbursement limit like any other draw. If twelve payments plus the costs paid at closing would exceed it, 206.25(e)(3) and (f)(2) tell the lender to lower the payments during year one; after that, you may ask for a recalculation. This happens when a mortgage payoff uses most of the first-year room. A 66-year-old with ${K.usd(CAPLIEN)} to pay off on a ${K.usd(VALUE)} home has ${K.usd(yearCap.firstYearCash)} of cash room in year one, the ${K.pct(P.firstYear.extra, 0)} of the principal limit allowed on top of the obligations. A 3-year term on the net principal limit of ${K.usd(yearCap.npl)} would pay ${K.usd(capPay)} a month, ${K.usd(12 * capPay)} over twelve months, so the lender reduces the first year's checks to fit, and the borrower can ask for the plan to be recalculated once the year is over.</p>

<h2>Modified tenure and modified term</h2>
<p>The modified plans split the money: part stays as a line of credit you draw when you choose, and the rest is paid monthly (24 CFR 206.19(d); ${h.src('handbook', 'Handbook 4000.1')}). They exist only on adjustable-rate HECMs, like tenure and term. At ${AGE}, keeping ${K.usd(KEEP)} as a line and putting the rest into tenure gives ${K.usd(modT)} a month instead of ${K.usd(o.tenure)}. The ${K.usd(KEEP)} kept aside grows at the note rate plus ${K.pct(P.mip.annual, 1)} while unused, as explained on the ${h.a('line-of-credit', 'line of credit page')}.</p>
<p>A fixed-rate HECM cannot pay monthly at all: its only plan is a ${h.a('lump-sum', 'single lump sum')} at closing. Every payment you receive adds to the balance with its own interest and MIP, which the ${h.a('loan-balance', 'loan balance page')} follows over time. The amount behind the payment, the net principal limit, falls when costs or a payoff are larger; the ${h.a('hecm-calculator', 'full calculator')} shows the line-by-line route from home value to monthly check.</p>`,
  tool: 'payments',
  toolArg: { age: AGE, value: VALUE },
  related: ['hecm-calculator', 'line-of-credit', 'lump-sum', 'loan-balance', 'first-year-limit', 'age-75'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'hud_plf', 'treasury_yield'],
});
