import fs from 'node:fs/promises'
import path from 'node:path'

export const REPO_ROOT = process.cwd()
export const V2_ROOT = path.join(REPO_ROOT, 'src', 'v2')
export const SCRIPTS_ROOT = path.join(REPO_ROOT, 'scripts')

export function toProjectPath(absolutePath: string) {
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join('/')
}

export function toPublicFilePath(absolutePath: string) {
  return `/${toProjectPath(absolutePath)}`
}

export async function walkFiles(startDir: string): Promise<string[]> {
  const entries = await fs.readdir(startDir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const nextPath = path.join(startDir, entry.name)
      if (entry.isDirectory()) {
        return walkFiles(nextPath)
      }

      return [nextPath]
    }),
  )

  return files.flat()
}

