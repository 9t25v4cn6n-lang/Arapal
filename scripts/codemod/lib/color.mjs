// Colour maths for the token codemod.
//
// Nearest-match is a DISCOVERY mechanism, not a licence to repaint. Distance is
// measured as CIE76 ΔE in Lab, because RGB euclidean distance wildly
// misrepresents perceptual difference in the dark end of a neutral ramp — the
// exact place this codebase drifted (#0F172A vs #111827).

export function parseHex(hex) {
  let h = hex.replace('#', '').toLowerCase()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return null
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function normaliseHex(hex) {
  const rgb = parseHex(hex)
  if (!rgb) return null
  return '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('')
}

function srgbToLinear(c) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function rgbToXyz([r, g, b]) {
  const [R, G, B] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]
  return [
    R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    R * 0.2126729 + G * 0.7151522 + B * 0.0721750,
    R * 0.0193339 + G * 0.1191920 + B * 0.9503041,
  ]
}

const WHITE = [0.95047, 1.0, 1.08883]

export function rgbToLab(rgb) {
  const xyz = rgbToXyz(rgb)
  const f = xyz.map((v, i) => {
    const t = v / WHITE[i]
    return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116
  })
  return [116 * f[1] - 16, 500 * (f[0] - f[1]), 200 * (f[1] - f[2])]
}

/** CIE76 ΔE. ~1.0 is the just-noticeable difference for adjacent patches. */
export function deltaE(hexA, hexB) {
  const a = parseHex(hexA)
  const b = parseHex(hexB)
  if (!a || !b) return Infinity
  const la = rgbToLab(a)
  const lb = rgbToLab(b)
  return Math.hypot(la[0] - lb[0], la[1] - lb[1], la[2] - lb[2])
}

/** WCAG relative luminance, so a mapping can be checked for contrast drift. */
export function luminance(hex) {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

export function contrastRatio(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

export function nearest(hex, palette) {
  let best = null
  for (const [name, value] of Object.entries(palette)) {
    const d = deltaE(hex, value)
    if (!best || d < best.deltaE) best = { name, value, deltaE: d }
  }
  return best
}
