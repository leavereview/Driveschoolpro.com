/**
 * /start squeeze-page variants — one per Google Ads ad group (theme).
 * Spec: docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md
 *
 * `{offer}` / `{offerLong}` in copy are replaced with OFFER.short / OFFER.long at
 * render time. Never put a date here — the offer changes, this file shouldn't have to.
 */
export type VariantId = 'core' | 'free' | 'scheduling';
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
}

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
    a: '{offerLong} — no credit card required. We charge 3% on card payments you collect, and Stripe’s own processing fee is separate. Nothing is charged automatically.',
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
      src: '/images/marketing/calendar-mobile.webp',
      alt: 'DriveSchoolPro lesson diary on a phone showing a week of booked lessons',
      width: 375,
      height: 812,
    },
    benefits: ['diary', 'dvsa', 'payments'],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
  },
  free: {
    id: 'free',
    path: '/start/free/',
    title: 'Free driving school software — no download | DriveSchoolPro',
    description: 'Free driving school software for UK instructors. Works in your browser and on your phone. No card, no install.',
    h1: 'Free driving school software — nothing to download',
    subhead: '{offer}. Works in your browser and on your phone — no card, no install.',
    hero: {
      src: '/images/marketing/portal-dashboard-mobile.webp',
      alt: 'DriveSchoolPro pupil portal on a phone showing upcoming lessons and progress',
      width: 375,
      height: 1193,
    },
    benefits: ['diary', 'dvsa', 'reminders'],
    extraFaq: {
      q: 'Is there anything to download?',
      a: 'No. DriveSchoolPro runs in your web browser. On your phone you can add it to your home screen so it opens like an app.',
    },
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
  },
};

/** Replace the copy placeholders with the current offer. */
export function fillOffer(s: string, offer: { short: string; long: string }): string {
  return s.replace('{offerLong}', offer.long).replace('{offer}', offer.short);
}
