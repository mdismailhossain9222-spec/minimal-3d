import { Link } from "react-router";
import { Heart, ShoppingBag, X } from "lucide-react";
import ProductArt from "@/components/store/ProductArt";
import { Eyebrow, NovaButton, Rating } from "@/components/store/primitives";
import { useStore } from "@/lib/store";
import { formatPrice, PRODUCTS } from "@/lib/catalog";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const items = wishlist
    .map((w) => PRODUCTS.find((p) => p.slug === w.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="bg-background">
      <div className="bg-nova-radial border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <Eyebrow label="Saved" />
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">Wishlist</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground">
            Pieces you're circling. They'll be here when you're ready.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-28 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-magenta-neon/15 blur-2xl" />
              <Heart className="relative size-10 text-muted-foreground" strokeWidth={1.25} />
            </div>
            <p className="mt-6 text-sm font-medium">Nothing saved yet</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              Tap the heart on any product to keep it here for later.
            </p>
            <NovaButton asChild className="mt-8">
              <Link to="/shop">Browse the collection</Link>
            </NovaButton>
          </div>
        ) : (
          <div className="border-t border-white/10">
            {items.map((p) => (
              <div key={p.slug} className="flex items-center gap-6 border-b border-white/10 py-6">
                <Link
                  to={`/product/${p.slug}`}
                  className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-white/10"
                >
                  <ProductArt product={p} className="h-full w-full" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${p.slug}`} className="text-sm font-medium hover:text-electric">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                  <div className="mt-2">
                    <Rating value={p.rating} count={p.reviews} />
                  </div>
                </div>
                <span className="hidden text-sm font-medium tabular-nums sm:block">
                  {formatPrice(p.price)}
                </span>
                <div className="flex items-center gap-2">
                  <NovaButton
                    size="sm"
                    variant="secondary"
                    onClick={() => addToCart(p, { color: p.colors[0]?.name })}
                  >
                    <ShoppingBag className="size-3.5" />
                    Add to cart
                  </NovaButton>
                  <button
                    type="button"
                    aria-label={`Remove ${p.name} from wishlist`}
                    onClick={() => toggleWishlist(p.slug, p.name)}
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
