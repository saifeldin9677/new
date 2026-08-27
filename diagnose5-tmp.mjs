import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 500)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
for (let r = 0; r < 6; r++) {
    await page.waitForTimeout(400);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#sectionPickerOverlay')) && await el.isVisible().catch(() => false)) { await page.click('#sectionPickerOverlay .section-card-history'); await page.waitForTimeout(700); continue; }
    if ((el = await page.$('#langOverlay')) && await el.isVisible().catch(() => false)) { await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]'); await page.waitForTimeout(900); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1500);

// We're in History mode now. Check current state
var st = await page.evaluate(() => ({
    historyTab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
    scenarioBtns: document.querySelectorAll('.history-scenario-btn').length,
    scenarioTexts: [...document.querySelectorAll('.history-scenario-btn')].slice(0, 5).map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('State:', JSON.stringify(st));

// Check if eras data loaded  
var eraSt = await page.evaluate(() => {
    // Switch to eras
    window.selectHistoryTab('eras');
    return 'switched';
});
await page.waitForTimeout(2000);

var st2 = await page.evaluate(() => ({
    historyTab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
    scenarioBtns: document.querySelectorAll('.history-scenario-btn').length,
    scenarioTexts: [...document.querySelectorAll('.history-scenario-btn')].slice(0, 5).map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('State after eras switch:', JSON.stringify(st2));

// NOW TEST SEARCH - capture before/after
var beforeCount = await page.evaluate(() => document.querySelectorAll('.history-scenario-btn').length);
console.log('\n=== SEARCH TEST ===');
console.log('Before search: ' + beforeCount + ' scenario buttons');

await page.fill('#histSearchInput', 'ottoman');
await page.waitForTimeout(1000);
var afterSearch = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
    texts: [...document.querySelectorAll('.history-scenario-btn')].map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('After search "ottoman":', JSON.stringify(afterSearch));

// Clear search
await page.fill('#histSearchInput', '');
await page.waitForTimeout(500);

// TEST REGION FILTER
console.log('\n=== REGION FILTER TEST ===');
var regBefore = await page.evaluate(() => document.querySelectorAll('.history-scenario-btn').length);
console.log('Before region filter: ' + regBefore);
await page.selectOption('#histFilterRegion', 'europe');
await page.waitForTimeout(500);
var regAfter = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
    texts: [...document.querySelectorAll('.history-scenario-btn')].map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('After region=europe:', JSON.stringify(regAfter));

// TEST RELIGION FILTER
await page.selectOption('#histFilterRegion', 'all');
await page.waitForTimeout(500);
console.log('\n=== RELIGION FILTER TEST ===');
await page.selectOption('#histFilterReligion', 'muslim');
await page.waitForTimeout(500);
var relAfter = await page.evaluate(() => ({
    count: document.querySelectorAll('.history-scenario-btn').length,
    texts: [...document.querySelectorAll('.history-scenario-btn')].map(b => b.textContent.trim().slice(0, 50)),
}));
console.log('After religion=muslim:', JSON.stringify(relAfter));

// TEST COUNTRY CLICK
console.log('\n=== COUNTRY CLICK TEST ===');
// Switch back to geo first
await page.evaluate(() => window.applySection('geo'));
await page.waitForTimeout(1500);

var countryInfo = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    if (!svg) return { err: 'no mapSvg' };
    var paths = svg.querySelectorAll('path');
    var withData = [];
    for (var i = 0; i < Math.min(paths.length, 20); i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name) withData.push(d.properties.name);
    }
    return { totalPaths: paths.length, withDataCount: withData.length, firstFew: withData.slice(0, 10) };
});
console.log('Country paths info:', JSON.stringify(countryInfo));

// Try clicking France directly
var clickResult = await page.evaluate(() => {
    var svg = document.getElementById('mapSvg');
    var paths = svg.querySelectorAll('path');
    for (var i = 0; i < paths.length; i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name === 'France') {
            paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return 'clicked France, index=' + i;
        }
    }
    return 'France not found';
});
console.log('Click result:', clickResult);
await page.waitForTimeout(500);

var panel = await page.evaluate(() => {
    var cp = document.getElementById('countryPanel');
    return cp ? { visible: cp.classList.contains('visible'), display: cp.style.display, html: (cp.innerHTML || '').slice(0, 300) } : 'no panel';
});
console.log('Country panel after click:', JSON.stringify(panel));

await browser.close();
