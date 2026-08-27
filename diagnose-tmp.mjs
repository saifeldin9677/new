import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
const errors = [];
page.on('console', function(msg) {
    var type = msg.type();
    var text = msg.text();
    var loc = msg.location();
    var entry = '[' + type + '] ' + text + (loc && loc.url ? ' (' + loc.url.split('/').pop() + ':' + loc.lineNumber + ')' : '');
    logs.push(entry);
    if (type === 'error' || type === 'warning') errors.push(entry);
});
page.on('pageerror', function(e) {
    errors.push('[PAGE_ERROR] ' + String(e));
});

await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
console.log('=== ERRORS AFTER PAGE LOAD ===');
errors.forEach(e => console.log(e));
console.log('=== TOTAL ERRORS: ' + errors.length + ' ===');

// Dismiss overlays
errors.length = 0;
for (let r = 0; r < 6; r++) {
    await page.waitForTimeout(500);
    var el;
    if (el = await page.$('#projectionContinue')) {
        if (await el.isVisible().catch(() => false)) { await el.click(); await page.waitForTimeout(400); continue; }
    }
    if (el = await page.$('#sectionPickerOverlay')) {
        if (await el.isVisible().catch(() => false)) { await page.click('#sectionPickerOverlay .section-card-history'); await page.waitForTimeout(700); continue; }
    }
    if (el = await page.$('#langOverlay')) {
        if (await el.isVisible().catch(() => false)) { await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]'); await page.waitForTimeout(900); continue; }
    }
    if (el = await page.$('#onboardSkip')) {
        if (await el.isVisible().catch(() => false)) { await el.click(); await page.waitForTimeout(400); continue; }
    }
    break;
}
await page.waitForTimeout(1000);
console.log('=== ERRORS AFTER OVERLAY DISMISS ===');
errors.forEach(e => console.log(e));
console.log('=== TOTAL: ' + errors.length + ' ===');

// Check history mode state
var histState = await page.evaluate(() => ({
    histActive: typeof window.historyIsActive === 'function' ? window.historyIsActive() : 'no-function',
    bodyClasses: document.body.className,
    histSectionDisplay: document.getElementById('sectionHistoryLabel') ? document.getElementById('sectionHistoryLabel').style.display : 'null',
    dockDisplay: document.getElementById('historyModeDock') ? document.getElementById('historyModeDock').style.display : 'null',
}));
console.log('=== HISTORY STATE ===', JSON.stringify(histState));

// Now enter History mode explicitly
errors.length = 0;
await page.evaluate(() => {
    var btn = document.getElementById('historySectionBtn') || document.getElementById('sectionHistoryBtn');
    if (btn) btn.click();
    else {
        // Try the header toggle
        var hdr = document.querySelector('.section-toggle-btn, [data-section="history"]');
        if (hdr) hdr.click();
    }
});
await page.waitForTimeout(2000);
console.log('=== ERRORS AFTER ENTERING HISTORY ===');
errors.forEach(e => console.log(e));

var histState2 = await page.evaluate(() => ({
    histActive: typeof window.historyIsActive === 'function' ? window.historyIsActive() : 'no-function',
    bodyClasses: document.body.className,
}));
console.log('=== HISTORY STATE AFTER ENTER ===', JSON.stringify(histState2));

// Try search
errors.length = 0;
var searchEl = await page.$('#histSearchInput');
if (searchEl) {
    console.log('Search element found, typing...');
    await searchEl.fill('wwii');
    await page.waitForTimeout(1000);
    console.log('=== ERRORS AFTER SEARCH ===');
    errors.forEach(e => console.log(e));
} else {
    console.log('Search element NOT FOUND');
}

// Try region filter
var regionEl = await page.$('#histFilterRegion');
if (regionEl) {
    console.log('Region filter found');
    await regionEl.selectOption('europe');
    await page.waitForTimeout(500);
} else {
    console.log('Region filter NOT FOUND');
}

// Try religion filter
var religionEl = await page.$('#histFilterReligion');
if (religionEl) {
    console.log('Religion filter found');
    await religionEl.selectOption('muslim');
    await page.waitForTimeout(500);
} else {
    console.log('Religion filter NOT FOUND');
}

console.log('=== FINAL ERRORS ===');
errors.forEach(e => console.log(e));

await browser.close();
