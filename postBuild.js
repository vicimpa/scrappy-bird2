const { readFileSync, rmSync, writeFileSync } = require('fs')
const { join } = require('path')
const { outDir } = require('./config')

rmSync(join(outDir, 'assets'), { recursive: true, force: true })
const fileData = readFileSync(join(outDir, 'index.html'), 'utf-8')

// writeFileSync('./dist/index.ord.html', fileData)
writeFileSync(join(outDir, 'index.html'), fileData.replace(/\/\*([^\/]+)\*\//gsm, ''))