import { Star } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * NOVA button — tall, precise, quiet. Primary uses the electric-blue core;
 * secondary is a hairline outline. `asChild` renders the child element.
 */
export const novaButtonVariants = cva(
  "group/nbtn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-electric text-[#0B0B10] shadow-[0_0_24px_-6px_var(--electric)] hover:shadow-[0_0_34px_-4px_var(--electric)] hover:brightness-110",
        secondary:
          "border border-border bg-transparent text-foreground hover:border-electric/60 hover:bg-electric/5",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        onDark:
          "border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function NovaButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof novaButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(novaButtonVariants({ variant, size, className }))} {...props} />
  );
}

/** Section eyebrow: mono index + hairline + label. */
export function Eyebrow({
  index,
  label,
  tone = "default",
  className,
}: {
  index?: string;
  label: string;
  tone?: "default" | "onDark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        tone === "onDark" ? "text-white/60" : "text-muted-foreground",
        className,
      )}
    >
      {index && <span className="font-label">{index}</span>}
      <span className={cn("h-px w-8", tone === "onDark" ? "bg-white/30" : "bg-border")} />
      <span className="font-label">{label}</span>
    </div>
  );
}

/** Star rating with count. */
export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3",
              i < Math.round(value) ? "fill-electric text-electric" : "text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      <span className="tabular-nums">{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-muted-foreground/60">({count})</span>}
    </div>
  );
}

/** Consistent vertical rhythm for page sections. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}
