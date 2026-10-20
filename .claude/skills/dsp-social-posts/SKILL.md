---
name: dsp-social-posts
description: Use when writing, planning, loading or scheduling DriveSchoolPro social posts in Metricool (Facebook, Instagram, Threads, LinkedIn, YouTube Shorts, TikTok, Google Business Profile), including monthly batches, autolists, and posts that may later become paid ads.
---

# DriveSchoolPro social posts

The rules and evidence to apply every time posts are built. Background and sources: `docs/metricool-review-2026-10-20.md`. House rules in full: `brand/social/november-2026.md` §1.

## Before writing
1. Read prices and dates from `src/config/offer.ts` (never from memory or old posts). Today: free until 31 March 2027; then Free (1 instructor, 60 lessons/month), Solo £22, School £22 + £10 per extra instructor; founding £15 (School £15 + £8) for cards added by 1 March 2027; no VAT.
2. Only claim features that are live. If unsure, check the app repo (`~/Projects-code/driveschoolpro`) or `scripts/verify-claims.js`. Known no-gos: bulk import, parent accounts, CSV/data export, text or WhatsApp reminders as live, calendar export.
3. Check the month for quiet days (Remembrance Sunday, 11 Nov 10:30–11:30, 15 Nov road victims day, national mourning): no selling on those.

## House rules (all networks)
- UK English, plain words, no hype, no stacked exclamation marks, no emojis in body text.
- Brand accounts only. Never post, reshare or comment from John's personal accounts.
- Never name, knock or price a competitor. No user counts, awards, ratings, testimonials or case studies unless a real, named customer agreed in writing (DMCC Act).
- Making Tax Digital posts: say DriveSchoolPro isn't MTD software, and "This isn't tax advice".
- Images/video: real app screens or demo data only (fictional "Ace Driving School"/"Emily Thompson"). No AI road scenes or AI people. No real pupil data on screen.

## Format choices (Metricool studies 2026)
- Instagram: Reels get >4x the interactions of single images; carousels get 9x the saves; single-image reach is falling (−22% y/y). Default to Reels or carousels, not single images.
- LinkedIn: carousels (images published as a PDF document) get 17x the interactions of images; ending with a question gets +77% comments. Keep the link in the first comment.
- Facebook: reach is growing (+51% y/y) and it's where UK ADIs gather; post 1–2 a day.
- Threads: text-first, under 500 characters including the link.
- Google Business Profile: "publication" type, under 1,500 characters, one image, plain-text domain (no "link in bio"), written for someone searching Google ("UK driving instructors").
- Frequency guide: FB 1–2/day, IG feed 3–5/week, LinkedIn page 1/weekday, Shorts 3–5/week.

## Build every post so it could become an ad
Paid ads start in 2027. Posts that already perform become the first ad creatives, so build them ad-ready now:
- Video: 9:16, under 30 seconds, burned-in captions, the main message in the first 3 seconds, nothing important in the bottom 35% of the frame. Also export 4:5 or 1:1 for feeds where easy.
- One message per post, matching a landing page's H1 and offer wording exactly (`/driving-instructor-software/` for solo ADIs, `/driving-school-software-uk/` for schools, `/pricing/` for price posts).
- Hook in the first line: a problem the instructor recognises ("How many 'are you free Tuesday?' messages…").
- A single clear next step (try it free / see pricing), never several.
- Note the best performers each month (Metricool analytics: saves, shares, link clicks) in the Trello card for that month, tagged "ad candidate".

## Links and tracking
Every link: `https://driveschoolpro.com/<page>/?utm_source=<network>&utm_medium=social&utm_campaign=<campaign>&utm_content=<postId>`. `<network>` is facebook, instagram, threads, linkedin, youtube, tiktok or gbp. Instagram captions end "→ driveschoolpro.com/… (Link in bio)". LinkedIn puts the link in `firstCommentText`.

## Loading into Metricool
- Brand blogId 7477292, timezone Europe/London. Use `mcp__metricool__createScheduledPost`.
- **Schedule directly (`draft: false`)**. John approved this on 20 Oct 2026; don't load drafts.
- One post per network (separate FB and IG versions). Fill each network's data block (`instagramData.type` REEL/POST, `facebookData.type`, `linkedinData` with `documentTitle` + `publishImagesAsPDF: true` for carousels, `youtubeData` with title/short/madeForKids false, `gmbData.type` publication).
- Media must be public URLs (Metricool static or driveschoolpro.com/social/…).
- Afterwards, tell John what was scheduled (dates, networks, counts).
- Still ask first before: activating or changing Instagram/TikTok Flows, sending DMs or emails, boosting, or spending money.

## Ads (from 2027, not before)
Don't spend on ads until John says so. When he does, follow the checklist in `docs/metricool-review-2026-10-20.md`: tracking first (gclid capture, Google Ads conversion upload, Meta Pixel + CAPI); Leads/Sales objective optimised to signups (never Engagement/Traffic); cold/warm/hot audiences separately; £5–10/day for 2+ weeks with no edits during learning; one variable per test; build in Ads Manager / Google Ads, not Metricool; don't boost from Metricool. UK costs run about 5x the global average.
