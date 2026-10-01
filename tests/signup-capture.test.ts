import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickTrackingParams, reconcilePlaceId } from '../src/utils/signup-capture.ts';

test('pickTrackingParams keeps only known ad/UTM params, in a fixed order', () => {
  const got = pickTrackingParams('?gclid=abc&foo=bar&utm_source=google&utm_campaign=autumn');
  assert.deepEqual(got, [
    ['utm_source', 'google'],
    ['utm_campaign', 'autumn'],
    ['gclid', 'abc'],
  ]);
});

test('pickTrackingParams drops blanks and caps values at 500 chars', () => {
  const got = pickTrackingParams(`?utm_source=%20%20&gbraid=${'x'.repeat(600)}`);
  assert.equal(got.length, 1);
  assert.equal(got[0][0], 'gbraid');
  assert.equal(got[0][1].length, 500);
});

test('pickTrackingParams on an empty query returns nothing', () => {
  assert.deepEqual(pickTrackingParams(''), []);
});

test('reconcilePlaceId keeps the id while the field still shows the picked name', () => {
  assert.equal(reconcilePlaceId('ChIJabc1234567', 'Eastleigh SoM', '  Eastleigh SoM '), 'ChIJabc1234567');
});

test('reconcilePlaceId drops the id once the name was edited', () => {
  assert.equal(reconcilePlaceId('ChIJabc1234567', 'Eastleigh SoM', 'Eastleigh SoM Ltd'), null);
});

test('reconcilePlaceId with nothing picked is null', () => {
  assert.equal(reconcilePlaceId(null, null, 'Anything'), null);
});
