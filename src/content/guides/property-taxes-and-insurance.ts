import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lesa;
// Worked case of the page: youngest borrower 81, $240,000 home, $4,200 a year of taxes and insurance,
// and a monthly residual income shortfall of $250 for the partial set-aside.
const AGE = 81, VAL = 240000, TAX = 4200, MRIS = 250;
const none = K.loan({ age: AGE, value: VAL });
const full = K.loan({ age: AGE, value: VAL, lesa: 'full', charges: TAX });
const part = K.loan({ age: AGE, value: VAL, lesa: 'partial', charges: TAX, mris: MRIS });
// Residual income standard by family size and region, HUD Handbook 4000.1, Table of Residual Incomes by Region.
const RESIDUAL: Array<[string, number, number, number, number]> = [
  ['1', 540, 529, 529, 589],
  ['2', 906, 886, 886, 998],
  ['3', 946, 927, 927, 1031],
  ['4 or more', 1066, 1041, 1041, 1160],
];

export default defineGuide({
  id: 'property-taxes-and-insurance',
  group: 'situation',
  order: 70,
  slug: 'reverse-mortgage-property-taxes-insurance',
  nav: 'Property taxes and insurance',
  card: 'The bills a HECM leaves to you, the financial assessment, and what happens if one goes unpaid',
  title: 'Reverse Mortgage Property Taxes and Insurance in 2026, US',
  description: `Reverse mortgage property taxes and insurance in 2026: what stays yours, how the financial assessment sets a set-aside (${K.usd(full.lesa)} at ${AGE}), and the default rules.`,
  h1: 'Property taxes and insurance with a reverse mortgage',
  intro: `A HECM removes the mortgage payment, not the bills that come with owning a home. Here is what you still pay, how the lender checks it before closing, and the steps set by federal rules when a bill is missed.`,
  resume: `With a HECM you no longer make a mortgage payment, but property taxes, special assessments, hazard insurance, flood insurance where required, ground rent, and condominium, PUD or homeowners' association fees all stay your obligation under 24 CFR 206.205, and you must keep the home in good repair. Before closing, the lender's financial assessment reviews 24 months of property charge payments, 12 months of insurance and your residual income. If the history falls short with no documented explanation, a fully funded life expectancy set-aside pays taxes and insurance from the loan: at ${AGE}, with ${K.usd(TAX)} a year of charges on a ${K.usd(VAL)} home, ${K.usd(full.lesa)} of a ${K.usd(full.pl)} principal limit. A residual income gap of ${K.usd(MRIS)} a month calls instead for a partial set-aside of ${K.usd(part.lesa)}. Failing to pay these charges is one of the events that can make the loan due and payable, after the lender has used any set-aside and available credit to cover them.`,
  faqs: [
    { q: 'Do I still need homeowners insurance with a reverse mortgage?', a: `Yes. 24 CFR 206.27 requires the borrower to insure all improvements against hazards, including fire and flood, that the lender requires, for the amount and period needed to protect the loan, and at a minimum against flood to the extent HUD requires. If coverage lapsed during the 12 months before closing, the Handbook requires a new policy prepaid for 12 months at or before closing.` },
    { q: 'Are HOA and condominium fees paid from a set-aside?', a: `No. A life expectancy set-aside covers property taxes, including special assessments, hazard insurance and flood insurance. Ground rents, condominium fees, planned unit development fees and homeowners' association fees are listed separately in 24 CFR 206.205 as charges the borrower pays directly by their due date. With a fully funded set-aside, the Handbook says the borrower remains responsible for every other property charge.` },
    { q: 'Does one late tax payment years ago rule out a HECM?', a: `Not by itself. The review covers the 24 months before the application, and the lender must first ask whether late payments came from disregard, an inability to manage debt, or extenuating circumstances such as a spouse's death, job loss or a medical emergency. Late fees caused only by a prior servicer's escrow error do not count. Without a documented explanation, the Handbook's minimum response is a required fully funded set-aside; the underwriter still judges whether the loan is sustainable.` },
    { q: 'Who is told when a set-aside runs out?', a: `The lender must analyze the set-aside each year and, if the funds are exhausted or insufficient, notify the borrower in writing within 15 calendar days of that analysis that the bills are now theirs. When a payment is outstanding and the set-aside cannot cover it, the lender notifies both the borrower and FHA within 30 days and recommends speaking with a HUD-approved housing counselor.` },
  ],
  body: (h) => `
<h2>The charges a HECM leaves with you</h2>
<p>The regulation splits property charges in two groups. The first, ground rents, condominium fees, planned unit development fees and homeowners' association fees, the borrower pays directly, on or before the due date, in every case. The second, property taxes including special assessments, hazard insurance premiums and flood insurance premiums where required, is also the borrower's obligation, but it can be paid in one of three ways: by the borrower, through a life expectancy set-aside, or, on an adjustable loan, by the lender out of monthly payments or the line of credit.</p>
<p>The mortgage documents add more duties. You must insure the home against the hazards the lender requires, keep it in good repair, and not allow other liens on it unless they rank behind the HECM. HUD's Inspector General summed up the bargain in its 2026 audit: borrowers may stay in their homes indefinitely as long as property taxes and homeowner's insurance are kept current.</p>

<h2>The financial assessment before closing</h2>
<p>Since 2015 every HECM goes through a financial assessment, which the Handbook defines as the underwriter's evaluation of the borrower's willingness and capacity to meet financial obligations on time and of whether the HECM is a sustainable solution. Three tests feed it.</p>
<p>Credit history: all housing and installment payments made on time for the previous 12 months, no more than two 30-day late payments in the previous 24, and no major derogatory event on revolving accounts in the last 12. Property charge history: at application, all property taxes and association fees current, and no delinquency in the previous 24 months; insurance in force continuously for the previous 12. Residual income: what is left each month after expenses, which must at least equal the amount HUD sets for the household size and region.</p>
${h.table(['Household size', 'Northeast', 'Midwest', 'South', 'West'], RESIDUAL.map(([n, ...r]) => [n, ...r.map((x) => K.usd(x))]), 'Monthly residual income standard by household size and region, HUD Handbook 4000.1 (HECM financial assessment). The Handbook assigns each state to one of the four regions.', ['l', 'r', 'r', 'r', 'r'])}
<p>Every member of the household counts toward its size, including a non-borrowing spouse, unless the conditions for excluding them are met. A shortfall can be offset by compensating factors such as a 24-month record of paying your own property charges without penalty, or assets equal to the projected charges over your life expectancy.</p>

<h2>Three outcomes, priced on one home</h2>
<p>The assessment ends in one of three results. If credit and property charge histories pass and residual income meets the standard, no set-aside is required, and you choose how to pay. If a history fails and no extenuating circumstance is documented, the lender must at least require a fully funded set-aside and pays the taxes and insurance itself. If the histories pass but residual income falls short and no compensating factor applies, the minimum is a partially funded set-aside, paid to you twice a year to top up your own payments.</p>
${h.table(['Outcome', 'Set-aside', 'Cash in year one', 'Credit after year one'], [
    ['No set-aside, you pay', K.usd(0), K.usd(none.firstYearCash), K.usd(none.laterCash)],
    [`Partial (shortfall ${K.usd(MRIS)} a month)`, K.usd(part.lesa), K.usd(part.firstYearCash), K.usd(part.laterCash)],
    [`Full (${K.usd(TAX)} a year of charges)`, K.usd(full.lesa), K.usd(full.firstYearCash), K.usd(full.laterCash)],
  ], `Youngest borrower ${AGE}, home ${K.usd(VAL)}, principal limit ${K.usd(none.pl)}, expected rate ${K.pp(K.EXP)}, adjustable rate, no mortgage to pay off.`, ['l', 'r', 'r', 'r'])}
<p>The set-aside does not add to the balance until money is paid out of it, but it is no longer available to draw. The ${h.a('lesa', 'set-aside page')} details HUD's formula and the life table it uses; a partial amount above ${K.pct(L.partialShareCap, 0)} of the full one turns into a full set-aside.</p>
${h.mini('lesa', { t: 'Set-aside for your tax and insurance bill', p: ['tax'], d: { age: AGE, tax: 3600, value: VAL } })}

<h2>Paying the bills yourself or through the loan</h2>
<p>When no set-aside is required, you elect a method at closing. On an adjustable HECM you can pay the bills yourself, choose a fully funded set-aside, or have the lender pay taxes and insurance by withholding from monthly payments or charging the line of credit. On a fixed-rate HECM only the first two are available. An election to have the lender pay cannot be cancelled, and if the loan's funds run short, the bills fall back on you even so. Payments the lender makes join the balance when they are made and accrue interest from then on.</p>

<h2>When a tax or insurance bill goes unpaid</h2>
<p>Section 206.205(c)(4) sets the sequence. With a partial set-aside that still holds money, the lender stops the semiannual payments to you and pays the overdue charge from the set-aside. With a set-aside that is empty on an adjustable loan, partial or full, the lender pays the charge in full from any principal limit still available and charges it to your account. In each case it must write to you within 30 days of learning of the unpaid bill, and you have 30 days to explain what happened.</p>
<p>When no principal limit is left, or on a fixed-rate loan whose set-aside is exhausted, and the borrower still does not pay, the mortgage can become due and payable. Under 24 CFR 206.27, failing to pay property charges as section 206.205 requires is one of the events that make the full balance due, upon HUD's approval. The loan remains non-recourse: the debt is collected only from the home, never from your other assets. The ${h.a('heirs', 'heirs page')} explains how a due loan is settled, and a HUD-approved ${h.a('hecm-counseling', 'housing counselor')} is the contact the regulation itself points to.</p>
${h.mini('hecm', { t: 'Set-aside or not, in the full calculator', p: ['lesa'], d: { age: AGE, value: VAL, tax: TAX } })}`,
  tool: 'lesa',
  toolArg: { age: AGE, tax: TAX, value: VAL, lesa: 'partial', mris: MRIS },
  related: ['lesa', 'hecm-counseling', 'heirs', 'non-borrowing-spouse', 'how-reverse-mortgage-works'],
  sources: ['cfr_206', 'handbook', 'oig_lesa', 'hud_payplan', 'hud_counselors'],
});
