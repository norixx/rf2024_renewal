const getSlideData = (key) => {
    return slideData[key]; // array
  };

  const setSlideData = (key, data) => {
    slideData[key] = data;
  };

// スライド全削除
  const removeAllSlides = () => {
    mainSlide.removeAllSlides();
    thumbSlide.removeAllSlides();
    modalMainSlide.removeAllSlides();
    modalThumbSlide.removeAllSlides();
  };


// ボタン操作(２回目以降)
const setSwiperSlide = (key) => {
    // slideを全撤去して
    removeAllSlides();

    // データを取得して
    const data = getSlideData(key);

    // スライド追加
    thumbSlide.appendSlide(data);
    thumbSlide.update();
    thumbSlide.slideTo(0);

    mainSlide.appendSlide(data);
    mainSlide.update();
    mainSlide.slideTo(0);

    modalMainSlide.appendSlide(data);
    modalMainSlide.update();
    modalMainSlide.slideTo(0);

    modalThumbSlide.appendSlide(data);
    modalThumbSlide.update();
    modalThumbSlide.slideTo(0);

    // カレントのアップデート
    setCurrentSlide(key);
  };

// タブボタンイベント
const setTabBtnEvent = () => {
    btns.forEach((btn) => {
      const key = btn.dataset.jsSlideBtn;
      let data = null;
      btn.addEventListener("click", async () => {
        if (getCurrentSlide() === key) {
          console.log("同じボタンなのでストップ");
          return;
        }
        if (getSlideData(key).length) {
          //データからロードする
          console.log("データからロード");
          setSwiperSlide(key);
        } else {
          //AJAX取得して、ステータスに保存
          console.log("未取得なのでGet");
          const data = convertToSlideHTML(await fetchPhotoData(key));
          setSlideData(key, data);
          setSwiperSlide(key);
        }
      });
    });
  };



// 初回アクション
const insertInitPhotos = (photos) => {
  const data = convertToSlideHTML(photos); //Swiperスライドへの変換
  setSlideData("build", data); //スライドデータへの追加
  setInitPhotoSlides("build"); //初回スライドの挿入
  setSwiper(); //Swiperの起動
  setCurrentSlide("build"); //カレントの更新
  setTabBtnEvent(); //タブボタンのイベント設定
};