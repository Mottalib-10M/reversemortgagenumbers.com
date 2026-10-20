import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const AGE = 70, V = 300000;
const o = K.loan({ age: AGE, value: V });
const path = K.project({ age: AGE, value: V }, 20);
const at = (age: number) => path.find((r) => r.age === age)!;
const marks = [71, 75, 80, 85, 90];
const growRows = marks.map((a) => { const r = at(a); return [String(a), K.usd(r.credit), K.usd(r.balance), K.usd(r.limit)]; });
const late85 = K.loan({ age: 85, value: V }), late90 = K.loan({ age: 90, value: V });
const drawn = K.project({ age: AGE, value: V, draw: 'max' }, 20);
const drawnAt = (age: number) => drawn.find((r) => r.age === age)!;
const noteRates = [K.NOTE - 1, K.NOTE, K.NOTE + 1];
const growth = Math.pow(1 + (K.NOTE / 100 + P.mip.annual) / 12, 12) - 1;
const fixedLump = K.loan({ age: AGE, value: V, fixed: true });

export default defineGuide({
  id: 'age-70',
  group: 'age',
  order: 70,
  slug: 'reverse-mortgage-at-70',
  nav: 'Reverse mortgage at 70',
  card: 'A credit line opened at 70 and what it reaches by 85 or 90',
  title: 'Reverse Mortgage at 70 in 2026: Credit Line Growth, US',
  description: `Reverse mortgage at 70 in 2026: a HECM line of credit of ${K.usd(o.npl)} on a ${K.usd(V)} home, which would grow to about ${K.usd(at(85).credit)} by age 85 if it is left unused.`,
  h1: 'A reverse mortgage line of credit opened at 70',
  intro: `How large a HECM credit line is at 70, how it grows if left alone until 85 or 90, and how it compares with a loan taken out later on the same home.`,
  resume: `At 70, a HECM on a ${K.usd(V)} home opens a line of credit of ${K.usd(o.npl)} after ${K.usd(o.imip)} of upfront mortgage insurance and a ${K.usd(o.origination)} origination fee: HUD's factor is ${K.f(o.factor)} at an expected rate of ${K.pp(K.EXP)}, giving a principal limit of ${K.usd(o.pl)}. Up to ${K.usd(o.firstYearCash)} can be drawn in the first 12 months, the rest after. The unused part grows each month at the note rate plus ${K.pct(P.mip.annual, 1)} of annual premium, ${K.pp(K.NOTE)} + ${K.pct(P.mip.annual, 1)} today. Left alone, it reaches about ${K.usd(at(80).credit)} at 80, ${K.usd(at(85).credit)} at 85 and ${K.usd(at(90).credit)} at 90 if the note rate stays where it is. For comparison, a new HECM taken out at 85 on the same ${K.usd(V)} home would give ${K.usd(late85.npl)}. That growth is room to borrow, not money earned, and it ends when the loan becomes due.`,
  faqs: [
    { q: 'How big is a reverse mortgage line of credit at 70 on a $300,000 home?', a: `About ${K.usd(o.npl)} at an expected rate of ${K.pp(K.EXP)}: a principal limit of ${K.usd(o.pl)}, minus the upfront premium and an origination fee at its cap, financed in the loan. Of that, ${K.usd(o.firstYearCash)} can be drawn in the first year. Third-party closing costs, if financed, come out of the line as well.` },
    { q: 'Does a line opened at 70 end up larger than a new loan at 85?', a: `At today's rates and with the home value unchanged, yes: the untouched line reaches about ${K.usd(at(85).credit)} at 85, while a new HECM at 85 would give ${K.usd(late85.npl)}. The comparison depends on the note rate, which moves, and on the home's value, since a new loan would use the appraisal of that time.` },
    { q: 'What makes a HECM credit line grow faster or slower?', a: `Only the note rate. The unused line grows by one twelfth of the note rate plus ${K.pct(P.mip.annual, 1)} each month. On an adjustable HECM the note rate follows its index, so the growth speeds up when rates rise and slows when they fall. Your age, the home's value and the economy after closing do not change it.` },
  ],
  body: (h) => `
<h2>The line at closing: ${K.usd(o.npl)} on ${K.usd(V)}</h2>
<p>A 70-year-old with a ${K.usd(V)} home and no mortgage starts from a principal limit of ${K.usd(o.pl)}: the home value times HUD's factor of ${K.f(o.factor)}. The upfront mortgage insurance premium (MIP) of ${K.pct(P.mip.upfront, 0)}, ${K.usd(o.imip)}, and the origination fee, ${K.usd(o.origination)}, are financed, so they become the opening balance. What is left, ${K.usd(o.npl)}, is the line of credit.</p>
<p>The first-year rule splits that line in two. Up to ${K.usd(o.firstYearCash)} can be drawn in the first 12 months, which is ${K.pct(P.firstYear.base, 0)} of the principal limit minus the costs paid at closing; the other ${K.usd(o.laterCash)} opens in month 13. Nothing has to be drawn: a borrower can leave the whole line untouched and still pay only the interest and premium on the ${K.usd(o.mo)} financed. The ${h.a('first-year-limit', 'first-year limit page')} has the rule in full.</p>

<h2>The same line at 75, 80, 85 and 90</h2>
<p>HUD's rules make the principal limit grow each month by one twelfth of the note rate plus the annual premium (${h.src('handbook', 'HUD Handbook 4000.1')}). The unused line is the principal limit minus the balance, so it grows too. At an initial note rate of ${K.pp(K.NOTE)} (the 1-year Treasury at ${K.pp(P.rates.cmt1Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the yearly growth is about ${K.pct(growth, 2)}:</p>
${h.table(['Age', 'Unused line', 'Loan balance', 'Principal limit'], growRows, `Line opened at ${AGE} on a ${K.usd(V)} home, nothing drawn, upfront MIP and origination financed, note rate held at ${K.pp(K.NOTE)}. Values at the end of each year.`, ['l', 'r', 'r', 'r'])}
<p>In 15 years the line more than doubles, and the balance grows too, from the ${K.usd(o.mo)} of financed costs to ${K.usd(at(85).balance)}. At 90 the unused line, ${K.usd(at(90).credit)}, is above today's home value. The line does not depend on what the home is worth later: a HECM is non-recourse, and the line keeps its size whether the market rises or falls.</p>
${h.mini('hecm', { t: 'Your line at 70', p: ['value'], d: { age: AGE, value: V, plan: 'loc' } })}

<h2>Opening at 70 or taking a loan at 85</h2>
<p>An older borrower gets a larger factor, so waiting has a pull of its own. On the same ${K.usd(V)} home at today's rates, a HECM taken out at 85 would offer ${K.usd(late85.npl)} after costs, and one at 90 would offer ${K.usd(late90.npl)}. The line opened at 70 and left alone reaches ${K.usd(at(85).credit)} and ${K.usd(at(90).credit)} at those ages.</p>
<p>The comparison rests on two assumptions worth stating. It holds the note rate at today's level for 20 years, and it holds the home at ${K.usd(V)}: a later loan would be sized on the later appraisal, up to the limit of that year. It also ignores the interest and premium that the early line costs on its financed balance, ${K.usd(at(85).balance)} by 85 in the table. Those are the trade-offs, not a recommendation either way.</p>

<h2>How much the note rate changes the line</h2>
<p>On an adjustable HECM the note rate follows its index, here the 1-year Treasury, so the growth of the line is not fixed at closing. The same ${K.usd(o.npl)} line after 15 years, untouched, at three note rates held constant:</p>
${h.table(['Note rate', 'Yearly growth with MIP', 'Line at 85'], noteRates.map((r) => [K.pp(r), K.pct(Math.pow(1 + (r / 100 + P.mip.annual) / 12, 12) - 1, 2), K.usd(K.credit(o.npl, r, 180))]), `Unused line of ${K.usd(o.npl)} at ${AGE}, compounded monthly at (note rate + ${K.pct(P.mip.annual, 1)}) ÷ 12 for 180 months.`, ['l', 'r', 'r'])}
<p>Higher rates make the line grow faster and the balance on anything drawn grow faster too. The ${h.a('reverse-mortgage-rates', 'rates page')} explains the indexes, and the ${h.a('line-of-credit', 'line of credit calculator')} grows any amount.</p>
${h.mini('loc', { t: 'Grow the line at another note rate', p: ['nr'], d: { amt: Math.round(o.npl), nr: K.NOTE } })}

<h2>Using the line years later</h2>
<p>A line opened at 70 is meant to be drawn at some point, and the regulation sets how. A request for a line of credit payment is answered within five business days of the lender receiving it in writing (${h.src('cfr_206', '24 CFR 206.27')}). After the first year, any amount can be drawn as long as it does not exceed the principal limit minus the balance and any set-asides (24 CFR 206.26). The same section allows a switch from the line to monthly payments, with a fee capped by HUD.</p>
<p>The line also has limits that a growth table hides. It stops when the loan becomes due, whether at the death of the last borrower, a sale, or a move out of the home. It does not pass to a spouse who is not on the loan: under the deferral rules for an ${h.a('non-borrowing-spouse', 'eligible non-borrowing spouse')}, no disbursement is allowed after the borrower's death. And it is not savings: the growth is room to borrow more, with interest and premium charged on every dollar once drawn.</p>

<h2>Drawing the first-year maximum instead</h2>
<p>A borrower who takes the ${K.usd(o.firstYearCash)} allowed in year one at closing starts with a larger balance and a smaller line. The unused part still grows: ${K.usd(drawnAt(80).credit)} at 80 and ${K.usd(drawnAt(85).credit)} at 85, while the balance reaches ${K.usd(drawnAt(80).balance)} and ${K.usd(drawnAt(85).balance)}. Each dollar left in the line grows at the same rate as each dollar owed.</p>
<p>A fixed-rate HECM has no growing line at all. It pays a single lump sum at closing, ${K.usd(fixedLump.firstYearCash)} on this home at a fixed rate of ${K.pp(K.EXP)}, and the rest of the principal limit can never be drawn. The ${h.a('lump-sum', 'lump sum page')} covers that choice.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, value: V, plan: 'loc' },
  related: ['line-of-credit', 'age-65', 'age-75', 'first-year-limit', 'reverse-mortgage-rates', 'lump-sum'],
  sources: ['handbook', 'hud_plf', 'cfr_206', 'treasury_yield', 'ml_2017_12'],
});
