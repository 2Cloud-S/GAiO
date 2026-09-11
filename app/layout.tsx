import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StyledComponentsRegistry } from "@/components/styled-components-registry";
import { buildSiteJsonLd } from "@/lib/json-ld";
import { siteName, siteTagline, siteUrl } from "@/lib/site";
import "./globals.css";

/** Body — self-hosted, latin subset, swap to avoid FOIT / CLS. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-face",
  weight: ["400", "500", "600", "700"],
});

/** Display — readable geometric (not condensed Narrow) for mobile scan + brand. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Generative AI Optimization`,
    template: `%s | ${siteName}`,
  },
  description: siteTagline,
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "llms-txt": `${siteUrl}/llms.txt`,
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#141414" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = buildSiteJsonLd();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}
