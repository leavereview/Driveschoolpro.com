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
  /** the franchise fee includes the car, dual controls and instructor insurance, so those shared costs are not counted again */
  carIncluded?: boolean;
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
    carCostsMonthly: s.carIncluded ? 0 : pos(c.carMonthly) + (pos(c.dualControlsYearly) + pos(c.insuranceYearly)) / 12,
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

/** Whole pounds with a true minus sign, e.g. −£1,234. */
export const gbp = (n: number) => (n < 0 ? '−£' : '£') + Math.round(Math.abs(n)).toLocaleString('en-GB');
/** Pounds and pence, e.g. £12.34. */
export const gbp2 = (n: number) => (n < 0 ? '−£' : '£') + Math.abs(n).toFixed(2);

/** The one-line verdict under the two columns (server render and live update share it). */
export function gapText(c: Pick<Comparison, 'takeHomeGap' | 'hourlyGap'>): string {
  const g = c.takeHomeGap;
  if (Math.abs(g) < 0.5) return 'On these numbers the two routes give the same take-home pay.';
  return `On these numbers ${g > 0 ? 'the franchise' : 'going independent'} leaves you ${gbp(Math.abs(g))} a year better off after costs, tax and NI (${gbp2(Math.abs(c.hourlyGap))} per paid hour).`;
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
export const EXAMPLE_FRANCHISE: ScenarioInputs = { hourlyRate: 38, hoursPerWeek: 30, franchiseFeeWeekly: 150, otherCostsYearly: 400, carIncluded: false };
export const EXAMPLE_INDEPENDENT: ScenarioInputs = { hourlyRate: 38, hoursPerWeek: 26, franchiseFeeWeekly: 0, otherCostsYearly: 900 };
