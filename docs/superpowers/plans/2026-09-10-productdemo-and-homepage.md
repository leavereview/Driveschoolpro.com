# DriveSchoolPro Homepage Restructure (Plan 1 of 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the driveschoolpro.com homepage around the instructor's working week — pain sentence, outcome headline, silent looping product video, proof line — replacing feature-named sections illustrated with static screenshots.

**Architecture:** A new `ProductDemo.astro` component renders a silent autoplaying MP4 with a poster-image fallback, loaded lazily via IntersectionObserver and disabled entirely under `prefers-reduced-motion`. Five homepage sections are rewritten to use it. Because videos do not exist yet, every `ProductDemo` initially renders its poster — an existing `.webp` capture — so the page ships complete and the clips drop in later without further code changes. Correctness is enforced by a new `scripts/verify-demos.js` added to the existing `postbuild` verification chain.

**Tech Stack:** Astro 5.x, Tailwind CSS 3.4, TypeScript. Static output to `dist/`. No test framework — verification is by Node scripts run in `postbuild` against built HTML.

**Spec:** `docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md`

## Global Constraints

- **Brand tokens only.** `brand-red #E94560`, `brand-navy #1A1A2E`, `brand-red-dark #D13354`, `brand-red-light #FFE7EC`. Never introduce a new hex. `#FF385C` is explicitly forbidden and `verify-claims.js` fails on it.
- **CSS classes:** `.btn-primary`, `.btn-secondary`, `.card`, `.container-custom`, `.section` already exist — use them.
- **Offer text comes from `src/config/offer.ts`.** Never hardcode "Free until 31 March 2027" — import `OFFER` and use `OFFER.short` / `OFFER.long` / `OFFER.ctaPrimary`.
- **Not VAT-registered.** Never write "inc VAT" or "including VAT".
- **Hidden in production — must not be claimed:** recurring bookings, parent access, student documents tab, utilisation/tests/compliance reports, one-click lesson confirmation. WhatsApp is "coming soon" only; SMS is never mentioned at all.
- **Claimable and verified 2026-09-10:** student portal, package catalogue, phone-first booking wizard, `/pay/[token]` tokenised payment, Stripe card payments, Google review requests, AI briefings via Claude, 27 DVSA competencies / 8 categories / 6 levels, calendar day/week/month only (month is a heatmap), one-way ICS export only.
- **Setup time is five minutes**, written as a plain product fact, never as a footnoted statistic.
- **Every build must pass** `npm run build`, which runs `astro check && astro build` then `verify-seo.js`, `verify-claims.js`, and (from Task 1) `verify-demos.js`.
- **Do not modify `src/components/MarketingScreenshot.astro`.** It is used in ~10 places and is out of scope.
- **Do not deploy** until Task 9. `deploy.sh` requires explicit approval from JP.

---

### Task 1: `ProductDemo` component and its verifier

**Files:**
- Create: `scripts/verify-demos.js`
- Create: `src/components/ProductDemo.astro`
- Modify: `package.json:8` (the `postbuild` script)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `<ProductDemo>` with props
  `{ src?: string; poster: string; width: number; height: number; alt: string; phone?: boolean; class?: string }`.
  Every later task imports it as
  `import ProductDemo from '../components/ProductDemo.astro';`

- [ ] **Step 1: Write the failing verifier**

Create `scripts/verify-demos.js`:

