/**
 * SSR-safe Flux Vortex teaser — CSS/SVG only so first HTML already feels alive
 * while the ThreeUI iframe boots. Fades out via `.is-vortex-ready`.
 */
export function HeroVortexPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={
        className
          ? `hero-vortex-placeholder ${className}`
          : "hero-vortex-placeholder"
      }
      aria-hidden="true"
    >
      <div className="hero-vortex-placeholder__field" />
      <div className="hero-vortex-placeholder__swirl" />
      <div className="hero-vortex-placeholder__ring hero-vortex-placeholder__ring--outer" />
      <div className="hero-vortex-placeholder__ring hero-vortex-placeholder__ring--mid" />
      <div className="hero-vortex-placeholder__ring hero-vortex-placeholder__ring--inner" />
      <svg
        className="hero-vortex-placeholder__spiral"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
      >
        <path
          className="hero-vortex-placeholder__spiral-path"
          d="M51.5 50L51.6 50.1L51.7 50.1L51.8 50.2L51.9 50.3L52 50.4L52.1 50.4L52.2 50.5L52.3 50.7L52.4 50.8L52.4 50.9L52.5 51L52.6 51.1L52.6 51.3L52.7 51.4L52.7 51.6L52.8 51.7L52.8 51.9L52.8 52L52.8 52.2L52.8 52.4L52.8 52.5L52.8 52.7L52.8 52.9L52.8 53.1L52.7 53.3L52.7 53.4L52.6 53.6L52.6 53.8L52.5 54L52.4 54.2L52.3 54.3L52.2 54.5L52.1 54.7L52 54.9L51.8 55L51.7 55.2L51.5 55.4L51.4 55.5L51.2 55.7L51 55.8L50.8 56L50.6 56.1L50.4 56.2L50.2 56.3L50 56.5L49.8 56.6L49.5 56.7L49.3 56.7L49 56.8L48.8 56.9L48.5 57L48.3 57L48 57L47.7 57.1L47.4 57.1L47.1 57.1L46.8 57.1L46.5 57.1L46.2 57.1L46 57L45.6 57L45.3 56.9L45 56.8L44.7 56.7L44.4 56.6L44.1 56.5L43.8 56.4L43.5 56.2L43.2 56.1L43 55.9L42.7 55.7L42.4 55.5L42.1 55.3L41.8 55.1L41.6 54.9L41.3 54.6L41 54.4L40.8 54.1L40.6 53.8L40.3 53.5L40.1 53.2L39.9 52.9L39.7 52.6L39.5 52.2L39.3 51.9L39.1 51.5L39 51.2L38.8 50.8L38.7 50.4L38.6 50L38.5 49.6L38.4 49.2L38.3 48.8L38.3 48.4L38.2 47.9L38.2 47.5L38.2 47.1L38.2 46.6L38.2 46.2L38.3 45.7L38.3 45.3L38.4 44.8L38.5 44.4L38.6 43.9L38.7 43.5L38.8 43L39 42.6L39.2 42.1L39.4 41.7L39.6 41.3L39.8 40.8L40.1 40.4L40.3 40L40.6 39.6L40.9 39.2L41.2 38.8L41.6 38.4L41.9 38L42.3 37.6L42.6 37.3L43 36.9L43.5 36.6L43.9 36.3L44.3 36L44.8 35.7L45.3 35.4L45.7 35.1L46.2 34.9L46.7 34.7L47.3 34.4L47.8 34.2L48.3 34.1L48.9 33.9L49.4 33.8L50 33.6L50.6 33.6L51.2 33.5L51.7 33.4L52.3 33.4L52.9 33.4L53.5 33.4L54.1 33.4L54.7 33.4L55.4 33.5L56 33.6L56.6 33.7L57.2 33.9L57.8 34L58.4 34.2L59 34.4L59.6 34.6L60.2 34.9L60.8 35.2L61.4 35.5L61.9 35.8L62.5 36.1L63 36.5L63.6 36.9L64.1 37.3L64.6 37.7L65.1 38.2L65.6 38.6L66.1 39.1L66.6 39.6L67 40.2L67.4 40.7L67.9 41.3L68.3 41.9L68.6 42.5L69 43.1L69.3 43.7L69.6 44.4L69.9 45L70.2 45.7L70.4 46.4L70.7 47.1L70.9 47.8L71 48.5L71.2 49.3L71.3 50L71.4 50.7L71.5 51.5L71.5 52.3L71.5 53L71.5 53.8L71.5 54.6L71.4 55.3L71.3 56.1L71.2 56.9L71 57.7L70.9 58.4L70.7 59.2L70.4 60L70.2 60.7L69.9 61.5L69.6 62.2L69.2 63L68.8 63.7L68.4 64.4L68 65.1L67.5 65.8L67.1 66.5L66.6 67.1L66 67.8L65.5 68.4L64.9 69L64.3 69.6L63.6 70.2L63 70.8L62.3 71.3L61.6 71.8L60.9 72.3L60.1 72.8L59.4 73.2L58.6 73.6L57.8 74L57 74.4L56.2 74.7L55.3 75L54.5 75.3L53.6 75.6L52.7 75.8L51.8 76L50.9 76.1L50 76.3L49.1 76.3L48.2 76.4L47.2 76.4L46.3 76.4L45.3 76.4L44.4 76.3L43.5 76.2L42.5 76.1L41.6 75.9L40.6 75.7L39.7 75.5L38.8 75.2L37.9 74.9L37 74.5L36.1 74.2L35.2 73.8L34.3 73.3L33.4 72.8L32.6 72.3L31.7 71.8L30.9 71.2L30.1 70.6L29.3 70L28.5 69.3L27.8 68.6L27.1 67.9L26.4 67.2L25.7 66.4L25 65.6L24.4 64.8L23.8 63.9L23.2 63.1L22.7 62.2L22.2 61.2L21.7 60.3L21.3 59.3L20.9 58.4L20.5 57.4L20.1 56.3L19.8 55.3L19.5 54.3L19.3 53.2L19.1 52.2L18.9 51.1L18.8 50"
          fill="none"
        />
        <circle className="hero-vortex-placeholder__core" cx="50" cy="50" r="2.2" />
      </svg>
      <div className="hero-vortex-placeholder__scan" />
    </div>
  );
}
