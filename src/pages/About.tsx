import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Eyebrow, NovaButton } from "@/components/store/primitives";

const STATS = [
  { value: "12", label: "Objects in the collection" },
  { value: "04", label: "Standing product lines" },
  { value: "92%", label: "Recycled or renewable materials" },
  { value: "10yr", label: "Repair guarantee on hardware" },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Reduction is the discipline",
    body: "Every NOVA object begins as a list of everything it could be. We cross out until only the essential form is left — then we build exactly that. If a feature can't justify its presence, it doesn't ship.",
  },
  {
    n: "02",
    title: "Materials over decoration",
    body: "Matte shells, engineered knits, machined titanium, basalt glaze. We spend the budget on the object itself — how it feels in the hand at 2 a.m., not how it photographs in a launch post.",
  },
  {
    n: "03",
    title: "Built to be kept",
    body: "Everything we sell is designed to be repaired, re-proofed or recharged rather than replaced. Fewer, better objects — bought once, kept for a decade, passed on with the story intact.",
  },
  {
    n: "04",
    title: "Quiet by default",
    body: "No logos shouting across the chest, no lights unless light is the function. The brand mark is one small vector line. People should recognise the object, not just the label.",
  },
];

export default function About() {
  return (
    <main className="bg-background">
      <div className="bg-nova-aurora relative overflow-hidden border-b border-white/5">
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
          <Eyebrow label="About NOVA" />
          <h1 className="mt-8 max-w-3xl text-5xl leading-[1.04] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            A small brand with a{" "}
            <span className="text-nova-gradient">long attention span.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted-foreground">
            NOVA was founded on a simple discomfort: most products are designed
            to be replaced. We make the opposite — a small collection of
            engineered lifestyle goods, held to one visual language, released
            only when they're ready.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-white/5 bg-carbon">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-10">
              <p className="text-4xl font-semibold tracking-tight text-electric">{s.value}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Eyebrow label="How we work" />
        <div className="mt-12 border-t border-white/10">
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="group grid gap-4 border-b border-white/10 py-10 md:grid-cols-12">
              <span className="font-label pt-1.5 text-muted-foreground md:col-span-1">{p.n}</span>
              <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-electric md:col-span-4">
                {p.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:col-span-7">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/5 bg-carbon">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Wear the system.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              The FW26 collection is shipping now. Members get first access to
              everything that follows.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NovaButton asChild>
              <Link to="/shop">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </NovaButton>
            <NovaButton asChild variant="secondary">
              <Link to="/auth">Join NOVA</Link>
            </NovaButton>
          </div>
        </div>
      </div>
    </main>
  );
}
