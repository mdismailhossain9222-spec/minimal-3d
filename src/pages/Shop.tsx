import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { NovaButton, Eyebrow } from "@/components/store/primitives";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRANDS, CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
];

const MAX_PRICE = 1500;

function FilterPanel({
  categories,
  toggleCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  brands,
  toggleBrand,
  inStockOnly,
  setInStockOnly,
  onReset,
}: {
  categories: Set<CategoryId>;
  toggleCategory: (c: CategoryId) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  brands: Set<string>;
  toggleBrand: (b: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-label text-muted-foreground">Category</p>
        <div className="mt-4 space-y-3">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={categories.has(c.id)}
                onCheckedChange={() => toggleCategory(c.id)}
                className="border-border data-[state=checked]:border-electric data-[state=checked]:bg-electric data-[state=checked]:text-[#0B0B10]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="font-label text-muted-foreground">Max price</p>
          <span className="text-sm tabular-nums text-electric">${maxPrice}</span>
        </div>
        <Slider
          value={[maxPrice]}
          min={35}
          max={MAX_PRICE}
          step={5}
          onValueChange={([v]) => setMaxPrice(v)}
          className="mt-4 [&_[data-slot=slider-range]]:bg-electric"
        />
      </div>

      <div>
        <p className="font-label text-muted-foreground">Rating</p>
        <div className="mt-4 space-y-3">
          {[4.5, 4, 0].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={minRating === r}
                onCheckedChange={() => setMinRating(r)}
                className="border-border data-[state=checked]:border-electric data-[state=checked]:bg-electric data-[state=checked]:text-[#0B0B10]"
              />
              {r === 0 ? "All ratings" : `${r}+ stars`}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label text-muted-foreground">Line</p>
        <div className="mt-4 space-y-3">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={brands.has(b)}
                onCheckedChange={() => toggleBrand(b)}
                className="border-border data-[state=checked]:border-electric data-[state=checked]:bg-electric data-[state=checked]:text-[#0B0B10]"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <Checkbox
          checked={inStockOnly}
          onCheckedChange={(v) => setInStockOnly(v === true)}
          className="border-border data-[state=checked]:border-electric data-[state=checked]:bg-electric data-[state=checked]:text-[#0B0B10]"
        />
        In stock only
      </label>

      <NovaButton variant="secondary" size="sm" className="w-full" onClick={onReset}>
        Reset filters
      </NovaButton>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as CategoryId | null;

  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Set<CategoryId>>(
    new Set(categoryParam ? [categoryParam] : []),
  );
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // React to navbar/footer links like /shop?category=new
  useEffect(() => {
    if (categoryParam) {
      setCategories(new Set([categoryParam]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  const toggleCategory = (c: CategoryId) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.delete("category");
      return sp;
    });
  };

  const toggleBrand = (b: string) => {
    setBrands((prev) => {
      const next = new Set(prev);
      if (next.has(b)) next.delete(b);
      else next.add(b);
      return next;
    });
  };

  const reset = () => {
    setQuery("");
    setCategories(new Set());
    setMaxPrice(MAX_PRICE);
    setMinRating(0);
    setBrands(new Set());
    setInStockOnly(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (q && !`${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q)) return false;
      if (categories.size > 0) {
        const match = categories.has(p.category) || (categories.has("new") && p.new);
        if (!match) return false;
      }
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (brands.size > 0 && !brands.has(BRANDS[p.id.charCodeAt(1) % BRANDS.length])) return false;
      if (inStockOnly && p.id === "p07") return false; // demo: the watch is "made to order"
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = [...list].sort((a, b) => Number(b.new) - Number(a.new));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [query, categories, maxPrice, minRating, brands, inStockOnly, sort]);

  const activeFilterCount =
    (categories.size > 0 ? 1 : 0) +
    (maxPrice < MAX_PRICE ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (brands.size > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const filterProps = {
    categories,
    toggleCategory,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    brands,
    toggleBrand,
    inStockOnly,
    setInStockOnly,
    onReset: reset,
  };

  return (
    <main className="bg-background">
      <div className="bg-nova-radial border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <Eyebrow label="The shop" />
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            All products
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-muted-foreground">
            The full NOVA collection — every piece, in every finish.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-8 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-electric/60"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Mobile filters */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <NovaButton variant="secondary" size="sm" className="lg:hidden">
                <Filter className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-electric text-[10px] font-semibold text-[#0B0B10]">
                    {activeFilterCount}
                  </span>
                )}
              </NovaButton>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto border-border bg-popover p-6">
              <SheetHeader className="p-0">
                <SheetTitle className="font-label text-muted-foreground">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <FilterPanel {...filterProps} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="hidden size-4 text-muted-foreground lg:block" />
            <span className="font-label hidden text-muted-foreground lg:block">Sort</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-10 w-44 border-border bg-card data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Grid */}
          <div>
            <p className="mb-5 text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
                <p className="text-sm font-medium">No products match your filters</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                  Try widening the price range or clearing a category or two.
                </p>
                <NovaButton variant="secondary" size="sm" className="mt-6" onClick={reset}>
                  Reset filters
                </NovaButton>
              </div>
            ) : (
              <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, delay: i < 6 ? i * 0.03 : 0 }}
                    >
                      <ProductCard product={p} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
