import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070c16",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Fabian Castaneda — IT Systems Engineer & Automation Developer",
    template: "%s | FCDevelopments",
  },
  description:
    "IT systems engineer building production automation — Python, Node.js, REST APIs, and AI/LLM tooling that removes manual work from IT, finance, and operations. Orange County, CA.",
  keywords: [
    "IT systems engineer",
    "workflow automation",
    "Fabian Castaneda",
    "FCDevelopments",
    "Python automation",
    "IT operations",
    "AI tooling",
    "Orange County developer",
  ],
  authors: [{ name: "Fabian Castaneda" }],
  creator: "Fabian Castaneda",
  metadataBase: new URL("https://fcdevelopments.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FCDevelopments",
    title: "Fabian Castaneda — IT Systems Engineer & Automation Developer",
    description:
      "Production automation for IT, finance, and operations. I automate, I design, I build things that run correctly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabian Castaneda — IT Systems Engineer & Automation Developer",
    description:
      "Production automation for IT, finance, and operations.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
