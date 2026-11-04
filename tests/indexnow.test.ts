import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildManifest, changedUrls, findKey, htmlFileFor } from '../scripts/indexnow.mjs';

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'));
  const dist = path.join(dir, 'dist');
  fs.mkdirSync(path.join(dist, 'pricing'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'index.html'), '<h1>Home</h1>');
  fs.writeFileSync(path.join(dist, 'pricing', 'index.html'), '<h1>Pricing</h1>');
  fs.writeFileSync(
    path.join(dist, 'sitemap-0.xml'),
    '<urlset><url><loc>https://driveschoolpro.com/</loc></url>' +
      '<url><loc>https://driveschoolpro.com/pricing/</loc></url>' +
      '<url><loc>https://driveschoolpro.com/missing/</loc></url></urlset>',
  );
  fs.writeFileSync(path.join(dist, 'sitemap-index.xml'), '<sitemapindex><sitemap><loc>https://driveschoolpro.com/sitemap-0.xml</loc></sitemap></sitemapindex>');
  return { dir, dist };
}

test('manifest covers sitemap URLs that have a built page', () => {
  const { dist } = fixture();
  const m = buildManifest(dist);
  assert.deepEqual(Object.keys(m).sort(), ['https://driveschoolpro.com/', 'https://driveschoolpro.com/pricing/']);
  assert.match(m['https://driveschoolpro.com/'], /^[0-9a-f]{64}$/);
});

test('htmlFileFor maps URLs to dist files and rejects other hosts', () => {
  const { dist } = fixture();
  assert.equal(htmlFileFor(dist, 'https://driveschoolpro.com/pricing/'), path.join(dist, 'pricing', 'index.html'));
  assert.equal(htmlFileFor(dist, 'https://example.com/pricing/'), null);
  assert.equal(htmlFileFor(dist, 'https://driveschoolpro.com/missing/'), null);
});

test('changedUrls returns new, changed and removed URLs only', () => {
  const prev = { 'https://x/a/': '1', 'https://x/b/': '2', 'https://x/gone/': '3' };
  const curr = { 'https://x/a/': '1', 'https://x/b/': '9', 'https://x/new/': '4' };
  assert.deepEqual(changedUrls(prev, curr), ['https://x/b/', 'https://x/gone/', 'https://x/new/']);
  assert.deepEqual(changedUrls(curr, curr), []);
  assert.equal(changedUrls({}, curr).length, 3); // first deploy submits everything
});

test('findKey reads the key file whose content matches its name', () => {
  const { dir } = fixture();
  const pub = path.join(dir, 'public');
  fs.mkdirSync(pub);
  fs.writeFileSync(path.join(pub, 'robots.txt'), 'User-agent: *');
  fs.writeFileSync(path.join(pub, 'ffffffffffffffffffffffffffffffff.txt'), 'not-the-key');
  assert.equal(findKey(pub), null);
  const key = 'd19a3d40e95425e6d5e99edf3d89c727';
  fs.writeFileSync(path.join(pub, `${key}.txt`), `${key}\n`);
  assert.equal(findKey(pub), key);
});

test('the repo publishes a valid key file', () => {
  assert.match(findKey(path.join(process.cwd(), 'public')) ?? '', /^[0-9a-f]{32}$/);
});
