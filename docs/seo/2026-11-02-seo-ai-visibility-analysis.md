# SEO and AI visibility analysis: driveschoolpro.com, 2 Nov 2026

JP's goal: improve where the site can be found, in Google and in AI answers, and make his Facebook group activity count for more.

Sources: Google Search Console (service account, all countries and UK only, windows ending 31 Oct), GA4 property 529247825 (site + app, consented sessions only), the November AI prompt panel on agentbox (`~/logs/growth-report/monthly/2026-11-panel.json`, run 04:00 today, before this morning's PRs), a web-search re-run of 10 panel prompts done today, the app's signup attribution (weekly growth report, `db` source) and PostHog project 306730.

The same day's earlier work (PRs #45 to #51: compare pages, driving instructor app page, homepage UK/CRM, AI-panel FAQs, booking page, headers, Astro 7) is not repeated here. Its effect will show from mid-November.

## 1. Search Console

### Totals

| Window | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| 28 days, all countries (3 to 31 Oct) | 67 | 11,965 | 0.56% | 15.7 |
| 28 days, UK | 43 | 6,187 | 0.69% | 14.7 |
| 90 days, all countries (2 Aug to 31 Oct) | 208 | 41,378 | 0.50% | 13.6 |
| 90 days, UK | 144 | 16,193 | 0.89% | 14.7 |

About half the impressions are outside the UK (USA 1,961 in 28 days), almost all on learner and US "driver's ed" pages. The figures below use UK where it matters.

### Buyer head terms: not yet in striking distance

| Query (28 days, all countries) | Impressions | Position | Page |
|---|---|---|---|
| driving school booking software | 249 | 42 | /driving-school-scheduling-software/ |
| driving school software | 164 (UK 132) | 25 (UK 17.8) | / |
| driving school scheduling software | 130 | 39 | /driving-school-scheduling-software/ |
| driving school management software | 124 | 33 | /driving-school-management-software/ |
| driving school crm | 75 | 19.4 | /blog/best-driving-school-software/ |
| driving instructor software | 64 | 30.5 | / and /driving-instructor-software/ |
| adi diary app | 56 | 22 | /driving-instructor-diary-app/ |
| driving instructor software uk | 47 | 18.5 | / |
| my drive time | 46 | 13 | /compare/my-drive-time/ |
| driving instructors accountant (+ variants) | ~250 / 90 days | 38 to 54 | /driving-instructor-accounting-software/ |

Most buyer terms sit on pages 3 to 5. That is an authority problem (Domain Rating 6 vs competitors' 42 to 49, per the Nov plan), not an on-page one. The ones within reach (CRM, instructor software uk, my drive time) were all worked on this morning in #45 to #47.

### Striking distance (positions 5 to 20, real impressions)

UK, 90 days, buyer-relevant:

| Query | Impr. | Pos. | Page | Action |
|---|---|---|---|---|
| driving school startup | 196 | 7.3 | /blog/starting-driving-school-guide/ | **Done today (#52)** |
| how to start a driving school | 20 (all countries 87) | 15.3 | same | **Done today (#52)** |
| my drive time | 48 | 13.1 | /compare/my-drive-time/ | done this morning (#45) |
| crm for driving schools | 36 | 17.4 | / | done this morning (#46) |
| driving school management system | 36 | 20.1 | /blog/best-driving-school-software/ | refresh (action 9) |
| driving school insurance | 35 | 19.2 | /blog/driving-school-insurance-guide/ | **title/meta today (#52)** |
| total drive driving school | 22 | 18.4 | /compare/total-drive/ | measure |
| the driving instructor franchise costs calculator | 25 | 7.6 | /driving-school-calculator/ | fine |
| making tax digital driving instructors | 12 | 13.8 | MTD hub | **#54 today** |

All countries, 90 days, the start-a-school group is by far the largest: "driving school startup" 200 (7.3), "how much does it cost to start a driving school" 104 (7.1), "driving school business setup" 100 (8.8), "how to start a driving school" 87 (12.7), "how to start a driving school business" 80 (10.9), "driving school business requirements" 69 (9.3), "driving school business plan" 67 (9.4). These are future instructors and school owners: buyers in 6 to 12 months.

Learner queries (lesson costs, mirrors and handbrake, eco-driving, dual carriageways) dominate the rest of the striking-distance list. Per the Nov plan, they are left alone.

### Low CTR for the position

| Page (90 days, all countries) | Impr. | Pos. | CTR | Expected at that position | Note |
|---|---|---|---|---|---|
| /blog/starting-driving-school-guide/ | 4,337 | 9.7 | 0.37% | ~2 to 3% | rewritten today |
| /blog/moving-off-stopping/ | 5,763 | 6.7 | 0.02% | ~4% | learner; quoted-phrase searches from exam tools, ignore |
| /blog/parallel-parking-driving-test/ | 2,184 | 7.7 | 0% | ~3% | learner, ignore |
| /tools/cost-calculator/ | 1,651 | 7.4 | 0.24% | ~3% | learner |
| /blog/driving-school-insurance-guide/ | 850 | 9.5 | 0.59% | ~2% | title/meta today |
| /driving-school-management-software/ | 1,366 | 27 | 0.51% | | 284 impressions at 6.6 for "driving test student management software", non-UK |

### Indexing

Box URL Inspection (2 Nov): 114 of 119 checked URLs indexed. Not indexed: /blog/how-to-start-a-driving-school/ (now 301'd into the indexed guide), /blog/driving-school-payment-processing/, /blog/other-road-users/ (all "Crawled - currently not indexed").

## 2. AI visibility

### The November panel (20 questions × 4 engines, web search on)

| | Oct (29 Oct run) | Nov (2 Nov, 04:00) |
|---|---|---|
| Answers naming DriveSchoolPro (excl. the brand question) | 13 of 76 (17%) | 19 of 76 (25%) |
| Answers citing driveschoolpro.com | 8 | 8 |
| ChatGPT | 3 | 3 |
| Perplexity | 9 | 9 |
| Gemini | 0 | 2 |
| Google AI Mode | 1 | 5 |

Competitors named in the November answers: Total Drive 60 of 76, MyDriveTime 49, GoRoadie 25, Lesson Diary 18, ADI Network 12, Passly 11, LessonBuddy 9, Driving School Office 7, Teachworks 7, Driving School Manager 5.

Questions where no engine names us (Nov): best app for a UK driving instructor; best diary app; taking lesson payments online; learners booking their own instructor; best CRM; MTD compliance; best accounting app. All got an FAQ answer this morning (#46, #47), after the panel ran, so the 16 Nov re-run (#26) is the first real measurement.

Domains the engines cite most (Nov, answers that cite at least one): totaldrive.co.uk 32, lessondiary.co.uk 13, play.google.com 10, passdesk.co.uk 10, apps.apple.com 9, driveschoolpro.com 8, mydrivetime.co.uk 7, softwareadvice.com 7, collingwood.co.uk 6, orbitdriving.com 6, passly.co.uk 6, reddit.com 5, capterra 10 (.com + .co.uk), g2.com 5, sourceforge.net 5.

### Fifth tool: web search re-run (10 prompts, 2 Nov)

The first 10 panel prompts, run through Claude's web search today:

| Prompt | Names DriveSchoolPro? | Names instead |
|---|---|---|
| Best app for a driving instructor in the UK | No | Total Drive, MyDriveTime, WeDrive |
| Best driving school management software in the UK | **Yes** (Capterra listing) | DrivingSchoolSoftware.com, EasyWeek, Teachworks |
| What software UK driving schools use | **Yes** (G2, FreeIndex) | WeDrive, Total Drive, BookDrive, bookitLive |
| Free app for driving instructors in the UK | No | Total Drive, MyDriveTime, Instructly, WeDrive, ADI Hubb |
| Best online booking system for UK instructors | No | SimplyBook.me, Baluu, BookingLive, WeDrive |
| Alternatives to Total Drive | No | Zutobi Instructor, DrivingSchoolSoftware.com, Drive Scout |
| Alternatives to MyDriveTime | No | nothing relevant found |
| Alternatives to GoRoadie Pro | No | MyDriveTime, Drivi |
| Best diary app for a UK instructor | No | Total Drive, MyDriveTime, GoRoadie, WeDrive |
| How to comply with Making Tax Digital | No | Total Drive's MTD checklist, GoSimpleTax, Clear Books |

2 of 10, and both times through a directory listing, never through driveschoolpro.com. The Collingwood article "Best apps for driving instructors" is a source for 4 of the 10 and is cited 6 times in the panel. WeDrive, Instructly, Bitepoint and Zutobi Instructor appear here but are not in the panel's brand list (`seo.json`).

**Read-out:** on-site answers are now in place for every panel question. What decides the next step is off-site: directory listings with reviews, the "best apps" roundups and app-store listings are what the engines quote.

## 3. Facebook

### Traffic (GA4, consented sessions only, so an undercount)

| Source / medium | Sessions, 5 Oct to 1 Nov | Notes |
|---|---|---|
| facebook.com / referral | 25 | group and feed link clicks |
| facebook / social (`utm_campaign=nov26`) | 8 | Metricool page posts n02 to n14 |
| lm.facebook.com / referral | 6 | Messenger link shares |
| m.facebook.com / referral | 3 | mobile web |
| **All Facebook** | **42** | all since 22 Oct |
| google / organic | 21 | |
| google / cpc | 18 | |
| (direct) | 90 | |

Facebook is the site's second-biggest source after direct, and twice Google organic. 20 of the 42 sessions came on 31 Oct, the day of one of JP's group posts.

- **Landing pages:** the homepage (32 of 48 Facebook pageviews), then /blog/switch-paper-diary-to-driving-school-software/ (4), /pricing/ (4), /blog/reduce-driving-lesson-no-shows/ (2), /features/lesson-briefings/ (2).
- **Engagement:** facebook.com sessions were 42% engaged, averaging 95 s and 1.2 pages, against Google organic's 44%, 167 s and 1.5 pages. The UTM'd page posts (facebook / social) were 0% engaged across 8 sessions.
- **Signups:** GA4 shows 2 of the 9 `signup_start` events in 90 days came from facebook.com, both on 31 Oct. The app's own attribution for that week shows 6 signups: 4 "(direct / unknown)" and 2 google, so no Facebook signups. **Cause:** group visitors land on the homepage and sign up through the hero form, which did not forward `fbclid` or the referrer, and Facebook's in-app browser drops the referrer. Fixed today (#53). GA4 also puts all 23 `onboarding_complete` events under "(direct)" (the cross-domain hop to the app), so GA4 cannot credit any channel with completed signups. The app's attribution is the number to watch.
- **PostHog** (project 306730) tracks only app.driveschoolpro.com, has done so since 15 Oct, and stores no initial referrer (20 people), so it cannot answer the Facebook question. The marketing site has no PostHog.

### How to make the Facebook groups count for more

Group posts are mostly private, so neither Google nor AI assistants can read them. They help rankings only indirectly: through the people they send, the reviews and links those people later leave, and the questions they show we should answer on the site. So:

1. **Tag every link you post.** Use `?utm_source=facebook&utm_medium=group&utm_campaign=<group-short-name>&utm_content=<topic>`. Since today the app records these on the signup, so the weekly report shows which group brought which school. Ready-made links:
   - MTD questions: `https://driveschoolpro.com/blog/making-tax-digital-driving-instructors/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=mtd`
   - "Which diary app?": `https://driveschoolpro.com/driving-instructor-diary-app/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=diary`
   - Total Drive / MyDriveTime comparisons: `https://driveschoolpro.com/compare/total-drive-vs-mydrivetime/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=compare`
   - No-shows and cancellations: `https://driveschoolpro.com/blog/reduce-driving-lesson-no-shows/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=noshows`
   - PDIs and new instructors: `https://driveschoolpro.com/blog/starting-driving-school-guide/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=starting`
   - Earnings and pricing: `https://driveschoolpro.com/driving-school-calculator/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=calculator`
   - Paper diary to app: `https://driveschoolpro.com/blog/switch-paper-diary-to-driving-school-software/?utm_source=facebook&utm_medium=group&utm_campaign=GROUP&utm_content=paper`
2. **Link the page that answers the question, not the homepage.** Homepage visits from groups are short (1.2 pages). An answer page fits the question, and every signup link on it carries the attribution.
3. **Send us the questions.** Keep a running note of questions asked in groups (exact wording). Each one that comes up twice becomes an FAQ on the matching page, with FAQPage schema. That is the format AI assistants quote, and those questions are what instructors also type into ChatGPT.
4. **Turn happy group members into public reviews.** AI answers lean on Capterra, G2, Software Advice and the app stores (section 2). Ask existing customers you know from the groups for an honest review on Capterra or G2. Only real customers, no incentives tied to a positive rating (DMCC Act 2024).
5. **Ask customers with their own website to link to it** (the "Book lessons online" link in the Nov plan). Links, not group posts, move the Domain Rating.
6. **Reuse your best group answers in public**, disclosed as the founder, where AI reads them: r/drivingUK and public ADI forums, and on our own Facebook page, which is public, unlike the groups.

Do not post anywhere on JP's behalf. All of the above is for JP.

## 4. Competitors on our target terms

| Competitor | Where it wins | Why |
|---|---|---|
| **Total Drive** (totaldrive.co.uk) | named in 60 of 76 AI answers; top organic result for "driving instructor app/software/diary"; has its own MTD checklist that AI cites for the MTD question | big review base (Trustpilot, GetApp, Software Advice), "8,600 instructors" claim, app-store ratings (251 on iOS per ChatGPT) |
| **MyDriveTime** | 49 of 76 AI answers; App Store listing ranks for "driving instructor software UK" | listed since 2014, app-store presence, Collingwood roundup |
| **GoRoadie / GoRoadie Pro** | 25 AI answers; brand searches (390/month) | funding press, learner marketplace, podcast and association presence (MSA GB) |
| **Lesson Diary** | 18 AI answers, cited 13 times | its own site is quoted for DVSA-progress questions |
| **WeDrive, Instructly, Bitepoint, LIDT, Zutobi** | appear in web-search answers for "best/free/diary app" | app-store listings with "driving instructor" in the title |
| **SimplyBook.me, EasyWeek, Teachworks, BookingTimes, bookitLive** | "booking system" and "management software" | generic booking tools with large Capterra review counts and dedicated driving-school landing pages |
| **Collingwood** (insurer) | its "Best apps for driving instructors" article is a top source for 4 of 10 AI prompts | it is the roundup AI trusts; we are not in it |

Our assets the engines do use: Capterra (all regional domains), G2, FreeIndex, /about/facts/ and the brand question (cited 3 of 4).

## 5. Ranked actions (impact × effort)

Impact is on buyer visibility (Google + AI) and signups we can attribute. Effort: S under 2 hours, M half a day, L more.

| # | Action | Impact | Effort | Owner | Status |
|---|---|---|---|---|---|
| 1 | Merge the duplicate start-a-school guides into the indexed URL; DVSA facts from GOV.UK; 7 FAQs; 301 | High (largest striking-distance group, 4,337 impr/quarter) | M | Claude | **Shipped #52** |
| 2 | Forward fbclid/referrer from the hero form so Facebook signups are attributed | High (unblocks measuring JP's main channel) | S | Claude | **Shipped #53** |
| 3 | Get DriveSchoolPro into Collingwood's "Best apps for driving instructors" (and similar roundups) | High (source for 4 of 10 AI prompts) | S | JP (email; draft on request) | to do |
| 4 | Real-customer reviews on Capterra / G2 (and app stores), asked for through the FB groups | High (the engines' second-favourite source) | M | JP | to do |
| 5 | UTM'd answer-page links in every group post (link kit above) | Medium-high | S | JP habit | to do |
| 6 | MTD cluster: answer "driving instructor accountant"; footer link to the hub | Medium (~250 impr/quarter at 38 to 54) | S | Claude | **Shipped #54, closes #27** |
| 7 | Insurance guide title/meta for CTR | Low-medium | S | Claude | **Shipped #52** |
| 8 | Add WeDrive, Instructly, Bitepoint, Zutobi, SimplyBook to the panel's brand list in `agentbox/growth-report/seo.json` | Medium (measurement) | S | Claude | to do |
| 9 | Refresh /blog/best-driving-school-software/ (UK's top page: 2,043 impr/quarter at 29) with honest comparison tables; fix its layout shift | Medium-high | L | Claude | Nov plan item |
| 10 | Fix the layout shift on the startup guide (CLS 0.273 per the Nov plan) | Low-medium | S | Claude | to do |
| 11 | "Book lessons online" plain link for customers' websites (authority) | High, slow | M (app) | product | Nov plan item |
| 12 | Collect FB group questions → FAQ answers on matching pages | Medium | S per batch | JP + Claude | ongoing |
| 13 | ADI income and tax estimator tool (#28) | Medium | L | Claude | Feb 2027 target |

Re-measure: AI panel re-run on 16 Nov (#26), GSC per-page baselines in the weekly report from the 📝 SEO change log (rows added today).
