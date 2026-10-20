/**
 * The calculators of the site, one entry per subject. Every figure comes from the HECM engine (src/lib/engine/hecm.ts),
 * which reads params-2026.json and plf.json. A spec lists its inputs (visible first, `adv` ones folded) and a pure
 * `run` that turns them into a result card, following the lines of the HUD payment plan.
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatPercent, formatDecimal } from './format';
import {
  hecm, project, plf, rateForTable, ageForTable, mca, originationCap, imip, lesaFull, lesaPartial, talcYears, creditAfter, balanceAfter,
  heirsPayoff, refiImip, monthlyPayment, tenureMonths, LIMIT, type HecmIn, type HecmOut,
} from './engine/hecm';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const usd2 = (x: number) => `${x < -0.005 ? '-' : ''}${formatMoney(Math.abs(x), 2)}`;
/** Percent from a decimal (0.05 → 5 %). */
export const pct = (x: number, d = 2) => formatPercent(x, d);
/** Percent from a number already in percent (6.65 → 6.65 %). */
export const pp = (x: number, d = 3) => `${formatDecimal(x, d)}\u00a0%`;
export const factor = (x: number) => x.toFixed(3);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const R = P.rates;
/** Default expected rate: weekly 10-year CMT + the example margin. */
export const DEFAULT_EXPECTED = Math.round((R.cmt10Week + R.exampleMargin) * 1000) / 1000;
/** Default initial note rate of an adjustable HECM: weekly 1-year CMT + the example margin. */
export const DEFAULT_NOTE = Math.round((R.cmt1Week + R.exampleMargin) * 1000) / 1000;

/* ---------- shared inputs ---------- */
const AGE = (def = 70): Input => ({ id: 'age', label: 'Age of the youngest borrower', def, unit: 'years', max: 110, help: 'Or of an eligible non-borrowing spouse, if younger' });
const VALUE = (def = 400000, label = 'Home value'): Input => ({ id: 'value', label, def, unit: '$', max: 20000000, help: `Appraised value; the 2026 limit is ${usd(LIMIT)}` });
const MARGIN: Input = { id: 'margin', label: 'Lender margin', def: R.exampleMargin, unit: '%', max: 10, decimals: 3, help: `Example ${pp(R.exampleMargin, 1)}: use the margin of your offer`, showIf: { id: 'rt', is: 'arm' } };
const FIXED: Input = { id: 'fr', label: 'Fixed note rate', def: DEFAULT_EXPECTED, unit: '%', max: 25, decimals: 3, help: 'From the lender: it is also the expected rate', showIf: { id: 'rt', is: 'fixed' } };
const RT: Input = { kind: 'choice', id: 'rt', label: 'Rate type', def: 'arm', options: [{ value: 'arm', label: 'Adjustable' }, { value: 'fixed', label: 'Fixed' }] };
const CMT10: Input = { id: 'c10', label: '10-year Treasury (CMT)', def: R.cmt10Week, unit: '%', max: 20, decimals: 3, adv: true, help: `Weekly average to ${R.cmt10WeekEnding}`, showIf: { id: 'rt', is: 'arm' } };
const CMT1: Input = { id: 'c1', label: '1-year Treasury (CMT)', def: R.cmt1Week, unit: '%', max: 20, decimals: 3, adv: true, help: 'Index of the starting note rate', showIf: { id: 'rt', is: 'arm' } };
const LIENS = (def = 0): Input => ({ id: 'liens', label: 'Mortgage to pay off', def, unit: '$', max: 20000000, help: 'Liens paid at closing from the loan' });
const CLOSING: Input = { id: 'cc', label: 'Other closing costs', def: 0, unit: '$', max: 200000, help: 'Appraisal, title, recording: from your Loan Estimate' };
const ORIG: Input = { kind: 'choice', id: 'orig', label: 'Origination fee', def: 'max', options: [{ value: 'max', label: 'Legal maximum' }, { value: 'none', label: 'Waived' }] };
const LESA: Input = { kind: 'select', id: 'lesa', label: 'Taxes and insurance set-aside', def: 'none', options: [{ value: 'none', label: 'None (you pay them)' }, { value: 'full', label: 'Fully funded LESA' }, { value: 'partial', label: 'Partially funded LESA' }], adv: true };
const CHARGES = (adv = true): Input => ({ id: 'tax', label: 'Property taxes + insurance a year', def: 6000, unit: '$', max: 500000, adv, help: 'Example amount: use your tax bill and policy' });
const MRIS: Input = { id: 'mris', label: 'Monthly residual income shortfall', def: 200, unit: '$', max: 50000, adv: true, help: 'From the lender’s financial assessment', showIf: { id: 'lesa', is: 'partial' } };
const FEE: Input = { id: 'fee', label: 'Monthly servicing fee', def: 0, unit: '$', max: P.servicing.maxMonthlyMonthlyAdjusting, adv: true, help: `Most offers: $0. HUD maximum $${P.servicing.maxMonthlyFixedOrAnnual} or $${P.servicing.maxMonthlyMonthlyAdjusting}` };
const PLAN: Input = { kind: 'select', id: 'plan', label: 'How you take the money', def: 'loc', options: [{ value: 'loc', label: 'Line of credit, draw later' }, { value: 'max', label: 'Most cash at closing' }, { value: 'tenure', label: 'Monthly payments for life' }], showIf: { id: 'rt', is: 'arm' } };

