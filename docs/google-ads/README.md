# Google Ads build — Search – UK – Start (account 852-626-4049)

Source of truth: `google-ads/search-uk-start.ts`. Regenerate: `node scripts/build-ads-csv.ts`.

## 1. Campaign (Ads Editor → Campaigns → Add)
Name `Search – UK – Start` · Type Search · Networks: Google Search only (untick Search partners, Display) ·
Budget £12/day · Bid strategy Maximise clicks, max CPC limit £2.50 · Locations: United Kingdom,
"Presence: people in or regularly in" · Languages English · Ad schedule all day.

## 2. Import
Account → Import → From file: `keywords.csv`, then `ads.csv`. Review the preview, fix any column
Ads Editor doesn't recognise, then Keep.

## 3. Shared negative list
Tools → Shared library → Negative keyword lists → `DSP exclusions` → paste `negatives.txt` (phrase) →
apply to `Search – UK – Start` (and any future campaign).

## 4. Assets (campaign level)
Import `callouts.csv` and `sitelinks.csv` (Ads Editor → Import → From file; map columns if prompted).
Structured snippet "Features": Diary, DVSA progress, Payments, Reminders, Pupil portal.
Sitelinks point at the four `/start` variants (distinct URLs, all squeeze pages) — so a sitelink
click still lands on a signup form. Replaces the old "no sitelinks" rule: no navigation on the page
is not a reason to give up the extra ad space.

## 5. Audiences
Observation: `R1 Start visitors 30d`, `R2 Started not onboarded 14d` (+30% bid adjustment).
Exclusion: `X Registered 540d`.

## 6. Post → check every ad is "Eligible" within 1 business day.

## Display remarketing — final URLs per ad group
| Ad group | Final URL | Why |
|---|---|---|
| Display – R1 Visitors | `https://driveschoolpro.com/start/tour/?utm_source=google&utm_medium=display&utm_campaign=remarketing-uk&utm_content=r1` | Never submitted the form. `/start/tour/` is demo-first (two click-through Arcade demos) — a repeat of the page they left converts poorly. Ad copy: "See it working before you sign up". |
| Display – R2 Started not onboarded | `https://app.driveschoolpro.com/signup?utm_source=google&utm_medium=display&utm_campaign=remarketing-uk&utm_content=r2` | They already gave their school name. `/signup` routes every R2 case correctly: no account → the form; signed in without an org → the form; signed in with an unfinished org → `/today` → `/onboarding`; signed out with an account → "Already have an account? Sign in". **Not** `/onboarding` — that sends anyone without an account to a login page they can't use. |

R2 ad copy should say "Finish setting up your school", not "Get started".

## Applied in the account — 2026-10-05
- Search: new RSAs imported; the three previous RSAs ("Nothing to Download", "under a minute") **paused**, not removed.
- Sitelinks (4) + callouts imported. New callouts that only duplicated older ones by capitalisation
  were removed; the older approved copies kept ("No card required", "Tracks all 27 DVSA skills",
  "Built for UK instructors"). New: "Never Auto-Charged", "iPhone and Android App".
- Display R1: final URL → `/start/tour/…utm_content=r1`; headline "Set Up in Under a Minute" →
  "See It Working First"; description → "…set up in about two minutes…"; added "Click through the
  diary and DVSA progress tracking yourself, then set up your school". Resubmitted (was disapproved
  "Destination not working").
- Display R2: final URL → `app.driveschoolpro.com/signup…utm_content=r2`; description "Finish in
  under a minute" → "Finish in a couple of minutes".
- Display campaign budget is **£3/day** in the account (plan said £2) — reconcile before enabling.
- Ad-group default bids (Core shows £0.01 in Ads Editor) are ignored under Maximise Clicks;
  set them to £2.50 before any switch to Manual CPC.

## Testing at this volume
At ~£12/day (≈5–10 clicks) a landing-page A/B split cannot reach significance for months. Ship
changes as releases and compare `signup_start` per session (secondary conversion — higher volume)
for 2–3 weeks before vs after, by `utm_content`. Use Google Ads Experiments only once
`onboarding_complete` reaches ~15+/month.

Funnel without app changes (GA4 Explore → Funnel, open funnel, segment `utm_campaign = search-uk-start`):
1. `page_view` page_location contains `driveschoolpro.com/start` → 2. `signup_start` →
3. `page_view` page_location contains `app.driveschoolpro.com/signup` →
4. `page_view` page_location contains `app.driveschoolpro.com/onboarding` (account created) →
5. `onboarding_complete`. The biggest drop tells you whether to work on the page or the app.

## Bid switch rule
Maximise conversions (no target) once ≥ 15 `onboarding_complete` in trailing 30 days. tCPA only after ≥ 30.

## Offer change checklist
Ad copy says "Free during early access" — if early access ends, edit the headlines/descriptions in
`google-ads/search-uk-start.ts`, regenerate, re-import.
