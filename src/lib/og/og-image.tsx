import type { ReactElement } from "react";
import { ImageResponse } from "next/og";

export const OG_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_CONTENT_TYPE = "image/png";

export const ogColors = {
  background: "#0a0a0a",
  title: "#fafafa",
  body: "#a1a1aa",
  pillBackground: "rgba(255, 255, 255, 0.04)",
  pillBorder: "rgba(255, 255, 255, 0.14)",
  pillText: "#e4e4e7",
};

const NextRunLogo = (
  <svg width={72} height={72} viewBox="0 0 256 256" fill="none">
    <path
      fill={ogColors.title}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M56 0h144a56 56 0 0 1 56 56v144a56 56 0 0 1-56 56H56a56 56 0 0 1-56-56V56A56 56 0 0 1 56 0Zm18 64h44l30 54v-54h34v128h-44l-30-54v54H74V64Z"
    />
  </svg>
);

interface OgPill {
  label: string;
  icon?: ReactElement;
}

interface OgImageConfig {
  title: string;
  description?: string;
  pills?: OgPill[];
  size?: { width: number; height: number };
}

export const renderOgImage = ({
  title,
  description,
  pills,
  size = OG_SIZE,
}: OgImageConfig): ImageResponse =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: ogColors.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {NextRunLogo}
        <div
          style={{
            fontSize: "30px",
            fontWeight: 700,
            color: ogColors.title,
            letterSpacing: "-0.01em",
            marginTop: "16px",
          }}
        >
          NextRun
        </div>
      </div>

      <div
        style={{
          fontSize: "64px",
          fontWeight: 800,
          color: ogColors.title,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginTop: "44px",
          maxWidth: "1000px",
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {description && (
        <div
          style={{
            fontSize: "28px",
            color: ogColors.body,
            lineHeight: 1.45,
            marginTop: "24px",
            maxWidth: "860px",
            textAlign: "center",
          }}
        >
          {description}
        </div>
      )}

      {pills && pills.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
            marginTop: "44px",
            maxWidth: "1040px",
          }}
        >
          {pills.map(({ label, icon }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 22px",
                background: ogColors.pillBackground,
                border: `1px solid ${ogColors.pillBorder}`,
                borderRadius: "9999px",
                fontSize: "24px",
                fontWeight: 600,
                color: ogColors.pillText,
              }}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>,
    size,
  );
