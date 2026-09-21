/**
 * Demo verification — asserts every <video> the site emits is a well-formed,
 * accessible, performance-safe product demo, and that the homepage carries the
 * section anchors the hero CTA depends on.
 *
 * Sits alongside verify-seo.js (structure) and verify-claims.js (truth).
 * This one covers the benefit-architecture invariants from
 * docs/superpowers/specs/2026-09-10-driveschoolpro-benefit-architecture-design.md
 *
 * Note this cannot see INSIDE an MP4. A flag-hidden feature appearing in a clip
 * is a false claim no script here will catch — check each clip against
 * src/config/features.ts by eye before publishing it.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.join(process.cwd(), 'dist');
const errors = [];

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Required attributes on every emitted <video>, with why each one matters. */
const VIDEO_RULES = [
  [/\bmuted\b/, 'muted — browsers block autoplay of unmuted video'],
  [/\bloop\b/, 'loop — demo clips must cycle'],
  [/\bplaysinline\b/, 'playsinline — iOS Safari goes fullscreen without it'],
  [/preload="none"/, 'preload="none" — four of five clips are below the fold'],
  [/poster="[^"]+"/, 'poster — the fallback still, shown before load'],
  [/\bwidth="\d+"/, 'width — prevents layout shift'],
  [/\bheight="\d+"/, 'height — prevents layout shift'],
  [/aria-label="[^"]+"/, 'aria-label — <video> has no alt attribute'],
  [/data-src="[^"]+"/, 'data-src — the real source, swapped in by the observer'],
];

/** Anchors the homepage hero CTA and section navigation depend on. */
const HOME_ANCHORS = [
  'the-week',
  'know-what-to-teach',
  'log-the-lesson',
  'paid-before-they-turn-up',
  'get-found',
];

const files = walk(distDir);

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(distDir, file);

  for (const tag of html.match(/<video\b[^>]*>/g) || []) {
    for (const [re, why] of VIDEO_RULES) {
      if (!re.test(tag)) errors.push(`${rel}: <video> missing ${why}`);
    }
    // A literal src= would defeat preload="none" and download on parse.
    if (/\ssrc="/.test(tag)) {
      errors.push(`${rel}: <video> has a literal src= — use data-src so preload="none" holds`);
    }
    // The poster must actually exist, or the fallback is a broken image.
    const poster = tag.match(/poster="([^"]+)"/);
    if (poster && poster[1].startsWith('/')) {
      const p = path.join(distDir, poster[1]);
      if (!fs.existsSync(p)) errors.push(`${rel}: poster not found in dist: ${poster[1]}`);
    }
  }
}

const home = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
for (const id of HOME_ANCHORS) {
  if (!home.includes(`id="${id}"`)) errors.push(`index.html: missing section anchor id="${id}"`);
}
if (!/href="#the-week"/.test(home)) {
  errors.push('index.html: hero secondary CTA must target #the-week (a moving demo), not a still');
}

if (errors.length) {
  console.error(`\nverify-demos: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`verify-demos: OK (${files.length} pages checked)`);
