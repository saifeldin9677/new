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

const CONTENT = `
  function scanBig() {
    const cvs = document.getElementById('adminBoundariesCanvas');
    const w = cvs.width, h = cvs.height;
    const dd = cvs.getContext('2d').getImageData(0, 0, w, h).data;
    const gridW = w, gridH = h;
    const visited = new Uint8Array(gridW * gridH);
    const big = [];
    const stack = [];
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const idx = y * gridW + x;
        if (visited[idx] || dd[idx * 4 + 3] <= 40) continue;
        let cnt = 0, minX = x, minY = y, maxX = x, maxY = y;
        stack.length = 0; stack.push(idx); visited[idx] = 1;
        while (stack.length) {
          const ci = stack.pop();
          const cx = ci % gridW, cy = (ci / gridW) | 0;
          cnt++;
          if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
          if (cy > 0 && !visited[ci - gridW] && dd[(ci - gridW) * 4 + 3] > 40) { visited[ci - gridW] = 1; stack.push(ci - gridW); }
          if (cy < gridH - 1 && !visited[ci + gridW] && dd[(ci + gridW) * 4 + 3] > 40) { visited[ci + gridW] = 1; stack.push(ci + gridW); }
          if (cx > 0 && !visited[ci - 1] && dd[(ci - 1) * 4 + 3] > 40) { visited[ci - 1] = 1; stack.push(ci - 1); }
          if (cx < gridW - 1 && !visited[ci + 1] && dd[(ci + 1) * 4 + 3] > 40) { visited[ci + 1] = 1; stack.push(ci + 1); }
        }
        if (cnt >= 3) {
          const span = Math.hypot(maxX - minX, maxY - minY);
          if (span > 200) big.push({ cnt, bbox: [minX, minY, maxX, maxY], span: Math.round(span) });
        }
      }
    }
    return big;
  }
  window.__scanBig = scanBig;
`;
await page.evaluate(scan_b => { (0, eval)(scan_b); }, CONTENT);

const show = (label) => page.evaluate(() => {
  const big = window.__scanBig();
  big.sort((a, b) => b.span - a.span);
  return { count: big.length, top: big.slice(0, 15) };
}).then(r => {
  console.log(label, 'big-components(span>200px):', r.count);
  r.top.forEach(c => console.log('   ', 'bbox', c.bbox.join(','), 'span', c.span, 'cnt', c.cnt));
});

await show('VIEW default:');
await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(600);
await show('VIEW zoom1:');
await page.evaluate(() => document.getElementById('zoomInBtn').click());
await wait(600);
await show('VIEW zoom2:');
await page.evaluate(() => document.getElementById('zoomResetBtn').click());
await wait(600);

console.log('errors:', errors.length ? errors.slice(0, 8) : 'none');
await browser.close();