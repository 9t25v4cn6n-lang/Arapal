/**
 * The spacing scale: 4px steps to 24, then coarser.
 *
 * It used to declare only 4/8/12/16/20/24/32/40/48/64 while the codebase asked
 * for `spacing[6]`, `spacing[10]`, `spacing[14]`, `spacing[18]` and
 * `spacing[28]` in 34 places on the production surface. Each of those resolved
 * to `undefined`, so the browser dropped the WHOLE declaration — `padding: 0
 * undefined` is invalid, not "padding: 0". That is why status pills had their
 * text touching the border and several cards had no internal padding at all: a
 * missing token reads on screen as a missing rule, silently, with no error
 * anywhere.
 *
 * The fine steps are declared because the design already used them, not to
 * invite arbitrary values. `scripts/qa/lint-tokens.mjs` fails the build on any
 * key that is not declared here, so the failure can never be silent again.
 */
export const spacing = {
  4: '4px',
  6: '6px',
  8: '8px',
  10: '10px',
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
}
