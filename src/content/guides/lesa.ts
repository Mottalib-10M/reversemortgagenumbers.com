import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lesa, OIG = P.oig;
// Worked case of the page: youngest borrower 77, $330,000 home, $5,400 a year of property taxes and insurance.
const AGE = 77, VAL = 330000, TAX = 5400, MRIS = 180;
const yrs = K.talc(AGE) ?? 0;
const full = K.loan({ age: AGE, value: VAL, lesa: 'full', charges: TAX });
const none = K.loan({ age: AGE, value: VAL });
const part = K.loan({ age: AGE, value: VAL, lesa: 'partial', charges: TAX, mris: MRIS });
const c = (K.EXP / 100 + P.mip.annual) / 12;
const proj = K.project({ age: AGE, value: VAL, lesa: 'full', charges: TAX }, yrs);
const left = proj[proj.length - 1].lesa;
const ages = Object.keys(L.lifeExpectancy).map(Number).filter((a) => a % 3 === 2 || a === 95);
const monthly = L.factor * TAX / 12;

export default defineGuide({
  id: 'lesa',
  group: 'money',
  order: 50,
  slug: 'life-expectancy-set-aside',
  nav: 'Life expectancy set-aside (LESA)',
  card: 'The share of the loan held back for taxes and insurance, by HUD formula',
  title: 'Life Expectancy Set-Aside 2026: HECM LESA Calculator, US',
  description: `HECM life expectancy set-aside for 2026: HUD's formula on 120 % of your taxes and insurance, e.g. ${K.usd(full.lesa)} held back at ${AGE} for ${K.usd(TAX)} a year of charges.`,
  h1: 'The life expectancy set-aside (LESA) for taxes and insurance',
  intro: `How much of a HECM is held back to pay property taxes and insurance when the lender requires it or you ask for it, computed with HUD's formula and the federal life table.`,
  resume: `A life expectancy set-aside, or LESA, is the part of the principal limit a HECM lender holds back to pay property taxes, hazard insurance and flood insurance for the expected rest of your life. HUD's formula takes ${K.pct(L.factor - 1, 0)} more than today's charges, spreads them over the youngest borrower's life expectancy from the Regulation Z table, and discounts each month at the expected rate plus ${K.pct(P.mip.annual, 1)}. At ${AGE}, that table gives ${yrs} years. With ${K.usd(TAX)} a year of taxes and insurance and an expected rate of ${K.pp(K.EXP)}, the fully funded LESA is ${K.usd(full.lesa)}, ${K.pct(full.lesa / full.pl, 1)} of a ${K.usd(full.pl)} principal limit on a ${K.usd(VAL)} home. The first year's ${K.usd(full.lesaYear1)} counts as an obligation, and the rest is removed from what you can ever draw: first-year cash falls from ${K.usd(none.firstYearCash)} to ${K.usd(full.firstYearCash)}, later credit from ${K.usd(none.laterCash)} to ${K.usd(full.laterCash)}. A May 2026 audit by HUD's Inspector General found that set-asides were running out early for an estimated ${K.num(OIG.borrowers)} borrowers.`,
  faqs: [
    { q: 'Can I choose a set-aside even if the lender does not require one?', a: `Yes. When the financial assessment does not call for one, 24 CFR 206.205 lets you elect a fully funded LESA at closing, on a fixed or adjustable HECM. The lender then pays the taxes and insurance directly. The election cannot be cancelled later. If the set-aside runs dry, the bills become yours again, as they would have been without it.` },
    { q: 'Is the money left in a set-aside owed back when the loan ends?', a: `No. A payment from the set-aside joins the loan balance only when the lender sends it to the tax office or the insurer, so what is never paid out is never borrowed. The regulation adds that no unused set-aside funds are disbursed once the loan is due and payable or during a deferral period for a non-borrowing spouse.` },
    { q: 'Is the life expectancy in the formula my own?', a: `No, it is a table value. HUD uses the life expectancy column of Appendix L to Regulation Z, drawn from the U.S. Decennial Life Tables for 1979 to 1981 for females, rounded to a whole year. Everyone of the same age gets the same figure, ${yrs} years at ${AGE}. The Inspector General's 2026 audit pointed out that HUD had not updated these tables since they were published in 1985.` },
    { q: 'Why is a partial set-aside paid to me and not to the tax office?', a: `Because it only covers a gap in your budget, not the whole bill. The Handbook says a partially funded LESA is paid to the borrower twice a year, and the borrower adds personal funds and pays the taxing authority and insurer on time. With a fully funded LESA, the lender pays them directly. A partial amount above ${K.pct(L.partialShareCap, 0)} of the full one must become a full LESA.` },
  ],
  body: (h) => `
<h2>HUD's formula, term by term</h2>
<p>The Handbook gives one formula for the fully funded set-aside: 1.2 × (PC ÷ 12) × [(1 + c)<sup>m+1</sup> − (1 + c)] ÷ [c × (1 + c)<sup>m</sup>]. PC is the current yearly total of property taxes, hazard insurance and flood insurance. Dividing by 12 gives the monthly charge, and the factor ${K.dec(L.factor, 1)} adds a cushion for increases over the borrower's life. The rest is the value today of that monthly charge paid at the start of each month for m months, discounted at c.</p>
<p>Here c is one twelfth of the expected rate plus the annual mortgage insurance rate, using the same expected rate that reads the principal limit factor. At ${K.pp(K.EXP)} + ${K.pct(P.mip.annual, 1)}, c is ${K.dec(c * 100, 4)} % a month. And m is the life expectancy of the youngest borrower in years, times 12. The age is rounded up when the next birthday falls less than 183 days after the estimated closing date. For the ${AGE}-year-old in the example, ${K.usd(TAX)} a year gives ${K.usd2(monthly)} a month after the cushion, over ${yrs * 12} months: ${K.usd(full.lesa)}.</p>
${h.mini('lesa', { t: 'Set-aside at another age', p: ['age'], d: { age: 69, tax: 7800, value: 410000 } })}

<h2>The life table behind the set-aside</h2>
<p>The years come from Appendix L to Regulation Z, the table lenders already use for the total annual loan cost disclosure. Its loan period 2 is the life expectancy of the youngest borrower in the U.S. Decennial Life Tables for 1979 to 1981 for females, rounded to the nearest whole year. It falls from ${K.talc(62)} years at 62 to ${K.talc(95)} at 95 and over, and the set-aside falls with it.</p>
${h.table(['Age', 'Years in the table', 'Months (m)', `LESA for ${K.usd(TAX)} a year`], ages.map((a) => [String(a), String(K.talc(a)), String((K.talc(a) ?? 0) * 12), K.usd(K.lesa(TAX, a, K.EXP))]), `Life expectancy from Regulation Z, Appendix L, column of loan period 2, and the fully funded set-aside at an expected rate of ${K.pp(K.EXP)}. Ages 95 and over use 95.`, ['l', 'r', 'r', 'r'])}
<p>Two ages one year apart can share the same figure, as at 74 and 75, both read as ${K.talc(74)} years, because the table rounds to whole years. Below 62 the table has no row; this applies only to a younger eligible non-borrowing spouse, and the lender then sets the amount.</p>

<h2>Fully funded, partially funded, or chosen</h2>
<p>A set-aside is required by the result of the financial assessment. When the borrower's credit history or property charge history does not meet HUD's standards and no extenuating circumstance is documented, the lender must at least require a fully funded LESA, and it pays the bills itself. When the history is fine but residual income falls short of HUD's standard and no compensating factor applies, the minimum is a partially funded LESA, built on the monthly residual income shortfall instead of the charges: 1.2 × the shortfall, with the same discounting. With a ${K.usd(MRIS)} monthly shortfall, the example borrower would have a partial set-aside of ${K.usd(part.lesa)}. If a partial amount comes to more than ${K.pct(L.partialShareCap, 0)} of the full one, the full one is required. Funds in either kind of set-aside cannot be held in an escrow account.</p>
${h.mini('lesa', { t: 'Partial set-aside from a shortfall', p: ['mris'], d: { age: AGE, tax: TAX, value: VAL, lesa: 'partial', mris: 240 } })}

<h2>What the set-aside takes from your cash</h2>
<p>On the HUD payment plan, the set-aside appears three times. Line 15 is its full amount, ${K.usd(full.lesa)} here. Line 9 is what it will pay out in the first year, ${K.usd(full.lesaYear1)}, and that amount counts among the mandatory obligations. Line 16, the remaining ${K.usd(full.lesaAfter)}, is subtracted from the principal limit on line 20, the second branch of the first-year limit. The net effect on this ${K.usd(VAL)} home is ${K.usd(none.firstYearCash - full.firstYearCash)} less in the first year and ${K.usd(none.laterCash - full.laterCash)} less afterward. The ${h.a('first-year-limit', 'first-year limit page')} explains how lines 17 to 21 combine.</p>

<h2>How long the money lasts, and the 2026 audit</h2>
<p>The set-aside grows each month at one twelfth of the note rate plus the annual premium, and shrinks by each payment. If the charges stayed at ${K.usd(TAX)} a year and the note rate at ${K.pp(K.NOTE)}, the example set-aside would still hold ${K.usd(left)} after ${yrs} years. Charges do not stay flat, and that is the point of the audit ${h.src('oig_lesa', 'published by HUD’s Office of Inspector General')} in May 2026 (report ${OIG.report}). It estimated that ${K.num(OIG.borrowers)} borrowers with fully funded set-asides from loans closed between 2018 and 2022 would have to start paying taxes and insurance out of pocket years earlier than HUD's formula assumed. In its sample, 72 of 80 set-asides were already empty or on track to run out on average 6 years early, and 31 borrowers had seen property charges rise by about 192 % on average.</p>
<p>The auditors noted that the formula still used the ${OIG.lifeTables} life tables and that HUD had not evaluated whether set-asides last as intended. They put the possible loss to HUD at up to $${K.num(OIG.projectedLossMillions)} million if those borrowers default. HUD agreed to review the formula but disputed that figure, citing its own data that 90 % of borrowers with an empty set-aside whose loans were still active had not reported a tax and insurance default as of ${K.day('2026-02-28')}. For a borrower, the practical reading is simple: a set-aside is sized on today's bills, and the Handbook requires the lender to tell you at closing that it may not cover the whole life expectancy. The ${h.a('property-taxes-and-insurance', 'taxes and insurance page')} describes what happens when it runs out.</p>`,
  tool: 'lesa',
  toolArg: { age: AGE, tax: TAX, value: VAL },
  related: ['property-taxes-and-insurance', 'first-year-limit', 'reverse-mortgage-costs', 'hecm-calculator', 'non-borrowing-spouse'],
  sources: ['handbook', 'regz_appl', 'cfr_206', 'oig_lesa', 'hud_payplan'],
});
