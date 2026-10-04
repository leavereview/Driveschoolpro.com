import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('src/pages/privacy-policy.astro', 'utf8');

test('does not state the registered-user ad exclusion as an accomplished fact', () => {
  // The exclusion depends on app-side ad consent + the GA4 "Registered" audience
  // being excluded in Google Ads; until both are live, a factual claim is false.
  assert.ok(!/We tell Google not to show these adverts/.test(src));
});

test('names Google (Analytics and Ads) among the recipients of personal data', () => {
  const recipients = src.slice(src.indexOf('We share personal data only with'), src.indexOf('We do <strong>not</strong> sell, rent'));
  assert.match(recipients, /<li><strong>Google<\/strong>[^<]*(Analytics)[^<]*Ads/);
  assert.match(recipients, /policies\.google\.com\/privacy/);
});
