/**
 * Corner radii.
 *
 * The fine steps below 12 exist for compact controls — a 24px badge with a 12px
 * radius is a pill, not a rounded rectangle — and the ones between the coarse
 * steps exist because the design already used them. They were being referenced
 * before they were declared, which meant `border-radius: undefined`: an invalid
 * declaration the browser drops entirely, leaving a square corner where a
 * rounded one was specified, on Research, Study and the segmentation flow.
 *
 * `scripts/qa/lint-tokens.mjs` fails the build on any undeclared key.
 */
export const radius = {
  8: '8px',
  10: '10px',
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  32: '32px',
  pill: '999px',
}
