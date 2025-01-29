// 検索 - エリアのチェックボックス制御

import RfCheckBoxCombo from "./_checkbox-combo"

const rf_search_area_checkbox = () => {
  // const forms = document.querySelectorAll('[data-js-form-search-area-checkbox]')
  const forms = document.querySelectorAll('[data-js-form-search-area-checkbox]')
  const form_search_area_id = 'sys-form'
  const form_search_area_ids = [
    form_search_area_id,
  ]
  // const btn_search_id = 'form-ensen-submit'
  // const checkbox_group_name = 'data-js-checkboox-combo-group'
  const checkbox_target_name = 'data-js-checkbox-combo-target'
  const btn_disabled_class = '--is-disabled'
  let checkboxes = []


  // チェックボックスコンボフォームを取得する
  const getCheckboxCombo = () => {
    forms.forEach(form => {
      const id = form.id
      let _checkboxes

      try {
        if (!id) {
          throw new Error('Please provide form id')
        }
        // そもそもチェックボックスの確認対象のフォームかどうか調べる
        if (!form_search_area_ids.includes(id)) {
          throw new Error('This form is not set for checkbox checks')
        }
        // チェックボックス取得 - 対象のものだけ
        _checkboxes = form.querySelectorAll(`input[type=checkbox][${checkbox_target_name}]`)
        if (_checkboxes.length === 0) {
          throw new Error('Target checkbox does not exist.')
        }
      } catch (err) {
        console.log(err.message)
        return
      }

      new RF_GLOBALS.RfCheckBoxCombo(form)

    })
  }


  const init = () => {
    getCheckboxCombo(forms)
  }

  init()
}

export default rf_search_area_checkbox;