# SEO and AI visibility plan: 3 Nov to 13 Dec 2026 (6 weeks)

JP's goal (2 Nov): make driveschoolpro.com easier to find in Google and in AI answers. His Facebook group posting works. This plan supports it and does not replace it.

Builds on [the 2 Nov analysis](2026-11-02-seo-ai-visibility-analysis.md). Its numbers are not repeated here except as baselines.

## Where we start (3 Nov)

**Done since the analysis:** items 1, 2, 6, 7 (#52 to #54), 8 (agentbox #82, the new panel brands), 9 (best-software refresh, #56), 10 (blog layout shift, #58), plus diary-app and booking-system pages (#59). In the app: the in-app review prompt for Capterra, G2 and Trustpilot (#2107, merged 2 Nov in #2149) and "How did you find us?" with first landing page (#2113, merged in #2138).

**Still open from the ranked list:** 3 (Collingwood roundup), 4 (real customer reviews), 5 (tagged links in group posts), 11 ("Book lessons online" link), 12 (group questions turned into FAQs), 13 (#28, Feb 2027).

**What decides the next six weeks:** every panel question now has an on-site answer. What AI engines quote is mostly **off-site**: directory reviews, "best apps" roundups, app stores. Google buyer terms are stuck on pages 3 to 5 because of **authority** (Domain Rating 6, competitors 42 to 49). So most of the effort goes on reviews, roundups and links from customers' own websites, with on-site work only where the data shows a gap.

## Baselines and checkpoints

| Measure | Baseline (source, window) | Check on | Target by 13 Dec |
|---|---|---|---|
| AI panel: answers naming DSP (excl. brand question) | 19 of 76 (panel, 2 Nov) | **16 Nov** (#26), 1 Dec (monthly run) | 28 of 76 |
| AI panel: answers citing driveschoolpro.com | 8 | 16 Nov, 1 Dec | 12 |
| AI panel: Gemini / Google AI Mode answers naming DSP | 2 / 5 | 16 Nov, 1 Dec | 4 / 8 |
| Web-search re-run (10 prompts) naming DSP | 2 of 10, both via directories | 16 Nov (#26) | 4 of 10 |
| GSC UK, 28 days: clicks / impressions / CTR / position | 43 / 6,187 / 0.69% / 14.7 (3 to 31 Oct) | 1 Dec (#23), **14 Dec** | 60 clicks, CTR 0.9% |
| GSC: /blog/starting-driving-school-guide/ CTR | 0.37% at pos 9.7 (90 days) | 16 Nov, 14 Dec (28 days) | 1.5% |
| GSC: "driving school software" UK position | 17.8 | 14 Dec | 12 |
| GSC: "my drive time" position | 13.1 | 14 Dec | 8 |
| Indexed URLs (box URL Inspection) | 114 of 119 | 9 Nov, 14 Dec | 117 of 119 |
| Signups by source (app attribution, weekly report) | week to 1 Nov: 6 signups, 4 direct/unknown, 2 google, 0 facebook | every Monday | facebook and "found via" visible each week |
| Reviews on Capterra + G2 | JP to note today's counts | 16 Nov, 14 Dec | +5 real reviews in total |
| In-app review prompt (PostHog `review_prompt_shown` / `_clicked`) | new, 0 | 16 Nov, 14 Dec | first clicks recorded |

GSC baselines are from the 2 Nov analysis (box service account, windows ending 31 Oct). The local seo-audit tool does not read GSC, so re-measurement runs on the box (#23).

## Week by week

| Week | Theme | Claude, attended (marketing site) | Runner (app repo) | JP |
|---|---|---|---|---|
| **1** · 3 to 8 Nov | Close the last answer gaps; start the roundup push | D4 payments page (not indexed, no engine names us); D5 "alternatives" wording on compare pages; draft the Collingwood email | — (D1 to D3 filed after review) | Send the Collingwood email; note Capterra/G2 counts |
| **2** · 9 to 15 Nov | Links from customers' own sites | Check indexing of #45 to #59 pages (9 Nov); first FB-questions batch into FAQs | **D1** public booking page, **D2** "Book lessons online" link in Settings, **D3** widget footer link | Ask 3 named customers for a review |
| **3** · 16 to 22 Nov | Measure and react | **16 Nov panel re-run (#26)**; startup-guide CTR check; act on panel misses (one page per missed question, max 3) | Fixes from D1 to D3 review only | Message own schools: "add the booking link to your site and Google profile" (template from Claude) |
| **4** · 23 to 29 Nov | Directories and app stores | #25 Capterra/GetApp/Software Advice check after the G2 merge; app-store listing text check (native repo, attended) | — | Second review ask; second roundup (if Collingwood replies, the next one on the panel's cited-domain list) |
| **5** · 30 Nov to 6 Dec | Monthly review | **#23 monthly SEO review** (GSC + GA4 + 1 Dec panel); second FB-questions batch | Only if the review finds a bar-clearing app gap | — |
| **6** · 7 to 13 Dec | Re-measure, plan Q1 | **14 Dec GSC 28-day vs baseline**; write the Jan to Feb plan (includes #28) | — | Monday 14 Dec session: decide Q1 |

Rules for the six weeks: no new learner content (per the Nov plan); no new page without GSC or panel evidence behind it; one SEO change-log row in Notion per shipped change.

## Who does what

### a. Claude, attended sessions (marketing site, `leavereview/Driveschoolpro.com`)

| Work | Evidence | Week |
|---|---|---|
| D4: fix the payments page that Google won't index | URL Inspection: "Crawled - currently not indexed"; panel question "taking lesson payments online": 0 of 4 engines name us | 1 |
| D5: "alternatives to …" wording on the compare pages | Web re-run: "Alternatives to MyDriveTime" found nothing relevant, "Alternatives to Total Drive" named 3 others; "my drive time" 46 impr at 13 | 1 |
| Collingwood email draft (JP sends) | Collingwood is a source for 4 of 10 web answers, cited 6 times in the panel | 1 |
| FB group questions → FAQs with FAQPage schema (batches, max 5 questions each) | Facebook is the second-biggest source (42 sessions in 4 weeks); the questions instructors ask in groups are the ones they also ask ChatGPT | 2, 5 |
| Panel re-run, react to misses | #26 | 3 |
| Directory listing check | #24, #25; Capterra (10 citations), Software Advice (7), G2 (5) in the panel | 4 |
| App-store listing title and subtitle check (native app, attended) | play.google.com cited 10 times, apps.apple.com 9; WeDrive, Instructly etc. win "best/free/diary app" with "driving instructor" in the store title | 4 |
| Monthly review, re-measure, Q1 plan | #23 | 5, 6 |

### b. Runner (app repo, `leavereview/driveschoolpro`)

D1 to D3 below. They share one aim: let customers put a plain, useful link to DriveSchoolPro on their own websites and Google profiles, and make the existing widget link safe. Links from customers' sites are the only authority source we control. They also support the Facebook groups: a school that books lessons through DSP on its own site is the proof JP can point to in a group.

### c. JP only (keep to these four)

| Task | When | Done when |
|---|---|---|
| Send the Collingwood email (Claude drafts) | by Sun 8 Nov | sent; reply logged in the 📝 SEO change log |
| Ask 3 named customers you know from the groups for an honest Capterra or G2 review; no incentives (DMCC Act 2024) | by Sun 15 Nov, again week 4 | 5 new real reviews by 13 Dec |
| Use the tagged answer-page links from the analysis (section 3) in every group post | every post | `utm_medium=group` signups appear in the Monday report |
| Keep a note of group questions, exact wording; paste into the Monday session | weekly | 2 FAQ batches shipped (weeks 2 and 5) |

## Housekeeping (no new issues)

- App #2027 (hero form drops fbclid): the marketing-site half shipped in #53. Check and close.
- App #2113: merged in #2138. Close once the growth report shows "found via".
- App #2101 (tag social posts with UTMs) overlaps JP's link habit above; review at the Monday session.

## Not filed (below the bar)

- Indexable school booking pages with LocalBusiness schema: no evidence learners search for them.
- GA4 cross-domain linking for `onboarding_complete`: the app's own attribution already answers it.
- "Powered by DriveSchoolPro" links on pupil portal and emails: same root domain or not crawlable, no SEO value.
- /blog/other-road-users/ not indexed: learner content, left alone per the Nov plan.
- A referral "recommend us" link in the app: no customer has asked for one; revisit if the "found via" answers show "recommended by another instructor".

---

## Runner-ready issues

Drafts only: not filed, not labelled. D1 to D3 are for the runner (app repo). D4 and D5 are marketing-site work for attended sessions; they are written as issues so they can be filed in `leavereview/Driveschoolpro.com` and tracked, but the runner does not pick them up.

**Before filing D1 and D2:** pull from `reporting_ro` the number of real schools with `onlineBookingEnabled` and with `widgetEnabled`. If none has online booking on, hold D1 and D2 until JP's week-3 message gets one school to turn it on. (PostHog cannot answer this: it records almost no `$pageview` events on the app.)

### D1. Public booking page: let pupils book a school's lessons from a plain link, without an iframe or login

- **Target repo:** `leavereview/driveschoolpro` · **Size:** M · **Week:** 2
- **Who hits it:** a school owner who wants a "Book lessons" link on their own website, Facebook page or Google Business Profile, and the learner who clicks it.
- **Evidence:** today the only no-login booking flow is `/embed/book/[businessSlug]`, which needs `widget.js` and an iframe; the "booking link" in Settings → Booking widget is the portal *login* page (`booking-portal-client.tsx:403`), so a learner must register before booking. GSC: buyer terms sit at positions 25 to 42 ("driving school booking software" 249 impr at 42), which the 2 Nov analysis puts down to authority (DR 6 vs 42 to 49); customer-site links are action 11, rated High.
- **Cost of not fixing:** money: schools on website builders that block scripts, and every Google profile or Facebook page, cannot send learners straight to booking, and DriveSchoolPro gets no plain links from customer sites.

**Body**

Add a full-page, public booking page at `/book/[businessSlug]` that runs the same booking wizard as `/embed/book/[businessSlug]`.

- Reuse the wizard from `src/app/embed/book/[businessSlug]/page.tsx`: move it into a shared component, render it from both routes. No second copy of the booking logic.
- The page calls the public booking API with a new `context=page` (not `widget`). It is gated by `onlineBookingEnabled` only, as the API comment in `src/app/api/public/book/[businessSlug]/route.ts` already describes for the standalone portal. `widgetEnabled` does not apply to it.
- `postToParent` must do nothing when the page is not in an iframe (it already posts nothing without a parent origin; add a test).
- Page chrome: school logo and name at the top, the wizard, and a small footer: "Online booking by DriveSchoolPro", a normal link to `https://driveschoolpro.com/?utm_source=booking-page&utm_medium=referral&utm_campaign=book-link` (brand anchor only).
- Metadata: `robots: { index: false, follow: true }`, title "Book driving lessons with {school name}".
- `/book/manage/[managementToken]` already exists; check the new route does not clash with it.
- Unknown slug or booking switched off: the existing friendly "online booking is not available" state, HTTP 404.

**Acceptance criteria**
- With online booking on and the widget off, `/book/{slug}` loads, shows lesson types, dates and slots, and creates a booking end to end (UAT), including the card-payment step when the school requires payment.
- With online booking off, `/book/{slug}` returns the "not available" state with 404.
- `/embed/book/{slug}` behaves exactly as before (existing E2E passes; the widget still sends `context=widget`).
- Page source contains the footer link with brand anchor text; `<meta name="robots" content="noindex, follow">`.
- No booking logic is duplicated between the two routes.

**Files likely touched:** `src/app/book/[businessSlug]/page.tsx` (new), `src/app/book/layout.tsx`, `src/app/embed/book/[businessSlug]/page.tsx` (extract shared component), `src/app/embed/book/[businessSlug]/post-to-parent.ts`, `src/app/api/public/book/[businessSlug]/route.ts` and sibling `dates` / `slots` / `create` routes (accept `context=page`), tests.

### D2. Settings → Booking widget: a "Book lessons online" link and plain-HTML button schools can copy

- **Target repo:** `leavereview/driveschoolpro` · **Size:** S · **Week:** 2 (after D1)
- **Who hits it:** a school owner setting up online booking in Settings who wants learners to book from their website, Google Business Profile or Facebook page.
- **Evidence:** Settings offers only the JavaScript widget snippet (its one crawlable link sits inside `<noscript>`) and the portal login link (`booking-portal-client.tsx:403-406`); there is no link to a booking page and no snippet that works where scripts are blocked. Same authority evidence as D1 (DR 6 vs 42 to 49; buyer terms at 25 to 42).
- **Cost of not fixing:** money: D1 is worthless if owners cannot find the link; without a copyable button, schools on script-blocking builders cannot offer online booking at all.

**Body**

In `src/app/(dashboard)/settings/booking-widget/booking-portal-client.tsx`, add a "Your booking page" card above the widget snippet, shown when online booking is on:

1. The URL `https://app.driveschoolpro.com/book/{slug}` with the existing `ShareableLink` / `CopyButton`.
2. "Add a button to your website" with this copyable snippet (no script, inline styles, school's accent colour):
   ```html
   <a href="https://app.driveschoolpro.com/book/{slug}" style="…">Book lessons online</a>
   ```
3. Three one-line tips: Google Business Profile (Bookings / Website link), Facebook page ("Book now" button), Instagram bio. Plain text, no screenshots.
4. When online booking is off: one line saying the link works once online booking is switched on, with the toggle's anchor.

Keep the existing widget and portal-link cards as they are. Use `APP_BASE_URL`, not a hard-coded host.

**Acceptance criteria**
- With online booking on, the card shows the right URL for the school's slug; both copy buttons copy the exact text.
- After a slug change, the card shows the new URL (the existing slug-change warning already covers old links).
- With online booking off, no URL is shown and the hint links to the toggle.
- Pasting the button snippet into a plain HTML file opens `/book/{slug}` (D1).

**Files likely touched:** `src/app/(dashboard)/settings/booking-widget/booking-portal-client.tsx`, possibly a small `BookingLinkCard.tsx` next to it, a unit test for the snippet builder.

### D3. Booking widget footer: brand-only anchor, direct URL and a tracking tag

- **Target repo:** `leavereview/driveschoolpro` · **Size:** S · **Week:** 2
- **Who hits it:** every school that has the booking widget on its website (each page view renders the footer link), and DriveSchoolPro's own Google rankings.
- **Evidence:** repro through the normal UI: embed the widget (`public/embed/test.html`); the footer link uses one of four rotating keyword anchors ("driving school software", "online lesson booking", "driving instructor software" or "DriveSchoolPro", `public/embed/widget.js:119-123`). Google's spam policies list "keyword-rich … links embedded in widgets that are distributed across various sites" as a link scheme. The link also points to `/driving-school-software`, which 301s to the homepage, and carries no tag, so signups from it land as "(direct / unknown)" (4 of 6 signups in the week to 1 Nov).
- **Cost of not fixing:** money: a link-scheme manual action would hit all organic traffic to driveschoolpro.com (21 Google organic sessions and the start-a-school cluster, 4,337 impressions a quarter); and widget-driven signups stay invisible.

**Body**

In `public/embed/widget.js`:
- Remove `ANCHORS` and `hashIdx`; the anchor is always "DriveSchoolPro" ("Powered by DriveSchoolPro").
- `href` becomes `https://driveschoolpro.com/?utm_source=booking-widget&utm_medium=referral&utm_campaign=powered-by`.
- Add `rel="nofollow noopener"`; drop the keyword `title` attribute.
- In the Settings snippet's `<noscript>` link (`booking-portal-client.tsx:406`), use the same URL, anchor and rel.
- Bump the widget's cache-busting version if there is one, so schools get the new footer.

**Acceptance criteria**
- `public/embed/test.html` shows "Powered by DriveSchoolPro" for any `data-business` value.
- The link goes straight to `https://driveschoolpro.com/?utm_source=booking-widget…` with no redirect, and has `rel="nofollow noopener"`.
- A signup that starts from that link records `utm_source=booking-widget` on the organisation (#2022 attribution columns).
- No other widget behaviour changes (widget E2E passes).

**Files likely touched:** `public/embed/widget.js`, `src/app/(dashboard)/settings/booking-widget/booking-portal-client.tsx`, widget E2E/unit test.

### D4. Payments page Google won't index: rewrite and merge into one UK answer page

- **Target repo:** `leavereview/Driveschoolpro.com` (attended session, not the runner) · **Size:** M · **Week:** 1
- **Who hits it:** a UK instructor asking Google or ChatGPT how to take lesson payments online.
- **Evidence:** box URL Inspection (2 Nov): /blog/driving-school-payment-processing/ "Crawled - currently not indexed". AI panel (Nov): "taking lesson payments online" — 0 of 4 engines name DriveSchoolPro.
- **Cost of not fixing:** money: a buyer question where nobody names us, and a 2,000-word page earning nothing.

**Body**
- Decide by content overlap: either merge the post into /features/getting-paid/ (301 the post) or rewrite the post as the UK answer page and link it from /features/getting-paid/. Recommendation: rewrite, because the feature page is product-led and the question is "how do I", not "which tool".
- Rewrite for UK instructors: card in the pupil portal, bank transfer, lesson blocks, Stripe fees in plain numbers (from Stripe's UK pricing page, dated), chasing unpaid lessons. Lead with a 2-sentence answer; 5 FAQs with FAQPage schema; honest about what DSP does not do.
- Title and meta aimed at "take driving lesson payments online" / "driving school payment app".
- Add one SEO change-log row; request indexing via URL Inspection.

**Acceptance criteria**
- Page indexed by 16 Nov (URL Inspection), or the 301 target indexed.
- FAQPage schema validates (Rich Results Test).
- Claims checked against the app (no feature claimed that does not exist; see #57).

**Files likely touched:** `src/content/blog/driving-school-payment-processing.md`, `src/pages/features/getting-paid.astro`, `vercel.json` (only if merged).

### D5. Compare pages: answer "alternatives to MyDriveTime / Total Drive / GoRoadie"

- **Target repo:** `leavereview/Driveschoolpro.com` (attended session, not the runner) · **Size:** S · **Week:** 1
- **Who hits it:** an instructor unhappy with their current app who searches or asks AI for alternatives.
- **Evidence:** web-search re-run (2 Nov): "Alternatives to MyDriveTime" returned nothing relevant; "Alternatives to Total Drive" named Zutobi Instructor, DrivingSchoolSoftware.com and Drive Scout; "Alternatives to GoRoadie Pro" named MyDriveTime and Drivi. None named us. GSC: "my drive time" 46 impressions at 13.1 on /compare/my-drive-time/. Only total-drive-vs-mydrivetime uses the word "alternative" today.
- **Cost of not fixing:** money: switchers are the warmest buyers, and the engines hand them to other apps.

**Body**
- On /compare/my-drive-time/, /compare/total-drive/ and /compare/goroadie/: add an "Alternatives to {app}" section near the top (3 to 5 honest options including DSP, one line each, dated "checked Nov 2026") and one FAQ "What is a good alternative to {app}?" with FAQPage schema.
- Adjust title/meta to include "alternative" where it fits without losing the "vs" match (e.g. "MyDriveTime vs DriveSchoolPro, and alternatives (UK, 2026)").
- No new URLs.

**Acceptance criteria**
- Three pages updated; FAQPage schema validates; competitor facts sourced from their public sites, dated.
- SEO change-log rows added; checked at the 16 Nov panel and 14 Dec GSC.

**Files likely touched:** `src/pages/compare/my-drive-time.astro`, `src/pages/compare/total-drive.astro`, `src/pages/compare/goroadie.astro`.
