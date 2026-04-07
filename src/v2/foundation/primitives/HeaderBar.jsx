import { colors, radius, spacing, typography } from '../tokens'

export function HeaderBrand() {
  return (
    <p
      style={{
        ...typography.eyebrowLabel,
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[8],
        margin: 0,
        padding: `0 ${spacing[16]}px`,
        minHeight: '32px',
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius.pill,
        background: colors.surfacePrimary,
        color: colors.accentStrong,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: radius.pill,
          background: colors.accentBase,
        }}
      />
      AraPal V2
    </p>
  )
}

export function HeaderCenter({ route }) {
  const modeLabel = route?.shell?.header?.modeLabel ?? route?.label ?? 'V2 Screen'
  const description = route?.shell?.header?.description ?? 'Contract-driven screen'

  return (
    <div
      style={{
        display: 'grid',
        gap: spacing[4],
        justifyItems: 'center',
      }}
    >
      <p
        style={{
          ...typography.eyebrowLabel,
          margin: 0,
          color: colors.accentBase,
        }}
      >
        {modeLabel}
      </p>
      <p
        style={{
          ...typography.monoMeta,
          margin: 0,
          color: colors.textSoft,
        }}
      >
        {description}
      </p>
    </div>
  )
}

export function HeaderMeta({ route }) {
  return (
    <p
      style={{
        ...typography.eyebrowLabel,
        margin: 0,
        color: colors.textFaint,
      }}
    >
      #{`v2/${route?.id ?? 'appLaunch'}`}
    </p>
  )
}
