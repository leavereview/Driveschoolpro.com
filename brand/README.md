# DriveSchoolPro brand kit

Chosen 16 Oct 2026: **Direction C, "27 skills"**: a ring of 27 segments (one per DVSA skill)
filling up in red around a tick. Not served by the website; files for social profiles, app
stores, print and Canva. The website copies it uses live in `public/images/brand/` and
`public/` (favicon, icons).

## Colours
| Token | Hex | Use |
|---|---|---|
| Navy | `#1A1A2E` | Backgrounds, wordmark, text |
| Red | `#E94560` | Progress segments, "Pro", calls to action |
| Light red | `#FFE7EC` | Soft backgrounds, badges |
| Ring off (dark) | `#3A3A55` | Unfilled segments on navy |
| Ring off (light) | `#D9D9E3` | Unfilled segments on white |

## Type
- Logo wordmark: **Lexend Bold**, outlined in the SVGs (no font needed).
- Website and documents: Inter.

## Files
| File | Use |
|---|---|
| `svg/logo-horizontal.svg`, `png/logo-horizontal-1200.png` | Main logo on light backgrounds |
| `svg/logo-horizontal-reversed.svg`, `png/logo-horizontal-reversed-1200.png` | On navy or dark photos |
| `svg/logo-stacked.svg`, `png/logo-stacked-600.png` | Square spaces, printed material |
| `svg/mark-tile.svg`, `png/icon-512.png` | App icon look (rounded navy tile) |
| `svg/mark-square.svg`, `png/app-store-icon-1024.png` | App Store / Google Play upload (full bleed; stores round the corners) |
| `svg/mark-avatar.svg`, `png/social-avatar-800.png` | Profile picture on Facebook, Instagram, YouTube, LinkedIn, TikTok (safe for circle crops) |
| `svg/mark-onlight.svg`, `svg/mark-ondark.svg` | Mark on its own, no tile |
| `svg/mark-mono-navy.svg`, `svg/mark-mono-white.svg` | One-colour use (embroidery, stamps, car signage) |
| `svg/favicon.svg`, `png/favicon-16/32/48.png` | Browser tab (simplified ring that reads at 16px) |
| `png/banner-linkedin-1128x191.png` | LinkedIn company page cover |
| `png/banner-facebook-1640x624.png` | Facebook page cover |
| `png/banner-youtube-2560x1440.png` | YouTube channel art (content inside the 1546×423 safe area) |
| `png/banner-og-1200x630.png` | Link previews / generic social share image |

## Rules
- Keep clear space around the mark equal to one third of its width.
- Don't recolour segments, change the number of segments (always 27) or move the tick.
- Below 32px use `favicon.svg`; the segmented ring blurs at that size.
- Never place the navy wordmark on navy; use the reversed version.

Regenerate everything: `python3 brand/build-brand-kit.py <dir containing fontdl/Lexend-var.ttf>`
(writes to `<dir>/kit`). Lexend is OFL, from github.com/google/fonts.

## Social post templates (`social-templates/`)
Six post types in three sizes: 1080×1080 (feed square), 1080×1350 (feed portrait 4:5) and
1080×1920 (story / Reel cover). Rebuild: `python3 brand/build-social-templates.py`.

| Type | Look | Label |
|---|---|---|
| `tip` | Navy, big headline, red accent bar | ADI TIP |
| `feature` | White, phone frame with a light red circle behind it, numbered steps | HOW TO |
| `quote` | White, large red quote marks, name and business line with avatar ring | INSTRUCTOR STORY |
| `stat` | Navy, big red number, caption | BY THE NUMBERS |
| `announcement` | White with a bold red band (e.g. "Free until 31 March 2027") | NEWS |
| `mtd` | Calm light red, guide headline, tick list | MAKING TAX DIGITAL |

Files: `png/<type>-<size>-bg.png` and `-sample.png`, with `svg/` versions of each.
- **`-bg`**: background, decoration, label pill and logo footer (logo + driveschoolpro.com), no
  placeholder copy. Use these.
- **`-sample`**: the same with placeholder copy ("Headline goes here") showing where text goes
  and at what size. Reference only; don't post them.
- **SVGs** keep text as editable `<text>` (Lexend Bold / Inter), for Figma, Illustrator or
  Inkscape with the fonts installed. PNGs are rendered from outlined text, so they need no fonts.
- `contact-sheet.png` shows all 18 samples.
- Stories keep the top 250 px and bottom 340 px free of key content; the footer sits just above
  the bottom zone.

**Canva**: upload the `-bg` PNG, create a design at the same size, drag the image in and right-click >
"Set image as background". Add text with Lexend (headlines, Bold) and Inter (body), both in Canva's
font list, sized and placed like the matching `-sample`. Colours: `#1A1A2E`, `#E94560`, `#FFE7EC`,
muted text `#C9C9DA` on navy / `#55556E` on white. For `feature`, drop the app screenshot over the
grey phone screen, crop to fit and round the corners. Save each finished layout as a Canva template.

**Metricool**: either design in Canva (Metricool's Canva integration pulls the design in), or upload
the `-bg` PNG to the post and add the headline in Metricool's image editor. Use 1080×1350 for
Instagram/Facebook feed, 1080×1080 for LinkedIn and X, 1080×1920 for stories.

## Video kit (`video-kit/`)
Intro and outro cards (1080×1920, 1920×1080), a 3-second animated logo intro (MP4), lower-third
name strap and logo watermarks (transparent PNGs) and a 9:16 safe-zone overlay. Caption style,
safe zones, CapCut settings and music rules: `video-kit/README.md`.
Rebuild: `python3 brand/build-video-kit.py`.

## Fonts (`fonts/`)
Lexend and Inter variable fonts from github.com/google/fonts with their OFL licences
(`OFL-Lexend.txt`, `OFL-Inter.txt`), plus static instances generated by the build scripts
(`Lexend-Bold.ttf`, `Inter-Regular.ttf`, `Inter-SemiBold.ttf`, `Inter-Bold.ttf`) for installing on a
Mac or uploading to Canva / CapCut. Shared drawing code for the two build scripts: `brandlib.py`.
Build dependencies: `pip install --user cairosvg uharfbuzz fonttools pillow` (cairosvg needs
`brew install cairo`).
