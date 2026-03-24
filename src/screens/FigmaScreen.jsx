import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/figma/Sidebar";
import LeftPanel from "../components/figma/LeftPanel";
import CenterPanel from "../components/figma/CenterPanel";
import RightPanel from "../components/figma/RightPanel";

const SIDEBAR_COLLAPSED_WIDTH = 60;
const SEGMENTS_COLLAPSED_WIDTH = 76;
const RIGHT_COLLAPSED_WIDTH = 72;
const STORAGE_KEY = "design-sandbox.segment-state.v1";
const EXAM_CONTEXT_KEY = "design-sandbox.exam-context.v1";

const studyShellStyles = `
  .study-shell,
  .study-shell * {
    box-sizing: border-box;
  }

  .study-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(circle at 8% 10%, rgba(219, 234, 254, 0.7), transparent 24%),
      radial-gradient(circle at 88% 14%, rgba(226, 232, 240, 0.72), transparent 20%),
      linear-gradient(180deg, #f6f9fd 0%, #edf3f9 100%);
    width: 100%;
    overflow: hidden;
  }

  .study-shell__banner {
    flex: 0 0 auto;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(203, 213, 225, 0.72);
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.92) 0%, rgba(255, 255, 255, 0.96) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .study-shell__bannerCopy {
    min-width: 0;
  }

  .study-shell__bannerEyebrow {
    margin: 0 0 6px;
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2563eb;
    font-weight: 700;
  }

  .study-shell__bannerText {
    margin: 0;
    color: #334155;
    font-size: 14px;
    line-height: 1.5;
  }

  .study-shell__bannerDismiss {
    border: 1px solid rgba(203, 213, 225, 0.92);
    border-radius: 999px;
    min-height: 34px;
    padding: 0 14px;
    background: rgba(255,255,255,0.92);
    color: #475569;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  .study-shell__layout {
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
    display: grid;
    grid-template-columns: var(--study-sidebar-width) var(--study-segments-width) minmax(0, 1fr) var(--study-right-width);
    transition: grid-template-columns 0.22s ease;
    background: #ffffff;
    overflow: hidden;
  }

  .study-shell__pane {
    min-width: 0;
    min-height: 0;
    height: 100%;
  }

  .study-shell__center {
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: #ffffff;
  }

  .study-shell__centerInner {
    min-width: 0;
    min-height: 0;
    height: 100%;
  }
`;

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

function readExamContext() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(EXAM_CONTEXT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function FigmaScreen() {
  const persistedState = readPersistedState();
  const examContext = readExamContext();
  const [segmentRecords, setSegmentRecords] = useState(() => ({
    ...defaultSegmentRecords,
    ...(persistedState?.segmentRecords ?? {}),
  }));
  const [currentSegmentId, setCurrentSegmentId] = useState(
    examContext?.segmentId ?? persistedState?.currentSegmentId ?? "1.3",
  );
  const [activeExamContext, setActiveExamContext] = useState(examContext);
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSegmentsCollapsed, setIsSegmentsCollapsed] = useState(false);
  const [isSegmentsHovered, setIsSegmentsHovered] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1440 : window.innerWidth,
  );

  const isSidebarExpanded = isSidebarPinnedOpen || isSidebarHovered;
  const isSegmentsExpanded = !isSegmentsCollapsed || isSegmentsHovered;
  const isRightExpanded = !isRightCollapsed;
  const layoutDensity = viewportWidth <= 1366 ? "compact" : viewportWidth >= 1800 ? "wide" : "standard";
  const shellWidths = useMemo(() => {
    if (layoutDensity === "compact") {
      return {
        sidebarExpanded: 128,
        segmentsExpanded: 208,
        rightExpanded: 344,
      };
    }

    if (layoutDensity === "wide") {
      return {
        sidebarExpanded: 152,
        segmentsExpanded: 232,
        rightExpanded: 392,
      };
    }

    return {
      sidebarExpanded: 140,
      segmentsExpanded: 224,
      rightExpanded: 376,
    };
  }, [layoutDensity]);
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
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentSegmentId,
        segmentRecords,
      }),
    );
  }, [currentSegmentId, segmentRecords]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const dismissExamContext = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(EXAM_CONTEXT_KEY);
    }
    setActiveExamContext(null);
  };

  const handleSelectMode = (modeId) => {
    if (modeId === "home") {
      window.location.hash = "home";
      return;
    }

    if (modeId === "projects") {
      window.location.hash = "projects";
      return;
    }

    if (modeId === "segmentation") {
      window.location.hash = "segmentation";
      return;
    }

    if (modeId === "exams") {
      window.location.hash = "exams";
      return;
    }
  };

  return (
    <>
      <style>{studyShellStyles}</style>
      <div className="study-shell">
        {activeExamContext ? (
          <div className="study-shell__banner">
            <div className="study-shell__bannerCopy">
              <p className="study-shell__bannerEyebrow">Exam context</p>
              <p className="study-shell__bannerText">
                {activeExamContext.examTitle} · {activeExamContext.reason} · {activeExamContext.concept}
              </p>
            </div>
            <button
              type="button"
              className="study-shell__bannerDismiss"
              onClick={dismissExamContext}
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <div
          className="study-shell__layout"
          style={{
            "--study-sidebar-width": `${isSidebarExpanded ? shellWidths.sidebarExpanded : SIDEBAR_COLLAPSED_WIDTH}px`,
            "--study-segments-width": `${isSegmentsExpanded ? shellWidths.segmentsExpanded : SEGMENTS_COLLAPSED_WIDTH}px`,
            "--study-right-width": `${isRightExpanded ? shellWidths.rightExpanded : RIGHT_COLLAPSED_WIDTH}px`,
          }}
        >
        <div className="study-shell__pane">
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarPinnedOpen((current) => !current)}
            onHoverStart={() => {
              if (!isSidebarPinnedOpen) {
                setIsSidebarHovered(true);
              }
            }}
            onHoverEnd={() => setIsSidebarHovered(false)}
            activeId="study"
            onSelect={handleSelectMode}
          />
        </div>

        <div className="study-shell__pane">
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

        <div className="study-shell__center">
          <div className="study-shell__centerInner">
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
        </div>

        <div className="study-shell__pane">
          <RightPanel
            submissionState={currentRecord.submissionState}
            isCollapsed={isRightCollapsed}
            onToggleCollapse={() => setIsRightCollapsed((current) => !current)}
          />
        </div>
      </div>
      </div>
    </>
  );
}
