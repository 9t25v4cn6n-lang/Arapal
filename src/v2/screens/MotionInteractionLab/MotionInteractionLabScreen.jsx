import { ArrowLeft, Pin } from 'lucide-react'
import layoutContract from './MotionInteractionLabScreen.contract'
import IconActionButton from '../../foundation/primitives/IconActionButton'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import {
  EditorShortcutHintPreview,
  EscapeDismissPreview,
  FloatDockPreview,
  FloatingDragResizePreview,
  FocusedExpandMotionPreview,
  HoverLiftPreview,
  HoverPreviewPinDemo,
  MenuMotionPreview,
  OutsideClickDismissPreview,
  ReducedMotionFallbackPreview,
  ScreenIntroPreview,
  SegmentTreeExpandPreview,
  SplitCTAInteractionPreview,
  SupportPanelCollapsePreview,
  SupportPreviewRevealMotion,
} from '../../foundation/lab-previews/interactions'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

export default function MotionInteractionLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Interaction rules"
        description="These items should behave consistently across the app, even if they appear in different modes."
      >
        <LabGenericCard title="Utility hover reveal" status="Active extraction" note="Hover the mini controls to check the reveal box and sizing.">
          <div
            style={{
              display: 'flex',
              gap: spacing[12],
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
          </div>
        </LabGenericCard>
        <LabGenericCard title="Split CTA open/select/close" status="Candidate" note="Open, inspect, select, and collapse must behave like one composed control." minHeight={0}>
          <SplitCTAInteractionPreview />
        </LabGenericCard>
        <LabGenericCard title="Outside-click dismissal" status="Locked" note="Should be standard for overlays unless pinned." minHeight={0}>
          <OutsideClickDismissPreview />
        </LabGenericCard>
        <LabGenericCard title="Escape-to-close overlays" status="Locked" note="Same rule family as outside-click dismissal." minHeight={0}>
          <EscapeDismissPreview />
        </LabGenericCard>
        <LabGenericCard title="Segment tree expand/collapse" status="Candidate" note="Hierarchy reveal should feel calm, not twitchy." minHeight={0}>
          <SegmentTreeExpandPreview />
        </LabGenericCard>
        <LabGenericCard title="Support-panel collapse/expand" status="Candidate" note="Collapse before compressing the whole workspace." minHeight={0}>
          <SupportPanelCollapsePreview />
        </LabGenericCard>
        <LabGenericCard title="Hover preview + pin to keep open" status="Candidate" note="Study-shell support rail behavior with a broader reuse question." minHeight={0}>
          <HoverPreviewPinDemo />
        </LabGenericCard>
        <LabGenericCard title="Float / dock support panel" status="Candidate" note="Detaching a support surface from its docked state without losing context." minHeight={0}>
          <FloatDockPreview />
        </LabGenericCard>
        <LabGenericCard title="Floating panel drag / resize" status="Candidate" note="Existing in the study shell; still needs product-level rules." minHeight={0}>
          <FloatingDragResizePreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Motion language"
        description="Motion should clarify state and hierarchy, not decorate for its own sake."
      >
        <LabGenericCard title="CTA sheen" status="Candidate" note="Hover the button to assess the sheen sweep and lift feel.">
          <PrimaryCTA>AI segment text</PrimaryCTA>
        </LabGenericCard>
        <LabGenericCard title="Hover/focus micro-motion" status="Locked" note="Mini controls and panels should sharpen, not jump." minHeight={0}>
          <HoverLiftPreview />
        </LabGenericCard>
        <LabGenericCard title="Menu / panel open motion" status="Candidate" note="Needs reusable implementation helpers, not screen-local animation." minHeight={0}>
          <MenuMotionPreview />
        </LabGenericCard>
        <LabGenericCard title="Screen intro / transition motion" status="Candidate" note="Documented, but not yet proven as a reusable motion family." minHeight={0}>
          <ScreenIntroPreview />
        </LabGenericCard>
        <LabGenericCard title="Focused expand with dim backdrop" status="Candidate" note="Used when a support surface expands into a central, temporary focus state." minHeight={0}>
          <FocusedExpandMotionPreview />
        </LabGenericCard>
        <LabGenericCard title="Support preview reveal motion" status="Candidate" note="Hover reveal from the collapsed support rail should feel informative, not jumpy." minHeight={0}>
          <SupportPreviewRevealMotion />
        </LabGenericCard>
        <LabGenericCard title="Editor shortcut hint behavior" status="Candidate" note="Footer hints should stay helpful and quiet, never noisy chrome." minHeight={0}>
          <EditorShortcutHintPreview />
        </LabGenericCard>
        <LabGenericCard title="Hover lift for primary surfaces" status="Candidate" note="Lift should follow the elevation scale, not invent a new one." minHeight={0}>
          <HoverLiftPreview />
        </LabGenericCard>
        <LabGenericCard title="Reduced motion fallbacks" status="Deferred" note="Must flatten non-essential motion without harming hierarchy." minHeight={0}>
          <ReducedMotionFallbackPreview />
        </LabGenericCard>
      </LabSection>
    </>
  )

  const rightRail = (
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
      <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Board note</p>
      <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>
        Judge whether the motion clarifies the control. If it feels ornamental or game-like, it fails.
      </p>
    </div>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Motion + interaction"
      title="Behavior before choreography."
      intro="We review interactions and motion as system language here, not as local screen flourishes."
      content={content}
      rightRail={rightRail}
    />
  )
}
