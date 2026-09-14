import { Link, useNavigate } from "react-router";
import { Heart, LogOut, Package, Sparkles, UserCircle2 } from "lucide-react";
import { Eyebrow, NovaButton } from "@/components/store/primitives";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/catalog";

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { cartCount, wishlist } = useStore();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="bg-background">
      <div className="bg-nova-radial border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <Eyebrow label="Your account" />
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
            {user?.name ? `Welcome back, ${user.name}.` : "Welcome back."}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {user?.email ?? "Signed in"} · NOVA member since 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Membership card */}
        <div className="bg-nova-gradient relative overflow-hidden rounded-lg border border-white/10 p-8 card-sheen md:p-10">
          <div className="grain absolute inset-0" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="size-4 text-electric" />
                <span className="font-label text-muted-foreground">NOVA Membership</span>
              </div>
              <p className="mt-4 font-label text-muted-foreground">Tier</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">Orbit — Tier 1</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Early access to releases, free returns and first refusal on
                limited runs. Spend {formatPrice(500)} more to reach Tier 2.
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-label text-muted-foreground">Member no.</p>
              <p className="mt-1 font-mono text-sm tracking-widest">NV-2026-000{cartCount + 1}17</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            to="/orders"
            className="group rounded-lg border border-white/10 bg-card p-6 transition-colors hover:border-electric/40"
          >
            <Package className="size-5 text-electric" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-medium">Orders</p>
            <p className="mt-1 text-xs text-muted-foreground">Track and review past purchases</p>
          </Link>
          <Link
            to="/wishlist"
            className="group rounded-lg border border-white/10 bg-card p-6 transition-colors hover:border-electric/40"
          >
            <Heart className="size-5 text-electric" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-medium">Wishlist</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {wishlist.length > 0 ? `${wishlist.length} saved ${wishlist.length === 1 ? "piece" : "pieces"}` : "Nothing saved yet"}
            </p>
          </Link>
          <div className="rounded-lg border border-white/10 bg-card p-6">
            <UserCircle2 className="size-5 text-electric" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-medium">Profile</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
          </div>
        </div>

        {/* Session */}
        <div className="mt-10 flex flex-col justify-between gap-4 rounded-lg border border-white/10 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Session</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You're signed in on this device. Sign out to end the session.
            </p>
          </div>
          <NovaButton variant="secondary" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign out
          </NovaButton>
        </div>
      </div>
    </main>
  );
}
