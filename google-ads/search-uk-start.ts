/**
 * Google Ads Search build for account 852-626-4049 — source of truth for the
 * Ads Editor CSVs in docs/google-ads/. Edit here, run scripts/build-ads-csv.ts.
 * Ad copy never contains offer dates (offer changes; ads would go stale).
 */
const UTM = 'utm_source=google&utm_medium=cpc&utm_campaign=search-uk-start';

export const CAMPAIGN = { name: 'Search – UK – Start', budgetGbp: 12, maxCpcGbp: 2.5 };

const SHARED_HEADLINES = [
  'Free During Early Access',
  'No Card Required',
  'Works on Your Phone',
  'Built for UK Instructors',
  'Tracks All 27 DVSA Skills',
  'Set Up in Under a Minute',
  'Pupils Book and Pay Online',
  'Automatic Lesson Reminders',
  'Start With Your School Name',
  'DriveSchoolPro',
];

const DESCRIPTIONS = [
  'Diary, DVSA progress and payments for UK driving instructors. Free during early access.',
  'Enter your school name and you are set up in under a minute. No card required.',
  'Pupils book and pay online, get lesson reminders and see their own DVSA progress.',
  'Works in your browser and on your phone. Nothing to install, nothing to download.',
];

type Headline = { text: string; pin?: 1 };
const h = (texts: string[]): Headline[] => texts.map((text) => ({ text }));

export const AD_GROUPS: {
  name: 'Free' | 'Core' | 'Scheduling';
  finalUrl: string;
  keywords: string[];
  headlines: Headline[];
  descriptions: string[];
  path1: string;
  path2: string;
}[] = [
  {
    name: 'Free',
    finalUrl: `https://driveschoolpro.com/start/free/?${UTM}&utm_content=free`,
    keywords: [
      'driving school software free',
      'free driving school software',
      'driving school software free version',
      'driving school software free download',
    ],
    headlines: [
      { text: 'Free Driving School Software', pin: 1 },
      { text: '{KeyWord:Driving School Software}' },
      ...h(['Nothing to Download', 'Free Instructor Software', 'Diary, Pupils and Payments']),
      ...h(SHARED_HEADLINES),
    ],
    descriptions: DESCRIPTIONS,
    path1: 'free',
    path2: 'instructors',
  },
  {
    name: 'Core',
    finalUrl: `https://driveschoolpro.com/start/?${UTM}&utm_content=core`,
    keywords: [
      'driving school software',
      'driving school management software',
      'software for driving schools',
      'driving instructor software',
      'driver training software',
    ],
    headlines: [
      { text: 'Driving School Software', pin: 1 },
      { text: '{KeyWord:Driving Instructor Software}' },
      ...h(['Run Lessons From Your Phone', 'Diary, Pupils and Payments', 'All-in-One for Instructors']),
      ...h(SHARED_HEADLINES),
    ],
    descriptions: DESCRIPTIONS,
    path1: 'driving-school',
    path2: 'software',
  },
  {
    name: 'Scheduling',
    finalUrl: `https://driveschoolpro.com/start/scheduling/?${UTM}&utm_content=scheduling`,
    keywords: [
      'driving school scheduling software',
      'driving lesson scheduling software',
      'driving lessons software',
      'driving instructor diary app',
    ],
    headlines: [
      { text: 'Driving Lesson Scheduling', pin: 1 },
      { text: '{KeyWord:Lesson Scheduling Software}' },
      ...h(['Book and Move Lessons Fast', 'One Diary for All Pupils', 'Instructor Diary App']),
      ...h(SHARED_HEADLINES),
    ],
    descriptions: DESCRIPTIONS,
    path1: 'scheduling',
    path2: 'instructors',
  },
];

/** Phrase-match negatives per ad group, so "free" searches land on /start/free. */
export const ROUTING_NEGATIVES: Record<string, string[]> = {
  Core: ['free'],
  Scheduling: ['free'],
};

/** Shared negative list "DSP exclusions" (phrase match), applied to every campaign. */
export const SHARED_NEGATIVES = [
  'fleet', 'hgv', 'lorry', 'truck', 'taxi', 'bus', 'coach', 'courier', 'delivery', 'rota',
  'driver scheduling', 'dispatch', 'jobs', 'job', 'career', 'salary', 'vacancies',
  'course', 'courses', 'theory test', 'hazard perception', 'learner', 'learners',
  'simulator', 'game', 'crack', 'torrent', 'apk', 'login', 'sign in', 'cdl',
];
