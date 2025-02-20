// 検索 - 駅・沿線

const rf_search_ensen_checkbox = () => {
  const forms = document.querySelectorAll('[data-js-form-checkbox]')
  const form_ensen_step_one_id = 'form-ensen-step1'
  const form_ensen_steps_id = [
    form_ensen_step_one_id,
  ]
  const btn_search_id = 'form-ensen-submit'
  const btn_disabled_class = '--is-disabled'
  let checkboxes = []

  // 「選択・検索」ボタンのクラスをトグル
  const toggleBtnClass = (el, status) => {
    const is_disabled = !status
    el.classList.toggle(btn_disabled_class, is_disabled)
    if (is_disabled) {
      el.setAttribute('disabled', 'disabled')
    } else {
      el.removeAttribute('disabled')
    }
  }

  // チェックボックス操作のコールバック関数
  // 役割: 沿線の選択の場合 - 「選択・検索」ボタンのクラスをトグルする
  function checkboxCallback() {
    console.log(this)
    const obj = this
    const status = obj.checker.getStatus()
    const formId = obj.formId

    switch (formId) {
      // 沿線の選択の場合 - 選択・検索ボタンのクラスをトグル
      case form_ensen_step_one_id:
        const el = document.querySelector(`#${btn_search_id}`)
        toggleBtnClass(el, status)
      //それ以外の場合
      default:
        break;
    }
  }

  // チェックボックスのステータスチェック
  const checkboxStatus = () => {
    if (checkboxes.length === 0) return
    checkboxes.forEach(obj => {
      const cb = checkboxCallback.bind(obj)
      obj.elements.forEach(checkbox => {
        checkbox.addEventListener('change', cb)
      })
      // １つだけ取り出して、初期チェックを走らせる
      obj.elements[0].dispatchEvent(new Event('change'))
    })
  }

  // チェックボックスの取得
  const getCheckboxes = (forms) => {

    forms.forEach(form => {
      const id = form.id
      let _checkboxes

      try {
        if (!id) {
          throw new Error('Please provide form id')
        }
        // そもそもチェックボックスの確認対象のフォームかどうか調べる
        if (!form_ensen_steps_id.includes(id)) {
          throw new Error('This form is not set for checkbox checks')
        }
        // チェックボックス取得 - 対象のものだけ
        _checkboxes = form.querySelectorAll('input[type=checkbox][data-js-checkbox-target]')
        if (_checkboxes.length === 0) {
          throw new Error('Target checkbox does not exist.')
        }
      } catch (err) {
        console.log(err.message)
        return
      }

      checkboxes.push({
        formId: id,
        checker: new RF_GLOBALS.RfCheckboxStatus(form, _checkboxes),
        elements: _checkboxes,
      })

    })

    checkboxStatus()

  }




  const init = () => {
    getCheckboxes(forms)
  }

  init()

}

export default rf_search_ensen_checkbox