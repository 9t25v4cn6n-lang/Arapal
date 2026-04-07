import { useState } from 'react'
import layoutContract from './EditorPanelsLabScreen.contract'
import EditorSurface from '../../foundation/primitives/EditorSurface'
import {
  EditorFormattingToolbarPreview,
  ExpandedFocusPanelPreview,
  FloatingSupportPreview,
  LexicographyEntryRowPreview,
  ModeSurfaceMarksPreview,
  NumberedTakeawayPreview,
  OptionsPopoverPreview,
  SupportCardFamilyPreview,
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
        description="Approve the editor itself first, then the attached mode marks that sit on related screens."
        columns="repeat(2, minmax(0, 1fr))"
      >
        <LabGenericCard
          title="Editor surface"
          status="Active extraction"
          note="Includes the attached corner casing, topbar chrome, watermark, and footer rhythm."
          minHeight={0}
          gridColumn="1 / -1"
        >
          <EditorSurface
            value={editorValue}
            onChange={setEditorValue}
            placeholder={'Paste your source text here…\n\nThe workspace will analyze and segment your text into structured, study-ready sections.'}
            footerMeta={`${editorValue.trim().split(/\s+/).filter(Boolean).length} words`}
            minHeight={420}
          />
        </LabGenericCard>
        <LabGenericCard
          title="Mode surface marks"
          status="Locked"
          note="Use the same mark structure across screens, with screen-specific icon + copy variants rather than bespoke layouts."
          minHeight={0}
        >
          <ModeSurfaceMarksPreview />
        </LabGenericCard>
        <LabGenericCard
          title="Editor formatting toolbar"
          status="Candidate"
          note="Text-capable editor variant for study and patching. Includes deterministic tools like case change, special characters, NBSP, and a future QA check action."
          minHeight={0}
        >
          <EditorFormattingToolbarPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Support panel family"
        description="There should be one support-card styling family, then content-specific variants like lexicography or guidance inside it."
      >
        <LabGenericCard title="Options popover" status="Locked" note="Exact V2 segmentation menu family with the same indents, spacing, and preference rows." minHeight={0}>
          <OptionsPopoverPreview />
        </LabGenericCard>
        <LabGenericCard title="Support card family" status="Locked" note="Use one V1 study-shell card styling, then apply tone + content variants like lexicography or guidance." minHeight={360} displayAlign="stretch" displayJustify="stretch" gridColumn="1 / -1">
          <SupportCardFamilyPreview />
        </LabGenericCard>
        <LabGenericCard title="Support rail card" status="Locked" note="Collapsed preview card for right-rail support, using tone-matched premium hover/fill." minHeight={360}>
          <SupportRailCardPreview />
        </LabGenericCard>
        <LabGenericCard title="Floating support preview" status="Candidate" note="Pinned or hovered preview surface from the collapsed support rail." minHeight={360}>
          <FloatingSupportPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Focused support states"
        description="These are the V1 study-shell states that matter: collapsed rail, floating preview, and focused expanded support."
      >
        <LabGenericCard
          title="Expanded focus support surface"
          status="Candidate"
          note="Use the dimmed-background, front-and-center V1 study-shell expansion as one combined state, not as separate fake generics."
          minHeight={520}
          gridColumn="1 / -1"
          displayAlign="stretch"
          displayJustify="stretch"
        >
          <ExpandedFocusPanelPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Support content blocks"
        description="Keep only the lower-level inner patterns that are genuinely likely to repeat across support surfaces."
      >
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
