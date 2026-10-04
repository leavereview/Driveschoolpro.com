// scripts/build-ads-csv.ts — writes Ads Editor import files from google-ads/search-uk-start.ts
import fs from 'node:fs';
import { CAMPAIGN, AD_GROUPS, ROUTING_NEGATIVES, SHARED_NEGATIVES } from '../google-ads/search-uk-start.ts';

const q = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
const row = (cells: (string | number)[]) => cells.map(q).join(',');
fs.mkdirSync('docs/google-ads', { recursive: true });

const kw = [row(['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Max CPC'])];
for (const g of AD_GROUPS) {
  for (const k of g.keywords) {
    kw.push(row([CAMPAIGN.name, g.name, k, 'Phrase', CAMPAIGN.maxCpcGbp]));
    kw.push(row([CAMPAIGN.name, g.name, k, 'Exact', CAMPAIGN.maxCpcGbp]));
  }
  for (const n of ROUTING_NEGATIVES[g.name] ?? []) kw.push(row([CAMPAIGN.name, g.name, n, 'Negative Phrase', '']));
}
fs.writeFileSync('docs/google-ads/keywords.csv', kw.join('\n') + '\n');

const hdr = ['Campaign', 'Ad Group', 'Ad type', 'Final URL', 'Path 1', 'Path 2'];
for (let i = 1; i <= 15; i++) hdr.push(`Headline ${i}`, `Headline ${i} position`);
for (let i = 1; i <= 4; i++) hdr.push(`Description ${i}`);
const ads = [row(hdr)];
for (const g of AD_GROUPS) {
  const cells: (string | number)[] = [CAMPAIGN.name, g.name, 'Responsive search ad', g.finalUrl, g.path1, g.path2];
  for (const hl of g.headlines) cells.push(hl.text, hl.pin ?? '');
  cells.push(...g.descriptions);
  ads.push(row(cells));
}
fs.writeFileSync('docs/google-ads/ads.csv', ads.join('\n') + '\n');

fs.writeFileSync('docs/google-ads/negatives.txt', SHARED_NEGATIVES.map((n) => `"${n}"`).join('\n') + '\n');
console.log('wrote docs/google-ads/{keywords.csv,ads.csv,negatives.txt}');
