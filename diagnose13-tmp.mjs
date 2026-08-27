import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 400)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
// Language
await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]');
await page.waitForTimeout(1000);
// Section picker
var pick = await page.$('#sectionPickerOverlay:not([style*="none"])');
if (pick && await pick.isVisible().catch(() => false)) {
    await page.click('#sectionPickerOverlay .section-card.section-card-history');
    await page.waitForTimeout(1000);
}
// Projection + onboard
for (let r = 0; r < 4; r++) {
    await page.waitForTimeout(400);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1500);

// Now check pointer-events for all history dock elements
var pe = await page.evaluate(() => {
    function getPE(sel) {
        var el = document.querySelector(sel);
        if (!el) return 'not-found';
        return getComputedStyle(el).pointerEvents;
    }
    return {
        steppedDock: getPE('.stepped-dock-group'),
        modeRow: getPE('#modeRow'),
        historyDock: getPE('#historyModeDock'),
        historyDockRow: getPE('.history-mode-row'),
        historyFilterRow: getPE('#historyFilterRow'),
        searchInput: getPE('#histSearchInput'),
        filterRegion: getPE('#histFilterRegion'),
        filterReligion: getPE('#histFilterReligion'),
        segWarsBtn: getPE('#histModeWarsBtn'),
        segErasBtn: getPE('#histModeErasBtn'),
        warTabs: getPE('#histWarTabs'),
        eraGroup: getPE('#historyEraGroup'),
        filterRow: getPE('#filterRow'),
    };
});
console.log('Pointer-events:');
Object.entries(pe).forEach(([k, v]) => console.log('  ' + k + ': ' + v));

// Also check if history mode is active and what tab we're on
var st = await page.evaluate(() => ({
    histActive: window.historyIsActive(),
    tab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
    scenarioCount: document.querySelectorAll('#historyEraGroup .history-scenario-btn').length,
    warTabsCount: document.querySelectorAll('#histWarTabs .history-war-tab').length,
}));
console.log('\nState:', JSON.stringify(st));

// Now try actual pointer-based clicking on the Eras button
console.log('\n=== POINTER CLICK TEST ===');
var erasBtn = await page.$('#histModeErasBtn');
if (erasBtn) {
    await erasBtn.click({ timeout: 5000 }).catch(e => console.log('eras click error:', e.message.slice(0, 100)));
    await page.waitForTimeout(1000);
    var afterTab = await page.evaluate(() => ({
        tab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
        scenarioCount: document.querySelectorAll('.history-scenario-btn').length,
    }));
    console.log('After eras click:', JSON.stringify(afterTab));
}

// Try typing in search with Playwright fill
console.log('\n=== PLAYWRIGHT FILL TEST ===');
await page.fill('#histSearchInput', 'rome');
await page.waitForTimeout(800);
var searchResult = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
}));
console.log('After fill "rome":', searchResult.count);

// Clear
await page.fill('#histSearchInput', '');
await page.waitForTimeout(300);

// Try region filter with Playwright
await page.selectOption('#histFilterRegion', 'asia');
await page.waitForTimeout(500);
var regionResult = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
}));
console.log('After region=asia:', regionResult.count);

await browser.close();
