const fs = require('fs')
const path = require('path')

const scaffold = (dir, depth = 0) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (!entry.isDirectory()) return

    const fullPath = path.join(dir, entry.name)
    const indexPath = path.join(fullPath, 'index.html')
    const cssPath = path.join(fullPath, `${entry.name}.css`)

    if (!fs.existsSync(indexPath)) {
      const html = `<!DOCTYPE html>
<html>
  <head></head>
  <body>${fullPath}</body>
</html>
`
      fs.writeFileSync(indexPath, html)
    }

    if (depth === 3 && !fs.existsSync(cssPath)) fs.writeFileSync(cssPath, '')

    scaffold(fullPath, depth + 1)
  })
}

scaffold('.')
console.log('✅ Scaffolding complete.')
