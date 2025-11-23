class Renderer {
  constructor() {
    this.container = document.getElementById("canvas-container")
    if (!this.container) {
      console.error("[v0] Canvas container not found")
      return
    }

    console.log("[v0] Initializing Renderer")
    this.scene = new window.Scene(this.container)

    // Wait for scene initialization
    setTimeout(() => {
      if (this.scene.scene) {
        console.log("[v0] Scene initialized, setting up managers")
        this.tubeManager = new window.TubeManager(this.scene)
        this.inputHandler = new window.InputHandler(this.scene, this.tubeManager)
        this.historyManager = new window.HistoryManager(50)
        this.ui = new window.UI(this.tubeManager, this.inputHandler, this.historyManager)
      }
    }, 150)
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM Content Loaded event fired")
  console.log("[v0] Document ready state:", document.readyState)

  const container = document.getElementById("canvas-container")
  console.log("[v0] Canvas container found:", !!container)
  if (container) {
    console.log("[v0] Container dimensions:", container.clientWidth, "x", container.clientHeight)
  }

  new Renderer()
})
