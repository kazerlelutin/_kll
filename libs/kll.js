function injectPage(path) {
  const routes = document.querySelector("#app").routes
  const page = routes[path]?.default
  if (page) {
    const appElement = document.querySelector("#app")
    appElement.innerHTML = page

    // Appeler _hyperscript.processNode sur le nouveau contenu
    _hyperscript.processNode(appElement)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // === COMMANDES ========================================
  _hyperscript.addCommand("navigate", (parser, runtime, tokens) => {
    if (!tokens.matchToken("navigate")) return null

    const expr = parser.requireElement("expression", tokens)

    return {
      args: [expr],
      async op(_ctx, url) {
        window.history.pushState({}, "", url)
        injectPage(url)
        return runtime.findNext(this)
      },
    }
  })

  _hyperscript.addCommand("template", (parser, runtime, tokens) => {
    if (!tokens.matchToken("template")) return null

    const expr = parser.requireElement("expression", tokens)

    return {
      args: [expr],
      async op(ctx, templateName) {
        // Load template
        const raw = await import(`../templates/${templateName}.html?raw`)
        const el = document.createElement("div")
        el.innerHTML = raw.default
        const template = el.querySelector(`#${templateName}`).content
        const componentInstance = document.importNode(template, true)
        const container = document.createElement("div")
        container.appendChild(componentInstance)

        // Current element
        const element = ctx.me
        const children = element.innerHTML

        // Copy attributes
        Object.keys(element.attributes).forEach((key) => {
          const attr = element.attributes[key]
          if (attr.name.includes("data-")) {
            container.firstElementChild.setAttribute(attr.name, attr.value)
          }
        })

        // Replace slot
        if (container.innerHTML.includes("<slot>")) {
          const slot = container.querySelector("slot")
          slot.outerHTML = children
        }

        element.replaceWith(container.firstElementChild)

        _hyperscript.processNode(document.querySelector("#app"))
        return runtime.findNext(this)
      },
    }
  })
})

/**
 * @description Initializes the router and sets up event listeners.
 */
export function kll(routes) {
  const appElement = document.querySelector("#app")
  appElement.routes = routes
  injectPage(window.location.pathname)
}
