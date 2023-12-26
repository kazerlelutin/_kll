export const textToRender = {
  render(_state, el, key) {
    console.log("exemple, the render key", key)
    const countEl = el.querySelector("[data-count]")
    const btnState = el.getState("my_button")
    countEl.innerHTML = btnState.count
  },
}
