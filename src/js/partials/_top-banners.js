// TOPバナースライダー
const rf_top_banners = () => {
  const args = {
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
  const banner = new Swiper('[data-js-top-banners]', args)
  console.log(banner)
}

export default rf_top_banners