# /start squeeze-page variants + UK paid-search build

**Date:** 2026-10-02
**Status:** Design approved in chat — awaiting written-spec review
**Repos:** marketing (`mydriveschool.software`, branch `feat/start-variants`) · app (`driveschoolpro`, one small consent PR) · Google Ads / GA4 (config, no code)

---

## 1. Intent

UK solo ADIs searching for driving-school software land on a page whose headline repeats
their search, enter their business name above the fold, and the click is credited when they
**finish onboarding**. Registered users stop seeing ads; visitors who didn't sign up are
remarketed.

**Said by JP:** audience solo ADIs; short page plus proof; free/no-card headline angle; no
testimonials (illustrative only — CAP/Ads misrepresentation); three variants; budget
£10–15/day; delete the current ads; focus on main keywords with an exclusion list;
remarketing; stop advertising once registered; app consent PR approved; ad copy says
"Free during early access" (no dates).

**Assumed:** UK only for now (wider later — variants keyed by theme so a market dimension can
be added); English only; `/ads/driving-school-software` stays live but receives no paid
traffic.

**Success:** (1) each variant's field is visible without scrolling on an iPhone 13 and hands
off to `app.driveschoolpro.com/signup` with `org`/`place_id`/tracking params intact;
(2) `onboarding_complete` conversions attributed to the Search campaign in Ads;
(3) audience X (registered) populated and excluded from every campaign.

## 2. Tracking baseline (done 2 Oct 2026)

| Thing | State |
|---|---|
| GA4 | Property **529247825**: streams `G-4HJLDWJ8DR` (driveschoolpro.com), `G-EX4E9M57XG` (app). Both tags cross-domain "Contains `driveschoolpro.com`". Key events `onboarding_complete`, `signup_start`. |
| Google Ads | **852-626-4049**, GBP, London, auto-tagging on, auto-apply off, linked to GA4 (personalised ads on). Tag `AW-18429619595`. |
| Conversions | GA4 imports: `onboarding_complete` **Primary**; `signup_start` **Secondary**. Count One, 90-day click window, data-driven. No direct Ads conversion tag (avoids double counting). |
| Stale | Code comments in `BaseLayout.astro`/`LandingLayout.astro` cite property 517695357 — correct them. |

## 3. Squeeze pages

### 3.1 Units

| Unit | Purpose |
|---|---|
| `src/config/start-variants.ts` | Typed record `core` · `free` · `scheduling`: `path`, `title`, `description`, `h1`, `subhead`, `hero {src, alt, width, height}`, `benefits` (ordered ids), `extraFaq`. No offer dates — offer text interpolated from `OFFER`. |
| `src/components/start/StartPage.astro` | Renders one variant. Props: `variant: StartVariant`. Owns the section order below. |
| `src/pages/start.astro`, `start/free.astro`, `start/scheduling.astro` | One line each: pick variant, render `StartPage` inside `LandingLayout` with `robots="noindex, follow"`. |
| `src/components/start/startFaq.ts` | Shared FAQ entries (reused/condensed from `/ads/driving-school-software`), plus per-variant extra. |
| `BusinessNameCapture.astro` | **Unchanged.** Two instances per page: `start-capture-top`, `start-capture-bottom`. |

### 3.2 Page order (mobile-first, 390px)

1. **Hero** — H1, subhead (includes `OFFER.short` + "no card required"), capture field. Field fully visible above the fold on iPhone 13 (390×664 viewport after browser chrome).
2. **Product shot** — variant hero screenshot (sized `<img>` with explicit width/height; eager in the hero, lazy elsewhere).
3. **Three benefits** — order set per variant, from a fixed pool of verifiable claims (must pass `scripts/verify-claims.js`): diary/booking from your phone · tracks all 27 DVSA driving skills · pupils book and pay online · automatic lesson reminders.
4. **How it works** — 3 steps: enter your school name → confirm your details → add your first pupil.
5. **FAQ** — 4 shared + 1 variant-specific, `<details>` elements, 44px tap targets. FAQPage JSON-LD **omitted** (noindex page; avoids duplicate-content signals with `/ads`).
6. **Repeat capture** — second field + one-line reassurance.

Footer stays LandingLayout's (Privacy/Terms). No nav, no outbound links except those.

### 3.3 Variant copy (draft — final wording reviewed with screenshots)

| | Core `/start` | Free `/start/free` | Scheduling `/start/scheduling` |
|---|---|---|---|
| H1 | Driving school software that runs from your phone | Free driving school software — nothing to download | Lesson scheduling built for driving instructors |
| Subhead | Diary, DVSA progress and payments in one place. {OFFER.short} — no card required. | {OFFER.short}. Works in your browser and on your phone — no card, no install. | Book, move and remind pupils from one diary. {OFFER.short} — no card required. |
| Hero | `calendar-mobile.webp` | `portal-dashboard-mobile.webp` (portal-progress-mobile is a 375×7173 full-page capture — unusable) | `calendar-day-mobile.webp` |
| Benefit order | diary · DVSA · payments | diary · DVSA · reminders | diary · reminders · payments |
| Extra FAQ | "Is it built for solo instructors?" | "Is there a download?" (honest: web app, add to home screen) | "Can pupils book themselves?" |

"Free download" searches are answered honestly — the product is a web app; the page never
claims a downloadable installer.

### 3.4 Config / build changes

- `astro.config.mjs` sitemap filter: exclude every `/start` path (`/start/`, `/start/free/`, `/start/scheduling/`).
- `.env` (gitignored) + build env: `PUBLIC_GOOGLE_ADS_ID=AW-18429619595`; **no** `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` (conversions come from GA4 import).
- `.env.example` documents both and why the label stays empty.

## 4. Consent Mode v2 (marketing site)

