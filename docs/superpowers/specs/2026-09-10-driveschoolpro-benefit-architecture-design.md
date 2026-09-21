# DriveSchoolPro — Benefit-Led Content Architecture

**Date:** 2026-09-10
**Status:** Approved design, ready for implementation planning
**Scope:** Homepage restructure + new `/features` hub + `<ProductDemo>` video component

---

## 1. Problem

The homepage (`src/pages/index.astro`, 710 lines, 12 sections) sells features by name and
illustrates them with still screenshots. Its two strongest rows are headed
**"Drag-and-Drop Scheduling"** and **"DVSA Competency Tracking"** — the names of the
mechanisms, not what changes for the instructor. The hero's "See how it works" button
jumps to `#ai-briefings`, which is a static 640×1308 phone capture: the most prominent
moment on the page is also the most inert.

Every reference site studied does the same thing differently, and does it the same way as
each other:

| Site | Structural move |
|---|---|
| lessondiary.co.uk | One page per job-to-be-done; opens on a pain sentence — *"Progress is easy to feel and hard to prove."* Runs a comparison section naming DriveSchoolPro. |
| totaldrive.co.uk | Leads on scale (8,600 instructors). Feature blocks named after **tasks**: "Plan your diary", "Manage your pupils", "Record your transactions". |
| xero.com/uk | Every headline is the outcome: *"Picture this: no data entry"*, *"Goodbye admin"*, *"Get paid 2x faster¹. Sleep 4x better."* Numbers footnoted. |
| protonvpn.com | Problem → mechanism → proof, repeated three times, then a competitor table. |
| shopify.com/uk | ~40% aspiration / 60% concrete. Feature blocks 20–30 words with a link out; the homepage is an index, depth lives elsewhere. |

The shared pattern, absent from our homepage:
**pain sentence → outcome headline → one moving demo → one proof line → link to depth.**

## 2. Strategy

**Demonstration substitutes for social proof.**

Total Drive leads with 8,600 instructors. Xero leads with 5 million customers. Proton leads
with 100 million users. DriveSchoolPro is in free early access until 31 March 2027 and the
current stats bar footnotes *"based on early user feedback"*. The conventional SaaS trust
engine is not available yet.

Silent product video is the substitute. A ten-second loop of a lesson actually being dragged
across a diary is a claim that cannot be fabricated. This reframes the clips from decoration
to **the load-bearing trust mechanism of the page** — which is why the component and the shot
list are specified before the copy is implemented, and why the copy is written to serve the
clips rather than the reverse.

Upgrade path: once real usage data exists (6–12 months), layer Xero's quantified-outcome
headlines on top of this structure. It does not require re-architecting.

## 3. Decisions taken

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Homepage + `/features` hub | No `/features` surface exists today; Lesson Diary ranks on exactly that shape |
| Audience | Instructors and schools only | Learners never buy. `/driving-skills` and blog stay as SEO/authority traffic |
| Media | Silent looping MP4, autoplay | ~10–20× smaller than equivalent GIF, crisper text, degrades to the existing poster stills |
| Ordering | Chronological — the instructor's week | Maps 1:1 to clips; an instructor recognises their own week |
| Rejected: pain-stack ordering | — | Five consecutive problem-first sections reads bleak. The 2023 DVSA survey has 91.4% of ADIs reporting personal accomplishment; density of pain risks insulting the reader |
| Rejected: quantified outcomes now | — | Would footnote numbers we do not have. Revisit with data |

## 4. Section anatomy

Every benefit section on the homepage uses this five-part structure, in order:

```
PAIN SENTENCE      one line, the instructor's words, no product mention
OUTCOME HEADLINE   what changes — never the feature's name
DEMO LOOP          6–15s silent MP4, poster fallback
PROOF LINE         a number, a mechanism, or a named user
LINK TO DEPTH      → /features/<moment>
```

The governing discipline: **the headline is never the feature's name.**

## 5. Homepage running order

Sections follow the instructor's working week.

