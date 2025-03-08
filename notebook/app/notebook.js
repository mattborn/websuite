fetch('templates.json')
  .then(r => r.json())
  .then(templates => {
    // Group by top level directory
    const groups = Object.keys(templates).reduce((acc, path) => {
      const [root, section] = path.split('/')
      if (!section) return acc
      if (!acc[root]) acc[root] = new Set()
      acc[root].add(section)
      return acc
    }, {})

    Object.entries(groups).forEach(([root, sections]) => {
      const section = document.createElement('section')
      const label = document.createElement('div')
      label.textContent = root
      label.className = 'label'
      section.appendChild(label)

      Array.from(sections)
        .sort()
        .forEach(name => {
          const link = document.createElement('a')
          link.className = 'item'
          link.textContent = name
          link.onclick = e => {
            e.preventDefault()
            const examples = Object.keys(templates)
              .filter(p => p.startsWith(`${root}/${name}/`))
              .sort((a, b) => (a.includes('default') ? -1 : 1))

            const main = document.querySelector('main')
            main.innerHTML = examples
              .map(path => `<iframe src="${path}/"></iframe>`)
              .join('')

            // Note: Only handles initial load, not window resize
            main.querySelectorAll('iframe').forEach(f => {
              f.onload = () => {
                const height = f.contentWindow.document.body.scrollHeight
                if (height > window.innerHeight / 2)
                  f.style.height = height + 'px'
              }
            })
          }
          section.appendChild(link)
        })

      document.querySelector('nav').appendChild(section)
    })
  })
