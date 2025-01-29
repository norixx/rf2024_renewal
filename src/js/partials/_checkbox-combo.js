// コンボ型のチェックボックス制御

class RfCheckBoxCombo {
  #form;
  #checkboxGroup = [];
  #checkboxCombos = [];

  constructor(form) {
    this.#form = form
    this.#checkboxGroup = Array.from(this.#form.querySelectorAll('[data-js-checkboox-combo-group]'))
    this.#checkboxGroup.forEach(group => {
      this.#checkboxCombos.push({
        parent: group.querySelector('[data-js-checkbox-combo-parent]'),
        elements: Array.from(group.querySelectorAll('[data-js-checkbox-combo-target]'))
      })
    })
    // console.log(this.#checkboxCombos)

    this.#init()
  }

  // フォーム全体でチェックボックスにチェックが入っているかどうかを確認する
  getCheckedStatus = () => {
    const checkedBoxes = this.#form.querySelectorAll('input[type="checkbox"][data-js-checkbox-combo-target]:checked');
    return checkedBoxes.length > 0;
  }

  // グループの親チェックボックスの制御
  setParentCheckbox = () => {
    this.#checkboxCombos.forEach(combo => {
      const parent = combo.parent
      const elements = combo.elements
      parent.addEventListener('change', () => {
        console.log(elements)
        elements.forEach(el => {
          el.checked = parent.checked
        })
      })
    })
  }

  // 子チェックボックスの制御
  setChildCheckbox = () => {
    this.#checkboxCombos.forEach(combo => {
      const parent = combo.parent
      const elements = combo.elements
      elements.forEach(el => {
        el.addEventListener('change', () => {
          // Check if all elements are checked
          const allChecked = elements.every(el => el.checked)
          // Check if at least one element is checked
          const someChecked = elements.some(el => el.checked)

          console.log(el, allChecked, someChecked)
          
          if (allChecked) {
            // If all checkboxes are checked, check the parent
            parent.checked = true
            parent.indeterminate = false
          } else if (someChecked) {
            // If some (but not all) checkboxes are checked, show indeterminate state
            parent.checked = false
            parent.indeterminate = true
          } else {
            // If no checkboxes are checked, uncheck the parent
            parent.checked = false
            parent.indeterminate = false
          }
        })
      })
    })
  }

  #init = () => {
    this.setParentCheckbox()
    this.setChildCheckbox()
  }

}

export default RfCheckBoxCombo