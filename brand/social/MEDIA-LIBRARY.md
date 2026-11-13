# DriveSchoolPro media library: where everything is

**Read this first when making any DriveSchoolPro social post, ad or video.** It lists every piece of media John has recorded or Claude has built, and the voice decisions. Last updated 13 Nov 2026.

All paths are on John's Mac. iCloud = `~/Library/Mobile Documents/com~apple~CloudDocs/projects/Driving school/`.

## 1. Voice decisions

### John's own voice (recorded 20 Oct 2026)
- The script is in `brand/social/voiceover-lines.md` in this repo. Codes: H hooks, F features, B honest bits, O offer, C calls to action, S sign-offs, T tips, X sound effects.
- Edited lines: iCloud `voice recordings/edited/`. Files C02–C05, F10, H03, H10, O02–O05, S01–S03, T02–T06 and X01–X06. Alternates are in `edited/alternates/`. The raw takes are one level up.
- Lines marked **[dated]** expire. O02 runs until 31 Mar 2027; O03 until 1 Mar 2027; O04 applies from 1 Apr 2027. Check the date before using them.
- Lines for the N20/N26/N31 videos (lesson structure, winter driving, show me tell me): iCloud `videos/Voiceovers processed/`.
- Already used in `public/social/video/n*-vo.mp4` and `n*-vo2.mp4`.

### AI voices for ads (ElevenLabs, decided 11 Nov 2026)
- Four British regional male voices, **rotated equally**, one voice per ad variant, in the order Steven → Sam → Andy → Ryan.
- Tag each ad's link `utm_content=voice-<name>`. Two-voice ads use `voice-duo-<names>`.

| Voice | Accent | Voice id | Best for |
|---|---|---|---|
| Steven | Scottish | `wnbtVuRBgnPmE1cCeLUN` | Hushed "nature documentary" narration |
| Sam | Welsh | `DikmR0aoFXAp1A3NcovW` | Warm, friendly |
| Andy | Northern England | `x8Zbp1rqd4UcTdV8cRII` | Dry, "you've heard them all" |
| Ryan | Yorkshire | `EvfUC5EzfWjmoPWebkXG` | Deadpan understatement |

- **Settings:** model `eleven_v4`, `mp3_44100_128`, default voice settings. Use the `/with-timestamps` endpoint to get word-synced captions.
- **Direction:** warm, friendly British English, like a confident instructor talking to a colleague. Not salesy.
- **Audio tags:** `[sighs]` and `[whispers]` are not read aloud, but they have little audible effect. Use punctuation and inserted silence for timing.
- **Account:** ElevenLabs annual subscription, paid for a year from 11 Nov 2026. Be generous with renders and retakes; John approved this. The key is `ELEVENLABS_API_KEY` in `~/Projects-code/agentbox/.env.local` (Mac) or `~/agentbox-secrets/claude.env` (box). Never print it.
- **Usage terms:** these are shared-library voices, so a creator can withdraw one. Keep the rendered MP3 of every live ad, and check commercial-use terms before an ad goes live.
- Full record: agentbox `docs/voiceover.md`. Test renders: `~/Projects-code/archive/voiceovers/2026-11-10/` (deleted after 11 Dec 2026).

## 2. Comedy ads (Nov 2026, drafts awaiting John's listen)
Style: dry UK humour, laughing *with* instructors, never at learners or the DVSA. No driving on screen (advertising regulator rules) and no competitor digs.

| Ad | File | Voice |
|---|---|---|
| Excuse montage (fake chat of payment excuses → card payment) | `~/Projects-code/reference/driveschoolpro/dsp-marketing-assets/comedy-ads/montage/excuse-montage-draft.mp4` | Andy |
| Understatement ("Bit annoying… Bit more annoying", cancellations counter → reminders) | `…/understatement/understatement-draft.mp4` | Ryan |
| Nature documentary ("*Instructus exhausticus*", Sunday 21:04 → payments) | `…/nature-doc/nature-doc-draft.mp4` | Steven |
| "Pupil payment excuses, ranked" carousel (6 slides, 4:5) | `…/carousel/01–06.png`, caption in `NOTES.md` | none |

