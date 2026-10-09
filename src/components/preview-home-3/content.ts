import type { SandboxCopy } from "./sandbox/copy";
export type Lang = "id" | "en";

/**
 * The hero window's four views — one per capability the product actually has:
 * a shared inbox, a profile that fills itself in, an order closed inside the
 * chat, and a segment broadcast.
 *
 * Declared as data rather than inside the component so both locales are checked
 * by `tsc` and the copy stays with the rest of the page's copy.
 *
 * On the numbers: nothing here is invented telemetry. Every figure is one the
 * page already states beside it, so the cycling views cannot contradict the
 * copy they sit under.
 */
/** One queued conversation in the inbox. */
type HeroRow = { who: string; msg: string; chip: string };
/** One row of a customer profile. The icon is a key, not an SVG — see FACT_ICONS. */
type HeroFact = {
  icon: "tier" | "pin" | "heart" | "repeat";
  label: string;
  value: string;
};
type HeroFactSet = { name: string; ltv: string; rows: HeroFact[] };
type HeroMetric = { label: string; value: string };
type HeroCampaign = {
  name: string;
  status: string;
  metrics: HeroMetric[];
  /** Its own response series. Sharing one across sends would put the same line
   *  under two different reports. Directional only — no axis, no rate claimed. */
  trend: number[];
};

/**
 * The hero window's four views — one per capability the product actually has:
 * a shared inbox, a profile that fills itself in, an order closed inside the
 * chat, and a segment broadcast.
 *
 * Declared as an explicit union rather than an inferred tuple, because every
 * view now carries a *sequence* it plays on a loop and the renderer has to be
 * able to ask "which entry of this view's list is showing" without narrowing a
 * union of differently-shaped objects. `key` is the discriminant.
 *
 * On the numbers: nothing here is invented telemetry. Every figure is one the
 * page already states beside it, so the cycling views cannot contradict the
 * copy they sit under.
 */
export type HeroView =
  | {
      key: "inbox";
      url: string;
      urlEn: string;
      title: string;
      titleEn: string;
      /** Pages of the queue. The view cycles them, so the inbox reads as live. */
      batches: HeroRow[][];
      batchesEn: HeroRow[][];
    }
  | {
      key: "profile";
      url: string;
      urlEn: string;
      title: string;
      titleEn: string;
      /** Assembled from the conversation rather than typed in, so it cycles. */
      facts: HeroFactSet[];
      factsEn: HeroFactSet[];
    }
  | {
      key: "order";
      url: string;
      urlEn: string;
      title: string;
      titleEn: string;
      order: { id: string; title: string; total: string; note: string };
      orderEn: { id: string; title: string; total: string; note: string };
      steps: string[];
      stepsEn: string[];
      /** One per step, indexed alongside it, so the label always matches the bar. */
      statusByStep: { id: string; en: string }[];
    }
  | {
      key: "campaign";
      url: string;
      urlEn: string;
      title: string;
      titleEn: string;
      campaign: HeroCampaign[];
      campaignEn: HeroCampaign[];
    };

