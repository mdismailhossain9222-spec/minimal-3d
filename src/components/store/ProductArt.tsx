import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog";

/**
 * Procedural "product photography" — quiet solids with hairline edge marks
 * and a single electric accent, rendered as pure SVG so every product image
 * stays crisp, fast and perfectly on-brand.
 */

interface ProductArtProps {
  product: Product;
  /** Selected color name; picks the fill tone */
  color?: string;
  className?: string;
}

function shade(hex: string, amount: number): string {
  const m = hex.replace("#", "");
  const num = Number.parseInt(m, 16);
  const r = Math.round(Math.min(255, Math.max(0, ((num >> 16) & 255) * (1 + amount))));
  const g = Math.round(Math.min(255, Math.max(0, ((num >> 8) & 255) * (1 + amount))));
  const b = Math.round(Math.min(255, Math.max(0, (num & 255) * (1 + amount))));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function ProductArt({ product, color, className }: ProductArtProps) {
  const selected =
    product.colors.find((c) => c.name === color)?.value ?? product.colors[0]?.value ?? "#2E2E36";
  const dark = shade(selected, -0.28);
  const light = shade(selected, 0.22);
  const gid = `pa-${product.id}`;

  return (
    <svg
      viewBox="0 0 400 300"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={product.name}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17171D" />
          <stop offset="1" stopColor="#0B0B0F" />
        </linearGradient>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={selected} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`${gid}-halo`} cx="0.5" cy="0.42" r="0.65">
          <stop offset="0" stopColor="#6E7BFF" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="#9F6BFF" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${gid}-bg)`} />
      <rect width="400" height="300" fill={`url(#${gid}-halo)`} />
      {/* Faint drafting grid */}
      <g stroke="#FFFFFF" strokeOpacity="0.04">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
        ))}
      </g>

      {renderObject(product, gid, { selected, dark, light })}

      {/* Signature hairline accent */}
      <line x1="36" y1="262" x2="96" y2="262" stroke="#6E7BFF" strokeWidth="1.5" opacity="0.9" />
      <text
        x="36"
        y="250"
        fill="#FFFFFF"
        fillOpacity="0.4"
        fontSize="9"
        letterSpacing="3"
        fontFamily="IBM Plex Mono, monospace"
      >
        NOVA
      </text>
    </svg>
  );
}

type Tones = { selected: string; dark: string; light: string };

