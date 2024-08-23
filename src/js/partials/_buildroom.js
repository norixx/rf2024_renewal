// 建物・部屋 詳細ページ共通

// =======================================================
// NEW 建物・部屋スライド(Swiper)
// 参考: https://codepen.io/tea4two/pen/LYvLNME?editors=0010
class RFBuildroomSlide {
  #swipers = {
    //Swiperスライドオブジェクト保管用
    mainSlide: null,
    thumbSlide: null,
    modalMainSlide: null,
    modalThumbSlide: null,
  }

  // ローダー
  #loader = null

  // 一度取得したスライドのデータ(JSON)
  // 順番(厳守): 1 建物, 2 外観・共用部・周辺環境写真, 3 間取り, 4 部屋 , 5 パノラマ 
  #photos = {
    build: [],//建物（メイン）
    exterior: [],//外観・共用部・周辺環境写真
    floorplan: [], //間取り
    room: [],//部屋
    panorama: [],//パノラマ、動画
    // nophoto: [], // no photo
  }

  // 一度作成したスライドHTMLデータ
  #photoHTML = {
    build: [],//建物(メイン)
    exterior: [],//外観・共用部・周辺環境写真
    floorplan: [], //間取り
    room: [],//部屋
    panorama: [],//パノラマ、動画
  }

  // タブボタン文言
  #tabBtnTexts = {
    ja: {
      build: '建物',
      exterior: '外観・共用部・周辺',
      // ↓部屋ページ専用
      floorplan: '間取り',
      room: '部屋写真',
      // ↓ページ共通
      panorama: 'パノラマ・動画',
    },
    en: {
      build: 'Building',
      exterior: 'Exterior, common spaces, and surroundings',
      // ↓部屋ページ専用
      floorplan: 'Floor plan',
      room: 'Room',
      // ↓ページ共通
      panorama: 'Panoramas and videos',
    }
  }

  // 現在のスライド
  #currentSlide = null
  

  // メインスライド（Swiper）設定
  #swiperMainSetting = {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
  }
  // サムネイルスライド(Swiper)設定
  #swiperThumbsSetting = {
    slidesPerView: 4.5,
    freeMode: true,
    spaceBetween: 8,
    breakpoints: {
        0: {
          slidesPerView: 4.5,
        },
        768: {
          slidesPerView: 8.5,
        },
      },
  }

  //モーダルサムネイルスライド(Swiper)設定
  #swiperModalThumbsSetting = {
    slidesPerView: 4.5,
    freeMode: true,
    spaceBetween: 8,
    breakpoints: {
        0: {
          slidesPerView: 4.5,
        },
        768: {
          slidesPerView: 12.5,
        },
      },
  }
  // エラー ===
  #errorMessages = {
    ja: {
      nodata: 'データを取得できません',
    },
    en: {
      nodata: 'Failed to get data',
    }
  }

  // 要素 ===
  // メイン
  #mainSlideParent = document.querySelector("[data-js-buildroom-slide]");
  #mainSlideContainer = this.#mainSlideParent.querySelector("[data-js-buildroom-slide-container]");
  #mainSlideElm = this.#mainSlideParent.querySelector(".swiper");
  #slideWrapper = this.#mainSlideElm.querySelector(".swiper-wrapper");
  // サムネイル
  #thumbElm = this.#mainSlideParent.querySelector("[data-js-buildroom-slide-thumbs]");//.swiper
  #thumbWrapper = this.#thumbElm.querySelector(".swiper-wrapper");
  // モーダル
  #modalSlideWindow = document.querySelector("[data-js-buildroom-modal]")
  #modalSlideElm = this.#modalSlideWindow.querySelector(".swiper");
  #modalSlideWrapper = this.#modalSlideElm.querySelector(".swiper-wrapper");
  // モーダルサムネイル
  #modalThumbElm = this.#modalSlideWindow.querySelector('[data-js-buildroom-modal-thumbs]')
  #modalThumbWrapper = this.#modalThumbElm.querySelector(".swiper-wrapper");

  //モーダル開くボタンHTML
  #btnOpenModalHTML = `<button class="c-buildroom-slide__btn-open --modal --is-hidden" data-js-buildroom-modal-open data-js-modal>
    <span class="u-visually-hidden">拡大</span>
    </button>`
  #btnOpenModal = null

  // パノラマ・ムービーを開くボタン
  #btnOpenPanoramaHTML = `<button class="c-buildroom-slide__btn-open --panorama --is-hidden" data-js-buildroom-panorama-open>`
  #btnOpenPanorama = null

  //タブ
  #mainSlideTabContainer = document.querySelector('[data-js-buildroom-slide-tab-container]')
  #mainSlideTabs = null

  // nodata画像
  #nodataImg = '/assets/img/common/nophoto.webp'

  // ===

  // 初期化
  constructor() {
    this.#init()
  }

  // ===

  // ❌️. データがない場合の処理（nodata画像を入れる）
  #setNodata() {
    // 固定表示の1枚目を削除
    // https://www.jamesbaum.co.uk/blether/vanilla-js-equivalent-jquery-find-parent-data-remove-class-empty-append/#empty
    while(this.#slideWrapper.firstChild) {
      this.#slideWrapper.removeChild(this.#slideWrapper.firstChild)
    }

    // nodata画像を追加
    const imgHTML = `<div class="swiper-slide"><img src="${this.#nodataImg}" alt="No photo" class="c-buildroom-slide__nodata"></div>`
    this.#slideWrapper.insertAdjacentHTML('beforeend', imgHTML)

    // Swiper関連の要素を非表示
    this.#mainSlideParent.classList.add('--is-slide-disabled')

  }

  // ❌️. エラーメッセージHTML作成
  #setErrorHTML(type) {
    const lang = RF_lang
    const html = `<p class="c-buildroom-slide__error">${this.#errorMessages[RF_lang][type]}</p>`
    return html
  }

  // ❌️. エラーハンドラー - データがない場合
  // エラータイプ: nodata, ...
  #errorHandler(type) {
    let html = ''

    // 完全にデータが無い場合(blade側で処理するため多分使用しない)
    if(type === 'nodata')  {
      html = this.#setErrorHTML(type)
      this.#setNodata()
    }
  }

  // ===

  // 💡. 現在のスライドの種類の設定
  #setCurrentSlide(key) {
    this.#currentSlide = key
  }

  // 💡. 現在のスライドの種類の取得
  #getCurrentSlide() {
    return this.#currentSlide
  }

  // 💡. スライドデータ（JSON）を取得
  #getSlideData(key) {
    return this.#photos[key]
  }

  // 💡. スライドHTMLデータ(配列)を取得
  #getSlideHTMLData(key) {
    return this.#photoHTML[key];
  }

  // 💡. スライドHTML(配列)をまとめて追加
  #setSlideHTMLData(key, data) {
    this.#photoHTML[key] = data;
    console.log(this.#photoHTML)
  }
  // 💡. スライドHTML(文字列)を取得
  // #getSlideHTML(key) {
  //   const photoArr = this.#getSlideHTMLData(key);
  //   let slideHTML = "";
  //   photoArr.forEach(photoHTML => {
  //     slideHTML += photoHTML;
  //   });
  //   return slideHTML;
  // }

  // 💡. スライドを全撤去
  #removeAllSlides() {
    this.#swipers.mainSlide.removeAllSlides()
    this.#swipers.thumbSlide.removeAllSlides()
    this.#swipers.modalMainSlide.removeAllSlides()
    this.#swipers.modalThumbSlide.removeAllSlides()
  }

  // 💡. モーダル開く、パノラマ開くボタンの表示・非表示
  #showHideModalBtn(is_show = false, is_panorama = false) {
    const hideCls = '--is-hidden'

    if(is_show) {
      // 表示
      console.log('モーダルかパノラマオープンボタンを表示します')
      if(is_panorama) {
        console.log('パノラマオープンボタン表示')
        this.#btnOpenModal.classList.add(hideCls)
        this.#btnOpenPanorama.classList.remove(hideCls)
      } else {
        console.log('モーダルオープンボタン表示')
        this.#btnOpenPanorama.classList.add(hideCls)
        this.#btnOpenModal.classList.remove(hideCls)
      }

    } else {
      // 非表示
      console.log('モーダル、パノラマオープンボタンを非表示にします')
      this.#btnOpenModal.classList.add(hideCls)
      this.#btnOpenPanorama.classList.add(hideCls)
    }
  }

  // 💡. モーダルスライドを追加（モーダル開くボタンから呼び出し）
  // メモ: モーダルスライドの追加・更新はモーダルが表示されてから行う。display: noneの状態ではSwiperの追加・更新が正常に行われない。
  #setModalSlide(activeIndex) {
    console.log('モーダルスライドを追加 key: ', this.#getCurrentSlide())
    const key = this.#getCurrentSlide()

    // モーダルのスライドを全撤去
    this.#swipers.modalMainSlide.removeAllSlides()
    this.#swipers.modalThumbSlide.removeAllSlides()

    // モーダルスライド用にデータを取得
    const data = this.#getSlideHTMLData(key)

    // モーダルスライドの追加と更新
    this.#swipers.modalMainSlide.appendSlide(data)
    this.#swipers.modalMainSlide.update()
    this.#swipers.modalMainSlide.slideTo(activeIndex)

    this.#swipers.modalThumbSlide.appendSlide(data)
    this.#swipers.modalThumbSlide.update()
    this.#swipers.modalThumbSlide.slideTo(activeIndex)
  }

  // 💡. Swiperスライドの設定
  #setSwiperSlide(key) {
    console.log('Swiperにスライド追加！')
    // 1. 全撤去
    this.#removeAllSlides()

    // 2. データを取得
    const data = this.#getSlideHTMLData(key) //getSlideData()はJSONを返すのでappendできないので、配列HTMLデータをいれる

    // 3. スライド追加
    // メインスライド
    this.#swipers.thumbSlide.appendSlide(data)
    this.#swipers.thumbSlide.update()
    this.#swipers.thumbSlide.slideTo(0)

    this.#swipers.mainSlide.appendSlide(data)
    this.#swipers.mainSlide.update()
    this.#swipers.mainSlide.slideTo(0)

    // モーダルスライド追加 - #setModalSlide()に移動
    // this.#swipers.modalMainSlide.appendSlide(data)
    // this.#swipers.modalMainSlide.update()
    // this.#swipers.modalMainSlide.slideTo(0)

    // this.#swipers.modalThumbSlide.appendSlide(data)
    // this.#swipers.modalThumbSlide.update()
    // this.#swipers.modalThumbSlide.slideTo(0)

    // 現在のスライドの種類を更新
    this.#setCurrentSlide(key)
  }

  

  // 💡. SwiperのスライドHTMLに変換して配列化する
  // type: 'default' | 'panorama'
  #convertToSwiperHTML(photos, is_panorama = false) {
    let dataArr = [];
    //パノラマ写真の場合
    // let panoramaClass = (is_panorama) ? 'data-js-buildroom-panorama' : '';

    photos.forEach(photo => {
      // console.log(is_panorama)
      // console.log(photo)
      let panoramaAttr = ''
      //パノラマ・動画ならばdata-js-buildroom-panorama属性と値を追加
      if(is_panorama) {
        panoramaAttr = `data-js-buildroom-panorama="${photo.url}"`
      }
      dataArr.push(
        `<div class="swiper-slide" ${panoramaAttr}><img src="${(is_panorama) ? photo.filename : photo}" alt="" class="" loading="lazy"></div>`
      );
    });
    return dataArr;
  }

  // 💡. 画像ロード状況チェック
  // type: 'default' | 'panorama'
  #checkPhotoLoad = async (photos, is_panorama = false) => {
    let counter = 0;
    let min = 0;
    const limit = 3
    min = (photos.length > limit) ? limit : photos.length

    // https://www.w3schools.com/js/js_async.asp
    let loaded = new Promise((resolve, reject) => {
      
      photos.forEach(async (elm) => {
        // Async image load
        // https://stackoverflow.com/a/64747517
        //decode method takes some time to resolve so use await
        const img = new Image();
        if(is_panorama) {
          img.src = elm.filename;
        } else {
          img.src = elm;
        }

        await img.decode();
        console.log(`width: ${img.width}, height: ${img.height}`);

        counter++;
        if (counter >= min) {
          resolve(true);
        }
        
      });

      setTimeout(() => {
        reject(false);
      }, 30000); //30秒以内に解決しなければfalse
    });
    return await loaded;
  };

  // 💡. ムービー、パノラマの別ウィンドウ開く設定
  #openPanoramaWindow() {
    const windowSetting = 'width=800,height=600,left=0,top=0,menubar=no,status=no'
    // 現在表示中のスライド要素を取得
    const activeSlide = this.#mainSlideElm.querySelector('.swiper-slide-active')
    const url = activeSlide.dataset.jsBuildroomPanorama
    console.log(url)
    window.open(url, '', windowSetting)
  }

  // 💡. パノラマオープンボタンの設定
  #setPanoramaOpenBtn() {
    console.log('パノラマオープンボタンの追加')
    // パノラマオープンボタンの追加
    this.#mainSlideContainer.insertAdjacentHTML('beforeend', this.#btnOpenPanoramaHTML)
    this.#btnOpenPanorama = this.#mainSlideContainer.querySelector('[data-js-buildroom-panorama-open]')
    // this.#btnOpenPanorama.classList.add('--is-hidden')

    // イベントリスナーの設定
    // このボタンは別ウィンドウでムービー、パノラマを開く
    // メインのSwiper要素に設定されている data属性の値を取ってきて、別ウィンドウで開く
    this.#btnOpenPanorama.addEventListener('click', () => {
      // const url = this.#swipers.mainSlide
      this.#openPanoramaWindow()
    })
  }

  // 💡. モーダルオープンボタン
  #setModalOpenBtn() {
    this.#mainSlideContainer.insertAdjacentHTML(
      "beforeend", this.#btnOpenModalHTML
    )
    this.#btnOpenModal = this.#mainSlideContainer.querySelector('[data-js-buildroom-modal-open]')
    this.#btnOpenModal.dataset.jsModal = '#' + this.#modalSlideWindow.id //対象のIDを設定
  }

  // ===

  // 6-2. タブボタンイベントの設定
  #setTabBtnEvent() {
    this.#mainSlideTabs.forEach(btn => {
      const key = btn.dataset.jsBuildroomSlideTab
      // let data = null
      let is_loading = false

      btn.addEventListener('click', async (e) => {

        // ロード中なのでストップ
        if(is_loading) {
          console.log('ロード中なのでストップ')
          return
        }

        is_loading = true

        // 同じボタンをクリックした場合は処理しない
        if (this.#getCurrentSlide() === key) {
          console.log("同じボタンなのでストップ");
          is_loading = false
          return;
        }

        // 一旦モーダルオープン、パノラマオープンボタンを両方とも非表示
        this.#showHideModalBtn(false)

        // アクティブボタンの切り替え
        this.#mainSlideTabs.forEach(btn => {
          btn.classList.remove('--is-active')
        })
        if(e.target.tagName === 'BUTTON') e.target.classList.add('--is-active') 

        // データ取得
        if (this.#getSlideHTMLData(key).length) {
          // データからロード
          console.log("データからロード");
          this.#setSwiperSlide(key)

          // モーダルボタンorパノラマオープンボタンを表示
          this.#showHideModalBtn(true, key === 'panorama')

          is_loading = false
        } else {
          // データ取得
          console.log("未HTML化なのでHTML化してロード");
          this.#loader.reinsertLoader() //同じローダーを再挿入
          const photoData = this.#getSlideData(key)
          const data = this.#convertToSwiperHTML(photoData,key === 'panorama')
          this.#setSlideHTMLData(key, data)

          const loaded = await this.#checkPhotoLoad(this.#getSlideData(key), key === 'panorama')
          
          if(loaded) {
            console.log('ロードされました')
            
            this.#loader.removeLoader()
            this.#setSwiperSlide(key)

            // モーダルボタンorパノラマオープンボタンを表示
            this.#showHideModalBtn(true, key === 'panorama')

            is_loading = false
          } else {
            // falseを返した場合
            console.log('ロードに失敗しました')
            this.#loader.removeLoader()
            is_loading = false
          }
        }

      })
    })
  }

  // 6-1. タブボタン要素の作成
  #createTabHTML(key) {
    let lang = RF_lang
    return `<button type="button" data-js-buildroom-slide-tab="${key}">${this.#tabBtnTexts[lang][key]}</button>`
  }

  // 6.タブの設定
  #setTabs() {
    let tabHTML = '';
    for(let key in this.#photos) {
      // if (!this.#photos.hasOwnProperty(key)) continue;

      // 建物ページか部屋ページを判定
      if(
        RF_page_key === 'build' && 
        (
          key === 'build' || 
          key === 'exterior' || 
          key === 'panorama'
        )
      ) {
        // console.log('タブ: 建物です')
        if(this.#photos[key].length > 0) tabHTML += this.#createTabHTML(key)
      }
      else if(
        RF_page_key === 'room' &&
        (
          key === 'room' || 
          key === 'floorplan' || 
          key === 'panorama'
        )
      ) {
        // console.log('タブ: 部屋です')
        if(this.#photos[key].length > 0) tabHTML += this.#createTabHTML(key)
      }

    }
    // タブHTMLの挿入、登録
    this.#mainSlideTabContainer.insertAdjacentHTML('beforeend', tabHTML)
    this.#mainSlideTabs = Array.from(this.#mainSlideTabContainer.querySelectorAll("[data-js-buildroom-slide-tab]"))

    // 最初のタブにactiveクラスを付与
    const key = this.#getCurrentSlide()
    console.log('タブ用のkey: ', key)
    const activeTab = this.#mainSlideTabs.filter(tab => tab.dataset.jsBuildroomSlideTab === key)
    activeTab[0].classList.add('--is-active')
    // this.#mainSlideTabs[0].classList.add('--is-active')
    
    // 6-2. タブボタンイベントの設定
    this.#setTabBtnEvent()
  }

  // ===
  
  // 5-1.モーダルオープンボタンを押したとき、アクティブインデックスを更新するイベントを設定
  // モーダルのSwiperをメインSwiperと同期させるため
  #setModalActiveIndex() {
    this.#btnOpenModal.addEventListener('click', () => {
      console.log('モーダルアクティブインデックスを更新')
      this.#setModalSlide(this.#swipers.mainSlide.activeIndex)
    })
  }

  // 5. モーダルウィンドウ制御
  #setModalWindowAction() {
    // ⏹️モーダル開くボタン追加
    this.#setModalOpenBtn()

    // ⏹️パノラマ・動画が存在すれば、パノラマオープンボタン追加
    if(this.#photos.panorama.length > 0) {
      this.#setPanoramaOpenBtn()
    }

    // 現在のスライドの種類に合わせて、モーダルかパノラマオープンボタンを表示
    const key = this.#getCurrentSlide()
    this.#showHideModalBtn(true, key === 'panorama')

    // モーダルオープンボタンの設定(RfModalsを使用)
    const _modalArgs = {
      modal: this.#modalSlideWindow,
      modalOpenBtn: this.#btnOpenModal,
    }
    if(RF_GLOBALS.rf_modals) {
      console.log('モーダル作成: すでにモーダルインスタンスがあります。')
      RF_GLOBALS.rf_modals.modal(_modalArgs)
    } else {
      console.log('モーダル作成: モーダルインスタンスはありません。作成します')
      RF_GLOBALS.rf_modals = new RF_GLOBALS.RfModals(_modalArgs)
    }

    // 5-1. モーダル開くボタンクリックイベントの設定
    this.#setModalActiveIndex()
  }

  // ===

  // 4. Swiper初期化（初回のみ）
  #setSwiper() {
    console.log('Swiper初期化')
    // メインサムネイル
    this.#swipers.thumbSlide = new Swiper(this.#thumbElm, this.#swiperThumbsSetting);

    // メイン
    let swiperMainSetting = {
      ...this.#swiperMainSetting,
      // サムネイルと連動
      thumbs: {
        swiper: this.#swipers.thumbSlide,
      }
    }
    this.#swipers.mainSlide = new Swiper(this.#mainSlideElm, swiperMainSetting);


    // モーダルサムネイル
    this.#swipers.modalThumbSlide = new Swiper(this.#modalThumbElm, this.#swiperModalThumbsSetting);


    // モーダルメイン
    let swiperModalMainSetting = {
      ...this.#swiperMainSetting,
      // サムネイルと連動
      thumbs: {
        swiper: this.#swipers.modalThumbSlide,
      }
    }
    this.#swipers.modalMainSlide = new Swiper(this.#modalSlideElm, swiperModalMainSetting);

    

    // コントロール連携
    this.#swipers.modalThumbSlide.controller.control = [this.#swipers.thumbSlide] //サムネイル ↔ モーダルサムネイル
    this.#swipers.thumbSlide.controller.control = [this.#swipers.modalThumbSlide] // モーダルサムネイル ↔ サムネイル
    this.#swipers.mainSlide.controller.control = [this.#swipers.modalMainSlide] // モーダルメイン ↔ メイン
    this.#swipers.modalMainSlide.controller.control = [this.#swipers.mainSlide] // メイン ↔ モーダルメイン

    // TODO 移動
    // メインスライド(Swiper)とサムネイルスライド(Swiper)に写真を追加
    // const key = this.#getCurrentSlide()
    // this.#setSwiperSlide(key)

    // 5.モーダルとパノラマオープンボタンの追加
    this.#setModalWindowAction()

    // 6.タブの設定
    this.#setTabs()

  }

  // ===

  // 3-1. SwiperのスライドHTML配列を文字列化して挿入する
  #insertInitSlides(key) {
    let html = ''

    const arr = this.#getSlideHTMLData(key)

    arr.forEach(data => {
      html += data
    })

    console.log(html)

    this.#slideWrapper.insertAdjacentHTML('beforeend', html)
    this.#thumbWrapper.insertAdjacentHTML('beforeend', html)
    
  }

  // 3. 初期データ(建物)を処理
  async #insertInitPhotos() {
    // if(this.#photos.build.length !== 0) {
      // 初回のキーチェック
      // const key = 'build' 
      let firstKey = ''// 初回のキー

      // データの中で最初に空ではないキーをチェックする
      if(RF_page_key === 'build') {
        // (obj) => Object.keys(obj).find((i) => obj[i] === true)
        firstKey = Object.keys(this.#photos).find(key => {
          // 建物では間取りと部屋は除外
          if(
            key === 'floorplan' || 
            key === 'room'
          ){
            return false
          } 

          if(this.#photos[key].length > 0) return true
        })
      } else if(RF_page_key === 'room') {
        // 部屋ページでは常に最初は間取りになる
        firstKey = 'floorplan'
      }
      console.log('firstKey: ', firstKey)

      const photoData = this.#getSlideData(firstKey)
      const data = this.#convertToSwiperHTML(photoData, firstKey === 'panorama');
      this.#setSlideHTMLData(firstKey, data) //💡. スライドHTML(配列)をデータに追加

      const loaded = await this.#checkPhotoLoad(photoData, firstKey === 'panorama');
      console.log('loaded: ', loaded)
      if(loaded) {
        // ローダーを削除
        this.#loader.removeLoader()

        // const data = this.#convertToSwiperHTML(photoData)
        //固定の１枚はHTML上から取得して追加
        // const fixedFirstSlide =this.#slideWrapper.querySelector('.swiper-slide').outerHTML
        // data.unshift(fixedFirstSlide)
        // this.#setSlideHTMLData(key, data) //💡. スライドHTML(配列)をデータに追加

        // 固定表示の1枚目を削除
        // https://www.jamesbaum.co.uk/blether/vanilla-js-equivalent-jquery-find-parent-data-remove-class-empty-append/#empty
        while(this.#slideWrapper.firstChild) {
          this.#slideWrapper.removeChild(this.#slideWrapper.firstChild)
        }

        // 3-1. 初回はSwiperスライドのHTMLを挿入
        this.#insertInitSlides(firstKey)

        // 現在のスライドの種類をアップデート
        this.#setCurrentSlide(firstKey)

        // return

        // 4. Swiperを初期化
        this.#setSwiper()
      }

    // } else {
    //   // エラーハンドリング
    // }
  }

  // ===

  // 2-2. 部屋ページでの外観データを保存
  #sortBuildDataAndSave(buildData) {
    // 建物、外観、共用、周辺写真をまとめてexteriorに格納
    buildData.forEach((elm) => {
      switch(elm.part) {
        // 建物、外観、共用部、周辺
        case '001': //建物メイン写真
        case '002':
        case '003':
        case '004':
        case '005':
        case '031':
        case '032':
        case '033':
        case '034':
        case '035':
        case '036':
        case '037':
        case '038':
        case '039':
          this.#photos.exterior.push(elm.filename)
          break;
      }
    })
    console.log('部屋フォトデータ', this.#photos)
  }

  // 2-2. データをソートし保存
  #sortDataAndSave(data) {
    data.forEach((elm) => {
      switch(elm.part) {
        // 外観
        case '001': //建物メイン写真
        case '002':
        case '003':
        case '004':
        case '005':
          this.#photos.build.push(elm.filename);
          break;
        // 周辺
        case '031':
        case '032':
        case '033':
        case '034':
        case '035':
        case '036':
        case '037':
        case '038':
        case '039':
          this.#photos.exterior.push(elm.filename);
          break;
        // 間取り
        case '101':
          this.#photos.floorplan.push(elm.filename);
          break;
        // 部屋
        case '102':
        case '103':
        case '104':
        case '105':
        case '106':
        case '108':
        case '109': 
        case '110': 
        case '111': 
        case '131': 
        case '132': 
        case '133': 
        case '135': 
        case '136': 
        this.#photos.room.push(elm.filename);
          break;
      }
    })

    // 間取りだけは特別で、写真がない場合でもSwiperに表示させたいのでnodata画像を追加する
    // TODO: 
    // if(RF_page_key === 'room') { }

    console.log('フォトデータ', this.#photos)
  }

  // 2-1. パノラマのデータを保存(存在すれば)
  #savePanoramaData() {
    if (typeof RF_gallery_panorama !== 'undefined') {
      RF_gallery_panorama.forEach(elm => {
        this.#photos.panorama.push({
          filename: elm.filename,
          url: elm.url
        })
      })
    }
  }

  // 2. データ取得
  async #fetchPhotoData() {
    //ローダーを挿入
    this.#loader = new RF_GLOBALS.RfLoader(this.#slideWrapper)

    // 1. パノラマデータを取得(あれば)
    this.#savePanoramaData()
    
    // 2. 画像データを取得
    try {
      /*
        テストデータ

        建物
        RF_gallery_url - 通常
        RF_gallery_url_nodata - 建物・外観データがない
        RF_gallery_url_fake - データが全くない
        RF_gallery_url_onephoto - 建物写真が1枚のみ
        --
        部屋
        部屋ページは外観写真も含めるので、合わせてリクエストする必要がある
        RF_gallery_room_url - 通常部屋写真
        RF_gallery_room_nofloor_url - 間取り写真がない

      */
      const fetchedData = await fetch(RF_gallery_room_url)
      const data = await fetchedData.json();

      // 部屋ページでは外観写真データも取得する
      let dataBuild = []
      if(RF_page_key === 'room') {
        let fetchedBuildData = await fetch(RF_gallery_url)
        dataBuild = await fetchedBuildData.json();
      }

      // 写真データの存在チェック
      if(RF_page_key === 'build' && !data.length) {
        throw "No data";
      }
      if(RF_page_key === 'room' && !data.length && !dataBuild.length) {
        throw "No data";
      }

      //存在すればデータをソート
      console.dir(data)
      this.#sortDataAndSave(data)

      if(RF_page_key === 'room' && dataBuild.length > 0) {
        console.log(dataBuild)
        this.#sortBuildDataAndSave(dataBuild)
      }

      // 3. 初期データを挿入
      this.#insertInitPhotos()


    } catch (err) {
      console.dir(err);
      // エラーハンドリング - データがない、リファレンスエラー
      this.#errorHandler('nodata');

      this.#loader.removeLoader() //ローダー削除
    }
  }

  // 1. init
  async #init()  {
    try {
      //データ取得
      this.#fetchPhotoData();

    } catch (err) {
      
    }
  }

}

// =======================================================
// OLD
const rf_buildroom_main_slide = () => {
  const mv_thumbs_args = {
    spaceBetween: 8,
    freeMode: true,
    watchSlidesProgress: true,
    breakpoints: {
      0: {
        slidesPerView: 4.5,
      },
      768: {
        slidesPerView: 8.5,
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

export { RFBuildroomSlide, rf_buildroom_main_slide, rf_buildroom_related_slide }