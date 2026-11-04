# AI visibility research and site audit: 4 Nov 2026

Issue #16. November goal: DriveSchoolPro named in AI answers (Google AI Overviews and AI Mode, ChatGPT, Perplexity, Gemini) for UK driving-instructor software searches.

This builds on [the 2 Nov analysis](../seo/2026-11-02-seo-ai-visibility-analysis.md) (Search Console, the AI panel, competitors) and [the 6-week plan](../seo/2026-11-03-seo-ai-plan-6-weeks.md). Their numbers and actions are not repeated here. This doc adds three things:

1. What the 2025–26 evidence says drives inclusion in AI answers, and how strong that evidence is.
2. An audit of driveschoolpro.com against it.
3. A ranked action list that slots into the 6-week plan.

## Summary

- **For Google, AI visibility is mostly normal SEO.** Its May 2026 guide says AI Overviews and AI Mode need only an indexed page that is eligible for a snippet. It also says special schema, llms.txt and "chunking" are not needed. Our technical base already meets that bar.
- **The strongest lever we don't yet pull is off-site mentions.** Ahrefs' 75,000-brand study found AI Overview visibility tracks branded web mentions (correlation 0.66) far more than backlinks (0.22). "Best X" roundups are the page type cited most often for software queries. This confirms the 6-week plan's focus on roundups and reviews, and adds mentions without links as a goal in their own right.
- **The audit found one real defect, now fixed in #63.** 31 FAQPage and 39 BreadcrumbList JSON-LD blocks on 40 pages had no `@context`, so they were not valid schema.org data. That included the homepage FAQ and every compare, feature and pillar page. #63 also adds a build check, links the product schema to the company, and adds the 28 pages missing from llms.txt.
- **The unknowns most likely to cost us are on the server, not in the code.** We have not yet checked whether AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot) actually reach the site. We also don't know whether the Search Console AI opt-out is off, or whether the site is verified in Bing Webmaster Tools (ChatGPT and Copilot depend on Bing's index). These take John about 30 minutes in total and come first.
- **Ignore the folklore:** llms.txt, a page for each sub-question, fake or copied review stars, and rewriting pages into chunks.

## 1. What drives inclusion in AI answers (2026 evidence)

Strength labels:
- **Official:** the platform's own docs or statements.
- **Large study:** a vendor dataset of more than 100k URLs or prompts. These show correlation, not cause.
- **Small:** tests and case studies.

These findings come from a web research pass on 4 Nov. The source pages could not be opened from this session, so the claims rest on search results and trade-press coverage of each source. Check exact figures at the links before quoting them outside this repo.

### 1.1 Google AI Overviews and AI Mode

