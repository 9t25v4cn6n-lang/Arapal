import { ArrowLeft } from 'lucide-react'
import { colors, motion, radius, spacing, typography } from '../tokens'

export default function BackPill({ onClick, children = 'Back', icon = <ArrowLeft size={16} strokeWidth={1.9} />, style = {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius.pill,
        background: 'rgba(255, 255, 255, 0.92)',
        color: colors.textSoft,
        minHeight: '42px',
        padding: '0 22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[8],
        cursor: 'pointer',
        fontFamily: typography.bodyText.fontFamily,
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        boxShadow: '0 1px 0 rgba(255, 255, 255, 0.6) inset',
        transition: `border-color ${motion.micro}, box-shadow ${motion.micro}, color ${motion.micro}, transform ${motion.micro}`,
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  )
}
