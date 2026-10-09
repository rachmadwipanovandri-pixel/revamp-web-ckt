/**
 * Dummy data for the hands-on demo.
 *
 * Every name, number and message here is invented. The counts are chosen to be
 * plausible for a small Indonesian retail operation so the shapes read true, and
 * nothing is lifted from a real customer — the figures are round and the
 * identities are ordinary, because a demo that quotes a real business is a demo
 * that leaks.
 *
 * Strings are `{ id, en }` pairs rather than a locale switch at the call site, so
 * neither locale can be left untranslated by accident: add a key here and
 * `tsc` names both languages that owe you a string.
 */

export type L = { id: string; en: string };

/* ------------------------------------------------------------------ shared */

export const CHANNEL_LABEL = {
  whatsapp: { id: "WhatsApp", en: "WhatsApp" },
  instagram: { id: "Instagram", en: "Instagram" },
  tiktok: { id: "TikTok", en: "TikTok" },
  web: { id: "Web chat", en: "Web chat" },
} as const;

export type Channel = keyof typeof CHANNEL_LABEL;

export const CHANNELS = Object.keys(CHANNEL_LABEL) as Channel[];

/* -------------------------------------------------------------------- chat */

export type Msg = { from: "customer" | "cekat" | "you"; text: L; note?: L };

export type Contact = {
  id: string;
  name: string;
  place: L;
  channel: Channel;
  stage: Stage;
  value: L;
  thread: Msg[];
  replies: L[];
};

export const STAGE_LABEL: Record<Stage, L> = {
  0: { id: "Baru", en: "New" },
  1: { id: "Dihubungi", en: "Contacted" },
  2: { id: "Negosiasi", en: "Negotiating" },
  3: { id: "Menang", en: "Won" },
};

export type Stage = 0 | 1 | 2 | 3;

