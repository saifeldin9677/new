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
await page.waitForTimeout(1000);
console.log('=== AFTER OVERLAYS ===');
// Check the full state
var st = await page.evaluate(() => {
    var warp = document.getElementById('histWarTabs');
    var scenbtns = document.getElementById('histScenarioBtns');
    var eragrp = document.getElementById('historyEraGroup');
    return {
        historyActive: typeof window.historyIsActive === 'function' ? window.historyIsActive() : 'fn',
        bodyClasses: document.body.className,
        histTab: document.querySelector('.history-mode-seg-btn.seg-active') ? document.querySelector('.history-mode-seg-btn.seg-active').id : 'none',
        warpVisible: warp ? getComputedStyle(warp).display : 'null',
        warpChildren: warp ? warp.children.length : 0,
        scenBtnVisible: scenbtns ? getComputedStyle(scenbtns).display : 'null',
        scenBtnChildren: scenbtns ? scenbtns.children.length : 0,
        eraGrpVisible: eragrp ? getComputedStyle(eragrp).display : 'null',
        eraGrpChildren: eragrp ? eragrp.children.length : 0,
        eraChips: document.querySelectorAll('.history-era-chip').length,
        warTabs: document.querySelectorAll('.history-war-tab').length,
    };
});
console.log(JSON.stringify(st, null, 2));

// Switch to eras
console.log('\n=== SWITCHING TO ERAS ===');
await page.evaluate(() => window.selectHistoryTab('eras'));
await page.waitForTimeout(2000);
var st2 = await page.evaluate(() => {
    return {
        histTab: document.querySelector('.history-mode-seg-btn.seg-active') ? document.querySelector('.history-mode-seg-btn.seg-active').id : 'none',
        eraChips: document.querySelectorAll('.history-era-chip').length,
        eraGroupChildren: document.getElementById('historyEraGroup') ? document.getElementById('historyEraGroup').children.length : 0,
        eraGroupHTML: document.getElementById('historyEraGroup') ? document.getElementById('historyEraGroup').innerHTML.slice(0, 300) : 'null',
        warTabs: document.querySelectorAll('.history-war-tab').length,
        filterRegionOpts: document.getElementById('histFilterRegion') ? document.getElementById('histFilterRegion').options.length : 0,
        filterReligionOpts: document.getElementById('histFilterReligion') ? document.getElementById('histFilterReligion').options.length : 0,
    };
});
console.log(JSON.stringify(st2, null, 2));

// Check if era chips have click handlers
console.log('\n=== ERA CHIP CLICK TEST ===');
var chipTexts = await page.evaluate(() => {
    return [...document.querySelectorAll('.history-era-chip')].slice(0, 5).map(c => c.textContent.trim());
});
console.log('First 5 chips:', chipTexts);

// Try clicking a chip
if (chipTexts.length > 0) {
    await page.click('.history-era-chip:first-child');
    await page.waitForTimeout(1000);
    var overlayPaths = await page.evaluate(() => document.querySelectorAll('#historyOverlayLayer path').length);
    console.log('Overlay paths after chip click:', overlayPaths);
}

// Now check country click
console.log('\n=== COUNTRY CLICK TEST ===');
var countryClicked = await page.evaluate(() => {
    var paths = document.querySelectorAll('#mapSvg path');
    for (var i = 0; i < Math.min(paths.length, 5); i++) {
        var d = paths[i].__data__;
        if (d && d.properties && d.properties.name) return d.properties.name;
    }
    return null;
});
console.log('First country path:', countryClicked);

if (countryClicked) {
    await page.evaluate(() => {
        var paths = document.querySelectorAll('#mapSvg path');
        for (var i = 0; i < paths.length; i++) {
            var d = paths[i].__data__;
            if (d && d.properties && d.properties.name === 'France') {
                paths[i].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                return 'clicked France';
            }
        }
        // Try first path with data
        for (var j = 0; j < paths.length; j++) {
            var d2 = paths[j].__data__;
            if (d2 && d2.properties && d2.properties.name) {
                paths[j].dispatchEvent(new MouseEvent('click', { bubbles: true }));
                return 'clicked ' + d2.properties.name;
            }
        }
        return 'no country found';
    });
    await page.waitForTimeout(500);
    var panelVisible = await page.evaluate(() => {
        var cp = document.getElementById('countryPanel');
        return cp ? { visible: cp.classList.contains('visible'), display: cp.style.display, content: (cp.innerHTML || '').slice(0, 200) } : 'no panel';
    });
    console.log('Country panel:', JSON.stringify(panelVisible));
}

await browser.close();
