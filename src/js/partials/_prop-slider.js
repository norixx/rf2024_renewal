// 物件スライダー
const rf_prop_slider = () => {
  const propSliders = document.querySelectorAll('[data-js-prop-slider]')
  let sliders = {}

  const args = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".c-prop-slider__pagination",
      type: "progressbar",
    },
    breakpoints: {
      0: {
        spaceBetween: 16,
        slidesPerView: 1.2,
        slidesOffsetBefore: 32,
        slidesOffsetAfter: 32,
      },
      768: {
        spaceBetween: 24,
        slidesPerView: 4.4,
        slidesOffsetBefore: 40,
        slidesOffsetAfter: 40,
      },
    },
  }

  const setSwiper = () => {
    propSliders.forEach(slider => {
      const propSlider = new Swiper(slider, args)
      sliders[slider.id] = propSlider
    })
  }

  const init = () => {
    setSwiper()
  }

  init()

}

export default rf_prop_slider