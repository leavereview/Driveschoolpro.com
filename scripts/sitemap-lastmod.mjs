/**
 * Honest <lastmod> dates for @astrojs/sitemap.
 *
 * Why this exists: the obvious implementation is
 *
 *     serialize(item) { item.lastmod = new Date().toISOString(); return item; }
 *
 * which stamps EVERY url with the build time on EVERY deploy. That tells Google all
 * 96 pages changed every time you deploy a typo fix, which is false. Google's sitemap
 * docs are explicit that lastmod is ignored when it is found to be unreliable, so the
 * dishonest version buys nothing and can cost the signal entirely.
 *
 * This module derives a real per-page date instead, in priority order:
 *
 *   1. an explicit author date: frontmatter `updatedDate`, or in an .astro page a
 *      literal `modifiedDate="YYYY-MM-DD"` prop or `const updated = 'YYYY-MM-DD'` —
 *      the same date the page shows as "Updated" and puts in dateModified
 *   2. git last-commit date for the source file — reflects actual edits
 *   3. frontmatter `date` / `pubDate` — publish date, correct when never edited
 *   4. filesystem mtime — only reached for files git doesn't know about yet, where
 *      "when the file was last written" really is the honest answer
 *   5. nothing — omit lastmod rather than invent one
 *
 * Usage in astro.config.mjs:
 *
 *     import { buildLastmodMap, lastmodSerializer } from '../scripts/sitemap-lastmod.mjs';
 *     const lastmod = buildLastmodMap(new URL('.', import.meta.url).pathname);
 *     // ...
 *     sitemap({ serialize: lastmodSerializer(lastmod) })
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PAGE_EXT = new Set(['.astro', '.md', '.mdx', '.html']);

/** Recursively collect files under dir. Returns [] if dir is absent. */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * A shallow clone (actions/checkout's default fetch-depth: 1) has one commit, so
 * every file's "last commit" is that commit and every lastmod becomes the deploy
 * date. Detect it and skip git dates rather than publish 90-odd identical ones.
 */
let shallowWarned = false;
const shallowCache = new Map();
function isShallow(cwd) {
  if (!shallowCache.has(cwd)) shallowCache.set(cwd, checkShallow(cwd));
  return shallowCache.get(cwd);
}
function checkShallow(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() === 'true';
  } catch {
    return false;
  }
}

/** Last commit date for a file, ISO 8601, or null if untracked / not a repo / shallow. */
function gitLastModified(file, cwd) {
  if (isShallow(cwd)) {
    if (!shallowWarned) {
      console.warn('[sitemap-lastmod] shallow git clone: skipping git dates (use fetch-depth: 0)');
      shallowWarned = true;
    }
    return null;
  }
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

/** An explicit date set by hand in an .astro page (see priority 1 above). */
function astroPageDate(file) {
  if (extname(file) !== '.astro') return null;
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  const m =
    src.match(/\bmodifiedDate\s*=\s*["']([0-9]{4}-[0-9]{2}-[0-9]{2})["']/) ||
    src.match(/\bconst\s+updated\s*=\s*["']([0-9]{4}-[0-9]{2}-[0-9]{2})["']/);
  return m ? m[1] : null;
}

/** Pull date-ish fields out of YAML frontmatter without a YAML dependency. */
function frontmatterDates(file) {
  const astroDate = astroPageDate(file);
  if (astroDate) return { updated: astroDate, published: null };
  let head;
  try {
    head = readFileSync(file, 'utf8').slice(0, 4000);
  } catch {
    return {};
  }
  if (!head.startsWith('---')) return {};
  const end = head.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = head.slice(3, end);

  const read = (key) => {
    const m = block.match(new RegExp(`^\\s*${key}\\s*:\\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2}[^"'\\n]*)`, 'mi'));
    return m ? m[1].trim() : null;
  };

  return {
    updated: read('updatedDate') || read('lastmod') || read('modifiedDate'),
    published: read('pubDate') || read('date') || read('publishDate'),
  };
}

/** Normalise any url or path to a bare key: "", "about", "blog/foo". */
function key(pathish) {
  return String(pathish)
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/[?#].*$/, '')
    .replace(/^\/+|\/+$/g, '');
}

/** Turn a src/pages file path into a route key, or null if it is not a static route. */
function routeKeyForPage(relPath) {
  if (!PAGE_EXT.has(extname(relPath))) return null;
  // Dynamic routes ([slug].astro, [...rest].astro) can't be mapped to one file date.
  if (relPath.includes('[')) return null;
  let route = relPath.replace(/\\/g, '/').replace(/\.(astro|md|mdx|html)$/, '');
  if (route.endsWith('/index')) route = route.slice(0, -'/index'.length);
  if (route === 'index') route = '';
  return route;
}

/** Filesystem mtime, for files git has never seen (new, uncommitted pages). */
function fileMtime(file) {
  try {
    return statSync(file).mtime;
  } catch {
    return null;
  }
}

function toIso(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Build a Map of route key -> ISO date for one site.
 * @param {string} siteRoot absolute path to the site folder (contains src/, astro.config.mjs)
 * @returns {Map<string,string>}
 */
export function buildLastmodMap(siteRoot) {
  const map = new Map();

  const record = (routeKey, file) => {
    if (routeKey === null) return;
    const { updated, published } = frontmatterDates(file);
    const date =
      toIso(updated) ||
      toIso(gitLastModified(file, siteRoot)) ||
      toIso(published) ||
      // In a shallow clone mtime is the checkout time, i.e. the deploy date: skip it too.
      (isShallow(siteRoot) ? null : toIso(fileMtime(file)));
    if (date) map.set(routeKey, date);
  };

  // Static routes under src/pages
  const pagesDir = join(siteRoot, 'src', 'pages');
  for (const file of walk(pagesDir)) {
    const rel = file.slice(pagesDir.length + 1);
    record(routeKeyForPage(rel), file);
  }

  // Content collections rendered at /<collection>/<slug>/
  const contentDir = join(siteRoot, 'src', 'content');
  for (const file of walk(contentDir)) {
    if (!['.md', '.mdx'].includes(extname(file))) continue;
    const rel = file.slice(contentDir.length + 1).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 2) continue; // config.ts and friends
    const collection = parts[0];
    const slug = parts.slice(1).join('/').replace(/\.(md|mdx)$/, '');
    record(`${collection}/${slug}`, file);
  }

  return map;
}

/**
 * @param {Map<string,string>} map from buildLastmodMap
 * @returns {(item: {url: string}) => object} serialize fn for @astrojs/sitemap
 */
export function lastmodSerializer(map) {
  return (item) => {
    const date = map.get(key(item.url));
    if (date) item.lastmod = date;
    // No date found -> omit lastmod. An absent value is honest; a wrong one is not.
    return item;
  };
}