| # | Section | Moment | Clip | Sells |
|---|---|---|---|---|
| 1 | Hero | — | — | — |
| 2 | Trust bar | — | — | — |
| 3 | The week plans itself | Sunday night | Drag lesson, conflict fires | Time |
| 4 | Know what to teach before you pull up | Morning | Lesson card → briefing | Time |
| 5 | Logged before they've shut the door | In the car | DVSA skill, tap, saved | Time |
| 6 | They've paid before they turn up | — | **Pupil's phone**: catalogue → buy → book | Money + no-shows |
| 7 | Get found by pupils who don't know you | End of month | Review request → Google profile | Money |
| 8 | Proof / testimonials | — | — | — |
| 9 | Switching reassurance (keep existing) | — | — | — |
| 10 | Everything else (feature cards, condensed) | — | — | — |
| 11 | Revenue calculator teaser (keep) | — | — | — |
| 12 | Pricing teaser → FAQ → final CTA (keep) | — | — | — |

Five clips. Sections 3–5 sell time back; 6–7 sell money.

Section 6 is the only clip shot **on a phone, from the pupil's side** — a deliberate viewpoint
switch mid-page saying *here is what your pupils see*. It renders through `ProductDemo`'s
`phone` prop, which reproduces the phone-frame treatment already used by
`MarketingScreenshot.astro`'s `mobile` variant (that component itself is left untouched — §7).

The hero's secondary CTA now targets `#the-week` (section 3, a moving calendar) rather than
`#ai-briefings` (a still). This is the specific defect that prompted the work.

### 5.1 Copy

Written against the truth constraints in §8. All of it is claimable as of 2026-09-10.

---

**§1 — Hero**

> **Teach. Everything else runs itself.**
>
> Pupils book and pay on their phones. Lesson briefings write themselves. Review requests go
> out on the day they pass. You get in the car and teach.
>
> `[Get started free →]`  `[See it work]`
> No credit card required • Free until 31 March 2027

*Note: "runs itself" is defensible — the pupil self-serves booking and payment, the AI writes
the briefing, review requests fire automatically. It is the product's honest through-line.*

---

**§3 — Scheduling** → `/features/scheduling`

> Sunday night, kitchen table, three pupils to move and a diary full of pencil marks.
>
> **Move a lesson. Everything else catches up.**
>
> *[clip: calendar-drag, 10s]*
>
> Drag it and it's done. Three-way conflict checking means you can't double-book a pupil, an
> instructor, or a car. Day, week and month views — the month view shows you where the gaps are.
>
> → See how scheduling works

---

**§4 — AI lesson briefings** → `/features/lesson-briefings`

> You pull up outside their house trying to remember what went wrong at that roundabout three
> weeks ago.
>
> **Know exactly what to teach before you pull up.**
>
> *[clip: briefing-generate, 8s]*
>
> Open the lesson and the briefing is already written: what you covered, what they struggled
> with, what to work on today. Four sentences, ten seconds to read. Written by Claude — and
> your data is never used to train it.
>
> → See how briefings work

---

**§5 — Progress tracking** → `/features/progress-tracking`

> Notes get written up at eleven at night, or they don't get written up at all.
>
> **Logged before they've shut the door.**
>
> *[clip: dvsa-log, 6s]*
>
> Tap the skill, set the level, done. 27 DVSA competencies across 8 categories, six levels from
> Not Started to Reflection. Any instructor picks up exactly where the last one left off — and
> pupils can see their own progress in their portal, so they stop asking how they're doing.
>
> → See how progress tracking works

---

**§6 — Packages and pre-payment** → `/features/getting-paid`

> Asking a 17-year-old for £35 at the kerb, in the rain, is nobody's favourite part of this job.
>
> **They've already paid before they open the door.**
>
> *[clip: pupil-buys-block, 14s, phone frame]*
>
> Pupils browse your blocks in their own portal, pay by card through Stripe, and the balance
> keeps itself up to date. Anything still outstanding gets a payment link they can tap without
> logging in. Someone who's paid for ten lessons doesn't cancel on a Sunday night.
>
> → See how getting paid works

