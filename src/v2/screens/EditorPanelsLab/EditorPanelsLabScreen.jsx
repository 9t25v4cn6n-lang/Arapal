import { useState } from 'react'
import layoutContract from './EditorPanelsLabScreen.contract'
import EditorSurface from '../../foundation/primitives/EditorSurface'
import SourceIntakeBrand from '../../foundation/primitives/SourceIntakeBrand'
import {
  DimmedStageOverlayPreview,
  EditorFooterPreview,
  EditorTopbarPreview,
  ExpandedFocusPanelPreview,
  FeedbackBlockPreview,
  FloatingPanelHeaderPreview,
  FloatingResizeAffordancePreview,
  FloatingSupportPreview,
  LexicographyEntryRowPreview,
  LexicographySupportCardPreview,
  NumberedTakeawayPreview,
  OperationalPanelPreview,
  OptionsPopoverPreview,
  PanelCornerCasingPreview,
  SupportPanelCardPreview,
  SupportRailCardPreview,
} from '../../foundation/lab-previews/editorPanels'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
import { colors, radius, spacing, typography } from '../../foundation/tokens'

export default function EditorPanelsLabScreen({ route, shell }) {
  const [editorValue, setEditorValue] = useState(
    'The Friday prayer is only valid in a comprehensive city or in the prayer area of the city. It is not permissible in villages...'
  )

  const content = (
    <>
      <LabSection
        title="Editor family"
        description="The editor family should feel calm, precise, and premium. This is one of the main visual anchors of the product."
        columns="1fr"
      >
        <LabGenericCard
          title="Editor surface"
          status="Active extraction"
          note="Includes the attached corner casing, topbar chrome, watermark, and footer rhythm."
          minHeight={0}
        >
          <EditorSurface
            value={editorValue}
            onChange={setEditorValue}
            placeholder={'Paste your source text here…\n\nThe workspace will analyze and segment your text into structured, study-ready sections.'}
            footerMeta={`${editorValue.trim().split(/\s+/).filter(Boolean).length} words`}
            minHeight={420}
          />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Editor sub-parts"
        description="These live inside the editor family, but we still review them as distinct generics."
      >
        <LabGenericCard
          title="Source intake brand"
          status="Active extraction"
          note="Segmentation-specific identity cluster that likely belongs to the operational editor family."
          minHeight={130}
        >
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 68 }}>
            <SourceIntakeBrand />
          </div>
        </LabGenericCard>
        <LabGenericCard title="Editor topbar" status="Candidate" note="Window buttons, eyebrow, and seal treatment." minHeight={0}>
          <EditorTopbarPreview />
        </LabGenericCard>
        <LabGenericCard title="Editor footer" status="Candidate" note="Shortcut hint, keycaps, and footer meta rhythm." minHeight={0}>
          <EditorFooterPreview />
        </LabGenericCard>
        <LabGenericCard title="Editor watermark treatment" status="Candidate" note="Opacity, position, and visual restraint." minHeight={0}>
          <div style={{ position: 'relative', minHeight: 150, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: 24, bottom: 18, fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, lineHeight: 1, letterSpacing: '-0.06em', color: 'rgba(37, 99, 235, 0.085)' }}>Arapal</div>
          </div>
        </LabGenericCard>
        <LabGenericCard title="Panel corner casing" status="Candidate" note="Attached to the editor/panel family, never floating independently." minHeight={0}>
          <PanelCornerCasingPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Panel families"
        description="Panels should share a family resemblance even when their use differs."
      >
        <LabGenericCard title="Operational panel" status="Candidate" note="Core surface for controlled preparation and approval flows." minHeight={0}>
          <OperationalPanelPreview />
        </LabGenericCard>
        <LabGenericCard title="Options popover" status="Candidate" note="Advanced segmentation menu and similar overlays should come from one family." minHeight={0}>
          <OptionsPopoverPreview />
        </LabGenericCard>
        <LabGenericCard title="Support panel card" status="Candidate" note="Study support family from the right rail." minHeight={0}>
          <SupportPanelCardPreview />
        </LabGenericCard>
        <LabGenericCard title="Lexicography support card" status="Candidate" note="One of the strongest concrete support-card references from the study shell." minHeight={0}>
          <LexicographySupportCardPreview />
        </LabGenericCard>
        <LabGenericCard title="Support rail card" status="Candidate" note="Collapsed preview card for right-rail support." minHeight={0}>
          <SupportRailCardPreview />
        </LabGenericCard>
        <LabGenericCard title="Floating support preview" status="Candidate" note="Pinned or hovered preview surface from the collapsed support rail." minHeight={0}>
          <FloatingSupportPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Expanded and floating support surfaces"
        description="These are the parts of the study shell that feel powerful and reusable, but need a more explicit system home."
      >
        <LabGenericCard title="Expanded focus panel" status="Candidate" note="Dimmed-background, front-and-center expansion for support content such as lexicography." minHeight={0}>
          <ExpandedFocusPanelPreview />
        </LabGenericCard>
        <LabGenericCard title="Expandable support modal" status="Candidate" note="Large focused support view with proper temporary dominance." minHeight={0}>
          <ExpandedFocusPanelPreview />
        </LabGenericCard>
        <LabGenericCard title="Dimmed stage overlay" status="Candidate" note="Shared focused-overlay treatment used when a support surface takes temporary center stage." minHeight={0}>
          <DimmedStageOverlayPreview />
        </LabGenericCard>
        <LabGenericCard title="Floating panel header + actions" status="Candidate" note="Header strip for floating support surfaces, including close and pin controls." minHeight={0}>
          <div style={{ borderRadius: radius[16], overflow: 'hidden', border: `1px solid ${colors.lineSoft}` }}>
            <FloatingPanelHeaderPreview />
          </div>
        </LabGenericCard>
        <LabGenericCard title="Floating panel resize affordance" status="Candidate" note="Should become a defined floating-panel capability rather than staying a local trick." minHeight={0}>
          <FloatingResizeAffordancePreview />
        </LabGenericCard>
        <LabGenericCard title="Feedback block" status="Candidate" note="Reusable feedback excerpt used inside support cards and expanded panels." minHeight={0}>
          <FeedbackBlockPreview />
        </LabGenericCard>
        <LabGenericCard title="Numbered takeaway item" status="Candidate" note="Ordered advice block for remediation and expanded support reading." minHeight={0}>
          <NumberedTakeawayPreview />
        </LabGenericCard>
        <LabGenericCard title="Lexicography entry row" status="Candidate" note="Term + gloss row used inside lexicography surfaces." minHeight={0}>
          <LexicographyEntryRowPreview />
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
          This is the most important board for segmentation. Once this family is right, the product screens get much
          easier to rebuild cleanly.
        </p>
      </div>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Editor + panels"
      title="Editor and panel families."
      intro="These surfaces must carry a lot of the product’s calm premium feel. We review their structure and refinement here before they are reused."
      content={content}
      rightRail={rightRail}
    />
  )
}
