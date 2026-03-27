import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "FC. | Fabian Castaneda — Developer & Resume Builder",
    template: "%s | FC. Portfolio",
  },
  description:
    "Free, privacy-first resume builder and developer portfolio by Fabian Castaneda. ATS-friendly templates, AI-powered tools, and practical software. Orange County, CA.",
  keywords: [
    "resume builder",
    "ATS resume",
    "Fabian Castaneda",
    "developer portfolio",
    "IT support",
    "Orange County developer",
    "free resume tool",
    "Next.js portfolio",
  ],
  authors: [{ name: "Fabian Castaneda" }],
  creator: "Fabian Castaneda",
  metadataBase: new URL("https://fcdevelopments.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FC. Portfolio",
    title: "FC. | Fabian Castaneda — Developer & Resume Builder",
    description:
      "Free, privacy-first resume builder with ATS-friendly templates. Built by Fabian Castaneda in Orange County, CA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FC. | Fabian Castaneda — Developer & Resume Builder",
    description:
      "Free, privacy-first resume builder with ATS-friendly templates.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
