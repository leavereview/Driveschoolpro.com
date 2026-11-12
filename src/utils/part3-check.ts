/**
 * ADI Part 3 / standards check self-assessment: competency data and scoring.
 * Shared by the page's client script and tests/part3-check.test.ts.
 *
 * Verified against GOV.UK on 12 November 2026:
 *  - "ADI part 3 test: marking sheet" (the test report form, 17 questions in
 *    three areas: 4 lesson planning, 5 risk management, 8 teaching and learning
 *    strategies; each scored 0 no evidence, 1 a few elements, 2 most elements,
 *    3 all elements).
 *  - gov.uk/adi-part-3-test/test-result and gov.uk/adi-standards-check/your-standards-check-grade:
 *    total out of 51; 0-30 fail, 31-42 grade B, 43-51 grade A; automatic fail
 *    if risk management is 7 or less, or the examiner stops the lesson for danger.
 *
 * The competency names and tips below are our own wording of what each
 * question on the form asks, not DVSA text. If DVSA reissues the form, re-check
 * the count, the order and the thresholds, then update LAST_CHECKED.
 */

export const LAST_CHECKED = '2026-11-12';
export const LAST_CHECKED_LABEL = '12 November 2026';

export type AreaId = 'lesson-planning' | 'risk-management' | 'teaching-learning';

export interface Competency {
  id: number; // 1-17, in the order they appear on the form
  area: AreaId;
  name: string;
  /** What the examiner is looking for, in our words. */
  looksLike: string;
  /** One practical tip, shown if this is one of the weakest. */
  tip: string;
}

export const AREAS: { id: AreaId; name: string; maxScore: number }[] = [
  { id: 'lesson-planning', name: 'Lesson planning', maxScore: 12 },
  { id: 'risk-management', name: 'Risk management', maxScore: 15 },
  { id: 'teaching-learning', name: 'Teaching and learning strategies', maxScore: 24 },
];

export const COMPETENCIES: Competency[] = [
  {
    id: 1, area: 'lesson-planning', name: 'Identifying learning goals and needs',
    looksLike: 'You found out what the pupil wanted to achieve and what they needed to work on.',
    tip: 'Open with two or three questions about what they found hard last time and what they want from today, and use their answers to set the goal.',
  },
  {
    id: 2, area: 'lesson-planning', name: 'Lesson structure to suit experience and ability',
    looksLike: 'The agreed plan fitted this pupil, not a standard lesson.',
    tip: 'Agree a simple plan out loud (what, where, how long) and check it is a stretch for this pupil without being out of reach.',
  },
  {
    id: 3, area: 'lesson-planning', name: 'Suitable practice areas',
    looksLike: 'The roads you chose gave the pupil the chance to practise the agreed topic.',
    tip: 'Plan the route backwards from the topic. If the roads are not delivering enough practice, say so and change the area.',
  },
  {
    id: 4, area: 'lesson-planning', name: 'Adapting the plan towards the pupil\'s goals',
    looksLike: 'You changed the plan when the lesson showed it needed changing.',
    tip: 'Name the change when you make it ("that went better than expected, so let us try it on a busier road") so the adaptation is visible.',
  },
  {
    id: 5, area: 'risk-management', name: 'Agreeing how responsibility for risk is shared',
    looksLike: 'The pupil clearly understood who is responsible for what, and when you would step in.',
    tip: 'Say it plainly at the start and again for any new situation, then ask the pupil to tell you back what they will do and what you will do.',
  },
  {
    id: 6, area: 'risk-management', name: 'Clear directions and instructions, in good time',
    looksLike: 'The pupil always knew what to do next and had time to act on it.',
    tip: 'Give route directions earlier than feels natural, keep them short, and avoid piling a new instruction on top of a busy moment.',
  },
  {
    id: 7, area: 'risk-management', name: 'Awareness of surroundings and the pupil\'s actions',
    looksLike: 'You were watching the road, other users and the pupil, and anticipating problems.',
    tip: 'Keep a steady scan routine (mirrors, junctions ahead, pupil\'s hands and feet) and note what other road users are about to do before it happens.',
  },
  {
    id: 8, area: 'risk-management', name: 'Timely and appropriate intervention',
    looksLike: 'You stepped in at the right moment and in the right way, verbally or physically.',
    tip: 'Decide in advance what triggers a prompt, a verbal intervention and a physical one, and practise acting at the earliest point rather than the last.',
  },
  {
    id: 9, area: 'risk-management', name: 'Feedback after safety-critical incidents',
    looksLike: 'You helped the pupil understand what happened and why after any safety-critical moment.',
    tip: 'Pull over safely, ask the pupil what they noticed first, then fill in the gaps and agree what to do differently.',
  },
  {
    id: 10, area: 'teaching-learning', name: 'Teaching style suited to the pupil',
    looksLike: 'Your approach matched how this pupil learns and what they can currently do.',
    tip: 'Watch how the pupil responds. If explanation is not landing, switch to a demonstration or let them try it first and talk it through afterwards.',
  },
  {
    id: 11, area: 'teaching-learning', name: 'Encouraging analysis and ownership of learning',
    looksLike: 'The pupil worked out problems for themselves and took responsibility for improving.',
    tip: 'Replace telling with asking: "what happened there?" and "what would you change?" before you give your own view.',
  },
  {
    id: 12, area: 'teaching-learning', name: 'Using examples and opportunities to clarify outcomes',
    looksLike: 'You used real moments and examples to make the learning outcome clear.',
    tip: 'Pick up on what is happening on the road and tie it to the lesson goal, rather than relying on a general explanation.',
  },
  {
    id: 13, area: 'teaching-learning', name: 'Accurate, appropriate technical information',
    looksLike: 'What you told the pupil was correct, complete enough, and pitched at their level.',
    tip: 'Revise the areas you are least sure of against current guidance, and test whether you can explain each in one clear minute.',
  },
  {
    id: 14, area: 'teaching-learning', name: 'Appropriate, timely feedback during the lesson',
    looksLike: 'The pupil heard what went well and what to improve at a useful time, not just at the end.',
    tip: 'Give feedback soon after the event, name one thing done well and one to change, and keep it specific.',
  },
  {
    id: 15, area: 'teaching-learning', name: 'Following up and answering the pupil\'s questions',
    looksLike: 'When the pupil asked something, you answered it properly and checked it helped.',
    tip: 'Answer the question, then check: "does that make sense?" If it needs a longer answer, say when you will cover it.',
  },
  {
    id: 16, area: 'teaching-learning', name: 'Non-discriminatory manner throughout',
    looksLike: 'You treated the pupil fairly and respectfully the whole way through.',
    tip: 'Check your language and assumptions about age, gender, background or ability, and adjust how you explain things without lowering expectations.',
  },
  {
    id: 17, area: 'teaching-learning', name: 'Encouraging the pupil to reflect at the end',
    looksLike: 'At the close, the pupil reviewed their own performance.',
    tip: 'Leave enough time at the end, ask the pupil to rate the lesson against the goal you set, and agree what to practise next.',
  },
];

