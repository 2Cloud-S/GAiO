import type { Metadata, Viewport } from "next";
import { StyledComponentsRegistry } from "@/components/styled-components-registry";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "GAiO — Generative AI Optimization", template: "%s | GAiO" },
  description: "A GEO agency for organisations that want their expertise to be understood, evidenced, and discoverable in generative search.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#141414" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
