export default function DraftingScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "24px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "280px 1fr 360px",
          gap: "20px",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            minHeight: "760px",
            padding: "20px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "12px" }}>Segment navigation</div>
          <div style={{ color: "#64748b" }}>Segment tree goes here</div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            minHeight: "760px",
            padding: "20px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "12px" }}>
            Center study canvas
          </div>
          <div style={{ color: "#64748b" }}>
            Source text, quick lexicography, translation editor
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            minHeight: "760px",
            padding: "20px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "12px" }}>
            Right support rail
          </div>
          <div style={{ color: "#64748b" }}>
            Guidance, best translation, grade, discussion
          </div>
        </section>
      </div>
    </main>
  );
}