import { Link } from "react-router";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/shop" },
      { label: "New arrivals", to: "/shop?category=new" },
      { label: "Clothing", to: "/shop?category=clothing" },
      { label: "Sneakers", to: "/shop?category=sneakers" },
      { label: "Tech", to: "/shop?category=tech" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About NOVA", to: "/about" },
      { label: "Collections", to: "/collections" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Account", to: "/account" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & returns", to: "/about" },
      { label: "Care guides", to: "/about" },
      { label: "Contact", to: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-carbon">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden="true">
                <path d="M16 1.5 30.5 27H1.5L16 1.5Z" stroke="url(#f-g)" strokeWidth="1.75" strokeLinejoin="round" />
                <path d="M16 11.5 23 24H9l7-12.5Z" fill="url(#f-g)" fillOpacity="0.9" />
                <defs>
                  <linearGradient id="f-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C8CFF" />
                    <stop offset="0.55" stopColor="#9F6BFF" />
                    <stop offset="1" stopColor="#F0509B" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-sm font-semibold tracking-[0.34em]">NOVA</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A futuristic lifestyle brand. We make a small number of things,
              carefully — apparel, accessories, sneakers, tech and objects for
              the next generation.
            </p>
            <p className="mt-6 font-label text-[10px] text-muted-foreground/70">
              Designed for the next generation
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="font-label text-muted-foreground">{col.title}</span>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 NOVA Industries. All rights reserved.</span>
          <span className="font-label">Light, geometry, intent.</span>
        </div>
      </div>
    </footer>
  );
}
