/**
 * ADI income and tax estimator: 2026/27 maths, shared by the page's client
 * script and tests/adi-tax.test.ts so the two cannot drift.
 *
 * Rates are for England, Wales and Northern Ireland, tax year 6 April 2026 to
 * 5 April 2027. Sources (cited on the page too):
 *   Income Tax: gov.uk "Income Tax rates and allowances for current and previous tax years"
 *     and the policy paper fixing the Personal Allowance at £12,570 and the
 *     basic rate limit at £37,700 for 2026/27 and 2027/28.
 *   Class 4 NI: gov.uk "Rates and allowances: National Insurance contributions"
 *     (6% between £12,570 and £50,270, 2% above).
 * Scottish Income Tax bands differ and are NOT modelled here.
 *
 * When the rates change: update TAX_YEAR and RATES, then the tests' expected
 * figures, then the page copy that quotes them.
 */

export const TAX_YEAR = '2026/27';

export const RATES = {
  personalAllowance: 12_570,
  /** Allowance falls by £1 for every £2 of adjusted net income over this. */
  taperThreshold: 100_000,
  basicRateLimit: 37_700, // taxable income band at 20%
  additionalRateThreshold: 125_140, // taxable income above this at 45%
  basicRate: 0.2,
  higherRate: 0.4,
  additionalRate: 0.45,
  class4LowerProfitsLimit: 12_570,
  class4UpperProfitsLimit: 50_270,
  class4MainRate: 0.06,
  class4UpperRate: 0.02,
} as const;

export interface EstimatorInputs {
  /** £ per lesson hour */
  hourlyRate: number;
  lessonsPerWeek: number;
  /** Hours per lesson (1, 1.5, 2) */
  lessonLength: number;
  weeksWorked: number;
  /** £ per week paid to a franchise (0 if independent) */
  franchiseFeeWeekly: number;
  /** true if the franchise fee is charged all 52 weeks, not just weeks worked */
  franchiseAllYear: boolean;
  /** £ per month: lease or finance, insurance, servicing, tyres, road tax */
  carCostsMonthly: number;
  /** £ per week worked */
  fuelWeekly: number;
  /** £ per year: ADI badge, CPD, phone, software, accountant and so on */
  otherCostsYearly: number;
}

export interface Estimate {
  gross: number;
  franchise: number;
  car: number;
  fuel: number;
  other: number;
  costs: number;
  profit: number;
  personalAllowance: number;
  incomeTax: number;
  class4: number;
  takeHome: number;
  /** (tax + NI) / profit, 0 when there is no profit */
  effectiveRate: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Personal Allowance after the £100,000 taper. */
export function personalAllowance(income: number): number {
  const over = Math.max(0, income - RATES.taperThreshold);
  return Math.max(0, RATES.personalAllowance - Math.floor(over / 2));
}

/** Income Tax on trading profit, assuming it is the person's only income. */
export function incomeTax(profit: number): number {
  const p = pos(profit);
  const taxable = Math.max(0, p - personalAllowance(p));
  const basic = Math.min(taxable, RATES.basicRateLimit);
  const higher = Math.min(Math.max(0, taxable - RATES.basicRateLimit),
    RATES.additionalRateThreshold - RATES.basicRateLimit);
  const additional = Math.max(0, taxable - RATES.additionalRateThreshold);
  return round2(basic * RATES.basicRate + higher * RATES.higherRate + additional * RATES.additionalRate);
}

/** Class 4 National Insurance on self-employed profit. */
export function class4(profit: number): number {
  const p = pos(profit);
  const main = Math.max(0, Math.min(p, RATES.class4UpperProfitsLimit) - RATES.class4LowerProfitsLimit);
  const upper = Math.max(0, p - RATES.class4UpperProfitsLimit);
  return round2(main * RATES.class4MainRate + upper * RATES.class4UpperRate);
}

export function estimate(i: EstimatorInputs): Estimate {
  const weeks = Math.min(pos(i.weeksWorked), 52);
  const gross = round2(pos(i.hourlyRate) * pos(i.lessonsPerWeek) * pos(i.lessonLength) * weeks);
  const franchise = round2(pos(i.franchiseFeeWeekly) * (i.franchiseAllYear ? 52 : weeks));
  const car = round2(pos(i.carCostsMonthly) * 12);
  const fuel = round2(pos(i.fuelWeekly) * weeks);
  const other = round2(pos(i.otherCostsYearly));
  const costs = round2(franchise + car + fuel + other);
  const profit = round2(gross - costs);
  const tax = incomeTax(profit);
  const ni = class4(profit);
  return {
    gross, franchise, car, fuel, other, costs, profit,
    personalAllowance: personalAllowance(pos(profit)),
    incomeTax: tax,
    class4: ni,
    takeHome: round2(profit - tax - ni),
    effectiveRate: profit > 0 ? (tax + ni) / profit : 0,
  };
}

export const DEFAULT_INPUTS: EstimatorInputs = {
  hourlyRate: 38,
  lessonsPerWeek: 30,
  lessonLength: 1,
  weeksWorked: 46,
  franchiseFeeWeekly: 0,
  franchiseAllYear: true,
  carCostsMonthly: 450,
  fuelWeekly: 70,
  otherCostsYearly: 900,
};
