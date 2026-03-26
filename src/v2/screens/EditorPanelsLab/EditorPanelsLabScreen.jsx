import { useState } from 'react'
import layoutContract from './EditorPanelsLabScreen.contract'
import EditorSurface from '../../foundation/primitives/EditorSurface'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'
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
        <LabPlaceholderCard title="Editor topbar" note="Window buttons, eyebrow, and seal treatment." />
        <LabPlaceholderCard title="Editor footer" note="Shortcut hint, keycaps, and footer meta rhythm." />
        <LabPlaceholderCard title="Editor watermark treatment" note="Opacity, position, and visual restraint." />
        <LabPlaceholderCard title="Panel corner casing" note="Attached to the editor/panel family, never floating independently." />
      </LabSection>

      <LabSection
        title="Panel families"
        description="Panels should share a family resemblance even when their use differs."
      >
        <LabPlaceholderCard title="Operational panel" note="Core surface for controlled preparation and approval flows." />
        <LabPlaceholderCard title="Support panel card" note="Study support family from the right rail." />
        <LabPlaceholderCard title="Support rail card" note="Collapsed preview card for right-rail support." />
        <LabPlaceholderCard title="Floating support preview" note="Promising, but not yet canonized." />
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
