import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF3E6",
          fontFamily: "serif",
        }}
      >
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7.5-4.7-10.1-9.3C.4 8.7 1.7 5 5.3 4.1c2-.5 4 .3 5.2 2 .3.4.9.4 1.2 0 1.2-1.7 3.2-2.5 5.2-2 3.6.9 4.9 4.6 3.4 7.6C19.5 16.3 12 21 12 21z"
            fill="#C08A34"
          />
        </svg>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            color: "#3A2E1F",
          }}
        >
          Lomdie
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C08A34",
            fontFamily: "sans-serif",
          }}
        >
          Rencontres de qualité
        </div>
      </div>
    ),
    { ...size }
  );
}
