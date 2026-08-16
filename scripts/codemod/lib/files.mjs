import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'archive', 'test-results'])

export function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, exts, out)
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(p)
  }
  return out
}

export function sourceFiles(root = path.join(REPO, 'src')) {
  return walk(root, ['.js', '.jsx', '.ts', '.tsx', '.css'])
}

export const rel = (p) => path.relative(REPO, p)

export function readWrite(file, transform, { dry }) {
  const before = fs.readFileSync(file, 'utf8')
  const after = transform(before)
  if (after === before) return 0
  if (!dry) fs.writeFileSync(file, after)
  return 1
}
