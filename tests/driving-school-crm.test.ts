import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Issue #148: /driving-school-crm/ owns 'driving school crm' / 'crm for driving schools (uk)'.
// Before it existed Google split those queries between the best-software post and the homepage
// CRM FAQ. These checks keep both pointing here and keep the page honest about what the app lacks.
// Comment lines are dropped: the page's own header lists the banned claims.
const page = fs.readFileSync('src/pages/driving-school-crm.astro', 'utf8')
  .split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const read = (p: string) => fs.readFileSync(p, 'utf8');

test('homepage CRM FAQ, features page, pricing and the best-software post link to the CRM page', () => {
  for (const p of [
    'src/pages/index.astro',
    'src/pages/features/index.astro',
    'src/pages/pricing.astro',
    'src/content/blog/best-driving-school-software.md',
  ]) {
    assert.match(read(p), /\/driving-school-crm\//, `${p} should link to /driving-school-crm/`);
  }
});

test('the best-software post no longer targets CRM in its meta description', () => {
  const desc = read('src/content/blog/best-driving-school-software.md').match(/^description: "(.*)"$/m)?.[1] ?? '';
  assert.ok(desc.length > 0);
  assert.doesNotMatch(desc, /\bCRM\b/i);
});

test('the page says plainly that there is no enquiry or leads pipeline', () => {
  assert.match(page, /no enquiry or leads/i);
  assert.match(page, /does not track enquiries/i);
});

test('the page never sells features the app does not have', () => {
  // Checked against the app repo, 24 Nov 2026: lesson blocks count lessons, not hours; one assigned
  // instructor per pupil; no SMS; no parent accounts (verify-claims.js bans "parent portal").
  assert.doesNotMatch(page, /prepaid hours/i);
  assert.doesNotMatch(page, /every instructor assigned/i);
  assert.doesNotMatch(page, /\bSMS\b|text reminders/i);
  assert.doesNotMatch(page, /parent portal/i);
});
