import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
// Worked case of the page: youngest borrower 74, a $380,000 home. The fixed note rate is an example equal to the
// site's default expected rate (on a fixed HECM the note rate is also the expected rate).
const AGE = 74, VALUE = 380000, FR = K.EXP;
const fx = K.loan({ age: AGE, value: VALUE, fixed: true });
const arm = K.loan({ age: AGE, value: VALUE, draw: 'max' });
const fxLien = K.loan({ age: AGE, value: VALUE, fixed: true, liens: 120000 });
const pFx = K.project({ age: AGE, value: VALUE, fixed: true, note: FR }, 15);
const pArm = K.project({ age: AGE, value: VALUE, draw: 'max' }, 15);
const lost = fx.forfeited / fx.pl;
const ages = [62, 66, 70, 74, 78, 82, 86, 90];
const byAge = ages.map((a) => K.loan({ age: a, value: VALUE, fixed: true }));

export default defineGuide({
  id: 'lump-sum',
  group: 'payout',
  order: 20,
  slug: 'reverse-mortgage-lump-sum',
  nav: 'Fixed-rate lump sum',
  card: 'The single payout of a fixed-rate HECM, and the part of the principal limit it gives up',
  title: 'Reverse Mortgage Lump Sum 2026: Fixed Rate Payout, US',
  description: `Reverse mortgage lump sum in 2026: a fixed-rate HECM pays once at closing, at most ${K.pct(P.firstYear.base, 0)} of the principal limit, and the rest is lost. See the amount by age.`,
  h1: 'The lump sum of a fixed-rate HECM',
  intro: `A fixed-rate HECM pays its money once, at closing, and the share of the principal limit left behind on that day can never be drawn: the figures below show how large that share is.`,
  resume: `A fixed-rate HECM is paid as one single lump sum at closing, with no later draws: the regulation calls it the Single Lump Sum payment option and reserves it for fixed-rate loans. The amount cannot exceed ${K.pct(P.firstYear.base, 0)} of the principal limit, or the mandatory obligations plus ${K.pct(P.firstYear.extra, 0)} of it when obligations pass half, and the costs come out of that ceiling. At ${AGE}, with a ${K.usd(VALUE)} home and an example fixed rate of ${K.pp(FR)}, the principal limit is ${K.usd(fx.pl)}. After ${K.usd(fx.imip)} of upfront mortgage insurance (MIP) and an origination fee of ${K.usd(fx.origination)}, the lump sum is ${K.usd(fx.firstYearCash)}. The other ${K.usd(fx.forfeited)}, ${K.pct(lost, 0)} of the principal limit, is never available. An adjustable HECM drawn to its maximum pays the same ${K.usd(arm.firstYearCash)} at closing, then opens ${K.usd(arm.laterCash)} more after 12 months, as a line that grows. Paying off a large mortgage shrinks the loss.`,
  faqs: [
    { q: 'Can I take more money later from a fixed-rate HECM?', a: `No. The borrower's advance is taken at closing only, and the regulation says no further funds may be made available after closing, even though the principal limit keeps growing on paper. A fixed-rate borrower also cannot switch to another payment plan, and a partial repayment does not create new room to draw. Only money placed in a set-aside at closing, for taxes and insurance or repairs, is paid out later.` },
    { q: 'Why is a fixed-rate reverse mortgage paid in one lump sum?', a: `Because HUD's rules allow only one payment plan on a fixed-rate HECM: the Single Lump Sum option of 24 CFR 206.19(e). Line of credit, tenure, term and the modified plans are all reserved for adjustable-rate loans in Handbook 4000.1. On a fixed-rate HECM, the advance taken at closing is the whole loan, and the rate on it never changes.` },
    { q: 'What happens to the principal limit I leave behind on a fixed rate?', a: `It stays on the loan's records and keeps growing at the note rate plus ${K.pct(P.mip.annual, 1)}, but it cannot be drawn. In our ${AGE}-year-old example that unused part is ${K.usd(fx.forfeited)} at closing. It is not a debt either: you owe only what you took, the costs and the interest and MIP that accrue on them.` },
  ],
  body: (h) => `
<h2>The rule: one advance, at closing</h2>
<p>Federal rules list six ways to receive HECM money, and one of them belongs to fixed-rate loans alone. Under 24 CFR 206.19(e), the Single Lump Sum payment option pays the "Borrower's Advance" at closing, "available only for fixed interest rate HECMs". HUD's Handbook adds that the borrower is "limited to a single Disbursement at closing with no opportunity for future Disbursements", apart from a set-aside created that day (${h.src('handbook', 'Handbook 4000.1')}).</p>
<p>The ceiling is the same as for the first year of an adjustable loan (24 CFR 206.25(a)(2)): the greater of ${K.pct(P.firstYear.base, 0)} of the principal limit or the mandatory obligations plus ${K.pct(P.firstYear.extra, 0)} of it, but never more than the principal limit minus any taxes-and-insurance set-aside for later years and any servicing fee set-aside. Mandatory obligations are the upfront MIP, the origination fee, other closing costs and any mortgage to pay off. They are paid from the advance, and you receive what is left.</p>
<p>A set-aside for property taxes and insurance shrinks the lump sum further. On a fixed-rate loan it can only be a fully funded one: the charges due in the first 12 months count among the obligations (24 CFR 206.25(b)(12)(ii)), and the amount reserved for later years is taken off the principal limit before the ceiling applies. The ${h.a('lesa', 'set-aside page')} computes that reserve with HUD's formula.</p>
<p>On a fixed-rate HECM, the expected rate that picks the column of HUD's factor table is the note rate itself (${h.src('cfr_206', '24 CFR 206.3')}). A lender quoting ${K.pp(FR)} fixed is read in the ${K.pp(K.rateT(FR))} column, where the factor at ${AGE} is ${K.f(fx.factor)}.</p>
${h.table(['Age', 'Principal limit', 'Lump sum after costs', 'Never available', 'Cash as share of the home'], byAge.map((x, i) => [String(ages[i]), K.usd(x.pl), K.usd(x.firstYearCash), K.usd(x.forfeited), K.pct(x.firstYearCash / VALUE, 0)]), `${K.usd(VALUE)} home, example fixed rate ${K.pp(FR)}, upfront MIP of ${K.pct(P.mip.upfront, 0)} and the maximum origination fee of ${K.usd(K.orig(VALUE))} paid from the advance, no mortgage to pay off.`, ['l', 'r', 'r', 'r', 'r'])}
${h.mini('hecm', { t: 'Your lump sum at a fixed rate', p: ['age', 'fr'], d: { rt: 'fixed', age: 81, value: VALUE, fr: FR } })}

<h2>How much of the principal limit is given up</h2>
<p>With no debt to pay off, the share lost is close to ${K.pct(1 - P.firstYear.base, 0)} of the principal limit, because the advance stops at ${K.pct(P.firstYear.base, 0)}. While obligations stay under half of the principal limit, the costs do not change the size of the loss; they are paid from inside the ${K.pct(P.firstYear.base, 0)}, so the cash in hand falls while the part left behind stays the same. In dollars, the loss rises with age, since older borrowers start from a larger principal limit: ${K.usd(byAge[0].forfeited)} at 62 and ${K.usd(byAge[byAge.length - 1].forfeited)} at 90 on the same home.</p>
<p>The money left behind is not owed. The balance starts at the advance, ${K.usd(fx.financed + fx.firstYearCash)} including the financed costs, and then compounds at ${K.pp(FR)} plus ${K.pp(P.mip.annual * 100, 1)} of annual MIP. After 10 years at that fixed rate it is ${K.usd(pFx[9].balance)}, with no payment due while you live in the home.</p>

<h2>Against the largest draw on an adjustable loan</h2>
<p>An adjustable HECM can pay the same amount on closing day. Drawn to its first-year maximum, it gives ${K.usd(arm.firstYearCash)} at closing, and on the first anniversary another ${K.usd(arm.laterCash)} becomes available as a line of credit. That line compounds at the note rate plus ${K.pct(P.mip.annual, 1)} while unused. At today's adjustable note rate of ${K.pp(K.NOTE, 2)}, held constant, it would be ${K.usd(pArm[4].credit)} after five years and ${K.usd(pArm[9].credit)} after ten.</p>
${h.table(['Year', 'Fixed: balance', 'Adjustable: balance', 'Adjustable: unused line'], [1, 3, 5, 10, 15].map((y) => [String(y), K.usd(pFx[y - 1].balance), K.usd(pArm[y - 1].balance), K.usd(pArm[y - 1].credit)]), `Age ${AGE}, ${K.usd(VALUE)} home, same cash at closing. Fixed note rate ${K.pp(FR)} (example); adjustable note rate ${K.pp(K.NOTE, 2)} held constant, which a real adjustable loan will not do. Both + ${K.pp(P.mip.annual * 100, 1)} MIP.`, ['l', 'r', 'r', 'r'])}
<p>The trade is about what you know in advance. The fixed rate tells you today exactly how the balance will grow; the adjustable rate can move by up to two points a year and five over the life of the loan (24 CFR 206.21), in either direction, and its balance column could end up above or below the one shown. In exchange the adjustable loan keeps ${K.usd(arm.laterCash)} of borrowing room alive. If you need the whole sum on day one and nothing after, the fixed loan gives the same cash; if a later need is possible, the fixed loan cannot meet it.</p>
${h.mini('hecm', { t: 'The same home, adjustable, maximum draw', p: ['age'], d: { rt: 'arm', plan: 'max', age: AGE, value: VALUE } })}

<h2>When a mortgage takes most of the advance</h2>
<p>A large existing mortgage changes the picture. Once mandatory obligations pass half of the principal limit, the ceiling becomes the obligations plus ${K.pct(P.firstYear.extra, 0)} of the principal limit. With a ${K.usd(120000)} mortgage on the same ${K.usd(VALUE)} home, obligations reach ${K.usd(fxLien.mo)}. The advance can be ${K.usd(fxLien.idl)}: the payoff and costs, then ${K.usd(fxLien.firstYearCash)} in cash. Only ${K.usd(fxLien.forfeited)} of the principal limit is left behind, so in this case the fixed rate gives up little. The ${h.a('existing-mortgage', 'existing mortgage page')} shows the full scale of debts.</p>

<h2>Paying back part of it</h2>
<p>Any HECM can be repaid in full or in part at any time without penalty (24 CFR 206.209). On a fixed-rate loan, though, a partial repayment only lowers the balance: 24 CFR 206.19(h)(3) says the room it frees in the principal limit "shall not be available for the borrower to draw against". The money cannot be taken out again. The ${h.a('loan-balance', 'loan balance page')} shows how interest and MIP accumulate on a sum taken at closing, and the ${h.a('line-of-credit', 'line of credit page')} details the growth of the adjustable alternative.</p>`,
  tool: 'hecm',
  toolArg: { rt: 'fixed', age: AGE, value: VALUE, fr: FR },
  related: ['hecm-calculator', 'line-of-credit', 'first-year-limit', 'existing-mortgage', 'reverse-mortgage-rates', 'loan-balance'],
  sources: ['cfr_206', 'handbook', 'hud_payplan', 'hud_plf'],
});
