# /start Variants + UK Paid Search — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship three message-matched `/start` squeeze pages with Consent Mode v2, make registered users excludable in Google Ads, and produce the Search campaign build for Ads account 852-626-4049.

**Architecture:** One typed variant config (`src/config/start-variants.ts`) drives one Astro component (`src/components/start/StartPage.astro`) rendered by three thin pages. Consent Mode v2 defaults come from one TS module passed into the two layouts' inline scripts via `define:vars`. Ad copy lives as typed data (`google-ads/search-uk-start.ts`) with a length/policy test and a generator that writes Ads Editor CSVs. The app gets one file-fenced consent change.

**Tech Stack:** Astro 5, Tailwind 3, Node 25 (`node --test`, native TS type-stripping), Playwright library (headless Chromium) for the e2e script; app side Next.js + Vitest.

**Spec:** `docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md`

**Working copy:** `/Users/john/Projects-code/Front-end-sites/mds-start-variants` (worktree of `mydriveschool.software`, branch `feat/start-variants`, from local `main`). Every marketing command below runs from there.

## Global Constraints

- Offer text ONLY from `src/config/offer.ts` (`OFFER.short` = "Free until 31 March 2027"); never hard-code a date in page source or config.
- Ad copy says "Free during early access" — no dates in ads.
- No testimonials anywhere on `/start*`.
- Every claim must pass `scripts/verify-claims.js` (e.g. never "no commission", "one-click confirm", "parent portal").
- Mobile-first: 390px wide, no horizontal scroll, tap targets ≥ 44px, first capture field + button fully visible in a 390×664 viewport.
- `/start*` pages: `robots="noindex, follow"`, absent from `dist/sitemap-0.xml`, LandingLayout (no nav).
- `BusinessNameCapture.astro` is reused unchanged; each instance needs a unique `id`.
- UK English copy. Brand colours via Tailwind tokens (`brand-navy`, `brand-red`), never hex in markup.
- Gates: `npx astro check` 0 errors · `npm test` · `npm run build` (postbuild verify-seo / verify-claims / verify-demos / verify-start green).
- Verification never hits prod: `https://app.driveschoolpro.com/**` is stubbed with `page.route`.
- `deploy.sh` is production — only after JP has seen screenshots and said go.
- Never print `.env` values (the Places key lives there).
- App repo: its CLAUDE.md applies in full (issue, TDD, Conventional Commits, hooks, live verification, inventory + changelog entry). File fence: `src/components/ui/CookieConsentBanner.tsx` + tests + docs entries only.

## Review Focus

1. **Short viewport / long H1** — the Free H1 is the longest; on a 390×664 viewport it must not push the button below the fold. Pinned by the e2e above-the-fold check on all three variants (Task 4).
2. **Visitor returns with consent already = `all`** — Consent Mode must issue `default` (denied) and then `update` (granted) before `config`, not skip the update. Pinned in Task 3's unit test and Task 4's dataLayer-order check.
3. **"Necessary only" visitor** — no request to `googletagmanager.com` at all. Pinned in Task 4.
4. **Hand-off carries tracking params from an ad click** — `?gclid=…&utm_content=free` on `/start/free` must arrive on the stubbed `/signup` URL. Pinned in Task 4.
5. **Ad copy over Google's limits / dated / unpinned** — headline > 30 chars, description > 90, a digit-year in copy, or Headline 1 unpinned would be rejected or mis-message. Pinned by Task 6's test.

---

### Task 1: Variant config

**Files:**
- Create: `src/config/start-variants.ts`
- Test: `tests/start-variants.test.ts`

**Interfaces:**
- Produces: `type VariantId = 'core' | 'free' | 'scheduling'`; `type BenefitId = 'diary' | 'dvsa' | 'payments' | 'reminders'`; `interface StartVariant { id; path; title; description; h1; subhead; hero: { src; alt; width; height }; benefits: BenefitId[]; extraFaq: { q: string; a: string } }`; `const START_VARIANTS: Record<VariantId, StartVariant>`; `const BENEFITS: Record<BenefitId, { title: string; body: string }>`; `const SHARED_FAQ: { q: string; a: string }[]`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/start-variants.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { START_VARIANTS, BENEFITS, SHARED_FAQ } from '../src/config/start-variants.ts';

const variants = Object.values(START_VARIANTS);

test('three variants with the agreed paths', () => {
  assert.deepEqual(
    Object.fromEntries(variants.map((v) => [v.id, v.path])),
    { core: '/start/', free: '/start/free/', scheduling: '/start/scheduling/' },
  );
});

