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
