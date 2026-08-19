import { useRef, useState } from 'react'
import {
  createSegmentationReviewSegments,
  createSegmentationReviewGroupTitles,
  getSegmentationFlowHeaderSlots,
  getSegmentationReviewSummary,
  ReviewMarkerPanel,
  ReviewOutput,
  SegmentationReviewActionRegion,
  SegmentationReviewIntro,
  SegmentationReviewSelectedToolbar,
  SegmentationReviewSourceTray,
} from '../../foundation/primitives/SegmentationFlowPrimitives'
import V2ScreenFrame from '../../foundation/primitives/V2ScreenFrame'
import layoutContract from './SegmentationReviewScreen.contract'
import { select, getSnapshot } from '../../data'

const reviewSectionSize = 3

function getReviewSegmentDisplayNumber(segments, segmentId) {
  const index = segments.findIndex((segment) => segment.id === segmentId)

  if (index < 0) {
    return null
  }

  return `${Math.floor(index / reviewSectionSize) + 1}.${(index % reviewSectionSize) + 1}`
}

function getSelectionRange(segments, selectionRange) {
  if (!selectionRange?.anchorId || !selectionRange?.focusId) {
    return {
      startIndex: -1,
      endIndex: -1,
      ids: [],
      segments: [],
    }
  }

  const anchorIndex = segments.findIndex((segment) => segment.id === selectionRange.anchorId)
  const focusIndex = segments.findIndex((segment) => segment.id === selectionRange.focusId)

  if (anchorIndex < 0 || focusIndex < 0) {
    return {
      startIndex: -1,
      endIndex: -1,
      ids: [],
      segments: [],
    }
  }

  const startIndex = Math.min(anchorIndex, focusIndex)
  const endIndex = Math.max(anchorIndex, focusIndex)
  const selectedSegments = segments.slice(startIndex, endIndex + 1)

  return {
    startIndex,
    endIndex,
    ids: selectedSegments.map((segment) => segment.id),
    segments: selectedSegments,
  }
}

function getDisplayRangeLabel(segments, selectedIds) {
  if (selectedIds.length === 0) {
    return null
  }

  const firstLabel = getReviewSegmentDisplayNumber(segments, selectedIds[0])
  const lastLabel = getReviewSegmentDisplayNumber(segments, selectedIds[selectedIds.length - 1])

  if (!firstLabel || !lastLabel) {
    return null
  }

  return firstLabel === lastLabel ? firstLabel : `${firstLabel}-${lastLabel}`
}

function getSegmentWords(text) {
  return text.trim().split(/\s+/).filter(Boolean)
}

function getDefaultSplitPoints(text) {
  const words = getSegmentWords(text)

  if (words.length < 2) {
    return []
  }

  return [Math.max(1, Math.floor(words.length / 2))]
}

function splitSegmentTextByPoints(text, splitPoints = []) {
  const words = getSegmentWords(text)

  if (words.length === 0) {
    return [text]
  }

  const normalizedPoints = [...new Set(splitPoints)]
    .filter((point) => point > 0 && point < words.length)
    .sort((first, second) => first - second)
  const points = [...normalizedPoints, words.length]
  let start = 0

  return points.map((point) => {
    const chunk = words.slice(start, point).join(' ')
    start = point
    return chunk
  }).filter(Boolean)
}

function getMergedReviewStateForSegments(segments) {
  return segments.some((segment) => segment.reviewState === 'needs-review') ? 'needs-review' : 'second-look'
}

function isGeneratedSegmentLabel(label) {
  return /^Segment\s+\d+[a-z]?$/i.test(label.trim())
}

function normalizeGeneratedSegmentLabels(segments) {
  return segments.map((segment, index) => (
    isGeneratedSegmentLabel(segment.label)
      ? { ...segment, label: `Segment ${index + 1}` }
      : segment
  ))
}

function getGroupIdForIndex(index) {
  return `meaning-group-${Math.floor(index / reviewSectionSize) + 1}`
}

