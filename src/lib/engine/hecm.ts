/**
 * HECM engine. Every rule comes from params-2026.json and plf.json, each with its official source:
 *  - principal limit factors: HUD PLF table in force since October 2, 2017 (Mortgagee Letter 2017-12);
 *  - maximum claim amount: lesser of appraised value, sales price and the 2026 national limit (ML 2025-22);
 *  - initial MIP 2% of the MCA, annual MIP 0.5% of the balance (Handbook 4000.1);
 *  - origination fee cap (24 CFR 206.31(a)(1));
 *  - initial disbursement limit and the lines of the HUD payment plan (Exhibit 1, 24 CFR 206.25(a));
 *  - life expectancy set-aside (Handbook 4000.1, Regulation Z Appendix L life table);
 *  - servicing fee set-aside, term and tenure payments (24 CFR 206.25(e), (f); Handbook);
 *  - heirs' 95% rule (24 CFR 206.125); HECM-to-HECM refinance MIP credit (Handbook).
 */
import P from '../../data/params-2026.json';
import PLF from '../../data/plf.json';

const T = PLF as unknown as { rates: number[]; ages: Record<string, number[]> };
export const LIMIT = P.limits.mca2026;

/** Expected rate as HUD reads it: rounded to the nearest 1/8 percent, kept between 3% and 18.875%. */
export function rateForTable(expected: number) {
  const r = Math.round(expected * 8) / 8;
  return Math.min(P.plf.rateMax, Math.max(P.plf.rateMin, r));
}
/** Age as HUD reads it: rounded to the nearest whole year, 18 to 99 (99 and over use the 99 row). */
export function ageForTable(age: number) {
  return Math.min(P.plf.ageMax, Math.max(P.plf.ageMin, Math.round(age)));
}
/** Principal limit factor (decimal) for an age and an expected rate in percent. */
export function plf(age: number, expected: number) {
  const a = ageForTable(age), r = rateForTable(expected);
  const k = T.rates.findIndex((x) => Math.abs(x - r) < 1e-9);
  return T.ages[String(a)][k] / 1000;
}
export const PLF_RATES = T.rates;

/** Maximum claim amount: the lesser of the appraised value, the sales price (purchase) and the national limit. */
export function mca(value: number, price?: number) {
  return Math.max(0, Math.min(value, price && price > 0 ? price : Infinity, LIMIT));
}
/** Highest origination fee a lender may charge (24 CFR 206.31(a)(1)). */
export function originationCap(m: number) {
  const O = P.origination;
  const pct = O.tier1Rate * Math.min(m, O.tier1Limit) + O.tier2Rate * Math.max(0, m - O.tier1Limit);
  return Math.min(O.cap, Math.max(O.floor, pct));
}
export const imip = (m: number) => P.mip.upfront * m;

/** Life expectancy (years) of Regulation Z Appendix L, for ages 62 and over; undefined below 62. */
export function talcYears(age: number): number | undefined {
  const a = Math.round(age);
  if (a < 62) return undefined;
  const t = P.lesa.lifeExpectancy as Record<string, number>;
  return t[String(Math.min(95, a))];
}
/** Present value at monthly rate c of m payments of 1 made at the start of each month (annuity due). */
export function annuityDue(c: number, m: number) {
  if (m <= 0) return 0;
  if (c === 0) return m;
  return (Math.pow(1 + c, m + 1) - (1 + c)) / (c * Math.pow(1 + c, m));
}
/** Fully funded LESA (Handbook 4000.1): 1.2 × monthly property charges × annuity at (expected + annual MIP) ÷ 12. */
export function lesaFull(annualCharges: number, age: number, expected: number) {
  const y = talcYears(age);
  if (y === undefined || annualCharges <= 0) return 0;
  const c = (expected / 100 + P.mip.annual) / 12;
  return P.lesa.factor * (annualCharges / 12) * annuityDue(c, y * 12);
}
/** Partially funded LESA, built on the monthly residual income shortfall; above 75% of the full LESA, the full one applies. */
export function lesaPartial(mris: number, annualCharges: number, age: number, expected: number) {
  const y = talcYears(age);
  if (y === undefined || mris <= 0) return 0;
  const c = (expected / 100 + P.mip.annual) / 12;
  const part = P.lesa.factor * mris * annuityDue(c, y * 12);
  const full = lesaFull(annualCharges, age, expected);
  return part > P.lesa.partialShareCap * full ? full : part;
}
/** Servicing fee set-aside at closing: FEE × annuity at (note + annual MIP) ÷ 12 over 12 × (100 − age) months. */
export function servicingSetAside(fee: number, age: number, note: number) {
  if (fee <= 0) return 0;
  const i = (note / 100 + P.mip.annual) / 12;
  return fee * annuityDue(i, 12 * (P.tenure.endAge - ageForTable(age)));
}
/** Monthly payment that uses up `amount` over n months at the expected rate plus annual MIP (paid at the start of each month). */
export function monthlyPayment(amount: number, n: number, expected: number) {
  if (amount <= 0 || n <= 0) return 0;
  const c = (expected / 100 + P.mip.annual) / 12;
  return amount / annuityDue(c, n);
}
/** Number of months used to size tenure payments: 12 × (100 − min(age, 95)). */
export const tenureMonths = (age: number) => 12 * (P.tenure.endAge - Math.min(Math.round(age), P.tenure.ageCap));

