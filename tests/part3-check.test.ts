import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COMPETENCIES, AREAS, MAX_TOTAL, assess, bandForTotal, weakestCompetencies, validScores,
} from '../src/utils/part3-check.ts';

const all = (n: number) => COMPETENCIES.map(() => n);

test('17 competencies: 4 + 5 + 8, maximum 51', () => {
  assert.equal(COMPETENCIES.length, 17);
  const count = (a: string) => COMPETENCIES.filter((c) => c.area === a).length;
  assert.deepEqual([count('lesson-planning'), count('risk-management'), count('teaching-learning')], [4, 5, 8]);
  assert.equal(AREAS.reduce((s, a) => s + a.maxScore, 0), MAX_TOTAL);
  assert.equal(MAX_TOTAL, 51);
  COMPETENCIES.forEach((c, i) => assert.equal(c.id, i + 1));
});

test('band boundaries: 30 fail, 31 B, 42 B, 43 A, 51 A', () => {
  assert.equal(bandForTotal(0), 'fail');
  assert.equal(bandForTotal(30), 'fail');
  assert.equal(bandForTotal(31), 'B');
  assert.equal(bandForTotal(42), 'B');
  assert.equal(bandForTotal(43), 'A');
  assert.equal(bandForTotal(51), 'A');
});

test('full marks is grade A with no weakest competencies', () => {
  const r = assess(all(3));
  assert.equal(r.total, 51);
  assert.equal(r.band, 'A');
  assert.deepEqual(r.failReasons, []);
  assert.equal(r.weakest.length, 0);
});

test('all 2s is 34, grade B', () => {
  const r = assess(all(2));
  assert.equal(r.total, 34);
  assert.equal(r.band, 'B');
});

test('risk management of 7 or less is an automatic fail even with a grade A total', () => {
  const s = all(3);
  // risk management competencies are indexes 4-8: make them 3,1,1,1,1 = 7
  [5, 6, 7, 8].forEach((i) => (s[i] = 1));
  const r = assess(s);
  assert.equal(r.areaTotals['risk-management'], 7);
  assert.equal(r.total, 43);
  assert.equal(r.totalBand, 'A');
  assert.equal(r.band, 'fail');
  assert.deepEqual(r.failReasons, ['risk-management']);
});

test('risk management of 8 is not an automatic fail', () => {
  const s = all(3);
  [5, 6, 7].forEach((i) => (s[i] = 1));
  s[8] = 2; // 3+1+1+1+2 = 8
  const r = assess(s);
  assert.equal(r.areaTotals['risk-management'], 8);
  assert.equal(r.band, 'A');
});

test('examiner stopping the lesson is an automatic fail', () => {
  const r = assess(all(3), true);
  assert.equal(r.band, 'fail');
  assert.deepEqual(r.failReasons, ['lesson-stopped']);
});

test('low total is a fail with the total reason', () => {
  const r = assess(all(1));
  assert.equal(r.total, 17);
  assert.equal(r.band, 'fail');
  assert.ok(r.failReasons.includes('total'));
});

test('weakest three: lowest first, ties in form order, 3s excluded', () => {
  const s = all(3);
  s[9] = 0; s[2] = 1; s[4] = 1; s[11] = 2; s[0] = 2;
  const w = weakestCompetencies(s).map((c) => c.id);
  assert.deepEqual(w, [10, 3, 5]);
  const few = all(3); few[16] = 2;
  assert.deepEqual(weakestCompetencies(few).map((c) => c.id), [17]);
});

test('invalid input is rejected', () => {
  assert.equal(validScores(all(3).slice(0, 16)), false);
  assert.equal(validScores([...all(3).slice(0, 16), 4]), false);
  assert.equal(validScores([...all(3).slice(0, 16), 1.5]), false);
  assert.throws(() => assess(all(3).slice(0, 5)));
});

test('every competency has a name and a tip', () => {
  COMPETENCIES.forEach((c) => {
    assert.ok(c.name.length > 5 && c.tip.length > 20 && c.looksLike.length > 10);
    assert.ok(!/—|–/.test(c.name + c.tip + c.looksLike));
  });
});
