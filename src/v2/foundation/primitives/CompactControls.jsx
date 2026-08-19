import { useState } from 'react'
import { colors, motion, spacing } from '../tokens'
import { compactControl, compactControlShape } from '../tokens/compactControl'

/**
 * The compact-control family: Badge, Chip and GhostButton.
 *
 * One geometry (src/v2/foundation/tokens/compactControl.ts), one set of tones,
 * three components distinguished only by what they are FOR:
 *
 *   Badge        — states a fact. Not interactive. Status, count, tag, meta.
 *   Chip         — a toggle you press. Filters, lenses, mode selectors.
 *   GhostButton  — a secondary action. Subordinate to the screen's primary CTA.
 *
 * These may look different from one another — a filter should not look like a
 * status — but they are variants of one thing, so the differences are the tone
 * and the interaction, never the height, the radius, the type size or the
 * padding. That was the actual defect: the differences were arbitrary.
 */

/**
 * Semantic tones. Text weights come from colors' `-strong` pair, which is the
 * only one that clears 4.5:1 on a tinted surface; the plain semantic colours are
 * for fills and icons and would fail as text.
 */
const tones = {
  neutral: {
    surface: colors.surfacePrimary,
    border: colors.borderSoft,
    text: colors.textMuted,
    icon: colors.textSoft,
  },
  quiet: {
    surface: 'rgba(248, 251, 255, 0.9)',
    border: 'transparent',
    text: colors.textSoft,
    icon: colors.textFaint,
  },
  accent: {
    surface: colors.accentWash,
    border: 'rgba(147, 197, 253, 0.7)',
    text: colors.accentStrong,
    icon: colors.accentBase,
  },
  ready: {
    surface: 'rgba(240, 253, 244, 0.92)',
    border: 'rgba(22, 163, 74, 0.24)',
    text: colors.successStrong,
    icon: colors.success,
  },
  review: {
    surface: 'rgba(255, 251, 235, 0.94)',
    border: 'rgba(217, 119, 6, 0.26)',
    text: colors.reviewStrong,
    icon: colors.review,
  },
  critical: {
    surface: 'rgba(255, 241, 242, 0.94)',
    border: 'rgba(190, 18, 60, 0.22)',
    text: colors.critical,
    icon: colors.critical,
  },
}

function baseStyle({ size, shape, tone, interactive }) {
  const step = compactControl[size]

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${step.gapPx}px`,
    minHeight: `${step.heightPx}px`,
    // minWidth keeps a one-character count (a "3", a "12") from collapsing to a
    // sliver — a round badge, not a vertical stripe.
    minWidth: `${step.heightPx}px`,
    padding: `0 ${step.paddingXPx}px`,
    borderRadius: compactControlShape[shape],
    border: `1px solid ${tone.border}`,
    background: tone.surface,
    color: tone.text,
    ...step.type,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    cursor: interactive ? 'pointer' : 'default',
    transition: `background-color ${motion.micro}, border-color ${motion.micro}, color ${motion.micro}`,
  }
}

/**
 * A fact about something: a status, a count, a tag.
 *
 * Renders a <span>, deliberately. Several of these were <button>s that did
 * nothing, which puts an unusable stop in the keyboard order for every row of a
 * 30-row ledger.
 */
export function Badge({
  children,
  tone: toneName = 'neutral',
  size = 'xs',
  shape = 'pill',
  icon = null,
  title,
  debugItem,
}) {
  const tone = tones[toneName] ?? tones.neutral

  return (
    <span
      data-debug-item={debugItem}
      title={title}
      style={baseStyle({ size, shape, tone, interactive: false })}
    >
      {icon ? <span aria-hidden="true" style={{ display: 'inline-flex', color: tone.icon }}>{icon}</span> : null}
      {children}
    </span>
  )
}

/** A toggle: a filter, a lens, a mode. Pressed state is `active`. */
export function Chip({
  children,
  active = false,
  onClick,
  size = 'sm',
  shape = 'pill',
  icon = null,
  count = null,
  title,
  debugItem,
}) {
  const [hovered, setHovered] = useState(false)
  const tone = active ? tones.accent : tones.neutral
  const step = compactControl[size]

  return (
    <button
      type="button"
      data-debug-item={debugItem}
      title={title}
      aria-pressed={active}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyle({ size, shape, tone, interactive: true }),
        background: active
          ? tones.accent.surface
          : hovered
            ? colors.accentWash
            : tones.neutral.surface,
        borderColor: active
          ? tones.accent.border
          : hovered
            ? 'rgba(147, 197, 253, 0.55)'
            : tones.neutral.border,
        color: active || hovered ? colors.accentStrong : colors.textMuted,
      }}
    >
      {icon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span> : null}
      {children}
      {count !== null ? (
        <span
          aria-hidden="true"
          style={{
            marginInlineStart: spacing[4],
            color: active ? colors.accentBase : colors.textSoft,
            fontVariantNumeric: 'tabular-nums',
            fontSize: `${Math.max(11, step.type.fontSize ? parseFloat(step.type.fontSize) - 1 : 11)}px`,
          }}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

/** A secondary action. Never the screen's primary — that is PrimaryCTA. */
export function GhostButton({
  children,
  onClick,
  size = 'md',
  shape = 'pill',
  icon = null,
  endIcon = null,
  disabled = false,
  title,
  debugItem,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      data-debug-item={debugItem}
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyle({ size, shape, tone: tones.neutral, interactive: !disabled }),
        justifyContent: 'center',
        background: hovered && !disabled ? colors.accentWash : colors.surfacePrimary,
        borderColor: hovered && !disabled ? 'rgba(147, 197, 253, 0.7)' : colors.borderSoft,
        color: disabled ? colors.textFaint : hovered ? colors.accentStrong : colors.textBody,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.92)',
      }}
    >
      {icon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span> : null}
      {children}
      {endIcon ? <span aria-hidden="true" style={{ display: 'inline-flex' }}>{endIcon}</span> : null}
    </button>
  )
}
