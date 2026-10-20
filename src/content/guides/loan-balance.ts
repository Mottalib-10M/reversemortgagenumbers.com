import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const g = K.NOTE / 100 + P.mip.annual;
const eff = (r: number) => Math.pow(1 + (r / 100 + P.mip.annual) / 12, 12) - 1;
const dbl = (r: number) => Math.log(2) / (12 * Math.log(1 + (r / 100 + P.mip.annual) / 12));
const SUM = 100000;
const yrs = [1, 3, 5, 10, 15, 20, 25, 30];
const b10 = K.balance(SUM, K.NOTE, 120), b20 = K.balance(SUM, K.NOTE, 240);
const rates = [K.NOTE - 1, K.NOTE, K.NOTE + 1, K.NOTE + 2];
// Full case of the page: youngest borrower 66, a $300,000 home, first-year maximum drawn at closing.
const AGE = 66, VALUE = 300000;
const o = K.loan({ age: AGE, value: VALUE, draw: 'max' });
const rows = K.project({ age: AGE, value: VALUE, draw: 'max' }, 30);
const floor = P.eligibility.maxCashOutHeirsShare * VALUE;
const cross = rows.find((r) => r.balance > floor);
const start = o.financed + o.draw;

export default defineGuide({
  id: 'loan-balance',
  group: 'payout',
  order: 40,
  slug: 'reverse-mortgage-loan-balance',
  nav: 'Loan balance over time',
  card: 'Interest and 0.5 % MIP added every month: how fast the HECM balance grows and doubles',
  title: 'Reverse Mortgage Loan Balance 2026: Growth by Year, US',
  description: `Reverse mortgage loan balance in 2026: interest plus ${K.pct(P.mip.annual, 1)} MIP added monthly, so a sum doubles in about ${K.dec(dbl(K.NOTE), 1)} years at ${K.pp(K.NOTE, 2)}. Table by year, with the 95 % test.`,
  h1: 'How a reverse mortgage balance grows',
  intro: `The amount owed on a HECM rises every month without any payment from you, and the tables show how quickly, then compare it with 95 % of the home's appraised value.`,
  resume: `A HECM balance grows every month by the interest at the note rate and the ${K.pct(P.mip.annual, 1)} annual mortgage insurance premium (MIP), both added to what you owe, and the growth compounds because next month's charges apply to this month's total. At a note rate of ${K.pp(K.NOTE, 2)} (1-year Treasury at ${K.pp(P.rates.cmt1Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the balance rises by ${K.pct(eff(K.NOTE), 2)} a year and doubles in about ${K.dec(dbl(K.NOTE), 1)} years. ${K.usd(SUM)} borrowed today becomes ${K.usd(b10.balance)} after 10 years, of which ${K.usd(b10.interest)} is interest and ${K.usd(b10.mip)} MIP, and ${K.usd(b20.balance)} after 20. For a ${AGE}-year-old who takes the first-year maximum on a ${K.usd(VALUE)} home, the balance of ${K.usd(start)} at closing would pass 95 % of today's appraised value ${cross ? `in year ${cross.year}` : 'after 30 years'} if the home's value stayed flat. Heirs never owe more than that 95 % figure.`,
  faqs: [
    { q: 'How long does it take a reverse mortgage balance to double?', a: `About ${K.dec(dbl(K.NOTE), 1)} years at today's example note rate of ${K.pp(K.NOTE, 2)}, because ${K.pp(K.NOTE + P.mip.annual * 100, 2)} a year compounded monthly doubles a sum in that time. At ${K.pp(K.NOTE + 1, 2)} it takes ${K.dec(dbl(K.NOTE + 1), 1)} years, at ${K.pp(K.NOTE - 1, 2)} it takes ${K.dec(dbl(K.NOTE - 1), 1)}. On an adjustable loan the rate is reset over time, so the real doubling time moves with the 1-year Treasury index.` },
    { q: 'Is the annual MIP charged on the balance or on the home value?', a: `On the balance. The upfront premium of ${K.pct(P.mip.upfront, 0)} is computed on the maximum claim amount, but the annual premium of ${K.pct(P.mip.annual, 1)} accrues on what you owe and is added to it each month. A borrower who has drawn little pays little MIP; a large balance carries a large premium. On ${K.usd(SUM)} borrowed, the MIP adds ${K.usd(K.balance(SUM, K.NOTE, 12).mip)} in the first year.` },
    { q: 'Can I make payments to slow the balance down?', a: `Yes. 24 CFR 206.209 lets a borrower repay a HECM in full or in part at any time without charge or penalty, and no monthly payment is ever required while the loan is not due. On an adjustable loan, a partial repayment lowers the balance and is applied according to the note. On a fixed-rate loan the room it frees can never be drawn again.` },
  ],
  body: (h) => `
<h2>Two charges added every month</h2>
<p>The regulation describes the mechanics in a few lines. At the end of each month, "interest accrued during that month shall be added to the outstanding loan balance", and the monthly MIP, which accrues from closing, is added from the second month on (24 CFR 206.25(i)). Repayment of the whole balance is deferred until the loan becomes due and payable, under every payment plan (206.19(g)). The balance at any date is therefore everything paid to you or for you, the financed closing costs included, plus all the interest and premium charged on them since. HUD's payment plan form defines line 27, the outstanding balance, the same way (${h.src('hud_payplan', 'HUD payment plan form')}).</p>
<p>Each month the balance is multiplied by 1 + (note rate + ${K.pp(P.mip.annual * 100, 1)}) ÷ 12. At ${K.pp(K.NOTE, 2)}, that is ${K.pp(g / 12 * 100, 4)} a month, ${K.pct(eff(K.NOTE), 2)} over a year once compounded. The table follows one ${K.usd(SUM)} advance with nothing added.</p>
${h.table(['Year', 'Balance', 'Interest so far', 'MIP so far', 'Multiple of the sum'], yrs.map((y) => { const b = K.balance(SUM, K.NOTE, y * 12); return [String(y), K.usd(b.balance), K.usd(b.interest), K.usd(b.mip), `${K.dec(b.balance / SUM, 2)} ×`]; }), `${K.usd(SUM)} borrowed once, note rate ${K.pp(K.NOTE, 2)} + ${K.pp(P.mip.annual * 100, 1)} annual MIP, compounded monthly, rate held constant.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The premium is the smaller part. Over 30 years it adds ${K.usd(K.balance(SUM, K.NOTE, 360).mip)} to the ${K.usd(SUM)}, against ${K.usd(K.balance(SUM, K.NOTE, 360).interest)} of interest, because the ${K.pct(P.mip.annual, 1)} rate is only ${K.pct(P.mip.annual / g, 0)} of the combined growth rate. Both are charged on a total that already includes past charges, which is why the curve steepens late: the last five years add more than the first fifteen.</p>
${h.mini('balance', { t: 'Follow a sum of your own', p: ['amt', 'yrs'], d: { amt: 65000, yrs: 12 } })}

<h2>What else lands on the balance</h2>
<p>Cash is not the only thing that raises what you owe. Monthly tenure or term payments each join the balance on the day they are paid and start their own compounding. When a life expectancy set-aside pays property taxes or insurance, those are payments made for you, and HUD's form counts in the balance every payment made "to or on behalf of the borrower", from the date it is made. Money still sitting in the set-aside is not yet owed and is not yet charged interest. Money left in a line of credit, by contrast, costs nothing until drawn.</p>
<p>The timing of a draw matters as much as its size. ${K.usd(SUM)} taken at closing has grown to ${K.usd(b10.balance)} ten years later; the same ${K.usd(SUM)} taken in year five has had only five years to compound and stands at ${K.usd(K.balance(SUM, K.NOTE, 60).balance)} at that date. A borrower who draws only when a need arises carries a smaller balance than one who takes everything on day one, for the same total of cash received.</p>

<h2>Years to double at other note rates</h2>
<p>The note rate of an adjustable HECM is the 1-year Treasury index plus the lender's margin, reset on the adjustment dates within the caps of 24 CFR 206.21. One point more or less changes the doubling time by more than a year, as the table shows for the same ${K.usd(SUM)}.</p>
${h.table(['Note rate', 'Yearly growth', 'Years to double', 'After 15 years'], rates.map((r) => [K.pp(r, 2), K.pct(eff(r), 2), K.dec(dbl(r), 1), K.usd(K.balance(SUM, r, 180).balance)]), `Growth = note rate + ${K.pp(P.mip.annual * 100, 1)} MIP, compounded monthly, rate held constant over the period.`, ['l', 'r', 'r', 'r'])}

<h2>A whole loan, year by year, against 95 % of today's value</h2>
<p>A ${AGE}-year-old with a ${K.usd(VALUE)} home and no mortgage has a principal limit of ${K.usd(o.pl)}. Taking the first-year maximum at closing means ${K.usd(o.draw)} in cash plus ${K.usd(o.financed)} of financed upfront MIP and origination fee: the balance starts at ${K.usd(start)}. The rest of the principal limit remains as a line of credit and grows at the same pace.</p>
<p>The fifth column below is not a forecast. It holds the home at its appraised value of today, ${K.usd(VALUE)}, to show when the balance would catch up with 95 % of it, the figure that matters when the loan ends. We make no assumption on future prices: if the home is worth more at that date, the 95 % figure rises with it; if it is worth less, the figure falls.</p>
${h.table(['Year', 'Age', 'Balance', 'Unused credit line', '95 % of today\'s value', 'Settles the loan'], [1, 5, 10, 15, 20, 25, 30].map((y) => { const r = rows[y - 1]; return [String(y), String(r.age), K.usd(r.balance), K.usd(r.credit), K.usd(floor), K.usd(K.heirs(r.balance, VALUE).payoff)]; }), `Age ${AGE}, ${K.usd(VALUE)} home, adjustable HECM, first-year maximum drawn at closing, nothing drawn after. Note rate ${K.pp(K.NOTE, 2)} + ${K.pp(P.mip.annual * 100, 1)} MIP held constant. Home value held at today's appraisal for comparison only.`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>${cross ? `In year ${cross.year}, at age ${cross.age}, the balance of ${K.usd(cross.balance)} passes ${K.usd(floor)}.` : `Within 30 years, the balance stays under ${K.usd(floor)}.`} From then on, under 24 CFR 206.125, heirs who want to keep the home can settle the loan for 95 % of the appraised value at that time, and a sale for at least that amount closes the debt. The gap above that figure is covered by FHA insurance, not by the family.</p>
${h.mini('heirs', { t: 'Compare a balance with 95 % of a value', p: ['bal'], d: { bal: Math.round(rows[24].balance / 1000) * 1000, value: VALUE } })}

<h2>What the borrower never owes</h2>
<p>A HECM is non-recourse. The mortgage must state that "the borrower shall have no personal liability for payment of the outstanding loan balance", that the lender can enforce the debt "only through sale of the property" and that no deficiency judgment is allowed (24 CFR 206.27(b)(8); ${h.src('cfr_206', '24 CFR part 206')}). Whatever the balance reaches, the home is the only thing it can be collected from, and neither the borrower nor the heirs owe the gap.</p>
<p>The balance also stops rising only when the loan is repaid. Nothing caps it at the home's value along the way, and an untouched line of credit adds nothing to it until you draw. The ${h.a('line-of-credit', 'line of credit page')} follows the unused part, the ${h.a('heirs', 'heirs page')} explains the 95 % rule step by step, and the ${h.a('reverse-mortgage-mip', 'mortgage insurance page')} puts the premium in dollars.</p>`,
  tool: 'balance',
  toolArg: { amt: 140000, yrs: 20 },
  related: ['heirs', 'line-of-credit', 'reverse-mortgage-mip', 'hecm-calculator', 'reverse-mortgage-rates'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'treasury_yield'],
});
