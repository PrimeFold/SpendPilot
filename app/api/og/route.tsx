import { ImageResponse } from "next/og"

export const runtime = "edge"

export function GET() {
  return new ImageResponse(
    (
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "white",
        fontSize: 64,
        fontWeight: 700,
      }}>
        SpendPilot
        <span style={{ marginTop: 24, fontSize: 24, fontWeight: 400 }}>
          AI spend audit preview
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
