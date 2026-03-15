import { useState } from "react";
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

export default function FigmaScreen() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSegmentsCollapsed, setIsSegmentsCollapsed] = useState(false);
  const [isSegmentsHovered, setIsSegmentsHovered] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const isSidebarExpanded = isSidebarPinnedOpen || isSidebarHovered;
  const isSegmentsExpanded = !isSegmentsCollapsed || isSegmentsHovered;
  const isRightExpanded = !isRightCollapsed;

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
          <CenterPanel isSubmitted={isSubmitted} onSubmit={() => setIsSubmitted(true)} />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <RightPanel
            isSubmitted={isSubmitted}
            isCollapsed={isRightCollapsed}
            onToggleCollapse={() => setIsRightCollapsed((current) => !current)}
          />
        </div>
      </div>
    </div>
  );
}
