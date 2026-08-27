import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 400)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
// Click language
await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]');
await page.waitForTimeout(1000);
// Pick geography
var pick = await page.$('#sectionPickerOverlay');
if (pick && await pick.isVisible().catch(() => false)) {
    await page.click('[data-section="geo"]');
    await page.waitForTimeout(1000);
}
// Dismiss projection + onboard
for (let r = 0; r < 3; r++) {
    await page.waitForTimeout(300);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1000);

// Switch to History via header toggle
await page.click('#sectionHistoryBtn');
await page.waitForTimeout(2000);

// Check pointer-events in the live DOM
var pe = await page.evaluate(() => {
    function getPE(el) {
        if (!el) return 'null-element';
        return getComputedStyle(el).pointerEvents;
    }
    return {
        controlsBar: getPE(document.getElementById('controlsBar')),
        toprow: getPE(document.querySelector('.controls-bar-toprow')),
        dockWrap: getPE(document.querySelector('.dock-unified-wrap')),
        steppedDock: getPE(document.querySelector('.stepped-dock-group')),
        modeRow: getPE(document.getElementById('modeRow')),
        historyDock: getPE(document.getElementById('historyModeDock')),
        historyDockRow: getPE(document.querySelector('.history-mode-row')),
        filterRow: getPE(document.getElementById('historyFilterRow')),
        searchInput: getPE(document.getElementById('histSearchInput')),
        filterRegion: getPE(document.getElementById('histFilterRegion')),
        segWarsBtn: getPE(document.getElementById('histModeWarsBtn')),
        segErasBtn: getPE(document.getElementById('histModeErasBtn')),
    };
});
console.log('Pointer-events:');
Object.entries(pe).forEach(([k, v]) => console.log('  ' + k + ': ' + v));

// Try a click on the Eras button
var erasClickWorks = await page.evaluate(() => {
    var btn = document.getElementById('histModeErasBtn');
    var before = document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none';
    btn.click();
    var after = document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none';
    return { before, after };
});
console.log('\nEras click:', JSON.stringify(erasClickWorks));

// Try search with value change
var searchWorks = await page.evaluate(() => {
    var input = document.getElementById('histSearchInput');
    var before = document.querySelectorAll('.history-scenario-btn').length;
    input.value = 'rome';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return { before, inputExists: !!input, pe: getComputedStyle(input).pointerEvents };
});
console.log('Search:', JSON.stringify(searchWorks));
await page.waitForTimeout(500);
var afterSearch = await page.evaluate(() => document.querySelectorAll('.history-scenario-btn').length);
console.log('After search dispatch: ' + searchWorks.before + ' -> ' + afterSearch);

await browser.close();
