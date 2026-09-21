/**
 * Claim verification — asserts the built site does not contradict the app.
 *
 * verify-seo.js checks that pages are structurally sound; this checks that what
 * they SAY is true. Each rule cites the app-side flag that makes it a rule, so a
 * flag flip tells you exactly which rule to retire.
 *
 * Ground truth: driveschoolpro/src/lib/feature-flags.ts and the per-feature
 * constants in src/lib/config/*-visibility.ts. Every flag env var is empty in
 * .env.example, and UNSET MEANS HIDDEN.
 *
 * Verified against production 2026-09-03:
 *   /confirm/<token>    -> 404  => lesson confirmation OFF
 *   /portal/find-school -> 200  => student portal LIVE
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Strip tags so "Portal <span>Coming Soon</span>" reads as adjacent words,
// decode the entities Astro emits, collapse whitespace, lowercase.
function normalise(html) {
  return html
    // Close block-level elements with a sentinel first. Proximity must not read
    // a marker that belongs to the NEXT heading or paragraph as if it belonged
    // to the last words of this one - that artifact produced two false
    // positives (a "Coming Soon" badge on a following <h3>, and a feature list
    // where the marker sat nearer a later item than the word that owned it).
    .replace(/<\/(h[1-6]|p|li|td|th|div|section|article|tr|ul|ol)>/gi, ' \u00b6 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8212;|&mdash;/g, '-').replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
    .toLowerCase();
}

/** Phrases that must never appear. [phrase, why] */
const FORBIDDEN = [
  ['one-click confirm', 'lessonConfirmationFlag is off'],
  ['one click confirm', 'lessonConfirmationFlag is off'],
  ['one-tap confirmation', 'lessonConfirmationFlag is off'],
  ['one-click confirmation', 'lessonConfirmationFlag is off'],
  ['confirm or reschedule', 'lessonConfirmationFlag is off'],
  ['with expiry alerts', 'documents UI has no surface'],
  ['expiry date alerts', 'documents UI has no surface'],
  ['approaching expiry', 'documents UI has no surface'],
  ['upload student documents', 'documents UI has no surface'],
  ['upload and manage student documents', 'documents UI has no surface'],
  ['instructor utilisation report', 'utilisationReportFlag is off'],
  ['monitors your utilisation', 'utilisationReportFlag is off'],
  ['invite a parent', 'parentAccessFlag is off'],
  ['parent portal', 'parentAccessFlag is off'],
  ['parent portals', 'parentAccessFlag is off'],
  ['parents their own portal', 'parentAccessFlag is off'],
  // Found live on /how-progress-works/ 2026-09-10: the page sold parent access in
  // three phrasings none of the rules above matched, while its own FAQ said the
  // feature did not exist. These close that gap.
  ['parents can also be given', 'parentAccessFlag is off'],
  ['parents can be given', 'parentAccessFlag is off'],
  ['pupils and parents can view', 'parentAccessFlag is off'],
  ['parent and guardian access', 'parentAccessFlag is off'],
  // Review collection is a NUDGE, not an automatic send: ReviewNudgePanel puts
  // candidates (test passes + inactive pupils) on the Today screen and the
  // instructor taps send. Copy claiming it sends by itself is false. Found and
  // corrected 2026-09-10 after the first draft of /features/reviews/ shipped it.
  ['review request goes out automatically', 'review collection is a nudge, not an automatic send'],
  ['review requests go out automatically', 'review collection is a nudge, not an automatic send'],
  ['requests go to your google business profile automatically', 'review collection is a nudge, not an automatic send'],
  ['reviews are sent automatically', 'review collection is a nudge, not an automatic send'],
  // Found 2026-09-10 by scanning every product claim against the app. The only
  // text/calendar response in the whole app is the PUBLIC booking-management
  // route (a pupil's own lesson); there is no instructor diary export or feed.
  ['export lessons to google', 'no instructor-side calendar export exists'],
  ['export your driveschoolpro diary', 'no instructor-side calendar export exists'],
  ['one-way calendar file', 'no instructor-side calendar export exists'],
  ['reads an ics feed', 'no instructor-side calendar export exists'],
  // No per-pupil switch for AI briefings exists anywhere in validations, config
  // or schema.prisma. Claimed on two pages before this scan.
  ['turned off per pupil', 'no per-pupil briefing toggle exists'],
  ['turned off per-pupil', 'no per-pupil briefing toggle exists'],
  ['off per pupil', 'no per-pupil briefing toggle exists'],
  // Review collection: six more pages carried the "automatic" framing.
  ['triggers an automatic review', 'review collection is a nudge, not an automatic send'],
  ['automatic review request', 'review collection is a nudge, not an automatic send'],
  ['automated google review request', 'review collection is a nudge, not an automatic send'],
  ['automatically sends a review', 'review collection is a nudge, not an automatic send'],
  // PLATFORM COMMISSION IS 3%. driveschoolpro/src/lib/utils/connect-fees.ts:14-25
  // (#1139, JP 2026-08-24: "3%, everyone, from launch") and schema.prisma:1081
  // platformFeePercent @default(3). It applies to FOUNDING orgs too - the free
  // launch is no SUBSCRIPTION fee, not no commission. The site claimed the
  // opposite in 17 places across 8 pages until 2026-09-11, three of them inside
  // FAQPage JSON-LD. The changelog's July 2026 entry is exempt below: it was
  // accurate when written, since the 3% decision postdates it.
  ['no commission', 'platform commission is 3% (connect-fees.ts, JP 2026-08-24)'],
  ['0% of your payments', 'platform commission is 3% (connect-fees.ts, JP 2026-08-24)'],
  ['take no commission', 'platform commission is 3% (connect-fees.ts, JP 2026-08-24)'],
  ['inc vat', 'LEAVE.REVIEW LTD is not VAT-registered'],
  ['including vat', 'LEAVE.REVIEW LTD is not VAT-registered'],
  ['#ff385c', 'not a brand token'],
];