---

**§7 — Review collection** → `/features/reviews`

> Word of mouth got you every pupil you've ever had. It just doesn't scale.
>
> **They pass. The review request goes out that afternoon.**
>
> *[clip: review-request, 10s]*
>
> Requests go to your Google Business Profile automatically, on the day they're happiest to
> write one — the reviews that bring you the next pupil.
>
> → See how reviews work

*Constraint: keep this mechanical. "Get found on Google" is acceptable as a headline; any body
claim that the site improves search ranking is not supportable and `verify-claims.js` would not
catch it.*

---

**§8 — Proof**

`[PLACEHOLDER]` — blocked on three named testimonials (name, town, one sentence, permission).
Until they exist, this section renders the existing `Testimonials.astro` content. See §10.

### 5.2 Sections retired or merged

- **"DVSA 27 Skills" navy section** → merges into §5; depth moves to
  `/features/progress-tracking` and the existing `/dvsa-27-driving-skills/`
- **"Why Schools Choose DriveSchoolPro"** → merges into §8 proof
- **"Built for All Sizes"** → condensed into §10
- **"Everything You Need" 4 cards** → kept, moved below the fold as the catch-all
- **Stats bar** → kept with its honest footnote intact

## 6. `/features` hub

Six new pages:

```
/features/                      index
/features/scheduling
/features/lesson-briefings
/features/progress-tracking
/features/getting-paid
/features/reviews
```

Per-page structure (adapted from lessondiary.co.uk, the best thing on their site):

1. **H1 = the outcome**, never the feature name
2. **Pain paragraph** — one short paragraph
3. **Hero demo** — the homepage clip or a longer cut
4. **Three H2 sub-benefits**, each with its own small clip or existing screenshot
5. **"How it works"** — three concrete steps
6. **FAQ** + `FAQPage` JSON-LD via the existing `src/components/seo/FAQEnhanced.astro`
7. **CTA**, then related links: parent pillar + two sibling feature pages

900–1,200 words each. Shorter and more concrete than the keyword pillars — these are
conversion pages for people already evaluating the product.

**Navigation:** add `Features` as a fourth `menuSections` entry in `Navigation.astro`,
positioned ahead of `Software`.

**Internal linking:** homepage links to all five; each pillar links to its matching feature
page; siblings cross-link. Every feature page launches with ≥3 inbound links.

## 7. `<ProductDemo>` component

New file `src/components/ProductDemo.astro`. **Not** an edit to `MarketingScreenshot.astro`,
which is used in ~10 places and should not be destabilised. `ProductDemo` falls back to
rendering a plain image when given no video source, so the two coexist.

```astro
<ProductDemo
  src="/videos/marketing/calendar-drag.mp4"
  poster="/images/marketing/calendar-week-view.webp"
  width={1440} height={900}
  alt="A lesson is dragged from Tuesday to Thursday; a conflict warning appears and the slot turns amber."
  phone={false}
/>
```

Required behaviour:

| Requirement | Why |
|---|---|
| `autoplay muted loop playsinline` | Without `playsinline`, iOS Safari takes the video fullscreen |
| `preload="none"` + IntersectionObserver load | Four of five clips are below the fold; eager loading would wreck Core Web Vitals |
| `prefers-reduced-motion: reduce` → no autoplay, poster + play button | Accessibility requirement, not a nicety — autoplaying motion triggers vestibular symptoms |
| Explicit `width`/`height` | No layout shift |
| Visually-hidden text alternative from `alt` | `<video>` has no `alt` attribute; without this the page's load-bearing content is invisible to screen readers |
| Same `rounded-xl shadow-lg border` as `MarketingScreenshot` | Videos and stills must sit together consistently |
| Missing video file → poster renders | Pages ship before clips exist |

Assets live in `public/videos/marketing/`. Budget ≤1.5MB per clip.

## 8. Truth constraints

