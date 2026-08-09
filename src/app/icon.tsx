import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF3E6",
          borderRadius: 14,
        }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7.5-4.7-10.1-9.3C.4 8.7 1.7 5 5.3 4.1c2-.5 4 .3 5.2 2 .3.4.9.4 1.2 0 1.2-1.7 3.2-2.5 5.2-2 3.6.9 4.9 4.6 3.4 7.6C19.5 16.3 12 21 12 21z"
            fill="#C08A34"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
