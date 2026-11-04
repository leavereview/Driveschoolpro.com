/**
 * Visible "Updated" dates and schema dateModified, from the SAME source as the
 * sitemap <lastmod> (scripts/sitemap-lastmod.mjs): frontmatter date, else the last
 * git commit that touched the page's source file. Returns null when there's no
 * trustworthy date (e.g. a shallow clone) — callers then show nothing rather than
 * a wrong date. Issue #16.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pageLastModified } from '../../scripts/sitemap-lastmod.mjs';

const siteRoot = process.cwd();

/** ISO 8601 last-modified date for a static route such as "/compare/total-drive/", or null. */
export function lastModifiedFor(pathname: string): string | null {
  const route = pathname.replace(/^\/+|\/+$/g, '');
  const pages = join(siteRoot, 'src', 'pages');
  const candidates = route
    ? [`${route}.astro`, `${route}/index.astro`, `${route}.md`, `${route}/index.md`]
    : ['index.astro'];
  for (const rel of candidates) {
    const file = join(pages, rel);
    if (existsSync(file)) return pageLastModified(file, siteRoot);
  }
  return null;
}

/** "4 November 2026", in UK time. */
export function formatUkDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  });
}
