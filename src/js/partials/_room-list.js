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

const rf_room_list_toggle = () => {
  const openClass = '--is-open'
  let tempText = ''
  const toggles = document.querySelectorAll('[data-js-room-toggle]')

  toggles.forEach(toggle => {
    console.log(toggle)
    toggle.addEventListener('click', e => {
      const target = document.querySelector(toggle.dataset.jsRoomToggle)

      target.classList.toggle(openClass)
      toggle.classList.toggle(openClass)

      if (target.classList.contains(openClass)) {
        target.style.maxHeight = target.scrollHeight + 'px'
      } else {
        target.style.maxHeight = ''
      }

      // テキスト
      if ('jsRoomToggleText' in toggle.dataset) {
        tempText = toggle.textContent
        toggle.textContent = toggle.dataset.jsRoomToggleText
        toggle.dataset.jsRoomToggleText = tempText
      }
    })
  })
}

export { rf_room_list_link, rf_room_list_toggle }