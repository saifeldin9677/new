import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', function(e) { errors.push('[PAGE_ERROR] ' + String(e).slice(0, 500)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
// Dismiss overlays picking GEOGRAPHY (not history)
for (let r = 0; r < 6; r++) {
    await page.waitForTimeout(400);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#sectionPickerOverlay')) && await el.isVisible().catch(() => false)) {
        await page.click('#sectionPickerOverlay .section-card-geo'); // pick GEOGRAPHY
        await page.waitForTimeout(700);
        continue;
    }
    if ((el = await page.$('#langOverlay')) && await el.isVisible().catch(() => false)) { await el.click('#langOverlay .lang-overlay-btn[data-lang="en"]'); await page.waitForTimeout(900); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1000);
var geoState = await page.evaluate(() => ({
    histActive: window.historyIsActive(),
    bodyClasses: document.body.className,
}));
console.log('After picking geography:', JSON.stringify(geoState));

// Now click the header history toggle
console.log('\n=== ENTERING HISTORY VIA HEADER TOGGLE ===');
errors.length = 0;
var toggleEl = await page.$('#historySectionBtn, .section-toggle-btn[data-section="history"], #sectionHistoryBtn');
if (toggleEl) {
    await toggleEl.click();
    console.log('Clicked history toggle');
} else {
    // Try applySection
    console.log('Toggle not found, trying applySection...');
    await page.evaluate(() => window.applySection('history'));
}
await page.waitForTimeout(2000);
console.log('Errors after entering history:', errors);

var histState = await page.evaluate(() => ({
    histActive: window.historyIsActive(),
    bodyClasses: document.body.className,
    histTab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
    dockDisplay: document.getElementById('historyModeDock') ? getComputedStyle(document.getElementById('historyModeDock')).display : 'null',
    filterRowVisible: document.getElementById('historyFilterRow') ? getComputedStyle(document.getElementById('historyFilterRow')).display : 'null',
    searchVisible: document.getElementById('histSearchInput') ? getComputedStyle(document.getElementById('histSearchInput')).display : 'null',
    eraGroupDisplay: document.getElementById('historyEraGroup') ? getComputedStyle(document.getElementById('historyEraGroup')).display : 'null',
    warTabsDisplay: document.getElementById('histWarTabs') ? getComputedStyle(document.getElementById('histWarTabs')).display : 'null',
    scenarioBtns: document.querySelectorAll('.history-scenario-btn').length,
}));
console.log('History state:', JSON.stringify(histState, null, 2));

// Test search
console.log('\n=== SEARCH TEST (from header toggle entry) ===');
var beforeCount = await page.evaluate(() => document.querySelectorAll('#historyEraGroup .history-scenario-btn').length);
console.log('Era buttons before search:', beforeCount);

await page.fill('#histSearchInput', 'rome');
await page.waitForTimeout(800);
var afterSearch = await page.evaluate(() => ({
    eraCount: document.querySelectorAll('#historyEraGroup .history-scenario-btn').length,
    texts: [...document.querySelectorAll('#historyEraGroup .history-scenario-btn')].map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('After search "rome":', JSON.stringify(afterSearch));

// Test region filter
await page.fill('#histSearchInput', '');
await page.waitForTimeout(500);
await page.selectOption('#histFilterRegion', 'asia');
await page.waitForTimeout(500);
var regionResult = await page.evaluate(() => ({
    eraCount: document.querySelectorAll('#historyEraGroup .history-scenario-btn').length,
    texts: [...document.querySelectorAll('#historyEraGroup .history-scenario-btn')].map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('After region=asia:', JSON.stringify(regionResult));

// Test country click in History mode
console.log('\n=== COUNTRY CLICK IN HISTORY MODE ===');
await page.selectOption('#histFilterRegion', 'all');
await page.waitForTimeout(300);
var clickResult = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    var paths = svg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name === 'France') {
            paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return 'clicked France';
        }
    }
    return 'France not found';
});
console.log('Click result:', clickResult);
await page.waitForTimeout(500);
var panel = await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    return cp ? { visible: cp.classList.contains('visible'), html: (cp.innerHTML || '').slice(0, 200) } : 'no panel';
});
console.log('Panel:', JSON.stringify(panel));

// Now try a different country 
console.log('\n=== CLICK DIFFERENT COUNTRY ===');
await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    if (cp) cp.classList.remove('visible');
});
await page.waitForTimeout(200);
var clickResult2 = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    var paths = svg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name === 'Japan') {
            paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return 'clicked Japan';
        }
    }
    return 'Japan not found';
});
console.log('Click result:', clickResult2);
await page.waitForTimeout(500);
var panel2 = await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    return cp ? { visible: cp.classList.contains('visible'), headerText: (cp.querySelector('.country-name, h3, h2') || {}).textContent || 'no header', html: (cp.innerHTML || '').slice(0, 200) } : 'no panel';
});
console.log('Panel after Japan click:', JSON.stringify(panel2));

console.log('\n=== ALL ERRORS ===');
errors.forEach(e => console.log(e));

await browser.close();
