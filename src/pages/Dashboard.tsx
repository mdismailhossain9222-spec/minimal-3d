import MonolithScene from "@/components/three/MonolithScene";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowUpRight, Asterisk, LogOut, Plus, Boxes } from "lucide-react";
import { Link, useNavigate } from "react-router";

/* ---------------------------------------------------------------- */

const STATS = [
  { label: "Active commissions", value: "04" },
  { label: "Scenes shipped", value: "31" },
  { label: "Reels rendered", value: "128" },
  { label: "Uptime SLA", value: "99.98%" },
];

type Status = "In review" | "Rendering" | "Delivered";

const COMMISSIONS: {
  n: string;
  title: string;
  client: string;
  status: Status;
  due: string;
}[] = [
  { n: "027", title: "Column II", client: "Aster Editions", status: "In review", due: "Oct 02" },
  { n: "026", title: "Vessel Configurator", client: "Halden Objects", status: "Rendering", due: "Oct 11" },
  { n: "025", title: "Aperture Archive", client: "Galerie Nord", status: "Delivered", due: "Sep 20" },
  { n: "024", title: "Quiet Orbit", client: "Orbit Audio", status: "Delivered", due: "Sep 04" },
];

const STATUS_STYLES: Record<Status, string> = {
  "In review": "border-foreground/30 text-foreground",
  Rendering: "border-foreground/60 bg-foreground text-primary-foreground",
  Delivered: "border-border text-muted-foreground",
};

/* ---------------------------------------------------------------- */

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Asterisk className="size-4" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-[0.18em]">MONO/LITH</span>
            <span className="ml-2 hidden font-label text-muted-foreground sm:inline">
              Studio OS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-medium">{user?.name ?? "Guest"}</p>
              <p className="text-xs leading-tight text-muted-foreground">
                {user?.email ?? "anonymous session"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-none border-border bg-transparent hover:bg-muted hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Greeting */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="font-label">00</span>
              <span className="h-px w-8 bg-border" />
              <span className="font-label">Studio OS</span>
            </div>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-light tracking-tight sm:text-5xl">
              Welcome{user?.name ? `, ${user.name}` : " to the studio"}.
            </h1>
          </div>
          <Button
            type="button"
            className="h-11 rounded-none border border-foreground bg-foreground px-6 text-primary-foreground hover:bg-foreground/85"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            New commission
          </Button>
        </div>

        {/* Stat row */}
        <div className="mt-12 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-background p-6">
              <p className="font-label text-muted-foreground">{s.label}</p>
              <p className="mt-4 font-display text-3xl font-light tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Scene lab */}
        <section className="mt-16 grid gap-px border border-border bg-border lg:grid-cols-5">
          <div className="relative min-h-[360px] bg-card lg:col-span-3">
            <MonolithScene />
            <div className="pointer-events-none absolute top-5 left-5 font-label text-muted-foreground">
              Scene lab — live preview
            </div>
            <div className="pointer-events-none absolute right-5 bottom-5 font-label text-muted-foreground">
              r3f · 60fps
            </div>
          </div>
          <div className="bg-background p-8 lg:col-span-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Boxes className="size-4" strokeWidth={1.5} />
              <span className="font-label">Scene lab</span>
            </div>
            <h2 className="mt-6 font-display text-3xl font-light tracking-tight">
              One grid. Every scene.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Draft compositions on the studio grid, then hand them to
              engineering exactly as designed. Materials stay matte; light does
              the talking.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Matte monolith solids", "Paper-white fog", "Hairline edge marks"].map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0">
                  <span className="size-1 bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-8 h-10 rounded-none border-border bg-transparent hover:bg-muted hover:text-foreground"
            >
              Open scene lab
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </section>

        {/* Commissions */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-light tracking-tight">Commissions</h2>
            <span className="font-label text-muted-foreground">Q4 — 2026</span>
          </div>
          <div className="mt-6 border-t border-border">
            {COMMISSIONS.map((c) => (
              <div
                key={c.n}
                className="group grid grid-cols-2 items-center gap-4 border-b border-border py-5 transition-colors hover:bg-card/60 sm:grid-cols-12"
              >
                <span className="font-label text-muted-foreground sm:col-span-1">{c.n}</span>
                <span className="text-sm font-medium sm:col-span-4">{c.title}</span>
                <span className="text-sm text-muted-foreground sm:col-span-3">{c.client}</span>
                <span className="hidden text-sm text-muted-foreground sm:col-span-2 sm:block">
                  {c.due}
                </span>
                <span className="sm:col-span-2 sm:justify-self-end">
                  <span
                    className={`inline-flex items-center rounded-none border px-2.5 py-1 text-xs ${STATUS_STYLES[c.status]}`}
                  >
                    {c.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Four engagements this season. Two slots remain.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 MONO/LITH Studio — internal workspace</span>
          <Link to="/" className="underline-offset-4 hover:underline">
            Back to site
          </Link>
        </footer>
      </div>
    </main>
  );
}
