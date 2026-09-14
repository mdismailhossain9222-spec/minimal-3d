import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { PRODUCTS, type Product } from "@/lib/catalog";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING = 12;

export interface CartLine {
  id: string; // `${slug}|${color}|${size}`
  slug: string;
  name: string;
  color: string;
  size: string | null;
  price: number;
  qty: number;
}

export interface WishlistLine {
  slug: string;
  addedAt: number;
}

interface StoreContextValue {
  products: Product[];
  cart: CartLine[];
  wishlist: WishlistLine[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setSearchOpen: (open: boolean) => void;
  addToCart: (
    product: Pick<Product, "slug" | "name" | "price">,
    options?: { color?: string; size?: string | null; qty?: number },
  ) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string, name?: string) => void;
  isWishlisted: (slug: string) => boolean;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() =>
    readJson<CartLine[]>("nova-cart", []),
  );
  const [wishlist, setWishlist] = useState<WishlistLine[]>(() =>
    readJson<WishlistLine[]>("nova-wishlist", []),
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("nova-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("nova-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const setSearchOpen = useCallback((open: boolean) => setIsSearchOpen(open), []);

  const addToCart = useCallback(
    (
      product: Pick<Product, "slug" | "name" | "price">,
      options?: { color?: string; size?: string | null; qty?: number },
    ) => {
      const color = options?.color ?? "Default";
      const size = options?.size ?? null;
      const qty = options?.qty ?? 1;
      const id = `${product.slug}|${color}|${size ?? "os"}`;
      setCart((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (existing) {
          return prev.map((l) =>
            l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l,
          );
        }
        return [
          ...prev,
          {
            id,
            slug: product.slug,
            name: product.name,
            color,
            size,
            price: product.price,
            qty,
          },
        ];
      });
      toast.success(`${product.name} added to cart`, {
        description: [color !== "Default" ? color : null, size].filter(Boolean).join(" · ") || undefined,
      });
      setIsCartOpen(true);
    },
    [],
  );

  const updateQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((slug: string, name?: string) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.slug === slug);
      if (exists) {
        toast(`Removed from wishlist`, { description: name });
        return prev.filter((w) => w.slug !== slug);
      }
      toast.success(`Saved to wishlist`, { description: name });
      return [...prev, { slug, addedAt: Date.now() }];
    });
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => wishlist.some((w) => w.slug === slug),
    [wishlist],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty, 0),
    [cart],
  );
  const subtotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty * l.price, 0),
    [cart],
  );
  const shipping = useMemo(
    () => (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING),
    [subtotal],
  );
  const total = subtotal + shipping;

  const value = useMemo<StoreContextValue>(
    () => ({
      products: PRODUCTS,
      cart,
      wishlist,
      isCartOpen,
      isSearchOpen,
      openCart,
      closeCart,
      setSearchOpen,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartCount,
      subtotal,
      shipping,
      total,
    }),
    [
      cart,
      wishlist,
      isCartOpen,
      isSearchOpen,
      openCart,
      closeCart,
      setSearchOpen,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartCount,
      subtotal,
      shipping,
      total,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