Ground truth is the app's feature-flag state, **not** this document. See
`src/config/features.ts` and the memory note `project_driveschoolpro_marketing_claims.md`.

**Verified claimable as of 2026-09-10** (flag state confirmed 2026-09-03; portal/package
surfaces confirmed ungated by inspection of the app repo):

- Student portal, package catalogue (`PackageCatalog.tsx`, `PurchasePackageModal.tsx`),
  phone-first booking wizard (`DayStrip`, `SlotChips`, `InstructorSelector`) — **live, ungated**
- `/pay/[token]` tokenised invoice payment, no login — **live**
- `stripeConnectFlag` — **ON**, confirmed by JP against Vercel Production
- Google review requests (`reviewUrl` plumbing, `/settings/reviews`) — **live, no flag**
- DVSA: 27 competencies / 8 categories / 6 levels (Not Started → Reflection)
- Calendar: day / week / month only. Month is a heatmap. **One-way ICS export only** — no
  two-way calendar sync
- AI briefings via Claude (Anthropic); data never used for training

**Hidden in production — must not appear in copy or in video frames:** recurring bookings,
parent access, student documents tab, and the utilisation / tests / compliance reports. Lesson
confirmation is off (proven by `/confirm/<token>` → 404). WhatsApp is "coming soon"; SMS is not
used at all. LEAVE.REVIEW LTD is not VAT-registered — never write "inc VAT".

**`scripts/verify-claims.js` runs in postbuild and fails the build on a false claim in text.**

## 9. Risks

**Video is an unguarded claim surface.** `verify-claims.js` parses built HTML; it cannot see
inside an MP4. A flag-hidden feature appearing in a nav bar or sidebar in the background of a
clip is a live false claim with no automated guard. Mitigation: record against production flag
state, frame to exclude gated UI, and review every clip against `features.ts` before publishing.
This check is a required step in the implementation plan, not an optional one.

**`/features/scheduling` vs `/driving-school-scheduling-software/`.** Same topic, potential
duplicate signal. Position pillars as keyword-led search entry points and feature pages as
product truth for active evaluators — materially different content, both keeping self-canonicals.
Monitor GSC impressions for cannibalisation. **Fallback if it occurs:** fold the pillar's unique
content into the feature page and 301 the pillar.

**Core Web Vitals.** Five autoplaying videos is the single biggest regression risk on a site
that has been tuned. `preload="none"` plus intersection-triggered loading is mandatory, not
advisory. Measure before and after.

**Demo data as personal data.** Clips must use a fictional school. Publishing real pupil names
or details would be a UK GDPR breach and would contradict the site's own trust bar.

## 10. Open questions — blocked on JP