export const HERO_VIEWS: HeroView[] = [
  {
    key: "inbox",
    url: "app.cekat.ai / inbox",
    urlEn: "app.cekat.ai / inbox",
    title: "Chat masuk",
    titleEn: "Incoming chat",
    batches: [
      [
        {
          who: "Rani — Instagram DM",
          msg: "“Kak, ready warna navy? Kalau ambil 2 dapat diskon berapa ya?”",
          chip: "Dibalas AI dalam 8 detik",
        },
        {
          who: "Bagus — WhatsApp",
          msg: "“Ongkir ke Bandung berapa? Bisa bayar QRIS kan?”",
          chip: "Ongkir + link bayar terkirim otomatis",
        },
        {
          who: "Dewi — TikTok",
          msg: "“Saya sudah transfer ya, tolong dicek”",
          chip: "Pesanan tercatat otomatis",
        },
      ],
      [
        {
          who: "Sinta — WhatsApp",
          msg: "“Stok warna sage masih ada? Mau pesan 3 untuk kos.”",
          chip: "Cek dua gudang, dijawab 11 detik",
        },
        {
          who: "Yosua — Instagram",
          msg: "“Kak, weekend ada promo bundling linen?”",
          chip: "Promo bundling dikirim otomatis",
        },
        {
          who: "Maya — Web chat",
          msg: "“Bisa kirim katalog terbaru?”",
          chip: "Katalog terkirim sebagai tautan",
        },
      ],
      [
        {
          who: "Tiara — WhatsApp",
          msg: "“Resi order kemarin sudah dikirim belum?”",
          chip: "Status dibaca dari data kurir",
        },
        {
          who: "Rangga — Instagram",
          msg: "“Ukuran L warna navy masih ada?”",
          chip: "Stok per ukuran dicek otomatis",
        },
        {
          who: "Nadia — TikTok",
          msg: "“DP-nya bisa ditahan sampai besok?”",
          chip: "Aturan DP dibaca dari kebijakan",
        },
      ],
    ],
    batchesEn: [
      [
        {
          who: "Rani — Instagram DM",
          msg: "“Do you have navy? What's the discount if I take two?”",
          chip: "AI replied in 8 seconds",
        },
        {
          who: "Bagus — WhatsApp",
          msg: "“Shipping to Bandung? Can I pay by QRIS?”",
          chip: "Shipping + payment link sent automatically",
        },
        {
          who: "Dewi — TikTok",
          msg: "“I transferred already, please check”",
          chip: "Order recorded automatically",
        },
      ],
      [
        {
          who: "Sinta — WhatsApp",
          msg: "“Still have sage? I want three for a boarding house.”",
          chip: "Two warehouses checked, answered in 11 seconds",
        },
        {
          who: "Yosua — Instagram",
          msg: "“Any linen bundle deals this weekend?”",
          chip: "Bundle offer sent automatically",
        },
        {
          who: "Maya — Web chat",
          msg: "“Could you send the latest catalogue?”",
          chip: "Catalogue sent as a link",
        },
      ],
      [
        {
          who: "Tiara — WhatsApp",
          msg: "“Has yesterday's order shipped yet?”",
          chip: "Status read from courier data",
        },
        {
          who: "Rangga — Instagram",
          msg: "“Do you still have navy in large?”",
          chip: "Stock checked per size automatically",
        },
        {
          who: "Nadia — TikTok",
          msg: "“Can the deposit wait until tomorrow?”",
          chip: "Deposit rule read from your policy",
        },
      ],
    ],
  },
  {
    key: "profile",
    url: "app.cekat.ai / pelanggan",
    urlEn: "app.cekat.ai / customers",
    title: "Profil tersusun otomatis",
    titleEn: "Profile builds itself",
    facts: [
      {
        name: "Rani — Bali",
        ltv: "Rp 4,2 jt",
        rows: [
          { icon: "tier", label: "Tingkat", value: "Gold" },
          { icon: "pin", label: "Kota tetap", value: "Ubud" },
          { icon: "heart", label: "Disukai", value: "Linen / navy" },
          { icon: "repeat", label: "Pesan ulang", value: "11 hari" },
        ],
      },
      {
        name: "Sinta — Jakarta",
        ltv: "Rp 7,4 jt",
        rows: [
          { icon: "tier", label: "Tingkat", value: "Gold" },
          { icon: "pin", label: "Kota tetap", value: "Jakarta Selatan" },
          { icon: "heart", label: "Disukai", value: "Serum / glow" },
          { icon: "repeat", label: "Pesan ulang", value: "6 hari" },
        ],
      },
      {
        name: "Bagus — Bandung",
        ltv: "Rp 1,9 jt",
        rows: [
          { icon: "tier", label: "Tingkat", value: "Silver" },
          { icon: "pin", label: "Kota tetap", value: "Bandung" },
          { icon: "heart", label: "Disukai", value: "Batik / heritage" },
          { icon: "repeat", label: "Pesan ulang", value: "24 hari" },
        ],
      },
    ],
    factsEn: [
      {
        name: "Rani — Bali",
        ltv: "$268",
        rows: [
          { icon: "tier", label: "Tier", value: "Gold" },
          { icon: "pin", label: "Home city", value: "Ubud" },
          { icon: "heart", label: "Prefers", value: "Linen / navy" },
          { icon: "repeat", label: "Reorders", value: "Every 11 days" },
        ],
      },
      {
        name: "Sinta — Jakarta",
        ltv: "$472",
        rows: [
          { icon: "tier", label: "Tier", value: "Gold" },
          { icon: "pin", label: "Home city", value: "South Jakarta" },
          { icon: "heart", label: "Prefers", value: "Serum / glow" },
          { icon: "repeat", label: "Reorders", value: "Every 6 days" },
        ],
      },
      {
        name: "Bagus — Bandung",
        ltv: "$121",
        rows: [
          { icon: "tier", label: "Tier", value: "Silver" },
          { icon: "pin", label: "Home city", value: "Bandung" },
          { icon: "heart", label: "Prefers", value: "Batik / heritage" },
          { icon: "repeat", label: "Reorders", value: "Every 24 days" },
        ],
      },
    ],
  },
  {
    key: "order",
    url: "app.cekat.ai / order",
    urlEn: "app.cekat.ai / orders",
    title: "Order tanpa pindah aplikasi",
    titleEn: "Orders, in the chat",
    order: {
      id: "#NC-2481",
      title: "Linen set navy ×2",
      total: "Rp 428.000",
      note: "Link pembayaran QRIS dikirim otomatis di dalam chat.",
    },
    orderEn: {
      id: "#NC-2481",
      title: "Linen set navy ×2",
      total: "$27",
      note: "The QRIS payment link was sent inside the conversation.",
    },
    steps: ["Dibuat", "Dibayar", "Dikirim", "Selesai"],
    stepsEn: ["Created", "Paid", "Shipped", "Done"],
    /*
     * One status per step, indexed with it. This used to be a single `reached`
     * and a single `status`, and the bar was drawn from
     * `i <= steps.indexOf(step)` — which is always true, so all four bars filled
     * while the order was only at step two.
     *
     * It could not be derived from the status text either: "Sudah dibayar" is
     * not the string "Dibayar", and the English "Paid" does not appear in the
     * English steps list either. One entry per step removes the whole question.
     */
    statusByStep: [
      { id: "Baru dibuat", en: "Created" },
      { id: "Menunggu pembayaran", en: "Awaiting payment" },
      { id: "Sudah dibayar", en: "Paid" },
      { id: "Dikirim, proses selesai", en: "Shipped and closed" },
    ],
  },
  {
    key: "campaign",
    url: "app.cekat.ai / kampanye",
    urlEn: "app.cekat.ai / campaigns",
    title: "Broadcast per segmen",
    titleEn: "Segment broadcasts",
    campaign: [
      {
        name: "Pelanggan Gold · 3 bulan",
        status: "Terkirim",
        metrics: [
          { label: "Terkirim", value: "1.284" },
          { label: "Dibuka", value: "72%" },
          { label: "Belanja", value: "9,4%" },
        ],
        trend: [14, 18, 16, 24, 22, 31, 28, 38, 44, 51],
      },
      {
        name: "Semua pelanggan · katalog baru",
        status: "Terkirim",
        metrics: [
          { label: "Terkirim", value: "8.902" },
          { label: "Dibuka", value: "68%" },
          { label: "Belanja", value: "4,1%" },
        ],
        trend: [9, 12, 11, 15, 19, 17, 23, 21, 26, 30],
      },
    ],
    campaignEn: [
      {
        name: "Gold customers · 3 months",
        status: "Sent",
        metrics: [
          { label: "Sent", value: "1,284" },
          { label: "Opened", value: "72%" },
          { label: "Bought", value: "9.4%" },
        ],
        trend: [14, 18, 16, 24, 22, 31, 28, 38, 44, 51],
      },
      {
        name: "All customers · new catalogue",
        status: "Sent",
        metrics: [
          { label: "Sent", value: "8,902" },
          { label: "Opened", value: "68%" },
          { label: "Bought", value: "4.1%" },
        ],
        trend: [9, 12, 11, 15, 19, 17, 23, 21, 26, 30],
      },
    ],
  },
];

