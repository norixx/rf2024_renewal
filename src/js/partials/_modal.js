class RfModals {
  #modalOpenHtmlClass = '--is-modal-open'
  #modalOpenClass = '--is-open'
  #html = document.documentElement
  #modals
  #modalOpenBtns
  #modalAjaxOpenBtns
  #modalTargetName = 'jsModalTarget'
  #openedModals = []

  constructor() {
    this.#modals = document.querySelectorAll('[data-js-modal-target]')
    this.#modalOpenBtns = document.querySelectorAll('[data-js-modal]')
    this.#modalAjaxOpenBtns = document.querySelectorAll('[data-js-ajax-modal]')
    this.#setOpenModalBtns()
    this.#setModals()
  }

  // 開くボタンの設定
  #setOpenModalBtns() {
    this.#modalOpenBtns.forEach(btn => {
      const modalId = btn.dataset.jsModal

      btn.addEventListener('click', (e) => {
        if (btn.tagName === 'A' || btn.tagName === 'BUTTON') {
          e.preventDefault()
        }
        this.openModal(modalId)
      })
    })
  }

  // モーダルを開く
  openModal(modalId) {
    const targetModal = document.querySelector(modalId)
    targetModal.classList.add(this.#modalOpenClass)
    this.#html.classList.add(this.#modalOpenHtmlClass)
    this.#openedModals.push(modalId)
    console.log('opened modals', this.#openedModals)
  }

  // モーダルを閉じる
  #closeModal(modal) {
    // console.log('モーダル閉じる, openedModalsは?', openedModals)
    console.log(modal.id)
    console.log(modal instanceof Element)
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

  // モーダル設定
  #setModals() {
    this.#modals.forEach(modal => {
      // モーダル本体閉じる
      modal.addEventListener('click', e => {
        if (this.#modalTargetName in e.target.dataset) {
          console.log('モーダルターゲット')
          this.#closeModal(modal)
        }
      })

      // モーダル閉じるボタン
      const modalCloses = modal.querySelectorAll('[data-js-modal-close]')
      modalCloses.forEach(close => {
        close.addEventListener('click', () => {
          this.#closeModal(modal)
        })
      })
    })
  }

}

export default RfModals