1. **Three named testimonials** (name, town, one sentence, permission to publish). §8 is
   `[PLACEHOLDER]` until these exist. Highest-leverage single input to the page.
   **Also urgent independent of this project:** the four quotes currently in
   `src/components/Testimonials.astro` are attributed to named individuals ("Sarah J.,
   Birmingham, Independent ADI") with specific claims ("one no-show in the last month") and
   carry no placeholder marking, so they read as real. They also appear as `Review` entries
   in JSON-LD. Replace them with the real testimonials when they arrive; until then they
   should be marked or pulled. JP flagged for 2026-09-11.
2. ~~Is "set up in about 10 minutes" measured or estimated?~~ **Answered 2026-09-10 (JP):
   setup is five minutes.** The site currently understates this in **eleven** editorial
   places across six files (`pricing.astro` ×2, `index.astro` ×3, `get-started.astro` ×1,
   `driving-instructor-software.astro` ×3, `ads/driving-school-software.astro` ×2), plus a
   twelfth in the `highlight` label of `Testimonials.astro` which goes with item 1. Correct
   to five as part of implementation. Write it as a plain product fact ("Setting up takes
   about five minutes"), **not** as a footnoted statistic — a footnote implies measurement
   we do not have. Do **not** alter the "ten minutes" inside testimonial quotes; those are
   attributed speech and are handled by item 1 below. Unrelated: the "saves 5–10 minutes per
   lesson" briefing claim is a different metric — leave it.
3. **First-week verbatims** — what early users actually say, warts included. Source material
   for headline copy.
4. **Recorded objections** — what made someone decline. Feeds the FAQ and §9 reassurance.
5. Any third-party badge at all (DIA listing, Capterra/G2 profile).

## 11. Sequencing

Build first, record second. The component degrades to poster images and fifteen real `.webp`
captures already exist, so the restructured pages ship and improve the site before any clip is
cut. The copy directs the clip, not the reverse.

**Exception:** record clip 1 (`calendar-drag`) as a pilot before the rest, to validate file size
at capture settings, text legibility at rendered width, loop seam, and flag leakage.

## 12. Out of scope

- Rewriting the eight existing pillar/money pages (beyond adding links to feature pages)
- The `/driving-skills` learner content and the blog
- Narrated video
- Pricing or offer changes
- Any change to `MarketingScreenshot.astro`

---

## Appendix A — Shot list

**Global capture spec.** One fictional school reused across all five clips: same instructor,
same 6–8 pupils, plausible UK names and towns, no real pupil data. 1440×900 (clip 4: phone
viewport), same browser, same zoom, no bookmarks bar, light theme. Record 2s of stillness at
each end and start/end on the same frame so the loop does not snap. Move at roughly half
natural speed, cursor visible. Export H.264 MP4, **no audio track**, plus a poster JPG of the
first frame. Verify no flag-hidden UI is in frame (see §8).

---

**Clip 1 — `calendar-drag.mp4` · 10s · 1440×900 · §3**

Poster: `calendar-week-view.webp`

1. Open on the week view, a normal week, 5–6 colour-coded lessons visible. Hold 2s.
2. Drag Tuesday 15:00 to Thursday 15:00. Slow, deliberate.
3. Drop. The lesson lands and settles.
4. Drag a second lesson onto a slot that conflicts. Conflict warning appears.
5. Undo it, return to a calm week view matching the opening frame. Hold 2s.

*This is the pilot clip. Record and send before shooting the rest.*

---

**Clip 2 — `briefing-generate.mp4` · 8s · 1440×900 · §4**

Poster: new capture (desktop lesson card), or reuse `ai-briefing-mobile.webp` if shot on phone

1. Today view, lesson list. Hold 2s.
2. Click a lesson card to open it.
3. The AI briefing is visible — let it read on screen long enough to be legible.
4. Hold on the briefing 2s.

Briefing text must be real product output, four sentences, and must not name a real pupil.

---

**Clip 3 — `dvsa-log.mp4` · 6s · 1440×900 · §5**

Poster: `dvsa-progress-tracking.webp`

1. Open on the competency grid for one pupil. Hold 2s.
2. Tap one skill — ideally a roundabout or manoeuvre competency.
3. Set the level. The grid cell updates.
4. Hold 2s.

Must feel **fast** — this clip's headline is "logged before they've shut the door". Two
interactions maximum.

---

**Clip 4 — `pupil-buys-block.mp4` · 14s · phone viewport · §6**

Poster: `portal-dashboard-mobile.webp`

Longest and most important clip; shot from the **pupil's** side, in the phone frame.

1. Pupil portal on a phone. Hold 2s.
2. Open the package catalogue. Blocks visible with prices.
3. Tap a 10-lesson block.
4. Purchase modal → pay by card. Do not show real card details; use Stripe test-mode UI.
5. Confirmation, balance updates.
6. Move to booking — day strip, pick a slot chip, confirm.
7. Hold 2s on the booked state.

If 14s is tight, drop step 6 into a separate short clip for `/features/getting-paid` rather
than rushing.

---

**Clip 5 — `review-request.mp4` · 10s · 1440×900 · §7**

Poster: new capture

1. Pupil record or test result, marked as passed. Hold 2s.
2. Review request fires / is visible as sent.
3. Cut or pan to the resulting Google review request as the pupil sees it.
4. Hold 2s.

Show the **mechanism**, not a ranking claim.
