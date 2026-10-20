import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P, L = P.lesa, O = P.oig;
// Worked case of the page: a 75-year-old with a $310,000 home, no mortgage, $4,800 a year of taxes and insurance.
const V = 310000, TAX = 4800, AGE = 75;
const rT = K.rateT(K.EXP);
const y75 = K.talc(AGE) ?? 0, y76 = K.talc(AGE + 1) ?? 0;
const with75 = K.loan({ age: AGE, value: V, lesa: 'full', charges: TAX });
const free75 = K.loan({ age: AGE, value: V });
const with76 = K.loan({ age: AGE + 1, value: V, lesa: 'full', charges: TAX });
const free76 = K.loan({ age: AGE + 1, value: V });
const lesaLo = K.lesa(TAX, AGE, K.EXP - 1), lesaHi = K.lesa(TAX, AGE, K.EXP + 1);
const charges = [3000, TAX, 6500, 8500];
const MRIS = 150;
const part = K.loan({ age: AGE, value: V, lesa: 'partial', charges: TAX, mris: MRIS });
const partCap = L.partialShareCap * with75.lesa;
// Year by year with the full set-aside, property charges held flat.
const proj = K.project({ age: AGE, value: V, lesa: 'full', charges: TAX }, 20);
const dry = proj.find((r) => r.lesa < 1);
const at85 = proj[9];
const monthly12 = L.factor * TAX / 12;

