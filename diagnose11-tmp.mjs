import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', function(e) { errors.push('PAGE_ERROR: ' + String(e).slice(0, 400)); });
page.on('console', function(msg) {
    if (msg.type() === 'error') errors.push('CONSOLE_ERR: ' + msg.text().slice(0, 400));
});
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Step 1: Select English language (fresh session)
console.log('Step 1: Selecting language...');
var langBtn = await page.$('#langOverlay .lang-overlay-btn[data-lang="en"]');
if (langBtn && await langBtn.isVisible()) {
    await langBtn.click();
    await page.waitForTimeout(1000);
}
// Step 2: Section picker
console.log('Step 2: Section picker...');
var pick = await page.$('#sectionPickerOverlay');
if (pick && await pick.isVisible().catch(() => false)) {
    await page.click('#sectionPickerOverlay [data-section="geo"]');
    await page.waitForTimeout(1000);
}
// Step 3: Projection overlay
console.log('Step 3: Projection...');
var proj = await page.$('#projectionContinue');
if (proj && await proj.isVisible().catch(() => false)) {
    await proj.click();
    await page.waitForTimeout(500);
}
// Step 4: Onboarding
console.log('Step 4: Onboarding...');
var skip = await page.$('#onboardSkip');
if (skip && await skip.isVisible().catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(500);
}
await page.waitForTimeout(1000);

console.log('Errors so far:', errors);

// Check state in Geography mode
var geoState = await page.evaluate(() => ({
    histActive: window.historyIsActive ? window.historyIsActive() : 'no-func',
    applySection: typeof window.applySection,
    svgChildren: document.getElementById('mapSvg') ? document.getElementById('mapSvg').children.length : -1,
}));
console.log('Geography state:', JSON.stringify(geoState));

// Now try country click in GEOGRAPHY mode
console.log('\n=== COUNTRY CLICK IN GEOGRAPHY ===');
var clickResult = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    var paths = svg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name === 'France') {
            paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 400, clientY: 300 }));
            return 'clicked France';
        }
    }
    return 'France not found, paths=' + paths.length;
});
console.log('Click result:', clickResult);
await page.waitForTimeout(1000);
var panel = await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    return cp ? { visible: cp.classList.contains('visible'), display: cp.style.display, hasContent: cp.innerHTML.length > 10 } : 'no panel element';
});
console.log('Panel:', JSON.stringify(panel));

// Now switch to History mode via header toggle
console.log('\n=== SWITCHING TO HISTORY ===');
var histBtn = await page.$('#sectionHistoryBtn');
if (histBtn) {
    await histBtn.click();
    console.log('Clicked #sectionHistoryBtn');
} else {
    console.log('#sectionHistoryBtn not found, trying other selectors...');
    await page.evaluate(() => window.applySection && window.applySection('history'));
    console.log('Called applySection("history")');
}
await page.waitForTimeout(2000);

var histState = await page.evaluate(() => ({
    histActive: window.historyIsActive ? window.historyIsActive() : 'no-func',
    bodyClasses: document.body.className,
    dockDisplay: document.getElementById('historyModeDock') ? getComputedStyle(document.getElementById('historyModeDock')).display : 'null',
    erasOrWars: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
    scenarioCount: document.querySelectorAll('.history-scenario-btn').length,
    filterRowDisplay: document.getElementById('historyFilterRow') ? getComputedStyle(document.getElementById('historyFilterRow')).display : 'null',
    filterRegionOptions: document.getElementById('histFilterRegion') ? document.getElementById('histFilterRegion').options.length : 0,
}));
console.log('History state:', JSON.stringify(histState, null, 2));
console.log('Errors:', errors);

// Test search in History mode
console.log('\n=== SEARCH IN HISTORY ===');
var beforeSearch = await page.evaluate(() => document.querySelectorAll('.history-scenario-btn').length);
await page.fill('#histSearchInput', 'ottoman');
await page.waitForTimeout(800);
var afterSearch = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
}));
console.log('Search: ' + beforeSearch + ' -> ' + afterSearch.count);

// Test region filter
await page.fill('#histSearchInput', '');
await page.waitForTimeout(300);
await page.selectOption('#histFilterRegion', 'europe');
await page.waitForTimeout(500);
var regionResult = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
}));
console.log('Region=europe: ' + regionResult.count);

// Test country click in History mode
console.log('\n=== COUNTRY CLICK IN HISTORY ===');
await page.selectOption('#histFilterRegion', 'all');
await page.waitForTimeout(300);
var clickHist = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    var paths = svg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name === 'France') {
            paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 400, clientY: 300 }));
            return 'clicked France';
        }
    }
    return 'France not found';
});
console.log('Click:', clickHist);
await page.waitForTimeout(1000);
var panelHist = await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    return cp ? { visible: cp.classList.contains('visible'), html: (cp.innerHTML || '').slice(0, 200) } : 'no panel';
});
console.log('Panel:', JSON.stringify(panelHist));

console.log('\n=== ALL ERRORS ===');
errors.forEach(e => console.log(e));

await browser.close();
