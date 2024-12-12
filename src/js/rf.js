// import { rf_get_globals, rf_set_globals } from "./partials/_global-setting";
import rf_responsive_check from "./partials/_responsive";
import RfLoader from "./partials/_loader";
import RfCheckboxStatus from "./partials/_checkbox-status";
// import rf_modals from "./partials/_modal.old";
import RfModals from "./partials/_modal";
import rf_madori_modal from "./partials/_madori-modal";
import rf_gnav from "./partials/_gnav";
import rf_toggles from "./partials/_toggles";
import rf_top_banners from "./partials/_top-banners";
import rf_todays_count from "./partials/_top-today";
import rf_prop_slider from "./partials/_prop-slider";
import { rf_room_list_link, rf_room_list_toggle } from "./partials/_room-list";
import { RFBuildroomSlide, rf_buildroom_main_slide, rf_buildroom_related_slide } from "./partials/_buildroom";
import rf_cta_navi_tel from "./partials/_cta-navi";
import rf_select_link from "./partials/_select-link";
import rf_related_prop_slider from "./partials/_related-prop-slider";
import rf_ward from "./partials/_ward";
import rf_result_room_slide from "./partials/_result-room-slide";
import rf_search_ensen_checkbox from "./partials/_seach-enesen";
import RfMediaQuery from "./partials/_mediaquery";
import rf_search_change_method from "./partials/_search-change-method";
import pagetop from "./partials/_pagetop";

import rf_test from "./partials/_test";

// =======================================================
// Inits
const rf_init = () => {

  // Viewport checker (SP or PC)
  rf_responsive_check()

  // グローバル変数、関数、はRF_GLOBALSにまとめ、windowにアサインする
  window['RF_GLOBALS'] = {
    ...window['RF_GLOBALS'],
    RfLoader,
    RfCheckboxStatus,
    RfMediaQuery,
    RfModals,
  }

  // rf_set_globals({
  //   window_state: 'PC',
  //   breakpoint: 768,
  // })


  console.log(window['RF_GLOBALS'])


  // Global Navigation
  if (document.querySelector('[data-js-gnav]')) {
    rf_gnav()
  }

  // Toggles
  if (document.querySelector('[data-js-toggle]')) {
    rf_toggles()
  }

  // Pagetop
  if(document.querySelector('[data-js-pagetop]')) {
    pagetop()
  }

  // TOPページ - 本日掲載
  if (document.querySelector('[data-js-today-target]')) {
    rf_todays_count()
  }

  // Topページ - バナー
  if (document.querySelector('[data-js-top-banners]')) {
    console.log('top slider')
    rf_top_banners()
  }

  // 物件スライダー(TOPページ)
  if (document.querySelector('[data-js-prop-slider]')) {
    rf_prop_slider()
  }

  // 物件スライダー(関連）
  if (document.querySelector('[data-js-related-prop-slider]')) {
    rf_related_prop_slider()
  }

  // お部屋リストリンク
  if (document.querySelector('[data-js-room-link]')) {
    rf_room_list_link()
    rf_room_list_toggle()
  }

  // 建物・部屋共通
  // NEW
  let RFtemp
  if (document.querySelector('[data-js-buildroom-slide]')) {
    RFtemp = new RFBuildroomSlide()
    console.dir(RFtemp)
  }

  // 👇️ OLD
  // if (document.querySelector('[data-js-buildroom-mv]')) {
  //   rf_buildroom_main_slide()
  // }
  // if (document.querySelector('[data-js-buildroom-mv-thumbs]')) {
  //   rf_buildroom_related_slide()
  // }
  //=====

  // モーダル
  if (
    document.querySelector('[data-js-modal]') || //ボタン
    document.querySelector('[data-js-modal-target]') //モーダル本体
  ) {
    RF_GLOBALS.rf_modals = new RF_GLOBALS.RfModals();
  }

  // CTAナビ
  if (document.querySelector('[data-js-cta-navi-tel]')) {
    rf_cta_navi_tel()
  }

  // セレクトリンク
  if (document.querySelector('[data-js-select-link]')) {
    rf_select_link()
  }

  // 区の選択
  if (document.querySelector(`[data-js-ward-select]`)) {
    rf_ward()
  }

  // 検索結果 - お部屋リストスライド
  if (document.querySelector('[data-js-result-room-slide]')) {
    rf_result_room_slide()
  }

  // 検索 - 駅・沿線チェックボックス
  if (document.querySelector('[data-js-form-checkbox]')) {
    rf_search_ensen_checkbox()
  }

  // 検索の方法、選び方の変更
  if (document.querySelector('[data-js-search-change-method]')) {
    rf_search_change_method()
  }

  // TODO: テスト(本番化のときに削除)
  if(document.querySelector('#ajax-modal-test')) {
    rf_test()
  }

  // 間取りモーダル
  if(document.querySelector('[data-js-madori-modal]')) {
    rf_madori_modal()
  }
}

rf_init()