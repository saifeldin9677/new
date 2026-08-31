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

console.log('Minifying app.js ...');
run('npx terser app.js -o dist/app.js -c -m --comments "/^!|^[\\^]/"');

console.log('Minifying data.js ...');
run('npx terser data.js -o dist/data.js -c -m --comments "/^!|^[\\^]/"');

console.log('Minifying style.css ...');
run('npx csso style.css -o dist/style.css');

console.log('Minifying index.html ...');
run('npx html-minifier-terser --collapse-whitespace --remove-comments --remove-redundant-attributes --minify-css true --minify-js false index.html -o dist/index.html');

// Rewrite paths in dist/index.html: *.js → *.min.js etc. — not needed since
// we keep same filenames in dist/. Just report sizes.
console.log('\nDone. Output in dist/');
// Copy all runtime data JSON files from the source root so the built app can
// fetch them. Done dynamically (list all *.json except package metadata) so a
// new/renamed data file can never be silently left out of the deploy again.
const dataJsonFiles = [
    'countries-110m.json',
    'admin-boundaries-data.json',
    'glaciated-areas-data.json',
    'admin-name-translations.json',
    'historical-eras-data.json',
    'timezone-data.json'
];
dataJsonFiles.forEach(function(f) {
    if (!fs.existsSync(path.join(SRC, f))) {
        console.log('  MISSING ' + f + ' (expected at source root)');
        return;
    }
    fs.copyFileSync(path.join(SRC, f), path.join(DIST, f));
    console.log('  Copied ' + f);
});
// Copy the vendor library directory and standalone bootstrap/entry scripts that
// dist/index.html references directly. Without these a clean build 404s on
// d3/topojson/firebase/boot and the app fails to boot ("d3 is not defined").
if (fs.existsSync(path.join(SRC, 'vendor'))) {
    fs.cpSync(path.join(SRC, 'vendor'), path.join(DIST, 'vendor'), { recursive: true });
    console.log('  Copied vendor/');
} else {
    console.log('  Skipped vendor/ (directory not found)');
}
['boot.js', 'firebase.js'].forEach(function(f) {
    var srcPath = path.join(SRC, f);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(DIST, f));
        console.log('  Copied ' + f);
    } else {
        console.log('  Skipped ' + f + ' (not found in source)');
    }
});
['manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'].forEach(function(f) {
    var srcPath = path.join(SRC, f);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(DIST, f));
        console.log('  Copied ' + f);
    } else {
        console.log('  Skipped ' + f + ' (not found in source)');
    }
});
const files = ['app.js', 'data.js', 'style.css', 'index.html'];
const origTotal = files.reduce((s, f) => s + fs.statSync(path.join(SRC, f)).size, 0);
const distTotal = files.reduce((s, f) => s + fs.statSync(path.join(DIST, f)).size, 0);
files.forEach(f => {
    const o = fs.statSync(path.join(SRC, f)).size;
    const d = fs.statSync(path.join(DIST, f)).size;
    const pct = ((1 - d / o) * 100).toFixed(1);
    console.log(`  ${f.padEnd(14)} ${(o/1024).toFixed(0).padStart(6)} KB → ${(d/1024).toFixed(0).padStart(6)} KB  (${pct}% saved)`);
});
console.log(`  ${'TOTAL'.padEnd(14)} ${(origTotal/1024).toFixed(0).padStart(6)} KB → ${(distTotal/1024).toFixed(0).padStart(6)} KB  (${((1 - distTotal/origTotal)*100).toFixed(1)}% saved)`);
