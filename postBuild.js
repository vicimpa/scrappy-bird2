const { readFileSync, rmSync, writeFileSync } = require('fs')

rmSync('./dist/assets', { recursive: true, force: true })
const fileData = readFileSync('./dist/index.html', 'utf-8')

writeFileSync('./dist/index.ord.html', fileData)
writeFileSync('./dist/index.html', fileData.replace(/\/\*([^\/]+)\*\//gsm, ''))