```js
/**
 * Demo verification — asserts every <video> the site emits is a well-formed,
 * accessible, performance-safe product demo, and that the homepage carries the
 * section anchors the hero CTA depends on.
 *
 * Sits alongside verify-seo.js (structure) and verify-claims.js (truth).
 * This one covers the benefit-architecture invariants from
 * docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
const errors = [];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Required attributes on every emitted <video>, with why each one matters. */
const VIDEO_RULES = [
  [/\bmuted\b/, 'muted — browsers block autoplay of unmuted video'],
  [/\bloop\b/, 'loop — demo clips must cycle'],
  [/\bplaysinline\b/, 'playsinline — iOS Safari goes fullscreen without it'],
  [/preload="none"/, 'preload="none" — four of five clips are below the fold'],
  [/poster="[^"]+"/, 'poster — the fallback still, shown before load'],
  [/\bwidth="\d+"/, 'width — prevents layout shift'],
  [/\bheight="\d+"/, 'height — prevents layout shift'],
  [/aria-label="[^"]+"/, 'aria-label — <video> has no alt attribute'],
  [/data-src="[^"]+"/, 'data-src — the real source, swapped in by the observer'],
];

/** Anchors the homepage hero CTA and section navigation depend on. */
const HOME_ANCHORS = [
  'the-week',
  'know-what-to-teach',
  'log-the-lesson',
  'paid-before-they-turn-up',
  'get-found',
];

const files = walk(distDir);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(distDir, file);

  for (const tag of html.match(/<video\b[^>]*>/g) || []) {
    for (const [re, why] of VIDEO_RULES) {
      if (!re.test(tag)) errors.push(`${rel}: <video> missing ${why}`);
    }
    // A literal src= would defeat preload="none" and download on parse.
    if (/\ssrc="/.test(tag)) {
      errors.push(`${rel}: <video> has a literal src= — use data-src so preload="none" holds`);
    }
    // The poster must actually exist, or the fallback is a broken image.
    const poster = tag.match(/poster="([^"]+)"/);
    if (poster && poster[1].startsWith('/')) {
      const p = path.join(distDir, poster[1]);
      if (!fs.existsSync(p)) errors.push(`${rel}: poster not found in dist: ${poster[1]}`);
    }
  }
}

const home = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
for (const id of HOME_ANCHORS) {
  if (!home.includes(`id="${id}"`)) errors.push(`index.html: missing section anchor id="${id}"`);
}
if (!/href="#the-week"/.test(home)) {
  errors.push('index.html: hero secondary CTA must target #the-week (a moving demo), not a still');
}

if (errors.length) {
  console.error(`\nverify-demos: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`verify-demos: OK (${files.length} pages checked)`);
```

- [ ] **Step 2: Wire it into postbuild and run it to verify it fails**

Change `package.json` line 8 from:

```json
"postbuild": "node scripts/verify-seo.js && node scripts/verify-claims.js",
```

to:

```json
"postbuild": "node scripts/verify-seo.js && node scripts/verify-claims.js && node scripts/verify-demos.js",
```

Run: `npm run build`

Expected: FAIL. `verify-demos` reports six errors — the five missing `HOME_ANCHORS` and the missing `href="#the-week"`. There are no `<video>` errors yet because no videos exist. This is the correct failing state: the verifier is proving the homepage has not been restructured.

- [ ] **Step 3: Write the component**

Create `src/components/ProductDemo.astro`:

```astro
---
/**
 * A silent, looping product demo clip with a poster-image fallback.
 *
 * Renders a plain <img> when given no `src`, so pages can ship before their
 * clips are cut. Deliberately separate from MarketingScreenshot.astro, which
 * is used in ~10 places and must not be destabilised.
 */
interface Props {
  /** Path to the MP4. Omit to render the poster as a static image. */
  src?: string;
  /** Always required — the still shown before load, and the no-video fallback. */
  poster: string;
  width: number;
  height: number;
  /** Describes what HAPPENS in the clip, not just what is pictured. */
  alt: string;
  phone?: boolean;
  class?: string;
}

const { src, poster, width, height, alt, phone = false, class: className = '' } = Astro.props;

const frameClass = phone
  ? 'mx-auto max-w-[280px] rounded-[2rem] border-[8px] border-gray-800 bg-gray-800 p-1 shadow-2xl'
  : '';
const mediaClass = phone
  ? 'w-full h-auto rounded-[1.5rem]'
  : 'rounded-xl shadow-lg border border-gray-200 w-full h-auto';
---

<div class:list={[frameClass, className]}>
  <div class:list={[phone ? 'overflow-hidden rounded-[1.5rem]' : '']}>
    {src ? (
      <video
        class:list={['product-demo', mediaClass]}
        width={width}
        height={height}
        poster={poster}
        aria-label={alt}
        data-src={src}
        muted
        loop
        playsinline
        preload="none"
      ></video>
    ) : (
      <img
        src={poster}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        class:list={[mediaClass]}
      />
    )}
  </div>
