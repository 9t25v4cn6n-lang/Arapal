import { Sparkles } from 'lucide-react'
import layoutContract from './ControlsLabScreen.contract'
import BackPill from '../../foundation/primitives/BackPill'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import StepBar from '../../foundation/primitives/StepBar'
import { NavigationRailBrand, NavigationRailItems, NavigationRailPinControl } from '../../foundation/primitives/NavigationRail'
import {
  ActionPillPreview,
  EditorToolbarControlsPreview,
  FontSizeControlsPreview,
  NavigationRailRowPreview,
  PreferenceToggleRowPreview,
  SplitCTAPreview,
  StatusChipPreview,
  UtilityIconFamilyPreview,
} from '../../foundation/lab-previews/controls'
import { shellSizing } from '../../foundation/layout/shellSizing'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

const stepItems = [
  { id: 'source', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

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
        <NavigationRailBrand isExpanded />
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
          note="Assess the default resting state here. Hover polish and sheen are reviewed separately on the motion board."
        >
          <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />}>AI segment text</PrimaryCTA>
        </LabGenericCard>
        <LabGenericCard
          title="Split CTA"
          status="Candidate"
          note="Judge the composed button family here. The advanced options panel is reviewed separately as its own generic."
          minHeight={180}
        >
          <SplitCTAPreview showMenu={false} />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Small controls"
        description="These mini controls should all belong to one family: back, pin, expand, collapse, and close."
      >
        <LabGenericCard
          title="Utility icon family"
          status="Active extraction"
          note="These should all come from one mini-control family: full-screen, sidebar, pin, float, move, and copy."
          minHeight={190}
        >
          <UtilityIconFamilyPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Back pill"
          status="Active extraction"
          note="Existing V2 operational control. This is now being reviewed as a proper shared primitive."
          minHeight={120}
        >
          <BackPill />
        </LabGenericCard>
        <LabGenericCard
          title="Navigation rail row"
          status="Candidate"
          note="Single-row sizing, icon meaning, label rhythm, and active indicator placement."
          minHeight={120}
        >
          <NavigationRailRowPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Font size controls"
          status="Candidate"
          note="Small reading-size controls should feel related to the pill/action family, not like unrelated browser buttons."
          minHeight={120}
        >
          <FontSizeControlsPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Editor micro-toolbar"
          status="Candidate"
          note="Bold, italic, and alignment controls should use the same mini-control language as the rest of the app."
          minHeight={140}
        >
          <EditorToolbarControlsPreview />
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
          minHeight={120}
        >
          <StepBar steps={stepItems} currentIndex={0} />
        </LabGenericCard>
        <LabGenericCard
          title="Navigation rail"
          status="Active extraction"
          note="Judge the brand mark, row rhythm, active indicator, and pin-control balance."
          minHeight={0}
        >
          <NavigationRailPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Preference toggle row"
          status="Candidate"
          note="Used in advanced menus and settings-style overlays."
          minHeight={0}
        >
          <PreferenceToggleRowPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Status chip / badge"
          status="Candidate"
          note="Shared semantic chip for state, not a per-screen embellishment."
          minHeight={120}
        >
          <StatusChipPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Action pill"
          status="Candidate"
          note="Review a few directions here. One option should inherit the same filled premium behavior as the Back pill hover."
          minHeight={120}
        >
          <ActionPillPreview />
        </LabGenericCard>
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
