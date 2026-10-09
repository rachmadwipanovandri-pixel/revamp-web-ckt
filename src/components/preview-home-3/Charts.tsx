import { cn } from "@/lib/utils";

/**
 * Authored data graphics.
 *
 * These are drawn, not photographed, and that is the point. The old draft
 * carried four decorative landscape SVGs (a ridge, a valley, a dawn, a still
 * life) which said nothing about the product and gave the page a soft,
 * illustrative mood the software does not have. Replacing them with real
 * information — a volume trend, a resolution rate, a channel mix — makes the
 * page denser and more credible at the same time, and keeps the US B2B register
 * intact.
 *
 * Everything here is SVG on a fixed viewBox, so it is sharp at any density,
 * needs no network request, and can switch language with the page.
 *
 * The one rule they all follow: no number is invented. Every value is either
 * supplied by the content object or is a shape with no scale implied. A chart
 * that quietly makes up data is worse than no chart.
 */

/**
 * A sparkline with a soft fill under the line.
 *
 * `points` are 0–100 and are rescaled to the box, so callers pass raw series
 * without worrying about the range. `highlight` marks the most recent point,
 * because on a product page the newest number is the one being read.
 */
export function Sparkline({
  points,
  className,
  height = 34,
  tone = "accent",
  label,
}: {
  points: number[];
  className?: string;
  height?: number;
  tone?: "accent" | "on-console";
  label?: string;
}) {
  if (points.length < 2) return null;

  const stroke = tone === "accent" ? "#1352bf" : "#8fb0ec";
  const fill = tone === "accent" ? "#1352bf" : "#ffffff";

  const w = 100;
  const h = 40;
  const max = Math.max(...points);
  const min = Math.min(...points);
  // A flat series would divide by zero; centre it instead of drawing a spike.
  const span = max - min || 1;

  const xy = points.map((value, index) => {
    const x = (index / (points.length - 1)) * w;
    const y = h - 4 - ((value - min) / span) * (h - 10);
    return [x, y] as const;
  });

  const line = xy
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const [lastX, lastY] = xy[xy.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      height={height}
      preserveAspectRatio="none"
      className={cn("w-full overflow-visible", className)}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={area} fill={fill} opacity="0.08" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="2" fill={stroke} />
    </svg>
  );
}

/**
 * A ring gauge for a percentage.
 *
 * Drawn as a circle with a dash gap rather than a filled wedge, so the track and
 * the value share one stroke weight — at these sizes a solid pie chart reads as
 * a blob, while a thin ring reads as an instrument.
 */
export function RingGauge({
  value,
  size = 84,
  tone = "light",
  children,
  label,
}: {
  /** 0–100. Clamped, because a gauge above full is a lie. */
  value: number;
  size?: number;
  tone?: "light" | "accent";
  children?: React.ReactNode;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const track = tone === "accent" ? "#dbe5f8" : "#26262c";
  const fill = tone === "accent" ? "#1352bf" : "#ffffff";

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role={label ? "img" : "presentation"}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (clamped / 100) * c}
        />
      </svg>
      {children ? (
        <span className="absolute inset-0 grid place-items-center">{children}</span>
      ) : null}
    </div>
  );
}

/**
 * A horizontal bar row — the workhorse of the security and comparison bands.
 *
 * `fill` is a fraction 0–1 and is clamped, because a bar that overflows its
 * track reads as a rendering bug rather than as emphasis.
 */
export function BarMeter({
  value,
  tone = "accent",
  className,
}: {
  /** 0–1. */
  value: number;
  tone?: "accent" | "muted" | "on-console";
  className?: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));
  const fill = {
    accent: "bg-[var(--ph3-accent)]",
    muted: "bg-[var(--ph3-line-2)]",
    "on-console": "bg-[#8fb0ec]",
  }[tone];

  return (
    <span
      className={cn(
        "block h-[3px] w-full overflow-hidden rounded-full",
        tone === "on-console" ? "bg-[#26262c]" : "bg-[var(--ph3-surface-2)]",
        className,
      )}
    >
      <span
        className={cn("block h-full rounded-full", fill)}
        style={{ width: `${clamped * 100}%` }}
      />
    </span>
  );
}

/**
 * A stacked channel-mix bar.
 *
 * One row, proportional segments, hairline separators between them. Used to show
 * where conversations come from without giving each channel its own row — which
 * is what made the old channel list feel like a settings screen.
 */
export function StackBar({
  segments,
  className,
}: {
  /** Label + fraction 0–1. Fractions are normalised, so they need not sum to 1. */
  segments: { label: string; value: number; tone: "accent" | "ink" | "line" }[];
  className?: string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const fill = {
    accent: "bg-[var(--ph3-accent)]",
    ink: "bg-[var(--ph3-ink)]",
    line: "bg-[var(--ph3-line-2)]",
  };

  return (
    <div className={cn("flex h-2 w-full gap-px overflow-hidden rounded-full", className)}>
      {segments.map((segment) => (
        <span
          key={segment.label}
          className={cn("h-full first:rounded-l-full last:rounded-r-full", fill[segment.tone])}
          style={{ width: `${(segment.value / total) * 100}%` }}
        />
      ))}
    </div>
  );
}