// お部屋リスト

const rf_room_list_link = () => {
  const links = document.querySelectorAll('[data-js-link-room]')

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.stopPropagation()
      const clicked = e.target

      if (clicked.tagName === 'A' || clicked.tagName === 'BUTTON') {
        console.log('インタラクティブ要素なので中止')
        return
      }

      const target = link.dataset.jsLinkRoom
      window.open(target, '_blank')
      // target.scrollIntoView({ behavior: 'smooth' })
    })
  })
}

export { rf_room_list_link }