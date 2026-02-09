// 建物・部屋 詳細ページ共通

// =======================================================
// NEW 建物・部屋スライド
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
    // 順番(厳守): 1 建物, 2 間取り, 3 部屋 , 4 外観・共用部・周辺環境写真, 5 パノラマ 
    #photos = {
        build: [],//建物（メイン）
        floorplan: [], //間取り・部屋
        // room: [],//部屋
        exterior: [],//外観・共用部・周辺環境写真
        panorama: [],//パノラマ、動画
        // nophoto: [], // no photo
    }

    // 一度作成したスライドHTMLデータ
    #photoHTML = {
        build: [],//建物(メイン)
        exterior: [],//外観・共用部・周辺環境写真
        floorplan: [], //間取り・部屋
        // room: [],//部屋
        panorama: [],//パノラマ、動画
    }

    // タブボタン文言
    #tabBtnTexts = {
        ja: {
            build: '建物',
            exterior: '外観・共用部・周辺',
            // ↓部屋ページ専用
            floorplan: '間取り・部屋',
            // room: '部屋',
            // ↓ページ共通
            panorama: 'パノラマ・動画',
        },
        en: {
            build: 'Building',
            exterior: 'Exterior, common spaces, and surroundings',
            // ↓部屋ページ専用
            floorplan: 'Floor plan &amp; Room',
            // room: 'Room',
            // ↓ページ共通
            panorama: 'Panoramas and videos',
        }
    }

    // 現在のスライド
    #currentSlide = null

    // 間取り0件フラグ
    #isFloorData = true

    // 画像ロードエラーフラグ
    #isPhotosLoaded = {
        build: true,
        floorplan: true, //間取り・部屋
        // room: true,
        exterior: true,
        panorama: true,
    }

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
        zoom: true,
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
        zoom: true,
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
    #thumbSlideContainer = this.#mainSlideParent.querySelector("[data-js-buildroom-slide-thumbs-container]");
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
    #btnOpenModalHTML = `<button class="c-buildroom-slide__btn-open --modal --is-hidden" data-js-buildroom-modal-open data-js-modal type="button">
    <span class="u-visually-hidden">拡大</span>
    </button>`
    #btnOpenModal = null

    // パノラマ・ムービーを開くボタン
    #btnOpenPanoramaHTML = `<button class="c-buildroom-slide__btn-open --panorama --is-hidden" data-js-buildroom-panorama-open type="button">`
    #btnOpenPanorama = null

    //タブ
    #mainSlideTabContainer = document.querySelector('[data-js-buildroom-slide-tab-container]')
    #mainSlideTabs = null

    // nodata画像(ファイル側へ移動)
    // RF_gallery_nophoto = '/assets/img/common/nophoto.webp'
    // RF_gallery_nofloorplan = '/assets/img/common/nofloorplan.webp'

    // フラグ
    #isPanoramaEventSet = false

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
        while (this.#slideWrapper.firstChild) {
            this.#slideWrapper.removeChild(this.#slideWrapper.firstChild)
        }

        // nodata画像を追加
        const imgHTML = `<div class="swiper-slide"><img src="${RF_gallery_nophoto}" alt="No photo" class="c-buildroom-slide__nodata"></div>`
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
        if (type === 'nodata') {
            html = this.#setErrorHTML(type)
            this.#setNodata()
        }
    }

    // ===
    // 🔁 ローダー
    // ↓未使用なので一旦停止
    // #setSkeltonLoader() {
    //   this.#mainSlideContainer.classList.add('--is-active')
    // }
    #removeSkeltonLoader() {
        this.#mainSlideContainer.classList.remove('--is-loading')
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

    /**
     * 💡. スライドデータ（JSON）を取得
     * 
     * @param {string} key - スライドの種類キー
     * @returns {object} - スライドデータ(配列)
     */
    #getSlideData(key) {
        return this.#photos[key]
    }

    /**
     * 
     * @param {string} key スライドの種類キー
     * @param {object} data スライドデータ(配列)
     */
    #setSlideData(key, data) {
        this.#photos[key] = data
    }

    // 💡. スライドHTMLデータ(配列)を取得
    #getSlideHTMLData(key) {
        return this.#photoHTML[key];
    }

    // 💡. スライドHTML(配列)をまとめて追加
    #setSlideHTMLData(key, data) {
        this.#photoHTML[key] = data;
        console.log('スライドHTML: ', this.#photoHTML)
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

    // 💡. 間取り写真なしの処理
    #removeNoFloorDataProcess() {
        console.log('サムネイルコンテナを表示します。')
        // サムネイルコンテナを隠す
        this.#thumbSlideContainer.classList.remove('--is-hidden')
    }
    #setNoFloorDataProcess() {
        console.log('間取り画像がありません。モーダル、タブボタンを非表示にします。')
        // モーダルボタンorパノラマオープンボタンを非表示
        this.#showHideModalBtn(false)

        // Swiperを無効化する
        this.#swipers.mainSlide.disable()
        this.#swipers.thumbSlide.disable()

        // サムネイルコンテナを隠す
        this.#thumbSlideContainer.classList.add('--is-hidden')

    }

    // 画像ロードエラーの場合の処理 ===
    /**
     * 画像ロードエラーで非表示にしたサムネイルコンテナを表示
     */
    #removeErrorDataProcess() {
        console.log('サムネイルコンテナを表示します。')
        // サムネイルコンテナを隠す
        this.#thumbSlideContainer.classList.remove('--is-hidden')
    }
    /**
     * 画像ロードエラーの場合の処理 - モーダルボタン、サムネイルコンテナを非表示、Swiperを無効化
     */
    #setErrorDataProcess() {
        console.log('画像がありません。ボタン系を非表示にします。')
        // モーダルボタンorパノラマオープンボタンを非表示
        this.#showHideModalBtn(false)

        // Swiperを無効化する
        this.#swipers.mainSlide.disable()
        this.#swipers.thumbSlide.disable()

        // サムネイルコンテナを隠す
        this.#thumbSlideContainer.classList.add('--is-hidden')
    }

    /**
     * 💡. スライドを全撤去
     */
    #removeAllSlides() {
        this.#swipers.mainSlide.removeAllSlides()
        this.#swipers.thumbSlide.removeAllSlides()
        this.#swipers.modalMainSlide.removeAllSlides()
        this.#swipers.modalThumbSlide.removeAllSlides()
    }

    /**
     * 💡. モーダル開く、パノラマ開くボタンの表示・非表示
     * @param {bool} is_show 
     * @param {bool} is_panorama 
     */
    #showHideModalBtn(is_show = false, is_panorama = false) {
        const hideCls = '--is-hidden'

        if (is_show) {
            // 表示
            console.log('モーダルかパノラマオープンボタンを表示します')
            if (is_panorama) {
                console.log('パノラマオープンボタン表示')
                this.#btnOpenModal.classList.add(hideCls)
                this.#btnOpenPanorama.classList.remove(hideCls)
            } else {
                console.log('モーダルオープンボタン表示')
                this.#btnOpenModal.classList.remove(hideCls)
                if (this.#photos.panorama.length > 0) {
                    this.#btnOpenPanorama.classList.add(hideCls)
                }
            }

        } else {
            // 非表示
            console.log('モーダル、パノラマオープンボタンを非表示にします')
            this.#btnOpenModal.classList.add(hideCls)
            if (this.#photos.panorama.length > 0) {
                this.#btnOpenPanorama.classList.add(hideCls)
            }
        }
    }


    /**
     * 💡. モーダルスライドを追加（モーダル開くボタンから呼び出し）
     * 
     * メモ: モーダルスライドの追加・更新はモーダルが表示されてから行う (display: noneの状態ではSwiperの追加・更新が正常に行われないため)
     * @param {int} activeIndex 
     */
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
        this.#swipers.modalThumbSlide.appendSlide(data)

        this.#swipers.modalThumbSlide.update()
        this.#swipers.modalMainSlide.update()

        this.#swipers.modalMainSlide.slideTo(activeIndex)
        this.#swipers.modalThumbSlide.slideTo(activeIndex)
    }


    /**
     * 💡. Swiperスライドの設定
     * @param {string} key 現在のスライドキー
     */
    #setSwiperSlide(key) {
        console.log('Swiperにスライド追加！')
        // 1. 全撤去
        this.#removeAllSlides()

        // 2. データを取得
        const data = this.#getSlideHTMLData(key) //getSlideData()はJSONを返すのでappendできないので、配列HTMLデータを入れる

        // 3. スライド追加
        // メインスライド
        this.#swipers.thumbSlide.appendSlide(data)
        this.#swipers.thumbSlide.update()
        this.#swipers.thumbSlide.slideTo(0)

        this.#swipers.mainSlide.appendSlide(data)
        this.#swipers.mainSlide.update()
        this.#swipers.mainSlide.slideTo(0)

        // モーダルスライドの更新はモーダルオープンボタンを押してから

        // Swiperを有効化する
        // setTabBtnEvent関数でSwiperが無効化されている場合があるので有効化する
        console.log('setSwiper', this.#isPhotosLoaded[key])
        if (this.#isPhotosLoaded[key]) {
            this.#swipers.mainSlide.enable()
            this.#swipers.thumbSlide.enable()

            // 1つ前の処理で、間取り写真がない場合はサムネイルが非表示になっている場合があるので表示する
            this.#removeNoFloorDataProcess()

            // モーダルボタンorパノラマオープンボタンを表示
            this.#showHideModalBtn(true, key === 'panorama')
        }

        // 現在のスライドの種類を更新
        this.#setCurrentSlide(key)
    }


    /**
     * 💡. SwiperのスライドHTMLに変換して配列化する
     * @param {array} photos 写真データ配列
     * @param {boolean} is_panorama パノラマ写真かどうか
     * @returns {array} スライドHTML化したものを配列で返す(Swiperスライド形式)
     */
    #convertToSwiperHTML(photos, is_panorama = false) {
        let dataArr = [];
        //パノラマ写真の場合
        // let panoramaClass = (is_panorama) ? 'data-js-buildroom-panorama' : '';

        photos.forEach(photo => {
            // console.log(is_panorama)
            // console.log(photo)

            // パノラマ・動画ならば...
            // data-js-buildroom-panorama属性と値を追加
            // ポップアップ用ボタンを追加
            let panoramaAttr = ''
            let panoramaPopupBtn = ''
            if (is_panorama) {
                panoramaAttr = `data-js-buildroom-panorama="${photo.url}"`
                panoramaPopupBtn = `<button class="c-buildroom-slide__btn-popup" data-js-buildroom-panorama-popup="${photo.url}" type="button"></button>`
            }

            // Swiper slideテンプレ
            const nophoto = RF_page_key === 'build' ? RF_gallery_nophoto : RF_gallery_nofloorplan
            dataArr.push(
                `<div class="swiper-slide" ${panoramaAttr}>
                    <div class="swiper-zoom-container">
                        <img src="${(is_panorama) ? photo.filename : photo}" alt="" class="" loading="lazy" onerror="this.onerror='';this.src='${nophoto}'">
                        ${panoramaPopupBtn}
                    </div>
                </div>`
            );
        });

        return dataArr;
    }

    /**
     * 画像のデコード
     * 
     * 画像が読み込まれているかどうかをチェックするためデコードする
     * @param {object} img HTML img element
     */
    async #imageDecode(img) {
        await img.decode()

        console.log(`width: ${img.width}, height: ${img.height}`);
    }

    /**
     * 💡. 画像ロード状況チェック
     * 
     * @param {object} photos 
     * @param {boolean} is_panorama 
     * @returns 
     */
    async #checkPhotoLoad(photos, is_panorama = false) {
        let counter = 0;
        let errorCounter = 0;
        let min = 0;
        const limit = 3;
        min = (photos.length > limit) ? limit : photos.length
        const timeLimit = 30000;
        console.log('チェックする画像の枚数', min)

        // https://www.w3schools.com/js/js_async.asp
        let loaded = new Promise((resolve, reject) => {

            photos.forEach(async (elm) => {
                console.log(elm)
                // Async image load
                // https://stackoverflow.com/a/64747517
                //decode method takes some time to resolve so use await
                const img = new Image();
                if (is_panorama) {
                    img.src = elm.filename;
                } else {
                    img.src = elm;
                }

                // 画像ロードエラー（４０４など）
                // img.onerror = () => {
                //   console.log('イメージロードで何らかのエラー')
                //   errorCounter++

                //   if(errorCounter >= min) {
                //     reject(false);
                //   }

                //   return
                // };

                try {
                    counter++;
                    console.log('画像カウンター: ', counter)

                    await this.#imageDecode(img)

                    if (counter >= min) {
                        resolve(true);
                    }

                } catch (err) {
                    // 画像のデコードができない（画像が404、ネットワークエラー等）
                    console.log(err)
                    errorCounter++

                    if (errorCounter >= min) {
                        reject(true);
                    }

                    if (counter >= min) {
                        console.log('エラーありでcounter終了')
                        resolve(true);
                    }
                }

            });

            setTimeout(() => {
                reject(false);
            }, timeLimit); //timeLimit以内に解決しなければfalse
        });

        return await loaded;
    };


    /**
     * 写真のロードをチェックし、スライドHTMLを作成する
     * 
     * @param {string} key スライドの種類キー
     */
    async #checkLoadAndSetSlideHTML(key) {
        let slideHTMLData = null

        const photoData = this.#getSlideData(key)
        // const data = this.#convertToSwiperHTML(photoData, key === 'panorama');
        // 配列にHTMLデータを追加
        // this.#setSlideHTMLData(key, data)

        // 初期写真データロードチェック
        // TODO: ロードチェックはソートのあとに実施する
        try {
            const loaded = await this.#checkPhotoLoad(photoData, key === 'panorama');

            // 成功時
            console.log('loaded: ', loaded)
            console.log(photoData)
            slideHTMLData = this.#convertToSwiperHTML(photoData, key === 'panorama');

        }
        catch (loadError) {
            console.log('初期写真の取得に失敗')
            console.error(loadError)

            // 取得エラーを起こした場合、何も表示されないとまずいので、nophoto画像に差し替える
            // checkPhotoLoadのrejectからtrueが返される
            if (loadError) {
                console.log('写真取得に失敗。no photoに差し替えます')
                // this.#setSlideData(key, [RF_gallery_nophoto])
                this.#photos[key] = [{
                    filename: RF_gallery_nophoto
                }]

                // データ取り直し
                const data = this.#getSlideData(key)
                slideHTMLData = this.#convertToSwiperHTML(data);

                // 画像ロードエラーフラグを設定
                // this.#isLoaded = false
                this.#isPhotosLoaded[key] = false
            }

        }
        finally {
            // 画像がno photoのみの場合、Swiperをセットしない
            const registeredPhoto = this.#photos[key][0].substring(this.#photos[key][0].lastIndexOf('/') + 1)
            const defaultNoPhoto = RF_gallery_nophoto.substring(RF_gallery_nophoto.lastIndexOf('/') + 1)
            if (
                this.#photos[key].length === 1 &&
                registeredPhoto === defaultNoPhoto
            ) {
                console.log('no photoのみです')
                this.#isPhotosLoaded[key] = false
            }

            // HTMLデータ配列を追加
            console.log('スライドHTMLデータをセットします: ', slideHTMLData)
            this.#setSlideHTMLData(key, slideHTMLData)

        }

    }

    // 💡. ムービー、パノラマの別ウィンドウ開く設定
    #openPanoramaWindow() {
        const windowSetting = 'width=800,height=600,left=0,top=0,menubar=no,status=no'
        // 現在表示中のスライド要素を取得
        const activeSlide = this.#mainSlideElm.querySelector('.swiper-slide-active')
        const url = activeSlide.dataset.jsBuildroomPanorama
        console.log(url)
        window.open(url, '', windowSetting)
    }
    #openPanoramaWindowRevised(target) {
        console.log('set panorama open window!!!')
        const windowSetting = 'width=800,height=600,left=0,top=0,menubar=no,status=no'
        // 現在表示中のスライド要素を取得

        const url = target.dataset.jsBuildroomPanoramaPopup
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

    // 💡. パノラマポップアップボタンの設定
    #setPanoramaPopupBtnEvent() {
        // const btnPopup = this.#mainSlideContainer.querySelector('[data-js-buildroom-panorama-popup]')
        this.#mainSlideContainer.addEventListener('click', e => {
            console.log('パノラマオープンボタンクリックイベント発動！')
            console.log(e.target.dataset.jsBuildroomPanoramaPopup)
            if (!e.target.dataset.jsBuildroomPanoramaPopup) return
            this.#openPanoramaWindowRevised(e.target)
        })
    }

    // 💡. TODO: モーダルオープンボタン(後程オフにする)
    #setModalOpenBtn() {
        this.#mainSlideContainer.insertAdjacentHTML(
            "beforeend", this.#btnOpenModalHTML
        )
        this.#btnOpenModal = this.#mainSlideContainer.querySelector('[data-js-buildroom-modal-open]')
        this.#btnOpenModal.dataset.jsModal = '#' + this.#modalSlideWindow.id //対象のIDを設定
    }

    // ===

    /**
     * 7-2. タブボタンイベントの設定
     * 
     */
    #setTabBtnEvent() {
        this.#mainSlideTabs.forEach(btn => {
            // const key = btn.dataset.jsBuildroomSlideTab
            // let data = null
            let is_loading = false

            btn.addEventListener('click', async (e) => {
                const key = e.target.dataset.jsBuildroomSlideTab

                // ロード中なのでストップ
                if (is_loading) {
                    console.log('ロード中なのでストップ')
                    return
                }

                // ロード開始をフラグで管理
                is_loading = true

                console.log('タブイベント', key, this.#isFloorData)

                // 同じボタンをクリックした場合は処理しない
                if (this.#getCurrentSlide() === key) {
                    console.log("同じボタンなのでストップ");
                    is_loading = false
                    return;
                }

                // 一旦モーダルオープンボタンとパノラマオープンボタンを両方とも非表示
                this.#showHideModalBtn(false)

                // 一旦、Swiperを無効化する
                this.#swipers.mainSlide.disable()
                this.#swipers.thumbSlide.disable()

                // アクティブボタンの切り替え
                this.#mainSlideTabs.forEach(btn => {
                    btn.classList.remove('--is-active')
                })
                if (e.target.tagName === 'BUTTON') e.target.classList.add('--is-active')

                // データ取得
                if (this.#getSlideHTMLData(key).length) {
                    // 取得済みなのでデータからロードし、Swiperを有効化
                    console.log("データからロード");
                    this.#setSwiperSlide(key)

                    // 画像のbroken link処理
                    if (!this.#isPhotosLoaded[key]) {
                        this.#setErrorDataProcess()
                    }

                    is_loading = false
                } else {
                    // データ取得
                    console.log("未HTML化なのでHTML化してロード");

                    // ローダー設定
                    this.#loader.reinsertLoader() //同じローダーを再挿入
                    // this.#setSkeltonLoader()

                    const photoData = this.#getSlideData(key)
                    const data = this.#convertToSwiperHTML(photoData, key === 'panorama')
                    this.#setSlideHTMLData(key, data)

                    // ロード
                    try {
                        const loaded = await this.#checkPhotoLoad(photoData, key === 'panorama')

                    } catch (error) {
                        console.log('ロードに失敗しました')
                        console.log(error)

                    } finally {
                        console.log('ロードされました')

                        // ローダー削除
                        this.#loader.removeLoader()
                        this.#removeSkeltonLoader()

                        // Swiperを有効化する
                        this.#setSwiperSlide(key)

                        // 画像のbroken link処理
                        if (!this.#isPhotosLoaded[key]) {
                            this.#setErrorDataProcess()
                        }

                        is_loading = false
                    }
                }

            })
        })
    }

    /**
     * 7-1. タブボタン要素の作成
     * 
     * @param {string} key 
     * @returns {string} 1つのタブボタン要素(HTML)
     */
    #createTabHTML(key) {
        let lang = RF_lang
        return `<button type="button" data-js-buildroom-slide-tab="${key}" type="button">${this.#tabBtnTexts[lang][key]}</button>`
    }

    // 
    /**
     * 7.タブの設定
     */
    #setTabs() {
        let tabHTML = '';
        for (let key in this.#photos) {
            // if (!this.#photos.hasOwnProperty(key)) continue;

            // 建物ページか部屋ページを判定
            // 建物↓
            if (
                RF_page_key === 'build' &&
                (
                    key === 'build' ||
                    key === 'exterior' ||
                    key === 'panorama'
                )
            ) {
                // console.log('タブ: 建物です')
                if (this.#photos[key].length > 0) tabHTML += this.#createTabHTML(key)
            }
            // 部屋↓
            else if (
                RF_page_key === 'room' &&
                (
                    key === 'room' ||
                    key === 'exterior' ||
                    key === 'floorplan' ||
                    key === 'panorama'
                )
            ) {
                // console.log('タブ: 部屋です')
                if (this.#photos[key].length > 0) tabHTML += this.#createTabHTML(key)
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

        // 7-2. タブボタンイベントの設定
        this.#setTabBtnEvent()
    }

    // ===

    /**
     * 6-1.モーダルオープンボタンを押したとき、アクティブインデックスを更新するイベントを設定
     * 
     * モーダルのSwiperをメインSwiperと同期させるため
     */
    #setModalActiveIndex() {
        this.#btnOpenModal.addEventListener('click', () => {
            console.log('モーダルアクティブインデックスを更新、モーダルスライドを追加')
            this.#setModalSlide(this.#swipers.mainSlide.activeIndex)
        })
    }

    /**
     * 6. モーダルウィンドウの制御
     * 
     * モーダル開くボタン、パノラマ・動画ボタンの追加(存在すれば)
     */
    #setModalWindowAction() {
        // ⏹️ モーダル開くボタン追加
        this.#setModalOpenBtn()

        // ⏹️ パノラマ・動画が存在すれば、パノラマオープンボタン追加
        if (this.#photos.panorama.length > 0) {
            // 2026/02/09 削除
            // console.log('パノラマオープンボタン追加')
            this.#setPanoramaOpenBtn()

            // スライド上のパノラマポップアップボタンイベントの設定
            if (!this.#isPanoramaEventSet) {
                this.#setPanoramaPopupBtnEvent()
                this.#isPanoramaEventSet = true
            }
        }

        // 現在のスライドの種類に合わせて、モーダルかパノラマオープンボタンを表示
        const key = this.#getCurrentSlide()
        this.#showHideModalBtn(true, key === 'panorama')

        // モーダルオープンボタンの設定(RfModalsを使用)
        const _modalArgs = {
            modal: this.#modalSlideWindow,
            modalOpenBtn: this.#btnOpenModal,
        }
        if (RF_GLOBALS.rf_modals) {
            console.log('モーダル作成: すでにモーダルインスタンスがあります。')
            RF_GLOBALS.rf_modals.modal(_modalArgs)
        } else {
            console.log('モーダル作成: モーダルインスタンスはありません。作成します')
            RF_GLOBALS.rf_modals = new RF_GLOBALS.RfModals(_modalArgs)
        }

        // 6-1. モーダル開くボタンクリックイベントの設定
        this.#setModalActiveIndex()


    }

    // ===

    // 5. Swiper初期化（初回のみ）
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

        // 6以降の処理をsetInitPhotosへ移動    

    }

    // ===

    // 4. 初回SwiperのスライドHTML配列を文字列化して挿入する
    #insertInitSlides(key) {
        let html = ''

        const arr = this.#getSlideHTMLData(key)

        arr.forEach(data => {
            html += data
        })

        console.log('初期スライドHTML', html)

        this.#slideWrapper.insertAdjacentHTML('beforeend', html)
        this.#thumbWrapper.insertAdjacentHTML('beforeend', html)

    }

    // ===

    // 3. 初期データを処理
    async #setInitPhotos() {
        // 初回のキーチェック
        let firstKey = ''// 初回のキー

        // データの中で最初に空ではないキーをチェックする
        if (RF_page_key === 'build') {
            // (obj) => Object.keys(obj).find((i) => obj[i] === true)
            firstKey = Object.keys(this.#photos).find(key => {
                // 建物では間取りと部屋は除外
                if (
                    key === 'floorplan' ||
                    key === 'room'
                ) {
                    return false
                }

                if (this.#photos[key].length > 0) return true
            })

        } else if (RF_page_key === 'room') {
            // 部屋ページでは常に最初は「間取り・部屋」になる
            firstKey = 'floorplan'
        }
        console.log('firstKey: ', firstKey)
        // 初回のキーチェックここまで ===

        //💡. 現在のスライドの種類をセット
        this.#setCurrentSlide(firstKey)

        // TODO: 画像ロードチェックとスライドHTML作成
        await this.#checkLoadAndSetSlideHTML(firstKey)


        // 固定表示の1枚目を削除
        // https://www.jamesbaum.co.uk/blether/vanilla-js-equivalent-jquery-find-parent-data-remove-class-empty-append/#empty
        while (this.#slideWrapper.firstChild) {
            this.#slideWrapper.removeChild(this.#slideWrapper.firstChild)
        }

        // 4. Swiperの初回スライドHTMLを挿入
        this.#insertInitSlides(firstKey)

        // 5. Swiperを初期化(1回のみ)
        this.#setSwiper()

        // 6.モーダルとパノラマオープンボタンの追加(1回のみ)
        this.#setModalWindowAction()

        // 7.タブの設定
        this.#setTabs()

        // 画像のbroken link処理
        const key = this.#getCurrentSlide()
        if (!this.#isPhotosLoaded[key]) {
            this.#setErrorDataProcess()
        }

        // ローダーを削除
        this.#loader.removeLoader()
        this.#removeSkeltonLoader()

    }

    // ===

    /**
     * 2-2. 初期画像を保存
     * 
     * @param {object} filename 画像データURL 
     * @param {string} part 画像種別番号
     */
    #sortFirstDataAndSave(filename, part) {
        switch (part) {
            case '001': //建物メイン写真
                this.#photos.build.push(filename);
                break
            case '101': //間取り写真
                this.#photos.floorplan.push(filename);
                break
        }
    }

    /**
     * 2-2. 部屋ページでの外観データを保存
     * 
     * @param {object} buildData 建物データ配列
     */
    #sortBuildDataAndSave(buildData) {
        // 建物メイン写真がある場合はグローバル変数から配列先頭に保存
        // if(typeof RF_firstbuild_photo !== 'undefined') {
        //   this.#photos.build.unshift(RF_firstbuild_photo)
        // }

        // 建物、外観、共用、周辺写真をまとめてexteriorに格納
        buildData.forEach((elm) => {
            switch (elm.part) {
                // 建物、外観、共用部、周辺
                case '000': // fake number
                case '001': //建物メイン写真(部屋ページの場合はJSONから取得)
                case '002':
                case '003':
                case '004':
                case '005':
                    // 以下「周辺」写真が重複するので削除(2025-10-01)
                    // case '031':
                    // case '032':
                    // case '033':
                    // case '034':
                    // case '035':
                    // case '036':
                    // case '037':
                    // case '038':
                    // case '039':
                    this.#photos.exterior.push(elm.filename)
                    break;
            }
        })
        console.log('部屋ページ: 建物写真が存在し、挿入後のフォトデータ', this.#photos)
    }

    /**
     * 2-2. 取得したJSONデータをソートし#photosに保存
     * 
     * @param {object} data JSONデータ
     */
    #sortDataAndSave(data) {
        data.forEach((elm) => {
            // console.log(elm.filename)
            switch (elm.part) {
                // 外観
                // case '001': //建物メイン写真(グローバル変数から取得に変更)
                case '002':
                case '003':
                case '004':
                case '005':
                    console.log('002-005突っ込もうとしている外観', elm.filename);
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
                    console.log('031-039突っ込もうとしている外観', elm.filename);
                    this.#photos.exterior.push(elm.filename);
                    break;
                // 間取り
                // case '101':
                //   this.#photos.floorplan.push(elm.filename);
                //   break;
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
                    this.#photos.floorplan.push(elm.filename);
                    break;
            }
        })

        // 部屋ページの間取り写真だけは特別で、写真が無くてもタブ表示し、nophoto画像を挿入する
        // TODO: 削除予定
        // console.log('間取り写真枚数', this.#photos.floorplan.length)
        console.log('ソート後の写真データ(this.#photos)', this.#photos)
    }

    /**
     * 2-1. パノラマ・動画のデータを保存(存在すれば)
     * 
     * @return void
     */
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

    /**
     * 2. データ取得
     */
    async #fetchPhotoData() {
        //ローダーを挿入
        this.#loader = new RF_GLOBALS.RfLoader({
            target: this.#slideWrapper,
        })


        // 1. パノラマデータを取得(あれば)
        this.#savePanoramaData()

        // 2. 初期画像データを取得
        // TODO: 1枚目の写真が静的には存在して、JSONに存在しない場合もあるので対応する
        // 例. http://141.147.169.110/rf/tatemono/73682/1700
        let isInitialData = false;
        let img = new Image();
        try {
            if (RF_page_key === 'build') {
                img.src = RF_firstbuild_photo
            }
            else if (RF_page_key === 'room') {
                img.src = RF_firstfloorplan_photo
            }

            // 存在チェック
            console.log('初期画像', img)
            await this.#imageDecode(img)

            isInitialData = true
        }
        catch (err) {
            console.log('初期画像ロードエラー: ', err)

            // no photo画像設定
            if (RF_page_key === 'build') {
                img.src = RF_gallery_nophoto
                // MEMO: 002~005が存在する場合があるので単純にここでfalseにはできない
                // this.#isPhotosLoaded['build'] = false
            }
            else if (RF_page_key === 'room') {
                img.src = RF_gallery_nofloorplan
                // this.#isPhotosLoaded['floorplan'] = false
            }
        }
        finally {
            console.log('ロードチェック後の初期画像', img)
            let part
            if (RF_page_key === 'build') part = '001'
            else if (RF_page_key === 'room') part = '101'

            this.#sortFirstDataAndSave(img.src, part)
        }

        console.log('初期画像処理後の写真データ(this.#photos)', this.#photos)


        // 3. その他の画像データを取得
        try {
            // データ: RF_gallery_url ===
            const fetchedData = await fetch(RF_gallery_url)
            const data = await fetchedData.json();

            console.log('取得した' + RF_page_key + 'データ(JSON): ', data)

            // 部屋ページの場合 - 外観写真データも取得する ===
            let dataBuild = []
            if (RF_page_key === 'room') {
                console.log('部屋ページなので、外観写真も取得')
                let fetchedBuildData = await fetch(RF_gellery_tatemono_url)
                dataBuild = await fetchedBuildData.json();
                console.log('【部屋】取得したデータ(外観)(JSON): ', dataBuild)
            }

            // 写真データがまったくない場合は処理をエラー処理へ飛ばす ===
            // 建物
            if (
                RF_page_key === 'build' &&
                !isInitialData &&
                !data.length &&
                typeof RF_firstbuild_photo === 'undefined'
            ) {
                throw "No data";
            }
            // 部屋
            if (
                RF_page_key === 'room' &&
                !isInitialData &&
                !data.length &&
                !dataBuild.length &&
                typeof RF_firstbuild_photo === 'undefined'
            ) {
                throw "No data";
            }

            // 存在すればデータをソート
            this.#sortDataAndSave(data)
            // 部屋ページ専用（外観写真があればソートする）
            if (RF_page_key === 'room' && dataBuild.length > 0) {
                this.#sortBuildDataAndSave(dataBuild)
            }

            // 3. 初期データを挿入
            this.#setInitPhotos()

            // 4~は setInitPhotos内で実行

        } catch (err) {
            console.dir(err);
            // エラーハンドリング - データがない、リファレンスエラー
            this.#errorHandler('nodata');

            this.#loader.removeLoader() //ローダー削除
            this.#removeSkeltonLoader()
        }
    }

    /**
     * 1. init
     * 
     */
    async #init() {
        try {
            //2. データ取得
            this.#fetchPhotoData();

        } catch (err) {

        }
    }

}

// =======================================================
// OLD
// const rf_buildroom_main_slide = () => {
//   const mv_thumbs_args = {
//     spaceBetween: 8,
//     freeMode: true,
//     watchSlidesProgress: true,
//     breakpoints: {
//       0: {
//         slidesPerView: 4.5,
//       },
//       768: {
//         slidesPerView: 8.5,
//       },
//     },
//   }
//   const mv_thumbs = new Swiper('[data-js-buildroom-mv-thumbs]', mv_thumbs_args)

//   const mv_args = {
//     pagination: {
//       el: ".swiper-pagination",
//       type: "fraction",
//     },
//     navigation: {
//       nextEl: ".swiper-button-next",
//       prevEl: ".swiper-button-prev",
//     },
//     thumbs: {
//       swiper: mv_thumbs,
//     },
//   }
//   const mv = new Swiper('[data-js-buildroom-mv]', mv_args)
// }

// const rf_buildroom_related_slide = () => {
// }

export { RFBuildroomSlide }