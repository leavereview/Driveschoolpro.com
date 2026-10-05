/**
 * /start squeeze-page variants — one per Google Ads ad group (theme).
 * Spec: docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md
 *
 * `{offer}` / `{offerLong}` in copy are replaced with OFFER.short / OFFER.long at
 * render time. Never put a date here — the offer changes, this file shouldn't have to.
 */
export type VariantId = 'core' | 'free' | 'scheduling' | 'tour';
export type BenefitId = 'diary' | 'dvsa' | 'payments' | 'reminders';

export interface StartVariant {
  id: VariantId;
  path: string;
  title: string;
  description: string;
  h1: string;
  subhead: string;
  hero: { src: string; alt: string; width: number; height: number };
  benefits: BenefitId[];
  extraFaq: { q: string; a: string };
  /** Submit-button text. Every variant says what happens next, not just "go". */
  cta: string;
  /**
   * The "See it working" section. A clip is a silent loop (no exits); an Arcade
   * demo is click-through — used only on the demo-first `tour` variant, whose
   * visitors already saw a variant once and need proof, not the same pitch.
   */
  demo:
    | { kind: 'clip'; src: string; poster: string; width: number; height: number; alt: string; posterAlt?: string; phone?: boolean }
    | { kind: 'arcade'; items: { id: string; title: string; ratio?: number }[] };
}

/** Verified clip definitions — copied from the homepage, where each was checked against src/config/features.ts. */
const CLIPS = {
  progress: {
    kind: 'clip',
    src: '/videos/progress-tracking.mp4',
    poster: '/images/marketing/dvsa-progress-poster.webp',
    width: 1234,
    height: 1098,
    alt: 'The DVSA Ready to Pass grid: mastered competencies per category, a progress-over-time chart drawing in, then the Manoeuvres category opening to show each skill’s proficiency level.',
  },
  briefings: {
    kind: 'clip',
    src: '/videos/lesson-briefings-today.mp4',
    poster: '/images/marketing/lesson-briefings-today-poster.webp',
    width: 640,
    height: 1156,
    alt: 'The Today view on a phone: tomorrow’s lesson card with the pupil’s name, address, a suggested focus and an AI lesson briefing already written from the instructor’s lesson notes.',
    posterAlt: 'DriveSchoolPro on a phone: the Today view showing tomorrow’s 09:15 lesson with Sophie Bennett, a suggested focus and an AI lesson briefing.',
    phone: true,
  },
  reschedule: {
    kind: 'clip',
    src: '/videos/calendar-reschedule.mp4',
    poster: '/images/marketing/calendar-reschedule-poster.webp',
    width: 944,
    height: 720,
    alt: 'The day calendar for 30 September: each lesson laid out by time with the pupil, pick-up address and a Reschedule button, and a lesson being moved to a new slot.',
    posterAlt: 'The DriveSchoolPro day calendar for Wednesday 30 September showing the day’s lessons with pupil names, addresses and Reschedule buttons.',
  },
} as const satisfies Record<string, StartVariant['demo']>;

export const BENEFITS: Record<BenefitId, { title: string; body: string }> = {
  diary: {
    title: 'Your diary on your phone',
    body: 'Book, move and cancel lessons between pupils — no paper diary, no spreadsheet.',
  },
  dvsa: {
    title: 'Tracks all 27 DVSA driving skills',
    body: 'Record progress against the official framework, and pupils see it in their own portal.',
  },
  payments: {
    title: 'Pupils book and pay online',
    body: 'Card payments go straight to your bank through Stripe, so you stop chasing cash.',
  },
  reminders: {
    title: 'Automatic lesson reminders',
    body: 'Pupils get a reminder before every lesson, which means fewer no-shows.',
  },
};

export const SHARED_FAQ: { q: string; a: string }[] = [
  {
    q: 'Is DriveSchoolPro free?',
    a: 'Yes. {offerLong}, with no card required and nothing charged automatically. The one optional cost: if you take card payments from pupils through the app, we charge 3% per payment and Stripe’s own processing fee is separate. Cash and bank transfers you record cost nothing.',
  },
  {
    q: 'Does it work on my phone?',
    a: 'Yes. It works on iPhone, Android, iPad, laptop and desktop. Most instructors use it on their phone between lessons.',
  },
  {
    q: 'Does it track DVSA driving skills?',
    a: 'Yes. It tracks all 27 DVSA driving skills across 8 categories, and pupils can view their own progress in a self-service portal.',
  },
  {
    q: 'Can I switch from my paper diary easily?',
    a: 'Most instructors are set up within five minutes. Add your pupils and book your first lesson — you can run both side by side until you’re comfortable.',
  },
  {
    q: 'What happens when early access ends?',
    a: 'We’ll announce pricing well before early access ends. There’s no card on file and nothing is charged automatically, so you decide whether to carry on.',
  },
];

