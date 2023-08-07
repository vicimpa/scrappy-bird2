const { readFileSync, rmSync, writeFileSync } = require('fs');
const { join } = require('path');
const outDir = './build';
const { minify } = require('html-minifier-terser');

rmSync(join(outDir, 'assets'), { recursive: true, force: true });
const fileData = readFileSync(join(outDir, 'index.html'), 'utf-8');

minify(fileData.replace(/\/\*([^\/]+)\*\//gsm, ''), {
  removeComments: true,
  removeTagWhitespace: true,
  noNewlinesBeforeTagClose: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
})
  .then(output => {
    writeFileSync(join(outDir, 'index.html'), output);
  });
