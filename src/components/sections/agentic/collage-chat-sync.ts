import type { ChatStep, ChatScenario, ChatModeKey } from "@/lib/hero-chat";

export type ScenarioKey = ChatScenario["key"];

/**
 * How far the WhatsApp thread has gone. CRM / OMS / Mini Agent on the
 * ecosystem stage read this so they restart and fill in the same beat
 * as the chat — including which of the 4 industries is on stage.
 */
export type ChatSync = {
  scenario: ScenarioKey;
  mode: ChatModeKey;
  /** 0..steps.length — steps already landed in this loop. */
  cursor: number;
  /** Increments every time the player restarts the script. */
  loop: number;
  orderPlaced: boolean;
};

export type ChatPhase =
  | "idle"
  | "intent"
  | "profile"
  | "offer"
  | "quote"
  | "invoice"
  | "paid"
  | "closed";

export function deriveChatPhase(steps: ChatStep[], cursor: number): ChatPhase {
  const landed = steps.slice(0, cursor);
  let phase: ChatPhase = "idle";
  let sawUser = false;
  let sawProductOrCard = false;
  let sawInvoiceish = false;
  let sawPaid = false;
  let sawCrmChip = false;
  let sawAccent = false;

  for (const step of landed) {
    if (step.kind === "user") sawUser = true;
    if (step.kind === "product" || step.kind === "card") sawProductOrCard = true;
    if (step.kind === "card") sawInvoiceish = true;
    if (
      step.kind === "ai" &&
      /pembayaran berhasil|payment received|diproses|being processed/i.test(
        step.text.id + " " + step.text.en,
      )
    ) {
      sawPaid = true;
    }
    if (
      step.kind === "chip" &&
      /crm|tersimpan|saved to crm|tercatat/i.test(step.text.id + " " + step.text.en)
    ) {
      sawCrmChip = true;
    }
    if (step.kind === "chip" && step.accent) sawAccent = true;
    if (step.kind === "rating" || step.kind === "divider") {
      if (phase !== "idle") phase = "closed";
    }
  }

  if (sawAccent || (sawCrmChip && sawPaid)) return "closed";
  if (sawPaid) return "paid";
  if (sawInvoiceish) return "invoice";
  if (sawProductOrCard) return "quote";
  if (sawUser) return "profile";
  if (cursor > 0) return "intent";
  return phase === "closed" ? "closed" : "idle";
}

export type L = { id: string; en: string };

export type IndustryCrm = {
  customer: L;
  source: L;
  stage: L;
  badge: L;
  metrics: { label: L; value: string }[];
  notes: Partial<Record<ChatPhase, { title: L; body: L }>>;
};

export type IndustryOms = {
  orders: {
    id: string;
    who: L;
    items: L;
    total: string;
    statusByPhase: Partial<Record<ChatPhase, L>>;
  }[];
};

export type IndustryAgent = {
  cmd: string;
  body: { label: L; value: L }[];
  doneByPhase: Partial<Record<ChatPhase, L>>;
};

const l = (id: string, en = id): L => ({ id, en });

