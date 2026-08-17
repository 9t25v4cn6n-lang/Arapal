import { colors, radius, spacing, typography } from '../tokens'

/**
 * Contrast-safe background/foreground pairs for a step badge.
 *
 * The pairing lives here rather than at each call site because the call sites
 * had got it wrong in a way nobody could see by eye: `complete` drew white text
 * on an 18%-opacity blue, which resolves to roughly #DDE8FB over the page — a
 * 1.2:1 ratio, invisible. `pending` drew textFaint, which the token file already
 * marks DECORATIVE AND ICON USE ONLY.
 *
 * A caller now names a state and cannot mismatch the pair.
 */
const STEP_BADGE_TONES = {
  current: { background: colors.accentBase, color: '#FFFFFF' },
  complete: { background: colors.accentMist, color: colors.accentStrong },
  pending: { background: colors.bgBottom, color: colors.textMuted },
}

export function StepNumberBadge({ children, tone = 'pending', background, color, style = {} }) {
  const paired = STEP_BADGE_TONES[tone] ?? STEP_BADGE_TONES.pending

  return (
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: radius.pill,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: typography.eyebrowLabel.fontFamily,
        // 11px is the type floor [DECISION]. Was 10px, on every step of every
        // screen in the segmentation flow.
        fontSize: '11px',
        fontWeight: 700,
        lineHeight: typography.eyebrowLabel.lineHeight,
        letterSpacing: '0.01em',
        background: background ?? paired.background,
        color: color ?? paired.color,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default function StepBar({ steps = [], currentIndex = 0, debugItem }) {
  return (
    <div
      data-debug-item={debugItem}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {steps.map((item, index) => {
        const state = index === currentIndex ? 'current' : index < currentIndex ? 'complete' : 'pending'

        return (
          <div key={item.id ?? item.label ?? index} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8] }}>
            <StepNumberBadge tone={state}>
              {index + 1}
            </StepNumberBadge>
            <span
              style={{
                ...typography.eyebrowLabel,
                // textSoft is the lightest value permitted for text; textFaint
                // is decorative only, and the 0.82 opacity on top of it took the
                // pending label further below AA rather than nearer it.
                color: state === 'complete' ? colors.textBody : colors.textSoft,
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                style={{
                  width: '32px',
                  height: '1px',
                  background: colors.lineSoft,
                }}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
