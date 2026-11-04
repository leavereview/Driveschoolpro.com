import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incomeTax, class4, personalAllowance, estimate, DEFAULT_INPUTS } from '../src/utils/adi-tax.ts';

test('no tax or Class 4 at or below £12,570', () => {
  assert.equal(incomeTax(12_570), 0);
  assert.equal(class4(12_570), 0);
  assert.equal(incomeTax(-5_000), 0);
  assert.equal(class4(-5_000), 0);
});

test('basic rate band: £30,000 profit', () => {
  assert.equal(incomeTax(30_000), 3_486); // (30,000 − 12,570) × 20%
  assert.equal(class4(30_000), 1_045.8); // 17,430 × 6%
});

test('top of the basic rate band: £50,270', () => {
  assert.equal(incomeTax(50_270), 7_540);
  assert.equal(class4(50_270), 2_262);
});

test('higher rate: £60,000 profit', () => {
  assert.equal(incomeTax(60_000), 11_432); // 7,540 + 9,730 × 40%
  assert.equal(class4(60_000), 2_456.6); // 2,262 + 9,730 × 2%
});

test('Personal Allowance taper', () => {
  assert.equal(personalAllowance(100_000), 12_570);
  assert.equal(personalAllowance(110_000), 7_570);
  assert.equal(personalAllowance(125_140), 0);
  assert.equal(incomeTax(110_000), 33_432); // taxable 102,430: 7,540 + 64,730 × 40%
});

test('additional rate: £150,000 profit', () => {
  // PA 0, taxable 150,000: 7,540 + 87,440 × 40% + 24,860 × 45%
  assert.equal(incomeTax(150_000), 53_703);
});

test('estimate() adds up the defaults', () => {
  const e = estimate(DEFAULT_INPUTS);
  assert.equal(e.gross, 38 * 30 * 46);
  assert.equal(e.costs, 450 * 12 + 70 * 46 + 900);
  assert.equal(e.profit, e.gross - e.costs);
  assert.equal(e.takeHome, Math.round((e.profit - e.incomeTax - e.class4) * 100) / 100);
});

test('franchise fee: all year vs weeks worked', () => {
  const base = { ...DEFAULT_INPUTS, franchiseFeeWeekly: 200 };
  assert.equal(estimate({ ...base, franchiseAllYear: true }).franchise, 10_400);
  assert.equal(estimate({ ...base, franchiseAllYear: false }).franchise, 9_200);
});

test('bad input is treated as zero, and a loss pays no tax', () => {
  const e = estimate({ ...DEFAULT_INPUTS, hourlyRate: NaN });
  assert.equal(e.gross, 0);
  assert.ok(e.profit < 0);
  assert.equal(e.incomeTax, 0);
  assert.equal(e.class4, 0);
  assert.equal(e.effectiveRate, 0);
});
