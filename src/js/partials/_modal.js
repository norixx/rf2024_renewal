class RfModals {
  #modalOpenHtmlClass = '--is-modal-open'
  #modalOpenClass = '--is-open'
  #html = document.documentElement
  #modals
  #modalOpenBtns
  #modalAjaxOpenBtns
  #modalTargetName = 'jsModalTarget'
  #openedModals = []
  #events = {}

  /**
   * Initializes a new instance of the RfModals class.
   *
   * @param {Object|null} modals - Optional array of modal elements to be added dynamically.
   * @example {modal: data-js-modal-target(モーダル本体), modalOpenBtn: data-js-modal(モーダル開くボタン)}
   * @return {void}
   */
  constructor(modals = null) {
    // このオブジェクトが初期化されていない場合に、ダイナミックに追加されるモーダル要素を追加するのであれば追加。
    if(modals) {
      this.modal(modals)
      return
    }

    this.#modals = Array.from(document.querySelectorAll('[data-js-modal-target]'))
    this.#modalOpenBtns = Array.from(document.querySelectorAll('[data-js-modal]'))
    this.#modalAjaxOpenBtns = Array.from(document.querySelectorAll('[data-js-ajax-modal]'))

    this.#setModalOpenBtns()
    this.#setModals()
  }

  // ===

  // イベント登録
  on(eventName, callback) {
    if(!this.#events[eventName]) {
      this.#events[eventName] = []
    }
    this.#events[eventName].push(callback)
  }

  // イベント発動
  // dataは発動させる時に渡すデータ。最終的にコールバック関数で受け取るためのもので、データ形式は自由
  async #emit(eventName, data = null) {
    if(this.#events[eventName]) {
      const promises = this.#events[eventName].map(callback => {
        return Promise.resolve(callback(data))
      })

      return Promise.all(promises)
    }
  }


  // ===

  // モーダルを開く
  openModal(modalId) {
    const targetModal = document.querySelector(modalId)
    console.dir(targetModal)

    targetModal.classList.add(this.#modalOpenClass) //モーダルターゲット(本体)にopenクラスを追加
    this.#html.classList.add(this.#modalOpenHtmlClass) //htmlタグにopenクラスを追加
    this.#openedModals.push(modalId) //モーダル開くリストに追加
    console.log('opened modals', this.#openedModals)
  }

  // 開くボタンにクリックイベントを設定
  #setModalOpenBtnEvent(btns) {
    // check if btns is element or nodelist
    const btnSet = btns instanceof Element ? [btns] : Array.from(btns)
    btnSet.forEach(btn => {
      const modalId = btn.dataset.jsModal
      btn.addEventListener('click', e => {
        if (btn.tagName === 'A' || btn.tagName === 'BUTTON') {
          e.preventDefault()
        }

        this.openModal(modalId)
      })
    })
  }

  // 開くボタンの設定
  #setModalOpenBtns() {
    this.#modalOpenBtns.forEach(btn => {
      this.#setModalOpenBtnEvent(btn)
    })
  }

  // ===

  /**
   * モーダルを閉じる
   * 
   * @param object modal モーダル要素オブジェクト
   */
  async closeModal(modal) {
    // beforeCloseイベント発動
    // modalはモーダル要素オブジェクト
    await this.#emit('beforeClose', modal)

    // console.log('モーダル閉じる, openedModalsは?', openedModals)
    // console.log(modal.id)
    // console.log(modal instanceof Element)
    const index = this.#openedModals.indexOf(modal);
    this.#openedModals.splice(index, 1);
    // console.log('モーダル閉じたあと, openedModalsは?', openedModals)
    console.log('閉じる対象のモーダル: ', modal)
    modal.classList.remove(this.#modalOpenClass)

    // モーダルが多重に開いている場合、すべてのモーダルが閉じていることをチェックしてHTMLからもクラスを削除する
    if (this.#openedModals.length === 0) {
      this.#html.classList.remove(this.#modalOpenHtmlClass)
    }

    console.log('closing...opened modals', this.#openedModals)
  }

  // ===

  // モーダルを閉じるイベント設定
  #setModalCloseEvent(modal) {
    // モーダル本体クリックで閉じる
    // (モーダルの何もないところをクリックしたとき閉じる)
    modal.addEventListener('click', e => {
      console.log('モーダル本体クリック',this.#modalTargetName, e.target.dataset)
      if (this.#modalTargetName in e.target.dataset) {
        console.log('モーダルターゲット(本体)クリックで閉じる', modal)
        this.closeModal(modal)
      }
    })

    // モーダル閉じるボタンの設定
    // (モーダル本体からモーダル閉じるボタンを探して設定する)
    const modalCloses = modal.querySelectorAll('[data-js-modal-close]')
    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        console.log('モーダル閉じるボタンクリック', modal)
        this.closeModal(modal)
      })
    })
  }

  // モーダル設定(コンストラクタからのみ呼び出し)
  #setModals() {
    this.#modals.forEach(modal => {
      this.#setModalCloseEvent(modal)
    })
  }

  // ====================================
  //インスタンス化している場合のメソッド
  
  // モーダル開くボタンのイベント設定
  setModalOpenBtn(modalBtn) {
    this.#setModalOpenBtnEvent(modalBtn)
  }

  // モーダル本体のイベント設定
  setModal(modal){
    this.#setModalCloseEvent(modal)
  }

  // モーダル開くボタンとモーダル本体の設定
  modal(modalObj) {
    if('modalOpenBtn' in modalObj) {
      console.log('モーダル開くボタンセット')
      this.setModalOpenBtn(modalObj.modalOpenBtn)
    }
    if('modal' in modalObj) {
      console.log('モーダルセット')
      this.setModal(modalObj.modal)
    }
  }

}

export default RfModals