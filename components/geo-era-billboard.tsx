/**
 * Ink Games–style billboard DNA: oversized stacked display type with floating
 * model marks layered through the type. Adapted to Monochromia + GEO.
 * Reference composition: https://inkgames.com/
 */

type ModelMark = {
  src: string;
  alt: string;
  className: string;
  dark?: boolean;
};

const MODEL_MARKS: ModelMark[] = [
  { src: "/engine-icons/openai.svg", alt: "OpenAI", className: "geo-era-mark--a" },
  { src: "/engine-icons/anthropic-white.svg", alt: "Anthropic Claude", className: "geo-era-mark--b", dark: true },
  { src: "/engine-icons/googlegemini.svg", alt: "Google Gemini", className: "geo-era-mark--c" },
  { src: "/engine-icons/perplexity.svg", alt: "Perplexity", className: "geo-era-mark--d" },
  { src: "/engine-icons/microsoft-copilot.svg", alt: "Microsoft Copilot", className: "geo-era-mark--e" },
  { src: "/engine-icons/google.svg", alt: "Google", className: "geo-era-mark--f" },
  { src: "/engine-icons/brave.svg", alt: "Brave Search", className: "geo-era-mark--g" },
  { src: "/engine-icons/kimi.svg", alt: "Kimi", className: "geo-era-mark--h" },
];

export function GeoEraBillboard() {
  return (
    <div className="geo-era-billboard" aria-hidden="true">
      <p className="geo-era-billboard__title">
        <span>JOIN THE NEW</span>
        <span>ERA OF</span>
        <span>GEO</span>
      </p>
      <ul className="geo-era-billboard__marks">
        {MODEL_MARKS.map((mark) => (
          <li
            key={mark.src + mark.className}
            className={`geo-era-mark ${mark.className}${mark.dark ? " geo-era-mark--ink" : ""}`}
          >
            {/* Local SVG engine marks — img avoids next/image SVG config friction */}
            <img src={mark.src} alt="" className="geo-era-mark__img" width={48} height={48} />
            <span className="geo-era-mark__label">{mark.alt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