- **Build code:** `~/Projects-code/reference/driveschoolpro/dsp-marketing-assets/social-videos/`. It contains `adkit.py`, `compose_vo.py`, `compose_understatement.py`, `compose_naturedoc.py`, `scenes/` and `payoff/payoff.json`.
- **Payoff clip:** the shared payment shot is `payoff/owner-pay-now.mp4`, John's real card payment.
- **Copies:** the drafts were copied from `archive/comedy-ad-pilots/` (deleted after 11 Dec 2026) to `reference/driveschoolpro/dsp-marketing-assets/comedy-ads/` on 11 Nov 2026. The media mirror carries that folder to the box as `assets/comedy-ads/`, which is where the social-autopost job reads them. Move final versions to `public/social/video/` as before.

## 3. John's own video footage

| What | Where |
|---|---|
| **Acted skits, edited** (s1 I'll transfer it tonight, s4 Can we move Thursday, s6 Two taps at the kerb, s7 Am I ready, s8 You remembered, s9 Double booking saved, s10 Sunday night, s11 Cash recorded, s13 Pass day, s14 Things ADIs hear) and talking-head videos n09 (MTD 19-hour rule), n15 (**why I built DriveSchoolPro**, the founder piece) and n39 (no Black Friday tricks) | iCloud `videos/edited/`. Captions and slots are in `brand/social/metricool/skit-posts-draft.md`. |
| Raw skit takes (Block1 at home / sofa / can we move Thursday) and the long desk talk-through | iCloud `videos/` |
| s4 and s10 "before" options A and B (A was used) | iCloud `videos/Options to choose/` |
| Longer edited cuts (Accounting, Clean records, Gets you paid, Less admin, More pupils, Saves time, Things ADIs hear 81 s) | iCloud `videos/Done/` |
| App screen recordings made on the local demo, 11 Nov 2026: pay now (card), diary reschedule, desktop drag, DVSA tick, pupil progress 63%, quick booking, Money "who owes me" £0; plus the how-to clips "add your first pupil" and "import pupils" (raw, tap-marker and Andy voice-over versions; the voiced ones are live on `/start/first-pupil/`) | `~/Projects-code/reference/driveschoolpro/dsp-marketing-assets/footage/app/`. The `README.md` there lists timings and which seconds to avoid. |
| **Getting-started video** (DSP #2246, approved 13 Nov 2026): 44.8 s, 1080x2170, Andy voice-over, step captions, tap rings. Add a pupil, set working hours, book a first lesson. Unlisted on YouTube (https://www.youtube.com/watch?v=xpxbqTW-eAc); self-hosted on `/start/first-pupil/` (PR #113). Build script and voice lines in `build/`. Also two clips Claude recorded in the iOS Simulator: `availability-fast-raw.mp4` and `availability-fast-taps.mp4` (Settings > My Working Hours, Mon-Fri 08:00-17:00, Wednesday ends 12:00). Do not reuse `add-first-pupil-taps.mp4` for new edits (its tap rings are mistimed); build from `add-first-pupil-raw.mp4`. | Final and `build/`: `~/Projects-code/reference/driveschoolpro/getting-started-video/` (`getting-started-v2.mp4`). Availability clips: `~/Projects-code/reference/driveschoolpro/DSP-social-videos/`. |
| John's drop folder for new filming (raw originals; AirDrop, then move here from Downloads) | `~/Projects-code/reference/driveschoolpro/DSP-social-videos/` (moved from the Desktop on 11 Nov 2026). The social autopost job mirrors it to the box nightly and uses new clips from it. |

## 4. Sound effects (John's recordings)
- Edited files are in iCloud `voice recordings/edited/`:
  - **X01** indicator ticking
  - **X02** car door
  - **X03** keys
  - **X04** phone ping and tap (synthetic)
  - **X05** seatbelt
  - **X06** quiet car interior / engine (room tone)
- Alternates are in `edited/alternates/`. The raw recordings (car door, keys, quiet car interior) are in `voice recordings/`.
- Still wanted: handbrake, and an L-plate magnet slap.

## 5. Published and scheduled social media (this repo)
- **November 2026 library:** 45 posts. The plan is `brand/social/november-2026.md`; Metricool manifests are `brand/social/metricool/november-*.json`.
- **Videos** (server-only, rsync-protected): `public/social/video/`.
  - n-series app demos, with covers and `-vo`/`-vo2` voice-over versions
  - s-series skits
  - n09, n15, n39
- **Images and carousels:** `public/social/n*.png`.
- **Filming day 1 shot list and phone screens:** `brand/social/filming-day-1/`.

## 6. Brand and stills
- **Brand kit:** `brand/` in this repo. Logos are in `png/` and `svg/`, fonts (Lexend, Inter) in `fonts/`. There are also `social/` and `social-templates/` folders.
- **Video kit:** `video-kit/` (intro, outro and lower-third cards; rebuild with `brand/build-video-kit.py`).
- **App screenshots:**
  - `~/Projects-code/reference/driveschoolpro/dsp-marketing-assets/screenshots/` and `site-screenshots/`. **Note:** some of these show the old "MyDriveSchool" branding. Don't use those in new posts.
  - iCloud `DSP phone screens/` (23 PNGs) and `Logos+Screenshots/`.
- **Older Playwright screen recordings** (n03–n45 source): `reference/.../social-videos/recordings/`.

## 7. Made by the autopost job

| id | type | voice | joke | URL |
|---|---|---|---|---|
| excuse-montage | video | Andy | transfer-tonight | - |
| understatement | video | Ryan | cancellations | - |
| nature-doc | video | Steven | sunday-night-admin | - |
| excuse-carousel | carousel | - | - | - |
| s1 | video | John | transfer-tonight | https://driveschoolpro.com/social/video/s1.mp4 |
| s4 | video | John | - | https://driveschoolpro.com/social/video/s4.mp4 |
| s6 | video | John | - | https://driveschoolpro.com/social/video/s6.mp4 |
| s7 | video | John | - | https://driveschoolpro.com/social/video/s7.mp4 |
| s8 | video | John | - | https://driveschoolpro.com/social/video/s8.mp4 |
| s9 | video | John | - | https://driveschoolpro.com/social/video/s9.mp4 |
| s10 | video | John | sunday-night-admin | https://driveschoolpro.com/social/video/s10.mp4 |
| s11 | video | John | - | https://driveschoolpro.com/social/video/s11.mp4 |
| s13 | video | John | - | https://driveschoolpro.com/social/video/s13.mp4 |
| s14 | video | John | things-adis-hear | https://driveschoolpro.com/social/video/s14.mp4 |
| n09 | video | John | - | https://driveschoolpro.com/social/video/n09.mp4 |
| n15 | video | John | - | https://driveschoolpro.com/social/video/n15.mp4 |
| n39 | video | John | - | https://driveschoolpro.com/social/video/n39.mp4 |
| n03 | video | John | - | https://driveschoolpro.com/social/video/n03.mp4 |
| n07 | video | John | - | https://driveschoolpro.com/social/video/n07.mp4 |
| n14 | video | John | - | https://driveschoolpro.com/social/video/n14.mp4 |
| n17 | video | John | - | https://driveschoolpro.com/social/video/n17.mp4 |
| n20 | video | - | - | https://driveschoolpro.com/social/video/n20.mp4 |
| n24 | video | John | - | https://driveschoolpro.com/social/video/n24.mp4 |
| n26 | video | John | - | https://driveschoolpro.com/social/video/n26.mp4 |
| n28 | video | John | - | https://driveschoolpro.com/social/video/n28.mp4 |
| n31 | video | - | - | https://driveschoolpro.com/social/video/n31.mp4 |
| n33 | video | John | - | https://driveschoolpro.com/social/video/n33.mp4 |
| n37 | video | John | - | https://driveschoolpro.com/social/video/n37.mp4 |
| n45 | video | John | - | https://driveschoolpro.com/social/video/n45.mp4 |
| car-001 | carousel | - | - | https://driveschoolpro.com/social/video/auto/car-001-01.png |

## Rules that apply to every post
- Follow the house rules in `november-2026.md`: UK English, plain words, no hype, and no emojis in body text (one is fine in an Instagram first line). Label acted skits as "acted".
- Claim only features that exist: diary, reminders, card payments (including pay at booking), DVSA 27-skill progress, briefings, invoices.
- Use made-up names in fake chats.
- Offer wording: "Free until 31 March 2027". Check `src/config/offer.ts` before use.
- **Auto-publishing is approved** (John, 11 Nov 2026). The posting job may publish directly to Metricool, as long as every post passes the checks above. John gets a summary after each run.
- **The social-autopost job** (agentbox `social-autopost/`, Thursdays 06:00 on the box) picks existing media from `media-index.json` and adds every new ad and carousel it publishes to §7 and `media-index.json` through one rolling PR (branch `social-autopost/<date>`; later runs add to it until it is merged). When you add or remove media by hand, update `media-index.json` in the same change (paths relative to the media mirror, or `public/…` for files in this repo), or the job cannot use it. Stop it: `ssh agentbox 'touch ~/agentbox-secrets/social-autopost.off'`. Details: agentbox `docs/social-autopost.md`.
