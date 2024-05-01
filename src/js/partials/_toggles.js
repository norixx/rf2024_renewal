// Toggle 共通
import { rf_get_globals } from './_global-setting'

const rf_toggles = () => {
  const toggles = document.querySelectorAll('[data-js-toggle]')
  const toggleSPClass = 'toggle-sp-only'
  const togglePCClass = 'toggle-pc-only'
  const toggleClass = '--is-open'

  const setToggleControl = () => {
    toggles.forEach(toggle => {
      const target = document.querySelector(toggle.dataset.jsToggle)
      let toggle_text
      // テキスト変更がある場合
      if (toggle.hasAttribute('data-js-toggle-text')) {
        toggle_text = toggle.dataset.jsToggleText
      }

      // 初動 - トグルボタンに--is-openがついていればターゲットにも追加
      if (toggle.classList.contains(toggleClass) && !target.classList.contains(toggleClass)) {
        target.classList.add(toggleClass)
        toggle.setAttribute('data-js-toggle-text', toggle.textContent)
        toggle.textContent = toggle_text
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

        // トグルボタンのテキスト切り替え、クラス切り替え
        if (toggle.hasAttribute('data-js-toggle-text')) {
          toggle_text = toggle.getAttribute('data-js-toggle-text')
          console.log(toggle_text)
          toggle.setAttribute('data-js-toggle-text', toggle.textContent)
          toggle.textContent = toggle_text
        }
        toggle.classList.toggle(toggleClass)
        toggle.setAttribute('aria-expanded', toggle.classList.contains(toggleClass))

        // ターゲットのクラス切り替え
        target.classList.toggle(toggleClass)
        target.setAttribute('aria-hidden', !toggle.classList.contains(toggleClass))
      })
    })
  }

  const init = () => {
    setToggleControl()
  }

  init()

}

export default rf_toggles