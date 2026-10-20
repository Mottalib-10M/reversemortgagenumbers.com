import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.limits;
// Worked case of the page: a 73-year-old with a $1,400,000 home, above the national limit.
const AGE = 73, V = 1400000;
const big = K.loan({ age: AGE, value: V });
const uncapped = V * big.factor;
const rise = L.mca2026 - L.mca2025;
const refi = K.refi(L.mca2026, L.mca2025, P.mip.upfront);
const values = [600000, 900000, 1100000, L.mca2026, 1400000, 2000000, 3000000];

export default defineGuide({
  id: 'hecm-limit',
  group: 'money',
  order: 70,
  slug: 'hecm-lending-limit',
  nav: 'HECM lending limit 2026',
  card: `${K.usd(L.mca2026)} in 2026: what the national cap means for homes worth more`,
  title: 'HECM Lending Limit 2026: Maximum Claim Amount Cap, US',
  description: `HECM lending limit for 2026: ${K.usd(L.mca2026)}, 150 % of the ${K.usd(L.conforming2026)} conforming limit, up from ${K.usd(L.mca2025)} in 2025. The 2027 limit is expected in ${L.next.expected}.`,
  h1: 'The HECM lending limit for 2026',
  intro: `The single national cap on the home value a HECM can count, where it comes from, when it changes, and what it does to the loan on an expensive home.`,
  resume: `The FHA counts a home for at most ${K.usd(L.mca2026)} in a HECM for case numbers assigned from ${K.day(L.caseNumbersFrom)} to ${K.day(L.caseNumbersTo)}. ${L.letter}, dated ${K.day(L.letterDate)}, set that limit at 150 % of Freddie Mac's national conforming loan limit of ${K.usd(L.conforming2026)}. It applies in every state and territory, Alaska, Hawaii, Guam and the Virgin Islands included, and to traditional HECMs, HECMs for Purchase and HECM refinances alike. It rose by ${K.usd(rise)} from the ${K.usd(L.mca2025)} of 2025. The 2027 limit is not published yet, expected in ${L.next.expected}. Above the cap, more value adds nothing to the loan: a 73-year-old with a ${K.usd(V)} home gets the same ${K.usd(big.pl)} of principal limit as one whose home is worth exactly ${K.usd(L.mca2026)}, against ${K.usd(uncapped)} if the full value counted. The upfront premium also stops at ${K.usd(big.imip)}.`,
  faqs: [
    { q: 'What is the HECM limit for 2027?', a: `It is not published yet; HUD's announcement is expected in ${L.next.expected}. By statute it will be 150 % of the 2027 national conforming loan limit for Freddie Mac, which the Federal Housing Finance Agency sets. Until the new Mortgagee Letter appears, any 2027 figure you see is a projection. This page and the calculators will switch to the official number on the day it is published.` },
    { q: 'Does a HECM for Purchase use the same limit?', a: `Yes. ${L.letter} sets one maximum claim amount for traditional HECMs, HECMs for Purchase and HECM-to-HECM refinances. On a purchase, the maximum claim amount is the lesser of the appraised value, the contract price and ${K.usd(L.mca2026)}, so a buyer of a home priced above the cap brings the difference between the price plus costs and the principal limit as a down payment.` },
    { q: 'Which year’s limit applies if my loan closes in January?', a: `The limit follows the date the FHA case number was assigned, not the closing date. ${L.letter} applies to case numbers assigned on or after ${K.day(L.caseNumbersFrom)}. A loan whose case number was assigned in December 2026 keeps the 2026 limit even if it closes in January 2027; a case number assigned in January 2027 takes the new limit.` },
    { q: 'Does the limit cap the loan or the home value?', a: `The home value. The limit applies to the maximum claim amount, the lesser of the appraised value, the purchase price on a HECM for Purchase, and ${K.usd(L.mca2026)}. The loan is then only a share of that amount, set by HUD's factor for your age and rate. At ${AGE}, the largest possible principal limit at today's expected rate is ${K.usd(big.pl)}, well below the cap itself.` },
  ],
  body: (h) => `
<h2>Where the ${K.usd(L.mca2026)} comes from</h2>
<p>The National Housing Act ties the HECM limit to the conforming loan limit of Freddie Mac, the ceiling on ordinary mortgages that Freddie Mac can buy. FHA publishes a new limit for each calendar year by Mortgagee Letter. For 2026, ${h.src('ml_2025_22', L.letter)} sets the maximum claim amount at ${K.usd(L.mca2026)}, which is 150 % of the ${K.usd(L.conforming2026)} conforming limit. The figure is the same everywhere, including the four special exception areas, and the same for all three kinds of HECM: a traditional loan on the home you live in, a HECM for Purchase, and a refinance of an older HECM.</p>
${h.table(['Case numbers assigned in', 'HECM limit', 'Source'], [
  ['2025', K.usd(L.mca2025), 'Prior year limit'],
  ['2026', K.usd(L.mca2026), `${L.letter}, ${K.day(L.letterDate)}`],
  [String(L.next.year), `Not published yet, expected in ${L.next.expected}`, L.next.rule],
], 'National HECM maximum claim amount limits by year of FHA case number assignment.', ['l', 'r', 'l'])}
<p>What counts is the date the FHA case number was assigned, not the closing date. A file opened in late 2026 keeps the 2026 limit through closing, and HUD's lenders page (${h.src('hud_lenders', 'HUD single family lender resources')}) posts the new letter when it comes out.</p>

<h2>How the limit enters the calculation</h2>
<p>The lender starts from the maximum claim amount: the lesser of the appraised value, the national limit and, on a purchase, the sales price. That amount is multiplied by HUD's factor to get the principal limit, and it also sets the upfront mortgage insurance premium of ${K.pct(P.mip.upfront, 0)} and the origination fee cap. Below ${K.usd(L.mca2026)}, the limit plays no role. Above it, the value counted stops there.</p>
${h.table(['Home value', 'Maximum claim amount', `Principal limit at ${AGE}`, 'Cash in year one', 'Principal limit as a share of value'], values.map((v) => { const o = K.loan({ age: AGE, value: v }); return [K.usd(v), K.usd(o.mca), K.usd(o.pl), K.usd(o.firstYearCash), K.pct(o.pl / v, 1)]; }), `Age ${AGE}, expected rate ${K.pp(K.EXP)} (factor ${K.f(big.factor)}), no mortgage, origination fee at the legal maximum.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The last column tells the story. Up to the limit, a 73-year-old can borrow ${K.pct(big.factor, 1)} of the home value at today's rate. At ${K.usd(V)} that share drops to ${K.pct(big.pl / V, 1)}; at ${K.usd(3000000)} it is ${K.pct(big.pl / 3000000, 1)}. The most any 73-year-old can get from a HECM in 2026 at this rate is ${K.usd(big.pl)}, whatever the house is worth.</p>
${h.mini('hecm', { t: 'Try a home above the cap', p: ['value'], d: { age: 73, value: 1750000 } })}

<h2>What the cap changes for an expensive home</h2>
<p>Three costs stop growing with the home value. The upfront premium is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, so it never exceeds ${K.usd(K.imip(L.mca2026))} in 2026, even on a home worth twice the limit. The origination fee reached its ${K.usd(P.origination.cap)} cap long before, at a ${K.usd(400000)} home value. And the annual premium is charged on the balance, which the principal limit keeps in check.</p>
<p>The equity above the limit is not lost, only left out of the loan. The whole home still secures the HECM, and when the loan ends, the balance is repaid from the sale and the rest belongs to you or your heirs. Heirs who keep the home settle for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value, the real value of the home rather than the capped one. On a home worth far more than the limit, the balance would have to grow for many years before it came close to that value.</p>
${h.mini('mip', { t: 'Premiums on a capped loan', p: ['bal', 'yrs'], d: { value: 2000000, bal: 320000, yrs: 8 } })}

<h2>The yearly change</h2>
<p>The limit moves with the conforming limit, so it rises in years when the conforming limit rises. From 2025 to 2026 it went up by ${K.usd(rise)}. For a borrower of ${AGE} whose home is worth more than both limits, that adds ${K.usd(rise * big.factor)} of principal limit at today's factor. The ${L.next.year} limit is not published yet; it is expected in ${L.next.expected}. Rates can move by more than that in a few weeks: at ${AGE}, a quarter point on the expected rate changes the principal limit on a capped home by ${K.usd(Math.abs(big.pl - K.loan({ age: AGE, value: V, expected: K.EXP + 0.25 }).pl))}. The ${h.a('home-over-limit', 'page for homes above the limit')} and the ${h.a('reverse-mortgage-rates', 'rates page')} cover both sides.</p>

<h2>A higher limit and an existing HECM</h2>
<p>The lender fixes the maximum claim amount at origination, so a higher limit reaches an existing borrower only through a HECM-to-HECM refinance. The premium on that refinance is reduced by a federal formula: the upfront premium due is capped at 3 % of the increase in the maximum claim amount, minus the upfront premium already paid on the old loan. Take a loan opened in 2025 at the ${K.usd(L.mca2025)} limit, with ${K.usd(K.imip(L.mca2025))} of upfront premium paid. Refinanced in 2026 at ${K.usd(L.mca2026)}, 3 % of the ${K.usd(rise)} increase is ${K.usd(P.refi.imipLimitFactor * rise)}, less than the premium already paid, so ${refi.due > 0 ? `${K.usd(refi.due)} is due` : 'no new upfront premium is due'}. The extra room from the higher limit alone, ${K.usd(rise * big.factor)} at ${AGE}, would still have to carry an origination fee of up to ${K.usd(P.origination.cap)} and third-party costs, and the lender must show you that comparison in writing before you go ahead. The ${h.a('hecm-refinance', 'refinance page')} runs the full test.</p>`,
  tool: 'hecm',
  toolArg: { age: 73, value: 1400000 },
  related: ['home-over-limit', 'home-at-limit', 'principal-limit-factor', 'reverse-mortgage-mip', 'hecm-for-purchase'],
  sources: ['ml_2025_22', 'hud_lenders', 'handbook', 'cfr_206_31', 'hud_plf'],
});
