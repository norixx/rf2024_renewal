// import rf_globals from './partials/_globals';
import rf_responsive_check from "./partials/_responsive";
import rf_gnav from "./partials/_gnav";
import rf_toggles from "./partials/_toggles";
import rf_top_banners from "./partials/_top-banners";
import rf_prop_slider from "./partials/_prop-slider";
import { rf_room_list_link, rf_room_list_toggle } from "./partials/_room-list";
import { rf_buildroom_main_slide, rf_buildroom_related_slide } from "./partials/_buildroom";
import rf_modals from "./partials/_modal";
import rf_cta_navi_tel from "./partials/_cta-navi";
import rf_select_link from "./partials/_select-link";

// =======================================================
// Inits

// Viewport checker (SP or PC)
rf_responsive_check()

// Global Navigation
if (document.querySelector('[data-js-gnav]')) {
  rf_gnav()
}

// Toggles
if (document.querySelector('[data-js-toggle]')) {
  rf_toggles()
}

// Topページ - バナー
if (document.querySelector('[data-js-top-banners]')) {
  rf_top_banners()
}

// 物件スライダー
if (document.querySelector('[data-js-prop-slider]')) {
  rf_prop_slider()
}

// お部屋リストリンク
if (document.querySelector('[data-js-room-link]')) {
  rf_room_list_link()
  rf_room_list_toggle()
}

// 建物・部屋共通
if (document.querySelector('[data-js-buildroom-mv]')) {
  rf_buildroom_main_slide()
}
if (document.querySelector('[data-js-buildroom-mv-thumbs]')) {
  rf_buildroom_related_slide()
}

// モーダル
if (document.querySelector('[data-js-modal]')) {
  rf_modals()
}

// CTAナビ
if (document.querySelector('[data-js-cta-navi-tel]')) {
  rf_cta_navi_tel()
}

// セレクトリンク
if (document.querySelector('[data-js-select-link]')) {
  rf_select_link()
}