# Claims Remediation Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 1–3 are
> unblocked and can run immediately. Task 4 is blocked on a decision from JP. Task 5 is the
> systematic pass that prevents a repeat.

**Goal:** Make every product and pricing claim on driveschoolpro.com true, and leave behind a
claims register plus guards so the next false claim is caught by the build rather than by luck.

**Architecture:** Content edits across 41 pages, each backed by a named evidence path in the
`driveschoolpro` app repo. Every correction gains a `verify-claims.js` rule so its wording cannot
return. The durable output is `docs/claims-register.md` — one row per claim, its page, and the
`file:line` in the app that proves it.

**Tech Stack:** Astro 5.x static site. No test framework; verification is `npm run build`, whose
`postbuild` runs `verify-seo.js`, `verify-claims.js` and `verify-demos.js`.

**Origin:** Found on 2026-09-10 while auditing the two `/compare/*` pages, after four false claims
were found earlier the same day in the homepage and `/features` work.

## Global Constraints

- **Ground truth is the app, never this document.** Every claim cites `driveschoolpro/src/...`.
- **A green `verify-claims.js` proves nothing.** It only proves no *known-bad wording* is present.
  Five false claims passed green builds today. Read the code path.
- **Never mass-replace claim wording without reading each hit.** Two of today's near-misses were
  legitimate editorial uses of guarded phrases.
- **Do not alter `changelog.astro` entries as if they were marketing copy.** They are dated
  historical records; correcting one means adding a new dated entry, not rewriting the old.
- **The two `/ads/*` and two PPC lander pages are external contracts** (live Google Ads). URLs and
  H1s must not change. Body copy may.
- Brand tokens only. Offer text from `src/config/offer.ts`. Not VAT-registered.
- Deploy only via `./deploy.sh mydriveschool.software`. After any deploy, submit changed URLs to
  the Indexing API and log an SEO changelog entry.

---

### Task 0: BLOCKED — the commission decision (JP)

**Nothing in Task 4 can start until this is answered.**

The site says "we take no commission" in **17 places across 8 pages**. The app charges **3%**:

