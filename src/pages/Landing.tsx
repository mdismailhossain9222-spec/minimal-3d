import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import MonolithScene from "@/components/three/MonolithScene";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- */
/*  Small shared bits                                                */
/* ---------------------------------------------------------------- */

function Eyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="font-label">{index}</span>
      <span className="h-px w-8 bg-border" />
      <span className="font-label">{label}</span>
    </div>
  );
}

/** Fade-up reveal, once, on scroll. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Sections                                                         */
/* ---------------------------------------------------------------- */

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <Asterisk className="size-4" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-[0.18em]">MONO/LITH</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {["Work", "Studio", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center border border-foreground bg-foreground px-5 text-[13px] font-medium tracking-wide text-primary-foreground transition-colors hover:bg-foreground/85"
          >
            Enter studio
          </Link>
          <a href="#work" className="text-sm underline-offset-4 hover:underline md:hidden">
            Work
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        el.children,
        { opacity: 0, y: 44 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, delay: 0.25 },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-[100svh] flex-col">
      {/* WebGL layer */}
      <div className="absolute inset-0 z-0">
        <MonolithScene />
      </div>
      {/* Hairline frame over the canvas */}
      <div className="pointer-events-none absolute inset-x-6 inset-y-6 z-10 hidden border md:block" />
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        {/* Copy block — left aligned, canvas breathes to the right */}
        <div className="flex flex-1 flex-col justify-end pb-24 pt-40 md:pb-32">
          <div ref={titleRef} className="max-w-xl">
            <Eyebrow index="01" label="WebGL Studio" />
            <h1 className="mt-8 font-display text-6xl leading-[1.02] font-light tracking-tight sm:text-7xl lg:text-8xl">
              Form,<br />
              held in<br />
              <span className="italic">stillness.</span>
            </h1>
            <p className="mt-8 max-w-md text-[15px] leading-7 text-muted-foreground">
              We build immersive 3D for the web — quiet geometry, exacting
              light, and interactions that get out of the way. Nothing extra.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex h-11 items-center gap-2 border border-foreground bg-foreground px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/85"
              >
                Begin a project
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#work"
                className="inline-flex h-11 items-center border-b border-transparent px-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                View work
              </a>
            </div>
          </div>
        </div>
        {/* Bottom hairline strip */}
        <div className="flex items-center justify-between border-t border-border/70 py-5">
          <span className="font-label text-muted-foreground">Scroll</span>
          <ArrowDown className="size-4 animate-bounce text-muted-foreground" strokeWidth={1.5} />
          <span className="font-label text-muted-foreground">001 / 006</span>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="studio" className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-28 md:grid-cols-12 md:py-36">
        <Reveal className="md:col-span-4">
          <Eyebrow index="02" label="The Studio" />
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.1}>
          <h2 className="font-display text-4xl leading-[1.12] font-light tracking-tight sm:text-5xl">
            Reduction is the discipline. What remains is the work.
          </h2>
          <p className="mt-8 max-w-lg text-[15px] leading-7 text-muted-foreground">
            MONO/LITH is a small studio for real-time 3D on the web. We remove
            until only the essential form is left — then light it precisely.
            The result is immersive, but it never shouts.
          </p>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground">
            Every engagement begins with subtraction: fewer objects, fewer
            colors, one idea carried the whole way.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const CRAFT = [
  {
    n: "01",
    title: "Real-time 3D",
    body: "WebGL scenes engineered in React Three Fiber — sixty frames, no theatrics.",
  },
  {
    n: "02",
    title: "Motion direction",
    body: "GSAP-choreographed reveals and scroll sequences with restraint as the default.",
  },
  {
    n: "03",
    title: "Design systems",
    body: "Type, spacing and tone held to a near-monochrome grid. Precision over decoration.",
  },
];

