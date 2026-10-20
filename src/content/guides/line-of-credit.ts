import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: youngest borrower 72, a $450,000 home, adjustable rate, nothing drawn at closing.
const AGE = 72, VALUE = 450000;
const o = K.loan({ age: AGE, value: VALUE });
const rows = K.project({ age: AGE, value: VALUE }, 30);
const at = (y: number) => rows[y - 1];
const grow = K.NOTE + P.mip.annual * 100;
const eff = Math.pow(1 + grow / 100 / 12, 12) - 1;
const line0 = o.npl;
const years = [1, 2, 3, 5, 8, 10, 12, 15, 20, 25, 30];
const notes = [K.NOTE - 1, K.NOTE, K.NOTE + 1, K.NOTE + 2];
const one = 100000;

export default defineGuide({
  id: 'line-of-credit',
  group: 'payout',
  order: 10,
  slug: 'reverse-mortgage-line-of-credit',
  nav: 'Line of credit growth',
  card: 'How the unused HECM line grows at the note rate plus 0.5 %, year by year',
  title: 'Reverse Mortgage Line of Credit 2026: Growth Rate, US',
  description: `HECM line of credit in 2026: the unused part grows at the note rate plus ${K.pct(P.mip.annual, 1)} MIP, ${K.pp(grow, 2)} a year today, with a 30-year table and what that growth is not.`,
  h1: 'How a HECM line of credit grows',
  intro: `The unused part of an adjustable HECM credit line gets larger every month by the same rule that makes the loan balance grow, and the calculator shows how much room that adds over time.`,
  resume: `The unused part of a HECM line of credit grows each month by one twelfth of the note rate plus the ${K.pct(P.mip.annual, 1)} annual mortgage insurance premium (MIP), because HUD makes the whole principal limit grow at that pace and the line is what remains of it after the balance and any set-asides. With a 1-year Treasury rate of ${K.pp(P.rates.cmt1Week, 2)} and an example margin of ${K.pp(P.rates.exampleMargin, 1)}, the note rate is ${K.pp(K.NOTE, 2)} and the line grows at ${K.pp(grow, 2)} a year, or ${K.pct(eff, 2)} once compounded monthly. A ${AGE}-year-old with a ${K.usd(VALUE)} home has a principal limit of ${K.usd(o.pl)}; after the upfront MIP and the largest origination fee, ${K.usd(line0)} stays available as a line. Left untouched, it reaches about ${K.usd(at(10).credit)} after 10 years and ${K.usd(at(20).credit)} after 20, at an unchanged rate. That growth is extra room to borrow, not money earned: every dollar drawn later carries the same rate.`,
  faqs: [
    { q: 'Does an unused reverse mortgage line of credit earn interest?', a: `No. Nothing is paid to you and nothing is added to an account in your name. What grows is the amount you are allowed to borrow, at the note rate plus ${K.pct(P.mip.annual, 1)}. If you never draw, you never owe that growth. If you draw, the dollars you take start accruing interest and MIP at the same rate, so the line and the balance move together.` },
    { q: 'Can the HECM credit line grow larger than the home is worth?', a: `On paper, yes: the line follows the principal limit, which ignores the home's later value. In our ${K.usd(VALUE)} example it passes the appraised value after about ${rows.findIndex((r) => r.credit > VALUE) + 1} years at today's rate. Two limits remain. A draw cannot push the balance above the maximum amount written in the security instrument, and the line ends when the loan becomes due, for example when the last borrower moves out.` },
    { q: 'Does a fixed-rate HECM come with a growing line of credit?', a: `No. A fixed-rate HECM pays one lump sum at closing. Its principal limit keeps growing each month, but HUD's rules say no further funds may be made available to draw after closing, and a partial repayment does not reopen room either. A line of credit, alone or combined with monthly payments, exists only on an adjustable-rate HECM.` },
    { q: 'How fast is a HECM line of credit growing in 2026?', a: `At the rates read on ${K.day(P.rates.cmt10WeekEnding)}, a note rate of ${K.pp(K.NOTE, 2)} with an example margin, the line grows at ${K.pp(grow, 2)} a year compounded monthly, about ${K.pct(eff, 2)} in effective terms. The pace changes with each adjustment of the note rate, so a lender's margin and the 1-year Treasury index on your adjustment dates decide the real figure.` },
  ],
  body: (h) => `
<h2>The growth rate written in HUD's rules</h2>
<p>Federal regulations define the principal limit as the amount computed at closing from the age, the expected rate and the maximum claim amount, which then "increases each month thereafter at a rate equal to one-twelfth of the mortgage interest rate in effect at that time, plus one-twelfth of the annual mortgage insurance rate" (${h.src('cfr_206', '24 CFR 206.3')}). HUD's ${h.src('handbook', 'Handbook 4000.1')} repeats the rule for adjustable loans, word for word on the rate. When a borrower keeps a line of credit, 24 CFR 206.25(g) splits the principal limit into a servicing set-aside, the line and the rest, and adds that "the line of credit amount increases at the same rate as the total principal limit".</p>
<p>So the rate of growth is not a feature a lender adds or a bonus for waiting. It is the loan's own cost: the note rate, which is an index plus the lender's margin, plus the ${K.pct(P.mip.annual, 1)} premium FHA charges on the balance each year. Today that is ${K.pp(K.NOTE, 2)} + ${K.pp(P.mip.annual * 100, 1)} = ${K.pp(grow, 2)} a year, applied as ${K.pp(grow / 12, 3)} each month. The figures below hold that rate constant, which a real adjustable loan will not do.</p>
${h.table(['Year', 'Age', 'Unused credit line', 'Principal limit', 'Loan balance'], years.map((y) => [String(y), String(at(y).age), K.usd(at(y).credit), K.usd(at(y).limit), K.usd(at(y).balance)]), `Age ${AGE}, ${K.usd(VALUE)} home, adjustable HECM, upfront MIP and the maximum origination fee financed, nothing drawn. Note rate ${K.pp(K.NOTE, 2)} + ${K.pp(P.mip.annual * 100, 1)} MIP held constant; end of each year.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The three columns grow at one pace. The balance here is only the financed costs, ${K.usd(o.financed)} at closing, and it compounds like the line. The line is the principal limit minus that balance, so after 30 years the gap between them has widened to ${K.usd(at(30).credit)} even though nobody touched the money.</p>
${h.mini('loc', { t: 'Grow an unused line of your size', p: ['amt'], d: { amt: 160000, nr: K.NOTE } })}

<h2>The first year limits the draw, not the growth</h2>
<p>In the first 12 months you can draw at most the initial disbursement limit: ${K.pct(P.firstYear.base, 0)} of the principal limit, minus the costs paid at closing. In the example that leaves ${K.usd(o.firstYearCash)} available during year one and ${K.usd(o.laterCash)} that opens on the first anniversary of closing. The cap applies to what you can take, and the whole line keeps compounding during those months. A line that was ${K.usd(line0)} at closing is about ${K.usd(at(1).credit)} at the end of year one. The HUD payment plan form says its line 25 does not include the increase of the principal limit during the first 12 months, so the figure printed on that form is the closing value, before any of this growth.</p>
${h.mini('hecm', { t: 'Your own line at closing and later', p: ['age', 'value'], d: { age: AGE, value: VALUE, plan: 'loc' } })}

<h2>What the growth is and what it is not</h2>
<p>It is room. When you later ask for a draw, the lender must send it within five business days of your written request (24 CFR 206.27(b)(1)), and if it pays late, it owes you a late charge of 10 % of the amount, at most ${K.usd(500)}, under 206.25(j). No minimum draw can be imposed (206.25(k)), so a borrower can take small sums or none.</p>
<p>It is not savings. An unused line has no cash value, cannot be passed to heirs and stops when the loan becomes due and payable. It is not tied to the home's market value either: the principal limit compounds on its own, which is why the table shows a line above the ${K.usd(VALUE)} appraisal after enough years. Two brakes still apply. Under 206.19(h), no disbursement may push the balance above the maximum amount stated in the security instrument, and draws stop when the last borrower dies, sells or moves out.</p>
<p>It is not free either. A draw of ${K.usd(one)} taken in year ten starts its own compounding at the same ${K.pp(grow, 2)}; after another ten years it has become a debt of ${K.usd(K.balance(one, K.NOTE, 120).balance)}. What the growth buys is the option of borrowing more later without a new application, at the price the loan already carries.</p>

<h2>When the note rate moves</h2>
<p>On an annual adjustable HECM, the rate can change once a year after the first 12 to 18 months, by no more than two points per adjustment and five points over the life of the loan (24 CFR 206.21). The line follows each change: a higher note rate makes it grow faster, and makes any money already borrowed grow faster by the same amount. The table compares one unused ${K.usd(one)} line at four note rates.</p>
${h.table(['Note rate', 'Yearly growth', 'After 10 years', 'After 20 years', 'After 30 years'], notes.map((r) => [K.pp(r, 2), K.pp(r + P.mip.annual * 100, 2), K.usd(K.credit(one, r, 120)), K.usd(K.credit(one, r, 240)), K.usd(K.credit(one, r, 360))]), `An unused line of ${K.usd(one)}, growth of note rate + ${K.pp(P.mip.annual * 100, 1)} MIP compounded monthly, rate held constant over the period.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The expected rate, which sets the principal limit at closing, uses the 10-year Treasury; the note rate, which drives growth after closing, uses the 1-year Treasury. Today those two indexes stand at ${K.pp(P.rates.cmt10Week, 2)} and ${K.pp(P.rates.cmt1Week, 2)}. A note rate that changes after closing never changes the factor read on the expected rate at closing; it only changes how fast the line and the balance grow from there. The ${h.a('reverse-mortgage-rates', 'rates page')} explains both indexes.</p>

<h2>Changing your mind after year one</h2>
<p>After the first 12 months, an adjustable-rate borrower may ask to recalculate the plan, switch to monthly payments or take any amount up to the principal limit minus the balance and set-asides (24 CFR 206.26). The lender may charge a fee for the change. A line can therefore turn into ${h.a('monthly-payments', 'tenure or term payments')} later, and the payments are then sized on the larger line. To see how drawn money compounds, the ${h.a('loan-balance', 'loan balance page')} follows a borrowed sum year by year, and the ${h.a('first-year-limit', 'first-year limit page')} details the cap on year-one draws.</p>`,
  tool: 'loc',
  toolArg: { amt: 120000 },
  related: ['hecm-calculator', 'first-year-limit', 'loan-balance', 'monthly-payments', 'reverse-mortgage-vs-heloc', 'reverse-mortgage-rates'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'treasury_yield'],
});
