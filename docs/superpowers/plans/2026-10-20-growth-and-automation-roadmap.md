# Growth & Automation Roadmap (JOHN POWELL LTD, DriveSchoolPro first)

> **For agentic workers:** this is a programme plan covering several repos. Each workstream gets its own task-level plan (TDD, checkbox steps) in the repo it changes, written when that workstream starts. Use superpowers:writing-plans for those, then superpowers:subagent-driven-development or superpowers:executing-plans to build them.

**Goal:** Turn signups into active, then paying, DriveSchoolPro customers by 1 April 2027, and cut John's weekly admin, without John posting from personal accounts or anything being sent without his approval.

**Architecture:** App changes go in `~/Projects-code/driveschoolpro` (Next.js, Prisma/Neon, Resend, PostHog, Stripe, Vercel crons, `src/lib/slack/client.ts`). Marketing changes go in `~/Projects-code/Front-end-sites/mydriveschool.software` (Astro). Agent jobs go in `leavereview/agentbox` (`~/social-inbox` pattern: cron → headless claude with read-only tools → Slack #jp-ltd + email). Every app change is a PR with tests; every site change goes through `./deploy.sh`.

**Tech stack:** Next.js + Prisma (app), Astro 5 (site), Resend, PostHog, Stripe, Google Ads API, GSC/GA4 (`tools/gsc-client`), Slack Web API (bot token) and webhooks, agentbox cron + `claude -p`.

**Spec:** Trello card "📄 Growth & time-saving research (20 Oct)" (Reference docs) and the research summary in the 20 Oct session.

## Global Constraints
- Nothing outbound is sent for John without approval: agents draft (Slack, Mail › Drafts, Metricool drafts). Product emails the app already sends (onboarding, reminders) stay as they are.
- No posting from John's personal accounts (feedback memory, 20 Oct 2026).
- UK PECR: most ADIs are sole traders, so they count as individuals. Service and how-to emails are fine; promotional emails need soft opt-in plus an unsubscribe link in every email. No cold email. Referral is share-link only, never "email your friends".
- DMCC Act 2024 / CMA208: invite every customer to review, never filter by satisfaction or NPS, never stop/start invitations, incentives must not depend on the rating. No invented reviews or testimonials.
- Prices only from `src/config/offer.ts` (site) / the app's plan config: Free (1 instructor, 60 lessons/month), Solo £22, School £22 + £10, founding £15 (School £15 + £8) for cards added by 1 Mar 2027, no VAT.
- Site copy must pass `verify-claims.js`; never claim features that aren't live (e.g. no CSV export until Workstream F ships).
- Log every SEO-related site change with `tools/gsc-client` `--log-change`.

## Review Focus
1. Attribution for users who decline cookies: the gclid must still be stored on the account (first-party, from the URL), and only the Ads upload is consent-gated.
2. Lifecycle emails to an account that has already activated, paid or been wound down must not send (re-check at send time, not at scheduling time).
3. The free-period-end campaign must never tell a user they will be charged automatically: no card = move to Free.
4. Going-quiet alerts must exclude demo/sample data and accounts under 7 days old, so the list is short enough to act on.
5. Weekly digest numbers must say "not delivered" loudly (Sentry) rather than post zeros when an API key or channel is missing. This is already the pattern in `api/cron/weekly-metrics`.

---

## What already exists (code review, 20 Oct 2026)
- **Slack alerts (DSP app):** `src/lib/slack/client.ts` `postSlackMessage(blocks, text, channelId)` posts with `SLACK_BOT_TOKEN` via `chat.postMessage`. Callers:
  - `src/lib/actions/signup.ts:242`: new registration → `SLACK_ALERT_CHANNEL_ID`
  - `src/lib/services/stripe/webhooks.ts:421,561,654`: subscribe/unsubscribe → `SLACK_ALERT_CHANNEL_ID`
  - `src/app/api/health/route.ts:199`: health status → `SLACK_ALERT_CHANNEL_ID`
  - `src/app/api/webhooks/sentry/route.ts`: errors → `SLACK_SYSTEM_CHANNEL_ID` (falls back to alert channel)
  - `src/app/api/cron/weekly-metrics/route.ts`: **Monday 07:00 UTC digest** (`vercel.json`) → `SLACK_METRICS_CHANNEL_ID` (falls back to alert channel). It reports total orgs, signups (30d), activated (`isActivated`: ≥1 real student AND ≥1 real lesson), returned, weekly active, daily-habit, forward diary, median hours to first lesson, and new/active/newly-activated school names, with week-on-week deltas.
- **BeltManager:** `src/lib/services/ops-alerts.ts` (`postOpsAlert`) and signup alerts DM the operator (`docs/architecture/services/signup-alerts.md`).
- **Onboarding emails (DSP):** `src/lib/services/email/onboarding-emails.ts` sends WELCOME (0h), SET_AVAILABILITY (+24h, skipped if hours are set), ADD_STUDENT (+3d, skipped if students and lessons exist), FEATURE_DISCOVERY (+7d), CHECK_IN (+10d), AI-personalised, via `api/cron/onboarding-sequence` daily 09:00 UTC.
- **Not built:** gclid/UTM capture at signup (no `gclid`/`utm` in `src` or `prisma`), Ads conversion upload, going-quiet alerts, a free-period-end campaign, a CSV/income export, referral codes.
- **Review wording:** `verify-claims.js` already reflects the automatic review request on a practical pass (the memory note saying "nudge" is out of date).

## Sequence

| Order | Workstream | Repo | Target | Effort |
|---|---|---|---|---|
| 1 | A. Signup attribution + Ads conversions | app | 30 Oct | 4–6h |
| 2 | B. Weekly digest: add business numbers + daily spend alert | app + agentbox | 6 Nov | 4–6h |
| 3 | C. "We'll set up your diary" service (banner + intake) | site + app | 6 Nov | 3–4h |
| 4 | D. Activation emails: measure and tighten the existing sequence | app | 13 Nov | 4–6h |
| 5 | E. Going-quiet alerts with drafted check-ins | app + agentbox | 20 Nov | 3–4h |
| 6 | F. Income CSV export + MTD content | app + site | 4 Dec (export), MTD card 27 Nov | 4h + content |
| 7 | G. Free-period-end campaign | app + site | emails ready by 8 Jan; first send 30 Jan (60 days out) | 8h |
| 8 | H. Partner offers, then referrals | site + Stripe | partners now (existing card); referrals from 1 Apr | 4h |
| 9 | I. YouTube how-to tutorials | site + Metricool | from Dec (existing card) | ~1h each |
| — | J. Review-request compliance check | app | with D | 1h |

---

## A. Signup attribution + Ads conversions (app)
**Outcome:** every new Organization stores where it came from; Google Ads receives a conversion for signup and for activation.
**Files:**
- Modify: `prisma/schema.prisma` (Organization: `signupUtmSource`, `signupUtmMedium`, `signupUtmCampaign`, `signupUtmContent`, `signupGclid`, `signupGbraid`, `signupWbraid`, `signupReferrer`, `signupLandingPage`, all `String?`) + migration.
- Create: `src/lib/signup/attribution.ts`: `parseAttribution(params: URLSearchParams, referrer?: string): SignupAttribution` (whitelists the keys above plus `msclkid`, `fbclid`, `dsp_ref`, `dsp_page`; trims to 255 chars; drops empties).
- Modify: the signup form (`signup-form.tsx`) to pass the attribution through, and `src/lib/actions/signup.ts` `createAccount` to persist it. Include `utm_source` in the existing Slack registration alert.
- Create: `src/lib/services/google-ads/conversions.ts`: `uploadConversion(kind: 'signup' | 'activated', org): Promise<'sent' | 'skipped-no-click' | 'skipped-no-consent' | 'disabled'>` using enhanced conversions for leads (hashed email) plus gclid. Off unless `GOOGLE_ADS_CONVERSIONS_ENABLED=true`. **Check first** whether uploads must use the Data Manager API (reported change 15 Jun 2026).
- Activation trigger: the first time `isActivated` becomes true (hook it where the first real lesson is created, or a daily sweep cron `api/cron/ads-conversions`).
**Tests (first):** `parseAttribution` keeps whitelisted keys and drops the rest; `createAccount` persists attribution; `uploadConversion` returns `skipped-no-consent` when `dsp_consent !== 'all'` and never throws; the activation upload fires once per org.
**Acceptance:** a test signup from `/driving-instructor-software?gclid=TEST&utm_source=google` shows those values in Neon and in the Slack alert; Google Ads shows the conversion action receiving data within 24h of the first real ad signup.
**Needs John:** a Google Ads developer token / OAuth for the API (or approval to use offline CSV import through agentbox as a stopgap).

## B. Weekly digest, extended (app + agentbox)
**Outcome:** the Monday Slack digest also shows business numbers, and there's a daily watchdog.
- **App, keep as is:** product usage (already there). Add MRR and paying-customer count from Stripe (`src/lib/queries/platform-metrics.ts` → new `getRevenueMetrics(now)`), plus signups by `signupUtmSource` once A ships.
- **Agentbox:** new `~/social-inbox`-style job `weekly-growth.sh` (Monday 08:15): GSC clicks/impressions/top queries per site (reuse `tools/gsc-client`), GA4 sessions by source, Google Ads spend and cost per signup, Metricool follower/reach per network, and BeltManager/MyTattoo signup counts. Posts one message to #jp-ltd. Read-only keys only.
- **Daily watchdog (agentbox, 08:05):** alert only if Ads spent > £20 yesterday with 0 signups, or there were 0 signups for 7 days while Ads is live, or a site's sitemap count drops (site monitor already covers this; link to it).
- **Channel:** set `SLACK_METRICS_CHANNEL_ID` to #jp-ltd if John wants everything in one place (today it falls back to `SLACK_ALERT_CHANNEL_ID`). **John to confirm which channel the existing alerts go to.**
**Tests:** `getRevenueMetrics` against Stripe fixtures; the digest builder renders "not available" (not 0) when a source fails; `weekly-growth.sh --dry-run` prints without posting.

## C. "We'll set up your diary" service (site + app)
**Outcome:** new users can hand over their pupil list and get set up for free; removes the "no bulk import" stall.
- **Site:** a dismissible banner/callout component `SetupServiceCallout.astro` ("Moving from a paper diary? Send us your pupil list or a photo of your diary, and we'll set up DriveSchoolPro for you, free.") on the page John chooses (see question), linking to `/setup-help/` (new, noindex) with a short form or `mailto:support@driveschoolpro.com?subject=Set up my diary`.
- **App (optional, higher impact):** the same offer on the dashboard for orgs that aren't activated after 24h, and as a line in the ADD_STUDENT onboarding email.
- **Process:** requests land in the support@ inbox → the daily briefing flags them → Claude prepares the import from the CSV or photo in the local demo and John (or Claude, with John's approval and the customer's written OK) enters it. Pupil data is personal data: the customer's consent goes in the email thread; nothing is kept outside the app.
- **Copy rules:** don't promise a time ("within 1 working day" only if John agrees); verify-claims must pass.

## D. Activation emails: measure and tighten (app)
**Outcome:** the existing 5-email sequence targets activation and stops when it's reached.
- Add a shared `isOrgActivated(orgId)` check at send time to FEATURE_DISCOVERY and CHECK_IN (currently "never skip"), so activated users get a "you're set up, here's what's next" variant instead of setup nudges.
- Add a day-5 email for orgs with students but no lessons ("book their next lesson in 30 seconds").
- PostHog: emit `activated` once (server-side) with `days_since_signup`, and build a funnel: signed_up → added_student → booked_lesson → returned_day_7.
- Promotional lines (pricing, founding offer) only with a working unsubscribe (`api/email/unsubscribe` exists).
**Tests:** skip/variant logic per emailKey with fixtures for activated, partly set up and wound-down orgs.

## E. Going-quiet alerts (app + agentbox)
**Outcome:** John hears about at-risk accounts with a ready-to-send personal email.
- App: `getAtRiskOrgs(now)` returns activated orgs with no lesson created or marked in 7 days, or no login in 14 days, excluding demo data and orgs under 7 days old. Expose it via an authenticated internal endpoint, or include it in the Monday digest.
- Agentbox: the morning briefing adds an "At risk" section and saves a short personal check-in draft per org to Mail › Drafts (same mechanism as `mail.py drafts`). John sends.
- Day-30 one-question survey ("What nearly stopped you using DriveSchoolPro?") as a service email; answers go to support@ and so into the briefing.

## F. Income CSV export + Making Tax Digital (app + site)
- App: Reports › "Export income (CSV)": date, pupil, description, amount, payment method, invoice number, for a date range. Matches common MTD bridging import columns. Owner/admin only.
- Site: once it ships, update the facts page, features and MTD articles (existing MTD cluster card due 27 Nov). Until then, no export claims anywhere.

## G. Free-period-end campaign (app + site)
**Dates:** reminders 30 Jan (60 days), 1 Mar founding-card deadline reminders (existing card: ~17, 24, 30 Mar), 1 Mar (30 days) and 24 Mar (7 days).
- Segments: active (book in the last 14 days) → "lock £15 for 24 months"; inactive → "want us to set it up for you?" (links to C).
- Every email says: no card = you move to the Free plan; nothing is charged unless you choose a paid plan.
- Site: free page and pricing copy for the permanent Free plan before 1 Apr (existing card).
- Needs the app's card capture + plan limits (existing [App] card, due 1 Feb).

## H. Partner offers, then referrals (site + Stripe)
- Now: DIA / MSA GB / ADINJC member offer + PDI trainers (existing card, John sends). Partner landing page `/partners/<slug>/` with a code (founding price extended for members).
- From 1 Apr: "Give a month, get a month" via Stripe coupons, credited when the referred account makes its **first payment**. In-app share link only. Terms page.

## I. YouTube how-to tutorials (site + Metricool)
- Playwright-recorded 2–4 min tutorials from the local demo app (never prod data), titled as the task ("How to send lesson reminders to pupils"), uploaded as drafts via Metricool, embedded with `VideoObject` schema on the matching feature page. Existing card "December dated posts + first 4 YouTube walkthroughs" (due 20 Nov).

## J. Review-request compliance check (app)
- Confirm the practical-pass auto request goes to every pupil and owner who qualifies, with no filtering on satisfaction or NPS, and no pausing. Add a unit test pinning "no sentiment filter".

## Three products
- Same event names in PostHog for all three (signed_up, activated, first_booking, paid).
- Same digest job with a section per product.
- BeltManager and MyTattoo stay on "maintenance with automation" (alerts, monitors, briefing) until DSP's paid conversion is proven.

## Decisions for John
1. Which page gets the setup-service banner (C)?
2. Which Slack channel the app alerts and the Monday digest should use (B): keep the current one or move to #jp-ltd?
3. Google Ads API access (A): create a developer token, or use the CSV upload stopgap?
4. Is a response time OK to promise for the setup service (C)?
