import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', function(e) { console.log('[PAGE_ERROR]', String(e).slice(0, 600)); });
page.on('console', function(msg) {
    var t = msg.type();
    if (t === 'error') console.log('[ERR]', msg.text().slice(0, 600));
});
var client = await page.context().newCDPSession(page);
await client.send('Runtime.enable');
client.on('Runtime.exceptionThrown', function(p) {
    console.log('[CDP_EXC]', JSON.stringify(p.exceptionDetails).slice(0, 600));
});
await page.goto('http://127.0.0.1:8321/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
var st = await page.evaluate(() => {
    return {
        langOverlay: !!document.getElementById('langOverlay'),
        langOverlayVisible: document.getElementById('langOverlay') ? getComputedStyle(document.getElementById('langOverlay')).display : 'gone',
        sectionPicker: !!document.getElementById('sectionPickerOverlay'),
        sectionPickerVisible: document.getElementById('sectionPickerOverlay') ? getComputedStyle(document.getElementById('sectionPickerOverlay')).display : 'gone',
        onboardDone: localStorage.getItem('onboardDone'),
        savedLang: localStorage.getItem('mapLang'),
        initCalled: typeof window.applySection !== 'undefined',
        svgChildren: document.getElementById('mapSvg') ? document.getElementById('mapSvg').children.length : -1,
        bodyClasses: document.body.className,
    };
});
console.log(JSON.stringify(st, null, 2));
await browser.close();
