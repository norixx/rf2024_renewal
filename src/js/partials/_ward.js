const rf_ward = () => {
  const dataProp = 'jsWardSelect'
  const form = document.querySelector('#sys-form')
  const btns = Array.from(document.querySelectorAll('[data-js-ward-select]'))
  const checkBoxes = btns.filter(btn => btn.tagName === 'INPUT')
  const boundaries = btns.filter(btn => btn.tagName === 'g')
  let currentWards = []
  let selectedWards = []
  const toggleClass = '--is-active'

  // 現在選択中の区
  const getWards = () => {
    return selectedWards
  }

  // １つの区
  // const getWard = ward => {

  // }

  const removeWard = ward => {
    const index = selectedWards.indexOf(ward)
    selectedWards.splice(index, 1)
    console.log('削除後', selectedWards)
  }

  // セット
  const setWard = ward => {
    selectedWards.push(ward)
  }

  // 現在の区
  const getCurrentWards = () => {
    return currentWards
  }
  const setCurrentWards = wards => {
    currentWards = [...wards]
    console.log('前の区', currentWards)
  }


  // チェックボックスのトグル
  const toggleCheckbox = (isAdd, dom) => {
    // 差分チェック
    let differences = null
    if (isAdd) {
      differences = getWards().filter(element => !(getCurrentWards().includes(element)));
    } else {
      differences = getCurrentWards().filter(element => !(getWards().includes(element)));
    }
    console.log('差分', differences)

    //要素チェック
    const isCheckbox = (dom.tagName === 'INPUT')
    console.log('checkbox?', isCheckbox)

    differences.forEach(diff => {
      console.log('差分', diff)
      const [selectedBoundary] = boundaries.filter(bound => bound.dataset[dataProp] === diff)
      const [selectedCheckbox] = checkBoxes.filter(checkbox => checkbox.dataset[dataProp] === diff)
      console.log('選択された', selectedBoundary, selectedCheckbox)
      selectedBoundary.classList.toggle(toggleClass, isAdd)
      selectedCheckbox.checked = isAdd
    })
  }

  const setToggleAction = () => {
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        let isAdd = true // true or false
        let clickedElm = null
        setCurrentWards(getWards()) //現在の区を一旦保存
        const ward = btn.dataset.jsWardSelect
        if (getWards().includes(ward)) {
          console.log('削除')
          isAdd = false
          removeWard(ward)
        } else {
          console.log('追加')
          setWard(ward)
        }
        console.log('現在', selectedWards)
        console.log('１個前', currentWards)

        // 地図クリックの場合チェックボックスをトグル
        toggleCheckbox(isAdd, btn)
      })
    })
  }

  // すべてのチェックを外す - 画面戻ったときの対策
  const clearAllCheckboxes = () => {
    btns.forEach(btn => {
      console.dir(btn)
      if (btn.tagName === 'INPUT') {
        console.log(btn.checked)
        console.log(btn.defaultChecked)
        btn.setAttribute('autocomplete', 'off')
        btn.checked = false
      }
    })
  }

  const resetForm = () => {
    console.log('reset!')
    form.reset()
  }

  const init = () => {
    // resetForm()
    clearAllCheckboxes()
    // window.addEventListener('load', () => {
    //   console.log('loaded!')
    // })
    setToggleAction()
  }

  init()
}

export default rf_ward