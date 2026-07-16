import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 14,
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", // Indigo to Purple gradient
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "24%", // Squircle-ish
        fontWeight: 800,
        fontFamily: "monospace",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", gap: "1px" }}>
        <span style={{ color: "#fff" }}>{'C'}</span>
        <span style={{ color: "#c4b5fd" }}>/</span>
        <span style={{ color: "#fff" }}>{'S'}</span>
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  );
}
