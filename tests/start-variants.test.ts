import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { START_VARIANTS, SHARED_FAQ, fillOffer } from '../src/config/start-variants.ts';
import { MOMENTS } from '../src/config/moments.ts';

const variants = Object.values(START_VARIANTS);

test('four variants with the agreed paths', () => {
  assert.deepEqual(
    Object.fromEntries(variants.map((v) => [v.id, v.path])),
    { core: '/start/', free: '/start/free/', scheduling: '/start/scheduling/', tour: '/start/tour/' },
  );
});

test('every variant has a CTA and at least three distinct known moments', () => {
  for (const v of variants) {
    assert.ok(v.cta.length > 0 && v.cta.length <= 24, `${v.id}: cta "${v.cta}"`);
    assert.ok(v.moments.length >= 3, `${v.id}: ${v.moments.length} moments`);
    assert.equal(new Set(v.moments).size, v.moments.length, `${v.id}: duplicate moment`);
    for (const m of v.moments) assert.ok(MOMENTS[m], `${v.id}: unknown moment ${m}`);
  }
});

test('moment media files exist and copy follows the anatomy', () => {
  for (const [id, m] of Object.entries(MOMENTS)) {
    assert.ok(m.pain && m.headline && m.body && m.eyebrow, id);
    assert.ok(!/\b(20\d\d)\b/.test(m.headline + m.body), `${id}: dated copy`);
    if (m.media.kind === 'clip') {
      assert.ok(fs.existsSync(path.join('public', m.media.src)), `${id}: missing ${m.media.src}`);
      assert.ok(fs.existsSync(path.join('public', m.media.poster)), `${id}: missing ${m.media.poster}`);
    }
    if (m.media.kind === 'still') assert.ok(fs.existsSync(path.join('public', m.media.src)), `${id}: missing ${m.media.src}`);
  }
});

test('only the demo-first tour variant embeds click-through demos', () => {
  for (const v of variants) assert.equal(Boolean(v.arcade?.length), v.id === 'tour', v.id);
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

test('H1 fits a 390px hero: at most 60 characters', () => {
  for (const v of variants) assert.ok(v.h1.length <= 60, `${v.id}: ${v.h1.length}`);
});

test('shared FAQ has six entries and no testimonial-style quotes', () => {
  assert.equal(SHARED_FAQ.length, 6);
  for (const f of SHARED_FAQ) assert.ok(!/[“"].+[”"]\s*[—-]\s*\w/.test(f.a), f.q);
});

test('fillOffer substitutes both placeholders', () => {
  assert.equal(fillOffer('{offer} / {offerLong}', { short: 'S', long: 'L' }), 'S / L');
});