/** Phrase is only allowed when a marker sits nearby. [phrase, need, window, why] */
const PAIRED = [
  ['recurring lesson', 'coming soon', 120, 'recurringBookingFlag is off'],
  ['recurring series', 'coming soon', 120, 'recurringBookingFlag is off'],
  // Test bookings/results and pass-rate reporting are BUILT but hidden: /tests
  // and /reports/tests share one predicate (testsReportFlag, off). The decision
  // is to keep selling them as upcoming rather than drop them, so they are
  // allowed wherever a coming-soon marker sits alongside.
  //
  // These match PRODUCT-CAPABILITY phrasings only. Bare "pass rate" and "test
  // results" are domain vocabulary all over the blog - DVSA national rates,
  // "Premature Test Bookings" as a section heading - and guarding them produced
  // 33 hits that were almost all legitimate editorial. A guard that cries wolf
  // gets switched off, so it only fires on wording that promises a feature.
  ['recording test bookings', 'coming soon', 160, 'testsReportFlag is off'],
  ['record test bookings', 'coming soon', 160, 'testsReportFlag is off'],
  ['practical test booking', 'coming soon', 160, 'testsReportFlag is off'],
  ['logging test bookings', 'coming soon', 160, 'testsReportFlag is off'],
  ['log test bookings', 'coming soon', 160, 'testsReportFlag is off'],
  ['test bookings and results', 'coming soon', 160, 'testsReportFlag is off'],
  ['test bookings and test results', 'coming soon', 160, 'testsReportFlag is off'],
  ['pass-rate reporting', 'coming soon', 160, 'testsReportFlag is off'],
  ['pass rate reporting', 'coming soon', 160, 'testsReportFlag is off'],
];

// Forbidden only when two phrases co-occur. Narrower than FORBIDDEN because the
// bare phrase is legitimate elsewhere: the blog cites "first-time pass rates" as
// an industry statistic, which is fine; claiming WE report yours is not.
const FORBIDDEN_PAIR = [];

/** A shipped feature sitting next to a stale marker. [feature, marker, window, why] */
const STALE = [
  ['student portal', 'coming soon', 60, 'student portal is GA'],
  ['self-service portal', 'coming soon', 60, 'student portal is GA'],
  ['booking widget', 'coming soon', 60, 'embed booking widget is built'],
  ['card payments', 'coming soon', 60, 'Stripe Connect is live'],
  ['card payments', 'in development', 60, 'Stripe Connect is live'],
  ['online payments', 'coming soon', 60, 'Stripe Connect is live'],
  ['online booking', 'coming soon', 60, 'portal booking and the embed widget are live'],
  ['multi-instructor management', 'coming soon', 60, 'FOUNDING includes School tier'],
];

/**
 * Documented exceptions. A rule fires on a phrase, but a phrase is not always a
 * claim about US: a competitor review describes THEIR product, and a buying
 * guide tells the reader what to look for from any vendor. Silencing those by
 * editing the prose would falsify genuine content, so they are listed here with
 * a reason instead. [pagePrefix, phrase, why]
 */
