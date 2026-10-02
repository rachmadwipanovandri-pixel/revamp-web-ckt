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
    title: "Cekat.AI — Dari Chat Pertama Jadi Pelanggan Seumur Hidup",
    description:
      "Cekat.AI membalas otomatis chat WhatsApp, Instagram, dan TikTok, mengingatkan yang belum bayar, dan mencatat pelanggan rapi — supaya chat jadi penjualan, ketahuan iklan mana yang closing, dan pelanggan balik lagi.",
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
        megaIntro:
          "Satu tempat untuk balas chat, catat pelanggan, kirim promo, dan terima order.",
        mega: [
          {
            title: "Platform",
            items: [
              { label: "Balas Chat Otomatis", href: "/chat" },
              { label: "Data Pelanggan (CRM)", href: "/crm" },
              { label: "Promosi & Broadcast", href: "/marketing" },
              { label: "Order & Otomatisasi", href: "/order" },
            ],
          },
          {
            title: "Fitur populer",
            items: [
              {
                label: "Telepon AI via WhatsApp",
                href: "/fitur/whatsapp-call-ai",
              },
              { label: "Chat Website", href: "/fitur/live-chat-website" },
              { label: "Satu Inbox untuk Tim", href: "/fitur/multichat-wa" },
              { label: "Sumber Jawaban AI", href: "/fitur/knowledge-base" },
            ],
          },
        ],
      },
      { label: "Solusi", href: "/solusi" },
      {
        label: "Industri",
        megaIntro:
          "Tiap usaha punya pertanyaan khas — klinik, resto, toko, sekolah — kami sudah menyiapkan jawabannya.",
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
    pill: {
      label: "Baru · Bisa telepon otomatis via WhatsApp",
      href: "/fitur/whatsapp-call-ai",
    },
    titleLead: "Dari klien baru jadi",
    titleAccent: "pelanggan seumur hidup",
    sub: "Cekat.AI membalas otomatis chat WhatsApp, Instagram, dan TikTok, mengingatkan pelanggan yang belum bayar, dan mencatat semuanya rapi — supaya tiap chat bergerak ke penjualan, ketahuan iklan mana yang closing, dan pelanggan balik lagi.",
    form: {
      label: "Email kerja",
      placeholder: "Masukkan email kerja Anda",
      cta: "Coba Gratis",
      note: "Gratis 14 hari · Tanpa kartu kredit · Siap dalam 10 menit",
      errorRequired: "Mohon isi email kerja Anda dulu.",
      errorInvalid: "Format email belum tepat. Contoh: nama@perusahaan.com",
      secondary: { label: "Lihat cara kerjanya", href: "#how-it-works" },
    },
  },

  dashboard: {
    url: "app.cekat.ai / inbox",
    nav: ["Inbox", "Pelanggan", "Promosi", "Order", "Laporan"],
    title: "Chat masuk · WhatsApp",
    rows: [
      {
        initials: "RA",
        accent: "#1352BF",
        who: "Rani — Instagram DM",
        msg: "“Kak, ready warna navy? Kalau ambil 2 dapat diskon berapa ya?”",
        chip: "Dibalas AI dalam 8 detik",
      },
      {
        initials: "BS",
        accent: "#22C55E",
        who: "Bagus — WhatsApp",
        msg: "“Ongkir ke Bandung berapa? Bisa bayar QRIS kan?”",
        chip: "Ongkir + link bayar terkirim otomatis",
      },
      {
        initials: "DW",
        accent: "#B64ABF",
        who: "Dewi — TikTok",
        msg: "“Saya sudah transfer ya, tolong dicek”",
        chip: "Pesanan tercatat otomatis",
      },
    ],
    stats: [
      { value: "1,8 dtk", label: "rata-rata AI membalas" },
      { value: "92%", label: "chat terbantu otomatis", spark: true },
      { value: "+34%", label: "chat jadi pembeli minggu ini" },
    ],
  },

  proof: {
    eyebrow: "Dipercaya 3.000+ bisnis",
    heading: "Dipakai bisnis yang bertumbuh di Asia Tenggara",
    stats: [
      { value: "10", suffix: "M+", label: "percakapan dibantu setiap bulan" },
      {
        value: "3.000",
        suffix: "+",
        label: "bisnis di Indonesia, Singapura & Malaysia",
      },
      { value: "<2", suffix: " mnt", label: "rata-rata chat pertama dibalas" },
    ],
    logosLabel: "Dipercaya oleh",
    logosNote:
      "Sebagian brand yang menjalankan penjualan dan layanannya di Cekat.AI.",
  },

  pillars: {
    eyebrow: "Kenapa Cekat.AI",
    heading: "Semua Data Milik Anda",
    body: "Tiga hal yang bikin kerjaan tetap gampang walau chat makin ramai dan tim makin besar.",
    items: [
      {
        index: "01",
        title: "Tetap milik Anda",
        body: "Nomor WhatsApp, jawaban AI, dan data pelanggan tetap milik Anda. Pindah pun gampang, tidak dikunci.",
        points: [
          "Nomor WhatsApp tetap milik Anda",
          "Data bisa diunduh kapan saja",
          "Tanpa kontrak yang mengunci",
        ],
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Semua tersambung",
        body: "Chat, data pelanggan, order, dan promosi memakai catatan yang sama — jadi tidak ada info yang hilang antar admin.",
        points: [
          "Satu tempat untuk semua chat",
          "Catatan pelanggan terisi sendiri",
          "Semua tim lihat riwayat yang sama",
        ],
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Gampang dihubungkan",
        body: "Cekat.AI nyambung ke iklan, marketplace, dan sistem yang sudah Anda pakai hari ini lewat jalur resmi.",
        points: [
          "Terhubung ke iklan Meta & Google",
          "Terhubung ke Tokopedia & Shopee",
          "Jalur resmi WhatsApp (Meta Partner)",
        ],
        accent: "#22C55E",
      },
    ],
  },

  howItWorks: {
    eyebrow: "Cara kerja",
    heading: "Dari chat masuk sampai repeat order",
    body: "Lima langkah yang saling terhubung. Anda tidak perlu mengubah cara kerja tim, cukup sambungkan satu per satu.",
    stageLabel: "Tahapan",
    steps: [
      {
        index: "01",
        title: "Sambungkan chat Anda",
        body: "Hubungkan nomor WhatsApp bisnis, Instagram, TikTok, dan chat website. Semua chat masuk ke satu tempat.",
        hint: "± 10 menit",
        accent: "#1352BF",
        visual: "channels",
      },
      {
        index: "02",
        title: "Tempel info usaha Anda",
        body: "Tempel daftar harga, jawaban yang sering ditanya, dan aturan toko ke sumber jawaban. AI menjawab pakai kata-kata Anda, bukan mengarang.",
        hint: "Tanpa coding",
        accent: "#0EA5E9",
        visual: "knowledge",
      },
      {
        index: "03",
        title: "Biarkan AI jawab duluan",
        body: "AI menjawab pertanyaan yang berulang, memilah yang serius mau beli, dan meneruskan ke admin saat sudah mau closing atau butuh manusia.",
        hint: "Aktif 24/7",
        accent: "#4AB6BF",
        visual: "ai",
      },
      {
        index: "04",
        title: "Chat berubah jadi order",
        body: "Ongkir dihitung, link bayar dikirim, pesanan tercatat otomatis lengkap dengan status bayar dan kirim.",
        hint: "Otomatis",
        accent: "#22C55E",
        visual: "order",
      },
      {
        index: "05",
        title: "Lihat mana yang cuan",
        body: "Terlihat jelas iklan mana yang balik modal, chat mana yang jadi order, dan channel mana yang paling laris. Perbaiki yang lambat, besarkan yang jalan.",
        hint: "Real-time",
        accent: "#4A4ABF",
        visual: "chart",
      },
    ],
    diagrams: {
      channels: {
        caption: "Empat chat masuk ke satu tempat",
        inbox: "Satu inbox tim",
        channels: ["WhatsApp", "Instagram", "TikTok", "Live chat"],
      },
      knowledge: {
        caption: "Info Anda jadi satu sumber jawaban",
        sources: ["Aturan toko", "Daftar harga", "Jawaban umum"],
        base: "Sumber jawaban",
        answer: "Jawaban pakai kata Anda sendiri",
      },
      ai: {
        caption: "AI menjawab banyak, manusia menutup",
        handled: "92% dibantu AI",
        escalate: "Diteruskan saat sensitif",
        human: "Tim Anda",
      },
      order: {
        caption: "Dari chat menjadi order lunas dan terkirim",
        chat: "Chat pelanggan",
        steps: ["Ongkir", "Bayar", "Order", "Kirim"],
        total: "Status bayar & kirim",
      },
      chart: {
        caption: "Hasil tiap channel dalam 30 hari",
        series: [
          { label: "WhatsApp", value: 88 },
          { label: "Instagram", value: 71 },
          { label: "Iklan", value: 64 },
          { label: "Tokopedia", value: 47 },
        ],
        note: "Besarkan yang jalan, perbaiki yang lambat",
      },
    },
  },

  caseStudy: {
    eyebrow: "Studi kasus",
    client: "Nature Craft Indonesia",
    title: "Closing naik 2x lipat, omzet ikut naik 50%",
    body: "Dulu tim Nature Craft balas chat manual dan banyak chat hilang di jam sibuk. Setelah AI menjawab pertanyaan awal dan data pelanggan terisi sendiri, tim hanya menangani chat yang sudah mau closing.",
    quote:
      "Closing rate kami dulu di bawah 20 persen. Sekarang di atas 40 persen — dan karena closing rate naik, omzet kami ikut naik drastis.",
    attribution: "Hariyudi · Direktur, Nature Craft Indonesia",
    metrics: [
      { value: "20→40", suffix: "%", label: "chat jadi pembeli" },
      { value: "50", suffix: "%", label: "omzet naik" },
      { value: "24/7", suffix: "", label: "tetap jalan tanpa tambah admin" },
    ],
    cta: { label: "Baca ceritanya", href: "/cerita/nature-craft" },
  },

  trust: {
    eyebrow: "Aman & resmi",
    heading: "Aman untuk data pelanggan Anda",
    body: "Cekat.AI mengikuti hukum Indonesia, memakai jalur resmi WhatsApp dari Meta, dan mengatur siapa boleh lihat apa, dibangun sejak awal, tidak asal.",
    chips: [
      "Sesuai UU PDP Indonesia",
      "Partner resmi Meta",
      "Akses diatur per peran",
      "ISO 9001 & 27001",
    ],
    cards: [
      {
        index: "01",
        title: "Ikut hukum Indonesia",
        body: "Data pelanggan dikelola mengikuti UU Perlindungan Data Pribadi Indonesia, bukan sekadar janji marketing.",
      },
      {
        index: "02",
        title: "Siapa boleh lihat apa, diatur",
        body: "Akses diatur per peran — sales, support, dan keuangan hanya melihat bagiannya masing-masing.",
      },
      {
        index: "03",
        title: "WhatsApp jalur resmi",
        body: "Chat WhatsApp berjalan di API resmi dengan template yang disetujui Meta, bukan gateway abal-abal yang rawan blokir.",
      },
      {
        index: "04",
        title: "Standar ISO",
        body: "Cekat.AI memegang sertifikasi ISO 9001:2015 dan ISO/IEC 27001:2022. Kebutuhan khusus dibahas saat onboarding.",
      },
    ],
    integrationsLabel: "Terhubung ke semua aplikasi yang sudah Anda pakai",
    integrationsNote:
      "Chat, iklan, marketplace, dan sistem internal dalam satu jaringan.",
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
    eyebrow: "Lihat langsung",
    heading: "Semua bekerja dalam satu chat",
    body: "Enam tampilan bergantian menunjukkan alur yang sama: chat masuk, data tercatat, order jalan, lalu promo menyusul.",
    caption:
      "Enam tampilan produk Cekat.AI sebagai jendela di sekitar dashboard. Pilih satu lewat tombol di dalam jendela app, tutup lagi kapan saja.",
    popups: {
      strip: "Popup",
      show: "Buka popup",
      hide: "Sembunyikan popup",
      close: "Tutup popup",
    },
    cards: [
      {
        kind: "chat",
        label: "Balas Chat Otomatis",
        title: "Sari Wijaya",
        badge: "AI",
        lines: [
          "Kak, masih ready navy size L?",
          "Ready! Stoknya aku kunci dulu ya",
        ],
        footnote: "WhatsApp · online",
        metric: { value: "8 dtk", label: "chat pertama dibalas" },
        thread: [
          {
            from: "visitor",
            text: "Kak, masih ready navy size L?",
          },
          {
            from: "agent",
            text: "Masih ready Kak! Kemeja Linen Navy Size L, Rp 350.000. Saya cekkan stoknya dulu ya.",
            note: "Stok dicek otomatis · 2 pcs tersisa",
          },
          { from: "visitor", text: "Boleh, saya ambil 2" },
          {
            from: "agent",
            text: "Siap, saya kunci 2 pcs-nya biar tidak keburu habis. Mau dikirim ke mana?",
            note: "Stok dikunci 10 menit",
          },
          {
            from: "visitor",
            text: "Andi Wijaya, Jl. Sudirman No.12, Jakarta Selatan",
          },
          {
            from: "agent",
            text: "Tersimpan. Ongkir JNE Reguler Rp 18.000, total Rp 718.000. Link pembayaran saya kirim ya.",
            note: "Total Rp 718.000 · JNE Reguler",
          },
          { from: "visitor", text: "Iya kirim, saya bayar pakai QRIS" },
          {
            from: "agent",
            text: "QRIS sudah terkirim. Pembayaran masuk dan pesanan langsung diproses ke gudang.",
            note: "Order #CK-2417 · Status Diproses",
          },
          { from: "visitor", text: "Mantap. Kapan dikirim?" },
          {
            from: "agent",
            text: "Dikirim besok pagi, resi saya kabari begitu leaving center. Sekalian saya set reminder reorder H+30, boleh?",
            note: "Reminder reorder dijadwalkan",
          },
          { from: "visitor", text: "Boleh banget, makasih banyak!" },
        ],
      },
      {
        kind: "order",
        label: "Order & Pembayaran",
        title: "Order #CK-2417",
        badge: "Baru",
        lines: ["Kemeja Linen", "Navy · Size L · Qty 2"],
        rows: [
          { label: "Subtotal", value: "Rp 700.000" },
          { label: "Ongkir", value: "Rp 18.000" },
          { label: "Diskon member", value: "−Rp 35.000" },
          { label: "Total", value: "Rp 683.000" },
        ],
        chips: ["WhatsApp", "Instagram", "Tokopedia"],
        steps: ["Dibuat", "Dibayar", "Dikemas", "Dikirim"],
        footnote: "Pembayaran QRIS diterima",
      },
      {
        kind: "crm",
        label: "Data Pelanggan",
        title: "Sari Wijaya",
        lines: ["Pelanggan berulang · Bandung · sejak 2024"],
        chips: ["VIP", "Iklan Instagram", "WhatsApp"],
        rows: [
          { label: "Order", value: "7" },
          { label: "Total belanja", value: "Rp 3,4jt" },
          { label: "Rata-rata", value: "Rp 480rb" },
        ],
        notes: [
          {
            text: "Beli Kemeja Linen Navy Size L, 2 pcs",
            at: "Hari ini · 09:41",
          },
          { text: "Suka warna navy dan sage", at: "Otomatis · dari chat" },
          { text: "Sering chat malam hari", at: "Otomatis · dari jam chat" },
          { text: "Beralih dari iklan Instagram", at: "3 bulan lalu" },
        ],
        steps: ["Baru", "Beli", "Setia"],
      },
      {
        kind: "mini",
        label: "Chat Website Otomatis",
        title: "Cekat Mini Agent",
        badge: "Live",
        lines: ["Bahan linennya adem tidak?", "100% linen, adem dan jatuh"],
        footnote: "Menjawab pengunjung web 24/7",
        thread: [
          { from: "visitor", text: "Halo, website ini bisa COD?" },
          {
            from: "agent",
            text: "Bisa Kak. Untuk area Jawa COD tersedia sampai Rp 1.000.000. Di luar Jawa saya bantu-switch ke QRIS ya.",
            note: "Cek ongkos kirim otomatis",
          },
          { from: "visitor", text: "Oke. Kemeja linen ada warna apa saja?" },
          {
            from: "agent",
            text: "Ada 4 warna: Navy, Sage, Sand, dan Terracotta. Navy paling laris minggu ini.",
            note: "Navy · Sage · Sand · Terracotta",
          },
          {
            from: "visitor",
            text: "Bahan adem tidak? Reserved harus pre-order berapa lama?",
          },
          {
            from: "agent",
            text: "100% linen, adem dan jatuh. Stok ready, dikirim 1–2 hari dari Jakarta.",
            note: "Ready · kirim 1–2 hari",
          },
          { from: "visitor", text: "Boleh lihat fotonya?" },
          {
            from: "agent",
            text: "Ini detail bahannya. Saya sudah masukkan Kemeja Linen Sage, Size M ke keranjang ya.",
            note: "Ditambahkan ke keranjang",
          },
          { from: "visitor", text: "Wah bagus. Saya pesan 2 ya" },
          {
            from: "agent",
            text: "Siap Kak. Link checkout sudah saya kirim ke email, pembayaran lewat QRIS bisa langsung.",
            note: "Checkout dikirim · Rp 665.000",
          },
          { from: "visitor", text: "Terima kasih, cepat responnya!" },
        ],
      },
      {
        kind: "consulting",
        label: "Saran Mingguan",
        title: "Rekomendasi minggu ini",
        badge: "Mingguan",
        footnote: "Enam langkah untuk toko kamu minggu ini",
        lines: [
          "Restock Kemeja Linen Navy Size L ×40 sebelum akhir pekan",
          "Aktifkan bundling Linen + Sabun Jeruk, Rp 15.000 lebih murah",
          "Ingatkan 212 pelanggan VIP yang belum belanja 30 hari",
          "Jadwalkan broadcast Jumat 19.00, waktu terbaik konversi",
          "Naikkan budget iklan 12%, ROAS masih 4,8×",
          "Siapkan stok Sand dan Terracotta, permintaannya naik",
        ],
        bars: [42, 55, 48, 70, 64, 86, 96],
        days: ["S", "S", "R", "K", "J", "S", "M"],
        metric: { value: "+24%", label: "Order / hari" },
        quick: ["Terapkan semua saran"],
      },
      {
        kind: "marketing",
        label: "Promosi & Broadcast",
        title: "Promo Linen Weekend",
        badge: "Berjalan",
        lines: [
          "2.480 pelanggan terkirim · 3 segmen · 2 kanal",
          "Broadcast dikirim pukul 19.00, saat konversi paling tinggi",
        ],
        rows: [
          { label: "Terkirim", value: "2.480" },
          { label: "Dibuka", value: "46%" },
          { label: "Klik", value: "312" },
        ],
        segments: [
          "VIP · 212 · belum belanja 30 hari",
          "Keranjang ditinggal · 486 · 2 jam lalu",
          "Pembeli 1× · 1.782 · prone to bundling",
        ],
        metric: { value: "4,8×", label: "Omzet vs modal iklan · 30 hari" },
        spark: [8, 12, 11, 22, 26, 38, 52, 70, 86, 96],
        footnote: "Omzet dari iklan · Rp 8,4jt",
      },
    ],
  },

  signals: {
    eyebrow: "Tanda penting",
    heading: "Tidak ada momen jualan yang terlewat",
    body: "Setiap tanda dari chat, iklan, dan order tertangkap otomatis, tim tahu persis kapan harus bertindak, tanpa mengawasi semua chat sendiri.",
    cta: { label: "Lihat contohnya di chat", href: "/chat" },
    rows: [
      [
        { text: "Ada yang tanya harga di DM Instagram", accent: "#B64ABF" },
        { text: "Keranjang ditinggal 2 jam lalu", accent: "#22C55E" },
        { text: "Chat dari iklan belum di-follow up", accent: "#0EA5E9" },
        { text: "Chat masuk di luar jam kerja", accent: "#4AB6BF" },
        { text: "Pelanggan lama balik setelah 6 bulan", accent: "#4A4ABF" },
        { text: "Promo habis besok, belum diingatkan", accent: "#EC4899" },
      ],
      [
        { text: "Pesanan belum dibayar lewat 1 hari", accent: "#4A4ABF" },
        { text: "Promo dibuka tapi belum dibalas", accent: "#EC4899" },
        { text: "Ada yang tanya ongkir ke 3 kota", accent: "#1352BF" },
        { text: "Jadwal besok dikonfirmasi AI", accent: "#22C55E" },
        { text: "Komplain telat dikirim ke CS", accent: "#F472B6" },
        { text: "50 chat masuk dari iklan hari ini", accent: "#0EA5E9" },
      ],
      [
        { text: "Pengingat otomatis terkirim H+1", accent: "#22C55E" },
        { text: "Pelanggan naik ke paket premium", accent: "#B64ABF" },
        { text: "Jadwal demo diubah otomatis", accent: "#4AB6BF" },
        {
          text: "AI menawarkan produk ke 128 pelanggan",
          accent: "#0EA5E9",
        },
        { text: "Nilai belanja naik dua kali lipat", accent: "#4A4ABF" },
        { text: "Story dibuka 500×, link diklik 40×", accent: "#EC4899" },
      ],
    ],
  },

  deck: {
    eyebrow: "Yang Kita Lakukan",
    heading: "Satu tempat untuk semua urusan bisnis",
    body: "Dari balas chat sampai terima order dan kirim promo — semuanya nyambung, tidak perlu pindah-pindah aplikasi.",
    hint: "Klik untuk lihat contoh layarnya",
    items: [
      {
        title: "Balas Chat Otomatis",
        headline: "Chat dibalas dalam hitungan detik",
        body: "AI menjawab chat, memilah yang serius mau beli, dan meneruskan ke admin saat sudah mau closing. WhatsApp, Instagram, TikTok masuk ke satu tempat — jalan 24/7, tidak ada chat menumpuk.",
        points: [
          "Semua chat dalam satu tempat",
          "Otomatis oper ke admin",
          "Jalan 24/7",
        ],
        accent: "#1352BF",
        image: {
          src: "/images/home/feature-chat-inbox.webp",
          alt: "Layar inbox percakapan Cekat.AI",
        },
        cta: { label: "Lihat cara balas otomatis", href: "/chat" },
      },
      {
        title: "Data Pelanggan",
        headline: "Tidak perlu rekap manual lagi",
        body: "Setiap chat, pembelian, dan tahapan order tercatat sendiri. Tidak ada lagi rekap di akhir hari — semua tim melihat catatan yang sama.",
        points: [
          "Terisi sendiri dari chat",
          "Tahapan order terlihat langsung",
          "Riwayat tiap pelanggan lengkap",
        ],
        accent: "#22C55E",
        image: {
          src: "/images/home/feature-crm-pipeline.webp",
          alt: "Layar data pelanggan Cekat.AI",
        },
        cta: { label: "Lihat cara data tercatat", href: "/crm" },
      },
      {
        title: "Promosi & Broadcast",
        headline: "Ketahuan iklan mana yang jadi order",
        body: "Kirim promo ke orang yang tepat, ingatkan otomatis yang belum bayar, dan lihat jelas modal iklan vs omzetnya — dari klik iklan sampai chat jadi order.",
        points: [
          "Promo ke yang tepat",
          "Terlihat modal vs omzet",
          "Nyambung ke iklan Meta",
        ],
        accent: "#B64ABF",
        image: {
          src: "/images/home/feature-marketing-loop.webp",
          alt: "Layar dashboard promosi Cekat.AI",
        },
        cta: { label: "Lihat cara promo bekerja", href: "/marketing" },
      },
      {
        title: "Order & Otomatisasi",
        headline: "Order beres langsung dari chat",
        body: "AI menghitung ongkir, mengirim link bayar, dan menjalankan lanjutan otomatis tanpa coding — dari chat sampai pesanan beres.",
        points: ["Ongkir dihitung otomatis", "Bisa bayar QRIS", "Tanpa coding"],
        accent: "#4A4ABF",
        image: {
          src: "/images/home/feature-oms-orders.webp",
          alt: "Layar order otomatis Cekat.AI",
        },
        cta: { label: "Lihat cara order jalan", href: "/order" },
      },
    ],
  },

  love: {
    eyebrow: "Cerita pelanggan",
    heading: "Kata yang sudah pakai",
    body: "Ribuan bisnis di Indonesia, Singapura, dan Malaysia menjalankan penjualan dan layanannya di Cekat.AI.",
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
          name: "Tantan Supriantna",
          role: "Head Customer Relation · Rumah Zakat",
          initials: "T",
          accent: "#EC4899",
        },
      ],
    ],
  },

  faq: {
    eyebrow: "Sering ditanya",
    heading: "Pertanyaan sebelum mulai",
    body: "Jawaban singkat untuk yang paling sering ditanyakan soal biaya, pasang, dan data.",
    cta: { label: "Masih ada pertanyaan? Hubungi kami", href: "/contact" },
    items: [
      {
        q: "Berapa lama sampai bisa dipakai?",
        a: "Kebanyakan usaha sudah bisa balas chat di hari yang sama. Sambungkan nomor WhatsApp, tempel daftar harga dan jawaban umum, nyalakan — tanpa coding dan tanpa proyek berbulan-bulan.",
      },
      {
        q: "Apakah harus ambil semua sekaligus?",
        a: "Tidak. Mulai dari balas chat dulu. Data pelanggan, promosi, atau order menyusul saat tim sudah terbiasa — datanya tetap nyambung di tempat yang sama.",
      },
      {
        q: "Tim kami tidak ada IT. Tetap bisa jalan?",
        a: "Bisa. Caranya tinggal tempel info usaha, tanpa coding. Tim Cekat.AI mendampingi saat pasang, termasuk pengajuan nomor WhatsApp resmi bila Anda siap naik ke API resmi.",
      },
      {
        q: "Siapa pemilik data pelanggan kami?",
        a: "Anda. Chat dan data pelanggan milik usaha Anda, bisa diunduh kapan saja, dan aksesnya diatur per peran di dalam tim.",
      },
      {
        q: "Bagaimana kalau AI menjawab salah?",
        a: "Anda yang pegang kendali jawaban dan batas tugas AI. Chat yang sensitif atau di luar tugas langsung diteruskan ke manusia lengkap dengan riwayat chatnya.",
      },
    ],
  },

  pricing: {
    eyebrow: "Harga",
    heading: "Mulai kecil, tingkatkan saat ramai",
    body: "Semua paket termasuk coba gratis 14 hari dan bisa naik paket kapan saja tanpa pindah data.",
    note: "Harga lengkap dan perbandingan fitur ada di halaman harga.",
    popularLabel: "Paling dipilih",
    compare: { label: "Bandingkan semua paket", href: "/harga" },
    tiers: [
      {
        name: "Pro",
        tag: "Untuk tim kecil yang mulai kewalahan balas chat.",
        rows: [
          { label: "Nomor WhatsApp resmi", value: "1" },
          { label: "Pelanggan chat / bulan", value: "3.000" },
          { label: "Balasan AI / bulan", value: "15.000" },
          { label: "Akun tim", value: "5" },
          { label: "Kemampuan AI", value: "AI Dasar" },
        ],
        cta: {
          label: "Coba Gratis 14 Hari",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Business",
        tag: "Untuk yang butuh otomatis penuh dan kerja rapi.",
        popular: true,
        rows: [
          { label: "Nomor WhatsApp resmi", value: "3" },
          { label: "Pelanggan chat / bulan", value: "10.000" },
          { label: "Balasan AI / bulan", value: "50.000" },
          { label: "Akun tim", value: "7" },
          { label: "Kemampuan AI", value: "AI Penuh + otomatisasi" },
        ],
        cta: {
          label: "Coba Gratis 14 Hari",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Enterprise",
        tag: "Untuk chat membludak dengan tim yang terstruktur.",
        rows: [
          { label: "Nomor WhatsApp resmi", value: "5" },
          { label: "Pelanggan chat / bulan", value: "30.000" },
          { label: "Balasan AI / bulan", value: "150.000" },
          { label: "Akun tim", value: "10" },
          { label: "Kemampuan AI", value: "AI Penuh + otomatisasi" },
        ],
        cta: {
          label: "Coba Gratis 14 Hari",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Custom",
        custom: true,
        tag: "Untuk kebutuhan khusus, integrasi, dan skala korporat.",
        rows: [
          { label: "Nomor WhatsApp resmi", value: "Custom" },
          { label: "Pelanggan chat / bulan", value: "Tanpa batas" },
          { label: "Balasan AI / bulan", value: "Custom" },
          { label: "Akun tim", value: "Custom" },
          { label: "Kemampuan AI", value: "AI Penuh + otomatisasi" },
        ],
        cta: { label: "Hubungi Sales", href: "/contact" },
      },
    ],
  },

  finalCta: {
    eyebrow: "Mulai sekarang",
    titleLead: "Coba gratis 14 hari,",
    titleAccent: "buktikan sendiri",
    body: "Balas lebih cepat, ingatkan otomatis yang belum bayar, dan closing lebih banyak — tanpa tambah admin.",
    checks: [
      "Siap dalam 10 menit",
      "Didampingi 1-on-1",
      "Bisa berhenti kapan saja",
    ],
    ctaPrimary: {
      label: "Coba Gratis 14 Hari",
      href: "https://chat.cekat.ai/register",
    },
    ctaSecondary: { label: "Chat dengan tim kami", href: "/contact" },
  },

  footer: {
    about:
      "Cekat.AI untuk bisnis Indonesia — balas lebih cepat, ingatkan otomatis, closing lebih banyak.",
    partner: "Cekat.AI adalah Partner Resmi Meta",
    officesHeading: "Kantor Kami",
    appsHeading: "Unduh Aplikasi Mobile Cekat",
    offices: [
      {
        flag: "🇮🇩",
        label: "Indonesia",
        entries: [
          {
            name: "Kantor Jakarta",
            company: "PT. Teknologi Cekat Indonesia",
            address:
              "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, Jakarta Selatan 12190",
          },
          {
            name: "Kantor Tangerang",
            company: "PT. Teknologi Cekat Indonesia",
            address:
              "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
          },
        ],
      },
      {
        flag: "🇸🇬",
        label: "Singapura",
        entries: [
          {
            name: "Kantor Singapura",
            company: "Cekat Pte. LTD.",
            address:
              "101 Upper Cross Street, 05-16, People's Park Centre, Singapore, 058357",
          },
        ],
      },
      {
        flag: "🇲🇾",
        label: "Malaysia",
        entries: [
          {
            name: "Kantor Kuala Lumpur",
            company: "CekatAI Sdn. Bhd.",
            address:
              "Level 7, Mercu 3, No. 3, Jalan Bangsar, KL Eco City 59200, Kuala Lumpur W.P. Kuala Lumpur Malaysia",
          },
        ],
      },
    ],
    columns: [
      {
        title: "Produk",
        links: [
          { label: "Balas Chat Otomatis", href: "/chat" },
          { label: "Data Pelanggan", href: "/crm" },
          { label: "Promosi", href: "/marketing" },
          { label: "Order", href: "/order" },
          { label: "Events", href: "/events" },
          { label: "Harga", href: "/harga" },
          { label: "Kontak", href: "/contact" },
          { label: "Integrasi", href: "/integrasi" },
        ],
      },
      {
        title: "Jelajahi",
        links: [
          { label: "Semua fitur", href: "/fitur" },
          { label: "Semua industri", href: "/industri" },
          { label: "Solusi per peran", href: "/solusi" },
        ],
      },
      {
        title: "Perusahaan",
        links: [
          { label: "Tentang kami", href: "/tentang" },
          { label: "Cerita pelanggan", href: "/cerita" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Syarat & Ketentuan", href: "/terms-and-conditions" },
          { label: "Kebijakan Privasi", href: "/privacy-policy" },
          {
            label: "Kebijakan Retur & Pengiriman",
            href: "/return-refund-delivery-policy",
          },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} CekatAI.`,
    rights: "Seluruh hak cipta dilindungi.",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/cekatai/",
        icon: "linkedin",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/cekat.ai/",
        icon: "instagram",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@cekatai",
        icon: "youtube",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/p/CekatAI-61551061527910/",
        icon: "facebook",
      },
    ],
    apps: [
      {
        kind: "play",
        href: "https://play.google.com/store/apps/details?id=com.cekatmobile&pcampaignid=web_share&pli=1",
        label: "Unduh di Google Play",
      },
      {
        kind: "apple",
        href: "https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id",
        label: "Unduh di App Store",
      },
    ],
  },
};

const EN: HomeContent = {
  meta: {
    title: "Cekat.AI — From First Chat to Lifelong Customer",
    description:
      "Cekat.AI auto-replies to WhatsApp, Instagram, and TikTok chats, reminds unpaid customers, and keeps records tidy — so chats turn into sales, you see which ad closed, and customers come back.",
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
        megaIntro:
          "One place to reply chats, record customers, send promos, and receive orders.",
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
      label: "New · Auto-calls via WhatsApp",
      href: "/en/features/whatsapp-call-ai-summary",
    },
    titleLead: "Turn new clients into",
    titleAccent: "lifelong customers",
    sub: "Cekat.AI auto-replies to WhatsApp, Instagram, and TikTok chats, reminds customers who have not paid, and keeps everything tidy — so every chat moves toward a sale, you see which ad closed, and customers come back.",
    form: {
      label: "Work email",
      placeholder: "Enter your company email",
      cta: "Get free trial",
      note: "Free for 14 days · No credit card · Ready in 10 minutes",
      errorRequired: "Please enter your work email first.",
      errorInvalid:
        "That email address does not look right. Example: name@company.com",
      secondary: { label: "See how it works", href: "#how-it-works" },
    },
  },

  dashboard: {
    url: "app.cekat.ai / inbox",
    nav: ["Inbox", "Customers", "Promos", "Orders", "Reports"],
    title: "Incoming chats · WhatsApp",
    rows: [
      {
        initials: "RA",
        accent: "#1352BF",
        who: "Rani — Instagram DM",
        msg: "“Hi, is navy available? What is the discount for two?”",
        chip: "Replied by AI in 8 seconds",
      },
      {
        initials: "BS",
        accent: "#22C55E",
        who: "Bagus — WhatsApp",
        msg: "“How much is shipping to Bandung? Can I pay with QRIS?”",
        chip: "Shipping + payment link sent automatically",
      },
      {
        initials: "DW",
        accent: "#B64ABF",
        who: "Dewi — TikTok",
        msg: "“I have transferred the payment, please check”",
        chip: "Order recorded automatically",
      },
    ],
    stats: [
      { value: "1.8 sec", label: "average AI reply" },
      { value: "92%", label: "chats helped automatically", spark: true },
      { value: "+34%", label: "chats turned buyers this week" },
    ],
  },

  proof: {
    eyebrow: "Trusted by 3,000+ businesses",
    heading: "Used by growing businesses across Southeast Asia",
    stats: [
      { value: "10", suffix: "M+", label: "conversations helped monthly" },
      {
        value: "3,000",
        suffix: "+",
        label: "businesses in Indonesia, Singapore & Malaysia",
      },
      { value: "<2", suffix: " min", label: "average first reply" },
    ],
    logosLabel: "Trusted by",
    logosNote: "A sample of the brands running sales and service on Cekat.AI.",
  },

  pillars: {
    eyebrow: "Why Cekat.AI",
    heading: "Yours, easy to connect",
    body: "Three things that keep work simple even as chats grow and teams get bigger.",
    items: [
      {
        index: "01",
        title: "Stays yours",
        body: "Your WhatsApp number, AI answers, and customer data stay yours. Moving is easy — nothing locks you in.",
        points: [
          "Your WhatsApp number stays yours",
          "Download your data any time",
          "No locking contract",
        ],
        accent: "#1352BF",
      },
      {
        index: "02",
        title: "Everything connected",
        body: "Chat, customer data, orders, and promos share the same record — so nothing gets lost between staff.",
        points: [
          "One place for every chat",
          "Customer records fill themselves",
          "Every team sees the same history",
        ],
        accent: "#0EA5E9",
      },
      {
        index: "03",
        title: "Easy to connect",
        body: "Cekat.AI connects to the ads, marketplaces, and systems you already use today through official paths.",
        points: [
          "Connects to Meta & Google ads",
          "Connects to Tokopedia & Shopee",
          "Official WhatsApp path (Meta Partner)",
        ],
        accent: "#22C55E",
      },
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "From incoming chat to repeat order",
    body: "Five steps that feed each other. You do not have to change how your team works — just connect one piece at a time.",
    stageLabel: "Stages",
    steps: [
      {
        index: "01",
        title: "Connect your chats",
        body: "Link your WhatsApp business number, Instagram, TikTok, and website chat. Every chat flows into one place.",
        hint: "~10 minutes",
        accent: "#1352BF",
        visual: "channels",
      },
      {
        index: "02",
        title: "Paste your business info",
        body: "Paste your price list, common answers, and shop rules. The AI answers in your words — it does not make things up.",
        hint: "No code",
        accent: "#0EA5E9",
        visual: "knowledge",
      },
      {
        index: "03",
        title: "Let AI answer first",
        body: "AI answers repeat questions, spots serious buyers, and passes to your staff when a chat is ready to close or needs a human.",
        hint: "Always on",
        accent: "#4AB6BF",
        visual: "ai",
      },
      {
        index: "04",
        title: "Turn chats into orders",
        body: "Shipping is calculated, the payment link goes out, and the order is recorded with payment and delivery status.",
        hint: "Automatic",
        accent: "#22C55E",
        visual: "order",
      },
      {
        index: "05",
        title: "See what makes money",
        body: "See clearly which ad pays back, which chats become orders, and which channel sells most. Fix what drags, scale what works.",
        hint: "Real time",
        accent: "#4A4ABF",
        visual: "chart",
      },
    ],
    diagrams: {
      channels: {
        caption: "Four chats into one place",
        inbox: "One team inbox",
        channels: ["WhatsApp", "Instagram", "TikTok", "Live chat"],
      },
      knowledge: {
        caption: "Your info becomes one answer source",
        sources: ["Shop rules", "Price list", "Common answers"],
        base: "Answer source",
        answer: "Answers in your own words",
      },
      ai: {
        caption: "AI answers most, people close",
        handled: "92% helped by AI",
        escalate: "Passed on when sensitive",
        human: "Your team",
      },
      order: {
        caption: "From chat to a paid, shipped order",
        chat: "Customer chat",
        steps: ["Shipping", "Payment", "Order", "Delivery"],
        total: "Payment & delivery status",
      },
      chart: {
        caption: "Per-channel results over 30 days",
        series: [
          { label: "WhatsApp", value: 88 },
          { label: "Instagram", value: 71 },
          { label: "Ads", value: 64 },
          { label: "Tokopedia", value: 47 },
        ],
        note: "Scale what works, fix what drags",
      },
    },
  },

  caseStudy: {
    eyebrow: "Case study",
    client: "Nature Craft Indonesia",
    title: "Closing doubled, revenue up 50%",
    body: "Before Cekat.AI, the Nature Craft team replied manually and lost chats in busy hours. Once AI answered first questions and customer data filled itself, the team only handled chats ready to close.",
    quote:
      "Our closing rate used to sit below 20 percent. It is above 40 percent now — and because the closing rate rose, revenue grew sharply with it.",
    attribution: "Hariyudi · Director, Nature Craft Indonesia",
    metrics: [
      { value: "20→40", suffix: "%", label: "chats turned buyers" },
      { value: "50", suffix: "%", label: "revenue up" },
      { value: "24/7", suffix: "", label: "running without extra staff" },
    ],
    cta: { label: "Read the story", href: "/en/stories/nature-craft" },
  },

  trust: {
    eyebrow: "Safe & official",
    heading: "Safe for your customer data",
    body: "Cekat.AI follows Indonesian law, uses the official WhatsApp path from Meta, and controls who can see what — built in from the start, not bolted on later.",
    chips: [
      "Follows Indonesia PDP Law",
      "Official Meta Partner",
      "Role-based access",
      "ISO 9001 & 27001",
    ],
    cards: [
      {
        index: "01",
        title: "Follows Indonesian law",
        body: "Customer data is handled under Indonesia's Personal Data Protection law — not just a marketing claim.",
      },
      {
        index: "02",
        title: "Who sees what, controlled",
        body: "Access is set by role. Sales, support, and finance each see only their part.",
      },
      {
        index: "03",
        title: "Official WhatsApp path",
        body: "WhatsApp chats run on the official API with Meta-approved templates — not a risky unofficial gateway.",
      },
      {
        index: "04",
        title: "ISO standards",
        body: "Cekat.AI holds ISO 9001:2015 and ISO/IEC 27001:2022 certifications. Special needs are covered during onboarding.",
      },
    ],
    integrationsLabel: "Connects to the tools you already use",
    integrationsNote:
      "Chats, ads, marketplaces, and internal systems in one network.",
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
    eyebrow: "See it live",
    heading: "It all works inside one chat",
    body: "Six views take turns showing the same flow: a chat arrives, data is captured, the order moves, and the promo follows.",
    caption:
      "Six Cekat.AI product windows around the dashboard. Pick one from the switches inside the app window, close it whenever.",
    popups: {
      strip: "Popups",
      show: "Open popup",
      hide: "Hide popup",
      close: "Close popup",
    },
    cards: [
      {
        kind: "chat",
        label: "Auto Chat Replies",
        title: "Sari Wijaya",
        badge: "AI",
        lines: [
          "Hi, is navy still available in size L?",
          "Yes! Let me hold that stock",
        ],
        footnote: "WhatsApp · online",
        metric: { value: "8 sec", label: "first reply" },
        thread: [
          { from: "visitor", text: "Hi, is navy still available in size L?" },
          {
            from: "agent",
            text: "It is! Linen Shirt in Navy, Size L, IDR 350,000. Let me check the stock for you.",
            note: "Stock checked automatically · 2 left",
          },
          { from: "visitor", text: "Great, I'll take 2" },
          {
            from: "agent",
            text: "Done — I am holding both pieces so they cannot sell out. Where should we send them?",
            note: "Stock held for 10 minutes",
          },
          {
            from: "visitor",
            text: "Andi Wijaya, 12 Sudirman Street, South Jakarta",
          },
          {
            from: "agent",
            text: "Saved. JNE Regular shipping is IDR 18,000, total IDR 718,000. Sending the payment link now.",
            note: "Total IDR 718,000 · JNE Regular",
          },
          { from: "visitor", text: "Perfect, I'll pay by QRIS" },
          {
            from: "agent",
            text: "QRIS link sent. Payment received and the order is already being picked in the warehouse.",
            note: "Order #CK-2417 · Processing",
          },
          { from: "visitor", text: "Nice. When does it ship?" },
          {
            from: "agent",
            text: "Tomorrow morning — I will send the tracking as soon as it leaves the hub. Shall I set a 30-day reorder reminder?",
            note: "Reorder reminder scheduled",
          },
          { from: "visitor", text: "Yes please, thank you!" },
        ],
      },
      {
        kind: "order",
        label: "Orders & Payment",
        title: "Order #CK-2417",
        badge: "New",
        lines: ["Linen Shirt", "Navy · Size L · Qty 2"],
        rows: [
          { label: "Subtotal", value: "IDR 700,000" },
          { label: "Shipping", value: "IDR 18,000" },
          { label: "Member discount", value: "−IDR 35,000" },
          { label: "Total", value: "IDR 683,000" },
        ],
        chips: ["WhatsApp", "Instagram", "Tokopedia"],
        steps: ["Created", "Paid", "Packed", "Shipped"],
        footnote: "QRIS payment received",
      },
      {
        kind: "crm",
        label: "Customer Data",
        title: "Sari Wijaya",
        lines: ["Repeat customer · Bandung · since 2024"],
        chips: ["VIP", "Instagram ad", "WhatsApp"],
        rows: [
          { label: "Orders", value: "7" },
          { label: "Lifetime value", value: "IDR 3.4m" },
          { label: "Avg. spend", value: "IDR 480k" },
        ],
        notes: [
          {
            text: "Bought Linen Shirt Navy Size L, 2 pcs",
            at: "Today · 09:41",
          },
          { text: "Prefers navy and sage", at: "Automatic · from chat" },
          { text: "Chats most nights", at: "Automatic · from message times" },
          { text: "Came from an Instagram ad", at: "3 months ago" },
        ],
        steps: ["New", "Bought", "Loyal"],
      },
      {
        kind: "mini",
        label: "Website Auto-Chat",
        title: "Cekat Mini Agent",
        badge: "Live",
        lines: [
          "Is the linen breathable?",
          "100% linen — cool and drapes well",
        ],
        footnote: "Answers website visitors 24/7",
        thread: [
          { from: "visitor", text: "Hi, do you offer cash on delivery?" },
          {
            from: "agent",
            text: "We do — COD is available across Java up to IDR 1,000,000. Outside Java I can switch you to QRIS.",
            note: "Shipping cost checked automatically",
          },
          {
            from: "visitor",
            text: "Great. Which colours do the linen shirts come in?",
          },
          {
            from: "agent",
            text: "Four colours: Navy, Sage, Sand and Terracotta. Navy is the bestseller this week.",
            note: "Navy · Sage · Sand · Terracotta",
          },
          {
            from: "visitor",
            text: "Is the fabric breathable? How long does pre-order take?",
          },
          {
            from: "agent",
            text: "100% linen — cool and it drapes well. These are in stock and ship from Jakarta in 1–2 days.",
            note: "In stock · ships in 1–2 days",
          },
          { from: "visitor", text: "Could you send me a photo?" },
          {
            from: "agent",
            text: "Here is the fabric detail — and I have added the Sage shirt in Size M to your cart.",
            note: "Added to cart",
          },
          { from: "visitor", text: "Love it. I'll take 2" },
          {
            from: "agent",
            text: "All set. Checkout is on its way to your email, and you can pay straight by QRIS.",
            note: "Checkout sent · IDR 665,000",
          },
          { from: "visitor", text: "Thanks — quick reply!" },
        ],
      },
      {
        kind: "consulting",
        label: "Weekly Tips",
        title: "Weekly recommendations",
        badge: "Weekly",
        footnote: "Six moves for your store this week",
        lines: [
          "Restock Linen Shirt Navy Size L ×40 before the weekend",
          "Bundle Linen + Orange Soap, IDR 15,000 cheaper",
          "Remind the 212 VIP customers who have not bought in 30 days",
          "Schedule the broadcast for Friday 19:00, your best conversion hour",
          "Raise ad spend by 12% — ROAS is still 4.8×",
          "Stock up on Sand and Terracotta, demand is climbing",
        ],
        bars: [42, 55, 48, 70, 64, 86, 96],
        days: ["S", "M", "T", "W", "T", "F", "S"],
        metric: { value: "+24%", label: "Orders / day" },
        quick: ["Apply all six"],
      },
      {
        kind: "marketing",
        label: "Promos & Broadcast",
        title: "Linen Weekend Promo",
        badge: "Running",
        lines: [
          "2,480 customers sent · 3 segments · 2 channels",
          "Broadcast went out at 19:00, your highest-converting hour",
        ],
        rows: [
          { label: "Sent", value: "2,480" },
          { label: "Opened", value: "46%" },
          { label: "Clicks", value: "312" },
        ],
        segments: [
          "VIP · 212 · no purchase in 30 days",
          "Left cart · 486 · 2 hours ago",
          "First-time buyers · 1,782 · bundle-friendly",
        ],
        metric: { value: "4.8×", label: "Revenue vs ad spend · 30 days" },
        spark: [8, 12, 11, 22, 26, 38, 52, 70, 86, 96],
        footnote: "Revenue from ads · IDR 8.4m",
      },
    ],
  },

  signals: {
    eyebrow: "Important signs",
    heading: "Never miss the moment that matters",
    body: "Every sign from chat, ads, and orders is captured automatically — your team knows exactly when to act, without watching every chat themselves.",
    cta: { label: "See examples in chat", href: "/en/chat" },
    rows: [
      [
        {
          text: "Someone asks for a price in an Instagram DM",
          accent: "#B64ABF",
        },
        { text: "Cart left behind 2 hours ago", accent: "#22C55E" },
        { text: "Ad chat never followed up", accent: "#0EA5E9" },
        { text: "Chat arrived outside working hours", accent: "#4AB6BF" },
        { text: "Returning customer after 6 months", accent: "#4A4ABF" },
        { text: "Promo ends tomorrow, no reminder sent", accent: "#EC4899" },
      ],
      [
        { text: "Order unpaid for over a day", accent: "#4A4ABF" },
        { text: "Promo opened but never answered", accent: "#EC4899" },
        {
          text: "Someone asked shipping to 3 cities",
          accent: "#1352BF",
        },
        { text: "Tomorrow's booking confirmed by AI", accent: "#22C55E" },
        {
          text: "Late-delivery complaint sent to support",
          accent: "#F472B6",
        },
        { text: "50 chats from today's Meta ads", accent: "#0EA5E9" },
      ],
      [
        { text: "Reminder sent automatically on day 1", accent: "#22C55E" },
        { text: "Customer moved to the premium plan", accent: "#B64ABF" },
        { text: "Demo rescheduled automatically", accent: "#4AB6BF" },
        {
          text: "AI offered products to 128 customers",
          accent: "#0EA5E9",
        },
        { text: "Order value doubled", accent: "#4A4ABF" },
        { text: "Story seen 500×, link clicked 40×", accent: "#EC4899" },
      ],
    ],
  },

  deck: {
    eyebrow: "What is inside",
    heading: "One place for every chat job",
    body: "From replying to chats to receiving orders and sending promos — all connected, no app-hopping.",
    hint: "Click to see example screens",
    items: [
      {
        title: "Auto Chat Replies",
        headline: "Chats answered in seconds",
        body: "AI replies, spots serious buyers, and hands over to your staff when a deal is ready to close. Every chat lands in one place — running 24/7 with nothing piling up.",
        points: [
          "Every chat in one place",
          "Auto handoff to your team",
          "Always on",
        ],
        accent: "#1352BF",
        image: {
          src: "/images/home/feature-chat-inbox.webp",
          alt: "Cekat.AI conversation inbox screen",
        },
        cta: { label: "See how auto-reply works", href: "/en/chat" },
      },
      {
        title: "Customer Data",
        headline: "No more manual recaps",
        body: "Every chat, purchase, and order stage is recorded straight from the chat. No end-of-day recap — and every team reads the same record.",
        points: [
          "Filled from chat automatically",
          "Order stages visible live",
          "Complete history",
        ],
        accent: "#22C55E",
        image: {
          src: "/images/home/feature-crm-pipeline.webp",
          alt: "Cekat.AI customer data screen",
        },
        cta: { label: "See how records work", href: "/en/crm" },
      },
      {
        title: "Promos & Broadcast",
        headline: "Know exactly which ad closed",
        body: "Send promos to the right people, auto-remind unpaid orders, and see ad spend vs revenue clearly — from ad click to order.",
        points: [
          "Promos to the right people",
          "Spend vs revenue visible",
          "Connects to Meta ads",
        ],
        accent: "#B64ABF",
        image: {
          src: "/images/home/feature-marketing-loop.webp",
          alt: "Cekat.AI promo dashboard screen",
        },
        cta: { label: "See how promos work", href: "/en/marketing" },
      },
      {
        title: "Orders & Automation",
        headline: "Orders happen inside the chat",
        body: "AI calculates shipping, sends the payment link, and runs the follow-on steps with no code — from chat to finished order.",
        points: ["Automatic shipping quotes", "QRIS payments", "No code"],
        accent: "#4A4ABF",
        image: {
          src: "/images/home/feature-oms-orders.webp",
          alt: "Cekat.AI automated order screen",
        },
        cta: { label: "See how orders work", href: "/en/order" },
      },
    ],
  },

  love: {
    eyebrow: "Customer stories",
    heading: "What users say",
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
          name: "Tantan Supriantna",
          role: "Head Customer Relation · Rumah Zakat",
          initials: "T",
          accent: "#EC4899",
        },
      ],
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Questions before you start",
    body: "Short answers on cost, setup, and your data.",
    cta: { label: "Still curious? Talk to us", href: "/en/contact" },
    items: [
      {
        q: "How long until we can use it?",
        a: "Most businesses reply to chats the same day. Connect your WhatsApp number, paste your price list and common answers, switch on — no code and no months-long project.",
      },
      {
        q: "Do we have to take everything at once?",
        a: "No. Start with auto-replies. Customer data, promos, or orders follow once your team is comfortable — the data stays connected in the same place.",
      },
      {
        q: "We have no IT staff. Can we still run it?",
        a: "Yes. Just paste your business info — no coding. The Cekat.AI team helps during setup, including official WhatsApp number application when you are ready.",
      },
      {
        q: "Who owns our customer data?",
        a: "You do. Chats and customer data belong to your business, can be downloaded any time, and access is set by role inside your team.",
      },
      {
        q: "What if the AI answers wrongly?",
        a: "You control the answers and the limits of the AI. Sensitive or out-of-scope chats are passed to a human with the full history attached.",
      },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "Start small, grow when busy",
    body: "Every plan includes a 14-day free trial and can be upgraded at any time without moving data.",
    note: "Full pricing and feature comparison on the pricing page.",
    popularLabel: "Most popular",
    compare: { label: "Compare every plan", href: "/en/pricing" },
    tiers: [
      {
        name: "Pro",
        tag: "For small teams starting to drown in replies.",
        rows: [
          { label: "Official WhatsApp numbers", value: "1" },
          { label: "Chatting customers / month", value: "3,000" },
          { label: "AI replies / month", value: "15,000" },
          { label: "Team accounts", value: "5" },
          { label: "AI capability", value: "Basic AI" },
        ],
        cta: {
          label: "Start free for 14 days",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Business",
        tag: "For full automation and tidy work.",
        popular: true,
        rows: [
          { label: "Official WhatsApp numbers", value: "3" },
          { label: "Chatting customers / month", value: "10,000" },
          { label: "AI replies / month", value: "50,000" },
          { label: "Team accounts", value: "7" },
          { label: "AI capability", value: "Full AI + automation" },
        ],
        cta: {
          label: "Start free for 14 days",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Enterprise",
        tag: "For overflowing chats with a structured team.",
        rows: [
          { label: "Official WhatsApp numbers", value: "5" },
          { label: "Chatting customers / month", value: "30,000" },
          { label: "AI replies / month", value: "150,000" },
          { label: "Team accounts", value: "10" },
          { label: "AI capability", value: "Full AI + automation" },
        ],
        cta: {
          label: "Start free for 14 days",
          href: "https://chat.cekat.ai/register",
        },
      },
      {
        name: "Custom",
        custom: true,
        tag: "For bespoke requirements, integrations, and corporate scale.",
        rows: [
          { label: "Official WhatsApp numbers", value: "Custom" },
          { label: "Chatting customers / month", value: "Unlimited" },
          { label: "AI replies / month", value: "Custom" },
          { label: "Team accounts", value: "Custom" },
          { label: "AI capability", value: "Full AI + automation" },
        ],
        cta: { label: "Contact sales", href: "/en/contact" },
      },
    ],
  },

  finalCta: {
    eyebrow: "Start now",
    titleLead: "Try it free for 14 days,",
    titleAccent: "see for yourself",
    body: "Reply faster, auto-remind unpaid orders, and close more — without extra staff.",
    checks: ["10-minute setup", "1-on-1 onboarding", "Cancel any time"],
    ctaPrimary: {
      label: "Start free for 14 days",
      href: "https://chat.cekat.ai/register",
    },
    ctaSecondary: { label: "Chat with our team", href: "/en/contact" },
  },

  footer: {
    about:
      "Cekat.AI for Indonesian businesses — reply faster, remind automatically, close more.",
    partner: "Cekat.AI is Official Meta Partner",
    officesHeading: "Our Office",
    appsHeading: "Download Cekat Mobile App",
    offices: [
      {
        flag: "🇮🇩",
        label: "Indonesia",
        entries: [
          {
            name: "Jakarta Office",
            company: "PT. Teknologi Cekat Indonesia",
            address:
              "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, South Jakarta 12190",
          },
          {
            name: "Tangerang Office",
            company: "PT. Teknologi Cekat Indonesia",
            address:
              "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
          },
        ],
      },
      {
        flag: "🇸🇬",
        label: "Singapore",
        entries: [
          {
            name: "Singapore Office",
            company: "Cekat Pte. LTD.",
            address:
              "101 Upper Cross Street, 05-16, People's Park Centre, Singapore, 058357",
          },
        ],
      },
      {
        flag: "🇲🇾",
        label: "Malaysia",
        entries: [
          {
            name: "Kuala Lumpur Office",
            company: "CekatAI Sdn. Bhd.",
            address:
              "Level 7, Mercu 3, No. 3, Jalan Bangsar, KL Eco City 59200, Kuala Lumpur W.P. Kuala Lumpur Malaysia",
          },
        ],
      },
    ],
    columns: [
      {
        title: "Product",
        links: [
          { label: "AI Sales Chat", href: "/en/chat" },
          { label: "CRM & Customer Data", href: "/en/crm" },
          { label: "Marketing & Broadcast", href: "/en/marketing" },
          { label: "Order & Automation", href: "/en/order" },
          { label: "Events", href: "/en/events" },
          { label: "Pricing", href: "/en/pricing" },
          { label: "Contact", href: "/en/contact" },
          { label: "Integrations", href: "/en/integrations" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "All features", href: "/en/features" },
          { label: "All industries", href: "/en/industries" },
          { label: "Solutions by role", href: "/en/solutions" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/en/about" },
          { label: "Customer stories", href: "/en/stories" },
          { label: "Blog", href: "/en/blog" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms & Conditions", href: "/en/terms-and-conditions" },
          { label: "Privacy Policy", href: "/en/privacy-policy" },
          {
            label: "Return, Refund & Delivery Policy",
            href: "/en/return-refund-delivery-policy",
          },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} CekatAI.`,
    rights: "All rights reserved.",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/cekatai/",
        icon: "linkedin",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/cekat.ai/",
        icon: "instagram",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@cekatai",
        icon: "youtube",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/p/CekatAI-61551061527910/",
        icon: "facebook",
      },
    ],
    apps: [
      {
        kind: "play",
        href: "https://play.google.com/store/apps/details?id=com.cekatmobile&pcampaignid=web_share&pli=1",
        label: "Get it on Google Play",
      },
      {
        kind: "apple",
        href: "https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id",
        label: "Download on the App Store",
      },
    ],
  },
};

export const CONTENT: Record<"id" | "en", HomeContent> = { id: ID, en: EN };

export function getContent(locale: string): HomeContent {
  return locale === "en" ? EN : ID;
}