export const CONTACTS: Contact[] = [
  {
    id: "rani",
    name: "Rani",
    place: { id: "Bali", en: "Bali" },
    channel: "instagram",
    stage: 2,
    value: { id: "Rp 4,2 jt", en: "$268" },
    thread: [
      { from: "customer", text: { id: "Kak, linen set navy masih ready?", en: "Do you still have the navy linen set?" } },
      {
        from: "cekat",
        text: { id: "Masih ready. Untuk 2 pcs diskon 10%, jadi Rp 428.000.", en: "Still in stock. Two pieces takes 10% off, so $27." },
        note: { id: "dari info stok & harga", en: "from stock & pricing" },
      },
      { from: "customer", text: { id: "Bisa dikirim hari ini?", en: "Can it ship today?" } },
    ],
    replies: [
      { id: "Bisa — stok navy siap hari ini, dikirim sebelum 15.00.", en: "Yes — navy is ready to go, out before 3pm." },
      { id: "Link pembayarannya sudah saya kirim di atas ya.", en: "I have sent the payment link above." },
      { id: "Kalau mau dua warna, saya gabungkan dalam satu pengiriman.", en: "If you want two colours I can combine them into one shipment." },
    ],
  },
  {
    id: "bagus",
    name: "Bagus",
    place: { id: "Bandung", en: "Bandung" },
    channel: "whatsapp",
    stage: 1,
    value: { id: "Rp 1,9 jt", en: "$121" },
    thread: [
      { from: "customer", text: { id: "Ongkir ke Bandung berapa ya?", en: "How much is shipping to Bandung?" } },
      { from: "cekat", text: { id: "Rp 24.000, gratis di atas Rp 300.000.", en: "$1.60, free over $20." }, note: { id: "dari tabel ongkir", en: "from the shipping table" } },
    ],
    replies: [
      { id: "Bisa bayar QRIS juga ya, link-nya sudah saya sertakan.", en: "QRIS works too — the link is attached." },
      { id: "Kalau pesan di atas Rp 300.000, ongkirnya saya jadi nol ya.", en: "Over $20 and the shipping comes to zero." },
      { id: "Estimasi tiba dua hari kerja dari Bandung.", en: "Estimated arrival is two working days from Bandung." },
    ],
  },
  {
    id: "sinta",
    name: "Sinta",
    place: { id: "Jakarta", en: "Jakarta" },
    channel: "whatsapp",
    stage: 3,
    value: { id: "Rp 7,4 jt", en: "$472" },
    thread: [
      { from: "customer", text: { id: "Mau pesan 30 pcs untuk kantor, bisa harga khusus?", en: "I want 30 units for the office — any bulk pricing?" } },
      { from: "cekat", text: { id: "Untuk 30 pcs diskon 18%. Saya buatkan pratinjaunya.", en: "30 units takes 18% off. Let me draft the quote." }, note: { id: "dari aturan diskon bertingkat", en: "from the tiered discount rules" } },
      { from: "customer", text: { id: "Oke, kirim ya.", en: "Great, send it over." } },
    ],
    replies: [
      { id: "Pratinjau sudah terkirim, berlaku sampai akhir minggu.", en: "The quote is sent, valid until the end of the week." },
      { id: "Kalau dikonfirmasi hari ini, pengiriman kami percepat gratis.", en: "Confirm today and we upgrade shipping at no cost." },
      { id: "Untuk pesanan di atas 20 pcs, invoice bisa dipecah per departemen.", en: "Over 20 units the invoice can be split per department." },
    ],
  },
  {
    id: "yosua",
    name: "Yosua",
    place: { id: "Surabaya", en: "Surabaya" },
    channel: "tiktok",
    stage: 0,
    value: { id: "Rp 640 rb", en: "$41" },
    thread: [{ from: "customer", text: { id: "Kopi arabika-nya masih ada?", en: "Do you still have the arabica?" } }],
    replies: [
      { id: "Masih ada. Mau saya kirim kartunya dulu?", en: "Still have it. Want me to send the card first?" },
      { id: "Untuk pesanan di atas dua sas, ongkir gratis ya.", en: "Over two bags, shipping is on us." },
      { id: "Roasting terakhirnya hari Senin, masih aman untuk minggu ini.", en: "Last roast was Monday, still good for this week." },
    ],
  },
  {
    id: "maya",
    name: "Maya",
    place: { id: "Ubud", en: "Ubud" },
    channel: "web",
    stage: 1,
    value: { id: "Rp 5,1 jt", en: "$325" },
    thread: [
      { from: "customer", text: { id: "Bisa kirim katalog terbaru?", en: "Could you send the latest catalogue?" } },
      { from: "cekat", text: { id: "Sudah saya kirim, ada di atas.", en: "Sent — it is above." }, note: { id: "dari pustaka dokumen", en: "from the document library" } },
    ],
    replies: [
      { id: "Kalau ada yang ingin ditanyakan soal bahan, tanya saja di sini.", en: "Ask here if you want to know anything about the fabric." },
      { id: "Ada warna sage yang baru masuk bulan ini.", en: "There is a new sage colour in this month." },
      { id: "Semua kain linen kami comes dengan label care instruction.", en: "All our linen comes with a care instruction label." },
    ],
  },
  {
    id: "tiara",
    name: "Tiara",
    place: { id: "Makassar", en: "Makassar" },
    channel: "whatsapp",
    stage: 2,
    value: { id: "Rp 3,8 jt", en: "$242" },
    thread: [
      { from: "customer", text: { id: "Pesanan bulan lalu saya pesan lagi ya.", en: "I would like to reorder last month." } },
      { from: "cekat", text: { id: "Siap, saya pakai harga pelanggan Gold Anda yang terakhir.", en: "On it — I'll use your last Gold customer price." }, note: { id: "dari riwayat pesanan", en: "from order history" } },
    ],
    replies: [
      { id: "Sudah saya buatkan, tinggal konfirmasi jumlah pcsnya.", en: "Drafted — just confirm the quantity." },
      { id: "Kalau jumlahnya sama seperti bulan lalu, tinggal saya kirim link bayar.", en: "Same quantity as last month and I'll send the payment link." },
      { id: "Pengiriman ke Makassar tiga hari kerja, sudah termasuk di harga.", en: "Delivery to Makassar is three working days, included in the price." },
    ],
  },
];

