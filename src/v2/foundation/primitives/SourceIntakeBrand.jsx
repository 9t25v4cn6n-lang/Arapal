import { Scissors } from 'lucide-react'
import { colors, radius, spacing } from '../tokens'

export default function SourceIntakeBrand({
  title = 'Source Intake',
  subtitle = 'Segmentation',
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[12],
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: radius.pill,
          border: `1px solid ${colors.lineStrong}`,
          background: `linear-gradient(180deg, ${colors.accentWash} 0%, ${colors.accentMist} 100%)`,
          color: colors.accentBase,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 16px 28px rgba(37, 99, 235, 0.12)',
          flexShrink: 0,
        }}
      >
        <Scissors size={16} strokeWidth={1.9} />
      </div>
      <div style={{ display: 'grid', gap: '3px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: colors.textStrong,
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            lineHeight: 1,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textSoft,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}
