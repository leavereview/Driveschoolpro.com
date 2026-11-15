# Plan weeks 2 to 3: indexing check, FAQ batch 1, panel misses (15 Nov 2026)

Covers Claude's four assigned items from the 3 Nov plan. Changes are in the PR that adds this file.

## 1. Indexing check (GSC URL Inspection, 15 Nov)

51 URLs inspected with the `tools/gsc-client` service account: every November page plus the noindexed `/driving-school-software-uk/`.

| Result | Count | Notes |
|---|---|---|
| Submitted and indexed | 48 | Includes every compare page, both feature-page sets, the MTD posts, `/pricing/`, `/driving-instructor-diary-app/`, `/driving-instructor-booking-system/`, `/free-for-trainee-instructors/`, all three new tools. |
| URL is unknown to Google | 3 | `/switch/mydrivetime/`, `/switch/total-drive/`, `/become-a-driving-instructor/car-dual-controls-insurance/`. All added 12 Nov (3 days old), all in the sitemap, live (200) and internally linked. Submitted to the Indexing API on 15 Nov. Re-inspect on 22 Nov and again on 14 Dec. |
| Noindex check | 1 | `/driving-school-software-uk/` serves `noindex, follow`, is out of the sitemap, but Google's last crawl was 17 Oct, before the 4 Nov noindex, so Search Console still says "indexed". It drops out when Google recrawls. Not a fault. |

This replaces the "got impressions" proxy in the 12 Nov review with real inspection results. The plan's "114 of 119" baseline counted a different set of URLs, so the two figures are not like for like. Raw output was kept in the session scratchpad only.

## 2. Facebook-group questions into FAQs (batch 1, 3 of max 5)

Source: the 9 to 10 Nov export of 11 UK instructor and trainee groups (2,959 unique posts, 1,207 with a question mark; kept in `reference/driveschoolpro/Facebookgroups-driving-instructors and trainers/`). Only question themes are used. No member names or quotes appear on the site or in this file.

Themes with the most software-related questions: which app tracks bookings and reminders instead of a free calendar (new PDIs), block bookings and whether they are worth it (the most-commented payments post, 12 comments), pupils who cancel late or repeatedly, Making Tax Digital and accountants, taking payment in advance.

Already answered on the site, so not repeated: MTD thresholds and deadlines, handing an accountant the revenue report, reminders by email or text, tax-pot estimates (the income-tax calculator), PDI offers (`/free-for-trainee-instructors/`).

| Question added | Page |
|---|---|
| Are lesson blocks a good idea, and what happens to lessons a pupil doesn't use? | `/features/getting-paid/` |
| What should I do about a pupil who keeps cancelling at the last minute? | `/blog/reduce-driving-lesson-no-shows/` |
| Is Google Calendar good enough for a driving instructor? | `/driving-instructor-diary-app/` |

Product statements in the answers match `/features/lesson-packages/` (package validity, expiry, refund in Stripe not removing lessons) and the existing diary FAQ (no two-way calendar sync). No competitor is named in the new answers. Not used: PDI advertising rules and "how long to get first pupils" (no verified source), private-pupil scam questions (advice, not product).

## 3. AI panel misses (2 of 3 fixed)

The five no-hit questions on 12 Nov were: best app for a driving instructor, best diary app, taking lesson payments online, starting a driving school, Making Tax Digital. Evidence: the engine answers in `~/logs/growth-report/monthly/2026-11-panel.json` on agentbox (2 Nov baseline).

| Miss | What the engines said and cited | Fix |
|---|---|---|
| Taking lesson payments online | Stripe, PayPal and SumUp payment links, GoCardless, "bookings and payment tracking are manual". Cited stripe.com, paypal.com, gocardless.com, Passly, Total Drive. | `/features/getting-paid/`: added the stand-alone payment link to the methods table ("Five ways pupils pay") and a plain FAQ on when a link is enough and when software is worth the 3% fee. |
| Best diary app / best app for an instructor | ChatGPT: Square Appointments (a generic booking app). Gemini: generic calendars "fall short" on progress, prepaid blocks, travel overlap. Others: Total Drive, MyDriveTime, GoRoadie. | `/driving-instructor-diary-app/`: added "Is Google Calendar good enough?", which answers the generic-versus-specific comparison engines make. The page already had the "best diary app" and "best app" FAQs. |
| Making Tax Digital | gov.uk, accountants, Clear Books, QuickBooks, Total Drive's checklist, Acclaim Driving. Answers are the thresholds, compatible software and four steps. | **No change.** `/blog/making-tax-digital-driving-instructors/` already leads with the right thresholds and steps and says plainly that DriveSchoolPro does not file with HMRC. The question is about tax software, which we are not, so naming us would be wrong. The page is indexed. |
| Starting a driving school | Not chosen: lost on 12 Nov on two engines but the panel is non-deterministic, and learner and starter content is out of scope under the plan's rules. Recheck on 16 Nov. | None. |

## 4. "Alternatives to MyDriveTime / Total Drive / GoRoadie" wording

Already shipped on 3 Nov (#61), so nothing new to add. Audit on 15 Nov: each of the three compare pages has a "What is a good alternative to X?" FAQ and the alternatives block (`alternativesKey`); GoRoadie's title and description also say "Alternatives".

Search Console (UK, 18 Oct to 12 Nov) shows no "X alternatives" queries for the three named tools. So the Total Drive and MyDriveTime titles were left alone: both compare pages already rank at positions 8 to 16 for their brand terms and there is no evidence a title change would help. Revisit on 14 Dec.

Resolved from the 12 Nov review (section 5, item 1): "driving logic alternatives", "driveredtogo alternatives", "ticketschool alternatives" and "toocooltrafficschool.com alternatives" are US online traffic-school products ("Driving Logic" is a Florida traffic school), not UK driving-school software. Ignore them; no product to add to the best-software table.

## Not done

- No change to the "Free until 31 March 2027" text, as instructed.
- The 16 Nov AI panel re-run and the Claude web-search check on 10 prompts are still open for 16 Nov.