export default defineGuide({
  id: 'age-75',
  group: 'age',
  order: 75,
  slug: 'reverse-mortgage-at-75',
  nav: 'Reverse mortgage at 75',
  card: 'The taxes and insurance set-aside at 75, and the 183-day rule',
  title: 'Reverse Mortgage at 75 in 2026: Set-Aside and Cash, US',
  description: `Reverse mortgage at 75 in 2026: HUD sizes the taxes and insurance set-aside on ${y75} years of life expectancy, ${K.usd(with75.lesa)} on a ${K.usd(V)} home in our example.`,
  h1: 'A reverse mortgage at 75, with taxes and insurance set aside',
  intro: `At 75, the part of a HECM most likely to surprise you is not the factor but the set-aside a lender can require for property taxes and insurance, sized on a ${y75}-year life expectancy.`,
  resume: `At 75, a lender that requires a life expectancy set-aside (LESA) for property taxes and insurance holds back enough to pay them for ${y75} years, the life expectancy HUD assigns to that age. On a ${K.usd(V)} home with ${K.usd(TAX)} a year of taxes and insurance, the factor at an expected rate of ${K.pp(K.EXP)} is ${K.f(with75.factor)}, the principal limit ${K.usd(with75.pl)}, and the set-aside ${K.usd(with75.lesa)}, or ${K.pct(with75.lesa / with75.pl, 1)} of it. The first year barely changes: cash available in the first 12 months goes from ${K.usd(free75.firstYearCash)} to ${K.usd(with75.firstYearCash)}, because only one year of charges counts there. The real cut comes in month 13, when the room left falls from ${K.usd(free75.laterCash)} to ${K.usd(with75.laterCash)}. One detail of HUD's handbook matters at this age: if your 76th birthday is less than 183 days after closing, you count as 76, the life expectancy drops to ${y76} years (${y76 * 12} months) and the set-aside to ${K.usd(with76.lesa)}.`,
  faqs: [
    { q: 'Will the set-aside stop paying my taxes after 12 years?', a: `No. The ${y75} years are only used to size it. The account keeps paying until it is empty, and it grows each month at the note rate plus ${K.pct(P.mip.annual, 1)}. If ${K.usd(TAX)} of yearly charges never rose, our example account would last until about age ${dry ? dry.age : AGE + 20}. Rising taxes or premiums empty it sooner, and from then on the bills are yours to pay again.` },
    { q: 'Can I ask for a set-aside at 75 if the lender does not require one?', a: `Yes. HUD's handbook lets a borrower request a fully funded set-aside voluntarily, and it works the same way as a required one: the servicer pays the tax office and the insurer directly. The cost is the same too. On our ${K.usd(V)} example it would hold back ${K.usd(with75.lesa)} of the principal limit, money you can no longer draw as cash.` },
    { q: 'Why might a lender quote a different set-aside than this page at 75?', a: `Three inputs move it. The lender uses its own expected rate: one point lower or higher turns our ${K.usd(with75.lesa)} into ${K.usd(lesaLo)} or ${K.usd(lesaHi)}. It uses your actual tax bill and premiums, including flood insurance where it applies. And it applies the 183-day rule to your birth date, which can switch the life expectancy from ${y75} to ${y76} years.` },
    { q: 'Does a set-aside at 75 lower a monthly payment for life?', a: `Yes, because it is taken from the money that would otherwise be spread over the months. With no mortgage and no set-aside, a 75-year-old with a ${K.usd(V)} home would get about ${K.usd(free75.tenure)} a month for life. With the full set-aside for ${K.usd(TAX)} of yearly charges, the payment drops to about ${K.usd(with75.tenure)}, while the taxes and insurance are paid for you.` },
  ],
  body: (h) => `
<h2>Twelve years of charges, priced the HUD way</h2>
<p>A life expectancy set-aside, or LESA, is part of the principal limit of a HECM (Home Equity Conversion Mortgage, the FHA-insured reverse mortgage) that the servicer keeps to pay property taxes, homeowners insurance and flood insurance where required. The lender must require one when its financial assessment finds an unsatisfactory record of paying debts and property charges that no extenuating circumstance explains. The formula is in the ${h.src('handbook', 'HUD Handbook 4000.1')}: take ${L.factor * 100} % of your current monthly charges, then the present value of that amount paid every month for the life expectancy of the youngest borrower, discounted at the expected rate plus the ${K.pct(P.mip.annual, 1)} annual mortgage insurance premium (MIP).</p>
<p>The life expectancy comes from a table in Regulation Z (${h.src('regz_appl', 'Appendix L to Part 1026')}). At 75 it reads ${y75} years, so the formula counts ${y75 * 12} monthly payments. For our owner, ${K.usd(TAX)} a year is ${K.usd(TAX / 12)} a month, and the ${L.factor * 100} % uplift makes it ${K.usd2(monthly12)}. Discounted at ${K.pp(K.EXP)} plus ${K.pct(P.mip.annual, 1)}, those ${y75 * 12} payments are worth ${K.usd(with75.lesa)} today. That is the sum set aside, ${K.pct(with75.lesa / with75.pl, 1)} of a ${K.usd(with75.pl)} principal limit.</p>
<p>The ${L.factor * 100} % factor is HUD's allowance for charges that rise over the years. The discount works the other way: the account earns growth while it waits, so the lender holds back less than ${y75} full years of bills at today's price would cost.</p>

<h2>The 183-day rule, written for a 75-year-old</h2>
<p>The handbook rounds the age before reading the life table: if the next birthday falls less than 183 days after the estimated closing date, the borrower counts as one year older. Its own worked example is a 75-year-old in exactly that position, whose life expectancy becomes ${y76} years, or ${y76 * 12} months. The same rounding applies to the principal limit factor (PLF), so the two effects add up. Close shortly before turning 76 and the factor moves from ${K.f(free75.factor)} to ${K.f(free76.factor)} while the set-aside shrinks.</p>
${h.table(['Taxes + insurance a year', `LESA at 75 (${y75 * 12} months)`, `LESA counted as 76 (${y76 * 12} months)`, 'Difference'], charges.map((c) => { const a = K.lesa(c, AGE, K.EXP), b = K.lesa(c, AGE + 1, K.EXP); return [K.usd(c), K.usd(a), K.usd(b), K.usd(a - b)]; }), `Fully funded set-aside by annual property charges, expected rate ${K.pp(K.EXP)} (read as ${K.pp(rT)} in HUD's factor table) plus ${K.pct(P.mip.annual, 1)} MIP. Formula of HUD Handbook 4000.1, life expectancy of Regulation Z Appendix L.`, ['l', 'r', 'r', 'r'])}
<p>On the ${K.usd(V)} home, being counted as 76 lifts the principal limit to ${K.usd(with76.pl)} and lowers the set-aside to ${K.usd(with76.lesa)}. The room that opens in month 13 rises from ${K.usd(with75.laterCash)} to ${K.usd(with76.laterCash)}. HUD's Office of Inspector General found loans in its sample where this rounding may not have been applied (${h.src('oig_lesa', 'audit 2026-KC-0003')}), so the birth date on the application is worth checking against the closing date.</p>

<h2>Where the set-aside hits your cash</h2>
<p>The first 12 months are limited to ${K.pct(P.firstYear.base, 0)} of the principal limit, and the obligations paid at closing come out of that room. A set-aside counts there only for its first year of payments, which the HUD payment plan form enters on line 9 (${h.src('hud_payplan', 'HUD payment plan')}). For our owner that is ${K.usd(TAX)}, so the first-year cash falls by the same amount, from ${K.usd(free75.firstYearCash)} to ${K.usd(with75.firstYearCash)}.</p>
<p>The rest of the set-aside, ${K.usd(with75.lesaAfter)}, goes on line 16 and is subtracted from what you can reach after the first year. Without it, ${K.usd(free75.laterCash)} would open in month 13. With it, ${K.usd(with75.laterCash)} does. Put simply, the first year looks almost normal and the later years carry the cost. Owners who count on that second-year room for a roof or a car should run the numbers with the set-aside before choosing.</p>
${h.mini('lesa', { t: 'Your tax bill at 75', p: ['tax'], d: { age: AGE, value: V, tax: 5600 } })}

<h2>The partial version, paid twice a year</h2>
<p>When your payment record is clean but the residual income falls short, HUD's rule is a partially funded set-aside. It is sized on the monthly residual income shortfall, again times ${L.factor} and over the same ${y75 * 12} months. The servicer then sends you two payments a year, and you remain the one who pays the tax office and the insurer. If the partial amount would exceed ${K.pct(L.partialShareCap, 0)} of the full one, the lender must require the full set-aside instead.</p>
<p>With a shortfall of ${K.usd(MRIS)} a month, our 75-year-old would see ${K.usd(part.lesa)} held back, well under the ${K.usd(partCap)} threshold. First-year cash would be ${K.usd(part.firstYearCash)} and the room in month 13 ${K.usd(part.laterCash)}, a much smaller cut than the full version makes.</p>

<h2>Will the money last past ${AGE + y75}?</h2>
<p>The account is not frozen. It grows each month at one twelfth of the note rate plus the annual MIP, and pays the bills as they come due. In our projection, with the note rate held at ${K.pp(K.NOTE)} and the charges never rising, about ${K.usd(at85.lesa)} would remain at 85 and the account would run out ${dry ? `around age ${dry.age}` : 'after year twenty'}, a few years past the ${y75}-year horizon.</p>
<p>Charges do rise, sometimes fast. In May 2026, the Inspector General estimated that ${K.num(O.borrowers)} HECM borrowers will see their set-asides run out well before HUD expected, with a projected loss of ${K.usd(O.projectedLossMillions)} million to HUD if they cannot pay the charges themselves. The audit also points out that the life table behind the formula comes from US data for ${O.lifeTables}. Once the account is empty, the loan stays in force, but taxes and insurance are again yours to pay, and a borrower who cannot pay them puts the loan in default, the risk the audit measured. The ${h.a('property-taxes-and-insurance', 'taxes and insurance page')} covers what follows, and the ${h.a('lesa', 'set-aside calculator page')} runs the formula for any age.</p>
${h.mini('hecm', { t: 'The full loan with a set-aside', p: ['tax'], d: { age: AGE, value: V, lesa: 'full', tax: TAX } })}`,
  tool: 'lesa',
  toolArg: { age: AGE, tax: TAX, value: V },
  related: ['lesa', 'property-taxes-and-insurance', 'first-year-limit', 'age-70', 'age-80', 'reverse-mortgage-age-requirement'],
  sources: ['handbook', 'regz_appl', 'hud_payplan', 'oig_lesa', 'hud_plf'],
});
