/**
 * NOVA — a small catalogue of "engineered lifestyle" goods.
 *
 * Products are rendered as procedural SVG objects (quiet solids, hairline
 * marks, one electric accent) rather than photography. This keeps the brand
 * visual language consistent with the WebGL scenes and the rest of the site.
 */

export type CategoryId =
  | "new"
  | "clothing"
  | "accessories"
  | "sneakers"
  | "tech"
  | "lifestyle";

export interface ProductColor {
  name: string;
  /** Tailwind-ready oklch/hex fill for swatches and art */
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Exclude<CategoryId, "new">;
  tagline: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  specs: { label: string; value: string }[];
  colors: ProductColor[];
  sizes: string[] | null;
  featured: boolean;
  /** ISO week-tag used as "New Arrivals" marker */
  new: boolean;
  bestseller: boolean;
}

export const CATEGORIES: { id: CategoryId; label: string; note: string }[] = [
  { id: "new", label: "New Arrivals", note: "Just released" },
  { id: "clothing", label: "Clothing", note: "Wear the system" },
  { id: "accessories", label: "Accessories", note: "Carry the standard" },
  { id: "sneakers", label: "Sneakers", note: "Move on rails" },
  { id: "tech", label: "Tech", note: "Objects that think" },
  { id: "lifestyle", label: "Lifestyle", note: "Tune your space" },
];

