import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { START_VARIANTS, BENEFITS, SHARED_FAQ, fillOffer } from '../src/config/start-variants.ts';

const variants = Object.values(START_VARIANTS);

test('three variants with the agreed paths', () => {
  assert.deepEqual(
    Object.fromEntries(variants.map((v) => [v.id, v.path])),
    { core: '/start/', free: '/start/free/', scheduling: '/start/scheduling/' },
  );
});

test('no hard-coded years or month names in any variant copy (offer text comes from OFFER)', () => {
  const datey = /\b(20\d\d|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
  for (const v of variants) {
    for (const s of [v.h1, v.subhead, v.title, v.description, v.extraFaq.q, v.extraFaq.a]) {
      assert.ok(!datey.test(s.replace('{offer}', '')), `${v.id}: dated copy "${s}"`);
    }
  }
});

test('every subhead carries the {offer} placeholder', () => {
  for (const v of variants) assert.match(v.subhead, /\{offer\}/, v.id);
});

test('hero images exist in public/ with declared dimensions', () => {
  for (const v of variants) {
    assert.ok(fs.existsSync(path.join('public', v.hero.src)), `${v.id}: missing ${v.hero.src}`);
    assert.ok(v.hero.width > 0 && v.hero.height > 0);
    assert.ok(v.hero.alt.length > 10, `${v.id}: alt text too short`);
  }
});

test('each variant lists exactly three distinct known benefits', () => {
  for (const v of variants) {
    assert.equal(v.benefits.length, 3, v.id);
    assert.equal(new Set(v.benefits).size, 3, v.id);
    for (const b of v.benefits) assert.ok(BENEFITS[b], `${v.id}: unknown benefit ${b}`);
  }
});

test('H1 fits a 390px hero: at most 60 characters', () => {
  for (const v of variants) assert.ok(v.h1.length <= 60, `${v.id}: ${v.h1.length}`);
});

test('shared FAQ has four entries and no testimonial-style quotes', () => {
  assert.equal(SHARED_FAQ.length, 4);
  for (const f of SHARED_FAQ) assert.ok(!/[“"].+[”"]\s*[—-]\s*\w/.test(f.a), f.q);
});

test('fillOffer substitutes both placeholders', () => {
  assert.equal(fillOffer('{offer} / {offerLong}', { short: 'S', long: 'L' }), 'S / L');
});
