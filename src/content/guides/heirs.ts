import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const SHARE = P.eligibility.maxCashOutHeirsShare;
// Worked cases of the page: a home appraised at $300,000 after the death of the last borrower.
const VAL = 300000;
const UNDER = K.heirs(340000, VAL), ABOVE = K.heirs(240000, VAL);
const balances = [150000, 240000, 285000, 300000, 340000, 420000];
const rows = balances.map((b) => { const x = K.heirs(b, VAL); return [K.usd(b), K.usd(x.payoff), K.usd(Math.max(0, VAL - b)), x.nonRecourse ? K.usd(b - x.payoff) : K.usd(0)]; });
// How a balance builds up before heirs inherit: a borrower aged 76 with a $265,000 home who drew the first-year maximum.
const AGE = 76, HOME = 265000;
const path = K.project({ age: AGE, value: HOME, draw: 'max' }, 20).filter((r) => [5, 10, 15, 20].includes(r.year));
const SALE_COST = 0.11; // 24 CFR 206.125(a)(2)(ii): closing costs of the sale capped at the greater of 11 % of the price or a HUD amount.

export default defineGuide({
  id: 'heirs',
  group: 'situation',
  order: 20,
  slug: 'reverse-mortgage-heirs',
  nav: 'What heirs owe',
  card: 'Pay, sell or hand back the keys: the 95 % rule and the notices',
  title: 'Reverse Mortgage Heirs 2026: What They Owe and Can Do, US',
  description: `Reverse mortgage heirs in 2026: keep the home for the lesser of the balance and 95 % of its value, ${K.usd(UNDER.payoff)} on a ${K.usd(VAL)} home, or sell or give the deed.`,
  h1: 'What heirs owe on a reverse mortgage',
  intro: `The four ways out for an estate when the last borrower dies, with the payoff figures, the 30-day notice and who pays for the appraisal.`,
  resume: `When the last borrower dies and no eligible spouse remains, a HECM becomes due, and the heirs never owe more than the home: they can keep it by paying the lesser of the loan balance and ${K.pct(SHARE, 0)} of its appraised value. On a home appraised at ${K.usd(VAL)}, a balance of ${K.usd(340000)} is settled with ${K.usd(UNDER.payoff)}, and FHA insurance absorbs the ${K.usd(340000 - UNDER.payoff)} difference; a balance of ${K.usd(240000)} is repaid in full and the ${K.usd(VAL - 240000)} above it stays with the estate. Under 24 CFR 206.125, the lender sends a due and payable notice and gives 30 days from that notice to pay the balance, sell the home, or sign a deed in lieu of foreclosure. If the loan is due, the appraisal is at the lender's expense, reimbursed from a sale. The borrower has no personal liability, so no deficiency judgment can follow a foreclosure.`,
  faqs: [
    { q: 'Do heirs have to repay a reverse mortgage out of their own money?', a: 'No. Under 24 CFR 206.27, the borrower has no personal liability for the balance and the lender can collect only through the sale of the home, with no deficiency judgment after a foreclosure. Heirs use their own money only if they choose to keep the house, and then the most they pay is 95 % of its appraised value.' },
    { q: 'Who pays for the appraisal when heirs want to buy the house?', a: 'If the loan is already due and payable, the lender orders and pays for it, and is reimbursed from the proceeds of any sale. If the loan is not yet due, the party who asks for the appraisal pays. The appraiser must be on the FHA roster, and the lender must have the home appraised within 30 days of the request.' },
    { q: 'Can heirs sell the house for less than the loan balance?', a: `Yes, once the loan is due. The regulation allows a sale for an amount HUD sets by notice, no higher than 95 % of the appraised value, with all net proceeds paid to the lender. Selling costs are capped at the greater of 11 % of the price and a fixed amount set by HUD. The FHA insurance covers what the sale leaves unpaid.` },
    { q: 'What happens if the heirs do nothing after the notice?', a: 'The lender moves to foreclosure. It must start within six months of the due date, or later if HUD approves or state law delays it, and must bid at least the lesser of the debt and the current appraised value. Signing a deed in lieu of foreclosure instead avoids that process, and the lender must accept it if recorded within 9 months of the due date.' },
  ],
  body: (h) => `
<h2>The payoff on a home appraised at ${K.usd(VAL)}</h2>
<p>Two numbers decide what an estate faces: the loan balance on the servicer's payoff statement and the appraised value of the home. Keeping the home costs the lesser of the balance and ${K.pct(SHARE, 0)} of the value. Selling it on the open market sends the net proceeds to the lender, and anything above the balance belongs to the estate. The table holds the value at ${K.usd(VAL)}, where the ${K.pct(SHARE, 0)} line sits at ${K.usd(SHARE * VAL)}.</p>
${h.table(['Loan balance', 'Paid to keep the home', 'Left to the estate after a sale at value', 'Absorbed by FHA insurance'], rows, `Home appraised at ${K.usd(VAL)}. The sale column is before selling costs; the last column applies when heirs keep the home for ${K.pct(SHARE, 0)} of its value.`, ['l', 'r', 'r', 'r'])}
<p>Above ${K.usd(SHARE * VAL)} the payoff stops rising. A balance of ${K.usd(340000)} or ${K.usd(420000)} costs the same ${K.usd(UNDER.payoff)} to keep the home, because the lender files a claim with FHA for the rest. That is the purpose of the mortgage insurance the borrower paid: ${K.pct(P.mip.upfront, 0)} at closing and ${K.pct(P.mip.annual, 1)} a year on the balance.</p>
${h.mini('heirs', { t: 'Your balance against the appraisal', p: ['bal', 'value'], d: { bal: 340000, value: VAL } })}

<h2>How large the balance gets before it is inherited</h2>
<p>A HECM has no monthly payment, so the balance only grows. Take a borrower aged ${AGE} with a ${K.usd(HOME)} home who drew everything allowed in the first year, at an initial note rate of ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} of mortgage insurance, held constant:</p>
${h.table(['Years after closing', 'Age reached', 'Loan balance'], path.map((r) => [String(r.year), String(r.age), K.usd(r.balance)]), `Borrower aged ${AGE}, ${K.usd(HOME)} home, first-year maximum drawn at closing, note rate held at ${K.pp(K.NOTE)}.`, ['l', 'l', 'r'])}
<p>Whether heirs inherit equity depends on the race between that column and the home's value, which nobody can project. If the house is still worth ${K.usd(HOME)} after 20 years, keeping it costs ${K.usd(K.heirs(path[3].balance, HOME).payoff)}. The ${h.a('loan-balance', 'loan balance page')} shows the same growth for other amounts.</p>

<h2>From the death to the 30-day notice</h2>
<p>A HECM becomes due and payable when a borrower dies and the home is no longer the principal residence of at least one surviving borrower, unless an ${h.a('non-borrowing-spouse', 'eligible non-borrowing spouse')} is entitled to a deferral. The steps that follow are written in ${h.src('cfr_206', '24 CFR 206.125')}:</p>
<ul>
<li>the lender notifies HUD within 60 days of the loan becoming due;</li>
<li>within 30 days of that notice, or of HUD's approval when one is needed, it notifies the estate and the heirs that the loan is due;</li>
<li>the estate then has 30 days from the date of that notice to choose a course.</li>
</ul>
<p>Those 30 days are a window to answer, not a deadline to have sold the house. The regulation gives the lender six months from the due date to start a foreclosure, more when HUD approves it or when state or bankruptcy law stops it from starting. The regulation itself gives no longer delay to heirs; anything more is up to HUD and the servicer.</p>

<h2>The four ways to settle</h2>
<h3>Pay the balance</h3>
<p>The estate or an heir pays the balance in full, with accrued interest, mortgage insurance and any advances the lender made. When the balance is under ${K.pct(SHARE, 0)} of the value, this is the price of keeping the home, whatever money the heirs use to pay it.</p>
<h3>Sell the home</h3>
<p>Once the loan is due, the home can be sold for an amount HUD sets by notice, which cannot exceed ${K.pct(SHARE, 0)} of the appraised value, and the net proceeds go to the lender. Closing costs of that sale may not exceed the greater of 11 % of the price or a fixed amount set by HUD. On a sale at ${K.usd(VAL)}, 11 % is ${K.usd(SALE_COST * VAL)}. A sale includes a transfer of title by operation of law, so an heir who takes title and pays the ${K.pct(SHARE, 0)} amount counts. The lender releases the mortgage provided there are no other junior liens and all net proceeds are paid to it.</p>
<h3>Give a deed in lieu of foreclosure</h3>
<p>An estate with nothing to gain can hand the deed to the lender. The lender must accept it if it is filed for recording within 9 months of the due date and title is good and marketable. HUD may also pay a cash-for-keys incentive when the deed is given within 6 months; the amount is set by HUD, not in the regulation.</p>
<h3>Let the lender foreclose</h3>
<p>If nothing is done, the lender forecloses and must bid at least the lesser of the debt with expenses and the current appraised value. The appraisal must be dated no more than 30 days before the sale. Because the debt is non-recourse, the estate owes nothing after it.</p>

<h2>The appraisal behind the ${K.pct(SHARE, 0)} figure</h2>
<p>The value that sets the payoff comes from an appraiser on the FHA roster, ordered by the lender within 30 days of a request tied to a possible sale. If the loan is due and payable, the lender pays for it and may recover the cost from the sale proceeds; if not, the party asking pays. Before a loan is due, a borrower or a representative can also sell for at least the lesser of the balance and the appraised value.</p>
<p>One tax point travels with the payoff. ${h.src('irs_936', 'IRS Publication 936')} treats the money a borrower received as loan advances, not income, and says interest accrued on a reverse mortgage is generally considered interest on home equity debt and is not deductible. The large interest figure on the final payoff statement is therefore not, as a rule, a deduction waiting for the estate.</p>`,
  tool: 'heirs',
  toolArg: { bal: 340000, value: VAL },
  related: ['non-borrowing-spouse', 'loan-balance', 'reverse-mortgage-mip', 'how-reverse-mortgage-works', 'taxes-and-benefits'],
  sources: ['cfr_206', 'handbook', 'irs_936', 'hud_payplan'],
});