</div>

<script>
  // Clips load only when they near the viewport: four of the five sit below the
  // fold, and eager loading would undo the site's Core Web Vitals tuning.
  const demos = document.querySelectorAll<HTMLVideoElement>('video.product-demo');

  if (demos.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // Autoplaying motion triggers symptoms for people with vestibular
      // disorders. Show the poster and let them choose to play it.
      demos.forEach((video) => {
        if (video.dataset.src) video.src = video.dataset.src;
        video.controls = true;
      });
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (!entry.isIntersecting) {
              video.pause();
              return;
            }
            if (!video.src && video.dataset.src) video.src = video.dataset.src;
            // A rejected play() means the browser declined autoplay; fall back
            // to controls rather than leaving a dead frame on the page.
            video.play().catch(() => {
              video.controls = true;
            });
          });
        },
        { rootMargin: '200px 0px' },
      );
      demos.forEach((video) => observer.observe(video));
    }
  }
</script>
```

- [ ] **Step 4: Verify the component compiles**

Run: `npm run build`

Expected: `astro check` passes with no type errors. `verify-demos` still reports the same six homepage-anchor errors — the component exists but nothing uses it yet. That is correct.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-demos.js src/components/ProductDemo.astro package.json
git commit -m "Add ProductDemo component and demo verifier

Silent looping MP4 with poster fallback, lazy-loaded via
IntersectionObserver and disabled under prefers-reduced-motion.
Renders the poster as a plain image when no clip exists yet, so pages
ship before the videos are cut.

verify-demos.js joins the postbuild chain and asserts every emitted
<video> is accessible and performance-safe, and that the homepage
carries the anchors the hero CTA depends on."
```

---

### Task 2: Homepage skeleton — hero, anchors, section order

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `ProductDemo` from Task 1 (imported now, used from Task 3).
- Produces: five empty `<section>` shells carrying the ids in `HOME_ANCHORS`, in the running order from spec §5. Tasks 3–7 each fill exactly one.

- [ ] **Step 1: Run the verifier to confirm the failing state**

Run: `npm run build`

Expected: FAIL with six `verify-demos` errors (five missing anchors, one missing `href="#the-week"`).

- [ ] **Step 2: Import ProductDemo**

In the frontmatter of `src/pages/index.astro`, below the existing `MarketingScreenshot` import on line 3, add:

```astro
import ProductDemo from '../components/ProductDemo.astro';
```

- [ ] **Step 3: Rewrite the hero**

Replace the `<div class="max-w-3xl">` block inside `<section id="hero-section">` (currently `index.astro:171-185`) with:

```astro
      <div class="max-w-3xl">
        <span class="badge-primary mb-6">Purpose-built for UK driving instructors</span>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Teach. <span class="text-brand-red">Everything else runs itself.</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Pupils book and pay on their phones. Lesson briefings write themselves. Review
          requests go out on the day they pass. You get in the car and teach.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href={OFFER.ctaPrimary.href} class="btn-primary text-lg px-8 py-4">{OFFER.ctaPrimary.label} →</a>
          <a href="#the-week" class="btn-secondary text-lg px-8 py-4">See it work</a>
        </div>
        <p class="mt-6 text-sm text-gray-400">No credit card required • {OFFER.short}</p>
      </div>
```

The `href="#the-week"` change is the specific defect this project exists to fix: the CTA previously landed on `#ai-briefings`, a static phone screenshot.

- [ ] **Step 4: Replace the middle of the page with five section shells**

Delete everything from the `<!-- AI Lesson Briefings -->` comment (line 242) through the closing `</section>` of the "Why Schools Choose DriveSchoolPro" block (line ~576), and put in its place:

