import { on, showUI } from "@create-figma-plugin/utilities"
import { cssToFigmaGradient } from "./shared/color"

import { ReqInsertCSSHandler, ResizeWindowHandler } from "./shared/types"

export default function () {
  on<ResizeWindowHandler>(
    "RESIZE_WINDOW",
    function (windowSize: { width: number; height: number }) {
      const { width, height } = windowSize
      figma.ui.resize(width, height)
    }
  )
  showUI({
    height: 120,
    width: 300
  })

  on<ReqInsertCSSHandler>("REQ_INSERT_CSS", function (css: string) {
    createRectangleWithFill(css)
    // testGradientAngles()
    // testRadialGradients()
  })
}

let lastX = 0
let lastY = 0
function createRectangleWithFill(css: string) {
  let target = figma.currentPage.selection[0]
  if (figma.currentPage.selection.length === 0) {
    const rect = figma.createRectangle()
    rect.cornerRadius = 5
    rect.x = lastX
    figma.currentPage.appendChild(rect)
    target = rect
    lastX += 110
  }

  // check if target has fills property
  if ("fills" in target) {
    const gradient = cssToFigmaGradient(css)
    target.fills = [gradient]
  } else {
    figma.notify("Please select a shape or frame with a fill")
  }
  return lastX
}

function testGradientAngles() {
  createRectangleWithFill(
    "linear-gradient(0deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(45deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(90deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(135deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(180deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(225deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(270deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
  createRectangleWithFill(
    "linear-gradient(315deg, rgb(236, 72, 153), rgb(239, 68, 68), rgb(234, 179, 8))"
  )
}

function testRadialGradients() {
  // replace center, center with just center
  createRectangleWithFill(
    "radial-gradient(at center, rgb(253, 230, 138), rgb(124, 58, 237), rgb(12, 74, 110))"
  )
  // createRectangleWithFill(
  //   "radial-gradient(at 50% 50%, rgb(253, 230, 138), rgb(124, 58, 237), rgb(12, 74, 110))"
  // )
  createRectangleWithFill(
    "radial-gradient(rgb(253, 230, 138), rgb(124, 58, 237), rgb(12, 74, 110))"
  )
  // 'radial-gradient(at center top, rgb(253, 230, 138), rgb(124, 58, 237), rgb(12, 74, 110))'
}