export const PRODUCTS: Product[] = [
  {
    id: "p01",
    slug: "aegis-01-shell-jacket",
    name: "Aegis 01 Shell Jacket",
    category: "clothing",
    tagline: "All-weather armour, engineered in matte shell fabric",
    price: 420,
    rating: 4.8,
    reviews: 214,
    description:
      "A three-layer storm shell cut on a quiet, architectural pattern. Sealed seams, magnetic storm closures and a sculpted hood hold their shape in weather; the matte face fabric keeps the silhouette still under light.",
    specs: [
      { label: "Shell", value: "3-layer recycled matte shell, 20k/20k" },
      { label: "Seams", value: "Fully taped and heat-sealed" },
      { label: "Closures", value: "Magnetic storm placket, YKK Aquaguard" },
      { label: "Fit", value: "Architectural, True to size" },
      { label: "Weight", value: "540 g" },
      { label: "Origin", value: "Made in Portugal" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Ion Blue", value: "#5D7BFF" },
      { name: "Violet Haze", value: "#8D63E8" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    new: true,
    bestseller: true,
  },
  {
    id: "p02",
    slug: "orbit-runner-sneakers",
    name: "Orbit Runner",
    category: "sneakers",
    tagline: "Low-profile runner on a nitrogen-injected sole",
    price: 265,
    rating: 4.9,
    reviews: 486,
    description:
      "The Orbit Runner rides on a translucent nitrogen-injected midsole with a carbon rail for stability. The upper is a single-piece engineered knit that disappears into the sole — no stitch lines, no noise.",
    specs: [
      { label: "Upper", value: "One-piece engineered knit" },
      { label: "Midsole", value: "Nitrogen-injected TPU, translucent" },
      { label: "Plate", value: "Full-length carbon rail" },
      { label: "Drop", value: "6 mm" },
      { label: "Weight", value: "238 g (EU 42)" },
      { label: "Origin", value: "Assembled in Italy" },
    ],
    colors: [
      { name: "Carbon", value: "#232329" },
      { name: "Ion Blue", value: "#5D7BFF" },
      { name: "Magenta Pulse", value: "#E14F9B" },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    featured: true,
    new: true,
    bestseller: true,
  },
  {
    id: "p03",
    slug: "halo-ancillary-pack",
    name: "Halo Ancillary Pack",
    category: "accessories",
    tagline: "Magnetic sling pack with a glowing status ring",
    price: 185,
    rating: 4.7,
    reviews: 152,
    description:
      "A compact sling built from ballistic weave with a magnetic quick-release. The anodised status ring glows faintly at night — a single point of light in the dark, nothing more.",
    specs: [
      { label: "Fabric", value: "420D ballistic weave, DWR finish" },
      { label: "Volume", value: "4.5 L" },
      { label: "Hardware", value: "Anodised aluminium, magnetic release" },
      { label: "Strap", value: "Seatbelt webbing, one-hand adjust" },
      { label: "Weight", value: "310 g" },
      { label: "Origin", value: "Made in Japan" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Signal Violet", value: "#8D63E8" },
    ],
    sizes: null,
    featured: true,
    new: false,
    bestseller: false,
  },
  {
    id: "p04",
    slug: "prism-foldable-sunglasses",
    name: "Prism Foldable Sunglasses",
    category: "accessories",
    tagline: "Titanium frames that fold to the size of a card",
    price: 240,
    rating: 4.6,
    reviews: 98,
    description:
      "Prism folds along hidden titanium hinges into a form no larger than a card holder. The lenses are mineral glass with a graduated neutral filter; the geometry stays precise after ten thousand folds.",
    specs: [
      { label: "Frame", value: "Beta titanium, hidden hinge" },
      { label: "Lenses", value: "Mineral glass, graduated neutral, UV400" },
      { label: "Folded", value: "89 × 62 × 14 mm" },
      { label: "Weight", value: "21 g" },
      { label: "Origin", value: "Made in Japan" },
    ],
    colors: [
      { name: "Gunmetal", value: "#3A3A42" },
      { name: "Ion Blue", value: "#5D7BFF" },
    ],
    sizes: null,
    featured: false,
    new: false,
    bestseller: false,
  },
  {
    id: "p05",
    slug: "meridian-merino-crew",
    name: "Meridian Merino Crew",
    category: "clothing",
    tagline: "Seamless merino crew with thermoregulating knit zones",
    price: 195,
    rating: 4.8,
    reviews: 341,
    description:
      "Knitted as a single tube so there are no side seams to feel. Body-mapped merino zones breathe where you run warm and insulate where you don't. The collar holds its line, wash after wash.",
    specs: [
      { label: "Yarn", value: "18.5 micron extra-fine merino" },
      { label: "Knit", value: "Seamless body-mapped, 12 gauge" },
      { label: "Care", value: "Machine wash cold, dry flat" },
      { label: "Fit", value: "Regular, True to size" },
      { label: "Weight", value: "260 g" },
      { label: "Origin", value: "Made in Italy" },
    ],
    colors: [
      { name: "Carbon", value: "#232329" },
      { name: "Fog", value: "#9DA2B4" },
      { name: "Magenta Pulse", value: "#E14F9B" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    new: false,
    bestseller: true,
  },
  {
    id: "p06",
    slug: "vector-cap",
    name: "Vector Cap",
    category: "accessories",
    tagline: "Six-panel cap with a laser-etched brim",
    price: 85,
    rating: 4.5,
    reviews: 167,
    description:
      "A six-panel cap in dry-touch technical twill. The brim carries a single laser-etched vector line — our quiet signature — and the closure is a machined dial that adjusts without gaps.",
    specs: [
      { label: "Crown", value: "Six-panel, dry-touch technical twill" },
      { label: "Brim", value: "Pre-curved, laser-etched mark" },
      { label: "Closure", value: "Machined aluminium dial" },
      { label: "Fit", value: "One size, 54–61 cm" },
      { label: "Origin", value: "Made in Portugal" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Fog", value: "#9DA2B4" },
    ],
    sizes: null,
    featured: false,
    new: false,
    bestseller: false,
  },
  {
    id: "p07",
    slug: "core-indicator-watch",
    name: "Core Indicator Watch",
    category: "tech",
    tagline: "Titanium automatic with a luminous orbit hand",
    price: 1250,
    rating: 4.9,
    reviews: 87,
    description:
      "A 39 mm grade-5 titanium automatic with a sapphire display back. The seconds hand is a luminous orbit that reads as pure geometry in the dark — the only complication is keeping time beautifully.",
    specs: [
      { label: "Case", value: "39 mm grade-5 titanium, 100 m" },
      { label: "Movement", value: "Swiss automatic, 72 h reserve" },
      { label: "Crystal", value: "Double-domed sapphire, AR coated" },
      { label: "Strap", value: "Single-pass rubber, quick release" },
      { label: "Weight", value: "68 g" },
      { label: "Origin", value: "Assembled in Switzerland" },
    ],
    colors: [
      { name: "Titanium", value: "#8E93A6" },
      { name: "Carbon DLC", value: "#232329" },
    ],
    sizes: null,
    featured: true,
    new: false,
    bestseller: false,
  },
  {
    id: "p08",
    slug: "beacon-ancillary-torch",
    name: "Beacon Ancillary Torch",
    category: "tech",
    tagline: "Pocket torch with a stepped beam and graphite shell",
    price: 130,
    rating: 4.7,
    reviews: 203,
    description:
      "A machined graphite torch with a stepped optical lens: flood for the room, spot for the path. Charging is magnetic, and the housing is sealed to IP68 — it behaves like an instrument, not a gadget.",
    specs: [
      { label: "Output", value: "1,000 lm spot / 320 lm flood" },
      { label: "Battery", value: "USB-C magnetic, 90 min runtime" },
      { label: "Body", value: "Machined aluminium, graphite anodised" },
      { label: "Sealing", value: "IP68" },
      { label: "Weight", value: "96 g" },
      { label: "Origin", value: "Made in Germany" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Ion Blue", value: "#5D7BFF" },
    ],
    sizes: null,
    featured: false,
    new: true,
    bestseller: false,
  },
  {
    id: "p09",
    slug: "pulse-ancillary-speaker",
    name: "Pulse Ancillary Speaker",
    category: "tech",
    tagline: "360° speaker with a resonant graphite skin",
    price: 320,
    rating: 4.6,
    reviews: 129,
    description:
      "Pulse projects evenly in every direction through a woven graphite skin. Pair two and the room becomes stereo without visible wires — just two quiet cylinders and the sound between them.",
    specs: [
      { label: "Drivers", value: "2 × 20 W full-range, passive radiators" },
      { label: "Connectivity", value: "Bluetooth 5.4, dual pairing" },
      { label: "Battery", value: "24 h at conversational volume" },
      { label: "Sealing", value: "IP67" },
      { label: "Weight", value: "780 g" },
      { label: "Origin", value: "Designed in Denmark" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Signal Violet", value: "#8D63E8" },
      { name: "Fog", value: "#9DA2B4" },
    ],
    sizes: null,
    featured: false,
    new: false,
    bestseller: true,
  },
  {
    id: "p10",
    slug: "monolith-ceramic-mug",
    name: "Monolith Ceramic Mug",
    category: "lifestyle",
    tagline: "Double-walled ceramic mug with a matte basalt glaze",
    price: 45,
    rating: 4.7,
    reviews: 412,
    description:
      "A double-walled cylinder in matte basalt glaze that keeps its grip and its heat. The rim is thinned to a knife edge by hand; the base is unglazed, so it sits on the table with a quiet confidence.",
    specs: [
      { label: "Material", value: "Double-walled stoneware" },
      { label: "Glaze", value: "Matte basalt, hand-finished rim" },
      { label: "Volume", value: "300 ml" },
      { label: "Care", value: "Dishwasher safe" },
      { label: "Origin", value: "Made in Portugal" },
    ],
    colors: [
      { name: "Basalt", value: "#2A2A31" },
      { name: "Fog", value: "#9DA2B4" },
    ],
    sizes: null,
    featured: false,
    new: false,
    bestseller: false,
  },
  {
    id: "p11",
    slug: "field-ancillary-candle",
    name: "Field Ancillary Candle",
    category: "lifestyle",
    tagline: "Cedar and ozone scented candle in a machined vessel",
    price: 70,
    rating: 4.5,
    reviews: 96,
    description:
      "A scent built from cedar, ozone and cold air — the first hour after rain. The vessel is machined aluminium; when the wax is gone, it stays on as a pen cup or a planter. Nothing is disposable here.",
    specs: [
      { label: "Wax", value: "Coconut-soy blend, cotton wick" },
      { label: "Burn", value: "52 hours" },
      { label: "Notes", value: "Cedar, ozone, cold air" },
      { label: "Vessel", value: "Machined aluminium, reusable" },
      { label: "Origin", value: "Poured in Sweden" },
    ],
    colors: [
      { name: "Graphite", value: "#2E2E36" },
      { name: "Signal Violet", value: "#8D63E8" },
    ],
    sizes: null,
    featured: false,
    new: false,
    bestseller: false,
  },
  {
    id: "p12",
    slug: "terra-merino-socks",
    name: "Terra Merino Socks",
    category: "clothing",
    tagline: "Cushioned merino socks with a seamless toe",
    price: 35,
    rating: 4.6,
    reviews: 288,
    description:
      "Cushioned underfoot, feather-light on top, and knitted with a seamless toe so nothing presses back. Reinforced heel zones keep the fit true through seasons of daily wear.",
    specs: [
      { label: "Yarn", value: "Merino blend with nylon core" },
      { label: "Cushion", value: "Zoned terry footbed" },
      { label: "Height", value: "Mid-calf" },
      { label: "Care", value: "Machine wash cold" },
      { label: "Origin", value: "Made in Italy" },
    ],
    colors: [
      { name: "Carbon", value: "#232329" },
      { name: "Fog", value: "#9DA2B4" },
      { name: "Magenta Pulse", value: "#E14F9B" },
    ],
    sizes: ["S", "M", "L"],
    featured: false,
    new: false,
    bestseller: false,
  },
];

export const BRANDS: string[] = ["NOVA Core", "NOVA Lab", "NOVA Field"];

export function getProductBySlug(slug: string | undefined): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