```astro
  <!-- §3 Scheduling — Sunday night. Filled by Task 3. -->
  <section id="the-week" class="section bg-white border-t border-gray-100 scroll-mt-20"></section>

  <!-- §4 AI briefings — the morning. Filled by Task 4. -->
  <section id="know-what-to-teach" class="section bg-gray-50 border-t border-gray-100 scroll-mt-20"></section>

  <!-- §5 Progress tracking — in the car. Filled by Task 5. -->
  <section id="log-the-lesson" class="section bg-white border-t border-gray-100 scroll-mt-20"></section>

  <!-- §6 Packages and pre-payment — the pupil's phone. Filled by Task 6. -->
  <section id="paid-before-they-turn-up" class="section bg-brand-navy text-white scroll-mt-20"></section>

  <!-- §7 Review collection — end of month. Filled by Task 7. -->
  <section id="get-found" class="section bg-white border-t border-gray-100 scroll-mt-20"></section>
```

Retired by this deletion, per spec §5.2: the AI Lesson Briefings section (its content returns in Task 4), the navy DVSA 27 Skills section (merges into Task 5), the old "See It in Action" two-row block (becomes Tasks 3 and 5), "Built for All Sizes", and "Why Schools Choose DriveSchoolPro".

Keep untouched, below these shells: the "Everything You Need" four cards, `<Testimonials />`, the switching-reassurance section, the revenue-calculator teaser, the pricing teaser, the FAQ, and the final CTA.

- [ ] **Step 4b: Fold the "Built for All Sizes" point into the retained feature-cards section**

Spec §5.2 condenses that section rather than dropping it — the solo-instructor-to-multi-car-school range is a real objection-handler and it must not be lost with the deletion. In the retained "Everything You Need to Run Your Driving School" section, replace the paragraph directly under its `<h2>` with:

```astro
        <p class="text-xl text-gray-600">
          From your first pupil to a multi-car school — one instructor or fifteen, the same
          tools, priced the same. <a href="/driving-school-management-software/" class="text-brand-red font-semibold hover:underline">See how it scales &rarr;</a>
        </p>
```

This also preserves the homepage's outbound link to `/driving-school-management-software/`, which the deleted sections used to carry.

- [ ] **Step 5: Run the verifier to confirm it passes**

Run: `npm run build`

Expected: PASS. All three verifiers green. `verify-demos` now finds all five anchors and the `#the-week` href. The page renders with five empty bands — visually unfinished but structurally correct and deployable.

Watch specifically for `verify-seo.js` failures reading `Insufficient inbound internal links (N, need ≥ 2)`. This step deletes homepage links to other pages, and that check (`scripts/verify-seo.js:200`) fails any page that drops below two. It was confirmed safe on 2026-09-10 — `Navigation.astro` and `Footer.astro` render on every page and carry the cover, and `/how-progress-works/` falls from three sources to two and is restored in Task 5 — but re-check rather than assume, because the margin is one link.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "Restructure homepage skeleton around the instructor's week

New outcome-led hero, and the hero's secondary CTA now targets
#the-week (a moving calendar demo) instead of #ai-briefings (a static
phone screenshot) — the defect that prompted this work.

Retires the standalone briefings, DVSA, 'Built for All Sizes' and 'Why
Schools Choose' sections; their content returns in the five new
sections that Tasks 3-7 fill."
```

---

### Task 3: §3 — "Move a lesson. Everything else catches up."

**Files:**
- Modify: `src/pages/index.astro` (the `id="the-week"` section from Task 2)

**Interfaces:**
- Consumes: `ProductDemo` (Task 1), the `id="the-week"` shell (Task 2).
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Fill the section**

Replace the empty `<section id="the-week">` element with:

```astro
  <!-- §3 Scheduling — Sunday night -->
  <section id="the-week" class="section bg-white border-t border-gray-100 scroll-mt-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-lg text-gray-500 italic mb-4">
            Sunday night, kitchen table, three pupils to move and a diary full of pencil marks.
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
            Move a lesson. Everything else catches up.
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Drag it and it's done. Three-way conflict checking means you can't double-book a
            pupil, an instructor, or a car. Day, week and month views — the month view shows
            you where the gaps are.
          </p>
          <a href="/driving-school-scheduling-software/" class="text-brand-red font-semibold hover:underline">
            See how scheduling works &rarr;
          </a>
        </div>
        <div>
          <ProductDemo
            poster="/images/marketing/calendar-week-view.webp"
            width={1440}
            height={900}
            alt="A lesson is dragged from Tuesday to Thursday in the weekly calendar; a second drag onto a clashing slot raises a conflict warning."
          />
        </div>
      </div>
    </div>
  </section>
