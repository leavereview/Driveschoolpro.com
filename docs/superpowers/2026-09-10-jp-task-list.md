# DriveSchoolPro — JP's checklist

**Updated:** 2026-09-11
**Live:** homepage restructure, `/features` hub (6 pages), all claim corrections to date
**Branch:** `design/benefit-led-content-architecture` · **PR:** #9

---

## 🎬 Videos — 5 clips

Full shot list (durations, framing, posters) is Appendix A of
`docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md`.

**⚠️ Do task 1.1 below before recording any of these.** The clips reuse the existing screenshots
as poster frames, and those still show the old brand name.

- [ ] **Clip 1 — `calendar-drag.mp4`** · 10s · 1440×900 · homepage §3 + `/features/scheduling/`
      Week view → drag Tuesday 15:00 to Thursday → drop → drag onto a clashing slot, conflict
      fires → undo → back to the opening frame.
      **Record this one first and send it to me** — I'll check size, legibility at rendered
      width, loop seam, and flag-hidden UI before you shoot the other four.
- [ ] **Clip 2 — `briefing-generate.mp4`** · 8s · 1440×900 · homepage §4 + `/features/lesson-briefings/`
      Today view → click a lesson card → AI briefing visible, held long enough to read.
      Briefing must be real output, four sentences, no real pupil name.
- [ ] **Clip 3 — `dvsa-log.mp4`** · 6s · 1440×900 · homepage §5 + `/features/progress-tracking/`
      Competency grid → tap one skill → set level → cell updates. **Two interactions maximum** —
      the headline is "logged before they've shut the door", so it must feel fast.
- [ ] **Clip 4 — `pupil-buys-block.mp4`** · 14s · **phone viewport** · homepage §6 + `/features/getting-paid/`
      Pupil portal → package catalogue → tap a 10-lesson block → pay (Stripe **test mode**, never
      real card details) → confirmation → day strip → pick a slot → booked.
      If 14s is tight, split the booking half into its own clip rather than rushing.
- [ ] **Clip 5 — `review-request.mp4`** · 10s · 1440×900 · homepage §7 + `/features/reviews/`
      Mark a pupil passed → they appear in the **review nudge panel on Today** → send the request.
      Show the prompt-and-tap, **not** an automatic send — that's what the copy now says.
- [ ] I wire each one in as it arrives (one `src` attribute, no other change)

**Capture spec for all five:** one fictional school reused across every clip, plausible UK names,
**no real pupil data**. 1440×900 (phone viewport for clip 4), same browser, same zoom, no
bookmarks bar, light theme. 2s of stillness at each end, start and end on the same frame so the
loop doesn't snap. Move at about half natural speed, cursor visible. Export H.264 MP4, **no audio
track**, plus a poster JPG of the first frame. Drop them in `public/videos/marketing/`.

**Keep out of frame:** recurring bookings, parent access, the student documents tab, and the
utilisation / tests / compliance reports. All hidden in production. `verify-claims.js` reads HTML,
not MP4s — a clip is the one claim surface nothing guards.

---

## 🔴 Blocking

- [ ] **1.1 Regenerate the marketing screenshots.** `public/images/marketing/*.webp` predate the
      March domain migration — the calendar shot still shows **"MyDriveSchool"** in the sidebar.
      They're on five homepage sections and six feature pages right now. Regenerate in the app
      repo: `driveschoolpro/prompts/regenerate-marketing-screenshots.md`.
      Also: `dashboard-overview.webp` is standing in for the reviews section and doesn't show the
      nudge panel — worth a purpose-shot still.
- [ ] **1.2 Three real testimonials** — name, town, one sentence, permission.
      **Separately urgent:** the four quotes in `src/components/Testimonials.astro` are attributed
      to named individuals, make specific claims ("one no-show in the last month"), carry no
      placeholder marking, and are emitted as JSON-LD `Review` entries. If real ones are more than
      a few days out, mark or pull these.
      *(Two "set up in ten minutes" quotes elsewhere on the site are the same placeholders — they
      go when these do.)*

---

## 🟡 Confirm when you get a minute

