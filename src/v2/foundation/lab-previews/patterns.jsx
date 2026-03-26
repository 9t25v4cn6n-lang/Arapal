import { BookOpen, CheckCircle2, FileText, MessageSquare, Pin, ScrollText, Sparkles } from 'lucide-react'
import { colors, radius, spacing, typography } from '../tokens'

function frameStyle() {
  return {
    borderRadius: radius[16],
    border: `1px solid ${colors.lineSoft}`,
    background: 'rgba(248, 251, 255, 0.96)',
    padding: spacing[12],
  }
}

export function SegmentTreeRowFamilyPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[8] }}>
      <div style={{ minHeight: 38, borderRadius: radius[12], background: 'rgba(239, 246, 255, 0.94)', border: `1px solid rgba(191, 219, 254, 0.96)`, display: 'flex', alignItems: 'center', gap: spacing[8], padding: `0 ${spacing[12]}` }}>
        <span style={{ fontSize: 14, color: colors.textSoft }}>▾</span>
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Chapter 2: Prayer</span>
      </div>
      {['2.1 Times of Prayer', '2.2 Conditions', '2.3 Jumu’ah'].map((item, index) => (
        <div key={item} style={{ minHeight: 36, marginLeft: spacing[20], borderRadius: radius[12], background: index === 1 ? 'rgba(239, 246, 255, 0.88)' : '#fff', border: `1px solid ${colors.lineSoft}`, display: 'flex', alignItems: 'center', gap: spacing[8], padding: `0 ${spacing[12]}` }}>
          <span style={{ width: 8, height: 8, borderRadius: radius.pill, background: index === 1 ? colors.accentBase : 'rgba(148, 163, 184, 0.64)' }} />
          <span style={{ ...typography.bodyText, fontSize: 14, color: index === 1 ? colors.accentStrong : colors.textBody }}>{item}</span>
        </div>
      ))}
    </div>
  )
}

export function SegmentTreeFolderRowPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[8] }}>
      <div style={{ minHeight: 40, borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: '#fff', display: 'flex', alignItems: 'center', gap: spacing[10], padding: `0 ${spacing[12]}` }}>
        <span style={{ fontSize: 14, color: colors.textSoft }}>▸</span>
        <BookOpen size={16} strokeWidth={1.8} color={colors.textSoft} />
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Chapter 3: Fasting</span>
      </div>
    </div>
  )
}

export function QuickLexChipTooltipPreview() {
  return (
    <div style={frameStyle()}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[12], flexWrap: 'wrap' }}>
        <button type="button" style={{ minHeight: 28, border: 'none', padding: '4px 12px', background: '#f1f5f9', color: '#45556c', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
          <Sparkles size={14} strokeWidth={1.8} />
          miṣr jāmiʿ
        </button>
        <div style={{ width: 220, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[12], boxShadow: '0 10px 24px rgba(15,23,42,0.1)' }}>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Comprehensive city</p>
          <p style={{ ...typography.bodyText, margin: `${spacing[8]} 0 0`, fontSize: 14, color: colors.textSoft }}>Place with ruler and judge who enforces legal judgments.</p>
        </div>
      </div>
    </div>
  )
}

export function GradeCirclePreview() {
  return (
    <div style={frameStyle()}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[16] }}>
        <div style={{ width: 96, height: 96, borderRadius: radius.pill, border: '8px solid rgba(22, 163, 74, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.success, fontFamily: typography.displayTitle.fontFamily, fontSize: 34 }}>
          A
        </div>
        <div style={{ display: 'grid', gap: spacing[8] }}>
          <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Your grade</p>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Pass with attribution fixes noted.</p>
        </div>
      </div>
    </div>
  )
}