/* --------------------------------------------------------------------- CRM */

export type Deal = {
  id: string;
  title: L;
  customer: string;
  value: number;
  close: string;
  stage: Stage;
  note: L;
};

export const DEALS: Deal[] = [
  { id: "d1", title: { id: "Grosir linen 30 pcs", en: "Linen bulk, 30 units" }, customer: "Sinta", value: 472000, close: "2026-10-12", stage: 2, note: { id: "Menunggu POurrection dari klien.", en: "Waiting on the client's purchase order." } },
  { id: "d2", title: { id: "Set navy 2 pcs", en: "Navy set, 2 units" }, customer: "Rani", value: 428000, close: "2026-10-09", stage: 2, note: { id: "Sudah dikirim link pembayaran.", en: "Payment link sent." } },
  { id: "d3", title: { id: "Katalog Autumn untuk resellers", en: "Autumn catalogue for resellers" }, customer: "Bagus", value: 275000, close: "2026-10-14", stage: 1, note: { id: "Menunggu konfirmasi budget.", en: "Waiting on budget confirmation." } },
  { id: "d4", title: { id: "Kopi arabika 6 sas", en: "Arabica, 6 bags" }, customer: "Yosua", value: 810000, close: "2026-10-10", stage: 1, note: { id: "Pertanyaan stok sudah dijawab otomatis.", en: "Stock question answered automatically." } },
  { id: "d5", title: { id: "Sutra merah 4 pcs", en: "Red silk, 4 units" }, customer: "Tiara", value: 1880000, close: "2026-10-11", stage: 3, note: { id: "Sudah jadi, sedang dikirim.", en: "Closed, in fulfilment." } },
  { id: "d6", title: { id: "Restock untuk kedai", en: "Restock for the cafe" }, customer: "Maya", value: 940000, close: "2026-10-20", stage: 0, note: { id: "Percakapan baru masuk lewat web chat.", en: "New conversation from web chat." } },
  { id: "d7", title: { id: "Serum glow 12 pcs", en: "Glow serum, 12 units" }, customer: "Sinta", value: 2160000, close: "2026-10-18", stage: 2, note: { id: "Negosiasi volume sedang berjalan.", en: "Volume negotiation under way." } },
  { id: "d8", title: { id: "Batik heritage 3 pcs", en: "Heritage batik, 3 units" }, customer: "Bagus", value: 690000, close: "2026-10-22", stage: 0, note: { id: "Perlu dijadwalkan hari ini.", en: "Needs scheduling today." } },
];

/* --------------------------------------------------------------------- OMS */

export type OrderStage = 0 | 1 | 2 | 3;

export const ORDER_STAGE_LABEL: Record<OrderStage, L> = {
  0: { id: "Dibuat", en: "Created" },
  1: { id: "Dibayar", en: "Paid" },
  2: { id: "Dikirim", en: "Shipped" },
  3: { id: "Selesai", en: "Closed" },
};

export type Order = {
  id: string;
  customer: string;
  items: L;
  total: string;
  stage: OrderStage;
  courier: L;
};

