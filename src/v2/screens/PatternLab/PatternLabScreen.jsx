import layoutContract from './PatternLabScreen.contract'
import { LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'

export default function PatternLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Mode patterns"
        description="These are repeated mode-level compositions. They become easier once the primitive layer is approved."
      >
        <LabPlaceholderCard title="Project Home command deck" note="Large destination surfaces and one clear next action." />
        <LabPlaceholderCard title="Source intake / segmentation operational workspace" note="First pattern to prove after primitive extraction." />
        <LabPlaceholderCard title="Study workspace main loop shell" note="Primary product shell: source, editor, support, result." />
        <LabPlaceholderCard title="Segmentation success stage" note="Success-state family for post-publish handoff." />
      </LabSection>

      <LabSection
        title="Study-specific patterns"
        description="These come mostly from the current study shell and should be reviewed as related families."
      >
        <LabPlaceholderCard title="Segment tree row family" note="Hierarchy, active state, and segment-state icon language." />
        <LabPlaceholderCard title="Support rail + floating preview system" note="Promising, but still needs structural audit." />
        <LabPlaceholderCard title="Workspace card family" note="Important, but not yet fit to freeze visually." />
        <LabPlaceholderCard title="Review / remediation support states" note="Reusable support-state surfaces for study and exams." />
      </LabSection>

      <LabSection
        title="Needs redesign / deferred"
        description="These exist in the product map, but are not yet strong reference sources."
      >
        <LabPlaceholderCard title="Projects index shell" status="Needs redesign" note="Current product surface is too early to freeze." />
        <LabPlaceholderCard title="Exams focus shell" status="Needs redesign" note="Mode is important, but current implementation is weak." />
        <LabPlaceholderCard title="Patching / corrections shell" status="Deferred" note="No proper reference extraction pass yet." />
      </LabSection>
    </>
  )

  return (
    <LabScaffold
      contract={layoutContract}
      route={route}
      shell={shell}
      eyebrow="Patterns"
      title="Repeated screen-pattern families."
      intro="These are the larger repeated compositions that sit above single primitives and below full product screens."
      content={content}
    />
  )
}
