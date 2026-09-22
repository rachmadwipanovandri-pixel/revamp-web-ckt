import { cn } from "@/lib/utils";

/**
 * Wireframe isometric plates for the /new-2 hero — pure SVG, no raster.
 * Three stacked layers (inbox → agent → revenue) with open stroke weight so
 * the diagram reads as a technical blueprint over the blue gradient.
 */
export function IsometricStack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <linearGradient id="isoFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="isoFaceTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="isoGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
        <filter id="isoSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Ambient glow under the stack */}
      <ellipse cx="260" cy="340" rx="160" ry="36" fill="url(#isoGlow)" filter="url(#isoSoft)" />

      {/* Connecting spine */}
      <path
        d="M260 118 V 300"
        stroke="#93c5fd"
        strokeOpacity="0.35"
        strokeDasharray="4 6"
      />

      {/* Layer 3 — Revenue (bottom) */}
      <g className="animate-float-slower" style={{ animationDelay: "-2s" }}>
        <path
          d="M260 278 L400 332 L260 386 L120 332 Z"
          fill="url(#isoFace)"
          stroke="#93c5fd"
          strokeOpacity="0.55"
          strokeWidth="1.25"
        />
        <path
          d="M120 332 V 348 L260 402 V 386 Z"
          fill="#0c2a6b"
          fillOpacity="0.45"
          stroke="#60a5fa"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <path
          d="M400 332 V 348 L260 402 V 386 Z"
          fill="#081f52"
          fillOpacity="0.5"
          stroke="#60a5fa"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <text
          x="260"
          y="340"
          textAnchor="middle"
          fill="#dbeafe"
          fillOpacity="0.9"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.16em"
        >
          REVENUE
        </text>
      </g>

      {/* Layer 2 — Agent (middle) */}
      <g className="animate-float-soft" style={{ animationDelay: "-4s" }}>
        <path
          d="M260 188 L400 242 L260 296 L120 242 Z"
          fill="url(#isoFaceTop)"
          stroke="#bfdbfe"
          strokeOpacity="0.65"
          strokeWidth="1.25"
        />
        <path
          d="M120 242 V 258 L260 312 V 296 Z"
          fill="#0c2a6b"
          fillOpacity="0.55"
          stroke="#60a5fa"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <path
          d="M400 242 V 258 L260 312 V 296 Z"
          fill="#081f52"
          fillOpacity="0.6"
          stroke="#60a5fa"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Mini nodes on the agent plane */}
        <circle cx="230" cy="238" r="4" fill="#93c5fd" fillOpacity="0.9" />
        <circle cx="260" cy="250" r="4" fill="#60a5fa" fillOpacity="0.9" />
        <circle cx="290" cy="238" r="4" fill="#93c5fd" fillOpacity="0.9" />
        <path
          d="M230 238 L260 250 L290 238"
          stroke="#93c5fd"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <text
          x="260"
          y="272"
          textAnchor="middle"
          fill="#eff6ff"
          fillOpacity="0.95"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.16em"
        >
          AI AGENT
        </text>
      </g>

      {/* Layer 1 — Inbox (top) */}
      <g className="animate-float-soft">
        <path
          d="M260 98 L400 152 L260 206 L120 152 Z"
          fill="url(#isoFaceTop)"
          stroke="#e0f2fe"
          strokeOpacity="0.75"
          strokeWidth="1.35"
        />
        <path
          d="M120 152 V 168 L260 222 V 206 Z"
          fill="#0c2a6b"
          fillOpacity="0.6"
          stroke="#60a5fa"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <path
          d="M400 152 V 168 L260 222 V 206 Z"
          fill="#081f52"
          fillOpacity="0.65"
          stroke="#60a5fa"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        {/* Chat bubbles on the inbox plane */}
        <rect x="214" y="140" width="36" height="14" rx="4" fill="#dbeafe" fillOpacity="0.35" stroke="#93c5fd" strokeOpacity="0.6" />
        <rect x="258" y="152" width="36" height="14" rx="4" fill="#bfdbfe" fillOpacity="0.25" stroke="#93c5fd" strokeOpacity="0.5" />
        <text
          x="260"
          y="182"
          textAnchor="middle"
          fill="#f8fafc"
          fillOpacity="0.95"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.16em"
        >
          INBOX
        </text>
      </g>

      {/* Side callouts */}
      <g opacity="0.7">
        <path d="M400 152 H 470" stroke="#93c5fd" strokeOpacity="0.4" strokeDasharray="3 4" />
        <text x="476" y="156" fill="#bfdbfe" fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="0.12em">
          24/7
        </text>
        <path d="M120 242 H 50" stroke="#93c5fd" strokeOpacity="0.4" strokeDasharray="3 4" />
        <text x="18" y="246" fill="#bfdbfe" fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif" letterSpacing="0.12em">
          CRM
        </text>
      </g>
    </svg>
  );
}

/**
 * Four small line-isometrics for the pillar grid — each a distinct topology
 * (stack / path / funnel / orbit) so the row reads as a system, not four icons.
 */
export function PillarGlyph({ kind }: { kind: "stack" | "path" | "funnel" | "orbit" }) {
  const stroke = "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 160 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-auto w-full text-primary/70"
    >
      {kind === "stack" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(0 ${i * 14})`}>
              <path d="M80 28 L124 46 L80 64 L36 46 Z" {...common} opacity={0.45 + i * 0.15} />
            </g>
          ))}
          <circle cx="80" cy="46" r="8" fill="currentColor" fillOpacity="0.15" stroke={stroke} strokeWidth="1.4" />
        </g>
      )}
      {kind === "path" && (
        <g>
          <path d="M30 80 L60 50 L90 70 L130 30" {...common} strokeDasharray="4 5" />
          <rect x="22" y="72" width="22" height="16" rx="4" {...common} />
          <rect x="50" y="40" width="22" height="16" rx="4" {...common} opacity="0.85" />
          <rect x="80" y="60" width="22" height="16" rx="4" {...common} opacity="0.7" />
          <rect x="118" y="22" width="22" height="16" rx="4" {...common} opacity="0.95" />
        </g>
      )}
      {kind === "funnel" && (
        <g>
          <path d="M28 30 H132 L96 68 V92 H64 V68 Z" {...common} />
          <path d="M50 48 H110" {...common} opacity="0.45" />
          <path d="M62 60 H98" {...common} opacity="0.35" />
          <circle cx="80" cy="100" r="6" fill="currentColor" fillOpacity="0.2" stroke={stroke} strokeWidth="1.4" />
        </g>
      )}
      {kind === "orbit" && (
        <g>
          <ellipse cx="80" cy="60" rx="52" ry="22" {...common} opacity="0.55" />
          <ellipse cx="80" cy="60" rx="52" ry="22" {...common} opacity="0.35" transform="rotate(60 80 60)" />
          <ellipse cx="80" cy="60" rx="52" ry="22" {...common} opacity="0.35" transform="rotate(-60 80 60)" />
          <circle cx="80" cy="60" r="12" fill="currentColor" fillOpacity="0.12" stroke={stroke} strokeWidth="1.5" />
          <circle cx="132" cy="60" r="4" fill="currentColor" />
          <circle cx="54" cy="28" r="4" fill="currentColor" opacity="0.7" />
          <circle cx="54" cy="92" r="4" fill="currentColor" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
