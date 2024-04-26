import { rf_get_globals } from './_global-setting'

const rf_gnav = () => {
  let _isOpen = false //グローバルナビゲーションの開閉状態
  let _isOpenSub = false // PC用 - のLv2のナビゲーションの開閉状態
  let _current = null // 現在開いているLv1のID
  let _currentSub = null // PC用 - 現在開いているLv2のID
  const gnavID = 'gnav-main'
  const openClass = '--is-open'
  const lv1Flag = 'jsGnavLv1' // Lv1のナビゲーションのフラグ(dataset名)
  // const gnavBtnPC = document.querySelectorAll('[data-js-gnav-pc]')
  const gnav = document.querySelector(`#${gnavID}`) //グローバルナビゲーション本体
  const gnavBtn = document.querySelector('#gnav-btn-open')
  const gnavBtnClose = document.querySelector('[data-js-gnav-close]')
  const gnavSubContainer = document.querySelector('#gnav-sub-container')
  const gnavBtnSubContClose = document.querySelector('[data-js-gnav-sub-container-close]')
  const gnavToggles = document.querySelectorAll('[data-js-gnav-sub]')
  const gnavToggleTargets = Array.from(gnavToggles).map(toggle => document.querySelector(toggle.dataset.jsGnavSub))
  const gnavClose = document.querySelectorAll(['[data-js-gnav-sub-close]'])

  // Gnavを閉じる + すべてを閉じる
  const _hideGnav = () => {
    _isOpen = false
    gnav.classList.remove(openClass)

    // PC サブコンテナを閉じる
    _isOpenSub = false
    _current = null
    _currentSub = null
    gnavSubContainer.classList.remove(openClass)


    // openClassを全て削除
    gnavToggles.forEach(target => {
      target.classList.remove(openClass)
    })
    gnavToggleTargets.forEach(target => {
      target.classList.remove(openClass)
    })

  }

  // Gnavを開く
  const _showGnav = () => {
    _isOpen = true
    gnav.classList.add(openClass)
  }

  // SP - Gnav(自体)をタップしたら閉じる
  gnav.addEventListener('click', e => {
    const target = e.target
    // console.log(target.id)
    if (target.id !== gnavID) return
    _hideGnav()
  })

  // SP - Gnavを閉じるボタン
  gnavBtnClose.addEventListener('click', e => {
    _hideGnav()
  })

  // SP - Gnav🍔
  gnavBtn.addEventListener('click', e => {
    if (_isOpen && gnav.classList.contains(openClass)) {
      _hideGnav()
    } else {
      _showGnav()
    }
  })

  // Gnav Toggles
  gnavToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      console.log('クリック前のLv2: ', _currentSub)
      const targetID = toggle.dataset.jsGnavSub

      // PC - Lv1部分をクリックした場合
      if (lv1Flag in toggle.dataset && rf_get_globals('window_state') === 'PC') {
        console.log('PC Lv1 クリック: ', targetID)

        // ▼ サブコンテナ制御
        // 1. 開いている + 同じ => 閉じる
        if (_isOpenSub && _currentSub === targetID) {
          console.log('PC サブコンテナ閉じる')
          _hideGnav()

          return //処理は中止
        }
        // 2. 開いている + 違う => 切り替える（開く）
        if (_isOpenSub && _currentSub !== targetID) {
          console.log('PC サブコンテナ切り替え')

          // 1つ前のサブコンテナ
          document.querySelector(_currentSub).classList.remove(openClass)
        }

        // 3. 開いていない => 開く
        if (_isOpenSub === false) {
          _showGnav() // Gnavを開く(SP用だけど一応実行)
          gnavSubContainer.classList.add(openClass) //サブコンテナを開く
          _isOpenSub = true
        }
      }

      _currentSub = targetID

      console.log('クリック後のLv2: ', _currentSub)
      console.log(_isOpenSub)

      // SP - Lv1部分をクリックした場合でも一応サブコンテナを開く
      if (
        lv1Flag in toggle.dataset &&
        _isOpenSub !== true &&
        rf_get_globals('window_state') === 'SP'
      ) {
        gnavSubContainer.classList.add(openClass) //サブコンテナを開く
        _isOpenSub = true
      }

      // PC & SP - ターゲットのopenClassをトグル
      document.querySelector(targetID).classList.add(openClass)

      // PC & SP - Lv1を更新
      if (lv1Flag in toggle.dataset) {
        // 1つ前のLv1リンクからopenClassを削除し、新しいものへ追加
        const _prev = document.querySelector(`[data-js-gnav-lv1=${_current}]`)
        console.log('1つ前のLv1', _prev)
        if (_prev) {
          _prev.classList.remove(openClass)
        }

        _current = toggle.dataset[lv1Flag]
        console.log('保存したLv1', _current)
        toggle.classList.add(openClass)
      }
    })
  })

  // PC - サブコンテナを閉じる
  gnavBtnSubContClose.addEventListener('click', () => {
    _hideGnav()
  })

  // SP - サブナビゲーションを閉じる
  gnavClose.forEach(close => {
    close.addEventListener('click', () => {
      const target = document.querySelector(close.dataset.jsGnavSubClose)
      if (target.classList.contains(openClass)) target.classList.remove(openClass)
    })
  })


}

export default rf_gnav