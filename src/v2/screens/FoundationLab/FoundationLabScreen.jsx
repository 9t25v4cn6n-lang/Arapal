import layoutContract from './FoundationLabScreen.contract'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, elevation, radius, spacing, typography } from '../../foundation/tokens'

const genericCategories = [
  {
    title: 'Layout',
    score: 'Strong',
    note: 'Shell math, debug naming, and width-yield rules are stable enough to stop being the focus.',
  },
  {
    title: 'Primitives',
    score: 'Needs extraction',
    note: 'This is the missing middle layer. Buttons, editor surfaces, support cards, and menus must move out of screens.',
  },
  {
    title: 'Styling',
    score: 'Partly locked',
    note: 'Type, palette, and backdrop are documented, but panel, editor, and CTA styling still need one owner.',
  },
  {
    title: 'Screen patterns',
    score: 'Early',
    note: 'Segmentation and study are visible, but not yet rebuilt from approved shared primitives.',
  },
]

const extractionWave = [
  'EditorSurface',
  'PrimaryCTA',
  'SplitCTA',
  'OperationalPanel',
  'OptionsPopover',
  'PreferenceToggleRow',
  'BackPill',
  'StepBar',
]

const checklistItems = [
  'Do not change Layer 1 or Layer 2 for one screen.',
  'Do not polish a repeated pattern inside a screen before extracting it.',
  'Use current app for product truth and old app for stronger visual detail.',
  'Once a primitive is approved in V2, treat V2 as the source of truth.',
]

const summaryItems = [
  { label: 'Reset point', value: '37abd93' },
  { label: 'Primary goal', value: 'Extract and lock generics before more screen rebuilding.' },
]

function makeCardStyle(background = 'rgba(255, 255, 255, 0.92)') {
  return {
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[24],
    background,
    padding: spacing[20],
    boxShadow: elevation.flat,
  }
}

export default function FoundationLabScreen({ route, shell }) {
  const summaryCardStyle = makeCardStyle('rgba(248, 251, 255, 0.92)')
  const categoryCardStyle = makeCardStyle('rgba(255, 255, 255, 0.96)')
  const checklistCardStyle = makeCardStyle('rgba(248, 251, 255, 0.92)')
  const extractionChipStyle = {
    border: `1px solid ${colors.lineSoft}`,
    borderRadius: radius[16],
    background: 'rgba(255, 255, 255, 0.94)',
    padding: `${spacing[10]} ${spacing[14]}`,
    ...typography.bodyText,
    color: colors.textBody,
  }

  const slots = {
    Layer3_Lab_LeftSummary: (
      <>
        {summaryItems.map((item) => (
          <div key={item.label} style={summaryCardStyle}>
            <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[10]}`, color: colors.textSoft }}>
              {item.label}
            </p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{item.value}</p>
          </div>
        ))}
      </>
    ),
    Layer3_Lab_HeroPanel: (
      <>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>Foundation Lab</p>
        <h1
          style={{
            margin: 0,
            fontFamily: typography.displayTitle.fontFamily,
            fontSize: 'clamp(42px, 4.6vw, 68px)',
            lineHeight: 1,
            color: colors.textStrong,
            transform: 'translateY(-0.05em)',
          }}
        >
          Extract first, then rebuild.
        </h1>
        <p
          style={{
            ...typography.supportSubtext,
            margin: 0,
            maxWidth: '54ch',
            color: colors.textBody,
          }}
        >
          This screen is the system workshop for V2. We refine shared generics here so future product screens compose
          approved primitives instead of growing private design systems.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing[12],
          }}
        >
          <div style={summaryCardStyle}>
            <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[8]}`, color: colors.textSoft }}>Current branch</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>codex/foundation-lab-extraction</p>
          </div>
          <div style={summaryCardStyle}>
            <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[8]}`, color: colors.textSoft }}>Inventory</p>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>`v2-generic-inventory.md` is the canonical review list.</p>
          </div>
        </div>
      </>
    ),
    Layer3_Lab_CategoryGrid: (
      <>
        {genericCategories.map((category) => (
          <div key={category.title} style={categoryCardStyle}>
            <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[10]}`, color: colors.textSoft }}>
              {category.title}
            </p>
            <h3
              style={{
                margin: `0 0 ${spacing[10]}`,
                fontFamily: typography.cardTitle.fontFamily,
                fontSize: '28px',
                lineHeight: 1.05,
                color: colors.textStrong,
              }}
            >
              {category.score}
            </h3>
            <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{category.note}</p>
          </div>
        ))}
      </>
    ),
    Layer3_Lab_RightChecklist: (
      <>
        <div style={checklistCardStyle}>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>
            First extraction wave
          </p>
          <p style={{ ...typography.bodyText, margin: `0 0 ${spacing[12]}`, color: colors.textBody }}>
            These are the next shared pieces to build before returning to product screens.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[10] }}>
            {extractionWave.map((item) => (
              <div key={item} style={extractionChipStyle}>{item}</div>
            ))}
          </div>
        </div>
        <div style={checklistCardStyle}>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>
            Drift checks
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12] }}>
            {checklistItems.map((item) => (
              <div key={item} style={{ display: 'flex', gap: spacing[10], alignItems: 'flex-start' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    marginTop: 8,
                    borderRadius: radius.pill,
                    background: colors.accentBase,
                    flexShrink: 0,
                  }}
                />
                <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={checklistCardStyle}>
          <p style={{ ...typography.eyebrowLabel, margin: `0 0 ${spacing[12]}`, color: colors.textSoft }}>
            Next move
          </p>
          <button
            type="button"
            onClick={() => shell.navigate('segmentationPaste')}
            style={{
              minHeight: '44px',
              width: '100%',
              border: 'none',
              borderRadius: radius.pill,
              background: `linear-gradient(90deg, ${colors.accentBase} 0%, ${colors.accentStrong} 100%)`,
              color: '#ffffff',
              fontFamily: typography.bodyText.fontFamily,
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 16px 36px rgba(37, 99, 235, 0.18)',
            }}
          >
            Return to SegmentationPaste
          </button>
        </div>
      </>
    ),
  }

  return <V2ScreenFrame contract={layoutContract} route={route} shell={shell} screenSlots={slots} />
}