/** The stat strip under the window — the page's own headline figures. */
export const HERO_STATS = [
  {
    value: "1,8 dtk",
    valueEn: "1.8s",
    label: "rata-rata AI membalas",
    labelEn: "average AI reply",
  },
  {
    value: "92%",
    valueEn: "92%",
    label: "chat terbantu otomatis",
    labelEn: "chat handled automatically",
  },
  {
    value: "+34%",
    valueEn: "+34%",
    label: "chat jadi pembeli minggu ini",
    labelEn: "chat becoming buyers this week",
  },
] as const;

/**
 * The conversation the hero plays on a loop, in the inbox view.
 *
 * `note` is what makes it credible: the AI's turn carries the source it answered
 * from, which is the specific claim the product makes.
 *
 * Copy is per-turn rather than a single string so the animation can reveal the
 * exchange in order without ever needing the text to be assembled at runtime.
 */
type Proof = { heading: string; stats: { value: string; label: string }[] };

export type ChatTurn = {
  from: "visitor" | "ai";
  text: string;
  textEn: string;
  /** Only on AI turns: the source the answer was drawn from. */
  note?: string;
  noteEn?: string;
};

export const HERO_CHATS: {
  who: string;
  channel: string;
  channelEn: string;
  turns: ChatTurn[];
}[] = [
  {
    who: "Rani",
    channel: "Instagram DM",
    channelEn: "Instagram DM",
    turns: [
      {
        from: "visitor",
        text: "Kak, linen set warna navy ready? Kalau ambil 2 dapat diskon berapa?",
        textEn: "Is the navy linen set in stock? And what is the discount for two?",
      },
      {
        from: "ai",
        text: "Halo Rani — navy ready. Untuk 2 pcs diskon 10%, jadi Rp 428.000. Mau saya kirim link pembayarannya?",
        textEn: "Hi Rani — navy is in stock. Two pieces takes 10% off, so $27. Shall I send a payment link?",
        note: "Dijawab dari info stok & harga bisnis",
        noteEn: "Answered from your stock & pricing",
      },
      {
        from: "visitor",
        text: "Iya, kirim linknya ya. Kalau bisa dikirim hari ini?",
        textEn: "Yes please, send the link. And can it ship today?",
      },
      {
        from: "ai",
        text: "Link QRIS sudah terkirim. Stok navy ready, dikirim hari ini dari Jakarta.",
        textEn: "QRIS link sent. Navy is ready and ships today from Jakarta.",
        note: "Link bayar dibuat, status kirim diisi otomatis",
        noteEn: "Payment link created, shipping status filled in",
      },
    ],
  },
  {
    who: "Bagus",
    channel: "WhatsApp",
    channelEn: "WhatsApp",
    turns: [
      {
        from: "visitor",
        text: "Ongkir ke Bandung berapa ya? Bisa bayar QRIS?",
        textEn: "How much is shipping to Bandung? Can I pay by QRIS?",
      },
      {
        from: "ai",
        text: "Ongkir Bandung Rp 24.000, gratis di atas Rp 300.000. Ini link bayar QRIS-nya ya.",
        textEn: "Shipping to Bandung is $1.60, free over $20. Here is your QRIS payment link.",
        note: "Link bayar dibuat otomatis di dalam chat",
        noteEn: "Payment link created inside the chat",
      },
      {
        from: "visitor",
        text: "Oke. Saya pesan 1 kemeja batik, bisa dikirim hari ini?",
        textEn: "Great. I'll take one batik shirt — can it go out today?",
      },
      {
        from: "ai",
        text: "Sudah tercatat: #NC-2484, 1 kemeja batik, Rp 275.000. Dikirim sebelum 15.00 WIB.",
        textEn: "Recorded: #NC-2484, one batik shirt, $18. Out before 3pm.",
        note: "Order dibuat dari dalam percakapan",
        noteEn: "Order created from inside the conversation",
      },
    ],
  },
  {
    who: "Dewi",
    channel: "TikTok",
    channelEn: "TikTok",
    turns: [
      {
        from: "visitor",
        text: "Pesanan saya sudah saya transfer ya, tolong dicek",
        textEn: "I have transferred my order already, please check",
      },
      {
        from: "ai",
        text: "Sudah kami terima, terima kasih Dewi! Pesanan #NC-2481 sedang diproses.",
        textEn: "Received, thank you Dewi! Order #NC-2481 is being prepared.",
        note: "Status pembayaran tercatat otomatis",
        noteEn: "Payment status recorded automatically",
      },
      {
        from: "visitor",
        text: "Bisa minta dikirim sebelum Jumat ya?",
        textEn: "Could you make sure it ships before Friday?",
      },
      {
        from: "ai",
        text: "Sudah saya perbarui: dikirim Kamis sebelum 15.00. Nomor resinya saya kirim begitu keluar.",
        textEn: "Updated: out Thursday before 3pm. I will send the tracking as soon as it leaves.",
        note: "Aturan SLA dibaca, jadwal kirim dijadwal ulang",
        noteEn: "SLA rule read, delivery date rescheduled",
      },
    ],
  },
];

