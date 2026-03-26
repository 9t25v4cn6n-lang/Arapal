import layoutContract from './PatternLabScreen.contract'
import {
  DiscussionFlowPreview,
  GradeCirclePreview,
  PassReflectionPreview,
  ProjectHomeDestinationCardPreview,
  QuickLexChipTooltipPreview,
  ReviewRemediationStatePreview,
  SegmentTreeRowFamilyPreview,
  SegmentationSuccessStagePreview,
  SegmentationWorkspacePatternPreview,
  StudyWorkspaceShellPreview,
  SupportRailFloatingSystemPreview,
  WorkspaceCardFamilyPreview,
} from '../../foundation/lab-previews/patterns'
import { LabGenericCard, LabPlaceholderCard, LabScaffold, LabSection } from '../../foundation/primitives/LabBoard'

export default function PatternLabScreen({ route, shell }) {
  const content = (
    <>
      <LabSection
        title="Layout patterns"
        description="These are repeatable structural shells pulled directly from the current workspace and segmentation references."
      >
        <LabGenericCard title="Study three-pane workspace layout" status="Candidate" note="Stable left, dominant center, support on the right." minHeight={0}>
          <StudyWorkspaceShellPreview />
        </LabGenericCard>
        <LabGenericCard title="Segmentation operational center-band layout" status="Candidate" note="The center stack uses the contracted 1 / 2 / 1 / 10 / 3 band logic." minHeight={0}>
          <SegmentationWorkspacePatternPreview />
        </LabGenericCard>
        <LabGenericCard title="Success-stage centered flow layout" status="Candidate" note="Centered ceremonial handoff pattern after segmentation or success moments." minHeight={0}>
          <SegmentationSuccessStagePreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Mode patterns"
        description="These are repeated mode-level compositions. They become easier once the primitive layer is approved."
      >
        <LabGenericCard title="Project Home command deck" status="Candidate" note="Large destination surfaces and one clear next action." minHeight={0}>
          <ProjectHomeDestinationCardPreview />
        </LabGenericCard>
        <LabGenericCard title="Source intake / segmentation operational workspace" status="Candidate" note="First pattern to prove after primitive extraction." minHeight={0}>
          <SegmentationWorkspacePatternPreview />
        </LabGenericCard>
        <LabGenericCard title="Study workspace main loop shell" status="Candidate" note="Primary product shell: source, editor, support, result." minHeight={0}>
          <StudyWorkspaceShellPreview />
        </LabGenericCard>
        <LabGenericCard title="Segmentation success stage" status="Candidate" note="Success-state family for post-publish handoff." minHeight={0}>
          <SegmentationSuccessStagePreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Study-specific patterns"
        description="These come mostly from the current study shell and should be reviewed as related families."
      >
        <LabGenericCard title="Segment tree row family" status="Candidate" note="Hierarchy, active state, and segment-state icon language." minHeight={0}>
          <SegmentTreeRowFamilyPreview />
        </LabGenericCard>
        <LabGenericCard title="Support rail + floating preview system" status="Candidate" note="Promising, but still needs structural audit." minHeight={0}>
          <SupportRailFloatingSystemPreview />
        </LabGenericCard>
        <LabGenericCard title="Workspace card family" status="Needs redesign" note="Important, but not yet fit to freeze visually." minHeight={0}>
          <WorkspaceCardFamilyPreview />
        </LabGenericCard>
        <LabGenericCard title="Review / remediation support states" status="Candidate" note="Reusable support-state surfaces for study and exams." minHeight={0}>
          <ReviewRemediationStatePreview />
        </LabGenericCard>
        <LabGenericCard title="Quick lex term chip / tooltip" status="Candidate" note="A small but distinctive study-support pattern." minHeight={0}>
          <QuickLexChipTooltipPreview />
        </LabGenericCard>
        <LabGenericCard title="Grade circle" status="Candidate" note="Assessment summary element used in the right support family." minHeight={0}>
          <GradeCirclePreview />
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Pass and reflection patterns"
        description="These are some of the strongest existing repeated surfaces in the study screen and should inform future extraction."
      >
        <LabGenericCard title="Best in class / your translation comparison stack" status="Candidate" note="Submitted-state center cards with compare and pin behaviors." minHeight={0}>
          <PassReflectionPreview />
        </LabGenericCard>
        <LabGenericCard title="Discussion summary + notes card" status="Candidate" note="Reflection surface with empty state, manual note composer, and saved note items." minHeight={0}>
          <DiscussionFlowPreview />
        </LabGenericCard>
        <LabGenericCard title="Submission jump bar" status="Candidate" note="Bottom anchored jump-and-continue bar used on submitted/pass states." minHeight={0}>
          <div style={{ minHeight: 78, borderRadius: '16px', border: '1px solid rgba(219, 228, 239, 0.96)', background: 'rgba(255,255,255,0.98)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', gap: '12px' }}>
            <span style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748B' }}>Jump to</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Source', 'Best in Class', 'Your Translation', 'Discussion'].map((item) => (
                <span key={item} style={{ minHeight: 32, padding: '0 12px', borderRadius: '999px', border: '1px solid rgba(219, 228, 239, 0.96)', background: item === 'Your Translation' ? 'rgba(239, 246, 255, 0.96)' : '#fff', color: item === 'Your Translation' ? '#1D4ED8' : '#64748B', display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 700 }}>{item}</span>
              ))}
            </div>
          </div>
        </LabGenericCard>
      </LabSection>

      <LabSection
        title="Attached discussion patterns"
        description="These feel like a real reusable family, even if they still need stronger extraction."
      >
        <LabGenericCard title="Docked discussion companion" status="Candidate" note="Attached side experience that keeps the user in the current segment context." minHeight={0}>
          <DiscussionFlowPreview />
        </LabGenericCard>
        <LabGenericCard title="Floating discussion panel" status="Candidate" note="Detached but still attached-to-context discussion surface." minHeight={0}>
          <DiscussionFlowPreview />
        </LabGenericCard>
        <LabGenericCard title="Focused discussion modal" status="Candidate" note="Expanded discussion state with dimmed backdrop and centered focus." minHeight={0}>
          <DiscussionFlowPreview />
        </LabGenericCard>
        <LabGenericCard title="Discussion composer + summary flow" status="Candidate" note="Input, send, summarise, and save as one coherent repeated pattern." minHeight={0}>
          <DiscussionFlowPreview />
        </LabGenericCard>
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
