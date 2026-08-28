import { useEffect, useRef, useState } from 'react'
import { Download, ShieldCheck, Trash2, Upload, X } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'
import { actions } from '../../data'
import { clearAiConfig, resetAiHealth } from '../../services/ai'

/**
 * Local-first trust contract (Programme 8).
 *
 * A compact data-controls dialog — NOT a standalone Settings app — that lets a
 * user back up, restore, delete one project's worth of nothing, or wipe every
 * trace of Arapal from this device, and states plainly that their study data and
 * their API key live only in this browser. It drives the store's versioned
 * export/import and never claims success on a failed local write.
 *
 * AppV2 remounts this via a `key` tied to open state, so its state is fresh each
 * time it opens.
 */
export default function DataControlsDialog({ open, onClose }) {
  const [status, setStatus] = useState(null) // { tone: 'good'|'bad', text }
  const [confirmingWipe, setConfirmingWipe] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleExport = () => {
    try {
      const backup = actions.exportBackup()
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const stamp = new Date().toISOString().slice(0, 10)
      const a = document.createElement('a')
      a.href = url
      a.download = `arapal-backup-${stamp}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setStatus({ tone: 'good', text: 'Backup downloaded to this device.' })
    } catch {
      setStatus({ tone: 'bad', text: 'Could not create the backup file.' })
    }
  }

  const handleRestoreFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const res = actions.importBackup(String(reader.result))
      setStatus(res.ok
        ? { tone: 'good', text: 'Backup restored. Your projects are back.' }
        : { tone: 'bad', text: res.error || 'The backup could not be restored.' })
    }
    reader.onerror = () => setStatus({ tone: 'bad', text: 'The file could not be read.' })
    reader.readAsText(file)
  }

  const handleWipe = () => {
    if (!confirmingWipe) { setConfirmingWipe(true); return }
    const res = actions.deleteAllData()
    // The key/health live outside the store; clear them here so "delete all" is
    // truthful about everything on this device.
    try { clearAiConfig(); resetAiHealth() } catch { /* best effort */ }
    setConfirmingWipe(false)
    setStatus(res.ok
      ? { tone: 'good', text: 'All local Arapal data and your API key were deleted from this device.' }
      : { tone: 'bad', text: 'Could not fully clear this device — try again.' })
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.44)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: spacing[16],
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Data and privacy"
        style={{
          width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
          background: colors.surfacePrimary,
          border: `1px solid ${colors.borderSoft}`,
          borderRadius: radius[24],
          boxShadow: '0 32px 64px rgba(15, 23, 42, 0.20)',
          padding: spacing[24],
          display: 'grid', gap: spacing[16],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[12] }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
            <ShieldCheck size={18} strokeWidth={1.9} color={colors.accentStrong} />
            <h2 style={{ ...typography.sectionTitle, margin: 0, color: colors.textStrong }}>Data &amp; privacy</h2>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colors.textSoft, padding: spacing[4], lineHeight: 0 }}
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
          Everything in Arapal — your projects, translations, notes, results, and your
          AI provider key — is stored only in this browser on this device. Nothing is
          sent to an Arapal server. Back it up to keep it safe, or move it to another
          device.
        </p>

        {status ? (
          <p
            role="status"
            style={{
              ...typography.metaText, margin: 0,
              color: status.tone === 'bad' ? colors.reviewStrong : colors.successStrong,
            }}
          >
            {status.text}
          </p>
        ) : null}

        <DataRow
          icon={<Download size={16} strokeWidth={1.9} />}
          title="Export a backup"
          detail="Download all your data as a single file."
          actionLabel="Export"
          onClick={handleExport}
        />

        <DataRow
          icon={<Upload size={16} strokeWidth={1.9} />}
          title="Restore a backup"
          detail="Replace everything on this device with a backup file."
          actionLabel="Choose file"
          onClick={() => fileRef.current?.click()}
        />
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleRestoreFile} style={{ display: 'none' }} />

        <div style={{ height: 1, background: colors.lineSoft, margin: `${spacing[4]} 0` }} />

        <DataRow
          icon={<Trash2 size={16} strokeWidth={1.9} />}
          title="Delete all local data"
          detail={confirmingWipe
            ? 'This permanently deletes every project and your API key from this device. This cannot be undone.'
            : 'Remove every project and your API key from this device.'}
          actionLabel={confirmingWipe ? 'Delete everything' : 'Delete all'}
          danger
          onClick={handleWipe}
        />
        {confirmingWipe ? (
          <button
            type="button"
            onClick={() => setConfirmingWipe(false)}
            style={{
              justifySelf: 'end', border: 'none', background: 'transparent',
              color: colors.textSoft, font: 'inherit', cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  )
}

function DataRow({ icon, title, detail, actionLabel, onClick, danger = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16], justifyContent: 'space-between' }}>
      <div style={{ display: 'grid', gap: spacing[4], minWidth: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], ...typography.sectionTitle, color: colors.textStrong }}>
          <span style={{ color: danger ? colors.reviewStrong : colors.accentStrong, lineHeight: 0 }}>{icon}</span>
          {title}
        </span>
        <span style={{ ...typography.metaText, color: colors.textSoft }}>{detail}</span>
      </div>
      <button
        type="button"
        onClick={onClick}
        style={{
          flex: '0 0 auto',
          border: `1px solid ${danger ? colors.reviewStrong : colors.lineStrong}`,
          background: danger ? colors.reviewStrong : colors.surfacePrimary,
          color: danger ? colors.surfacePrimary : colors.textStrong,
          borderRadius: radius.pill,
          padding: `${spacing[8]} ${spacing[16]}`,
          font: 'inherit', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {actionLabel}
      </button>
    </div>
  )
}
