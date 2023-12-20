import "../public/style.css"
import "../public/libs/_hyperscript.min.js"

import { kll } from "../libs/kll.js"

kll({
  "/": await import("./pages/index.html?raw"),
  "/home": await import("./pages/home.html?raw"),
})
