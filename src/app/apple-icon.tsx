import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505"
        }}
      >
        <div
          style={{
            width: 164,
            height: 164,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #2A2A2A",
            borderRadius: 36,
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#F5F5F5"
          }}
        >
          cm
        </div>
      </div>
    ),
    size
  );
}
