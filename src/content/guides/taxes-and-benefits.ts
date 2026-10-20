import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: $60,000 drawn from a HECM and left to accrue at today's example note rate.
const AMT = 60000;
const y1 = K.balance(AMT, K.NOTE, 12), y5 = K.balance(AMT, K.NOTE, 60), y12 = K.balance(AMT, K.NOTE, 144);
// A borrower aged 76 with a $310,000 home, drawing monthly tenure payments.
const ten = K.loan({ age: 76, value: 310000 });

export default defineGuide({
  id: 'taxes-and-benefits',
  group: 'situation',
  order: 80,
  slug: 'reverse-mortgage-taxes-and-benefits',
  nav: 'Taxes, SSI and reverse mortgages',
  card: 'What the IRS and the SSI rules say about HECM advances and interest',
  title: 'Reverse Mortgage Taxes and Benefits 2026: IRS and SSI, US',
  description: `Reverse mortgage taxes and benefits 2026: HECM advances are not income for the IRS; accrued interest, ${K.usd(y1.interest)} a year on ${K.usd(AMT)}, is generally not deductible.`,
  h1: 'Reverse mortgages, income tax and SSI',
  intro: `What two federal texts say about the money a HECM pays you: IRS Publication 936 for income tax, and the Social Security rule on cash loans for SSI.`,
  resume: `For the IRS, a reverse mortgage pays loan advances, not income, so what you receive is not taxable, whether it comes as a lump sum, monthly payments or line of credit draws (Publication 936). The other side is that the interest accruing on a reverse mortgage is generally treated as interest on home equity debt and is not deductible. On ${K.usd(AMT)} drawn at a note rate of ${K.pp(K.NOTE)}, ${K.usd(y1.interest)} of interest and ${K.usd(y1.mip)} of annual mortgage insurance join the balance in the first year, and no payment is made. For Supplemental Security Income, Social Security's rule on cash loans (POMS SI 01120.220) says the cash from a bona fide loan is not income, but whatever you still hold in the month after you receive it counts as a resource. A HECM draw spent in the month it arrives leaves no trace in that count; one parked in a savings account does. Neither text deals with Medicaid or with state rules, and this page does not either.`,
  faqs: [
    { q: 'Can I deduct the interest that builds up on my HECM each year?', a: `Generally not. Publication 936 says that interest accrued on a reverse mortgage, including original issue discount, is considered interest on home equity debt and is not deductible. Its reminders add that interest on a home-secured loan is no longer deductible to the extent the proceeds were not used to buy, build or substantially improve the home. The publication's reverse mortgage paragraph says nothing more about the year a loan is repaid.` },
    { q: 'Does a draw from a HECM line of credit count against SSI?', a: `Not as income. Under POMS SI 01120.220, the cash a lender advances under a bona fide loan is not income to the borrower. It becomes a countable resource if the borrower still holds it in the month after the month of receipt. So the timing of draws matters for an SSI recipient: drawing what you will spend that month keeps it out of the resource count.` },
    { q: 'Does the Social Security loan rule name reverse mortgages?', a: `No. SI 01120.220 covers cash loans in general and defines a loan as money advanced by one party to another who promises to repay it, with or without interest. For formal loans made by a lender, it tells staff to assume the loan is bona fide and adds that retained proceeds can count as resources either way. Applying it to HECM advances is our reading of that general rule.` },
    { q: 'Is the HECM mortgage insurance premium deductible?', a: `The 2025 edition of Publication 936, used for 2025 returns, states that the itemized deduction for mortgage insurance premiums has expired and can no longer be claimed. It is the latest edition among our sources, so for later tax years check the edition that applies. On a HECM, most of the premium is not paid each year in any case: it is added to the balance like the interest.` },
  ],
  body: (h) => `
<h2>Advances are loans, not income</h2>
<p>Publication 936 has a short paragraph on reverse mortgages. It describes one as a loan where the lender pays you, in a lump sum, a monthly advance, a line of credit or a combination, while you continue to live in the home and keep title to it. The loan becomes due, with interest, when you move, sell the home, reach the end of a pre-selected loan period, or die. Then comes the rule: because reverse mortgages are considered loan advances and not income, the amount you receive is not taxable. The ${h.src('irs_936', 'IRS publication')} applies this to every way a HECM can pay.</p>
<p>That holds for the largest amounts too. A ${K.usd(ten.firstYearCash)} first-year draw for a 76-year-old with a ${K.usd(310000)} home is not income on a federal return, and neither are tenure payments of ${K.usd(ten.tenure)} a month for the same household. What you spend the money on does not change the answer.</p>

<p>The IRS description is written for reverse mortgages in general, including plans that end after a pre-selected loan period. A HECM is not one of them: HUD's Handbook says it has no fixed maturity date, and it becomes due under the events of its own mortgage, such as the death of the last borrower, a sale, or the home ceasing to be the principal residence. That difference does not change the tax answer, since each advance is still a loan.</p>

<h2>Interest you cannot deduct as it accrues</h2>
<p>The same paragraph closes the other door: interest accrued on a reverse mortgage, including original issue discount, is considered interest on home equity debt and generally is not deductible. The reminders at the top of the publication add that interest on a loan secured by your home is not deductible to the extent the proceeds were not used to buy, build or substantially improve that home. On a HECM, nothing is paid each month anyway. The interest and the annual mortgage insurance are added to the balance and compound there.</p>
${h.table(['After', 'Balance', 'Interest added', 'Mortgage insurance added'], [[1, y1], [5, y5], [12, y12]].map(([y, b]) => { const q = b as typeof y1; return [`${y} year${y === 1 ? '' : 's'}`, K.usd(q.balance), K.usd(q.interest), K.usd(q.mip)]; }), `${K.usd(AMT)} drawn at closing, note rate ${K.pp(K.NOTE)} held constant, annual premium ${K.pct(P.mip.annual, 1)} of the balance, no payment.`, ['l', 'r', 'r', 'r'])}
<p>After 12 years, ${K.usd(y12.interest)} of interest has accrued on the ${K.usd(AMT)} without a single deduction along the way. The publication's reverse mortgage paragraph does not discuss the year the balance is finally repaid, by you, a sale or your heirs, and we leave that question to the IRS texts that cover it rather than guess.</p>
${h.mini('balance', { t: 'Interest added on another draw', p: ['amt'], d: { amt: 25000, yrs: 5 } })}

<h2>SSI: the cash loan rule</h2>
<p>Eligibility for Supplemental Security Income depends on what the claimant counts as income and as resources. Social Security's operating manual handles loans in POMS SI 01120.220, citing 20 CFR 416.1103(f). For the borrower under a bona fide loan, the loan agreement itself is not a resource, and the cash provided by the lender is not income; it becomes the borrower's resource if retained in the month following the month of receipt. Proceeds still held are counted from the first moment of that following month.</p>
<p>The manual does not name reverse mortgages; it covers cash loans in general. It defines a loan as money advanced to or on behalf of someone who promises to repay it in full, with or without interest, under an agreement enforceable under state law. For formal loans made by a lender, staff are told to assume the loan is bona fide, and the manual adds that retained proceeds are potentially countable resources whether or not it is. A HECM, with its note, its mortgage and its repayment when the loan ends, fits that description. Treating its advances this way is our application of the general rule, ${h.src('ssa_poms', 'which the manual sets out in full')}.</p>
${h.mini('balance', { t: 'A larger balance over the years', p: ['yrs'], d: { amt: 140000, yrs: 8 } })}

<h2>What timing changes for an SSI recipient</h2>
<p>Because the test is what you still hold in the next month, the shape of the draws matters more than their size. Suppose a borrower draws ${K.usd(3000)} in March and spends it on a roof repair in March. Nothing remains in April, so nothing is counted. If the same ${K.usd(3000)} sits in a savings account on the first of April, it is counted as a resource from that moment, alongside the borrower's other resources. A HECM line of credit lets you draw what a month requires, and the manual already says the loan agreement itself is not a resource; the undrawn part of the line is not cash you hold. Monthly tenure or term payments arrive on a schedule, so what is not spent in the month of receipt is what the rule looks at.</p>
<p>This page stops where its two sources stop. Neither text says anything about Social Security retirement or disability benefits, Medicaid, or state programs, and we do not extend them. The ${h.a('line-of-credit', 'line of credit page')} shows how undrawn credit grows, and the ${h.a('monthly-payments', 'monthly payments page')} sizes tenure and term payments.</p>`,
  tool: 'balance',
  toolArg: { amt: AMT, yrs: 12 },
  related: ['line-of-credit', 'monthly-payments', 'loan-balance', 'heirs', 'how-reverse-mortgage-works'],
  sources: ['irs_936', 'ssa_poms', 'handbook'],
});
