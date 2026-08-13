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
page.on('pageerror', e => errors.push(String(e).slice(0, 300)));

await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 90000 });
await wait(2200);
await page.evaluate(() => {
  const tryClose = (id) => { const el = document.getElementById(id); if (el && getComputedStyle(el).display !== 'none') el.click(); };
  tryClose('projectionContinue');
  tryClose('onboardSkip');
});
await wait(300);
await page.evaluate(() => document.getElementById('adminBoundariesToggle').click());
await wait(1500);

// Instrument: run the SAME projection logic the bake uses, in-page, using the app's `projection`
// object (it's bound inside closure, but we can reach it via the DOM: gMap paths have projection-space d).
const diag = await page.evaluate(async () => {
  const d3real = window.d3; // global polyfill from `script` tag? Check
  const out = { hasD3: !!d3real, hasGeoPath: !!(d3real && d3real.geoPath), apiUsed: null };
  return out;
});
console.log('diag:', JSON.stringify(diag));

// Instead, rebuild pathGen-ish projection identical to app and scan geometry against it,
// then compare to the BAKED canvas pixels to confirm which features actually draw off-coast.
const geomScan = await page.evaluate(async () => {
  const data = await fetch('admin-boundaries-data.json').then(r => r.json());
  // Recreate the app projection (flat mode): scale min(w,h)*0.38, translate to w/2,h/2
  const rect = document.getElementById('mapSvg').getBoundingClientRect();
  const W = rect.width, H = rect.height;
  const proj = d3.geoPolyhedralWaterman().scale(Math.min(W, H) * 0.38).translate([W / 2, H / 2]).rotate([0, 0]).precision(5);
  const collector = {
    minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity,
    moveTo(x, y) { if (x < this.minX) this.minX = x; if (x > this.maxX) this.maxX = x; if (y < this.minY) this.minY = y; if (y > this.maxY) this.maxY = y; },
    lineTo(x, y) { if (x < this.minX) this.minX = x; if (x > this.maxX) this.maxX = x; if (y < this.minY) this.minY = y; if (y > this.maxY) this.maxY = y; },
    closePath() {}, reset() { this.minX = Infinity; this.minY = Infinity; this.maxX = -Infinity; this.maxY = -Infinity; }
  };
  const gen = d3.geoPath(proj, collector);
  const big = [];
  for (const f of data) {
    collector.reset();
    gen({ type: 'Feature', geometry: { type: f.type, coordinates: f.coordinates } });
    const bw = collector.maxX - collector.minX, bh = collector.maxY - collector.minY;
    if (isFinite(bw) && (bw > W * 0.3 || bh > H * 0.3)) {
      big.push({ name: f.name, admin: (f.admin || '').slice(0, 20), w: Math.round(bw), h: Math.round(bh) });
    }
  }
  // compute geoCentroid/area to give sensible size
  return { W: Math.round(W), H: Math.round(H), big };
});
console.log(JSON.stringify(geomScan).slice(0, 600));
console.log('errors:', errors.length ? errors.slice(0, 8) : 'none');
await browser.close();