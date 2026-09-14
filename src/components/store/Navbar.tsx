import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/shop?category=new", label: "New Arrivals" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, openCart, setSearchOpen, wishlist } = useStore();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="relative z-40 bg-carbon text-center">
        <p className="mx-auto max-w-6xl px-6 py-2 text-[11px] tracking-wide text-white/55">
          Complimentary carbon-neutral shipping on orders over $200 · 30-day returns
        </p>
      </div>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-500",
          scrolled
            ? "border-white/10 bg-[oklch(0.105_0.005_285/0.72)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" aria-label="NOVA home">
            <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden="true">
              <path d="M16 1.5 30.5 27H1.5L16 1.5Z" stroke="url(#nav-g)" strokeWidth="1.75" strokeLinejoin="round" />
              <path d="M16 11.5 23 24H9l7-12.5Z" fill="url(#nav-g)" fillOpacity="0.9" />
              <defs>
                <linearGradient id="nav-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C8CFF" />
                  <stop offset="0.55" stopColor="#9F6BFF" />
                  <stop offset="1" stopColor="#F0509B" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-semibold tracking-[0.34em]">NOVA</span>
          </Link>

          {/* Primary nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "text-[13px] tracking-wide transition-colors",
                    isActive && !(l.label === "New Arrivals")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
              className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart className="size-[18px]" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-magenta-neon" />
              )}
            </button>

            <button
              type="button"
              aria-label="Open cart"
              onClick={openCart}
              className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-electric px-1 text-[10px] font-semibold text-[#0B0B10] tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account"
                  className="ml-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  <User className="size-[18px]" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-border bg-popover">
                {isLoading ? null : isAuthenticated ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <p className="truncate text-sm">{user?.name ?? "Member"}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => navigate("/account")} className="cursor-pointer">
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")} className="cursor-pointer">
                      Orders
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/auth")} className="cursor-pointer">
                      Sign up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/auth")} className="cursor-pointer">
                      Log in
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="flex items-center gap-6 overflow-x-auto border-t border-white/5 px-6 pb-3 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