export const SCORE_LABELS = [
  'No evidence',
  'Shown in a few elements',
  'Shown in most elements',
  'Shown in all elements',
] as const;

export const MAX_TOTAL = 51;
export const RISK_AUTO_FAIL_AT_OR_BELOW = 7;
export const BAND_FAIL_MAX = 30;
export const BAND_B_MAX = 42;

export type Band = 'fail' | 'B' | 'A';
export type FailReason = 'risk-management' | 'lesson-stopped' | 'total';

export interface Result {
  total: number;
  areaTotals: Record<AreaId, number>;
  /** Band from the total alone. */
  totalBand: Band;
  /** Final outcome after the automatic fail rules. */
  band: Band;
  failReasons: FailReason[];
  weakest: Competency[];
}

/** Scores must be 17 integers from 0 to 3, in competency order. */
export function validScores(scores: readonly number[]): boolean {
  return (
    scores.length === COMPETENCIES.length &&
    scores.every((s) => Number.isInteger(s) && s >= 0 && s <= 3)
  );
}

export function bandForTotal(total: number): Band {
  if (total <= BAND_FAIL_MAX) return 'fail';
  if (total <= BAND_B_MAX) return 'B';
  return 'A';
}

/** The lowest scorers below 3, lowest first; ties keep form order. */
export function weakestCompetencies(scores: readonly number[], count = 3): Competency[] {
  return COMPETENCIES.map((c, i) => ({ c, s: scores[i], i }))
    .filter((x) => x.s < 3)
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .slice(0, count)
    .map((x) => x.c);
}

export function assess(scores: readonly number[], lessonStopped = false): Result {
  if (!validScores(scores)) {
    throw new Error('Expected 17 scores, each an integer from 0 to 3');
  }
  const areaTotals: Record<AreaId, number> = {
    'lesson-planning': 0,
    'risk-management': 0,
    'teaching-learning': 0,
  };
  COMPETENCIES.forEach((c, i) => {
    areaTotals[c.area] += scores[i];
  });
  const total = scores.reduce((a, b) => a + b, 0);
  const totalBand = bandForTotal(total);
  const failReasons: FailReason[] = [];
  if (areaTotals['risk-management'] <= RISK_AUTO_FAIL_AT_OR_BELOW) failReasons.push('risk-management');
  if (lessonStopped) failReasons.push('lesson-stopped');
  if (totalBand === 'fail') failReasons.push('total');
  return {
    total,
    areaTotals,
    totalBand,
    band: failReasons.length > 0 ? 'fail' : totalBand,
    failReasons,
    weakest: weakestCompetencies(scores),
  };
}
