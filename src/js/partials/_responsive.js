import { rf_get_globals, rf_set_globals } from './_global-setting'

const rf_responsive_check = () => {
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      let current_state = rf_get_globals('window_state')

      if (window.innerWidth < rf_get_globals('breakpoint') && current_state === 'PC') {
        rf_set_globals({
          window_state: 'SP',
        })
        console.log('set to SP')
      } else if (window.innerWidth >= rf_get_globals('breakpoint') && current_state === 'SP') {
        rf_set_globals({
          window_state: 'PC',
        })
        console.log('set to PC')
      }
    })

  })

  // 初動
  window.dispatchEvent(new Event('resize'))
}

export default rf_responsive_check