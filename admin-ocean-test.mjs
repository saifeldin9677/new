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

const analysis = await page.evaluate(async () => {
  const t0 = performance.now();
  const cvs = document.getElementById('adminBoundariesCanvas');
  const offCtx = cvs.getContext('2d');

  // 1) PNG of the map WITHOUT the admin canvas (hide it)
  const cvsStyle = cvs.style.display;
  cvs.style.display = 'none';
  const mapSvg = document.getElementById('mapSvg');
  const svgData = new XMLSerializer().serializeToString(mapSvg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const rect = cvs.getBoundingClientRect();
  const probeCanvas = document.createElement('canvas');
  probeCanvas.width = 1366; probeCanvas.height = 692;
  const pctx = probeCanvas.getContext('2d');
  pctx.fillStyle = '#0b3d6b';
  pctx.fillRect(0, 0, 1366, 692);
  pctx.drawImage(img, 0, 0, 1366, 692);
  const imgData = pctx.getImageData(0, 0, 1366, 692).data;
  // classify: transition to land via data.statelines is complex; instead reload state
  cvs.style.display = cvs2;

  // For each land polygon path in the live DOM, mark land pixels on an offscreen map
  const landMap = new Uint8Array(1366 * 692);
  const svg2 = document.getElementById('mapSvg');
  const boxes = [];
  const allPaths = svg2.querySelectorAll('path');
  const t1 = performance.now();
  for (const p of allPaths) {
    const b = p.getBBox();
    if (b.width < 1 || b.height < 1) continue;
    const x0 = Math.max(0, Math.floor(b.x)), y0 = Math.max(0, Math.floor(b.y));
    const x1 = Math.min(1366, Math.ceil(b.x + b.width)), y1 = Math.min(1366, Math.ceil(b.y + b.height));
    const bb = { x0, y0, x1, y1 };
    // test a few sample points (already-projected path coords)
    const n = 9;
    let any = false;
    for (let gy = y0 + 4; gy < y1; gy += Math.max(1, (y1 - y0) / 3)) {
      for (let gx = x0 + 4; gx < x1; gx += Math.max(1, (x1 - x0) / 3)) {
        const el = document.elementFromPoint(gx, gy);
        if (el && (el === p || p.contains(el) || el.contains(p))) { any = true; break; }
      }
    }
    if (!any) continue;
    bb.lit = true;
    cats.push(bb);
  }
  const t2 = performance.now();
  return {
    paths: allPaths.length,
    svgExported: imgData.length,
    dialogBoxMs: Math.round(t1 - t0),
    boxesPts: cats.length,
    scanMs: Math.round(t2 - t1)
  };
});
console.log(JSON.stringify(analysis, null, 2));
console.log('errors:', errors.length ? errors.slice(0, 5) : 'none');
await browser.close();