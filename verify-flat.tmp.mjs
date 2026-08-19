import { chromium } from 'playwright';

const SHOT_DIR = '/home/saifeldin/Downloads';
let pass = 0, fail = 0;
const OUT = [];
function near(v, target, tol) {
    const m = String(v).match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([\d.]+))?\)/);
    if (!m) return false;
    for (let i = 1; i <= 3; i++) if (Math.abs(Number(m[i]) - target[i - 1]) > tol) return false;
    if (target.length > 3 && m[4] !== undefined && Math.abs(Number(m[4]) - target[3]) > 0.02) return false;
    return true;
}
function check(name, actual, expected) {
    const ok = String(actual) === String(expected);
    if (ok) pass++;
    else { fail++; OUT.push(`FAIL: ${name} — expected ${expected}, got ${actual}`); }
}

async function openPopover(page) {
    await page.waitForFunction(() => {
        const b = document.getElementById('controlsBar');
        return b && b.querySelectorAll('#modeButtons .btn').length > 0;
    }, { timeout: 30000 });
    await page.evaluate(() => document.getElementById('barLayersBtn').click());
    await page.waitForTimeout(400);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
await ctx.addInitScript(() => {
    try {
        localStorage.setItem('mapLang', 'ar');
        localStorage.setItem('onboardDone', '1');
        localStorage.setItem('projectionExplainerDone', '1');
    } catch {}
});
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:8321/', { waitUntil: 'load' });
await openPopover(page);

const s = await page.evaluate(() => {
    const grid = document.querySelector('#layersModalBody .layers-flat-grid');
    const body = document.getElementById('layersModalBody');
    const cs = getComputedStyle(grid);
    const card = document.querySelector('#labelsToggle');
    const cardCs = getComputedStyle(card);
    const icon = card.querySelector('.layer-icon svg');
    const iconCs = getComputedStyle(icon);
    const title = card.querySelector('.layer-title');
    const titleCs = getComputedStyle(title);
    const sel = document.getElementById('blocSelect');
    return {
        gridExists: !!grid,
        categories: body.querySelectorAll('.layers-category').length,
        h4s: body.querySelectorAll('h4').length,
        gridChildren: grid ? grid.children.length : 0,
        cards: grid ? grid.querySelectorAll('.layer-card').length : 0,
        gridDisplay: cs.display,
        cols: cs.gridTemplateColumns.split(' ').filter(Boolean).length,
        gap: cs.gap,
        padding: cs.padding,
        maxHeight: cs.maxHeight,
        overflowY: cs.overflowY,
        radius: cardCs.borderRadius,
        border: cardCs.borderTopWidth + ' ' + cardCs.borderTopStyle,
        cardDisp: cardCs.display,
        iconSize: iconCs.width + 'x' + iconCs.height,
        iconWrap: !!card.querySelector('.layer-icon'),
        titleWrap: !!card.querySelector('.layer-title'),
        titleSize: titleCs.fontSize,
        titleWeight: titleCs.fontWeight,
        titleNowrap: titleCs.whiteSpace,
        selSpan: getComputedStyle(sel).gridColumn,
        hasIcon: !!card.querySelector('.layer-icon svg'),
        idsOk: ['labelsToggle','sectToggle','coordsToggle','capitalsToggle','majorCitiesToggle','timezonesToggle','densitySpotsToggle','routesToggle','riversToggle','geopoliticalBlocsToggle','borderDisputesToggle','naturalResourcesToggle','ethnicGroupsToggle','desertsForestsToggle','oceanCurrentsToggle','windsToggle','earthquakesToggle','volcanoesToggle'].every(id => document.getElementById(id)),
    };
});
check('flat grid exists', s.gridExists, true);
check('no category wrappers', s.categories, 0);
check('no h4 headers', s.h4s, 0);
check('grid children = 19 (18 cards + select)', s.gridChildren, 19);
check('18 layer-cards', s.cards, 18);
check('display grid', s.gridDisplay, 'grid');
check('4 columns', s.cols, 4);
check('gap 12px', s.gap, '12px');
check('padding 16px', s.padding, '16px');
check('max-height 420px', s.maxHeight, '420px');
check('overflow-y auto', s.overflowY, 'auto');
check('card radius dock-radius', s.radius, '10.4px');
check('card transparent border', s.border, '1px solid');
check('card flex column', s.cardDisp, 'flex');
check('icon wrapped', s.iconWrap, true);
check('title wrapped', s.titleWrap, true);
check('icon svg 22px', s.iconSize, '22pxx22px');
check('title 11.5px', s.titleSize, '11.5px');
check('title weight 500', s.titleWeight, '500');
check('title nowrap', s.titleNowrap, 'nowrap');
check('select spans full width', s.selSpan, '1 / -1');
check('all layer ids preserved', s.idsOk, true);

await page.screenshot({ path: `${SHOT_DIR}/popover-layers-flat-ar-dark.png` });

// toggle-on still works
await page.evaluate(() => document.getElementById('labelsToggle').click());
await page.waitForTimeout(400);
const on = await page.evaluate(() => {
    const c = getComputedStyle(document.getElementById('labelsToggle'));
    return { bg: c.backgroundColor, color: c.color };
});
check('toggle-on bg (dark)', near(on.bg, [20, 184, 166, 0.15]), true);
check('toggle-on text', near(on.color, [20, 184, 166]), true);
await page.screenshot({ path: `${SHOT_DIR}/popover-layers-flat-ar-dark-on.png` });

// All Off resets
await page.evaluate(() => {
    [...document.querySelectorAll('#layersModalBody .menu-popover-actions .btn')].find(b => b.id !== 'resetLayersBtn').click();
});
await page.waitForTimeout(300);
check('All Off clears toggle-on', await page.evaluate(() => document.querySelectorAll('#layersModalBody .btn.toggle-on').length), 0);

// close + divisions untouched
await page.evaluate(() => document.getElementById('layersModalClose').click());
await page.waitForTimeout(300);
await page.evaluate(() => document.getElementById('barDivisionBtn').click());
await page.waitForTimeout(400);
check('divisions still religion tiles', await page.evaluate(() => document.querySelectorAll('#religionButtons .religion-btn').length > 0), true);
await page.screenshot({ path: `${SHOT_DIR}/popover-divisions-flat-en-dark.png` });
await page.evaluate(() => document.getElementById('divisionPopoverClose').click());

// light theme accent
await page.evaluate(() => document.body.setAttribute('data-theme', 'light'));
await page.evaluate(() => document.getElementById('barLayersBtn').click());
await page.waitForTimeout(400);
await page.evaluate(() => document.getElementById('capitalsToggle').click());
await page.waitForTimeout(400);
const l = await page.evaluate(() => {
    const c = getComputedStyle(document.getElementById('capitalsToggle'));
    return { bg: c.backgroundColor, color: c.color };
});
check('light toggle-on bg', near(l.bg, [13, 148, 136, 0.15]), true);
check('light toggle-on text', near(l.color, [13, 148, 136]), true);
await page.screenshot({ path: `${SHOT_DIR}/popover-layers-flat-ar-light.png` });
await page.evaluate(() => document.getElementById('layersModalClose').click());
await page.evaluate(() => document.body.removeAttribute('data-theme'));

// mobile 3 columns
await page.setViewportSize({ width: 500, height: 800 });
await page.evaluate(() => document.getElementById('barLayersBtn').click());
await page.waitForTimeout(400);
check('mobile 3 columns', await page.evaluate(() => {
    const grid = document.querySelector('#layersModalBody .layers-flat-grid');
    return getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
}), 3);
await page.screenshot({ path: `${SHOT_DIR}/popover-layers-flat-mobile-dark.png` });

await browser.close();
console.log(OUT.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
