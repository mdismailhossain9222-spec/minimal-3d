import { Link, useNavigate } from "react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { NovaButton } from "@/components/store/primitives";
import ProductArt from "@/components/store/ProductArt";
import { useStore, FREE_SHIPPING_THRESHOLD } from "@/lib/store";
import { formatPrice, getProductBySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    closeCart,
    cart,
    updateQty,
    removeFromCart,
    subtotal,
    shipping,
    total,
    cartCount,
  } = useStore();

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-border bg-popover p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border p-6 pb-5">
          <SheetTitle className="flex items-center gap-3 text-base font-medium tracking-wide">
            <ShoppingBag className="size-4 text-electric" />
            Your cart
            {cartCount > 0 && (
              <span className="rounded-full border border-border px-2 py-0.5 font-label text-[10px] text-muted-foreground">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Complimentary carbon-neutral shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-electric/15 blur-2xl" />
              <ShoppingBag className="relative size-10 text-muted-foreground" strokeWidth={1.25} />
            </div>
            <div>
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Nothing here yet — the collection is one tap away.
              </p>
            </div>
            <NovaButton
              variant="secondary"
              size="sm"
              onClick={() => {
                closeCart();
                navigate("/shop");
              }}
            >
              Browse the shop
            </NovaButton>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  {shipping === 0
                    ? "Free shipping unlocked"
                    : `${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} away from free shipping`}
                </span>
                <span className="font-label">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-nova-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto px-6">
              {cart.map((line) => {
                const product = getProductBySlug(line.slug);
                return (
                  <div
                    key={line.id}
                    className="flex gap-4 border-b border-border/70 py-5 last:border-b-0"
                  >
                    <Link
                      to={`/product/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md border border-border"
                    >
                      {product && <ProductArt product={product} color={line.color} className="h-full w-full" />}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{line.name}</p>
                          <p className="mt-1 font-label text-[10px] text-muted-foreground">
                            {[line.color, line.size].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${line.name}`}
                          onClick={() => removeFromCart(line.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.id, line.qty - 1)}
                            className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.id, line.qty + 1)}
                            className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-border p-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={cn("tabular-nums", shipping === 0 && "text-electric")}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
              <NovaButton
                className="mt-5 w-full"
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
              >
                Checkout
              </NovaButton>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