function renderObject(
  product: Product,
  gid: string,
  tones: Tones,
): React.ReactNode {
  const { selected, dark, light } = tones;
  switch (product.category) {
    case "sneakers":
      return (
        <g>
          <ellipse cx="200" cy="248" rx="130" ry="14" fill="#000" opacity="0.35" />
          <path
            d="M78 208 C78 172 108 150 148 148 L196 146 C222 144 238 158 252 176 C266 194 292 196 308 206 C322 214 320 232 300 236 L104 240 C86 240 78 228 78 208 Z"
            fill={`url(#${gid}-body)`}
          />
          <path
            d="M148 148 C160 172 186 184 214 186"
            stroke={dark}
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M96 216 L300 210"
            stroke="#EDEFF7"
            strokeOpacity="0.18"
            strokeWidth="6"
          />
          <circle cx="150" cy="176" r="3" fill={light} opacity="0.8" />
          <circle cx="172" cy="182" r="3" fill={light} opacity="0.65" />
          <circle cx="194" cy="186" r="3" fill={light} opacity="0.5" />
          <path d="M262 196 L296 200" stroke="#6E7BFF" strokeWidth="2.5" />
        </g>
      );
    case "tech":
      return (
        <g>
          <ellipse cx="200" cy="246" rx="120" ry="12" fill="#000" opacity="0.35" />
          {product.id === "p07" ? (
            <g>
              <circle cx="200" cy="150" r="64" fill={`url(#${gid}-body)`} />
              <circle cx="200" cy="150" r="64" fill="none" stroke="#EDEFF7" strokeOpacity="0.25" />
              <circle cx="200" cy="150" r="52" fill="#101016" />
              <circle cx="200" cy="150" r="52" fill="none" stroke="#EDEFF7" strokeOpacity="0.12" />
              <line x1="200" y1="150" x2="238" y2="124" stroke="#6E7BFF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="200" y1="150" x2="182" y2="104" stroke={light} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            </g>
          ) : product.id === "p08" ? (
            <g>
              <rect x="182" y="88" width="36" height="150" rx="18" fill={`url(#${gid}-body)`} />
              <rect x="182" y="88" width="36" height="150" rx="18" fill="none" stroke="#EDEFF7" strokeOpacity="0.16" />
              <circle cx="200" cy="112" r="10" fill="#EDEFF7" opacity="0.85" />
              <circle cx="200" cy="112" r="16" fill="none" stroke="#6E7BFF" strokeWidth="1.5" opacity="0.8" />
            </g>
          ) : (
            <g>
              <rect x="118" y="120" width="164" height="108" rx="26" fill={`url(#${gid}-body)`} />
              <rect x="118" y="120" width="164" height="108" rx="26" fill="none" stroke="#EDEFF7" strokeOpacity="0.16" />
              <g fill="#101016" opacity="0.9">
                <circle cx="168" cy="174" r="5" />
                <circle cx="200" cy="174" r="5" />
                <circle cx="232" cy="174" r="5" />
              </g>
              <line x1="140" y1="212" x2="260" y2="212" stroke="#6E7BFF" strokeWidth="2" opacity="0.85" />
            </g>
          )}
        </g>
      );
    case "accessories":
      return (
        <g>
          <ellipse cx="200" cy="248" rx="118" ry="12" fill="#000" opacity="0.35" />
          {product.id === "p03" ? (
            <g>
              <path
                d="M136 120 C136 104 152 96 200 96 C248 96 264 104 264 120 L258 210 C258 224 240 230 200 230 C160 230 142 224 142 210 Z"
                fill={`url(#${gid}-body)`}
              />
              <path
                d="M136 120 C136 104 152 96 200 96 C248 96 264 104 264 120 L258 210 C258 224 240 230 200 230 C160 230 142 224 142 210 Z"
                fill="none"
                stroke="#EDEFF7"
                strokeOpacity="0.16"
              />
              <path d="M258 132 C286 138 296 156 292 176" stroke={dark} strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="200" cy="130" r="9" fill="none" stroke="#6E7BFF" strokeWidth="2" />
              <rect x="168" y="164" width="64" height="40" rx="8" fill="#101016" opacity="0.55" />
            </g>
          ) : product.id === "p04" ? (
            <g>
              <path d="M120 150 L280 150" stroke={`url(#${gid}-body)`} strokeWidth="34" strokeLinecap="round" />
              <circle cx="163" cy="150" r="26" fill="#0E0E14" stroke={light} strokeWidth="2" />
              <circle cx="237" cy="150" r="26" fill="#0E0E14" stroke={light} strokeWidth="2" />
              <path d="M189 150 C194 142 206 142 211 150" stroke={dark} strokeWidth="4" fill="none" />
              <path d="M158 108 C176 88 224 88 242 108" stroke={dark} strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M120 178 L280 178" stroke="#6E7BFF" strokeWidth="2" opacity="0.7" />
            </g>
          ) : (
            <g>
              <path d="M128 116 L272 116 L258 196 C258 208 156 208 150 196 Z" fill={`url(#${gid}-body)`} />
              <path d="M128 116 L272 116 L258 196 C258 208 156 208 150 196 Z" fill="none" stroke="#EDEFF7" strokeOpacity="0.14" />
              <path d="M150 196 C150 214 250 214 258 196" stroke={dark} strokeWidth="6" fill="none" />
              <rect x="182" y="128" width="36" height="12" rx="6" fill="#101016" opacity="0.6" />
              <path d="M128 116 C160 100 240 100 272 116" stroke={light} strokeWidth="3" fill="none" opacity="0.6" />
            </g>
          )}
        </g>
      );
    case "lifestyle":
      return (
        <g>
          <ellipse cx="200" cy="248" rx="110" ry="12" fill="#000" opacity="0.35" />
          {product.id === "p10" ? (
            <g>
              <rect x="152" y="128" width="96" height="104" rx="10" fill={`url(#${gid}-body)`} />
              <rect x="152" y="128" width="96" height="104" rx="10" fill="none" stroke="#EDEFF7" strokeOpacity="0.18" />
              <ellipse cx="200" cy="128" rx="48" ry="12" fill={dark} />
              <ellipse cx="200" cy="128" rx="48" ry="12" fill="none" stroke="#EDEFF7" strokeOpacity="0.22" />
              <ellipse cx="200" cy="129" rx="38" ry="8" fill="#101016" />
              <line x1="128" y1="216" x2="272" y2="216" stroke="#6E7BFF" strokeWidth="2" opacity="0.7" />
            </g>
          ) : (
            <g>
              <rect x="158" y="120" width="84" height="110" rx="8" fill={`url(#${gid}-body)`} />
              <rect x="158" y="120" width="84" height="110" rx="8" fill="none" stroke="#EDEFF7" strokeOpacity="0.18" />
              <ellipse cx="200" cy="120" rx="42" ry="10" fill={light} opacity="0.55" />
              <line x1="200" y1="86" x2="200" y2="112" stroke="#EDEFF7" strokeOpacity="0.35" strokeWidth="2.5" />
              <circle cx="200" cy="84" r="5" fill="#F0509B" opacity="0.9" />
            </g>
          )}
        </g>
      );
    case "clothing":
    default:
      return (
        <g>
          <ellipse cx="200" cy="252" rx="120" ry="13" fill="#000" opacity="0.35" />
          {product.id === "p12" ? (
            <g>
              <path d="M138 122 C138 108 158 102 200 102 C242 102 262 108 262 122 L252 200 C252 212 148 212 148 200 Z" fill={`url(#${gid}-body)`} />
              <path d="M138 122 C138 108 158 102 200 102 C242 102 262 108 262 122 L252 200 C252 212 148 212 148 200 Z" fill="none" stroke="#EDEFF7" strokeOpacity="0.16" />
              <path d="M148 150 L252 150" stroke="#EDEFF7" strokeOpacity="0.14" strokeWidth="2" />
              <path d="M148 172 L252 172" stroke="#EDEFF7" strokeOpacity="0.14" strokeWidth="2" />
            </g>
          ) : product.id === "p05" ? (
            <g>
              <path d="M150 96 C166 88 186 86 200 86 C214 86 234 88 250 96 L282 112 L268 150 L252 142 L252 212 C252 222 148 222 148 212 L148 142 L132 150 L118 112 Z" fill={`url(#${gid}-body)`} />
              <path d="M150 96 C166 88 186 86 200 86 C214 86 234 88 250 96 L282 112 L268 150 L252 142 L252 212 C252 222 148 222 148 212 L148 142 L132 150 L118 112 Z" fill="none" stroke="#EDEFF7" strokeOpacity="0.15" />
              <path d="M176 90 C186 104 214 104 224 90" stroke={dark} strokeWidth="5" fill="none" />
            </g>
          ) : (
            <g>
              <path d="M142 100 C160 90 182 88 200 88 C218 88 240 90 258 100 L290 118 L272 158 L254 148 L254 216 C254 228 146 228 146 216 L146 148 L128 158 L110 118 Z" fill={`url(#${gid}-body)`} />
              <path d="M142 100 C160 90 182 88 200 88 C218 88 240 90 258 100 L290 118 L272 158 L254 148 L254 216 C254 228 146 228 146 216 L146 148 L128 158 L110 118 Z" fill="none" stroke="#EDEFF7" strokeOpacity="0.15" />
              <path d="M142 100 C160 90 182 88 200 88 C218 88 240 90 258 100" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M174 92 C182 108 218 108 226 92" stroke={dark} strokeWidth="6" fill="none" />
              <rect x="146" y="196" width="108" height="7" fill="#101016" opacity="0.5" />
              <path d="M246 130 L262 138" stroke="#6E7BFF" strokeWidth="2.5" />
            </g>
          )}
        </g>
      );
  }
}
