import "../public/style.css"

import { kll } from "./libs/kll.js"
;(async () => {
  kll({
    id: "app",
    routes: {
      "/": await import("./pages/index.html?raw"),
      "/home": await import("./pages/home.html?raw"),
    },
  })
})()
