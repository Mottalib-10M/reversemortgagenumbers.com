/** Home page text. Every figure comes from the kit (src/lib/kit.ts). */
import type { FAQ, Helpers } from '../lib/page-types';
import { KIT as K } from '../lib/kit';

const P = K.P, R = P.rates;
// Worked case of the home page: age 70, $400,000 home, adjustable rate at the default expected rate, no mortgage left.
const ex = K.loan();
const exLien = K.loan({ liens: 80000 });
const ex80 = K.loan({ age: 80 });
const rT = K.rateT(K.EXP);
const ages = [62, 65, 70, 75, 80, 85, 90];
const rateCols = [rT - 1, rT - 0.5, rT, rT + 0.5, rT + 1];
const year10 = K.project({}, 10)[9];

export const HOME = {
  title: 'Reverse Mortgage Calculator 2026: HECM Amount and Costs, US',
  description: 'Reverse mortgage calculator for 2026: your HECM amount from the HUD factor table, with the MIP, origination cap, first-year limit and set-aside line by line.',
  h1: 'How much can a reverse mortgage give you?',
  intro: `The amount of an FHA-insured reverse mortgage (HECM) read in HUD's own factor table, then every line of the HUD payment plan: mortgage insurance, origination fee, mortgage payoff, set-aside, first-year limit, and the balance year by year. No name, phone or address asked.`,
  trust: `HUD factor table in force · 2026 limit ${K.usd(P.limits.mca2026)} · Treasury rates of the week ending ${K.day(R.cmt10WeekEnding)}`,
  strip: [
    { k: '2026 FHA lending limit', v: K.usd(P.limits.mca2026), d: `Home values above it count for this amount. 2027 limit due in ${P.limits.next.expected}.`, id: 'hecm-limit', l: 'The limit' },
    { k: 'Mortgage insurance', v: `${K.pct(P.mip.upfront, 0)} + ${K.pct(P.mip.annual, 1)}`, d: 'Upfront on the claim amount, then yearly on the balance.', id: 'reverse-mortgage-mip', l: 'MIP in dollars' },
    { k: '10-year Treasury, weekly', v: K.pp(R.cmt10Week, 2), d: `Plus the lender's margin = expected rate. Example: ${K.pp(K.EXP)}.`, id: 'reverse-mortgage-rates', l: 'Rates' },
    { k: 'Origination fee cap', v: K.usd(P.origination.cap), d: `Reached from a ${K.usd(400000)} home; at least ${K.usd(P.origination.floor)} allowed.`, id: 'origination-fee', l: 'Fee rule' },
  ],
  resume: `A HECM reverse mortgage lends against your home with no monthly payment: the amount is the lesser of the home value and the ${K.usd(P.limits.mca2026)} limit of 2026, multiplied by a factor that HUD publishes for each age and expected rate. At 70, with an expected rate of ${K.pp(K.EXP)} (10-year Treasury at ${K.pp(R.cmt10Week, 2)} plus an example margin of ${K.pp(R.exampleMargin, 1)}), the factor is ${K.f(ex.factor)}, so a ${K.usd(400000)} home gives a principal limit of ${K.usd(ex.pl)}. From that, ${K.usd(ex.imip)} of upfront mortgage insurance and up to ${K.usd(ex.origination)} of origination fee are taken, and you can use ${K.usd(ex.firstYearCash)} in the first 12 months, 60 % of the principal limit minus those costs. The other ${K.usd(ex.laterCash)} opens after a year and grows while unused: about ${K.usd(year10.credit)} of unused credit after 10 years at today's rates. With ${K.usd(80000)} of mortgage to pay off, the costs pass half the principal limit and the first-year room falls to ${K.usd(exLien.firstYearCash)}, 10 % of it. At 80, the same home gives ${K.usd(ex80.pl)}.`,
  tableTitle: `HUD's principal limit factors around today's rates`,
  tableIntro: `The factor is the share of the home value (up to the ${K.usd(P.limits.mca2026)} limit) that you can borrow. It rises with age and falls as the expected rate rises. These are rows of the HUD table in force since ${K.day(P.plf.effective)}; the full table, all ages from ${P.plf.ageMin} to ${P.plf.ageMax} and every rate from ${K.pp(P.plf.rateMin, 0)} to ${K.pp(P.plf.rateMax)}, is on the factor table page.`,
  tableHead: ['Age', ...rateCols.map((r) => K.pp(r))],
  tableRows: ages.map((a) => [String(a), ...rateCols.map((r) => K.f(K.plf(a, r)))]),
  tableCaption: `Expected rate = 10-year Treasury + lender margin, rounded to the nearest 1/8 percent. Source: HUD principal limit factor table, read ${K.day(P.retrieved_at)}.`,
  why: (h: Helpers) => `
<h2>Why most calculators give you one number and no costs</h2>
<p>A reverse mortgage calculator on a lender's site is first a way to collect a phone number. Several ask for your name, address and phone before showing a figure; others show one amount and say in small print that costs are not included. HUD's own calculator is public, but it still carries the label of fiscal year 2018 and asks for the fields a loan officer fills in. ${h.src('hud_calc', 'See the HUD calculator')}.</p>
<p>The rules behind the amount are public and short. The lender takes the lesser of the appraised value and the national limit, the maximum claim amount. It multiplies it by the factor of the youngest borrower's age and the expected rate in HUD's table. From that principal limit come the ${K.pct(P.mip.upfront, 0)} upfront mortgage insurance, the origination fee, other closing costs and any mortgage to pay off. Then the first-year rule caps what you can take in the first 12 months. Every step is a line of the HUD payment plan form, and the calculator above prints those lines with their numbers.</p>
<p>What the amount does after closing matters as much. The balance grows each month by the note rate plus ${K.pct(P.mip.annual, 1)} of annual mortgage insurance; so does the unused part of a line of credit, which is why a credit line left untouched for years can end up larger than the first-year amount. The table under the calculator shows both, year by year.</p>
${h.mini('hecm', { t: 'Try another age', p: ['age'], c: 'Open the full calculator' })}
<p>Two cases are outside the arithmetic. If a mortgage balance is larger than what the HECM can pay, the difference is due in cash at closing, which the calculator shows. And if property taxes or insurance are a concern in the lender's financial assessment, part of the principal limit is set aside to pay them, which ${h.a('lesa', 'the set-aside calculator')} computes with HUD's formula.</p>`,
  sections: (h: Helpers) => [
    { title: 'Who can get a HECM', html: `<p>Every borrower must be at least ${P.eligibility.borrowerMinAge}, own the home or have a small mortgage the loan can pay off, live in it as a principal residence and complete counseling with a HUD-approved counselor before applying. A spouse under ${P.eligibility.borrowerMinAge} can be named as an eligible non-borrowing spouse; the factor then uses that spouse's age, which lowers the amount. ${h.a('reverse-mortgage-age-requirement', 'Age rules')} and ${h.a('hecm-counseling', 'counseling')} each have a page.</p>` },
    { title: 'What you keep paying', html: `<p>No monthly mortgage payment is due, but property taxes, homeowners insurance, flood insurance where required, HOA dues and upkeep stay yours. Missing them is the main way a HECM becomes due early. ${h.a('property-taxes-and-insurance', 'Taxes and insurance')} explains the set-aside and the rules a lender applies.</p>` },
    { title: 'When the loan ends', html: `<p>The loan becomes due when the last borrower dies, sells or moves out for more than 12 months in a row. It is non-recourse: heirs who keep the home can settle it for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value, and nobody owes more than the home is worth. ${h.a('heirs', 'What heirs owe')} shows the numbers.</p>` },
  ],
  faqs: [
    { q: 'How much money can I get from a reverse mortgage?', a: `Multiply the lesser of your home value and the 2026 limit of ${K.usd(P.limits.mca2026)} by HUD’s factor for your age and expected rate, then subtract the upfront mortgage insurance, fees and any mortgage paid off. In the first 12 months you can use up to ${K.pct(P.firstYear.base, 0)} of that principal limit, or the costs plus ${K.pct(P.firstYear.extra, 0)} when costs are higher. The calculator shows each line.` },
    { q: 'What is the minimum age for a reverse mortgage?', a: `For an FHA-insured HECM, every borrower must be ${P.eligibility.borrowerMinAge} or older on the application. A younger spouse can stay in the home as an eligible non-borrowing spouse, but the amount then follows the younger age, which gives a lower factor. Proprietary reverse mortgages from private lenders set their own minimum age.` },
    { q: 'Why does the amount fall when rates rise?', a: 'HUD’s factor assumes the balance grows at the expected rate plus mortgage insurance until the loan ends. A higher rate makes the balance catch up with the home value sooner, so HUD lends a smaller share upfront. At 70, each step of one point in the expected rate lowers the factor by several hundredths, which on a $400,000 home is tens of thousands of dollars.' },
    { q: 'Do I have to pay off my mortgage first?', a: 'No. The HECM pays it off at closing, and that payoff counts as a mandatory obligation in the first year. If the payoff and costs are larger than what the principal limit allows, you bring the difference in cash. Once the old mortgage is gone, there is no monthly mortgage payment while you live in the home.' },
    { q: 'Is the money from a reverse mortgage taxable?', a: 'No. The IRS treats reverse mortgage payments as loan advances, not income, so they are not taxed, according to Publication 936. The interest is not deductible while it accrues; it can be deductible only when paid, usually when the loan is repaid. For SSI and Medicaid, loan proceeds are not income, but cash kept past the month of receipt can count as a resource.' },
    { q: 'Why do you ask for no name or phone number?', a: 'Because the amount does not depend on who you are, only on your age, your home value, the rate and the costs. The site lends nothing and has no lender to pass your details to. Everything is computed in your browser, and nothing you type is sent anywhere. A lender will need your details only when you apply.' },
  ] as FAQ[],
  sources: ['hud_plf', 'ml_2025_22', 'handbook', 'cfr_206', 'cfr_206_31', 'hud_payplan', 'regz_appl', 'treasury_yield', 'irs_936'],
};
