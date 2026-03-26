import { ArrowLeft, Pin, Sparkles } from 'lucide-react'
import layoutContract from './ControlsLabScreen.contract'
import BackPill from '../../foundation/primitives/BackPill'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import IconActionButton from '../../foundation/primitives/IconActionButton'
import StepBar from '../../foundation/primitives/StepBar'
import { NavigationRailBrand, NavigationRailItems, NavigationRailPinControl } from '../../foundation/primitives/NavigationRail'
import { shellSizing } from '../../foundation/layout/shellSizing'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

const stepItems = [
  { id: 'source', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

function UtilityControlPreview() {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[12],
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: spacing[12],
        borderRadius: radius[16],
        background: 'rgba(239, 246, 255, 0.68)',
        border: `1px solid ${colors.lineSoft}`,
      }}
    >
      <IconActionButton
        size="utility-sm"
        label="Back"
        icon={<ArrowLeft size={16} strokeWidth={1.9} />}
      />
      <IconActionButton
        size="utility-sm"
        label="Pin"
        active
        icon={<Pin size={16} strokeWidth={1.9} />}
      />
      <IconActionButton
        size="utility-sm"
        label="Spark"
        icon={<Sparkles size={16} strokeWidth={1.9} />}
        style={{
          background: 'rgba(239, 246, 255, 0.96)',
          borderColor: 'rgba(191, 219, 254, 0.96)',
          color: colors.accentStrong,
        }}
      />
    </div>
  )
}

function NavigationRailPreview() {
  const shell = {
    showRail: true,
    isNavExpanded: true,
    isNavPinned: true,
    activeRailGroupId: 'segmentation',
    railItems: [
      {
        id: 'projectHome',
        label: 'Project Home',
        shell: { rail: { groupId: 'projectHome', label: 'Project Home', iconKey: 'home', routeId: 'projectHome' } },
      },
      {
        id: 'studyWorkspace',
        label: 'Study Workspace',
        shell: { rail: { groupId: 'study', label: 'Study Workspace', iconKey: 'study', routeId: 'studyWorkspace' } },
      },
      {
        id: 'segmentationPaste',
        label: 'Source + Segmentation',
        shell: { rail: { groupId: 'segmentation', label: 'Source + Segmentation', iconKey: 'segmentation', routeId: 'segmentationPaste' } },
      },
    ],
    navigate: () => {},
    toggleNavigationRailPin: () => {},
  }

  return (
    <div
      style={{
        width: shellSizing.navigationRail.expandedPx,
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: radius[24],
        background: 'rgba(255, 255, 255, 0.96)',
        padding: `${spacing[20]} ${spacing[16]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[16],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
        <NavigationRailBrand />
        <NavigationRailPinControl shell={shell} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
        <NavigationRailItems shell={shell} />
      </div>
    </div>
  )
}

export default function ControlsLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Calls to action"
        description="These are the primary action families for the app. We approve their feel here before they appear in product screens."
      >
        <LabGenericCard
          title="Primary CTA"
          status="Active extraction"
          note="Premium default state, with the sheen and hover simply sharpening it."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[12], alignItems: 'flex-start' }}>
            <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />}>AI segment text</PrimaryCTA>
            <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />} disabled>
              AI segment text
            </PrimaryCTA>
          </div>
        </LabGenericCard>
        <LabPlaceholderCard
          title="Split CTA"
          note="Must inherit the same premium family as the primary CTA, not become a bespoke screen-local treatment."
        />
      </LabSection>

      <LabSection
        title="Small controls"
        description="These mini controls should all belong to one family: back, pin, expand, collapse, and close."
      >
        <LabGenericCard
          title="Utility icon control"
          status="Active extraction"
          note="Hover should reveal the box cleanly without making the icon feel oversized."
          minHeight={130}
        >
          <UtilityControlPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Back pill"
          status="Active extraction"
          note="Existing V2 operational control. This is now being reviewed as a proper shared primitive."
          minHeight={130}
        >
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 60 }}>
            <BackPill />
          </div>
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Rows + toggles"
        description="These lower-level controls should feel like members of the same family rather than isolated one-offs."
      >
        <LabGenericCard
          title="Step bar"
          status="Active extraction"
          note="Multi-step operational progress pattern carried over from segmentation."
          minHeight={130}
        >
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 60 }}>
            <StepBar steps={stepItems} currentIndex={0} />
          </div>
        </LabGenericCard>
        <LabGenericCard
          title="Navigation rail"
          status="Active extraction"
          note="The shell already exists. This board is here to judge the row sizing, active state, and control balance."
          minHeight={0}
        >
          <NavigationRailPreview />
        </LabGenericCard>
        <LabPlaceholderCard title="Preference toggle row" note="Used in advanced menus and settings-style overlays." />
        <LabPlaceholderCard title="Status chip / badge" note="Shared semantic chip for state, not a per-screen embellishment." />
      </LabSection>
    </>
  )

  const rightRail = (
    <>
      <div
        style={{
          border: `1px solid ${colors.lineSoft}`,
          borderRadius: radius[24],
          background: 'rgba(255, 255, 255, 0.96)',
          padding: spacing[18],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[10],
        }}
      >
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Current board</p>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
          Approve the CTA family and mini-control family before building more operational screens.
        </p>
      </div>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Controls"
      title="Buttons and control families."
      intro="Judge these by feel, scale, state, and consistency. If they don’t feel like one family here, they won’t feel coherent in the app."
      content={content}
      rightRail={rightRail}
    />
  )
}
