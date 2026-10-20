import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const AGE = 62, V = 350000, TAX = 5400;
const rT = K.rateT(K.EXP);
const o = K.loan({ age: AGE, value: V });
const f = o.factor, f63 = K.plf(63, K.EXP), f70 = K.plf(70, K.EXP);
const values = [200000, 275000, 350000, 500000, 800000, 1300000];
const valueRows = values.map((v) => { const x = K.loan({ age: AGE, value: v }); return [K.usd(v), K.usd(x.pl), K.usd(x.imip + x.origination), K.usd(x.firstYearCash), K.usd(x.laterCash), K.usd(x.tenure)]; });
const rates = [rT - 1, rT, rT + 1];
const yrs = K.talc(AGE) ?? 0;
const lesa62 = K.loan({ age: AGE, value: V, lesa: 'full', charges: TAX });
const lesaAt = (a: number) => K.lesa(TAX, a, K.EXP);
const lien = K.loan({ age: AGE, value: V, liens: 90000 });
const n62 = K.tenureMonths(AGE);
const drawn = K.project({ age: AGE, value: V, draw: 'max' }, 30).filter((r) => [10, 20, 30].includes(r.year));
const firstCost = (v: number) => { const x = K.loan({ age: AGE, value: v }); return (x.imip + x.origination) / x.pl; };

