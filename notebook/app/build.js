const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const layout = fs.readFileSync('./layout.html', 'utf8')
const head = layout.split('<body>')[0]
const templates = JSON.parse(fs.readFileSync('templates.json'))

const createFiles = (dir, depth = 0) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (!entry.isDirectory()) return

    const fullPath = path.join(dir, entry.name)

    if (depth === 1 && !fs.readdirSync(fullPath).length)
      fs.mkdirSync(path.join(fullPath, 'default'))

    if (depth === 2) {
      const htmlPath = path.join(fullPath, 'index.html')
      const cssName = entry.name === 'default' ? path.basename(dir) : entry.name
      const cssPath = path.join(fullPath, `${cssName}.css`)

      if (!fs.existsSync(htmlPath))
        fs.writeFileSync(
          htmlPath,
          `<!doctype html>
<html>
  <head></head>
  <body>
  ${fullPath}
  </body>
</html>
`,
        )
      if (!fs.existsSync(cssPath)) fs.writeFileSync(cssPath, '')
    }

    createFiles(fullPath, depth + 1)
  })
}

const syncHeads = dir => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (!entry.isDirectory()) return

    const fullPath = path.join(dir, entry.name)
    const indexPath = path.join(fullPath, 'index.html')

    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8')
      const body = content.split('<body>')[1] || '</body></html>'
      const depth = fullPath.split('/').length
      const prefix = '../'.repeat(depth + 1)
      const cssName = entry.name === 'default' ? path.basename(dir) : entry.name
      content = head
        .replace('../global', prefix + 'global')
        .replace('notebook.css', `${cssName}.css`)

      if (templates[fullPath]?.title)
        content = content.replace(
          /le>.*?<\/t/,
          `le>${templates[fullPath].title}</t`,
        )

      fs.writeFileSync(indexPath, content + '<body>' + body)
    }

    syncHeads(fullPath)
  })
}

const updateNav = (dir, depth = 0) => {
  const entries = {}

  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    if (!entry.isDirectory()) return

    const fullPath = path.join(dir, entry.name)
    entries[fullPath] = templates[fullPath] || {}

    Object.assign(entries, updateNav(fullPath, depth + 1))
  })

  return entries
}

createFiles('.')
console.log('✅ Files created')

syncHeads('.')
console.log('✅ Heads synced')

execSync('npx prettier --log-level silent --write "**/*.html"')
console.log('✅ Files formatted')

fs.writeFileSync('templates.json', JSON.stringify(updateNav('.'), null, 2))
console.log('✅ Nav updated')
