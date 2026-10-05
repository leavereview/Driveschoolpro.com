import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AD_GROUPS, SHARED_NEGATIVES, ROUTING_NEGATIVES, SITELINKS, CALLOUTS } from '../google-ads/search-uk-start.ts';
import { START_VARIANTS } from '../src/config/start-variants.ts';

const DKI = /^\{KeyWord:(.+)\}$/;
const visibleLength = (h: string) => (DKI.test(h) ? h.match(DKI)![1].length : h.length);

test('three ad groups pointing at the three variants with utm_content', () => {
  const paths = Object.values(START_VARIANTS).map((v) => v.path);
  assert.equal(AD_GROUPS.length, 3);
  for (const g of AD_GROUPS) {
    const u = new URL(g.finalUrl);
    assert.equal(u.host, 'driveschoolpro.com');
    assert.ok(paths.includes(u.pathname), `${g.name}: ${u.pathname}`);
    assert.ok(u.searchParams.get('utm_content'), `${g.name}: no utm_content`);
  }
});

test('15 headlines ≤ 30 chars, 4 descriptions ≤ 90, paths ≤ 15', () => {
  for (const g of AD_GROUPS) {
    assert.equal(g.headlines.length, 15, g.name);
    assert.equal(g.descriptions.length, 4, g.name);
    for (const h of g.headlines) assert.ok(visibleLength(h.text) <= 30, `${g.name}: "${h.text}"`);
    for (const d of g.descriptions) assert.ok(d.length <= 90, `${g.name}: "${d}" (${d.length})`);
    assert.ok(g.path1.length <= 15 && g.path2.length <= 15, g.name);
  }
});

test('exactly one headline pinned to position 1 and exactly one keyword-insertion headline', () => {
  for (const g of AD_GROUPS) {
    assert.equal(g.headlines.filter((h) => h.pin === 1).length, 1, g.name);
    assert.equal(g.headlines.filter((h) => DKI.test(h.text)).length, 1, g.name);
  }
});

test('no dates, no testimonial language, no unverifiable superlatives', () => {
  const banned = /\b(20\d\d|march|april|#1|best|cheapest|guaranteed|testimonial|rated)\b/i;
  for (const g of AD_GROUPS) {
    for (const s of [...g.headlines.map((h) => h.text), ...g.descriptions]) assert.ok(!banned.test(s), `${g.name}: "${s}"`);
  }
});

test('headlines unique within each group', () => {
  for (const g of AD_GROUPS) assert.equal(new Set(g.headlines.map((h) => h.text.toLowerCase())).size, 15, g.name);
});

test('no keyword is blocked by its own group negatives or the shared list', () => {
  for (const g of AD_GROUPS) {
    const negs = [...(ROUTING_NEGATIVES[g.name] ?? []), ...SHARED_NEGATIVES];
    for (const k of g.keywords) {
      assert.equal(k, k.toLowerCase());
      const padded = ` ${k} `;
      for (const n of negs) assert.ok(!padded.includes(` ${n} `), `${g.name}: "${k}" blocked by "${n}"`);
    }
  }
});

test('"free" routes to the Free group only', () => {
  assert.deepEqual(ROUTING_NEGATIVES['Core'], ['free']);
  assert.deepEqual(ROUTING_NEGATIVES['Scheduling'], ['free']);
  assert.equal(ROUTING_NEGATIVES['Free'], undefined);
});

test('sitelinks: ≤ 25 / ≤ 35 chars, distinct final URLs, each on a /start variant', () => {
  const paths = Object.values(START_VARIANTS).map((v) => v.path);
  assert.ok(SITELINKS.length >= 4);
  assert.equal(new Set(SITELINKS.map((l) => new URL(l.url).pathname)).size, SITELINKS.length);
  for (const l of SITELINKS) {
    assert.ok(l.text.length <= 25, l.text);
    assert.ok(l.line1.length <= 35 && l.line2.length <= 35, l.text);
    assert.ok(paths.includes(new URL(l.url).pathname), l.url);
  }
});

test('callouts ≤ 25 chars, no dates or superlatives', () => {
  for (const c of CALLOUTS) {
    assert.ok(c.length <= 25, c);
    assert.ok(!/\b(20\d\d|best|#1|cheapest)\b/i.test(c), c);
  }
});
