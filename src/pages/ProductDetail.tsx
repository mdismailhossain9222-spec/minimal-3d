import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Leaf,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { lazy, Suspense } from "react";
import ProductArt from "@/components/store/ProductArt";
import ProductCard from "@/components/store/ProductCard";
import { Eyebrow, NovaButton, Rating } from "@/components/store/primitives";
import { useStore } from "@/lib/store";
import { formatPrice, getProductBySlug, PRODUCTS, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const ProductScene = lazy(() => import("@/components/three/ProductScene"));

const REVIEW_POOL = [
  { name: "Mara K.", rating: 5, date: "August 2026", title: "Exactly as promised", body: "The finish is flawless and it feels engineered rather than decorated. Second NOVA piece this year; not the last." },
  { name: "Jonas P.", rating: 5, date: "July 2026", title: "Worth the wait", body: "You can feel the reduction in the design — nothing to fidget with, everything where your hand expects it." },
  { name: "Elif S.", rating: 4, date: "June 2026", title: "Excellent, with one note", body: "Runs slightly slim in my experience. Sizing advice from the team was spot on, and the quality is undeniable." },
  { name: "Theo R.", rating: 5, date: "June 2026", title: "Daily driver now", body: "I've stopped reaching for anything else. It has aged beautifully over four months of daily use." },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Product not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The piece you're looking for may have sold out or moved.
        </p>
        <NovaButton asChild className="mt-8">
          <Link to="/shop">Back to the shop</Link>
        </NovaButton>
      </main>
    );
  }

  // Keyed by product so color/size/qty state resets between products.
  return <ProductDetailContent key={product.id} product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, openCart } = useStore();

  const [color, setColor] = useState(product?.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(product?.sizes?.[1] ?? null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"art" | "3d">("art");
  const [added, setAdded] = useState(false);

  const related = useMemo(
    () =>
      product
        ? PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
            .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
            .slice(0, 3)
        : [],
    [product],
  );

  const wishlisted = isWishlisted(product.slug);

  const handleAdd = () => {
    addToCart(product, { color, size, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    addToCart(product, { color, size, qty });
    openCart();
  };

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-8 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="bg-nova-gradient relative overflow-hidden rounded-lg border border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + color}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-square"
              >
                {view === "art" ? (
                  <ProductArt product={product} color={color} className="h-full w-full" />
                ) : (
                  <Suspense fallback={null}>
                    <ProductScene className="h-full w-full" />
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {product.new && (
                <span className="rounded-full border border-electric/50 bg-electric/10 px-2.5 py-1 font-label text-[10px] text-electric backdrop-blur">
                  New
                </span>
              )}
              {product.bestseller && (
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-label text-[10px] text-white/70 backdrop-blur">
                  Bestseller
                </span>
              )}
            </div>
          </div>

          {/* View switcher */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("art")}
                className={cn(
                  "h-14 w-20 overflow-hidden rounded-md border transition-all",
                  view === "art" ? "border-electric" : "border-white/10 opacity-60 hover:opacity-100",
                )}
                aria-label="Studio view"
              >
                <ProductArt product={product} color={color} className="h-full w-full" />
              </button>
              <button
                type="button"
                onClick={() => setView("3d")}
                className={cn(
                  "flex h-14 w-20 items-center justify-center rounded-md border bg-nova-gradient font-label text-[9px] text-muted-foreground transition-all",
                  view === "3d" ? "border-electric text-electric" : "opacity-60 hover:opacity-100",
                )}
                aria-label="3D viewer"
              >
                360°
              </button>
            </div>
            <p className="font-label text-muted-foreground">
              {view === "3d" ? "Drag to orbit" : "Studio view"}
            </p>
          </div>
        </div>

        {/* Details */}
        <div>
          <Eyebrow label={product.category.charAt(0).toUpperCase() + product.category.slice(1)} />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-5">
            <span className="text-2xl font-medium tabular-nums">{formatPrice(product.price)}</span>
            <Rating value={product.rating} count={product.reviews} />
          </div>

          {/* Colors */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="font-label text-muted-foreground">Color</p>
              <p className="text-xs text-muted-foreground">{color}</p>
            </div>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "size-8 rounded-full border-2 p-0.5 transition-all duration-300",
                    color === c.name ? "border-electric scale-110" : "border-transparent hover:border-white/25",
                  )}
                >
                  <span className="block size-full rounded-full" style={{ background: c.value }} />
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          {product.sizes && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="font-label text-muted-foreground">Size</p>
                <button type="button" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                  Size guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 min-w-12 rounded-md border px-3 text-sm transition-all duration-300",
                      size === s
                        ? "border-electric bg-electric/10 text-electric"
                        : "border-border text-muted-foreground hover:border-white/25 hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-8 flex items-stretch gap-3">
            <div className="inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <NovaButton className="min-w-40 flex-1" onClick={handleAdd}>
              {added ? (
                "Added ✓"
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  Add to cart
                </>
              )}
            </NovaButton>
            <NovaButton variant="secondary" onClick={handleBuyNow}>
              Buy now
            </NovaButton>
            <NovaButton
              variant="ghost"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.slug, product.name)}
              className="w-11 border border-border px-0"
            >
              <Heart className={cn("size-4", wishlisted && "fill-magenta-neon text-magenta-neon")} />
            </NovaButton>
          </div>

          {/* Assurances */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-white/10 py-5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <PackageCheck className="size-4 text-electric" strokeWidth={1.5} />
              Free shipping over $200
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 text-electric" strokeWidth={1.5} />
              30-day returns
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-electric" strokeWidth={1.5} />
              2-year warranty
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <p className="font-label text-muted-foreground">Description</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="mt-8">
            <p className="font-label text-muted-foreground">Specifications</p>
            <dl className="mt-3 border-t border-white/10">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 border-b border-white/10 py-3 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Leaf className="size-3.5 text-electric" />
              Carbon-neutral delivery · Recycled packaging · Repair program included
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-white/5 bg-carbon">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow label="Reviews" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight">
                {product.rating.toFixed(1)} out of 5
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on {product.reviews} verified purchases
              </p>
            </div>
            <Rating value={product.rating} />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {REVIEW_POOL.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-lg border border-white/10 bg-card p-6 card-sheen"
              >
                <div className="flex items-center justify-between">
                  <Rating value={r.rating} />
                  <span className="font-label text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-4 text-sm font-medium">{r.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{r.body}</p>
                <p className="mt-4 font-label text-muted-foreground">{r.name} · Verified buyer</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">Pairs well with</h2>
            <NovaButton asChild variant="ghost" size="sm">
              <Link to="/shop">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </NovaButton>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