/**
 * The story band also carries a two-bar series. It plots only the two numbers
 * the customer's own quote states — the rate before and after — so the panel
 * restates the sentence beside it instead of inventing a trend nobody supplied.
 */
type Story = {
  eyebrow: string;
  heading: string;
  body: string;
  quote: string;
  attribution: string;
  metrics: { value: string; label: string }[];
  series: {
    caption: string;
    bars: { label: string; value: number; now?: boolean }[];
  };
  cta: { label: string; href: string };
};

/**
 * Pricing. `rate`, `period` and `rateNote` are separate fields so the figure and
 * its qualifiers stay independently translatable — Indonesian and English do not
 * share a word order here, and "per conversation" is not the same string in both.
 *
 * `compareRows` is a spec table, not marketing: two columns (what this plan
 * gives you, what the alternative does) per row, so a buyer can scan capability
 * rather than read adjectives. `alternative` may be an empty string when there
 * is no honest second option to name.
 *
 * Named `compareRows` rather than `compare` because `compare` is already the
 * link to the full pricing page — two fields of the same name in one object is
 * the kind of collision that silently renders the wrong one.
 */
type Pricing = {
  eyebrow: string;
  heading: string;
  body: string;
  planName: string;
  rate: string;
  period: string;
  rateNote: string;
  trial: string;
  included: string[];
  footnote: string;
  compareHeading: string;
  compareRows: { label: string; featured: string; alternative: string }[];
  cta: { label: string; href: string };
  compare: { label: string; href: string };
};

