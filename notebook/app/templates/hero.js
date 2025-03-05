const q = document.querySelectorAll.bind(document)

q('[data-bg]').forEach(
  el => (el.style.backgroundImage = `url('${el.dataset.bg}')`),
)
