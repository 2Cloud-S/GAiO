import type { Metadata, Viewport } from "next";
import { StyledComponentsRegistry } from "@/components/styled-components-registry";
import { buildSiteJsonLd } from "@/lib/json-ld";
import { siteTagline, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GAiO — Generative AI Optimization", template: "%s | GAiO" },
  description: siteTagline,
  alternates: {
    canonical: "/",
  },
  other: {
    "llms-txt": `${siteUrl}/llms.txt`,
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#141414" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = buildSiteJsonLd();

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          // Escape < so user-controlled CMS strings cannot break out of the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
