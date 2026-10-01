import type { HomeContent } from "./types";

/**
 * Bilingual copy for /preview-home-2. Self-contained on purpose: the draft must
 * not touch `messages/*.json` (that catalog is 930 keys and ships to the whole
 * site), and typing both objects as `HomeContent` makes a missing key a build
 * error instead of a runtime `undefined` in the HTML.
 *
 * Links are stored fully resolved (with the `/en` prefix where needed) and are
 * rendered with `next/link`, so navigation stays client-side in both locales.
 */

const ID: HomeContent = {
  meta: {
    title: "Beranda Baru (Draft) — Cekat.AI",
    description:
      "Draft redesign beranda: kanvas terang, diagram yang menjelaskan produk, dan Growth Loop sebagai cerita utamanya.",
  },

  nav: {
    login: { label: "Masuk", href: "https://chat.cekat.ai/login" },
    cta: { label: "Coba Gratis", href: "https://chat.cekat.ai/register" },
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    menuLabel: "Menu utama",
    links: [
      {
        label: "Produk",
        megaIntro: "Satu platform, empat pekerjaan yang saling terhubung.",
        mega: [
          {
            title: "Platform",
            items: [
              { label: "AI Sales Chat", href: "/chat" },
              { label: "CRM & Data Pelanggan", href: "/crm" },
              { label: "Marketing & Broadcast", href: "/marketing" },
              { label: "Order & Automation", href: "/order" },
            ],
          },
          {
            title: "Fitur populer",
            items: [
              { label: "WhatsApp Call AI", href: "/fitur/whatsapp-call-ai" },
              { label: "Live Chat Website", href: "/fitur/live-chat-website" },
              { label: "Team Inbox", href: "/fitur/multichat-wa" },
              { label: "Knowledge Base", href: "/fitur/knowledge-base" },
            ],
          },
        ],
      },
      { label: "Solusi", href: "/solusi" },
      {
        label: "Industri",
        megaIntro:
          "Alur percakapan tiap industri berbeda — kami sudah menyiapkannya.",
        mega: [
          {
            title: "Industri",
            items: [
              { label: "Kesehatan", href: "/industri/kesehatan" },
              { label: "Ritel & E-Commerce", href: "/industri/ritel" },
              { label: "F&B", href: "/industri/fnb" },
              { label: "Logistik", href: "/industri/logistik" },
            ],
          },
          {
            title: "Lainnya",
            items: [
              { label: "Keuangan", href: "/industri/keuangan" },
              { label: "Properti", href: "/industri/properti" },
              { label: "Pendidikan", href: "/industri/pendidikan" },
              {
                label: "Kecantikan & Wellness",
                href: "/industri/salon-kecantikan",
              },
            ],
          },
        ],
      },
      { label: "Harga", href: "/harga" },
      { label: "Blog", href: "/blog" },
    ],
  },

  hero: {
    pill: { label: "Baru · WhatsApp Call AI", href: "/fitur/whatsapp-call-ai" },
    titleLead: "Dari leads jadi",
    titleAccent: "pelanggan seumur hidup",
    sub: "Cekat.AI menyatukan AI agent, CRM omnichannel, dan follow-up otomatis dalam satu lingkaran kerja — supaya setiap percakapan bergerak maju ke penjualan, bukan berhenti di chat.",
    form: {
      label: "Email kerja",
      placeholder: "Masukkan email kerja Anda",
      cta: "Coba Gratis",
      note: "Gratis 14 hari · Tanpa kartu kredit · Setup 10 menit",
      errorRequired: "Mohon isi email kerja Anda dulu.",
      errorInvalid: "Format email belum tepat. Contoh: nama@perusahaan.com",
      secondary: { label: "Lihat cara kerjanya", href: "#how-it-works" },
    },
    trust: [
      "Setup 10 menit",
      "Tanpa kartu kredit",
      "Meta Business Partner resmi",
    ],
  },

  dashboard: {
    url: "app.cekat.ai / inbox",
    nav: ["Inbox", "CRM Pelanggan", "Marketing", "Order", "Laporan"],
    title: "Percakapan masuk · WhatsApp",
    rows: [
      {
        initials: "RA",
        accent: "#1352BF",
        who: "Rani — Instagram DM",
        msg: "“Kak, ready warna navy? Kalau ambil 2 dapat diskon berapa ya?”",
        chip: "AI membalas dalam 8 detik",
      },
      {
        initials: "BS",
        accent: "#22C55E",
        who: "Bagus — WhatsApp",
        msg: "“Ongkir ke Bandung berapa? Bisa bayar QRIS kan?”",
        chip: "Ongkir dihitung + link bayar terkirim",
      },
      {
        initials: "DW",
        accent: "#B64ABF",
        who: "Dewi — TikTok",
        msg: "“Saya sudah transfer ya, tolong dicek”",
        chip: "Order dibuat otomatis di OMS",
      },
    ],
    stats: [
      { value: "1,8 dtk", label: "rata-rata balasan AI" },
      { value: "92%", label: "chat dijawab otomatis", spark: true },
      { value: "+34%", label: "closing minggu ini" },
    ],
  },

  proof: {
    eyebrow: "Bukti sosial",
    heading: "Dipakai bisnis yang bertumbuh di Asia Tenggara",
    stats: [
      { value: "10", suffix: "M+", label: "percakapan ditangani setiap bulan" },
      {
        value: "3.000",
        suffix: "+",
        label: "bisnis di Indonesia, Singapura & Malaysia",
      },
      { value: "<2", suffix: " mnt", label: "rata-rata waktu balas pertama" },
    ],
    logosLabel: "Dipercaya oleh",
    logosNote:
      "Sebagian merek yang menjalankan layanan dan penjualannya di Cekat.AI.",
  },

  pillars: {
    eyebrow: "Kenapa Cekat.AI",
    heading: "Independen, terhubung, dan terbuka",
    body: "Tiga prinsip yang membuat platform ini tetap sederhana saat bisnis Anda bertambah kompleks.",
    items: [
      {
        index: "01",
        title: "Independen",
        body: "Nomor WhatsApp, knowledge base, dan data pelanggan tetap milik Anda. Tidak ada kunci yang membuat Anda sulit pindah.",
        points: [
          "Data bisa diekspor kapan saja",
          "Tanpa kontrak minimum",
          "Kontrol penuh atas knowledge base",
        ],
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Terhubung",
        body: "Chat, CRM, order, dan marketing bekerja di atas satu data pelanggan — jadi konteks tidak putus di antara tim.",
        points: [
          "Satu inbox untuk semua channel",
          "Pipeline terisi otomatis",
          "Riwayat lengkap per pelanggan",
        ],
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Terbuka",
        body: "Open API dan integrasi resmi menghubungkan Cekat.AI dengan sistem yang sudah Anda pakai hari ini.",
        points: [
          "Open API & webhook",
          "Meta Business Partner resmi",
          "Integrasi sistem internal",
        ],
        accent: "#22C55E",
      },
    ],
  },

  howItWorks: {
    eyebrow: "Cara kerja",
    heading: "Satu lingkaran, lima langkah",
    body: "Setiap langkah mengisi langkah berikutnya. Anda tidak perlu mengganti seluruh cara kerja tim — cukup sambungkan satu per satu.",
    stageLabel: "Tahapan",
    steps: [
      {
        index: "01",
        title: "Sambungkan channel",
        body: "Hubungkan nomor WhatsApp Business, Instagram, TikTok, dan live chat website. Semua percakapan langsung mengalir ke satu inbox.",
        hint: "± 10 menit",
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Latih AI dari data Anda",
        body: "Tempel SOP, daftar harga, dan pertanyaan yang sering muncul ke knowledge base. AI memakai jawaban Anda, bukan tebakan.",
        hint: "Tanpa coding",
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Biarkan AI melayani lebih dulu",
        body: "AI menjawab pertanyaan berulang, mengualifikasi calon pembeli, dan mengeskalasi ke manusia begitu kasusnya sensitif atau siap closing.",
        hint: "Aktif 24/7",
        accent: "#4AB6BF",
      },
      {
        index: "04",
        title: "Ubah percakapan jadi order",
        body: "Ongkir dihitung, link pembayaran dikirim, dan pesanan tercatat otomatis di OMS lengkap dengan status pengiriman.",
        hint: "Otomatis",
        accent: "#22C55E",
      },
      {
        index: "05",
        title: "Ukur dan ulangi",
        body: "Dashboard menunjukkan ROAS, closing rate, dan performa tiap channel. Perbaiki yang lambat, perbesar yang bekerja.",
        hint: "Real-time",
        accent: "#4A4ABF",
      },
    ],
  },

  caseStudy: {
    eyebrow: "Studi kasus",
    client: "Nature Craft Indonesia",
    title: "Closing rate naik dua kali, omzet ikut terbawa",
    body: "Sebelum Cekat.AI, tim Nature Craft membalas chat secara manual dan kehilangan banyak leads di jam sibuk. Setelah AI mengambil pertanyaan awal dan CRM mengisi pipeline sendiri, tim hanya menangani percakapan yang siap closing.",
    quote:
      "Closing rate kami dulu di bawah 20 persen. Sekarang di atas 40 persen — dan karena closing rate naik, omzet kami ikut naik drastis.",
    attribution: "Hariyudi · Direktur, Nature Craft Indonesia",
    metrics: [
      { value: "20→40", suffix: "%", label: "closing rate" },
      { value: "50", suffix: "%", label: "pertumbuhan omzet" },
      { value: "24/7", suffix: "", label: "layanan tanpa nambah tim" },
    ],
    cta: { label: "Baca ceritanya", href: "/cerita/nature-craft" },
  },

  trust: {
    eyebrow: "Keamanan & integrasi",
    heading: "Fondasi sebelum data pelanggan dipercayakan",
    body: "Kontrol akses, kepatuhan hukum Indonesia, dan jalur resmi Meta — dibangun sejak awal, bukan ditambahkan belakangan.",
    chips: ["UU PDP", "Meta Business Partner", "RBAC", "ISO 9001 & ISO 27001"],
    cards: [
      {
        index: "01",
        title: "Patuh UU PDP",
        body: "Pengelolaan data pengguna mengikuti UU Perlindungan Data Pribadi Indonesia, bukan sekadar klaim marketing.",
      },
      {
        index: "02",
        title: "Akses berbasis peran",
        body: "RBAC menentukan siapa boleh melihat percakapan, kontak, dan pipeline — sales, support, dan billing dapat porsinya masing-masing.",
      },
      {
        index: "03",
        title: "Jalur resmi WhatsApp",
        body: "Trafik WhatsApp berjalan di Business API resmi dengan template yang disetujui Meta, bukan gateway tidak resmi.",
      },
      {
        index: "04",
        title: "Tersertifikasi ISO",
        body: "Cekat.AI memegang sertifikasi ISO 9001:2015 dan ISO/IEC 27001:2022. Kebutuhan compliance spesifik dibahas saat onboarding.",
      },
    ],
    integrationsLabel: "Terhubung dengan alat yang sudah Anda pakai",
    integrationsNote:
      "Channel, iklan, dan sistem internal dalam satu jaringan.",
    integrations: [
      "WhatsApp",
      "Instagram",
      "TikTok",
      "Meta Ads",
      "Google Ads",
      "Tokopedia",
      "Shopee",
      "Open API",
    ],
  },

  liveStage: {
    eyebrow: "Live stage",
    heading: "Produknya bekerja di dalam satu percakapan",
    body: "Enam muka produk Cekat.AI bergantian memperlihatkan alur yang sama: percakapan masuk, data tercatat, order jalan, lalu kampanye menyusul.",
    caption:
      "Enam kartu produk Cekat.AI yang bergantian tampil otomatis di atas dashboard — tanpa kontrol manual.",
    cards: [
      {
        kind: "chat",
        label: "AI Sales Chat",
        title: "Sari Wijaya",
        badge: "AI Agent",
        lines: [
          "Kak, masih ready navy size L?",
          "Ready! Stoknya aku kunci dulu ya — dibuatkan ordernya?",
        ],
        quick: ["Buat order", "Lihat katalog"],
        footnote: "WhatsApp · online",
        metric: { value: "8 dtk", label: "balasan pertama" },
      },
      {
        kind: "order",
        label: "OMS · Order Management",
        title: "Order #CK-2417",
        badge: "Baru",
        lines: ["Kemeja Linen", "Navy · Size L · Qty 1"],
        rows: [
          { label: "Subtotal", value: "Rp 350.000" },
          { label: "Ongkir", value: "Gratis" },
          { label: "Total", value: "Rp 350.000" },
        ],
        chips: ["WhatsApp", "Instagram", "Tokopedia"],
        steps: ["Dibuat", "Dibayar", "Dikirim"],
        footnote: "Pembayaran diterima",
      },
      {
        kind: "crm",
        label: "CRM Omnichannel",
        title: "Sari Wijaya",
        lines: ["Pelanggan berulang · Bandung"],
        chips: ["VIP", "Iklan Instagram", "WhatsApp"],
        rows: [
          { label: "Order", value: "7" },
          { label: "AOV", value: "Rp 480rb" },
          { label: "Terakhir", value: "2 bln" },
        ],
        steps: ["Lead", "Order", "Loyal"],
      },
      {
        kind: "mini",
        label: "Mini Agent · Widget situs",
        title: "Cekat Mini Agent",
        badge: "Live",
        lines: [
          "Ada warna lain selain navy?",
          "Ada, kak! Sage dan Sand masih ready — kirim gambarnya ya.",
        ],
        rows: [
          { label: "Kemeja Sage", value: "Rp 350rb" },
          { label: "Kemeja Sand", value: "Rp 350rb" },
        ],
        quick: ["Tambah ke keranjang"],
        footnote: "Menjawab pengunjung situs 24/7",
      },
      {
        kind: "consulting",
        label: "Consulting Agent",
        title: "Rekomendasi mingguan",
        badge: "Mingguan",
        footnote: "Tiga langkah untuk toko kamu minggu ini",
        lines: [
          "Restock Navy ×40 sebelum akhir pekan",
          "Aktifkan promo bundling Sabtu 10.00–14.00",
          "Broadcast ke 212 pelanggan VIP yang belum beli 30 hari",
        ],
        bars: [42, 55, 48, 70, 64, 86, 96],
        days: ["S", "S", "R", "K", "J", "S", "M"],
        metric: { value: "+24%", label: "Order / hari" },
        quick: ["Terapkan saran"],
      },
      {
        kind: "marketing",
        label: "Cekat Marketing",
        title: "Promo Linen Weekend",
        badge: "Berjalan",
        lines: ["2.480 pelanggan · VIP + cart abandon"],
        rows: [
          { label: "Terkirim", value: "2.480" },
          { label: "Dibuka", value: "18%" },
          { label: "Klik", value: "312" },
        ],
        metric: { value: "4,8×", label: "ROAS · 30 hari" },
        spark: [8, 12, 11, 22, 26, 38, 52, 70, 86, 96],
        footnote: "Omzet dari iklan · Rp 8,4jt",
      },
    ],
  },

  signals: {
    eyebrow: "Sinyal pelanggan",
    heading: "Jangan sampai kehilangan momen penting",
    body: "Setiap sinyal dari chat, iklan, dan order tertangkap otomatis — tim tahu persis kapan harus bertindak, tanpa harus memantau semua channel sendiri.",
    cta: { label: "Lihat cara kerja sinyal", href: "/chat" },
    rows: [
      [
        { text: "Customer tanya harga di DM Instagram", accent: "#B64ABF" },
        { text: "Cart dibuang 2 jam lalu", accent: "#22C55E" },
        { text: "Lead dari iklan belum di-follow up", accent: "#0EA5E9" },
        { text: "Chat masuk di luar jam kerja", accent: "#4AB6BF" },
        { text: "Customer lama balik setelah 6 bulan", accent: "#4A4ABF" },
        { text: "Promo berakhir besok, belum diingatkan", accent: "#EC4899" },
      ],
      [
        { text: "Pesanan belum dibayar lewat 1 hari", accent: "#4A4ABF" },
        { text: "Broadcast dibuka tapi belum dibalas", accent: "#EC4899" },
        { text: "Prospek tanya ongkir ke 3 kota", accent: "#1352BF" },
        { text: "Booking besok dikonfirmasi AI", accent: "#22C55E" },
        { text: "Komplain keterlambatan dikirim ke CS", accent: "#F472B6" },
        { text: "50 chat masuk dari iklan Meta hari ini", accent: "#0EA5E9" },
      ],
      [
        { text: "Follow-up otomatis terkirim H+1", accent: "#22C55E" },
        { text: "Customer pindah ke paket premium", accent: "#B64ABF" },
        { text: "Jadwal demo dijadwalkan ulang", accent: "#4AB6BF" },
        {
          text: "AI menawarkan produk relevan ke 128 customer",
          accent: "#0EA5E9",
        },
        { text: "Nilai order naik dua kali lipat", accent: "#4A4ABF" },
        { text: "Story dibuka 500×, klik tautan 40×", accent: "#EC4899" },
      ],
    ],
  },

  deck: {
    eyebrow: "Platform",
    heading: "Satu platform untuk semua pekerjaan",
    body: "Jelajahi bagaimana AI membantu setiap proses bisnis Anda, dari sales sampai operasional.",
    hint: "Klik kartu untuk membuka detailnya",
    items: [
      {
        title: "AI Sales Chat",
        headline: "Chat dibalas dalam hitungan detik",
        body: "AI membalas chat, mengualifikasi calon pembeli, dan meneruskan ke tim saat sudah siap closing. Semua channel masuk ke satu inbox — jalan 24/7 tanpa chat menumpuk.",
        points: [
          "Semua channel satu inbox",
          "Auto-handoff ke tim",
          "Jalan 24/7",
        ],
        accent: "#1352BF",
        image: {
          src: "/images/home/feature-chat-inbox.webp",
          alt: "Layar inbox percakapan Cekat.AI",
        },
        cta: { label: "Jelajahi AI Sales Chat", href: "/chat" },
      },
      {
        title: "CRM & Data Pelanggan",
        headline: "Data rapi tanpa input manual",
        body: "Setiap percakapan, pembelian, dan tahap pipeline tercatat sendiri dari chat. Tidak ada lagi rekap manual di akhir hari — semua tim melihat data yang sama.",
        points: [
          "Terisi otomatis dari chat",
          "Pipeline real-time",
          "Riwayat lengkap",
        ],
        accent: "#22C55E",
        image: {
          src: "/images/home/feature-crm-pipeline.webp",
          alt: "Layar pipeline CRM Cekat.AI",
        },
        cta: { label: "Jelajahi CRM", href: "/crm" },
      },
      {
        title: "Marketing & Broadcast",
        headline: "Tahu persis iklan yang closing",
        body: "Broadcast tersegmentasi, follow-up otomatis, dan atribusi yang menghubungkan belanja iklan ke penjualan nyata — dari klik iklan sampai chat jadi order.",
        points: ["Broadcast tersegmentasi", "Dashboard ROAS", "Integrasi CAPI"],
        accent: "#B64ABF",
        image: {
          src: "/images/home/feature-marketing-loop.webp",
          alt: "Layar dashboard marketing Cekat.AI",
        },
        cta: { label: "Jelajahi Marketing", href: "/marketing" },
      },
      {
        title: "Order & Automation",
        headline: "Order jalan langsung dari chat",
        body: "AI menghitung ongkir, mengirim tautan pembayaran, dan menjalankan alur lanjutan tanpa perlu coding — dari percakapan sampai pesanan beres.",
        points: ["Cek ongkir otomatis", "Pembayaran QRIS", "Tanpa coding"],
        accent: "#4A4ABF",
        image: {
          src: "/images/home/feature-oms-orders.webp",
          alt: "Layar order otomatis Cekat.AI",
        },
        cta: { label: "Jelajahi Order", href: "/order" },
      },
    ],
  },

  love: {
    eyebrow: "Testimoni",
    heading: "Kata pelanggan kami",
    body: "Ratusan bisnis di Indonesia, Singapura, dan Malaysia menjalankan layanan serta penjualannya di Cekat.AI.",
    columns: [
      [
        {
          quote: "Respon pelanggan jadi jauh lebih cepat.",
          name: "Silcia Brenda",
          role: "CEO & Founder · Moir Salon",
          initials: "S",
          accent: "#1352BF",
          avatar: "/images/home/testimonial-silica-brenda.jpg",
        },
        {
          quote:
            "Dulu saya harus begadang membalas mereka. Sekarang saya tidur nyenyak, dan pagi-pagi sudah antre orang minta jadwal survei. Peningkatan penjualan hampir 50%.",
          name: "Adam Sulaiman",
          role: "President Director · Threeland Property",
          initials: "A",
          accent: "#4A4ABF",
        },
      ],
      [
        {
          quote:
            "Closing rate kami dulu di bawah 20%. Sekarang sudah di atas 40% — dan karena closing rate naik, omzet kami ikut naik drastis.",
          name: "Hariyudi",
          role: "Direktur · Nature Craft Indonesia",
          initials: "H",
          accent: "#22C55E",
        },
        {
          quote:
            "Dulu satu chat bisa kami balas lebih dari 20 menit. Sekarang di bawah 2 menit, kami set di 30 detik. Omzet naik sekitar 30 sampai 40%.",
          name: "Gamal",
          role: "Founder & CEO · Putiih Skin Clinic",
          initials: "G",
          accent: "#B64ABF",
        },
      ],
      [
        {
          quote: "Peluang closing-nya sangat tinggi.",
          name: "Wiji Astuti",
          role: "Head of Customer Experience · Rumah Zakat",
          initials: "W",
          accent: "#0EA5E9",
          avatar: "/images/home/testimonial-wiji-astuti.jpg",
        },
        {
          quote:
            "Dengan Cekat AI, leads yang low quality difilter dulu, dan konversi kami naik dari sekitar 20% menjadi 28%.",
          name: "Bayu",
          role: "Head of Digital Marketing · Wall Street English",
          initials: "B",
          accent: "#4AB6BF",
        },
      ],
      [
        {
          quote: "Response rate kami meningkat 90%.",
          name: "Hargyo",
          role: "Direktur · Multimedia Nusantara Polytechnic",
          initials: "H",
          accent: "#3B82F6",
        },
        {
          quote:
            "Sekarang AMIRA menjawab 24 jam, kurang dari 1 menit. Kami tidak kehilangan donatur, dan peluang closing-nya besar sekali.",
          name: "Wiji Astuti",
          role: "Customer Experience Dept. Head · Rumah Zakat",
          initials: "W",
          accent: "#EC4899",
        },
      ],
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Pertanyaan sebelum mulai",
    body: "Jawaban singkat untuk keraguan yang paling sering muncul soal biaya, setup, dan kepemilikan data.",
    cta: { label: "Masih ada pertanyaan? Hubungi kami", href: "/contact" },
    items: [
      {
        q: "Berapa lama setup sampai bisa dipakai?",
        a: "Kebanyakan bisnis sudah bisa menjawab chat di hari yang sama. Sambungkan nomor WhatsApp, tempel knowledge base, nyalakan agent — tanpa coding dan tanpa proyek implementasi berbulan-bulan.",
      },
      {
        q: "Apakah harus beli semua produk sekaligus?",
        a: "Tidak. Mulai dari paket chat dulu. CRM, marketing, atau agent lain menyusul saat tim sudah terbiasa — datanya tetap nyambung di platform yang sama.",
      },
      {
        q: "Tim kami tidak punya developer. Tetap bisa jalan?",
        a: "Bisa. Builder-nya no-code: jelaskan peran agent, tempel SOP dan info bisnis, lalu nyalakan. Tim Cekat.AI mendampingi onboarding, termasuk verifikasi WABA bila Anda siap naik ke API resmi.",
      },
      {
        q: "Siapa yang memiliki data pelanggan kami?",
        a: "Anda. Data percakapan dan profil pelanggan milik bisnis Anda, bisa diekspor kapan saja, dan aksesnya diatur per peran di dalam tim.",
      },
      {
        q: "Bagaimana kalau AI menjawab salah?",
        a: "Anda mengontrol knowledge base dan batas aksi AI. Kasus sensitif atau di luar cakupan diserahkan ke manusia lengkap dengan riwayat chat, jadi otomatisasi tidak berarti kehilangan kendali.",
      },
    ],
  },

  pricing: {
    eyebrow: "Harga",
    heading: "Paket jelas, tumbuh bersama tim",
    body: "Semua paket termasuk uji coba gratis 14 hari dan bisa ditingkatkan kapan saja tanpa migrasi data.",
    note: "Harga lengkap dan perbandingan fitur tersedia di halaman harga.",
    popularLabel: "Paling dipilih",
    compare: { label: "Bandingkan semua paket", href: "/harga" },
    tiers: [
      {
        name: "Pro",
        tag: "Untuk tim kecil yang mulai kewalahan membalas chat.",
        rows: [
          { label: "Nomor WABA", value: "1" },
          { label: "MAU / bulan", value: "3.000" },
          { label: "AI credits", value: "15.000" },
          { label: "Tipe AI", value: "AI Simple" },
        ],
        cta: {
          label: "Coba Gratis 14 Hari",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Business",
        tag: "Untuk bisnis yang butuh otomatisasi penuh dan alur kerja rapi.",
        popular: true,
        rows: [
          { label: "Nomor WABA", value: "3" },
          { label: "MAU / bulan", value: "10.000" },
          { label: "AI credits", value: "50.000" },
          { label: "Tipe AI", value: "AI Full" },
        ],
        cta: {
          label: "Coba Gratis 14 Hari",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Enterprise",
        tag: "Untuk volume chat besar dengan tim layanan terstruktur.",
        rows: [
          { label: "Nomor WABA", value: "5" },
          { label: "MAU / bulan", value: "30.000" },
          { label: "AI credits", value: "150.000" },
          { label: "Tipe AI", value: "AI Full" },
        ],
        cta: { label: "Hubungi Sales", href: "/contact" },
      },
    ],
  },

  finalCta: {
    eyebrow: "Mulai sekarang",
    titleLead: "Coba gratis 14 hari,",
    titleAccent: "langsung dari sini",
    body: "Balas lebih cepat, follow-up otomatis, dan closing lebih banyak — tanpa harus menambah tim.",
    checks: [
      "Setup 10 menit",
      "Pendampingan 1-on-1",
      "Bisa berhenti kapan saja",
    ],
    ctaPrimary: {
      label: "Coba Gratis 14 Hari",
      href: "https://chat.cekat.ai/register",
    },
    ctaSecondary: { label: "Ngobrol dengan tim", href: "/contact" },
  },

  footer: {
    about:
      "AI Agent & Omnichannel CRM untuk bisnis Indonesia — balas lebih cepat, follow-up otomatis, closing lebih banyak.",
    partner: "Meta Business Partner Resmi",
    columns: [
      {
        title: "Produk",
        links: [
          { label: "AI Sales Chat", href: "/chat" },
          { label: "CRM & Data Pelanggan", href: "/crm" },
          { label: "Marketing & Broadcast", href: "/marketing" },
          { label: "Order & Automation", href: "/order" },
        ],
      },
      {
        title: "Jelajahi",
        links: [
          { label: "Semua fitur", href: "/fitur" },
          { label: "Semua industri", href: "/industri" },
          { label: "Solusi per peran", href: "/solusi" },
          { label: "Integrasi", href: "/integrasi" },
        ],
      },
      {
        title: "Perusahaan",
        links: [
          { label: "Tentang kami", href: "/tentang" },
          { label: "Cerita pelanggan", href: "/cerita" },
          { label: "Blog", href: "/blog" },
          { label: "Kontak", href: "/contact" },
        ],
      },
      {
        title: "Bandingkan & legal",
        links: [
          { label: "Perbandingan", href: "/perbandingan" },
          { label: "Kebijakan privasi", href: "/privacy-policy" },
          { label: "Syarat & ketentuan", href: "/terms-and-conditions" },
          { label: "Kebijakan retur", href: "/return-refund-delivery-policy" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} PT Teknologi Cekat Indonesia. Seluruh hak cipta dilindungi.`,
    socials: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
};

const EN: HomeContent = {
  meta: {
    title: "New Homepage (Draft) — Cekat.AI",
    description:
      "Homepage redesign draft: a light canvas, diagrams that explain the product, and the Growth Loop as the headline story.",
  },

  nav: {
    login: { label: "Log in", href: "https://chat.cekat.ai/login" },
    cta: { label: "Start free", href: "https://chat.cekat.ai/register" },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuLabel: "Main menu",
    links: [
      {
        label: "Product",
        megaIntro: "One platform, four jobs that feed each other.",
        mega: [
          {
            title: "Platform",
            items: [
              { label: "AI Sales Chat", href: "/en/chat" },
              { label: "CRM & Customer Data", href: "/en/crm" },
              { label: "Marketing & Broadcast", href: "/en/marketing" },
              { label: "Order & Automation", href: "/en/order" },
            ],
          },
          {
            title: "Popular features",
            items: [
              {
                label: "WhatsApp Call AI",
                href: "/en/features/whatsapp-call-ai-summary",
              },
              {
                label: "Website Live Chat",
                href: "/en/features/embedded-live-chat",
              },
              {
                label: "Team Inbox",
                href: "/en/features/whatsapp-multi-agent",
              },
              { label: "Knowledge Base", href: "/en/features/knowledge-base" },
            ],
          },
        ],
      },
      { label: "Solutions", href: "/en/solutions" },
      {
        label: "Industries",
        megaIntro:
          "Every industry has its own conversation pattern — we already speak it.",
        mega: [
          {
            title: "Industries",
            items: [
              { label: "Healthcare", href: "/en/industries/healthcare" },
              {
                label: "Retail & E-commerce",
                href: "/en/industries/retail-ecommerce",
              },
              {
                label: "Food & Beverage",
                href: "/en/industries/food-beverage",
              },
              { label: "Logistics", href: "/en/industries/logistics" },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Financial Services",
                href: "/en/industries/financial-services",
              },
              { label: "Property", href: "/en/industries/property" },
              { label: "Education", href: "/en/industries/education" },
              {
                label: "Beauty & Wellness",
                href: "/en/industries/beauty-wellness",
              },
            ],
          },
        ],
      },
      { label: "Pricing", href: "/en/pricing" },
      { label: "Blog", href: "/en/blog" },
    ],
  },

  hero: {
    pill: {
      label: "New · WhatsApp Call AI",
      href: "/en/features/whatsapp-call-ai-summary",
    },
    titleLead: "Turn leads into",
    titleAccent: "lifelong customers",
    sub: "Cekat.AI closes the loop between AI agents, omnichannel CRM, and automated follow-up — so every conversation moves toward a sale instead of stopping at the chat.",
    form: {
      label: "Work email",
      placeholder: "Enter your company email",
      cta: "Get free trial",
      note: "Free for 14 days · No credit card · 10-minute setup",
      errorRequired: "Please enter your work email first.",
      errorInvalid:
        "That email address does not look right. Example: name@company.com",
      secondary: { label: "See how it works", href: "#how-it-works" },
    },
    trust: [
      "10-minute setup",
      "No credit card",
      "Official Meta Business Partner",
    ],
  },

  dashboard: {
    url: "app.cekat.ai / inbox",
    nav: ["Inbox", "Customer CRM", "Marketing", "Orders", "Reports"],
    title: "Incoming conversations · WhatsApp",
    rows: [
      {
        initials: "RA",
        accent: "#1352BF",
        who: "Rani — Instagram DM",
        msg: "“Hi, is navy available? What is the discount for two?”",
        chip: "AI replied in 8 seconds",
      },
      {
        initials: "BS",
        accent: "#22C55E",
        who: "Bagus — WhatsApp",
        msg: "“How much is shipping to Bandung? Can I pay with QRIS?”",
        chip: "Shipping quoted + payment link sent",
      },
      {
        initials: "DW",
        accent: "#B64ABF",
        who: "Dewi — TikTok",
        msg: "“I have transferred the payment, please check”",
        chip: "Order created automatically in the OMS",
      },
    ],
    stats: [
      { value: "1.8 sec", label: "average AI reply" },
      { value: "92%", label: "chats answered automatically", spark: true },
      { value: "+34%", label: "closing this week" },
    ],
  },

  proof: {
    eyebrow: "Social proof",
    heading: "Used by growing businesses across Southeast Asia",
    stats: [
      { value: "10", suffix: "M+", label: "conversations handled monthly" },
      {
        value: "3,000",
        suffix: "+",
        label: "businesses in Indonesia, Singapore & Malaysia",
      },
      { value: "<2", suffix: " min", label: "average first response time" },
    ],
    logosLabel: "Trusted by",
    logosNote: "A sample of the brands running service and sales on Cekat.AI.",
  },

  pillars: {
    eyebrow: "Why Cekat.AI",
    heading: "Independent, connected, and open",
    body: "Three principles that keep the platform simple while your business gets more complex.",
    items: [
      {
        index: "01",
        title: "Independent",
        body: "Your WhatsApp number, knowledge base, and customer data stay yours. Nothing locks you in place.",
        points: [
          "Export your data any time",
          "No minimum contract",
          "Full control of the knowledge base",
        ],
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Connected",
        body: "Chat, CRM, orders, and marketing run on one customer record — so context never breaks between teams.",
        points: [
          "One inbox for every channel",
          "Pipeline fills itself",
          "Complete history per customer",
        ],
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Open",
        body: "An Open API and official integrations connect Cekat.AI to the systems you already run today.",
        points: [
          "Open API & webhooks",
          "Official Meta Business Partner",
          "Internal system integrations",
        ],
        accent: "#22C55E",
      },
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "One loop, five steps",
    body: "Each step feeds the next. You do not have to change how your team works — just connect one piece at a time.",
    stageLabel: "Stages",
    steps: [
      {
        index: "01",
        title: "Connect your channels",
        body: "Link your WhatsApp Business number, Instagram, TikTok, and website live chat. Every conversation starts flowing into a single inbox.",
        hint: "~10 minutes",
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Train AI on your own data",
        body: "Paste your SOPs, price list, and recurring questions into the knowledge base. The AI answers with your words, not guesses.",
        hint: "No code",
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Let AI take the first pass",
        body: "AI handles repeat questions, qualifies buyers, and escalates to a human the moment a case turns sensitive or is ready to close.",
        hint: "Always on",
        accent: "#4AB6BF",
      },
      {
        index: "04",
        title: "Turn conversations into orders",
        body: "Shipping is calculated, the payment link goes out, and the order lands in the OMS with fulfilment status attached.",
        hint: "Automatic",
        accent: "#22C55E",
      },
      {
        index: "05",
        title: "Measure and repeat",
        body: "Dashboards show ROAS, closing rate, and per-channel performance. Fix what drags, scale what works.",
        hint: "Real time",
        accent: "#4A4ABF",
      },
    ],
  },

  caseStudy: {
    eyebrow: "Case study",
    client: "Nature Craft Indonesia",
    title: "Closing rate doubled, revenue came with it",
    body: "Before Cekat.AI, the Nature Craft team answered every chat by hand and lost leads during busy hours. Once AI took the first questions and the CRM filled the pipeline itself, the team only handled conversations that were ready to close.",
    quote:
      "Our closing rate used to sit below 20 percent. It is above 40 percent now — and because the closing rate rose, revenue grew sharply with it.",
    attribution: "Hariyudi · Director, Nature Craft Indonesia",
    metrics: [
      { value: "20→40", suffix: "%", label: "closing rate" },
      { value: "50", suffix: "%", label: "revenue growth" },
      { value: "24/7", suffix: "", label: "coverage without extra headcount" },
    ],
    cta: { label: "Read the story", href: "/en/stories/nature-craft" },
  },

  trust: {
    eyebrow: "Security & integrations",
    heading: "The foundation before you trust us with customer data",
    body: "Access control, Indonesian data-protection compliance, and an official Meta path — built in from the start, not bolted on later.",
    chips: ["PDP Law", "Meta Business Partner", "RBAC", "ISO 9001 & ISO 27001"],
    cards: [
      {
        index: "01",
        title: "PDP Law compliant",
        body: "Customer data is handled under Indonesia's Personal Data Protection law — not just a marketing claim.",
      },
      {
        index: "02",
        title: "Role-based access",
        body: "RBAC decides who can see which conversations, contacts, and pipelines. Sales, support, and billing each get their share and nothing more.",
      },
      {
        index: "03",
        title: "Official WhatsApp path",
        body: "WhatsApp traffic runs on the official Business API with Meta-approved templates, not an unofficial gateway.",
      },
      {
        index: "04",
        title: "ISO certified",
        body: "Cekat.AI holds ISO 9001:2015 and ISO/IEC 27001:2022 certifications. Company-specific compliance is covered during onboarding.",
      },
    ],
    integrationsLabel: "Connects to the tools you already use",
    integrationsNote:
      "Channels, ad platforms, and internal systems in one network.",
    integrations: [
      "WhatsApp",
      "Instagram",
      "TikTok",
      "Meta Ads",
      "Google Ads",
      "Tokopedia",
      "Shopee",
      "Open API",
    ],
  },

  liveStage: {
    eyebrow: "Live stage",
    heading: "The product works inside one conversation",
    body: "Six faces of Cekat.AI take turns showing the same flow: a conversation arrives, data is captured, the order moves, and the campaign follows.",
    caption:
      "Six Cekat.AI product cards taking turns automatically above the dashboard — no manual controls.",
    cards: [
      {
        kind: "chat",
        label: "AI Sales Chat",
        title: "Sari Wijaya",
        badge: "AI Agent",
        lines: [
          "Hi, is navy still available in size L?",
          "Yes! Let me hold that stock for you — shall I create the order?",
        ],
        quick: ["Create order", "Browse catalog"],
        footnote: "WhatsApp · online",
        metric: { value: "8 sec", label: "first response" },
      },
      {
        kind: "order",
        label: "OMS · Order Management",
        title: "Order #CK-2417",
        badge: "New",
        lines: ["Linen Shirt", "Navy · Size L · Qty 1"],
        rows: [
          { label: "Subtotal", value: "IDR 350,000" },
          { label: "Shipping", value: "Free" },
          { label: "Total", value: "IDR 350,000" },
        ],
        chips: ["WhatsApp", "Instagram", "Tokopedia"],
        steps: ["Created", "Paid", "Shipped"],
        footnote: "Payment received",
      },
      {
        kind: "crm",
        label: "CRM Omnichannel",
        title: "Sari Wijaya",
        lines: ["Repeat customer · Bandung"],
        chips: ["VIP", "Instagram ad", "WhatsApp"],
        rows: [
          { label: "Orders", value: "7" },
          { label: "AOV", value: "IDR 480k" },
          { label: "Last seen", value: "2 mo" },
        ],
        steps: ["Lead", "Order", "Loyal"],
      },
      {
        kind: "mini",
        label: "Mini Agent · Website widget",
        title: "Cekat Mini Agent",
        badge: "Live",
        lines: [
          "Do you have other colours besides navy?",
          "Yes! Sage and Sand are both in stock — I'll send the photos.",
        ],
        rows: [
          { label: "Sage Shirt", value: "IDR 350k" },
          { label: "Sand Shirt", value: "IDR 350k" },
        ],
        quick: ["Add to cart"],
        footnote: "Answers website visitors 24/7",
      },
      {
        kind: "consulting",
        label: "Consulting Agent",
        title: "Weekly recommendations",
        badge: "Weekly",
        footnote: "Three moves for your store this week",
        lines: [
          "Restock Navy ×40 before the weekend",
          "Turn on the bundle promo Saturday 10:00–14:00",
          "Broadcast to 212 VIPs who have not bought in 30 days",
        ],
        bars: [42, 55, 48, 70, 64, 86, 96],
        days: ["S", "M", "T", "W", "T", "F", "S"],
        metric: { value: "+24%", label: "Orders / day" },
        quick: ["Apply suggestions"],
      },
      {
        kind: "marketing",
        label: "Cekat Marketing",
        title: "Linen Weekend Promo",
        badge: "Running",
        lines: ["2,480 customers · VIP + cart abandon"],
        rows: [
          { label: "Sent", value: "2,480" },
          { label: "Opened", value: "18%" },
          { label: "Clicks", value: "312" },
        ],
        metric: { value: "4.8×", label: "ROAS · 30 days" },
        spark: [8, 12, 11, 22, 26, 38, 52, 70, 86, 96],
        footnote: "Revenue from ads · IDR 8.4m",
      },
    ],
  },

  signals: {
    eyebrow: "Customer signals",
    heading: "Never miss the moment that matters",
    body: "Every signal from chat, ads, and orders is captured automatically — your team knows exactly when to act, without watching every channel themselves.",
    cta: { label: "See how signals work", href: "/en/chat" },
    rows: [
      [
        {
          text: "Customer asks for a price in an Instagram DM",
          accent: "#B64ABF",
        },
        { text: "Cart abandoned 2 hours ago", accent: "#22C55E" },
        { text: "Ad lead never followed up", accent: "#0EA5E9" },
        { text: "Chat arrived outside working hours", accent: "#4AB6BF" },
        { text: "Returning customer after 6 months", accent: "#4A4ABF" },
        { text: "Promo ends tomorrow, no reminder sent", accent: "#EC4899" },
      ],
      [
        { text: "Order unpaid for over a day", accent: "#4A4ABF" },
        { text: "Broadcast opened but never answered", accent: "#EC4899" },
        {
          text: "Prospect asked about shipping to 3 cities",
          accent: "#1352BF",
        },
        { text: "Tomorrow's booking confirmed by AI", accent: "#22C55E" },
        {
          text: "Late-delivery complaint routed to support",
          accent: "#F472B6",
        },
        { text: "50 chats from today's Meta ads", accent: "#0EA5E9" },
      ],
      [
        { text: "Automated follow-up sent on day 1", accent: "#22C55E" },
        { text: "Customer upgraded to the premium plan", accent: "#B64ABF" },
        { text: "Demo rescheduled", accent: "#4AB6BF" },
        {
          text: "AI offered relevant products to 128 customers",
          accent: "#0EA5E9",
        },
        { text: "Order value doubled", accent: "#4A4ABF" },
        { text: "Story seen 500×, link clicked 40×", accent: "#EC4899" },
      ],
    ],
  },

  deck: {
    eyebrow: "Platform",
    heading: "One platform for every job",
    body: "See how AI supports each part of your business, from sales through operations.",
    hint: "Click a card to open its detail",
    items: [
      {
        title: "AI Sales Chat",
        headline: "Chats answered in seconds",
        body: "AI replies, qualifies buyers, and hands off to your team the moment a deal is ready to close. Every channel lands in one inbox — running 24/7 with nothing left to pile up.",
        points: [
          "Every channel in one inbox",
          "Auto handoff to your team",
          "Always on",
        ],
        accent: "#1352BF",
        image: {
          src: "/images/home/feature-chat-inbox.webp",
          alt: "Cekat.AI conversation inbox screen",
        },
        cta: { label: "Explore AI Sales Chat", href: "/en/chat" },
      },
      {
        title: "CRM & Customer Data",
        headline: "Clean data, no manual entry",
        body: "Every conversation, purchase, and pipeline stage is recorded straight from the chat. No end-of-day recap — and every team reads the same record.",
        points: [
          "Filled from chat automatically",
          "Real-time pipeline",
          "Complete history",
        ],
        accent: "#22C55E",
        image: {
          src: "/images/home/feature-crm-pipeline.webp",
          alt: "Cekat.AI CRM pipeline screen",
        },
        cta: { label: "Explore CRM", href: "/en/crm" },
      },
      {
        title: "Marketing & Broadcast",
        headline: "Know exactly which ad closed",
        body: "Segmented broadcasts, automated follow-up, and attribution that ties ad spend to real revenue — from the ad click all the way to the order.",
        points: ["Segmented broadcasts", "ROAS dashboard", "Conversion API"],
        accent: "#B64ABF",
        image: {
          src: "/images/home/feature-marketing-loop.webp",
          alt: "Cekat.AI marketing dashboard screen",
        },
        cta: { label: "Explore Marketing", href: "/en/marketing" },
      },
      {
        title: "Order & Automation",
        headline: "Orders happen inside the chat",
        body: "AI calculates shipping, sends the payment link, and runs the follow-on workflow with no code — from the conversation to a finished order.",
        points: ["Automatic shipping quotes", "QRIS payments", "No code"],
        accent: "#4A4ABF",
        image: {
          src: "/images/home/feature-oms-orders.webp",
          alt: "Cekat.AI automated order screen",
        },
        cta: { label: "Explore Order", href: "/en/order" },
      },
    ],
  },

  love: {
    eyebrow: "Testimonials",
    heading: "What our customers say",
    body: "Hundreds of businesses across Indonesia, Singapore, and Malaysia run their service and sales on Cekat.AI.",
    columns: [
      [
        {
          quote: "Customer responses are far quicker now.",
          name: "Silcia Brenda",
          role: "CEO & Founder · Moir Salon",
          initials: "S",
          accent: "#1352BF",
          avatar: "/images/home/testimonial-silica-brenda.jpg",
        },
        {
          quote:
            "I used to stay up answering them. Now I sleep well, and by morning people are queuing up to book a viewing. Sales are up almost 50%.",
          name: "Adam Sulaiman",
          role: "President Director · Threeland Property",
          initials: "A",
          accent: "#4A4ABF",
        },
      ],
      [
        {
          quote:
            "Our closing rate used to sit below 20%. It is above 40% now — and because the closing rate rose, revenue grew sharply with it.",
          name: "Hariyudi",
          role: "Director · Nature Craft Indonesia",
          initials: "H",
          accent: "#22C55E",
        },
        {
          quote:
            "A single chat used to take us over 20 minutes to answer. Now it is under 2, and we target 30 seconds. Revenue is up around 30 to 40%.",
          name: "Gamal",
          role: "Founder & CEO · Putiih Skin Clinic",
          initials: "G",
          accent: "#B64ABF",
        },
      ],
      [
        {
          quote: "The closing opportunity is very high.",
          name: "Wiji Astuti",
          role: "Head of Customer Experience · Rumah Zakat",
          initials: "W",
          accent: "#0EA5E9",
          avatar: "/images/home/testimonial-wiji-astuti.jpg",
        },
        {
          quote:
            "With Cekat AI, low-quality leads get filtered first, and our conversion went from around 20% to 28%.",
          name: "Bayu",
          role: "Head of Digital Marketing · Wall Street English",
          initials: "B",
          accent: "#4AB6BF",
        },
      ],
      [
        {
          quote: "Our response rate improved by 90%.",
          name: "Hargyo",
          role: "Director · Multimedia Nusantara Polytechnic",
          initials: "H",
          accent: "#3B82F6",
        },
        {
          quote:
            "AMIRA now answers 24 hours a day in under a minute. We stopped losing donors, and the closing opportunity is huge.",
          name: "Wiji Astuti",
          role: "Customer Experience Dept. Head · Rumah Zakat",
          initials: "W",
          accent: "#EC4899",
        },
      ],
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Questions before you start",
    body: "Short answers to the most common doubts about cost, setup, and who owns your data.",
    cta: { label: "Still curious? Talk to us", href: "/en/contact" },
    items: [
      {
        q: "How long does setup take?",
        a: "Most businesses are answering chats the same day. Connect your WhatsApp number, paste in your knowledge base, switch the agent on — no code and no multi-month implementation project.",
      },
      {
        q: "Do we have to buy every product at once?",
        a: "No. Start with the chat plan. CRM, marketing, or other agents can follow once your team is comfortable — the data stays connected on the same platform.",
      },
      {
        q: "We have no developer. Can we still run it?",
        a: "Yes. The builder is no-code: describe the agent's role, paste your SOPs and business information, then switch it on. The Cekat.AI team supports onboarding, including WABA verification when you are ready for the official API.",
      },
      {
        q: "Who owns our customer data?",
        a: "You do. Conversation and customer profile data belongs to your business, can be exported at any time, and is access-controlled per role inside your team.",
      },
      {
        q: "What if the AI answers incorrectly?",
        a: "You control the knowledge base and the limits of what the AI may do. Sensitive or out-of-scope cases are handed to a human with the full chat history, so automation never means losing control.",
      },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "Clear plans that grow with your team",
    body: "Every plan includes a 14-day free trial and can be upgraded at any time without a data migration.",
    note: "Full pricing and a feature-by-feature comparison live on the pricing page.",
    popularLabel: "Most popular",
    compare: { label: "Compare every plan", href: "/en/pricing" },
    tiers: [
      {
        name: "Pro",
        tag: "For small teams starting to drown in replies.",
        rows: [
          { label: "WABA numbers", value: "1" },
          { label: "MAU / month", value: "3,000" },
          { label: "AI credits", value: "15,000" },
          { label: "AI type", value: "AI Simple" },
        ],
        cta: {
          label: "Start free for 14 days",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Business",
        tag: "For businesses that need full automation and tidy workflows.",
        popular: true,
        rows: [
          { label: "WABA numbers", value: "3" },
          { label: "MAU / month", value: "10,000" },
          { label: "AI credits", value: "50,000" },
          { label: "AI type", value: "AI Full" },
        ],
        cta: {
          label: "Start free for 14 days",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Enterprise",
        tag: "For high conversation volume with a structured service team.",
        rows: [
          { label: "WABA numbers", value: "5" },
          { label: "MAU / month", value: "30,000" },
          { label: "AI credits", value: "150,000" },
          { label: "AI type", value: "AI Full" },
        ],
        cta: { label: "Contact sales", href: "/en/contact" },
      },
    ],
  },

  finalCta: {
    eyebrow: "Start now",
    titleLead: "Try it free for 14 days,",
    titleAccent: "right from here",
    body: "Reply faster, follow up automatically, and close more — without adding headcount.",
    checks: ["10-minute setup", "1-on-1 onboarding", "Cancel any time"],
    ctaPrimary: {
      label: "Start free for 14 days",
      href: "https://chat.cekat.ai/register",
    },
    ctaSecondary: { label: "Talk to the team", href: "/en/contact" },
  },

  footer: {
    about:
      "AI Agent and Omnichannel CRM for Indonesian businesses — reply faster, follow up automatically, close more.",
    partner: "Official Meta Business Partner",
    columns: [
      {
        title: "Product",
        links: [
          { label: "AI Sales Chat", href: "/en/chat" },
          { label: "CRM & Customer Data", href: "/en/crm" },
          { label: "Marketing & Broadcast", href: "/en/marketing" },
          { label: "Order & Automation", href: "/en/order" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "All features", href: "/en/features" },
          { label: "All industries", href: "/en/industries" },
          { label: "Solutions by role", href: "/en/solutions" },
          { label: "Integrations", href: "/en/integrations" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/en/about" },
          { label: "Customer stories", href: "/en/stories" },
          { label: "Blog", href: "/en/blog" },
          { label: "Contact", href: "/en/contact" },
        ],
      },
      {
        title: "Compare & legal",
        links: [
          { label: "Comparison", href: "/en/comparison" },
          { label: "Privacy policy", href: "/en/privacy-policy" },
          { label: "Terms & conditions", href: "/en/terms-and-conditions" },
          { label: "Refund policy", href: "/en/return-refund-delivery-policy" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} PT Teknologi Cekat Indonesia. All rights reserved.`,
    socials: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
};

export const CONTENT: Record<"id" | "en", HomeContent> = { id: ID, en: EN };

export function getContent(locale: string): HomeContent {
  return locale === "en" ? EN : ID;
}
