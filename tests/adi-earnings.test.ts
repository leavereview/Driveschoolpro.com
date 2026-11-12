import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scenario, compare, gapText, EXAMPLE_SHARED, EXAMPLE_FRANCHISE, EXAMPLE_INDEPENDENT } from '../src/utils/adi-earnings.ts';
import { estimate } from '../src/utils/adi-tax.ts';

test('independent example adds up and reuses the tax maths', () => {
  const r = scenario(EXAMPLE_INDEPENDENT, EXAMPLE_SHARED);
  assert.equal(r.gross, 38 * 26 * 46); // 45,448
  // car 350*12 + dual 150 + insurance 1,200 + fuel 2.5*26*46 + other 900
  assert.equal(r.costs, 4_200 + 150 + 1_200 + 2_990 + 900);
  assert.equal(r.profit, r.gross - r.costs);
  const t = estimate({
    hourlyRate: 38, lessonsPerWeek: 26, lessonLength: 1, weeksWorked: 46, franchiseFeeWeekly: 0,
    franchiseAllYear: true, carCostsMonthly: 350 + 1_350 / 12, fuelWeekly: 65, otherCostsYearly: 900,
  });
  assert.equal(r.incomeTax, t.incomeTax);
  assert.equal(r.class4, t.class4);
});

test('effective hourly rate is take-home per paid hour', () => {
  const r = scenario(EXAMPLE_FRANCHISE, EXAMPLE_SHARED);
  assert.equal(r.paidHours, 30 * 46);
  assert.equal(r.effectiveHourly, Math.round((r.takeHome / 1_380) * 100) / 100);
});

test('franchise fee: 52 weeks vs weeks worked', () => {
  const all = scenario(EXAMPLE_FRANCHISE, EXAMPLE_SHARED);
  const worked = scenario(EXAMPLE_FRANCHISE, { ...EXAMPLE_SHARED, franchiseAllYear: false });
  assert.equal(all.franchise, 150 * 52);
  assert.equal(worked.franchise, 150 * 46);
});

test('gap is franchise minus independent', () => {
  const c = compare(EXAMPLE_FRANCHISE, EXAMPLE_INDEPENDENT, EXAMPLE_SHARED);
  assert.equal(c.takeHomeGap, Math.round((c.franchise.takeHome - c.independent.takeHome) * 100) / 100);
  assert.equal(compare(EXAMPLE_INDEPENDENT, EXAMPLE_INDEPENDENT, EXAMPLE_SHARED).takeHomeGap, 0);
});

test('zero hours and bad input give zero, not NaN', () => {
  const r = scenario({ ...EXAMPLE_FRANCHISE, hoursPerWeek: 0 }, EXAMPLE_SHARED);
  assert.equal(r.effectiveHourly, 0);
  assert.equal(r.incomeTax, 0);
  const bad = scenario({ ...EXAMPLE_FRANCHISE, hourlyRate: NaN }, { ...EXAMPLE_SHARED, weeksWorked: NaN });
  assert.equal(bad.paidHours, 0);
  assert.ok(Number.isFinite(bad.takeHome));
});

test('weeks worked is capped at 52', () => {
  assert.equal(scenario(EXAMPLE_INDEPENDENT, { ...EXAMPLE_SHARED, weeksWorked: 60 }).paidHours, 26 * 52);
});

test('franchise fee that includes the car drops car, dual controls and insurance only', () => {
  const own = scenario(EXAMPLE_FRANCHISE, EXAMPLE_SHARED);
  const inc = scenario({ ...EXAMPLE_FRANCHISE, carIncluded: true }, EXAMPLE_SHARED);
  assert.equal(inc.car, 0);
  assert.equal(own.car, 350 * 12 + 150 + 1_200);
  assert.equal(inc.fuel, own.fuel); // fuel is still paid by the instructor
  assert.equal(inc.franchise, own.franchise);
  assert.equal(inc.costs, own.costs - own.car);
});

test('negative inputs are treated as zero', () => {
  const r = scenario({ hourlyRate: -38, hoursPerWeek: 30, franchiseFeeWeekly: -10, otherCostsYearly: -1 }, { ...EXAMPLE_SHARED, carMonthly: -350 });
  assert.equal(r.gross, 0);
  assert.equal(r.franchise, 0);
  assert.equal(r.incomeTax, 0);
});

test('gap text names the route that is ahead, or says they match', () => {
  assert.match(gapText({ takeHomeGap: 1234.4, hourlyGap: 1 }), /the franchise leaves you £1,234 a year/);
  assert.match(gapText({ takeHomeGap: -500, hourlyGap: -0.5 }), /going independent leaves you £500 a year .*£0\.50 per paid hour/);
  assert.match(gapText({ takeHomeGap: 0.2, hourlyGap: 0 }), /same take-home/);
});
