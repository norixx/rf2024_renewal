// Toggle 共通
import { rf_get_globals } from './_global-setting'

// TODO: AJAXロードされるtoggleもあるので対策する
const rf_toggles = () => {
  const toggles = document.querySelectorAll('[data-js-toggle]')
  const toggleSelector = 'data-js-toggle'
  const toggleTextSelector = 'data-js-toggle-text'
  const html = document.documentElement
  const toggleSPClass = 'toggle-sp-only'
  const togglePCClass = 'toggle-pc-only'
  const toggleClass = '--is-open'
  // let mutationControl
  // const mutationConfig = {
  //   childList: true, //対象ノードの子ノードに対する追加・削除の監視を有効に
  //   subtree: true, //対象ノードとその子孫ノードに対する変更の監視を有効に
  //   // attributes: true, //対象ノードの属性に対する変更の監視を有効に
  //   // characterData: true, //対象ノードのテキストデータの変更の監視を有効に
  // };

  // テキスト変更のあるトグルの設定
  const setToggleTextAndClass = toggle => {
    const toggleTarget = document.querySelector(toggle.dataset.jsToggle)

    //トグルボタンに--is-openがついていればターゲットにも追加
    if (toggle.classList.contains(toggleClass) && !toggleTarget.classList.contains(toggleClass)) {
      toggleTarget.classList.add(toggleClass)
      toggle.setAttribute(toggleTextSelector, toggle.textContent)
      toggle.textContent = toggle_text
    }

    // テキスト変更がある場合
    if (!toggle.hasAttribute(toggleTextSelector)) return
    let toggle_text
    toggle_text = toggle.dataset.jsToggleText
  }

  // ミューテーションオブザーバー
  // const setToggleText = () => {
  //   window.addEventListener('load', () => {
  //     mutationControl = new MutationObserver(mutations => {
  //       mutations.forEach(mutation => {
  //         mutation.addedNodes.forEach(node => {
  //           // 要素はnodeType = 1 https://mzl.la/3yeUhju
  //           if (node.nodeType !== Node.ELEMENT_NODE) return
  //           let toggles = []
  //           if (node.hasAttribute(toggleSelector)) {
  //             toggles.push(node)
  //           }
  //           if (node.querySelector(toggleSelector)) {
  //             toggles.push(Array.from(node.querySelectorAll(toggleSelector)))
  //           }

  //           if (!toggles) return

  //           console.log(toggles)

  //           toggles.forEach(toggle => {
  //             if (!toggle.hasAttribute(toggleTextSelector)) return
  //             setToggleTextAndClass(toggle)
  //           })

  //         })
  //       })
  //     })

  //     mutationControl.observe(document.documentElement, mutationConfig)
  //   })
  // }

  // トグルボタンとターゲットのクラス、属性の変更
  const toggleAttrAndText = toggle => {
    //ターゲットの取得
    const toggleTarget = document.querySelector(toggle.dataset.jsToggle)

    // トグルとターゲットのクラス,ARIA属性の切り替え
    toggle.classList.toggle(toggleClass)
    toggle.setAttribute('aria-expanded', toggle.classList.contains(toggleClass))
    if (toggleTarget) {
      toggleTarget.classList.toggle(toggleClass)
      toggleTarget.setAttribute('aria-hidden', !toggle.classList.contains(toggleClass))
    }

    // トグルボタンのテキスト切り替えあれば変更）
    if (!toggle.hasAttribute(toggleTextSelector)) return
    let toggle_text = toggle.getAttribute(toggleTextSelector)
    toggle.setAttribute(toggleTextSelector, toggle.textContent)
    toggle.textContent = toggle_text
  }

  // トグルボタンの初期化
  const initToggleControl = () => {
    // AJAX追加されるボタンもあるので、ボタン直接ではなくHTMLクリックに変更
    html.addEventListener('click', e => {
      const target = e.target
      console.dir(target)
      console.log('target: ', target.closest(`[${toggleSelector}]`))
      let toggle
      if (target.hasAttribute(toggleSelector)) {
        toggle = target
      } else if (target.closest(`[${toggleSelector}]`)) {
        toggle = target.closest(`[${toggleSelector}]`)
      } else {
        return
      }
      console.log('toggle: ', toggle)

      // テキスト変更 - 分離済み

      // レスポンシブチェック - SPかPCでトグルを制御
      // SP
      if (toggle.classList.contains(toggleSPClass) && rf_get_globals('window_state') !== 'SP') {
        return
      }
      // PC
      if (toggle.classList.contains(togglePCClass) && rf_get_globals('window_state') !== 'PC') {
        return
      }

      // クラス、属性、テキストの変更
      toggleAttrAndText(toggle)

    })

    // toggles.forEach(toggle => {
    //   const target = document.querySelector(toggle.dataset.jsToggle)
    //   let toggle_text
    //   // テキスト変更がある場合
    //   if (toggle.hasAttribute('data-js-toggle-text')) {
    //     toggle_text = toggle.dataset.jsToggleText
    //   }

    //   // 初動 - トグルボタンに--is-openがついていればターゲットにも追加
    //   if (toggle.classList.contains(toggleClass) && !target.classList.contains(toggleClass)) {
    //     target.classList.add(toggleClass)
    //     toggle.setAttribute('data-js-toggle-text', toggle.textContent)
    //     toggle.textContent = toggle_text
    //   }


    //   // レスポンシブチェック
    //   toggle.addEventListener('click', e => {
    //     // const self = e.target
    //     // SP
    //     if (toggle.classList.contains(toggleSPClass) && rf_get_globals('window_state') !== 'SP') {
    //       return
    //     }
    //     // PC
    //     if (toggle.classList.contains(togglePCClass) && rf_get_globals('window_state') !== 'PC') {
    //       return
    //     }

    //     // トグルボタンのテキスト切り替え、クラス切り替え
    //     if (toggle.hasAttribute('data-js-toggle-text')) {
    //       toggle_text = toggle.getAttribute('data-js-toggle-text')
    //       console.log(toggle_text)
    //       toggle.setAttribute('data-js-toggle-text', toggle.textContent)
    //       toggle.textContent = toggle_text
    //     }
    //     toggle.classList.toggle(toggleClass)
    //     toggle.setAttribute('aria-expanded', toggle.classList.contains(toggleClass))

    //     // ターゲットのクラス,ARIA属性の切り替え
    //     target.classList.toggle(toggleClass)
    //     target.setAttribute('aria-hidden', !toggle.classList.contains(toggleClass))
    //   })
    // })
  }

  const init = () => {
    initToggleControl()
    // テキスト変更
    toggles.forEach(toggle => {
      setToggleTextAndClass(toggle)
    })

    //ミューテーションオブザーバー - AJAXで追加されるコンテンツ対策
    // setToggleText()
  }

  init()

}

export default rf_toggles