```

No `src` yet — `ProductDemo` renders the poster. When `calendar-drag.mp4` is delivered, add
`src="/videos/marketing/calendar-drag.mp4"` and nothing else changes.

- [ ] **Step 2: Run the build**

Run: `npm run build`

Expected: PASS, all three verifiers green.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage section 3: scheduling, Sunday night"
```

---

### Task 4: §4 — "Know exactly what to teach before you pull up."

**Files:**
- Modify: `src/pages/index.astro` (the `id="know-what-to-teach"` section)

**Interfaces:**
- Consumes: `ProductDemo` (Task 1), the `id="know-what-to-teach"` shell (Task 2).

- [ ] **Step 1: Fill the section**

Replace the empty `<section id="know-what-to-teach">` element with:

```astro
  <!-- §4 AI lesson briefings — the morning -->
  <section id="know-what-to-teach" class="section bg-gray-50 border-t border-gray-100 scroll-mt-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="order-2 lg:order-1">
          <ProductDemo
            poster="/images/marketing/ai-briefing-mobile.webp"
            width={640}
            height={1308}
            alt="A lesson card is opened and its AI briefing is already written: what was covered last time, what the pupil struggled with, and what to focus on today."
            phone
          />
        </div>
        <div class="order-1 lg:order-2">
          <span class="badge-primary mb-4">AI · BUILT IN</span>
          <p class="text-lg text-gray-500 italic mb-4">
            You pull up outside their house trying to remember what went wrong at that
            roundabout three weeks ago.
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
            Know exactly what to teach before you pull up.
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Open the lesson and the briefing is already written: what you covered, what they
            struggled with, what to work on today. Four sentences, ten seconds to read.
            Written by Claude — and your data is never used to train it.
          </p>
          <a href={OFFER.ctaPrimary.href} class="text-brand-red font-semibold hover:underline">
            {OFFER.ctaPrimary.label} &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>
```

There is no existing page about lesson briefings, so this section carries a signup CTA. Plan 2 replaces that link with `/features/lesson-briefings`.

- [ ] **Step 2: Run the build**

Run: `npm run build`

Expected: PASS. Note `verify-claims.js` scans this copy — "your data is never used to train it" is a supported claim (Anthropic is a listed privacy-policy sub-processor).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage section 4: AI lesson briefings"
```

---

### Task 5: §5 — "Logged before they've shut the door."

**Files:**
- Modify: `src/pages/index.astro` (the `id="log-the-lesson"` section)

**Interfaces:**
- Consumes: `ProductDemo` (Task 1), the `id="log-the-lesson"` shell (Task 2).

- [ ] **Step 1: Fill the section**

Replace the empty `<section id="log-the-lesson">` element with:

```astro
  <!-- §5 Progress tracking — in the car -->
  <section id="log-the-lesson" class="section bg-white border-t border-gray-100 scroll-mt-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-lg text-gray-500 italic mb-4">
            Notes get written up at eleven at night, or they don't get written up at all.
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
            Logged before they've shut the door.
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Tap the skill, set the level, done. 27 DVSA competencies across 8 categories, six
            levels from Not Started to Reflection. Any instructor picks up exactly where the
            last one left off — and pupils can see their own progress in their portal, so they
            stop asking how they're doing.
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <a href="/how-progress-works/" class="text-brand-red font-semibold hover:underline">
              See how progress tracking works &rarr;
            </a>
            <a href="/dvsa-27-driving-skills/" class="text-gray-500 hover:text-brand-red hover:underline transition-colors">
              Explore the 27 DVSA skills &rarr;
            </a>
          </div>
        </div>
        <div>
          <ProductDemo
            poster="/images/marketing/dvsa-progress-tracking.webp"
            width={1440}
            height={900}
            alt="A single DVSA competency is tapped in the progress grid and its proficiency level is set; the grid cell updates immediately."
          />
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Run the build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage section 5: DVSA progress tracking"
```

---

### Task 6: §6 — "They've already paid before they open the door."

**Files:**
- Modify: `src/pages/index.astro` (the `id="paid-before-they-turn-up"` section)

**Interfaces:**
- Consumes: `ProductDemo` (Task 1), the `id="paid-before-they-turn-up"` shell (Task 2).

This is the strongest section on the page and the only one shot from the pupil's side, on a phone — a deliberate viewpoint switch saying *here is what your pupils see*. It runs on the navy background to set it apart.

- [ ] **Step 1: Fill the section**

Replace the empty `<section id="paid-before-they-turn-up">` element with:

```astro
  <!-- §6 Packages and pre-payment — the pupil's phone -->
  <section id="paid-before-they-turn-up" class="section bg-brand-navy text-white scroll-mt-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="order-2 lg:order-1">
          <ProductDemo
            poster="/images/marketing/portal-dashboard-mobile.webp"
            width={640}
            height={1308}
            alt="A pupil opens the package catalogue on their phone, buys a ten-lesson block by card, and books their first slots."
            phone
          />
        </div>
        <div class="order-1 lg:order-2">
          <span class="badge-primary mb-4">WHAT YOUR PUPILS SEE</span>
          <p class="text-lg text-gray-300 italic mb-4">
            Asking a 17-year-old for £35 at the kerb, in the rain, is nobody's favourite part
            of this job.
          </p>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            They've already paid before they open the door.
          </h2>
          <p class="text-lg text-gray-300 mb-6">
            Pupils browse your blocks in their own portal, pay by card through Stripe, and the
            balance keeps itself up to date. Anything still outstanding gets a payment link
            they can tap without logging in. Someone who's paid for ten lessons doesn't cancel
            on a Sunday night.
          </p>
          <a href="/driving-instructor-accounting-software/" class="text-white font-semibold underline hover:text-brand-red transition-colors">
            See how getting paid works &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Run the build**

