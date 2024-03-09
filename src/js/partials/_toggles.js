// Toggle 共通
import { rf_get_globals, rf_set_globals } from './_globals'

const rf_toggles = () => {
  const toggles = document.querySelectorAll('[data-js-toggle]')
  const toggleSPClass = 'toggle-sp-only'
  const togglePCClass = 'toggle-pc-only'
  const toggleClass = '--is-open'

  console.dir(toggles)
  toggles.forEach(toggle => {
    const target = document.querySelector(toggle.dataset.jsToggle)
    // 初動
    if (toggle.classList.contains(toggleClass) && !target.classList.contains(toggleClass)) {
      target.classList.add(toggleClass)
    }

    // レスポンシブチェック
    toggle.addEventListener('click', e => {
      const self = e.target

      if (self.classList.contains(toggleSPClass) && rf_get_globals('window_state') !== 'SP') {
        return
      }
      if (self.classList.contains(togglePCClass) && rf_get_globals('window_state') !== 'PC') {
        return
      }
      self.classList.toggle(toggleClass)
      // const target = document.querySelector(toggle.dataset.toggle)
      target.classList.toggle(toggleClass)
    })
  })
}

export default rf_toggles