// 便利な使い方モーダル
// Cookieをセットして1回のみ自動的に表示する
// Cookieの保存期間は30日間
const rf_modal_usage = () => {
  const RF_COOKIE_USAGE = 'rf_modal_usage'

  // Cookieの有無を確認
  const checkCookie = () => {
    return document.cookie.split(';').some(item => item.trim().startsWith(`${RF_COOKIE_USAGE}=`))
  }

  const isCookieExist = checkCookie()
  console.log(isCookieExist)
  if (isCookieExist) {
    return;
  }

  // Set cookie with 30 days expiration
  const setModalCookie = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    // Set secure cookie with proper attributes
    document.cookie = `${RF_COOKIE_USAGE}=true; expires=${expirationDate.toUTCString()}; path=/; sameSite=strict;`;
    console.log(document.cookie)
  }

  setModalCookie();

  const openModal = () => {
    const targetModal = document.querySelector('#modal-convenient-usage')

    targetModal.classList.add('--is-open')
  }

  const init = () => {
    openModal()
  }

  init()

}

export default rf_modal_usage