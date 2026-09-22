import type { Locale } from "@/i18n/routing";

type L10n = Record<Locale, string>;

const l = (id: string, en = id): L10n => ({ id, en });

export type ChatCardTone = "amber" | "blue" | "green";

export type ChatCard = {
  title: L10n;
  meta: L10n;
  rows: { label: L10n; value: L10n }[];
  total?: { label: L10n; value: L10n };
  /** Draw the decorative QR placeholder under the line items. */
  qr?: boolean;
  status?: L10n;
  statusTone?: ChatCardTone;
};

export type ChatProduct = {
  image: { src: string; alt: L10n };
  title: L10n;
  price: L10n;
};

export type ChatRating = {
  title: L10n;
  prompt: L10n;
  options: L10n[];
};

/**
 * `delay` is the minimum interval before this event lands, in milliseconds.
 * The player may hold the preceding message longer when it needs more reading
 * time. `time` is unrelated: it is the message's wall-clock stamp in story
 * time, held once as 24-hour "HH:MM" and formatted per locale at render so a
 * stamp cannot drift between the two message files.
 */
export type ChatStep =
  | { kind: "user"; text: L10n; delay: number; time: string }
  | {
      kind: "ai";
      text: L10n;
      delay: number;
      time: string;
      from?: string;
      outreach?: boolean;
    }
  | { kind: "card"; card: ChatCard; delay: number; time: string }
  | { kind: "product"; product: ChatProduct; delay: number; time: string }
  | { kind: "rating"; rating: ChatRating; delay: number; time: string }
  /** System event line, the platform's voice rather than a sender's. */
  | {
      kind: "chip";
      text: L10n;
      delay: number;
      time?: string;
      accent?: boolean;
    }
  /** Time skip: relative label plus the optional date the thread resumes on. */
  | { kind: "divider"; text: L10n; date?: L10n; delay: number };

export type ChatModeKey = "lead" | "customerService";

export type ChatMode = {
  /** Client descriptor retained alongside the conversation script. */
  client: L10n;
  /** Business name in the WhatsApp-style header. */
  business: string;
  /** Date separator pinned above the opening message. */
  date: L10n;
  steps: ChatStep[];
};

export type ChatScenario = {
  key: "retail" | "travel" | "healthcare" | "education";
  label: L10n;
  modes: Record<ChatModeKey, ChatMode>;
};

export const HERO_CHAT_MODES: { key: ChatModeKey; label: L10n }[] = [
  { key: "lead", label: l("Lead Generation") },
  { key: "customerService", label: l("Customer Service") },
];

type AiOptions = Partial<
  Pick<Extract<ChatStep, { kind: "ai" }>, "delay" | "from" | "outreach">
>;

type ChipOptions = Partial<
  Pick<Extract<ChatStep, { kind: "chip" }>, "delay" | "time" | "accent">
>;

const user = (
  time: string,
  id: string,
  en: string,
  delay = 1600,
): ChatStep => ({ kind: "user", delay, time, text: l(id, en) });

const ai = (
  time: string,
  id: string,
  en: string,
  options: AiOptions = {},
): ChatStep => {
  const { delay = 1900, ...rest } = options;
  return { kind: "ai", delay, time, text: l(id, en), ...rest };
};

const chip = (id: string, en: string, options: ChipOptions = {}): ChatStep => {
  const { delay = 1600, ...rest } = options;
  return { kind: "chip", delay, text: l(id, en), ...rest };
};

const divider = (id: string, en: string, date?: L10n): ChatStep => ({
  kind: "divider",
  delay: 1400,
  text: l(id, en),
  date,
});

const card = (time: string, data: ChatCard, delay = 2000): ChatStep => ({
  kind: "card",
  delay,
  time,
  card: data,
});

const product = (
  time: string,
  src: string,
  alt: L10n,
  title: L10n,
  price: L10n,
): ChatStep => ({
  kind: "product",
  delay: 2000,
  time,
  product: { image: { src, alt }, title, price },
});

const rating = (time: string, data: ChatRating): ChatStep => ({
  kind: "rating",
  delay: 2000,
  time,
  rating: data,
});

const row = (
  idLabel: string,
  enLabel: string,
  idValue: string,
  enValue: string,
) => ({
  label: l(idLabel, enLabel),
  value: l(idValue, enValue),
});