export const ORDERS: Order[] = [
  { id: "#NC-2481", customer: "Rani", items: { id: "Linen set navy ×2", en: "Navy linen set ×2" }, total: "Rp 428.000", stage: 2, courier: { id: "JNE · JRX8821045", en: "JNE · JRX8821045" } },
  { id: "#NC-2484", customer: "Bagus", items: { id: "Kemeja batik ×1", en: "Batik shirt ×1" }, total: "Rp 275.000", stage: 3, courier: { id: "SiCepat · 0092812", en: "SiCepat · 0092812" } },
  { id: "#NC-2486", customer: "Sinta", items: { id: "Serum glow ×12", en: "Glow serum ×12" }, total: "Rp 2.160.000", stage: 1, courier: { id: "Belum dijemput", en: "Not collected" } },
  { id: "#NC-2488", customer: "Tiara", items: { id: "Sutra merah ×4", en: "Red silk ×4" }, total: "Rp 1.880.000", stage: 3, courier: { id: "AnterAja · 77210044", en: "AnterAja · 77210044" } },
  { id: "#NC-2490", customer: "Yosua", items: { id: "Kopi arabika ×6 sas", en: "Arabica ×6 bags" }, total: "Rp 810.000", stage: 0, courier: { id: "Menunggu pembayaran", en: "Awaiting payment" } },
  { id: "#NC-2492", customer: "Maya", items: { id: "Linen sage ×3", en: "Sage linen ×3" }, total: "Rp 612.000", stage: 1, courier: { id: "Belum dijemput", en: "Not collected" } },
  { id: "#NC-2494", customer: "Rani", items: { id: "Katalog Autumn (e-book)", en: "Autumn catalogue (e-book)" }, total: "Rp 0", stage: 3, courier: { id: "Dikirim via email", en: "Sent by email" } },
];

/* --------------------------------------------------------------- marketing */

export type Segment = {
  id: string;
  label: L;
  people: number;
  /** Projected open rate, as a percentage. Tied to the segment, not invented. */
  open: number;
  /** Projected conversion, as a percentage. */
  buy: number;
  note: L;
};

export const SEGMENTS: Segment[] = [
  { id: "all", label: { id: "Semua pelanggan", en: "All customers" }, people: 8902, open: 68, buy: 4.1, note: { id: "Basis 8.902 pelanggan aktif.", en: "Based on 8,902 active customers." } },
  { id: "gold", label: { id: "Pelanggan Gold", en: "Gold customers" }, people: 1284, open: 72, buy: 9.4, note: { id: "Belanja ≥ 5 kali, nilai ≥ Rp 3 jt.", en: "Bought 5+ times, value ≥ $190." } },
  { id: "silver", label: { id: "Pelanggan Silver", en: "Silver customers" }, people: 2410, open: 54, buy: 2.8, note: { id: "Belanja 2–4 kali.", en: "Bought 2–4 times." } },
  { id: "lapsed", label: { id: "Tidak belanja 90 hari", en: "No purchase in 90 days" }, people: 688, open: 41, buy: 1.9, note: { id: "Perluitoneal pengingat, bukan promo.", en: "Needs a reminder, not a discount." } },
  { id: "vip", label: { id: "Sering pesan ulang", en: "Frequent reorders" }, people: 1104, open: 81, buy: 14.0, note: { id: "Pesan ulang ≤ 14 hari.", en: "Reorders within 14 days." } },
];

/* -------------------------------------------------------------- consultant */

export type Answer = {
  headline: L;
  body: L;
  metrics: { value: string; label: L }[];
  sources: L[];
};

export type Question = { id: string; ask: L; answer: Answer };

