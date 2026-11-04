import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildLastmodMap } from '../scripts/sitemap-lastmod.mjs';

// A tiny site with two pages committed on different days, plus one with an explicit
// frontmatter date. Issue #16: a shallow clone stamped every page with HEAD's date.
function makeSite() {
  const root = mkdtempSync(join(tmpdir(), 'lastmod-'));
  const site = join(root, 'site');
  const pages = join(site, 'src', 'pages');
  mkdirSync(pages, { recursive: true });
  const git = (args: string[], date?: string) =>
    execFileSync('git', args, {
      cwd: site,
      stdio: 'ignore',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t',
        ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}),
      },
    });
  git(['init', '-q']);
  writeFileSync(join(pages, 'old.astro'), '<p>old</p>');
  writeFileSync(join(pages, 'dated.md'), '---\nupdatedDate: 2026-02-03\n---\nhi');
  git(['add', '.']);
  git(['commit', '-q', '-m', 'one'], '2026-01-10T10:00:00Z');
  writeFileSync(join(pages, 'new.astro'), '<p>new</p>');
  git(['add', '.']);
  git(['commit', '-q', '-m', 'two'], '2026-03-20T10:00:00Z');
  return { root, site };
}

test('full clone: each page gets its own last-commit date; frontmatter wins', () => {
  const { root, site } = makeSite();
  try {
    const map = buildLastmodMap(site);
    assert.equal(map.get('old'), '2026-01-10T10:00:00.000Z');
    assert.equal(map.get('new'), '2026-03-20T10:00:00.000Z');
    assert.equal(map.get('dated'), '2026-02-03T00:00:00.000Z');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('shallow clone: git and mtime dates are not used, lastmod is omitted instead', () => {
  const { root, site } = makeSite();
  const shallow = join(root, 'shallow');
  try {
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${site}`, shallow], { stdio: 'ignore' });
    const map = buildLastmodMap(shallow);
    assert.equal(map.has('old'), false, 'old page must not get HEAD date');
    assert.equal(map.has('new'), false, 'no mtime fallback either');
    assert.equal(map.get('dated'), '2026-02-03T00:00:00.000Z');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
