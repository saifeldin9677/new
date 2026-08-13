#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DIST = path.join(__dirname, 'dist');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

function run(cmd) {
    console.log(`  $ ${cmd}`);
    execSync(cmd, { cwd: SRC, stdio: 'inherit' });
}

const MODULES = ['data.js', 'state.js', 'i18n.js', 'layers.js', 'map-core.js', 'quiz.js', 'export.js', 'ui.js', 'main.js'];

for (const mod of MODULES) {
    console.log(`Minifying ${mod} ...`);
    run(`npx terser ${mod} -o dist/${mod} -c -m --comments "/^!|^[\\^]/"`);
}

console.log('Minifying style.css ...');
run('npx csso style.css -o dist/style.css');

if (fs.existsSync(path.join(DIST, 'app.js'))) fs.rmSync(path.join(DIST, 'app.js'));

console.log('Minifying index.html ...');
run('npx html-minifier-terser --collapse-whitespace --remove-comments --remove-redundant-attributes --minify-css true --minify-js false index.html -o dist/index.html');

// Rewrite paths in dist/index.html: *.js → *.min.js etc. — not needed since
// we keep same filenames in dist/. Just report sizes.
console.log('\nDone. Output in dist/');
if (fs.existsSync(path.join(SRC, 'vendor'))) {
    fs.cpSync(path.join(SRC, 'vendor'), path.join(DIST, 'vendor'), { recursive: true });
    console.log('  Copied vendor/');
}
if (fs.existsSync(path.join(SRC, 'fonts'))) {
    fs.cpSync(path.join(SRC, 'fonts'), path.join(DIST, 'fonts'), { recursive: true });
    console.log('  Copied fonts/');
}
fs.copyFileSync(path.join(SRC, 'admin-boundaries-data.json'), path.join(DIST, 'admin-boundaries-data.json'));
console.log('  Copied admin-boundaries-data.json');
fs.copyFileSync(path.join(SRC, 'admin-name-translations.json'), path.join(DIST, 'admin-name-translations.json'));
console.log('  Copied admin-name-translations.json');
fs.copyFileSync(path.join(SRC, 'timezone-data.json'), path.join(DIST, 'timezone-data.json'));
console.log('  Copied timezone-data.json');
fs.copyFileSync(path.join(SRC, 'countries-110m.json'), path.join(DIST, 'countries-110m.json'));
console.log('  Copied countries-110m.json');
fs.copyFileSync(path.join(SRC, 'firebase.js'), path.join(DIST, 'firebase.js'));
console.log('  Copied firebase.js');
fs.copyFileSync(path.join(SRC, 'boot.js'), path.join(DIST, 'boot.js'));
console.log('  Copied boot.js');
fs.copyFileSync(path.join(SRC, 'icons.js'), path.join(DIST, 'icons.js'));
console.log('  Copied icons.js');
['manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'].forEach(function(f) {
    var srcPath = path.join(SRC, f);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(DIST, f));
        console.log('  Copied ' + f);
    } else {
        console.log('  Skipped ' + f + ' (not found in source)');
    }
});
const files = [...MODULES, 'style.css', 'index.html'];
const origTotal = files.reduce((s, f) => s + fs.statSync(path.join(SRC, f)).size, 0);
const distTotal = files.reduce((s, f) => s + fs.statSync(path.join(DIST, f)).size, 0);
files.forEach(f => {
    const o = fs.statSync(path.join(SRC, f)).size;
    const d = fs.statSync(path.join(DIST, f)).size;
    const pct = ((1 - d / o) * 100).toFixed(1);
    console.log(`  ${f.padEnd(14)} ${(o/1024).toFixed(0).padStart(6)} KB → ${(d/1024).toFixed(0).padStart(6)} KB  (${pct}% saved)`);
});
console.log(`  ${'TOTAL'.padEnd(14)} ${(origTotal/1024).toFixed(0).padStart(6)} KB → ${(distTotal/1024).toFixed(0).padStart(6)} KB  (${((1 - distTotal/origTotal)*100).toFixed(1)}% saved)`);
