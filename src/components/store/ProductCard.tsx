import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import ProductArt from "@/components/store/ProductArt";
import { Rating } from "@/components/store/primitives";
import { useStore } from "@/lib/store";
import { formatPrice, type Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Clamp helper for tilt angles. */
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${clamp(-py * 7, -7, 7)}deg) rotateY(${clamp(px * 9, -9, 9)}deg) translateY(-2px)`,
      "--mx": `${(px + 0.5) * 100}%`,
      "--my": `${(py + 0.5) * 100}%`,
    } as React.CSSProperties);
  };

  const handleLeave = () => {
    setHovering(false);
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
  };

  const wishlisted = isWishlisted(product.slug);
  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={style}
        className="group relative h-full rounded-lg border border-border bg-card card-sheen transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-electric/40 hover:shadow-[0_24px_60px_-30px_oklch(0.72_0.165_258/0.5)]"
      >
        {/* Cursor-follow sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), oklch(0.72 0.165 258 / 10%), transparent 70%)",
          }}
        />

        {/* Media */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-[4/3] overflow-hidden rounded-t-lg"
          aria-label={product.name}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
            <ProductArt product={product} className="h-full w-full" />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
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
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.slug, product.name)}
          className={cn(
            "absolute top-3 right-3 z-20 inline-flex size-9 items-center justify-center rounded-full border backdrop-blur transition-all duration-300",
            wishlisted
              ? "border-magenta-neon/60 bg-magenta-neon/15 text-magenta-neon"
              : "border-white/10 bg-black/30 text-white/70 opacity-0 hover:border-white/30 hover:text-white group-hover:opacity-100",
          )}
        >
          <Heart className={cn("size-4", wishlisted && "fill-current")} />
        </button>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-label text-muted-foreground">{categoryLabel}</span>
            <Rating value={product.rating} count={product.reviews} />
          </div>
          <Link to={`/product/${product.slug}`} className="mt-2 block">
            <h3 className="text-[15px] font-medium tracking-tight text-foreground transition-colors group-hover:text-electric">
              {product.name}
            </h3>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
            <button
              type="button"
              onClick={() => addToCart(product, { color: product.colors[0]?.name })}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-all duration-300 hover:border-electric hover:bg-electric hover:text-[#0B0B10]"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
