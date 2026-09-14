import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Lock, MapPin, ShoppingBag, User } from "lucide-react";
import ProductArt from "@/components/store/ProductArt";
import { Eyebrow, NovaButton } from "@/components/store/primitives";
import { Input } from "@/components/ui/input";
import { useStore, FREE_SHIPPING_THRESHOLD } from "@/lib/store";
import { formatPrice, getProductBySlug } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2;

const STEPS: { label: string; icon: typeof User }[] = [
  { label: "Contact", icon: User },
  { label: "Shipping", icon: MapPin },
  { label: "Payment", icon: CreditCard },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, total, clearCart } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    card: "",
    expiry: "",
    cvc: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const stepValid = useMemo(() => {
    if (step === 0) return /\S+@\S+\.\S+/.test(form.email);
    if (step === 1) return form.name && form.address && form.city && form.zip;
    return form.card.replace(/\s/g, "").length >= 15 && form.expiry.length >= 4 && form.cvc.length >= 3;
  }, [step, form]);

  /* ----------------------------- Confirmation ---------------------------- */
  if (placed) {
    return (
      <main className="bg-background">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="glow-electric flex size-16 items-center justify-center rounded-full border border-electric/40 bg-electric/10"
          >
            <Check className="size-7 text-electric" />
          </motion.div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
            Order confirmed.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">
            Order <span className="font-label text-foreground">NV-{String(Date.now()).slice(-6)}</span> is
            being prepared. A confirmation is on its way to {form.email || "your inbox"} —
            tracking follows as soon as it ships.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NovaButton asChild>
              <Link to="/shop">Continue shopping</Link>
            </NovaButton>
            <NovaButton asChild variant="secondary">
              <Link to="/account">View account</Link>
            </NovaButton>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------- Empty -------------------------------- */
  if (cart.length === 0) {
    return (
      <main className="bg-background">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-electric/15 blur-2xl" />
            <ShoppingBag className="relative size-10 text-muted-foreground" strokeWidth={1.25} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Your cart is empty</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Add a piece to the cart and checkout will be waiting.
          </p>
          <NovaButton asChild className="mt-8">
            <Link to="/shop">Browse the shop</Link>
          </NovaButton>
        </div>
      </main>
    );
  }

  /* -------------------------------- Flow --------------------------------- */
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

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-8 lg:grid-cols-[1fr_380px]">
        {/* Form column */}
        <div>
          <Eyebrow label="Secure checkout" />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Checkout</h1>

          {/* Stepper */}
          <div className="mt-10 flex items-center gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const state = i < step ? "done" : i === step ? "active" : "todo";
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i as Step)}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-xs transition-all",
                      state === "done" && "border-electric/40 bg-electric/10 text-electric",
                      state === "active" && "border-electric bg-electric text-[#0B0B10] font-semibold",
                      state === "todo" && "border-border text-muted-foreground",
                    )}
                  >
                    {state === "done" ? <Check className="size-3.5" /> : <Icon className="size-3.5" />}
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-5">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                <div>
                  <label htmlFor="co-email" className="font-label text-muted-foreground">Email</label>
                  <Input
                    id="co-email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={set("email")}
                    className="mt-2 h-11 rounded-md border-border bg-card focus-visible:ring-electric/50"
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Order updates go here. No marketing unless you ask.
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input type="checkbox" defaultChecked className="accent-[var(--electric)]" />
                  Email me about new releases (about once a month)
                </label>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                <div>
                  <label htmlFor="co-name" className="font-label text-muted-foreground">Full name</label>
                  <Input id="co-name" value={form.name} onChange={set("name")} placeholder="Ada Lovelace" className="mt-2 h-11 rounded-md border-border bg-card focus-visible:ring-electric/50" />
                </div>
                <div>
                  <label htmlFor="co-address" className="font-label text-muted-foreground">Address</label>
                  <Input id="co-address" value={form.address} onChange={set("address")} placeholder="12 Meridian Way" className="mt-2 h-11 rounded-md border-border bg-card focus-visible:ring-electric/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="co-city" className="font-label text-muted-foreground">City</label>
                    <Input id="co-city" value={form.city} onChange={set("city")} placeholder="Berlin" className="mt-2 h-11 rounded-md border-border bg-card focus-visible:ring-electric/50" />
                  </div>
                  <div>
                    <label htmlFor="co-zip" className="font-label text-muted-foreground">Postal code</label>
                    <Input id="co-zip" value={form.zip} onChange={set("zip")} placeholder="10115" className="mt-2 h-11 rounded-md border-border bg-card focus-visible:ring-electric/50" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
                <div>
                  <label htmlFor="co-card" className="font-label text-muted-foreground">Card number</label>
                  <Input id="co-card" value={form.card} onChange={set("card")} placeholder="4242 4242 4242 4242" inputMode="numeric" className="mt-2 h-11 rounded-md border-border bg-card tabular-nums focus-visible:ring-electric/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="co-exp" className="font-label text-muted-foreground">Expiry</label>
                    <Input id="co-exp" value={form.expiry} onChange={set("expiry")} placeholder="09/28" className="mt-2 h-11 rounded-md border-border bg-card tabular-nums focus-visible:ring-electric/50" />
                  </div>
                  <div>
                    <label htmlFor="co-cvc" className="font-label text-muted-foreground">CVC</label>
                    <Input id="co-cvc" value={form.cvc} onChange={set("cvc")} placeholder="•••" className="mt-2 h-11 rounded-md border-border bg-card tabular-nums focus-visible:ring-electric/50" />
                  </div>
                </div>
                <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Lock className="size-3.5 text-electric" />
                  Demo checkout — no card is charged and nothing is stored.
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <NovaButton variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>
                Back
              </NovaButton>
            )}
            {step < 2 ? (
              <NovaButton disabled={!stepValid} onClick={() => setStep((s) => (s + 1) as Step)}>
                Continue
              </NovaButton>
            ) : (
              <NovaButton
                disabled={!stepValid}
                onClick={() => {
                  setPlaced(true);
                  clearCart();
                }}
              >
                <Lock className="size-4" />
                Place order — {formatPrice(total)}
              </NovaButton>
            )}
          </div>
        </div>

        {/* Summary column */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-white/10 bg-card p-6 card-sheen">
            <p className="font-label text-muted-foreground">Order summary</p>
            <div className="mt-5 space-y-4">
              {cart.map((line) => {
                const product = getProductBySlug(line.slug);
                return (
                  <div key={line.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md border border-white/10">
                      {product && <ProductArt product={product} color={line.color} className="h-full w-full" />}
                      <span className="absolute top-1 right-1 inline-flex size-5 items-center justify-center rounded-full bg-black/70 text-[10px] tabular-nums text-white">
                        {line.qty}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{line.name}</p>
                      <p className="font-label text-[10px] text-muted-foreground">
                        {[line.color, line.size].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="text-sm tabular-nums">{formatPrice(line.price * line.qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
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
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              {shipping > 0 && (
                <p className="pt-1 text-[11px] text-muted-foreground">
                  Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            30-day returns · Carbon-neutral delivery · 2-year warranty
          </p>
        </aside>
      </div>
    </main>
  );
}
