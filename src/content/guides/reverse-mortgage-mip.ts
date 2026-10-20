import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, M = P.mip;
// Worked case of the page: a $520,000 home, and a balance of $180,000 left to grow for 20 years at today's note rate.
const VAL = 520000, BAL = 180000;
const up = K.imip(K.mca(VAL));
const upMax = K.imip(P.limits.mca2026);
const by = (y: number) => K.balance(BAL, K.NOTE, y * 12);
const b1 = by(1), b10 = by(10), b12 = by(12), b20 = by(20);
const upGrown = K.balance(up, K.NOTE, 144);
const values = [150000, 250000, 400000, VAL, 800000, P.limits.mca2026, 1600000];
const years = [1, 5, 10, 15, 20];

export default defineGuide({
  id: 'reverse-mortgage-mip',
  group: 'money',
  order: 30,
  slug: 'reverse-mortgage-mortgage-insurance',
  nav: 'Mortgage insurance (MIP)',
  card: 'The 2 % upfront and 0.5 % annual FHA premiums in dollars, and what they pay for',
  title: 'Reverse Mortgage Insurance 2026: HECM MIP in Dollars, US',
  description: `Reverse mortgage insurance in 2026: the HECM upfront premium is ${K.pct(M.upfront, 0)} of the claim amount, at most ${K.usd(upMax)}, then ${K.pct(M.annual, 1)} a year on the balance, added to the loan.`,
  h1: 'HECM mortgage insurance: the two premiums in dollars',
  intro: `What the FHA charges to insure a reverse mortgage, upfront and every month, and what that insurance does for you, your heirs and the lender.`,
  resume: `Every HECM carries two FHA premiums. The upfront one is ${K.pct(M.upfront, 0)} of the maximum claim amount, whatever you borrow: ${K.usd(up)} on a ${K.usd(VAL)} home, and at most ${K.usd(upMax)}, reached when the home is worth the ${K.usd(P.limits.mca2026)} limit of 2026 or more. The annual one is ${K.pct(M.annual, 1)} of the outstanding balance, accruing from closing and added to the loan each month along with the interest. On a ${K.usd(BAL)} balance at a note rate of ${K.pp(K.NOTE)}, it adds ${K.usd(b1.mip)} the first year and ${K.usd(b10.mip)} over ten years, while interest adds ${K.usd(b10.interest)}. These rates apply to every case number assigned since ${K.day(P.plf.effective)} (Mortgagee Letter 2017-12). In exchange, the loan is non-recourse: neither you nor your heirs owe more than the home brings, and if the lender stops paying what the loan promises, HUD steps in to make those payments.`,
  faqs: [
    { q: 'Why is the upfront premium based on the home value and not on what I borrow?', a: `Because HUD changed the rule in 2017. Mortgagee Letter 2017-12 set the initial premium at ${K.pct(M.upfront, 0)} of the maximum claim amount for all borrowers and stated that it is no longer tied to what is disbursed at closing or in the first year. Under the previous letter, 2014-21, the rate was ${K.pct(0.005, 1)} or ${K.pct(0.025, 1)} depending on whether first-year draws stayed within ${K.pct(P.firstYear.base, 0)} of the principal limit.` },
    { q: 'Can a lender pay the upfront mortgage insurance for me?', a: `Yes. HUD's Handbook allows the lender to pay a portion or the full amount of the initial premium on the borrower's behalf. The premium is still owed to the FHA, and the lender must remit it within 15 days of closing. On the payment plan, such help shows as cash from the lender, which reduces the amount financed and therefore the interest that would have grown on it.` },
    { q: 'What happens to my payments if the lender fails?', a: `24 CFR 206.121 provides that HUD investigates complaints about late payments, and if it finds the lender unable or unwilling to make the payments the mortgage requires, including late charges, HUD pays them to the borrower. It can then require the lender to reimburse it or to assign the mortgage to HUD. This protection is one of the things the premiums pay for.` },
  ],
  body: (h) => `
<h2>Two premiums on two different bases</h2>
<p>The upfront premium, which HUD calls the initial MIP, is a flat ${K.pct(M.upfront, 0)} of the maximum claim amount, the lesser of the appraised value and the national limit. It is computed once, at closing, and it is the same whether you take a large draw on day one or leave everything in a line of credit. The annual premium is different in kind: ${K.pct(M.annual, 1)} a year of the outstanding balance, charged in monthly installments from the closing date. A borrower who draws little pays little of it; a balance that doubles pays twice as much.</p>
${h.table(['Home value', 'Maximum claim amount', 'Upfront premium', 'Share of the value'], values.map((v) => [K.usd(v), K.usd(K.mca(v)), K.usd(K.imip(K.mca(v))), K.pct(K.imip(K.mca(v)) / v, 2)]), `Initial MIP by home value for case numbers assigned in 2026. Above ${K.usd(P.limits.mca2026)}, the claim amount and the premium stop rising.`, ['l', 'r', 'r', 'r'])}
<p>The cap on the claim amount is the only reason the share falls in the last row: a ${K.usd(1600000)} home pays the same ${K.usd(upMax)} as one worth exactly the limit. Below it, the premium is always ${K.pct(M.upfront, 0)} of the value.</p>
${h.mini('mip', { t: 'Upfront premium for another home', p: ['value'], d: { value: 680000, bal: 90000, yrs: 8 } })}

<h2>The annual premium on a growing balance</h2>
<p>Neither premium is billed to you. The Handbook says the upfront one must be financed or paid in cash at closing, and 24 CFR 206.27 lets the monthly premium be added to the outstanding principal balance once the lender has paid it to HUD. Once added, it accrues interest like any other part of the balance. Take a balance of ${K.usd(BAL)} left alone at a note rate of ${K.pp(K.NOTE)}: the premium adds ${K.usd(b1.mip)} in the first year, and the amount grows each year with the balance.</p>
${h.table(['Years', 'Balance', 'Interest added', 'Annual MIP added'], years.map((y) => { const b = by(y); return [String(y), K.usd(b.balance), K.usd(b.interest), K.usd(b.mip)]; }), `A ${K.usd(BAL)} balance with no payment, note rate ${K.pp(K.NOTE)} held constant, annual MIP ${K.pct(M.annual, 1)} of the balance, compounded monthly.`, ['l', 'r', 'r', 'r'])}
<p>Over 20 years the insurance adds ${K.usd(b20.mip)} and the interest ${K.usd(b20.interest)}. The premium is the smaller of the two by far; what makes it matter is that it is never skipped, and that it compounds. An adjustable rate moves the interest column with the 1-year Treasury; the premium rate does not move.</p>

<h2>Upfront or annual: which weighs more</h2>
<p>On the ${K.usd(VAL)} home, the two premiums can be set side by side over 12 years. The upfront premium is ${K.usd(up)}, charged once. If it is financed, it does not stay at that amount: it sits in the balance from the first day and grows at the note rate plus the annual premium, to ${K.usd(upGrown.balance)} after 12 years. The annual premium on a ${K.usd(BAL)} balance adds ${K.usd(b12.mip)} over the same 12 years. For a borrower who draws little, the upfront premium is most of the insurance bill; for one with a large balance, the annual premium catches up. Paying the upfront premium in cash at closing, which the Handbook allows, keeps it out of the balance altogether.</p>

<h2>What the insurance pays for</h2>
<p>The money goes to the FHA insurance fund, and three promises written into 24 CFR 206 come with it. The first protects you: the borrower has no personal liability for the balance, the lender can collect only through the sale of the home, and it cannot obtain a deficiency judgment after a foreclosure. If the balance has grown past what the home sells for, HUD pays the lender's claim for the difference. That is why heirs who want to keep the home can settle it for the lesser of the balance and ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of the appraised value, as the ${h.a('heirs', 'page on heirs')} explains.</p>
<p>The second protects your cash flow. If the lender is unable or unwilling to make the payments the mortgage promises, from a line of credit or a monthly payment, HUD makes them and recovers the cost from the lender or takes over the loan. The third protects the lender: when the balance reaches ${K.pct(0.98, 0)} of the maximum claim amount, a lender under the assignment option can hand the loan to HUD and be paid an insurance claim.</p>
${h.mini('mip', { t: 'Annual premium on your balance', p: ['bal', 'yrs'], d: { value: VAL, bal: 240000, yrs: 15 } })}

<h2>Legal ceilings and the rates in force</h2>
<p>The regulation sets maximums, not the rates themselves. Under 24 CFR 206.105, the initial premium may not exceed ${K.pct(0.03, 0)} of the maximum claim amount and the monthly premium may not exceed an annual rate of ${K.pct(0.015, 1)} of the remaining balance; HUD sets the actual rates by notice. The notice in force is ${h.src('ml_2017_12', 'Mortgagee Letter 2017-12')}, for case numbers assigned from ${K.day(P.plf.effective)}: ${K.pct(M.upfront, 0)} upfront, ${K.pct(M.annual, 1)} a year. Before it, from November 2014, Mortgagee Letter 2014-21 charged ${K.pct(0.005, 1)} or ${K.pct(0.025, 1)} upfront and ${K.pct(0.0125, 2)} a year. A loan keeps the rates of its case number date, so an older HECM may still accrue the higher annual rate.</p>
<p>That last point matters for a refinance. When one HECM replaces another, the upfront premium on the new loan is reduced by the premium already paid on the old one, and only a positive difference is due. The ${h.a('hecm-refinance', 'refinance page')} works through the credit, and the ${h.a('reverse-mortgage-costs', 'costs page')} sets the premium beside the other charges of a loan.</p>`,
  tool: 'mip',
  toolArg: { value: VAL, bal: BAL, yrs: 12 },
  related: ['reverse-mortgage-costs', 'heirs', 'loan-balance', 'hecm-refinance', 'how-reverse-mortgage-works'],
  sources: ['ml_2017_12', 'handbook', 'cfr_206', 'hud_payplan'],
});
