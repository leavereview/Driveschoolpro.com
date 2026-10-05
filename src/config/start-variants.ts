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
