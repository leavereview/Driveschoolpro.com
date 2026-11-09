/**
 * "Alternatives to {app}" lines for the compare pages (D5, SEO plan 3 Nov 2026).
 *
 * One line per UK instructor app, written only from that vendor's own public
 * home or product page, checked on ALTERNATIVES_CHECKED. No prices (they change;
 * ASA CAP 3.33-3.41), no ratings, no "best". Re-check every line before
 * changing the date.
 *
 * Sources, 3 Nov 2026:
 *  - totaldrive.co.uk/driving-instructor-app/: "Based in Devon, UK"; diary works
 *    online or offline across devices; pupil app you can brand with your logo;
 *    Smart Gaps; Theory Suite; "We can import all your pupils, profiles, lessons and diary".
 *  - mydrivetime.co.uk/: "Diary & Admin App for Driving Instructors & Schools";
 *    student app; "SMS text messages included" (individual plan); Diary Gaps;
 *    free data transfer; Expense Receipts.
 *  - goroadie.com/pro: iPhone and Android app (Web Dashboard mentioned for finances/mileage, 9 Nov 2026; diary on web not stated); free
 *    companion learner app; reminders with no text fees; in-app payment requests;
 *    receipt scanning, "Making Tax Digital, ready"; Theory Test Pro / 4 in 1 sync.
 *    goroadie.com: learner marketplace (pay per pupil).
 *  - lessondiary.co.uk/: browser plus iOS app; offer a cancelled slot, first
 *    pupil to book gets it; private lesson link for pupils, no account or app;
 *    DVSA-style mock tests; tracks who has paid but does not process card payments.
 *  - DriveSchoolPro: /about/facts/.
 */
export const ALTERNATIVES_CHECKED = '3 November 2026';

export type AltKey = 'driveschoolpro' | 'total-drive' | 'mydrivetime' | 'goroadie' | 'lesson-diary';

export interface Alternative {
  key: AltKey;
  name: string;
  url: string;
  /** Our own comparison page with this app, if there is one. */
  compareUrl?: string;
  line: string;
}

export const ALTERNATIVES: Alternative[] = [
  {
    key: 'driveschoolpro',
    name: 'DriveSchoolPro',
    url: '/',
    line: 'Diary, online booking and Stripe card payments, with progress on the 27 DVSA skills and AI lesson briefings, for one instructor or a whole school. Web, iPhone and Android. Free until 31 March 2027; email reminders only for now.',
  },
  {
    key: 'total-drive',
    name: 'Total Drive',
    url: 'https://totaldrive.co.uk/driving-instructor-app/',
    compareUrl: '/compare/total-drive/',
    line: 'Devon-based instructor and school app: a diary that works offline, a pupil app you can brand, Smart Gaps to fill cancellations, a theory suite, and they will move your pupils, lessons and diary across from your old system.',
  },
  {
    key: 'mydrivetime',
    name: 'MyDriveTime',
    url: 'https://www.mydrivetime.co.uk/',
    compareUrl: '/compare/my-drive-time/',
    line: 'Diary and admin app for instructors and schools: a student app, SMS reminders included on the individual plan, Diary Gaps, expense receipts and free transfer of your records.',
  },
  {
    key: 'goroadie',
    name: 'GoRoadie Pro',
    url: 'https://goroadie.com/pro',
    compareUrl: '/compare/goroadie/',
    line: 'iPhone and Android app with a free learner app, reminders with no text costs, in-app payments, receipt scanning and theory test progress. GoRoadie also runs a learner marketplace.',
  },
  {
    key: 'lesson-diary',
    name: 'Lesson Diary',
    url: 'https://lessondiary.co.uk/',
    line: 'Browser and iPhone app built around filling cancellations: offer a free slot and the first pupil to book gets it. Pupils use a private link with no account, and it has DVSA-style mock tests. It tracks who has paid but does not take card payments.',
  },
];

/** The alternatives to show on the page about `exclude`: DriveSchoolPro first, then the others. */
export function alternativesTo(exclude: AltKey): Alternative[] {
  return ALTERNATIVES.filter((a) => a.key !== exclude);
}
