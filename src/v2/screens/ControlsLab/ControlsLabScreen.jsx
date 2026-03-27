import { Sparkles } from 'lucide-react'
import layoutContract from './ControlsLabScreen.contract'
import BackPill from '../../foundation/primitives/BackPill'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import StepBar from '../../foundation/primitives/StepBar'
import {
  getNavigationBrandAnchorStyle,
  getNavigationHeaderBandStyle,
  getNavigationUtilityAnchorStyle,
  NavigationRailBrand,
  NavigationRailItems,
  NavigationRailPinControl,
} from '../../foundation/primitives/NavigationRail'
import useNavigationRailState from '../../foundation/primitives/useNavigationRailState'
import {
  ActionPillPreview,
  EditorToolbarControlsPreview,
  FontSizeControlsPreview,
  ModeIconSetPreview,
  NavigationRailRowPreview,
  PreferenceToggleRowPreview,
  SplitCTAPreview,
  StatusChipPreview,
  UtilityIconFamilyPreview,
} from '../../foundation/lab-previews/controls'
import { shellSizing } from '../../foundation/layout/shellSizing'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, motion, radius, spacing, typography } from '../../foundation/tokens'

const stepItems = [
  { id: 'source', label: 'Source' },
  { id: 'segment', label: 'Segment' },
  { id: 'review', label: 'Review' },
]

function NavigationRailPreview() {
  const navigationRailState = useNavigationRailState({ defaultPinned: true })
  const isExpanded = navigationRailState.isNavExpanded

  const shell = {
    showRail: true,
    isNavExpanded: isExpanded,
    isNavPinned: navigationRailState.isNavPinned,
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
    ...navigationRailState,
  }

  return (
    <div style={{ width: '100%', display: 'grid', gap: spacing[10], justifyItems: 'center' }}>
      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>
        Hover expands. Pin keeps it open.
      </p>
      <div
        onMouseEnter={navigationRailState.handleNavigationRailMouseEnter}
        onMouseLeave={navigationRailState.handleNavigationRailMouseLeave}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: isExpanded ? shellSizing.navigationRail.expandedPx : shellSizing.navigationRail.collapsedPx,
            border: `1px solid ${colors.lineSoft}`,
            borderRadius: radius[24],
            background: 'rgba(255, 255, 255, 0.96)',
            padding: isExpanded ? `${spacing[20]} ${spacing[16]}` : `${spacing[20]} ${spacing[10]}`,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[16],
            transition: `width ${motion.panel}, padding ${motion.panel}, box-shadow ${motion.micro}`,
            overflow: 'hidden',
            boxShadow: isExpanded ? '0 16px 30px rgba(15, 23, 42, 0.06)' : 'none',
          }}
        >
          <div
            style={{
              ...getNavigationHeaderBandStyle(isExpanded),
            }}
          >
            <div style={getNavigationBrandAnchorStyle(isExpanded)}>
              <NavigationRailBrand isExpanded={isExpanded} />
            </div>
            <div style={getNavigationUtilityAnchorStyle(isExpanded)}>
              <NavigationRailPinControl shell={shell} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
            <NavigationRailItems shell={shell} />
          </div>
        </div>
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
          status="Locked"
          note="Assess the default resting state here. Hover polish and sheen are reviewed separately on the motion board."
        >
          <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />}>AI segment text</PrimaryCTA>
        </LabGenericCard>
        <LabGenericCard
          title="Primary CTA disabled state"
          status="Locked"
          note="Disabled should still feel premium and related, not greyed into irrelevance."
          minHeight={180}
        >
          <PrimaryCTA icon={<Sparkles size={16} strokeWidth={1.9} />} disabled>
            AI segment text
          </PrimaryCTA>
        </LabGenericCard>
        <LabGenericCard
          title="Split CTA"
          status="Locked"
          note="Chevron direction is state-driven; the resting and open states should feel like one composed action family."
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
          status="Locked"
          note="These should all come from one mini-control family: full-screen, sidebar, pin, float, move, and copy."
          minHeight={190}
        >
          <UtilityIconFamilyPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Back pill"
          status="Locked"
          note="Directional action variant. It should inherit the premium blue-fill hover, but not the full ceremonial sheen sweep."
          minHeight={120}
        >
          <BackPill />
        </LabGenericCard>
        <LabGenericCard
          title="Navigation rail row"
          status="Locked"
          note="Single-row sizing, icon meaning, label rhythm, and active indicator placement."
          minHeight={120}
        >
          <NavigationRailRowPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Screen mode icon set"
          status="Locked"
          note="Canonical icons for the major product modes. The icons are the generic here; the surrounding lab framing is not part of the system."
          minHeight={120}
        >
          <ModeIconSetPreview />
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
          status="Locked"
          note="Multi-step operational progress pattern carried over from segmentation."
          minHeight={120}
        >
          <StepBar steps={stepItems} currentIndex={0} />
        </LabGenericCard>
        <LabGenericCard
          title="Navigation rail"
          status="Locked"
          note="Judge the expanded rail as the canonical state. This preview uses the standard hover-expand and pin/unpin behavior instead of separate static states."
          minHeight={280}
          gridColumn="1 / -1"
        >
          <NavigationRailPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Preference toggle row"
          status="Locked"
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
          note="Related to the Back pill family, but quieter and more utility-like. Review a few directions here."
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
