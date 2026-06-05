import type { OrganelleId } from "../types";

/**
 * Each glyph is drawn in a 100x100 viewBox so it can be scaled freely.
 * Colors are passed in so a single shape can be tinted per cell.
 */
export function OrganelleGlyph({ id, color }: { id: OrganelleId; color: string }) {
  const dark = shade(color, -28);
  const light = shade(color, 34);

  switch (id) {
    case "nucleus":
    case "nucleoid":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id={`g-${id}`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor={light} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill={`url(#g-${id})`} stroke={dark} strokeWidth="3" />
          {Array.from({ length: 7 }).map((_, i) => (
            <circle
              key={i}
              cx={28 + ((i * 37) % 50)}
              cy={26 + ((i * 53) % 50)}
              r="3.2"
              fill={dark}
              opacity="0.55"
            />
          ))}
          <circle cx="58" cy="56" r="13" fill={dark} opacity="0.65" />
          <circle cx="40" cy="38" r="9" fill={light} opacity="0.55" />
        </svg>
      );

    case "mitochondria":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="g-mito" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={light} />
              <stop offset="100%" stopColor={dark} />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="50" rx="46" ry="28" fill="url(#g-mito)" stroke={dark} strokeWidth="3" />
          <path
            d="M14 50 q9 -16 18 0 q9 16 18 0 q9 -16 18 0 q9 16 18 0"
            fill="none"
            stroke={dark}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      );

    case "chloroplast":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <ellipse cx="50" cy="50" rx="46" ry="26" fill={color} stroke={dark} strokeWidth="3" />
          {[28, 50, 72].map((cx) => (
            <g key={cx}>
              {[40, 48, 56].map((cy) => (
                <ellipse key={cy} cx={cx} cy={cy} rx="9" ry="3.4" fill={dark} opacity="0.75" />
              ))}
            </g>
          ))}
        </svg>
      );

    case "ribosome":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="40" fill={color} stroke={dark} strokeWidth="4" />
          <circle cx="50" cy="34" r="16" fill={dark} opacity="0.5" />
        </svg>
      );

    case "golgi":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {[0, 12, 24, 36].map((o, i) => (
            <path
              key={o}
              d={`M${18 + o / 2} ${30 + o} q ${32 - o} -${18 - o / 2} ${64 - o} 0`}
              fill="none"
              stroke={i % 2 ? dark : color}
              strokeWidth="7"
              strokeLinecap="round"
            />
          ))}
          <circle cx="22" cy="74" r="5" fill={light} />
          <circle cx="78" cy="76" r="4" fill={light} />
        </svg>
      );

    case "er":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {[26, 46, 66].map((y) => (
            <path
              key={y}
              d={`M6 ${y} q14 -14 28 0 q14 14 28 0 q14 -14 28 0`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );

    case "vacuole":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id="g-vac" cx="40%" cy="34%" r="70%">
              <stop offset="0%" stopColor={light} stopOpacity="0.85" />
              <stop offset="100%" stopColor={color} stopOpacity="0.55" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#g-vac)" stroke={light} strokeWidth="3" opacity="0.9" />
          <circle cx="36" cy="34" r="9" fill="#fff" opacity="0.5" />
        </svg>
      );

    case "lysosome":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="42" fill={color} stroke={dark} strokeWidth="3" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle
              key={i}
              cx={26 + ((i * 41) % 50)}
              cy={28 + ((i * 47) % 48)}
              r="3.5"
              fill={dark}
              opacity="0.7"
            />
          ))}
        </svg>
      );

    case "flagellum":
      return (
        <svg viewBox="0 0 140 60" className="h-full w-full">
          <path
            d="M2 30 q20 -22 40 0 q20 22 40 0 q20 -22 40 0"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="42" fill={color} stroke={dark} strokeWidth="3" />
        </svg>
      );
  }
}

/** Lighten (positive) or darken (negative) a hex color by an amount. */
function shade(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((num >> 16) + amt);
  const g = clamp(((num >> 8) & 0xff) + amt);
  const b = clamp((num & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
