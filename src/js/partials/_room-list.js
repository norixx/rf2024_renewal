// お部屋リスト
import { rf_get_globals, rf_set_globals } from './_global-setting'


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
        clicked.hasAttribute('data-js-madori-modal') || //間取り画像の場合
        clicked.closest('.swiper-initialized') //動いているswiperは中止対象
      ) {
        console.log('インタラクティブ要素or間取り画像なので中止')
        return
      }

      const target = link.dataset.jsRoomLink
      window.open(target, '_blank')
    })
  })
}


// お部屋リストの開閉制御
const rf_room_list_toggle = () => {
  const openClass = '--is-open'
  let tempText = ''
  const maxHeightPC = 660
  const maxHeightSP = 1200
  const toggles = document.querySelectorAll('[data-js-room-toggle]')


  // トグルボタンのコントロール, 画像の読み込みなどを考慮してwindowロード後
  // 画像は遅延読み込み(loading=lazy)を採用しているので、window.onloadでなくてもOK
  window.addEventListener('load', () => {
    toggles.forEach(toggle => {
      const target = document.querySelector(toggle.dataset.jsRoomToggle)
      const parent = document.querySelector(toggle.dataset.jsRoomParent)

      console.log(target, toggle.dataset.jsRoomParent)

      // トグルボタンの表示・非表示をまず決める（デフォルト: 表示）
      if (rf_get_globals('window_state') === 'PC' && target.scrollHeight < maxHeightPC) {
        toggle.classList.add('--is-hide')
      } else if (rf_get_globals('window_state') === 'SP' && target.scrollHeight < maxHeightSP) {
        toggle.classList.add('--is-hide')
      }

      // クリックコントロール
      toggle.addEventListener('click', () => {

        console.log(target, parent)

        target.classList.toggle(openClass)
        toggle.classList.toggle(openClass)

        const isOpen = target.classList.contains(openClass)

        // 高さを制御
        if (isOpen) {
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

        // 物件のメインまで戻る操作
        if(!isOpen) {
          parent.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  })

}

export { rf_room_list_link, rf_room_list_toggle }