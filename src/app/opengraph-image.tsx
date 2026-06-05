import { ImageResponse } from "next/og";

export const alt = "NextRun - Production-Ready Next.js Template & Telegram Bot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OpengraphImage = () =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 28,
          letterSpacing: "0.08em",
          color: "#a1a1aa",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            background: "#22c55e",
          }}
        />
        NEXT.JS TEMPLATE + TELEGRAM BOT
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          backgroundImage:
            "linear-gradient(to bottom right, #2dd4bf, #6366f1, #38bdf8)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        NextRun
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 16,
          fontSize: 52,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          maxWidth: 900,
        }}
      >
        Build Modern Web Apps in Minutes, Not Hours
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 30,
          color: "#a1a1aa",
        }}
      >
        Auth · Stripe Payments · Telegram Bot · Modern UI
      </div>
    </div>,
    { ...size },
  );

export default OpengraphImage;
