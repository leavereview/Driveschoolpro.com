# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check with astro check, then build static site
npm run preview  # Preview built site locally
```

## Architecture

This is a static marketing site built with **Astro 4** and **Tailwind CSS**. It generates a fully static site with no client-side JavaScript except for the mobile menu toggle.

### Project Structure

- `src/pages/` - Astro pages (file-based routing with trailing slashes)
- `src/layouts/BaseLayout.astro` - Main layout with SEO meta tags, schema.org markup, and navigation/footer
- `src/components/` - Navigation and Footer components
- `src/content/blog/` - Markdown blog posts using Astro content collections
- `src/content/config.ts` - Blog collection schema (title, description, date, image, tags, author)
- `src/styles/global.css` - Tailwind base/components/utilities with custom component classes

### Key Patterns

**Social posts, ads and videos:** read `brand/social/MEDIA-LIBRARY.md` first. It lists every recording, footage folder, sound effect and voice decision (John's own voice lines and the ElevenLabs voices).

**Brand Colors** (defined in `tailwind.config.mjs`):
- `brand-navy`: #1A1A2E (primary dark)
- `brand-red`: #E94560 (accent/CTA)
- `brand-red-light`: #FFE7EC (backgrounds)

**CSS Component Classes** (in `global.css`):
- `.btn-primary`, `.btn-secondary`, `.btn-outline` - Button styles
- `.card` - Card container with hover effects
- `.section` - Standard page section padding
- `.container-custom` - Max-width container
- `.prose` - Blog content typography

**Page Types**:
- Pillar pages (e.g., `driving-school-management-software.astro`) - SEO landing pages. The homepage targets "driving school software"; `/driving-school-software/` 301s to `/` (nginx, 16 Oct 2026)
- Standard pages (about, contact, pricing)
- Blog index and dynamic `[slug].astro` for posts

**"Updated" dates** (issue #16): commercial pages set `modifiedDate="YYYY-MM-DD"` (plus `showUpdated` on
`BaseLayout`; `LandingLayout` shows it automatically). Change the date by hand when the page's
content changes, never for refactors or schema fixes, and never compute it at build time. The same
literal feeds the visible "Updated" line, `dateModified` and the sitemap `<lastmod>`
(`scripts/sitemap-lastmod.mjs`). Pages without one fall back to their last git commit, which is why
`deploy.yml` checks out with `fetch-depth: 0`.

## Deployment

**Auto-deploy: every merge to `main` deploys via GitHub Actions** (`.github/workflows/deploy.yml`;
also runs Mondays 09:00 UTC and on manual dispatch). It runs on Node 24 (`.nvmrc`), does
`npm ci && npm run build`, then rsyncs `dist/` to Lightsail over SSH using the repo secrets
`DEPLOY_KEY` (private key for `ubuntu@`) and `SERVER_IP`. A concurrency group stops two deploys overlapping.
If the build or postbuild checks fail, nothing is deployed — check `gh run list --workflow deploy.yml`.

Manual deploy (same flags as CI):

```bash
npm run build
rsync -rltDvz --delete --filter='P /social/**' --filter='P /.DS_Store' dist/ lightsail:/var/www/driveschoolpro.com/
```

**Never rsync with a bare `--delete`.** The server holds files that aren't in the repo
(`social/video/*.mp4`, used by scheduled social posts); the `P` (protect) filters keep them. Before
adding new server-only files, add a matching protect filter here and in the workflow, and check with
`rsync -avzn --delete <same filters> dist/ lightsail:/var/www/driveschoolpro.com/ | grep deleting`.
Always use the `lightsail` SSH alias, not the raw IP.

`social/video/auto/` on the server is written by the social-autopost job (videos, stills and covers). Deploys must never delete or overwrite it: it is covered by the `P /social/**` protect filter.

## PPC Landing Pages (external contracts — do not rename or noindex)

Two pages are **Google Ads landing pages** (they also double as indexable SEO pages). Their
URLs and H1s are referenced by live Google Ads campaigns — once ads are live, treat the URLs
as **external contracts**: don't rename, move, or noindex them without updating the ads first.

- `/driving-instructor-software` — solo ADI lander (leads with Solo £22/mo)
- `/driving-school-software-uk` — multi-instructor lander (leads with School £22 + £10/extra instructor; prices apply from 1 April 2027)
  - Note the `-uk` slug: it was created when `/driving-school-software` was the SEO pillar. That page now 301s to the homepage (16 Oct 2026), which owns the head term "driving school software"; the lander keeps its slug because ads point at it.

Both use `LandingLayout` (no global nav — company details + GA4/Ads conversion are inherited from
the layout), link to `/compare/total-drive/`, and stay in the sitemap by default. They cross-link
(solo ↔ school) and are linked from the homepage plan cards so each satisfies `verify-seo.js`'s
≥2-inbound-internal-links rule. Pure PPC-only variants still live under `/ads/*` (noindexed).
