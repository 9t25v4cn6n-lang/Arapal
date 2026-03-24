import { colors, elevation, radius, spacing, typography } from '../tokens'
import V2ScreenFrame from './V2ScreenFrame'

export default function ScreenScaffoldPlaceholder({ contract, route, shell, screenName }) {
  const panelStyles = {
    width: 'min(720px, 100%)',
    alignSelf: 'center',
    padding: spacing[32],
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[32],
    background: 'rgba(255, 255, 255, 0.96)',
    boxShadow: elevation.rest,
  }

  const slots = {
    Layer2_Body_ContentCenterField: (
      <section style={panelStyles}>
        <p
          style={{
            ...typography.eyebrowLabel,
            margin: `0 0 ${spacing[12]}`,
            color: colors.accentBase,
          }}
        >
          V2 Scaffold
        </p>
        <h1
          style={{
            ...typography.cardTitle,
            margin: `0 0 ${spacing[12]}`,
            color: colors.textStrong,
          }}
        >
          {screenName}
        </h1>
        <p
          style={{
            ...typography.bodyText,
            margin: 0,
            color: colors.textBody,
          }}
        >
          This screen already has its own folder, screen entry, and layout contract. Shared shell chrome is now live,
          and the real product rebuild can replace this placeholder without changing the route structure.
        </p>
      </section>
    ),
  }

  return <V2ScreenFrame contract={contract} route={route} shell={shell} screenSlots={slots} />
}
