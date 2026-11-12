# Monthly SEO review: 12 Nov 2026 (issue #23)

Interim review, written early. The plan puts the full #23 review on 1 Dec, with the 14 Dec GSC check after it. This one gives a 28-day read now, while the 2 to 10 Nov changes are only 2 to 10 days old. Treat the conclusions as provisional.

## Sources and limits

- **Search Console:** `driveschoolpro.com` property, read with the `tools/gsc-client` service account (`front-end-site-gsc-connection@petcare-481007.iam.gserviceaccount.com`). Auth worked. Script run ad hoc from the scratchpad; the client has no "compare two windows" command.
- **Windows:** current = 12 Oct to 9 Nov (data lags about 3 days). Previous = 14 Sep to 11 Oct. The 2 Nov baseline in the plan used UK only, 3 to 31 Oct, so it is not the same window as either column below.
- **GA4:** property 529247825 (site and app together, consented sessions only). Current = 15 Oct to 11 Nov, previous = 17 Sep to 14 Oct.
- **Not done:** URL Inspection (indexed or not) was not run. "Indexed" below means "got impressions in Search Console", which proves a page is indexed but cannot show the ones that are not.
- Counts are small (tens of clicks, a few sessions per page). Differences of a few clicks are noise.

## 1. Search Console, last 28 days vs previous 28

| | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| All countries, current | 67 | 14,409 | 0.46% | 16.5 |
| All countries, previous | 75 | 11,997 | 0.63% | 10.5 |
| **UK, current** | **45** | **7,548** | **0.60%** | **16.6** |
| UK, previous | 53 | 4,609 | 1.15% | 10.9 |
| UK, plan baseline (3 to 31 Oct) | 43 | 6,187 | 0.69% | 14.7 |

**Read-out:** impressions are up 64% in the UK, clicks are flat to slightly down. Average position got worse (10.9 to 16.6) because the site is now shown for many more queries, mostly at positions 20 to 50 where nobody clicks. That is a widening footprint, not a loss at the top. Daily UK impressions rose from about 140 (12 Oct) to about 400 (8 to 9 Nov). The click target for 13 Dec (60 clicks, CTR 0.9%) is not on track yet: 45 clicks in 28 days.

### Top UK queries (28 days, by impressions; previous window in brackets)

| Query | Clicks | Impr | Pos |
|---|---|---|---|
| driving school software | 3 | 160 | 14.7 (21.5) |
| driving school management software | 0 | 108 | 25.7 (20.1) |
| driving instructor software | 0 | 87 | 30.1 (30.0) |
| driving school app | 0 | 86 | 37.0 (45.0) |
| how much does it cost to learn to drive | 0 | 84 | 15.7 (4.2) |
| driving school crm | 0 | 80 | 18.2 (22.7) |
| adi diary app | 0 | 79 | 22.3 (23.9) |
| driving instructor accountant | 0 | 70 | 34.8 (31.6) |
| driving school insurance | 0 | 70 | 20.6 (12.0) |
| my drive time | 0 | 69 | 10.8 (15.8) |
| driving instructor software uk | 0 | 66 | 16.5 (29.9) |
| driving instructor scheduling software | 0 | 65 | 26.2 (39.9) |
| driving school booking software | 0 | 65 | 24.7 (26.1) |

### Top UK pages

| Page | Clicks | Impr | Pos (previous) |
|---|---|---|---|
| /blog/best-driving-school-software/ | 0 | 916 | 36.5 (21.0) |
| / | 3 | 856 | 25.8 (29.8) |
| /tools/cost-calculator/ | 0 | 620 | 17.7 (2.9) |
| /blog/driving-school-insurance-guide/ | 0 | 357 | 17.8 |
| /driving-instructor-accounting-software/ | 0 | 263 | 37.6 |
| /driving-school-software-uk/ | 0 | 220 | 66.7 (noindexed 4 Nov, still shows) |
| /driving-school-scheduling-software/ | 0 | 186 | 46.7 |
| /driving-instructor-software/ | 0 | 169 | 53.6 |

Only two pages got clicks of note: the homepage (3) and the Bristol cost-calculator page (1). Nothing from the compare, features or blog buyer pages has produced a click yet.

### New pages that now have impressions (not in the previous window)

/pricing/ (84), /compare/ (77), /blog/making-tax-digital-driving-instructors/ (73), /compare/total-drive-vs-mydrivetime/ (62), /driving-instructor-booking-system/ (61), /blog/mtd-record-keeping-driving-instructors/ (51), /compare/goroadie/ (46), /compare/adi-network/ (29), /blog/mtd-timeline-2027-2028-driving-instructors/ (27), /driving-instructor-diary-app/ (15), /features/online-booking/ (13), /compare/lessonbuddy/ (8), plus the new feature pages, cost-calculator city pages and /compare/driving-school-manager/. Pages with impressions rose from 103 to 118 across the site (all countries). The plan's 114 of 119 indexed baseline cannot be re-checked without URL Inspection; do that on 14 Dec.

## 2. GA4, last 28 days vs previous 28

| | Current | Previous |
|---|---|---|
| Sessions | 239 | 184 |
| Active users | 132 | 51 |
| Key events | 11 | 8 |
| onboarding_complete | 6 | 4 |
| signup_start | 5 | 5 |

Sessions by channel (current vs previous): Organic Social 82 vs 0, Direct 61 vs 118, Organic Search 50 vs 28, Referral 30 vs 3, AI Assistant 8 vs 1, Paid Search 8 vs 16, Organic Shopping 0 vs 16.