export const START_VARIANTS: Record<VariantId, StartVariant> = {
  core: {
    id: 'core',
    path: '/start/',
    title: 'Driving school software for instructors | DriveSchoolPro',
    description: 'Diary, DVSA progress and payments in one app for UK driving instructors. No card required.',
    h1: 'Driving school software that runs from your phone',
    subhead: 'Diary, DVSA progress and payments in one place. {offer} — no card required.',
    hero: {
      src: '/images/marketing/ai-briefing-today-mobile.webp',
      alt: 'DriveSchoolPro Today screen on a phone showing the lesson in progress, pupil address and a lesson briefing',
      width: 640,
      height: 1164,
    },
    benefits: ['diary', 'dvsa', 'payments'],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
    cta: 'Get started free',
    demo: CLIPS.progress,
  },
  free: {
    id: 'free',
    path: '/start/free/',
    title: 'Free driving school app for iPhone and Android | DriveSchoolPro',
    description: 'Free driving school software for UK instructors, with an app for iPhone and Android. No card required.',
    h1: 'Free driving school app for iPhone and Android',
    subhead: '{offer}. Create your school here, then get the app on your phone — no card required.',
    hero: {
      src: '/images/marketing/calendar-day-mobile.webp',
      alt: 'DriveSchoolPro day view on a phone with a full day of lessons, pupil names and addresses',
      width: 640,
      height: 1164,
    },
    benefits: ['diary', 'dvsa', 'reminders'],
    extraFaq: {
      q: 'Is there an app to download?',
      a: 'Yes. DriveSchoolPro is free on the App Store and Google Play. Create your school here first, then sign in on the app. You can also use it in any web browser.',
    },
    cta: 'Create my free school',
    demo: CLIPS.briefings,
  },
  scheduling: {
    id: 'scheduling',
    path: '/start/scheduling/',
    title: 'Driving lesson scheduling software | DriveSchoolPro',
    description: 'Book, move and remind pupils from one diary on your phone. Built for UK driving instructors. No card required.',
    h1: 'Lesson scheduling built for driving instructors',
    subhead: 'Book, move and remind pupils from one diary. {offer} — no card required.',
    hero: {
      src: '/images/marketing/calendar-day-mobile.webp',
      alt: 'DriveSchoolPro day view on a phone with lessons scheduled through the day',
      width: 640,
      height: 1164,
    },
    benefits: ['diary', 'reminders', 'payments'],
    extraFaq: {
      q: 'Can pupils book lessons themselves?',
      a: 'Yes. Pupils can book and pay online through their portal, within the hours you make available.',
    },
    cta: 'Set up my diary',
    demo: CLIPS.reschedule,
  },
  // Display remarketing (R1: visited a variant, never submitted). Demo-first, not in Search.
  tour: {
    id: 'tour',
    path: '/start/tour/',
    title: 'See DriveSchoolPro in action | DriveSchoolPro',
    description: 'Click through the diary and DVSA progress tracking yourself, then set up your school. No card required.',
    h1: 'See it working before you sign up',
    subhead: 'Click through the real diary and DVSA progress below. {offer} — no card required.',
    hero: {
      src: '/images/marketing/calendar-day-mobile.webp',
      alt: 'DriveSchoolPro day view on a phone with a full day of lessons, pupil names and addresses',
      width: 640,
      height: 1164,
    },
    benefits: ['diary', 'dvsa', 'payments'],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
    cta: 'Get started free',
    demo: {
      kind: 'arcade',
      items: [
        { id: 'wmaqmMnxBOOkddxDDfGz', title: 'Reschedule a Driving Lesson in the Calendar' },
        { id: 'cCvwdbSQVM1HfA3KkxcL', title: 'Record and Review a Driving Lesson Outcome', ratio: 81.9214 },
      ],
    },
  },
};

/** Replace the copy placeholders with the current offer. */
export function fillOffer(s: string, offer: { short: string; long: string }): string {
  return s.replace('{offerLong}', offer.long).replace('{offer}', offer.short);
}
