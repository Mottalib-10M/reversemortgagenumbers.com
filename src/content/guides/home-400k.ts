import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.origination;
const V = 400000;
const rT = K.rateT(K.EXP);
// Worked case of the page: a 73-year-old with a $400,000 home and $60,000 of mortgage left.
const c73 = K.loan({ age: 73, value: V, liens: 60000 });
const free73 = K.loan({ age: 73, value: V });
const yr10 = K.project({ age: 73, value: V }, 10)[9];
const ages = [62, 65, 68, 70, 75, 80, 85, 90];
const DEBT = 120000;
const rows = ages.map((a) => ({ a, o: K.loan({ age: a, value: V }), d: K.loan({ age: a, value: V, liens: DEBT }) }));
const fixedCost = K.imip(V) + K.orig(V);
const at62 = rows[0].d;
// Largest mortgage the loan can clear with no cash brought to closing (no other closing cost).
const clear = (a: number) => { const o = K.loan({ age: a, value: V }); return o.pl - o.imip - o.origination; };
const values = [300000, 350000, 375000, 400000, 450000, 500000];

export default defineGuide({
  id: 'home-400k',
  group: 'home',
  order: 30,
  slug: 'reverse-mortgage-on-400000-home',
  nav: 'Reverse mortgage on a $400,000 home',
  card: 'The value where the origination fee hits its cap, age by age',
  title: 'Reverse Mortgage on a $400,000 Home 2026: Amounts, US',
  description: `Reverse mortgage on a $400,000 home in 2026: the origination fee hits its ${K.usd(O.cap)} cap, and a HECM principal limit is ${K.usd(rows[0].o.pl)} at 62 and ${K.usd(rows[rows.length - 1].o.pl)} at age 90.`,
  h1: 'A reverse mortgage on a $400,000 home',
  intro: `What a $400,000 house is worth to a HECM at each age, with the house paid off or with a mortgage still on it, and why this value is where the fee rule stops growing.`,
  resume: `A $400,000 home is the exact value at which the HECM origination fee reaches its legal ceiling of ${K.usd(O.cap)}, so the two fixed charges of the loan are ${K.usd(K.imip(V))} of upfront mortgage insurance and ${K.usd(K.orig(V))} of origination, ${K.usd(fixedCost)} in all, or ${K.pct(fixedCost / V, 1)} of the value. The amount itself depends on age. At an expected rate of ${K.pp(K.EXP)} (10-year Treasury at ${K.pp(P.rates.cmt10Week, 2)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the principal limit is ${K.usd(rows[0].o.pl)} at 62, ${K.usd(K.loan({ age: 75, value: V }).pl)} at 75 and ${K.usd(rows[rows.length - 1].o.pl)} at 90. A 73-year-old owner with ${K.usd(60000)} still owed gets a principal limit of ${K.usd(c73.pl)}: the loan clears the mortgage and the two charges, leaves ${K.usd(c73.firstYearCash)} usable in the first 12 months and ${K.usd(c73.laterCash)} more after that. With ${K.usd(DEBT)} owed instead, a 62-year-old would have to bring ${K.usd(at62.shortfall)} to closing.`,
  faqs: [
    { q: 'How much equity do I need in a $400,000 house for a reverse mortgage?', a: `There is no fixed equity percentage. What counts is whether the principal limit covers the mortgage payoff and the costs. On a ${K.usd(V)} home with no other closing costs, the loan can clear a mortgage of up to ${K.usd(clear(62))} at 62, ${K.usd(clear(75))} at 75 and ${K.usd(clear(85))} at 85 without cash from you. A larger balance means bringing the difference to closing.` },
    { q: 'Would a $350,000 or $450,000 appraisal change the origination fee much?', a: `At ${K.usd(350000)} the cap is ${K.usd(K.orig(350000))}; at ${K.usd(450000)} it stays at ${K.usd(K.orig(450000))}, the same as at ${K.usd(V)}. Between ${K.usd(O.tier1Limit)} and ${K.usd(V)}, each ${K.usd(1000)} of appraised value adds ${K.usd(10)} of allowed fee; above it, nothing. The upfront insurance keeps moving: it is ${K.pct(P.mip.upfront, 0)} of the value up to the national limit, so ${K.usd(K.imip(450000) - K.imip(V))} more at ${K.usd(450000)}.` },
    { q: 'Is a $400,000 home enough to get monthly payments for life?', a: `Yes, the tenure option exists at every value; the amount is what changes. With no mortgage and no set-aside, a 73-year-old with a ${K.usd(V)} home would receive about ${K.usd(free73.tenure)} a month for as long as the home stays the main residence, sized on ${free73.tenureMonths} months. A mortgage paid at closing lowers that payment, because less of the principal limit is left to spread.` },
    { q: 'Does the lender have to charge the full $6,000?', a: `No. The ${K.usd(O.cap)} figure is the most the rule in 24 CFR 206.31 allows, and the same section says a lender may accept a lower fee. When you compare offers, look at the fee and the margin together: the margin sets the expected rate, and the expected rate sets the factor. The calculator lets you set the fee to zero and see the cash it frees.` },
  ],
  body: (h) => `
<h2>Where $400,000 sits in the fee rule</h2>
<p>The origination fee on a HECM (Home Equity Conversion Mortgage, the reverse mortgage insured by the FHA) has a formula written in federal rules: ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} of the maximum claim amount (MCA), plus ${K.pct(O.tier2Rate, 0)} of the part above it, never less than ${K.usd(O.floor)} and never more than ${K.usd(O.cap)} (${h.src('cfr_206_31', '24 CFR 206.31')}). On a ${K.usd(V)} house, the first part gives ${K.usd(O.tier1Rate * O.tier1Limit)} and the second ${K.usd(O.tier2Rate * (V - O.tier1Limit))}. The sum lands exactly on the cap.</p>
<p>That makes ${K.usd(V)} a turning point. Between ${K.usd(O.tier1Limit)} and ${K.usd(V)}, every ${K.usd(10000)} of appraised value adds ${K.usd(100)} to the fee a lender may charge. Above it, the fee stops rising while the loan keeps growing with the value, so the fee becomes a smaller and smaller share. The upfront mortgage insurance premium (MIP) behaves differently: it is a flat ${K.pct(P.mip.upfront, 0)} of the MCA, with no cap other than the national limit.</p>
${h.table(['Appraised value', 'Origination cap', 'Upfront MIP', 'Both, share of value'], values.map((v) => [K.usd(v), K.usd(K.orig(v)), K.usd(K.imip(v)), K.pct((K.orig(v) + K.imip(v)) / v, 2)]), 'Legal maximum origination fee (24 CFR 206.31) and upfront MIP at 2 % of the maximum claim amount. Third-party closing costs come on top and are not included.', ['l', 'r', 'r', 'r'])}
<p>Appraisal, title and recording charges are separate. They depend on the county and the providers, so the only reliable figures are the ones on the lender’s cost estimate; the calculator has a field for them.</p>

<h2>What a $400,000 house gives at each age</h2>
<p>The principal limit is the MCA times HUD's principal limit factor (PLF) for the age of the youngest borrower and the expected rate. Below, the house carries no mortgage, the expected rate is ${K.pp(K.EXP)} (read as ${K.pp(rT)} in HUD's table), the origination fee is at its cap and nothing else is charged. The first-year column is what you can use in the first 12 months; the last one is what opens in month 13, before any growth.</p>
${h.table(['Age', 'Factor', 'Principal limit', 'First 12 months', 'From month 13'], rows.map(({ a, o }) => [String(a), K.f(o.factor), K.usd(o.pl), K.usd(o.firstYearCash), K.usd(o.laterCash)]), `${K.usd(V)} home, no mortgage, expected rate ${K.pp(K.EXP)}, upfront MIP ${K.usd(K.imip(V))} and origination ${K.usd(K.orig(V))} financed. HUD principal limit factor table in force since ${K.day(P.plf.effective)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The gap between 62 and 90 is ${K.usd(rows[rows.length - 1].o.pl - rows[0].o.pl)} on the same house. Most of it comes after 75, where the factor climbs faster. In the first year, with no debt, the usable amount is ${K.pct(P.firstYear.base, 0)} of the principal limit minus the ${K.usd(fixedCost)} of charges, because those charges count as obligations paid at closing.</p>
${h.mini('hecm', { t: 'Your age on a $400,000 home', p: ['age'], d: { value: V, age: 67 } })}

<h2>With a mortgage still on the house</h2>
<p>Many owners of a ${K.usd(V)} house still owe on it. The HECM must pay that loan off at closing, and the payoff joins the charges as a mandatory obligation. Once obligations pass half the principal limit, the first-year rule switches: the lender may release the obligations plus ${K.pct(P.firstYear.extra, 0)} of the principal limit, and no more, until month 13. The next table keeps the same house and adds ${K.usd(DEBT)} of debt.</p>
${h.table(['Age', 'Obligations', 'First 12 months', 'From month 13', 'Cash to bring'], rows.map(({ a, d }) => [String(a), K.usd(d.mo), K.usd(d.firstYearCash), K.usd(d.laterCash), K.usd(d.shortfall)]), `${K.usd(V)} home with ${K.usd(DEBT)} of mortgage paid off at closing, plus upfront MIP and origination at the cap. Same rates as above.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At 62 the debt and the charges come to ${K.usd(at62.mo)}, more than the ${K.usd(at62.pl)} principal limit, so ${K.usd(at62.shortfall)} has to come from savings or a sale of other assets. At 65 the loan just covers everything and leaves ${K.usd(rows[1].d.firstYearCash)}. From 68 on, the first year leaves exactly ${K.pct(P.firstYear.extra, 0)} of the principal limit as cash, because the obligations are above half of it. The rest stays in the line of credit for later.</p>
<p>A simpler way to read it: the largest mortgage this house can clear with no cash from you is the principal limit minus the two charges. That is ${K.usd(clear(62))} at 62, ${K.usd(clear(70))} at 70, ${K.usd(clear(80))} at 80 and ${K.usd(clear(90))} at 90. Other closing costs lower each figure dollar for dollar.</p>
${h.mini('firstyear', { t: 'Try your mortgage balance', p: ['liens'], d: { value: V, age: 73, liens: 90000 } })}

<h2>Our worked case: 73 years old, $60,000 owed</h2>
<p>At 73 the factor is ${K.f(c73.factor)}, so the principal limit is ${K.usd(c73.pl)}. Obligations are the ${K.usd(60000)} payoff, ${K.usd(c73.imip)} of insurance and ${K.usd(c73.origination)} of origination: ${K.usd(c73.mo)}, below half of the principal limit, so the usual ${K.pct(P.firstYear.base, 0)} rule applies. The lender may disburse ${K.usd(c73.idl)} in year one; after the obligations, ${K.usd(c73.firstYearCash)} is yours to use. The other ${K.usd(c73.laterCash)} opens in month 13. The monthly mortgage payment on the old loan disappears, and for this owner that is the main change in the monthly budget. The ${h.a('existing-mortgage', 'page on paying off a mortgage')} looks at that case in more depth.</p>

<h2>The credit line of a $400,000 house after ten years</h2>
<p>An adjustable HECM's unused credit grows each month at the note rate plus ${K.pct(P.mip.annual, 1)} of annual MIP. Take the same 73-year-old, but debt-free, who draws nothing. After ten years, at a note rate held at ${K.pp(K.NOTE)}, the available credit would be about ${K.usd(yr10.credit)}, while the balance, made of the financed charges and their interest, would stand near ${K.usd(yr10.balance)}. That growth is borrowing room, not money earned, and it ends when the loan becomes due. The rate will not stay fixed, so treat the figure as an order of size. The ${h.a('line-of-credit', 'line of credit page')} has the method.</p>`,
  tool: 'hecm',
  toolArg: { age: 73, value: V, liens: 60000 },
  related: ['origination-fee', 'existing-mortgage', 'first-year-limit', 'line-of-credit', 'home-750k', 'age-75'],
  sources: ['cfr_206_31', 'hud_plf', 'hud_payplan', 'handbook'],
});
