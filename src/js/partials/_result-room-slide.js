// 検索結果 - お部屋リストスライダー
const rf_result_room_slide = () => {
  const room_slides = document.querySelectorAll('[data-js-result-room-slide]')
  const pic_area_selector = '[data-js-result-room-parent]'
  const slide_selector_class = 'swiper'
  const slide_wrapper_class = 'swiper-wrapper'
  const disabled_class = '--is-disabled'
  const flash_msg_class = 'c-result-room__flash-msg'
  // const swipers = null //TODO: swiperのインスタンスを保持
  let click_handlers = {}

  const swiper_arg = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    // spaceBetween: 16,
    // slidesOffsetAfter: 16,
    // slidesOffsetBefore: 16,
  }

  const msgs = {
    no_img: 'これ以上画像はありません',
    fetch_err: 'データ取得エラー',
    // no_data: 'データがありません',
  }


  // フラッシュメッセージ
  const insertFlashMessage = (msg, pic_area) => {
    const msg_html = `<p class="${flash_msg_class}">${msg}</p>`

    // メッセージを表示中は、追加しない
    if (pic_area.querySelector(`.${flash_msg_class}`)) {
      console.log('NO no no congested right now!!!')
      return
    }

    pic_area.insertAdjacentHTML('beforeend', msg_html)
    const msg_inserted = pic_area.querySelector(`.${flash_msg_class}`)
    console.log(msg_inserted)


    // remove
    msg_inserted.addEventListener('transitionend', () => {
      msg_inserted.remove()
    })

    // タイマー
    setTimeout(() => {
      msg_inserted.classList.add('--is-deactive')
    }, 3000)

  }

  // 取得エラー
  const handleError = (err_msg, pic_area) => {
    let msg = ''
    // フラッシュメッセージ表示
    switch (err_msg) {
      case 'no_img': //画像が１枚以下
        msg = msgs.no_img
        pic_area.classList.add('--is-no-slide')
        break
      case 'fetch_err':
        msg = msgs.fetch_err
        break
      default:
        msg = msgs.fetch_err
    }
    insertFlashMessage(msg, pic_area)
  }

  //古いwrapperを削除し空のwrapperを作成(子要素を全削除するため)
  const removeAllChildren = (target_slide, wrapper) => {
    const new_wrapper = wrapper.cloneNode(false)
    // target_slide.insertAdjacentElement('afterbegin', new_node)
    target_slide.replaceChild(new_wrapper, wrapper)
  }

  // Swiperの設定
  const setSwiper = (data, target_slide) => {
    let html = ''
    data.forEach(item => {
      // <img src="${item.filename}" alt="${item.part}" loading="lazy">
      html += `<div class="c-result-room__slide-item swiper-slide">
      <img src="${item.thumbnailUrl}" alt="${item.id}" loading="lazy" title="テスト用JSONデータ">
      </div>`
    })

    const wrapper = target_slide.querySelector(`.${slide_wrapper_class}`)

    removeAllChildren(target_slide, wrapper)

    const new_wrapper = target_slide.querySelector(`.${slide_wrapper_class}`)
    new_wrapper.insertAdjacentHTML('beforeend', html)

    // Swiper起動
    // TODO: スライダーインスタンスを保管してコントロール可能にするかもしれない
    const swiper = new Swiper(target_slide, swiper_arg)
    swiper.slideTo(1) //２枚目のスライドへ移動させる
  }

  // スライドデータの取得
  const getSlideData = async (url) => {
    try {
      const response = await fetch(url)

      // データ取得エラー
      if (!response.ok) {
        throw new Error('fetch_err')
      }

      const data = await response.json()
      console.log(data)
      // データ数が１の場合スライドさせない
      if (data.length > 1) {
        return data
      } else {
        throw new Error('no_img')
      }
    } catch (err) {
      console.dir(err)
      return err.message
    }
  }

  // ボタンクリックアクション
  async function setClickAction(args, event) {
    // console.log(this)
    // console.log('渡されたデータ', args, event)
    const [btn] = args
    const url = btn.dataset.jsResultRoomSlide
    const pic_area = btn.closest(pic_area_selector)

    // ボタン無効化中は操作しない
    if (btn.classList.contains(disabled_class)) return false

    // ローダー作成 - _loader.js
    const loader = new RF_GLOBALS.rfLoader(pic_area)

    // ボタン無効化
    btn.classList.add(disabled_class)

    try {
      const data = await getSlideData(url)
      console.log(data)
      // JSONデータかどうかを確認
      if (typeof data === 'object' && JSON.parse(JSON.stringify(data))) {
        // データ取得成功
        const target_slide = btn.closest(`.${slide_selector_class}`)
        const id = btn.dataset.jsResultRoomId
        btn.removeEventListener('click', click_handlers[id])
        // ハンドラーをオブジェクトから削除（容量節約のため）
        delete click_handlers[id]
        // console.log(click_handlers)
        setSwiper(data, target_slide)
      } else {
        throw new Error(data)
      }
    } catch (err) {
      // なんらかのエラー
      handleError(err.message, pic_area)
    }

    // ボタン有効化
    btn.classList.remove(disabled_class)

    // ローダー削除
    loader.removeLoader()
  }

  const setClickHandler = (btn) => {
    const id = btn.dataset.jsResultRoomId
    // bindを使用した場合、別関数になるのでremoveEventListenerできない。故にbindしたもの保存して使う
    click_handlers[id] = setClickAction.bind(null, [btn])
    console.log(click_handlers)
    btn.addEventListener('click', click_handlers[id])
    btn.click()
    // const clickEvent = new Event('click')
    // btn.dispatchEvent(clickEvent)
  }

  // ボタンクリックイベント設定
  const setSlideAction = () => {
    room_slides.forEach(btn => {
      btn.addEventListener('click', () => {
        setClickHandler(btn)
      }, {
        once: true
      })
    })
  }

  const init = () => {
    setSlideAction()
  }

  init()
}

export default rf_result_room_slide