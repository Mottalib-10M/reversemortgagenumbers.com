import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const rT = K.rateT(K.EXP);
// Worked case of the page: a borrower aged 74, a $325,000 home, a spouse who is not on the loan.
const V = 325000, BORROWER = 74, SPOUSE = 66;
const solo = K.loan({ age: BORROWER, value: V });
const pair = K.loan({ age: SPOUSE, value: V });
const young = K.loan({ age: 59, value: V });
const gap = solo.pl - pair.pl, gapYoung = solo.pl - young.pl;
const spouseAges = [74, 70, 66, 62, 59, 55];
const rows = spouseAges.map((a) => { const o = K.loan({ age: a, value: V }); return [a === BORROWER ? `${a} (no younger spouse)` : String(a), K.f(o.factor), K.usd(o.pl), K.usd(solo.pl - o.pl), K.usd(o.firstYearCash)]; });

export default defineGuide({
  id: 'non-borrowing-spouse',
  group: 'situation',
  order: 10,
  slug: 'reverse-mortgage-non-borrowing-spouse',
  nav: 'Non-borrowing spouse',
  card: 'What a younger spouse off the loan costs, and the right to stay',
  title: 'Reverse Mortgage Non-Borrowing Spouse Rules 2026, US',
  description: `Reverse mortgage with a non-borrowing spouse in 2026: the spouse's age sets the HUD factor, ${K.usd(gap)} less on a ${K.usd(V)} home, and the deferral period rules.`,
  h1: 'A HECM when your spouse is not on the loan',
  intro: `What changes when one spouse signs the HECM and the other does not: the smaller amount, the four conditions that let the spouse stay, and what ends that right.`,
  resume: `A spouse who is not a borrower can stay in the home after the borrower dies, but only as an eligible non-borrowing spouse (NBS), and the price is a smaller loan: HUD reads the principal limit factor (PLF) at the age of the youngest borrower or eligible NBS. A borrower aged ${BORROWER} with a ${K.usd(V)} home gets a factor of ${K.f(solo.factor)} and ${K.usd(solo.pl)} of principal limit at an expected rate of ${K.pp(K.EXP)}. Name a spouse aged ${SPOUSE} and the ${SPOUSE} row applies: ${K.f(pair.factor)}, or ${K.usd(pair.pl)}, which is ${K.usd(gap)} less. With a spouse of 59 the loss reaches ${K.usd(gapYoung)}. In exchange, 24 CFR 206.55 defers the repayment for as long as the spouse keeps four qualifying attributes, secures a legal right to stay within 90 days of the death and keeps paying taxes and insurance. No new money is paid out during that deferral period.`,
  faqs: [
    { q: 'Can my wife or husband stay in the house after I die if they are not on the HECM?', a: 'Yes, if they were named as an eligible non-borrowing spouse at closing, were married to you then and for the rest of your life, and live in the home as their principal residence. The loan is then not called due at your death. Within 90 days, the spouse must establish ownership or another legal right to remain in the home for life, and keep paying the property charges.' },
    { q: 'Can a non-borrowing spouse keep drawing from the line of credit?', a: 'No. Under 24 CFR 206.27, disbursements cannot continue during a deferral period. Monthly payments and the unused line of credit stop with the death of the last borrower, even though interest and mortgage insurance keep accruing on the balance. A spouse who needs that money has to be a co-borrower, which requires being 62 or older at closing.' },
    { q: 'What if we marry after the reverse mortgage has closed?', a: 'The protection does not reach that spouse. The regulation defines a non-borrowing spouse as the spouse of the borrower at the time of closing, and the first qualifying attribute is to have been married to the borrower at closing and for the rest of the borrower’s life. A spouse married later is not named in the loan documents and cannot be added after the fact.' },
    { q: 'What happens to an ineligible non-borrowing spouse?', a: 'The loan becomes due and payable at the death of the last borrower, with no deferral. The counselor must tell both of you this before closing, and the lender must also show what the principal limit would have been at the ineligible spouse’s age. A spouse who was ineligible at origination cannot become eligible later, and an eligible one cannot choose to opt out.' },
  ],
  body: (h) => `
<h2>The younger age costs ${K.usd(gap)} on a ${K.usd(V)} home</h2>
<p>HUD's factor table has one row per age, and the regulation says which row a couple gets: the age of the youngest borrower or eligible non-borrowing spouse (${h.src('cfr_206', '24 CFR 206.3')}, principal limit). A borrower who is ${BORROWER} and married to someone who is ${SPOUSE} is read on the ${SPOUSE} row. The table below keeps the borrower at ${BORROWER}, the home at ${K.usd(V)} and the expected rate at ${K.pp(K.EXP)}, read in the ${K.pp(rT)} column, and changes only the spouse's age.</p>
${h.table(['Age of the spouse', 'Factor', 'Principal limit', 'Less than the borrower alone', 'Cash in the first 12 months'], rows, `Borrower aged ${BORROWER}, ${K.usd(V)} home, no mortgage to pay off, maximum origination fee, HUD factors read at ${K.pp(rT)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The drop is steep below 62 because those rows exist only for spouses. Every borrower must be at least ${P.eligibility.borrowerMinAge} at closing (${h.src('cfr_206', '24 CFR 206.33')}), so the ages from ${P.plf.ageMin} to 61 in HUD's table are there for one reason: to size a loan that protects someone younger. At 55, the factor is ${K.f(K.plf(55, K.EXP))}, about two thirds of the borrower's own.</p>
<p>The age rounding is the same for both spouses. The Handbook tells the lender to round up to the next whole year when the next birthday falls less than 183 days after closing (${h.src('handbook', 'HUD Handbook 4000.1')}). A spouse who turns 67 four months after closing is read as 67.</p>
${h.mini('plf', { t: 'Your spouse’s row of the table', p: ['age'], d: { age: SPOUSE, value: V } })}

<h2>The four qualifying attributes</h2>
<p>A non-borrowing spouse is the person married to the borrower at closing, under the law of the state where they live or where they married, who does not sign the note. That spouse is eligible only if all of the following hold, as listed in 24 CFR 206.55(c):</p>
<ul>
<li>married to the borrower at closing and for the rest of the borrower's life;</li>
<li>disclosed to the lender at origination and named as an eligible non-borrowing spouse in the mortgage and loan documents;</li>
<li>living in the home as a principal residence, before and after the borrower's death;</li>
<li>meeting any further requirement HUD sets by notice in the Federal Register.</li>
</ul>
<p>Eligibility is fixed at origination. A spouse who meets the attributes then cannot elect out of it, and a spouse who did not meet them then cannot gain it later, when the borrowing spouse dies or moves out. Losing one attribute afterwards, by moving away for instance, turns an eligible spouse into an ineligible one. The lender keeps a copy of the marriage certificate, or a legal opinion on the marriage, in HUD's servicing system.</p>

<h2>What the deferral period protects and what it does not</h2>
<p>When the last borrower dies before an eligible spouse, the loan is not called due. Repayment is deferred for as long as the spouse keeps the four attributes and meets three duties: within 90 days of the death, establish legal ownership or another legal right to remain in the home for life; keep every obligation of the loan documents, which means property taxes, homeowners insurance and upkeep; and make sure the loan does not become due for any other reason.</p>
<p>The deferral protects the right to live in the home. It does not keep the money flowing. Section 206.27 says that disbursements may not continue during a deferral period, so a line of credit or a tenure payment stops at the borrower's death. The balance keeps growing at the note rate plus ${K.pct(P.mip.annual, 1)} of annual mortgage insurance. For the couple above, the ${K.usd(gap)} they gave up at closing buys a place to live, not an income.</p>
<p>The life expectancy set-aside (LESA) for taxes and insurance also follows the youngest age: the Handbook sizes it on the life expectancy of the youngest borrower or eligible NBS. The table used on this site starts at 62, so ${h.a('lesa', 'the set-aside calculator')} cannot size it for a younger spouse; the lender computes that case.</p>
${h.mini('hecm', { t: 'Cash with a spouse under 62', p: ['age', 'value'], d: { age: 59, value: V } })}

<h2>How a deferral ends</h2>
<p>There are two endings, and they differ by one word in 24 CFR 206.55(b). If the spouse stops meeting a qualifying attribute, the lender may not offer a cure, and the loan becomes due immediately as a result of the borrower's death. If the spouse still meets the attributes but some other default occurs, such as unpaid property taxes, the lender must give 30 days to cure it (${h.src('cfr_206', '24 CFR 206.57')}).</p>
<p>A cure within those 30 days reinstates the deferral, with three exceptions: the lender already reinstated it in the two years before the latest notice, the reinstatement would prevent a foreclosure if the loan became due later, or it would harm the priority of the lien. A spouse can still cure after a foreclosure has started, but the lender's costs, attorney's fees included, are paid from the spouse's own funds and may not be added to the balance.</p>
<p>When the spouse later dies or leaves, the loan follows the same path as for any heirs: the estate can pay the balance, sell the home for at least ${K.pct(P.eligibility.maxCashOutHeirsShare, 0)} of its appraised value, or hand over the deed. The ${h.a('heirs', 'page on heirs')} works through those numbers.</p>

<h2>Counseling and the ineligible spouse</h2>
<p>The borrower and any non-borrowing spouse, eligible or not, must receive counseling. With an eligible spouse, the counselor must cover the need to secure ownership or a right to stay for life, the loss of the deferral if that fails, the residence rule and the duty to pay the property charges and keep up the home. With an ineligible spouse, the counselor must say plainly that no deferral applies and that the loan becomes due at the death of the last borrower (${h.src('cfr_206', '24 CFR 206.41')}). The lender must also compute the principal limit at the ineligible spouse's age, only to show what the couple would have received had that spouse been eligible. On the ${K.usd(V)} home, a 66-year-old ineligible spouse would see ${K.usd(pair.pl)} disclosed next to the ${K.usd(solo.pl)} actually lent. The ${h.a('hecm-counseling', 'counseling page')} lists what else the session covers.</p>`,
  tool: 'plf',
  toolArg: { age: SPOUSE, value: V },
  related: ['reverse-mortgage-age-requirement', 'heirs', 'principal-limit-factor', 'hecm-counseling', 'lesa'],
  sources: ['cfr_206', 'handbook', 'hud_plf', 'regz_appl'],
});
