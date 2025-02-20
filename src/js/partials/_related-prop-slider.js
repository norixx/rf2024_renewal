// 関連物件スライダー
const rf_related_prop_slider = () => {
  const relatedPropSliders = document.querySelectorAll('[data-js-related-prop-slider]')
  const sliders = []
  const args = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".c-prop-slider__pagination",
      type: "progressbar",
    },
    init: false, //あとで発動
    breakpoints: {
      0: {
        spaceBetween: 16,
        slidesPerView: 1.4,
        slidesOffsetBefore: 32,
        slidesOffsetAfter: 32,
      },
      768: {
        spaceBetween: 24,
        slidesPerView: 3.5,
        slidesOffsetBefore: 40,
        slidesOffsetAfter: 40,
      },
    },
  }

  // Swiper設定
  const setSwiper = () => {
    relatedPropSliders.forEach(slider => {
      const relatedPropSlider = new Swiper(slider, args)
      console.dir(relatedPropSlider)
      sliders.push(relatedPropSlider)
    })
    onLoaded()
  }

  // ロード完了アクション
  const onLoaded = () => {
    sliders.forEach(slider => {
      slider.on('init', () => {
        //ローダーを削除
        const loader = slider.el.querySelector('.c-prop-slider__loader')
        if (loader) {
          loader.remove()
        }
      })
      slider.init()
    })
  }

  const init = () => {
    setSwiper()
  }

  init()
}

export default rf_related_prop_slider