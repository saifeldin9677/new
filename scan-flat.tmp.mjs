import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');
const px = (png, x, y) => { const i = (png.width * y + x) * 4; return [png.data[i], png.data[i+1], png.data[i+2]]; };
function close(a, b, tol = 20) { return Math.abs(a[0]-b[0]) <= tol && Math.abs(a[1]-b[1]) <= tol && Math.abs(a[2]-b[2]) <= tol; }
let pass = 0, fail = 0;
for (const [f, expected, label] of [
    ['popover-layers-flat-ar-dark.png', [30, 38, 46], 'dark panel'],
    ['popover-layers-flat-ar-dark-on.png', [30, 38, 46], 'dark panel'],
    ['popover-layers-flat-ar-light.png', [241, 245, 249], 'light panel'],
    ['popover-layers-flat-mobile-dark.png', [30, 38, 46], 'dark panel'],
]) {
    const png = PNG.sync.read(readFileSync('/home/saifeldin/Downloads/' + f));
    const cx = Math.floor(png.width / 2);
    let found = false;
    for (let y = 60; y < png.height - 40; y += 30) {
        if (close(px(png, cx, y), expected, 24)) { found = true; break; }
    }
    if (found) { pass++; console.log('PASS', f); }
    else { fail++; console.log('FAIL', f); }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
