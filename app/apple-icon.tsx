import { ImageResponse } from "next/og";
import { GaioIconMark } from "@/lib/gaio-icon-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // iOS apple-touch icons are composited on a square; keep a subtle dark fill.
  return new ImageResponse(<GaioIconMark size={180} variant="solid" />, {
    ...size,
  });
}