export const QUESTIONS: Question[] = [
  {
    id: "revenue",
    ask: { id: "Bagaimana penjualan saya bulan ini?", en: "How are sales looking this month?" },
    answer: {
      headline: { id: "Omzet naik 34% dari bulan lalu", en: "Revenue is up 34% on last month" },
      body: {
        id: "Penyumbang terbesar adalah pelanggan Gold yang pesan ulang. Katalog Autumn masih berjalan, tapi katalog baru lebih cepat dikonversi.",
        en: "Reordering Gold customers are the biggest contributor. The Autumn catalogue is still running, but the newer one converts faster.",
      },
      metrics: [
        { value: "Rp 41,6 jt", label: { id: "omzet bulan ini", en: "revenue this month" } },
        { value: "1.284", label: { id: "pelanggan Gold", en: "Gold customers" } },
        { value: "9,4%", label: { id: "tingkat konversi", en: "conversion rate" } },
      ],
      sources: [{ id: "laporan penjualan 30 hari", en: "30-day sales report" }, { id: "segmentasi pelanggan", en: "customer segments" }],
    },
  },
  {
    id: "top",
    ask: { id: "Produk apa yang paling laris?", en: "Which product sells best?" },
    answer: {
      headline: { id: "Linen set navy adalah produk teratas", en: "The navy linen set is the top seller" },
      body: {
        id: "Diskon 10% untuk pembelian dua pcs membuat produk ini paling sering dipilih, terutama lewat Instagram.",
        en: "The 10% two-piece discount makes it the most chosen item, mostly through Instagram.",
      },
      metrics: [
        { value: "412", label: { id: "terjual bulan ini", en: "sold this month" } },
        { value: "Rp 428.000", label: { id: "harga satuan", en: "unit price" } },
        { value: "Instagram", label: { id: "kanal teratas", en: "top channel" } },
      ],
      sources: [{ id: "katalog produk", en: "product catalogue" }, { id: "riwayat pesanan", en: "order history" }],
    },
  },
  {
    id: "todo",
    ask: { id: "Apa yang perlu saya kerjakan hari ini?", en: "What should I work on today?" },
    answer: {
      headline: { id: "Tiga hal menunggu Anda", en: "Three things are waiting on you" },
      body: {
        id: "Satu pesanan belum dibayar, satu pelanggan Gold belum ditindaklanjuti, dan satu stok menipis. Sisanya sudah ditangani AI.",
        en: "One order is unpaid, one Gold customer has not been followed up, and one item is running low. Everything else the AI handled.",
      },
      metrics: [
        { value: "1", label: { id: "pesanan menunggu bayar", en: "orders awaiting payment" } },
        { value: "1", label: { id: "stok menipis", en: "low stock items" } },
        { value: "47", label: { id: "chat ditangani AI", en: "chats handled by AI" } },
      ],
      sources: [{ id: "antrian chat", en: "chat queue" }, { id: "laporan stok", en: "stock report" }],
    },
  },
  {
    id: "lapsed",
    ask: { id: "Siapa yang perlu dikejar lagi?", en: "Who should I chase up?" },
    answer: {
      headline: { id: "688 pelanggan dingin, 74 di antaranya Gold", en: "688 cold customers, 74 of them Gold" },
      body: {
        id: "Saya sarankan dikirim pesan ringan, bukan promo — yang dingin biasanya kembali karena terlewat, bukan karena harga.",
        en: "I would send a light message rather than a discount — the cold ones tend to return because they were missed, not over price.",
      },
      metrics: [
        { value: "688", label: { id: "total dingin", en: "total cold" } },
        { value: "74", label: { id: "di antaranya Gold", en: "of which Gold" } },
        { value: "41%", label: { id: "tingkat buka", en: "open rate" } },
      ],
      sources: [{ id: "segmentasi pelanggan", en: "customer segments" }, { id: "histori pesanan", en: "order history" }],
    },
  },
  {
    id: "stock",
    ask: { id: "Stok linen masih cukup?", en: "Is linen stock holding up?" },
    answer: {
      headline: { id: "Cukup untuk 3 minggu lagi", en: "Enough for three more weeks" },
      body: {
        id: "Warna navy paling cepat habis. Dengan pace sekarang, perlu_PO baru minggu depan.",
        en: "Navy goes first. At the current rate a new purchase order is needed next week.",
      },
      metrics: [
        { value: "184 pcs", label: { id: "sisa navy", en: "navy remaining" } },
        { value: "612 pcs", label: { id: "sisa total", en: "total remaining" } },
        { value: "21 hari", label: { id: "cadangan", en: "cover" } },
      ],
      sources: [{ id: "laporan stok", en: "stock report" }, { id: "riwayat pesanan", en: "order history" }],
    },
  },
];

/** Number formatting that does not pretend to know the reader's locale. */
export function money(value: number, en: boolean): string {
  return en
    ? "$" + Math.round(value / 3800).toLocaleString("en-US")
    : "Rp " + value.toLocaleString("id-ID");
}