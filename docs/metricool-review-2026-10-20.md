# Metricool review: features and ad benchmarks (20 Oct 2026)

Source: research on metricool.com resources, blog, studies, help centre and pricing. Many study PDFs are gated, so figures come from public landing pages, press releases and the 2024 Facebook Ads Study PDF. Metricool publishes no Google Ads benchmarks.

## Features to turn on (Starter plan)
| # | Feature | Who | Setup |
|---|---|---|---|
| 1 | Connect Meta Ads + Google Ads accounts for reporting (Starter: 10 ads connections). Google Ads tab adds Quality Score per keyword + Recommendations | John (OAuth) | Metricool › Connections › Google Ads / Meta Ads. Do it while campaigns are paused so history builds |
| 2 | Monthly automated brand report (PDF) emailed to John | Claude | Reports › schedule monthly |
| 3 | Campaign dashboards (3 on Starter): "Founding price to 1 Mar" and "Ads" | Claude | Planning › Campaigns |
| 4 | TikTok Flows (DIARY/PRICE) once TikTok is a Business account (Nov) | Claude after switch | Copy the IG flows |
| 5 | Best Times: useful for TikTok Business; FB uses generic estimates since Sept 2024 | — | After TikTok switch |
| 6 | More competitors (Starter allows 100). Competitor ads: use the free Meta Ad Library | Claude | Competitors tab |
| 7 | AI assistant (20 credits/brand/month) for caption/ad variants | — | Optional |

Already done: UTMs on every scheduled link (`utm_source={network}&utm_medium=social&utm_campaign=…`), autolists, IG Flows, SmartLinks, inbox.

## What Metricool's data says
- **Social Ads Study 2026** (628,969 campaigns, $471M): Meta lead-gen CPA $6.00, CTR 2.04%; sales CPA $11.14, CTR 2.67%; 91% of advertisers run Meta only. https://metricool.com/social-ads-study/ , https://metricool.com/social-media-ads/
- **2024 Facebook Ads Study** (211,929 campaigns): Great Britain has the highest CPC ($0.38) and CPM ($5.98) of any country (global $0.075 / $1.12). Lead campaigns CPC $0.23 vs Traffic $0.04. Engagement is the most-used objective (42.4%) but doesn't produce signups. https://metricool.com/wp-content/uploads/Facebook-Ads-2024-Study.pdf
- **Instagram Study 2026**: Reels get >4x the interactions of single images; carousels 9x the saves; single-image reach −22% y/y. https://metricool.com/press-release-instagram-study-2026/
- **Social Media Study 2026**: Facebook reach +51%, interactions +56%; IG Reels reach −35%; LinkedIn impressions −23%; GBP direction requests +34%. https://metricool.com/press-release-2026-social-media-study/
- **LinkedIn 2026**: carousels 17x the interactions of images; questions +77% comments. https://metricool.com/linkedin-trends-study/

## Checklist for high-success ads
1. **Objective:** Meta *Leads* or *Sales* optimised to the signup conversion, never Engagement/Traffic. Google: Search on high-intent terms to the existing landers `/driving-instructor-software/` and `/driving-school-software-uk/`.
2. **Tracking first:** gclid capture + "App signup"/"App activated" uploads (roadmap A, driveschoolpro#2022); Meta Pixel + Conversions API before any Meta spend; UTMs on every ad link.
3. **Audience:** UK; cold (ADI/driving-instructor interests), warm (site visitors, IG/FB engagers), hot (signed up, not activated) as separate ad sets.
4. **Creative:** 9:16 Reels under 30s, captioned, message in the first 3 seconds, nothing in the bottom 35%; plus carousels of real app screens. No AI road scenes or invented people.
5. **Copy = landing page:** same offer and words as the lander H1 ("Free until 31 March 2027", "£15 founding price"). Prices only from `src/config/offer.ts`.
6. **Budget:** one campaign at about £5–10/day for at least 2 weeks; no edits during learning (edits reset it). Expect UK CPMs about 5x the global average.
7. **Testing:** one variable at a time (or Dynamic Creative), then scale the winner.
8. **Metricool's role:** cross-account reporting and a campaign dashboard. Build campaigns in Ads Manager / Google Ads, not in Metricool.

## Avoid
- Creating campaigns inside Metricool (images only, basic targeting, an emailed 8-digit code per campaign).
- Boosting from Metricool (single image/Reel, ~2 days, no targeting, no edits). At most a cheap test of a post that's already doing well.
- Not on Starter: approval workflow, Looker Studio, API/Zapier/Make, custom report templates, team members. Hashtag tracker is a $25/day add-on.
- Outdated benchmarks: "FB CTR 1.51% / leads 2.5%" on Metricool's statistics page is WordStream 2023 data, and the global $0.075 CPC doesn't apply to the UK.
- Flows are free on Starter "for a limited time"; expect a future add-on charge.
