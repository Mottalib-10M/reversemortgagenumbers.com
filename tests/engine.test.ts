/** Engine tests: values read in the HUD PLF table, the 24 CFR 206.31 fee rule, the Handbook 4000.1 examples. */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import { plf, rateForTable, ageForTable, mca, originationCap, imip, talcYears, lesaFull, lesaPartial, annuityDue, hecm, project, monthlyPayment, tenureMonths, creditAfter, balanceAfter, heirsPayoff, refiImip, servicingSetAside, PLF_RATES } from '../src/lib/engine/hecm';

const base = { age: 70, value: 400000, fixed: false, expected: 6.65, note: 6, liens: 0, closing: 0, lesa: 'none' as const, charges: 0 };

describe('HUD principal limit factor table', () => {
  it('has 128 rates from 3% to 18.875% by 1/8', () => { expect(PLF_RATES.length).toBe(128); expect(PLF_RATES[0]).toBe(3); expect(PLF_RATES[127]).toBe(18.875); });
  it('matches values read in the HUD workbook', () => {
    expect(plf(62, 5)).toBe(0.41); expect(plf(70, 5)).toBe(0.465); expect(plf(62, 3)).toBe(0.524); expect(plf(99, 18.875)).toBe(0.48);
  });
  it('rounds the expected rate to 1/8 and the age to the nearest year, as HUD does', () => {
    expect(rateForTable(6.65)).toBe(6.625); expect(rateForTable(6.69)).toBe(6.75); expect(rateForTable(2.1)).toBe(3); expect(rateForTable(25)).toBe(18.875);
    expect(ageForTable(70.4)).toBe(70); expect(ageForTable(70.6)).toBe(71); expect(ageForTable(104)).toBe(99);
  });
  it('gives a higher factor to an older borrower and a lower one to a higher rate', () => {
    expect(plf(80, 6.625)).toBeGreaterThan(plf(70, 6.625)); expect(plf(70, 7)).toBeLessThan(plf(70, 6));
  });
});

describe('limits and fees', () => {
  it('caps the maximum claim amount at the 2026 limit of ML 2025-22', () => {
    expect(P.limits.mca2026).toBe(1249125); expect(P.limits.mca2026).toBe(P.limits.conforming2026 * 1.5);
    expect(mca(1500000)).toBe(1249125); expect(mca(400000, 380000)).toBe(380000);
  });
  it('applies the 24 CFR 206.31 origination fee rule', () => {
    expect(originationCap(100000)).toBe(2500); expect(originationCap(125000)).toBe(2500); expect(originationCap(200000)).toBe(4000);
    expect(originationCap(300000)).toBe(5000); expect(originationCap(400000)).toBe(6000); expect(originationCap(1249125)).toBe(6000);
  });
  it('charges 2% of the MCA upfront', () => { expect(imip(400000)).toBe(8000); expect(imip(1249125)).toBeCloseTo(24982.5, 6); });
});

describe('life expectancy set-aside (Handbook 4000.1)', () => {
  it('uses the Regulation Z life table: 74 → 144 months, 76 → 132 months', () => {
    expect(talcYears(74)! * 12).toBe(144); expect(talcYears(76)! * 12).toBe(132); expect(talcYears(62)).toBe(21); expect(talcYears(101)).toBe(3); expect(talcYears(60)).toBeUndefined();
  });
  it('annuity factor equals the sum of discounted monthly payments made at the start of each month', () => {
    const c = 0.0071, m = 144; let s = 0; for (let k = 0; k < m; k++) s += Math.pow(1 + c, -k);
    expect(annuityDue(c, m)).toBeCloseTo(s, 9);
  });
  it('computes 1.2 × monthly charges × annuity at (expected + 0.5%) / 12', () => {
    const c = (0.06625 + 0.005) / 12;
    expect(lesaFull(6000, 74, 6.625)).toBeCloseTo(1.2 * 500 * annuityDue(c, 144), 6);
  });
  it('turns a partial LESA above 75% of the full one into the full one', () => {
    const full = lesaFull(6000, 74, 6.625);
    expect(lesaPartial(450, 6000, 74, 6.625)).toBeCloseTo(full, 6);
    expect(lesaPartial(100, 6000, 74, 6.625)).toBeLessThan(full * 0.75);
  });
});