Run: `npm run build`

Expected: PASS. Every claim here is verified live and ungated per spec §8 — portal package catalogue, Stripe card payments (`stripeConnectFlag` ON), and `/pay/[token]` tokenised payment without login.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage section 6: packages and pre-payment

The page's strongest section and the only one shot from the pupil's
side. Pre-payment is the no-show cure, not just a payments feature, so
invoicing folds in here rather than getting a section that offers to
help you chase."
```

---

### Task 7: §7 — "They pass. The review request goes out that afternoon."

**Files:**
- Modify: `src/pages/index.astro` (the `id="get-found"` section)

**Interfaces:**
- Consumes: `ProductDemo` (Task 1), the `id="get-found"` shell (Task 2).

- [ ] **Step 1: Fill the section**

Replace the empty `<section id="get-found">` element with:

```astro
  <!-- §7 Review collection — end of month -->
  <section id="get-found" class="section bg-white border-t border-gray-100 scroll-mt-20">
    <div class="container-custom">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-lg text-gray-500 italic mb-4">
            Word of mouth got you every pupil you've ever had. It just doesn't scale.
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-brand-navy mb-6">
            They pass. The review request goes out that afternoon.
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Requests go to your Google Business Profile automatically, on the day they're
            happiest to write one — the reviews that bring you the next pupil.
          </p>
          <a href={OFFER.ctaPrimary.href} class="text-brand-red font-semibold hover:underline">
            {OFFER.ctaPrimary.label} &rarr;
          </a>
        </div>
        <div>
          <ProductDemo
            poster="/images/marketing/dashboard-overview.webp"
            width={1440}
            height={900}
            alt="A pupil is marked as having passed their test and a Google review request is sent to them automatically the same day."
          />
        </div>
      </div>
    </div>
  </section>
```

Two constraints held here. The copy stays **mechanical** — it says requests are sent, never that the site will rank higher, which is not supportable and which `verify-claims.js` cannot catch. And there is no existing reviews page, so this carries a signup CTA until Plan 2 adds `/features/reviews`.

The poster is a stand-in: `dashboard-overview.webp` is the closest existing capture. Replace it with a purpose-shot still when clip 5 is recorded.

- [ ] **Step 2: Run the build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Add homepage section 7: automated review collection"
```

---