test('no hard-coded years or month names in any variant copy (offer text comes from OFFER)', () => {
  const datey = /\b(20\d\d|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
  for (const v of variants) {
    for (const s of [v.h1, v.subhead, v.title, v.description, v.extraFaq.q, v.extraFaq.a]) {
      // OFFER is interpolated at build, so the config itself must contain the placeholder, not a date
      assert.ok(!datey.test(s.replace('{offer}', '')), `${v.id}: dated copy "${s}"`);
    }
  }
});

test('every subhead carries the {offer} placeholder', () => {
  for (const v of variants) assert.match(v.subhead, /\{offer\}/, v.id);
});

test('hero images exist in public/ with declared dimensions', () => {
  for (const v of variants) {
    assert.ok(fs.existsSync(path.join('public', v.hero.src)), `${v.id}: missing ${v.hero.src}`);
    assert.ok(v.hero.width > 0 && v.hero.height > 0);
    assert.ok(v.hero.alt.length > 10, `${v.id}: alt text too short`);
  }
});

test('each variant lists exactly three distinct known benefits', () => {
  for (const v of variants) {
    assert.equal(v.benefits.length, 3, v.id);
    assert.equal(new Set(v.benefits).size, 3, v.id);
    for (const b of v.benefits) assert.ok(BENEFITS[b], `${v.id}: unknown benefit ${b}`);
  }
});

test('H1 fits a 390px hero: at most 60 characters', () => {
  for (const v of variants) assert.ok(v.h1.length <= 60, `${v.id}: ${v.h1.length}`);
});

test('shared FAQ has four entries and no testimonial-style quotes', () => {
  assert.equal(SHARED_FAQ.length, 4);
  for (const f of SHARED_FAQ) assert.ok(!/[“"].+[”"]\s*[—-]\s*\w/.test(f.a), f.q);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/start-variants.test.ts`
Expected: FAIL — `Cannot find module '../src/config/start-variants.ts'`

- [ ] **Step 3: Write the implementation**

```ts
// src/config/start-variants.ts
/**
 * /start squeeze-page variants — one per Google Ads ad group (theme).
 * Spec: docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md
 *
 * `{offer}` in copy is replaced with OFFER.short at render time. Never put a
 * date here — the offer changes, this file shouldn't have to.
 */
export type VariantId = 'core' | 'free' | 'scheduling';
export type BenefitId = 'diary' | 'dvsa' | 'payments' | 'reminders';

export interface StartVariant {
  id: VariantId;
  path: string;
  title: string;
  description: string;
  h1: string;
  subhead: string;
  hero: { src: string; alt: string; width: number; height: number };
  benefits: BenefitId[];
  extraFaq: { q: string; a: string };
}

export const BENEFITS: Record<BenefitId, { title: string; body: string }> = {
  diary: {
    title: 'Your diary on your phone',
    body: 'Book, move and cancel lessons between pupils — no paper diary, no spreadsheet.',
  },
  dvsa: {
    title: 'Tracks all 27 DVSA driving skills',
    body: 'Record progress against the official framework, and pupils see it in their own portal.',
  },
  payments: {
    title: 'Pupils book and pay online',
    body: 'Card payments go straight to your bank through Stripe, so you stop chasing cash.',
  },
  reminders: {
    title: 'Automatic lesson reminders',
    body: 'Pupils get a reminder before every lesson, which means fewer no-shows.',
  },
};

export const SHARED_FAQ: { q: string; a: string }[] = [
  {
    q: 'Is DriveSchoolPro free?',
    a: '{offerLong} — no credit card required. We charge 3% on card payments you collect, and Stripe’s own processing fee is separate. Nothing is charged automatically.',
  },
  {
    q: 'Does it work on my phone?',
    a: 'Yes. It works on iPhone, Android, iPad, laptop and desktop. Most instructors use it on their phone between lessons.',
  },
  {
    q: 'Does it track DVSA driving skills?',
    a: 'Yes. It tracks all 27 DVSA driving skills across 8 categories, and pupils can view their own progress in a self-service portal.',
  },
  {
    q: 'Can I switch from my paper diary easily?',
    a: 'Most instructors are set up within five minutes. Add your pupils and book your first lesson — you can run both side by side until you’re comfortable.',
  },
];

export const START_VARIANTS: Record<VariantId, StartVariant> = {
  core: {
    id: 'core',
    path: '/start/',
    title: 'Driving school software for instructors | DriveSchoolPro',
    description: 'Diary, DVSA progress and payments in one app for UK driving instructors. No card required.',
    h1: 'Driving school software that runs from your phone',
    subhead: 'Diary, DVSA progress and payments in one place. {offer} — no card required.',
    hero: {
      src: '/images/marketing/calendar-mobile.webp',
      alt: 'DriveSchoolPro lesson diary on a phone showing a week of booked lessons',
      width: 375,
      height: 812,
    },
    benefits: ['diary', 'dvsa', 'payments'],
    extraFaq: {
      q: 'Is it built for solo instructors?',
      a: 'Yes. Most of our users are independent ADIs running their own diary, and it scales up if you take on other instructors later.',
    },
  },
  free: {
    id: 'free',
    path: '/start/free/',
    title: 'Free driving school software — no download | DriveSchoolPro',
    description: 'Free driving school software for UK instructors. Works in your browser and on your phone. No card, no install.',
    h1: 'Free driving school software — nothing to download',
    subhead: '{offer}. Works in your browser and on your phone — no card, no install.',
    hero: {
      src: '/images/marketing/portal-dashboard-mobile.webp',
      alt: 'DriveSchoolPro pupil portal on a phone showing upcoming lessons and progress',
      width: 375,
      height: 1193,
    },
    benefits: ['diary', 'dvsa', 'reminders'],
    extraFaq: {
      q: 'Is there anything to download?',
      a: 'No. DriveSchoolPro runs in your web browser. On your phone you can add it to your home screen so it opens like an app.',
    },
  },
  scheduling: {
    id: 'scheduling',
    path: '/start/scheduling/',
    title: 'Driving lesson scheduling software | DriveSchoolPro',
    description: 'Book, move and remind pupils from one diary on your phone. Built for UK driving instructors. No card required.',
    h1: 'Lesson scheduling built for driving instructors',
    subhead: 'Book, move and remind pupils from one diary. {offer} — no card required.',
    hero: {
      src: '/images/marketing/calendar-day-mobile.webp',
      alt: 'DriveSchoolPro day view on a phone with lessons scheduled through the day',
      width: 640,
      height: 1164,
    },
    benefits: ['diary', 'reminders', 'payments'],
    extraFaq: {
      q: 'Can pupils book lessons themselves?',
      a: 'Yes. Pupils can book and pay online through their portal, within the hours you make available.',
    },
  },
};

/** Replace the copy placeholders with the current offer. */
export function fillOffer(s: string, offer: { short: string; long: string }): string {
  return s.replace('{offerLong}', offer.long).replace('{offer}', offer.short);
}
```

Add one more test case to the test file, then re-run:

```ts
import { fillOffer } from '../src/config/start-variants.ts';
test('fillOffer substitutes both placeholders', () => {
  assert.equal(fillOffer('{offer} / {offerLong}', { short: 'S', long: 'L' }), 'S / L');
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/start-variants.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/config/start-variants.ts tests/start-variants.test.ts
git commit -m "feat(start): typed config for the three /start ad-group variants"
```

---

### Task 2: StartPage component, three pages, sitemap, build verifier

**Files:**
- Create: `src/components/start/StartPage.astro`
- Modify: `src/pages/start.astro` (replace body)
- Create: `src/pages/start/free.astro`, `src/pages/start/scheduling.astro`
- Modify: `astro.config.mjs` (sitemap filter)
- Create: `scripts/verify-start.js`
- Modify: `package.json` (`postbuild` appends `&& node scripts/verify-start.js`)

**Interfaces:**
- Consumes: `START_VARIANTS`, `BENEFITS`, `SHARED_FAQ`, `fillOffer`, `StartVariant` (Task 1); `OFFER` (`src/config/offer.ts`); `BusinessNameCapture` props `{ id: string; tone?: 'dark'|'light' }`; `LandingLayout` props `{ title; description; robots? }`.
- Produces: rendered pages with `data-start-variant="<id>"` on `<main>` content wrapper, capture ids `start-capture-top` / `start-capture-bottom` (inputs `#start-capture-top-org`, `#start-capture-bottom-org`) — Task 4 relies on these.

- [ ] **Step 1: Write the failing build verifier**

```js
// scripts/verify-start.js
/**
 * Asserts the built /start variants match their config: noindex, H1, two
 * capture forms, and absent from the sitemap. Runs in postbuild.
 */
import fs from 'node:fs';
import path from 'node:path';
import { START_VARIANTS, fillOffer } from '../src/config/start-variants.ts';
import { OFFER } from '../src/config/offer.ts';

const dist = path.join(process.cwd(), 'dist');
const fail = [];
const decode = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&mdash;|&#8212;/g, '—').replace(/\s+/g, ' ').trim();

for (const v of Object.values(START_VARIANTS)) {
  const file = path.join(dist, v.path, 'index.html');
  if (!fs.existsSync(file)) { fail.push(`${v.id}: ${file} not built`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  if (!/<meta name="robots" content="noindex, follow"/.test(html)) fail.push(`${v.id}: missing noindex`);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1 || decode(h1[1].replace(/<[^>]+>/g, '')) !== v.h1) fail.push(`${v.id}: H1 is "${h1 && decode(h1[1])}"`);
  const forms = html.match(/data-capture/g) || [];
  if (forms.length !== 2) fail.push(`${v.id}: expected 2 capture forms, found ${forms.length}`);
  if (!html.includes(`data-start-variant="${v.id}"`)) fail.push(`${v.id}: missing data-start-variant`);
  if (!decode(html).includes(fillOffer('{offer}', OFFER))) fail.push(`${v.id}: offer text not rendered`);
}

const sitemap = path.join(dist, 'sitemap-0.xml');
if (fs.existsSync(sitemap) && /\/start\//.test(fs.readFileSync(sitemap, 'utf8'))) {
  fail.push('sitemap contains a /start URL');
}

if (fail.length) { console.error('verify-start FAILED:\n  ' + fail.join('\n  ')); process.exit(1); }
console.log(`verify-start: ${Object.keys(START_VARIANTS).length} variants OK`);
```

In `package.json` change `postbuild` to:

```json
"postbuild": "node scripts/verify-seo.js && node scripts/verify-claims.js && node scripts/verify-demos.js && node scripts/verify-start.js",
```

- [ ] **Step 2: Run the build to verify it fails**

Run: `npm run build 2>&1 | tail -8`
Expected: FAIL — `verify-start FAILED` listing `free: … not built`, `scheduling: … not built`, `core: H1 is "Run your driving school from your phone"`, `core: expected 2 capture forms, found 1`.

- [ ] **Step 3: Write the component**

```astro
---
// src/components/start/StartPage.astro — one /start squeeze-page variant.
// Section order is fixed; copy comes from src/config/start-variants.ts.
import BusinessNameCapture from '../BusinessNameCapture.astro';
import { OFFER } from '../../config/offer';
import { BENEFITS, SHARED_FAQ, fillOffer, type StartVariant } from '../../config/start-variants';

interface Props {
  variant: StartVariant;
}
const { variant } = Astro.props;
const fill = (s: string) => fillOffer(s, OFFER);
const faqs = [...SHARED_FAQ, variant.extraFaq];
const steps = [
  { title: 'Enter your school name', body: 'Pick your business from the suggestions or just type it.' },
  { title: 'Confirm your details', body: 'Check your name and email — no card needed.' },
  { title: 'Add your first pupil', body: 'Book a lesson and you’re running.' },
];
---
<div data-start-variant={variant.id}>
  <section class="bg-white pt-8 pb-10 md:pt-20 md:pb-16">
    <div class="container-custom max-w-2xl text-center">
      <h1 class="text-[1.75rem] leading-tight md:text-5xl font-bold text-brand-navy mb-3">{variant.h1}</h1>
      <p class="text-base md:text-lg text-gray-600 mb-6">{fill(variant.subhead)}</p>
      <div class="flex justify-center text-left">
        <BusinessNameCapture id="start-capture-top" />
      </div>
    </div>
  </section>

  <section class="bg-gray-50 py-10 md:py-16" aria-label="Product screenshot">
    <div class="container-custom flex justify-center">
      <img
        src={variant.hero.src}
        alt={variant.hero.alt}
        width={variant.hero.width}
        height={variant.hero.height}
        loading="lazy"
        decoding="async"
        class="w-64 md:w-72 aspect-[9/16] object-cover object-top rounded-3xl border border-gray-200 shadow-xl"
      />
    </div>
  </section>

  <section class="bg-white py-10 md:py-16" aria-labelledby="start-benefits">
    <div class="container-custom max-w-4xl">
      <h2 id="start-benefits" class="sr-only">Why instructors use DriveSchoolPro</h2>
      <ul class="grid gap-6 md:grid-cols-3">
        {variant.benefits.map((id) => (
          <li class="rounded-2xl border border-gray-100 p-6">
            <h3 class="font-semibold text-brand-navy mb-2">{BENEFITS[id].title}</h3>
            <p class="text-sm text-gray-600">{BENEFITS[id].body}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <section class="bg-gray-50 py-10 md:py-16" aria-labelledby="start-how">
    <div class="container-custom max-w-3xl">
      <h2 id="start-how" class="text-2xl font-bold text-brand-navy text-center mb-8">How it works</h2>
      <ol class="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li class="text-center">
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white font-semibold mb-3">{i + 1}</span>
            <h3 class="font-semibold text-brand-navy">{s.title}</h3>
            <p class="text-sm text-gray-600 mt-1">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <section class="bg-white py-10 md:py-16" aria-labelledby="start-faq">
    <div class="container-custom max-w-2xl">
      <h2 id="start-faq" class="text-2xl font-bold text-brand-navy text-center mb-6">Questions</h2>
      <div class="divide-y divide-gray-100 border-y border-gray-100">
        {faqs.map((f) => (
          <details class="group">
            <summary class="flex min-h-[44px] cursor-pointer items-center justify-between py-3 font-medium text-brand-navy">
              {fill(f.q)}
              <span aria-hidden="true" class="ml-4 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="pb-4 text-sm text-gray-600">{fill(f.a)}</p>
          </details>
        ))}
      </div>
    </div>
  </section>

  <section class="bg-brand-navy py-12 md:py-16">
    <div class="container-custom max-w-2xl text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Set up your school in under a minute</h2>
      <p class="text-gray-300 mb-6">{OFFER.short} — no card required.</p>
      <div class="flex justify-center text-left">
        <BusinessNameCapture id="start-capture-bottom" tone="dark" />
      </div>
    </div>
  </section>
</div>
```

`src/pages/start.astro` (replace whole file):

```astro
---
// /start — Core ad group. noindex; no navigation. /ads/driving-school-software is unchanged.
import LandingLayout from '../layouts/LandingLayout.astro';
import StartPage from '../components/start/StartPage.astro';
import { START_VARIANTS } from '../config/start-variants';
const variant = START_VARIANTS.core;
---
<LandingLayout title={variant.title} description={variant.description} robots="noindex, follow">
  <StartPage variant={variant} />
</LandingLayout>
```

`src/pages/start/free.astro`:

```astro
---
// /start/free — Free ad group ("free version", "free download"). noindex.
import LandingLayout from '../../layouts/LandingLayout.astro';
import StartPage from '../../components/start/StartPage.astro';
import { START_VARIANTS } from '../../config/start-variants';
const variant = START_VARIANTS.free;
---
<LandingLayout title={variant.title} description={variant.description} robots="noindex, follow">
  <StartPage variant={variant} />
</LandingLayout>
```

`src/pages/start/scheduling.astro`:

```astro
---
// /start/scheduling — Scheduling ad group. noindex.
import LandingLayout from '../../layouts/LandingLayout.astro';
import StartPage from '../../components/start/StartPage.astro';
import { START_VARIANTS } from '../../config/start-variants';
const variant = START_VARIANTS.scheduling;
---
<LandingLayout title={variant.title} description={variant.description} robots="noindex, follow">
  <StartPage variant={variant} />
</LandingLayout>
```

`astro.config.mjs` sitemap filter — replace `!page.endsWith('/start/')` with `!/\/start\//.test(page)`:

```js
filter: (page) => !page.includes('/blog/tag/') && !page.includes('/ads/') && !/\/start\//.test(page),
```

- [ ] **Step 4: Run gates to verify they pass**

Run: `npx astro check 2>&1 | tail -3 && npm test 2>&1 | tail -4 && npm run build 2>&1 | tail -6`
Expected: `0 errors`; tests pass; build ends with `verify-start: 3 variants OK` and verify-claims green.

If verify-claims flags a phrase, change the copy in `start-variants.ts` (not the rule).

- [ ] **Step 5: Commit**

```bash
git add src/components/start src/pages/start.astro src/pages/start astro.config.mjs scripts/verify-start.js package.json
git commit -m "feat(start): /start, /start/free and /start/scheduling squeeze pages

One StartPage component renders each ad-group variant from config: hero with
capture above the fold, product shot, three benefits, how it works, FAQ and a
repeat capture. All noindex and out of the sitemap; postbuild verify-start
checks each built page against its config."
```

---

### Task 3: Consent Mode v2 + privacy and banner copy

**Files:**
- Create: `src/utils/consent-mode.ts`
- Test: `tests/consent-mode.test.ts`
- Modify: `src/layouts/LandingLayout.astro` (GA inline script + stale comment)
- Modify: `src/layouts/BaseLayout.astro` (GA inline script + stale comment)
- Modify: `src/components/CookieConsent.astro` (banner sentence)
- Modify: `src/pages/privacy-policy.astro` (lines ~50, ~64, §8 "Analytics cookies"/"We do not use advertising cookies")
- Modify: `.env.example`

**Interfaces:**
- Produces: `CONSENT_DEFAULT_DENIED`, `CONSENT_GRANTED_ALL` (plain objects), `consentCommands(hasConsent: boolean): unknown[][]` — the ordered gtag command list a page issues.

- [ ] **Step 1: Write the failing test**

```ts
// tests/consent-mode.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_DEFAULT_DENIED, CONSENT_GRANTED_ALL, consentCommands } from '../src/utils/consent-mode.ts';

const KEYS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];

test('default denies all four Consent Mode v2 signals', () => {
  for (const k of KEYS) assert.equal(CONSENT_DEFAULT_DENIED[k], 'denied', k);
  assert.equal(CONSENT_DEFAULT_DENIED.wait_for_update, 500);
});

test('granted update covers all four signals', () => {
  assert.deepEqual(Object.keys(CONSENT_GRANTED_ALL).sort(), [...KEYS].sort());
  for (const k of KEYS) assert.equal(CONSENT_GRANTED_ALL[k], 'granted', k);
});

test('a consented visitor: default, then update, before js/config', () => {
  const names = consentCommands(true).map((c) => `${c[0]}:${c[1] ?? ''}`);
  assert.deepEqual(names.slice(0, 2), ['consent:default', 'consent:update']);
});

test('no consent: default only, no update', () => {
  const cmds = consentCommands(false);
  assert.equal(cmds.length, 1);
  assert.deepEqual(cmds[0].slice(0, 2), ['consent', 'default']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/consent-mode.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the module**

```ts
// src/utils/consent-mode.ts
/**
 * Google Consent Mode v2 signals for driveschoolpro.com.
 *
 * Google builds remarketing lists for UK/EEA users only when these signals are
 * sent. Default is everything denied; "Accept All" grants all four. "Necessary
 * only" never loads gtag at all (CookieConsent.astro), so it never needs an update.
 * The layouts receive these objects via define:vars so the inline scripts and
 * this tested module cannot drift.
 */
export const CONSENT_DEFAULT_DENIED: Record<string, string | number> = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
};

export const CONSENT_GRANTED_ALL: Record<string, string> = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

/** The consent commands a page issues, in order, before gtag('js') / config. */
export function consentCommands(hasConsent: boolean): unknown[][] {
  const cmds: unknown[][] = [['consent', 'default', CONSENT_DEFAULT_DENIED]];
  if (hasConsent) cmds.push(['consent', 'update', CONSENT_GRANTED_ALL]);
  return cmds;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/consent-mode.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Wire it into LandingLayout**

In `src/layouts/LandingLayout.astro` frontmatter add:

```ts
import { CONSENT_DEFAULT_DENIED, CONSENT_GRANTED_ALL } from '../utils/consent-mode';
```

Change the GA comment block's `property 517695357` to `property 529247825 (account 388299423)` and the "Verified … ONLY data stream" sentence to: `Verified 2026-10-02: property 529247825 has two web streams — this one and app.driveschoolpro.com (G-EX4E9M57XG); both tags cross-domain "Contains driveschoolpro.com". Google Ads 852-626-4049 is linked and imports onboarding_complete (Primary) and signup_start (Secondary) from GA4.` Replace the "Google Ads conversion tracking is STILL inert" bullet with: `Ads conversions come from the GA4 import, so PUBLIC_GOOGLE_ADS_CONVERSION_LABEL stays unset; PUBLIC_GOOGLE_ADS_ID only loads the Ads tag (remarketing) after consent.`

Replace the inline script with:

```astro
<script is:inline define:vars={{ GOOGLE_ADS_ID, CONSENT_DEFAULT_DENIED, CONSENT_GRANTED_ALL }}>
  (function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    // Consent Mode v2: must precede js/config. Default denied for everyone.
    gtag('consent', 'default', CONSENT_DEFAULT_DENIED);
    var loaded = false;
    function loadGA() {
      if (loaded) return;
      loaded = true;
      gtag('consent', 'update', CONSENT_GRANTED_ALL);
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-4HJLDWJ8DR';
      document.head.appendChild(script);
      gtag('js', new Date());
      gtag('config', 'G-4HJLDWJ8DR', {
        linker: {
          domains: ['driveschoolpro.com', 'app.driveschoolpro.com'],
          accept_incoming: true,
          decorate_forms: true
        }
      });
      if (GOOGLE_ADS_ID) { gtag('config', GOOGLE_ADS_ID); }
    }
    function hasConsent() {
      try {
        var c = localStorage.getItem('dsp-cookie-consent');
        return !!c && JSON.parse(c).consent === 'all';
      } catch (e) { return false; }
    }
    if (hasConsent()) loadGA();
    window.addEventListener('cookieConsentAccepted', loadGA);
  })();
</script>
```

- [ ] **Step 6: Wire it into BaseLayout**

Same import and the same comment corrections in `src/layouts/BaseLayout.astro`. Replace its inline script with the identical script from Step 5 (BaseLayout today loads only on page load; adding the `cookieConsentAccepted` listener also fixes first-visit accept on non-landing pages). Keep `console.error` out — the new script has no try/catch around loading.

- [ ] **Step 7: Banner, privacy policy, env example**

`src/components/CookieConsent.astro` line 14, replace the sentence with:

```html
We use cookies to improve your experience, analyse site traffic and measure our Google ads.
```

`src/pages/privacy-policy.astro`:
- Line ~50: `…and (with your consent) analyse how visitors use our website and measure and show our Google ads. See Section 8 for full details.`
- Line ~64: `We do not sell your data. With your consent, we use Google Ads cookies to measure our adverts and to show our adverts to people who have visited our website.`
- §8: rename "Analytics cookies" heading to "Analytics and advertising cookies", append after its paragraph: `<p>With the same consent we load the Google Ads tag, which lets us measure which adverts led to a sign-up and show our adverts to past visitors on Google. We tell Google not to show these adverts to people who already have an account. Choosing <strong>Necessary Only</strong> loads none of these.</p>`
- Delete `<p>We do not use advertising cookies or cross-site tracking cookies of any kind.</p>`.
- Update the page's "Last updated" date line (if present) to 2 October 2026.

`.env.example` — replace the two Ads lines with:

```
# Google Ads account 852-626-4049. Loads the Ads tag (remarketing) after consent.
PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
# Leave EMPTY: conversions are imported from GA4 (onboarding_complete, signup_start).
# Setting a label would double-count signup_start.
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=
```

Locally (gitignored, do not print the file): `grep -q '^PUBLIC_GOOGLE_ADS_ID=' .env || echo 'PUBLIC_GOOGLE_ADS_ID=AW-18429619595' >> .env`. The worktree may not have `.env` — copy it first: `cp ../mydriveschool.software/.env .env` (gitignored).

- [ ] **Step 8: Gates**

Run: `npx astro check 2>&1 | tail -3 && npm test 2>&1 | tail -4 && npm run build 2>&1 | tail -6`
Expected: 0 errors; all tests pass; postbuild green.

- [ ] **Step 9: Commit**

```bash
git add src/utils/consent-mode.ts tests/consent-mode.test.ts src/layouts src/components/CookieConsent.astro src/pages/privacy-policy.astro .env.example
git commit -m "feat(consent): send Google Consent Mode v2 signals and disclose Google Ads cookies

Tags still load only after Accept All, but every page now sends consent
default (all denied) first and consent update (all granted) on acceptance.
Without these signals Google builds no remarketing lists for UK users.
Privacy policy and banner now name the Google Ads cookies. GA comments
corrected to property 529247825.

Env: PUBLIC_GOOGLE_ADS_ID=AW-18429619595 at build; conversion label stays empty."
```

---

### Task 4: Browser verification script (e2e) + screenshots

**Files:**
- Modify: `package.json` (devDependency `playwright@~1.61.1`, script `"e2e:start": "node scripts/e2e-start.mjs"`)
- Create: `scripts/e2e-start.mjs`

**Interfaces:**
- Consumes: built `dist/` served by `npx astro preview --port 4329`; ids from Task 2 (`#start-capture-top-org`, `#start-capture-bottom-org`, `[data-start-variant]`).
- Produces: screenshots in `screenshots-videos/start-variants/<variant>-<device>.png` (folder is untracked) and exit code 0/1.

- [ ] **Step 1: Install and write the script**

Run: `npm i -D playwright@~1.61.1` (reuses the Chromium already in `~/Library/Caches/ms-playwright`; if it reports a missing browser run `npx playwright install chromium`).

```js
// scripts/e2e-start.mjs — headless checks for the /start variants.
// Usage: npm run build && (npx astro preview --port 4329 &) && npm run e2e:start
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.E2E_BASE || 'http://localhost:4329';
const OUT = 'screenshots-videos/start-variants';
fs.mkdirSync(OUT, { recursive: true });
const VARIANTS = { core: '/start/', free: '/start/free/', scheduling: '/start/scheduling/' };
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

const browser = await chromium.launch();

async function newPage(device, consent) {
  const ctx = await browser.newContext(device === 'iphone13'
    ? { ...devices['iPhone 13'], viewport: { width: 390, height: 664 } }
    : { viewport: { width: 1440, height: 900 } });
  if (consent) {
    await ctx.addInitScript((c) => localStorage.setItem('dsp-cookie-consent', JSON.stringify({ consent: c, timestamp: '2026-10-02T00:00:00Z' })), consent);
  }
  const page = await ctx.newPage();
  const signupHits = [];
  const gtmHits = [];
  await page.route('https://app.driveschoolpro.com/**', (r) => { signupHits.push(r.request().url()); return r.fulfill({ status: 200, body: 'stub' }); });
  await page.route('https://maps.googleapis.com/**', (r) => r.abort());
  await page.route('https://www.googletagmanager.com/**', (r) => { gtmHits.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
  return { ctx, page, signupHits, gtmHits };
}

for (const [id, path] of Object.entries(VARIANTS)) {
  for (const device of ['iphone13', 'desktop']) {
    const { ctx, page, signupHits } = await newPage(device, 'necessary');
    await page.goto(`${BASE}${path}?gclid=TEST123&utm_source=google&utm_content=${id}`);
    check(await page.locator(`[data-start-variant="${id}"]`).count() === 1, `${id}/${device}: variant marker`);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    check(robots === 'noindex, follow', `${id}/${device}: robots=${robots}`);

    if (device === 'iphone13') {
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      check(sw <= 390, `${id}: horizontal scroll (scrollWidth ${sw})`);
      const btn = page.locator('#start-capture-top-org').locator('xpath=ancestor::form').locator('button[type="submit"]');
      const ib = await page.locator('#start-capture-top-org').boundingBox();
      const bb = await btn.boundingBox();
      check(ib && ib.y + ib.height <= 664, `${id}: field below the fold (${ib && ib.y + ib.height})`);
      check(bb && bb.y + bb.height <= 664, `${id}: button below the fold (${bb && bb.y + bb.height})`);
      check(bb && bb.height >= 44, `${id}: button tap target ${bb && bb.height}px`);
      const small = await page.$$eval('summary', (els) => els.filter((e) => e.getBoundingClientRect().height < 44).length);
      check(small === 0, `${id}: ${small} FAQ summaries under 44px`);
    }

    await page.screenshot({ path: `${OUT}/${id}-${device}.png`, fullPage: true });

    for (const which of ['top', 'bottom']) {
      await page.fill(`#start-capture-${which}-org`, `E2E School ${which}`);
      await Promise.all([
        page.waitForURL(/app\.driveschoolpro\.com\/signup/),
        page.locator(`#start-capture-${which}-org`).press('Enter'),
      ]);
      const u = new URL(signupHits.at(-1));
      check(u.searchParams.get('org') === `E2E School ${which}`, `${id}/${device}/${which}: org=${u.searchParams.get('org')}`);
      check(u.searchParams.get('gclid') === 'TEST123', `${id}/${device}/${which}: gclid lost`);
      check(u.searchParams.get('utm_content') === id, `${id}/${device}/${which}: utm_content lost`);
      await page.goto(`${BASE}${path}?gclid=TEST123&utm_source=google&utm_content=${id}`);
    }
    await ctx.close();
  }
}

// Consent Mode: accepted visitor → default then update before js; necessary → no GTM request.
{
  const { ctx, page, gtmHits } = await newPage('desktop', 'all');
  await page.goto(`${BASE}/start/`);
  const order = await page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e).slice(0, 2).join(':')));
  const iDefault = order.indexOf('consent:default');
  const iUpdate = order.indexOf('consent:update');
  const iJs = order.findIndex((s) => s.startsWith('js:'));
  check(iDefault === 0 && iUpdate > iDefault && iJs > iUpdate, `consent order wrong: ${order.join(' | ')}`);
  check(gtmHits.length > 0, 'accepted visitor did not request gtag.js');
  await ctx.close();
}
{
  const { ctx, page, gtmHits } = await newPage('desktop', 'necessary');
  await page.goto(`${BASE}/start/free/`);
  await page.waitForTimeout(500);
  check(gtmHits.length === 0, `necessary-only visitor requested GTM: ${gtmHits.join(', ')}`);
  await ctx.close();
}

