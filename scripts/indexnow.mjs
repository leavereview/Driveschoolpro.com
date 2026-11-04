#!/usr/bin/env node
/**
 * IndexNow: tell Bing (and the other IndexNow engines) which pages changed in a deploy.
 *
 * Bing's index feeds Copilot and is used by ChatGPT search, so changed pages reach
 * those answers sooner (issue #16, docs/research/2026-11-04-ai-visibility.md, action 4).
 *
 * Only pages whose HTML changed since the last deploy are submitted. Each deploy publishes
 * dist/indexnow-manifest.json (URL -> sha256 of the page's HTML); the next deploy compares
 * against the live copy. Builds are deterministic, so an unchanged page has the same hash.
 *
 *   node scripts/indexnow.mjs manifest           write dist/indexnow-manifest.json
 *   node scripts/indexnow.mjs submit <prev.json> submit URLs that differ from <prev.json>
 *
 * The URL set is the sitemap (indexable pages only). Removed pages are submitted too, so
 * engines re-crawl them and drop them. A failed submission never fails the deploy.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SITE = 'https://driveschoolpro.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MANIFEST = 'indexnow-manifest.json';
const MAX_URLS = 10_000; // IndexNow limit per request

/** URLs listed in every sitemap-*.xml in distDir (excluding the index file). */
export function sitemapUrls(distDir) {
  const urls = new Set();
  for (const f of fs.readdirSync(distDir)) {
    if (!/^sitemap-\d+\.xml$/.test(f)) continue;
    const xml = fs.readFileSync(path.join(distDir, f), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1].trim());
  }
  return [...urls].sort();
}

/** Map a site URL to its built HTML file, or null if it isn't in dist. */
export function htmlFileFor(distDir, url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  // Compare the parsed origin, not a string prefix (https://driveschoolpro.com.evil.com).
  if (parsed.origin !== new URL(SITE).origin) return null;
  const p = decodeURIComponent(parsed.pathname) || '/';
  if (p.split('/').includes('..')) return null;
  const file = p.endsWith('/') ? path.join(distDir, p, 'index.html') : path.join(distDir, p);
  return fs.existsSync(file) ? file : null;
}

/** { url: sha256 } for every sitemap URL that has a built page. */
export function buildManifest(distDir) {
  const manifest = {};
  for (const url of sitemapUrls(distDir)) {
    const file = htmlFileFor(distDir, url);
    if (!file) continue;
    manifest[url] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return manifest;
}

/** URLs that are new, changed or removed between two manifests. */
export function changedUrls(previous, current) {
  const out = new Set();
  for (const [url, hash] of Object.entries(current)) if (previous[url] !== hash) out.add(url);
  for (const url of Object.keys(previous)) if (!(url in current)) out.add(url);
  return [...out].sort();
}

/** The IndexNow key: the 32-hex-char public/<key>.txt file whose content is the key. */
export function findKey(publicDir) {
  for (const f of fs.readdirSync(publicDir)) {
    const m = f.match(/^([0-9a-f]{32})\.txt$/);
    if (m && fs.readFileSync(path.join(publicDir, f), 'utf8').trim() === m[1]) return m[1];
  }
  return null;
}

function readJson(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

async function main() {
  const [cmd, prevFile] = process.argv.slice(2);
  const distDir = path.join(process.cwd(), 'dist');

  if (cmd === 'manifest') {
    const manifest = buildManifest(distDir);
    fs.writeFileSync(path.join(distDir, MANIFEST), JSON.stringify(manifest));
    console.log(`IndexNow: manifest written for ${Object.keys(manifest).length} URLs`);
    return;
  }

  if (cmd === 'submit') {
    const previous = prevFile ? readJson(prevFile) : {};
    const current = readJson(path.join(distDir, MANIFEST));
    if (!Object.keys(current).length) {
      console.log('::warning::IndexNow: no manifest in dist/, nothing submitted');
      return;
    }
    const urls = changedUrls(previous, current).slice(0, MAX_URLS);
    if (!urls.length) {
      console.log('IndexNow: no pages changed, nothing submitted');
      return;
    }
    const key = findKey(path.join(process.cwd(), 'public'));
    if (!key) {
      console.log('::warning::IndexNow: no key file in public/, nothing submitted');
      return;
    }
    const body = { host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      // 200 OK and 202 Accepted both mean the submission was received.
      if (res.ok) {
        console.log(`IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`);
        for (const u of urls) console.log(`  ${u}`);
      } else {
        console.log(`::warning::IndexNow: HTTP ${res.status} ${await res.text().catch(() => '')}`.trim());
      }
    } catch (err) {
      console.log(`::warning::IndexNow: request failed: ${err.message}`);
    }
    return;
  }

  console.error('Usage: node scripts/indexnow.mjs manifest | submit <previous-manifest.json>');
  process.exit(2);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
