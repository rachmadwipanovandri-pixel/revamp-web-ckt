import { cn } from "@/lib/utils";

const NODES = [
  { id: "frontline", label: "Frontline", x: 260, y: 52 },
  { id: "mini", label: "Mini Agent", x: 430, y: 118 },
  { id: "oms", label: "OMS", x: 430, y: 248 },
  { id: "crm", label: "CRM", x: 260, y: 314 },
  { id: "marketing", label: "Marketing", x: 90, y: 248 },
  { id: "consulting", label: "Consulting", x: 90, y: 118 },
] as const;

/**
 * Six-node ecosystem map for the homepage hero — pure SVG blueprint of the
 * agentic stack around a Cekat core. Wireframe strokes keep it legible on
 * the void gradient.
 */
export function EcosystemHub({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <linearGradient id="hubCore" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1352bf" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <filter id="hubSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <ellipse cx="260" cy="182" rx="150" ry="120" fill="url(#hubGlow)" filter="url(#hubSoft)" />

      {/* Spokes from core to each product node */}
      {NODES.map((node) => (
        <path
          key={`line-${node.id}`}
          d={`M260 183 L${node.x} ${node.y}`}
          stroke="#93c5fd"
          strokeOpacity="0.35"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
      ))}

      {/* Core */}
      <g className="animate-float-soft">
        <circle cx="260" cy="183" r="46" fill="url(#hubCore)" stroke="#bfdbfe" strokeOpacity="0.7" strokeWidth="1.4" />
        <circle cx="260" cy="183" r="34" fill="none" stroke="#93c5fd" strokeOpacity="0.35" strokeDasharray="3 5" />
        <text
          x="260"
          y="179"
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="11"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.14em"
        >
          CEKAT
        </text>
        <text
          x="260"
          y="194"
          textAnchor="middle"
          fill="#bfdbfe"
          fontSize="9"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="600"
          letterSpacing="0.18em"
        >
          CORE
        </text>
      </g>

      {/* Product nodes */}
      {NODES.map((node, i) => (
        <g key={node.id} className="animate-float-slower" style={{ animationDelay: `${-i * 0.7}s` }}>
          <rect
            x={node.x - 58}
            y={node.y - 18}
            width={116}
            height={36}
            rx={18}
            fill="#0b1f4a"
            fillOpacity="0.85"
            stroke="#93c5fd"
            strokeOpacity="0.55"
            strokeWidth="1.1"
          />
          <circle cx={node.x - 42} cy={node.y} r="4" fill="#38bdf8" fillOpacity="0.9" />
          <text
            x={node.x + 8}
            y={node.y + 4}
            textAnchor="middle"
            fill="#e0f2fe"
            fontSize="11"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Outer ring hint */}
      <ellipse
        cx="260"
        cy="183"
        rx="200"
        ry="148"
        stroke="#38bdf8"
        strokeOpacity="0.12"
        strokeDasharray="2 8"
      />
    </svg>
  );
}
