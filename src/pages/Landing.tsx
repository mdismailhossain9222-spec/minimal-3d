import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import ProductArt from "@/components/store/ProductArt";
import { Eyebrow, NovaButton, Section } from "@/components/store/primitives";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const NovaScene = lazy(() => import("@/components/three/NovaScene"));
const ProductScene = lazy(() => import("@/components/three/ProductScene"));

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 36 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  01 — Hero                                                          */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Aurora field */}
      <div className="bg-nova-aurora absolute inset-0" />
      <div className="grain absolute inset-0" />
      {/* WebGL layer */}
      <motion.div style={{ y: sceneY }} className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NovaScene />
        </Suspense>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        <div className="flex flex-1 flex-col justify-end pb-28 pt-44 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <Eyebrow index="01" label="The Collection — FW26" tone="onDark" />
            <h1 className="mt-8 text-[13vw] leading-[0.98] font-semibold tracking-[-0.03em] text-foreground sm:text-7xl lg:text-[5.5rem]">
              Designed for the
              <br />
              <span className="text-nova-gradient">next generation.</span>
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-7 text-muted-foreground">
              NOVA is a futuristic lifestyle brand. Apparel, accessories and
              objects engineered from quiet geometry — built to be worn, used
              and kept for years, not seasons.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NovaButton asChild variant="primary" size="lg">
                <Link to="/shop">
                  Shop the collection
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/nbtn:translate-x-0.5" />
                </Link>
              </NovaButton>
              <NovaButton asChild variant="onDark" size="lg">
                <a href="#featured-collection">Explore NOVA</a>
              </NovaButton>
            </div>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center justify-between border-t border-white/10 py-5 text-muted-foreground"
        >
          <span className="font-label">Scroll to explore</span>
          <ArrowDown className="size-4 animate-bounce" strokeWidth={1.5} />
          <span className="font-label">FW26 / 001</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  02 — Featured products                                             */
/* ------------------------------------------------------------------ */

function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <Section className="border-t border-white/5 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="02" label="Featured products" />
              <h2 className="mt-7 max-w-xl text-4xl leading-[1.06] font-semibold tracking-tight sm:text-5xl">
                Objects of intent.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">
                Six pieces from the current collection — each one reduced to
                its essential form, then built to last.
              </p>
            </div>
            <NovaButton asChild variant="secondary">
              <Link to="/shop">
                View all products
                <ArrowRight className="size-4" />
              </Link>
            </NovaButton>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  03 — Categories                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_ART: Record<string, string> = {
  new: "#8D63E8",
  clothing: "#2E2E36",
  accessories: "#3A3A42",
  sneakers: "#5D7BFF",
  tech: "#8E93A6",
  lifestyle: "#9DA2B4",
};

