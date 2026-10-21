import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, Lm = P.limits;
const L = K.LIMIT;
const rT = K.rateT(K.EXP);
// Worked case of the page: an 81-year-old whose home appraises at exactly the 2026 limit.
const AGE = 81;
const c = K.loan({ age: AGE, value: L });
const cf = K.loan({ age: AGE, value: L, fixed: true });
const ages = [62, 65, 70, 75, 80, 85, 90, 95];
const cols = [rT - 1, rT, rT + 1];
const rise = L - Lm.mca2025;
const f81 = K.plf(AGE, K.EXP);
const sp = K.loan({ age: 66, value: L });
const y10 = K.project({ age: AGE, value: L }, 10)[9];

export default defineGuide({
  id: 'home-at-limit',
  group: 'home',
  order: 50,
  slug: 'reverse-mortgage-home-at-the-limit',
  nav: 'Reverse mortgage on a $1,249,125 home',
  card: 'The 2026 limit itself: the largest HECM amount at each age',
  title: 'Reverse Mortgage on a $1,249,125 Home 2026: Top Amount, US',
  description: `The largest HECM loan of 2026, on a home worth the ${K.usd(L)} FHA limit: principal limit by age, an upfront MIP of ${K.usd2(K.imip(L))} and a fee capped at ${K.usd(P.origination.cap)}.`,
  h1: 'A reverse mortgage on a home worth exactly $1,249,125',
  intro: `The ceiling of the FHA program in 2026: where the figure comes from, the largest principal limit any borrower can reach at each age, and the highest upfront insurance bill.`,
  resume: `A home appraised at ${K.usd(L)} gets the largest HECM the FHA insures in 2026, because that figure is the national maximum claim amount set by Mortgagee Letter 2025-22: ${K.pct(Lm.mcaShareOfConforming, 0)} of the ${K.usd(Lm.conforming2026)} conforming loan limit, the same in every county. At an expected rate of ${K.pp(K.EXP)} (10-year Treasury plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}), the principal limit is ${K.usd(K.plf(62, K.EXP) * L)} at 62, ${K.usd(K.plf(75, K.EXP) * L)} at 75 and ${K.usd(K.plf(90, K.EXP) * L)} at 90, the highest amounts any borrower of those ages can reach this year. The upfront mortgage insurance is also at its peak: ${K.usd2(K.imip(L))}, ${K.pct(P.mip.upfront, 0)} of the limit. The origination fee stays at ${K.usd(P.origination.cap)}, only ${K.pct(P.origination.cap / L, 2)} of the value. An ${AGE}-year-old with no mortgage can use ${K.usd(c.firstYearCash)} in the first 12 months and ${K.usd(c.laterCash)} more later.`,
  faqs: [
    { q: 'Why is the 2026 HECM limit exactly $1,249,125?', a: `The National Housing Act links the HECM limit to Freddie Mac's national conforming loan limit, and the 2026 figure is ${K.pct(Lm.mcaShareOfConforming, 0)} of it. The conforming limit for 2026 is ${K.usd(Lm.conforming2026)}, and one and a half times that gives ${K.usd(L)}. Mortgagee Letter 2025-22 applies it to case numbers assigned from ${K.day(Lm.caseNumbersFrom)} through ${K.day(Lm.caseNumbersTo)}.` },
    { q: 'Is the HECM limit higher in Alaska or Hawaii?', a: `No. Mortgagee Letter 2025-22 states that the ${K.usd(L)} maximum claim amount also applies to the special exception areas: Alaska, Hawaii, Guam and the U.S. Virgin Islands. Unlike forward FHA loans, whose limits vary by county, the HECM has one figure for the whole country, so a home in Honolulu and one in rural Ohio worth the same face the same ceiling.` },
    { q: 'What is the most upfront mortgage insurance a HECM can cost in 2026?', a: `${K.usd2(K.imip(L))}. The premium is ${K.pct(P.mip.upfront, 0)} of the maximum claim amount, and the maximum claim amount cannot pass ${K.usd(L)}, so no 2026 HECM pays more, however valuable the home. It can be financed in the loan; it then accrues interest and annual MIP from the first month, like any amount you borrow.` },
    { q: 'How much more does the 2026 limit lend than the 2025 one?', a: `The ceiling went from ${K.usd(Lm.mca2025)} to ${K.usd(L)}, a rise of ${K.usd(rise)}. It only matters for homes appraised above ${K.usd(Lm.mca2025)}. For those, at ${AGE} and an expected rate read at ${K.pp(rT)}, the principal limit is ${K.usd(rise * f81)} higher. The 2026 figure applies to FHA case numbers assigned on or after ${K.day(Lm.caseNumbersFrom)}.` },
  ],
  body: (h) => `
<h2>Where the 2026 ceiling comes from</h2>
<p>The figure is not a round number because it is a multiple of another limit. ${h.src('ml_2025_22', 'Mortgagee Letter 2025-22')}, dated ${K.day(Lm.letterDate)}, sets the HECM maximum claim amount (MCA) for 2026 at ${K.usd(L)}, which it describes as ${K.pct(Lm.mcaShareOfConforming, 0)} of Freddie Mac's national conforming limit of ${K.usd(Lm.conforming2026)}. It applies to FHA case numbers assigned from ${K.day(Lm.caseNumbersFrom)} to ${K.day(Lm.caseNumbersTo)}, in every county, including Alaska, Hawaii, Guam and the Virgin Islands. In 2025 it was ${K.usd(Lm.mca2025)}, so the ceiling rose by ${K.usd(rise)}.</p>
<p>The MCA is the lesser of the appraised value and this limit (and of the price, for a purchase). A home appraised at exactly ${K.usd(L)} therefore counts in full: it is the most valuable home that loses nothing to the cap. The 2027 limit is not published yet; it is expected in ${Lm.next.expected}, under the same rule of ${K.pct(Lm.mcaShareOfConforming, 0)} of the next conforming limit. The ${h.a('hecm-limit', 'lending limit page')} follows its history.</p>

<h2>The largest principal limit anyone can get, by age</h2>
<p>With the MCA at the ceiling, the only things left to move the amount are the age of the youngest borrower and the expected rate, through HUD's principal limit factor (PLF) table. The middle column uses ${K.pp(rT)}, the table cell for today's example rate of ${K.pp(K.EXP)}; the side columns show one point lower and one point higher. No 2026 HECM can lend more than the figure in its row and column.</p>
${h.table(['Age', ...cols.map((r) => `At ${K.pp(r)}`)], ages.map((a) => [String(a), ...cols.map((r) => K.usd(K.plf(a, r) * L))]), `Principal limit on a maximum claim amount of ${K.usd(L)} (HUD factor × limit), before any cost. HUD principal limit factor table in force since ${K.day(P.plf.effective)}.`, ['l', 'r', 'r', 'r'])}
<p>A point of expected rate is worth tens of thousands of dollars at this size: at 70, from ${K.usd(K.plf(70, rT - 1) * L)} to ${K.usd(K.plf(70, rT + 1) * L)}. The expected rate is the 10-year Treasury rate plus the lender's margin, so at this size a quarter point of margin is worth ${K.usd((K.plf(70, rT) - K.plf(70, rT + 0.25)) * L)} of principal limit at 70.</p>
${h.mini('plf', { t: 'Your row of the table at the limit', p: ['age', 'margin'], d: { value: L, age: 77, margin: 1.75 } })}

<h2>The highest upfront insurance bill</h2>
<p>The upfront mortgage insurance premium (MIP) is ${K.pct(P.mip.upfront, 0)} of the MCA, the rate set by ${h.src('ml_2017_12', 'Mortgagee Letter 2017-12')}. At the ceiling that is ${K.usd2(K.imip(L))}, the largest premium any HECM pays in 2026. A home worth ${K.usd(2 * L)} pays the same amount, because its MCA is capped too. After closing, the annual premium of ${K.pct(P.mip.annual, 1)} is charged on the balance, not on the MCA, so it depends on how much you draw.</p>
<p>The origination fee reached its ${K.usd(P.origination.cap)} cap long before this value, at ${K.usd(400000)} (${h.src('cfr_206_31', '24 CFR 206.31')}). Here it is ${K.pct(P.origination.cap / L, 2)} of the home. Insurance and fee together come to ${K.usd(K.imip(L) + K.orig(L))}, ${K.pct((K.imip(L) + K.orig(L)) / c.pl, 1)} of the principal limit at ${AGE}.</p>
${h.mini('mip', { t: 'Annual MIP on a balance at the limit', p: ['bal', 'yrs'], d: { value: L, bal: 300000, yrs: 8 } })}

<h2>Our worked case: 81 years old, home worth $1,249,125, no mortgage</h2>
<p>At ${AGE} and ${K.pp(rT)}, HUD's factor is ${K.f(c.factor)}, so the principal limit is ${K.usd(c.pl)}. The obligations at closing are the ${K.usd2(c.imip)} premium and the ${K.usd(c.origination)} fee. With no debt, the first-year limit is ${K.pct(P.firstYear.base, 0)} of the principal limit, ${K.usd(c.idl)}, which leaves ${K.usd(c.firstYearCash)} to use after the charges. The remaining ${K.usd(c.laterCash)} opens after month 12 on an adjustable loan, and grows while unused.</p>
<p>On a fixed-rate HECM the picture changes sharply at this size. The fixed loan pays a single lump sum at closing, limited to the first-year amount: ${K.usd(cf.firstYearCash)} here. The other ${K.usd(cf.forfeited)} of principal limit can never be drawn. At this rate, no fixed-rate borrower of ${AGE} can leave more on the table in 2026, and the ${h.a('lump-sum', 'lump sum page')} looks at that trade.</p>
<h2>When a younger spouse sets the row</h2>
<p>The ceiling caps the value, not the age effect. If the ${AGE}-year-old is married to a spouse of 66, and the spouse is either a co-borrower or an eligible non-borrowing spouse, HUD's table is read at 66. On the same home the principal limit drops from ${K.usd(c.pl)} to ${K.usd(sp.pl)}, a difference of ${K.usd(c.pl - sp.pl)}, and the first-year cash from ${K.usd(c.firstYearCash)} to ${K.usd(sp.firstYearCash)}. The loan is sized for the younger spouse's longer horizon, and that costs principal limit. The ${h.a('non-borrowing-spouse', 'non-borrowing spouse page')} sets out the conditions.</p>

<h2>Ten years of an unused line at the ceiling</h2>
<p>Because the principal limit is the largest possible, so is the growth of an untouched line of credit. If the ${AGE}-year-old takes nothing beyond the financed charges, the unused line grows each month at the note rate plus ${K.pct(P.mip.annual, 1)}. At a note rate of ${K.pp(K.NOTE)} held for ten years, the room to borrow would reach about ${K.usd(y10.credit)} at ${AGE + 10}, while the balance, only the charges and their interest, would be near ${K.usd(y10.balance)}. Rates move, so read this as a size, not a forecast.</p>

<p>The calculator above reads the factor at the age and margin you enter, with the home value preset to the limit. Raising the value above ${K.usd(L)} changes nothing in the result; the ${h.a('home-over-limit', 'page on homes above the limit')} explains what happens to the part of the value the FHA does not count.</p>`,
  tool: 'plf',
  toolArg: { age: AGE, value: L },
  related: ['hecm-limit', 'principal-limit-factor', 'reverse-mortgage-mip', 'lump-sum', 'home-over-limit', 'home-750k'],
  sources: ['ml_2025_22', 'hud_lenders', 'hud_plf', 'ml_2017_12', 'cfr_206_31'],
});
