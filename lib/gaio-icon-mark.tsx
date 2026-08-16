/** Shared GAiO favicon mark for ImageResponse routes (`app/icon.tsx`, etc.). */

type GaioIconMarkProps = {
  size: number;
  /** Transparent for tab icons; solid dark fill for apple-touch / maskable. */
  variant?: "transparent" | "solid";
};

export function GaioIconMark({ size, variant = "transparent" }: GaioIconMarkProps) {
  // Match static generator: "G" through 48px, full wordmark above that.
  const label = size <= 48 ? "G" : "GAiO";
  const fontSize =
    size <= 16 ? 14 : size <= 32 ? 28 : size <= 48 ? 36 : size <= 180 ? 54 : size <= 192 ? 58 : 168;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: variant === "solid" ? "#0a0a0a" : "transparent",
        color: "#ffffff",
        fontSize,
        fontWeight: 800,
        letterSpacing: label === "G" ? "-0.04em" : "-0.07em",
        fontFamily: 'Arial Narrow, Arial, "Helvetica Neue", Helvetica, sans-serif',
        lineHeight: 1,
      }}
    >
      {label}
    </div>
  );
}
