// How a literal earns a token.
//
// A blind ΔE ceiling is the wrong instrument on its own: it happily proposes
// #E2E8F0 (a divider grey) -> bgBottom (a page-gradient stop) at ΔE3.9 while
// refusing #6B7280 -> textSoft at ΔE6.0, which is the single drift this codebase
// most needs collapsed. So the ceiling is gated by hue family:
//
//   SUB-JND     ΔE <= 2.5, any hue          — imperceptible, always safe.
//   NEUTRAL     both chroma < 18, ΔE <= 7   — the slate/gray dialect collision.
//   SAME-HUE    hue delta <= 20deg, ΔE <= 5 — a stray blue rejoining the accents.
//
// Anything else is reported, never guessed. Coloured hues with no token family
// (orange, purple, indigo, emerald, red) can therefore never be captured by a
// neutral or a blue.

import { rgbToLab, parseHex, deltaE } from './color.mjs'

export const CEILINGS = { subJnd: 2.5, neutral: 7.0, sameHue: 5.0 }
const NEUTRAL_CHROMA = 18
const HUE_TOLERANCE_DEG = 20
// Chroma alone is not enough to call something neutral: at very high lightness
// chroma compresses, so #FFF7ED (an orange-50 wash) measures chroma 5.8 and a
// bare chroma gate happily flattened it to pure white. Every genuine neutral in
// this product sits on one blue-grey axis; the false positives were warm, red,
// green and purple washes. So a neutral mapping must also keep its hue, and may
// never strip a tint off onto an achromatic target.
const NEUTRAL_HUE_TOLERANCE_DEG = 30
const HUE_MEANINGFUL_CHROMA = 3

export function chroma(hex) {
  const [, a, b] = rgbToLab(parseHex(hex))
  return Math.hypot(a, b)
}

export function hueDeg(hex) {
  const [, a, b] = rgbToLab(parseHex(hex))
  return (Math.atan2(b, a) * 180) / Math.PI
}

function hueDelta(a, b) {
  const d = Math.abs(hueDeg(a) - hueDeg(b)) % 360
  return d > 180 ? 360 - d : d
}

/**
 * Decide whether `hex` may become `token`. Returns a reason string when it may,
 * or null when it must be reported instead.
 */
export function classify(hex, tokenValue) {
  const d = deltaE(hex, tokenValue)
  if (hex === tokenValue) return { rule: 'exact', deltaE: 0 }
  if (d <= CEILINGS.subJnd) return { rule: 'sub-jnd', deltaE: d }

  const cHex = chroma(hex)
  const cTok = chroma(tokenValue)
  // Hue is numerical noise below HUE_MEANINGFUL_CHROMA. If the literal carries a
  // hue the token must carry a comparable one — otherwise the tint is being
  // stripped, whether the target is pure white or merely a paler near-neutral.
  // A literal that carries no hue may always join a tinted ramp step.
  const hueHeld =
    cHex < HUE_MEANINGFUL_CHROMA ||
    (cTok >= HUE_MEANINGFUL_CHROMA && hueDelta(hex, tokenValue) <= NEUTRAL_HUE_TOLERANCE_DEG)

  const neutral = cHex < NEUTRAL_CHROMA && cTok < NEUTRAL_CHROMA
  if (neutral && hueHeld && d <= CEILINGS.neutral) return { rule: 'neutral-ramp', deltaE: d }
  if (!neutral && hueDelta(hex, tokenValue) <= HUE_TOLERANCE_DEG && d <= CEILINGS.sameHue) {
    return { rule: 'same-hue', deltaE: d }
  }
  return null
}

/** Best legal token for a literal, or null. */
export function resolve(hex, palette) {
  let best = null
  for (const [name, value] of Object.entries(palette)) {
    const verdict = classify(hex, value)
    if (!verdict) continue
    if (!best || verdict.deltaE < best.deltaE) best = { token: name, value, ...verdict }
  }
  return best
}
