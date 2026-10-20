import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const L = K.LIMIT;
const H = P.eligibility.maxCashOutHeirsShare;
// Worked case of the page: a 74-year-old whose home appraises at $1,800,000, no mortgage.
const AGE = 74, V = 1800000;
const c = K.loan({ age: AGE, value: V });
const values = [900000, L, 1500000, V, 2500000, 3500000];
const vRows = values.map((v) => ({ v, o: K.loan({ age: AGE, value: v }) }));
// Balance if the first-year cash is drawn at closing and nothing after, note rate held constant.
const drawn = c.financed + c.firstYearCash;
const years = [10, 15, 20, 25];
const bRows = years.map((y) => ({ y, b: K.balance(drawn, K.NOTE, 12 * y).balance }));
const b25 = bRows[bRows.length - 1].b;
const hBig = K.heirs(b25, V), hLim = K.heirs(b25, L);
const young = K.loan({ age: 63, value: 2400000 });
const y10 = K.project({ age: AGE, value: V }, 10)[9];

export default defineGuide({
  id: 'home-over-limit',
  group: 'home',
  order: 60,
  slug: 'reverse-mortgage-over-the-fha-limit',
  nav: 'Reverse mortgage above the FHA limit',
  card: 'Homes worth more than $1,249,125: what counts and what heirs keep',
  title: 'Reverse Mortgage Above the FHA Limit in 2026: High Value, US',
  description: `Reverse mortgage above the 2026 FHA limit: a HECM counts the home for ${K.usd(L)}, so a ${K.usd(V)} home reaches ${K.pct(c.pl / V, 0)} of its value at 74, plus the heirs rule.`,
  h1: 'A reverse mortgage on a home worth more than the FHA limit',
  intro: `When the house is worth more than ${K.usd(L)}: the share of its value a HECM can reach, the costs that stop growing, and why the extra value still matters to the heirs.`,
  resume: `Above ${K.usd(L)}, a HECM treats the home as if it were worth exactly ${K.usd(L)}, the national maximum claim amount for 2026, so every dollar of value beyond it adds nothing to the loan. A ${K.usd(V)} home at 74, with an expected rate of ${K.pp(K.EXP)} (10-year Treasury plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), has a principal limit of ${K.usd(c.pl)}, the same as a home at the limit: that is ${K.pct(c.pl / V, 1)} of its value, against ${K.pct(c.pl / L, 1)} for a home worth ${K.usd(L)}. The charges stop growing too: ${K.usd2(c.imip)} of upfront mortgage insurance and a ${K.usd(c.origination)} fee, whatever the value. The part the FHA ignores still counts at the end, because heirs who keep the home settle for the lesser of the balance and ${K.pct(H, 0)} of the appraised value then, not of the limit. Private lenders also sell proprietary reverse mortgages; they are not insured by the FHA and are not computed on this site.`,
  faqs: [
    { q: 'Does a $2 million home get a bigger HECM than a $1.3 million one?', a: `No. Both have a maximum claim amount of ${K.usd(L)} in 2026, so at the same age and expected rate they get the same principal limit, the same ${K.usd2(K.imip(L))} premium and the same first-year amount. At ${AGE}, that is ${K.usd(c.pl)} of principal limit for either house. The extra value changes only what is left to the owner or the heirs when the loan ends.` },
    { q: 'What is a jumbo or proprietary reverse mortgage?', a: `A reverse mortgage offered by a private lender outside the FHA program, the kind of loan an owner above the HECM limit may be shown. It does not use HUD's factor table, the ${K.pct(P.mip.upfront, 0)} insurance premium or the ${K.usd(L)} cap, and each lender sets its own terms. We do not model these loans and publish no figure for them; their amounts and costs can only be read on a lender's own disclosures.` },
    { q: 'Do heirs owe 95 % of $1,249,125 or 95 % of the real value?', a: `Of the real value. The 95 % rule in 24 CFR 206.125 refers to the appraised value of the home when the loan becomes due, not to the maximum claim amount. On a ${K.usd(V)} home that keeps its value, the threshold is ${K.usd(H * V)}. In the worked case of this page, where the owner draws the first-year maximum at 74, the balance is still under that threshold after 25 years if the value holds.` },
  ],
  body: (h) => `
<h2>The value the FHA counts</h2>
<p>A HECM (Home Equity Conversion Mortgage, the FHA-insured reverse mortgage) is sized on the maximum claim amount (MCA): the lesser of the appraised value and the national limit, which is ${K.usd(L)} for 2026 under ${h.src('ml_2025_22', 'Mortgagee Letter 2025-22')}. The definition sits in ${h.src('cfr_206', '24 CFR 206.3')} and in HUD Handbook 4000.1. On a home appraised above the limit, the lender works with ${K.usd(L)} from the first line of the payment plan. HUD's principal limit factor for the borrower's age and expected rate then applies to that number, not to the appraisal.</p>
<p>So the useful question is not how much the house is worth, but how much of its worth the loan can reach. The table holds the age at ${AGE} and the rate at today's example, and moves the value.</p>
${h.table(['Appraised value', 'Counted (MCA)', 'Principal limit', 'Share of the value', 'Value not counted'], vRows.map(({ v, o }) => [K.usd(v), K.usd(o.mca), K.usd(o.pl), K.pct(o.pl / v, 1), K.usd(Math.max(0, v - L))]), `Borrower aged ${AGE}, expected rate ${K.pp(K.EXP)} read at ${K.pp(K.rateT(K.EXP))} in HUD's factor table, 2026 limit ${K.usd(L)}. Principal limit before any cost.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Up to the limit, the share is simply the factor, ${K.pct(c.factor, 1)} at ${AGE}. Past it, the principal limit freezes and the share falls as the value rises: ${K.pct(c.pl / V, 1)} at ${K.usd(V)}, ${K.pct(vRows[vRows.length - 1].o.pl / 3500000, 1)} at ${K.usd(3500000)}.</p>

<h2>Charges that stop growing</h2>
<p>Both upfront charges are tied to the MCA, so they freeze at the limit as well. The upfront mortgage insurance premium (MIP) is ${K.pct(P.mip.upfront, 0)} of ${K.usd(L)}, ${K.usd2(K.imip(L))}, and the origination fee is held at ${K.usd(P.origination.cap)} by ${h.src('cfr_206_31', '24 CFR 206.31')}. On a ${K.usd(V)} home they add up to ${K.pct((K.imip(L) + K.orig(L)) / V, 2)} of the value. Third-party costs such as the appraisal and title insurance come on top; only the lender’s cost estimate gives them.</p>
<p>Age still matters as much as below the limit. A 63-year-old with a ${K.usd(2400000)} house gets a principal limit of ${K.usd(young.pl)} and ${K.usd(young.firstYearCash)} in the first 12 months, well under the ${AGE}-year-old's ${K.usd(c.firstYearCash)}, although the house is worth more.</p>
${h.mini('hecm', { t: 'Try an age on a home above the limit', p: ['age'], d: { value: 2400000, age: 66 } })}

<h2>Our worked case: 74, a $1,800,000 home, no mortgage</h2>
<p>The MCA is ${K.usd(c.mca)}. At ${AGE}, HUD's factor is ${K.f(c.factor)}, so the principal limit is ${K.usd(c.pl)}. The ${K.usd2(c.imip)} premium and the ${K.usd(c.origination)} fee are financed. With no debt, the first-year limit is ${K.pct(P.firstYear.base, 0)} of the principal limit, ${K.usd(c.idl)}, which leaves ${K.usd(c.firstYearCash)} of cash in the first 12 months and ${K.usd(c.laterCash)} more from month 13 on an adjustable loan. Taken as monthly payments for life instead, the net principal limit would give about ${K.usd(c.tenure)} a month.</p>
<p>The cap applies at closing, not to growth. If the owner leaves the line of credit untouched, the unused part grows each month at the note rate plus ${K.pct(P.mip.annual, 1)}. At ${K.pp(K.NOTE)} held for ten years, the room to borrow at ${AGE + 10} would be about ${K.usd(y10.credit)}, against a balance near ${K.usd(y10.balance)} made only of the financed charges and their interest. That is far more than the ${K.usd(c.firstYearCash)} of year one, yet still tied to a home counted at ${K.usd(L)}. Rates will move, so the figure gives a size, not a promise. The ${h.a('line-of-credit', 'line of credit page')} has the method.</p>

<h2>Heirs: 95 % of the real value, not of the limit</h2>
<p>When the loan becomes due, the heirs can pay it off, sell, or hand over the deed. Under ${h.src('cfr_206', '24 CFR 206.125')}, the price a sale must reach to settle the loan cannot be set above ${K.pct(H, 0)} of the appraised value at that time. That appraisal is the real one, with no cap. On a home above the limit, the gap between the two numbers works in the family's favor: the loan was sized on ${K.usd(L)}, while the protection is measured on the full value.</p>
<p>Take the worked case and suppose the owner draws the full ${K.usd(c.firstYearCash)} at closing and nothing after. With the note rate held at ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} of annual MIP, the balance grows as below. The last two columns compare it with ${K.pct(H, 0)} of a home still worth ${K.usd(V)}, and with ${K.pct(H, 0)} of a home worth exactly ${K.usd(L)}.</p>
${h.table(['Years', 'Age', 'Loan balance', `${K.pct(H, 0)} of ${K.usd(V)}`, `${K.pct(H, 0)} of ${K.usd(L)}`], bRows.map(({ y, b }) => [String(y), String(AGE + y), K.usd(b), K.usd(H * V), K.usd(H * L)]), `Balance of ${K.usd(drawn)} (first-year cash plus financed charges) at ${K.pp(K.NOTE)} + ${K.pct(P.mip.annual, 1)} MIP, compounded monthly, no repayment. Home values held flat for the comparison.`, ['l', 'l', 'r', 'r', 'r'])}
<p>After 25 years the balance would be ${K.usd(b25)}. Heirs of the ${K.usd(V)} home ${hBig.nonRecourse ? `could settle for ${K.usd(hBig.payoff)}` : `would repay the balance and keep about ${K.usd(V - hBig.payoff)} of value`}; heirs of a home worth ${K.usd(L)} ${hLim.nonRecourse ? `could settle for ${K.usd(hLim.payoff)}, ${K.pct(H, 0)} of its value, with FHA insurance covering the rest` : `would repay the balance`}. The ${h.a('heirs', 'heirs page')} has the calculator for any balance.</p>
${h.mini('heirs', { t: 'Balance against 95 % of your value', p: ['value'], d: { bal: 900000, value: 2100000 } })}

<h2>Proprietary reverse mortgages are not on this site</h2>
<p>Private lenders offer reverse mortgages outside the FHA program, and an owner above the limit may be shown one. They are not HECMs: they do not use HUD's factor table, the FHA premiums or the ${K.usd(L)} cap, and the protections of 24 CFR part 206 do not govern them. Their amounts, rates and fees are set by each lender, and we have no official source to compute them, so this site gives no figure for them. Every number on this page is for the FHA-insured loan.</p>`,
  tool: 'hecm',
  toolArg: { age: AGE, value: V },
  related: ['hecm-limit', 'heirs', 'home-at-limit', 'reverse-mortgage-mip', 'line-of-credit', 'reverse-mortgage-costs'],
  sources: ['ml_2025_22', 'cfr_206', 'cfr_206_31', 'hud_plf', 'handbook'],
});
