function injectPage(path) {
  const routes = document.querySelector("#app").routes
  const page = routes[path]?.default
  if (page) {
    const appElement = document.querySelector("#app")
    appElement.innerHTML = page
    kllT()
  }
}

function getState(id) {
  const el = document.querySelector(`[kll-id='${id}']`)
  return el?.state || {}
}

export async function kllT() {
  const tEl = document.querySelectorAll("[kll-t]")

  for (const tElement of tEl) {
    const attrs = await processAttributes(tElement)
    const containerParent = document.createElement("div")
    containerParent.appendChild(attrs.template)
    const container = containerParent.firstElementChild

    console.log(container)
    // Attache le state au container
    container.state = await handleInitState(attrs.state, container, attrs.ctrl?.render)

    // Attache les attributs au container
    for (const attr in attrs.attrs) {
      container.setAttribute(attr, attrs.attrs[attr])
    }

    container.kllId = attrs.kllId || `${tElement.getAttribute("kll-t")}_${new Date().getTime()}`
    handleAttachMethods(container, attrs.ctrl, container.state)

    // Helper pour récupérer le state d'un autre composant
    container.getState = (id) => getState(id)
    //attache les méthodes du controller au container
    tElement.replaceWith(container)
    container?.onInit?.()
  }
}

async function handleInitState(state, container, render) {
  // Pré-analyse de la fonction render (à optimiser avec une analyse syntaxique réelle)
  const dependencies = render ? getDependencies(render) : null

  return new Proxy(state, {
    set: (target, key, value) => {
      const result = Reflect.set(target, key, value)
      if (dependencies && dependencies.has(key)) {
        container.render()
      }
      handleTriggerState(key, container.kllId)
      return result
    },
  })
}

async function handleTriggerState(key, name) {
  const elements = document.querySelectorAll(`[kll-b*='${name}.${key}']`)
  for (const element of elements) {
    element?.render?.()
  }
}

function getDependencies(renderFunc) {
  const strRender = renderFunc.toString()
  const regex = /\bstate\.(\w+)|\${state\.(\w+)}|\{(\w+)[^}]*\}\s*=\s*state/g
  let match
  const dependencies = new Set()

  while ((match = regex.exec(strRender)) !== null) {
    // match[1] est pour state.key, match[2] pour ${state.key}, et match[3] pour {key} = state
    dependencies.add(match[1] || match[2] || match[3])
  }

  return dependencies
}

async function processAttributes(tElement) {
  const attrs = {
    state: [],
    ctrl: {},
    template: {},
    attrs: {},
    kllId: null,
  }

  for (const attr of tElement.getAttributeNames()) {
    const attrValue = tElement.getAttribute(attr)

    if (attr.startsWith("kll-s")) {
      attrs.state.push({ [attr.slice(6)]: attrValue })
    }
    if (attr === "kll-ctrl") {
      attrs.ctrl = await handleControllerAttribute(attrValue)
    } else if (attr === "kll-t") {
      attrs.template = await handleTemplate(attrValue)
    } else if (attr === "kll-id") {
      attrs.kllId = attrValue
      attrs.attrs["kll-id"] = attrValue
    }

    if (!attr.startsWith("kll-") || attr === "kll-b") {
      attrs.attrs[attr] = attrValue
    }
  }

  if (attrs.ctrl.state) {
    // ceux qui proviennent du ctrl ne sont pas  prioritaires, ils seront écrasés par ceux qui proviennent de l'attribut kll-s
    attrs.state = [
      ...Object.keys(attrs.ctrl.state).map((k) => ({ [k]: attrs.ctrl.state[k] })),
      ...attrs.state,
    ]
  }

  attrs.state = attrs.state.reduce((acc, curr) => {
    return { ...acc, ...curr }
  }, {})
  return attrs
}

async function handleTemplate(templateName) {
  let raw = null
  try {
    raw = await import(`../templates/${templateName}.html?raw`)
  } catch (e) {
    throw new Error(`Template ${templateName} not found`)
  }
  const el = document.createElement("div")
  el.innerHTML = raw.default

  const template = el.querySelector(`#${templateName}`).content
  const componentInstance = document.importNode(template, true)
  const container = document.createElement("div")
  container.appendChild(componentInstance)

  return container.firstElementChild
}

async function handleControllerAttribute(attrValue) {
  let ctrlImp = null

  try {
    ctrlImp = await import(`../ctrl/${attrValue}.js`)
  } catch (e) {
    throw new Error(`Controller ${attrValue} not found`)
  }

  if (!ctrlImp.default && !ctrlImp[attrValue]) {
    throw new Error(`Controller ${attrValue} not found`)
  }

  return ctrlImp.default || ctrlImp[attrValue]
}

function handleAttachMethods(container, ctrl, state) {
  const methods = Object.keys(ctrl)
    .filter((k) => k.startsWith("on"))
    .filter((k) => !k.match(/state|oninit/i))

  if (ctrl.render) {
    container.render = () => ctrl.render(state, container)
  }

  if (ctrl.onInit) {
    container.onInit = () => ctrl.onInit(state, container)
  }

  for (const method of methods) {
    container.addEventListener(method.slice(2).toLocaleLowerCase(), (e) =>
      ctrl[method](state, e.target, e)
    )
  }
}

export function kll({ id, routes }) {
  const appElement = document.getElementById(id)
  appElement.routes = routes
  injectPage(window.location.pathname)
}
