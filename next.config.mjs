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
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:path*.(js|css|woff2|ico|svg|png|jpg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
