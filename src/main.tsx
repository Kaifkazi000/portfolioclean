import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import Lenis from "@studio-freight/lenis"

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  syncTouch: true, // keep native inertia on mobile
  autoRaf: true, // 60/120 fps automatically
})

// Mobile-first optimization: disable on small screens for native speed
const checkMobile = () => {
  if (window.matchMedia("(max-width: 767px)").matches) {
    lenis.destroy()
  }
}

// Check on load and resize
checkMobile()
window.addEventListener("resize", checkMobile)

// Add will-change transform when Lenis is active
document.documentElement.style.willChange = "transform"

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  lenis.destroy()
  document.documentElement.style.willChange = "auto"
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
