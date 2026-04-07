import layoutContract from './PatternLabScreen.contract'
import {
  HomeCommandDeckPreview,
  Layer1UniversalShellPreview,
  Layer2DefaultSplitPreview,
  Layer2CenteredEntryPreview,
  Layer34CenteredBandsPreview,
  Layer34FullWidthWorkPreview,
  Layer5ContentOwnerPreview,
  ProjectsBrowseShellPreview,
  StudyAnchoredWorkspacePreview,
} from '../../foundation/lab-previews/patterns'
import { LabGenericCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'

export default function PatternLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Shared Screen Layers"
        description="These are the normalized shell generics and base stage families. They are diagram-led so we can lock the actual layer math before product styling."
      >
        <LabGenericCard
          title="1. Layer 1 universal shell"
          status="Locked"
          note="Base screen shell: 14x1 header, 1x8 left rail, and 13x8 body field."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <Layer1UniversalShellPreview />
        </LabGenericCard>
        <LabGenericCard
          title="2. Layer 2 default split"
          status="Locked"
          note="Normalized body split: 2.5x8 / 8x8 / 2.5x8. In implementation this is the shared `160 / flexible / 160` body-field contract."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <Layer2DefaultSplitPreview />
        </LabGenericCard>
        <LabGenericCard
          title="6. Centered stage stack"
          status="Locked"
          note="One centered stage pattern for entry, exams, and success/review states: `8x1.5 / 8x5 / 8x1.5`."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <Layer2CenteredEntryPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection title="Layer 3 / 4 Base Patterns" description="These are the reusable body-stage patterns that later screens inherit rather than reinvent.">
        <LabGenericCard
          title="3. Operational center-band stack"
          status="Locked"
          note="Operational workspace stack: `8x0.5 / 8x1 / 8x0.5 / 8x4 / 8x2`, usually with `2.5x8` support rails."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <Layer34CenteredBandsPreview />
        </LabGenericCard>
        <LabGenericCard
          title="4. Full-width work stage"
          status="Locked"
          note="A full-width main work zone with symmetric `2 / 4 / 2` vertical rhythm. The middle work field spans the whole 13-unit body."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <Layer34FullWidthWorkPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Layer 5 Example"
        description="This shows the next ownership step inside the screen body: a focused content owner living inside the established shell."
      >
        <LabGenericCard
          title="5. Layer 5 content owner"
          status="Locked"
          note="A centered content owner living inside the existing shell structure rather than redefining the shell itself."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
          gridColumn="1 / -1"
        >
          <Layer5ContentOwnerPreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Mode-Level Screen Patterns"
        description="These are the mode-level screen families built on top of the shared layer grammar. The point is to show which screens share a pattern family, not to duplicate the same structure under different names."
      >
        <LabGenericCard
          title="7. Hero / two-up / footer shell"
          status="Locked"
          note="Shared family for Home and Patching: one dominant top band, a symmetric two-up middle zone, and one lower action or summary band."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <HomeCommandDeckPreview />
        </LabGenericCard>

        <LabGenericCard
          title="8. Segmentation uses pattern 3"
          status="Locked"
          note="Segmentation does not need its own separate base pattern here. It is the main screen that consumes the operational center-band stack."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
          empty
        >
          <div />
        </LabGenericCard>

        <LabGenericCard
          title="9. Study three-pane shell"
          status="Locked"
          note="Stable three-pane family: left orientation lane, dominant center work stack, and one attached right support lane. Card subdivision lives inside the support lane, not at this pattern level."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <StudyAnchoredWorkspacePreview />
        </LabGenericCard>

        <LabGenericCard
          title="10. Browse + content shell"
          status="Locked"
          note="Shared browse/index family: one stable browse or filter lane and one larger content field. Internal cards are not defined at this pattern level."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
        >
          <ProjectsBrowseShellPreview />
        </LabGenericCard>

        <LabGenericCard
          title="11. Patching uses pattern 7"
          status="Locked"
          note="Patching does not need a wholly separate base pattern here. It shares the hero / two-up / footer family and differentiates itself through content and tone."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
          empty
        >
          <div />
        </LabGenericCard>

        <LabGenericCard
          title="12. Exams use pattern 6"
          status="Locked"
          note="Exams use the centered stage stack rather than needing a separate base shell here."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
          empty
        >
          <div />
        </LabGenericCard>

        <LabGenericCard
          title="13. Success / review use pattern 6"
          status="Locked"
          note="Centered success and review states also use the same centered stage stack."
          minHeight={0}
          displayMode="stretch"
          displayPadding={0}
          empty
        >
          <div />
        </LabGenericCard>
      </LabSection>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Patterns"
      title="Locked screen pattern families."
      intro="This board is now a frozen reference layer for the locked screen-pattern grammar: shared shell, shared stage families, and the current mode mappings for Home, Segmentation, Study, Projects, Patching, Exams, and centered success/review screens."
      content={content}
    />
  )
}
