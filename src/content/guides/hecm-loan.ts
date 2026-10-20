import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: a 67-year-old, a $450,000 home with no mortgage, adjustable against fixed.
const V = 450000;
const arm = K.loan({ age: 67, value: V });
const fix = K.loan({ age: 67, value: V, fixed: true });
const mipYear1 = K.balance(arm.financed, K.NOTE, 12).mip;

export default defineGuide({
  id: 'hecm-loan',
  group: 'basics',
  order: 30,
  slug: 'hecm-loan',
  nav: 'What a HECM loan is',
  card: 'The FHA reverse mortgage program: insurance, eligible homes and the six payment plans',
  title: 'HECM Loan 2026: The FHA Reverse Mortgage Program, US',
  description: `HECM loan rules in 2026: the FHA-insured reverse mortgage of 24 CFR 206, its ${K.pct(P.mip.upfront, 0)} insurance premium, eligible homes, six payment plans and non-recourse terms.`,
  h1: 'The HECM loan: what the FHA program is',
  intro: `What sets a Home Equity Conversion Mortgage apart from any other loan against a home, from the federal insurance behind it to the ways it can pay out.`,
  resume: `A HECM, or Home Equity Conversion Mortgage, is the reverse mortgage insured by the Federal Housing Administration (FHA) under section 255 of the National Housing Act, with its rules in part 206 of title 24 of the Code of Federal Regulations. A private lender makes the loan; the FHA insures it in exchange for a premium of ${K.pct(P.mip.upfront, 0)} of the maximum claim amount at closing and ${K.pct(P.mip.annual, 1)} a year on the balance. That insurance is what makes the loan non-recourse: the borrower never owes more than the home is worth, and HUD steps in if a lender stops paying. The home must be a principal residence of one to four units, a condo in an approved project or a qualifying manufactured home. For a 67-year-old with a ${K.usd(V)} home and no mortgage, the HUD factor of ${K.f(arm.factor)} gives ${K.usd(arm.pl)}; an adjustable HECM releases ${K.usd(arm.firstYearCash)} in year one and ${K.usd(arm.laterCash)} later, while a fixed-rate one pays a single ${K.usd(fix.firstYearCash)} at closing.`,
  faqs: [
    { q: 'What does HECM stand for?', a: 'Home Equity Conversion Mortgage, the name Congress gave the program in section 255 of the National Housing Act. It converts part of the equity in a home into cash without a monthly loan payment. People often say “reverse mortgage” for any loan of this kind, but only a HECM is insured by the FHA and follows HUD’s factor table, premiums and fee cap.' },
    { q: 'What happens if my HECM lender goes out of business?', a: 'The loan is insured, and the regulation covers this case. If HUD finds that a lender is unable or unwilling to make the payments the loan promises, HUD pays them to the borrower, late charges included. HUD can then make the lender repay it or assign the loan to HUD, which takes over the lender’s duties toward you.' },
    { q: 'Can I get a HECM on a condo or a manufactured home?', a: 'Yes, under conditions. A condo must be in an FHA-approved project, be a site condominium or pass HUD’s single-unit approval. A manufactured home must be built after June 15, 1976 with HUD’s certification label, sit on a permanent foundation and chassis, cover at least 400 square feet and be classified as real estate. Co-op units are excluded.' },
    { q: 'Is a HECM better than a proprietary reverse mortgage?', a: `They answer different cases, and only the HECM has public rules to compare against. A HECM is capped at the ${K.usd(P.limits.mca2026)} limit of 2026 and carries FHA premiums; a private reverse mortgage sets its own limits, costs and age rules outside the FHA program. This site computes only the HECM, line by line, from HUD's documents.` },
  ],
  body: (h) => `
<h2>Who stands behind a HECM</h2>
<p>Three parties are involved. A private, FHA-approved lender takes the application, closes the loan and services it. The FHA, part of the Department of Housing and Urban Development (HUD), endorses the loan for insurance once the file is complete, counseling certificate included. You pay for that insurance through the mortgage insurance premium (MIP): ${K.pct(P.mip.upfront, 0)} of the maximum claim amount at closing, then ${K.pct(P.mip.annual, 1)} a year on the balance, both added to what you owe. On the ${K.usd(V)} home of our example, the upfront premium is ${K.usd(arm.imip)}, and the annual premium on the ${K.usd(arm.financed)} borrowed at closing comes to about ${K.usd(mipYear1)} in the first year.</p>
<p>The insurance protects two sides. It pays the lender when the home sells for less than the balance. And it protects you if the lender fails: the regulation says HUD itself makes the payments owed to the borrower when a lender cannot or will not. The ${h.a('reverse-mortgage-mip', 'mortgage insurance page')} converts both premiums into dollars for other cases.</p>

<h2>Non-recourse, written into every loan</h2>
<p>The HECM mortgage must state that the borrower has no personal liability for the balance. The lender can recover the debt only from the sale of the home and cannot seek a deficiency judgment after a foreclosure. Heirs who want to keep the home can pay off the loan for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value. That rule is what the premium buys, and it is why the FHA keeps the share you may borrow well below the home value.</p>

<h2>The homes the FHA insures</h2>
<p>The home must be your principal residence, and you may have only one. HUD accepts single-family properties of one to four units when you live in one of them: detached and semi-detached houses, townhouses and row houses, condominium units and site condominiums, and manufactured homes. A one-unit house with an accessory dwelling unit still counts as one unit. A building partly used for business can qualify if at least 51 % of its floor area is residential.</p>
<p>The FHA does not insure HECMs on cooperative units, vacation homes, boarding houses, bed and breakfasts or hotels. A condo unit needs an FHA-approved project, a site condominium or a single-unit approval. A manufactured home must carry HUD's certification label showing it was built on or after June 15, 1976, rest on a permanent chassis and foundation, and be classified as real estate. Any property assessed clean energy (PACE) lien must be paid off at or before closing, which the HECM itself can do.</p>

<h2>Six ways to receive the money</h2>
<p>HUD's handbook lists six payment plans. One belongs to the fixed-rate HECM; the other five to the adjustable one, and on an adjustable loan you can move from one to another later while money remains. The lender cannot require you to draw more than you want.</p>
${h.table(['Payment plan', 'Rate type', 'How it pays'], [
  ['Single lump sum', 'Fixed', 'One payment at closing, nothing after'],
  ['Tenure', 'Adjustable', 'Equal monthly payments as long as the loan is not due'],
  ['Term', 'Adjustable', 'Equal monthly payments for a number of months you choose'],
  ['Line of credit', 'Adjustable', 'Draws when you want, in the amounts you want'],
  ['Modified tenure', 'Adjustable', 'Part held as a credit line, the rest paid monthly for life'],
  ['Modified term', 'Adjustable', 'Part held as a credit line, the rest paid monthly for a term'],
], 'Payment plan options of a HECM (Handbook 4000.1, 24 CFR 206.19).', ['l', 'l', 'l'])}
<p>The choice changes how much you can ever use. For our 67-year-old, both loans start from the same ${K.usd(arm.pl)} principal limit and the same ${K.usd(arm.mo)} of fees and premium. The adjustable HECM opens ${K.usd(arm.firstYearCash)} in the first year and ${K.usd(arm.laterCash)} after it, and that later room grows while unused. The fixed-rate HECM pays ${K.usd(fix.firstYearCash)} at closing, the most the first-year rule allows, and the remaining ${K.usd(fix.forfeited)} can never be drawn. The pages on the ${h.a('line-of-credit', 'credit line')}, ${h.a('monthly-payments', 'monthly payments')} and ${h.a('lump-sum', 'lump sum')} go through each plan.</p>
${h.mini('hecm', { t: 'Fixed or adjustable on the same home', p: ['rt'], d: { age: 67, value: 450000, rt: 'fixed' } })}

<h2>Fixed or adjustable rate</h2>
<p>A fixed rate never changes, and it is also the expected rate used to read HUD's table. An adjustable rate follows an index, such as the 1-year Treasury rate or SOFR, plus the lender's margin. A loan that adjusts once a year can move by no more than 2 points at a time and 5 points over its life; one that adjusts monthly has a lifetime cap 10 points above the starting rate. The amount itself is read at a different rate, based on the 10-year Treasury, as the ${h.a('reverse-mortgage-rates', 'rates page')} explains.</p>

<h2>What it takes to qualify</h2>
<p>Every borrower must be at least ${P.eligibility.borrowerMinAge} at closing and attend counseling with a HUD-approved counselor. Any existing mortgage is paid off from the HECM at closing. The lender also runs a financial assessment of your credit and income and checks that you have paid property taxes and insurance on time; where it has doubts, it holds part of the loan back to pay them. The amount is capped by the ${K.usd(P.limits.mca2026)} limit for 2026, and the origination fee by ${K.usd(P.origination.cap)}. The ${h.a('how-reverse-mortgage-works', 'step-by-step page')} follows a loan from application to payoff.</p>`,
  tool: 'hecm',
  toolArg: { age: 67, value: 450000 },
  related: ['how-reverse-mortgage-works', 'reverse-mortgage-mip', 'line-of-credit', 'lump-sum', 'reverse-mortgage-rates', 'hecm-limit'],
  sources: ['cfr_206', 'handbook', 'ml_2017_12', 'ml_2025_22', 'cfr_206_31'],
});
