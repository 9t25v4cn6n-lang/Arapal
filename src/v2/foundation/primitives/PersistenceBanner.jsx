import { usePersistenceHealthy } from '../../data'
import { colors, spacing, typography } from '../tokens'

/**
 * Honest persistence-failure banner (R-019).
 *
 * The store already reports whether the last write actually landed
 * (persistenceHealthy), but no screen consumed it — so on a device where storage
 * is unavailable (private mode, quota full), work was accepted and the UI stayed
 * silent while nothing was being saved. This surfaces that truth globally: a
 * calm, persistent notice so a "saved" claim elsewhere cannot mislead.
 */
export default function PersistenceBanner() {
  const healthy = usePersistenceHealthy()
  if (healthy) return null
  return (
    <div
      role="alert"
      style={{
        padding: `${spacing[8]} ${spacing[16]}`,
        background: colors.review,
        color: colors.surfacePrimary,
        textAlign: 'center',
        borderBottom: `1px solid ${colors.borderSoft}`,
      }}
    >
      <span style={{ ...typography.metaText, color: colors.surfacePrimary }}>
        This device isn’t saving your work right now (private mode or storage is full).
        Recent changes may be lost — copy anything important elsewhere.
      </span>
    </div>
  )
}