function Craft() {
  return (
    <section className="border-t border-border bg-mist/40">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <Reveal>
          <Eyebrow index="03" label="Practice" />
          <h2 className="mt-8 max-w-xl font-display text-4xl leading-[1.12] font-light tracking-tight sm:text-5xl">
            Three disciplines, one grid.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">
          {CRAFT.map((item, i) => (
            <Reveal key={item.n} delay={i * 0.08}>
              <div className="group h-full bg-background p-8 transition-colors duration-300 hover:bg-card">
                <span className="font-label text-muted-foreground">{item.n}</span>
                <h3 className="mt-10 text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                <div className="mt-10 h-px w-8 bg-foreground/25 transition-all duration-500 group-hover:w-16" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const WORKS = [
  { n: "001", title: "Vessel", meta: "Product configurator — 2025", tone: "Linear" },
  { n: "002", title: "Aperture", meta: "Gallery archive — 2025", tone: "Grain" },
  { n: "003", title: "Column", meta: "Editorial WebGL — 2024", tone: "Grid" },
  { n: "004", title: "Quiet Orbit", meta: "Brand experience — 2024", tone: "Field" },
];

function Work() {
  return (
    <section id="work" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <Reveal>
          <Eyebrow index="04" label="Selected Work" />
        </Reveal>
        <div className="mt-14 border-t border-border">
          {WORKS.map((w, i) => (
            <Reveal key={w.n} delay={i * 0.06}>
              <a
                href="#work"
                className="group flex items-baseline justify-between gap-6 border-b border-border py-7 transition-colors hover:bg-card/60"
              >
                <div className="flex items-baseline gap-8">
                  <span className="font-label text-muted-foreground">{w.n}</span>
                  <span className="font-display text-3xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                    {w.title}
                  </span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="hidden text-sm text-muted-foreground sm:block">{w.meta}</span>
                  <span className="font-label hidden text-muted-foreground md:block">{w.tone}</span>
                  <ArrowUpRight
                    className="size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section id="contact" className="border-t border-foreground bg-foreground text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-12 px-6 py-28 md:py-36">
        <Reveal className="w-full">
          <div className="flex items-center gap-3 text-primary-foreground/60">
            <span className="font-label">05</span>
            <span className="h-px w-8 bg-primary-foreground/30" />
            <span className="font-label">Contact</span>
          </div>
          <h2 className="mt-10 font-display text-5xl leading-[1.05] font-light tracking-tight sm:text-6xl lg:text-7xl">
            Say less.
            <br />
            <span className="italic text-primary-foreground/80">Show more.</span>
          </h2>
          <p className="mt-8 max-w-md text-[15px] leading-7 text-primary-foreground/70">
            We take on a small number of engagements each season. Tell us what
            you're building — we'll answer with a plan.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="group inline-flex h-11 items-center gap-2 border border-primary-foreground bg-primary-foreground px-6 text-sm font-medium text-foreground transition-colors hover:bg-primary-foreground/85"
            >
              Open the studio
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="mailto:studio@monolith.design"
              className="inline-flex h-11 items-center border-b border-primary-foreground/30 px-1 text-sm text-primary-foreground/80 transition-colors hover:border-primary-foreground hover:text-primary-foreground"
            >
              studio@monolith.design
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <Asterisk className="size-4" strokeWidth={1.5} />
              <span className="text-sm font-medium tracking-[0.18em]">MONO/LITH</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Minimal 3D for the web. Built with React Three Fiber &amp; GSAP.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-label text-muted-foreground">Studio</span>
              <a href="#studio" className="text-muted-foreground transition-colors hover:text-foreground">About</a>
              <a href="#work" className="text-muted-foreground transition-colors hover:text-foreground">Work</a>
              <a href="#contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-label text-muted-foreground">Elsewhere</span>
              <a href="#work" className="text-muted-foreground transition-colors hover:text-foreground">Dribbble</a>
              <a href="#work" className="text-muted-foreground transition-colors hover:text-foreground">Instagram</a>
              <a href="#work" className="text-muted-foreground transition-colors hover:text-foreground">X</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 MONO/LITH Studio. All rights reserved.</span>
          <span className="font-label">Light, geometry, silence.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- */
/*  Page                                                             */
/* ---------------------------------------------------------------- */

export default function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Manifesto />
      <Craft />
      <Work />
      <Cta />
      <Footer />
    </main>
  );
}
