// Write ownership for the Phase 2A codemods. Everything outside this list is
// read for the census but never modified, so a bulk pass cannot wander into
// another work package's files.

import path from 'node:path'
import { REPO, walk, rel } from './files.mjs'

const OWNED_ROOTS = [
  'src/v2/foundation',
  'src/components/figma',
  'src/screens',
]

const OWNED_FILES = ['src/index.css']

// Reserved for later packages, and the token module itself is the source of
// truth rather than a target.
const EXCLUDED = [
  'src/v2/foundation/primitives/StudyWorkspacePrimitives.jsx',
  'src/v2/foundation/primitives/SegmentationFlowPrimitives.jsx',
  'src/v2/foundation/tokens/colors.ts',
]

export function isOwned(file) {
  const r = rel(file).replace(/\\/g, '/')
  if (EXCLUDED.includes(r)) return false
  if (OWNED_FILES.includes(r)) return true
  return OWNED_ROOTS.some((root) => r.startsWith(root + '/'))
}

export function ownedFiles() {
  const all = [
    ...OWNED_ROOTS.flatMap((r) => walk(path.join(REPO, r), ['.js', '.jsx', '.ts', '.tsx', '.css'])),
    ...OWNED_FILES.map((f) => path.join(REPO, f)),
  ]
  return [...new Set(all)].filter(isOwned).sort()
}
