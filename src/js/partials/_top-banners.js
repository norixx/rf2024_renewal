// TOPバナースライダー
const rf_top_banners = () => {
  const args = {
    spaceBetween: 24,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 4,
      },
    },
  }
  const banner = new Swiper('[data-js-top-banners]', args)
  console.log(banner)
}

export default rf_top_banners