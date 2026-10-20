import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const rT = K.rateT(K.EXP);
// The published grid: every age from 62 to 99, expected rates from 5% to 9.5% by half a point.
const cols = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5];
const ages = Array.from({ length: 38 }, (_, i) => 62 + i);
// Worked case of the page: a 68-year-old with a $350,000 home.
const f68 = K.plf(68, K.EXP), pl68 = 350000 * f68;
const f68up = K.plf(68, K.EXP + 1), f68dn = K.plf(68, K.EXP - 1);
const f62 = K.plf(62, K.EXP), f90 = K.plf(90, K.EXP);
const flat = ages.find((a) => K.plf(a, P.plf.rateMin) === K.plf(a, P.plf.rateMin + 0.125));
const nAges = P.plf.ageMax - P.plf.ageMin + 1, nRates = Math.round((P.plf.rateMax - P.plf.rateMin) / P.plf.rateStep) + 1;
const nbs = K.loan({ age: 58, value: 350000 }), both68 = K.loan({ age: 68, value: 350000 });

export default defineGuide({
  id: 'principal-limit-factor',
  group: 'money',
  order: 10,
  slug: 'hecm-principal-limit-factor-table',
  nav: 'HUD principal limit factor table',
  card: 'The HUD factor for every age and expected rate, in force since 2017',
  title: 'HECM Principal Limit Factor Table 2026: HUD Factors, US',
  description: `HECM principal limit factor table for 2026: the HUD factor for every age from 62 to 99 and every expected rate, such as ${K.f(K.plf(70, rT))} at age 70 at a ${K.pp(rT)} rate.`,
  h1: 'The HUD principal limit factor table',
  intro: `The share of your home value a HECM can lend, read in the table HUD publishes for each age and expected rate, with the rows you need and the full file to download.`,
  resume: `The principal limit factor is the percentage of the maximum claim amount that a HECM borrower can receive, and HUD publishes it in one table: one row per age from ${P.plf.ageMin} to ${P.plf.ageMax}, one column per expected rate from ${K.pp(P.plf.rateMin, 0)} to ${K.pp(P.plf.rateMax)} in steps of one eighth of a point. The table in force today applies to every FHA case number assigned since ${K.day(P.plf.effective)}. At the expected rate of ${K.pp(K.EXP)} used on this site (10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin), HUD reads the ${K.pp(rT)} column: the factor is ${K.f(f62)} at 62, ${K.f(K.plf(70, rT))} at 70 and ${K.f(f90)} at 90. A 68-year-old with a ${K.usd(350000)} home gets ${K.usd(pl68)} of principal limit before any cost. One point more on the expected rate moves that factor to ${K.f(f68up)}; one point less, to ${K.f(f68dn)}. The age used is that of the youngest borrower or eligible non-borrowing spouse.`,
  faqs: [
    { q: 'Where does HUD publish the principal limit factors?', a: 'On its page of resources for single family lenders, under Principal Limit Factors, as a spreadsheet. The file still carries the name of fiscal year 2018 because it was introduced with Mortgagee Letter 2017-12 for case numbers assigned from October 2, 2017, and it has not been replaced since. We load that file whole and read it the way HUD’s calculator does.' },
    { q: 'Why is my factor the same at two different rates?', a: `Because the table repeats some values. In its lowest columns, a factor is often the same in two or three neighboring cells, and no cell of the table goes above ${K.f(K.plf(99, P.plf.rateMin))}, a value the oldest ages reach at most rates. The calculator reads the exact cell HUD publishes, so two rates that share a factor give the same principal limit for the same home.` },
    { q: 'Does the factor table change every year?', a: 'No. The annual change is the lending limit, set each December by a Mortgagee Letter. The factors change only when HUD issues a new table, which last happened in 2017 together with the change of the upfront mortgage insurance premium to 2 %. Your factor still moves with the market, because the expected rate it is read at follows the 10-year Treasury rate.' },
    { q: 'Which age counts when a couple applies?', a: `The age of the youngest borrower, or of an eligible non-borrowing spouse if that spouse is younger. HUD rounds it to the nearest birthday. On a ${K.usd(350000)} home at ${K.pp(rT)}, a couple aged 68 and 58 gets ${K.usd(nbs.pl)} of principal limit instead of ${K.usd(both68.pl)}, because the 58 row of the table applies.` },
  ],
  body: (h) => `
<h2>The rows of the table at the rates of 2026</h2>
<p>The grid below is HUD's table for ages 62 to 99, at expected rates from ${K.pp(5, 0)} to ${K.pp(9.5, 1)} by half a point. The expected rate of an adjustable HECM is the 10-year Treasury rate plus the lender's margin; with the 10-year average at ${K.pp(P.rates.cmt10Week, 2)} in the week ending ${K.day(P.rates.cmt10WeekEnding)}, most offers land between the ${K.pp(6, 0)} and ${K.pp(8, 0)} columns. Multiply the factor by the lesser of your home value and ${K.usd(P.limits.mca2026)} to get the principal limit.</p>
${h.table(['Age', ...cols.map((c) => K.pp(c, 1))], ages.map((a) => [String(a), ...cols.map((c) => K.f(K.plf(a, c)))]), `HUD principal limit factors by age (rows) and expected rate (columns), table in force for case numbers assigned since ${K.day(P.plf.effective)}. Ages under 62 apply only to an eligible non-borrowing spouse.`, ['l', ...cols.map(() => 'r' as const)])}
<p>The full table has ${K.num(nAges * nRates)} cells: ${nAges} ages and ${nRates} expected rates. It is available as a <a href="/hecm-principal-limit-factors.csv">CSV file built from HUD's workbook</a>, and HUD's own copy is the ${h.src('hud_plf', 'spreadsheet on hud.gov')}.</p>

<h2>How HUD reads a cell</h2>
<p>Two roundings come before the lookup, both written in the help pages of HUD's calculator (${h.src('hud_calc_help', 'HUD calculator help')}). The expected rate is rounded to the nearest eighth of a point, so ${K.pp(K.EXP)} is read in the ${K.pp(rT)} column and ${K.pp(6.69, 2)} in the ${K.pp(K.rateT(6.69))} column. The age is rounded to the nearest birthday: someone who is 67 years and seven months old is read on the 68 row. Rates below ${K.pp(P.plf.rateMin, 0)} use the ${K.pp(P.plf.rateMin, 0)} column, a floor that matters only when Treasury rates are very low.</p>
<p>The age is that of the youngest person the loan protects. Every borrower must be at least ${P.eligibility.borrowerMinAge}, but a younger spouse who is not on the loan can be named an eligible non-borrowing spouse and keep living in the home after the borrower dies. The table then uses that spouse's age, which is why it starts at ${P.plf.ageMin} even though no borrower can be that young.</p>
${h.mini('plf', { t: 'Read your cell of the table', p: ['age'], d: { age: 68, value: 350000 } })}

<h2>Why the factor falls when rates rise</h2>
<p>HUD sizes the factor so that, on average, the loan balance does not overtake the home's value before the loan ends. The balance grows each month at the note rate plus ${K.pct(P.mip.annual, 1)} of mortgage insurance; the expected rate is HUD's long-run guess of that note rate. A higher expected rate means faster growth, so HUD lends a smaller share upfront. At 68, going from ${K.pp(rT - 1)} to ${K.pp(rT + 1)} takes the factor from ${K.f(f68dn)} to ${K.f(f68up)}: on a ${K.usd(350000)} home, that is ${K.usd(350000 * (f68dn - f68up))} of principal limit.</p>
<p>Age works the other way. An older borrower has fewer expected years for the balance to grow, so the factor rises: at ${K.pp(rT)}, from ${K.f(f62)} at 62 to ${K.f(f90)} at 90. Near the top of the table the factor stops rising: no cell goes above ${K.f(K.plf(99, P.plf.rateMin))}${flat ? `, and at the lowest rates some rows from age ${flat} show the same factor in neighboring columns` : ''}.</p>

<h2>From the factor to cash in hand</h2>
<p>The factor gives the principal limit, line 1 of the HUD payment plan. It is not what you receive. The upfront mortgage insurance premium takes ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, the origination fee up to ${K.usd(P.origination.cap)}, then come third-party closing costs and any mortgage the loan pays off. In the first 12 months you can use ${K.pct(P.firstYear.base, 0)} of the principal limit, or those obligations plus ${K.pct(P.firstYear.extra, 0)} when they are larger. For the 68-year-old with a ${K.usd(350000)} home and no mortgage, that leaves ${K.usd(both68.firstYearCash)} in the first year and ${K.usd(both68.laterCash)} after it. The ${h.a('first-year-limit', 'first-year limit page')} walks through those lines, and the ${h.a('hecm-calculator', 'full HECM calculator')} prints them all.</p>
${h.mini('hecm', { t: 'Turn the factor into cash', p: ['age', 'value'], d: { age: 68, value: 350000 } })}

<h2>The 2017 table and the one before it</h2>
<p>HUD introduced this table with ${h.src('ml_2017_12', 'Mortgagee Letter 2017-12')}, for case numbers assigned from ${K.day(P.plf.effective)}. The same letter set the upfront premium at ${K.pct(P.mip.upfront, 0)} of the maximum claim amount for every loan and the annual premium at ${K.pct(P.mip.annual, 1)}. The letter applies to case numbers assigned from that date, so loans opened before it keep the factors and premiums of their time. When HUD replaces the table, a new Mortgagee Letter will say so, and this page and the calculators will be rebuilt from the new file.</p>
<p>What does change every year is the limit. The maximum claim amount cannot exceed ${K.usd(P.limits.mca2026)} for case numbers assigned in 2026, set by ${h.src('ml_2025_22', 'Mortgagee Letter 2025-22')}. The 2027 limit is not published yet; HUD usually announces it in ${P.limits.next.expected}. The ${h.a('hecm-limit', 'lending limit page')} has the details.</p>`,
  tool: 'plf',
  related: ['hecm-calculator', 'reverse-mortgage-rates', 'first-year-limit', 'hecm-limit', 'reverse-mortgage-age-requirement'],
  sources: ['hud_plf', 'hud_lenders', 'ml_2017_12', 'hud_calc_help', 'ml_2025_22'],
});
