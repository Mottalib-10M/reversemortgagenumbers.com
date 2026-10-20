import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const AGE = 65, V = 380000, LIEN = 60000, LINE = 40000;
const o = K.loan({ age: AGE, value: V });
const o62 = K.loan({ age: 62, value: V });
const withLien = K.loan({ age: AGE, value: V, liens: LIEN });
const n = o.tenureMonths, n62 = o62.tenureMonths;
const terms = [5, 10, 15, 20];
const termRows = terms.map((y) => [`${y} years (${y * 12} payments)`, K.usd(K.pay(o.npl, y * 12, K.EXP)), K.usd(K.pay(o62.npl, y * 12, K.EXP))]);
const tenureRow = [`Tenure (sized on ${n} / ${n62} months)`, K.usd(o.tenure), K.usd(o62.tenure)];
const pay10 = K.pay(o.npl, 120, K.EXP);
const pathTenure = K.project({ age: AGE, value: V }, 25, o.tenure, 1200);
const pathTerm = K.project({ age: AGE, value: V }, 25, pay10, 120);
const marks = [5, 10, 15, 20, 25];
const pathRows = marks.map((y) => { const a = pathTenure[y - 1], b = pathTerm[y - 1]; return [String(a.age), K.usd(a.balance), K.usd(b.balance), K.usd(a.limit)]; });
const modified = K.pay(o.npl - LINE, n, K.EXP);
const rates = [K.EXP - 1, K.EXP, K.EXP + 1];

