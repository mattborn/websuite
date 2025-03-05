fetch('templates.json')
  .then(r => r.json())
  .then(files => {
    document.querySelector('.list').innerHTML = files
      .map(f => `<a class="item" href="templates/${f}">${f}</a>`)
      .join('')
  })
