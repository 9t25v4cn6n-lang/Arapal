import { colors, spacing, typography } from '../tokens'

/**
 * The shared application header, in three lanes with one meaning each:
 *
 *   start   — who this is. Application identity, then a back control where the
 *             workflow has somewhere to go back to.
 *   centre  — where you are. The mode, or a workflow's own statement of position
 *             (a step bar, a segment counter).
 *   end     — what you can do here. Screen-level actions only.
 *
 * Before this, four screens each decided the composition for themselves: Study
 * put its object title in the start lane, Segmentation put a two-line mode badge
 * in the end lane, the default put a mode label and a monospace tagline in the
 * centre, and Exams had a different bar altogether. The lanes existed; the
 * contract for what belongs in them did not.
 */

/**
 * The mode label. One line.
 *
 * It used to be a two-line lockup: the mode over a monospace description of it —
 * "PROJECT HOME / Your work and one clear next action" above a screen whose own
 * heading already said "Add your first source." A tagline restating the screen
 * you are looking at is marketing copy in an application header, and setting it
 * in a monospace face made it read as a developer readout. The line that carries
 * orientation stays; the line that repeated the page does not.
 */
export function HeaderCenter({ route }) {
  const modeLabel = route?.shell?.header?.modeLabel ?? route?.label ?? 'Arapal'

  return (
    <p
      data-debug-item="header_mode_label"
      style={{
        ...typography.eyebrowLabel,
        margin: 0,
        color: colors.textMuted,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {modeLabel}
    </p>
  )
}

/**
 * A screen's own context line, for the centre lane, when the mode label is not
 * the most useful thing the header could be saying. Study uses it for the
 * segment under work; anything with a named current object should.
 */
export function HeaderContext({ title, detail }) {
  return (
    <div
      data-debug-item="header_context"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: spacing[8],
        minWidth: 0,
      }}
    >
      <span
        style={{
          ...typography.sectionTitle,
          color: colors.textStrong,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </span>
      {detail ? (
        <span
          style={{
            ...typography.metaText,
            color: colors.textSoft,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {detail}
        </span>
      ) : null}
    </div>
  )
}

/**
 * The route hash, for development. It shipped in the product header on every V2
 * screen — useful while building, but it is scaffolding, not product, and it
 * occupied the header lane that should carry project context. Behind the same
 * flag the Study sandbox controls use, so all dev affordances share one switch.
 */
export function HeaderMeta({ route }) {
  const showRouteHash =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('studyDebug') === '1'

  if (!showRouteHash) {
    return null
  }

  return (
    <p
      style={{
        ...typography.monoMeta,
        margin: 0,
        color: colors.textSoft,
      }}
    >
      #{`v2/${route?.id ?? 'projectHome'}`}
    </p>
  )
}