- `driveschoolpro/src/lib/utils/connect-fees.ts:14-25` — *"The platform commission is 3%,
  percent-only (#1139, JP 2026-08-24: 3%, everyone, from launch, tips excluded). It applies to
  FOUNDING orgs too: the free launch means no SUBSCRIPTION fee until 31 March 2027, not no
  commission."*
- `driveschoolpro/prisma/schema.prisma:1081` — `platformFeePercent Decimal @default(3)`
- Read by all four charge sites: `services/stripe/direct-checkout.ts`,
  `services/payment-request.ts`, the portal lesson `payment-intent` route, and the invoice
  pay-link `create-intent` route.

**Question 1 — are founding orgs overridden to 0% in production?** `platformFeePercent` is
per-org overridable and only the production database knows. If yes, the copy is true for today's
users but false for the next non-founding signup.

**Question 2 — if not overridden, what should the copy say?** Suggested:
*"We charge 3% on card payments you collect through DriveSchoolPro. Stripe's own processing fee
is separate."* The connect-fees comment explicitly requires that the two not be conflated.

---

### Task 1: `/compare/total-drive/` — the non-commission fixes

**Files:** Modify `src/pages/compare/total-drive.astro`

- [ ] **Step 1: Fix the review-automation claims (3 spots)**

Line 12 — comparison table row label:
```js
{ label: 'Automated Google review requests', values: [true, false], highlight: true },
```
becomes
```js
{ label: 'Google review requests prompted at each pass', values: [true, false], highlight: true },
```

Line 44 — FAQ answer. Replace `"No. Total Drive does not automate Google review requests.
DriveSchoolPro automatically sends a review request to every pupil who passes their test — the
most effective time to ask, since they're in the best possible mood. For driving schools building
their online reputation, this is a significant difference."` with:
```
"Not that we can find on their published feature list. In DriveSchoolPro, pupils who have just passed appear on your Today screen with a Google review request ready to send in one tap — you still press send, which keeps the ask personal. Asking on pass day is the most effective time, since that is when a pupil is most willing."
```

Line 241–242 — "Where DriveSchoolPro Has the Edge". Replace the body
`'Every test pass in DriveSchoolPro triggers an automatic review request. This is the most
effective way to build Google reviews — asking at exactly the right moment. Total Drive doesn\'t
offer this.'` with:
```
'Pupils who have just passed surface on your Today screen with a Google review request ready to send. Asking on pass day is the single biggest lever on review volume, and the prompt means it stops depending on you remembering.'
```

- [ ] **Step 2: Remove the unsubstantiated time saving**

Line ~238 contains `This saves 5–10 minutes per lesson and ensures context carries between
sessions.` We have no measurement for this. Replace with:
`Context carries between sessions, so a pupil handed between instructors does not spend the first ten minutes re-explaining their own history.`

- [ ] **Step 3: Fix the third setup-time number**

Line 277: `Set up in 3 minutes and run a week of real lessons before deciding.` → `five minutes`.
JP confirmed five on 2026-09-10.

- [ ] **Step 4: Correct the stale `dateModified`**

`schemaMarkup.dateModified` is `"2026-04-19"` while the body says "Pricing verified July 2026" and
the page is being edited today. Set `dateModified` to `"2026-09-10"`.

- [ ] **Step 5: Build and commit**

```bash
npm run build
git add src/pages/compare/total-drive.astro
git commit -m "Fix review-automation, unmeasured time saving and setup time on the Total Drive comparison"
```

---

### Task 2: Review-automation sweep — the remaining 8 occurrences

**Files:** Modify `src/pages/about.astro:186`, `src/pages/driving-school-software.astro:231`,
`src/pages/ads/driving-school-software.astro:91,139`,
`src/pages/compare/driving-school-office.astro:25,183`

Same defect as Task 1, different pages. Review collection is `ReviewNudgePanel` on the Today
screen: candidates are pupils who passed a final-stage test and pupils who have gone quiet
(`driveschoolpro/src/lib/queries/review-requests.ts:64-150`); the instructor taps send. It is
hidden entirely until a Google Place ID is set.

- [ ] **Step 1: Read each of the six lines before editing.** Some may be legitimate
      ("automated email reminders" is true and adjacent in the text). Only the *review* claims
      are wrong.
- [ ] **Step 2: Reword each to "prompted / ready to send", never "automatic".**
- [ ] **Step 3: Add the guards**

In `scripts/verify-claims.js` `FORBIDDEN`, add:
```js
['triggers an automatic review', 'review collection is a nudge, not an automatic send'],
['automatic review request', 'review collection is a nudge, not an automatic send'],
['automated google review request', 'review collection is a nudge, not an automatic send'],
['automatically sends a review', 'review collection is a nudge, not an automatic send'],
```

- [ ] **Step 4: Build, confirm the guards fire on any missed instance, commit**

```bash
npm run build   # must FAIL first if any occurrence was missed, then pass once fixed
git add src/pages scripts/verify-claims.js
git commit -m "Sweep the remaining automatic-review-request claims and guard the wording"
```

---

### Task 3: One setup-time number, everywhere

**Files:** `src/pages/compare/driving-school-office.astro:191`, `src/pages/compare/index.astro:168`
(`total-drive.astro:277` is handled in Task 1)

Three numbers are currently live: three minutes, five minutes, ten minutes. JP confirmed **five**.

- [ ] **Step 1: Change both "Set up in 3 minutes" to "Set up in five minutes"**
- [ ] **Step 2: Leave the two "ten minutes" testimonial quotes alone** —
      `get-started.astro:225` and `ads/driving-school-software.astro:320` are attributed speech,
      handled when the testimonials are replaced (see the task list, item 1.2).
- [ ] **Step 3: Add a guard once the testimonials are replaced, not before** — a guard on
      "set up in 3 minutes" / "set up in ten minutes" would fail the build on those quotes today.
- [ ] **Step 4: Build and commit**

---

### Task 4: Commission remediation — BLOCKED on Task 0

**Files:** 17 occurrences across 8 files. Full list:

```
src/pages/pricing.astro:59, 91, 164, 290, 304, 316        (59 and 91 are FAQPage JSON-LD)
src/pages/ads/driving-school-software.astro:33, 391, 443  (33 is FAQPage JSON-LD; Google Ads lander)
src/pages/driving-school-software.astro:152, 402
src/pages/driving-school-management-software.astro:146, 454
src/pages/driving-instructor-accounting-software.astro:60
src/pages/compare/total-drive.astro:250
src/pages/index.astro:532
src/pages/changelog.astro:17                              (dated record — see below)
```

**If JP answers "founding orgs ARE overridden to 0%":**

- [ ] Add a dated qualifier wherever the claim appears, e.g. "no commission during early access".
      A bare "0% of your payments" is false for any org without the override.
- [ ] Add a note to `src/config/features.ts` recording the override and the date it was verified.

**If JP answers "no override — 3% applies":**

- [ ] **Step 1: Do `ads/driving-school-software.astro` first.** It is a live Google Ads landing
      page, so a false pricing claim there is an advertising problem, not only an SEO one.
- [ ] **Step 2: Then `pricing.astro`** — six occurrences, two of them in JSON-LD that Google may
      be serving as rich results.
- [ ] **Step 3: Then the remaining five pages.**
- [ ] **Step 4: `changelog.astro:17` is a dated historical entry.** Do **not** rewrite it. Add a
      new dated entry recording the correction.
- [ ] **Step 5: Guard it**
```js
['no commission', 'platform commission is 3% (connect-fees.ts, JP 2026-08-24)'],
['0% of your payments', 'platform commission is 3% (connect-fees.ts, JP 2026-08-24)'],
```
      Check `changelog.astro` needs an `ALLOW` entry so the historical record still builds.
- [ ] **Step 6: Build, commit, and treat as a priority deploy.**

---

### Task 5: Audit the remaining pages and build the claims register

41 pages exist. Today covered the homepage, six `/features` pages, `/how-progress-works/`, the
scheduling pillar and `/compare/total-drive/`. **Roughly 30 pages have never had a claim pass.**

Highest risk first:

- [ ] **Step 1: `/compare/driving-school-office/`** — the second comparison page, same class of
      competitor claims, already known to carry two review-automation errors
- [ ] **Step 2: the two PPC landers** — `driving-instructor-software.astro`,
      `driving-school-software-uk.astro`. Google Ads contracts.
- [ ] **Step 3: the four money pillars** — `driving-school-software`,
      `driving-school-management-software`, `driving-school-scheduling-software`,
      `free-driving-school-software`
- [ ] **Step 4: `about`, `get-started`, `pricing`, `dvsa-27-driving-skills`, `changelog`**
- [ ] **Step 5: the `/ads/*` variants and `/compare/index`**
- [ ] **Step 6: blog posts** — lowest risk (mostly editorial, few product claims) but
      `best-driving-school-software.md`, `drivescout-vs-drivingschoolsoftware-comparison.md` and
      `how-to-choose-driving-school-scheduling-software.md` make product and competitor claims

For each page: list every product/pricing claim, find the app code path that proves or disproves
it, fix what is wrong, add a guard.

- [ ] **Step 7: Write `docs/claims-register.md`** — one row per claim: the claim, the page(s) it
      appears on, the `file:line` in the app that backs it, the flag it depends on (if any), and
      the date verified. This is the artefact that makes the next flag flip a lookup rather than
      a rediscovery.

---

### Task 6: Ship

- [ ] **Step 1:** `rm -rf dist .astro && npm run build` — clean, all three verifiers green
- [ ] **Step 2:** `./deploy.sh mydriveschool.software`
- [ ] **Step 3:** Verify each corrected claim is gone from the live HTML with `curl`
- [ ] **Step 4:** SEO changelog entry, `--category=content`
- [ ] **Step 5:** Submit every changed URL to the Indexing API —
      `tools/gsc-client/src/request-indexing.js --site=driveschoolpro.com --urls=...`.
      Corrected pages must be recrawled or Google keeps serving the false version.
- [ ] **Step 6:** Update `~/.claude/.../memory/project_driveschoolpro_marketing_claims.md` with
      the commission fact and a pointer to the claims register.

---

## Sequencing

1. **Task 0** — ask JP now; everything commercial waits on it
2. **Tasks 1–3** — unblocked, roughly an hour, removes 14 known-false statements
3. **Task 4** — the moment Task 0 is answered; deploy immediately after
4. **Task 5** — the systematic pass, the biggest piece
5. **Task 6** — ship

**Do Tasks 1–3 and deploy before starting Task 5.** Known-false claims should not sit live while
a longer audit runs.

## Note on the video work

The task list has recording the pilot clip as the next step. **Prefer this plan first.** If the
audit changes what is true about scheduling, briefings or payments, that changes what the clips
should show — and clips are the expensive artefact to redo. A clip is also an unguarded claim
surface, so the claims register is the thing to check footage against.
