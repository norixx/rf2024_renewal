// お部屋リスト
import { rf_get_globals, rf_set_globals } from './_globals'


// 部屋リストリンク
const rf_room_list_link = () => {
  const links = document.querySelectorAll('[data-js-room-link]')

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.stopPropagation()
      const clicked = e.target

      if (
        clicked.tagName === 'A' ||
        clicked.tagName === 'BUTTON' ||
        clicked.closest('.swiper-initialized') //動いているswiperは中止対象
      ) {
        console.log('インタラクティブ要素なので中止')
        return
      }

      const target = link.dataset.jsRoomLink
      window.open(target, '_blank')
    })
  })
}

// お部屋リストの制御
const rf_room_list_toggle = () => {
  const openClass = '--is-open'
  let tempText = ''
  const maxHeightPC = 660
  const maxHeightSP = 1200
  const toggles = document.querySelectorAll('[data-js-room-toggle]')


  // トグルボタンのコントロール, 画像の読み込みなどを考慮してwindowロード後
  window.addEventListener('load', () => {
    toggles.forEach(toggle => {
      const target = document.querySelector(toggle.dataset.jsRoomToggle)

      // トグルボタンの表示・非表示をまず決める（デフォルト: 表示）
      if (rf_get_globals('window_state') === 'PC' && target.scrollHeight < maxHeightPC) {
        toggle.classList.add('--is-hide')
      } else if (rf_get_globals('window_state') === 'SP' && target.scrollHeight < maxHeightSP) {
        toggle.classList.add('--is-hide')
      }

      // クリックコントロール
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
  })

}

export { rf_room_list_link, rf_room_list_toggle }