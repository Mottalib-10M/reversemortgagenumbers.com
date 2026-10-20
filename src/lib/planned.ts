/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'hecm-calculator', 'principal-limit-factor', 'how-reverse-mortgage-works', 'reverse-mortgage-age-requirement', 'hecm-loan', 'reverse-mortgage-rates',
  'reverse-mortgage-costs', 'reverse-mortgage-mip', 'origination-fee', 'lesa', 'first-year-limit',
  'line-of-credit', 'lump-sum', 'monthly-payments', 'loan-balance', 'hecm-limit',
  'existing-mortgage', 'hecm-counseling', 'non-borrowing-spouse', 'heirs',
  'hecm-for-purchase', 'hecm-refinance', 'reverse-mortgage-vs-heloc', 'taxes-and-benefits', 'property-taxes-and-insurance',
  'age-62', 'age-65', 'age-70', 'age-75', 'age-80', 'age-85',
  'home-150k', 'home-200k', 'home-400k', 'home-750k', 'home-at-limit', 'home-over-limit',
];
export const PLANNED_IDS = new Set<string>(PLANNED_GUIDES);