function getGroupIdsForRange(startIndex, endIndex) {
  const groupIds = new Set()

  for (let index = startIndex; index <= endIndex; index += 1) {
    groupIds.add(getGroupIdForIndex(index))
  }

  return [...groupIds]
}

function cloneSegments(segments) {
  return segments.map((segment) => ({ ...segment }))
}

export default function SegmentationReviewScreen({ route, shell }) {
  const nextSegmentIdRef = useRef(11)
  // Seed from what was actually published, so Review edits the user's own
  // proposal rather than a fixture that happens to look similar.
  const [segments, setSegments] = useState(() => {
    const snapshot = getSnapshot()
    const project = select.getCurrentProject(snapshot)
    return createSegmentationReviewSegments(project ? select.listSegments(project.id, snapshot) : null)
  })
  const [groupTitles, setGroupTitles] = useState(createSegmentationReviewGroupTitles)
  const [staleGroupIds, setStaleGroupIds] = useState([])
  const [history, setHistory] = useState({ past: [], future: [] })
  const [selectionRange, setSelectionRange] = useState(() => {
    const firstSegmentId = segments[0]?.id

    return firstSegmentId ? { anchorId: firstSegmentId, focusId: firstSegmentId } : null
  })
  const [sourceMode, setSourceMode] = useState('collapsed')
  const [boundaryFocusId, setBoundaryFocusId] = useState(null)
  const [pendingSplitId, setPendingSplitId] = useState(null)
  const [splitPointsBySegment, setSplitPointsBySegment] = useState({})
  const [advancedEditMode, setAdvancedEditMode] = useState(false)
  const [advancedEditId, setAdvancedEditId] = useState(null)
  const [removeMenuOpen, setRemoveMenuOpen] = useState(false)
  const [collapsedGroupIds, setCollapsedGroupIds] = useState([])
  const [proposalViewMode, setProposalViewMode] = useState('grid')
  const [toolbarIsFloating, setToolbarIsFloating] = useState(false)

  const summary = getSegmentationReviewSummary(segments)
  const selectedRange = getSelectionRange(segments, selectionRange)
  const selectedSegment = selectedRange.segments[0] ?? null
  const selectedDisplayRange = getDisplayRangeLabel(segments, selectedRange.ids)
  const canSplitSelected = selectedRange.segments.length === 1
  const canMergeSelected = selectedRange.segments.length > 1
  const canMergeSelectedWithNext = selectedRange.segments.length > 0 && selectedRange.endIndex < segments.length - 1
  const canRemoveSelected = selectedRange.segments.length > 0 && selectedRange.segments.length < segments.length
  const canRemoveToPrevious = canRemoveSelected && selectedRange.startIndex > 0
  const canRemoveToNext = canRemoveSelected && selectedRange.endIndex < segments.length - 1
  const canMarkSelectedReady = selectedRange.segments.some((segment) => segment.reviewState !== 'ready')
  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const getCurrentSnapshot = () => ({
    segments: cloneSegments(segments),
    groupTitles: { ...groupTitles },
    staleGroupIds: [...staleGroupIds],
  })

  const applyEditorChange = ({
    nextSegments = segments,
    nextGroupTitles = groupTitles,
    nextStaleGroupIds = staleGroupIds,
    nextSelectionRange = selectionRange,
  }) => {
    const previousSnapshot = getCurrentSnapshot()

    setHistory((current) => ({
      past: [...current.past, previousSnapshot].slice(-30),
      future: [],
    }))
    setSegments(nextSegments)
    setGroupTitles(nextGroupTitles)
    setStaleGroupIds(nextStaleGroupIds)
    setSelectionRange(nextSelectionRange)
  }

  const restoreSnapshot = (snapshot) => {
    setSegments(cloneSegments(snapshot.segments))
    setGroupTitles({ ...snapshot.groupTitles })
    setStaleGroupIds([...(snapshot.staleGroupIds ?? [])])
    setSelectionRange(snapshot.segments[0]?.id ? { anchorId: snapshot.segments[0].id, focusId: snapshot.segments[0].id } : null)
    setBoundaryFocusId(null)
    setPendingSplitId(null)
    setSplitPointsBySegment({})
    setAdvancedEditMode(false)
    setAdvancedEditId(null)
    setRemoveMenuOpen(false)
  }

  const createSegmentId = () => {
    const nextId = `new-${nextSegmentIdRef.current}`
    nextSegmentIdRef.current += 1
    return nextId
  }

  const handleUndo = () => {
    const previousSnapshot = history.past.at(-1)

    if (!previousSnapshot) {
      return
    }

    const currentSnapshot = getCurrentSnapshot()

    restoreSnapshot(previousSnapshot)
    setHistory((current) => ({
      past: current.past.slice(0, -1),
      future: [currentSnapshot, ...current.future].slice(0, 30),
    }))
  }

  const handleRedo = () => {
    const nextSnapshot = history.future[0]

    if (!nextSnapshot) {
      return
    }

    const currentSnapshot = getCurrentSnapshot()

    restoreSnapshot(nextSnapshot)
    setHistory((current) => ({
      past: [...current.past, currentSnapshot].slice(-30),
      future: current.future.slice(1),
    }))
  }

  const handleLabelChange = (id, label) => {
    applyEditorChange({
      nextSegments: segments.map((segment) => (segment.id === id ? { ...segment, label } : segment)),
    })
  }

  const handleGroupTitleChange = (groupId, title) => {
    applyEditorChange({
      nextGroupTitles: { ...groupTitles, [groupId]: title },
      nextStaleGroupIds: staleGroupIds.filter((id) => id !== groupId),
    })
  }

  const handleSelectSegment = (id) => {
    if (!id) {
      return
    }

    setSelectionRange((currentRange) => {
      const currentSelection = getSelectionRange(segments, currentRange)

      if (currentSelection.ids.includes(id)) {
        if (currentSelection.ids.length === 1 || id === currentRange.focusId || id === currentRange.anchorId) {
          return null
        }

        return { anchorId: currentRange.anchorId, focusId: id }
      }

      if (!currentRange?.anchorId || currentSelection.ids.length === 0) {
        return { anchorId: id, focusId: id }
      }

      return { anchorId: currentRange.anchorId, focusId: id }
    })

    setBoundaryFocusId(null)
    setPendingSplitId(null)
    if (advancedEditMode) {
      setAdvancedEditId(id)
    }
    setRemoveMenuOpen(false)
  }

  const handleToggleGroup = (groupId) => {
    setCollapsedGroupIds((current) => (
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    ))
  }

  const handleRemoveSelection = (mode = 'delete') => {
    const activeSelection = getSelectionRange(segments, selectionRange)

    if (activeSelection.segments.length === 0 || activeSelection.segments.length >= segments.length) {
      return
    }

    const selectedText = activeSelection.segments.map((segment) => segment.text).join(' ').trim()
    const before = segments.slice(0, activeSelection.startIndex)
    const after = segments.slice(activeSelection.endIndex + 1)
    let nextSegments

    if (mode === 'previous' && before.length > 0) {
      const previous = before[before.length - 1]
      nextSegments = [
        ...before.slice(0, -1),
        {
          ...previous,
          text: `${previous.text} ${selectedText}`.trim(),
          reviewState: getMergedReviewStateForSegments([previous, ...activeSelection.segments]),
        },
        ...after,
      ]
    } else if (mode === 'next' && after.length > 0) {
      const next = after[0]
      nextSegments = [
        ...before,
        {
          ...next,
          text: `${selectedText} ${next.text}`.trim(),
          reviewState: getMergedReviewStateForSegments([...activeSelection.segments, next]),
        },
        ...after.slice(1),
      ]
    } else {
      nextSegments = [...before, ...after]
    }

    const normalized = normalizeGeneratedSegmentLabels(nextSegments)
    const nextSelectedId = normalized[Math.max(0, Math.min(activeSelection.startIndex, normalized.length - 1))]?.id ?? null

    applyEditorChange({
      nextSegments: normalized,
      nextSelectionRange: nextSelectedId ? { anchorId: nextSelectedId, focusId: nextSelectedId } : null,
    })

    setBoundaryFocusId(null)
    setPendingSplitId(null)
    setRemoveMenuOpen(false)
  }

  const handleStartSplit = () => {
    if (!canSplitSelected || !selectedSegment) {
      return
    }

    setPendingSplitId(selectedSegment.id)
    setSplitPointsBySegment((current) => ({
      ...current,
      [selectedSegment.id]: current[selectedSegment.id] ?? getDefaultSplitPoints(selectedSegment.text),
    }))
    setBoundaryFocusId(null)
    setRemoveMenuOpen(false)
  }

  const handleCancelSplit = () => {
    setPendingSplitId(null)
  }

  const handleToggleSplitPoint = (id, point) => {
    setSplitPointsBySegment((current) => {
      const segment = segments.find((item) => item.id === id)
      const fallback = segment ? getDefaultSplitPoints(segment.text) : []
      const currentPoints = current[id] ?? fallback
      const nextPoints = currentPoints.includes(point)
        ? currentPoints.filter((item) => item !== point)
        : [...currentPoints, point]

      return {
        ...current,
        [id]: nextPoints.sort((first, second) => first - second),
      }
    })
  }

  const handleApplySplit = (id = pendingSplitId) => {
    if (!id) {
      return
    }

    const selectedIndex = segments.findIndex((segment) => segment.id === id)

    if (selectedIndex < 0) {
      return
    }

    const selected = segments[selectedIndex]
    const splitPoints = splitPointsBySegment[id] ?? getDefaultSplitPoints(selected.text)
    const splitTexts = splitSegmentTextByPoints(selected.text, splitPoints)

    if (splitTexts.length < 2) {
      return
    }

    const splitSegments = splitTexts.map((text, index) => ({
      ...selected,
      id: index === 0 ? selected.id : createSegmentId(),
      text,
      reviewState: index === 0 && selected.reviewState === 'needs-review' ? 'needs-review' : 'second-look',
    }))
    const nextSegments = normalizeGeneratedSegmentLabels([
      ...segments.slice(0, selectedIndex),
      ...splitSegments,
      ...segments.slice(selectedIndex + 1),
    ])
    const lastSplitId = splitSegments[splitSegments.length - 1].id

    applyEditorChange({
      nextSegments,
      nextSelectionRange: { anchorId: selected.id, focusId: lastSplitId },
    })

    setBoundaryFocusId(null)
    setPendingSplitId(null)
    setSplitPointsBySegment((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const handleMergeSelected = ({ includeNext = false } = {}) => {
    const activeSelection = getSelectionRange(segments, selectionRange)

    if (activeSelection.segments.length === 0) {
      return
    }

    const mergeEndIndex = includeNext ? activeSelection.endIndex + 1 : activeSelection.endIndex

    if (mergeEndIndex >= segments.length || mergeEndIndex <= activeSelection.startIndex) {
      return
    }

    const mergeSegments = segments.slice(activeSelection.startIndex, mergeEndIndex + 1)
    const selected = mergeSegments[0]
    const mergedSegment = {
      ...selected,
      text: mergeSegments.map((segment) => segment.text).join(' ').trim(),
      reviewState: getMergedReviewStateForSegments(mergeSegments),
    }
    const nextSegments = normalizeGeneratedSegmentLabels([
      ...segments.slice(0, activeSelection.startIndex),
      mergedSegment,
      ...segments.slice(mergeEndIndex + 1),
    ])
    const touchedGroupIds = getGroupIdsForRange(activeSelection.startIndex, mergeEndIndex)
    const nextStaleGroupIds = touchedGroupIds.length > 1
      ? [...new Set([...staleGroupIds, getGroupIdForIndex(activeSelection.startIndex)])]
      : staleGroupIds

    applyEditorChange({
      nextSegments,
      nextStaleGroupIds,
      nextSelectionRange: { anchorId: activeSelection.ids[0], focusId: activeSelection.ids[0] },
    })

    setBoundaryFocusId(null)
    setPendingSplitId(null)
    setRemoveMenuOpen(false)
  }

  const handleAdjustBoundary = () => {
    if (!selectedSegment) {
      return
    }

    setBoundaryFocusId(selectedSegment.id)
    setPendingSplitId(null)
    setRemoveMenuOpen(false)
  }

  const handleMoveBoundary = (id, direction) => {
    const selectedIndex = segments.findIndex((segment) => segment.id === id)
    const nextIndex = selectedIndex + 1

    if (selectedIndex < 0 || nextIndex >= segments.length) {
      return
    }

    const selectedWords = getSegmentWords(segments[selectedIndex].text)
    const nextWords = getSegmentWords(segments[nextIndex].text)

    if (direction === 'to-next' && selectedWords.length <= 1) {
      return
    }

    if (direction === 'from-next' && nextWords.length <= 1) {
      return
    }

    const movingWord = direction === 'to-next'
      ? selectedWords[selectedWords.length - 1]
      : nextWords[0]
    const nextSegments = segments.map((segment, index) => {
      if (index === selectedIndex) {
        return {
          ...segment,
          text: direction === 'to-next'
            ? selectedWords.slice(0, -1).join(' ')
            : [...selectedWords, movingWord].join(' '),
          reviewState: 'second-look',
        }
      }

      if (index === nextIndex) {
        return {
          ...segment,
          text: direction === 'to-next'
            ? [movingWord, ...nextWords].join(' ')
            : nextWords.slice(1).join(' '),
          reviewState: 'second-look',
        }
      }

      return segment
    })

    applyEditorChange({ nextSegments })
  }

  const handleMarkSelectedReady = () => {
    if (!canMarkSelectedReady) {
      return
    }

    applyEditorChange({
      nextSegments: segments.map((segment) => (
        selectedRange.ids.includes(segment.id) ? { ...segment, reviewState: 'ready' } : segment
      )),
    })
  }

  const handleToggleAdvancedEdit = () => {
    setAdvancedEditMode((current) => {
      const next = !current
      setAdvancedEditId(next ? selectedSegment?.id ?? null : null)
      setPendingSplitId(null)
      setBoundaryFocusId(null)
      setRemoveMenuOpen(false)
      return next
    })
  }

  const handleSegmentTextChange = (id, text) => {
    applyEditorChange({
      nextSegments: segments.map((segment) => (segment.id === id ? { ...segment, text, reviewState: 'second-look' } : segment)),
    })
  }

  const slots = {
    ...getSegmentationFlowHeaderSlots({
      shell,
      // Review is the middle step now, not the last one.
      stepIndex: 1,
      backRoute: 'segmentationSuccess',
    }),
    Layer4_Review_IntroRegion: <SegmentationReviewIntro summary={summary} />,
    Layer4_Review_SourceTrayRegion: (
      <SegmentationReviewSourceTray
        sourceMode={sourceMode}
        onSourceModeChange={setSourceMode}
        onEditSource={() => shell.navigate('segmentationPasteNext')}
      />
    ),
    Layer4_Review_SelectedToolbarRegion: (
      <SegmentationReviewSelectedToolbar
        selectedSegment={selectedSegment}
        selectedSegments={selectedRange.segments}
        selectedDisplayRange={selectedDisplayRange}
        activeTool={pendingSplitId ? 'split' : boundaryFocusId ? 'boundary' : advancedEditMode ? 'advanced' : null}
        canUndo={canUndo}
        canRedo={canRedo}
        canSplitSelected={canSplitSelected}
        canMergeSelected={canMergeSelected}
        canMergeSelectedWithNext={canMergeSelectedWithNext}
        canRemoveSelected={canRemoveSelected}
        canRemoveToPrevious={canRemoveToPrevious}
        canRemoveToNext={canRemoveToNext}
        canMarkSelectedReady={canMarkSelectedReady}
        removeMenuOpen={removeMenuOpen}
        advancedEditMode={advancedEditMode}
        onToggleRemoveMenu={() => setRemoveMenuOpen((current) => !current)}
        isFloating={toolbarIsFloating}
        onToggleFloating={setToolbarIsFloating}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSplitSelected={handleStartSplit}
        onMergeSelected={() => handleMergeSelected()}
        onMergeSelectedWithNext={() => handleMergeSelected({ includeNext: true })}
        onAdjustBoundary={handleAdjustBoundary}
        onMarkSelectedReady={handleMarkSelectedReady}
        onToggleAdvancedEdit={handleToggleAdvancedEdit}
        onRemoveSelected={handleRemoveSelection}
      />
    ),
    Layer4_Review_MarkerRail: (
      <ReviewMarkerPanel
        markers={segments}
        selectedSegmentIds={selectedRange.ids}
        groupTitles={groupTitles}
        staleGroupIds={staleGroupIds}
        onSelectSegment={handleSelectSegment}
        onLabelChange={handleLabelChange}
        onGroupTitleChange={handleGroupTitleChange}
        collapsedGroupIds={collapsedGroupIds}
        onToggleGroup={handleToggleGroup}
      />
    ),
    Layer4_Review_CompiledPreview: (
      <ReviewOutput
        segments={segments}
        selectedSegmentIds={selectedRange.ids}
        boundaryFocusId={boundaryFocusId}
        pendingSplitId={pendingSplitId}
        splitPointsBySegment={splitPointsBySegment}
        advancedEditId={advancedEditId}
        onSelectSegment={handleSelectSegment}
        onToggleSplitPoint={handleToggleSplitPoint}
        onApplySplit={handleApplySplit}
        onCancelSplit={handleCancelSplit}
        onMoveBoundary={handleMoveBoundary}
        onCancelBoundary={() => setBoundaryFocusId(null)}
        onSegmentTextChange={handleSegmentTextChange}
        onCloseAdvancedEdit={() => {
          setAdvancedEditMode(false)
          setAdvancedEditId(null)
        }}
        groupTitles={groupTitles}
        staleGroupIds={staleGroupIds}
        onGroupTitleChange={handleGroupTitleChange}
        collapsedGroupIds={collapsedGroupIds}
        onToggleGroup={handleToggleGroup}
        viewMode={proposalViewMode}
        onViewModeChange={setProposalViewMode}
      />
    ),
    Layer4_Review_ActionRegion: (
      <SegmentationReviewActionRegion
        segmentCount={segments.length}
        reviewCount={summary.totalReview}
        readyCount={summary.ready}
        onApprove={() => shell.navigate('segmentationSuccess')}
        // Re-segmenting means going back to the source and splitting again,
        // which is the same destination "Edit source" already uses — a real
        // action, not a button added to match a picture.
        onResegment={() => shell.navigate('segmentationPasteNext')}
      />
    ),
  }

  return (
    <V2ScreenFrame
      contract={layoutContract}
      route={route}
      shell={shell}
      screenSlots={slots}
      // The workboard is a marker rail beside the proposal. At 390 the rail's
      // hard minimum and the proposal cannot both be satisfied, so the proposal
      // resolved to a 0px track and its 347px of content spilled out of it —
      // the same 0px-track-is-not-hidden failure as Projects and Study. One
      // column at this width: the outline is a navigation aid for a canvas that
      // no longer exists beside it.
      containerOverrides={shell.isMobileViewport ? {
        Layer4_Review_WorkboardRegion: { style: { gridTemplateColumns: 'minmax(0, 1fr)' } },
        Layer4_Review_MarkerRail: { style: { display: 'none' } },
      } : {}}
    />
  )
}
