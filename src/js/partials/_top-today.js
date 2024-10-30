const rf_todays_count = () => {
  // TODO: 英語版対応
  const fetchURL = '/rf/today/'
  const target = document.querySelector('[data-js-today-target]')
  // const elementClass = '.c-top-search__prop-status-list'
  const dataID = '#todays-data'
  const targetElements = target.querySelectorAll('[data-js-today]')
  // TODO: 英語版対応
  const errorMsg = '件数取得エラーが発生しました'
  // const loader = target.querySelector('[data-js-loader]')

  const errorHandler = err => {
    console.error(err)
    target.insertAdjacentHTML('beforeend', `<p class="u-color-alert u-fz-14 u-ta-center">${errorMsg}</p>`)
  }

  const insertContent = html => {
    const domParser = new DOMParser()
    const htmlElement = domParser.parseFromString(html, "text/html")
    // console.log(htmlElement)
    // const contents = htmlElement.querySelectorAll(elementClass)
    const data = JSON.parse(htmlElement.querySelector(dataID).textContent)
    console.log(data)
    // loader.remove()
    targetElements.forEach(element => {
      console.log(element)
      element.textContent = data[element.dataset.jsToday]
    })
    // contents.forEach(content => {
    //   target.insertAdjacentElement('beforeend', content)
    // })
  }

  // IDEA: https://stackoverflow.com/a/50812705
  const fetchContent = async () => {
    try {
      const response = await fetch(fetchURL)
      if (response.ok && response.status !== 404) {
        const html = await response.text()
        // console.log(html)
        insertContent(html)
      } else {
        throw new Error('fetch error')
      }

    } catch (err) {
      errorHandler(err)
    }
  }
  const init = async () => {
    fetchContent()
  }

  init()
}

export default rf_todays_count