function Categories() {
  return (
    <Section className="border-t border-white/5 bg-carbon">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow index="03" label="Categories" />
          <h2 className="mt-7 max-w-xl text-4xl leading-[1.06] font-semibold tracking-tight sm:text-5xl">
            Choose your orbit.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                to={`/shop?category=${cat.id}`}
                className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-lg border border-white/10 p-6 transition-all duration-500 hover:border-electric/50"
              >
                {/* Art panel — tone + oversized monogram */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  style={{
                    background: `radial-gradient(120% 100% at 30% 20%, ${CATEGORY_ART[cat.id]}22 0%, #101016 70%)`,
                  }}
                />
                <span
                  aria-hidden
                  className="absolute -right-3 -bottom-8 text-[7rem] leading-none font-bold tracking-tighter text-white/[0.05] transition-all duration-500 group-hover:text-white/[0.09]"
                >
                  {cat.label.slice(0, 2).toUpperCase()}
                </span>
                <div className="relative">
                  <span className="font-label text-muted-foreground">{cat.note}</span>
                  <div className="mt-2 flex items-center gap-3">
                    <h3 className="text-xl font-medium tracking-tight">{cat.label}</h3>
                    <ArrowRight className="size-4 text-electric opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  04 — Featured collection (editorial + 3D)                          */
/* ------------------------------------------------------------------ */

function FeaturedCollection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const reduce = useReducedMotion();

  const marquee = PRODUCTS.filter((p) => p.new || p.bestseller).slice(0, 8);
  const orbit = PRODUCTS.find((p) => p.slug === "orbit-runner-sneakers");
  const aegis = PRODUCTS.find((p) => p.slug === "aegis-01-shell-jacket");

  return (
    <Section id="featured-collection" className="border-t border-white/5 bg-background">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow index="04" label="Featured collection" />
          <h2 className="mt-7 max-w-2xl text-4xl leading-[1.06] font-semibold tracking-tight sm:text-5xl">
            The FW26{" "}
            <span className="text-nova-gradient">Orbit</span> collection.
          </h2>
        </Reveal>

        {/* Asymmetric editorial layout */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-12">
          <motion.div style={{ y: reduce ? undefined : yA }} className="lg:col-span-5">
            {aegis && (
              <Link
                to={`/product/${aegis.slug}`}
                className="group block overflow-hidden rounded-lg border border-white/10"
              >
                <div className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.03]">
                  <ProductArt product={aegis} className="h-full w-full" />
                </div>
                <div className="flex items-center justify-between border-t border-white/10 p-5">
                  <div>
                    <p className="font-label text-muted-foreground">Outerwear</p>
                    <p className="mt-1 text-sm font-medium">{aegis.name}</p>
                  </div>
                  <span className="font-label text-electric">Aegis 01</span>
                </div>
              </Link>
            )}
          </motion.div>

          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <p className="text-[15px] leading-7 text-muted-foreground">
                One idea carried the whole way: a single silhouette language,
                a controlled palette, hardware you can feel. FW26 pairs the
                Aegis shell system with the Orbit sole unit — storm proof and
                rail stable, from the same drawing board.
              </p>
              <NovaButton asChild variant="secondary" className="mt-8">
                <Link to="/collections">
                  Explore the collection
                  <ArrowRight className="size-4" />
                </Link>
              </NovaButton>
            </Reveal>
          </div>

          <motion.div style={{ y: reduce ? undefined : yB }} className="lg:col-span-4">
            {orbit && (
              <Link
                to={`/product/${orbit.slug}`}
                className="group block overflow-hidden rounded-lg border border-white/10"
              >
                <div className="aspect-square transition-transform duration-700 group-hover:scale-[1.03]">
                  <ProductArt product={orbit} className="h-full w-full" />
                </div>
                <div className="flex items-center justify-between border-t border-white/10 p-5">
                  <div>
                    <p className="font-label text-muted-foreground">Footwear</p>
                    <p className="mt-1 text-sm font-medium">{orbit.name}</p>
                  </div>
                  <span className="font-label text-magenta-neon">Orbit</span>
                </div>
              </Link>
            )}
          </motion.div>
        </div>

        {/* 3D showcase strip */}
        <Reveal delay={0.05} className="mt-16">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-nova-gradient">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 pt-5">
              <span className="font-label text-muted-foreground">Object study — 03</span>
              <span className="font-label text-muted-foreground">r3f · live</span>
            </div>
            <Suspense fallback={<div className="h-[380px]" />}>
              <ProductScene className="h-[380px] w-full" />
            </Suspense>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-6">
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                Every NOVA object begins as a solid. Light does the rest.
              </p>
              <span className="font-label hidden text-muted-foreground sm:block">360° study</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  05 — Showcase (horizontal scroll)                                  */
/* ------------------------------------------------------------------ */

function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Track width drives the travel distance so the row never overshoots on small screens.
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(2200);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackWidth(el.scrollWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const x = useTransform(scrollYProgress, [0, 1], ["2%", `calc(-${trackWidth}px + 92vw)`]);

  const items = PRODUCTS.filter((p) => ["orbit-runner-sneakers", "core-indicator-watch", "pulse-ancillary-speaker", "aegis-01-shell-jacket", "halo-ancillary-pack", "monolith-ceramic-mug"].includes(p.slug));

  if (reduce) {
    return (
      <Section className="border-t border-white/5 bg-carbon">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Eyebrow index="05" label="Showcase" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="border-t border-white/5 bg-carbon">
      <div ref={ref} className="relative h-[300vh]">
        {/* Sticky viewport */}
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Eyebrow index="05" label="Showcase" />
            <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              In motion.
            </h2>
          </div>
          <motion.div style={{ x }} ref={trackRef} className="mt-12 flex w-max gap-5 pl-6">
            {items.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="group w-[320px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-card transition-colors hover:border-electric/40 sm:w-[380px]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]">
                    <ProductArt product={p} className="h-full w-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-label text-muted-foreground">
                      {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{p.name}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-electric" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  06 — THE FUTURE IS NOW                                             */
/* ------------------------------------------------------------------ */

function FutureBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0.2, 0.6], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);

  return (
    <Section className="border-t border-white/5">
      <div ref={ref} className="bg-nova-aurora relative overflow-hidden">
        <div className="grain absolute inset-0" />
        <motion.div
          style={{ scale, opacity }}
          className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-32 text-center md:py-44"
        >
          <Eyebrow label="FW26 — Now shipping" tone="onDark" />
          <h2 className="mt-8 text-[13vw] leading-[0.95] font-bold tracking-[-0.03em] sm:text-8xl lg:text-9xl">
            THE FUTURE
            <br />
            <span className="text-nova-gradient">IS NOW.</span>
          </h2>
          <p className="mt-8 max-w-md text-[15px] leading-7 text-muted-foreground">
            The full FW26 collection is available now. Members get first
            access to every release — and first refusal on the limited runs.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NovaButton asChild variant="primary" size="lg">
              <Link to="/shop?category=new">
                Shop new arrivals
                <ArrowRight className="size-4" />
              </Link>
            </NovaButton>
            <NovaButton asChild variant="onDark" size="lg">
              <Link to="/auth">Join NOVA</Link>
            </NovaButton>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  07 — About                                                         */
/* ------------------------------------------------------------------ */

const PRINCIPLES = [
  {
    n: "01",
    title: "Reduction is the discipline",
    body: "We remove until only the essential form is left. What remains is the product — nothing extra.",
  },
  {
    n: "02",
    title: "Materials over decoration",
    body: "Matte shells, engineered knits, machined hardware. We spend on the thing itself, not the story around it.",
  },
  {
    n: "03",
    title: "Built to be kept",
    body: "Every piece is designed to be repaired, re-proofed and worn for years. Fewer, better objects.",
  },
];

function About() {
  return (
    <Section id="about" className="border-t border-white/5 bg-background">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-12 md:py-32">
        <Reveal className="md:col-span-4">
          <Eyebrow index="06" label="About NOVA" />
          <h2 className="mt-7 text-4xl leading-[1.06] font-semibold tracking-tight sm:text-5xl">
            A small brand with a long attention span.
          </h2>
          <NovaButton asChild variant="secondary" className="mt-8">
            <Link to="/about">
              Read the full story
              <ArrowRight className="size-4" />
            </Link>
          </NovaButton>
        </Reveal>
        <div className="md:col-span-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.06}>
              <div className="group flex gap-8 border-t border-white/10 py-8 last:border-b">
                <span className="font-label pt-1.5 text-muted-foreground">{p.n}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-electric">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter                                                         */
/* ------------------------------------------------------------------ */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <Section className="border-t border-white/5 bg-carbon">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-medium tracking-tight">Get first access.</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Release calendars, early access and field notes. One email a
            month — never more.
          </p>
        </div>
        {done ? (
          <p className="font-label text-electric">You're on the list.</p>
        ) : (
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-label="Email address"
              className="h-11 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-electric/60"
            />
            <NovaButton type="submit">Subscribe</NovaButton>
          </form>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Landing() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <FeaturedProducts />
      <Categories />
      <FeaturedCollection />
      <Showcase />
      <FutureBanner />
      <About />
      <Newsletter />
    </main>
  );
}