export interface HecmIn {
  /** Youngest borrower or eligible non-borrowing spouse. */
  age: number;
  value: number;
  /** Purchase price (HECM for Purchase); 0 for a traditional HECM. */
  price?: number;
  fixed: boolean;
  /** Expected rate in percent (adjustable: 10-year CMT + margin; fixed: the note rate). */
  expected: number;
  /** Initial note rate in percent (adjustable: 1-year CMT + margin). Fixed loans: the expected rate. */
  note: number;
  liens: number;
  /** Origination fee; undefined = the legal maximum. */
  origination?: number;
  closing: number;
  lesa: 'none' | 'full' | 'partial';
  charges: number;
  mris?: number;
  fee?: number;
  cashIn?: number;
  /** Initial advance chosen at closing (adjustable). 'max' = all the first-year room. */
  draw?: number | 'max';
}
export interface HecmOut {
  ok: boolean; reason?: string;
  ageT: number; rateT: number; factor: number; mca: number; capped: boolean;
  pl: number; imip: number; origination: number; originationCap: number; closing: number; liens: number; price: number;
  lesa: number; lesaYear1: number; lesaAfter: number; sfsa: number;
  mo: number; financed: number; cashIn: number;
  l17: number; l18: number; l19: number; l20: number; idl: number;
  extra10: boolean;
  /** Cash available in the first 12 months on top of the mandatory obligations. */
  firstYearCash: number;
  /** Net principal limit with no cash taken: all that is left for the borrower (Line 25 with Line 22 = 0). */
  npl: number;
  /** Cash still available after the first year, at closing values (before growth). */
  laterCash: number;
  /** Fixed rate: principal limit that can never be drawn. */
  forfeited: number;
  /** Cash the borrower must bring when obligations exceed what the HECM can pay. */
  shortfall: number;
  draw: number;
  tenure: number; tenureMonths: number;
}

export function hecm(x: HecmIn): HecmOut {
  const ageT = ageForTable(x.age), rateT = rateForTable(x.expected);
  const factor = plf(x.age, x.expected);
  const price = x.price && x.price > 0 ? x.price : 0;
  const m = mca(x.value, price || undefined);
  const capped = Math.min(x.value, price || Infinity) > LIMIT;
  const pl = m * factor;
  const im = imip(m);
  const oCap = originationCap(m);
  const orig = Math.max(0, Math.min(oCap, x.origination ?? oCap));
  const lesa = x.lesa === 'full' ? lesaFull(x.charges, x.age, x.expected) : x.lesa === 'partial' ? lesaPartial(x.mris ?? 0, x.charges, x.age, x.expected) : 0;
  const fullApplied = x.lesa === 'partial' && Math.abs(lesa - lesaFull(x.charges, x.age, x.expected)) < 0.005 && lesa > 0;
  const lesaYear1 = lesa <= 0 ? 0 : Math.min(lesa, x.lesa === 'full' || fullApplied ? x.charges : 12 * (x.mris ?? 0));
  const lesaAfter = lesa - lesaYear1;
  const sfsa = servicingSetAside(x.fee ?? 0, x.age, x.note);
  const mo = im + orig + x.closing + x.liens + price + lesaYear1;
  const cashIn = Math.max(0, x.cashIn ?? 0);
  const financed = Math.max(0, mo - cashIn);
  const l17 = P.firstYear.base * pl, l18 = mo + P.firstYear.extra * pl;
  const l19 = Math.max(l17, l18), l20 = pl - sfsa - lesaAfter;
  const idl = Math.max(0, Math.min(l19, l20, pl));
  const shortfall = Math.max(0, financed - idl);
  const fin = financed - shortfall;
  const firstYearCash = Math.max(0, idl - fin);
  const npl = Math.max(0, pl - sfsa - lesaAfter - fin);
  const forfeited = x.fixed ? Math.max(0, npl - firstYearCash) : 0;
  const laterCash = x.fixed ? 0 : Math.max(0, npl - firstYearCash);
  const draw = x.fixed ? firstYearCash : x.draw === 'max' ? firstYearCash : Math.max(0, Math.min(firstYearCash, x.draw ?? 0));
  const n = tenureMonths(x.age);
  const tenure = x.fixed ? 0 : monthlyPayment(npl, n, x.expected);
  const ok = x.age >= P.plf.ageMin && x.value > 0;
  return {
    ok, reason: ok ? undefined : 'Enter an age of 18 or more and a home value.',
    ageT, rateT, factor, mca: m, capped, pl, imip: im, origination: orig, originationCap: oCap, closing: x.closing, liens: x.liens, price,
    lesa, lesaYear1, lesaAfter, sfsa, mo, financed: fin, cashIn: cashIn + shortfall, l17, l18, l19, l20, idl,
    extra10: mo > (P.firstYear.base - P.firstYear.extra) * pl,
    firstYearCash, npl, laterCash, forfeited, shortfall, draw, tenure, tenureMonths: n,
  };
}

