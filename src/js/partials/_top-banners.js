// TOPバナースライダー
const rf_top_banners = () => {
  let banner = null
  const args = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1.3,
        spaceBetween: 16,
        slidesOffsetAfter: 16,
        slidesOffsetBefore: 16,
      },
      768: {
        slidesPerView: 4.3,
        spaceBetween: 24,
        slidesOffsetAfter: 24,
        slidesOffsetBefore: 24,
      },
    },
  }

  const setSwiper = () => {
    let banner = new Swiper('[data-js-top-banners]', args)
  }

  const init = () => {
    setSwiper()
  }

  init()

}

export default rf_top_banners