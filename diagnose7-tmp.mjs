import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 600)); });
page.on('console', function(msg) {
    if (msg.type() === 'error') console.log('[CONSOLE_ERR]', msg.text().slice(0, 600));
});
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
// Check if the key wiring functions exist
var check = await page.evaluate(() => ({
    historyIsActive: typeof window.historyIsActive,
    selectHistoryTab: typeof window.selectHistoryTab,
    applySection: typeof window.applySection,
    setSectionDisplay: typeof window.setSectionDisplay,
    renderHistoryBar: typeof window.renderHistoryBar,
    drawEraScene: typeof window.drawEraScene,
}));
console.log('Functions:', JSON.stringify(check, null, 2));
await browser.close();
