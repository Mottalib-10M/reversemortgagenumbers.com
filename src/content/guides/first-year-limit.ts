import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, F = P.firstYear;
// Worked case of the page: youngest borrower 67, $450,000 home, with mortgages of different sizes to pay off.
const AGE = 67, VAL = 450000;
const at = (liens: number) => K.loan({ age: AGE, value: VAL, liens });
const free = at(0), low = at(40000), mid = at(120000), high = at(160000);
const fx = K.loan({ age: AGE, value: VAL, liens: 40000, fixed: true });
const liensList = [0, 40000, 80000, 120000, 160000, 200000];
// Mortgage payoff at which obligations reach half of the principal limit (the switch to obligations + 10 %).
const grown = K.credit(low.laterCash, K.NOTE, 12);
const pivot = (F.base - F.extra) * free.pl - free.mo;

export default defineGuide({
  id: 'first-year-limit',
  group: 'money',
  order: 60,
  slug: 'reverse-mortgage-first-year-limit',
  nav: 'First-year limit (60 % rule)',
  card: 'What you can draw in the first 12 months, lines 17 to 21 of the HUD form',
  title: 'Reverse Mortgage First-Year Limit 2026: 60 % Rule, US',
  description: `Reverse mortgage first-year limit in 2026: ${K.pct(F.base, 0)} of the principal limit, or obligations plus ${K.pct(F.extra, 0)} when they pass half, e.g. ${K.usd(low.firstYearCash)} at ${AGE} on a ${K.usd(VAL)} home.`,
  h1: 'The first-year limit of a HECM, line by line',
  intro: `How much of a HECM you can use in the first 12 months, read from lines 17 to 21 of HUD's payment plan, and what changes when a mortgage payoff takes most of the loan.`,
  resume: `In the first 12 months of an adjustable HECM, total disbursements are capped at the greater of ${K.pct(F.base, 0)} of the principal limit and the mandatory obligations plus ${K.pct(F.extra, 0)} of it, never more than the principal limit minus any set-aside running past year one. For a ${AGE}-year-old with a ${K.usd(VAL)} home, the principal limit is ${K.usd(free.pl)}. With a ${K.usd(40000)} mortgage to pay off, the obligations come to ${K.usd(low.mo)}, under half, so the ${K.pct(F.base, 0)} branch applies and ${K.usd(low.firstYearCash)} is left to draw in year one. Once obligations pass half of the principal limit, here with a payoff above about ${K.usd(pivot)}, the other branch takes over and first-year cash shrinks to ${K.pct(F.extra, 0)} of the principal limit, ${K.usd(mid.firstYearCash)}. When obligations exceed the whole principal limit, the difference is brought in cash: ${K.usd(high.shortfall)} with a ${K.usd(160000)} payoff. A fixed-rate HECM pays everything in one advance at closing; the rest is never available.`,
  faqs: [
    { q: 'When does the first 12-month period end?', a: `The Handbook defines it as running from the day of closing to the day before the anniversary of closing. If that day falls on a federal holiday, a Saturday or a Sunday, the period ends on the next business day. From then on, an adjustable HECM opens the rest of the net principal limit, which has kept growing at the note rate plus the annual premium.` },
    { q: 'Can I change the extra 10 % election after closing?', a: `No. When obligations exceed half of the principal limit, you tell the lender at closing how much of the additional ${K.pct(F.extra, 0)} you will draw or keep available during the first year, and the Handbook says this election cannot be increased or decreased after closing. Line 2 of the payment plan records the amount, so think about first-year needs before you sign.` },
    { q: 'Is first-year room I do not use lost?', a: `Not on an adjustable HECM. What you leave undrawn stays in the principal limit and becomes available after month 12, together with the part that was locked, and it grows while unused. On a fixed-rate HECM it is different: the single advance at closing is the only draw, and whatever the first-year rule kept back is never paid out.` },
    { q: 'Do monthly payments count toward the first-year limit?', a: `Yes. Line 24 of the payment plan is the room left after closing, usable through any mix of line of credit draws and monthly payments until the first year ends. The form says the line of credit set up in year one may not exceed that room less what is designated for term or tenure payments, so payments and draws share it. The ${K.pct(F.base, 0)} cap applies to everything paid to you or for you in that period.` },
  ],
  body: (h) => `
<h2>Lines 17 to 21 of the HUD payment plan</h2>
<p>HUD's payment plan form, Exhibit 1 to the loan agreement, computes the first-year cap in five lines. Line 17 is ${K.pct(F.base, 0)} of the principal limit. Line 18 is the mandatory obligations (line 10) plus ${K.pct(F.extra, 0)} of the principal limit. Line 19 keeps the greater of the two. Line 20 is the principal limit minus the servicing fee set-aside and the part of any life expectancy set-aside meant for after year one. Line 21, the initial disbursement limit, is the lesser of lines 19 and 20, and never more than the principal limit. The Handbook writes the same rule in words: the lesser of the greater of ${K.pct(F.base, 0)} or obligations plus ${K.pct(F.extra, 0)}, and the principal limit less those set-asides.</p>
<p>Mandatory obligations are the charges required to close: upfront mortgage insurance, the origination fee and other closing costs, mortgages and liens paid off, a repair set-aside, and first-year tax and insurance payments from a set-aside. They are subtracted from the initial disbursement limit first; what remains is yours to draw during the first year.</p>

<h2>Six payoffs on one ${K.usd(VAL)} home</h2>
<p>The table keeps the same borrower, ${AGE} years old with a ${K.usd(VAL)} home and an expected rate of ${K.pp(K.EXP)}, and changes only the mortgage to pay off. Upfront insurance (${K.usd(free.imip)}) and the maximum origination fee (${K.usd(free.origination)}) are in every row.</p>
${h.table(['Payoff', 'Obligations', 'Line 17', 'Line 18', 'Line 21', 'Year one cash', 'After year one', 'Cash to bring'], liensList.map((l) => { const o = at(l); return [K.usd(l), K.usd(o.mo), K.usd(o.l17), K.usd(o.l18), K.usd(o.idl), K.usd(o.firstYearCash), K.usd(o.laterCash), K.usd(o.shortfall)]; }), `First-year limit of an adjustable HECM, youngest borrower ${AGE}, home ${K.usd(VAL)}, principal limit ${K.usd(free.pl)}, no set-aside.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('firstyear', { t: 'Your payoff, your first year', p: ['liens'], d: { age: AGE, value: VAL, liens: 60000 } })}

<h2>Obligations under half: the ${K.pct(F.base, 0)} branch</h2>
<p>With no mortgage, the obligations are only ${K.usd(free.mo)}, and line 17 (${K.usd(free.l17)}) is far above line 18. The borrower can draw ${K.usd(free.firstYearCash)} in the first year. With a ${K.usd(40000)} payoff, line 17 still wins, and every dollar of payoff comes straight out of first-year cash: ${K.usd(low.firstYearCash)}. In this branch the rest of the principal limit, ${K.usd(low.laterCash)}, waits for month 13 whatever the payoff, because it is the ${K.pct(1 - F.base, 0)} that line 17 locks.</p>

<h2>Month 13: what opens up</h2>
<p>The first-year limit delays money; on an adjustable HECM it does not remove it. The part locked by line 17 stays in the principal limit, and the principal limit grows each month by one twelfth of the note rate plus the annual premium. For the borrower with a ${K.usd(40000)} payoff, the ${K.usd(low.laterCash)} held back at closing is worth about ${K.usd(grown)} of credit when the first year ends, at a note rate of ${K.pp(K.NOTE)}. Whatever was left undrawn from the first-year room is still there as well. A borrower who needs a large sum soon after closing is therefore the one most affected by the rule, and a borrower who wants a reserve for later barely notices it. The ${h.a('line-of-credit', 'line of credit page')} follows that growth over many years.</p>

<h2>Obligations over half: plus ${K.pct(F.extra, 0)}</h2>
<p>The Handbook gives up to an additional ${K.pct(F.extra, 0)} of the principal limit when mandatory obligations exceed ${K.pct(F.base - F.extra, 0)} of it. On this home that happens once the payoff passes about ${K.usd(pivot)}. From there, line 18 is larger than line 17, and the borrower gets the obligations paid plus ${K.pct(F.extra, 0)} of the principal limit, ${K.usd(mid.firstYearCash)}, no matter how large the payoff is. With ${K.usd(120000)} to pay off, that leaves only ${K.usd(mid.laterCash)} for later. The extra amount has to be elected at closing, and the election is fixed for the year.</p>
<p>Before October 2017, crossing ${K.pct(F.base, 0)} in the first year also changed the price of the loan: under Mortgagee Letter 2014-21 the upfront premium was ${K.pct(0.005, 1)} of the claim amount when first-year draws stayed within ${K.pct(F.base, 0)} of the principal limit and ${K.pct(0.025, 1)} above it. Mortgagee Letter 2017-12 ended that link, and the premium is now ${K.pct(P.mip.upfront, 0)} of the maximum claim amount in every case.</p>

<h2>Obligations over the principal limit: cash at closing</h2>
<p>When the obligations exceed the principal limit, the HECM cannot pay them all. The Handbook puts the cash needed to close at the difference between the mandatory obligations and the principal limit, and the payment plan records it on line 11, cash from the borrower. With a ${K.usd(160000)} payoff, the obligations reach ${K.usd(high.mo)} against a principal limit of ${K.usd(high.pl)}: ${K.usd(high.shortfall)} must be brought to closing, and nothing is left to draw, now or later. The ${h.a('existing-mortgage', 'existing mortgage page')} looks at this case in detail.</p>

<h2>Fixed rate: one advance at closing</h2>
<p>A fixed-rate HECM has a single lump sum payment option, limited to one disbursement at closing. The same first-year rule sizes that advance. With a ${K.usd(40000)} payoff, the borrower receives ${K.usd(fx.firstYearCash)} at closing, exactly what the adjustable loan allows in year one, but the remaining ${K.usd(fx.forfeited)} is never available. On an adjustable HECM, that amount would open after 12 months and keep growing.</p>
${h.mini('firstyear', { t: 'Adjustable or fixed', p: ['rt'], d: { age: AGE, value: VAL, liens: 40000 } })}
<p>Set-asides act through line 20. A servicing fee set-aside or the part of a ${h.a('lesa', 'life expectancy set-aside')} meant for later years lowers line 20, and if line 20 falls below line 19 it becomes the limit. The ${h.a('hecm-calculator', 'full calculator')} prints every line with your numbers.</p>`,
  tool: 'firstyear',
  toolArg: { age: AGE, value: VAL, liens: 120000 },
  related: ['existing-mortgage', 'lesa', 'lump-sum', 'line-of-credit', 'hecm-calculator'],
  sources: ['hud_payplan', 'handbook', 'cfr_206', 'ml_2017_12'],
});
