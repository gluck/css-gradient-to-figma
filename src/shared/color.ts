import hexRgbLib, { RgbaObject as RGBALib } from "hex-rgb"
import rgbToHexLib from "rgb-hex"
import { parse as parseGradient, GradientNode } from "gradient-parser"
import { rotate, translate, compose } from "transformation-matrix"

export function hexToRgb(hex: string): RGB {
  console.log("trying to conver hex to rgb", { hex })
  const converted = hexRgbLib(hex) as RGBALib
  console.log("successfully converted hex to rgb", { converted })
  return { r: converted.red / 255.0, g: converted.green / 255.0, b: converted.blue / 255.0 }
}

export function hexToRgba(hex: string): RGBA {
  return { ...hexToRgb(hex), a: 1.0 }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const converted = rgbToHexLib(r * 255, g * 255, b * 255)
  return `#${converted}`
}

export function rgbaToFigmaRgba([r, g, b, a]: [string, string, string, string?]): RGBA {
  return { r: Number(r) / 255.0, g: Number(g) / 255.0, b: Number(b) / 255.0, a: Number(a) || 1.0 }
}

export function cssToFigmaGradient(css: string): GradientPaint {
  console.log("trying to parse gradient", css)
  const parsedGradient = parseGradient(css.replace(/;$/, ""))[0]
  console.log("parsedGradient", parsedGradient)

  let gradientTransform: Transform = [
    [1, 0, 0],
    [0, 1, 0]
  ]

  // CSS has a top-down default, figma has a right-left default when no angle is specified
  let rotationAngle = -Math.PI / 2.0
  const moveMatrix = [
    [1, 0, 0.5],
    [0, 1, -0.5]
  ]
  const rotationMatrix = [
    [Math.cos(rotationAngle), -Math.sin(rotationAngle), 0],
    [Math.sin(rotationAngle), Math.cos(rotationAngle), 0]
  ]
  // gradientTransform = math.multiply(gradientTransform, rotationMatrix) as Transform
  gradientTransform = rotationMatrix as Transform

  const figmaGradient: GradientPaint = {
    type: cssToFigmaGradientTypes(parsedGradient.type),
    gradientStops: parsedGradient.colorStops.map((stop, index) => ({
      position: (index + 1.0) / parsedGradient.colorStops.length,
      color:
        stop.type === "hex"
          ? hexToRgba(stop.value)
          : stop.type === "literal"
          ? hexToRgba("#000000")
          : rgbaToFigmaRgba(stop.value)
    })),
    gradientTransform: gradientTransform
  }

  return figmaGradient
}

export function cssToFigmaGradientTypes(
  type: GradientNode["type"]
): "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND" {
  switch (type) {
    case "linear-gradient":
      return "GRADIENT_LINEAR"
    case "radial-gradient":
      return "GRADIENT_RADIAL"
    case "repeating-linear-gradient":
      return "GRADIENT_LINEAR"
    case "repeating-radial-gradient":
      return "GRADIENT_RADIAL"
    default:
      throw "unsupported gradient type"
  }
}
