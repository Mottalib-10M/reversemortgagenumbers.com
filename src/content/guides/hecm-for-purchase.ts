import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const rT = K.rateT(K.EXP);
// Worked case of the page: a buyer aged 72 and a $420,000 home bought at its appraised value.
const PRICE = 420000, AGE = 72;
const buy = (age: number, value = PRICE, price = PRICE, extra: Record<string, number> = {}) => { const o = K.loan({ age, value, price, ...extra }); return { o, down: Math.max(0, o.mo - o.pl) }; };
const base = buy(AGE);
const lowAppr = buy(AGE, 400000);
const noFee = buy(AGE, PRICE, PRICE, { origination: 0 });
const big = buy(AGE, 1500000, 1500000);
const ages = [62, 66, 70, 75, 80, 85];
const rows = ages.map((a) => { const x = buy(a); return [String(a), K.f(x.o.factor), K.usd(x.o.pl), K.usd(x.down), K.pct(x.down / PRICE, 0)]; });
const d62 = buy(62).down, d85 = buy(85).down;
const after = K.project({ age: AGE, value: PRICE, price: PRICE }, 15).filter((r) => [5, 10, 15].includes(r.year));
const grow10 = K.balance(base.o.pl, K.NOTE, 120);

export default defineGuide({
  id: 'hecm-for-purchase',
  group: 'situation',
  order: 30,
  slug: 'hecm-for-purchase',
  nav: 'HECM for Purchase',
  card: 'Buy a home with a reverse mortgage: the cash to bring by age',
  title: 'HECM for Purchase 2026: Down Payment by Age and Price, US',
  description: `HECM for Purchase in 2026: buy a home with a reverse mortgage and no monthly payment; at ${AGE}, a ${K.usd(PRICE)} home needs ${K.usd(base.down)} down, read from HUD's factor.`,
  h1: 'Buying a home with a HECM for Purchase',
  intro: `How much cash a reverse mortgage purchase takes, read from HUD's factor at your age, with the rules on the appraisal, the 60-day move-in and the mortgage insurance.`,
  resume: `A HECM for Purchase buys a home and opens a reverse mortgage in one closing, and the buyer brings the part the loan cannot cover: at ${AGE}, on a ${K.usd(PRICE)} home, that is ${K.usd(base.down)}, or ${K.pct(base.down / PRICE, 0)} of the price. The maximum claim amount (MCA) is the lesser of the price, the appraised value and the ${K.usd(P.limits.mca2026)} limit of 2026; HUD's principal limit factor (PLF) for age ${AGE} at an expected rate of ${K.pp(K.EXP)} is ${K.f(base.o.factor)}, so the loan lends ${K.usd(base.o.pl)}. The price plus ${K.usd(base.o.imip)} of upfront mortgage insurance and a ${K.usd(base.o.origination)} origination fee come to ${K.usd(base.o.mo)}; the difference is the down payment, before title and other third-party costs. The share falls with age, from ${K.usd(d62)} at 62 to ${K.usd(d85)} at 85 on the same home. After closing there is no monthly mortgage payment, and the home must become the borrower's residence within ${P.purchase.occupancyDays} days.`,
  faqs: [
    { q: 'Can a HECM for Purchase be used on a newly built home?', a: 'Yes. The Handbook allows existing construction and new construction, from a proposed house to one finished less than a year ago and never occupied. The lender must obtain the certificate of occupancy or the required inspections before closing, plus the builder’s certification and warranty forms. Eligible types are one- to four-unit site-built homes, approved condominiums and one-unit manufactured homes.' },
    { q: 'What if the appraisal comes in below the purchase price?', a: `The maximum claim amount drops to the appraised value, so the loan is smaller and the cash due grows. At ${AGE}, a ${K.usd(400000)} appraisal on a ${K.usd(PRICE)} contract raises the down payment from ${K.usd(base.down)} to ${K.usd(lowAppr.down)}. The lender may not order a second appraisal to push the value up; one is allowed only under the property flipping rules.` },
    { q: 'How soon do I have to move into a home bought with a HECM?', a: `Within ${P.purchase.occupancyDays} days of closing. The Handbook sets that rule for every borrower and any eligible non-borrowing spouse, and the home must be a one- to four-unit residence where you occupy one unit as your principal residence. A borrower may have only one principal residence at a time, so a house kept elsewhere cannot be the main home too.` },
    { q: 'Can I buy a new home with a HECM while I still have one on my old house?', a: 'Not with both loans in place. The Handbook says a current borrower who sells the old residence and uses HECM for Purchase must pay off the existing HECM before the new loan can be insured. The upfront premium is also charged in full: 24 CFR 206.53 excludes HECM for Purchase transactions from the premium credit given on a refinance.' },
  ],
  body: (h) => `
<h2>The down payment at each age on a ${K.usd(PRICE)} home</h2>
<p>The loan pays the share of the price that HUD's factor allows, and the buyer pays the rest at closing. The table keeps the price and the appraisal at ${K.usd(PRICE)}, the expected rate at ${K.pp(K.EXP)} (read in the ${K.pp(rT)} column) and the origination fee at its legal maximum of ${K.usd(base.o.origination)}.</p>
${h.table(['Age of the youngest buyer', 'Factor', 'Loan amount', 'Cash to bring', 'Share of the price'], rows, `Purchase price and appraised value ${K.usd(PRICE)}, upfront MIP ${K.usd(base.o.imip)} and origination ${K.usd(base.o.origination)} financed, other closing costs not included. HUD factors at ${K.pp(rT)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>Two things follow from the table. The cash required is large at any age: even at 85 the buyer covers about half the price. And each year of age helps less than a rate change: one point less on the expected rate moves the factor at ${AGE} from ${K.f(K.plf(AGE, K.EXP))} to ${K.f(K.plf(AGE, K.EXP - 1))}, worth ${K.usd(PRICE * (K.plf(AGE, K.EXP - 1) - K.plf(AGE, K.EXP)))} on this home. The age used is that of the youngest buyer or eligible non-borrowing spouse.</p>
${h.mini('purchase', { t: 'Your age and price', p: ['age', 'price'], d: { age: AGE, price: PRICE, value: PRICE } })}

<h2>Three amounts set the loan: price, appraisal, limit</h2>
<p>For a purchase, the Handbook defines the maximum claim amount as the lesser of the appraised value, the national limit and the sales contract price (${h.src('handbook', 'HUD Handbook 4000.1')}). When a second appraisal is required, the lower of the two values counts. The upfront premium is not part of the MCA, and closing costs do not enter the appraised value.</p>
<p>That rule cuts both ways. A buyer who negotiates the price down lowers the loan along with it, since the MCA follows the price. A buyer who pays above the appraisal pays the whole gap in cash: on a ${K.usd(PRICE)} contract appraised at ${K.usd(400000)}, the cash due rises by ${K.usd(lowAppr.down - base.down)} at ${AGE}. Above the limit, the loan stops growing. A ${K.usd(1500000)} purchase is counted at ${K.usd(P.limits.mca2026)}, so the loan lends ${K.usd(big.o.pl)} and the buyer brings ${K.usd(big.down)}.</p>

<h2>What the cash at closing pays for</h2>
<p>On the HUD payment plan, the contract sales price has its own line (line 6) and is added to the costs paid at closing in line 10, the way a mortgage payoff is in a traditional HECM. The cash the buyer brings goes on line 11, the personal funds that cover what the principal limit cannot (${h.src('hud_payplan', 'HUD payment plan instructions')}). The upfront mortgage insurance premium (MIP) of ${K.pct(P.mip.upfront, 0)} of the MCA, ${K.usd(base.o.imip)} here, must be financed or paid in cash, and any part paid in cash is added to the cash due at closing. The origination fee follows the same cap as any HECM, ${K.usd(P.origination.cap)} at most. A lender that waives it lowers the cash due at ${AGE} to ${K.usd(noFee.down)}.</p>
<p>Title insurance, recording and other third-party charges come on top. The amounts depend on the place and the providers, so the calculator leaves them at zero: add the figures from the lender’s cost estimate in its closing cost field. The ${h.a('reverse-mortgage-costs', 'costs page')} lists the charges HUD allows.</p>
<p>Because the loan takes the whole principal limit to buy the house, nothing is left for a line of credit or monthly payments in the examples above. That is the trade the program offers: a large payment at the start against no monthly mortgage bill for as long as the home stays the principal residence.</p>
${h.mini('purchase', { t: 'When the appraisal comes in lower', p: ['value'], d: { age: AGE, price: PRICE, value: 400000 } })}

<h2>The balance after moving in</h2>
<p>The loan starts at its full size on the day of closing, since the principal limit went into the house, and it grows from there with no payment. At a note rate of ${K.pp(K.NOTE)} plus ${K.pct(P.mip.annual, 1)} of annual premium, held constant, the ${K.usd(base.o.pl)} borrowed at ${AGE} becomes:</p>
${h.table(['Years after the purchase', 'Age', 'Loan balance'], after.map((r) => [String(r.year), String(r.age), K.usd(r.balance)]), `Buyer aged ${AGE}, ${K.usd(PRICE)} home, the whole principal limit used for the purchase, note rate held at ${K.pp(K.NOTE)}.`, ['l', 'l', 'r'])}
<p>Over the first ten years, ${K.usd(grow10.interest)} of interest and ${K.usd(grow10.mip)} of mortgage insurance are added. The buyer's ${K.usd(base.down)} is equity from the first day; what remains of it later depends on the home's value against that balance. Property taxes, insurance and upkeep stay the buyer's to pay, as with any HECM, and the lender's financial assessment can require a set-aside for them, which would raise the cash due at closing.</p>

<h2>The rules a purchase adds</h2>
<ul>
<li>Every borrower, and any eligible non-borrowing spouse, must occupy the home within ${P.purchase.occupancyDays} days of closing.</li>
<li>The home is a one- to four-unit residence where the borrower lives in one unit, existing or newly built.</li>
<li>All purchasers on the sales contract must be borrowers; a non-borrowing spouse may be listed but need not sign.</li>
<li>The seller must be the owner of record, and a home resold 90 days or fewer after the seller acquired it is not eligible, with exceptions such as inherited homes and HUD's own sales.</li>
<li>The seller must complete the repairs needed for safety, soundness and marketability; the appraisal is made subject to them.</li>
<li>At closing, the HECM liens must be the only liens on the property.</li>
</ul>
<p>Counseling with a HUD-approved counselor comes before closing, as for any HECM, though the Handbook lets the lender take the application before or after it. The ${h.a('hecm-counseling', 'counseling page')} covers the session, and the ${h.a('hecm-calculator', 'full calculator')} shows what a traditional HECM would give on a home already owned.</p>`,
  tool: 'purchase',
  toolArg: { age: AGE, price: PRICE, value: PRICE },
  related: ['hecm-calculator', 'reverse-mortgage-costs', 'hecm-limit', 'hecm-counseling', 'reverse-mortgage-mip'],
  sources: ['handbook', 'cfr_206', 'hud_plf', 'ml_2025_22', 'hud_payplan', 'cfr_206_31'],
});
