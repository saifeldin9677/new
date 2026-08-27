import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 500)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// Dismiss overlays
for (let r = 0; r < 6; r++) {
    await page.waitForTimeout(400);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#sectionPickerOverlay')) && await el.isVisible().catch(() => false)) { await page.click('#sectionPickerOverlay .section-card-history'); await page.waitForTimeout(700); continue; }
    if ((el = await page.$('#langOverlay')) && await el.isVisible().catch(() => false)) { await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]'); await page.waitForTimeout(900); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1000);

// Check critical state
var checks = await page.evaluate(() => ({
    selectHistoryTab: typeof window.selectHistoryTab,
    historyIsActive: typeof window.historyIsActive,
    renderHistoryBar: typeof window.renderHistoryBar,
    drawEraScene: typeof window.drawEraScene,
    drawHistoryScenario: typeof window.drawHistoryScenario,
    historyRegionFilter: typeof window.historyRegionFilter,
    refreshHistFilter: typeof window.refreshHistoryAfterFilterChange,
    // Check if wiring code ran: are options populated?
    histFilterRegionOptions: document.getElementById('histFilterRegion') ? document.getElementById('histFilterRegion').options.length : -1,
    histFilterReligionOptions: document.getElementById('histFilterReligion') ? document.getElementById('histFilterReligion').options.length : -1,
    histSearchInput: !!document.getElementById('histSearchInput'),
    // Check era chip container
    eraGroupEl: !!document.getElementById('historyEraGroup'),
    warTabsEl: !!document.getElementById('histWarTabs'),
}));
console.log(JSON.stringify(checks, null, 2));

await browser.close();
