// フェイクAJAX通信whatever..
const rf_wait = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('wait')
    }, 2000)
  })
}

// モーダル処理
const rf_test = () => {

  // モーダルを開くボタン取得
  const modalOpenBtn = document.querySelector('#ajax-modal-test')

  // モーダルを開く処理
  modalOpenBtn.addEventListener('click', async (e) => {    
    e.preventDefault()

    // ロード中はクリック無効化
    if(e.target.classList.contains('--is-loading')) return

    // ボタンをロード中にdisabled
    e.target.classList.add('--is-loading')

    // ローダーを挿入(画面中央に配置するスタイルを指定)
    const loader = new RF_GLOBALS.RfLoader({
      style: '--bg-black --fixed-center',
    })

    // 2秒待つ(フェイクAJAX通信)
    const res = await rf_wait()
    console.log(res)

    // ローダーを削除
    loader.removeLoader()

    // ボタンからローディングクラスを削除
    e.target.classList.remove('--is-loading')

    // モーダルを開く
    RF_GLOBALS.rf_modals.openModal('#sys-dialog-area')

  })

}

export default rf_test