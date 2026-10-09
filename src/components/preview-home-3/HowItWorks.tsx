import { Section, SectionHead, Shell } from "./ui";
import type { Copy3 } from "./content";

const BOX = "#ffffff";
const STROKE = "#d3d3d9";
const WIRE = "#b9b9c1";
const LABEL = "#55555d";
const SIGNAL = "#1352bf";
const CONSOLE = "#0a0a0b";

/**
 * How it works — three steps, three diagrams.
 *
 * The diagrams are the same idea as before (channels into an inbox, documents
 * into an answer, a chat becoming an order) redrawn on the new system: square
 * corners instead of 13px pills, a 1px hairline instead of a soft blue wash, and
 * the signal colour reserved for the one node that is actually doing the work.
 * They are code-drawn SVGs, so they stay sharp at any density and add no
 * requests — which matters when the page already ships a logo row and a window
 * mock above this point.
 */
export function HowItWorks({ copy }: { copy: Copy3["how"] }) {
  return (
    <Section
      id="how-it-works"
      rule
      labelledBy="ph3-how-title"
      className="scroll-mt-24"
    >
      <Shell>
        <SectionHead
          id="ph3-how-title"
          index="02"
          eyebrow={copy.eyebrow}
          title={copy.heading}
          body={copy.body}
        />

        <ol className="ph3-steps mt-12 list-none border-t border-[var(--ph3-line)] sm:mt-16">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="ph3-row" data-ph3-enter>
              <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
                <div>
                  <p className="ph3-mono text-[0.625rem] text-[var(--ph3-accent)]">
                    {step.index}
                  </p>
                  <h3 className="ph3-display mt-3 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.12]">
                    {step.title}
                  </h3>
                  <p className="ph3-lede mt-3 max-w-[30rem] text-[0.9375rem]">
                    {step.body}
                  </p>
                </div>

                <StepDiagram index={index} />
              </div>
            </li>
          ))}
        </ol>
      </Shell>
    </Section>
  );
}

function StepDiagram({ index }: { index: number }) {
  return (
    <div className="ph3-step-visual overflow-hidden">
      <svg
        viewBox="0 0 340 168"
        className="h-auto w-full"
        fill="none"
        aria-hidden
      >
        {index === 0 ? <ChannelsDiagram /> : null}
        {index === 1 ? <KnowledgeDiagram /> : null}
        {index === 2 ? <OrderDiagram /> : null}
      </svg>
    </div>
  );
}

function ChannelsDiagram() {
  const sources = [
    { y: 32, label: "WhatsApp" },
    { y: 66, label: "Instagram" },
    { y: 100, label: "TikTok" },
    { y: 134, label: "Web chat" },
  ];
  return (
    <>
      {sources.map((source) => (
        <g key={source.label}>
          <rect
            x="0"
            y={source.y - 12}
            width="96"
            height="24"
            rx="4"
            fill={BOX}
            stroke={STROKE}
          />
          <text
            x="48"
            y={source.y + 4}
            textAnchor="middle"
            fontSize="10.5"
            fill={LABEL}
            fontFamily="ui-monospace, Menlo, monospace"
          >
            {source.label}
          </text>
          <path
            d={`M100 ${source.y} H 176 V 84`}
            stroke={WIRE}
            strokeWidth="1"
            className="ph3-draw"
            style={{ ["--len" as string]: 140 }}
          />
        </g>
      ))}
      <rect
        x="176"
        y="60"
        width="120"
        height="48"
        rx="6"
        fill={CONSOLE}
      />
      <text
        x="236"
        y="80"
        textAnchor="middle"
        fontSize="10.5"
        fill="#ffffff"
        fontWeight="600"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        1 inbox
      </text>
      <text
        x="236"
        y="95"
        textAnchor="middle"
        fontSize="9"
        fill="#a8a8b2"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        4 channels
      </text>
      <path
        d="M296 84 H 320"
        stroke={SIGNAL}
        strokeWidth="1.5"
        className="ph3-draw"
        style={{ ["--len" as string]: 24 }}
      />
    </>
  );
}

function KnowledgeDiagram() {
  const docs = ["Harga", "Stok", "Aturan"];
  return (
    <>
      {docs.map((doc, index) => (
        <g key={doc}>
          <rect
            x="0"
            y={26 + index * 42}
            width="88"
            height="28"
            rx="4"
            fill={BOX}
            stroke={STROKE}
          />
          <text
            x="44"
            y={44 + index * 42}
            textAnchor="middle"
            fontSize="10.5"
            fill={LABEL}
            fontFamily="ui-monospace, Menlo, monospace"
          >
            {doc}
          </text>
          <path
            d={`M92 ${40 + index * 42} H 148 V 84`}
            stroke={WIRE}
            strokeWidth="1"
            className="ph3-draw"
            style={{ ["--len" as string]: 80 }}
          />
        </g>
      ))}
      <rect x="148" y="60" width="48" height="48" rx="6" fill={SIGNAL} />
      <text
        x="172"
        y="89"
        textAnchor="middle"
        fontSize="10"
        fill="#ffffff"
        fontWeight="600"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        AI
      </text>
      <path
        d="M200 84 H 236"
        stroke={SIGNAL}
        strokeWidth="1.5"
        className="ph3-draw"
        style={{ ["--len" as string]: 36 }}
      />
      <rect x="236" y="60" width="104" height="48" rx="6" fill={BOX} stroke={STROKE} />
      <text
        x="288"
        y="80"
        textAnchor="middle"
        fontSize="10.5"
        fill={LABEL}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        Jawaban
      </text>
      <text
        x="288"
        y="95"
        textAnchor="middle"
        fontSize="9"
        fill={WIRE}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        terverifikasi
      </text>
    </>
  );
}

function OrderDiagram() {
  const nodes = ["Chat", "Ongkir", "Bayar", "Order"];
  return (
    <>
      {nodes.map((node, index) => {
        const x = 0 + index * 86;
        const last = index === nodes.length - 1;
        return (
          <g key={node}>
            <rect
              x={x}
              y="56"
              width="70"
              height="44"
              rx="5"
              fill={last ? SIGNAL : BOX}
              stroke={last ? SIGNAL : STROKE}
            />
            <text
              x={x + 35}
              y="82"
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="ui-monospace, Menlo, monospace"
              fill={last ? "#ffffff" : LABEL}
            >
              {node}
            </text>
            {index < nodes.length - 1 ? (
              <path
                d={`M${x + 74} 78 H ${x + 82}`}
                stroke={SIGNAL}
                strokeWidth="1.5"
                className="ph3-draw"
                style={{ ["--len" as string]: 8 }}
              />
            ) : null}
          </g>
        );
      })}
      <line
        x1="0"
        y1="126"
        x2="330"
        y2="126"
        stroke={STROKE}
        strokeWidth="1"
      />
      <text
        x="0"
        y="146"
        fontSize="9.5"
        fill={LABEL}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        status bayar + kirim tercatat
      </text>
    </>
  );
}