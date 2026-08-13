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
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push('console:' + m.text().slice(0, 200)); });

await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 90000 });
await wait(2000);

// close any overlays
await page.evaluate(() => {
  const tryClose = (id) => { const el = document.getElementById(id); if (el && getComputedStyle(el).display !== 'none') el.click(); };
  tryClose('projectionContinue');
  tryClose('onboardSkip');
});

// enable admin boundaries
await page.evaluate(() => document.getElementById('adminBoundariesToggle').click());
await wait(1800);

const state = await page.evaluate(() => {
  const c = document.getElementById('adminBoundariesCanvas');
  return {
    btnOn: document.getElementById('adminBoundariesToggle').classList.contains('toggle-on'),
    canvas: c ? { w: c.width, h: c.height, cw: c.clientWidth, ch: c.clientHeight, dpr: window.devicePixelRatio } : null,
    layerCount: 0,
    globeMode: (function(){ try { return typeof window.globeModeActive !== 'undefined' ? window.globeModeActive : null; } catch(e){ return null; } })()
  };
});
console.log('state:', JSON.stringify(state));

// screenshot 1: default zoom (whole world)
await page.screenshot({ path: '/tmp/opencode/admin-world.png' });

// zoom into a couple of regions
await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(500);
await page.screenshot({ path: '/tmp/opencode/admin-zoom1.png' });
await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(500);
await page.screenshot({ path: '/tmp/opencode/admin-zoom2.png' });
await page.evaluate(() => document.getElementById('zoomResetBtn').click());
await wait(500);

console.log('pageerrors:', errors.length ? errors.slice(0,5) : 'none');
await browser.close();