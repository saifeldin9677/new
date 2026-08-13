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

const probe = `
window.__adminDistancies = async function() {
  const cvs = document.getElementById('adminBoundariesCanvas');
  const w = cvs.width, h = cvs.height;
  const dd = cvs.getContext('2d').getImageData(0, 0, w, h).data;
  // land mask from SVG: rasterize all <path> within mapSvg onto a canvas
  const svg = document.getElementById('mapSvg');
  const svgClone = svg.cloneNode(true);
  svgClone.setAttribute('width', w); svgClone.setAttribute('height', h);
  const s = new XMLSerializer().serializeToString(svgClone);
  const url = URL.createObjectURL(new Blob([s], {type: 'image/svg+xml;charset=utf-8'}));
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const mc = document.createElement('canvas');
  mc.width = w; mc.height = h;
  const mctx = mc.getContext('2d');
  mctx.drawImage(img, 0, 0, w, h);
  const md = mctx.getImageData(0, 0, w, h).data;
  // land = alpha>0 or not-ish
  const land = new Uint8Array(w * h);
  let nLand = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const a = md[i + 3];
      if (a > 10) { land[y * w + x] = 1; nLand++; }
    }
  }
  // collect admin stroke px positions
  const strokes = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (dd[(y * w + x) * 4 + 3] > 40) strokes.push(x, y);
    }
  }
  // compute distance transform via multi-pass BFS over land for speed (chamfer)
  const dist = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) dist[i] = land[i] ? 0 : 1e6;
  for (let pass = 0; pass < 4; pass++) {
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (land[i]) continue;
        const n = Math.min(dist[i - 1], dist[i + 1], dist[i - w], dist[i + w]);
        if (n + 1 < dist[i]) dist[i] = n + 1;
      }
    }
  }
  // for stroke pixels, how far to nearest land?
  let maxD = 0, farCnt = 0, farSamples = [];
  for (let s = 0; s < strokes.length; s += 2) {
    const x = strokes[s], y = strokes[s + 1];
    const i = y * w + x;
    const d = dist[i];
    if (d > 30) {
      farCnt++;
      if (d > maxD) { maxD = d; }
      if (farSamples.length < 8) farSamples.push([x, y, Math.round(d)]);
    }
  }
  return { nStroke: strokes.length / 2, nLand, farOverOcean: farCnt, maxDist: Math.round(maxD), farSamples };
}
`;
await page.evaluate(p => { (0, eval)(p); }, probe);
const show = label => page.evaluate(() => window.__adminDistancies ? window.__adminDistancies() : 'notready').then(r => console.log(label, JSON.stringify(r)));
show('DEFAULT:').then(async () => { }).catch(() => {});
// process sequentially
let r = await page.evaluate(() => window.__adminDistancies());
console.log('DEFAULT:', JSON.stringify(r).slice(0, 600));

await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(600);
r = await page.evaluate(() => window.__adminDistancies());
console.log('ZOOM1:', JSON.stringify(r).slice(0, 600));
await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(600);
r = await page.evaluate(() => window.__adminDistancies());
console.log('ZOOM2:', JSON.stringify(r).slice(0, 600));
await page.evaluate(() => document.getElementById('zoomResetBtn').click());
await wait(600);
console.log('errors:', errors.length ? errors.slice(0, 8) : 'none');
await browser.close();