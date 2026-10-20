import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.origination;
// Worked case of the page: a 77-year-old with a $150,000 house and no mortgage.
const V = 150000, AGE = 77;
const rT = K.rateT(K.EXP);
const o = K.loan({ age: AGE, value: V });
const fx = K.loan({ age: AGE, value: V, fixed: true });
const CC = 2000;
const withCc = K.loan({ age: AGE, value: V, closing: CC });
const fixedCost = K.imip(V) + K.orig(V);
const ages = [62, 66, 69, 72, 75, 78, 81, 84, 88, 92];
const rows = ages.map((a) => K.loan({ age: a, value: V }));
const r62 = rows[0], r92 = rows[rows.length - 1];
// Where the fee floor bites: small values around $125,000.
const FLOOR_AT = O.floor / O.tier1Rate;
const small = [90000, 100000, 110000, FLOOR_AT, V, 175000];
const s100 = K.loan({ age: AGE, value: 100000 });
const yr10 = K.project({ age: AGE, value: V }, 10)[9];
const grown = K.balance(fixedCost, K.NOTE, 120);
const clear = (a: number) => { const x = K.loan({ age: a, value: V }); return x.pl - x.imip - x.origination; };

export default defineGuide({
  id: 'home-150k',
  group: 'home',
  order: 10,
  slug: 'reverse-mortgage-on-150000-home',
  nav: 'Reverse mortgage on a $150,000 home',
  card: 'Fixed charges on a small home, and the share of the loan they take',
  title: 'Reverse Mortgage on a $150,000 Home 2026: Amounts, US',
  description: `Reverse mortgage on a $150,000 home in 2026: ${K.usd(K.imip(V))} of upfront insurance and ${K.usd(K.orig(V))} of origination come off a principal limit of ${K.usd(r62.pl)} at age 62 in our table.`,
  h1: 'A reverse mortgage on a $150,000 home',
  intro: `On a modest house, the costs of a HECM are a fixed share of the value but a larger bite of what you can borrow: here is that bite age by age, and where the fee floor starts to cost more.`,
  resume: `A ${K.usd(V)} home carries two charges of the same size on a HECM: ${K.usd(K.imip(V))} of upfront mortgage insurance, ${K.pct(P.mip.upfront, 0)} of the value, and up to ${K.usd(K.orig(V))} of origination fee, also ${K.pct(O.tier1Rate, 0)} at this value. Together, ${K.usd(fixedCost)} is ${K.pct(fixedCost / V, 0)} of the house, but a much larger share of what the loan can lend, because HUD's factor lends only part of the value. At an expected rate of ${K.pp(K.EXP)}, the principal limit is ${K.usd(r62.pl)} at 62, so the charges take ${K.pct(r62.mo / r62.pl, 1)} of it; at 92 it is ${K.usd(r92.pl)} and they take ${K.pct(r92.mo / r92.pl, 1)}. A 77-year-old owner with no mortgage can use ${K.usd(o.firstYearCash)} in the first 12 months and ${K.usd(o.laterCash)} more after that, or take about ${K.usd(o.tenure)} a month for life. Below ${K.usd(FLOOR_AT)} of value the fee stops shrinking at its ${K.usd(O.floor)} floor, which makes the bite larger still.`,
  faqs: [
    { q: 'What monthly payment for life can a $150,000 house give at 77?', a: `About ${K.usd(o.tenure)} a month on an adjustable HECM with no mortgage and no set-aside, sized on ${o.tenureMonths} months to age 100 at an expected rate of ${K.pp(K.EXP)}. The amount is fixed and continues as long as the house is your main residence and the loan is in good standing. An older age at closing raises it, because the months to age 100 are fewer.` },
    { q: 'Why does the origination fee stop falling on homes under $125,000?', a: `Because the rule in 24 CFR 206.31 sets a floor: a lender may charge up to ${K.usd(O.floor)} even when the percentage gives less. The ${K.pct(O.tier1Rate, 0)} formula reaches ${K.usd(O.floor)} exactly at ${K.usd(FLOOR_AT)}. On a ${K.usd(100000)} house the formula would give ${K.usd(O.tier1Rate * 100000)}, but the allowed fee is still ${K.usd(K.orig(100000))}, or ${K.pct(K.orig(100000) / 100000, 1)} of the value. A lender may still charge less.` },
    { q: 'How large a mortgage can a $150,000 house pay off with a HECM?', a: `With no other closing costs, the loan can clear a payoff of up to about ${K.usd(clear(62))} at 62, ${K.usd(clear(70))} at 70, ${K.usd(clear(AGE))} at ${AGE} and ${K.usd(clear(85))} at 85 without cash from you. That is the principal limit minus the upfront insurance and the fee. A larger balance means bringing the difference to closing, and appraisal and title charges lower each figure.` },
  ],
  body: (h) => `
<h2>Two charges of ${K.usd(K.imip(V))} each</h2>
<p>A HECM (Home Equity Conversion Mortgage, the FHA-insured reverse mortgage) charges an upfront mortgage insurance premium (MIP) of ${K.pct(P.mip.upfront, 0)} of the maximum claim amount (MCA), which here is simply the appraised value. On ${K.usd(V)}, that is ${K.usd(K.imip(V))} (${h.src('ml_2017_12', 'Mortgagee Letter 2017-12')}). The origination fee follows a separate formula, ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} plus ${K.pct(O.tier2Rate, 0)} above it, within a floor of ${K.usd(O.floor)} and a cap of ${K.usd(O.cap)} (${h.src('cfr_206_31', '24 CFR 206.31')}). A ${K.usd(V)} house sits entirely in the first band, so the most a lender may charge is also ${K.usd(K.orig(V))}.</p>
<p>So the two charges are equal, and both scale with the value: ${K.pct(fixedCost / V, 0)} of the house. On a larger home the fee grows more slowly and then stops at its cap, which is why the same two lines weigh less there. On a small one they stay at their full rate.</p>
<p>Neither charge has to be paid out of pocket. Both can be financed, which means they become the opening balance of the loan and grow with it. At a note rate held at ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} of annual MIP, the ${K.usd(fixedCost)} would have become about ${K.usd(grown.balance)} after ten years, with ${K.usd(grown.interest)} of interest and ${K.usd(grown.mip)} of insurance added and no cash drawn. On a house of this size, that growth alone is a visible slice of the equity left to you or your heirs, and it is the price of opening the line even if you never use it.</p>

<h2>The share of the loan the charges take, by age</h2>
<p>The charges are computed on the value, but they are paid out of the principal limit, which is only a fraction of it. HUD's principal limit factor (PLF) for the youngest borrower's age and the expected rate sets that fraction (${h.src('hud_plf', 'HUD factor table')}). At ${K.pp(K.EXP)}, read as ${K.pp(rT)}, it goes from ${K.f(r62.factor)} at 62 to ${K.f(r92.factor)} at 92. The same ${K.usd(fixedCost)} is therefore a heavy cut for a younger owner and a lighter one for an older owner.</p>
${h.table(['Age', 'Factor', 'Principal limit', 'Charges, share of it', 'First 12 months', 'From month 13', 'Monthly for life'], rows.map((x, i) => [String(ages[i]), K.f(x.factor), K.usd(x.pl), K.pct(x.mo / x.pl, 1), K.usd(x.firstYearCash), K.usd(x.laterCash), K.usd(x.tenure)]), `${K.usd(V)} home, no mortgage, expected rate ${K.pp(K.EXP)}, upfront MIP ${K.usd(K.imip(V))} and origination ${K.usd(K.orig(V))} financed, no third-party costs. HUD principal limit factor table in force since ${K.day(P.plf.effective)}.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The first-year column is ${K.pct(P.firstYear.base, 0)} of the principal limit minus the charges, because they count as obligations paid at closing. The monthly amount is the alternative: the net principal limit spread over the months to age 100, paid instead of the first two columns. If the expected rate rises, the factor falls while the charges, tied to the value, stay put, so their share of the loan grows in every row.</p>

<h2>Under ${K.usd(FLOOR_AT)}, the fee floor</h2>
<p>Below ${K.usd(FLOOR_AT)} of value the ${K.pct(O.tier1Rate, 0)} formula would give less than ${K.usd(O.floor)}, and the rule lets the lender charge the floor anyway. The insurance keeps falling with the value; the fee does not. The table shows how the combined share rises as the house gets cheaper.</p>
${h.table(['Home value', 'Origination cap', 'Upfront MIP', 'Both, share of value', `Share of principal limit at ${AGE}`], small.map((v) => { const x = K.loan({ age: AGE, value: v }); return [K.usd(v), K.usd(K.orig(v)), K.usd(K.imip(v)), K.pct((K.orig(v) + K.imip(v)) / v, 1), K.pct(x.mo / x.pl, 1)]; }), `Legal maximum origination fee (24 CFR 206.31) and upfront MIP at 2 % of the maximum claim amount. Last column: age ${AGE}, expected rate ${K.pp(K.EXP)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At ${K.usd(100000)}, for instance, a ${AGE}-year-old has a principal limit of ${K.usd(s100.pl)} and the two charges take ${K.pct(s100.mo / s100.pl, 1)} of it, against ${K.pct(o.mo / o.pl, 1)} at ${K.usd(V)}. A lender may accept a lower fee or none, and on a small loan that waiver is worth proportionally more.</p>
${h.mini('origination', { t: 'The fee floor on your value', p: ['value'], d: { value: 115000 } })}

<h2>Third-party charges come out of the first year</h2>
<p>Appraisal and title charges, among others, are not in the formulas above. They depend on your county and providers, so the only reliable figure is the one on the lender’s cost estimate. When they are financed, they join the obligations paid at closing. Under the ${K.pct(P.firstYear.base, 0)} rule, each dollar of them is a dollar less of first-year cash: with ${K.usd(CC)} of such charges, our ${AGE}-year-old would have ${K.usd(withCc.firstYearCash)} in the first 12 months instead of ${K.usd(o.firstYearCash)}. On a ${K.usd(V)} house that dollar is a larger part of the total than on a costlier one, which is why it is worth entering the real amount.</p>
${h.mini('hecm', { t: 'Add your closing costs', p: ['cc'], d: { age: AGE, value: V, cc: 1500 } })}

<h2>Our worked case: ${AGE}, a ${K.usd(V)} house, paid off</h2>
<p>At ${AGE} the factor is ${K.f(o.factor)}, so the principal limit is ${K.usd(o.pl)}. The two charges, ${K.usd(o.mo)}, are ${K.pct(o.mo / o.pl, 1)} of it. The first-year limit is ${K.usd(o.l17)}, and after the charges ${K.usd(o.firstYearCash)} remains to use. The other ${K.usd(o.laterCash)} opens in month 13. Left untouched for ten years at a note rate held at ${K.pp(K.NOTE)}, the line would offer about ${K.usd(yr10.credit)}, while the balance, only the financed charges and their growth, would be near ${K.usd(yr10.balance)}. Rates move, so read that as a size, not a promise.</p>
<p>A fixed-rate HECM pays a single advance at closing under the same first-year cap. For this owner, that is ${K.usd(fx.firstYearCash)} in hand, and the remaining ${K.usd(fx.forfeited)} of principal limit can never be drawn. On a small house that forgone amount is a large part of what the loan could offer; the ${h.a('lump-sum', 'lump sum page')} compares the two rate types, and the ${h.a('reverse-mortgage-costs', 'costs page')} lists every charge.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, value: V },
  related: ['reverse-mortgage-costs', 'origination-fee', 'reverse-mortgage-mip', 'lump-sum', 'home-200k'],
  sources: ['cfr_206_31', 'ml_2017_12', 'hud_plf', 'handbook'],
});
