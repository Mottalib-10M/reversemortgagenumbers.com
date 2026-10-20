/** The whole HUD principal limit factor table as CSV: one row per age (18 to 99), one column per expected rate. */
import PLF from '../data/plf.json';
export function GET() {
  const T = PLF as unknown as { rates: number[]; ages: Record<string, number[]>; url: string; effective: string };
  const head = ['age', ...T.rates.map((r) => r.toFixed(3))].join(',');
  const rows = Object.keys(T.ages).sort((a, b) => Number(a) - Number(b)).map((a) => [a, ...T.ages[a].map((v) => (v / 1000).toFixed(3))].join(','));
  const note = `# HUD HECM principal limit factors, in force for FHA case numbers assigned on or after ${T.effective}. Source: ${T.url}`;
  return new Response([note, head, ...rows].join('\n') + '\n', { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
