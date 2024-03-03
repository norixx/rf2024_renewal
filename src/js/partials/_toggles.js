import { rf_get_globals, rf_set_globals } from './_globals'

const rf_toggles = () => {
  const toggles = document.querySelectorAll('[data-toggle]')
  const toggleClass = '--is-open'
  toggles.forEach(toggle => {
    const target = document.querySelector(toggle.dataset.toggle)
    // 初動
    if (toggle.classList.contains(toggleClass) && !target.classList.contains(toggleClass)) {
      target.classList.add(toggleClass)
    }

    // レスポンシブチェック
    toggle.addEventListener('click', e => {
      const self = e.target
      if (self.classList.contains('toggle-sp-only') && !rf_get_globals('window_state') === 'SP') {
        return
      }
      const target = document.querySelector(toggle.dataset.toggle)
      target.classList.toggle(toggleClass)
    })
  })
}

export default rf_toggles