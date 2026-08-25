import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Check, ShieldCheck } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'
import { isAiConfigured, readAiConfig, writeAiConfig, clearAiConfig } from '../../services/ai'
import PrimaryCTA from './PrimaryCTA'

// The one provider Arapal V1 ships an adapter for. Stated plainly in the UI so a
// user knows exactly whose terms their study content is sent under, and so this
// is a single place to extend when another provider is added.
const SUPPORTED_PROVIDER = { id: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-2.0-flash' }

/**
 * The BYO-key AI configuration experience (IP-09).
 *
 * A normal user could not turn AI on without editing localStorage by hand; every
 * AI feature was therefore permanently, if honestly, unavailable. This is the
 * smallest professional surface that closes that: it drives the existing
 * provider-neutral config layer (writeAiConfig / clearAiConfig), stores the key
 * only in local browser storage per the V1 security decision, and states exactly
 * what AI needs, which provider is supported, whether a key is saved, and that
 * validity is confirmed on first real use — it never fakes a working state.
 */
// AppV2 remounts this via a `key` tied to open state, so these lazy initialisers
// read the REAL stored config fresh every time the dialog opens — no effect has
// to sync component state to storage, which is what triggered cascading renders.
export default function AiConfigDialog({ open, onClose }) {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(() => readAiConfig()?.model || '')
  const [configured, setConfigured] = useState(() => isAiConfigured())
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const keyInputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    keyInputRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSave = () => {
    const key = apiKey.trim()
    if (!key) {
      // Honest, recoverable: an empty key is refused with a reason, not saved as
      // a broken configuration.
      setError('Enter your provider API key to enable AI.')
      return
    }
    const ok = writeAiConfig({
      provider: SUPPORTED_PROVIDER.id,
      apiKey: key,
      model: model.trim() || SUPPORTED_PROVIDER.defaultModel,
    })
    if (!ok) {
      setError('This device could not save the key (private mode or storage is full).')
      return
    }
    setConfigured(true)
    setApiKey('')
    setError('')
    setSaved(true)
  }

  const handleRemove = () => {
    clearAiConfig()
    setConfigured(false)
    setApiKey('')
    setSaved(false)
    setError('')
  }

  const labelStyle = { ...typography.eyebrowLabel, color: colors.textMuted, display: 'block', marginBottom: spacing[8] }
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: `${spacing[12]} ${spacing[16]}`,
    border: `1px solid ${colors.borderSoft}`, borderRadius: radius[12],
    background: colors.surfaceSoft, color: colors.textStrong,
    ...typography.bodyText,
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
        aria-label="AI provider setup"
        style={{
          width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto',
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
            <Sparkles size={18} strokeWidth={1.9} color={colors.accentStrong} />
            <h2 style={{ ...typography.sectionTitle, margin: 0, color: colors.textStrong }}>AI provider setup</h2>
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

        <span
          style={{
            justifySelf: 'start',
            display: 'inline-flex', alignItems: 'center', gap: spacing[8],
            padding: `${spacing[4]} ${spacing[12]}`, borderRadius: radius.pill,
            background: colors.surfaceSoft,
            border: `1px solid ${colors.borderSoft}`,
            color: configured ? colors.successStrong : colors.textSoft,
            ...typography.metaText,
          }}
        >
          {configured ? <Check size={14} strokeWidth={2.2} /> : null}
          {configured ? 'AI is configured' : 'AI is not configured'}
        </span>

        <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
          Arapal’s AI features — Study grading, segment Discussion, Research answers,
          and Exam grading — need an AI provider. They stay unavailable until you add
          a key, and nothing is sent anywhere until you do.
        </p>

        <div>
          <span style={labelStyle}>Supported provider</span>
          <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: spacing[8], background: colors.surfaceSoft, color: colors.textBody }}>
            <Sparkles size={15} strokeWidth={1.9} color={colors.accentStrong} />
            {SUPPORTED_PROVIDER.label}
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="ai-config-key">API key</label>
          <input
            id="ai-config-key"
            ref={keyInputRef}
            type="password"
            autoComplete="off"
            value={apiKey}
            onChange={(event) => { setApiKey(event.target.value); setError(''); setSaved(false) }}
            placeholder={configured ? 'A key is saved — enter a new one to replace it' : 'Paste your Gemini API key'}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="ai-config-model">Model (optional)</label>
          <input
            id="ai-config-model"
            type="text"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder={SUPPORTED_PROVIDER.defaultModel}
            style={inputStyle}
          />
        </div>

        {error ? (
          <p role="alert" style={{ ...typography.metaText, margin: 0, color: colors.critical }}>{error}</p>
        ) : null}
        {saved ? (
          <p role="status" style={{ ...typography.metaText, margin: 0, color: colors.successStrong }}>
            Key saved. AI features will use it the next time you run them; if the key is wrong, they report an honest error rather than a fake result.
          </p>
        ) : null}

        <p style={{ ...typography.metaText, margin: 0, color: colors.textSoft, display: 'flex', gap: spacing[8], alignItems: 'flex-start' }}>
          <ShieldCheck size={14} strokeWidth={1.9} style={{ flex: '0 0 auto', marginTop: '2px' }} />
          <span>
            Your key is stored only on this device and is sent only to {SUPPORTED_PROVIDER.label} when
            you use an AI feature. It is never bundled into the app or logged. Its
            validity is confirmed the first time an AI feature runs.
          </span>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12], flexWrap: 'wrap' }}>
          {configured ? (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                border: `1px solid ${colors.borderSoft}`, background: 'transparent',
                color: colors.textSoft, borderRadius: radius.pill,
                padding: `${spacing[8]} ${spacing[16]}`, cursor: 'pointer',
                ...typography.controlLabel,
              }}
            >
              Remove key
            </button>
          ) : <span />}
          <PrimaryCTA icon={<Check size={16} strokeWidth={2} />} minWidth={160} height={44} onClick={handleSave}>
            Save key
          </PrimaryCTA>
        </div>
      </div>
    </div>
  )
}