export function ProjectHomeDestinationCardPreview() {
  return (
    <div style={frameStyle()}>
      <article style={{ borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 10px 22px rgba(15,23,42,0.08)', padding: spacing[18], display: 'grid', gap: spacing[12] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
          <span style={{ minHeight: 28, padding: '0 10px', borderRadius: radius.pill, background: 'rgba(239, 246, 255, 0.94)', color: colors.accentStrong, display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AR</span>
          <span style={{ ...typography.monoMeta, color: colors.textSoft }}>Seg 3</span>
        </div>
        <h3 style={{ ...typography.cardTitle, margin: 0, fontSize: 28, color: colors.textStrong }}>Friday Prayer</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
          <div>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Status</p>
            <p style={{ ...typography.bodyText, margin: `${spacing[8]} 0 0`, fontWeight: 600, color: colors.textBody }}>Ready to continue</p>
          </div>
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.accentStrong }}>→</span>
        </div>
      </article>
    </div>
  )
}

export function ProjectsIndexShellPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing[12] }}>
        {['Active', 'Review', 'Archived'].map((item, index) => (
          <div key={item} style={{ minHeight: 140, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: index === 0 ? 'rgba(239, 246, 255, 0.96)' : '#fff', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>{item}</p>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Friday Prayer</p>
            <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft }}>Project list shell with intentional grouping, not a crowded dashboard table.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WorkspaceCardFamilyPreview() {
  const cards = [
    { label: 'Source', icon: ScrollText, tone: 'rgba(239, 246, 255, 0.94)' },
    { label: 'Editor', icon: FileText, tone: 'rgba(255, 255, 255, 0.98)' },
    { label: 'Result', icon: CheckCircle2, tone: 'rgba(220, 252, 231, 0.84)' },
    { label: 'Support', icon: BookOpen, tone: 'rgba(243, 232, 255, 0.84)' },
  ]

  return (
    <div style={{ ...frameStyle(), display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing[12] }}>
      {cards.map(({ label, icon: Icon, tone }) => (
        <div key={label} style={{ minHeight: 110, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: tone, padding: spacing[14], display: 'grid', gap: spacing[10] }}>
          <Icon size={18} strokeWidth={1.8} color={colors.textSoft} />
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>{label}</p>
        </div>
      ))}
    </div>
  )
}

export function SegmentationWorkspacePatternPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      {[
        ['Mode band', 44],
        ['Header band', 72],
        ['Context band', 44],
        ['Workspace band', 200],
        ['Action band', 86],
      ].map(([label, height], index) => (
        <div key={label} style={{ minHeight: height, borderRadius: radius[16], border: `1px solid ${index === 3 ? 'rgba(191, 219, 254, 0.96)' : colors.lineSoft}`, background: index === 3 ? 'rgba(255,255,255,0.98)' : 'rgba(248, 251, 255, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...typography.eyebrowLabel, color: colors.textSoft }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export function StudyWorkspaceShellPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gridTemplateColumns: '112px minmax(0,1fr) 188px', gap: spacing[12], minHeight: 220 }}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff' }} />
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.98)', display: 'grid', placeItems: 'center' }}>
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Primary work lane</span>
      </div>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff' }} />
    </div>
  )
}

export function SupportRailFloatingSystemPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'flex', alignItems: 'flex-end', gap: spacing[12] }}>
      <div style={{ width: 72, minHeight: 166, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff' }} />
      <div style={{ width: 232, minHeight: 146, borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', boxShadow: '0 14px 32px rgba(15,23,42,0.14)', padding: spacing[14], display: 'grid', gap: spacing[8] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Floating preview</p>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft }}>Collapsed rail reveals a larger preview, which can later pin or expand.</p>
      </div>
    </div>
  )
}

export function ReviewRemediationStatePreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ borderRadius: radius[16], border: `1px solid rgba(254, 215, 170, 0.96)`, background: 'rgba(255, 247, 237, 0.96)', padding: spacing[14] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: '#C2410C' }}>Needs repair</p>
      </div>
      <div style={{ borderRadius: radius[16], border: `1px solid rgba(191, 219, 254, 0.96)`, background: 'rgba(239, 246, 255, 0.96)', padding: spacing[14] }}>
        <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.accentStrong }}>Review guidance attached</p>
      </div>
    </div>
  )
}

export function ExamsFocusShellPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ minHeight: 220, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[18], display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: spacing[14] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[12] }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>Exam</p>
            <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Segment 2.2 Conditions</p>
          </div>
          <span style={{ ...typography.monoMeta, color: colors.textSoft }}>Autosaved</span>
        </div>
        <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(248, 250, 252, 0.92)', padding: spacing[16], display: 'grid', gap: spacing[10] }}>
          <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Translate the highlighted segment without opening the full study shell around it.</p>
          <div style={{ minHeight: 70, borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[12] }}>
          <button type="button" style={{ minHeight: 40, padding: '0 16px', borderRadius: radius.pill, border: `1px solid ${colors.lineSoft}`, background: '#fff', color: colors.textSoft }}>Back to study</button>
          <button type="button" style={{ minHeight: 40, padding: '0 18px', borderRadius: radius.pill, border: 'none', background: colors.accentBase, color: '#fff' }}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export function PatchingShellPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ minHeight: 220, borderRadius: radius[24], border: '1px solid rgba(254, 215, 170, 0.96)', background: 'rgba(255, 247, 237, 0.82)', padding: spacing[18], display: 'grid', gap: spacing[14] }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <p style={{ ...typography.eyebrowLabel, margin: 0, color: '#C2410C' }}>Controlled correction workflow</p>
          <p style={{ ...typography.bodyText, margin: 0, fontWeight: 700, color: colors.textStrong }}>Preview impact before committing a patch.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[12] }}>
          <div style={{ minHeight: 118, borderRadius: radius[16], border: `1px solid rgba(253, 186, 116, 0.96)`, background: 'rgba(255,255,255,0.94)', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Current output</p>
            <div style={{ borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: 'rgba(248, 250, 252, 0.92)', minHeight: 56 }} />
          </div>
          <div style={{ minHeight: 118, borderRadius: radius[16], border: `1px solid rgba(253, 186, 116, 0.96)`, background: 'rgba(255,255,255,0.94)', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
            <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.textSoft }}>Patched output</p>
            <div style={{ borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: 'rgba(255,255,255,0.98)', minHeight: 56 }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[12] }}>
          <button type="button" style={{ minHeight: 38, padding: '0 14px', borderRadius: radius.pill, border: `1px solid rgba(253, 186, 116, 0.96)`, background: 'rgba(255,255,255,0.92)', color: '#9A3412' }}>Preview impact</button>
          <button type="button" style={{ minHeight: 38, padding: '0 14px', borderRadius: radius.pill, border: 'none', background: '#EA580C', color: '#fff' }}>Apply patch</button>
        </div>
      </div>
    </div>
  )
}

