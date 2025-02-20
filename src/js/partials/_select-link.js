const rf_select_link = () => {

  const selectLinks = document.querySelectorAll('[data-js-select-link]')

  selectLinks.forEach(link => {
    link.addEventListener('change', e => {
      const href = e.target.selectedOptions[0].value
      location.href = href
    })
  })
}

export default rf_select_link