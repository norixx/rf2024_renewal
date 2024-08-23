class RfModals {
  #modalOpenHtmlClass = '--is-modal-open'
  #modalOpenClass = '--is-open'
  #html = document.documentElement
  #modals
  #modalOpenBtns
  #modalAjaxOpenBtns
  #modalTargetName = 'jsModalTarget'
  #openedModals = []

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

  // モーダルを開く
  openModal(modalId) {
    const targetModal = document.querySelector(modalId)
    console.dir(targetModal)
    targetModal.classList.add(this.#modalOpenClass) //モーダル本体にクラスを追加
    this.#html.classList.add(this.#modalOpenHtmlClass) //htmlタグにクラスを追加
    this.#openedModals.push(modalId) //モーダル開くリストに追加
    console.log('opened modals', this.#openedModals)
  }

  // 開くボタンにクリックイベントを設定
  #setModalOpenBtnEvent(btn) {
    const modalId = btn.dataset.jsModal
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' || btn.tagName === 'BUTTON') {
        e.preventDefault()
      }
      
      this.openModal(modalId)
    })
  }

  // 開くボタンの設定
  #setModalOpenBtns() {
    this.#modalOpenBtns.forEach(btn => {
      this.#setModalOpenBtnEvent(btn)
    })
  }

  // ===

  // モーダルを閉じる
  #closeModal(modal) {
    // console.log('モーダル閉じる, openedModalsは?', openedModals)
    // console.log(modal.id)
    // console.log(modal instanceof Element)
    const index = this.#openedModals.indexOf(modal);
    this.#openedModals.splice(index, 1);
    // console.log('モーダル閉じたあと, openedModalsは?', openedModals)
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
    // モーダル本体閉じる(モーダルのなにもないところをクリックしたとき閉じる)
    modal.addEventListener('click', e => {
      if (this.#modalTargetName in e.target.dataset) {
        console.log('モーダルターゲット')
        this.#closeModal(modal)
      }
    })

    // モーダル閉じるボタンの設定(モーダル本体からモーダル閉じるボタンを探して設定する)
    const modalCloses = modal.querySelectorAll('[data-js-modal-close]')
    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        console.log('モーダル閉じるボタンクリック')
        this.#closeModal(modal)
      })
    })
  }

  // モーダル設定(コンストラクタから呼び出し)
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
    console.log('モーダル作成呼び出し')
    this.setModalOpenBtn(modalObj.modalOpenBtn)
    this.setModal(modalObj.modal)
  }

}

export default RfModals