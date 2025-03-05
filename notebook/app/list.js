const fs = require('fs')

const files = fs
  .readdirSync('templates')
  .filter(f => f.endsWith('.html'))
  .sort()

fs.writeFileSync('templates.json', JSON.stringify(files))
