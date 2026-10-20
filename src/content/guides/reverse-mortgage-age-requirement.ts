import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const MIN = P.eligibility.borrowerMinAge;
const rT = K.rateT(K.EXP);
// Worked case of the page: a $380,000 home, borrower 66, a spouse of 59 who stays off the loan.
const V = 380000;
const solo66 = K.loan({ age: 66, value: V }), nbs59 = K.loan({ age: 59, value: V }), at64 = K.loan({ age: 64, value: V });
const shown = [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 95, 97, 99];
const f = (a: number) => K.plf(a, K.EXP);
const f61 = f(61), f62 = f(62), f70 = f(70), f71 = f(71), f80 = f(80), f99 = f(99);
const firstFlat = shown.find((a) => a > 95 && f(a) === f99) ?? 99;

export default defineGuide({
  id: 'reverse-mortgage-age-requirement',
  group: 'basics',
  order: 20,
  slug: 'reverse-mortgage-age-requirement',
  nav: 'Age requirement',
  card: 'Who must be 62, how HUD rounds your age and what each year adds to the amount',
  title: 'Reverse Mortgage Age Requirement 2026: 62 and Over, US',
  description: `Reverse mortgage age requirement in 2026: every HECM borrower must be ${MIN} at closing, and HUD's factor climbs with age, from ${K.f(f62)} at 62 to ${K.f(f80)} at 80.`,
  h1: 'Reverse mortgage age requirement',
  intro: `Who has to be ${MIN}, what happens with a younger spouse, how HUD rounds an age, and how much each birthday adds to a HECM.`,
  resume: `An FHA-insured reverse mortgage requires the youngest borrower to be at least ${MIN} on the day the loan closes, which in practice means every person who signs the note. A younger spouse can stay off the loan and still be protected as an eligible non-borrowing spouse, but HUD's factor then follows that spouse's age. Age matters well beyond eligibility. At an expected rate of ${K.pp(K.EXP)}, read in the ${K.pp(rT)} column, the factor is ${K.f(f62)} at 62, ${K.f(f70)} at 70 and ${K.f(f80)} at 80, so a ${K.usd(V)} home yields ${K.usd(V * f62)}, ${K.usd(V * f70)} and ${K.usd(V * f80)} of principal limit. A borrower of 66 married to a spouse of 59 gets ${K.usd(nbs59.pl)} instead of ${K.usd(solo66.pl)}. HUD rounds the age up when the next birthday falls less than 183 days after closing, so a few weeks of waiting can move the case to the next row of the table.`,
  faqs: [
    { q: 'Is there a maximum age for a reverse mortgage?', a: `No. HUD sets a minimum of ${MIN} and no upper limit. Its factor table stops at ${P.plf.ageMax}, and anyone older is read on that row. Above ${P.tenure.ageCap}, monthly payments for life are sized as if the borrower were ${P.tenure.ageCap}. A borrower of 90 still goes through counseling, the appraisal and the financial assessment like anyone else, and gets a higher share of the home value than a younger one.` },
    { q: 'Does my spouse also have to be 62?', a: `Only if your spouse signs the loan as a borrower. A younger spouse can be named in the loan documents as an eligible non-borrowing spouse, attend counseling with you and keep living in the home after you die, as long as the home stays that spouse's principal residence and the taxes and insurance stay paid. The amount is then sized on the younger spouse's age.` },
    { q: 'How does HUD round my age for the factor table?', a: 'Lenders must use the age of the youngest borrower or eligible non-borrowing spouse, rounded up to the next whole year when the next birthday falls less than 183 days after closing. HUD’s own calculator says the same thing in its words: age rounded to the nearest whole year, with the birthday treated as already passed during the birth month. Someone 64 years and seven months old is read as 65.' },
    { q: 'Should I wait a few years to get a bigger amount?', a: `The factor rises with age, about ${K.dec((f80 - f62) / 18 * 100, 1)} points of the home value per year on average between 62 and 80 at today's rate. Waiting also brings risks the table does not show: rates can rise and lower the factor, home values can fall, and the credit line of a loan opened earlier grows each year while unused. Counseling is where to compare both paths on your own numbers.` },
  ],
  body: (h) => `
<h2>The rule: ${MIN} at closing, for each borrower</h2>
<p>The federal rule for the HECM program, 24 CFR 206.33, is one sentence long: the youngest borrower must be ${MIN} years of age or older at the time of loan closing. Since the youngest one has to meet it, everyone on the note does. The test is the closing date, not the day you first call a lender, and it applies to the FHA-insured HECM only. Private reverse mortgages, sold outside the FHA program, set their own terms.</p>
<p>There is no upper age. The HUD table runs to ${P.plf.ageMax}, and a borrower of 101 is read on the ${P.plf.ageMax} row. Older borrowers still pass the same steps: counseling, an FHA appraisal and a financial assessment of their credit and income.</p>

<h2>A spouse under ${MIN}</h2>
<p>When one spouse is ${MIN} or older and the other is not, the younger one can stay off the loan as a non-borrowing spouse. If that spouse is named in the loan documents at closing, was married to the borrower at closing and lives in the home, they are an eligible non-borrowing spouse. After the borrower dies, the loan's due date is deferred for them, as long as they establish a legal right to stay in the home within 90 days, keep it as their principal residence and meet the loan's obligations. No new money is paid out during that deferral.</p>
<p>The price of that protection is a lower amount. HUD sizes the loan on the youngest of the borrowers and eligible non-borrowing spouses, which is why the factor table starts at ${P.plf.ageMin}. On a ${K.usd(V)} home at ${K.pp(rT)}, a borrower of 66 alone gets a principal limit of ${K.usd(solo66.pl)}; with an eligible non-borrowing spouse of 59, it falls to ${K.usd(nbs59.pl)}, and the room in the first year from ${K.usd(solo66.firstYearCash)} to ${K.usd(nbs59.firstYearCash)}. A spouse who does not meet the conditions is an ineligible non-borrowing spouse: the loan uses the borrower's age, but becomes due when the last borrower dies. The lender must still show what the younger age would have given, so the couple can compare. The ${h.a('non-borrowing-spouse', 'non-borrowing spouse page')} walks through the conditions.</p>

<h2>How HUD reads your age</h2>
<p>Handbook 4000.1 tells lenders to use the age of the youngest borrower or eligible non-borrowing spouse, rounded up to the next whole year when the next birthday comes less than 183 days after closing. The help pages of HUD's calculator put it as rounding to the nearest year and add that, in the birth month, the birthday is treated as already passed. A borrower who is 64 years and five months old at closing is read on the 64 row, giving ${K.usd(at64.pl)} on our ${K.usd(V)} home; two months later, the 65 row gives ${K.usd(V * f(65))}.</p>
${h.mini('plf', { t: 'Your row of the table', p: ['age'], d: { age: 64, value: 380000 } })}

<h2>What each year of age is worth</h2>
<p>The table below reads HUD's factors at the expected rate of ${K.pp(K.EXP)} used across this site, the 10-year Treasury rate of ${K.pp(P.rates.cmt10Week, 2)} for the week ending ${K.day(P.rates.cmt10WeekEnding)} plus an example margin of ${K.pp(P.rates.exampleMargin, 1)}. The principal limit column applies them to a ${K.usd(V)} home. The column one point higher shows how much a rise in rates would take back.</p>
${h.table(['Age', `Factor at ${K.pp(rT)}`, `Principal limit, ${K.usd(V)} home`, `Factor at ${K.pp(K.rateT(K.EXP + 1))}`], shown.map((a) => [String(a), K.f(f(a)), K.usd(V * f(a)), K.f(K.plf(a, K.EXP + 1))]), `HUD principal limit factors in force since ${K.day(P.plf.effective)}, read at the rounded expected rate. Principal limit before the upfront mortgage insurance, the origination fee and any payoff.`, ['l', 'r', 'r', 'r'])}
<p>Three things stand out. First, the step from 61 to 62, ${K.f(f61)} to ${K.f(f62)}, is larger than its neighbors; the rows under ${MIN} are used only for non-borrowing spouses. Second, the climb is not perfectly smooth; at this rate the 70 and 71 rows both show ${K.f(f70 === f71 ? f70 : f71)}, so a birthday between them adds nothing. Third, from age ${firstFlat} the factor stops at ${K.f(f99)}. In between, a year of age adds about ${K.dec((f80 - f62) / 18 * 100, 1)} points of the home value on average from 62 to 80, and ${K.dec((f(95) - f80) / 15 * 100, 1)} points from 80 to 95.</p>

<h2>Other rules that follow your age</h2>
<p>Age also sets the length used for lifetime monthly payments. HUD's calculator sizes a tenure payment as if it ran until age 100, ${K.tenureMonths(66)} months for a 66-year-old, and treats anyone older than ${P.tenure.ageCap} as ${P.tenure.ageCap}. The same age drives the ${h.a('lesa', 'set-aside for taxes and insurance')} when the lender requires one: it uses a life expectancy table from Regulation Z, ${K.talc(62)} years at 62 and ${K.talc(80)} at 80, so a younger borrower has more years of taxes held back. Both rules reduce the cash of a younger borrower further, on top of the lower factor. The ${h.a('age-62', 'page for borrowers aged 62')} puts all of them together for the youngest eligible age.</p>
${h.mini('hecm', { t: 'Same home, another age', p: ['age'], d: { age: 81, value: 380000 } })}`,
  tool: 'plf',
  toolArg: { age: 64, value: 380000 },
  related: ['non-borrowing-spouse', 'principal-limit-factor', 'age-62', 'age-70', 'hecm-counseling'],
  sources: ['cfr_206', 'handbook', 'hud_calc_help', 'hud_plf', 'regz_appl'],
});
