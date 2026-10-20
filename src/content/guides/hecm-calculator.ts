import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: age 76, a $520,000 home, $90,000 of mortgage, required fully funded LESA, $7,200 of taxes and insurance a year.
const IN = { age: 76, value: 520000, liens: 90000, lesa: 'full' as const, charges: 7200 };
const o = K.loan(IN);
const noLesa = K.loan({ age: 76, value: 520000, liens: 90000 });
const line4 = o.origination + o.closing;
const line13 = o.mo; // no cash from the borrower or the lender in this case
const line23 = 0 + line13 + 0; // lines 2 and 22 left at zero: everything stays in the credit line
const line24 = o.idl - line23;
const line25 = o.pl - o.sfsa - o.lesaAfter - line23;
const usd = K.usd;

export default defineGuide({
  id: 'hecm-calculator',
  group: 'basics',
  order: 50,
  slug: 'hecm-calculator',
  nav: 'HECM calculator, line by line',
  card: 'Lines 1 to 25 of the HUD payment plan for your own numbers',
  title: 'HECM Calculator 2026: Each Line of the HUD Payment Plan, US',
  description: `HECM calculator for 2026 following HUD's payment plan, lines 1 to 25: principal limit, ${K.pct(P.mip.upfront, 0)} premium, payoff, LESA and first-year limit, shown on a ${usd(IN.value)} home.`,
  h1: 'HECM calculator: the HUD payment plan, line by line',
  intro: `Enter your age, home value and mortgage, and read each line of the form HUD requires at closing, with the rule that produces it.`,
  resume: `The HUD payment plan for an adjustable HECM (Exhibit 1) turns a principal limit into the cash you can use, in 25 numbered lines before the payment choices. For a 76-year-old with a ${usd(IN.value)} home, ${usd(IN.liens)} still owed and a required set-aside for ${usd(IN.charges)} a year of taxes and insurance, line 1 is ${usd(o.pl)}: the home value times HUD's factor of ${K.f(o.factor)} at ${K.pp(K.EXP)}. Lines 3 to 10 add the upfront premium of ${usd(o.imip)}, the ${usd(line4)} origination fee, the ${usd(IN.liens)} payoff and the first year of the set-aside, ${usd(o.lesaYear1)}, for mandatory obligations of ${usd(o.mo)}. Those pass half of line 1, so the first-year limit on line 21 is the obligations plus ${K.pct(P.firstYear.extra, 0)}, ${usd(o.idl)}, leaving ${usd(line24)} to draw in year one. The rest of the set-aside, ${usd(o.lesaAfter)}, is held back, and line 25, the net principal limit, ends at ${usd(line25)}. Without the set-aside it would be ${usd(noLesa.npl)}.`,
  faqs: [
    { q: 'Does a lender use the same calculation as this page?', a: 'Lenders and HUD counselors must print the principal limit and the comparison of payment plans from FHA’s HECM calculator software, or from software that produces the same information. This page applies the same published rules: HUD’s factor table, the premium, the fee cap, the set-aside formula and the lines of Exhibit 1. It is an estimate; the lender’s figures use your appraisal, its margin and your actual costs.' },
    { q: 'Why can I use only 10 % of the principal limit in the first year?', a: `Because your mandatory obligations take more than half of it. When the premium, fees, payoff and first-year set-aside stay under ${K.pct(P.firstYear.base - P.firstYear.extra, 0)} of line 1, the first-year limit is ${K.pct(P.firstYear.base, 0)}. Once they pass that, the limit becomes the obligations plus ${K.pct(P.firstYear.extra, 0)} of line 1, so the extra cash in year one is exactly that ${K.pct(P.firstYear.extra, 0)}. The rest opens after month 12.` },
    { q: 'What is the net principal limit on line 25?', a: 'It is what remains of the principal limit after everything the loan has to cover: the obligations financed at closing, any servicing fee set-aside, the part of the tax and insurance set-aside kept for later years, and any cash taken at closing. On an adjustable HECM it is the total you can still draw, as a credit line or monthly payments, and it grows each month while unused.' },
    { q: 'What goes into other closing costs?', a: 'Third-party charges the lender may pass on at cost: recording fees and taxes, the credit report, a survey when required, the title examination and title insurance, the appraisal and the flood certification. HUD allows reasonable and customary amounts, no more than the lender actually paid. Your lender’s cost estimate lists them; enter their total in the calculator and lines 4, 10 and 25 change.' },
  ],
  body: (h) => `
<h2>The case on this page</h2>
<p>The calculator opens on a borrower aged 76 with a home appraised at ${usd(IN.value)} and a mortgage of ${usd(IN.liens)} to pay off. The lender's financial assessment found that a fully funded life expectancy set-aside (LESA) is needed for ${usd(IN.charges)} a year of property taxes and homeowners insurance. The loan is adjustable, at an expected rate of ${K.pp(K.EXP)} (the 10-year Treasury rate plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), with the origination fee at the legal maximum and no other closing costs entered. Change any field above and every line below follows.</p>
${h.table(['Line', 'Item on the HUD form', 'Amount', 'How it is computed'], [
  ['1', 'Principal limit', usd(o.pl), `${usd(o.mca)} × factor ${K.f(o.factor)} (age ${o.ageT}, ${K.pp(o.rateT)})`],
  ['1a', '10 % of the principal limit', usd(0.1 * o.pl), 'Used on line 18'],
  ['1b', '50 % of the principal limit', usd(0.5 * o.pl), 'Threshold for line 2'],
  ['1c', '60 % of the principal limit', usd(P.firstYear.base * o.pl), 'Used on line 17'],
  ['2', 'Additional 10 % usage', usd(0), 'Left at zero: drawn later through line 24'],
  ['3', 'Initial mortgage insurance premium', usd(o.imip), `${K.pct(P.mip.upfront, 0)} of the maximum claim amount`],
  ['4', 'Other closing costs', usd(line4), 'Origination fee at the cap, no third-party costs entered'],
  ['5', 'Discharge of liens', usd(o.liens), 'Mortgage paid off at closing'],
  ['6 to 8', 'Sales price, repairs, first-year charges', usd(0), 'Not a purchase; no repairs; LESA chosen instead'],
  ['9', 'First-year LESA disbursements', usd(o.lesaYear1), 'One year of taxes and insurance'],
  ['10', 'Mandatory obligations', usd(o.mo), 'Lines 3 to 9'],
  ['11, 12', 'Cash from borrower, from lender', usd(0), 'Nothing brought to closing'],
  ['13', 'Obligations financed by the HECM', usd(line13), 'Line 10 minus lines 11 and 12'],
  ['14', 'Servicing fee set-aside', usd(o.sfsa), 'No monthly servicing fee'],
  ['15', 'LESA amount', usd(o.lesa), 'HUD formula over the life expectancy'],
  ['16', 'LESA left after the first year', usd(o.lesaAfter), 'Line 15 minus line 9'],
  ['17', '60 % of the principal limit', usd(o.l17), 'Line 1c'],
  ['18', 'Obligations plus 10 %', usd(o.l18), 'Line 10 plus line 1a'],
  ['19', 'Greater of 17 and 18', usd(o.l19), o.l18 > o.l17 ? 'Line 18 wins' : 'Line 17 wins'],
  ['20', 'Principal limit less set-asides', usd(o.l20), 'Line 1 minus lines 14 and 16'],
  ['21', 'Initial disbursement limit', usd(o.idl), 'Lesser of 19 and 20'],
  ['22', 'Initial advance at closing', usd(0), 'Credit line chosen, nothing drawn'],
  ['23', 'Total deductions', usd(line23), 'Lines 2, 13 and 22'],
  ['24', 'Net initial disbursement limit', usd(line24), 'Line 21 minus line 23: usable in year one'],
  ['25', 'Net principal limit', usd(line25), 'Line 1 minus lines 14, 16 and 23'],
], `HUD Exhibit 1, adjustable rate payment plan (form effective for case numbers assigned from April 29, 2024), filled for age 76, ${usd(IN.value)} home, ${usd(IN.liens)} payoff, ${usd(IN.charges)} a year of charges.`, ['l', 'l', 'r', 'l'])}

<h2>Lines 1 to 10: from the factor to the obligations</h2>
<p>Line 1 is the only line that comes from HUD's factor table. The maximum claim amount is the lesser of the appraised value and the ${usd(P.limits.mca2026)} limit for 2026, here the full ${usd(o.mca)}, and the factor depends on the youngest borrower's age and the rounded expected rate. Lines 1a to 1c simply cut it into slices used further down.</p>
<p>Lines 3 to 9 are the mandatory obligations, the costs that must be paid at closing or during the first year for the loan to exist. The upfront premium is always ${K.pct(P.mip.upfront, 0)} of the maximum claim amount. The origination fee is capped by federal rule at ${usd(P.origination.cap)}; on a home of this value the cap is reached. Line 5 carries the mortgage payoff, because the HECM must sit first on the title. Line 9 is the part of the set-aside spent on taxes and insurance in the first 12 months, which counts as an obligation even though it is paid out month by month.</p>

<h2>Lines 11 to 16: who pays, and what is held back</h2>
<p>Line 11 is cash you bring to closing; it becomes mandatory only when the obligations exceed what the loan can pay. Line 13 is what the HECM finances, here all ${usd(line13)}. Lines 14 to 16 are amounts kept aside from the principal limit for later. The set-aside of line 15 is computed with HUD's formula: 1.2 times the monthly charges, over the borrower's life expectancy (${K.talc(IN.age)} years at ${IN.age} in the Regulation Z table), discounted at the expected rate plus ${K.pct(P.mip.annual, 1)}. It comes to ${usd(o.lesa)}, of which ${usd(o.lesaAfter)} stays reserved after the first year. The ${h.a('lesa', 'set-aside calculator')} shows the formula with other charges.</p>
${h.mini('hecm', { t: 'Your taxes and insurance', p: ['tax'], d: { age: 76, value: 520000, liens: 90000, lesa: 'full', tax: 4800 } })}

<h2>Lines 17 to 21: the first-year limit</h2>
<p>HUD limits what can go out in the first 12 months. Line 17 is ${K.pct(P.firstYear.base, 0)} of the principal limit; line 18 is the obligations plus ${K.pct(P.firstYear.extra, 0)}. The greater of the two applies, unless line 20, the principal limit minus the set-asides, is smaller. In this case the obligations reach ${K.pct(o.mo / o.pl, 0)} of line 1, so line 18 is the larger and the borrower gets the obligations plus one tenth of the principal limit. The ${h.a('first-year-limit', 'first-year limit page')} shows where the switch happens.</p>
${h.mini('firstyear', { t: 'A larger or smaller payoff', p: ['liens'], d: { age: 76, value: 520000, liens: 120000 } })}

<h2>Lines 22 to 25: what is left for you</h2>
<p>Line 22 records any cash paid to you at closing; leaving it at zero keeps everything in the credit line. Line 24 is what you can still draw before the first anniversary, ${usd(line24)}. Line 25, the net principal limit, is the total left after the first year, at closing values: ${usd(line25)}. On an adjustable loan it grows each month at the note rate plus ${K.pct(P.mip.annual, 1)}, as does the reserved set-aside. Lines 26 to 33 of the form then split that amount between a credit line and monthly payments and, where taxes are withheld from monthly payments, show the net payment.</p>

<h2>What the numbers leave out</h2>
<p>The calculator knows only what you enter. Third-party closing costs belong in the field for other closing costs, and the margin should be the one in your offer. Your appraisal may differ from your estimate of the value, and the set-aside uses the tax and insurance bills the lender sees. The table under the calculator projects the balance at a constant note rate, which an adjustable loan will not keep.</p>`,
  tool: 'hecm',
  toolArg: { age: 76, value: 520000, liens: 90000, lesa: 'full', tax: 7200 },
  related: ['first-year-limit', 'lesa', 'reverse-mortgage-costs', 'principal-limit-factor', 'existing-mortgage', 'origination-fee'],
  sources: ['hud_payplan', 'hud_plf', 'handbook', 'cfr_206_31', 'regz_appl', 'hud_calc_help'],
});
