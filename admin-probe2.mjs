import { chromium } from 'playwright';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8321/';
const browser = await chromium.launch();
const wait = ms => new Promise(r => setTimeout(r, ms));
const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('mapLang', 'en');
    localStorage.setItem('onboardDone', '1');
    localStorage.setItem('projectionExplainerDone', '1');
  } catch (e) {}
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 90000 });
await wait(2000);
await page.evaluate(() => {
  const tryClose = (id) => { const el = document.getElementById(id); if (el && getComputedStyle(el).display !== 'none') el.click(); };
  tryClose('projectionContinue');
  tryClose('onboardSkip');
});
await wait(300);

await page.evaluate(() => document.getElementById('adminBoundariesToggle').click());
await wait(1500);

// Instrument: capture which features produce a huge projected bbox, via __adminBoundaryCanvas projection reuse.
// The app exposes nothing global; replicate in-page using the page's own d3 + projection object.
const probe = await page.evaluate(async () => {
  const out = {};
  const cvs = document.getElementById('adminBoundariesCanvas');
  try {
    const data = await fetch('admin-boundaries-data.json').then(r => r.json());
    out.features = data.length;
    out.types = {};
    data.forEach(f => { out.types[f.type] = (out.types[f.type] || 0) + 1; });
    // find app's exposed projection
    const globals = Object.keys(window).filter(k => /proj/i.test(k)).slice(0, 20);
    out.projCandidates = globals;
  } catch (e) { out.error = String(e); }
  return out;
});
console.log('probe:', JSON.stringify(probe));
console.log('errors:', errors.length ? errors.slice(0, 5) : 'none');
await browser.close();