import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import {
  getSegmentationFlowHeaderSlots,
  SegmentationLoadingView,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import {
  getLoadingAdvanceRoute,
  readSegmentationFlowPreferences,
  shouldPauseSegmentationFlowTimers,
} from '../../foundation/primitives/segmentationFlowState'
import PrimaryCTA from '../../foundation/primitives/PrimaryCTA'
import { GhostButton } from '../../foundation/primitives/CompactControls'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import { colors, segmentationFlowMetrics as flowMetrics, spacing, typography } from '../../foundation/tokens'
import { actions, select, getSnapshot } from '../../data'
import { segmentText } from '../../services/ai'
import { generateMarkers, markersToChunks } from '../../lib/segmentation'
import layoutContract from './SegmentationLoadingScreen.contract'

function latestSource(snapshot) {
  const project = select.getCurrentProject(snapshot)
  const sourceId = project?.sourceIds?.[project.sourceIds.length - 1]
  const source = sourceId ? snapshot.sources[sourceId] : null
  return { project, source }
}

/**
 * Honest AI-segmentation recovery. Never a fabricated split: when the provider
 * is absent or fails, the raw source is preserved and the user is offered Setup
 * AI, an on-device split, or going back — the proposal stays unwritten until one
 * of those produces a real one (S3-001 / S3-005).
 */
function SegmentationAiRecovery({ state, message, onSetupAi, onSegmentOnDevice, onBack }) {
  return (
    <div style={{ display: 'grid', gap: spacing[16], justifyItems: 'center', textAlign: 'center', maxWidth: '48ch', margin: '0 auto', padding: spacing[24] }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[8], color: colors.accentStrong }}>
        <Sparkles size={20} strokeWidth={1.9} />
      </span>
      <h2 style={{ ...typography.sectionTitle, margin: 0, color: colors.textStrong }}>
        {state === 'unavailable' ? 'AI segmentation needs a provider' : 'AI segmentation didn’t complete'}
      </h2>
      <p style={{ ...typography.supportSubtext, margin: 0, color: colors.textSoft }}>
        {message || 'Your source is preserved. Choose how to continue.'}
      </p>
      <div style={{ display: 'flex', gap: spacing[12], flexWrap: 'wrap', justifyContent: 'center' }}>
        {state === 'unavailable' ? (
          <PrimaryCTA icon={<Sparkles size={16} strokeWidth={2} />} minWidth={160} height={44} onClick={onSetupAi}>
            Set up AI
          </PrimaryCTA>
        ) : (
          <PrimaryCTA minWidth={160} height={44} onClick={onSegmentOnDevice}>
            Segment on device
          </PrimaryCTA>
        )}
        {state === 'unavailable' ? (
          <GhostButton onClick={onSegmentOnDevice}>Segment on device instead</GhostButton>
        ) : (
          <GhostButton onClick={onSetupAi}>Check AI setup</GhostButton>
        )}
        <GhostButton onClick={onBack}>Back to source</GhostButton>
      </div>
    </div>
  )
}

export default function SegmentationLoadingScreen({ route, shell }) {
  const [aiState, setAiState] = useState('running') // running | unavailable | error
  const [aiMessage, setAiMessage] = useState('')
  const startedRef = useRef(false)

  useEffect(() => {
    if (shouldPauseSegmentationFlowTimers()) {
      return undefined
    }

    const prefs = readSegmentationFlowPreferences()

    // Non-AI methods already stored their proposal at intake; this screen is only
    // the animation, then it advances.
    if (prefs.method !== 'ai') {
      const timer = window.setTimeout(() => {
        shell.navigate(getLoadingAdvanceRoute())
      }, flowMetrics.loadingAdvanceDelayMs)
      return () => window.clearTimeout(timer)
    }

    // AI method: perform the provider call exactly once.
    if (startedRef.current) {
      return undefined
    }
    startedRef.current = true

    const { project, source } = latestSource(getSnapshot())
    let cancelled = false
    // Missing source is handled by the async branch (segmentText returns an
    // honest 'empty'), so no synchronous setState is needed in the effect body.
    segmentText({ source: source?.rawText ?? '', style: prefs.style, granularity: prefs.granularity })
      .then((res) => {
        if (cancelled) return
        if (res.available && project && source) {
          actions.saveProposal({
            projectId: project.id,
            sourceId: source.id,
            chunks: res.result.chunks,
            method: 'ai',
            style: prefs.style,
            granularity: prefs.granularity,
          })
          shell.navigate(getLoadingAdvanceRoute())
        } else {
          setAiState(res.reason === 'no-provider' ? 'unavailable' : 'error')
          setAiMessage(res.message || (project && source ? '' : 'The source could not be found. Go back and paste it again.'))
        }
      })
    return () => { cancelled = true }
  }, [shell])

  const segmentOnDevice = () => {
    const prefs = readSegmentationFlowPreferences()
    const { project, source } = latestSource(getSnapshot())
    if (!project || !source) return
    const chunks = markersToChunks(
      generateMarkers(source.rawText, 'local', prefs.style, prefs.granularity),
      { chapterLabel: 'Chapter 1' },
    )
    actions.saveProposal({
      projectId: project.id,
      sourceId: source.id,
      chunks,
      method: 'local',
      style: prefs.style,
      granularity: prefs.granularity,
    })
    shell.navigate('segmentationReview')
  }

  const recovering = aiState === 'unavailable' || aiState === 'error'

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      stepIndex: 1,
      backRoute: 'segmentationPasteNext',
    }),
    Layer3_SegmentationFlow_Page: recovering ? (
      <SegmentationAiRecovery
        state={aiState}
        message={aiMessage}
        onSetupAi={() => shell.openAiConfig?.()}
        onSegmentOnDevice={segmentOnDevice}
        onBack={() => shell.navigate('segmentationPasteNext')}
      />
    ) : (
      <SegmentationLoadingView />
    ),
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={slots}
    />
  )
}
