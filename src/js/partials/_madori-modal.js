// 部屋一覧のサムネイルをクリックしたときにモーダルを開く
// 対象: 検索結果 > 建物一覧、部屋一覧ページなど
import EventListenerTracker from './_event-listener-tracker'

const rf_madori_modal = () => {
  let modal = null //モーダル本体（初回クリック時に作成）
  let modalMadoriContainer = null //間取り画像をいれる場所
  const madori_images = document.querySelectorAll('[data-js-madori-modal]')

  // モーダルインスタンスが存在するかどうかをチェックし、なければインスタンス化する 
  if(!RF_GLOBALS.hasOwnProperty('rf_modals')) {
    console.log('rf_modals not exists')
    RF_GLOBALS.rf_modals = new RF_GLOBALS.RfModals()
  } else {
    console.log('rf_modalsはすでに存在しています')
  }


  // モーダル要素作成とモーダル本体の設定
  const createModal = () => {
    const modalHtml = `
      <div class="c-buildroom-modal --madori-modal c-modal" id="madori-modal" data-js-modal-target>
        <button type="button" data-js-buildroom-modal-close data-js-modal-close class="c-buildroom-modal__close"><span class="u-visually-hidden">閉じる</span></button>
        <div class="c-buildroom-modal__container" id="madori-container"></div>
      </div>
    `
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    // モーダル設定（閉じる制御を追加）
    modal = document.querySelector('#madori-modal')
    modalMadoriContainer = modal.querySelector('#madori-container')
    RF_GLOBALS.rf_modals.on('beforeClose', modal => {
      modal.querySelector('#madori-container').innerHTML = ''
    })
    RF_GLOBALS.rf_modals.modal({
      modal,
    })
  }


  // クリックイベント(モーダル作成、間取り画像をモーダルに挿入、モーダル開く)設置
  if(madori_images.length > 0) {
    // const eventTracker = new EventListenerTracker()
    madori_images.forEach((image) => {
      image.addEventListener('click', () => {
        // e.preventDefault()
        // モーダルが有無をチェックして、無ければ作成
        if(!document.querySelector('.c-buildroom-modal')) {
          console.log('間取りモーダルが無いので作成します')
          createModal()
        }
        // 間取り画像をコピーしてモーダルに挿入
        const imgClone = image.cloneNode(true)
        modalMadoriContainer.insertAdjacentElement('beforeend', imgClone)

        // モーダルを開く
        const modalId = image.dataset.jsMadoriModal
        RF_GLOBALS.rf_modals.openModal(modalId)
        
      })
    })
  }

}

export default rf_madori_modal