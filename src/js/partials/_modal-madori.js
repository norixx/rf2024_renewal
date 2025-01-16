// 部屋一覧のサムネイルをクリックしたときにモーダルを開く
// 対象: 検索結果 > 建物一覧、部屋一覧ページなど
import EventListenerTracker from './_event-listener-tracker'

const rf_modal_madori = () => {
  let modal = null //モーダル本体（初回クリック時に作成）
  let modalMadoriContainer = null //間取り画像をいれる場所
  const madori_images = document.querySelectorAll('[data-js-madori-modal]')
  const modal_id = 'madori-modal'
  const modal_container_id = 'madori-container'

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
      <div class="c-buildroom-modal --madori-modal c-modal" id="${modal_id}" data-js-modal-target>
        <button type="button" data-js-buildroom-modal-close data-js-modal-close class="c-buildroom-modal__close"><span class="u-visually-hidden">閉じる</span></button>
        <div class="c-buildroom-modal__container" id="${modal_container_id}"></div>
      </div>
    `
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    // モーダル設定（閉じる制御を追加）
    modal = document.querySelector('#' + modal_id)
    modalMadoriContainer = modal.querySelector('#' + modal_container_id)
    // 閉じる際にモーダルの中身を空にする
    RF_GLOBALS.rf_modals.on('beforeClose', modal => {
      if(modal.id !== modal_id) return
      console.log('間取りモーダル閉じるイベント')
      modal.querySelector('#'+ modal_container_id).innerHTML = ''
    })
    RF_GLOBALS.rf_modals.modal({
      modal,
    })
  }

  // TODO: 間取り画像の取得・挿入・エラーハンドリング
  const loadMadoriImage = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      
      image.onload = () => {
        resolve(image)
      }
      
      image.onerror = () => {
        console.log('間取り画像の読み込みに失敗しました')
        // Try loading fallback image
        image.src = '/assets/img/common/nophoto.webp'
        resolve(image) // Resolve with fallback image
      }
  
      // 画像をセット
      image.src = imgUrl
    })
  }

  // クリックイベント(モーダル作成、間取り画像をモーダルに挿入、モーダル開く)設置
  if(madori_images.length > 0) {
    // const eventTracker = new EventListenerTracker()
    madori_images.forEach((image) => {
      image.addEventListener('click', async () => {
        // e.preventDefault()
        // const modalId = image.dataset.jsMadoriModal

        // モーダルが有無をチェックして、無ければ作成
        if(!document.querySelector('.c-buildroom-modal.--madori-modal')) {
          console.log('間取りモーダルが無いので作成します')
          createModal()
        }
        // 間取り画像をコピーしてモーダルに挿入
        // const imgClone = image.cloneNode(true)
        // modalMadoriContainer.insertAdjacentElement('beforeend', imgClone)

        // 念の為、開く前にコンテナを空にする
        modalMadoriContainer.innerHTML = ''

        // モーダルを開く(先に開いてからローダーや画像挿入を行う)
        RF_GLOBALS.rf_modals.openModal('#' + modal_id)
        

        // ローダー
        const loader = new RF_GLOBALS.RfLoader({
          target: document.querySelector('#' + modal_container_id),
          size: 'sm'
        })

        // 間取り画像を取得して挿入
        const imgSrc = image.dataset.jsMadoriPhoto
        if(imgSrc) {
          try {
            const loadedImage = await loadMadoriImage(imgSrc)
            loader.removeLoader()
            modalMadoriContainer.innerHTML = '' //連続でモーダル開閉すると画像が重複する場合ので空にする
            modalMadoriContainer.appendChild(loadedImage)
          } catch (error) {
            console.error('画像の読み込みエラー:', error)
            modalMadoriContainer.innerHTML = '' //連続でモーダル開閉すると画像が重複する場合ので空にする
            loader.removeLoader()
          }
        }

      })
    })
  }

}

export default rf_modal_madori