export const INDUSTRY_CRM: Record<ScenarioKey, IndustryCrm> = {
  retail: {
    customer: l("Andi Wijaya · Retail"),
    source: l("WA Ads · SehatMax"),
    stage: l("Visitor → Lead → Buyer"),
    badge: l("Hot · siap closing"),
    metrics: [
      { label: l("Visitor"), value: "48" },
      { label: l("Lead"), value: "31" },
      { label: l("Deal"), value: "12" },
      { label: l("Buyer"), value: "9" },
    ],
    notes: {
      intent: { title: l("Intent: beli Vitamin C"), body: l("dari percakapan WA") },
      profile: { title: l("Profil: Andi Wijaya"), body: l("alamat + no. HP dari chat") },
      offer: { title: l("Cross-sell Omega-3"), body: l("bundle daily health stack") },
      quote: { title: l("Quote Rp 308.000"), body: l("2 Vit C + Omega + JNE") },
      invoice: { title: l("Order masuk pipeline"), body: l("Menunggu pembayaran") },
      paid: { title: l("Buyer · pembayaran diterima"), body: l("pipeline auto-update") },
      closed: { title: l("Follow-up reorder 30 hari"), body: l("dijadwalkan otomatis") },
    },
  },
  travel: {
    customer: l("Budi · Travel"),
    source: l("Meta Ads · Liburan Travel"),
    stage: l("Inquiry → Quote → Booking"),
    badge: l("Warm · minta itinerary"),
    metrics: [
      { label: l("Inquiry"), value: "36" },
      { label: l("Quote"), value: "22" },
      { label: l("Booking"), value: "11" },
      { label: l("Paid"), value: "8" },
    ],
    notes: {
      intent: { title: l("Intent: cari paket wisata"), body: l("tanggal & pax dari chat") },
      profile: { title: l("Profil: Budi keluarga"), body: l("preferensi hotel + budget") },
      offer: { title: l("Rekomendasi paket"), body: l("sesuai tanggal kosong") },
      quote: { title: l("Quote paket travel"), body: l("hotel + tiket + guide") },
      invoice: { title: l("Booking dibuat"), body: l("menunggu DP") },
      paid: { title: l("DP diterima · Booking locked"), body: l("e-ticket terkirim") },
      closed: { title: l("Reminder H-7 keberangkatan"), body: l("otomatis ke WhatsApp") },
    },
  },
  healthcare: {
    customer: l("Sarah · Clinic"),
    source: l("IG Ads · GlassSkin"),
    stage: l("Pasien lama · treatment"),
    badge: l("VIP · riwayat lengkap"),
    metrics: [
      { label: l("Booking"), value: "28" },
      { label: l("Show"), value: "24" },
      { label: l("Repeat"), value: "15" },
      { label: l("CSAT"), value: "4.8" },
    ],
    notes: {
      intent: { title: l("Intent: booking Skinbooster"), body: l("cek slot dari CRM") },
      profile: { title: l("Riwayat Sarah dimuat"), body: l("pasien lama terdeteksi") },
      offer: { title: l("Slot 14.00 dikonfirmasi"), body: l("tanpa tanya ulang data") },
      quote: { title: l("Booking card terkirim"), body: l("Skinbooster + aftercare") },
      invoice: { title: l("Treatment tercatat"), body: l("catatan dokter auto-save") },
      paid: { title: l("Pembayaran treatment"), body: l("struk digital ke WA") },
      closed: { title: l("Touch-up H+29"), body: l("promo Brightening Booster") },
    },
  },
  education: {
    customer: l("Bu Ratna · Education"),
    source: l("Meta Ads · English Training"),
    stage: l("Trial → Enroll"),
    badge: l("Lead panas · anak 8 th"),
    metrics: [
      { label: l("Leads"), value: "54" },
      { label: l("Trial"), value: "31" },
      { label: l("Enroll"), value: "18" },
      { label: l("Active"), value: "42" },
    ],
    notes: {
      intent: { title: l("Intent: info kelas Inggris"), body: l("anak usia 8 tahun") },
      profile: { title: l("Profil: Bu Ratna"), body: l("kebutuhan program anak") },
      offer: { title: l("Rekomendasi High Star"), body: l("free trial ditawarkan") },
      quote: { title: l("Trial Sabtu dikunci"), body: l("consultant notified") },
      invoice: { title: l("Minat reguler Rp 350rb"), body: l("diskon onboarding 20%") },
      paid: { title: l("Murid baru terdaftar"), body: l("kelas aktif Senin") },
      closed: { title: l("Onboarding parent channel"), body: l("reminder kelas otomatis") },
    },
  },
};