const ALLOW = [
  ['/blog/drivescout-vs-drivingschoolsoftware-comparison/', 'recurring lesson',
   'describes DriveScout\'s scheduling, not ours'],
  ['/blog/how-to-choose-driving-school-scheduling-software/', 'recurring lesson',
   'buying-guide criterion for evaluating any vendor'],
  ['/blog/how-to-choose-driving-school-scheduling-software/', 'recurring series',
   'buying-guide criterion for evaluating any vendor'],
  ['/blog/student-management-driving-schools/', 'parent portal',
   'generic advice on what a student management system should include'],
  ['/blog/student-progress-tracking/', 'parent portal',
   'item in a checklist for evaluating any digital tracking system'],
  ['/blog/how-to-choose-driving-school-scheduling-software/', 'practical test booking',
   'UK regulatory context (test booking rules), not a product claim'],
  ['/changelog/', 'no commission',
   'dated historical record - the July 2026 entry was accurate when written; the 3% decision is dated 2026-08-24'],
  ['/changelog/', 'take no commission',
   'dated historical record - see above'],
];

function allowed(page, rule) {
  return ALLOW.some(([p, phrase]) => page === p && rule.includes(`"${phrase}"`));
}

/** Is `b` within `win` chars of the match at `i`, without crossing a block boundary? */
function hasNear(text, i, alen, b, win) {
  const before = text.slice(Math.max(0, i - win), i);
  const after = text.slice(i + alen, i + alen + win);
  const bBefore = before.lastIndexOf(b);
  if (bBefore !== -1 && !before.slice(bBefore + b.length).includes('\u00b6')) return true;
  const bAfter = after.indexOf(b);
  if (bAfter !== -1 && !after.slice(0, bAfter).includes('\u00b6')) return true;
  return false;
}

function nearby(text, a, b, win) {
  const hits = [];
  let i = text.indexOf(a);
  while (i !== -1) {
    const slice = text.slice(Math.max(0, i - win), i + a.length + win);
    // "WhatsApp ... coming soon" is CORRECT and must never be flagged. If
    // WhatsApp is what the marker belongs to, this is not a stale badge. The
    // WhatsApp lookup uses a WIDER window than the match: in a feature list
    // ("...reminders (WhatsApp coming soon), conflict detection, booking
    // widget...") the marker can sit further from the feature than from the
    // word that owns it.
    const owner = text.slice(Math.max(0, i - win - 60), i + a.length + win);
    if (hasNear(text, i, a.length, b, win) && !owner.includes('whatsapp'))
      hits.push(text.slice(Math.max(0, i - 40), i + a.length + 60).trim());
    i = text.indexOf(a, i + 1);
  }
  return hits;
}

if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist/ not found. Run npm run build first.');
  process.exit(1);
}

const pages = walk(distDir);
const failures = [];

for (const file of pages) {
  const page = '/' + path.relative(distDir, file).replace(/index\.html$/, '').replace(/\.html$/, '/');
  const text = normalise(fs.readFileSync(file, 'utf8'));

  for (const [phrase, why] of FORBIDDEN)
    if (text.includes(phrase)) failures.push({ page, rule: `forbidden: "${phrase}"`, why });

  for (const [phrase, need, win, why] of PAIRED) {
    let i = text.indexOf(phrase);
    while (i !== -1) {
      if (!hasNear(text, i, phrase.length, need, win)) {
        failures.push({ page, rule: `"${phrase}" without "${need}"`, why });
        break;
      }
      i = text.indexOf(phrase, i + 1);
    }
  }

  for (const [a, b, win, why] of FORBIDDEN_PAIR)
    for (const _ of nearby(text, a, b, win))
      failures.push({ page, rule: `forbidden: "${a}" near "${b}"`, why });

  for (const [a, b, win, why] of STALE)
    for (const _ of nearby(text, a, b, win))
      failures.push({ page, rule: `stale: "${a}" near "${b}"`, why });
}

const kept = failures.filter((f) => !allowed(f.page, f.rule));
const skipped = failures.length - kept.length;
failures.length = 0;
failures.push(...kept);

if (failures.length) {
  console.error(`CLAIM VERIFICATION FAILED - ${failures.length} issue(s):\n`);
  const byPage = {};
  for (const f of failures) (byPage[f.page] ||= []).push(f);
  if (skipped) console.error(`(${skipped} documented exception(s) allowed - see ALLOW)\n`);
  for (const [page, list] of Object.entries(byPage)) {
    console.error(`  ${page}`);
    for (const f of list) console.error(`    - ${f.rule}  (${f.why})`);
    console.error('');
  }
  process.exit(1);
}
console.log(`Claim verification passed - ${pages.length} pages checked` +
  (skipped ? `, ${skipped} documented exception(s) allowed.` : '.'));
