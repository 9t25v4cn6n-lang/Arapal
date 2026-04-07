import crypto from 'node:crypto'
import type { AuditFinding } from '../policy/findingSchema.ts'

export function createFindingFingerprint(parts: Array<string | number | null | undefined>) {
  const normalized = parts.map((part) => (part === null || part === undefined ? '' : String(part))).join('|')
  return crypto.createHash('sha1').update(normalized).digest('hex')
}

export function createFindingId(lane: AuditFinding['lane'], fingerprint: string) {
  return `${lane}:${fingerprint.slice(0, 12)}`
}
