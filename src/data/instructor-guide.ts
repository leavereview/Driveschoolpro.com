/**
 * Shared data for the /become-a-driving-instructor/ guide section (issue #85).
 * Every fee and rule here was checked against GOV.UK on 12 November 2026.
 * When DVSA changes a fee, change it here once: pages read from this file.
 */
export const CHECKED = '2026-11-12';
export const CHECKED_LABEL = '12 November 2026';

export const FEES = {
  part1: 81,
  part2: 111,
  part3: 111,
  traineeLicence: 140,
  firstCertificate: 300,
  renewal: 300,
  dbs: 5.4,
  dbsPostOffice: 12,
} as const;

/** Official fees excluding the optional trainee licence and DBS check. */
export const FEES_CORE = FEES.part1 + FEES.part2 + FEES.part3 + FEES.firstCertificate; // 603
export const FEES_WITH_TRAINEE = FEES_CORE + FEES.traineeLicence; // 743

export interface GuidePage {
  href: string;
  label: string;
  blurb: string;
}

export const GUIDE_PAGES: GuidePage[] = [
  { href: '/become-a-driving-instructor/', label: 'How to become a driving instructor', blurb: 'The full route, costs and timeline.' },
  { href: '/become-a-driving-instructor/earnings/', label: 'How much driving instructors earn', blurb: 'Income, costs and tax, with a worked method.' },
  { href: '/become-a-driving-instructor/adi-part-1/', label: 'ADI part 1 (theory and hazard perception)', blurb: 'What is in it and how to revise.' },
  { href: '/become-a-driving-instructor/adi-part-2/', label: 'ADI part 2 (driving ability)', blurb: 'What the test involves and how it is marked.' },
  { href: '/become-a-driving-instructor/adi-part-3/', label: 'ADI part 3 and the trainee licence', blurb: 'The 17 competencies, 40 hours and the pass rate.' },
  { href: '/become-a-driving-instructor/franchise-or-independent/', label: 'Franchise or independent', blurb: 'What to ask before you sign.' },
  { href: '/become-a-driving-instructor/car-dual-controls-insurance/', label: 'Car, dual controls and insurance', blurb: 'Test car rules and what to ask your insurer.' },
  { href: '/become-a-driving-instructor/glossary/', label: 'Glossary', blurb: 'PDI, ADI, ORDIT, pink badge, SC1 and more.' },
];

/** Free tools listed in the guide's side navigation on every page. */
export const GUIDE_TOOLS: { href: string; label: string }[] = [
  { href: '/tools/driving-instructor-earnings-calculator/', label: 'Driving instructor earnings calculator' },
  { href: '/tools/part-3-standards-check-self-assessment/', label: 'Part 3 and standards check self-assessment' },
  { href: '/tools/adi-income-tax-calculator/', label: 'ADI income and tax estimator' },
];

export interface Source {
  label: string;
  href: string;
  note?: string;
}

/** GOV.UK pages reused across the section. */
export const GOVUK = {
  route: { label: 'Become a driving instructor (GOV.UK)', href: 'https://www.gov.uk/become-a-driving-instructor' },
  register: { label: 'Approved driving instructor (ADI) register guide (GOV.UK)', href: 'https://www.gov.uk/government/publications/whats-involved-in-being-a-driving-instructor/approved-driving-instructor-adi-register-guide' },
  dbs: { label: 'Get a criminal record check to become a driving instructor (GOV.UK)', href: 'https://www.gov.uk/criminal-record-check-become-driving-instructor' },
  training: { label: 'Find driving instructor training (GOV.UK)', href: 'https://www.gov.uk/find-driving-instructor-training' },
  part1: { label: 'ADI part 1 test (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test' },
  part1Mcq: { label: 'ADI part 1: multiple-choice questions (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test/multiple-choice-questions' },
  part1Hpt: { label: 'ADI part 1: hazard perception test (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test/hazard-perception-test' },
  part1Pass: { label: 'ADI part 1: pass mark and test result (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test/pass-mark-and-result' },
  part1Revision: { label: 'ADI part 1: revision and practice (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test/revision-practice' },
  part1Take: { label: 'ADI part 1: what to take to your test (GOV.UK)', href: 'https://www.gov.uk/adi-part-1-test/what-to-take' },
  part2: { label: 'ADI part 2 test (GOV.UK)', href: 'https://www.gov.uk/adi-part-2-test' },
  part2What: { label: 'ADI part 2: what happens during the test (GOV.UK)', href: 'https://www.gov.uk/adi-part-2-test/what-happens-during-test' },
  part2Car: { label: 'ADI part 2: rules for the car you use (GOV.UK)', href: 'https://www.gov.uk/adi-part-2-test/car-rules' },
  part2Faults: { label: 'ADI part 2: faults and test result (GOV.UK)', href: 'https://www.gov.uk/adi-part-2-test/faults-test-result' },
  part3: { label: 'ADI part 3 test (GOV.UK)', href: 'https://www.gov.uk/adi-part-3-test' },
  part3What: { label: 'ADI part 3: what happens during the test (GOV.UK)', href: 'https://www.gov.uk/adi-part-3-test/what-happens-during-test' },
  part3Result: { label: 'ADI part 3: test result (GOV.UK)', href: 'https://www.gov.uk/adi-part-3-test/test-result' },
  part3Car: { label: 'ADI part 3: rules for the car you use (GOV.UK)', href: 'https://www.gov.uk/adi-part-3-test/car-rules' },
  trainee: { label: 'Trainee driving instructor licence: the rules (GOV.UK)', href: 'https://www.gov.uk/trainee-driving-instructor-licence-the-rules' },
  apply1st: { label: 'Register for your first ADI certificate (GOV.UK)', href: 'https://www.gov.uk/apply-first-approved-driving-instructor-adi-badge' },
  standardsCheck: { label: 'ADI standards check (GOV.UK)', href: 'https://www.gov.uk/adi-standards-check' },
  standardsGrade: { label: 'ADI standards check: your result (GOV.UK)', href: 'https://www.gov.uk/adi-standards-check/your-standards-check-grade' },
  ordit: { label: 'Become a driving instructor (ORDIT) trainer (GOV.UK)', href: 'https://www.gov.uk/guidance/become-a-driving-instructor-ordit-trainer' },
  selfEmployed: { label: 'Set up as self-employed (GOV.UK)', href: 'https://www.gov.uk/set-up-self-employed' },
  nationalStandard: { label: 'National standard for driver and rider training (GOV.UK)', href: 'https://www.gov.uk/government/publications/national-standard-for-driver-and-rider-training' },
  stats: { label: 'ADI qualifying test data, tables DRT511A, DRT521A and DRT521C (GOV.UK)', href: 'https://www.gov.uk/government/statistical-data-sets/approved-driving-instructor-adi-qualifying-test-data' },
  careers: { label: 'Driving instructor job profile (National Careers Service)', href: 'https://nationalcareers.service.gov.uk/job-profiles/driving-instructor' },
} as const satisfies Record<string, Source>;