Today tags load only after "Accept All" and **no consent signals are sent**; Google will not
build remarketing lists for UK users without Consent Mode v2.

- Before any tag: `gtag('consent','default',{ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied', wait_for_update:500})`.
- On "Accept All" (and on load when stored consent is `all`): `gtag('consent','update', {all four: 'granted'})`, then load gtag.js as today. "Essential only" keeps everything denied and loads nothing (unchanged behaviour).
- Applies to `BaseLayout.astro`, `LandingLayout.astro`, and `CookieConsent.astro`; one shared inline snippet so the two layouts can't drift.
- Banner copy + privacy policy name advertising/remarketing cookies (Google Ads) alongside analytics.

## 5. App consent PR (driveschoolpro repo — separate, file-fenced)

- Fence: `src/components/ui/CookieConsentBanner.tsx` (+ its unit test) only.
- Change: when the visitor chose "Accept All" outside the native shell, `ad_storage`, `ad_user_data`, `ad_personalization` = `granted` (today hard-coded `denied`). Native shell unchanged (no tracking).
- Why: `onboarding_complete` users must reach GA4 audience **X** in Ads to be excluded.
- Follows app CLAUDE.md: issue, TDD, Conventional Commit, privacy-policy check, live verification in a browser (Tag Assistant / network `gcs`/`gcd` params), architecture inventory + changelog entry.

## 6. GA4 audiences (shared to Ads via the link)

| Id | Definition | Duration | Use |
|---|---|---|---|
| R1 | page_location contains `/start` AND NOT `signup_start` | 30 days | Search observation; Display remarketing |
| R2 | `signup_start` AND NOT `onboarding_complete` | 14 days | Search observation +30% bid; Display remarketing (priority) |
| X | `onboarding_complete` | 540 days | **Exclusion on every campaign** |

## 7. Google Ads build (account 852-626-4049)

**Campaign "Search – UK – Start"**: Search only (partners off, Display expansion off) · UK,
*presence* only · English · all hours · £12/day · Maximise Clicks, max CPC £2.50.

**Bid strategy switch:** move to Maximise Conversions (no target) when ≥ 15 `onboarding_complete`
in trailing 30 days; tCPA only after ≥ 30.

| Ad group | Keywords (phrase + exact) | Final URL |
|---|---|---|
| Free | driving school software free · free driving school software · driving school software free version · driving school software free download | `/start/free?utm_source=google&utm_medium=cpc&utm_campaign=search-uk-start&utm_content=free` |
| Core | driving school software · driving school management software · software for driving schools · driving instructor software · driver training software | `/start?…&utm_content=core` |
| Scheduling | driving school scheduling software · driving lesson scheduling software · driving lessons software · driving instructor diary app | `/start/scheduling?…&utm_content=scheduling` |

- Routing negatives: `free` (phrase) negative in Core and Scheduling.
- Shared negative list "DSP exclusions": fleet, hgv, lorry, truck, taxi, bus, coach, courier, delivery, rota, "driver scheduling", dispatch, jobs, job, career, salary, vacancies, course, courses, theory test, hazard perception, learner, learners, simulator, game, crack, torrent, apk, login, sign in, cdl.
- One RSA per group: 15 headlines / 4 descriptions; H1 pinned to the theme phrase; one `{KeyWord:<theme default>}` headline; "Free during early access" + "No card required" — **no dates in ad copy**.
- Assets: callouts (No card required · Tracks all 27 DVSA skills · Works on your phone · Built for UK instructors), structured snippet "Features": Diary, DVSA progress, Payments, Reminders, Pupil portal. **No sitelinks** (squeeze pages have no navigation).
- Audiences: R1/R2 observation; X excluded.
- **Display/Demand Gen remarketing** ("Remarketing – UK"): created paused; enabled when R1+R2 ≥ 100 users; £2/day taken from Search; frequency cap 3/day; X excluded; links to `/start`.

**Delivery:** Ads Editor CSV in `docs/google-ads/` (campaign, ad groups, keywords, negatives, RSAs, assets). JP imports and posts. Audiences + bid switch done in the UI.

**Existing ads:** remove PMax "Campaign #1" on account 234-011-3623 at launch — irreversible, needs JP's explicit "yes" at that moment.

## 8. Testing & verification

- `npx astro check` 0 errors · `npm test` · `npm run build` (postbuild verify-seo / verify-claims / verify-demos green).
- Unit test: every `start-variants` entry has required fields, no hard-coded dates (regex), hero file exists in `public/`.
- Playwright (headless) for each variant at desktop 1440 and iPhone 13: no horizontal scroll at 390px, field bounding box within first viewport, tap targets ≥ 44px, both captures submit to a **stubbed** `https://app.driveschoolpro.com/**` (page.route) with `org` + UTM params preserved, `noindex` meta present.
- Consent Mode: assert `consent default` precedes gtag load; Accept → `update granted`; Essential → no gtag request.
- Sitemap: no `/start` URLs in `dist/sitemap-0.xml`.
- Screenshots of all three variants (mobile + desktop) to JP **before** `deploy.sh`; deploy only on his explicit go.

## 9. Order of work

1. Marketing branch: variants + Consent Mode + sitemap + env + comment fix → gates → screenshots → JP go → deploy.
2. App consent PR → merge → live check.
3. GA4 audiences R1, R2, X.
4. Ads Editor CSV → JP imports/posts → verify ads approved.
5. Remove PMax on 234-011-3623 (JP's yes).
6. Week 2 and week 4 reviews: search-terms report → negatives; bid-strategy switch rule; enable remarketing campaign when lists ≥ 100.

## 10. Out of scope

Non-UK markets; Customer Match uploads; testimonials; changes to `/ads/driving-school-software`;
app `/signup` flow; Search partners/Display expansion; Performance Max.
