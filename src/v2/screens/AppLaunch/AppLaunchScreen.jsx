import layoutContract from './AppLaunchScreen.contract'
import { colors, elevation, motion, radius, spacing, typography } from '../../foundation/tokens'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'

export default function AppLaunchScreen({ route, shell }) {
  const cardStyle = {
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[24],
    background: 'rgba(248, 251, 255, 0.9)',
    padding: spacing[20],
    boxShadow: elevation.flat,
  }

  const secondaryButtonStyle = {
    minHeight: '48px',
    padding: `0 ${spacing[20]}`,
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius.pill,
    background: colors.surfacePrimary,
    color: colors.textBody,
    fontFamily: typography.bodyText.fontFamily,
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: `background-color ${motion.micro}, border-color ${motion.micro}, box-shadow ${motion.micro}`,
    boxShadow: elevation.flat,
  }

  const primaryButtonStyle = {
    ...secondaryButtonStyle,
    border: 'none',
    background: `linear-gradient(90deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
    color: '#ffffff',
    boxShadow: '0 22px 48px rgba(37, 99, 235, 0.18)',
  }

  const slots = {
    Layer3_Launch_LeftSupport: (
      <div style={cardStyle}>
        <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>Frame</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Build for 1440x900, then validate at 1366x768 and 1920x1080.
        </p>
      </div>
    ),
    Layer3_Launch_HeroPanel: (
      <>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>App Launch</p>
        <h1
          style={{
            margin: 0,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            fontFamily: typography.displayTitle.fontFamily,
            fontSize: 'clamp(44px, 5vw, 72px)',
            lineHeight: 1,
            color: colors.textStrong,
            transform: 'translateY(-0.05em)',
            textAlign: 'center',
            textWrap: 'balance',
            overflowWrap: 'anywhere',
          }}
        >
          Clean foundation first.
        </h1>
        <p
          style={{
            ...typography.supportSubtext,
            margin: 0,
            width: '100%',
            maxWidth: '56ch',
            color: colors.textBody,
            textAlign: 'center',
          }}
        >
          AppV2 now has a distinct mount point, executable layout contracts, named debug-visible containers, and a
          clean path to rebuild the real product screens without dragging legacy structure forward.
        </p>
      </>
    ),
    Layer3_Launch_ActionBand: (
      <>
        <button
          type="button"
          style={primaryButtonStyle}
          onClick={() => {
            shell.navigate('segmentationPaste')
          }}
        >
          Open first product screen
        </button>
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => {
            shell.navigate('foundationLab')
          }}
        >
          Open foundation lab
        </button>
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => {
            shell.navigate('projectHome')
          }}
        >
          Jump to Project Home scaffold
        </button>
      </>
    ),
    Layer3_Launch_RightSupport: (
      <>
        <div style={cardStyle}>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>Debug</p>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
            Use the floating debug launcher to inspect every declared container from the same contract used to render
            the screen.
          </p>
        </div>
        <div style={cardStyle}>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>Next</p>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
            Build the reusable shell and then prove it properly on SegmentationPasteScreen.
          </p>
        </div>
      </>
    ),
  }

  return <V2ScreenFrame contract={layoutContract} route={route} shell={shell} screenSlots={slots} />
}
