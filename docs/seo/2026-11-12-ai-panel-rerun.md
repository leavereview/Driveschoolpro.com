# AI prompt panel re-run: 12 Nov 2026 (issue #26)

**This is an early run (12 Nov), not the planned 16 Nov re-run.** Issue #26 stays open for 16 Nov, and the 1 Dec monthly run also stays. The 4 Nov, 9 Nov and 10 Nov changes are only days old, so most of them have probably not been crawled by the engines yet.

## How the panel runs

- Code: `~/growth-report` on agentbox (`panel.mjs`, `monthly.mjs`, config in `seo.json`). 20 questions across ChatGPT (gpt-5.4-mini), Perplexity (sonar), Gemini (gemini-3.5-flash), all with web search, and Google AI Mode, via DataForSEO. 80 answers; the 4 answers to the "What is DriveSchoolPro" question are reported separately, leaving 76.
- Schedule: cron `0 4 * * 1` runs `monthly.sh`, which exits unless it is the first Monday of the month (next: **Mon 7 Dec, 04:00**; the plan calls this the "1 Dec" run, but the first Monday of December is the 7th). It writes `~/logs/growth-report/monthly/<month>-panel.json` and upserts rows in the Notion "AI prompt panel" database.
- Manual run: `cd ~/growth-report && node monthly.mjs panel --month 2026-11`. Cost about $1.40 for the full panel. A same-month run keeps answered rows and upserts Notion, so **running it for 2026-11 for real would overwrite the 2 Nov baseline in Notion**. Use `--month 2026-12` or a dry run.
- What I did on 12 Nov: `GROWTH_OUT_DIR=<temporary folder> node monthly.mjs panel --month 2026-11 --dry-run`. Dry run means no Notion writes. The output went to a temporary folder that I deleted afterwards. DataForSEO charged $1.41 for the successful run. An earlier background attempt exited without output and I cannot tell whether it charged too, so total spend was at most about $2.80.
- The 2 Nov and 12 Nov JSON files were compared row by row. The 12 Nov file was not kept on agentbox or in this repo.

## Result (12 Nov) vs baseline (2 Nov)

| Measure | 2 Nov | 12 Nov | Plan target (13 Dec) |
|---|---|---|---|
| Answers naming or citing DSP | 19 of 76 | **26 of 76** | 28 |
| Answers citing driveschoolpro.com | 8 | **14** | 12 |
| ChatGPT | 3 | 8 | |
| Perplexity | 9 | 9 | |
| Gemini | 2 | 4 | 4 |
| Google AI Mode | 5 | 5 | 8 |
| Brand question ("What is DriveSchoolPro") cited | 3 of 4 | 3 of 4 | |

driveschoolpro.com was the third most cited domain this run (17 citations), behind totaldrive.co.uk (34) and Google's redirect links (20). Competitors named most: Total Drive 64 (was 60), MyDriveTime 45 (49), GoRoadie 27 (25), Lesson Diary 24 (18), Passly 16 (11), ADI Network 13 (12), LessonBuddy 10 (9), SimplyBook.me 9. The brand list gained SimplyBook.me since 2 Nov, so competitor counts are not perfectly like for like.

**Gained** (14 answers gained, 7 lost; several questions swapped one engine for another): ChatGPT now names us for "best management software", "what software do UK schools use", "online booking system", both "alternatives" questions, and "best CRM"; Gemini for "what software do schools use" and "online booking system"; Perplexity for "learners book their own instructor", "accounting app" and "tracks DVSA skills"; AI Mode for "cheapest" and "alternatives to GoRoadie". **Lost:** AI Mode and Perplexity on "what software do schools use" and "best management software" (one each), Perplexity on "alternatives to GoRoadie", and ChatGPT and Perplexity on "starting my own driving school".

**Still no engine names us (5 questions):** best app for a driving instructor, best diary app, taking lesson payments online, starting a driving school, Making Tax Digital. All but "starting a school" were also on the 2 Nov no-hit list. Newly missed: "starting a school" (lost on ChatGPT and Perplexity). Recovered since 2 Nov: best CRM, learners booking their own instructor, accounting app.

## Caveats

- The panel's engines are non-deterministic. Two runs on the same day can differ by a few answers, so a 7-answer rise is suggestive, not proof. The 16 Nov and 7 Dec runs show whether it holds.
- ChatGPT's jump (3 to 8) is the largest move. It is consistent with the new compare and FAQ pages being picked up, but nothing here shows which page caused it.
- The fifth tool (Claude web search on the first 10 prompts, 2 of 10 on 2 Nov) was **not** re-run. It is not part of the automated panel, so it still needs doing on 16 Nov.
- JP's Capterra and G2 review counts for the 16 Nov row are not available to this session.

## Left open for 16 Nov

1. Re-run the web-search check on the first 10 prompts (baseline 2 of 10).
2. Run the panel for real. Because the monthly job only runs on the first Monday, use a manual run with `--month 2026-11` only if you want to replace the 2 Nov baseline; otherwise the 7 Dec cron gives the next official row.
3. Act on misses (max 3 pages, one per missed question, with evidence).
