import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/figma/Sidebar";
import LeftPanel from "../components/figma/LeftPanel";
import CenterPanel from "../components/figma/CenterPanel";
import RightPanel from "../components/figma/RightPanel";

const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 144;
const SEGMENTS_COLLAPSED_WIDTH = 76;
const SEGMENTS_EXPANDED_WIDTH = 224;
const RIGHT_COLLAPSED_WIDTH = 72;
const RIGHT_EXPANDED_WIDTH = 400;
const STORAGE_KEY = "design-sandbox.segment-state.v1";

const segmentNodes = [
  { id: "1", label: "Chapter 1: Purity", type: "folder", depth: 0, isOpenByDefault: true },
  {
    id: "1.1",
    label: "1.1 Types of Water",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 1: Purity",
  },
  {
    id: "1.2",
    label: "1.2 Ablution (Wudu)",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 1: Purity",
  },
  {
    id: "1.3",
    label: "1.3 Ghusl",
    type: "file",
    depth: 1,
    defaultOutcome: "failed-first",
    chapterLabel: "Chapter 1: Purity",
  },
  {
    id: "1.4",
    label: "1.4 Tayammum",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 1: Purity",
  },
  { id: "2", label: "Chapter 2: Prayer", type: "folder", depth: 0, isOpenByDefault: true },
  {
    id: "2.1",
    label: "2.1 Times of Prayer",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 2: Prayer",
  },
  {
    id: "2.2",
    label: "2.2 Conditions",
    type: "file",
    depth: 1,
    defaultOutcome: "failed-first",
    chapterLabel: "Chapter 2: Prayer",
  },
  {
    id: "2.3",
    label: "2.3 Jumu'ah",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 2: Prayer",
  },
  { id: "3", label: "Chapter 3: Fasting", type: "folder", depth: 0, isOpenByDefault: false },
  {
    id: "3.1",
    label: "3.1 Opening Intentions",
    type: "file",
    depth: 1,
    defaultOutcome: "submitted",
    chapterLabel: "Chapter 3: Fasting",
  },
];

const fileSegments = segmentNodes.filter((node) => node.type === "file");
const defaultSegmentRecords = Object.fromEntries(
  fileSegments.map((segment) => [
    segment.id,
    {
      submissionState: "draft",
      attempts: 0,
    },
  ]),
);

function readPersistedState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function FigmaScreen() {
  const persistedState = readPersistedState();
  const [segmentRecords, setSegmentRecords] = useState(() => ({
    ...defaultSegmentRecords,
    ...(persistedState?.segmentRecords ?? {}),
  }));
  const [currentSegmentId, setCurrentSegmentId] = useState(
    persistedState?.currentSegmentId ?? "1.3",
  );
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSegmentsCollapsed, setIsSegmentsCollapsed] = useState(false);
  const [isSegmentsHovered, setIsSegmentsHovered] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const isSidebarExpanded = isSidebarPinnedOpen || isSidebarHovered;
  const isSegmentsExpanded = !isSegmentsCollapsed || isSegmentsHovered;
  const isRightExpanded = !isRightCollapsed;
  const currentSegmentIndex = fileSegments.findIndex(
    (segment) => segment.id === currentSegmentId,
  );
  const currentSegment =
    fileSegments[currentSegmentIndex] ?? fileSegments[0];
  const currentRecord =
    segmentRecords[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id];
  const canGoPrevious = currentSegmentIndex > 0;
  const canGoNext = currentSegmentIndex < fileSegments.length - 1;

  const segmentMeta = useMemo(
    () => ({
      chapterLabel: currentSegment.chapterLabel,
      segmentLabel: currentSegment.label,
      progressText: `Segment ${currentSegmentIndex + 1} of ${fileSegments.length}`,
      progressStep: currentSegmentIndex,
      progressTotal: fileSegments.length,
    }),
    [currentSegment, currentSegmentIndex],
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentSegmentId,
        segmentRecords,
      }),
    );
  }, [currentSegmentId, segmentRecords]);

  const handleSubmit = () => {
    setSegmentRecords((current) => {
      const existingRecord =
        current[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id];
      const nextAttempts = (existingRecord.attempts ?? 0) + 1;
      const shouldFailFirst =
        currentSegment.defaultOutcome === "failed-first" &&
        (existingRecord.attempts ?? 0) === 0;

      return {
        ...current,
        [currentSegment.id]: {
          submissionState: shouldFailFirst ? "failed" : "submitted",
          attempts: nextAttempts,
        },
      };
    });
  };

  const setCurrentSegmentSubmissionState = (submissionState, attempts) => {
    setSegmentRecords((current) => ({
      ...current,
      [currentSegment.id]: {
        ...(current[currentSegment.id] ?? defaultSegmentRecords[currentSegment.id]),
        submissionState,
        attempts,
      },
    }));
  };

  const resetCurrentSegment = () => {
    setCurrentSegmentSubmissionState("draft", 0);
  };

  const failCurrentSegment = () => {
    setCurrentSegmentSubmissionState("failed", 1);
  };

  const passCurrentSegment = () => {
    setCurrentSegmentSubmissionState("submitted", 2);
  };

  const goToPreviousSegment = () => {
    if (!canGoPrevious) {
      return;
    }

    setCurrentSegmentId(fileSegments[currentSegmentIndex - 1].id);
  };

  const goToNextSegment = () => {
    if (!canGoNext) {
      return;
    }

    setCurrentSegmentId(fileSegments[currentSegmentIndex + 1].id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: `${isSidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px ${isSegmentsExpanded ? SEGMENTS_EXPANDED_WIDTH : SEGMENTS_COLLAPSED_WIDTH}px minmax(0, 1fr) ${isRightExpanded ? RIGHT_EXPANDED_WIDTH : RIGHT_COLLAPSED_WIDTH}px`,
          background: "#ffffff",
          overflow: "hidden",
          transition: "grid-template-columns 0.22s ease",
        }}
      >
        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarPinnedOpen((current) => !current)}
            onHoverStart={() => {
              if (!isSidebarPinnedOpen) {
                setIsSidebarHovered(true);
              }
            }}
            onHoverEnd={() => setIsSidebarHovered(false)}
          />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <LeftPanel
            nodes={segmentNodes}
            currentSegmentId={currentSegment.id}
            segmentRecords={segmentRecords}
            onSelectSegment={setCurrentSegmentId}
            isCollapsed={isSegmentsCollapsed}
            isPreviewExpanded={isSegmentsCollapsed && isSegmentsHovered}
            onToggleCollapse={() => setIsSegmentsCollapsed((current) => !current)}
            onHoverStart={() => {
              if (isSegmentsCollapsed) {
                setIsSegmentsHovered(true);
              }
            }}
            onHoverEnd={() => setIsSegmentsHovered(false)}
          />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <CenterPanel
            submissionState={currentRecord.submissionState}
            onSubmit={handleSubmit}
            onPreviousSegment={goToPreviousSegment}
            onNextSegment={goToNextSegment}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            segmentMeta={segmentMeta}
            debugActions={{
              onReset: resetCurrentSegment,
              onFail: failCurrentSegment,
              onPass: passCurrentSegment,
            }}
          />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <RightPanel
            submissionState={currentRecord.submissionState}
            isCollapsed={isRightCollapsed}
            onToggleCollapse={() => setIsRightCollapsed((current) => !current)}
          />
        </div>
      </div>
    </div>
  );
}
