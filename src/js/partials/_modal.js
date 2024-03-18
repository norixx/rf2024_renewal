const rf_modals = () => {
  const modalOpenHtmlClass = '--is-modal-open'
  const modalOpenClass = '--is-open'
  const html = document.documentElement
  // const modalClass = 'c-modal'
  // const modals = document.querySelectorAll('.' + modalClass)
  const modals = document.querySelectorAll('[data-js-modal-target]')
  const modalOpenBtns = document.querySelectorAll('[data-js-modal]')
  const modalTargetName = 'jsModalTarget'
  // const modalCloseBtns = document.querySelectorAll('[data-js-modal-close]')
  let openedModals = []

  // 開くボタン
  modalOpenBtns.forEach(btn => {
    const modalId = btn.dataset.jsModal
    const targetModal = document.querySelector(modalId)

    btn.addEventListener('click', () => {
      targetModal.classList.add(modalOpenClass)
      html.classList.add(modalOpenHtmlClass)
      openedModals.push(modalId)
      // console.log('openedModalsは?', openedModals)
    })
  })

  // モーダル閉じるアクション
  const _closeModal = (modal) => {
    // console.log('モーダル閉じる, openedModalsは?', openedModals)
    console.log(modal.id)
    const index = openedModals.indexOf(modal);
    openedModals.splice(index, 1);
    // console.log('モーダル閉じたあと, openedModalsは?', openedModals)
    modal.classList.remove(modalOpenClass)
    if (openedModals.length === 0) {
      html.classList.remove(modalOpenHtmlClass)
    }
  }

  // モーダル制御
  modals.forEach(modal => {
    // モーダル本体閉じる
    modal.addEventListener('click', e => {
      if (modalTargetName in e.target.dataset) {
        console.log('モーダルターゲット')
        _closeModal(modal)
      }
    })

    // モーダル閉じるボタン
    const modalCloses = modal.querySelectorAll('[data-js-modal-close]')
    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        _closeModal(modal)
      })
    })

  })

}

export default rf_modals