import { Link } from "react-router";
import { Package } from "lucide-react";
import ProductArt from "@/components/store/ProductArt";
import { Eyebrow, NovaButton } from "@/components/store/primitives";
import { formatPrice, getProductBySlug } from "@/lib/catalog";

type OrderStatus = "Delivered" | "In transit" | "Preparing";

const ORDERS: {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  lines: { slug: string; qty: number }[];
}[] = [
  {
    id: "NV-2026-00341",
    date: "Aug 28, 2026",
    status: "In transit",
    total: 685,
    lines: [
      { slug: "aegis-01-shell-jacket", qty: 1 },
      { slug: "terra-merino-socks", qty: 2 },
    ],
  },
  {
    id: "NV-2026-00286",
    date: "Jul 02, 2026",
    status: "Delivered",
    total: 265,
    lines: [{ slug: "orbit-runner-sneakers", qty: 1 }],
  },
  {
    id: "NV-2026-00212",
    date: "May 11, 2026",
    status: "Delivered",
    total: 115,
    lines: [
      { slug: "monolith-ceramic-mug", qty: 1 },
      { slug: "field-ancillary-candle", qty: 1 },
    ],
  },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Delivered: "border-border text-muted-foreground",
  "In transit": "border-electric/50 bg-electric/10 text-electric",
  Preparing: "border-white/20 text-foreground",
};

export default function Orders() {
  return (
    <main className="bg-background">
      <div className="bg-nova-radial border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <Eyebrow label="History" />
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">Orders</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground">
            Every NOVA purchase, tracked and archived.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-5 px-6 py-14">
        {ORDERS.map((o) => (
          <div key={o.id} className="rounded-lg border border-white/10 bg-card p-6 card-sheen">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-sm tracking-widest">{o.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">Placed {o.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 font-label text-[10px] ${STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
                <span className="text-sm font-medium tabular-nums">{formatPrice(o.total)}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              {o.lines.map((l) => {
                const p = getProductBySlug(l.slug);
                if (!p) return null;
                return (
                  <Link
                    key={l.slug}
                    to={`/product/${l.slug}`}
                    className="group flex items-center gap-3 rounded-md border border-white/10 p-2 pr-4 transition-colors hover:border-electric/40"
                  >
                    <span className="relative block h-12 w-16 overflow-hidden rounded-sm">
                      <ProductArt product={p} className="h-full w-full" />
                    </span>
                    <span className="text-xs">
                      <span className="block font-medium group-hover:text-electric">{p.name}</span>
                      <span className="text-muted-foreground">× {l.qty}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center rounded-lg border border-dashed border-border py-12 text-center">
          <Package className="size-6 text-muted-foreground" strokeWidth={1.25} />
          <p className="mt-4 text-sm text-muted-foreground">
            Older orders live in your account archive.
          </p>
          <NovaButton asChild variant="secondary" size="sm" className="mt-5">
            <Link to="/account">Back to account</Link>
          </NovaButton>
        </div>
      </div>
    </main>
  );
}
