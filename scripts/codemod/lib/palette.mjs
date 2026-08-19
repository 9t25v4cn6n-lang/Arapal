// The token palette, read from the real token module rather than restated here.
// If a colour is not in src/v2/foundation/tokens/colors.ts it is not a token,
// and the codemod must report it instead of inventing a home for it.

import fs from 'node:fs'
import path from 'node:path'
import { REPO } from './files.mjs'
import { normaliseHex } from './color.mjs'

export const TOKENS_FILE = path.join(REPO, 'src/v2/foundation/tokens/colors.ts')

/** { tokenName: '#rrggbb' } for every hex-valued entry in colors.ts. */
export function loadPalette() {
  const src = fs.readFileSync(TOKENS_FILE, 'utf8')
  const out = {}
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9]+):\s*'(#[0-9a-fA-F]{3,6})'/gm)) {
    out[m[1]] = normaliseHex(m[2])
  }
  return out
}

/** CSS custom property name for a token: accentBase -> --arapal-accent-base. */
export const cssVarName = (token) =>
  '--arapal-' + token.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