export default defineGuide({
  id: 'age-62',
  group: 'age',
  order: 62,
  slug: 'reverse-mortgage-at-62',
  nav: 'Reverse mortgage at 62',
  card: 'The youngest borrower: lowest factor, longest set-aside, 456 months',
  title: 'Reverse Mortgage at 62 in 2026: Lowest HUD Factor, US',
  description: `Reverse mortgage at 62 in 2026: HUD's factor is ${K.f(f)}, so a ${K.usd(V)} home gives ${K.usd(o.pl)}; the tax set-aside is sized on ${yrs} years and tenure on ${n62} months.`,
  h1: 'A reverse mortgage at 62, the minimum age',
  intro: `What the first eligible year gives and costs: the smallest factor a borrower can get, the amount by home value, and the long horizons HUD uses at 62.`,
  resume: `At 62, the youngest age at which a HECM can close, HUD's principal limit factor is ${K.f(f)} at an expected rate of ${K.pp(K.EXP)}, the lowest any borrower can get at that rate: a ${K.usd(V)} home gives a principal limit of ${K.usd(o.pl)}. From that, ${K.usd(o.imip)} of upfront mortgage insurance and up to ${K.usd(o.origination)} of origination fee are deducted, leaving ${K.usd(o.firstYearCash)} for the first 12 months and ${K.usd(o.laterCash)} after. Every horizon is long at this age. HUD sizes a life expectancy set-aside for taxes and insurance on ${yrs} years, so ${K.usd(TAX)} a year of charges would take ${K.usd(lesa62.lesa)} of the loan. Monthly payments for life are spread over ${n62} months, which gives ${K.usd(o.tenure)} a month on the same home. One more year of age, or a closing date within 183 days of the 63rd birthday, raises the factor to ${K.f(f63)}.`,
  faqs: [
    { q: 'Can I close a reverse mortgage the week I turn 62?', a: `Yes. The rule in 24 CFR 206.33 is that the youngest borrower must be ${P.eligibility.borrowerMinAge} or older at the time of loan closing, not at application. The factor is then read on the 62 row, unless the next birthday falls less than 183 days after closing, in which case the Handbook has the lender use the 63 row.` },
    { q: 'How much can a 62-year-old get on a $350,000 home?', a: `${K.usd(o.pl)} of principal limit at an expected rate of ${K.pp(K.EXP)}, before costs. After the ${K.usd(o.imip)} upfront premium and a ${K.usd(o.origination)} origination fee, ${K.usd(o.firstYearCash)} can be used in the first year and ${K.usd(o.laterCash)} more after it, as a line of credit that grows. With no mortgage left, a tenure payment would be about ${K.usd(o.tenure)} a month.` },
    { q: 'Why does a tax and insurance set-aside take so much of the loan at 62?', a: `Because HUD sizes it on the life expectancy of Regulation Z's table, ${yrs} years at 62, then multiplies the monthly charges by 1.2. On ${K.usd(TAX)} a year, that is ${K.usd(lesa62.lesa)}, more than half of the ${K.usd(o.pl)} principal limit of a ${K.usd(V)} home. At 70 the same charges need ${K.usd(lesaAt(70))}.` },
    { q: 'Is 62 the lowest row of the HUD factor table?', a: `No. The table starts at ${P.plf.ageMin}, but rows under ${P.eligibility.borrowerMinAge} serve only to size a loan for an eligible non-borrowing spouse. For a borrower, 62 is the lowest row that can apply, so ${K.f(f)} is the smallest factor a borrower can get at an expected rate of ${K.pp(K.EXP)}.` },
  ],
  body: (h) => `
<h2>Sixty-two on the day of closing</h2>
<p>The age rule is one line of the regulation: the youngest borrower shall be ${P.eligibility.borrowerMinAge} or older at the time of loan closing (${h.src('cfr_206', '24 CFR 206.33')}). A couple where one spouse is 64 and the other 61 cannot both borrow yet; the younger one can be named an eligible non-borrowing spouse, and the factor then comes from the 61 row, ${K.f(K.plf(61, K.EXP))}. The ${h.a('reverse-mortgage-age-requirement', 'age requirement page')} covers the other cases.</p>
<p>Rounding works in the borrower's favor near a birthday. The Handbook tells the lender to use the next age when the next birthday falls less than 183 days after closing (${h.src('handbook', 'HUD Handbook 4000.1')}). A borrower who is 62 and seven months old at closing is read on the 63 row: ${K.f(f63)} instead of ${K.f(f)}, or ${K.usd(V * (f63 - f))} more on a ${K.usd(V)} home.</p>

<h2>The smallest factor a borrower can get</h2>
<p>A younger borrower has more expected years for the balance to grow, so HUD lends a smaller share. At 62 the share is about a third of the home's value up to the limit, and it moves with the expected rate more than with anything else the borrower controls:</p>
${h.table(['Expected rate', 'Factor at 62', `Principal limit on ${K.usd(V)}`, 'Factor at 70, for comparison'], rates.map((r) => [K.pp(r), K.f(K.plf(AGE, r)), K.usd(V * K.plf(AGE, r)), K.f(K.plf(70, r))]), `HUD principal limit factors, expected rate rounded to the nearest 1/8 point. The default ${K.pp(K.EXP)} is the 10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}.`, ['l', 'r', 'r', 'r'])}
<p>Eight years of age move the factor from ${K.f(f)} to ${K.f(f70)} at today's rate; one point of rate moves it nearly as far. A borrower who closes at 62 locks in that row for the life of the loan: the factor is read once, at closing, and later growth comes from the note rate, not from age. The ${h.a('reverse-mortgage-rates', 'rates page')} explains where the expected rate comes from, and the ${h.a('principal-limit-factor', 'factor table')} has every row.</p>

<h2>What a 62-year-old gets, by home value</h2>
<p>The upfront premium is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount and the origination fee is capped at ${K.usd(P.origination.cap)}, so the costs weigh more on a small home. Above ${K.usd(P.limits.mca2026)}, the 2026 limit, the home counts for that amount.</p>
${h.table(['Home value', 'Principal limit', 'Upfront MIP + origination', 'Cash in the first 12 months', 'Available after month 12', 'Or tenure, per month'], valueRows, `Borrower aged ${AGE}, adjustable rate, expected rate ${K.pp(K.EXP)}, no mortgage to pay off, maximum origination fee, no other closing costs.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Read the third column against the second. On a ${K.usd(200000)} home, the upfront premium and the origination fee take ${K.pct(firstCost(200000), 0)} of the principal limit; on an ${K.usd(800000)} home, ${K.pct(firstCost(800000), 0)}. Third-party charges such as the appraisal and title come on top and are not in these figures; the ${h.a('reverse-mortgage-costs', 'costs page')} lists them.</p>
${h.mini('hecm', { t: 'Your home value at 62', p: ['value'], d: { age: AGE, value: V } })}

<h2>A set-aside sized on ${yrs} years</h2>
<p>When the lender's financial assessment requires a life expectancy set-aside (LESA), the amount is 1.2 times the monthly property charges, over the life expectancy of the youngest borrower in the Regulation Z table (${h.src('regz_appl', 'Regulation Z, Appendix L')}). At 62 that is ${yrs} years, the longest a borrower can face, and the set-aside is largest just when the factor is smallest.</p>
${h.table(['Age', 'Years in the table', `LESA on ${K.usd(TAX)} a year`], [62, 70, 80].map((a) => [String(a), String(K.talc(a)), K.usd(lesaAt(a))]), `Fully funded LESA discounted at the expected rate of ${K.pp(K.EXP)} plus ${K.pct(P.mip.annual, 1)} annual MIP.`, ['l', 'r', 'r'])}
<p>On the ${K.usd(V)} home, a full set-aside of ${K.usd(lesa62.lesa)} leaves ${K.usd(lesa62.firstYearCash)} of cash in the first year and ${lesa62.laterCash > 0 ? `${K.usd(lesa62.laterCash)} after it` : "nothing at all after it"}. A 62-year-old who expects to need a set-aside should run that case before anything else. ${h.a('lesa', 'The set-aside calculator')} applies HUD's formula.</p>
${h.mini('lesa', { t: 'Your taxes and insurance at 62', p: ['tax'], d: { age: AGE, tax: TAX, value: V } })}

<h2>Payments spread over ${n62} months</h2>
<p>A tenure payment is sized as if it ran to age 100: 12 × (100 − ${AGE}) = ${n62} months, discounted at the expected rate plus the annual premium. That long count is why the ${K.usd(o.tenure)} a month at 62 on a ${K.usd(V)} home is modest. A term payment over 10 years on the same home would be ${K.usd(K.pay(o.npl, 120, K.EXP))}, but it stops after 120 payments. The ${h.a('monthly-payments', 'monthly payments page')} compares the plans.</p>

<h2>Thirty years is a real horizon at 62</h2>
<p>A loan opened at 62 can run for three decades, and a HECM balance grows every month at the note rate plus ${K.pct(P.mip.annual, 1)} of mortgage insurance, with nothing paid. If the ${K.usd(V)} borrower takes the full ${K.usd(o.firstYearCash)} allowed in the first year at closing, and the note rate stays at ${K.pp(K.NOTE)}, the balance looks like this:</p>
${h.table(['Age reached', 'Loan balance', 'Unused credit still available'], drawn.map((r) => [String(r.age), K.usd(r.balance), K.usd(r.credit)]), `Borrower aged ${AGE}, ${K.usd(V)} home, first-year maximum drawn at closing, the rest left as a line of credit, note rate held at ${K.pp(K.NOTE)}.`, ['l', 'r', 'r'])}
<p>By 92 the balance has passed the home's value of today. Whether it passes the value of that year depends on prices nobody can forecast; the loan stays non-recourse either way, and the ${h.a('loan-balance', 'loan balance page')} works through other amounts. For a borrower who draws little, the picture reverses: the untouched line keeps growing at the same rate as the balance would.</p>

<h2>A mortgage still running at 62</h2>
<p>When a mortgage is still running, the first-year rule matters more than the factor. With ${K.usd(90000)} to pay off on the ${K.usd(V)} home, the costs and the payoff reach ${K.usd(lien.mo)}, more than half of the ${K.usd(lien.pl)} principal limit. The first-year limit becomes those obligations plus ${K.pct(P.firstYear.extra, 0)} of the principal limit, so only ${K.usd(lien.firstYearCash)} of cash is left for the first 12 months, and ${K.usd(lien.laterCash)} after. The ${h.a('existing-mortgage', 'existing mortgage page')} shows where that payoff stops fitting.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, value: V },
  related: ['reverse-mortgage-age-requirement', 'principal-limit-factor', 'lesa', 'monthly-payments', 'existing-mortgage', 'age-65'],
  sources: ['cfr_206', 'handbook', 'hud_plf', 'regz_appl', 'treasury_yield'],
});
