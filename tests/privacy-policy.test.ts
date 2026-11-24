import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('src/pages/privacy-policy.astro', 'utf8');
const section = (from: string, to: string) => src.slice(src.indexOf(from), src.indexOf(to));

test('does not state the registered-user ad exclusion as an accomplished fact', () => {
  // The exclusion depends on app-side ad consent + the GA4 "Registered" audience
  // being excluded in Google Ads; until both are live, a factual claim is false.
  assert.ok(!/We tell Google not to show these adverts/.test(src));
});

test('names Google Analytics and Google Ads among the recipients of personal data', () => {
  const recipients = section('id="sharing"', 'id="cookies"');
  assert.match(recipients, /Google Analytics and Google Ads/);
  assert.match(recipients, /href="\/subprocessors\/"/);
});

test('describes PostHog as consent-gated, EU-hosted and never on pupil or parent pages', () => {
  const cookies = section('id="cookies"', 'id="retention"');
  assert.match(cookies, /Accept All/);
  assert.match(cookies, /PostHog product analytics[^]*never on pupil or parent pages/);
  assert.match(cookies, /PostHog, which stores them in the EU/);
});

test('does not claim the cookie choice is shared between the website and the app (#119)', () => {
  // The app keeps its own localStorage key and never reads dsp_consent.
  assert.ok(!/shared between driveschoolpro\.com and app\.driveschoolpro\.com/.test(src));
  assert.ok(!/only answer the banner once/.test(src));
  assert.match(src, /each ask for your cookie choice and remember it separately/);
});

test('says the app can load Google Analytics on pupil and parent pages after Accept All (#119)', () => {
  const pupils = section('id="pupils-under-18"', 'id="ai"');
  assert.match(pupils, /Google Analytics[^]*including pupil and parent pages/);
});

test('makes no unverified AI-provider training promise and shows no ICO number', () => {
  assert.ok(!/not used to train AI models/.test(src));
  assert.ok(!/never used to train/.test(src));
  assert.ok(!/ICO registration number|Z[0-9X]{7}/.test(src));
});

test('uses privacy@ as the single contact for this notice', () => {
  assert.ok(!/info@driveschoolpro\.com/.test(src));
  assert.match(src, /privacy@driveschoolpro\.com/);
});
