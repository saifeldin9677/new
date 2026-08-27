import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', function(msg) { logs.push('[' + msg.type() + '] ' + msg.text()); });
page.on('pageerror', function(e) { logs.push('[PAGE_ERROR] ' + String(e)); });
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

// Inject logging into refreshHistoryAfterFilterChange
await page.evaluate(() => {
    // Check if function exists
    console.log('refreshHistFilter exists: ' + (typeof window.__origRefreshFilter));
    // Patch it
});

// Switch to Eras
await page.evaluate(() => window.selectHistoryTab('eras'));
await page.waitForTimeout(1500);

// Count era chips before filtering
var before = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips before filter: ' + before);

// Type into search
logs.length = 0;
await page.fill('#histSearchInput', 'russian');
await page.waitForTimeout(1000);
var afterSearch = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips after search "russian": ' + afterSearch);
console.log('Visible era chip texts:', JSON.stringify(await page.evaluate(() => {
    return [...document.querySelectorAll('.history-era-chip')].map(c => c.textContent.trim()).filter(t => t.length < 60);
})));
console.log('Logs after search:', logs.filter(l => l.indexOf('search') !== -1 || l.indexOf('filter') !== -1 || l.indexOf('refresh') !== -1));

// Clear search, try region
await page.fill('#histSearchInput', '');
await page.waitForTimeout(500);
var resetCount = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips after clearing search: ' + resetCount);

// Region filter
await page.selectOption('#histFilterRegion', 'east-asia');
await page.waitForTimeout(500);
var afterRegion = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips after region=east-asia: ' + afterRegion);
console.log('Visible era chip texts:', JSON.stringify(await page.evaluate(() => {
    return [...document.querySelectorAll('.history-era-chip')].map(c => c.textContent.trim()).filter(t => t.length < 60);
})));

// Religion filter
await page.selectOption('#histFilterRegion', 'all');
await page.waitForTimeout(500);
await page.selectOption('#histFilterReligion', 'muslim');
await page.waitForTimeout(500);
var afterReligion = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips after religion=muslim: ' + afterReligion);

// Combined
await page.selectOption('#histFilterRegion', 'middle-east');
await page.waitForTimeout(500);
var afterBoth = await page.evaluate(() => document.querySelectorAll('.history-era-chip').length);
console.log('Era chips after middle-east+muslim: ' + afterBoth);

// Check if any console.log calls from the app itself appeared
console.log('\n=== ALL APP LOGS ===');
logs.filter(l => !l.startsWith('[warning]')).forEach(l => console.log(l));

await browser.close();
