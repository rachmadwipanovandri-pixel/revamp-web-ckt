/*
 * Konten homepage (preview). Saat implementasi, pindahkan ke messages/id.json
 * atau pertahankan per-band seperti struktur components/sections/home.
 */
export const DATA = {
  nav: {
    brand: { name: "Cekat.AI", href: "/" },
    links: [
      {
        id: "fitur", label: "Fitur", kind: "cats",
        categories: [
          { id: "chat", title: "AI Sales Chat", desc: "Balas, qualify, dan closing 24/7", items: [
            { t: "Live Chat", d: "Semua channel masuk satu inbox", href: "/fitur/live-chat-website" },
            { t: "Team Inbox", d: "Kolaborasi CS dalam satu layar", href: "/fitur/multichat-wa" },
            { t: "WhatsApp Auto Reply", d: "Balas otomatis dalam hitungan detik", href: "/fitur/auto-reply-whatsapp" },
            { t: "Omnichannel", d: "WA, IG, TikTok, Telegram, email", href: "/fitur/aplikasi-omnichannel" },
            { t: "Ticketing System", d: "Keluhan terpantau sampai selesai", href: "/fitur/sistem-manajemen-tiket" },
            { t: "Complaint Management", d: "Tangani komplain tanpa terlewat", href: "/fitur/manajemen-komplain" }
          ]},
          { id: "ai", title: "AI Agent", desc: "AI yang dilatih dari data bisnismu", items: [
            { t: "AI Agent Builder", d: "Buat AI agent dalam 5 menit", href: "/fitur/buat-ai-agent" },
            { t: "Knowledge Base", d: "SOP & info bisnis jadi jawaban", href: "/fitur/knowledge-base" },
            { t: "Chat Flow Designer", d: "Atur alur chat drag & drop", href: "/fitur/desain-alur-chat" },
            { t: "Jam Kerja AI", d: "AI aktif di luar jam kantor", href: "/fitur/jam-kerja-ai" },
            { t: "Multilingual AI", d: "Balas pelanggan lintas bahasa", href: "/fitur/ai-multi-bahasa" },
            { t: "AI Evaluation", d: "Ukur kualitas jawaban AI", href: "/fitur/ai-feedback" }
          ]},
          { id: "crm", title: "CRM & Data", desc: "Pipeline terisi otomatis dari chat", items: [
            { t: "Lead Management", d: "Lead terkumpul tanpa input manual", href: "/fitur/manajemen-lead" },
            { t: "Pipeline Management", d: "Lihat posisi tiap deal real-time", href: "/fitur/manajemen-pipeline" },
            { t: "Customer Stages", d: "Segmentasi tahap per pelanggan", href: "/fitur/tahapan-customer" },
            { t: "Customer Segmentation", d: "Kelompokkan pelanggan otomatis", href: "/fitur/segmentasi-pelanggan" },
            { t: "Customer Data", d: "Satu profil lengkap per orang", href: "/fitur/manajemen-data-pelanggan" },
            { t: "Follow-up Automation", d: "Tindak lanjut terjadwal otomatis", href: "/fitur/follow-up-otomatis" }
          ]},
          { id: "mkt", title: "Marketing & Atribusi", desc: "Dari belanja iklan ke closing", items: [
            { t: "Meta Ads Integration", d: "Konversi chat ke Meta", href: "/fitur/integrasi-meta-ads" },
            { t: "Conversion API", d: "Pixel tidak lagi kehilangan data", href: "/fitur/integrasi-capi" },
            { t: "Marketing Analytics", d: "ROAS & performa campaign", href: "/fitur/dashboard-roas" },
            { t: "WhatsApp Broadcast", d: "Kirim tersegmentasi, bukan massal", href: "/fitur/aplikasi-broadcast-whatsapp" },
            { t: "TikTok Ads Integration", d: "Atribusi iklan TikTok", href: "/fitur/integrasi-tiktok-ads" },
            { t: "UTM Generator", d: "Lacak sumber traffic dengan rapi", href: "/fitur/utm-generator" }
          ]},
          { id: "order", title: "Order & Automation", desc: "Order jalan dari dalam chat", items: [
            { t: "Order Automation", d: "Pesanan dibuat dari percakapan", href: "/fitur/otomatisasi-order" },
            { t: "Shipping Cost Check", d: "Cek ongkir otomatis", href: "/fitur/cek-ongkir-otomatis" },
            { t: "Payment Automation", d: "Link bayar & QRIS terkirim sendiri", href: "/fitur/pembayaran-qr-otomatis" },
            { t: "Workflow Automation", d: "Alur kerja tanpa coding", href: "/fitur/automasi-workflow" }
          ]},
          { id: "int", title: "Integrasi", desc: "Hubungkan semua tools bisnismu", items: [
            { t: "Open API", d: "Sambungkan sistem internalmu", href: "/integrasi" },
            { t: "Website Tracker", d: "Pantau aktivitas di websitemu", href: "/fitur/website-tracker" },
            { t: "Instagram Automation", d: "DM & komentar ditangani AI", href: "/fitur/instagram-bot" },
            { t: "AI Function Calling", d: "AI bertindak: order, pembayaran, API-mu", href: "/fitur/function-calling" }
          ]}
        ],
        featured: { icon: "phone", t: "WhatsApp Call AI", d: "Setiap telepon dirangkum AI, poin penting dan langkah berikutnya, otomatis.", href: "/fitur/whatsapp-call-ai", cta: "Jelajahi fitur" }
      },
      {
        id: "solusi", label: "Solusi", kind: "cols",
        columns: [
          { title: "Berdasarkan peran", items: [
            { t: "Pemilik Bisnis", d: "Dashboard chat, penjualan & iklan", href: "/solusi" },
            { t: "Customer Service", d: "Balas < 2 menit, 24/7", href: "/solusi" },
            { t: "Marketing", d: "Atribusi iklan sampai closing", href: "/solusi" },
            { t: "Sales", d: "Follow-up tidak pernah terlewat", href: "/solusi" },
            { t: "Operasional", d: "Order & alur tanpa coding", href: "/solusi" }
          ]},
          { title: "Berdasarkan kebutuhan", items: [
            { t: "Balas chat lebih cepat", d: "AI menjawab, tim fokus closing", href: "/solusi" },
            { t: "Closing otomatis 24/7", d: "Qualify & jadwalkan sendiri", href: "/solusi" },
            { t: "Iklan yang terukur", d: "Tahu ROAS per campaign", href: "/solusi" },
            { t: "Operasional ringan", d: "Ongkir, bayar, order otomatis", href: "/solusi" }
          ]}
        ]
      },
      {
        id: "industri", label: "Industri", kind: "grid",
        intro: "Setiap industri punya pola percakapan sendiri — Cekat.AI sudah memahaminya.",
        items: [
          { t: "F&B", href: "/industri/fnb" }, { t: "Retail", href: "/industri/ritel" },
          { t: "Kecantikan & Wellness", href: "/industri/salon-kecantikan" }, { t: "Properti", href: "/industri/properti" },
          { t: "Pendidikan", href: "/industri/pendidikan" }, { t: "Klinik", href: "/industri/klinik" },
          { t: "Kesehatan", href: "/industri/kesehatan" }, { t: "Travel", href: "/industri/travel" },
          { t: "Otomotif", href: "/industri/otomotif" }, { t: "Logistik", href: "/industri/logistik" },
          { t: "SaaS & Tech", href: "/industri/saas" }, { t: "Finansial", href: "/industri/keuangan" }
        ],
        more: { t: "Semua industri", href: "/industri" }
      },
      { id: "blog", label: "Blog", href: "/blog" },
      { id: "harga", label: "Harga", href: "/harga" }
    ],
    login: { label: "Masuk", href: "https://chat.cekat.ai/login" },
    cta: { label: "Coba Gratis", href: "https://chat.cekat.ai/register" },
    mobileGroups: ["fitur", "solusi", "industri"]
  },

  hero: {
    pill: { badge: "Baru", text: "WhatsApp Call AI — tiap telepon dirangkum otomatis", href: "/fitur/whatsapp-call-ai" },
    title: "Dari Leads Jadi {accent:Pelanggan} Seumur Hidup",
    sub: "Pakai AI agent, CRM Omnichannel, dan follow-up otomatis untuk mengubah lebih banyak percakapan jadi penjualan — sekaligus tahu persis iklan mana yang berujung closing.",
    form: { placeholder: "Email kerja atau nomor WhatsApp", cta: "Coba Gratis 14 Hari" },
    note: "Setup 10 menit · Tanpa kartu kredit · Bisa langsung chat WhatsApp kami",
    trust: [
      { icon: "star", t: "Dipercaya 3.000+ bisnis di Asia" },
      { icon: "shield", t: "Meta Business Partner Resmi" },
      { icon: "clock", t: "Setup 10 menit, trial 14 hari" }
    ],
    window: {
      url: "app.cekat.ai / inbox",
      side: ["Inbox", "CRM Pelanggan", "Marketing", "Order", "Laporan"],
      title: "Percakapan masuk · WhatsApp",
      chats: [
        { ava: "RA", color: "#1352BF", who: "Rani — Instagram DM", msg: "\"Kak, ready warna navy? Kalau ambil 2 dapat diskon berapa ya?\"", chip: "● AI membalas dalam 8 detik" },
        { ava: "BS", color: "#22C55E", who: "Bagus — WhatsApp", msg: "\"Ongkir ke Bandung berapa? Bisa bayar QRIS kan?\"", chip: "● Ongkir dihitung + link bayar terkirim" },
        { ava: "DW", color: "#B64ABF", who: "Dewi — TikTok", msg: "\"Saya sudah transfer ya, tolong dicek\"", chip: "● Order dibuat otomatis di OMS" }
      ],
      stats: [
        { v: "1,8 dtk", l: "rata-rata balasan AI" },
        { v: "92%", l: "chat dijawab otomatis", spark: true },
        { v: "+34%", l: "closing minggu ini" }
      ]
    }
  },

  /** Copy kartu-kartu melayang di animasi loop hero. Struktur wajib sama dgn data-en.ts. */
  loop: {
    chat: {
      q: "Kak, masih ready navy size L?",
      a: "Ready! Stoknya aku kunci dulu ya — dibuatkan ordernya?",
      cta1: "Buat order",
      cta2: "Lihat katalog"
    },
    oms: {
      status: "BARU",
      nm: "Kemeja Linen",
      pr: "Rp 350.000",
      rows: [["Subtotal", "Rp 350.000"], ["Ongkir", "Gratis"], ["Total", "Rp 350.000"]],
      paid: "Pembayaran diterima",
      rail: ["Dibuat", "Dibayar", "Dikirim"]
    },
    crm: {
      rl: "Pelanggan berulang · Bandung",
      ads: "Iklan Instagram",
      stats: [["7", "Order"], ["Rp 480rb", "AOV"], ["2m", "Terakhir"]]
    },
    mini: {
      lbl: "Mini Agent · Widget situs",
      s: "Menjawab pengunjung situs 24/7",
      q: "Ada warna lain selain navy?",
      a: "Ada, kak! Sage dan Sand masih ready — kirim gambarnya ya.",
      p1: "Kemeja Sage",
      p2: "Kemeja Sand",
      pr: "Rp 350rb",
      cta: "Tambah ke keranjang"
    },
    cons: {
      s: "Rekomendasi mingguan untuk toko kamu",
      badge: "Mingguan",
      callout: "Kategori linen {b:naik 24%} tiga minggu berturut — tapi stok Navy tinggal {b:4 pcs}.",
      items: [
        "Restock {b:Navy ×40} sebelum akhir pekan",
        "Aktifkan {b:promo bundling} Sabtu 10.00–14.00",
        "Broadcast ke {b:212 pelanggan VIP} yang belum beli 30 hari"
      ],
      chart: "Order / hari",
      days: ["S", "S", "R", "K", "J", "S", "M"],
      cta: "Terapkan saran"
    },
    mkt: {
      s: "Broadcast & campaign otomatis",
      run: "Berjalan",
      sub: "2.480 pelanggan · VIP + cart abandon",
      stats: [["2.480", "Terkirim"], ["18%", "Dibuka"], ["312", "Klik"]],
      num: "4,8×",
      roas: "ROAS · 30 hari",
      foot: ["Omzet dari iklan", "Rp 8,4jt"]
    }
  },

  logos: {
    eyebrow: "Bukti sosial",
    heading: "Mereka meninggalkan cara lama",
    lead: "Setiap cerita bermula dari masalah yang sama — balasan lambat, data berserakan, follow-up terlewat — dan bagaimana Cekat.AI menyelesaikannya.",
    more: "…dan ribuan bisnis lainnya di Indonesia, Singapura, & Malaysia",
    items: [
      { src: "/images/home/logos/jago.png", alt: "Jago", caption: "Beralih dari balasan chat manual yang cuma jam kerja" },
      { src: "/images/home/logos/siloam-logo.webp", alt: "Siloam Hospitals", caption: "Dari rekap janji temu di spreadsheet tiap malam" },
      { src: "/images/home/logos/pln.webp", alt: "PLN", caption: "Dari 3 tools terpisah untuk chat, CRM, dan broadcast" },
      { src: "/images/home/logos/tiki-logo.webp", alt: "TiKi", caption: "Dari follow-up kirim paket yang sering terlewat" },
      { src: "/images/home/logos/yupi.webp", alt: "Yupi", caption: "Dari broadcast massal yang dibuka tapi tak dibalas" },
      { src: "/images/home/logos/realfood.webp", alt: "Realfood", caption: "Dari orderan masuk yang harus diketik ulang satu-satu" },
      { src: "/images/home/logos/kb-insurance.png", alt: "KB Insurance", caption: "Dari lead iklan yang dingin karena telat dihubungi" },
      { src: "/images/home/logos/telkom-university.webp", alt: "Telkom University", caption: "Dari pertanyaan pendaftar yang berulang setiap hari" }
    ]
  },

  proof: {
    items: [
      { v: "10.000.000.000+", count: 10000000000, suffix: "+", l: "token diproses setiap hari" },
      { v: "2.000.000+", count: 2000000, suffix: "+", l: "percakapan diproses setiap hari" },
      { v: "3.000+", count: 3000, suffix: "+", l: "bisnis di Asia" }
    ]
  },

  signals: {
    eyebrow: "Sinyal pelanggan",
    title: "Jangan sampai {em:kehilangan momen} penting",
    lead: "Setiap sinyal dari chat, iklan, dan order tertangkap otomatis — tim tahu persis kapan harus bertindak, tanpa harus memantau semua channel sendiri.",
    cta: { label: "Lihat cara kerja sinyal →", href: "/" },
    rows: [
      [
        { c: "#B64ABF", t: "Customer tanya harga di DM Instagram" }, { c: "#22C55E", t: "Cart dibuang 2 jam lalu" },
        { c: "#0EA5E9", t: "Lead dari iklan belum di-follow up" }, { c: "#4AB6BF", t: "Chat masuk di luar jam kerja" },
        { c: "#4A4ABF", t: "Customer lama balik setelah 6 bulan" }, { c: "#EC4899", t: "Promo berakhir besok, belum diingatkan" }
      ],
      [
        { c: "#4A4ABF", t: "Pesanan belum dibayar lewat 1 hari" }, { c: "#EC4899", t: "Broadcast dibuka tapi belum dibalas" },
        { c: "#1352BF", t: "Prospek tanya ongkir ke 3 kota" }, { c: "#22C55E", t: "Booking besok dikonfirmasi AI" },
        { c: "#F472B6", t: "Komplain keterlambatan dikirim ke CS" }, { c: "#0EA5E9", t: "50 chat masuk dari iklan Meta hari ini" }
      ],
      [
        { c: "#22C55E", t: "Follow-up otomatis terkirim H+1" }, { c: "#B64ABF", t: "Customer pindah ke paket premium" },
        { c: "#4AB6BF", t: "Jadwal demo dijadwalkan ulang" }, { c: "#0EA5E9", t: "AI menawarin produk relevan ke 128 customer" },
        { c: "#4A4ABF", t: "Besaran order naik 2x lipat" }, { c: "#EC4899", t: "Story dibuka 500x, klik link 40x" }
      ]
    ]
  },

  products: {
    eyebrow: "Platform",
    heading: "Satu platform Untuk Semua",
    lead: "Jelajahi bagaimana AI membantu setiap proses bisnis Anda, dari sales hingga operasional.",
    doodle: "klik saya!",
    items: [
      { title: "AI Sales Chat", dot: "#1352BF",
        headline: "Chat dibalas dalam hitungan detik",
        body: "AI membalas chat, mengualifikasi calon pembeli, dan meneruskan ke tim saat sudah siap closing. Semua channel masuk ke satu inbox — jalan 24/7 tanpa chat menumpuk.",
        pills: ["Semua channel satu inbox", "Auto-handoff ke tim", "Jalan 24/7"],
        cta: { label: "Jelajahi AI Sales Chat →", href: "/chat" },
        img: "/images/home/feature-chat-inbox.webp", alt: "Layar inbox percakapan Cekat.AI" },
      { title: "CRM & Data Pelanggan", dot: "#22C55E",
        headline: "Data rapi tanpa input manual",
        body: "Setiap percakapan, pembelian, dan tahap pipeline tercatat sendiri dari chat. Tidak ada lagi rekap manual di akhir hari — semua tim melihat data yang sama.",
        pills: ["Terisi otomatis dari chat", "Pipeline real-time", "Riwayat lengkap"],
        cta: { label: "Jelajahi CRM →", href: "/crm" },
        img: "/images/home/feature-crm-pipeline.webp", alt: "Layar pipeline CRM Cekat.AI" },
      { title: "Marketing & Broadcast", dot: "#B64ABF",
        headline: "Tahu persis iklan yang closing",
        body: "Broadcast tersegmentasi, follow-up otomatis, dan atribusi yang menghubungkan belanja iklan ke penjualan nyata — dari klik iklan sampai chat jadi order.",
        pills: ["Broadcast tersegmentasi", "Dashboard ROAS", "Integrasi CAPI"],
        cta: { label: "Jelajahi Marketing →", href: "/marketing" },
        img: "/images/home/feature-marketing-loop.webp", alt: "Layar dashboard marketing Cekat.AI" },
      { title: "Order & Automation", dot: "#4A4ABF",
        headline: "Order jalan langsung dari chat",
        body: "AI menghitung ongkir, mengirim tautan pembayaran, dan menjalankan alur lanjutan tanpa perlu coding — dari percakapan sampai pesanan beres.",
        pills: ["Cek ongkir otomatis", "Pembayaran QR", "Tanpa coding"],
        cta: { label: "Jelajahi Order →", href: "/order" },
        img: "/images/home/feature-oms-orders.webp", alt: "Layar order otomatis Cekat.AI" }
    ]
  },
  personas: {
    eyebrow: "Solusi per peran",
    heading: "Dibuat untuk peran seperti Anda",
    lead: "Satu platform untuk setiap peran — pilih peran Anda dan lihat manfaat serta angka yang paling relevan.",
    tabs: [
      { id: "owner", name: "Pemilik", icon: "home" },
      { id: "cs", name: "Customer Service", icon: "chat" },
      { id: "mkt", name: "Marketing", icon: "send" },
      { id: "sales", name: "Sales", icon: "chart" },
      { id: "ops", name: "Operasional", icon: "grid" }
    ],
    panels: {
      owner: { h: "Tahu persis iklan mana yang benar-benar closing",
        sub: "Satu dashboard untuk chat, penjualan, dan performa iklan — Anda berhenti menebak dan mulai memutuskan berdasarkan angka.",
        cta: { label: "Lihat solusi Pemilik →", href: "/solusi" },
        kpis: [
          { n: "+50%", h: "Omzet naik setelah closing rate membaik", p: "Nature Craft Indonesia — closing rate dari bawah 20% ke atas 40%." },
          { n: "1 dashboard", h: "Semua channel & iklan terlihat bersama", p: "WhatsApp, Instagram, TikTok, dan Meta Ads dalam satu tampilan." }
        ]},
      cs: { h: "Balas kurang dari 2 menit, bahkan di luar jam kerja",
        sub: "AI menjawab pertanyaan berulang, mengambil konteks pelanggan dari CRM, dan menyerahkan chat ke tim hanya saat sudah siap closing.",
        cta: { label: "Lihat solusi CS →", href: "/solusi" },
        kpis: [
          { n: "+90%", h: "Response rate meningkat", p: "Polytechnic Multimedia Nusantara — dari keterlambatan balas ke nyaris instan." },
          { n: "< 1 menit", h: "Chat dijawab 24 jam", p: "Tim tidak kehilangan leads malam hari — AI yang jaga inbox." }
        ]},
      mkt: { h: "Dari belanja iklan sampai ke penjualan nyata",
        sub: "Atribusi CAPI menghubungkan setiap rupiah iklan ke closing, dan broadcast tersegmentasi menyapa orang yang benar dengan pesan yang benar.",
        cta: { label: "Lihat solusi Marketing →", href: "/solusi" },
        kpis: [
          { n: "4,8x", h: "ROAS terukur real-time", p: "Konversi dari chat dikirim balik ke platform iklan secara otomatis." },
          { n: "CAPI", h: "Integrasi Meta & TikTok", p: "Event iklan tercatat lengkap, pixel tidak lagi kehilangan data." }
        ]},
      sales: { h: "Follow-up tidak pernah terlewat lagi",
        sub: "Pipeline terisi sendiri dari percakapan, dan AI mengingatkan saat waktunya menindaklanjuti prospek yang siap diajak bicara.",
        cta: { label: "Lihat solusi Sales →", href: "/solusi" },
        kpis: [
          { n: "20→28%", h: "Konversi leads naik", p: "Wall Street English — leads low-quality disaring AI lebih dulu." },
          { n: "otomatis", h: "Pipeline terisi dari chat", p: "Tidak ada lagi deal yang hilang karena lupa dicatat." }
        ]},
      ops: { h: "Order jalan sendiri, tanpa coding",
        sub: "Ongkir dihitung, pembayaran dikirim, dan alur pesanan berjalan otomatis dari dalam percakapan — semuanya drag & drop.",
        cta: { label: "Lihat solusi Operasional →", href: "/solusi" },
        kpis: [
          { n: "QRIS", h: "Bayar langsung dari chat", p: "Link pembayaran dan bukti transaksi tercatat otomatis di order." },
          { n: "0 coding", h: "Alur pesanan drag & drop", p: "Divalidasi, stok dikurangi, status dikirim ke customer — sendiri." }
        ]}
    }
  },

  results: {
    eyebrow: "Hasil nyata",
    heading: "Bukti nyata dari bisnis yang memakai Cekat.AI",
    lead: "Angka besar, nama bisnis, dan wajah di baliknya — semua disampaikan langsung oleh pelanggan dalam wawancara terekam.",
    cards: [
      { type: "metric", bg: "bg-blue", big: "+50%", what: "omzet, setelah closing rate naik dari bawah 20% ke atas 40%", co: "Nature Craft Indonesia" },
      { type: "quote", q: "“Response rate kami meningkat 90%.”",
        ava: { initials: "H", color: "#1352BF" }, nm: "Hargyo", rl: "Direktur · Multimedia Nusantara Polytechnic", logo: "MNP" },
      { type: "metric", bg: "bg-green", big: "20→28%", what: "konversi leads, setelah leads low-quality difilter AI lebih dulu", co: "Wall Street English" },
      { type: "metric", bg: "bg-purple", big: "+30-40%", what: "omzet, dengan balasan turun dari 20 menit ke bawah 2 menit", co: "Putiih Skin Clinic" },
      { type: "metric", bg: "bg-amber", big: "~+50%", what: "peningkatan penjualan dari leads tengah malam yang dulu terlewat", co: "Threeland Property" },
      { type: "quote", q: "“Tim First Contact kami sudah sampai titik di mana produktivitasnya tidak bisa naik lagi. Dengan Cekat AI, leads yang low quality difilter dulu, dan konversi kami naik dari sekitar 20% menjadi 28%.”",
        ava: { initials: "B", color: "#22C55E" }, nm: "Bayu", rl: "Head of Digital Marketing", logo: "Wall Street" },
      { type: "full", q: "“Contact center kami dulu hanya Senin sampai Jumat, jam 8 sampai jam 5. Sekarang AMIRA menjawab 24 jam, kurang dari 1 menit. Kami tidak kehilangan donatur.”",
        ava: { img: "/images/home/testimonial-wiji-astuti.jpg", initials: "W", color: "#B64ABF" }, nm: "Wiji Astuti", rl: "Customer Experience Dept. Head · Rumah Zakat" }
    ]
  },

  videos: {
    eyebrow: "Cerita pelanggan",
    heading: "Dengar langsung dari mereka",
    lead: "Tiga puluh detik dari pemilik bisnis yang sudah menjalankannya — tanpa skrip, tanpa drama.",
    note: "Klik salah satu video untuk memutar.",
    items: [
      { yt: "ePdVgW7X01s", co: "Moir Salon", who: "Silcia Brenda · CEO & Founder" },
      { yt: "wvOip0Gkx30", co: "Rumah Zakat", who: "Tantan Supriantna · Head Customer Relation" },
      { yt: "O_xSafLehMQ", co: "Multimedia Nusantara Polytechnic", who: "Hargyo T. N. Ignatis, Ph.D · Direktur" },
      { yt: "681luT0Aa68", co: "VIO Optical Clinic", who: "Rianti Yahya · CEO" }
    ]
  },

  industries: {
    eyebrow: "Industri",
    heading: "Cara kerja yang sama, disesuaikan industri Anda",
    lead: "Dari klinik sampai logistik — chat, order, dan follow-up otomatis jalan 24/7 dengan alur yang memang dipakai industri Anda.",
    cta: "Lihat solusi",
    more: { label: "Semua industri", href: "/industri" },
    items: [
      { name: "Kesehatan", tag: "Jawab & booking pasien 24/7", href: "/industri/kesehatan", img: "/images/industries/healthcare.webp",
        chips: ["Jawab pasien 24/7", "Booking dari chat", "Riwayat pasien terpusat"] },
      { name: "Ritel & E-Commerce", tag: "Jualan & layani di semua channel", href: "/industri/ritel", img: "/images/industries/retail.webp",
        chips: ["Tanya produk", "Cek ongkir sampai lunas", "Kejar checkout tertinggal"] },
      { name: "F&B", tag: "Reservasi & order tertangani 24/7", href: "/industri/fnb", img: "/images/industries/fnb.webp",
        chips: ["Reservasi 24 jam", "Menu, promo, harga", "Chat jadi order"] },
      { name: "Pendidikan", tag: "Jawab calon siswa saat musim PMB", href: "/industri/pendidikan", img: "/images/industries/education.webp",
        chips: ["Musim PMB", "Tangkap leads pendaftar", "Nurture calon siswa"] },
      { name: "Keuangan", tag: "Layanan compliant, volume tinggi", href: "/industri/keuangan", img: "/images/industries/finance.webp",
        chips: ["Volume chat tinggi", "Eskalasi kasus sensitif", "Tiket komplain"] },
      { name: "Properti", tag: "Kualifikasi leads & atur kunjungan", href: "/industri/properti", img: "/images/industries/property.webp",
        chips: ["Respons leads iklan", "Kualifikasi leads", "Jadwal kunjungan"] },
      { name: "Salon & Kecantikan", tag: "Booking, reminder, minim no-show", href: "/industri/salon-kecantikan", img: "/images/industries/beauty-wellness.webp",
        chips: ["Tanya treatment", "Booking & rebooking", "Reminder no-show"] },
      { name: "Logistik", tag: "Update kiriman & CS 24/7", href: "/industri/logistik", img: "/images/industries/logistics.webp",
        chips: ["Lacak kiriman", "Update status proaktif", "Jadwal pickup"] }
    ]
  },

  pricing: {
    eyebrow: "Harga & paket",
    heading: "Paket jelas, tumbuh bersama tim Anda",
    lead: "Mulai dari satu produk, tambah yang lain kapan saja — chat, CRM, dan marketing tetap di satu tempat. Semua paket termasuk uji coba gratis 14 hari.",
    note: "* Uji coba gratis 14 hari, tanpa kartu kredit.",
    popular: "Paling Dipilih",
    rows: ["Nomor WABA", "MAU / bulan", "AI credits", "Seats", "Tipe AI"],
    compare: { label: "Bandingkan semua fitur & paket", href: "/harga" },
    plans: [
      { name: "Pro", tag: "Untuk tim kecil yang mulai kewalahan balas chat.",
        cta: "Coba Gratis 14 Hari", href: "https://chat.cekat.ai/register",
        specs: ["1", "3.000", "15.000", "5", "AI Simple"] },
      { name: "Business", popular: true, tag: "Untuk bisnis yang butuh otomatisasi penuh dan alur kerja rapi.",
        cta: "Coba Gratis 14 Hari", href: "https://chat.cekat.ai/register",
        specs: ["3", "10.000", "50.000", "7", "AI Full"] },
      { name: "Enterprise", tag: "Untuk volume chat besar dengan tim CS terstruktur.",
        cta: "Coba Gratis 14 Hari", href: "https://chat.cekat.ai/register",
        specs: ["5", "30.000", "150.000", "10", "AI Full"] },
      { name: "Custom", custom: true, tag: "Untuk kebutuhan khusus, integrasi, dan skala korporat.",
        cta: "Hubungi Sales", href: "/contact",
        specs: ["Custom", "Tanpa Batas", "Custom", "Custom", "AI Full"] }
    ]
  },

  love: {
    eyebrow: "Testimoni",
    title: "Cinta dari {em:pelanggan} kami",
    lead: "Ratusan bisnis di Indonesia, Singapura, dan Malaysia — ini kata mereka.",
    columns: [
      { spd: "48s", dir: "up", cards: [
        { q: "“Respon pelanggan menjadi lebih cepat”",
          ava: { img: "/images/home/testimonial-silica-brenda.jpg", initials: "S", color: "#1352BF" }, nm: "Silcia Brenda", rl: "CEO & Founder · Moir Salon" },
        { q: "“Dulu saya harus begadang membalas mereka. Sekarang saya tidur nyenyak, dan pagi-pagi sudah antre orang minta jadwal survei. Peningkatan penjualan hampir 50% lebih.”",
          ava: { initials: "A", color: "#4A4ABF" }, nm: "Adam Sulaiman", rl: "President Director · Threeland Property" }
      ]},
      { spd: "56s", dir: "down", cards: [
        { q: "“Closing rate di kami masih di bawah 20%. Sekarang sudah di atas 40%… karena closing rate naik, omzet kami juga naik drastis, bisa di angka 50%.”",
          ava: { initials: "H", color: "#22C55E" }, nm: "Hariyudi", rl: "Direktur · Nature Craft Indonesia" },
        { q: "“Dulu satu chat bisa kami balas lebih dari 20 menit… Sekarang balasan di bawah 2 menit, kami set di 30 detik. Omzet naik sekitar 30 sampai 40%.”",
          ava: { initials: "G", color: "#B64ABF" }, nm: "Gamal", rl: "Founder & CEO · Putiih Skin Clinic" }
      ]},
      { spd: "50s", dir: "up", cards: [
        { q: "“Peluang closing sangat tinggi”",
          ava: { img: "/images/home/testimonial-wiji-astuti.jpg", initials: "W", color: "#0EA5E9" }, nm: "Wiji Astuti", rl: "Head of Customer Experience · Rumah Zakat" },
        { q: "“Dengan Cekat AI, leads yang low quality difilter dulu, dan konversi kami naik dari sekitar 20% menjadi 28%.”",
          ava: { initials: "B", color: "#4AB6BF" }, nm: "Bayu", rl: "Head of Digital Marketing · Wall Street English" }
      ]},
      { spd: "60s", dir: "down", cards: [
        { q: "“Response rate kami meningkat 90%.”",
          ava: { initials: "H", color: "#3B82F6" }, nm: "Hargyo", rl: "Direktur · Multimedia Nusantara Polytechnic" },
        { q: "“Sekarang AMIRA menjawab 24 jam, kurang dari 1 menit. Kami tidak kehilangan donatur, dan peluang closing-nya besar sekali.”",
          ava: { img: "/images/home/testimonial-wiji-astuti.jpg", initials: "W", color: "#EC4899" }, nm: "Wiji Astuti", rl: "Customer Experience Dept. Head · Rumah Zakat" }
      ]}
    ]
  },

  midcta: {
    eyebrow: "Mulai sekarang",
    title: "Coba gratis 14 hari — {em:langsung dari sini}",
    sub: "Balas lebih cepat, follow-up otomatis, dan closing lebih banyak — tanpa perlu nambah tim.",
    form: { placeholder: "Email atau nomor WhatsApp", cta: "Coba Gratis 14 Hari" },
    trust: ["Setup 10 menit", "1-on-1 konsultasi", "Bisa batal kapan saja"]
  },

  blog: {
    eyebrow: "Belajar",
    heading: "Naikkan skill tim Anda",
    cta: { label: "Semua artikel", href: "/blog" },
    posts: [
      { cls: "t1", tt: "WhatsApp<br>Business API<br>untuk UMKM", meta: "Panduan · 12 min baca",
        title: "Cara pasang WhatsApp Business API untuk bisnis kecil, langkah demi langkah", href: "/blog" },
      { cls: "t2", tt: "7 alasan chat<br>lambat<br>turunkan closing", meta: "Conversion · 8 min baca",
        title: "Kenapa balasan chat lambat membuat calon pembeli pergi ke kompetitor", href: "/blog" },
      { cls: "t3", tt: "Apa itu<br>CAPI Meta?", meta: "Marketing · 10 min baca",
        title: "Mengapa konversi dari chat harus dikirim balik ke iklan Meta Anda", href: "/blog" }
    ]
  },

  footer: {
    about: "AI Agent & Omnichannel CRM untuk bisnis Indonesia — balas lebih cepat, follow-up otomatis, closing lebih banyak.",
    partner: "Meta Business Partner Resmi",
    officeTitle: "Kantor Kami",
    appsTitle: "Unduh Aplikasi Mobile Cekat",
    apps: [
      { t: "Google Play", href: "https://play.google.com/store/apps/details?id=com.cekatmobile" },
      { t: "App Store", href: "https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id" }
    ],
    countries: [
      { key: "id", label: "Indonesia", offices: [
        { city: "Kantor Jakarta", addr: "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, Jakarta Selatan 12190" },
        { city: "Kantor Tangerang", addr: "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810" }
      ]},
      { key: "sg", label: "Singapura", offices: [
        { city: "Cekat Pte. LTD.", addr: "101 Upper Cross Street, 05-16, People's Park Centre, Singapore, 058357" }
      ]},
      { key: "my", label: "Malaysia", offices: [
        { city: "CekatAI Sdn. Bhd.", addr: "Level 7, Mercu 3, No.1, Jalan Bangsar, KL Eco City 59200, Kuala Lumpur W.P. Kuala Lumpur Malaysia" }
      ]}
    ],
    cols: [
      { h: "Produk", links: [
        { t: "AI Sales Chat", href: "/chat" }, { t: "CRM & Data Pelanggan", href: "/crm" },
        { t: "Marketing & Broadcast", href: "/marketing" }, { t: "Order & Automation", href: "/order" },
        { t: "Open API & Integrasi", href: "/integrasi" }, { t: "Harga", href: "/harga" }
      ]},
      { h: "Fitur", links: [
        { t: "Live Chat", href: "/fitur/live-chat-website" }, { t: "Team Inbox", href: "/fitur/multichat-wa" },
        { t: "WhatsApp Auto Reply", href: "/fitur/auto-reply-whatsapp" }, { t: "Omnichannel", href: "/fitur/aplikasi-omnichannel" },
        { t: "WhatsApp Broadcast", href: "/fitur/aplikasi-broadcast-whatsapp" }, { t: "Marketing Analytics", href: "/fitur/dashboard-roas" }
      ]},
      { h: "Solusi", links: [
        { t: "Untuk Pemilik", href: "/solusi" }, { t: "Untuk Customer Service", href: "/solusi" },
        { t: "Untuk Marketing", href: "/solusi" }, { t: "Untuk Sales", href: "/solusi" },
        { t: "Untuk Operasional", href: "/solusi" }, { t: "Semua solusi", href: "/solusi" }
      ]},
      { h: "Industri", links: [
        { t: "F&B", href: "/industri/fnb" }, { t: "Retail", href: "/industri/ritel" },
        { t: "Kecantikan & Wellness", href: "/industri/salon-kecantikan" }, { t: "Properti", href: "/industri/properti" },
        { t: "Pendidikan", href: "/industri/pendidikan" }, { t: "Semua industri", href: "/industri" }
      ]},
      { h: "Perusahaan", links: [
        { t: "Blog", href: "/blog" }, { t: "Event", href: "/events" },
        { t: "Kontak", href: "/contact" }, { t: "Integrasi", href: "/integrasi" },
        { t: "Bandingkan", href: "/perbandingan" }, { t: "Unduh Aplikasi", href: "https://play.google.com/store/apps/details?id=com.cekatmobile" }
      ]},
      { h: "Legal", links: [
        { t: "Kebijakan Privasi", href: "/privacy-policy" },
        { t: "Syarat & Ketentuan", href: "/terms-and-conditions" },
        { t: "Kebijakan Retur & Pengiriman", href: "/return-refund-delivery-policy" }
      ]}
    ],
    copyright: "© 2025 PT Teknologi Cekat Indonesia · Seluruh hak cipta dilindungi.",
    socials: ["Instagram", "LinkedIn", "YouTube"]
  },

  /** CTA tautan cerita di kartu logo & kartu bento hasil. */
  readMore: "Baca cerita",

  /* urutan band — peta langsung ke komponen React saat implementasi */
  order: ["hero", "logos", "proof", "signals", "products", "personas", "results", "videos", "industries", "love", "pricing", "midcta", "blog"]
};
