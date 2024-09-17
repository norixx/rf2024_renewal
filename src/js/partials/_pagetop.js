// ページトップへ戻る
const pagetop = () => {

  const pagetop = document.querySelector('[data-js-pagetop]')
  const fps = 10
  const threshold = 500
  let prevRenderTime

  // クリックイベント
  pagetop.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  })

  // 表示非表示
  const toggleVisibility = (timestamp) => {
    if (!prevRenderTime) {
      prevRenderTime = timestamp - 1000/fps
    }
    if (timestamp >= prevRenderTime + 1000/fps) {
      pagetop.classList.toggle('--is-show', window.scrollY >= threshold)
      prevRenderTime = timestamp
    }
    
    requestAnimationFrame(toggleVisibility)
  }

  const init = () => {
    requestAnimationFrame(toggleVisibility)  
  }
  
  init()

}

export default pagetop