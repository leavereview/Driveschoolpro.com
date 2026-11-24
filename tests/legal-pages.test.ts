import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SUBPROCESSORS } from '../src/config/subprocessors.ts';

const LEGAL_FILES = [
  'src/pages/privacy-policy.astro',
  'src/pages/data-processing-terms.astro',
  'src/pages/subprocessors.astro',
  'src/pages/terms.astro',
  'src/config/subprocessors.ts',
  'src/config/legal.ts',
];
const read = (p: string) => fs.readFileSync(p, 'utf8');
const dpa = read('src/pages/data-processing-terms.astro');

test('no draft tags or markers remain in the legal pages (#119)', () => {
  for (const file of LEGAL_FILES) {
    const src = read(file);
    for (const marker of ['NOT YET TRUE', 'UNVERIFIED', 'DRAFT', '[DATE', 'Solicitor:', 'README']) {
      assert.ok(!src.includes(marker), `${file} contains "${marker}"`);
    }
  }
});

test('the sub-processor list includes every provider the #119 review found in use', () => {
  const names = SUBPROCESSORS.map((s) => s.name).join(' | ');
  for (const vendor of [
    'Vercel', 'Neon', 'Amazon Web Services', 'Stripe', 'Resend', 'Anthropic', 'Firebase',
    'Google Maps', 'Sentry', 'Upstash', 'Freshworks', 'Twilio', 'Imagin Studio', 'Slack',
    'PostHog', 'Mailchimp', 'Google Analytics', 'Formspree', 'Google Fonts', 'Metricool', 'Arcade',
  ]) {
    assert.ok(names.includes(vendor), `missing ${vendor}`);
  }
  // Decision 7: Twilio now, Meta only when WhatsApp goes live for pupils.
  assert.ok(!/Meta/.test(names));
});

test('AWS backups and Twilio sit with the providers that can receive pupil data', () => {
  const pupil = SUBPROCESSORS.filter((s) => s.section === 'pupil').map((s) => s.name);
  assert.ok(pupil.includes('Amazon Web Services'));
  assert.ok(pupil.includes('Twilio'));
  assert.ok(pupil.some((n) => n.startsWith('Freshworks')));
});

test('the list makes no AI-training promise about providers', () => {
  for (const s of SUBPROCESSORS) assert.ok(!/train/i.test(`${s.purpose} ${s.data ?? ''}`), s.name);
});

test('the Data Processing Terms keep the approved promises', () => {
  assert.match(dpa, /at least <strong>30 days<\/strong> before we add or replace a sub-processor/);
  assert.match(dpa, /in an emergency/);
  assert.match(dpa, /within 48 hours<\/strong> after we become aware/);
  assert.match(dpa, /within <strong>5 working days<\/strong>/);
  assert.match(dpa, /one audit a year on 30 days' notice/);
});

test('the Terms Schedule points at /data-processing-terms/ and keeps the #data-processing anchor', () => {
  const terms = read('src/pages/terms.astro');
  assert.match(terms, /<h2 id="data-processing">/);
  assert.match(terms, /href="\/data-processing-terms\/"/);
});

test('the footers link the Data Processing Terms and offer Cookie settings', () => {
  const footer = read('src/components/Footer.astro');
  assert.match(footer, /href: '\/data-processing-terms\/'/);
  assert.match(footer, /data-cookie-settings/);
  assert.match(read('src/layouts/LandingLayout.astro'), /data-cookie-settings/);
  assert.match(read('src/components/CookieConsent.astro'), /\[data-cookie-settings\]/);
});
