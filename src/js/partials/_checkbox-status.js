/**
 * Checkbox Status - チェックボックスのステータスを確認する
 * constructor
 * @param {HTMLFormElement} form
 * @param {HTMLInputElement[]} checkboxes
 */
class RfCheckboxStatus {
  #form;
  #checkboxes;
  #checkBoxObj = {
    status: null,
    elements: null
  };
  #store;

  #validator = {
    get(target, key) {
      console.log("target&key: ", target, key);
      const status = Array.prototype.slice
        .call(target["elements"])
        .some((x) => x.checked);
      console.log(target["elements"]);
      console.log(status);
      target[key] = status;
      return target[key];
    }
  };

  constructor(form, checkboxes) {
    if (!form || !checkboxes) throw new Error("No Form selected!");
    console.log("yes checkboxes!");
    this.#form = form;
    this.#checkboxes = checkboxes;
    this.#checkBoxObj["elements"] = this.#checkboxes;
    this.#store = new Proxy(this.#checkBoxObj, this.#validator);
    // this.#cb = cb
  }


  getStatus() {
    return this.#store.status;
  }
}

export default RfCheckboxStatus