export const INDUSTRY_OMS: Record<ScenarioKey, IndustryOms> = {
  retail: {
    orders: [
      {
        id: "INV-2026-0831",
        who: l("Andi Wijaya"),
        items: l("Vit C ×2 + Omega ×1"),
        total: "Rp 308.000",
        statusByPhase: {
          quote: l("Draft"),
          invoice: l("Menunggu bayar"),
          paid: l("Paid · diproses"),
          closed: l("Selesai · reorder 30h"),
        },
      },
      {
        id: "INV-2026-0830",
        who: l("Budi Santoso"),
        items: l("Paket Family"),
        total: "Rp 425.000",
        statusByPhase: {},
      },
      {
        id: "INV-2026-0829",
        who: l("Citra Dewi"),
        items: l("Omega-3 1000mg"),
        total: "Rp 120.000",
        statusByPhase: {},
      },
    ],
  },
  travel: {
    orders: [
      {
        id: "TRV-2026-0142",
        who: l("Budi · Family 4pax"),
        items: l("Paket Bali 3H2M"),
        total: "Rp 6.400.000",
        statusByPhase: {
          quote: l("Itinerary draft"),
          invoice: l("Menunggu DP"),
          paid: l("DP masuk · e-ticket"),
          closed: l("H-7 reminder set"),
        },
      },
      {
        id: "TRV-2026-0141",
        who: l("Sari · Honeymoon"),
        items: l("Lombok 4H3M"),
        total: "Rp 8.100.000",
        statusByPhase: {},
      },
      {
        id: "TRV-2026-0140",
        who: l("Rian · Group 8"),
        items: l("Bali + Nusa"),
        total: "Rp 12.500.000",
        statusByPhase: {},
      },
    ],
  },
  healthcare: {
    orders: [
      {
        id: "CLN-2026-0088",
        who: l("Sarah"),
        items: l("Skinbooster · 14.00"),
        total: "Rp 850.000",
        statusByPhase: {
          quote: l("Slot ditahan"),
          invoice: l("Booking card"),
          paid: l("Treatment booked"),
          closed: l("Touch-up H+29"),
        },
      },
      {
        id: "CLN-2026-0087",
        who: l("Maya"),
        items: l("Facial + LED"),
        total: "Rp 420.000",
        statusByPhase: {},
      },
      {
        id: "CLN-2026-0086",
        who: l("Dina"),
        items: l("Aftercare Serum"),
        total: "Rp 320.000",
        statusByPhase: {},
      },
    ],
  },
  education: {
    orders: [
      {
        id: "EDU-2026-0210",
        who: l("Rafi · High Star"),
        items: l("Reguler · bulanan"),
        total: "Rp 350.000",
        statusByPhase: {
          quote: l("Trial scheduled"),
          invoice: l("Offer dikirim"),
          paid: l("Enrolled · aktif"),
          closed: l("Parent channel on"),
        },
      },
      {
        id: "EDU-2026-0209",
        who: l("Nadia · Teens"),
        items: l("Conversation A2"),
        total: "Rp 400.000",
        statusByPhase: {},
      },
      {
        id: "EDU-2026-0208",
        who: l("Kevin · Kids B1"),
        items: l("Private 1-on-1"),
        total: "Rp 150.000",
        statusByPhase: {},
      },
    ],
  },
};

export const INDUSTRY_AGENT: Record<ScenarioKey, IndustryAgent> = {
  retail: {
    cmd: "resolve lead · retail",
    body: [
      { label: l("Intent:"), value: l("purchase · Vitamin C") },
      { label: l("CRM:"), value: l("Andi · auto notes") },
      { label: l("Next:"), value: l("catalog + offer") },
    ],
    doneByPhase: {
      idle: l("Listening…"),
      intent: l("Intent parsed"),
      profile: l("Contact saved"),
      offer: l("Upsell ready"),
      quote: l("Totals ready"),
      invoice: l("Invoice issued"),
      paid: l("Order fulfilled"),
      closed: l("Loop closed · CRM hot"),
    },
  },
  travel: {
    cmd: "resolve lead · travel",
    body: [
      { label: l("Intent:"), value: l("paket wisata") },
      { label: l("CRM:"), value: l("Budi · family 4") },
      { label: l("Next:"), value: l("itinerary + DP") },
    ],
    doneByPhase: {
      idle: l("Listening…"),
      intent: l("Travel intent"),
      profile: l("Pax + budget"),
      offer: l("Package matched"),
      quote: l("Quote ready"),
      invoice: l("Booking draft"),
      paid: l("E-ticket sent"),
      closed: l("Trip prep queued"),
    },
  },
  healthcare: {
    cmd: "resolve lead · clinic",
    body: [
      { label: l("Intent:"), value: l("booking treatment") },
      { label: l("CRM:"), value: l("Sarah · VIP") },
      { label: l("Next:"), value: l("slot + reminder") },
    ],
    doneByPhase: {
      idle: l("Listening…"),
      intent: l("Booking intent"),
      profile: l("History loaded"),
      offer: l("Slot confirmed"),
      quote: l("Card issued"),
      invoice: l("Chart updated"),
      paid: l("Visit locked"),
      closed: l("Aftercare scheduled"),
    },
  },
  education: {
    cmd: "resolve lead · education",
    body: [
      { label: l("Intent:"), value: l("kelas anak") },
      { label: l("CRM:"), value: l("Bu Ratna") },
      { label: l("Next:"), value: l("trial + enroll") },
    ],
    doneByPhase: {
      idle: l("Listening…"),
      intent: l("Program inquiry"),
      profile: l("Child age noted"),
      offer: l("Trial offered"),
      quote: l("Slot Saturday"),
      invoice: l("Price sent"),
      paid: l("Student enrolled"),
      closed: l("Class reminders on"),
    },
  },
};

export function pickPhaseNote(
  notes: IndustryCrm["notes"],
  phase: ChatPhase,
): { title: L; body: L } {
  return (
    notes[phase] ??
    notes.intent ?? {
      title: l("Menunggu chat…", "Waiting for chat…"),
      body: l("CRM terisi dari percakapan", "CRM fills from the conversation"),
    }
  );
}
