import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_DEFAULT_DENIED, CONSENT_GRANTED_ALL, consentCommands } from '../src/utils/consent-mode.ts';

const KEYS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];

test('default denies all four Consent Mode v2 signals', () => {
  for (const k of KEYS) assert.equal(CONSENT_DEFAULT_DENIED[k], 'denied', k);
  assert.equal(CONSENT_DEFAULT_DENIED.wait_for_update, 500);
});

test('granted update covers all four signals', () => {
  assert.deepEqual(Object.keys(CONSENT_GRANTED_ALL).sort(), [...KEYS].sort());
  for (const k of KEYS) assert.equal(CONSENT_GRANTED_ALL[k], 'granted', k);
});

test('a consented visitor: default, then update, before js/config', () => {
  const names = consentCommands(true).map((c) => `${c[0]}:${c[1] ?? ''}`);
  assert.deepEqual(names.slice(0, 2), ['consent:default', 'consent:update']);
});

test('no consent: default only, no update', () => {
  const cmds = consentCommands(false);
  assert.equal(cmds.length, 1);
  assert.deepEqual(cmds[0].slice(0, 2), ['consent', 'default']);
});
