import { createComponent } from "../libs/kll"

export const inception = {
  onInit(_state, el) {
    el.render()
  },
  async render(state, el, listen) {
    if (listen) {
      const { name, key, value } = listen
      if (name === "inception_button" && key === "count") {
        const countEl = el.querySelector("[data-async-count]")
        countEl.innerHTML = value
        return
      }
    }

    console.log("exemple, the render keys", listen)

    const asyncEl = el.querySelector("[data-async]")
    setTimeout(() => {
      asyncEl.replaceWith(
        createComponent("button-count", "buttonCount", "inception_button", { count: 10 })
      )
      asyncEl.innerHTML = `clicks: ${state.count}`
    }, 1000)
  },
}