await browser.close();
if (failures.length) { console.error('e2e-start FAILED:\n  ' + failures.join('\n  ')); process.exit(1); }
console.log('e2e-start: all checks passed; screenshots in ' + OUT);
```

- [ ] **Step 2: Run it**

Run (background the preview; kill it after):

```bash
npm run build >/dev/null && (npx astro preview --port 4329 >/tmp/preview.log 2>&1 &) && sleep 3 && npm run e2e:start; pkill -f "astro preview --port 4329"
```

Expected: `e2e-start: all checks passed`. If the above-the-fold check fails on a variant, tighten that variant's H1/subhead or the hero top padding (`pt-8`) — do not shrink the input.

- [ ] **Step 3: Look at the screenshots**

Open each `screenshots-videos/start-variants/*.png` (Read tool) and check: H1 wraps cleanly, hero image crops at the top of the phone screen, no orphaned words in buttons, FAQ readable. Fix and re-run Step 2 if not.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json scripts/e2e-start.mjs
git commit -m "test(start): headless browser checks for /start variants and Consent Mode

Checks no horizontal scroll and an above-the-fold capture at 390x664, 44px tap
targets, noindex, both captures hand off to a stubbed /signup with org, gclid
and utm_content intact, consent default→update ordering, and that a
necessary-only visitor never requests gtag."
```

---

### Task 5: Review gate and deploy

- [ ] **Step 1:** Run `/code-review` (effort: high — touches consent/tracking) on the branch; fix Critical/Important findings.
- [ ] **Step 2:** Send JP the six screenshots (SendUserFile) plus a one-line summary per variant. **Stop and wait for his explicit go.**
- [ ] **Step 3:** On go: `cd /Users/john/Projects-code/Front-end-sites/mydriveschool.software && git merge --ff-only feat/start-variants` (local `main` is the deploy source), then `../deploy.sh mydriveschool.software`.
- [ ] **Step 4:** Live check: `curl -s https://driveschoolpro.com/start/free/ | grep -c 'data-start-variant="free"'` → `1`; `curl -s https://driveschoolpro.com/sitemap-0.xml | grep -c '/start/'` → `0`; run `E2E_BASE=https://driveschoolpro.com npm run e2e:start` (signup still stubbed).
- [ ] **Step 5:** `git worktree remove ../mds-start-variants && git branch -d feat/start-variants`.

---

### Task 6: Ads copy as data, tested, exported to Ads Editor CSV

**Files:**
- Create: `google-ads/search-uk-start.ts`
- Create: `scripts/build-ads-csv.ts`
- Test: `tests/ads-copy.test.ts`
- Output (committed): `docs/google-ads/keywords.csv`, `docs/google-ads/ads.csv`, `docs/google-ads/negatives.txt`, `docs/google-ads/README.md`

**Interfaces:**
- Produces: `CAMPAIGN = { name: 'Search – UK – Start', budgetGbp: 12, maxCpcGbp: 2.5 }`; `AD_GROUPS: { name; finalUrl; keywords: string[]; headlines: { text: string; pin?: 1 }[]; descriptions: string[]; path1; path2 }[]`; `ROUTING_NEGATIVES: Record<string, string[]>`; `SHARED_NEGATIVES: string[]`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/ads-copy.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AD_GROUPS, SHARED_NEGATIVES, ROUTING_NEGATIVES } from '../google-ads/search-uk-start.ts';
import { START_VARIANTS } from '../src/config/start-variants.ts';

const DKI = /^\{KeyWord:(.+)\}$/;
const visibleLength = (h: string) => (DKI.test(h) ? h.match(DKI)![1].length : h.length);

test('three ad groups pointing at the three variants with utm_content', () => {
  const paths = Object.values(START_VARIANTS).map((v) => v.path);
  assert.equal(AD_GROUPS.length, 3);
  for (const g of AD_GROUPS) {
    const u = new URL(g.finalUrl);
    assert.equal(u.host, 'driveschoolpro.com');
    assert.ok(paths.includes(u.pathname), `${g.name}: ${u.pathname}`);
    assert.ok(u.searchParams.get('utm_content'), `${g.name}: no utm_content`);
  }
});

test('15 headlines ≤ 30 chars, 4 descriptions ≤ 90, paths ≤ 15', () => {
  for (const g of AD_GROUPS) {
    assert.equal(g.headlines.length, 15, g.name);
    assert.equal(g.descriptions.length, 4, g.name);
    for (const h of g.headlines) assert.ok(visibleLength(h.text) <= 30, `${g.name}: "${h.text}"`);
    for (const d of g.descriptions) assert.ok(d.length <= 90, `${g.name}: "${d}" (${d.length})`);
    assert.ok(g.path1.length <= 15 && g.path2.length <= 15, g.name);
  }
});

test('exactly one headline pinned to position 1 and exactly one keyword-insertion headline', () => {
  for (const g of AD_GROUPS) {
    assert.equal(g.headlines.filter((h) => h.pin === 1).length, 1, g.name);
    assert.equal(g.headlines.filter((h) => DKI.test(h.text)).length, 1, g.name);
  }
});

test('no dates, no testimonial language, no unverifiable superlatives', () => {
  const banned = /\b(20\d\d|march|april|#1|best|cheapest|guaranteed|testimonial|rated)\b/i;
  for (const g of AD_GROUPS) {
    for (const s of [...g.headlines.map((h) => h.text), ...g.descriptions]) assert.ok(!banned.test(s), `${g.name}: "${s}"`);
  }
});

test('headlines unique within each group', () => {
  for (const g of AD_GROUPS) assert.equal(new Set(g.headlines.map((h) => h.text.toLowerCase())).size, 15, g.name);
});

test('keywords are lowercase and not negated in their own group', () => {
  for (const g of AD_GROUPS) {
    const negs = ROUTING_NEGATIVES[g.name] ?? [];
    for (const k of g.keywords) {
      assert.equal(k, k.toLowerCase());
      for (const n of [...negs, ...SHARED_NEGATIVES]) assert.ok(!k.split(' ').includes(n) && !k.includes(n + ' ') , `${g.name}: "${k}" blocked by "${n}"`);
    }
  }
});

test('"free" routes to the Free group only', () => {
  assert.deepEqual(ROUTING_NEGATIVES['Core'], ['free']);
  assert.deepEqual(ROUTING_NEGATIVES['Scheduling'], ['free']);
  assert.equal(ROUTING_NEGATIVES['Free'], undefined);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/ads-copy.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the data**

```ts
// google-ads/search-uk-start.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/ads-copy.test.ts`
Expected: PASS. If a headline/description fails a length check, shorten that string (keep meaning) and re-run.

- [ ] **Step 5: Write the CSV generator**

```ts
// scripts/build-ads-csv.ts — writes Ads Editor import files from google-ads/search-uk-start.ts
import fs from 'node:fs';
import { CAMPAIGN, AD_GROUPS, ROUTING_NEGATIVES, SHARED_NEGATIVES } from '../google-ads/search-uk-start.ts';

const q = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
const row = (cells: (string | number)[]) => cells.map(q).join(',');
fs.mkdirSync('docs/google-ads', { recursive: true });

const kw = [row(['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Max CPC'])];
for (const g of AD_GROUPS) {
  for (const k of g.keywords) {
    kw.push(row([CAMPAIGN.name, g.name, k, 'Phrase', CAMPAIGN.maxCpcGbp]));
    kw.push(row([CAMPAIGN.name, g.name, k, 'Exact', CAMPAIGN.maxCpcGbp]));
  }
  for (const n of ROUTING_NEGATIVES[g.name] ?? []) kw.push(row([CAMPAIGN.name, g.name, n, 'Negative Phrase', '']));
}
fs.writeFileSync('docs/google-ads/keywords.csv', kw.join('\n') + '\n');

const hdr = ['Campaign', 'Ad Group', 'Ad type', 'Final URL', 'Path 1', 'Path 2'];
for (let i = 1; i <= 15; i++) hdr.push(`Headline ${i}`, `Headline ${i} position`);
for (let i = 1; i <= 4; i++) hdr.push(`Description ${i}`);
const ads = [row(hdr)];
for (const g of AD_GROUPS) {
  const cells: (string | number)[] = [CAMPAIGN.name, g.name, 'Responsive search ad', g.finalUrl, g.path1, g.path2];
  for (const hl of g.headlines) cells.push(hl.text, hl.pin ?? '');
  cells.push(...g.descriptions);
  ads.push(row(cells));
}
fs.writeFileSync('docs/google-ads/ads.csv', ads.join('\n') + '\n');

fs.writeFileSync('docs/google-ads/negatives.txt', SHARED_NEGATIVES.map((n) => `"${n}"`).join('\n') + '\n');
console.log('wrote docs/google-ads/{keywords.csv,ads.csv,negatives.txt}');
```

Run: `node scripts/build-ads-csv.ts && head -3 docs/google-ads/keywords.csv && wc -l docs/google-ads/*.csv`
Expected: keywords.csv 1 header + 26 keyword rows + 2 routing negatives = 29 lines; ads.csv 4 lines.

- [ ] **Step 6: Write `docs/google-ads/README.md`** — the Ads Editor runbook:

```markdown
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
Ad copy says "Free during early access" — if early access ends, edit SHARED_HEADLINES/DESCRIPTIONS here,
regenerate, re-import.
```

- [ ] **Step 7: Commit**

```bash
git add google-ads scripts/build-ads-csv.ts tests/ads-copy.test.ts docs/google-ads
git commit -m "feat(ads): Search – UK – Start ad copy, keywords and negatives as tested data

Three ad groups matching the /start variants, 15 headlines and 4
descriptions each with length, pinning, keyword-insertion and no-dates
checks, and a generator that writes Ads Editor CSVs plus a runbook."
```

(Task 6 ships with the Task 5 merge if done first; otherwise merge to local `main` after review — no deploy needed, docs only.)

---

### Task 7: App — grant ad consent on Accept All (driveschoolpro repo)

**Files (fence):**
- Modify: `src/components/ui/CookieConsentBanner.tsx` (the `gtag('consent','default', …)` block, ~lines 50–60)
- Create: `tests/unit/ui/cookie-consent-banner-ad-consent.test.tsx`
- Create: `docs/changelog/2026-10-02-<issue>-app-ad-consent.md`; Modify: `docs/architecture/components.md` row for CookieConsentBanner

**Interfaces:**
- Consumes: existing test helpers pattern from `tests/unit/ui/cookie-consent-banner-gtag-arguments.test.tsx` (`makeLocalStorage`, `installHeadCapture`, consent key `dsp-app-cookie-consent`).

- [ ] **Step 1: Issue + branch**

```bash
cd /Users/john/Projects-code/driveschoolpro && git fetch -q origin && git switch -c fix/app-ad-consent origin/main
gh issue create --title "App: grant Google ad consent on Accept All so registered users can be excluded from ads" --body "Consent Mode v2: on Accept All (outside the native shell) grant ad_storage, ad_user_data, ad_personalization. Today they are hard-coded denied, so onboarding_complete users never reach the GA4 'Registered' audience in Google Ads and keep seeing ads. Spec: Front-end-sites/mydriveschool.software docs/superpowers/specs/2026-10-02-start-variants-and-paid-search-design.md §5."
```

Note the issue number as `<issue>`.

- [ ] **Step 2: Write the failing test**

```tsx
// tests/unit/ui/cookie-consent-banner-ad-consent.test.tsx
// @vitest-environment happy-dom
import { render, cleanup } from '@testing-library/react'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner'

const CONSENT_KEY = 'dsp-app-cookie-consent'
const GA_SCRIPT_ID = 'dsp-ga-script'

function makeLocalStorage(): Storage {
  const store = new Map<string, string>()
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size },
  } as Storage
}

beforeEach(() => {
  vi.stubGlobal('localStorage', makeLocalStorage())
  const original = document.head.appendChild.bind(document.head)
  vi.spyOn(document.head, 'appendChild').mockImplementation((node: Node) =>
    (node as HTMLElement).id === GA_SCRIPT_ID ? node : original(node))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete (window as Window & { dataLayer?: unknown[] }).dataLayer
  delete (window as Window & { gtag?: unknown }).gtag
})

describe('CookieConsentBanner — Consent Mode v2 on Accept All', () => {
  it('grants analytics and all three ad signals so registered users can be excluded from ads', () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent: 'all', timestamp: '2026-10-02T00:00:00.000Z' }))
    render(<CookieConsentBanner gaId="G-TESTID0000" />)
    const entries = ((window as Window & { dataLayer?: unknown[] }).dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>))
    const consent = entries.find((e) => e[0] === 'consent' && e[1] === 'default')
    expect(consent?.[2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  })

  it('essential-only loads no tag and pushes nothing', () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ consent: 'essential', timestamp: '2026-10-02T00:00:00.000Z' }))
    render(<CookieConsentBanner gaId="G-TESTID0000" />)
    expect((window as Window & { dataLayer?: unknown[] }).dataLayer ?? []).toHaveLength(0)
  })
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run tests/unit/ui/cookie-consent-banner-ad-consent.test.tsx`
Expected: FAIL — first test: `ad_storage: 'denied'` ≠ `'granted'`. (Second test should already pass — it pins existing behaviour.)

- [ ] **Step 4: Implement**

In `src/components/ui/CookieConsentBanner.tsx` replace the comment tail and consent block:

```tsx
  // pings (googletagmanager.com/a?...&e=gtm.init etc.), which look like
  // working analytics but are unrelated to actual measurement traffic. This
  // function only runs once the visitor has already chosen "Accept All" (and
  // never in the native shell), so all four Consent Mode v2 signals are
  // granted: ad_* lets Google Ads add onboarded users to the "Registered"
  // audience that is EXCLUDED from all campaigns (stop advertising to people
  // who already signed up). Disclosed in the privacy policy, §8.
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });
```

- [ ] **Step 5: Run the test + the existing banner tests**

Run: `npx vitest run tests/unit/ui/cookie-consent-banner-ad-consent.test.tsx tests/unit/ui/cookie-consent-banner-gtag-arguments.test.tsx tests/unit/ui/cookie-consent-banner-native-shell.test.tsx tests/unit/analytics/gtag.test.ts`
Expected: all PASS. If an existing test asserted `ad_storage: 'denied'`, update that assertion — it pinned the old decision.

- [ ] **Step 6: Docs + banner copy check**

Read the banner's visible text in `CookieConsentBanner.tsx`; if it says analytics only, extend it to "analytics and to measure our Google ads" (copy change — grep `tests/e2e` for `getByText`/`getByRole` on the old wording and update selectors). Add the changelog file per `docs/changelog/README.md` format and update the CookieConsentBanner row in `docs/architecture/components.md`.

- [ ] **Step 7: Commit (hook runs typecheck + related tests), push, PR**

```bash
git add src/components/ui/CookieConsentBanner.tsx tests/unit/ui/cookie-consent-banner-ad-consent.test.tsx docs/changelog docs/architecture/components.md
git commit -m "fix(analytics): grant Google ad consent signals on Accept All

ad_storage, ad_user_data and ad_personalization were hard-coded denied, so
users who completed onboarding never joined the GA4 'Registered' audience
that Google Ads excludes — they kept seeing our ads. Accept All now grants
all four Consent Mode v2 signals; essential-only and the native shell still
load nothing.

Closes #<issue>"
bash scripts/push.sh
gh pr create --fill
```

- [ ] **Step 8: Live verification after merge + deploy**

In Chrome on `https://app.driveschoolpro.com/login`, accept all cookies, then in DevTools Network filter `collect` → the GA hit's `gcs` param must be `G111` (ad + analytics granted). Clear site data, choose essential only → no `googletagmanager` requests. Record both in the PR.

---

### Task 8: GA4 audiences (browser, property 529247825, Chrome `authuser=1`)

- [ ] **Step 1:** GA4 → Admin → Audiences → New audience → Create custom:
  - **R1 Start visitors 30d** — Include users when `page_view` with `page_location` contains `/start`; Exclude users when `signup_start` (exclude permanently). Membership 30 days.
  - **R2 Started not onboarded 14d** — Include `signup_start`; Exclude permanently `onboarding_complete`. Membership 14 days.
  - **X Registered 540d** — Include `onboarding_complete`. Membership 540 days.
- [ ] **Step 2:** Confirm each shows "Google Ads" under destinations (via the 852-626-4049 link). If Claude Code's classifier blocks any save, hand that click to JP.
- [ ] **Step 3:** After 24–48 h, Ads → Tools → Audience manager → all three listed with size (may show "Too small to serve" initially — expected).

---

### Task 9: Launch in Google Ads (JP imports; Claude verifies)

- [ ] **Step 1:** JP follows `docs/google-ads/README.md` §1–4 in Ads Editor, posts.
- [ ] **Step 2:** Claude (browser, read-only) checks: 3 ad groups, 26 keywords, 3 RSAs Eligible, shared list attached, Search partners off, location presence-only, budget £12, max CPC £2.50.
- [ ] **Step 3:** Claude adds audiences per README §5 (observation R1/R2 +30% on R2; exclude X).
- [ ] **Step 4:** Ask JP for an explicit "yes" to remove PMax "Campaign #1" on account 234-011-3623, then JP or Claude removes it.
- [ ] **Step 5:** Create paused Display remarketing campaign "Remarketing – UK" (audiences R1+R2, exclude X, £2/day, frequency cap 3/day, final URL `https://driveschoolpro.com/start/?utm_source=google&utm_medium=display&utm_campaign=remarketing-uk`) — enable when R1+R2 ≥ 100 users, reducing Search budget to £10.

---

### Task 10: Week 2 and week 4 reviews

- [ ] **Week 2:** Search terms report → add irrelevant terms to `SHARED_NEGATIVES` in `google-ads/search-uk-start.ts`, re-run tests + generator, re-import negatives; check landing-page experience per ad group; check R1/R2/X sizes; check Ads conversions show `onboarding_complete` with source = this campaign.
- [ ] **Week 4:** Apply the bid switch rule; enable remarketing if lists ≥ 100; compare variants by `utm_content` in GA4 (Explore → landing page + session manual ad content → `signup_start`, `onboarding_complete`).
