// 物件スライダー
const rf_prop_slider = () => {
  const propSliders = document.querySelectorAll('[data-js-prop-slider]')
  let sliders = {}

  const args = {
    spaceBetween: 24,
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
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 4,
      },
    },
  }

  propSliders.forEach(slider => {
    const propSlider = new Swiper(slider, args)
    console.dir(slider)
    sliders[slider.id] = propSlider
  })

  console.log(sliders)

}

export default rf_prop_slider