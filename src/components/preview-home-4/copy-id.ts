import { l } from './content-types';
import type { Copy4 } from './content-types';

export const ID: Copy4 = {
    announcement: {
        label: l("Baru"),
        text: l("Cerita pelanggan Cekat.AI, lengkap dengan angkanya"),
        cta: l("Baca ceritanya"),
        href: l("/cerita")
    },
    live: {
        eyebrow: l("LANGSUNG DI DALAM APLIKASI"),
        heading: "Inbox yang jalan",
        accent: "terus-menerus",
        body: l("Tidak ada rekaman layar di halaman ini. Yang di bawah ini adalah produknya sendiri, dibangun supaya bisa dijalankan — bukan gambar yangstitut sebagai tangkapan layar."),
        url: l("app.cekat.ai / inbox")
    },
    photos: {
        eyebrow: l("DI LAPANGAN"),
        heading: "Bekerja di gudang,",
        accent: "di meja, dan di jalan.",
        body: l("Klaim yang sama seperti di atas — tapi terjadi di tempat barang benar-benar bergerak.")
    },
    api: {
        eyebrow: l("OPEN API"),
        heading: "Bukan kotak hitam",
        accent: "yang harus Anda percaya.",
        body: l("Hubungkan Cekat.AI ke sistem Anda sendiri: kirim pesan, buat order, baca data pelanggan."),
        note: l("Contoh ilustrasi — endpoint dan field sebenarnya ada di dokumentasi."),
        cta: l("Lihat dokumentasi")
    },
    hero: {
        pill: l("Baru · Telepon WhatsApp dijawab AI"),
        lead: "Setiap chat jadi",
        accent: "pelanggan yang kembali",
        sub: l("Cekat.AI menjawab chat WhatsApp, Instagram, dan TikTok dalam hitungan detik, mengejar yang belum bayar, dan menulis data pelanggan sambil bicara. Tim Anda hanya mengambil chat yang sudah siap closing."),
        primary: l("Coba gratis 14 hari"),
        secondary: l("Lihat demo"),
        note: l("Gratis 14 hari · Tanpa kartu kredit · Siap dalam 10 menit"),
        stats: [
            {
                value: l("1,8 dtk"),
                label: l("rata-rata AI membalas")
            },
            {
                value: l("92%"),
                label: l("chat selesai tanpa manusia")
            },
            {
                value: l("+34%"),
                label: l("chat berubah jadi pembeli")
            }
        ]
    },
    proof: {
        heading: "Dipercaya tim yang menjawab jutaan percakapan",
        stats: [
            {
                value: l("10M+"),
                label: l("percakapan dibantu setiap bulan")
            },
            {
                value: l("3.000+"),
                label: l("bisnis di Indonesia, Singapura & Malaysia")
            },
            {
                value: l("<2 mnt"),
                label: l("rata-rata balasan pertama")
            }
        ],
        logosLabel: l("Dipercaya oleh"),
        logosNote: l("Sebagian brand yang menjalankan penjualan dan layanan pelanggan di Cekat.AI.")
    },
    useCases: {
        eyebrow: l("KASUS PENGGUNAAN"),
        heading: "Empat momen yang",
        accent: "paling mahal kalau diabaikan",
        body: l("Bukan daftar fitur. Empat situasi yang menentukan berapa harga satu pelanggan."),
        items: [
            {
                key: l("Chat masuk jam dua pagi"),
                rail: l("Balasan pertama"),
                title: l("Chat masuk jam dua pagi"),
                body: l("Tidak ada orang yang bangun jam dua pagi. Tapi pembeli yang sedang membandingkan harga akan pergi ke toko yang menjawab. AI menjawab dalam hitungan detik, pakai kata-kata Anda, dari daftar harga dan aturan pengiriman Anda."),
                points: [
                    l("Balasan pertama detik, bukan jam"),
                    l("Jawaban diambil dari info bisnis Anda"),
                    l("Otomatis ke tim saat butuh manusia")
                ],
                figure: l("8 dtk"),
                figureLabel: l("rata-rata balasan pertama"),
                surface: "inbox",
                path: l("app.cekat.ai / inbox")
            },
            {
                key: l("Pelanggan datang kedua kali"),
                rail: l("Data pelanggan"),
                title: l("Pelanggan datang kedua kali"),
                body: l("Kunjungan kedua tidak seharusnya mulai dari nol. Preferensi, riwayat order, dan catatan yang pernah dibahas tersusun sendiri dari percakapan — bukan dari form yang diisi ulang."),
                points: [
                    l("Profil tersusun dari chat"),
                    l("Satu catatan untuk semua kanal"),
                    l("Segmen ikut berubah saat pelanggan bergerak")
                ],
                figure: l("92%"),
                figureLabel: l("chat selesai tanpa manusia"),
                surface: "profile",
                path: l("app.cekat.ai / pelanggan")
            },
            {
                key: l("Pembeli bilang ya"),
                rail: l("Order & pembayaran"),
                title: l("Pembeli bilang ya"),
                body: l("Order selesai di chat tempat percakapan itu terjadi. Ongkir dihitung, link pembayaran dikirim, struk keluar, status dilacak sampai sampai — tanpa pindah aplikasi."),
                points: [
                    l("Ongkir dihitung di dalam chat"),
                    l("Link bayar dikirim seketika"),
                    l("Status dilacak sampai pengiriman")
                ],
                figure: l("+34%"),
                figureLabel: l("chat berubah jadi pembeli"),
                surface: "order",
                path: l("app.cekat.ai / order")
            },
            {
                key: l("Segmen mulai diam"),
                rail: l("Promosi & kampanye"),
                title: l("Segmen mulai diam"),
                body: l("Anda tahu siapa beli apa. Jadi pesan berikutnya bisa dikirim ke orang yang memang akan membeli — bukan ke semua orang. Pengeluaran iklan dan hasilnya dibaca di laporan yang sama."),
                points: [
                    l("Segmen dibangun dari riwayat order"),
                    l("Modal dan omzet dibaca di satu laporan"),
                    l("Pengingat ulang dikirim sebelum pelanggan hilang")
                ],
                figure: l("4,8×"),
                figureLabel: l("omzet terhadap modal iklan, 30 hari"),
                surface: "campaign",
                path: l("app.cekat.ai / kampanye")
            }
        ]
    },
    workflow: {
        eyebrow: l("ALUR KERJA"),
        heading: "Dari chat pertama sampai",
        accent: "pelanggan beli lagi",
        body: l("Empat langkah. Tidak ada yang butuh proyek, dan tidak ada yang butuh developer."),
        steps: [
            {
                index: l("01 / SAMBUNGKAN"),
                title: l("Hubungkan kanal"),
                body: l("WhatsApp, Instagram, TikTok, dan chat website masuk ke satu inbox. Nomor tetap milik Anda."),
                hint: l("± 10 menit")
            },
            {
                index: l("02 / ISI"),
                title: l("Tempel info usaha Anda"),
                body: l("Daftar harga, stok, kebijakan, dan jawaban yang paling sering keluar. AI menjawab dari sini, bukan mengarang."),
                hint: l("Tanpa coding")
            },
            {
                index: l("03 / JALAN"),
                title: l("Biarkan AI bekerja"),
                body: l("AI menjawab, memilah yang serius, mencatat pelanggan, dan meneruskan ke tim hanya saat sudah mau closing."),
                hint: l("24/7")
            },
            {
                index: l("04 / UKUR"),
                title: l("Tambah yang jalan"),
                body: l("Terlihat jelas channel, iklan, dan segmen mana yang balik modal. Yang tidak, diperbaiki."),
                hint: l("Real-time")
            }
        ]
    },
    capabilities: {
        eyebrow: l("KEMAMPUAN"),
        heading: "Yang benar-benar",
        accent: "dilakukan produknya",
        body: l("Empat kemampuan. Masing-masing bisa dipakai sendiri tanpa harus yang lain."),
        items: [
            {
                title: l("Balasan otomatis"),
                body: l("AI menjawab pertanyaan berulang dari sumber jawaban Anda, lalu berhenti dan meneruskan begitu butuh manusia."),
                points: [
                    l("Beralih ke manusia secara otomatis"),
                    l("Jawab sesuai nada bicara Anda")
                ],
                href: l("Lihat cara balas otomatis")
            },
            {
                title: l("Data pelanggan"),
                body: l("Riwayat, preferensi, dan nilai belanja tersusun dari percakapan. Tidak ada rekap di akhir hari."),
                points: [
                    l("Satu catatan di semua kanal"),
                    l("Segmen siap pakai")
                ],
                href: l("Lihat cara data tercatat")
            },
            {
                title: l("Order & pembayaran"),
                body: l("Order, pembayaran, dan pengiriman berjalan di dalam chat. Tidak ada aplikasi keempat yang perlu dibuka."),
                points: [
                    l("Pembayaran QRIS dan transfer"),
                    l("Status sampai ke pengiriman")
                ],
                href: l("Lihat cara order jalan")
            },
            {
                title: l("Promosi per segmen"),
                body: l("Broadcast dikirim ke segmen yang tepat, dan hasilnya dibaca terhadap pengeluarannya."),
                points: [
                    l("Segmen dari riwayat nyata"),
                    l("Laporan modal vs omzet")
                ],
                href: l("Lihat cara promosi bekerja")
            }
        ]
    },
    cases: {
        eyebrow: l("STUDI KASUS"),
        heading: "Empat bisnis,",
        accent: "semuanya angka nyata",
        body: l("Setiap angka di bawah disampaikan langsung oleh pelanggan sendiri. Bukan klaim kami."),
        items: [
            {
                quote: l("Dulu saya harus begadang membalas mereka. Sekarang saya tidur nyenyak, dan pagi-pagi sudah antre orang minta jadwal survei. Peningkatan penjualan hampir 50%."),
                name: "Adam Sulaiman",
                role: l("President Director"),
                company: "Threeland Property",
                photo: "/images/crm/adam-sulaiman.png",
                alt: l("Potret Adam Sulaiman, President Director Threeland Property"),
                result: l("Penjualan naik hampir 50%"),
                value: l("+50%"),
                valueLabel: l("kenaikan penjualan"),
                href: l("/cerita/threeland")
            },
            {
                quote: l("Response rate kami meningkat 90%."),
                name: "Hargyo T. N. Ignatis",
                role: l("Direktur"),
                company: "Multimedia Nusantara Polytechnic",
                photo: "/images/home/testimonial-hargyo.jpg",
                alt: l("Potret Hargyo T. N. Ignatis, Direktur Multimedia Nusantara Polytechnic"),
                result: l("Response rate naik 90%"),
                value: l("+90%"),
                valueLabel: l("kenaikan response rate"),
                href: l("/cerita/nature-craft")
            },
            {
                quote: l("Sekarang AMIRA menjawab 24 jam, kurang dari 1 menit."),
                name: "Wiji Astuti",
                role: l("Head of Customer Experience"),
                company: "Rumah Zakat",
                photo: "/images/home/testimonial-wiji-astuti.jpg",
                alt: l("Potret Wiji Astuti, Head of Customer Experience Rumah Zakat"),
                result: l("Dijawab 24 jam, di bawah 1 menit"),
                value: l("<1 mnt"),
                valueLabel: l("balasan pertama rata-rata"),
                href: l("/cerita/rumah-zakat")
            },
            {
                quote: l("Respon pelanggan jadi jauh lebih cepat."),
                name: "Silcia Brenda",
                role: l("CEO & Founder"),
                company: "Moir Salon",
                photo: "/images/home/testimonial-silica-brenda.jpg",
                alt: l("Potret Silcia Brenda, CEO & Founder Moir Salon"),
                result: l("Respons pelanggan jauh lebih cepat"),
                value: l("8 dtk"),
                valueLabel: l("rata-rata balasan pertama"),
                href: l("/cerita/nature-craft")
            }
        ]
    },
    statement: {
        eyebrow: l("SATU KALIMAT"),
        line1: "Setiap pertanyaan pelanggan punya",
        accent: "tiga detik untuk dijawab",
        note: l("Itu batas yang tidak pernah dilewat Cekat.AI — siang, malam, atau tengah malam di hari libur.")
    },
    voices: {
        eyebrow: l("KATA MEREKA"),
        heading: "Yang mereka",
        accent: "katakan setelah dipakai",
        quote: l("Dulu saya harus begadang membalas mereka. Sekarang saya tidur nyenyak, dan pagi-pagi sudah antre orang minta jadwal survei."),
        name: "Adam Sulaiman",
        role: l("President Director"),
        company: "Threeland Property"
    },
    trust: {
        eyebrow: l("KEAMANAN & KONTROL"),
        heading: "Yang Anda pegang,",
        accent: "dan yang Anda buktikan",
        body: l("Data pelanggan, akses tim, dan koneksi kanal dirancang agar bisnis tetap memegang kendali."),
        badges: [
            {
                label: l("UU PDP Indonesia"),
                note: l("Dikelola sesuai")
            },
            {
                label: l("Partner resmi Meta"),
                note: l("Jalur resmi")
            },
            {
                label: l("ISO 9001 & 27001"),
                note: l("Sertifikasi")
            },
            {
                label: l("Akses per peran"),
                note: l("Tim berbeda, tampilan berbeda")
            }
        ],
        points: [
            {
                title: l("Nomor tetap milik Anda"),
                body: l("Nomor WhatsApp terhubung ke bisnis Anda dan bisa dipindah kapan saja. Tidak ada kontrak yang mengunci.")
            },
            {
                title: l("Data bisa diunduh kapan saja"),
                body: l("Riwayat pelanggan dan order bisa diambil utuh kapan pun, dalam format yang bisa dipakai di tempat lain.")
            },
            {
                title: l("Akses diatur per peran"),
                body: l("Sales, support, dan keuangan melihat bagiannya masing-masing. Aturannya Anda yang menentukan.")
            },
            {
                title: l("Integrasi resmi"),
                body: l("WhatsApp terhubung melalui API resmi dengan template yang disetujui Meta.")
            }
        ]
    },
    faq: {
        eyebrow: l("FAQ"),
        heading: "Pertanyaan sebelum mulai",
        items: [
            {
                q: "Berapa lama sampai bisa dipakai?",
                a: "Kebanyakan usaha sudah membalas chat di hari yang sama. Sambungkan kanal, tempel daftar harga dan jawaban umum, nyalakan."
            },
            {
                q: "Apakah harus ambil semua sekaligus?",
                a: "Tidak. Mulai dari balasan otomatis. Data pelanggan, promosi, atau order menyusul saat tim sudah terbiasa — semuanya tetap di tempat yang sama."
            },
            {
                q: "Tim kami tidak ada IT. Tetap bisa jalan?",
                a: "Bisa. Yang dibutuhkan adalah menempel informasi usaha. Tim Cekat.AI mendampingi saat pemasangan."
            },
            {
                q: "Bagaimana kalau AI menjawab salah?",
                a: "Anda yang pegang sumber jawabannya. Chat yang sensitif atau di luar tugas langsung diteruskan ke manusia lengkap dengan riwayat chatnya."
            }
        ]
    },
    pricing: {
        eyebrow: l("PILIH PAKET"),
        heading: "Mulai sesuai kebutuhan",
        body: l("Coba seluruh fitur selama 14 hari. Tanpa kartu kredit."),
        plans: [
            {
                name: l("Pro"),
                price: l(""),
                period: l(""),
                note: l("Untuk tim kecil yang mulai kewalahan"),
                featuredLabel: l("Paling dipilih"),
                points: [
                    l("1 nomor WhatsApp resmi"),
                    l("3.000 pelanggan chat / bulan"),
                    l("15.000 balasan AI / bulan"),
                    l("5 akun tim")
                ],
                cta: l("Coba gratis 14 hari")
            },
            {
                name: l("Business"),
                price: l(""),
                period: l(""),
                note: l("Untuk tim yang butuh otomatis penuh"),
                featured: true,
                featuredLabel: l("Paling dipilih"),
                points: [
                    l("3 nomor WhatsApp resmi"),
                    l("10.000 pelanggan chat / bulan"),
                    l("50.000 balasan AI / bulan"),
                    l("7 akun tim"),
                    l("Order, pembayaran & follow-up")
                ],
                cta: l("Coba gratis 14 hari")
            },
            {
                name: l("Enterprise"),
                price: l(""),
                period: l(""),
                note: l("Untuk tim dengan struktur dan skala korporat"),
                featuredLabel: l("Hubungi kami"),
                points: [
                    l("5 nomor WhatsApp resmi"),
                    l("30.000 pelanggan chat / bulan"),
                    l("150.000 balasan AI / bulan"),
                    l("10 akun tim"),
                    l("Akses per peran & audit log")
                ],
                cta: l("Hubungi sales")
            }
        ],
        footnote: l("Tanpa kontrak jangka panjang. Ubah paket saat kebutuhan tim berkembang."),
        compare: l("Bandingkan semua paket")
    },
    finalCta: {
        eyebrow: l("MULAI HARI INI"),
        heading: "Buat setiap chat",
        accent: "berarti.",
        body: l("Lihat bagaimana Cekat membantu tim melayani pelanggan dan mengembangkan bisnis."),
        primary: l("Coba gratis 14 hari"),
        secondary: l("Hubungi tim sales"),
        checks: [
            l("Siap dalam 10 menit"),
            l("Didampingi tim kami"),
            l("Bisa berhenti kapan saja")
        ]
    }
};