- [ ] **2.1 Is the 3% commission right?** I've rewritten 17 claims across 8 pages to say
      *"we charge 3% on card payments you collect, Stripe's processing fee separate"*, per
      `connect-fees.ts` (#1139, your 2026-08-24 call) and `platformFeePercent @default(3)`.
      **The assumption:** no per-org override. Only production knows. If founding schools *are*
      set to 0%, tell me and I'll switch to a dated "no commission during early access" qualifier.
- [ ] **2.2 Are test bookings/results really recordable in production?** I changed the copy from
      "coming soon" to live, because `LicenceTestsCard` on the student Details tab has
      `book-test-*` tiles and `quickMarkTestPassed`, sitting outside the
      `STUDENT_DETAILS_EXTRAS_ENABLED` gates. Reading code, not the running app — worth 30 seconds
      to confirm. `src/pages/index.astro` still says "coming soon" in its `highlights` array; I'll
      align it once you confirm.

---

## 🔵 Next chunk of work (mine, on your say-so)

Plan: `docs/superpowers/plans/2026-09-10-claims-remediation.md` — Task 5.

- [ ] **`/compare/driving-school-office/`** — second comparison page, competitor claims unverified
- [ ] **The two PPC landers** — `driving-instructor-software`, `driving-school-software-uk`.
      Google Ads contracts, so highest consequence
- [ ] **The four money pillars** — `driving-school-software`, `-management-`, `-scheduling-`,
      `free-driving-school-software`
- [ ] **`about`, `get-started`, `pricing`, `dvsa-27-driving-skills`, `/ads/*`, `/compare/`**
- [ ] **Blog posts** — lowest risk, but `best-driving-school-software.md`,
      `drivescout-vs-drivingschoolsoftware-comparison.md` and
      `how-to-choose-driving-school-scheduling-software.md` make product and competitor claims
- [ ] **`docs/claims-register.md`** — every claim, the page it's on, the `file:line` in the app
      that proves it, the flag it depends on, date verified. The thing that makes the next flag
      flip a lookup instead of a rediscovery

**~30 of 41 pages have still never had a claim pass.**

---

## ⚪ Small, whenever

- [ ] **`src/utils/internalLinks.ts`** — maps keywords to `/lesson-scheduling-software/` and
      `/driving-school-crm/`, neither of which exists. Nothing imports it and no post contains the
      keywords, so it's harmless today. Delete it before someone wires it up.
- [ ] **`mydriveschool.software/CLAUDE.md`** — still says the PPC landers lead with "Solo £22/mo".
      The free launch retired that.
- [ ] **Outer repo** — `tools/gsc-client/history/changes.json` has uncommitted work from before
      this session on `seo/2026-08-19-changelog-and-structural-config`, with my entries stacked on
      top. Not mine to commit.
- [ ] **`Security hardening — running.`** — stray untracked note from July in the repo root.
- [ ] **Merge PR #9.**

---

## 👀 Watch in GSC

- **Cannibalisation** — `/features/scheduling/` vs `/driving-school-scheduling-software/`, and
  `/features/progress-tracking/` vs `/how-progress-works/`. If impressions split, fold the
  pillar's unique content into the feature page and 301 it.
- **Homepage engagement** — the hero CTA now lands on a demo section rather than a still.
- **Pricing page** — it now discloses a 3% fee it didn't before. Worth watching conversion.

---

## ✅ Done

**Shipped and live:**
- `ProductDemo.astro` — silent looping MP4, poster fallback, lazy load, reduced-motion safe
- `scripts/verify-demos.js` in the postbuild chain
- Homepage rebuilt into five benefit sections on the week's spine; hero CTA fixed
- `/features` hub — 6 pages, 1,360–1,470 words each, FAQ schema, nav entry
- Setup time corrected to five minutes (was three different numbers across the site)

**Claim corrections — 5 families, all live:**
1. **Commission** — 17 claims said "no commission"; the app charges 3%
2. **Review automation** — 11 claims across 6 pages said "automatic"; it's a prompt you tap
3. **Calendar export** — claimed an instructor ICS export that doesn't exist anywhere in the app
4. **Parent portal access** — claimed on `/how-progress-works/`, contradicted by its own FAQ
5. **Per-pupil briefing toggle** — claimed on two pages; no such setting exists

Plus an unmeasured "saves 5–10 minutes per lesson" and a "most ADIs report 10+ hours" claim.
**26 guard rules** now in `verify-claims.js` so none of these wordings can return.

**The lesson, for next time:** every one of those five passed a green build. `verify-claims.js`
proves no *known-bad wording* is present — it cannot prove a claim is true. Read the code path.
