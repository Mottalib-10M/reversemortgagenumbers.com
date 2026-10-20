/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                     params-2026.json (limits, MIP, origination rule, first-year rule, LESA, rates read)
 *   K.tool(kind, args)      runs a calculator of tool-specs.ts and returns its result card
 *   K.loan(args)            the HECM engine on the site defaults (age 70, $400,000, adjustable, no lien)
 *   K.project(args, years)  balance and credit line by year for K.loan(args)
 *   K.plf(age, rate), K.mca(value), K.orig(mca), K.imip(mca), K.lesa(charges, age, rate), K.talc(age)
 *   K.credit(amount, note, months), K.balance(amount, note, months), K.heirs(balance, value), K.pay(amount, months, rate)
 *   K.EXP, K.NOTE           default expected rate (10-year CMT + example margin) and note rate (1-year CMT + margin)
 *   formats                 K.usd, K.usd2, K.pct (decimal), K.pp (already in %), K.f (factor), K.num, K.dec, K.day
 */
import P from '../data/params-2026.json';
import { usd, usd2, pct, pp, factor, getTool, DEFAULT_EXPECTED, DEFAULT_NOTE } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import { hecm, project, plf, mca, originationCap, imip, lesaFull, lesaPartial, talcYears, creditAfter, balanceAfter, heirsPayoff, monthlyPayment, tenureMonths, refiImip, rateForTable, servicingSetAside, type HecmIn } from './engine/hecm';
import type { V } from './tool-types';

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
const DEF: HecmIn = { age: 70, value: 400000, fixed: false, expected: DEFAULT_EXPECTED, note: DEFAULT_NOTE, liens: 0, closing: 0, lesa: 'none', charges: 0 };
const loan = (a: Partial<HecmIn> = {}) => { const x = { ...DEF, ...a }; if (a.fixed && a.note === undefined) x.note = x.expected; return hecm(x); };
export const KIT = {
  P, tool, DEF, EXP: DEFAULT_EXPECTED, NOTE: DEFAULT_NOTE, LIMIT: P.limits.mca2026,
  loan,
  project: (a: Partial<HecmIn> = {}, years = 30, monthly = 0, months = 0) => { const x = { ...DEF, ...a }; if (a.fixed && a.note === undefined) x.note = x.expected; return project(hecm(x), x, years, monthly, months); },
  plf, mca, orig: originationCap, imip, lesa: lesaFull, lesaPartial, talc: talcYears, credit: creditAfter, balance: balanceAfter, heirs: heirsPayoff,
  pay: monthlyPayment, tenureMonths, refi: refiImip, rateT: rateForTable, sfsa: servicingSetAside,
  usd, usd2, pct, pp, f: factor, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 2) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-US'),
};
export type Kit = typeof KIT;