export interface YearRow { year: number; age: number; balance: number; credit: number; lesa: number; limit: number }
/**
 * Month-by-month projection at the note rate plus annual MIP (Handbook 4000.1: the principal limit, the balance, the LESA
 * and the unused line of credit all grow by one twelfth of that sum each month). Property charges are paid from the LESA
 * each month while it lasts; servicing fees move from their set-aside to the balance. `monthly` is a scheduled payment
 * (term or tenure) added to the balance each month for `months` months; `drawAt12` is cash drawn at the start of month 13.
 */
export function project(o: HecmOut, x: HecmIn, years: number, monthly = 0, months = 0, drawAt12 = 0): YearRow[] {
  const g = (x.note / 100 + P.mip.annual) / 12;
  // Line 13 counts the first-year LESA disbursements; they reach the balance only as the LESA pays them.
  let bal = o.financed - o.lesaYear1 + o.draw, lesa = o.lesa, sfsa = o.sfsa, limit = o.pl;
  const fee = x.fee ?? 0;
  const chargesM = o.lesa <= 0 ? 0 : (x.lesa === 'partial' && o.lesaYear1 < x.charges ? o.lesaYear1 : x.charges) / 12;
  const rows: YearRow[] = [];
  for (let k = 1; k <= years * 12; k++) {
    bal *= 1 + g; lesa *= 1 + g; sfsa *= 1 + g; limit *= 1 + g;
    if (k === 13 && drawAt12 > 0) bal += drawAt12;
    if (monthly > 0 && k <= months) bal += monthly;
    if (lesa > 0 && chargesM > 0) { const p = Math.min(lesa, chargesM); lesa -= p; bal += p; }
    if (sfsa > 0 && fee > 0) { const p = Math.min(sfsa, fee); sfsa -= p; bal += p; }
    if (k % 12 === 0) {
      const credit = x.fixed || monthly > 0 ? 0 : Math.max(0, limit - bal - lesa - sfsa);
      rows.push({ year: k / 12, age: Math.round(x.age) + k / 12, balance: bal, credit, lesa, limit });
    }
  }
  return rows;
}

/** Growth of an unused line of credit: (note + annual MIP) ÷ 12 compounded monthly. */
export function creditAfter(amount: number, note: number, months: number) {
  return amount * Math.pow(1 + (note / 100 + P.mip.annual) / 12, months);
}
/** Balance of a lump sum after `months`, with the interest and the MIP it accrued. */
export function balanceAfter(amount: number, note: number, months: number) {
  const gi = note / 100 / 12, gm = P.mip.annual / 12;
  let b = amount, interest = 0, mip = 0;
  for (let k = 0; k < months; k++) { const i = b * gi, m = b * gm; interest += i; mip += m; b += i + m; }
  return { balance: b, interest, mip };
}
/** Heirs (24 CFR 206.125): the loan is settled for the lesser of the balance and 95% of the appraised value. */
export function heirsPayoff(balance: number, value: number) {
  const floor = P.eligibility.maxCashOutHeirsShare * value;
  return { payoff: Math.min(balance, floor), floor, nonRecourse: balance > floor };
}
/** HECM-to-HECM refinance: initial MIP due with the credit for the MIP paid on the old loan (Handbook 4000.1). */
export function refiImip(mcaNew: number, mcaOld: number, oldRate: number, previousCredit = 0) {
  const imipNew = mcaNew * P.mip.upfront;
  const imipOld = mcaOld * oldRate - previousCredit;
  const limit = (mcaNew - mcaOld) * P.refi.imipLimitFactor - imipOld;
  return { imipNew, imipOld, limit, due: Math.max(0, Math.min(limit, imipNew)) };
}