const RATE_INPUTS = [RT, MARGIN, FIXED, CMT10, CMT1];
function rates(v: V) {
  const fixed = s(v, 'rt') === 'fixed';
  const expected = fixed ? n(v, 'fr') : n(v, 'c10') + n(v, 'margin');
  const note = fixed ? n(v, 'fr') : n(v, 'c1') + n(v, 'margin');
  return { fixed, expected, note };
}
function inOf(v: V, extra: Partial<HecmIn> = {}): HecmIn {
  const r = rates(v);
  return {
    age: n(v, 'age'), value: n(v, 'value'), ...r, liens: n(v, 'liens'), closing: n(v, 'cc'),
    origination: s(v, 'orig') === 'none' ? 0 : undefined,
    lesa: (v.lesa as HecmIn['lesa']) ?? 'none', charges: n(v, 'tax'), mris: n(v, 'mris'), fee: n(v, 'fee'), ...extra,
  };
}
const YEARS = [1, 2, 3, 5, 10, 15, 20, 25, 30];
function ageNote(o: HecmOut, x: HecmIn) {
  const notes: string[] = [];
  if (x.age < P.eligibility.borrowerMinAge) notes.push(`Every borrower must be ${P.eligibility.borrowerMinAge} or older; a younger age applies only to an eligible non-borrowing spouse.`);
  if (x.expected < P.plf.rateMin) notes.push(`HUD's table starts at an expected rate of ${pp(P.plf.rateMin, 0)}: lower rates use that row.`);
  if (x.age > P.plf.ageMax) notes.push(`HUD's table stops at ${P.plf.ageMax}: older ages use that row.`);
  if (o.capped) notes.push(`The home counts for ${usd(LIMIT)}, the 2026 FHA limit.`);
  if (x.lesa !== 'none' && talcYears(x.age) === undefined) notes.push('The set-aside table starts at 62: ask the lender for the amount.');
  return notes;
}
const rateRow = (o: HecmOut): [string, string] => [`Factor at age ${o.ageT}, ${pp(o.rateT)}`, factor(o.factor)];

