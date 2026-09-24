import { cn } from "@/lib/utils";

/**
 * Lightweight product UI mockups — CSS only, editable later when real
 * screenshots land. Used as the visual language for platform chapters.
 */

function Dot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("size-2 rounded-full", className)} />;
}

export function ChatInboxMock({ className }: { className?: string }) {
  const threads = [
    {
      name: "Ayu · WhatsApp",
      snippet: "Kak, ready size M warna sage?",
      time: "09:12",
      active: true,
      tag: "AI",
    },
    {
      name: "Raka · Instagram",
      snippet: "Boleh custom packaging?",
      time: "09:04",
      tag: "Lead",
    },
    {
      name: "Nisa · Live Chat",
      snippet: "Pengiriman ke Bandung berapa hari?",
      time: "08:51",
      tag: "AI",
    },
  ];

  return (
    <div className={cn("grid h-full min-h-[280px] grid-cols-[1.05fr_1.4fr]", className)}>
      <div className="border-r border-[#0C111D]/[0.06] bg-[#FAFBFC] p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#667085] uppercase">
            Inbox
          </p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-numeric text-[0.65rem] font-semibold text-primary">
            128
          </span>
        </div>
        <div className="space-y-2">
          {threads.map((t) => (
            <div
              key={t.name}
              className={cn(
                "rounded-xl border p-2.5",
                t.active
                  ? "border-primary/25 bg-white shadow-[0_8px_20px_-14px_rgba(19,82,191,0.35)]"
                  : "border-transparent bg-transparent",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-numeric text-[0.75rem] font-semibold text-[#0C111D]">
                  {t.name}
                </p>
                <span className="font-numeric text-[0.65rem] text-[#98A2B3]">{t.time}</span>
              </div>
              <p className="mt-1 truncate text-[0.72rem] text-[#667085]">{t.snippet}</p>
              <span className="mt-2 inline-flex rounded-md bg-[#F2F4F7] px-1.5 py-0.5 font-numeric text-[0.62rem] font-semibold tracking-[0.08em] text-[#667085] uppercase">
                {t.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between border-b border-[#0C111D]/[0.06] px-3.5 py-2.5">
          <div>
            <p className="font-numeric text-[0.78rem] font-semibold text-[#0C111D]">Ayu Prameswari</p>
            <p className="text-[0.68rem] text-[#667085]">WhatsApp · AI Frontline</p>
          </div>
          <span className="rounded-full bg-[#E8F1FF] px-2 py-0.5 font-numeric text-[0.65rem] font-semibold text-primary">
            Closing
          </span>
        </div>
        <div className="flex-1 space-y-2.5 p-3.5">
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#F2F4F7] px-3 py-2 text-[0.75rem] text-[#344054]">
            Kak, ready size M warna sage? Mau 2 pcs.
          </div>
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-3 py-2 text-[0.75rem] text-white">
            Ready kak Ayu. 2 pcs size M sage — total Rp 318.000. Mau saya buatkan order sekarang?
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#F2F4F7] px-3 py-2 text-[0.75rem] text-[#344054]">
            Iya kak, sekalian ongkir Jakarta.
          </div>
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-3 py-2 text-[0.75rem] text-white">
            Siap. Order #4821 dibuat · ongkir Rp 12.000 · link bayar dikirim.
          </div>
        </div>
        <div className="border-t border-[#0C111D]/[0.06] px-3.5 py-2.5">
          <div className="flex items-center gap-2 rounded-full border border-[#0C111D]/10 bg-[#FAFBFC] px-3 py-1.5">
            <Dot className="bg-primary/50" />
            <p className="font-numeric text-[0.7rem] text-[#98A2B3]">AI mengetik balasan…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrmBoardMock({ className }: { className?: string }) {
  const columns = [
    {
      title: "New lead",
      count: 18,
      cards: [
        { name: "Ayu Prameswari", value: "Rp 318k", tag: "WA" },
        { name: "Budi Santoso", value: "Rp 1,2jt", tag: "IG" },
      ],
    },
    {
      title: "Qualified",
      count: 11,
      cards: [
        { name: "Siti Rahma", value: "Rp 4,5jt", tag: "WA" },
        { name: "Andi Wijaya", value: "Rp 890k", tag: "Web" },
      ],
    },
    {
      title: "Negotiation",
      count: 6,
      cards: [{ name: "Maya Putri", value: "Rp 7,8jt", tag: "WA" }],
    },
    {
      title: "Won",
      count: 24,
      cards: [{ name: "Rumah Zakat", value: "Rp 22jt", tag: "WA" }],
    },
  ];

  return (
    <div className={cn("flex h-full min-h-[280px] gap-2.5 overflow-hidden bg-[#F6F7F9] p-3.5", className)}>
      {columns.map((col, i) => (
        <div
          key={col.title}
          className={cn(
            "flex min-w-0 flex-1 flex-col rounded-xl border border-[#0C111D]/[0.06] bg-white p-2.5",
            i === 3 && "hidden sm:flex",
          )}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.1em] text-[#667085] uppercase">
              {col.title}
            </p>
            <span className="font-numeric text-[0.68rem] tabular-nums text-[#98A2B3]">{col.count}</span>
          </div>
          <div className="space-y-2">
            {col.cards.map((card) => (
              <div
                key={card.name}
                className="rounded-lg border border-[#0C111D]/[0.06] bg-[#FAFBFC] p-2.5"
              >
                <p className="truncate font-numeric text-[0.75rem] font-semibold text-[#0C111D]">
                  {card.name}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-numeric text-[0.7rem] font-medium text-primary">{card.value}</span>
                  <span className="rounded bg-[#E8F1FF] px-1.5 py-0.5 font-numeric text-[0.62rem] font-semibold text-primary">
                    {card.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MarketingMock({ className }: { className?: string }) {
  const bars = [42, 58, 51, 73, 66, 88, 79];
  const rows = [
    { campaign: "Ramadan Bundle", roas: "5.2x", sales: "128" },
    { campaign: "Retarget WA", roas: "3.8x", sales: "64" },
    { campaign: "Lookalike CTR", roas: "2.4x", sales: "31" },
  ];

  return (
    <div className={cn("grid h-full min-h-[280px] grid-cols-[1.2fr_1fr] gap-3 bg-white p-3.5", className)}>
      <div className="rounded-xl border border-[#0C111D]/[0.06] bg-[#FAFBFC] p-3">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#667085] uppercase">
              ROAS 7 hari
            </p>
            <p className="mt-1 font-numeric text-2xl font-semibold tracking-[-0.04em] text-[#0C111D]">
              4.6x
            </p>
          </div>
          <span className="rounded-full bg-[#E6F7EF] px-2 py-0.5 font-numeric text-[0.65rem] font-semibold text-[#089146]">
            +18%
          </span>
        </div>
        <div className="flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-primary/80"
              style={{ height: `${h}%`, opacity: 0.55 + (i / bars.length) * 0.45 }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[#0C111D]/[0.06] p-3">
        <p className="mb-3 font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#667085] uppercase">
          Campaign → penjualan
        </p>
        <div className="space-y-2.5">
          {rows.map((row) => (
            <div
              key={row.campaign}
              className="flex items-center justify-between border-b border-[#0C111D]/[0.05] pb-2.5 last:border-0 last:pb-0"
            >
              <p className="truncate font-numeric text-[0.75rem] font-medium text-[#344054]">
                {row.campaign}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-numeric text-[0.72rem] font-semibold text-primary">{row.roas}</span>
                <span className="font-numeric text-[0.68rem] tabular-nums text-[#98A2B3]">{row.sales}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderMock({ className }: { className?: string }) {
  return (
    <div className={cn("h-full min-h-[280px] bg-white p-4", className)}>
      <div className="mx-auto max-w-md rounded-xl border border-[#0C111D]/[0.06] bg-[#FAFBFC] p-4">
        <div className="flex items-center justify-between">
          <p className="font-numeric text-[0.75rem] font-semibold text-[#0C111D]">Order #4821</p>
          <span className="rounded-full bg-[#E8F1FF] px-2 py-0.5 font-numeric text-[0.65rem] font-semibold text-primary">
            Paid
          </span>
        </div>
        <div className="mt-4 space-y-2 text-[0.75rem] text-[#525C6B]">
          <div className="flex justify-between">
            <span>2× Sage Set · M</span>
            <span className="tabular-nums">Rp 318.000</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkir Jakarta</span>
            <span className="tabular-nums">Rp 12.000</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#0C111D]/10 pt-2 font-semibold text-[#0C111D]">
            <span>Total</span>
            <span className="tabular-nums">Rp 330.000</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-[#0C111D]/[0.06] bg-white p-3">
          <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.1em] text-[#667085] uppercase">
            Tracking
          </p>
          <div className="mt-2 flex items-center gap-2 text-[0.72rem] text-[#525C6B]">
            <Dot className="bg-[#089146]" />
            Dikirim · JNE YES · resi 0071234567
          </div>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeMock({ className }: { className?: string }) {
  const sources = ["Katalog produk", "FAQ WhatsApp", "Google Drive", "SOP internal"];
  return (
    <div className={cn("h-full min-h-[280px] bg-white p-4", className)}>
      <div className="rounded-xl border border-[#0C111D]/[0.06] bg-[#FAFBFC] p-4">
        <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#667085] uppercase">
          Sumber pengetahuan
        </p>
        <ul className="mt-3 space-y-2">
          {sources.map((s) => (
            <li
              key={s}
              className="flex items-center justify-between rounded-lg border border-[#0C111D]/[0.06] bg-white px-3 py-2.5 text-[0.75rem] text-[#344054]"
            >
              <span>{s}</span>
              <span className="rounded-full bg-[#E6F7EF] px-2 py-0.5 font-numeric text-[0.62rem] font-semibold text-[#089146]">
                Synced
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.72rem] leading-relaxed text-[#667085]">
          Agent membaca pola dari data Anda sendiri — bukan tips umum dari internet.
        </p>
      </div>
    </div>
  );
}

export function MiniAgentMock({ className }: { className?: string }) {
  return (
    <div className={cn("h-full min-h-[280px] bg-white p-4", className)}>
      <div className="rounded-xl border border-[#0C111D]/[0.06] bg-[#FAFBFC] p-4">
        <div className="flex items-center justify-between">
          <p className="font-numeric text-[0.75rem] font-semibold text-[#0C111D]">Mini Agent · FAQ</p>
          <span className="rounded-full bg-[#E6F7EF] px-2 py-0.5 font-numeric text-[0.65rem] font-semibold text-[#089146]">
            Live
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="rounded-xl bg-[#F2F4F7] px-3 py-2 text-[0.75rem] text-[#344054]">
            Jam berapa buka?
          </div>
          <div className="ml-auto max-w-[90%] rounded-xl bg-primary px-3 py-2 text-[0.75rem] text-white">
            Senin–Sabtu 09.00–20.00 WIB. Mau saya bantu cek slot kunjungan?
          </div>
          <div className="rounded-xl bg-[#F2F4F7] px-3 py-2 text-[0.75rem] text-[#344054]">
            Bisa COD?
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["1 tugas", "Fokus"],
            ["< 2 mnt", "Setup"],
            ["24/7", "Siaga"],
          ].map(([a, b]) => (
            <div key={b} className="rounded-lg border border-[#0C111D]/[0.06] bg-white px-2 py-2.5">
              <p className="font-numeric text-[0.78rem] font-semibold text-[#0C111D]">{a}</p>
              <p className="mt-0.5 text-[0.65rem] text-[#667085]">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Map step/product keys to a mock panel. */
export function ProductMockFor({ kind }: { kind: string }) {
  switch (kind) {
    case "chat":
    case "frontline":
      return <ChatInboxMock />;
    case "crm":
      return <CrmBoardMock />;
    case "marketing":
      return <MarketingMock />;
    case "oms":
      return <OrderMock />;
    case "consulting":
      return <KnowledgeMock />;
    case "mini":
      return <MiniAgentMock />;
    default:
      return <ChatInboxMock />;
  }
}
