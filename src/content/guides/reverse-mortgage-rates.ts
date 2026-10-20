import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, R = P.rates;
const M = R.exampleMargin;
const rT = K.rateT(K.EXP);
// Worked case of the page: a 69-year-old with a $410,000 home.
const AGE = 69, V = 410000;
const steps = [-1, -0.5, 0, 0.5, 1, 1.5, 2];
const at = (d: number) => K.loan({ age: AGE, value: V, expected: K.EXP + d });
const base = at(0), up1 = at(1), dn1 = at(-1);
// Growth of $100,000 of unused credit over 10 years at today's note rate and one point higher.
const loc0 = K.credit(100000, K.NOTE, 120), loc1 = K.credit(100000, K.NOTE + 1, 120);

export default defineGuide({
  id: 'reverse-mortgage-rates',
  group: 'basics',
  order: 40,
  slug: 'reverse-mortgage-rates',
  nav: 'Reverse mortgage rates',
  card: 'The expected rate that sizes the loan and the note rate that grows the balance',
  title: 'Reverse Mortgage Rates 2026: Expected and Note Rate, US',
  description: `Reverse mortgage rates in 2026: the 10-year Treasury at ${K.pp(R.cmt10Week, 2)} sizes a HECM, the 1-year at ${K.pp(R.cmt1Week, 2)} sets its note rate. What one point does to the amount.`,
  h1: 'Reverse mortgage rates: the two rates of a HECM',
  intro: `Why an adjustable HECM has two rates, where each one comes from this week, and what a point more or less does to the money you can use.`,
  resume: `An adjustable HECM uses two rates built on the same lender margin: the expected rate, the 10-year Treasury rate plus the margin, decides how much you can borrow, and the note rate, the 1-year Treasury rate plus the margin, decides how fast the balance grows. In the week ending ${K.day(R.cmt10WeekEnding)} the 10-year Treasury averaged ${K.pp(R.cmt10Week, 2)} and the 1-year ${K.pp(R.cmt1Week, 2)}; with an example margin of ${K.pp(M, 1)}, that gives an expected rate of ${K.pp(K.EXP)} and a starting note rate of ${K.pp(K.NOTE)}. HUD reads the expected rate rounded to the nearest eighth, here ${K.pp(rT)}. For a 69-year-old with a ${K.usd(V)} home, the factor is ${K.f(base.factor)} and the principal limit ${K.usd(base.pl)}. One point higher, the limit falls to ${K.usd(up1.pl)}; one point lower, it rises to ${K.usd(dn1.pl)}. On a fixed-rate HECM, the single rate does both jobs.`,
  faqs: [
    { q: 'What is the expected rate on a reverse mortgage?', a: `It is the rate HUD uses to size the loan. For an adjustable HECM it equals the weekly average of the 10-year Treasury rate plus the lender's margin; for a fixed-rate HECM it is simply the fixed note rate. It is never charged on your balance. It only decides which column of HUD's factor table applies, rounded to the nearest eighth of a point, and so how much you can borrow.` },
    { q: 'Can a lender charge me to lock the expected rate?', a: 'No. With your agreement, a lender may lock the expected rate and its margin at any time between application and closing, for up to 120 days from the day the FHA case number is assigned, and may extend an expired lock for another 120 days. HUD forbids a fee for the lock and for a float-down option, which recalculates the amount if the rate is lower at closing.' },
    { q: 'How high can an adjustable HECM rate go?', a: 'It depends on how often it adjusts. A rate that changes once a year can move by at most 2 points at each change and 5 points over the life of the loan, with the first change between 12 and 18 months after closing. A rate that changes monthly has no yearly cap, only a lifetime cap 10 points above the starting rate. The lender must tell you at least 25 days before each change.' },
    { q: 'Does a smaller margin mean more money?', a: `Yes, on both sides. The margin is added to the 10-year index for the expected rate and to the 1-year index for the note rate. A margin half a point lower moves the expected rate down by half a point, which raises the factor, and also slows the growth of the balance by half a point a year. At ${AGE} on a ${K.usd(V)} home, half a point is worth ${K.usd(at(-0.5).pl - base.pl)} of principal limit today.` },
  ],
  body: (h) => `
<h2>This week's indexes</h2>
${h.table(['Rate', 'Index value', 'With the example margin', 'Role'], [
  ['10-year Treasury (CMT), weekly average', K.pp(R.cmt10Week, 2), K.pp(K.EXP), 'Expected rate: sizes the loan'],
  ['1-year Treasury (CMT), weekly average', K.pp(R.cmt1Week, 2), K.pp(K.NOTE), 'Note rate: interest on the balance'],
], `Weekly averages of the daily Treasury par yields, week ending ${K.day(R.cmt10WeekEnding)}. Example margin ${K.pp(M, 1)}, not a lender's offer.`, ['l', 'r', 'r', 'l'])}
<p>The Treasury publishes these yields each business day (${h.src('treasury_yield', 'Treasury par yield curve')}), and the Federal Reserve releases the weekly averages that HUD refers to in its H.15 statistics (${h.src('fed_h15', 'Federal Reserve H.15')}). The daily 10-year figure on ${K.day(R.cmt10DailyDate)} was ${K.pp(R.cmt10Daily, 2)}. CMT stands for constant maturity Treasury: the yield of a Treasury security adjusted to an exact term of one or ten years.</p>
<p>The margin is the lender's part, and HUD does not set it. It is fixed when you choose the loan and stays the same for its life: the same number is added to the 10-year index to get the expected rate and to the 1-year index (or to an approved SOFR index) to set and later adjust the note rate. Everything on this site uses an example margin of ${K.pp(M, 1)}; replace it with the one in your offer, and the calculator above recomputes the factor.</p>

<h2>The expected rate: how much you can borrow</h2>
<p>HUD's factor table has one column per eighth of a point of expected rate, from ${K.pp(P.plf.rateMin, 0)} to ${K.pp(P.plf.rateMax)}. The lender rounds your expected rate to the nearest eighth and reads the factor at the youngest borrower's age; ${K.pp(K.EXP)} is read as ${K.pp(rT)}. A higher expected rate means HUD assumes the balance will grow faster, so it lends a smaller share. The expected rate is never charged to you. Below ${K.pp(P.plf.rateMin, 0)}, the ${K.pp(P.plf.rateMin, 0)} column applies.</p>
${h.table(['Expected rate', 'Column read', 'Factor at 69', `Principal limit, ${K.usd(V)} home`, 'Change from today'], steps.map((d) => { const o = at(d); return [K.pp(K.EXP + d), K.pp(o.rateT), K.f(o.factor), K.usd(o.pl), d === 0 ? 'today' : K.usd(o.pl - base.pl)]; }), `Age ${AGE}, HUD factor table in force since ${K.day(P.plf.effective)}. Before the upfront premium, the origination fee and any payoff.`, ['l', 'r', 'r', 'r', 'r'])}
<p>For this borrower, each half point costs between ${K.usd(Math.min(...steps.slice(1).map((d, i) => at(steps[i]).pl - at(d).pl)))} and ${K.usd(Math.max(...steps.slice(1).map((d, i) => at(steps[i]).pl - at(d).pl)))} of principal limit. The full table for every age is on the ${h.a('principal-limit-factor', 'principal limit factor page')}.</p>
${h.mini('plf', { t: 'Change the margin of your offer', p: ['margin'], d: { age: 69, value: 410000, margin: 2 } })}

<h2>Locking the expected rate</h2>
<p>Because Treasury rates move every day, the amount you were quoted can change before closing. With your agreement, the lender can lock the expected rate and the margin together at any time between application and closing, for up to 120 days counted from the assignment of the FHA case number, and extend an expired lock by another 120 days. If the lock includes a float-down option, the amount is recomputed at closing when the rate has fallen. HUD does not let the lender charge for either. Without a lock, both are set on the day of closing.</p>

<h2>The note rate: how fast the balance grows</h2>
<p>The note rate is what you pay, though not in cash: interest is added to the balance each month, together with ${K.pct(P.mip.annual, 1)} a year of mortgage insurance. At a starting note rate of ${K.pp(K.NOTE)}, the balance and any unused credit both grow by ${K.pp(K.NOTE + P.mip.annual * 100, 2)} a year. Over ten years, ${K.usd(100000)} of unused credit line becomes ${K.usd(loc0)}; one point higher, ${K.usd(loc1)}. The same arithmetic applies to what you owe, which is why the note rate matters most to someone who draws early.</p>
<p>An adjustable note rate changes with its index. The annual version adjusts once a year, the first time between 12 and 18 months after closing, by at most 2 points at a time and 5 points over the life of the loan. The monthly version may adjust every month, with a lifetime cap 10 points above the starting rate, and a lender may offer it only alongside the annual one. The lender must send the new rate and the index behind it at least 25 days before each adjustment.</p>
${h.mini('loc', { t: 'Unused credit at another note rate', p: ['nr'], d: { amt: 75000, nr: 6.5 } })}

<h2>Where the rates appear on your papers</h2>
<p>You do not have to take a quoted rate on faith. The HUD payment plan signed at closing, the form this site's calculator follows, carries five rate items at the top: the expected average mortgage interest rate, whether it was locked, the date used to pick the index value for that rate and the principal limit, the initial note rate, and the lender's margin. Subtract the margin from the expected rate and you should find the 10-year Treasury average of the date shown; subtract it from the note rate and you should find the 1-year index of that time.</p>
<p>Two checks follow from the rules. The margin must be the same number in both places, since HUD defines it once for the expected rate, the initial note rate and every later adjustment. And the index named for the starting note rate must be the one used for its adjustments: HUD does not allow a loan to start on one index and adjust on another, except where it has approved a switch, such as the move away from LIBOR.</p>

<h2>Fixed-rate HECMs</h2>
<p>On a fixed-rate HECM the lender and the borrower agree on one rate, which serves both as the note rate and as the expected rate for HUD's table. A fixed-rate loan pays a single lump sum at closing, limited by the first-year rule, and the rest of the principal limit is never available. The ${h.a('lump-sum', 'lump sum page')} shows how much that leaves on the table, and the ${h.a('hecm-calculator', 'full calculator')} switches between the two with one click.</p>`,
  tool: 'plf',
  toolArg: { age: 69, value: 410000 },
  related: ['principal-limit-factor', 'line-of-credit', 'lump-sum', 'loan-balance', 'hecm-calculator'],
  sources: ['treasury_yield', 'fed_h15', 'handbook', 'cfr_206', 'hud_plf', 'hud_calc_help'],
});
