// 検索方法・選び方の変更のtippy展開
const rf_search_change_method = () => {
  const btn = document.querySelector('[data-js-search-change-method]')
  let tippyInstance
  const tippyFunc = (ref) => {
    const id = ref.dataset.jsSearchMethod
    const el = document.querySelector(id)
    return document.querySelector(id)
  }

  const tippySettingCommon = {
    content: tippyFunc,
    animation: 'shift-away',
    interactive: true,
    interactiveBorder: 10,
    trigger: 'click',
    delay: [null, 300],
    arrow: tippy.roundArrow,
    theme: 'rf',
  }
  const tippySettingSP = {
    placement: 'bottom',
  }
  const tippySettingPC = {
    placement: 'right',
  }

  // メディアクエリのブレイクポイントでtippyの設定を変更する
  const change_tippy_setting = event => {
    console.log('media event', event)
    const is_matched = event.matches || event.currentTarget.matches
    console.log('is_matched: ', is_matched)
    let tippySetting
    if (is_matched) {
      console.log('tippy PC')
      tippySetting = {
        // ...tippySettingCommon,
        ...tippySettingPC
      }
    } else {
      console.log('tippy SP')
      tippySetting = {
        // ...tippySettingCommon,
        ...tippySettingSP
      }
    }
    tippyInstance.setProps(tippySetting)
  }

  const set_tippy = () => {
    console.log('tippy init')
    let tippySetting
    if (RF_GLOBALS.RF_CONFIG['window_state'] === 'PC') {
      tippySetting = {
        ...tippySettingCommon,
        ...tippySettingPC
      }
    } else if (RF_GLOBALS.RF_CONFIG['window_state'] === 'SP') {
      tippySetting = {
        ...tippySettingCommon,
        ...tippySettingSP
      }
    }

    console.log('tippy setting: ', tippySetting)
    tippyInstance = tippy(btn, tippySetting)
  }

  const init = () => {
    set_tippy()
    new RF_GLOBALS.RfMediaQuery(change_tippy_setting, 'change')
  }

  init()
}

export default rf_search_change_method