/** The full calculator: every line of the HUD payment plan, then the balance and the credit line year by year. */
function fullTool(arg?: Record<string, number | string>): ToolSpec {
  return {
    inputs: [AGE(), VALUE(), LIENS(), ...RATE_INPUTS.slice(0, 3), PLAN, ORIG, CLOSING, CMT10, CMT1, LESA, CHARGES(), MRIS, FEE],
    run: (v) => {
      const x = inOf(v);
      const plan = x.fixed ? 'fixed' : s(v, 'plan');
      const o = hecm({ ...x, draw: plan === 'max' ? 'max' : 0 });
      if (!o.ok) return { label: 'Cash available', value: '–', rows: [], note: o.reason };
      const tenure = plan === 'tenure' ? o.tenure : 0;
      const rows = project(o, x, 30, tenure, tenure ? 12 * 100 : 0);
      const shown = rows.filter((r) => YEARS.includes(r.year) && r.age <= 110);
      const out: ToolOut = {
        label: plan === 'tenure' ? 'Monthly payment for life' : x.fixed ? 'Lump sum at closing (fixed rate)' : 'Cash you can use in the first 12 months',
        value: plan === 'tenure' ? usd(o.tenure) : usd(o.firstYearCash),
        sub: plan === 'tenure'
          ? `Sized on ${o.tenureMonths} months at ${pp(x.expected)} + ${pp(P.mip.annual * 100, 1)} MIP; paid as long as you live in the home.`
          : x.fixed
            ? `${usd(o.forfeited)} of the principal limit can never be drawn on a fixed-rate HECM.`
            : `Then ${usd(o.laterCash)} more after month 12, growing at ${pp(x.note + P.mip.annual * 100)} a year while unused.`,
        rows: [
          rateRow(o),
          ['Maximum claim amount', usd(o.mca)],
          ['Principal limit (line 1)', usd(o.pl)],
          ['Upfront MIP, 2 % (line 3)', usd(o.imip)],
          ['Origination fee', usd(o.origination)],
          ['Other closing costs', usd(o.closing)],
          ['Mortgage paid off (line 5)', usd(o.liens)],
          ...(o.lesa > 0 ? [['LESA, year one (line 9)', usd(o.lesaYear1)], ['LESA after year one (line 16)', usd(o.lesaAfter)]] as Array<[string, string]> : []),
          ...(o.sfsa > 0 ? [['Servicing fee set-aside', usd(o.sfsa)]] as Array<[string, string]> : []),
          ['Mandatory obligations (line 10)', usd(o.mo)],
          ['First-year limit (line 21)', usd(o.idl)],
          ['Net principal limit (line 25)', usd(o.npl)],
          ...(o.shortfall > 0 ? [['Cash to bring to closing', usd(o.shortfall)]] as Array<[string, string]> : []),
        ],
        table: {
          caption: `Balance and unused credit at the end of each year, at a note rate of ${pp(x.note)} + ${pp(P.mip.annual * 100, 1)} MIP held constant${plan === 'max' ? ', first-year maximum drawn at closing' : ''}${o.lesa > 0 ? `, taxes and insurance paid from the LESA` : ''}.`,
          headers: ['Year', 'Age', 'Loan balance', x.fixed || plan === 'tenure' ? 'Principal limit' : 'Unused credit line', ...(o.lesa > 0 ? ['LESA left'] : [])],
          rows: shown.map((r) => [String(r.year), String(r.age), usd(r.balance), usd(x.fixed || plan === 'tenure' ? r.limit : r.credit), ...(o.lesa > 0 ? [usd(r.lesa)] : [])]),
          align: ['l', 'l', 'r', 'r', 'r'],
        },
        note: [
          ...ageNote(o, x),
          o.extra10 ? 'Obligations exceed half the principal limit: the first-year limit is obligations + 10 % of it.' : '',
          `Expected rate ${pp(x.expected)} (${x.fixed ? 'the fixed note rate' : '10-year Treasury + margin'}), read as ${pp(o.rateT)} in HUD's table. Estimate, not a loan offer.`,
        ].filter(Boolean).join(' '),
      };
      return out;
    },
  };
}

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  hecm: fullTool,

  /** HUD factor lookup: age × expected rate → factor and principal limit. */
  plf: () => ({
    inputs: [AGE(), VALUE(), ...RATE_INPUTS.slice(0, 3), CMT10],
    run: (v) => {
      const x = inOf(v);
      const f = plf(x.age, x.expected), m = mca(x.value), a = ageForTable(x.age), r = rateForTable(x.expected);
      const near = [-0.5, -0.25, 0, 0.25, 0.5].map((d) => rateForTable(r + d)).filter((q, i, arr) => arr.indexOf(q) === i);
      const ages = [62, 65, 70, 75, 80, 85, 90].filter((q) => q >= 18);
      return {
        label: `Principal limit factor, age ${a} at ${pp(r)}`, value: factor(f),
        sub: `${usd(m)} × ${factor(f)} = ${usd(m * f)} of principal limit, before any cost.`,
        rows: [['Expected rate entered', pp(x.expected)], ['Rate row of the table', pp(r)], ['Age row of the table', String(a)], ['Maximum claim amount', usd(m)], ['Principal limit', usd(m * f)]],
        table: { caption: `HUD factors around your case (rows: age; columns: expected rate).`, headers: ['Age', ...near.map((q) => pp(q))], rows: ages.map((g) => [String(g), ...near.map((q) => factor(plf(g, q)))]), align: ['l', ...near.map(() => 'r' as const)] },
        note: ageNote(hecm(inOf(v)), x).join(' ') || undefined,
      };
    },
  }),

  /** Life expectancy set-aside for taxes and insurance. */
  lesa: () => ({
    inputs: [AGE(74), CHARGES(false), VALUE(), ...RATE_INPUTS.slice(0, 3), { ...LESA, adv: false, def: 'full', options: LESA.kind === 'select' ? LESA.options.slice(1) : [] }, MRIS, CMT10, CMT1],
    run: (v) => {
      const x = inOf(v); const y = talcYears(x.age);
      if (y === undefined) return { label: 'Set-aside for taxes and insurance', value: '–', rows: [], note: 'The life table of Regulation Z starts at 62: below that age the lender sets the amount.' };
      const full = lesaFull(x.charges, x.age, x.expected);
      const amt = x.lesa === 'partial' ? lesaPartial(x.mris ?? 0, x.charges, x.age, x.expected) : full;
      const o = hecm({ ...x });
      return {
        label: x.lesa === 'partial' ? 'Partially funded LESA' : 'Fully funded LESA', value: usd(amt),
        sub: `${usd(amt)} of a ${usd(o.pl)} principal limit (${pct(o.pl ? amt / o.pl : 0, 1)}) is held back to pay taxes and insurance.`,
        rows: [['Life expectancy used', `${y} years (${y * 12} months)`], ['Monthly charges × 1.2', usd2(P.lesa.factor * x.charges / 12)], ['Discount rate', `${pp(x.expected)} + ${pp(P.mip.annual * 100, 1)}`], ['Fully funded amount', usd(full)], ['Paid in year one (line 9)', usd(Math.min(amt, x.lesa === 'partial' ? 12 * (x.mris ?? 0) : x.charges))], ['Cash left in year one', usd(o.firstYearCash)]],
        note: x.lesa === 'partial' && Math.abs(amt - full) < 0.5 ? 'The partial amount would exceed 75 % of the full one, so the full LESA applies.' : 'The LESA grows at the note rate + 0.5 % while unused; it is not cash you can draw.',
      };
    },
  }),

  /** Origination fee cap of 24 CFR 206.31. */
  origination: () => ({
    inputs: [VALUE(300000)],
    run: (v) => {
      const m = mca(n(v, 'value')), c = originationCap(m), O = P.origination;
      const pctPart = O.tier1Rate * Math.min(m, O.tier1Limit) + O.tier2Rate * Math.max(0, m - O.tier1Limit);
      return {
        label: 'Highest origination fee allowed', value: usd(c),
        sub: c === O.cap ? `Capped at ${usd(O.cap)}: reached from a ${usd(400000)} home.` : c === O.floor ? `The ${usd(O.floor)} floor applies below ${usd(125000)}.` : `${pct(c / m, 2)} of the maximum claim amount.`,
        rows: [['Maximum claim amount', usd(m)], [`2 % of the first ${usd(O.tier1Limit)}`, usd(O.tier1Rate * Math.min(m, O.tier1Limit))], ['1 % above that', usd(O.tier2Rate * Math.max(0, m - O.tier1Limit))], ['Formula result', usd(pctPart)], ['Floor and cap', `${usd(O.floor)} to ${usd(O.cap)}`]],
        table: { caption: 'Cap by home value.', headers: ['Home value', 'Fee cap', 'Share'], rows: [100000, 150000, 200000, 300000, 400000, 600000, 1000000].map((h) => [usd(h), usd(originationCap(mca(h))), pct(originationCap(mca(h)) / mca(h), 2)]), align: ['l', 'r', 'r'] },
        note: 'A lender may charge less or nothing; the fee can be financed in the loan.',
      };
    },
  }),

  /** Upfront and annual mortgage insurance. */
  mip: () => ({
    inputs: [VALUE(), { id: 'bal', label: 'Loan balance', def: 150000, unit: '$', max: 5000000 }, { id: 'yrs', label: 'Years', def: 10, unit: 'years', max: 40 }, { id: 'nr', label: 'Note rate', def: DEFAULT_NOTE, unit: '%', max: 25, decimals: 3, adv: true }],
    run: (v) => {
      const m = mca(n(v, 'value')), up = imip(m), b = balanceAfter(n(v, 'bal'), n(v, 'nr'), Math.round(n(v, 'yrs') * 12));
      return {
        label: 'Upfront mortgage insurance', value: usd(up),
        sub: `Then ${usd(b.mip)} of annual MIP added to the balance over ${n(v, 'yrs')} years.`,
        rows: [['Maximum claim amount', usd(m)], ['Upfront rate', pct(P.mip.upfront, 0)], ['Annual rate on the balance', pct(P.mip.annual, 1)], ['Annual MIP, first year', usd(balanceAfter(n(v, 'bal'), n(v, 'nr'), 12).mip)], ['Interest over the period', usd(b.interest)], ['Balance at the end', usd(b.balance)]],
        note: 'Both premiums are added to the loan balance; nothing is paid out of pocket unless you choose to.',
      };
    },
  }),

  /** First-year disbursement limit (60 % rule). */
  firstyear: () => ({
    inputs: [AGE(), VALUE(), LIENS(150000), ...RATE_INPUTS.slice(0, 3), ORIG, CLOSING, CMT10],
    run: (v) => {
      const x = inOf(v); const o = hecm(x);
      return {
        label: 'Cash available in the first 12 months', value: usd(o.firstYearCash),
        sub: o.extra10 ? `Obligations take ${pct(o.mo / o.pl, 0)} of the principal limit: you get them + 10 %.` : `60 % of the principal limit minus the obligations paid at closing.`,
        rows: [['Principal limit', usd(o.pl)], ['60 % of it (line 17)', usd(o.l17)], ['Obligations + 10 % (line 18)', usd(o.l18)], ['Greater of the two (line 19)', usd(o.l19)], ['Mandatory obligations', usd(o.mo)], ['Initial disbursement limit', usd(o.idl)], ['Available after month 12', usd(o.laterCash)]],
        note: [...ageNote(o, x), o.shortfall > 0 ? `The obligations exceed the principal limit by ${usd(o.shortfall)}: that cash is due at closing.` : ''].filter(Boolean).join(' ') || undefined,
      };
    },
  }),

  /** Growth of an unused line of credit. */
  loc: () => ({
    inputs: [{ id: 'amt', label: 'Unused credit line', def: 100000, unit: '$', max: 5000000 }, { id: 'nr', label: 'Note rate', def: DEFAULT_NOTE, unit: '%', max: 25, decimals: 3, help: 'Index + margin, changes with the index' }],
    run: (v) => {
      const a = n(v, 'amt'), r = n(v, 'nr');
      return {
        label: 'Credit line after 10 years, unused', value: usd(creditAfter(a, r, 120)),
        sub: `Grows by ${pp(r + P.mip.annual * 100)} a year (note rate + 0.5 % MIP), compounded monthly.`,
        rows: [['After 1 year', usd(creditAfter(a, r, 12))], ['After 5 years', usd(creditAfter(a, r, 60))], ['After 15 years', usd(creditAfter(a, r, 180))], ['After 20 years', usd(creditAfter(a, r, 240))]],
        table: { caption: 'Unused credit line at different note rates after 10 years.', headers: ['Note rate', 'After 10 years', 'After 20 years'], rows: [r - 1, r, r + 1].filter((q) => q > 0).map((q) => [pp(q), usd(creditAfter(a, q, 120)), usd(creditAfter(a, q, 240))]), align: ['l', 'r', 'r'] },
        note: 'Growth is room to borrow, not interest paid to you; it stops when the loan becomes due.',
      };
    },
  }),

  /** Loan balance over time for a lump sum. */
  balance: () => ({
    inputs: [{ id: 'amt', label: 'Amount borrowed', def: 100000, unit: '$', max: 5000000, help: 'Cash taken plus costs financed' }, { id: 'nr', label: 'Note rate', def: DEFAULT_NOTE, unit: '%', max: 25, decimals: 3 }, { id: 'yrs', label: 'Years', def: 15, unit: 'years', max: 40 }],
    run: (v) => {
      const a = n(v, 'amt'), r = n(v, 'nr'), y = Math.round(n(v, 'yrs'));
      const b = balanceAfter(a, r, y * 12);
      return {
        label: `Loan balance after ${y} years`, value: usd(b.balance),
        sub: `${usd(b.interest)} of interest and ${usd(b.mip)} of MIP added, with no payment.`,
        rows: [['Effective yearly growth', pct(Math.pow(1 + (r / 100 + P.mip.annual) / 12, 12) - 1, 2)], ['Years to double', formatDecimal(Math.log(2) / (12 * Math.log(1 + (r / 100 + P.mip.annual) / 12)), 1)], ['Interest', usd(b.interest)], ['Mortgage insurance', usd(b.mip)]],
        table: { caption: 'Balance by year, rate held constant.', headers: ['Year', 'Balance', 'Of which interest + MIP'], rows: [1, 3, 5, 10, 15, 20, 25, 30].map((k) => { const q = balanceAfter(a, r, k * 12); return [String(k), usd(q.balance), usd(q.interest + q.mip)]; }), align: ['l', 'r', 'r'] },
      };
    },
  }),

  /** Tenure or term payments. */
  payments: () => ({
    inputs: [AGE(), VALUE(), LIENS(), { kind: 'choice', id: 'pt', label: 'Payment plan', def: 'tenure', options: [{ value: 'tenure', label: 'Tenure' }, { value: 'term', label: 'Term' }] }, { id: 'term', label: 'Term', def: 10, unit: 'years', max: 40, showIf: { id: 'pt', is: 'term' } }, { ...MARGIN, showIf: undefined }, { ...CMT10, showIf: undefined }, { ...CMT1, showIf: undefined }, ORIG, CLOSING],
    run: (v) => {
      const x = inOf({ ...v, rt: 'arm' }); const o = hecm(x);
      const term = s(v, 'pt') === 'term'; const months = term ? Math.round(n(v, 'term') * 12) : o.tenureMonths;
      const p = monthlyPayment(o.npl, months, x.expected);
      const y1 = 12 * p; const capped = y1 > o.firstYearCash;
      return {
        label: term ? `Monthly payment for ${n(v, 'term')} years` : 'Monthly payment for life (tenure)', value: usd(p),
        sub: term ? `Stops after ${months} payments; the balance stays due when you leave the home.` : `Sized on ${months} months (to age 100), paid as long as the home is your residence.`,
        rows: [rateRow(o), ['Principal limit', usd(o.pl)], ['Mandatory obligations', usd(o.mo)], ['Net principal limit', usd(o.npl)], ['Months used', String(months)], ['Paid in year one', usd(y1)]],
        note: capped ? 'Twelve payments exceed the first-year limit: the lender lowers them in year one.' : `Payments are fixed; interest at ${pp(x.note)} and 0.5 % MIP accrue on each one.`,
      };
    },
  }),

  /** Heirs and the 95 % rule. */
  heirs: () => ({
    inputs: [{ id: 'bal', label: 'Loan balance today', def: 320000, unit: '$', max: 20000000 }, { id: 'value', label: 'Appraised value today', def: 300000, unit: '$', max: 20000000 }],
    run: (v) => {
      const h = heirsPayoff(n(v, 'bal'), n(v, 'value'));
      return {
        label: 'Amount that settles the loan', value: usd(h.payoff),
        sub: h.nonRecourse ? `The balance exceeds 95 % of the value: FHA insurance covers the ${usd(n(v, 'bal') - h.payoff)} gap.` : 'The balance is below 95 % of the value: heirs repay it and keep the rest.',
        rows: [['Loan balance', usd(n(v, 'bal'))], ['95 % of the appraised value', usd(h.floor)], ['Equity left to heirs if sold at value', usd(Math.max(0, n(v, 'value') - h.payoff))]],
        note: 'Heirs owe nothing beyond the home: the loan is non-recourse.',
      };
    },
  }),

  /** HECM for Purchase. */
  purchase: () => ({
    inputs: [AGE(70), { id: 'price', label: 'Purchase price', def: 450000, unit: '$', max: 20000000 }, { id: 'value', label: 'Appraised value', def: 450000, unit: '$', max: 20000000 }, ...RATE_INPUTS.slice(0, 3), ORIG, { ...CLOSING, def: 0 }, CMT10, CMT1],
    run: (v) => {
      const x = inOf(v, { price: n(v, 'price') }); const o = hecm(x);
      const down = Math.max(0, o.mo - o.pl);
      return {
        label: 'Cash to put down', value: usd(down),
        sub: `The HECM pays ${usd(Math.min(o.pl, o.mo))} of the ${usd(o.mo)} price and costs; no monthly mortgage payment after.`,
        rows: [rateRow(o), ['Maximum claim amount', usd(o.mca)], ['Principal limit', usd(o.pl)], ['Upfront MIP', usd(o.imip)], ['Origination fee', usd(o.origination)], ['Price + costs', usd(o.mo)], ['Down payment share', pct(n(v, 'price') ? down / n(v, 'price') : 0, 0)]],
        note: `The home must become your residence within ${P.purchase.occupancyDays} days. ${ageNote(o, x).join(' ')}`.trim(),
      };
    },
  }),

  /** HECM-to-HECM refinance. */
  refi: () => ({
    inputs: [AGE(78), VALUE(600000, 'Home value now'), { id: 'ob', label: 'Balance of the current HECM', def: 180000, unit: '$', max: 20000000 }, { id: 'om', label: 'Maximum claim amount of the current HECM', def: 400000, unit: '$', max: 20000000 }, { id: 'opl', label: 'Current principal limit', def: 260000, unit: '$', max: 20000000, help: 'On your annual statement' }, { kind: 'select', id: 'or', label: 'Upfront MIP rate paid on it', def: '0.02', options: [{ value: '0.02', label: '2 % (since Oct 2017)' }, { value: '0.005', label: '0.5 %' }, { value: '0.025', label: '2.5 %' }, { value: '0.0001', label: '0.01 % (Saver)' }] }, ...RATE_INPUTS.slice(0, 3), ORIG, CLOSING, CMT10, CMT1],
    run: (v) => {
      const x = inOf(v, { liens: n(v, 'ob') });
      const base = hecm({ ...x, liens: 0 });
      const r = refiImip(base.mca, n(v, 'om'), Number(v.or));
      const costs = r.due + base.origination + x.closing;
      const newPl = base.pl; const gain = newPl - n(v, 'opl');
      const ok5 = gain - costs >= P.refi.costMultiple * costs;
      const net = newPl - n(v, 'ob') - costs;
      return {
        label: 'Gain in principal limit', value: usd(gain),
        sub: `New principal limit ${usd(newPl)} against ${usd(n(v, 'opl'))} today; ${usd(Math.max(0, net))} left after paying the old loan and the costs.`,
        rows: [rateRow(base), ['New maximum claim amount', usd(base.mca)], ['Upfront MIP before credit', usd(r.imipNew)], ['Credit for MIP already paid', usd(r.imipNew - r.due)], ['Upfront MIP due', usd(r.due)], ['Origination + other costs', usd(base.origination + x.closing)], ['Gain minus costs vs 5 × costs', ok5 ? 'passes' : 'fails']],
        note: `HUD's anti-churning disclosure compares the gain with the cost of the refinance; counseling can be waived only when the gain exceeds the cost by ${P.refi.costMultiple} times the cost and the first HECM closed less than ${P.refi.counselingWaiverYears} years ago.`,
      };
    },
  }),
};

export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown calculator ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : { ...i, def: (typeof i.def === 'number' ? Number(arg[i.id]) : String(arg[i.id])) as never })) };
}
export const TOOL_KINDS = Object.keys(SPECS);
export { tenureMonths };
