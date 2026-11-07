import { ImageResponse } from "next/og";

export const alt = "clevermike: software systems, taken apart.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: 64
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #2A2A2A",
              borderRadius: 14,
              background: "#111111",
              fontSize: 26,
              fontWeight: 700,
              color: "#F5F5F5"
            }}
          >
            cm
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#F5F5F5" }}>clevermike</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#F5F5F5"
            }}
          >
            software systems, taken apart.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#A3A3A3" }}>
            Technical deep dives into real infrastructure: how the pieces fit, where they break, and what the design
            decisions actually cost.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#737373" }}>clevermike.studio</div>
          <div style={{ display: "flex", fontSize: 26, color: "#737373" }}>blog · projects · resume</div>
        </div>
      </div>
    ),
    size
  );
}
