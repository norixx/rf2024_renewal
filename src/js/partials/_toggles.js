// Toggle 共通
import { rf_get_globals } from './_globals'

const rf_toggles = () => {
  const toggles = document.querySelectorAll('[data-js-toggle]')
  const toggleSPClass = 'toggle-sp-only'
  const togglePCClass = 'toggle-pc-only'
  const toggleClass = '--is-open'

  const setToggleControl = () => {
    toggles.forEach(toggle => {
      const target = document.querySelector(toggle.dataset.jsToggle)
      // 初動 - トグルボタンに--is-openがついていればターゲットにも追加
      if (toggle.classList.contains(toggleClass) && !target.classList.contains(toggleClass)) {
        target.classList.add(toggleClass)
      }

      // レスポンシブチェック
      toggle.addEventListener('click', e => {
        // const self = e.target
        // SP
        if (toggle.classList.contains(toggleSPClass) && rf_get_globals('window_state') !== 'SP') {
          return
        }
        // PC
        if (toggle.classList.contains(togglePCClass) && rf_get_globals('window_state') !== 'PC') {
          return
        }
        toggle.classList.toggle(toggleClass)
        // const target = document.querySelector(toggle.dataset.toggle)
        target.classList.toggle(toggleClass)
      })
    })
  }

  const init = () => {
    setToggleControl()
  }

  init()

}

export default rf_toggles