**Read-out:** the Facebook group posting is the biggest new source (82 sessions from nothing). Organic search sessions rose from 28 to 50, and the homepage is most of it (24 organic landings, 1 key event). AI Assistant sessions are small but up from 1 to 8. The property mixes site and app paths (/login, /calendar, /today), so the totals overstate marketing-site traffic. The 28-day windows differ from GSC by 3 days.

## 3. What the November changes did

| Change (date) | Effect so far |
|---|---|
| Best-software refresh (2 Nov, #56) and compare "alternatives" wording (3 Nov, #61) | Best-software page impressions went from about 20 a day to about 90 from 28 Oct, then to 100+ a day. Position on the page moved from about 40 to about 25 on those days, then drifted back to 28 to 34. Still 0 clicks. The rise began 5 days before the refresh, so the refresh did not cause it. |
| Compare pages (#45 to #51, 3 Nov, 9 to 10 Nov fact fixes) | /compare/ and four compare pages are indexed and get 29 to 99 impressions each. "my drive time" improved from position 15.8 to 10.8 (plan target 8, baseline 13.1). 0 clicks. |
| Homepage UK/CRM FAQs (#46) | "driving school software" improved from 21.5 to 14.7 (plan baseline 17.8, target 12). 3 clicks. "driving school crm" 22.7 to 18.2. |
| Diary and booking-system pages (#59) | Both now have impressions (61 and 15). "adi diary app" is at 22.3 (79 impressions). |
| Noindex on /driving-school-software-uk/ (4 Nov) and sitemap removal | Page still shows 220 impressions at position 67. Expected until Google recrawls; check it has dropped out by 14 Dec. |
| IndexNow on deploy (4 Nov), valid JSON-LD (#63) | Not measurable in this data. |

## 4. Target keywords from the 6-week plan

| Target | Baseline | Now | By 13 Dec | Status |
|---|---|---|---|---|
| UK clicks / impr / CTR / pos | 43 / 6,187 / 0.69% / 14.7 | 45 / 7,548 / 0.60% / 16.6 (different window) | 60 clicks, CTR 0.9% | Impressions up, clicks and CTR behind |
| "driving school software" UK position | 17.8 | 14.7 | 12 | Moving the right way |
| "my drive time" UK position | 13.1 | 10.8 | 8 | Moving the right way |
| /blog/starting-driving-school-guide/ CTR | 0.37% at pos 9.7 (90 days) | 0 clicks from 61 impr at pos 14.8 (28 days) | 1.5% | Worse; position slipped from 9.6 to 14.8 |
| Indexed URLs | 114 of 119 | not measured | 117 of 119 | Needs URL Inspection |
| AI panel mentions | 19 of 76 | 26 of 76 (12 Nov, see `2026-11-12-ai-panel-rerun.md`) | 28 | Close |

## 5. Refresh list for /blog/best-driving-school-software/

The post is `src/content/blog/best-driving-school-software.md` (about 5,200 words, `updatedDate` 2026-11-02, last touched by the 9 Nov compare fact fixes). **No edits made.** It was refreshed ten days ago, the compare pages are being edited in parallel, and every competitor fact in it must be re-checked on the day it changes, which this session could not do for 12 platforms. Proposed edits, with evidence:

1. **Check what "drivethrul alternatives" and "driving logic alternatives" are before touching anything.** They are the post's top queries (156 and 42 impressions, positions 7.4 and 7.7, 0 clicks). The post names neither. They look like misspellings or variants of a product. Look up the real product. If it is a genuine UK driving-school competitor, add it to the table and a short review with same-day facts; if not, ignore it.
2. **Answer-first booking section.** "best booking software for driving instructors" (36 impr, pos 38.8), "booking app for driving schools" (36, pos 30.8), "driving school booking software" (63, pos 28.6). Add one H2 for booking software with a three-line answer first, linking /driving-instructor-booking-system/ and /features/online-booking/.
3. **App-focused section.** "apps for driving schools" (pos 69), "app for driving instructors" (pos 64). The post covers apps only inside the platform reviews. A short "best apps for driving instructors" H2 (phone-first, same-day app store ratings) would match them, and the panel's first question ("best app for a driving instructor") is one where no engine names us.
4. **Head term.** "best driving school software" does not appear in the post's top 20 queries at all, so check it directly in Search Console before deciding on a title change. Do not change the title yet; it was set on 2 Nov.
5. **Scheduling and CRM wording.** "driving instructor scheduling software" (47 impr, pos 31.8) and "crm for driving schools" (20, pos 27.9). The post already has a CRM section. Add the exact phrase "scheduling software" to one subheading.
6. **Dates.** Change `updatedDate` only when facts change. Re-check prices before the 16 Nov panel.
7. **Click-through.** 916 impressions and 0 clicks at an average position of 36 is a ranking problem, not a snippet problem. No title or description change is justified until the page ranks on page 1 for something.

## 6. Recommended next actions

1. On 1 Dec, rerun this review with the same windows plus URL Inspection on the new pages.
2. Run item 1 above (identify the "drivethrul" queries) before any post edit.
3. Re-check /blog/starting-driving-school-guide/: position fell from 9.6 to 14.8. Look for what outranks it before rewriting.
4. Confirm /driving-school-software-uk/ drops out after the noindex.
5. Reviews, roundups and links from customer sites remain the lever for the 25 to 50 position terms (plan section "Where we start").

## 7. SEO change-log entry (suggested; not logged from here)

- **What changed:** 12 Nov interim monthly review (docs only, no site change): GSC and GA4 28-day comparison, panel re-run, best-software refresh list.
- **Category:** analytics.
- **Reason:** issue #23, measure the November changes before the 1 Dec review.
- **Expected impact:** none directly; sets the 12 Nov reference point (UK 45 clicks, 7,548 impressions, position 16.6; panel 26 of 76).
- **Timeline:** compare on 1 Dec and 14 Dec.
