import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildLastmodMap, lastmodSerializer } from '../scripts/sitemap-lastmod.mjs';

function site(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'lastmod-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = join(root, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

test('an .astro modifiedDate prop sets lastmod', () => {
  const root = site({
    'src/pages/pricing.astro': '---\nconst x = 1;\n---\n<BaseLayout title="Pricing" modifiedDate="2026-10-19" showUpdated>\n</BaseLayout>\n',
  });
  assert.equal(buildLastmodMap(root).get('pricing'), '2026-10-19T00:00:00.000Z');
});

test("an .astro const updated sets lastmod", () => {
  const root = site({
    'src/pages/about/facts.astro': "---\nconst updated = '2026-10-20';\n---\n<BaseLayout modifiedDate={updated}></BaseLayout>\n",
  });
  assert.equal(buildLastmodMap(root).get('about/facts'), '2026-10-20T00:00:00.000Z');
});

test('blog frontmatter updatedDate still wins for content', () => {
  const root = site({
    'src/content/blog/post.md': '---\ntitle: x\ndate: 2026-01-01\nupdatedDate: 2026-11-02\n---\nbody\n',
  });
  const item = lastmodSerializer(buildLastmodMap(root))({ url: 'https://driveschoolpro.com/blog/post/' });
  assert.equal((item as { lastmod?: string }).lastmod, '2026-11-02T00:00:00.000Z');
});