### Task 8: Correct the setup-time claim from ten minutes to five

**Files:**
- Modify: `src/pages/pricing.astro:115`, `src/pages/pricing.astro:328`
- Modify: `src/pages/index.astro` (any surviving instances)
- Modify: `src/pages/get-started.astro:305`
- Modify: `src/pages/driving-instructor-software.astro:48,183,316`
- Modify: `src/pages/ads/driving-school-software.astro:57,479`

**Interfaces:** none.

JP confirmed on 2026-09-10 that setup takes five minutes. The site understates it in eleven editorial places. Write it as a plain product fact, never as a footnoted statistic — a footnote implies measurement we do not have.

- [ ] **Step 1: List the current instances**

Run:

```bash
grep -rn "10 minutes\|ten minutes" src/pages src/components \
  | grep -v "5–10 minutes\|5-10 minutes" \
  | grep -v "Genuinely easier than my paper diary\|I ran my diary on WhatsApp"
```

Expected: 12 lines. Eleven are editorial and in scope. The twelfth — `src/components/Testimonials.astro:8`, the `highlight: "Set up in 10 minutes"` label — is **out of scope**: it belongs to a testimonial card and is handled when real testimonials replace it.

- [ ] **Step 2: Apply the replacements**

Two things must NOT be touched, and a blind find-and-replace will hit both:
- `"saves 5–10 minutes per lesson"` in `ads/driving-school-software.astro:89,218` and `compare/total-drive.astro:238` — a different metric (briefing reading time), still accurate.
- The quoted testimonial text in `get-started.astro:225`, `ads/driving-school-software.astro:320` and `Testimonials.astro:4` — attributed speech, handled with the testimonial replacement.

Apply these exact edits:

```bash
# "about 10 minutes" -> "about five minutes" (FAQ answers and headings)
sed -i '' 's/set up in about 10 minutes/set up in about five minutes/g' src/pages/pricing.astro src/pages/index.astro
sed -i '' 's/Set up in about 10 minutes/Set up in about five minutes/g' src/pages/index.astro src/pages/get-started.astro src/pages/driving-instructor-software.astro
sed -i '' 's/up and running in about 10 minutes/up and running in about five minutes/g' src/pages/index.astro
sed -i '' 's/first lessons in about ten minutes/first lessons in about five minutes/g' src/pages/driving-instructor-software.astro
sed -i '' 's/Set up in about ten minutes\./Set up in about five minutes./g' src/pages/driving-instructor-software.astro
sed -i '' 's/fully set up within 10 minutes/fully set up within five minutes/g' src/pages/ads/driving-school-software.astro
```

- [ ] **Step 3: Verify exactly the right lines changed**

Run:

```bash
grep -rn "10 minutes\|ten minutes" src/pages src/components
```

Expected: exactly **six** remaining lines, all of them correct to leave —
`ads/driving-school-software.astro:89`, `ads/driving-school-software.astro:218` and
`compare/total-drive.astro:238` (the per-lesson metric), plus
`get-started.astro:225`, `ads/driving-school-software.astro:320` and
`Testimonials.astro:4` / `Testimonials.astro:8` (testimonial text and its label).

Then run `git diff` and read every changed line. Confirm no quoted testimonial and no per-lesson claim was altered.

- [ ] **Step 4: Run the build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages
git commit -m "Correct setup time from ten minutes to five

JP confirmed setup takes five minutes; the site understated it in
eleven editorial places. Written as a plain product fact rather than a
footnoted statistic, since we have no measurement.

