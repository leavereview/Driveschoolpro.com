// Shared by /driving-instructor-diary-app/ and /driving-instructor-app/ so the vendor facts have one source.
// Re-check every cell (and save evidence off-repo) before changing the "Checked on" date on either page.
export const INSTRUCTOR_APPS_CHECKED_ON = '19 November 2026';
export const instructorAppHeaders = ['DriveSchoolPro', 'Total Drive', 'MyDriveTime', 'GoRoadie Pro'];

// Competitor cells below come from each vendor's own public pages, help guides and app-store
// listings, checked 19 Nov 2026 (evidence saved off-repo in archive/compare-evidence/<vendor>/2026-11-19/).
// Rules (compare-pages memory): never state a competitor price; "Not listed" not "No"; no "tested"
// cells here because the shared method note says we have not used their software. DSP cells must be live today.
export const instructorAppRows = [
  {
    label: 'Diary',
    values: [
      'Day, week and month views, drag-and-drop, clash checks across pupil, instructor and vehicle, one-way calendar feed to Google Calendar, iPhone and Mac. Web, iPhone and Android.',
      'Diary on iOS, Android and web, online or offline. Clash alert in its help guide.',
      'Diary with clash highlighting and diary gaps. Diary export to Outlook, Google and Apple calendars.',
      'Phone diary (iPhone and Android) with conflict alerts, synced to your phone calendar. Diary in a browser: not stated.',
    ],
  },
  {
    label: 'Pupil app',
    values: [
      'Yes (iOS, Android or web): lessons, progress, balance, self-booking.',
      'Yes (iOS, Android or web), brandable with your logo.',
      'Yes (student app).',
      "Yes (free learner app). GoRoadie says pupils can't book into your diary.",
    ],
  },
  {
    label: 'Payments',
    values: [
      "Pupils pay by card through Stripe into your own account; lesson blocks; cash and bank transfers recorded. 3% platform fee plus Stripe's fee.",
      'Pupils pay online (Book & Pay), with next-working-day payouts to the instructor.',
      'Payment status, payment history and prepaid lessons tracked. Pupil card payments: not listed.',
      'Request payments in-app through Stripe.',
    ],
  },
  {
    label: 'Progress tracking',
    values: [
      'Official DVSA 27 skills in 8 categories, rated on a six-level scale.',
      'Syllabus-based progress, editable; reflective logs and mock tests. Its site refers to the DVSA syllabus.',
      'Starts from the standard DVSA syllabus, fully customisable; reflective logs.',
      'Progress tracking and reflective logs. DVSA skills not named.',
    ],
  },
  {
    label: 'Price',
    values: [
      'Free until 31 March 2027, no card needed (see our pricing page).',
      'See Total Drive pricing page',
      'See MyDriveTime pricing page',
      'See GoRoadie Pro page',
    ],
  },
];
