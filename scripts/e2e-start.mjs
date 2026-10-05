// scripts/e2e-start.mjs — headless checks for the /start variants.
// Usage: npm run build && (npx astro preview --port 4329 &) && npm run e2e:start
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.E2E_BASE || 'http://localhost:4329';
const OUT = 'screenshots-videos/start-variants';
fs.mkdirSync(OUT, { recursive: true });
const VARIANTS = { core: '/start/', free: '/start/free/', scheduling: '/start/scheduling/' };
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

const browser = await chromium.launch();

async function newPage(device, consent) {
  const ctx = await browser.newContext(device === 'iphone13'
    ? { ...devices['iPhone 13'], viewport: { width: 390, height: 664 } }
    : { viewport: { width: 1440, height: 900 } });
  if (consent) {
    await ctx.addInitScript((c) => localStorage.setItem('dsp-cookie-consent', JSON.stringify({ consent: c, timestamp: '2026-10-02T00:00:00Z' })), consent);
  }
  const page = await ctx.newPage();
  const signupHits = [];
  const gtmHits = [];
  await page.route('https://app.driveschoolpro.com/**', (r) => { signupHits.push(r.request().url()); return r.fulfill({ status: 200, body: 'stub' }); });
  await page.route('https://maps.googleapis.com/**', (r) => r.abort());
  await page.route('https://www.googletagmanager.com/**', (r) => { gtmHits.push(r.request().url()); return r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); });
  return { ctx, page, signupHits, gtmHits };
}

for (const [id, path] of Object.entries(VARIANTS)) {
  for (const device of ['iphone13', 'desktop']) {
    const { ctx, page, signupHits } = await newPage(device, 'necessary');
    const url = `${BASE}${path}?gclid=TEST123&utm_source=google&utm_content=${id}`;
    await page.goto(url);
    check(await page.locator(`[data-start-variant="${id}"]`).count() === 1, `${id}/${device}: variant marker`);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    check(robots === 'noindex, follow', `${id}/${device}: robots=${robots}`);

    if (device === 'iphone13') {
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      check(sw <= 390, `${id}: horizontal scroll (scrollWidth ${sw})`);
      const btn = page.locator('#start-capture-top-org').locator('xpath=ancestor::form').locator('button[type="submit"]');
      const ib = await page.locator('#start-capture-top-org').boundingBox();
      const bb = await btn.boundingBox();
      check(ib && ib.y + ib.height <= 664, `${id}: field below the fold (${ib && ib.y + ib.height})`);
      check(bb && bb.y + bb.height <= 664, `${id}: button below the fold (${bb && bb.y + bb.height})`);
      check(bb && bb.height >= 44, `${id}: button tap target ${bb && bb.height}px`);
      check(await page.locator('summary').count() === 6, `${id}: expected 6 FAQ summaries`);
      const small = await page.$$eval('summary', (els) => els.filter((e) => e.getBoundingClientRect().height < 44).length);
      check(small === 0, `${id}: ${small} FAQ summaries under 44px`);
    }

    await page.screenshot({ path: `${OUT}/${id}-${device}.png`, fullPage: true });

    for (const which of ['top', 'bottom']) {
      await page.fill(`#start-capture-${which}-org`, `E2E School ${which}`);
      await Promise.all([
        page.waitForURL(/app\.driveschoolpro\.com\/signup/),
        page.locator(`#start-capture-${which}-org`).press('Enter'),
      ]);
      const u = new URL(signupHits.at(-1));
      check(u.searchParams.get('org') === `E2E School ${which}`, `${id}/${device}/${which}: org=${u.searchParams.get('org')}`);
      check(u.searchParams.get('gclid') === 'TEST123', `${id}/${device}/${which}: gclid lost`);
      check(u.searchParams.get('utm_content') === id, `${id}/${device}/${which}: utm_content lost`);
      await page.goto(url);
    }
    await ctx.close();
  }
}

// First-time ad visitor: no stored consent, so the cookie banner is showing.
// The top capture button must sit fully above the banner on common small phones.
for (const [id, path] of Object.entries(VARIANTS)) {
  for (const vp of [{ width: 390, height: 664 }, { width: 375, height: 553 }]) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: vp });
    const page = await ctx.newPage();
    await page.route('https://maps.googleapis.com/**', (r) => r.abort());
    await page.goto(`${BASE}${path}`);
    const banner = page.locator('#cookie-consent');
    await banner.waitFor({ state: 'visible' });
    // It slides in from translate-y-full after a timeout; measure only once it has settled on screen.
    await page.waitForFunction(() => { const r = document.getElementById('cookie-consent').getBoundingClientRect(); return r.bottom <= window.innerHeight + 1; });
    await page.waitForTimeout(350);
    const top = (await banner.boundingBox()).y;
    const bb = await page.locator('#start-capture-top-org').locator('xpath=ancestor::form').locator('button[type="submit"]').boundingBox();
    check(bb.y + bb.height <= top, `${id} @${vp.width}x${vp.height}: button bottom ${Math.round(bb.y + bb.height)} under banner top ${Math.round(top)}`);
    await ctx.close();
  }
}

// Consent Mode: accepted visitor → default then update before js; necessary → no GTM request.
{
  const { ctx, page, gtmHits } = await newPage('desktop', 'all');
  await page.goto(`${BASE}/start/`);
  const order = await page.evaluate(() => (window.dataLayer || []).map((e) => Array.from(e).slice(0, 2).join(':')));
  const iDefault = order.indexOf('consent:default');
  const iUpdate = order.indexOf('consent:update');
  const iJs = order.findIndex((s) => s.startsWith('js:'));
  check(iDefault === 0 && iUpdate > iDefault && iJs > iUpdate, `consent order wrong: ${order.join(' | ')}`);
  check(gtmHits.length > 0, 'accepted visitor did not request gtag.js');
  await ctx.close();
}
{
  const { ctx, page, gtmHits } = await newPage('desktop', 'necessary');
  await page.goto(`${BASE}/start/free/`);
  await page.waitForTimeout(500);
  check(gtmHits.length === 0, `necessary-only visitor requested GTM: ${gtmHits.join(', ')}`);
  await ctx.close();
}

await browser.close();
if (failures.length) { console.error('e2e-start FAILED:\n  ' + failures.join('\n  ')); process.exit(1); }
console.log('e2e-start: all checks passed; screenshots in ' + OUT);