Leaves alone the 'saves 5-10 minutes per lesson' briefing claim (a
different metric) and the 'ten minutes' inside testimonial quotes
(attributed speech, replaced with the real testimonials)."
```

---

### Task 9: Full verification, deploy, and changelog

**Files:**
- No source changes.

**Interfaces:** none.

- [ ] **Step 1: Clean rebuild from scratch**

Run: `rm -rf dist .astro && npm run build`

Expected: PASS. `astro check` clean, then all three verifiers green. A clean rebuild matters here specifically — a stale `dist/` being rsynced is the documented root cause of the recurring zombie-page bug on this estate.

- [ ] **Step 2: Review the page in a browser**

Run: `npm run preview` and open the homepage.

Check by eye, because no verifier can:
- The five sections read in the week's order and each one's headline states an outcome, not a feature name.
- "See it work" scrolls to the calendar section, not to a static phone.
- All five posters load; none is a broken image.
- The navy §6 band reads as a deliberate change of viewpoint, not a mistake.
- Nothing below §7 was disturbed — the four feature cards, testimonials, switching reassurance, calculator, pricing, FAQ and final CTA are all present.

Then set the OS to reduced-motion (macOS: System Settings → Accessibility → Display → Reduce motion) and reload. Nothing should animate. This currently changes nothing because no clips exist, but it confirms the code path before video lands.

- [ ] **Step 3: Get JP's approval to deploy**

Do not deploy without it. Show him the preview first.

- [ ] **Step 4: Deploy**

```bash
cd /Users/john/Projects-code/Front-end-sites
./deploy.sh mydriveschool.software
```

The script rebuilds clean, shows a `--delete` dry run for confirmation, deploys to
`lightsail:/var/www/driveschoolpro.com/`, and fails unless the live sitemap matches the fresh
build. Do not fall back to a manual `rsync` — the guard is the point.

- [ ] **Step 5: Log the SEO changelog entry**

Required by CLAUDE.md after any SEO-related change. Run:

```bash
cd /Users/john/Projects-code/Front-end-sites/tools/gsc-client
node src/enhanced-report.js \
  --log-change="Restructured driveschoolpro.com homepage around the instructor's working week: five benefit sections using pain sentence, outcome headline, product demo and proof line. Added ProductDemo component (silent looping MP4 with poster fallback) and verify-demos.js. Corrected the setup-time claim from ten minutes to five in eleven places." \
  --sites=driveschoolpro.com \
  --category=content \
  --reason="Homepage sold features by name and illustrated them with static screenshots; the hero's 'see how it works' CTA landed on a still image. Competitor research (Xero, Shopify, Proton, Total Drive, Lesson Diary) shows a consistent pain-to-outcome-to-demo pattern the site was not following. With no social proof available during free early access, product demonstration substitutes for it." \
  --expected-impact="Higher homepage engagement and signup conversion; lower bounce from the hero CTA" \
  --expected-timeline="2-4 weeks"
```

- [ ] **Step 6: Open the PR**

```bash
git push -u origin design/benefit-led-content-architecture
gh pr create --title "Benefit-led homepage restructure and ProductDemo component" --body "$(cat <<'EOF'
Rebuilds the homepage around the instructor's working week, per
`docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md`.

- New `ProductDemo.astro`: silent looping MP4, poster fallback, lazy load, reduced-motion safe
- New `scripts/verify-demos.js` in the postbuild chain
- Five benefit sections replacing feature-named rows
- Hero CTA now lands on a moving demo instead of a static screenshot
- Setup-time claim corrected to five minutes in eleven places

Videos are not yet cut — every `ProductDemo` renders its poster, so the
page is complete without them. Adding a `src` prop is the only change
needed when clips land.

Plan 2 (the `/features` hub) follows.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_016uhxhvXmPcBuRWvEQCjZqD
EOF
)"
```

---

## Follow-ups (not in this plan)

- **Plan 2: the `/features` hub** — six pages, nav entry, and repointing the §4 and §7 CTAs from signup to `/features/lesson-briefings` and `/features/reviews`.
- **Clips.** When each MP4 lands, add `src="/videos/marketing/<name>.mp4"` to its `ProductDemo` and re-run `npm run build`. `verify-demos.js` will then enforce the full attribute set. Check every clip against `src/config/features.ts` before publishing — video is a claim surface no verifier can read.
- **Testimonials.** Blocked on JP. The four quotes in `Testimonials.astro` are attributed to named individuals with no placeholder marking and surface as JSON-LD `Review` entries. Replace or mark them.
- **A setup-time guard** in `verify-claims.js` (`FORBIDDEN`: `set up in about 10 minutes`, `fully set up within 10 minutes`, `up and running in about 10 minutes`) — add only after the testimonial text is resolved, or it will fail on the quotes.
