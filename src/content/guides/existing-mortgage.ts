import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: youngest borrower 68, a $500,000 home, adjustable HECM, maximum origination fee.
const AGE = 68, VALUE = 500000;
const at = (liens: number) => K.loan({ age: AGE, value: VALUE, liens });
const o0 = at(0);
const costs = o0.imip + o0.origination;
const half = (P.firstYear.base - P.firstYear.extra) * o0.pl;
const tip = half - costs; // mortgage above which the obligations pass half of the principal limit
const top = o0.pl - costs; // mortgage above which cash is due at closing
const mid = (1 - P.firstYear.extra) * o0.pl - costs; // mortgage above which obligations + 10 % would pass the principal limit
const debts = [0, 40000, 80000, 100000, 130000, 160000, 190000, 220000];
const L1 = 100000, L2 = 190000;
const a1 = at(L1), a2 = at(L2);
const after = K.balance(a1.financed, K.NOTE, 120);

export default defineGuide({
  id: 'existing-mortgage',
  group: 'situation',
  order: 50,
  slug: 'reverse-mortgage-with-existing-mortgage',
  nav: 'With a mortgage still owed',
  card: 'How the HECM pays off the old loan at closing, and the cash left by size of debt',
  title: 'Reverse Mortgage With Existing Mortgage 2026: Payoff, US',
  description: `Reverse mortgage with an existing mortgage in 2026: the HECM pays it off at closing; past half the principal limit, ${K.pct(P.firstYear.extra, 0)} more is yours. Cash by debt size.`,
  h1: 'A reverse mortgage when you still owe on the house',
  intro: `What happens to a mortgage you still owe when a HECM closes, and how much cash is left for you depending on the size of that debt.`,
  resume: `A HECM pays off the mortgage you still owe on the day it closes: the payoff goes on line 5 of HUD's payment plan, counts as a mandatory obligation and comes out of the principal limit before you receive anything. Once obligations pass half of the principal limit, the first-year limit becomes those obligations plus ${K.pct(P.firstYear.extra, 0)} of it, and if they exceed the whole principal limit, you bring the difference in cash. At ${AGE}, with a ${K.usd(VALUE)} home and an expected rate of ${K.pp(K.EXP)}, the principal limit is ${K.usd(o0.pl)} and the upfront mortgage insurance (MIP) plus the maximum origination fee take ${K.usd(costs)}. With no mortgage, ${K.usd(o0.firstYearCash)} is available in year one. A ${K.usd(L1)} mortgage leaves ${K.usd(a1.firstYearCash)} in year one and ${K.usd(a1.laterCash)} after it. A ${K.usd(L2)} mortgage exceeds what the loan can pay, and ${K.usd(a2.shortfall)} is due at closing. Once the payoff is made, no monthly mortgage payment remains.`,
  faqs: [
    { q: 'Does the mortgage payoff count against the first-year limit?', a: `Yes. The payoff is a mandatory obligation, like the upfront MIP and the closing costs, and all of them sit inside the initial disbursement limit. That limit is ${K.pct(P.firstYear.base, 0)} of the principal limit, or the obligations plus ${K.pct(P.firstYear.extra, 0)} of it when they pass half. A large payoff therefore leaves only that extra ${K.pct(P.firstYear.extra, 0)} as cash in the first year, and the remainder opens after month 12.` },
    { q: 'Can a HECM pay off a home equity line opened last year?', a: `Only within limits. HUD lets HECM proceeds pay off liens older than 12 months, or liens that gave the borrower ${K.usd(500)} or less in cash. A home equity line that fails that seasoning test can still be paid off with your own funds, with HECM funds or both, as long as the initial disbursement limit stays at or under ${K.pct(P.firstYear.base, 0)} of the principal limit.` },
    { q: 'Can I keep a second mortgage instead of paying it off?', a: `Only if its holder agrees to stand behind the HECM. The HECM must be the first lien, and the regulation forbids other liens unless they are subordinate to it. HUD's form tells lenders not to put on line 5 the liens that will be subordinated, so such a loan stays in place, keeps its own payments and does not reduce the cash from the HECM.` },
    { q: 'What if my mortgage is larger than the reverse mortgage can pay?', a: `You bring the difference to closing. The Handbook requires the borrower to supply funds for all obligations above the initial disbursement limit, which can never exceed the principal limit. At ${AGE} on a ${K.usd(VALUE)} home, that point is a mortgage of about ${K.usd(top)}: below it, the HECM pays everything; above it, each extra dollar of debt is a dollar of cash due.` },
  ],
  body: (h) => `
<h2>Cash left for you, by size of the mortgage</h2>
<p>The table runs one home through HUD's payment plan with eight sizes of remaining mortgage. Everything else stays fixed: age ${AGE}, a ${K.usd(VALUE)} appraisal, an expected rate of ${K.pp(K.EXP)} (10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), ${K.usd(o0.imip)} of upfront MIP and ${K.usd(o0.origination)} of origination fee.</p>
${h.table(['Mortgage to pay off', 'Obligations', 'Share of principal limit', 'Cash in year one', 'Opens after month 12', 'Cash due at closing'], debts.map((d) => { const x = at(d); return [K.usd(d), K.usd(x.mo), K.pct(x.mo / x.pl, 0), K.usd(x.firstYearCash), K.usd(x.laterCash), K.usd(x.shortfall)]; }), `Age ${AGE}, ${K.usd(VALUE)} home, principal limit ${K.usd(o0.pl)}, adjustable HECM, no other closing costs entered, no set-aside. Amounts at closing values, before growth.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The table has four zones. Up to a mortgage of about ${K.usd(tip)}, the obligations stay under half of the principal limit: year-one cash is ${K.pct(P.firstYear.base, 0)} of the principal limit minus the obligations, so each dollar of debt removes a dollar of year-one cash and nothing from what opens later. Between ${K.usd(tip)} and about ${K.usd(mid)}, year-one cash is stuck at ${K.usd(o0.pl * P.firstYear.extra)}, the extra ${K.pct(P.firstYear.extra, 0)}, and the debt eats into what opens later. From there to ${K.usd(top)}, the obligations plus ${K.pct(P.firstYear.extra, 0)} would pass the principal limit itself, so year-one cash is only what the principal limit leaves after the obligations. Above ${K.usd(top)}, the HECM cannot cover the payoff and costs, and the excess is due in cash.</p>
${h.mini('firstyear', { t: 'Enter what you still owe', p: ['liens'], d: { age: AGE, value: VALUE, liens: 145000 } })}

<h2>Line 5: the payoff is part of the loan</h2>
<p>HUD's payment plan form, the one signed at closing, lists the mandatory obligations from line 3 to line 9. Line 5, "Discharge of Liens", takes "the amount of any existing liens on the property that meet FHA seasoning regulations and requirements and will be paid-in-full at closing from HECM funds" (${h.src('hud_payplan', 'HUD payment plan form')}). The regulation names the same item among mandatory obligations: "amounts required to discharge any existing liens on the property" (24 CFR 206.25(b)(8)).</p>
<p>Because it is a mandatory obligation, the payoff is financed by the HECM and joins the balance from day one, with interest and the ${K.pct(P.mip.annual, 1)} annual MIP. In the ${K.usd(L1)} case, the HECM starts with a balance of ${K.usd(a1.financed)}, payoff and costs together; left alone at today's note rate of ${K.pp(K.NOTE, 2)}, it would reach ${K.usd(after.balance)} after ten years. The old monthly payment disappears, and the debt is carried forward instead.</p>

<h2>The 50 % threshold and the extra 10 %</h2>
<p>The initial disbursement limit is the lesser of two amounts: the greater of ${K.pct(P.firstYear.base, 0)} of the principal limit or the obligations plus ${K.pct(P.firstYear.extra, 0)} of it, and the principal limit minus later set-asides (24 CFR 206.25(a)). HUD's Handbook makes the second branch available "when Mandatory Obligations exceed 50 percent of the Principal Limit" (${h.src('handbook', 'Handbook 4000.1')}). On the form, line 2 records how much of that extra ${K.pct(P.firstYear.extra, 0)} you take.</p>
<p>In the ${K.usd(L1)} case, obligations reach ${K.usd(a1.mo)}, ${K.pct(a1.mo / a1.pl, 0)} of the principal limit. ${K.pct(P.firstYear.base, 0)} of the principal limit would be ${K.usd(a1.l17)}; obligations plus ${K.pct(P.firstYear.extra, 0)} give ${K.usd(a1.l18)}, the larger figure, so the limit is ${K.usd(a1.idl)}. After the payoff and the costs, ${K.usd(a1.firstYearCash)} is left to draw in year one, and ${K.usd(a1.laterCash)} more from month 13.</p>

<h2>When the debt is larger than the principal limit</h2>
<p>A HECM can never pay out more than its principal limit. If the payoff and the costs are larger, the Handbook says the lender "must ensure the Borrower brings funds to closing to satisfy all obligations in excess of the Initial Disbursement Limit". Line 11 of the form, "Cash from Borrower", records that amount. With a ${K.usd(L2)} mortgage, obligations of ${K.usd(a2.mo)} exceed the ${K.usd(a2.pl)} principal limit: ${K.usd(a2.shortfall)} has to come from savings, a family member or the sale of something else. No cash comes out of the HECM in that case: the whole principal limit is used on the first day.</p>
<p>24 CFR 206.32 adds that, once the initial payment is made, no obligation incurred in connection with the HECM transaction may remain outstanding, apart from servicing charges and a repair set-aside. A larger home value, an older youngest borrower or a lower expected rate each raise the principal limit; the ${h.a('principal-limit-factor', 'factor table')} shows by how much.</p>

<h2>How old the old loan must be</h2>
<p>A lien taken shortly before the HECM cannot always be paid with HECM money. Federal rules allow the payoff when the lien has been in place more than 12 months before closing or gave the borrower ${K.usd(500)} or less in cash (24 CFR 206.36). The Handbook adds a third case: a lien of 12 months or less whose money went only to repairs required to meet FHA property standards, documented by invoices or canceled checks. A home equity line that fails the test may still be paid off with your own funds, HECM funds or both, provided the first-year limit stays at or under ${K.pct(P.firstYear.base, 0)} of the principal limit.</p>
<p>After closing, the home must be kept, insured and its taxes paid, since missing those charges can make the loan due (24 CFR 206.27(c)). The ${h.a('first-year-limit', 'first-year limit page')} covers the other obligations, the ${h.a('reverse-mortgage-vs-heloc', 'HECM and HELOC comparison')} sets the two kinds of credit line side by side, and the ${h.a('hecm-calculator', 'full calculator')} accepts your payoff figure.</p>`,
  tool: 'firstyear',
  toolArg: { age: AGE, value: VALUE, liens: 120000 },
  related: ['first-year-limit', 'hecm-calculator', 'reverse-mortgage-costs', 'reverse-mortgage-vs-heloc', 'hecm-refinance', 'lump-sum'],
  sources: ['hud_payplan', 'cfr_206', 'handbook', 'cfr_206_31'],
});
