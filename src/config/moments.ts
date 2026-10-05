/**
 * "Your week with DriveSchoolPro" — the instructor's moments, shared by the
 * /start landers (WeekMoments.astro). Copy reuses the homepage's approved lines
 * (benefit-architecture spec, 2026-09-10): pain sentence → outcome headline →
 * one sentence of how. The headline is never a feature's name.
 *
 * Every claim here was checked against the app on 2026-10-05; see
 * project_driveschoolpro_marketing_claims before changing one.
 */
export type MomentId = 'briefing' | 'dvsa' | 'paid' | 'reminders' | 'diary';

export type MomentMedia =
  | { kind: 'clip'; src: string; poster: string; width: number; height: number; alt: string; posterAlt?: string; phone?: boolean }
  | { kind: 'still'; src: string; width: number; height: number; alt: string; crop?: string }
  | { kind: 'none' };

export interface Moment {
  eyebrow: string;
  pain: string;
  headline: string;
  body: string;
  media: MomentMedia;
}

export const MOMENTS: Record<MomentId, Moment> = {
  briefing: {
    eyebrow: 'Before the first pickup',
    pain: 'You pull up outside their house trying to remember what went wrong at that roundabout three weeks ago.',
    headline: 'Know exactly what to teach before you pull up.',
    body: 'Open the Today screen: who’s next, their address with one-tap Navigate, and a briefing written from your last lesson notes.',
    media: {
      kind: 'clip',
      src: '/videos/lesson-briefings-today.mp4',
      poster: '/images/marketing/lesson-briefings-today-poster.webp',
      width: 640,
      height: 1156,
      alt: 'The Today view on a phone: tomorrow’s lesson card with the pupil’s name, address, a suggested focus and an AI lesson briefing already written from the instructor’s lesson notes.',
      posterAlt: 'DriveSchoolPro on a phone: the Today view showing tomorrow’s 09:15 lesson with Sophie Bennett, a suggested focus and an AI lesson briefing.',
      phone: true,
    },
  },
  dvsa: {
    eyebrow: 'End of the lesson',
    pain: 'Notes get written up at eleven at night, or they don’t get written up at all.',
    headline: 'Logged before they’ve shut the door.',
    body: 'Tap the skill, set the level. All 27 DVSA skills across 8 categories — and pupils see their own progress, so they stop asking how they’re doing.',
    media: {
      kind: 'clip',
      src: '/videos/progress-tracking.mp4',
      poster: '/images/marketing/dvsa-progress-poster.webp',
      width: 1234,
      height: 1098,
      alt: 'The DVSA Ready to Pass grid: mastered competencies per category, a progress-over-time chart drawing in, then the Manoeuvres category opening to show each skill’s proficiency level.',
    },
  },
  paid: {
    eyebrow: 'Your pupils’ side',
    pain: 'Asking a 17-year-old for £35 at the kerb, in the rain, is nobody’s favourite part of this job.',
    headline: 'They’ve already paid before they open the door.',
    body: 'Pupils book within the hours you set and pay by card in their own app. The money goes to your bank through Stripe, and anything outstanding sits on their home screen.',
    // Text-only: the pupil's screen is shown by OnYourPhone, which always follows on /start.
    media: { kind: 'none' },
  },
  reminders: {
    eyebrow: 'The night before',
    pain: 'A no-show is an hour you don’t get back.',
    headline: 'Reminded without you sending a text.',
    body: 'Every pupil gets an email reminder before every lesson, automatically — you choose how far ahead.',
    media: { kind: 'none' },
  },
  diary: {
    eyebrow: 'Sunday night',
    pain: 'Three pupils to move and a diary full of pencil marks.',
    headline: 'Move a lesson. Everything else catches up.',
    body: 'Tap Reschedule, pick the new slot, done. It checks the pupil, the instructor and the car, so you can’t double-book. Day, week and month views.',
    media: {
      kind: 'clip',
      src: '/videos/calendar-reschedule.mp4',
      poster: '/images/marketing/calendar-reschedule-poster.webp',
      width: 944,
      height: 720,
      alt: 'The day calendar for 30 September: each lesson laid out by time with the pupil, pick-up address and a Reschedule button, and a lesson being moved to a new slot.',
      posterAlt: 'The DriveSchoolPro day calendar for Wednesday 30 September showing the day’s lessons with pupil names, addresses and Reschedule buttons.',
    },
  },
};
