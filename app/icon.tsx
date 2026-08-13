import { ImageResponse } from "next/og";
import { GaioIconMark } from "@/lib/gaio-icon-mark";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<GaioIconMark size={48} />, { ...size });
}