const invoice = (status: L10n, statusTone: ChatCardTone): ChatCard => ({
  title: l("Invoice · SehatMax Store"),
  meta: l("No. INV-2026-0827 · Kak Andi", "No. INV-2026-0827 · Andi"),
  rows: [
    row(
      "Vitamin C 1000mg (2 botol)",
      "Vitamin C 1000mg (2 bottles)",
      "Rp 170.000",
      "Rp 170,000",
    ),
    row(
      "Omega-3 1000mg (1 botol)",
      "Omega-3 1000mg (1 bottle)",
      "Rp 120.000",
      "Rp 120,000",
    ),
    row("Ongkir JNE Reguler", "JNE Regular shipping", "Rp 18.000", "Rp 18,000"),
  ],
  total: { label: l("Total"), value: l("Rp 308.000", "Rp 308,000") },
  qr: true,
  status,
  statusTone,
});

const retailReorderInvoice: ChatCard = {
  title: l("Invoice · SehatMax Store"),
  meta: l("Reorder #0918 · Andi"),
  rows: [
    row(
      "Vitamin C 1000mg (2 botol)",
      "Vitamin C 1000mg (2 bottles)",
      "Rp 170.000",
      "Rp 170,000",
    ),
    row(
      "Zinc 500mg (3 botol)",
      "Zinc 500mg (3 bottles)",
      "Rp 112.000",
      "Rp 112,000",
    ),
  ],
  total: { label: l("Total"), value: l("Rp 282.000", "Rp 282,000") },
  status: l("Menunggu Pembayaran", "Awaiting Payment"),
  statusTone: "green",
};

const booking: ChatCard = {
  title: l("Booking · GlassSkin Clinic"),
  meta: l("No. BK-2026-0823 · Sarah"),
  rows: [
    row("Layanan", "Service", "Skinbooster", "Skinbooster"),
    row("Tanggal", "Date", "Sabtu, 23 Agustus", "Saturday, August 23"),
    row("Jam", "Time", "14.00 WIB", "2:00 PM WIB"),
    row("Dokter", "Doctor", "Dr. Nadia", "Dr. Nadia"),
  ],
  status: l("Booking Terkonfirmasi", "Booking Confirmed"),
  statusTone: "green",
};

const followUpBooking: ChatCard = {
  title: l(
    "Konsultasi Follow-up · GlassSkin",
    "Follow-up Consultation · GlassSkin",
  ),
  meta: l("No. CF-2026-0820 · Sarah"),
  rows: [
    row(
      "Jenis",
      "Type",
      "Konsultasi Post-Treatment",
      "Post-treatment consultation",
    ),
    row("Tanggal", "Date", "Rabu, 20 Agustus", "Wednesday, August 20"),
    row("Jam", "Time", "09.00 WIB", "9:00 AM WIB"),
    row("Dokter", "Doctor", "Dr. Nadia", "Dr. Nadia"),
  ],
  status: l("Terkonfirmasi · Gratis", "Confirmed · Free"),
  statusTone: "blue",
};

const tourPackage: ChatCard = {
  title: l("Paket Wisata · Liburan Travel", "Travel Package · Liburan Travel"),
  meta: l("Honeymoon Bali 4D3N · 2 Pax"),
  rows: [
    row("Tanggal", "Dates", "15–18 September 2026", "September 15–18, 2026"),
    row("Hotel", "Hotel", "Bintang 4 Seminyak", "4-star Seminyak"),
    row(
      "Include",
      "Includes",
      "Private tour, candle dinner, breakfast",
      "Private tour, candle dinner, breakfast",
    ),
    row("Harga/pax", "Price/pax", "Rp 5.800.000", "Rp 5,800,000"),
  ],
  status: l("Itinerary dikirim ke WhatsApp", "Itinerary sent to WhatsApp"),
  statusTone: "blue",
};

const updatedTour: ChatCard = {
  title: l(
    "Pembaruan Booking · Liburan Travel",
    "Booking Update · Liburan Travel",
  ),
  meta: l("No. BK-2026-0922 · 2 Pax"),
  rows: [
    row(
      "Tanggal lama",
      "Previous dates",
      "15–18 September 2026",
      "September 15–18, 2026",
    ),
    row(
      "Tanggal baru",
      "New dates",
      "22–25 September 2026",
      "September 22–25, 2026",
    ),
    row("Hotel", "Hotel", "Tetap – Alaya Ubud", "Unchanged – Alaya Ubud"),
    row("Status", "Status", "Diperbarui ✓", "Updated ✓"),
  ],
  status: l("Terkonfirmasi", "Confirmed"),
  statusTone: "green",
};

