import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, O = P.origination;
// Thresholds of the rule, derived from params: floor binds up to $125,000; the 1 % tier starts at $200,000; the cap is hit at $400,000.
const floorEnd = O.floor / O.tier1Rate;
const capAt = O.tier1Limit + (O.cap - O.tier1Rate * O.tier1Limit) / O.tier2Rate;
const fee = (v: number) => K.orig(K.mca(v));
const values = [100000, floorEnd, 150000, 175000, O.tier1Limit, 250000, 340000, capAt, 600000, P.limits.mca2026];
// Worked case of the page: youngest borrower 72, $260,000 home, first free and clear, then with a $50,000 mortgage.
const AGE = 72, VAL = 260000, LIEN = 50000;
const a = K.loan({ age: AGE, value: VAL }), a0 = K.loan({ age: AGE, value: VAL, origination: 0 });
const small = K.loan({ age: 80, value: 120000 }), grown = K.balance(K.orig(VAL), K.NOTE, 120);
const b = K.loan({ age: AGE, value: VAL, liens: LIEN }), b0 = K.loan({ age: AGE, value: VAL, liens: LIEN, origination: 0 });

export default defineGuide({
  id: 'origination-fee',
  group: 'money',
  order: 40,
  slug: 'reverse-mortgage-origination-fee',
  nav: 'Origination fee cap',
  card: 'The lender fee allowed by 24 CFR 206.31, from $2,500 to $6,000',
  title: 'Reverse Mortgage Origination Fee 2026: HUD Cap by Value, US',
  description: `Reverse mortgage origination fee in 2026: a minimum of ${K.usd(O.floor)} allowed, ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} plus ${K.pct(O.tier2Rate, 0)} above, capped at ${K.usd(O.cap)} from a ${K.usd(capAt)} home.`,
  h1: 'The HECM origination fee: the cap for each home value',
  intro: `The most a lender may charge to originate a HECM, read from the federal rule, with the fee for each home value and what a lower fee changes in your cash.`,
  resume: `A lender may charge a HECM origination fee of up to the greater of ${K.usd(O.floor)} and ${K.pct(O.tier1Rate, 0)} of the first ${K.usd(O.tier1Limit)} of the maximum claim amount plus ${K.pct(O.tier2Rate, 0)} of the part above it, with a hard ceiling of ${K.usd(O.cap)} (24 CFR 206.31(a)(1)). In practice, the ${K.usd(O.floor)} floor applies to every home worth ${K.usd(floorEnd)} or less, the fee is ${K.pct(O.tier1Rate, 0)} of the value up to ${K.usd(O.tier1Limit)} (${K.usd(O.tier1Rate * O.tier1Limit)}), each dollar above that adds one cent, and the ${K.usd(O.cap)} ceiling is reached at ${K.usd(capAt)}. A ${K.usd(VAL)} home carries a cap of ${K.usd(fee(VAL))}. The rule fixes a maximum, not a price: it says lenders may accept a lower fee, and the fee can be fully financed. For a ${AGE}-year-old with that home and no mortgage, a waived fee raises first-year cash from ${K.usd(a.firstYearCash)} to ${K.usd(a0.firstYearCash)}.`,
  faqs: [
    { q: 'Is the HECM origination fee negotiable?', a: `Yes, within the cap. 24 CFR 206.31 sets the most a lender may charge and states that lenders may accept a lower origination fee. Nothing sets a minimum a lender must charge. When you compare offers, set the fee beside the margin, since the margin is charged on the balance every month for the life of the loan and also lowers the principal limit through the expected rate.` },
    { q: 'Can the $6,000 ceiling on the origination fee rise?', a: `The regulation allows it. HUD may adjust the maximum by notice in line with the Consumer Price Index, in steps of ${K.usd(500)}, and only when the index increase applied to the ceiling would add more than ${K.usd(500)}. The ceiling used for 2026 on this site is ${K.usd(O.cap)}. Any change would come through a notice, and the calculators would be rebuilt from it.` },
    { q: 'Does a broker get paid on top of the origination fee?', a: `Not on top of it. The same paragraph of 24 CFR 206.31 lets the lender use the origination fee to pay for services of a sponsored third-party originator, and says such fees may be included in the origination fee. The total still cannot exceed the cap for the home. Appraisal, title and recording are separate items, each limited to what was actually paid.` },
    { q: 'Why is the fee on a $100,000 home higher than 2 % of its value?', a: `Because of the floor. The rule takes the greater of ${K.usd(O.floor)} and the percentage formula, so below ${K.usd(floorEnd)} the floor wins: on ${K.usd(100000)}, the formula would give ${K.usd(O.tier1Rate * 100000)}, and ${K.usd(O.floor)} may be charged instead, ${K.pct(O.floor / 100000, 1)} of the value. A lender can still charge less, since the floor is part of a maximum.` },
  ],
  body: (h) => `
<h2>The text of 24 CFR 206.31(a)(1)</h2>
<p>The fee rule is one paragraph of the HECM regulation. The loan origination fee limit is the greater of ${K.usd(O.floor)} or ${K.pct(O.tier1Rate, 0)} of the maximum claim amount up to ${K.usd(O.tier1Limit)}, plus ${K.pct(O.tier2Rate, 0)} of any portion above ${K.usd(O.tier1Limit)}. The total may not exceed ${K.usd(O.cap)}. The same paragraph says that lenders may accept a lower fee, that the fee may be used to pay a sponsored third-party originator, and that it may be fully financed with the mortgage. The ${h.src('cfr_206_31', 'section on eCFR')} has the full wording.</p>
<p>The base is the maximum claim amount, not the loan: the lesser of the appraised value and the ${K.usd(P.limits.mca2026)} limit of 2026. Two borrowers with the same home pay the same maximum fee even if one is 63 and borrows little while the other is 85 and borrows much more.</p>

<h2>Three thresholds: ${K.usd(floorEnd)}, ${K.usd(O.tier1Limit)}, ${K.usd(capAt)}</h2>
<p>The formula breaks into four zones. Up to ${K.usd(floorEnd)} of value, ${K.pct(O.tier1Rate, 0)} is less than the floor, so the floor of ${K.usd(O.floor)} is the cap. From there to ${K.usd(O.tier1Limit)}, the cap is ${K.pct(O.tier1Rate, 0)} of the value. Above ${K.usd(O.tier1Limit)}, each extra dollar of value adds only ${K.pct(O.tier2Rate, 0)}, so the cap climbs slowly from ${K.usd(O.tier1Rate * O.tier1Limit)} until it meets the ${K.usd(O.cap)} ceiling at ${K.usd(capAt)}. Beyond that, value no longer matters.</p>
${h.table(['Home value', 'Fee cap', 'Share of the value'], values.map((v) => [K.usd(v), K.usd(fee(v)), K.pct(fee(v) / K.mca(v), 2)]), `Highest origination fee allowed by 24 CFR 206.31(a)(1), by home value, for case numbers assigned in 2026. Above ${K.usd(P.limits.mca2026)}, the claim amount stops at the limit.`, ['l', 'r', 'r'])}
<p>Measured against the value, the fee is heaviest on small homes: ${K.pct(fee(100000) / 100000, 1)} at ${K.usd(100000)}, ${K.pct(O.tier1Rate, 0)} from ${K.usd(floorEnd)} to ${K.usd(O.tier1Limit)}, then a falling share, ${K.pct(fee(capAt) / capAt, 1)} at ${K.usd(capAt)} and under ${K.pct(0.005, 1)} near the national limit.</p>
${h.mini('origination', { t: 'Fee cap for your home value', p: ['value'], d: { value: 175000 } })}

<h2>What a lower fee changes in your cash</h2>
<p>The fee is a mandatory obligation, deducted from the principal limit at closing like the mortgage insurance. Its effect depends on which branch of the first-year rule applies. Take a borrower aged ${AGE} with a ${K.usd(VAL)} home and no mortgage. The principal limit is ${K.usd(a.pl)}, and the obligations (${K.usd(a.imip)} of upfront insurance plus a ${K.usd(a.origination)} fee) stay well under half of it. The first-year room is then ${K.pct(P.firstYear.base, 0)} of the principal limit minus the obligations, so every dollar of fee comes out of first-year cash: ${K.usd(a.firstYearCash)} with the full fee, ${K.usd(a0.firstYearCash)} if the lender waives it.</p>
<p>Now give the same household a ${K.usd(LIEN)} mortgage to pay off. The obligations reach ${K.usd(b.mo)}, more than half of the principal limit, and the first year switches to obligations plus ${K.pct(P.firstYear.extra, 0)}. First-year cash is ${K.usd(b.firstYearCash)} whether the fee is charged or not. The fee still costs money: the credit left after the first year falls from ${K.usd(b0.laterCash)} without it to ${K.usd(b.laterCash)} with it, and the ${K.usd(b.origination)} sits in the balance, accruing interest and annual insurance from day one.</p>
${h.mini('hecm', { t: 'Compare the maximum fee with a waived fee', p: ['orig'], d: { age: AGE, value: VAL, liens: LIEN } })}

<h2>Small homes: where the floor weighs most</h2>
<p>On a modest home, the ${K.usd(O.floor)} floor is a large slice of what the loan can lend. An 80-year-old with a ${K.usd(120000)} home has a principal limit of ${K.usd(small.pl)} at today's example rate. The maximum fee of ${K.usd(small.origination)} plus ${K.usd(small.imip)} of upfront insurance takes ${K.pct((small.origination + small.imip) / small.pl, 1)} of it before any third-party charge. On a home at the national limit, the ${K.usd(O.cap)} fee is a far thinner share. For small homes the gap between the cap and what a lender actually quotes is worth more, in proportion, than anywhere else in the table.</p>

<h2>Financed or paid at closing</h2>
<p>The regulation allows the fee to be fully financed; the HUD payment plan then counts it inside the mandatory obligations, line 10 of the form. You may also bring cash to closing to cover part of the costs; the form records it on line 11, and that amount never enters the balance. The difference shows over time. A ${K.usd(K.orig(VAL))} fee left in the balance at a note rate of ${K.pp(K.NOTE)} plus the annual premium becomes ${K.usd(grown.balance)} after ten years. Paid in cash, it stays ${K.usd(K.orig(VAL))}.</p>

<h2>Comparing offers on fee and margin</h2>
<p>Because the regulation only sets a ceiling, two lenders can quote very different fees on the same home. The fee is paid once; the margin is charged every month on the balance and also enters the expected rate that reads HUD's factor table. A lower fee with a higher margin can therefore leave you with a smaller principal limit and a faster-growing balance. The ${h.a('reverse-mortgage-rates', 'rates page')} shows what a quarter point of margin does to the factor, and the ${h.a('reverse-mortgage-costs', 'costs page')} lists the charges that come on top of the fee.</p>
<p>The fee should not be confused with the other lines at closing. It does not include the upfront mortgage insurance, which goes to the FHA, nor the appraisal, title, recording and credit report charges, which are passed on at what the lender paid for them. HUD's own calculator asks for the fee in the same field as those other closing costs, so read the lender's estimate line by line to see which part is the origination fee.</p>`,
  tool: 'origination',
  toolArg: { value: 340000 },
  related: ['reverse-mortgage-costs', 'reverse-mortgage-mip', 'reverse-mortgage-rates', 'first-year-limit', 'hecm-calculator'],
  sources: ['cfr_206_31', 'cfr_206', 'handbook', 'hud_calc_help', 'ml_2025_22'],
});
