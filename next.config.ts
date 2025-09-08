import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self' *.nextrun.dev;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: js.stripe.com vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: cdn.jsdelivr.net *.googleusercontent.com authjs.dev;
  media-src 'none';
  connect-src *;
  font-src 'self' data:;
  frame-src 'self' js.stripe.com;
  frame-ancestors 'self';
  form-action 'self';
  base-uri 'self';
`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  htmlLimitedBots: /.*/,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), autoplay=(), fullscreen=(self), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
