import Sidebar from "../components/figma/Sidebar";
import LeftPanel from "../components/figma/LeftPanel";
import CenterPanel from "../components/figma/CenterPanel";
import RightPanel from "../components/figma/RightPanel";

export default function FigmaScreen() {
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
          gridTemplateColumns: "60px 224px minmax(0, 1fr) 400px",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <Sidebar />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <LeftPanel />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <CenterPanel />
        </div>

        <div style={{ minWidth: 0, minHeight: 0, height: "100%" }}>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
