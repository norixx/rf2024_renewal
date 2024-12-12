/**
 * イベントリスナートラッカー
 */
class EventListenerTracker {
/*
内訳: 
eventListeners = WeakMap {
  要素オブジェクト: Map {
    イベントタイプ1: 配列 [ハンドラー, ハンドラー, ...],
    イベントタイプ2: 配列 [], ...
  }
}
*/
  constructor() {
    // WeakMapのkeyに要素オブジェクトを登録し、値にはハンドラーを登録してトラッキングする
    this.eventListeners = new WeakMap();
  }

  add(element, eventType, handler) {
    // 登録がなければ登録する
    if(!this.eventListeners.has(element)) {
      this.eventListeners.set(element, new Map())
    }

    // 要素の登録があるかチェックする。あった場合は Map で作成したオブジェクト(マップ値)が返る
    const elementListeners = this.eventListeners.get(element)
    // 次にその要素にイベントの登録があるかチェックし、なければkeyとして登録する。値はハンドラーを格納する配列
    if(!elementListeners.has(eventType)) {
      elementListeners.set(eventType, [])
    }

    // ハンドラーを配列に追加
    elementListeners.get(eventType).push(handler)

    // イベントリスナーを設定
    element.addEventListener(eventType, handler)

  } //add

  has(element, eventType, handler) {
    // 要素の登録なし return
    if(!this.eventListeners.has(element)) return;

    // イベントの登録なし return
    const elementListeners = this.eventListeners.get(element)
    if(!elementListeners.has(eventType)) return;

    // ハンドラーの登録が配列内にあるかチェック
    return elementListeners.get(eventType).includes(handler)

  } // has

  remove(element, eventType, handler) {
    if (!this.eventListeners.has(element)) return;

    const elementListeners = this.eventListeners.get(element);
    if (!elementListeners.has(eventType)) return;

    const handlers = elementListeners.get(eventType);
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
      element.removeEventListener(eventType, handler);
    }
  } // remove

  // Mapで登録されている全てのイベントリスナーを取得
  getAll(element) {
    if(!this.eventListeners.has(element)) return null;
    return this.eventListeners.get(element);
  }

  // すべてのイベントリスナーを削除（要素の登録も削除）
  removeAll(element) {
    if(!this.eventListeners.has(element)) return;

    const elementListeners = this.eventListeners.get(element);
    elementListeners.forEach((handlers, eventType) => {
      handlers.forEach(handler => {
        element.removeEventListener(eventType, handler);
      });
    });

    this.eventListeners.delete(element);
  }

}

export default EventListenerTracker