export default defineGuide({
  id: 'age-65',
  group: 'age',
  order: 65,
  slug: 'reverse-mortgage-at-65',
  nav: 'Reverse mortgage at 65',
  card: 'Monthly payments at 65: tenure on 420 months, terms, and 62 compared',
  title: 'Reverse Mortgage at 65 in 2026: Monthly Payments, US',
  description: `Reverse mortgage at 65 in 2026: a HECM tenure payment of ${K.usd(o.tenure)} a month on a ${K.usd(V)} home, sized on ${n} months, against ${K.usd(o62.tenure)} for the same home at age 62.`,
  h1: 'Monthly reverse mortgage payments at 65',
  intro: `What a HECM pays each month to a 65-year-old, for life or for a set number of years, and how those payments compare with the ones a 62-year-old gets.`,
  resume: `At 65, a HECM on a ${K.usd(V)} home with no mortgage left pays about ${K.usd(o.tenure)} a month for as long as the home stays the principal residence, at an expected rate of ${K.pp(K.EXP)}. HUD sizes that tenure payment as if it ran ${n} months, to age 100, on a net principal limit of ${K.usd(o.npl)}: the factor ${K.f(o.factor)} times the home value, minus ${K.usd(o.imip)} of upfront mortgage insurance and a ${K.usd(o.origination)} origination fee. A term payment is larger because it stops: ${K.usd(pay10)} a month for 10 years, ${K.usd(K.pay(o.npl, 60, K.EXP))} for 5. Waiting three years from 62 adds ${K.usd(o.tenure - o62.tenure)} a month to the tenure payment, since the factor rises from ${K.f(o62.factor)} and the count falls from ${n62} to ${n} months. A ${K.usd(LIEN)} mortgage paid off at closing cuts the tenure payment at 65 to ${K.usd(withLien.tenure)}.`,
  faqs: [
    { q: 'How much is a reverse mortgage monthly payment at 65?', a: `On a ${K.usd(V)} home with no mortgage, about ${K.usd(o.tenure)} a month for life at an expected rate of ${K.pp(K.EXP)}, or ${K.usd(pay10)} a month for a 10-year term. The amount scales with the home value up to the ${K.usd(P.limits.mca2026)} limit, and falls when costs or a mortgage payoff reduce the net principal limit. The calculator above uses your own figures.` },
    { q: 'Do term payments leave a balance due when they stop?', a: `Yes. The payments end, but the loan does not: the balance stays in place and keeps growing at the note rate plus ${K.pct(P.mip.annual, 1)} until the home is sold or the loan is otherwise repaid. With a 10-year term at 65 on a ${K.usd(V)} home, the balance at 75 is about ${K.usd(pathTerm[9].balance)}, and at 85 about ${K.usd(pathTerm[19].balance)}.` },
    { q: 'Can I switch from monthly payments to a line of credit later?', a: 'On an adjustable-rate HECM, yes. After the first 12 months, and as long as the balance is below the principal limit, 24 CFR 206.26 lets you ask for a change to another payment option or a recalculation, and the lender may charge a fee up to an amount set by HUD. A fixed-rate HECM cannot change its payment option.' },
    { q: 'Can I get monthly payments and keep a line of credit at the same time?', a: `Yes, with the modified tenure or modified term option of 24 CFR 206.19. Part of the principal limit is set aside as a line of credit and the rest pays the monthly amount. At 65, keeping ${K.usd(LINE)} as a line on a ${K.usd(V)} home lowers the tenure payment from ${K.usd(o.tenure)} to about ${K.usd(modified)}, and the line grows like the principal limit.` },
  ],
  body: (h) => `
<h2>${n} months: how HUD sizes the payment at 65</h2>
<p>A tenure payment is the monthly amount that would use up the net principal limit over 12 × (100 − age) months, discounted at the expected rate plus the ${K.pct(P.mip.annual, 1)} annual premium (${h.src('cfr_206', '24 CFR 206.25(f)')}). At 65 that is ${n} months. The payments themselves do not stop at 100: they continue until the loan becomes due, unless they would exceed the maximum amount the mortgage secures.</p>
<p>For the ${K.usd(V)} home: HUD's factor at 65 is ${K.f(o.factor)}, so the principal limit is ${K.usd(o.pl)}. The upfront premium of ${K.pct(P.mip.upfront, 0)} and the origination fee take ${K.usd(o.mo)}, leaving ${K.usd(o.npl)}. Spread over ${n} months at ${K.pp(K.EXP)} plus ${K.pct(P.mip.annual, 1)}, that gives ${K.usd(o.tenure)}. In the first year, 12 payments add up to ${K.usd(12 * o.tenure)}, well under the ${K.usd(o.firstYearCash)} the first-year rule allows, so nothing is held back.</p>

<h2>Tenure and terms at 65, next to 62</h2>
<p>A term payment uses the same net principal limit over a number of months the borrower picks. The shorter the term, the larger each payment, and the sooner the money stops. Both columns use the same ${K.usd(V)} home and today's rates; only the age changes.</p>
${h.table(['Plan', 'Monthly at 65', 'Monthly at 62'], [tenureRow, ...termRows], `${K.usd(V)} home, no mortgage, adjustable rate, expected rate ${K.pp(K.EXP)}, upfront MIP and maximum origination fee financed. Net principal limit ${K.usd(o.npl)} at 65 and ${K.usd(o62.npl)} at 62.`, ['l', 'r', 'r'])}
<p>The gap between the two ages is about ${K.pct((o.tenure - o62.tenure) / o62.tenure, 0)} on the tenure payment and less on the terms. Two effects add up for tenure: a higher factor, ${K.f(o.factor)} instead of ${K.f(o62.factor)}, and ${n62 - n} fewer months in the count. A term payment only gets the first one, since a 10-year term has 120 payments at any age.</p>
${h.mini('payments', { t: 'Your tenure payment at 65', p: ['value'], d: { age: AGE, value: V } })}

<h2>What moves a payment more than age</h2>
<p>A mortgage still owed is the largest factor. Paying off ${K.usd(LIEN)} at closing takes the net principal limit at 65 from ${K.usd(o.npl)} to ${K.usd(withLien.npl)}, and the tenure payment from ${K.usd(o.tenure)} to ${K.usd(withLien.tenure)}: the payoff comes out of the same pool the payments are drawn from. The ${h.a('existing-mortgage', 'existing mortgage page')} covers that case.</p>
<p>Rates matter less than one might expect for tenure. A higher expected rate lowers the factor, but the same rate also discounts the payments, and the two partly offset:</p>
${h.table(['Expected rate', 'Factor at 65', 'Tenure at 65', 'Tenure at 62'], rates.map((r) => { const a = K.loan({ age: AGE, value: V, expected: r }), b = K.loan({ age: 62, value: V, expected: r }); return [K.pp(r), K.f(a.factor), K.usd(a.tenure), K.usd(b.tenure)]; }), `${K.usd(V)} home, no mortgage. HUD factors read at the expected rate rounded to the nearest 1/8 point.`, ['l', 'r', 'r', 'r'])}
${h.mini('payments', { t: 'A term instead of tenure', p: ['term'], d: { age: AGE, value: V, pt: 'term', term: 12 } })}

<h2>The balance behind the payments</h2>
<p>Each payment is added to the loan, and interest at the note rate plus the annual premium accrues on it. The table follows the balance at 65 on the ${K.usd(V)} home with the note rate held at ${K.pp(K.NOTE)}, for tenure and for a 10-year term. The last column is the principal limit, which grows at the same monthly rate.</p>
${h.table(['Age', 'Balance, tenure', 'Balance, 10-year term', 'Principal limit'], pathRows, `Note rate ${K.pp(K.NOTE)} + ${K.pct(P.mip.annual, 1)} MIP held constant; tenure of ${K.usd(o.tenure)} a month, or ${K.usd(pay10)} a month for 120 months.`, ['l', 'r', 'r', 'r'])}
<p>The term balance rises fast, then grows only by interest once the payments stop at 75. The tenure balance starts slower and keeps climbing for as long as the borrower lives in the home. Neither is a debt the borrower or the heirs owe beyond the home; the ${h.a('loan-balance', 'loan balance page')} and the ${h.a('heirs', 'heirs page')} explain why.</p>

<h2>What ends a payment for life</h2>
<p>Tenure means as long as the loan is not due, not as long as the borrower lives. The events that make a HECM due are set in ${h.src('cfr_206', '24 CFR 206.27(c)')}: the death of the last borrower when no other borrower lives in the home, unless an eligible non-borrowing spouse qualifies for a deferral; the sale or transfer of all title; the home ceasing to be the principal residence of every borrower; more than 12 consecutive months away because of physical or mental illness; and unpaid property charges or another broken obligation of the mortgage.</p>
<p>The last group matters most for someone who starts payments at 65 and may receive them for decades. Property taxes, homeowners insurance and upkeep stay the borrower's bills, and missing them can stop the payments and make the loan due. A 65-year-old who counts on ${K.usd(o.tenure)} a month to cover those bills can ask the lender about a set-aside, which reduces the payment but pays the charges from the loan; the ${h.a('property-taxes-and-insurance', 'taxes and insurance page')} explains the choice.</p>
<p>The payment itself does not rise with prices. It stays at the amount set at closing, or at the recalculated amount after a plan change, while the note rate on an adjustable loan moves with its index. A higher note rate makes the balance grow faster, not the payment smaller.</p>

<h2>Changing the plan later</h2>
<p>A plan chosen at 65 is not fixed for good on an adjustable-rate HECM. After the first 12 months, while the balance is below the principal limit, the borrower may ask the lender to switch to another option, recalculate the payment or draw a lump amount up to what is left (${h.src('cfr_206', '24 CFR 206.26')}). The lender may charge a fee for the change, capped by HUD. The modified options of 24 CFR 206.19 combine payments with a line of credit from the start: with ${K.usd(LINE)} kept aside as a line, the tenure payment at 65 becomes about ${K.usd(modified)}. The ${h.a('monthly-payments', 'monthly payments page')} and the ${h.a('line-of-credit', 'line of credit page')} go further into each option.</p>`,
  tool: 'payments',
  toolArg: { age: AGE, value: V },
  related: ['monthly-payments', 'age-62', 'line-of-credit', 'loan-balance', 'existing-mortgage', 'age-70'],
  sources: ['cfr_206', 'hud_plf', 'handbook', 'treasury_yield'],
});