describe('payment plan lines (HUD Exhibit 1)', () => {
  it('sets the initial disbursement limit at 60% of the PL when obligations are small', () => {
    const o = hecm({ ...base });
    expect(o.pl).toBeCloseTo(400000 * plf(70, 6.625), 6);
    expect(o.idl).toBeCloseTo(0.6 * o.pl, 6);
    expect(o.firstYearCash).toBeCloseTo(0.6 * o.pl - o.mo, 6);
  });
  it('opens obligations + 10% of the PL when obligations pass half the PL', () => {
    const o = hecm({ ...base, liens: 120000 });
    expect(o.mo).toBeGreaterThan(0.5 * o.pl);
    expect(o.idl).toBeCloseTo(o.mo + 0.1 * o.pl, 6); expect(o.firstYearCash).toBeCloseTo(0.1 * o.pl, 6); expect(o.extra10).toBe(true);
  });
  it('asks for cash when the obligations exceed the principal limit', () => {
    const o = hecm({ ...base, liens: 300000 });
    expect(o.shortfall).toBeCloseTo(o.mo - o.pl, 6); expect(o.firstYearCash).toBe(0);
  });
  it('keeps the LESA beyond year one out of the first-year room', () => {
    const o = hecm({ ...base, lesa: 'full', charges: 6000 });
    expect(o.lesaYear1).toBe(6000); expect(o.lesaAfter).toBeCloseTo(o.lesa - 6000, 6); expect(o.l20).toBeCloseTo(o.pl - o.lesaAfter, 6);
  });
  it('forfeits what a fixed-rate borrower cannot take at closing', () => {
    const o = hecm({ ...base, fixed: true, note: 6.65 });
    expect(o.draw).toBeCloseTo(o.firstYearCash, 6); expect(o.forfeited).toBeCloseTo(o.npl - o.firstYearCash, 6); expect(o.laterCash).toBe(0);
  });
});

describe('growth, payments, heirs, refinance', () => {
  it('grows the balance, the principal limit and the unused credit line at (note + 0.5%) / 12', () => {
    const g = (0.06 + 0.005) / 12;
    expect(creditAfter(100000, 6, 120)).toBeCloseTo(100000 * Math.pow(1 + g, 120), 6);
    const o = hecm({ ...base }); const r = project(o, { ...base }, 10);
    expect(r[9].limit).toBeCloseTo(o.pl * Math.pow(1 + g, 120), 4);
    expect(r[9].balance).toBeCloseTo(o.financed * Math.pow(1 + g, 120), 4);
    expect(r[9].credit).toBeCloseTo((o.pl - o.financed) * Math.pow(1 + g, 120), 4);
  });
  it('splits a lump sum balance into interest and MIP', () => {
    const b = balanceAfter(100000, 6, 12); expect(b.balance).toBeCloseTo(100000 * Math.pow(1 + 0.065 / 12, 12), 6); expect(b.interest / b.mip).toBeCloseTo(12, 6);
  });
  it('sizes tenure payments on 12 × (100 − min(age, 95)) months', () => {
    expect(tenureMonths(70)).toBe(360); expect(tenureMonths(97)).toBe(60);
    const p = monthlyPayment(100000, 360, 6.65); const c = (0.0665 + 0.005) / 12; expect(p * annuityDue(c, 360)).toBeCloseTo(100000, 6);
  });
  it('sets aside servicing fees until age 100', () => { const c = (0.06 + 0.005) / 12; expect(servicingSetAside(30, 70, 6)).toBeCloseTo(30 * annuityDue(c, 360), 6); expect(servicingSetAside(0, 70, 6)).toBe(0); });
  it('lets heirs settle at 95% of the appraised value', () => {
    expect(heirsPayoff(500000, 400000)).toEqual({ payoff: 380000, floor: 380000, nonRecourse: true });
    expect(heirsPayoff(200000, 400000).payoff).toBe(200000);
  });
  it('applies the refinance MIP credit formula of Handbook 4000.1', () => {
    const r = refiImip(600000, 400000, 0.02); expect(r.imipNew).toBe(12000); expect(r.imipOld).toBe(8000); expect(r.limit).toBeCloseTo(-2000, 6); expect(r.due).toBe(0);
    const s = refiImip(600000, 300000, 0.005); expect(s.due).toBeCloseTo(Math.min(300000 * 0.03 - 1500, 12000), 6);
  });
});
