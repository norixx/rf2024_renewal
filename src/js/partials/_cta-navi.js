// CTAナビ
const rf_cta_navi_tel = () => {
  // const nav = document.querySelector('.c-cta-navi-tel');
  const btn = document.querySelector(['[data-js-cta-navi-tel]']);
  const nav = document.querySelector(btn.dataset.jsCtaNaviTel);
  
  btn.addEventListener('click', () => {
    console.log(nav)
    nav.classList.toggle('--is-open')
  })

  console.dir(btn)
}

export default rf_cta_navi_tel