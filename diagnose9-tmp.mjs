import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
// Capture EVERYTHING including unhandled rejections
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 600)); });
page.on('console', function(msg) {
    var t = msg.type();
    if (t === 'error' || t === 'warning') {
        console.log('[' + t.toUpperCase() + ']', msg.text().slice(0, 600));
    }
});
// Listen for unhandled rejection at CDP level
var client = await page.context().newCDPSession(page);
await client.send('Runtime.enable');
client.on('Runtime.exceptionThrown', function(p) {
    console.log('[CDP_EXCEPTION]', JSON.stringify(p.exceptionDetails).slice(0, 600));
});

await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
console.log('\n=== Function check ===');
var check = await page.evaluate(() => ({
    applySection: typeof window.applySection,
    historyIsActive: typeof window.historyIsActive,
    svgChildren: document.getElementById('mapSvg') ? document.getElementById('mapSvg').children.length : 0,
}));
console.log(JSON.stringify(check));
await browser.close();