export type Copy3 = {
  proof: Proof;
  problem: {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; body: string }[];
  };
  how: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: { index: string; title: string; body: string }[];
  };
  features: {
    eyebrow: string;
    heading: string;
    body: string;
    items: { title: string; body: string; points: string[] }[];
  };
  results: Story;
  /** The hands-on demo. Typed in `sandbox/copy.ts`; see that file for why. */
  sandbox: SandboxCopy;

  /** Context band. Rendered only when `CONTEXT_PHOTOS` has entries. */
  context: { eyebrow: string; heading: string; body: string };
  trust: {
    eyebrow: string;
    heading: string;
    body: string;
    points: { title: string; body: string }[];
  };
  faq: { eyebrow: string; heading: string; items: { q: string; a: string }[] };
  pricing: Pricing;
  finalCta: {
    eyebrow: string;
    heading: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

export const COPY3: Record<Lang, Copy3> = {
  id: {
    proof: {
      heading: "Dipercaya tim yang melayani jutaan percakapan",
      stats: [
        { value: "10M+", label: "percakapan dibantu setiap bulan" },
        { value: "3.000+", label: "bisnis bertumbuh bersama Cekat" },
        { value: "<2 mnt", label: "rata-rata balasan pertama" },
      ],
    },
    problem: {
      eyebrow: "TANTANGAN",
      heading: "Setiap percakapan adalah peluang. Jangan biarkan terlewat.",
      body: "Saat volume bertumbuh, tools yang terpisah membuat konteks pelanggan dan peluang penjualan ikut tercecer.",
      items: [
        {
          title: "Pelanggan menunggu terlalu lama",
          body: "Permintaan datang kapan saja. Tim tak seharusnya kehilangan peluang hanya karena sedang offline.",
        },
        {
          title: "Konteks hilang di antara kanal",
          body: "Riwayat pelanggan tersebar di inbox, spreadsheet, dan perangkat tim yang berbeda.",
        },
        {
          title: "Sulit mengukur apa yang berhasil",
          body: "Tanpa alur data yang terhubung, tim sulit menghubungkan percakapan dengan hasil bisnis.",
        },
      ],
    },
    how: {
      eyebrow: "SATU SISTEM, DARI AWAL KE AKHIR",
      heading: "Dibangun untuk alur kerja nyata tim Anda",
      body: "Hubungkan percakapan, pengetahuan, dan tindakan dalam satu workspace.",
      steps: [
        {
          index: "01 / HUBUNGKAN",
          title: "Satukan setiap kanal",
          body: "WhatsApp, Instagram, TikTok, dan web chat masuk ke inbox bersama.",
        },
        {
          index: "02 / PAHAMI",
          title: "Beri AI konteks bisnis",
          body: "Harga, stok, kebijakan, dan alur layanan menjadi sumber jawaban AI.",
        },
        {
          index: "03 / SELESAIKAN",
          title: "Ubah percakapan jadi hasil",
          body: "AI membantu menjawab, mengarahkan, dan menyelesaikan pekerjaan berulang.",
        },
      ],
    },
    features: {
      eyebrow: "PLATFORM",
      heading: "Satu workspace. Seluruh perjalanan pelanggan.",
      body: "Dari percakapan pertama sampai order dan pelanggan kembali lagi.",
      items: [
        {
          title: "Inbox yang bekerja bersama AI",
          body: "Tim dan AI menangani percakapan di satu tempat dengan konteks yang sama.",
          points: ["Jawaban berbasis info bisnis", "Eskalasi ke tim saat dibutuhkan"],
        },
        {
          title: "Profil pelanggan yang terus lengkap",
          body: "Riwayat dan preferensi tercatat dari percakapan, bukan input manual.",
          points: ["Riwayat pelanggan terpusat", "Segmentasi otomatis"],
        },
        {
          title: "Order tanpa pindah-pindah aplikasi",
          body: "Kelola detail transaksi, pembayaran, dan tindak lanjut dari alur chat.",
          points: ["Detail order tercatat", "Status pembayaran terlihat"],
        },
        {
          title: "Promosi yang lebih relevan",
          body: "Rangkau pelanggan dengan konteks dan pesan yang sesuai kebutuhannya.",
          points: ["Kampanye berbasis segmen", "Pantau respons dan konversi"],
        },
      ],
    },
    sandbox: {
      eyebrow: "COBA SENDIRI",
      heading: "Buka produknya. Coba, jangan cuma lihat.",
      body: "Lima modul, masing-masing bisa dicoba. Semua isinya data contoh dan tidak ada yang dikirim ke mana pun.",
      tablistLabel: "Modul Cekat",
      demoBadge: "Data contoh",
      footNote: "Modul bisa diganti dengan tab atau tombol panah kiri-kanan.",
      modules: {
        chat: { id: "Chat", en: "Chat" },
        crm: { id: "CRM", en: "CRM" },
        oms: { id: "Order", en: "Orders" },
        marketing: { id: "Marketing", en: "Marketing" },
        consultant: { id: "Consultant", en: "Consultant" },
      },
      chat: {
        search: "Cari nama atau kota",
        filterAll: "Semua",
        composerLabel: "Tulis pesan",
        composerPlaceholder: "Tulis balasan untuk pelanggan ini…",
        send: "Kirim pesan",
        disclaimer: "Isian contoh. Pesan ini tidak dikirim ke mana pun.",
        stageHint: "Ubah tahap",
        empty: "Tidak ada pelanggan yang cocok.",
      },
      crm: {
        search: "Cari deal",
        empty: "Pilih satu deal untuk melihat detailnya.",
        advance: "Naikkan tahap",
        detail: "DETAIL DEAL",
        close: "Target closing",
        wonHint: { id: "menang", en: "won" },
      },
      oms: {
        search: "Cari nomor order atau nama",
        all: "Semua",
        empty: "Tidak ada order yang cocok.",
        advance: "Majukan status",
        stuck: "order belum dibayar",
      },
      marketing: {
        audience: "PILIH AUDIENS",
        send: "Kirim broadcast",
        sent: "Terkirim",
        excluded: "Otomatis keluar dari daftar: yang memblokir nomor, dan yang sudahdinonaktifkan.",
        expected: "Perkiraan hasil",
        note: "Angka di bawah mengikuti segmen yang dipilih.",
        why: "Kenapa segmen ini",
      },
      consultant: {
        ask: "Tanya apa saja tentang bisnis ini",
        placeholder: "Contoh: bagaimana penjualan saya bulan ini?",
        send: "Tanya",
        suggested: "COBA PERTANYAAN INI",
        sources: "Sumber:",
        askMore: "Jawaban diambil dari data bisnis contoh. Pertanyaan di luar itu sengaja tidak dijawab.",
        fallback: { id: "Di luar data contoh", en: "Outside the sample data" },
      },
    },
    context: {
      eyebrow: "DI LAPANGAN",
      heading: "Bekerja di gudang, meja, dan jalan.",
      body: "Klaim yang sama seperti di atas, tapi terjadi di tempat barang benar-benar bergerak.",
    },
    results: {
      eyebrow: "CERITA PELANGGAN",
      heading: "Pertumbuhan yang terlihat di angka bisnis.",
      body: "Nature Craft Indonesia memakai Cekat untuk menjaga kecepatan layanan saat volume percakapan meningkat.",
      quote: "Closing rate kami dulu di bawah 20 persen. Sekarang di atas 40 persen, dan omzet ikut naik.",
      attribution: "Hariyudi, Direktur Nature Craft Indonesia",
      metrics: [
        { value: "2×", label: "peningkatan closing rate" },
        { value: "+50%", label: "kenaikan omzet" },
        { value: "24/7", label: "cakupan respons pelanggan" },
      ],
      series: {
        caption: "Closing rate",
        bars: [
          { label: "Sebelum", value: 20 },
          { label: "Sekarang", value: 40, now: true },
        ],
      },
      cta: { label: "Baca kisah pelanggan", href: "/cerita/nature-craft" },
    },
    trust: {
      eyebrow: "KEAMANAN & KONTROL",
      heading: "Kepercayaan dibangun ke dalam platform.",
      body: "Data pelanggan, akses tim, dan koneksi kanal dirancang agar bisnis tetap memegang kendali.",
      points: [
        {
          title: "Perlindungan data",
          body: "Pengelolaan data mengikuti ketentuan perlindungan data pribadi yang berlaku.",
        },
        {
          title: "Integrasi resmi",
          body: "Kanal WhatsApp terhubung melalui API resmi dengan template yang disetujui.",
        },
        {
          title: "Akses berbasis peran",
          body: "Atur informasi yang dapat dilihat oleh anggota dan tim yang berbeda.",
        },
        {
          title: "Standar keamanan",
          body: "Sertifikasi ISO 9001 dan 27001 mendukung proses dan keamanan informasi.",
        },
      ],
    },
    pricing: {
      eyebrow: "PAKET & HARGA",
      heading: "Mulai sesuai kebutuhan. Tumbuh tanpa batasan.",
      body: "Coba seluruh fitur selama 14 hari. Tanpa kartu kredit.",
      planName: "Semua fitur",
      rate: "Gratis",
      period: "14 hari",
      rateNote: "Lalu pilih paket sesuai volume percakapan",
      trial: "Uji coba",
      included: [
        "Percakapan berbantuan AI",
        "Inbox bersama untuk tim",
        "Profil & riwayat pelanggan",
        "Order, pembayaran & follow-up",
        "Broadcast berbasis segmen",
        "Laporan performa percakapan",
      ],
      footnote:
        "Tanpa kontrak jangka panjang. Ubah paket saat kebutuhan tim berkembang.",
      compareHeading: "Yang termasuk di setiap paket",
      compareRows: [
        { label: "Balasan otomatis", featured: "AI, 24 jam", alternative: "Jam kerja saja" },
        { label: "Kanal tersambung", featured: "WhatsApp · IG · TikTok · Web", alternative: "1 kanal" },
        { label: "Riwayat pelanggan", featured: "Otomatis", alternative: "Diisi manual" },
        { label: "Pengetahuan untuk AI", featured: "Dokumen & harga", alternative: "" },
        { label: "Order & pembayaran", featured: "Dalam alur chat", alternative: "Aplikasi terpisah" },
        { label: "Laporan", featured: "Performa percakapan", alternative: "" },
      ],
      cta: { label: "Mulai uji coba gratis", href: "https://chat.cekat.ai/register" },
      compare: { label: "Bandingkan paket", href: "/harga" },
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Pertanyaan yang sering diajukan",
      items: [
        {
          q: "Apakah saya perlu coding?",
          a: "Tidak. Hubungkan kanal dan tambahkan informasi bisnis, lalu tim dapat mulai menggunakan platform.",
        },
        {
          q: "Bagaimana AI menangani pertanyaan yang tidak diketahui?",
          a: "Pertanyaan di luar sumber informasi dapat diarahkan ke tim untuk ditinjau dan dijawab.",
        },
        {
          q: "Apakah nomor WhatsApp tetap milik saya?",
          a: "Ya. Nomor tetap terhubung ke bisnis Anda sesuai pengaturan kanal.",
        },
        {
          q: "Apakah ada kontrak jangka panjang?",
          a: "Paket tersedia secara bulanan dan dapat disesuaikan dengan kebutuhan bisnis.",
        },
      ],
    },
    finalCta: {
      eyebrow: "MULAI HARI INI",
      heading: "Buat setiap percakapan berarti.",
      body: "Lihat bagaimana Cekat membantu tim melayani pelanggan dan mengembangkan bisnis.",
      primary: { label: "Mulai uji coba gratis", href: "https://chat.cekat.ai/register" },
      secondary: { label: "Hubungi tim sales", href: "/contact-sales" },
    },
  },
  en: {
    proof: {
      heading: "Trusted by teams behind millions of conversations",
      stats: [
        { value: "10M+", label: "conversations assisted every month" },
        { value: "3,000+", label: "businesses growing with Cekat" },
        { value: "<2 min", label: "average first response time" },
      ],
    },
    problem: {
      eyebrow: "THE CHALLENGE",
      heading: "Every conversation is an opportunity. Don’t let it slip.",
      body: "As volume grows, disconnected tools make customer context and revenue opportunities harder to keep track of.",
      items: [
        {
          title: "Customers wait too long",
          body: "Requests arrive at any hour. Teams shouldn’t lose opportunities just because they’re offline.",
        },
        {
          title: "Context gets lost across channels",
          body: "Customer history is scattered across inboxes, spreadsheets, and team devices.",
        },
        {
          title: "Impact is hard to measure",
          body: "Without connected workflows, it’s difficult to link conversations to business outcomes.",
        },
      ],
    },
    how: {
      eyebrow: "ONE SYSTEM, END TO END",
      heading: "Built around how your team actually works",
      body: "Bring conversations, knowledge, and action together in one workspace.",
      steps: [
        {
          index: "01 / CONNECT",
          title: "Bring every channel together",
          body: "WhatsApp, Instagram, TikTok, and web chat flow into a shared inbox.",
        },
        {
          index: "02 / UNDERSTAND",
          title: "Give AI your business context",
          body: "Pricing, inventory, policies, and workflows become trusted sources for AI.",
        },
        {
          index: "03 / RESOLVE",
          title: "Turn conversations into outcomes",
          body: "AI helps answer, route, and complete repetitive work across the customer journey.",
        },
      ],
    },
    features: {
      eyebrow: "THE PLATFORM",
      heading: "One workspace. The entire customer journey.",
      body: "From the first conversation to the order—and the next time they come back.",
      items: [
        {
          title: "An inbox that works with AI",
          body: "Your team and AI handle conversations together, with the same customer context.",
          points: ["Answers grounded in business info", "Seamless handoff to your team"],
        },
        {
          title: "Customer profiles that build themselves",
          body: "History and preferences are captured from conversations, not manual entry.",
          points: ["Unified customer history", "Automatic segmentation"],
        },
        {
          title: "Orders without the app-hopping",
          body: "Manage transaction details, payments, and follow-ups from the conversation flow.",
          points: ["Orders captured in context", "Payment status at a glance"],
        },
        {
          title: "More relevant campaigns",
          body: "Reach customers with context-aware messages that match what they need.",
          points: ["Segment-based campaigns", "Track engagement and conversion"],
        },
      ],
    },
    sandbox: {
      eyebrow: "TRY IT",
      heading: "Open the product. Try it, do not just look at it.",
      body: "Five modules, each one operable. Everything in them is sample data and nothing is sent anywhere.",
      tablistLabel: "Cekat modules",
      demoBadge: "Sample data",
      footNote: "Modules switch with the tab key or the left and right arrow keys.",
      modules: {
        chat: { id: "Chat", en: "Chat" },
        crm: { id: "CRM", en: "CRM" },
        oms: { id: "Orders", en: "Orders" },
        marketing: { id: "Marketing", en: "Marketing" },
        consultant: { id: "Consultant", en: "Consultant" },
      },
      chat: {
        search: "Search name or city",
        filterAll: "All",
        composerLabel: "Write a message",
        composerPlaceholder: "Write a reply to this customer…",
        send: "Send message",
        disclaimer: "Sample entries. This message is not sent anywhere.",
        stageHint: "Change stage",
        empty: "No customers match.",
      },
      crm: {
        search: "Search deals",
        empty: "Pick a deal to see its detail.",
        advance: "Advance stage",
        detail: "DEAL DETAIL",
        close: "Target close",
        wonHint: { id: "won", en: "won" },
      },
      oms: {
        search: "Search order number or name",
        all: "All",
        empty: "No orders match.",
        advance: "Advance status",
        stuck: "orders unpaid",
      },
      marketing: {
        audience: "PICK AN AUDIENCE",
        send: "Send broadcast",
        sent: "Sent",
        excluded: "Automatically excluded: numbers that blocked, and accounts that were disabled.",
        expected: "Expected result",
        note: "The figures below follow the segment you picked.",
        why: "Why this segment",
      },
      consultant: {
        ask: "Ask anything about this business",
        placeholder: "For example: how are sales looking this month?",
        send: "Ask",
        suggested: "TRY ONE OF THESE",
        sources: "Sources:",
        askMore: "Answers are drawn from sample business data. Anything outside it is left unanswered on purpose.",
        fallback: { id: "Outside the sample data", en: "Outside the sample data" },
      },
    },
    context: {
      eyebrow: "IN THE FIELD",
      heading: "It runs in the warehouse, at the desk, and on the road.",
      body: "The same claims as above, happening where the goods actually move.",
    },
    results: {
      eyebrow: "CUSTOMER STORY",
      heading: "Growth you can see in the numbers.",
      body: "Nature Craft Indonesia uses Cekat to keep service responsive as conversation volume grows.",
      quote: "Our closing rate used to be under 20 percent. Now it is above 40, and revenue went up with it.",
      attribution: "Hariyudi, Director, Nature Craft Indonesia",
      metrics: [
        { value: "2×", label: "higher closing rate" },
        { value: "+50%", label: "revenue growth" },
        { value: "24/7", label: "customer response coverage" },
      ],
      series: {
        caption: "Closing rate",
        bars: [
          { label: "Before", value: 20 },
          { label: "Now", value: 40, now: true },
        ],
      },
      cta: { label: "Read the customer story", href: "/en/cerita/nature-craft" },
    },
    trust: {
      eyebrow: "SECURITY & CONTROL",
      heading: "Trust is built into the platform.",
      body: "Customer data, team access, and channel connections are designed to keep your business in control.",
      points: [
        {
          title: "Data protection",
          body: "Data handling follows applicable personal data protection requirements.",
        },
        {
          title: "Official integrations",
          body: "WhatsApp connects through the official API with approved templates.",
        },
        {
          title: "Role-based access",
          body: "Control what information different teams and members can access.",
        },
        {
          title: "Security standards",
          body: "ISO 9001 and 27001 certifications support quality and information security.",
        },
      ],
    },
    pricing: {
      eyebrow: "PLANS & PRICING",
      heading: "Start with what you need. Scale with confidence.",
      body: "Try the full platform for 14 days. No credit card required.",
      planName: "Everything included",
      rate: "Free",
      period: "14 days",
      rateNote: "Then pick a plan based on conversation volume",
      trial: "Trial",
      included: [
        "AI-powered conversations",
        "Shared team inbox",
        "Customer profiles & history",
        "Orders, payments & follow-ups",
        "Segment-based broadcasts",
        "Conversation performance reports",
      ],
      footnote: "No long-term commitment. Change plans as your team grows.",
      compareHeading: "What's in every plan",
      compareRows: [
        { label: "Automatic replies", featured: "AI, around the clock", alternative: "Business hours only" },
        { label: "Connected channels", featured: "WhatsApp · IG · TikTok · Web", alternative: "Single channel" },
        { label: "Customer history", featured: "Automatic", alternative: "Entered by hand" },
        { label: "AI knowledge", featured: "Docs & pricing", alternative: "" },
        { label: "Orders & payments", featured: "Inside the chat", alternative: "Separate app" },
        { label: "Reporting", featured: "Conversation performance", alternative: "" },
      ],
      cta: { label: "Start your free trial", href: "https://chat.cekat.ai/register" },
      compare: { label: "Compare plans", href: "/en/harga" },
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Frequently asked questions",
      items: [
        {
          q: "Do I need to code?",
          a: "No. Connect your channels and add your business information, then your team can get started.",
        },
        {
          q: "How does AI handle questions it can’t answer?",
          a: "Questions outside your source information can be routed to your team for review and a response.",
        },
        {
          q: "Does my WhatsApp number stay mine?",
          a: "Yes. Your number remains connected to your business under your channel settings.",
        },
        {
          q: "Is there a long-term contract?",
          a: "Plans are available monthly and can be adjusted as your business needs change.",
        },
      ],
    },
    finalCta: {
      eyebrow: "START TODAY",
      heading: "Make every conversation count.",
      body: "See how Cekat helps teams serve customers and grow their business.",
      primary: { label: "Start your free trial", href: "https://chat.cekat.ai/register" },
      secondary: { label: "Talk to sales", href: "/en/contact-sales" },
    },
  },
};

export function getCopy3(locale: string): Copy3 {
  return locale === "en" ? COPY3.en : COPY3.id;
}

/* ------------------------------------------------------------------ photos */

/**
 * One photograph in the field band.
 *
 * `source` is not optional and has no default. A stock image with no recorded
 * origin is a defect, and an optional provenance field is one somebody will
 * leave blank — so it is part of the type and the array cannot be populated
 * without it.
 */
export type ContextPhoto = {
  /** Where the file came from. */
  source: { href: string; credit: string };
  /** Describes the frame. Never the product, never a keyword. */
  alt: { id: string; en: string };
  /**
   * What the scene is doing, in one line.
   *
   * A scenario, never a testimonial. These photographs show the product being
   * used; the people in them are not customers, and a caption in the shape of
   * "Rani, owner of…" would be inventing a person who does not exist. So the
   * line describes the work, and the attribution stops at the scene.
   */
  caption: { id: string; en: string };
  /** Grid footprint on desktop. `1` is one cell of the four-column row. */
  span: 1 | 2 | 4;
  /** Tall cells get their own treatment; a 16:9 source in a 1×1 box crops hard. */
  ratio: string;
};

/**
 * The field band — the product in the places it is actually used.
 *
 * Every other band on this page is drawn: hairlines, monospace labels, product
 * interface. That is the right register for a spec sheet and the wrong one for
 * proof, and this band is the proof — the same claims the diagrams make, shown
 * happening in a warehouse, at a desk, in a car.
 *
 * Provenance: supplied by the team, from `assets/framer/images`, as generated
 * product-in-context imagery. They are used as illustrative scenes, not as
 * documentary photographs of customers, and no caption here names a person.
 *
 * NOTE ON COLOUR: these are kept in full colour where the monochrome context
 * band drained its frames. A visitor is meant to read the product on the screen
 * inside the photograph — that is the evidence — and desaturating it removes the
 * one thing worth looking at.
 */
export const CONTEXT_PHOTOS: ContextPhoto[] = [
  {
    source: { href: "/images/ph3/field/warehouse.jpg", credit: "Cekat brand asset" },
    alt: {
      id: "Seorang pekerja gudang mengoperasikan printer label di depan rak bertumpuk kardus",
      en: "A warehouse worker operating a label printer in front of stacked cartons",
    },
    caption: {
      id: "Satu invoice jadi label siap kirim.",
      en: "One invoice becomes a shipping label.",
    },
    span: 2,
    ratio: "16 / 10",
  },
  {
    source: { href: "/images/ph3/field/cafe.jpg", credit: "Cekat brand asset" },
    alt: {
      id: "Seorang perempuan duduk di kedai Earl sambil membuka dasbor di laptop",
      en: "A woman in a cafe opening a dashboard on her laptop",
    },
    caption: {
      id: "Laporan harian, terbuka di mana saja.",
      en: "The daily report, open anywhere.",
    },
    span: 2,
    ratio: "16 / 10",
  },
  {
    source: { href: "/images/ph3/field/desk.jpg", credit: "Cekat brand asset" },
    alt: {
      id: "Seorang pekerja kantor dengan cangkir kopi, dua monitor menampilkan papan Cekat CRM",
      en: "An office worker with a coffee, two monitors showing a Cekat CRM board",
    },
    caption: {
      id: "Semua percakapan masuk ke satu papan.",
      en: "Every conversation lands on one board.",
    },
    span: 1,
    ratio: "4 / 3",
  },
  {
    source: { href: "/images/ph3/field/sofa.jpg", credit: "Cekat brand asset" },
    alt: {
      id: "Seorang perempuan di sofa memegang ponsel yang menampilkan asisten pemesanan ulang",
      en: "A woman on a sofa holding a phone showing a reorder assistant",
    },
    caption: {
      id: "Pemesanan ulang lewat chat, tanpa bolak-balik aplikasi.",
      en: "A reorder over chat, no app-hopping.",
    },
    span: 1,
    ratio: "4 / 3",
  },
  {
    source: { href: "/images/ph3/field/drive.jpg", credit: "Cekat brand asset" },
    alt: {
      id: "Seorang pengusaha mengendarai dengan ponsel terpasang menampilkan asisten AI",
      en: "A business owner driving with a mounted phone showing an AI assistant",
    },
    caption: {
      id: "Konsultasi AI jalan di jalan juga.",
      en: "The AI consultant works on the road too.",
    },
    span: 4,
    ratio: "21 / 9",
  },
];