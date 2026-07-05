/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ── Performance ── */
  reactStrictMode: true,
  poweredByHeader: false,

  /* ── Images (add domains if you host images externally) ── */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /* ── Headers for security & caching ── */
  async headers() {
    // Content-Security-Policy. 'unsafe-inline' is required because the site uses
    // inline styles (Tailwind-in-JS, the spotlight-card <style> block) and small
    // inline scripts; no external script/style origins are allowed.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        source: "/:path*.(js|css|woff2|woff|ttf|otf|ico|svg|png|jpg|jpeg|gif|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
