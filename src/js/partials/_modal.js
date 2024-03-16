const rf_modals = () => {

  const modals = document.querySelectorAll('.c-modal')
  const modalOpenBtns = document.querySelectorAll('[data-js-modal]')
  const modalCloseBtns = document.querySelectorAll('[data-js-modal-close]')

  // 開くボタン
  modalOpenBtns.forEach(btn => {
    const modalId = btn.dataset.jsModal
    const targetModal = document.querySelector(modalId)

    btn.addEventListener('click', () => {
      console.log('モーダルオープン')
      targetModal.classList.add('--is-open')
    })
  })

  // モーダル制御
  modals.forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target.classList.contains('c-modal')) {
        modal.classList.remove('--is-open')
      }
    })
  })

  // 閉じるボタン
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetModal = btn.closest('.c-modal')
      targetModal.classList.remove('--is-open')
    })
  })
}

export default rf_modals