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
Callouts: No card required · Tracks all 27 DVSA skills · Works on your phone · Built for UK instructors.
Structured snippet "Features": Diary, DVSA progress, Payments, Reminders, Pupil portal.
No sitelinks — the landing pages have no navigation.

## 5. Audiences
Observation: `R1 Start visitors 30d`, `R2 Started not onboarded 14d` (+30% bid adjustment).
Exclusion: `X Registered 540d`.

## 6. Post → check every ad is "Eligible" within 1 business day.

## Bid switch rule
Maximise conversions (no target) once ≥ 15 `onboarding_complete` in trailing 30 days. tCPA only after ≥ 30.

## Offer change checklist
Ad copy says "Free during early access" — if early access ends, edit the headlines/descriptions in
`google-ads/search-uk-start.ts`, regenerate, re-import.
