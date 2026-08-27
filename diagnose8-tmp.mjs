import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 600)); });
page.on('console', function(msg) {
    if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log('[' + msg.type().toUpperCase() + ']', msg.text().slice(0, 600));
    }
});
page.on('requestfailed', function(req) { console.log('[REQ_FAIL]', req.url(), req.failure().errorText); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
// Check what the IIFE can see
var check = await page.evaluate(() => {
    // Walk up from the IIFE's scope
    return {
        d3: typeof d3,
        topojson: typeof topojson,
        svgEl: !!document.getElementById('mapSvg'),
        mapSvgChildren: document.getElementById('mapSvg') ? document.getElementById('mapSvg').children.length : 0,
        gCountries: !!document.querySelector('#mapSvg > g'),
        applySection: typeof window.applySection,
        historyIsActive: typeof window.historyIsActive,
    };
});
console.log('Check:', JSON.stringify(check));
await browser.close();