export function SegmentationSuccessStagePreview() {
  return (
    <div style={{ ...frameStyle(), display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
      <div style={{ width: 360, borderRadius: radius[24], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[24], display: 'grid', gap: spacing[12], textAlign: 'center' }}>
        <p style={{ ...typography.eyebrowLabel, margin: 0, color: colors.accentBase }}>Published</p>
        <h3 style={{ ...typography.cardTitle, margin: 0, fontSize: 34, color: colors.textStrong }}>Segments ready</h3>
        <p style={{ ...typography.bodyText, margin: 0, color: colors.textBody }}>Source preserved. Structure approved. Study can begin.</p>
      </div>
    </div>
  )
}

export function PassReflectionPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(220, 252, 231, 0.84)', padding: spacing[14], display: 'flex', alignItems: 'center', gap: spacing[10] }}>
        <CheckCircle2 size={16} strokeWidth={1.8} color={colors.success} />
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Best in class translation</span>
        <button type="button" style={{ marginLeft: 'auto', minHeight: 30, padding: '0 12px', border: `1px solid rgba(134, 239, 172, 0.96)`, borderRadius: radius.pill, background: 'rgba(255,255,255,0.92)' }}>
          <Pin size={13} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[14] }}>
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Your translation</span>
      </div>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(248, 250, 252, 0.94)', padding: spacing[14] }}>
        <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Discussion + notes</span>
      </div>
    </div>
  )
}

export function BestInClassTranslationPreview() {
  return (
    <div style={frameStyle()}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(220, 252, 231, 0.84)', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[10] }}>
          <CheckCircle2 size={16} strokeWidth={1.8} color={colors.success} />
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Best in class translation</span>
          <button type="button" style={{ marginLeft: 'auto', minHeight: 30, padding: '0 12px', border: `1px solid rgba(134, 239, 172, 0.96)`, borderRadius: radius.pill, background: 'rgba(255,255,255,0.92)' }}>
            <Pin size={13} strokeWidth={1.8} />
          </button>
        </div>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Reference answer shown after submission as a calm success surface.</p>
      </div>
    </div>
  )
}

export function YourTranslationPreview() {
  return (
    <div style={frameStyle()}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[10] }}>
          <FileText size={16} strokeWidth={1.8} color={colors.textSoft} />
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Your translation</span>
          <button type="button" style={{ marginLeft: 'auto', minHeight: 30, padding: '0 12px', border: `1px solid ${colors.lineSoft}`, borderRadius: radius.pill, background: '#fff' }}>
            <Pin size={13} strokeWidth={1.8} />
          </button>
        </div>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textBody }}>Comparison card for the user’s submitted translation.</p>
      </div>
    </div>
  )
}

export function DiscussionSummaryNotesPreview() {
  return (
    <div style={frameStyle()}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: 'rgba(248, 250, 252, 0.94)', padding: spacing[14], display: 'grid', gap: spacing[10] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[10] }}>
          <MessageSquare size={16} strokeWidth={1.8} color="#4F46E5" />
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Discussion summary + notes</span>
        </div>
        <p style={{ ...typography.bodyText, margin: 0, fontSize: 14, color: colors.textSoft }}>Saved discussion summary with manual notes attached beneath it.</p>
      </div>
    </div>
  )
}

export function DiscussionFlowPreview() {
  return (
    <div style={{ ...frameStyle(), display: 'grid', gap: spacing[12] }}>
      <div style={{ borderRadius: radius[16], border: `1px solid ${colors.lineSoft}`, background: '#fff', padding: spacing[14], display: 'grid', gap: spacing[8] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[8] }}>
          <MessageSquare size={16} strokeWidth={1.8} color="#4F46E5" />
          <span style={{ ...typography.bodyText, fontWeight: 700, color: colors.textStrong }}>Segment discussion</span>
        </div>
        <div style={{ minHeight: 70, borderRadius: radius[12], background: 'rgba(248, 250, 252, 0.92)', border: `1px solid ${colors.lineSoft}` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[8] }}>
          <div style={{ flex: 1, minHeight: 38, borderRadius: radius[12], border: `1px solid ${colors.lineSoft}`, background: '#fff' }} />
          <button type="button" style={{ minWidth: 72, border: 'none', borderRadius: radius[12], background: colors.accentBase, color: '#fff' }}>Send</button>
        </div>
      </div>
    </div>
  )
}
