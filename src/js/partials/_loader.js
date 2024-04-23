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

  #insertLoader(loader) {
    this.#settings.target.insertAdjacentHTML('beforeend', loader)
    this.#settings.loader = this.#settings.target.querySelector('.' + this.#settings.loaderClass) //ローダー要素を保管
    console.log(this.#settings.loader)
  }

  removeLoader() {
    // console.log('ローダーを削除')
    this.#settings.loader.remove()
  }

  #makeLoader() {
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