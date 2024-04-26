class RfMediaQuery {
  #cb
  #event
  #minWidth = 768
  #query = matchMedia(`(min-width: ${this.#minWidth}px)`);

  constructor(cb, event, minWidth = this.#minWidth) {
    this.#cb = cb
    this.#event = event
    this.#minWidth = minWidth
    this.#query = matchMedia(`(min-width: ${minWidth}px)`)
    this.#attachListener()
  }

  #attachListener() {
    console.log('media query function: ', this.#cb)
    this.#query.addEventListener(this.#event, this.#cb)
    this.#query.dispatchEvent(new Event(this.#event)) //初回限定
  }
}

export default RfMediaQuery