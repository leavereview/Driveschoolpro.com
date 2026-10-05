/**
 * /start squeeze-page variants — one per Google Ads ad group (theme).
 * Spec: docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md
 *
 * `{offer}` / `{offerLong}` in copy are replaced with OFFER.short / OFFER.long at
 * render time. Never put a date here — the offer changes, this file shouldn't have to.
 */
export type VariantId = 'core' | 'free' | 'scheduling' | 'tour';
import type { MomentId } from './moments';

export interface StartVariant {
  id: VariantId;
  path: string;
  title: string;
  description: string;
  h1: string;
  subhead: string;
  hero: { src: string; alt: string; width: number; height: number };
  /** "Your week with DriveSchoolPro" — ordered to match the ad group's search intent. */
  moments: MomentId[];
  /** Free ("free download") leads with the apps section, before the week. */
  appsFirst?: boolean;
  /**
   * Click-through Arcade demos, shown before the week. Only on the demo-first
   * `tour` variant: its visitors already saw a variant once and need proof.
   */
  arcade?: { id: string; title: string; ratio?: number }[];
  extraFaq: { q: string; a: string };
  /** Submit-button text. Every variant says what happens next, not just "go". */
  cta: string;
}

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
    a: 'Yes. It tracks all 27 DVSA driving skills across 8 categories, and pupils see their own progress in their app or any browser.',
  },
  {
    q: 'Can I switch from my paper diary easily?',
    a: 'Setting up takes about two minutes. Then add your pupils as you go — you can run both side by side until you’re comfortable.',
  },
  {
    q: 'Is there an app for me and my pupils?',
    a: 'Yes. DriveSchoolPro is free on the App Store and Google Play. You run your diary from it, and your pupils use the same app — or any web browser — to see their lessons and progress, book and pay.',
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
      src: '/images/marketing/calendar-day-mobile.webp',
      alt: 'DriveSchoolPro day view on a phone with a full day of lessons, pupil names and addresses',
      width: 640,
      height: 1164,
    },
    moments: ['briefing', 'dvsa', 'paid', 'reminders'],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
    cta: 'Get started free',
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
    moments: ['briefing', 'paid', 'reminders'],
    appsFirst: true,
    extraFaq: {
      q: 'How do I get the app?',
      a: 'Create your school on this page first, then download DriveSchoolPro from the App Store or Google Play and sign in. You can then invite your pupils to the same app.',
    },
    cta: 'Create my free school',
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
    moments: ['diary', 'reminders', 'paid'],
    extraFaq: {
      q: 'Can pupils book lessons themselves?',
      a: 'Yes. Pupils can book and pay in their app or any browser, within the hours you make available.',
    },
    cta: 'Set up my diary',
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
    moments: ['briefing', 'dvsa', 'paid'],
    arcade: [
      { id: 'wmaqmMnxBOOkddxDDfGz', title: 'Reschedule a Driving Lesson in the Calendar' },
      { id: 'cCvwdbSQVM1HfA3KkxcL', title: 'Record and Review a Driving Lesson Outcome', ratio: 81.9214 },
    ],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
    cta: 'Get started free',
  },
};

/** Replace the copy placeholders with the current offer. */
export function fillOffer(s: string, offer: { short: string; long: string }): string {
  return s.replace('{offerLong}', offer.long).replace('{offer}', offer.short);
}
