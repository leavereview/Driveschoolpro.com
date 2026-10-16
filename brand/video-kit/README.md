# DriveSchoolPro video kit

Rebuild everything: `python3 brand/build-video-kit.py` (needs cairosvg, uharfbuzz, fonttools,
Pillow; ffmpeg for the MP4s). Fonts are in `brand/fonts/`. Install `Lexend-Bold.ttf`,
`Inter-Regular.ttf` and `Inter-SemiBold.ttf` on your Mac (double-click > Install) so CapCut
desktop can use them.

## Files
| File | Use |
|---|---|
| `intro-1080x1920.png`, `intro-1920x1080.png` | Opening card (0.5 to 1.5 s). Logo and tagline on navy |
| `logo-intro-1080x1920.mp4`, `logo-intro-1920x1080.mp4` | 3 s animated intro: ring segments fill, tick draws, wordmark rises. 30 fps, H.264 |
| `outro-1080x1920.png`, `outro-1920x1080.png` | End card (2 to 4 s): logo, "Free until 31 March 2027", driveschoolpro.com |
| `lower-third-1920x1080.png`, `lower-third-1080x1920.png` | Full-frame transparent overlays with the "John Powell, Founder, DriveSchoolPro" strap already positioned. Drop on a track above the video at 0,0 |
| `lower-third-strap.png` | The strap on its own (transparent) if you want to place it yourself |
| `watermark-mark-400.png` | Ring mark, transparent with a soft shadow. Corner watermark |
| `watermark-logo-800.png` | Mark plus wordmark, transparent with a soft shadow |
| `safe-zones-1080x1920.png` | Guide overlay for 9:16 edits. Put it on the top track while editing, then **delete it before export** |

Update the outro when the offer changes (edit the text in `build-video-kit.py` and rebuild).

## Captions (1080×1920)
| Setting | Value |
|---|---|
| Font | **Lexend Bold** (fallback: Inter Bold) |
| Size | 64 to 72 px cap-to-cap on a 1080 wide frame (about 6 to 7% of width). In CapCut this is roughly size 7 to 9 with the default text box; check against the safe-zone overlay |
| Colour | White `#FFFFFF` text |
| Background | Navy `#1A1A2E` box at 85 to 90% opacity, corner radius medium, or no box with a 6 to 8 px navy stroke |
| Highlight | One keyword per caption in red `#E94560` (or a red box behind the word with white text). Not more than one |
| Lines | **Max 2 lines**, about 28 to 32 characters per line. Split on natural phrases |
| Alignment | Centred |
| Position | Lower middle: text block between **y 1300 and 1540** (the white box on the safe-zone overlay) |
| Case | Sentence case. No ALL CAPS sentences |
| Timing | 1 to 2 s per caption; keep in sync with speech |

On 16:9 (YouTube): Lexend Bold 52 to 60 px, white on navy box, bottom centre with 80 px bottom margin.

## Safe zones (Reels, Shorts, TikTok, 1080×1920)
One set of rules that works on all three:
- **Top 250 px**: keep clear (account name, progress bar, "Reels"/"Following" tabs).
- **Bottom 340 px**: keep clear (caption text, music ticker, reply bar). TikTok's caption can run
  taller on long descriptions, so keep important things above y 1540.
- **Right 140 px** (from y 250 to y 1580): like / comment / share buttons. Keep text out of it.
- **Left 60 px**: margin.
- Key content therefore lives inside x 60 to 940, y 250 to 1580. Faces and the product screen
  sit in the upper half; captions in the lower middle; lower-third strap just above captions
  (it is placed at y 1120 to 1260 in `lower-third-1080x1920.png`).
- Cover image for a Reel is cropped to 4:5 in the profile grid (centre 1080×1350); keep the cover
  headline inside that.

## Recommended CapCut settings
- **Project**: 9:16, 1080×1920 (16:9 1920×1080 for YouTube). Frame rate 30 fps (match your footage
  if it is 25 or 60).
- **Auto captions**: Text > Auto captions > English (UK). Proof-read every caption (DVSA, ADI,
  PDI, MTD and place names are often wrong), then apply the style above and save it as a preset
  ("DSP captions") so every video matches.
- **Audio**: voice normalised to around -14 LUFS (Audio > Enhance voice / Normalise loudness);
  music ducked under voice.
- **Export**: 1080p, 30 fps, H.264 (HEVC is fine for Instagram/TikTok), bit rate "Higher" or
  about 16 to 20 Mbps, "Optimise for upload" on. Turn off the CapCut ending/watermark.
- **Structure**: hook in the first 1 to 2 s (no logo intro on short-form; the logo animation is
  for YouTube and longer explainers), outro card for 2 to 3 s at the end.

## Music
- **Royalty-free or licensed for commercial use only.** DriveSchoolPro is a business account:
  trending chart tracks are not licensed for business use and can get videos muted or removed.
- Good sources: CapCut's library filtered to "Commercial use", Meta Sound Collection (Instagram
  and Facebook), TikTok Commercial Music Library, YouTube Audio Library. Check the licence and
  credit requirement for each track.
- Keep music 18 to 24 dB under the voice (in CapCut, music volume around 10 to 20% when speech is
  on top). Calm, upbeat, no vocals behind talking.
- Never use a track you can't show a licence for if asked.
