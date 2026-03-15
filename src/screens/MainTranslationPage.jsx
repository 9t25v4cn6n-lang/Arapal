import Sidebar from "../components/figma/Sidebar";
import LeftPanel from "../components/figma/LeftPanel";
import CenterPanel from "../components/figma/CenterPanel";
import RightPanel from "../components/figma/RightPanel";

export default function MainTranslationPage() {
  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100vw",
        background: "#ffffff",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100vw",
          maxWidth: "100vw",
          minHeight: "100vh",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "60px 224px minmax(0, calc(100vw - 684px)) 400px",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <div style={{ minWidth: 0, minHeight: 0 }}>
          <Sidebar />
        </div>
        <div style={{ minWidth: 0, minHeight: 0 }}>
          <LeftPanel />
        </div>
        <div style={{ minWidth: 0, minHeight: 0 }}>
          <CenterPanel />
        </div>
        <div style={{ minWidth: 0, minHeight: 0 }}>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