| Finding | Strength | Source |
|---|---|---|
| To appear in AI features, a page must be indexed and eligible for a snippet. No extra markup or files are needed. | Official | [Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) |
| Google's May 2026 guide treats AEO and GEO as "still SEO". It says "chunking", llms.txt, special schema and "inauthentic mentions" don't help in Google. | Official (15 May 2026) | [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide); [SEJ coverage](https://www.searchenginejournal.com/googles-new-ai-search-guide-calls-aeo-and-geo-still-seo/575026/) |
| AI Mode breaks a question into many searches at once ("query fan-out"). "Best driving instructor app UK" becomes sub-searches on price, features, reviews and DVSA tracking. | Official (interview) | [SEJ, 2025](https://www.searchenginejournal.com/query-fan-out-technique-in-ai-mode-new-details-from-google/542385/) |
| `nosnippet`, `data-nosnippet`, `max-snippet` and `noindex` limit what AI features may use. | Official | AI features page above |
| Blocking `Google-Extended` does **not** remove a site from AI Overviews or AI Mode, which run on Googlebot's index. | Official | [SER](https://www.seroundtable.com/google-extended-seo-36865.html) |
| Since June 2026 (UK first, after a CMA order; worldwide from 31 Aug), Search Console has a "Search generative AI" opt-out and a generative-AI performance report. The report shows impressions only. | Official, via press | [9to5Google](https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/), [PPC Land](https://ppc.land/google-reacts-to-uk-order-with-a-search-console-ai-opt-out-toggle/) |
| AI Overviews and AI Mode cite different URLs: 13.7% overlap. | Large study | [Ahrefs](https://ahrefs.com/blog/ai-overviews-vs-ai-mode) |
| The share of AI Overview citations that also rank in the top 10 fell from 76% (2025) to about 38% (Mar 2026). Ranking still helps, but it is no longer enough on its own, and it isn't required. | Large study | [Ahrefs](https://ahrefs.com/blog/ai-overview-citations-top-10) |

### 1.2 ChatGPT, Perplexity, Claude and Copilot

| Finding | Strength | Source |
|---|---|---|
| **OAI-SearchBot** decides whether a site can appear in ChatGPT search answers. GPTBot is for training only. ChatGPT-User fetches pages when a user asks. Each bot is controlled separately in robots.txt. | Official | [OpenAI bots](https://developers.openai.com/api/docs/bots) |
| Anthropic runs three bots: **Claude-SearchBot** (search index), ClaudeBot (training) and Claude-User (user fetches). | Official | [Anthropic](https://support.claude.com/en/articles/8896518) |
| Copilot runs on Bing. For ChatGPT, being in Bing's index looks necessary, but how well a page ranks in Bing doesn't predict whether ChatGPT cites it. Estimates of the overlap range from 87% (Seer) to far lower (an Apr 2026 replication: 68% of citations were in neither Bing's nor Google's top 20). | Official (Copilot), contested (ChatGPT) | [Replication](https://aiplusautomation.com/blog/bing-replication-chatgpt-citations) |
| Since Feb 2026, Bing Webmaster Tools has an AI Performance report (Copilot citations and the queries behind them). Microsoft recommends IndexNow alongside it. | Official | [Search Influence](https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/) |
| Since 1 Jul 2025, Cloudflare blocks AI crawlers by default on new sites. Reports conflict on whether that includes the *search* bots. | Official (default), contested (scope) | [MIT Tech Review](https://www.technologyreview.com/2025/07/01/1119498/cloudflare-will-now-by-default-block-ai-bots-from-crawling-its-clients-websites/) |
| AI crawlers other than Google's download JavaScript but don't run it. Content that only appears after JavaScript runs is invisible to them. | Large study (Dec 2024) | [Vercel](https://vercel.com/blog/the-rise-of-the-ai-crawler) |

### 1.3 What gets cited

| Finding | Strength | Source |
|---|---|---|
| AI Overview brand visibility correlates with branded web mentions (0.664), branded anchor text (0.527) and branded search volume (0.392), but only weakly with backlinks (0.218). | Large study (75k brands) | [Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/) |
| "Best X" lists are the most cited page type (43.8% of 26k cited URLs), and 79% of them are dated in the current year. Software vendors' own lists also get cited, but Ahrefs' own test found such citations fade ("works until it backfires"). | Large study | [Ahrefs best-lists](https://ahrefs.com/blog/best-lists-research/), [self-promo test](https://ahrefs.com/blog/self-promotional-content-ai-seo-experiment/) |
| Reddit, YouTube, LinkedIn and Wikipedia are the most cited domains overall. The order varies by engine and by study. | Large study | [Semrush via SEL, Jan 2026](https://searchengineland.com/ai-search-engines-cite-reddit-youtube-and-linkedin-most-study-473138) |
| Review platforms (G2 and Capterra lead) are cited in about a third of commercial AI Overviews, and about half of "reviews" queries, but only 17% of "best/top" queries. One ChatGPT study of B2B software answers found no G2 or Capterra citations at all; listicles and blogs made up most of the rest. | Large study (secondary), small study | [Omnibound summary](https://www.omnibound.ai/blog/do-review-sites-g2-capterra-drive-ai-citations-b2b), [DerivateX](https://derivatex.agency/report/b2b-saas-ai-citation-study/) |
| AI-cited pages are on average 25.7% fresher than organic results. | Large study | [Ahrefs](https://ahrefs.com/blog/do-ai-assistants-prefer-to-cite-fresh-content/) |
| Adding statistics, quotations and cited sources raised visibility by up to about 40% on a lab benchmark. | Peer-reviewed (2023 engines) | [Princeton GEO, KDD 2024](https://arxiv.org/abs/2311.09735) |
| About 44% of ChatGPT citations come from the first 30% of a page, so put the answer first. | Medium (second-hand) | Kevin Indig, Growth Memo, early 2026 |

Our own November panel matches these findings. The domains it cited most were totaldrive.co.uk, lessondiary.co.uk, the two app stores, Capterra, Software Advice, G2 and the Collingwood roundup. The 2 Nov web re-run named DriveSchoolPro only through Capterra, G2 and FreeIndex.

### 1.4 Structured data and llms.txt: what they do and don't do

- **Schema doesn't drive citations, but valid schema is cheap hygiene.** Google says no special schema is needed. Tests disagree on whether ChatGPT, Claude or Perplexity read JSON-LD at all; one test found only Gemini did ([Otterly](https://otterly.ai/blog/schema-markup-real-impact-ai-search/), [searchVIU](https://www.searchviu.com/en/schema-markup-and-ai-in-2025-what-chatgpt-claude-perplexity-gemini-really-see/)). Bing has said schema helps its models. Keep every key fact in the visible text.
- **FAQ rich results stopped showing in Google on 7 May 2026** ([SEL](https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957)). FAQPage markup is still valid, and Google still reads it to understand a page. The value of an FAQ is now the visible question-and-answer text itself, which matches how people phrase questions to AI.
- **llms.txt:** Google says it doesn't use it. No other major AI company has said it does. Server-log studies show almost no fetches by AI crawlers ([seodepths](https://seodepths.com/seo-research/what-server-logs-tell-about-llms-txt/)). Ours is kept up to date because it costs nothing, not because it matters.

## 2. Audit of driveschoolpro.com

Method: a full production build of `main` at `f3dd24a` (178 pages, 118 indexable), with every page's HTML and JSON-LD parsed by script.

**Limitation:** this session's network policy blocks driveschoolpro.com, so the live server (response headers, any CDN or firewall, server logs) could not be checked. Rows marked **unverified** need John to check them (see action 2).

| Factor | Status | Evidence |
|---|---|---|
| Content in server-rendered HTML | ✅ | Static Astro build. Prices, features, comparisons and FAQs are all in the HTML, with no JavaScript needed. |
| robots.txt allows AI search bots | ✅ | `User-agent: * Allow: /`, with only `/api/` and UTM URLs disallowed. GPTBot, ClaudeBot and Google-Extended are also allowed. Keep it that way: training data is how a model "knows" a brand without searching. |
| Snippet controls | ✅ | No `nosnippet`, `data-nosnippet` or `max-snippet` anywhere in `dist/`. |
| Server or CDN lets the bots through | **Unverified** | Can't be checked from this session. Lightsail runs nginx; whether anything sits in front of it is not known. |
| Search Console AI opt-out is off | **Unverified** | Search Console setting. |
| Bing Webmaster Tools and IndexNow | ⚠️ Partly | An IndexNow key file is published (`public/d19a3d40….txt`), but nothing submits URLs: there is no IndexNow step in `deploy.yml` or `scripts/`. There's no `msvalidate` meta tag (the site may be verified by DNS instead; John to check). |
| JSON-LD validity | ❌ → ✅ in #63 | 31 FAQPage and 39 BreadcrumbList blocks on 40 pages had no `@context`. #63 fixes them and makes the build fail if any block is missing one. |
| Organization entity | ✅ | One `#organization` node on every page: legal name, company number link, `foundingDate` and 14 `sameAs` links (Capterra, G2, Trustpilot, Product Hunt, SaaSHub, FreeIndex, both app stores, social accounts). #63 links the homepage `SoftwareApplication` to it. |
| Review stars (`AggregateRating`) | ✅ Correctly absent | Don't add any until real reviews are shown on the page. Google's guidelines don't allow ratings copied from other sites. |
| FAQs as visible text | ✅ | 44 indexable pages have visible FAQs. Every November panel question has an on-site answer (#46, #47, #61). |
| Comparison and "alternatives" pages | ✅ | 12 comparison pages plus an index; Total Drive, MyDriveTime and GoRoadie each have an "alternatives" section (#61). A 12-platform roundup dated 2 Nov 2026 (#56). |
| Visible "updated" dates | ⚠️ | The compare pages and the roundup show "checked 3 November 2026" or "Updated 2 November 2026". The homepage, both PPC landers, the pricing page, the features index and 8 of the 9 feature pages show no date and have no `dateModified` (21 non-blog pages in total, counting about, contact and legal). |
| Answer-first openings | ⚠️ | The landers open with a slogan ("software that runs your day…"). A plain sentence stating what the product is, who it's for and what it costs only comes later. |
| llms.txt | ⚠️ → ✅ in #63 | It was missing 28 commercial pages, including every compare page and both landers. Low value either way (section 1.4). |
| Meta descriptions | ⚠️ Minor | 30 commercial pages have descriptions over 160 characters, which get cut off in search results. No effect on AI answers. |
| Off-site: review platforms | ⚠️ | We have listings on Capterra, G2, Trustpilot and FreeIndex. Review counts aren't known here; John was due to record a baseline in the 6-week plan. |
| Off-site: "best app" roundups | ❌ | Not included in Collingwood's roundup, which was a source for 4 of the 10 web re-run answers. No other UK roundup known to include us. |
| Off-site: mentions in ADI trade media, associations, Reddit, YouTube | ❌ / unknown | No known mentions in ADI trade media or association sites. The YouTube channel exists but has social clips, not search-style videos. |
| Wikidata / Wikipedia | ❌ | No entity that we know of. |

## 3. Prioritised actions

Impact means the expected effect on being named in AI answers for UK instructor-software searches.
- **Effort:** S is under 2 hours, M is half a day, L is more.
- **"Plan"** refers to the 6-week plan. Items marked *new* are not in it.

| # | Action | Impact | Effort | Owner | Plan |
|---|---|---|---|---|---|
| 1 | **Review and merge #63** (valid JSON-LD on 40 pages, build check, llms.txt). Afterwards, run Rich Results Test on `/` and one compare page. | Medium: fixes broken data on the pages that matter most, and stops it coming back | S | John | *new* |
| 2 | **Check that AI search crawlers get through.** On the server: `grep -cE 'OAI-SearchBot\|Claude-SearchBot\|PerplexityBot\|bingbot\|Googlebot' /var/log/nginx/access.log*`. Each should show 200 responses. If a CDN or firewall sits in front of nginx, check its AI-bot settings too. | High *if broken* (a block means zero ChatGPT, Claude or Perplexity inclusion); nil if fine | S | John | *new* |
| 3 | **Search Console:** confirm Settings → "Search generative AI" is *off*. Record this week's generative-AI impressions as the AI Overview and AI Mode baseline. | High if the opt-out is on; otherwise measurement | S | John | *new*; add to the baseline table |
| 4 | **Bing:** verify the site in Bing Webmaster Tools, submit both sitemaps and record the AI Performance report baseline. Claude then adds an IndexNow submission step to `deploy.yml`, using the existing key file, in a reviewed PR. | Medium: Copilot runs on Bing, and Bing's index matters for ChatGPT | S (John) + S (Claude) | John, then Claude | *new* |
| 5 | **Get into "best driving instructor app" roundups:** Collingwood first, then other UK roundups the engines already cite (insurers, ADI training providers, app-review sites). Offer a free account and accurate facts (the facts page); never pay for placement without a disclosure. | **High**: the top cited page type for software queries | S per email | John (Claude drafts) | Plan #3, widened to the next 3 roundups |
| 6 | **Real customer reviews on G2 and Capterra**, plus the app stores. The in-app prompt (#2149) is live; John also asks people personally. No incentives tied to a positive rating (DMCC Act 2024). | **High** for AI Overviews and "reviews" queries; lower for ChatGPT | M | John | Plan #4 |
| 7 | **Get the brand mentioned in ADI trade media and associations**: the professional associations' member-benefit or supplier pages, ADI news sites and newsletters, ADI podcasts, and trainer-of-trainer blogs. A mention without a link still counts (correlation 0.66 vs 0.22 for links). Lead with something newsworthy: the April 2027 MTD start, the permanent Free plan, the AI lesson briefings. | **High**, but slow (6–12 weeks) | M–L | John (Claude drafts pitches and a press note) | *new* |
| 8 | **Answer publicly where AI reads**: r/drivingUK and public ADI forums, disclosed as the founder, answering the questions asked in the Facebook groups. | Medium (Reddit is a top cited domain) | S per week | John | Plan's Facebook item 6 |
| 9 | **YouTube: 2 or 3 search-style videos** with descriptive titles and captions, e.g. "DriveSchoolPro walkthrough: diary, DVSA progress and payments (UK ADI app)" and "Moving from a paper diary to an instructor app". Link each from the matching page. | Medium (YouTube is among the domains AI Overviews cite most) | M | John records, Claude scripts | *new* |
| 10 | **Visible "Updated {date}" line plus `dateModified`** on the homepage, both landers, pricing and the feature pages, set when content changes and never on every build. | Low–medium (freshness) | S–M | Claude | *new* |
| 11 | **Answer-first opening on the two landers and the homepage**: one plain sentence under the H1, e.g. "DriveSchoolPro is driving instructor software for UK ADIs: diary, DVSA 27-skill progress, card payments and reminders, on web, iPhone and Android, free until 31 March 2027." Keep the slogan as the H1. Landers are Google Ads contracts, so don't change the H1 or URL. | Medium | S | Claude | *new* |
| 12 | **App store titles and subtitles** that include "driving instructor" | Medium (the app stores are cited 19 times in the panel) | S | Claude (native repo, attended) | Plan week 4 |
| 13 | **Keep the 12-platform roundup current**: re-check monthly and keep the year in the title. Being transparent that we wrote it (it's labelled) limits the decline Ahrefs saw with self-promotion. | Medium | S per month | Claude | Plan #9, ongoing |
| 14 | Trim the 30 over-long meta descriptions | Low (search-result click rate only) | S | Claude | *new* |
| 15 | Wikidata item for DriveSchoolPro / JOHN POWELL LTD, citing Companies House and the app stores | Low and uncertain (may be removed as not notable) | S | John | *new*, optional |

**Order for November:**
- **This week:** 1 to 4. They're quick, and 2 and 3 could reveal a problem that outweighs everything else.
- **Weeks 2 to 3:** 5, 6 and 11, alongside the 16 Nov panel re-run (#26).
- **Weeks 3 to 6:** 7, 9 and 10.

The plan's rule still applies: no new pages unless Search Console or the panel shows a gap.

## 4. What not to do

- **Don't create a page for each sub-question.** Google says AI Mode fan-out doesn't reward it, and it thins the site out.
- **Don't add review stars copied from Capterra or G2,** and don't add self-written ratings. Both break Google's review-snippet guidelines, and Google can issue a manual action for it.
- **Don't buy listicle placements or post "inauthentic mentions".** Google names them in its May 2026 guide, and undisclosed paid endorsements are a DMCC Act risk.
- **Don't block GPTBot, ClaudeBot or Google-Extended.** Training data is how a model knows the brand without searching. There's no cost to a marketing site.
- **Don't build llms-full.txt or Markdown copies of pages,** and don't rewrite pages into chunks. Google says these neither help nor harm, and there's no evidence they help elsewhere.

## 5. Measurement

| Measure | Source | When |
|---|---|---|
| Panel answers naming DSP (baseline 19 of 76) and citing driveschoolpro.com (baseline 8) | AI panel (#26) | 16 Nov, 1 Dec |
| AI Overview and AI Mode impressions | Search Console generative-AI report (new baseline from action 3) | weekly |
| Copilot citations and the queries behind them | Bing Webmaster Tools AI Performance (new baseline from action 4) | weekly |
| AI search bot hits and response codes | nginx logs (action 2) | 16 Nov, 14 Dec |
| Roundups that include DSP; third-party mentions | Manual log in the SEO change log | 14 Dec |
| Capterra and G2 review counts | Plan baseline | 16 Nov, 14 Dec |

## Sources and limits

- **Research:** a web research pass on 4 Nov 2026. Primary pages couldn't be fetched from this session, so the claims rest on search results and trade-press coverage of each source. Vendor studies (Ahrefs, Semrush, SE Ranking, Seer) show correlation, not cause. Claims from a single source are marked or left out.
- **Audit:** a production build of `main` at `f3dd24a`, parsed by script. The live server, CDN, Search Console, Bing Webmaster Tools and review counts were out of reach and are listed as checks for John.
- **Context:** the 2 Nov analysis and the 6-week plan in `docs/seo/`.
