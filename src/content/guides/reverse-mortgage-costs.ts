import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: youngest borrower 74, $280,000 home, $30,000 mortgage to pay off,
// $3,500 of third-party charges taken as an example amount (not an average: none is published).
const AGE = 74, VAL = 280000, LIEN = 30000, CC = 3500;
const o = K.loan({ age: AGE, value: VAL, liens: LIEN, closing: CC });
const upfront = o.imip + o.origination + o.closing;
const fee30 = K.sfsa(P.servicing.maxMonthlyFixedOrAnnual, AGE, K.NOTE);
const fee35 = K.sfsa(P.servicing.maxMonthlyMonthlyAdjusting, AGE, K.NOTE);
const withFee = K.loan({ age: AGE, value: VAL, liens: LIEN, closing: CC, fee: P.servicing.maxMonthlyFixedOrAnnual });
const y1 = K.balance(o.financed, K.NOTE, 12), y10 = K.balance(o.financed, K.NOTE, 120);
const growth = K.NOTE + P.mip.annual * 100;
const O = P.origination;

export default defineGuide({
  id: 'reverse-mortgage-costs',
  group: 'money',
  order: 20,
  slug: 'reverse-mortgage-costs',
  nav: 'Reverse mortgage costs',
  card: 'Every fee of a HECM in dollars, at closing and while the loan runs',
  title: 'Reverse Mortgage Costs 2026: Every HECM Fee in Dollars, US',
  description: `Reverse mortgage costs in 2026, line by line: ${K.pct(P.mip.upfront, 0)} upfront MIP, origination fee capped at ${K.usd(O.cap)}, third-party charges, servicing fee and monthly interest.`,
  h1: 'What a reverse mortgage costs, line by line',
  intro: `Each charge a HECM can carry, priced in dollars on one home: what is paid at closing, what is held back, and what keeps adding to the balance afterward.`,
  resume: `On a ${K.usd(VAL)} home with a youngest borrower aged ${AGE}, the charges taken at closing come to ${K.usd(upfront)}: ${K.usd(o.imip)} of upfront mortgage insurance (${K.pct(P.mip.upfront, 0)} of the maximum claim amount), an origination fee of up to ${K.usd(o.origination)}, and ${K.usd(CC)} of third-party charges used here as an example, since no reliable average is published. That is ${K.pct(upfront / o.pl, 1)} of the ${K.usd(o.pl)} principal limit. None of it has to come out of pocket: it is financed, together with the ${K.usd(LIEN)} mortgage the loan pays off. After closing, two charges never stop. The balance grows each month by the note rate (${K.pp(K.NOTE)} at today's example) plus ${K.pct(P.mip.annual, 1)} of annual mortgage insurance, so the ${K.usd(o.financed)} financed at closing reaches ${K.usd(y10.balance)} after 10 years with no cash drawn. A monthly servicing fee is allowed up to ${K.usd(P.servicing.maxMonthlyFixedOrAnnual)} or ${K.usd(P.servicing.maxMonthlyMonthlyAdjusting)}, and when charged it is set aside from the principal limit.`,
  faqs: [
    { q: 'Can I pay the upfront costs of a HECM in cash instead of borrowing them?', a: `Yes. HUD's Handbook says the upfront mortgage insurance premium must be either financed or paid in cash, and any part not paid in cash is financed. The payment plan has a line for cash from the borrower and another for money the lender contributes. Paying ${K.usd(upfront)} in cash on the example home would leave that amount out of the balance, so it would not accrue interest or annual insurance.` },
    { q: 'Does the lender keep the upfront mortgage insurance premium?', a: `No. Under 24 CFR 206.105 the lender pays the initial premium to HUD, and the Handbook gives it 15 days from closing to remit it. The borrower finances it or pays it, but the money goes to the FHA insurance fund. The lender's own pay is the origination fee, capped at ${K.usd(O.cap)}, and the margin built into the interest rate.` },
    { q: 'Which fees can be added to a reverse mortgage after closing?', a: `Only those listed in 24 CFR 206.207, such as a charge for replacing a hazard insurance policy mid-term, or attorney and trustee costs actually incurred when a foreclosure is stopped by reinstatement. They are added to the balance. The rule excludes charges for the lender's own servicing work, tax service fees and payoff or release fees, apart from a trustee fee where the deed of trust provides for it.` },
    { q: 'Why does this page give no average for appraisal and title costs?', a: `Because we found no official figure for them and a guess would mislead. The regulation lists the third-party items a lender may pass on (appraisal, title examination, title insurance, recording, credit report, survey, flood certification) and caps each at the amount actually paid. Your own figures come from the written cost estimate the lender gives you; type them into the calculator above.` },
  ],
  body: (h) => `
<h2>The bill on a ${K.usd(VAL)} home at ${AGE}</h2>
<p>The table below takes one household and prices each line. The youngest borrower is ${AGE}, the home appraises at ${K.usd(VAL)}, an old mortgage of ${K.usd(LIEN)} is still open, and the expected rate is ${K.pp(K.EXP)} (the 10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}). HUD's factor for that age and rate is ${K.f(o.factor)}, so the principal limit is ${K.usd(o.pl)}. Every cost below is subtracted from it.</p>
${h.table(['Line', 'Amount', 'Rule'], [
    ['Upfront mortgage insurance', K.usd(o.imip), `${K.pct(P.mip.upfront, 0)} of the ${K.usd(o.mca)} maximum claim amount`],
    ['Origination fee (maximum)', K.usd(o.origination), '24 CFR 206.31(a)(1)'],
    ['Third-party charges (example)', K.usd(CC), 'Not more than the amount actually paid'],
    ['Costs at closing', `<strong>${K.usd(upfront)}</strong>`, `${K.pct(upfront / o.pl, 1)} of the principal limit`],
    ['Mortgage paid off (not a cost)', K.usd(LIEN), 'Line 5 of the HUD payment plan'],
    ['Financed at closing', K.usd(o.financed), 'Starts the loan balance'],
  ], `Costs of a HECM at closing, youngest borrower ${AGE}, home ${K.usd(VAL)}, expected rate ${K.pp(K.EXP)}. The ${K.usd(CC)} of third-party charges is an example, not an observed average.`, ['l', 'r', 'l'])}
<p>The old mortgage is not a cost of the reverse mortgage, but it sits in the same block of the HUD form, among the mandatory obligations, and it weighs on the first-year rule in the same way. Here the obligations total ${K.usd(o.mo)}, under half of the principal limit, so the borrower can still draw ${K.usd(o.firstYearCash)} in the first 12 months and ${K.usd(o.laterCash)} more after that.</p>

<h2>Mortgage insurance, the largest charge on this home</h2>
<p>The upfront premium is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, the lesser of the appraised value and the ${K.usd(P.limits.mca2026)} limit of 2026. It does not depend on how much you borrow: a borrower who takes nothing at closing pays the same ${K.usd(o.imip)} as one who draws the maximum. The Handbook allows the lender to pay part or all of it; a credit of that kind appears on the payment plan as cash from the lender, line 12, and lowers what is financed. The ${h.a('reverse-mortgage-mip', 'mortgage insurance page')} prices both premiums and explains what the insurance buys.</p>

<h2>The origination fee and its ceiling</h2>
<p>The lender's fee is capped by regulation, not by custom. The ceiling is the greater of ${K.usd(O.floor)} and ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} of the maximum claim amount plus ${K.pct(O.tier2Rate, 0)} of the rest, never more than ${K.usd(O.cap)}. On ${K.usd(VAL)} that gives ${K.usd(O.tier1Rate * O.tier1Limit)} plus ${K.usd(O.tier2Rate * (VAL - O.tier1Limit))}, or ${K.usd(o.origination)}. The text of 24 CFR 206.31 adds that a lender may accept a lower fee. It is a ceiling, so it can be negotiated, and on this home every dollar removed from it is a dollar more available in the first year. The ${h.a('origination-fee', 'origination fee page')} has the cap for each home value.</p>
${h.mini('hecm', { t: 'Change the third-party charges', p: ['cc'], d: { age: AGE, value: VAL, liens: LIEN, cc: CC } })}

<h2>Third-party charges: a closed list, priced at cost</h2>
<p>Section 206.31(a)(2) names what else the lender may collect at closing, in reasonable and customary amounts and never more than it actually paid: recording fees and recording taxes, the credit report, a survey if one is required, title examination, the lender's title insurance, the appraiser's fee for the first appraisal, flood certification, and other items HUD authorizes by notice. If the home needs repairs after closing, a repair administration fee of up to ${K.pct(0.015, 1)} of the repair money or ${K.usd(50)}, whichever is greater, can be added to the balance.</p>
<p>We do not print an average for this group, because we found no official series to quote and an invented figure would be worse than none. The ${K.usd(CC)} in the example is a round number chosen to show the arithmetic; replace it with the amounts on the lender's written estimate. The cap at cost matters more than any average: a lender cannot bill you more for the appraisal, the title search or the recording than it paid for them.</p>

<h2>Servicing fee: often zero, capped when charged</h2>
<p>Some lenders build the cost of servicing into the note rate and charge no monthly fee. Those that charge one are limited by the Handbook to ${K.usd(P.servicing.maxMonthlyFixedOrAnnual)} a month on a fixed or annually adjusting HECM and ${K.usd(P.servicing.maxMonthlyMonthlyAdjusting)} on a monthly adjusting one. The fee is not paid from your pocket: the lender sets aside, at closing, enough of the principal limit to pay it each month until age 100, discounted at the note rate plus the annual premium. At ${AGE}, a ${K.usd(P.servicing.maxMonthlyFixedOrAnnual)} fee freezes ${K.usd(fee30)} of the principal limit, and a ${K.usd(P.servicing.maxMonthlyMonthlyAdjusting)} fee ${K.usd(fee35)}. On the example home, the ${K.usd(P.servicing.maxMonthlyFixedOrAnnual)} fee lowers the credit available after the first year from ${K.usd(o.laterCash)} to ${K.usd(withFee.laterCash)}. That is a reason to ask early whether the offer has a monthly fee or not.</p>

<h2>The costs that keep running after closing</h2>
<p>A HECM has no monthly payment, which means its two running costs are paid by the balance itself. Interest accrues at the note rate, and the annual premium at ${K.pct(P.mip.annual, 1)} of the outstanding balance, both from the closing date. With an initial note rate of ${K.pp(K.NOTE)}, the balance grows by about ${K.pp(growth, 2)} a year, compounded monthly. The ${K.usd(o.financed)} financed at closing on the example home becomes ${K.usd(y1.balance)} after one year and ${K.usd(y10.balance)} after ten, of which ${K.usd(y10.interest)} is interest and ${K.usd(y10.mip)} is insurance. Each later draw adds its own share. The rate of an adjustable loan follows the 1-year Treasury, so these figures move with it.</p>
${h.mini('balance', { t: 'Grow the amount financed at closing', p: ['yrs'], d: { amt: Math.round(o.financed), yrs: 10 } })}
<p>So the offer with the lowest closing costs is not always the cheapest over time. A smaller origination fee paired with a higher margin can cost more on a long loan, because the margin is charged on the whole balance every month, and a higher margin also lowers the principal limit through the expected rate. The ${h.a('loan-balance', 'loan balance page')} follows a balance over 30 years, and the ${h.a('hecm-calculator', 'full calculator')} shows every line of the payment plan with your own numbers.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, value: VAL, liens: LIEN, cc: CC },
  related: ['reverse-mortgage-mip', 'origination-fee', 'loan-balance', 'first-year-limit', 'hecm-calculator'],
  sources: ['cfr_206_31', 'handbook', 'cfr_206', 'ml_2017_12', 'hud_payplan'],
});
