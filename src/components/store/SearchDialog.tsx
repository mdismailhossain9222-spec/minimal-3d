import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";

export default function SearchDialog() {
  const navigate = useNavigate();
  const { products, isSearchOpen, setSearchOpen } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isSearchOpen, setSearchOpen]);

  return (
    <CommandDialog
      open={isSearchOpen}
      onOpenChange={setSearchOpen}
      title="Search NOVA"
      description="Search the full collection"
      className="border-border bg-popover"
    >
      <CommandInput placeholder="Search products…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Products">
          {products.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.name} ${p.category} ${p.tagline}`}
              onSelect={() => {
                setSearchOpen(false);
                navigate(`/product/${p.slug}`);
              }}
              className="cursor-pointer"
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatPrice(p.price)}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
