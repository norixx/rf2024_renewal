// 建物・部屋 共通

const rf_buildroom_main_slide = () => {
  const mv_thumbs_args = {
    spaceBetween: 8,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        slidesPerView: 4,
      },
      768: {
        slidesPerView: 8,
      },
    },
  }
  const mv_thumbs = new Swiper('[data-js-buildroom-mv-thumbs]', mv_thumbs_args)

  const mv_args = {
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: mv_thumbs,
    },
  }
  const mv = new Swiper('[data-js-buildroom-mv]', mv_args)
}

const rf_buildroom_related_slide = () => {
}

export { rf_buildroom_main_slide, rf_buildroom_related_slide }