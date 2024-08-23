// ローダー
/**
 * ローダー
 * @param {string} target - ローダーを挿入するターゲット（指定がなければbody）
 * @param {string} msg - ローダーのメッセージ（キャプション） default: 'Loading...'
 * @param {string} size - ローダーのサイズ（スタイルシートを参照） default: 'md'
 * @param {string} style - ローダーのスタイル（スタイルシートを参照） default: '--bg-black'
 */
class RfLoader {
  #settings = {
    target: document.body,
    msg: 'Loading...',
    size: 'md',
    style: '--bg-black',
    loaderClass: 'c-loader',
    loader: null,
  }
  constructor(target, msg, size, style) {
    if (target) this.#settings.target = target
    if (msg) this.#settings.msg = msg
    if (size) this.#settings.size = size
    if (style) this.#settings.style = style
    console.log(this.#settings)
    this.#init()
  }

  // ローダーを挿入（コンストラクタから呼び出し）
  #insertLoader(loader) {
    console.log('ローダーを挿入')

    if(typeof loader === 'string') {
      this.#settings.target.insertAdjacentHTML('beforeend', loader)
    } else if(typeof loader === 'object') {
      // 2回目以降はこっち
      this.#settings.target.insertAdjacentElement('beforeend', loader)
    }
    if(!this.#settings.loader) {
      this.#settings.loader = this.#settings.target.querySelector('.' + this.#settings.loaderClass) //ローダー要素を保管
    }
  }

  // ローダーを削除（public）
  removeLoader() {
    console.log('ローダーを削除')
    this.#settings.loader.remove()
  }

  // ローダーを再挿入（public）
  reinsertLoader() {
    console.log('ローダーを再挿入')
    this.#insertLoader(this.#settings.loader)
  }

  // ローダーを作成
  #makeLoader() {
    console.log('ローダーを作成')
    let size = ''
    if (this.#settings.size !== 'md') size = `--${this.#settings.size}`
    const loader = `<div class="${this.#settings.loaderClass} ${this.#settings.style} ${size}"></div>`
    this.#insertLoader(loader)
  }

  #init() {
    this.#makeLoader()
  }
}

export default RfLoader