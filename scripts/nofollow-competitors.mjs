// Astro integration: after the HTML is generated, add rel="nofollow noopener" to every
// <a> that points at a competitor domain (scripts/competitor-domains.mjs). Existing rel
// values (e.g. noreferrer) are kept; href, target and text are untouched.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPETITOR_DOMAINS } from './competitor-domains.mjs';

export function isCompetitorHost(host) {
  host = host.toLowerCase().replace(/^www\./, '');
  return COMPETITOR_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
}

export function addNofollow(html) {
  let changed = 0;
  const out = html.replace(/<a\s[^>]*>/gi, (tag) => {
    const href = tag.match(/\shref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const url = href && (href[1] ?? href[2] ?? href[3]);
    if (!url || !/^https?:\/\//i.test(url)) return tag;
    let host;
    try { host = new URL(url).hostname; } catch { return tag; }
    if (!isCompetitorHost(host)) return tag;
    const rel = tag.match(/\srel=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const tokens = new Set(((rel && (rel[1] ?? rel[2] ?? rel[3])) || '').split(/\s+/).filter(Boolean));
    const before = tokens.size;
    tokens.add('nofollow');
    tokens.add('noopener');
    if (rel && tokens.size === before) return tag;
    changed++;
    const value = [...tokens].join(' ');
    return rel
      ? tag.replace(rel[0], ` rel="${value}"`)
      : tag.replace(/<a/i, `<a rel="${value}"`);
  });
  return { html: out, changed };
}

export default function nofollowCompetitors() {
  return {
    name: 'nofollow-competitors',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        let files = 0, links = 0;
        const walk = (d) => {
          for (const f of readdirSync(d)) {
            const p = join(d, f);
            if (statSync(p).isDirectory()) walk(p);
            else if (p.endsWith('.html')) {
              const { html, changed } = addNofollow(readFileSync(p, 'utf8'));
              if (changed) { writeFileSync(p, html); files++; links += changed; }
            }
          }
        };
        walk(fileURLToPath(dir));
        logger.info(`nofollow added to ${links} competitor link(s) in ${files} page(s)`);
      },
    },
  };
}
