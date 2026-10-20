import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: a 72-year-old, a $320,000 home, $40,000 still owed, adjustable rate, line of credit.
const IN = { age: 72, value: 320000, liens: 40000 };
const c = K.loan(IN);
const rows = K.project(IN, 20);
const yr = (n: number) => rows[n - 1];
const growth = K.pp(K.NOTE + P.mip.annual * 100, 2);
const closingCosts = c.imip + c.origination;

export default defineGuide({
  id: 'how-reverse-mortgage-works',
  group: 'basics',
  order: 10,
  slug: 'how-does-a-reverse-mortgage-work',
  nav: 'How a reverse mortgage works',
  card: 'From counseling to closing, the growing balance and the day the loan is repaid',
  title: 'Reverse Mortgage Explained 2026: How a HECM Works, US',
  description: `How a reverse mortgage works in 2026, step by step: counseling, closing, draws, a balance that grows each month and repayment, with a worked ${K.usd(c.pl)} case.`,
  h1: 'How does a reverse mortgage work?',
  intro: `The life of an FHA-insured reverse mortgage from the first phone call to the final payoff, followed through one homeowner's numbers.`,
  resume: `A reverse mortgage works in three phases: counseling and approval, a closing where the loan pays its own costs and any old mortgage, then years without a monthly payment while the balance grows, until the last borrower dies, sells or moves out. For a 72-year-old with a ${K.usd(IN.value)} home and ${K.usd(IN.liens)} still owed, HUD's factor of ${K.f(c.factor)} at an expected rate of ${K.pp(K.EXP)} gives a principal limit of ${K.usd(c.pl)}. Closing takes ${K.usd(c.imip)} of upfront mortgage insurance, up to ${K.usd(c.origination)} of origination fee and the ${K.usd(IN.liens)} payoff. In the first 12 months the borrower can then draw ${K.usd(c.firstYearCash)}, and ${K.usd(c.laterCash)} more opens after that. Whatever is owed grows at the note rate plus ${K.pct(P.mip.annual, 1)} of mortgage insurance: the ${K.usd(c.financed)} financed at closing reaches about ${K.usd(yr(10).balance)} after 10 years with nothing else drawn. The loan is non-recourse, so neither the borrower nor the heirs owe more than the home brings.`,
  faqs: [
    { q: 'How long does a reverse mortgage last?', a: 'There is no maturity date. A HECM stays in place for as long as at least one borrower lives in the home as a principal residence and keeps paying property taxes and insurance, even if the balance ends up larger than the home value. The lender checks occupancy once a year with a certification you sign. The loan ends when it becomes due, or earlier if you repay it, which you can do at any time without a penalty.' },
    { q: 'Can the lender take the house while I still live there?', a: 'Only if the loan has become due for a reason other than death, such as unpaid property taxes or insurance, a home left in poor repair, or another broken obligation, and the problem is not fixed. Even after a foreclosure starts, HUD rules let a borrower correct the condition and reinstate the loan, though a lender may refuse if it already accepted a reinstatement in the previous two years.' },
    { q: 'What happens if I move into a nursing home?', a: 'If you are away from the home for more than 12 consecutive months because of a physical or mental illness, and no other borrower still lives there, the lender can call the loan due with HUD’s approval. A shorter stay does not end the loan. A spouse who is a co-borrower and keeps living in the home keeps it in good standing, and an eligible non-borrowing spouse can benefit from a deferral.' },
    { q: 'Can I pay down a reverse mortgage before the end?', a: `Yes. Federal rules let you repay in full or in part at any time, without a fee or penalty. A partial payment is applied as the note says. On an adjustable HECM, voluntary payments are a way to slow a balance that grows at ${growth} a year today. On a fixed-rate HECM, the room freed by a partial payment cannot be drawn again, because that loan pays out only once, at closing.` },
  ],
  body: (h) => `
<h2>Before the application: counseling and the menu of options</h2>
<p>The first lender you contact must describe every option the FHA insures, from the fixed-rate loan with a single payout to the adjustable loan with monthly payments or a credit line, and hand you a list of HUD-approved counselors. You, any spouse who will not sign the loan and any other owner on title then sit through a counseling session. The counselor gives you a certificate, and the lender cannot close without a copy of it. The ${h.a('hecm-counseling', 'counseling page')} covers what the session includes and what it may cost.</p>

<h2>Underwriting: the appraisal, your finances and the rate</h2>
<p>An FHA appraiser values the home. The lender takes the lesser of that value and the ${K.usd(P.limits.mca2026)} national limit for 2026; that figure is the maximum claim amount. It also runs a financial assessment: your credit, your record of paying property taxes and insurance, and whether your income covers your bills. If it doubts that you will keep the taxes and insurance current, it can require a set-aside carved out of the loan to pay them, the ${h.a('lesa', 'life expectancy set-aside')}.</p>
<p>The amount is then read in HUD's factor table at the age of the youngest borrower and at the expected rate, the 10-year Treasury rate plus the lender's margin. With your agreement, the lender can lock that expected rate for up to 120 days from the day the FHA case number is assigned, and it may not charge for the lock. A lock protects the amount from a jump in Treasury rates between application and closing.</p>

<h2>Closing day: what the loan pays before you see a dollar</h2>
<p>At closing the HECM pays its own costs and clears any mortgage on the home, because it must be the first lien. For the 72-year-old in our example, those mandatory obligations come to ${K.usd(c.mo)}, which is ${K.pct(c.mo / c.pl, 0)} of the principal limit. HUD then caps what can go out in the first year at ${K.pct(P.firstYear.base, 0)} of the principal limit, here ${K.usd(c.l17)}. Subtract the obligations and ${K.usd(c.firstYearCash)} is left for the borrower in year one.</p>
${h.table(['Step at closing', 'Amount'], [
  ['Maximum claim amount (home value, below the limit)', K.usd(c.mca)],
  [`Principal limit, factor ${K.f(c.factor)}`, K.usd(c.pl)],
  [`Upfront mortgage insurance, ${K.pct(P.mip.upfront, 0)}`, K.usd(c.imip)],
  ['Origination fee at the legal maximum', K.usd(c.origination)],
  ['Old mortgage paid off', K.usd(IN.liens)],
  ['Room left in the first 12 months', K.usd(c.firstYearCash)],
  ['Room that opens after month 12', K.usd(c.laterCash)],
], `Age 72, ${K.usd(IN.value)} home, expected rate ${K.pp(K.EXP)}, no other closing costs entered. Third-party costs such as the appraisal and title would come out of the same room.`, ['l', 'r'])}
<p>The fees alone, ${K.usd(closingCosts)} here, are taken from the loan rather than paid in cash, so they start accruing interest on day one. The ${h.a('reverse-mortgage-costs', 'cost page')} lists the third-party charges that come on top.</p>

<h2>Drawing the money</h2>
<p>An adjustable HECM can pay out as a credit line, as fixed monthly payments for life or for a chosen number of months, or as a mix of a credit line and monthly payments. A fixed-rate HECM pays one lump sum at closing and nothing after. Monthly payments arrive on the first business day of each month; a draw on the credit line must reach you within five business days of your written request. On an adjustable loan you can switch plans later as long as money remains.</p>

<h2>The balance after closing</h2>
<p>No payment is due while the loan is in good standing. Interest is added to the balance every month, and so is the annual mortgage insurance of ${K.pct(P.mip.annual, 1)}. At today's note rate of ${K.pp(K.NOTE)}, the balance and the unused part of the credit line both grow by ${growth} a year. The table follows our borrower who draws nothing beyond the closing costs and the payoff.</p>
${h.table(['Year', 'Age', 'Loan balance', 'Unused credit line'], [1, 5, 10, 15, 20].map((n) => [String(n), String(yr(n).age), K.usd(yr(n).balance), K.usd(yr(n).credit)]), `Starting balance ${K.usd(c.financed)}, note rate ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} MIP held constant. A real adjustable rate moves with the 1-year Treasury rate.`, ['l', 'l', 'r', 'r'])}
<p>The credit line grows at the same pace as the debt, which is why a line left untouched for years can end up larger than at closing. That growth is room to borrow, not money paid to you. The ${h.a('loan-balance', 'loan balance page')} shows what a lump sum turns into over time.</p>
${h.mini('balance', { t: 'What a draw becomes over time', p: ['amt', 'yrs'], d: { amt: 22896, yrs: 12 } })}

<h2>What keeps the loan in good standing</h2>
<p>You keep the title and the duties of an owner. Property taxes, homeowners insurance, flood insurance where the home is in a flood zone, condo or HOA dues and repairs remain yours. The home must stay the principal residence of at least one borrower, and once a year the servicer asks you to certify that it does. You may not enroll in a property tax deferral program or let a new lien take priority over the HECM. Unpaid taxes or insurance can make the loan due while the borrower is still alive and living there.</p>

<h2>When the loan comes due, and who pays what</h2>
<p>The balance becomes due when the last borrower dies and no surviving borrower lives in the home, or when the borrower transfers title. With HUD's approval, the lender can also call it due when no borrower lives there any more, after more than 12 consecutive months away for illness, or when taxes, insurance or another obligation go unmet. A spouse who never signed the loan but was named as an eligible non-borrowing spouse can stay in the home after the borrower dies, though no more money is paid out; the ${h.a('non-borrowing-spouse', 'non-borrowing spouse page')} explains the conditions.</p>
<p>Once the loan is due, the servicer gives the estate or the heirs 30 days to choose: repay the balance, sell the home, hand over a deed in lieu of foreclosure, or fix the problem that made the loan due. Heirs who want to keep the home can settle the loan for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value. No one owes the difference when the debt exceeds the home: the borrower has no personal liability, and the lender can collect only through the sale of the property. Any gap is paid by the FHA insurance that the mortgage insurance premiums fund. The ${h.a('heirs', 'heirs page')} has the numbers.</p>
${h.mini('heirs', { t: 'When the balance passes the value', p: ['bal', 'value'], d: { bal: 290000, value: 270000 } })}`,
  tool: 'hecm',
  toolArg: { age: 72, value: 320000, liens: 40000 },
  related: ['hecm-loan', 'hecm-counseling', 'first-year-limit', 'loan-balance', 'heirs', 'non-borrowing-spouse'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'hud_plf', 'ml_2025_22'],
});
