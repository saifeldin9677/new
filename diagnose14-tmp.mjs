import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 400)); });
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.click('#langOverlay .lang-overlay-btn[data-lang="en"]');
await page.waitForTimeout(1000);
var pick = await page.$('#sectionPickerOverlay:not([style*="none"])');
if (pick && await pick.isVisible().catch(() => false)) {
    await page.click('#sectionPickerOverlay .section-card.section-card-history');
    await page.waitForTimeout(1000);
}
for (let r = 0; r < 4; r++) {
    await page.waitForTimeout(400);
    var el;
    if ((el = await page.$('#projectionContinue')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    if ((el = await page.$('#onboardSkip')) && await el.isVisible().catch(() => false)) { await el.click(); continue; }
    break;
}
await page.waitForTimeout(1500);

console.log('=== TEST: Country click sequence in History mode ===');

// First, check current state
var st = await page.evaluate(() => ({
    histActive: window.historyIsActive(),
    tab: document.querySelector('.history-mode-seg-btn.active') ? document.querySelector('.history-mode-seg-btn.active').id : 'none',
}));
console.log('Initial state:', JSON.stringify(st));

// Click France on the map
async function clickCountry(name) {
    return await page.evaluate((n) => {
        var svg = document.getElementById('mapSvg');
        var paths = svg.querySelectorAll('path');
        for (var i = 0; i < paths.length; i++) {
            var d = paths[i].__data__;
            if (d && d.properties && d.properties.name === n) {
                paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 400, clientY: 300 }));
                return 'clicked ' + n + ' (path index ' + i + ', datum name: ' + (d.properties.name || 'null') + ')';
            }
        }
        return n + ' not found';
    }, name);
}

function getPanelCountry() {
    return page.evaluate(() => {
        var h3 = document.querySelector('#panelContent h3');
        return h3 ? h3.textContent.trim() : 'no h3';
    });
}

console.log('\n1. Click France:');
var r1 = await clickCountry('France');
console.log('  Result:', r1);
await page.waitForTimeout(500);
console.log('  Panel shows:', await getPanelCountry());

console.log('\n2. Click Germany:');
var r2 = await clickCountry('Germany');
console.log('  Result:', r2);
await page.waitForTimeout(500);
console.log('  Panel shows:', await getPanelCountry());

console.log('\n3. Click Japan:');
var r3 = await clickCountry('Japan');
console.log('  Result:', r3);
await page.waitForTimeout(500);
console.log('  Panel shows:', await getPanelCountry());

// Also check what selectedCountry is
var selState = await page.evaluate(() => {
    // Try to access internal state (may not be exposed)
    return {
        panelHTML: (document.getElementById('panelContent') || {}).innerHTML ? document.getElementById('panelContent').innerHTML.slice(0, 300) : 'none',
    };
});
console.log('\nPanel HTML:', selState.panelHTML);

// Now test: switch to Eras tab, click a country, switch back to Wars, click another
console.log('\n=== TEST: Switch tabs then click country ===');
await page.evaluate(() => window.selectHistoryTab('eras'));
await page.waitForTimeout(2000);
console.log('Switched to eras');

console.log('\n4. Click Brazil in Eras mode:');
var r4 = await clickCountry('Brazil');
console.log('  Result:', r4);
await page.waitForTimeout(500);
console.log('  Panel shows:', await getPanelCountry());

await page.evaluate(() => window.selectHistoryTab('wars'));
await page.waitForTimeout(1500);
console.log('Switched back to wars');

console.log('\n5. Click China in Wars mode:');
var r5 = await clickCountry('China');
console.log('  Result:', r5);
await page.waitForTimeout(500);
console.log('  Panel shows:', await getPanelCountry());

console.log('\n=== ALL ERRORS ===');
var errors = await page.evaluate(() => window.__pageErrors || []);
// Check page console logs
await browser.close();
