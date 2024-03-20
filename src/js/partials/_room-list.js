// お部屋リスト

const rf_room_list_link = () => {
  const links = document.querySelectorAll('[data-js-room-link]')

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.stopPropagation()
      const clicked = e.target

      if (clicked.tagName === 'A' || clicked.tagName === 'BUTTON') {
        console.log('インタラクティブ要素なので中止')
        return
      }

      const target = link.dataset.jsRoomLink
      window.open(target, '_blank')
    })
  })
}

const rf_room_list_toggle = () => {
  const openClass = '--is-open'
  let tempText = ''
  const toggles = document.querySelectorAll('[data-js-room-toggle]')

  toggles.forEach(toggle => {
    const target = document.querySelector(toggle.dataset.jsRoomToggle)
    toggle.addEventListener('click', () => {

      target.classList.toggle(openClass)
      toggle.classList.toggle(openClass)

      // 高さ
      if (target.classList.contains(openClass)) {
        target.style.maxHeight = target.scrollHeight + 'px'
      } else {
        target.style.maxHeight = null
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