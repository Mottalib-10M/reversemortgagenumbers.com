import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Official text on home equity lines, read on eCFR on October 20, 2026: Regulation Z, 12 CFR 1026.40.
const REGZ = 'https://www.ecfr.gov/current/title-12/section-1026.40';
// HECM side of the page: youngest borrower 64, a $520,000 home, adjustable HECM, nothing drawn.
const AGE = 64, VALUE = 520000;
const o = K.loan({ age: AGE, value: VALUE });
const rows = K.project({ age: AGE, value: VALUE }, 15);
const grow = K.NOTE + P.mip.annual * 100;
const LINE = 90000;

export default defineGuide({
  id: 'reverse-mortgage-vs-heloc',
  group: 'basics',
  order: 60,
  slug: 'reverse-mortgage-vs-heloc',
  nav: 'Reverse mortgage vs HELOC',
  card: 'Payments, line growth, freezes and non-recourse: how the two credit lines are built',
  title: 'Reverse Mortgage vs HELOC 2026: How They Differ, US',
  description: `Reverse mortgage vs HELOC in 2026: no monthly payment and a line growing at the note rate + ${K.pct(P.mip.annual, 1)} on a HECM, against draw and repayment periods on a HELOC.`,
  h1: 'Reverse mortgage or home equity line: how they are built',
  intro: `A HECM line of credit and a home equity line of credit both let you borrow against the house when you choose, but the rules behind them differ on payments, growth, freezes and what you can lose.`,
  resume: `The two loans differ first in payments: a HECM requires no monthly payment while you live in the home, and repayment of the whole balance is deferred until the loan becomes due, whereas a home equity line of credit (HELOC) has payment terms, a draw period and any repayment period that its lender must disclose under federal Regulation Z. The HECM line also grows: its unused part rises at the note rate plus ${K.pct(P.mip.annual, 1)} of mortgage insurance, ${K.pp(grow, 2)} a year at today's example rate, so ${K.usd(LINE)} left untouched becomes ${K.usd(K.credit(LINE, K.NOTE, 120))} in 10 years. A HELOC lender may freeze or cut the line when the home's value falls significantly. A HECM is non-recourse, needs a borrower of ${P.eligibility.borrowerMinAge} or older and counseling first. This page compares structure only; it gives no HELOC rates, which depend on each lender's offer.`,
  faqs: [
    { q: 'Can a HELOC lender freeze my line of credit?', a: `Yes, in cases listed by Regulation Z: a lender may stop further draws or lower the limit while the home's value is significantly below its appraised value for the plan, while it reasonably believes a material change in your finances prevents repayment, during a default on a material obligation, and in a few other situations. The rules of a HECM line contain no such home-value trigger.` },
    { q: 'Which one requires monthly payments, a HECM or a HELOC?', a: `A HELOC has payment terms that its lender must disclose before you open it: how the minimum payment is set, when payments are due, the length of the draw period and of any repayment period, and a warning if minimum payments may leave a balloon payment. A HECM requires no payment while the loan is not due; interest and premium are added to the balance instead.` },
    { q: 'Can I have a HELOC and a HECM on the same home?', a: `The HECM has to be the first lien. Other liens are allowed only if they are subordinate to it, so an existing HELOC is either paid off at closing from the HECM or kept only with its lender's agreement to stand second. A HELOC that is less than 12 months old and fails HUD's seasoning test can be paid off with your own money, HECM money or both, within the ${K.pct(P.firstYear.base, 0)} first-year limit.` },
  ],
  body: (h) => `
<h2>Monthly payments: required on one, not on the other</h2>
<p>On a HECM, "repayment of the outstanding loan balance is deferred until the mortgage becomes due and payable", under every payment plan (24 CFR 206.19(g); ${h.src('cfr_206', '24 CFR part 206')}). The interest and the ${K.pct(P.mip.annual, 1)} annual mortgage insurance premium (MIP) are added to the balance each month. You may repay all or part at any time without penalty (206.209), but nothing is ever demanded while you live in the home and keep up taxes, insurance and repairs.</p>
<p>A HELOC works the other way. Regulation Z, the federal rule on home equity plans, makes the lender disclose "the length of the draw period and any repayment period" and "an explanation of how the minimum periodic payment will be determined and the timing of the payments" (${h.ext(REGZ, '12 CFR 1026.40(d)(5)')}). When paying only the minimum may not repay the balance, the lender must say so and warn "that a balloon payment may result". The amounts depend on each contract; the structure is a loan you pay on.</p>
${h.table(['Point', 'HECM (adjustable, line of credit)', 'HELOC'], [
    ['Monthly payment', 'None required while the loan is not due (24 CFR 206.19(g))', 'Set by the contract; disclosed with draw and repayment periods (12 CFR 1026.40(d)(5))'],
    ['Unused line', `Grows at the note rate + ${K.pct(P.mip.annual, 1)} MIP each month (24 CFR 206.25(g))`, 'Credit limit set by the contract; may be frozen or reduced in listed cases (1026.40(f)(3)(vi))'],
    ['Rate', 'Index + margin; annual loans move at most 2 points a year and 5 over the life of the loan (206.21)', 'May change only with a public index outside the lender\'s control (1026.40(f)(1))'],
    ['Loan called due', 'Death of the last borrower, sale, leaving the home, unpaid property charges or another default (206.27(c))', 'Fraud, failure to meet the repayment terms, or harm to the lender\'s security (1026.40(f)(2))'],
    ['Personal liability', 'None: the debt is collected only from the home (206.27(b)(8))', 'Not addressed by 12 CFR 1026.40: see the contract'],
    ['Who can apply', `Youngest borrower ${P.eligibility.borrowerMinAge} or older (206.33); counseling by an independent HECM counselor (206.41)`, 'No age condition in 12 CFR 1026.40'],
  ], 'Structure of the two products under the federal rules cited. No rate or fee of a HELOC is shown: those are set by each lender.', ['l', 'l', 'l'])}

<h2>A line that grows, and a line that can shrink</h2>
<p>The unused part of a HECM line is the principal limit minus the balance and set-asides, and the principal limit grows every month by one twelfth of the note rate plus the annual MIP rate (24 CFR 206.3). It is not recalculated on the home's later value; the one decrease the regulation names comes from insurance or condemnation money applied to the balance. At ${AGE}, with a ${K.usd(VALUE)} home, the line at closing is ${K.usd(o.npl)} after the upfront MIP and the maximum origination fee. Left alone at a note rate of ${K.pp(K.NOTE, 2)} (1-year Treasury at ${K.pp(P.rates.cmt1Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), it would be ${K.usd(rows[4].credit)} after 5 years and ${K.usd(rows[14].credit)} after 15.</p>
${h.mini('loc', { t: 'Grow a HECM line of this size', p: ['amt'], d: { amt: 210000, nr: K.NOTE } })}
<p>A HELOC limit does not grow by rule. Regulation Z lets the lender "prohibit additional extensions of credit or reduce the credit limit" during any period in which the home's value "declines significantly below the dwelling's appraised value for purposes of the plan", in which it reasonably believes a material change in your finances will prevent repayment, or in which you are in default of a material obligation (${h.ext(REGZ, '1026.40(f)(3)(vi)')}). In a falling housing market, the line can therefore shrink just when it would be used.</p>

<h2>What each lender can do when things go wrong</h2>
<p>The grounds for calling the whole loan due are written differently. A HELOC lender may terminate the plan and demand the balance for fraud, for failure to meet the repayment terms, or for an action or inaction that adversely affects its security (1026.40(f)(2)). Regulation Z sets a separate, shorter list for reverse mortgages: default, transfer of title, the home no longer being the primary dwelling, or the consumer's death (1026.40(f)(4)). HUD's rules add, for a HECM, an absence of more than 12 consecutive months for illness and unpaid property charges (24 CFR 206.27(c)).</p>
<p>When a HECM ends, the home is the only source of repayment. The mortgage must say "the borrower shall have no personal liability for payment of the outstanding loan balance" and bars any deficiency judgment (206.27(b)(8)). Heirs can settle the debt for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value. The section of Regulation Z on home equity plans says nothing about personal liability on a HELOC; the answer is in the contract itself.</p>

<h2>Entry conditions and the cost of opening</h2>
<p>A HECM requires the youngest borrower to be ${P.eligibility.borrowerMinAge} or older at closing and the borrower, any non-borrowing spouse and any non-borrowing owner to receive counseling from an independent counselor on FHA's HECM roster (24 CFR 206.33, 206.41). It also carries costs set by federal rule: an upfront MIP of ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, ${K.usd(o.imip)} on this home, and an origination fee capped at ${K.usd(P.origination.cap)}. The ${h.a('reverse-mortgage-costs', 'costs page')} lists them all.</p>
<p>Regulation Z does not fix HELOC fees. It requires the lender to itemize the fees it charges to open, use or maintain the plan, to estimate third-party fees, and it forbids any nonrefundable fee until three business days after you receive the disclosures (1026.40(d)(7), (d)(8) and (h)). Comparing the two products on cost therefore means putting a HELOC disclosure next to a HECM payment plan, line by line.</p>
${h.mini('hecm', { t: 'The HECM side for your home', p: ['age', 'value'], d: { age: AGE, value: VALUE, plan: 'loc' } })}

<h2>Both on one house</h2>
<p>A HECM must be a first lien, and the borrower may not let other liens be recorded unless they are subordinate to it (24 CFR 206.27(b)(3)). A HELOC already on the home is therefore either discharged at closing, on line 5 of HUD's payment plan, or kept only if its lender agrees to stand second; a payoff reduces the cash left from the HECM. If it is less than 12 months old and gave more than ${K.usd(500)} in cash, the seasoning rule of 24 CFR 206.36 applies. The ${h.a('existing-mortgage', 'existing mortgage page')} shows the effect of a payoff on the first-year limit, and the ${h.a('line-of-credit', 'line of credit page')} follows the HECM line over 30 years.</p>`,
  tool: 'loc',
  toolArg: { amt: LINE },
  related: ['line-of-credit', 'how-reverse-mortgage-works', 'existing-mortgage', 'hecm-counseling', 'heirs', 'reverse-mortgage-costs'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'treasury_yield'],
});
