/**
 * Driving instructor earnings calculator: franchise vs independent, side by side.
 * Reuses the 2026/27 tax maths in adi-tax.ts (single source of truth for rates).
 * Shared by the page's client script and tests/adi-earnings.test.ts.
 */
import { estimate, type Estimate } from './adi-tax.ts';

export interface ScenarioInputs {
  /** £ per paid hour */
  hourlyRate: number;
  /** paid hours a week */
  hoursPerWeek: number;
  /** £ per week paid to a franchise (0 for independent) */
  franchiseFeeWeekly: number;
  /** £ per year: marketing, booking software, accountant, ADI badge, CPD, phone */
  otherCostsYearly: number;
}

export interface SharedInputs {
  weeksWorked: number;
  /** £ per month: car lease, finance or running costs of an owned car */
  carMonthly: number;
  /** £ per paid hour */
  fuelPerHour: number;
  /** £ per year: dual controls fitting, servicing and inspection */
  dualControlsYearly: number;
  /** £ per year: driving instruction insurance */
  insuranceYearly: number;
  /** franchise fee is charged all 52 weeks (otherwise weeks worked only) */
  franchiseAllYear: boolean;
}

export interface ScenarioResult extends Estimate {
  paidHours: number;
  /** take-home divided by paid hours, 0 when there are none */
  effectiveHourly: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const round2 = (n: number) => Math.round(n * 100) / 100;

export function scenario(s: ScenarioInputs, c: SharedInputs): ScenarioResult {
  const weeks = Math.min(pos(c.weeksWorked), 52);
  const hours = pos(s.hoursPerWeek);
  const e = estimate({
    hourlyRate: s.hourlyRate,
    lessonsPerWeek: hours,
    lessonLength: 1,
    weeksWorked: weeks,
    franchiseFeeWeekly: s.franchiseFeeWeekly,
    franchiseAllYear: c.franchiseAllYear,
    carCostsMonthly: pos(c.carMonthly) + (pos(c.dualControlsYearly) + pos(c.insuranceYearly)) / 12,
    fuelWeekly: pos(c.fuelPerHour) * hours,
    otherCostsYearly: s.otherCostsYearly,
  });
  const paidHours = hours * weeks;
  return { ...e, paidHours, effectiveHourly: paidHours > 0 ? round2(e.takeHome / paidHours) : 0 };
}

export interface Comparison {
  franchise: ScenarioResult;
  independent: ScenarioResult;
  /** franchise take-home minus independent take-home (negative: independent is ahead) */
  takeHomeGap: number;
  /** same, per paid hour */
  hourlyGap: number;
}

export function compare(franchise: ScenarioInputs, independent: ScenarioInputs, c: SharedInputs): Comparison {
  const f = scenario(franchise, c);
  const i = scenario(independent, c);
  return {
    franchise: f,
    independent: i,
    takeHomeGap: round2(f.takeHome - i.takeHome),
    hourlyGap: round2(f.effectiveHourly - i.effectiveHourly),
  };
}

/** Illustrative example values only. They are not averages or claims about what instructors earn. */
export const EXAMPLE_SHARED: SharedInputs = {
  weeksWorked: 46,
  carMonthly: 350,
  fuelPerHour: 2.5,
  dualControlsYearly: 150,
  insuranceYearly: 1_200,
  franchiseAllYear: true,
};
export const EXAMPLE_FRANCHISE: ScenarioInputs = { hourlyRate: 38, hoursPerWeek: 30, franchiseFeeWeekly: 150, otherCostsYearly: 400 };
export const EXAMPLE_INDEPENDENT: ScenarioInputs = { hourlyRate: 38, hoursPerWeek: 26, franchiseFeeWeekly: 0, otherCostsYearly: 900 };
