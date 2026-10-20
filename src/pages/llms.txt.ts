/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Reverse mortgage (HECM) calculators for the United States, built on the principal limit factor table that HUD publishes for FHA-insured Home Equity Conversion Mortgages (82 ages, 128 expected rates, in force since October 2, 2017) and on the FHA rules of Handbook 4000.1 and 24 CFR part 206: the 2026 maximum claim amount of $1,249,125 (Mortgagee Letter 2025-22), the 2 % upfront and 0.5 % annual mortgage insurance premiums, the origination fee cap, the first-year disbursement limit, the life expectancy set-aside for taxes and insurance, tenure and term payments, line of credit growth, the loan balance over time and the heirs' 95 % rule. The calculators follow the lines of the HUD payment plan form and ask for no name, phone or address. Independent site published by Radif Partners; not affiliated with HUD, the FHA or any lender; general information, not a loan offer. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How we calculate](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