const courseTrial: ChatCard = {
  title: l("Free Trial Class · English Training"),
  meta: l("TC-2026-0830 · Bu Ratna", "TC-2026-0830 · Mrs. Ratna"),
  rows: [
    row("Program", "Program", "High Star English", "High Star English"),
    row("Tanggal", "Date", "Sabtu, 30 Agustus", "Saturday, August 30"),
    row("Course Consultant", "Course Consultant", "Yulia", "Yulia"),
    row(
      "Jam operasional",
      "Operating hours",
      "09.00 – 17.00 WIB",
      "9:00 AM – 5:00 PM WIB",
    ),
  ],
  status: l(
    "Terdaftar · Tunjukkan pesan ini di center",
    "Registered · Show this message at the centre",
  ),
  statusTone: "green",
};

/**
 * Conversations captured from the approved reference prototype. The four
 * industry tabs remain stable, while each has an independent Lead Generation
 * and Customer Service story. Client names are deliberately visible outside
 * the phone and in the chat header so a visitor always knows which business
 * they are viewing.
 */
export const HERO_CHAT_SCENARIOS: ChatScenario[] = [
  {
    key: "retail",
    label: l("Retail"),
    modes: {
      lead: {
        client: l("SehatMax Store · Retail & D2C"),
        business: "SehatMax Store",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "23:06",
            "Kak, Vitamin C 1000mg masih ada?",
            "Hi, is Vitamin C 1000mg still available?",
            0,
          ),
          product(
            "23:06",
            "/images/home/hero-chat-vitamin-c.jpg",
            l("Vitamin C 1000mg"),
            l("Vitamin C 1000mg"),
            l("Rp 85.000/botol", "Rp 85,000/bottle"),
          ),
          ai(
            "23:07",
            "Masih ada Kak! Rp 85.000/botol. Mau berapa?",
            "It is! Rp 85,000 per bottle. How many would you like?",
          ),
          user("23:08", "2 botol deh", "Two bottles, please"),
          ai(
            "23:08",
            "Boleh minta nama penerima dan alamat pengirimannya Kak?",
            "May I have the recipient's name and delivery address?",
          ),
          user(
            "23:10",
            "Andi Wijaya, Jl. Sudirman No.12, Jakarta Selatan",
            "Andi Wijaya, 12 Sudirman Street, South Jakarta",
          ),
          ai(
            "23:11",
            "Oke Kak Andi! Ongkir JNE Reguler Rp 18.000. Btw, pelanggan yang beli Vitamin C juga sering tambah Omega-3 sekalian buat daily health stack. Mau aku tambahin?",
            "Great, Andi! JNE Regular shipping is Rp 18,000. Customers who buy Vitamin C often add Omega-3 for a daily health stack too. Would you like to add it?",
          ),
          user(
            "23:12",
            "Boleh tambahin 1 botol Omega-3 ya",
            "Please add one bottle of Omega-3",
          ),
          product(
            "23:12",
            "/images/home/hero-chat-omega-3.jpg",
            l("Omega-3 1000mg"),
            l("Omega-3 1000mg"),
            l("Rp 120.000", "Rp 120,000"),
          ),
          ai(
            "23:13",
            "Omega-3 1000mg Rp 120.000. Total: Vitamin C 2x + Omega-3 1x + ongkir = Rp 308.000. Konfirmasi?",
            "Omega-3 1000mg is Rp 120,000. Total: 2 Vitamin C + 1 Omega-3 + shipping = Rp 308,000. Confirm?",
          ),
          user("23:14", "Confirmed!", "Confirmed!"),
          ai(
            "23:14",
            "Siap! Invoice dan link pembayaran ada di bawah ya Kak",
            "All set! The invoice and payment link are below",
          ),
          card(
            "23:14",
            invoice(l("Menunggu Pembayaran", "Awaiting Payment"), "amber"),
          ),
          chip(
            "Pesanan tersimpan di CRM · Menunggu pembayaran",
            "Order saved to CRM · Awaiting payment",
          ),
          divider("15 menit kemudian", "15 minutes later"),
          ai(
            "23:29",
            "Kak Andi, ada yang bisa aku bantu untuk proses pembayarannya? Pesanan masih aktif ya",
            "Andi, can I help with the payment? Your order is still active",
            { outreach: true },
          ),
          user(
            "23:30",
            "Oke mau bayar sekarang",
            "Okay, I am ready to pay now",
          ),
          ai(
            "23:30",
            "Pembayaran berhasil diterima, pesanan langsung diproses!",
            "Payment received successfully. Your order is being processed right away!",
          ),
          card(
            "23:30",
            invoice(l("Pembayaran Diterima ✓", "Payment Received ✓"), "green"),
          ),
          divider(
            "3 hari kemudian",
            "3 days later",
            l("21 Agustus 2026", "August 21, 2026"),
          ),
          ai(
            "10:15",
            "Kak Andi, paket sudah sampai ya! Mau aku set reminder reorder biar ga kehabisan?",
            "Andi, your package has arrived! Would you like a reorder reminder so you do not run out?",
            { outreach: true },
          ),
          user("10:21", "Iya boleh!", "Yes, please!"),
          chip(
            "Reminder reorder 30 hari dijadwalkan · Pelanggan tersimpan di CRM",
            "30-day reorder reminder scheduled · Customer saved to CRM",
          ),
          chip(
            "Penjualan Rp 308.000 teratribusi ke iklan Meta Anda",
            "Rp 308,000 sale attributed to your Meta ad",
            { accent: true },
          ),
        ],
      },
      customerService: {
        client: l("SehatMax Store · Retail & D2C"),
        business: "SehatMax Store",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "14:31",
            "Kak pesanan INV-2026-0818 udah 3 hari belum sampai nih",
            "Hi, my order INV-2026-0818 has not arrived after three days",
            0,
          ),
          ai(
            "14:31",
            "Halo Kak Andi! Aku cek sekarang ya. Paketnya sempat tertahan di hub JNE Bekasi dari kemarin, estimasi tiba besok. Maaf ya Kak!",
            "Hi Andi! I will check now. Your package has been held at the JNE Bekasi hub since yesterday and is estimated to arrive tomorrow. Sorry about that!",
          ),
          chip(
            "Keluhan tercatat · Voucher diskon 10% otomatis terkirim ke WhatsApp Kak Andi",
            "Issue logged · A 10% discount voucher was sent automatically to Andi's WhatsApp",
          ),
          divider(
            "30 hari kemudian",
            "30 days later",
            l("18 September 2026", "September 18, 2026"),
          ),
          ai(
            "09:15",
            "Kak Andi, biasanya 2 botol Vitamin C habis sekitar sebulan. Mau aku bantu reorder? Ada promo bundle sama Zinc 500mg, hemat 18%",
            "Andi, two bottles of Vitamin C usually run out in about a month. Would you like help reordering? There is an 18% off bundle with Zinc 500mg",
            { outreach: true },
          ),
          user(
            "09:22",
            "Boleh, tambahin Zinc juga ya",
            "Sure, please add Zinc too",
          ),
          ai(
            "09:23",
            "Siap! Invoice langsung aku buatkan",
            "Certainly! I will make the invoice now",
          ),
          card("09:23", retailReorderInvoice),
          chip(
            "Repeat order Rp 282.000 · Penjualan dari existing customer tercatat di CRM",
            "Rp 282,000 repeat order · Existing-customer sale recorded in CRM",
            { accent: true },
          ),
        ],
      },
    },
  },
  {
    key: "travel",
    label: l("Travel"),
    modes: {
      lead: {
        client: l("Liburan Travel · Tour & Travel"),
        business: "Liburan Travel",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "19:01",
            "Info paket Bali 4D3N dong buat 2 orang bulan September",
            "Could I get information on a Bali 4D3N package for two people in September?",
            0,
          ),
          ai(
            "19:02",
            "Seru! Untuk honeymoon, family trip, atau friends trip Kak? Dan budget per orang sekitar berapa?",
            "Sounds exciting! Is it for a honeymoon, family trip, or friends trip? And what is the budget per person?",
          ),
          user(
            "19:05",
            "Honeymoon, budget sekitar 6 juta per orang",
            "Honeymoon, with a budget of about Rp 6 million per person",
          ),
          ai(
            "19:06",
            "Perfect! Ada Paket Honeymoon Bali 4D3N Rp 5.8 juta/orang, include hotel bintang 4 Seminyak, private tour, candle dinner, dan breakfast setiap hari",
            "Perfect! We have a Bali Honeymoon 4D3N package for Rp 5.8 million per person, including a 4-star Seminyak hotel, private tour, candle dinner, and daily breakfast",
          ),
          card("19:06", tourPackage),
          ai(
            "19:07",
            "Ini best seller untuk honeymoon Kak, biasanya sold out 2 minggu sebelum keberangkatan. Mau aku hold dulu?",
            "This is our honeymoon best seller and it is usually sold out two weeks before departure. Would you like me to hold it first?",
          ),
          user("19:11", "Iya please hold!", "Yes, please hold it!"),
          ai(
            "19:12",
            "Done! Itinerary lengkap sudah aku kirim ke WhatsApp. Agen kita menghubungi dalam 2 jam",
            "Done! I sent the full itinerary to WhatsApp. Our agent will contact you within two hours",
          ),
          chip(
            "Paket Honeymoon Bali held · Itinerary terkirim · Penjualan teratribusi ke iklan Meta Anda",
            "Bali Honeymoon package held · Itinerary sent · Sale attributed to your Meta ad",
            { accent: true },
          ),
          divider("3 jam kemudian", "3 hours later"),
          ai(
            "22:00",
            "Kak, tambahan populer buat honeymoon: Nusa Penida Day Trip Rp 450.000/pax dan Couples Spa Rp 350.000/pasang. Mau ditambahkan ke paket?",
            "Popular honeymoon add-ons: Nusa Penida Day Trip at Rp 450,000 per person and Couples Spa at Rp 350,000 per couple. Would you like to add them?",
            { outreach: true },
          ),
          user("22:07", "Tambahin keduanya sekalian!", "Please add both!"),
          chip(
            "Nusa Penida + Couples Spa +Rp 1.250.000 ditambahkan · Invoice diperbarui · Dikirim ke WhatsApp",
            "Nusa Penida + Couples Spa +Rp 1,250,000 added · Invoice updated · Sent to WhatsApp",
            { accent: true },
          ),
        ],
      },
      customerService: {
        client: l("Liburan Travel · Tour & Travel"),
        business: "Liburan Travel",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "10:31",
            "Kak mau ganti tanggal keberangkatan ke Bali dari 15 Sept jadi 22 Sept bisa ga?",
            "Can I change my Bali departure date from September 15 to September 22?",
            0,
          ),
          ai(
            "10:32",
            "Bisa Kak! Aku cek booking kamu: Paket Honeymoon Bali 2 pax, 15-18 September. Tanggal 22-25 September masih available, aku update sekarang",
            "You can! I checked your booking: Bali Honeymoon package for two people, September 15–18. September 22–25 is still available, so I will update it now",
          ),
          card("10:32", updatedTour),
          ai(
            "10:33",
            "Semua hotel dan tour sudah disesuaikan ke tanggal baru. Itinerary baru sudah aku kirim ke WhatsApp",
            "All hotels and tours have been adjusted to the new dates. I sent the new itinerary to WhatsApp",
          ),
          chip(
            "Booking diperbarui ke 22-25 September · Itinerary baru terkirim · Reminder H-7 dan H-3 dijadwalkan",
            "Booking updated to September 22–25 · New itinerary sent · H-7 and H-3 reminders scheduled",
          ),
          divider(
            "H-7",
            "7 days before departure",
            l("15 September 2026", "September 15, 2026"),
          ),
          ai(
            "09:00",
            "Kak! 7 hari lagi berangkat ke Bali, excited ya! Mau tambah Couples Spa 2 jam Rp 350.000/pasang buat semakin romantis?",
            "Seven days until your Bali trip, exciting! Would you like to add a two-hour Couples Spa for Rp 350,000 per couple?",
            { outreach: true },
          ),
          user("09:06", "Boleh tambahin!", "Yes, please add it!"),
          ai(
            "09:07",
            "Spa sudah ditambahkan di itinerary hari ke-3 ya Kak! Selamat berbulan madu ❤️",
            "The spa is now in your day-three itinerary! Have a wonderful honeymoon ❤️",
          ),
          chip(
            "Couples Spa Rp 350.000 ditambahkan · Invoice final terkirim · Reminder H-1 aktif",
            "Rp 350,000 Couples Spa added · Final invoice sent · H-1 reminder active",
            { accent: true },
          ),
        ],
      },
    },
  },
  {
    key: "healthcare",
    label: l("Klinik", "Clinic"),
    modes: {
      lead: {
        client: l("GlassSkin Clinic · Healthcare"),
        business: "GlassSkin Clinic",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "23:12",
            "Kak, ada slot Skinbooster besok Sabtu?",
            "Hi, is there a Skinbooster slot tomorrow, Saturday?",
            0,
          ),
          ai(
            "23:12",
            "Ada Kak! Sabtu tersedia jam 10.00, 13.00, dan 15.00. Jam berapa yang cocok?",
            "Yes! Saturday slots are available at 10:00 AM, 1:00 PM, and 3:00 PM. Which time works for you?",
          ),
          user("23:13", "Jam 14.00 bisa ga?", "Is 2:00 PM possible?"),
          chip(
            "Pasien lama terdeteksi · Riwayat treatment Sarah dimuat dari CRM",
            "Existing patient detected · Sarah's treatment history loaded from CRM",
          ),
          ai(
            "23:13",
            "Jam 14.00 tersedia Kak Sarah! Kamu sudah pernah Skinbooster di GlassSkin sebelumnya, aku konfirmasi langsung ya",
            "2:00 PM is available, Sarah! You have had a Skinbooster at GlassSkin before, so I will confirm it right away",
          ),
          card("23:13", booking),
          ai(
            "23:14",
            "Booking terkonfirmasi! Reminder H-1 sudah aku set ya Kak",
            "Your booking is confirmed! I set an H-1 reminder",
          ),
          chip(
            "Data pasien tersimpan di CRM · Reminder H-1 dijadwalkan",
            "Patient data saved to CRM · H-1 reminder scheduled",
          ),
          divider("Jumat, 22 Agustus", "Friday, August 22", l("H-1 Reminder")),
          ai(
            "09:00",
            "Halo Kak Sarah! Besok jam 14.00 ada jadwal Skinbooster di GlassSkin ya. Hindari riasan tebal sebelum treatment",
            "Hi Sarah! You have a Skinbooster appointment at GlassSkin tomorrow at 2:00 PM. Please avoid heavy makeup before treatment",
            { outreach: true },
          ),
          divider(
            "H+1 setelah treatment",
            "One day after treatment",
            l("24 Agustus 2026", "August 24, 2026"),
          ),
          ai(
            "10:00",
            "Halo Kak Sarah! Gimana kulit setelah Skinbooster kemarin? Boleh isi rating singkat buat kami ya",
            "Hi Sarah! How is your skin after yesterday's Skinbooster? Could you give us a quick rating?",
            { outreach: true },
          ),
          rating("10:00", {
            title: l(
              "Rating Layanan · GlassSkin",
              "Service Rating · GlassSkin",
            ),
            prompt: l(
              "Bagaimana pengalaman treatment kamu?",
              "How was your treatment experience?",
            ),
            options: [
              l("Sangat Baik", "Very good"),
              l("Baik", "Good"),
              l("Cukup", "Fair"),
              l("Kurang", "Poor"),
            ],
          }),
          user(
            "10:05",
            "Bagus banget, bintang 5!",
            "It was great, five stars!",
          ),
          divider(
            "H+29",
            "29 days later",
            l("22 September 2026", "September 22, 2026"),
          ),
          ai(
            "10:30",
            "Kak Sarah! Sudah hampir sebulan sejak Skinbooster. Waktunya touch-up nih. Ada promo Brightening Booster Rp 850.000 bulan ini. Mau aku bantu booking?",
            "Sarah! It has been almost a month since your Skinbooster. It is time for a touch-up. Brightening Booster is on promotion for Rp 850,000 this month. Would you like me to book it?",
            { outreach: true },
          ),
          user("10:41", "Boleh! Booking sekalian", "Yes! Please book it too"),
          chip(
            "Kunjungan Rp 850.000 teratribusi ke iklan Meta Anda · Repeat customer tercatat di CRM",
            "Rp 850,000 visit attributed to your Meta ad · Repeat customer recorded in CRM",
            { accent: true },
          ),
        ],
      },
      customerService: {
        client: l("GlassSkin Clinic · Healthcare"),
        business: "GlassSkin Clinic",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "10:16",
            "Kak kulit aku malah breakout setelah Skinbooster minggu lalu",
            "Hi, my skin actually broke out after last week's Skinbooster",
            0,
          ),
          ai(
            "10:17",
            "Halo Kak Sarah! Dari catatan treatment kamu tanggal 15 Agustus, breakout ringan memang bisa terjadi di awal. Aku langsung jadwalkan konsultasi follow-up gratis sama Dr. Nadia ya",
            "Hi Sarah! Your August 15 treatment notes show that a mild breakout can happen at first. I will schedule a free follow-up consultation with Dr. Nadia now",
          ),
          card("10:17", followUpBooking),
          ai(
            "10:18",
            "Konsultasi sudah terkonfirmasi ya Kak. Sambil nunggu, hindari skincare yang mengandung AHA/BHA dulu",
            "Your consultation is confirmed. In the meantime, please avoid skincare containing AHA/BHA",
          ),
          chip(
            "Keluhan tercatat · Konsultasi follow-up Rabu 09.00 dijadwalkan · Dr. Nadia notified",
            "Issue logged · Wednesday 9:00 AM follow-up scheduled · Dr. Nadia notified",
          ),
          divider(
            "Setelah konsultasi",
            "After the consultation",
            l("20 Agustus 2026", "August 20, 2026"),
          ),
          ai(
            "11:00",
            "Halo Kak Sarah! Dr. Nadia rekomendasikan Aftercare Serum post-Skinbooster, bantu recovery lebih cepat. Rp 320.000, bisa langsung pesan di sini. Stok terbatas!",
            "Hi Sarah! Dr. Nadia recommends Aftercare Serum after Skinbooster to support faster recovery. It is Rp 320,000 and can be ordered here. Limited stock!",
            { outreach: true },
          ),
          user("11:09", "Mau! Pesan satu ya", "Yes! I would like one"),
          ai(
            "11:10",
            "Siap Kak! Aku proses sekarang, estimasi tiba 2 hari",
            "Certainly! I will process it now; estimated delivery is two days",
          ),
          chip(
            "Aftercare Serum Rp 320.000 terjual · Notifikasi restock dijadwalkan 3 bulan lagi",
            "Rp 320,000 Aftercare Serum sold · Restock notification scheduled in three months",
            { accent: true },
          ),
        ],
      },
    },
  },
  {
    key: "education",
    label: l("Edukasi", "Education"),
    modes: {
      lead: {
        client: l("English Training · Edukasi"),
        business: "English Training",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "14:20",
            "Halo, mau tanya info kelas Bahasa Inggris untuk anak saya",
            "Hello, I would like information about English classes for my child",
            0,
          ),
          ai(
            "14:21",
            "Halo! Selamat datang di English Training. Boleh kenalan dulu, dengan Bapak/Ibu siapa?",
            "Hello! Welcome to English Training. May I know who I am speaking with?",
          ),
          user("14:22", "Bu Ratna", "Mrs. Ratna"),
          ai(
            "14:22",
            "Salam kenal Bu Ratna! Agar bisa rekomendasikan program yang tepat, putra/putri Ibu usianya berapa?",
            "Nice to meet you, Mrs. Ratna! To recommend the right program, how old is your child?",
          ),
          user("14:23", "8 tahun", "Eight years old"),
          ai(
            "14:24",
            "Program yang kami rekomendasikan adalah High Star English, fokus membangun kepercayaan diri anak berkomunikasi Bahasa Inggris dengan cara yang menyenangkan. Kami ada Free Trial gratis! Tertarik jadwalkan?",
            "We recommend High Star English, which builds children's confidence communicating in English in a fun way. We have a free trial class! Would you like to schedule it?",
          ),
          user(
            "14:25",
            "Tertarik, bisa Sabtu ini?",
            "I am interested. Can it be this Saturday?",
          ),
          ai(
            "14:25",
            "Bisa Bu! Ini konfirmasi jadwal Free Trial-nya",
            "Yes! Here is the Free Trial schedule confirmation",
          ),
          card("14:25", courseTrial),
          chip(
            "Data calon murid tersimpan di CRM · Notifikasi ke Course Consultant terkirim",
            "Prospective student data saved to CRM · Course Consultant notified",
          ),
          divider(
            "H-1 Reminder",
            "H-1 reminder",
            l("Jumat pagi", "Friday morning"),
          ),
          ai(
            "08:30",
            "Halo Bu Ratna! Pengingat: besok ada jadwal Free Trial di English Training. Tunjukkan konfirmasi ini saat tiba ya. Kami tunggu!",
            "Hello Mrs. Ratna! A reminder that your Free Trial at English Training is tomorrow. Please show this confirmation when you arrive. We look forward to seeing you!",
            { outreach: true },
          ),
          divider(
            "Setelah Free Trial",
            "After the Free Trial",
            l("Sabtu siang", "Saturday afternoon"),
          ),
          ai(
            "12:15",
            "Halo Bu Ratna! Gimana tadi kelasnya? Anaknya seneng?",
            "Hello Mrs. Ratna! How was the class? Did your child enjoy it?",
            { outreach: true },
          ),
          user(
            "12:24",
            "Suka banget! Mau daftar reguler. Berapa biayanya?",
            "They loved it! We would like to join the regular program. How much is it?",
          ),
          ai(
            "12:25",
            "Program reguler Rp 350.000/bulan Bu. Daftar sebelum Minggu ini dapat diskon onboarding 20%. Aku bantu proses?",
            "The regular program is Rp 350,000 per month. Register before this Sunday for a 20% onboarding discount. Shall I help process it?",
          ),
          user(
            "12:30",
            "Oke daftar sekarang ya",
            "Okay, please register us now",
          ),
          chip(
            "Murid baru terdaftar · Penjualan teratribusi ke iklan Meta Anda",
            "New student registered · Sale attributed to your Meta ad",
            { accent: true },
          ),
        ],
      },
      customerService: {
        client: l("English Training · Edukasi"),
        business: "English Training",
        date: l("18 Agustus 2026", "August 18, 2026"),
        steps: [
          user(
            "19:01",
            "Kak mau reschedule kelas Sabtu Rafi minggu depan, ada acara keluarga",
            "Hi, I need to reschedule Rafi's Saturday class next week because of a family event",
            0,
          ),
          ai(
            "19:02",
            "Halo Kak! Kelas Rafi Level 2 sama Ms. Tania Sabtu 09.00. Mau pindah ke jadwal mana?",
            "Hi! Rafi has Level 2 with Ms. Tania at 9:00 AM on Saturday. Which schedule would you like instead?",
          ),
          user("19:07", "Minggu pagi bisa ga?", "Can we do Sunday morning?"),
          ai(
            "19:07",
            "Bisa Kak! Minggu jam 10.00 masih ada slot. Sudah aku pindahkan ya",
            "Yes! There is still a Sunday 10:00 AM slot. I have moved it for you",
          ),
          chip(
            "Jadwal Rafi diperbarui · Minggu 10.00 · Konfirmasi terkirim ke WhatsApp",
            "Rafi's schedule updated · Sunday 10:00 AM · Confirmation sent to WhatsApp",
          ),
          ai(
            "19:08",
            "Btw Kak, aku lihat Rafi sudah absen 3x bulan ini. Biasanya kalau absen banyak, anak ketinggalan materi. Mau aku rekomendasikan sesi private 1-on-1 sama Ms. Tania buat catch up?",
            "By the way, I see Rafi has missed class three times this month. Frequent absences can make children fall behind. Would you like a private 1-on-1 catch-up session with Ms. Tania?",
          ),
          user(
            "19:14",
            "Oh iya... berapa harga private-nya?",
            "Oh yes... how much is the private class?",
          ),
          ai(
            "19:15",
            "Private class Rp 150.000/sesi, bisa 1-2x seminggu sesuai kebutuhan. Efektif buat catch up dalam 2-3 minggu. Mau aku daftarkan?",
            "Private class is Rp 150,000 per session, once or twice a week as needed. It is effective for catching up within two to three weeks. Would you like me to enroll Rafi?",
          ),
          chip(
            "Minat private class Rp 150.000/sesi tercatat · Tim akademik menghubungi hari ini",
            "Interest in Rp 150,000/session private class recorded · Academic team will contact you today",
            { accent: true },
          ),
        ],
      },
    },
  },
];

export const HERO_CHAT_UI = {
  /** The product's verified-sender badge, same words in both locales. */
  verified: l("CekatAI Verified"),
  /** Attribution under business replies, as the reference demo writes it;
      proactive follow-ups say sent instead, because they reply to nothing. */
  answeredBy: l("Dibalas", "Answered by"),
  sentBy: l("Dikirim", "Sent by"),
  online: l("Online"),
  system: l("sistem", "system"),
  inputPlaceholder: l(
    "Coba Cekat untuk bisnismu...",
    "Try Cekat for your business...",
  ),
  inputLabel: l(
    "Chat dengan tim Cekat.AI di WhatsApp",
    "Chat with the Cekat.AI team on WhatsApp",
  ),
  demoLabel: l("Demo percakapan AI Cekat", "Cekat AI conversation demo"),
} as const;
