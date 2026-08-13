/** Shared GAiO favicon mark for ImageResponse routes (`app/icon.tsx`, etc.). */
export function GaioIconMark({ size }: { size: number }) {
  const label = size <= 32 ? "G" : "GAiO";
  const fontSize = size <= 16 ? 11 : size <= 32 ? 22 : size <= 48 ? 16 : size <= 192 ? 56 : 150;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        color: "#ffffff",
        fontSize,
        fontWeight: 800,
        letterSpacing: "-0.06em",
        fontFamily: 'Arial Narrow, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 1,
      }}
    >
      {label}
    </div>
  );
}
