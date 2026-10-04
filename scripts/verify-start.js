/**
 * Asserts the built /start variants match their config: noindex, H1, two
 * capture forms, offer text, and absent from the sitemap. Runs in postbuild.
 */
import fs from 'node:fs';
import path from 'node:path';
import { START_VARIANTS, fillOffer } from '../src/config/start-variants.ts';
import { OFFER } from '../src/config/offer.ts';

const dist = path.join(process.cwd(), 'dist');
const fail = [];
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&mdash;|&#8212;/g, '—').replace(/\s+/g, ' ').trim();

for (const v of Object.values(START_VARIANTS)) {
  const file = path.join(dist, v.path, 'index.html');
  if (!fs.existsSync(file)) { fail.push(`${v.id}: ${file} not built`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  // astro-compress reorders attributes, so match the tag, not the attribute order.
  const robots = html.match(/<meta(?=[^>]*\bname="robots")[^>]*\bcontent="([^"]*)"[^>]*>/);
  if (!robots || robots[1] !== 'noindex, follow') fail.push(`${v.id}: missing noindex`);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1 || decode(h1[1].replace(/<[^>]+>/g, '')) !== v.h1) fail.push(`${v.id}: H1 is "${h1 && decode(h1[1])}"`);
  const forms = html.match(/<form\b[^>]*\bdata-capture\b/g) || [];
  if (forms.length !== 2) fail.push(`${v.id}: expected 2 capture forms, found ${forms.length}`);
  if (!html.includes(`data-start-variant="${v.id}"`)) fail.push(`${v.id}: missing data-start-variant`);
  if (!decode(html).includes(fillOffer('{offer}', OFFER))) fail.push(`${v.id}: offer text not rendered`);
}

const sitemap = path.join(dist, 'sitemap-0.xml');
if (fs.existsSync(sitemap) && /\/start\//.test(fs.readFileSync(sitemap, 'utf8'))) {
  fail.push('sitemap contains a /start URL');
}

if (fail.length) { console.error('verify-start FAILED:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log(`verify-start: ${Object.keys(START_VARIANTS).length} variants OK`);
