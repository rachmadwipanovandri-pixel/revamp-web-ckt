# PRD — Rebuild Website cekat.ai (Framer → Next.js)

| | |
|---|---|
| **Dokumen** | Product Requirements Document |
| **Tanggal** | 13 Juli 2026 |
| **Status** | Draft — menunggu review |
| **Referensi desain** | [01-colors.md](01-colors.md), [02-typography.md](02-typography.md), [03-spacing-radius-shadows.md](03-spacing-radius-shadows.md) |

---

## 1. Ringkasan

Website marketing cekat.ai saat ini dibangun di Framer. Proyek ini membangun ulang website tersebut menggunakan **Next.js (App Router)** dengan UI yang identik (pixel-faithful clone), agar:

- Kode dimiliki dan dikontrol penuh oleh tim (tidak terkunci vendor Framer).
- Performa dan SEO lebih baik (SSG/ISR, optimasi gambar & font, metadata terkontrol).
- Multi-bahasa dikelola rapi lewat dictionary, bukan duplikasi halaman.
- Blog terintegrasi dari WordPress (headless) tanpa menyentuh kode saat publikasi artikel.

## 2. Tujuan & Non-Tujuan

### Tujuan
1. Clone UI 1:1 dari cekat.ai untuk semua halaman dalam scope (§6), **termasuk aset visual asli** yang diekstrak dari situs live (§7).
2. Multi-bahasa **English (default)** dan **Bahasa Indonesia**, struktur URL mengikuti situs sekarang (EN di root, ID di `/id`).
3. SEO-ready: metadata lengkap, hreflang, sitemap, structured data, satu H1 per halaman.
4. Mobile-friendly: semua halaman responsif (mobile-first).
5. Blog headless dari WordPress REST API.
6. Form contact menyimpan leads ke spreadsheet beserta data UTM.
7. Setiap section halaman adalah komponen terpisah yang dapat digunakan ulang.

### Non-Tujuan (out of scope)
- Redesign atau perubahan visual dari situs sekarang.
- CMS untuk copy marketing (copy dikelola via dictionary JSON di git).
- Pembuatan/migrasi instance WordPress (hanya konsumsi API).
- Blog multi-bahasa (disiapkan arsitekturnya, implementasi menyusul).
- Dashboard admin / autentikasi user.

## 3. Metrik Keberhasilan

| Metrik | Target |
|---|---|
| Lighthouse (mobile) Performance | ≥ 90 |
| Lighthouse SEO & Accessibility | ≥ 95 |
| LCP | < 2,5 detik |
| CLS | < 0,1 |
| INP | < 200 ms |
| Kesesuaian visual dengan situs live | Review side-by-side per halaman, disetujui stakeholder |
| Semua URL existing tetap hidup | Tidak ada 404 baru pasca-cutover (kecuali `/demo`, lihat §18) |

## 4. Tech Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | Next.js versi terbaru (App Router, React Server Components, TypeScript) |
| Styling | Tailwind CSS v4 |
| Component library | shadcn/ui |
| Ikon | `@iconify/react` |
| i18n | `next-intl` (`localePrefix: "as-needed"`) |
| Animasi | `motion` (Framer Motion) untuk scroll-reveal & micro-interaction, menghormati `prefers-reduced-motion` |
| Form | `react-hook-form` + `zod` + komponen Form shadcn |
| Blog | WordPress REST API v2 (headless) |
| Analytics | Google Tag Manager, GA4, Meta Pixel |
| Deployment | Vercel |

## 5. Arsitektur & Struktur Proyek

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                      # Root layout per locale (Navbar, Footer, GTM)
│   │   ├── page.tsx                        # Homepage
│   │   ├── crm/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── marketing/page.tsx
│   │   ├── order/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                    # Index blog (paginated)
│   │   │   └── [slug]/page.tsx             # Detail artikel
│   │   ├── terms-and-conditions/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── return-refund-delivery-policy/page.tsx
│   │   └── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                                 # shadcn/ui (generated)
│   ├── layout/                             # Navbar, Footer, LanguageSwitcher, Container
│   └── sections/
│       ├── shared/                         # Section yang dipakai lintas halaman (FAQ, CTA, Testimonials, HowItWorks)
│       ├── home/
│       ├── product/                        # Template section halaman produk
│       ├── contact/
│       └── blog/
├── lib/
│   ├── wordpress.ts                        # Typed client WP REST API
│   ├── leads/
│   │   ├── types.ts                        # Interface LeadsProvider + tipe Lead
│   │   └── providers/                      # Implementasi (pending, lihat §12)
│   ├── utm.ts                              # Baca/tulis cookie UTM
│   └── seo.ts                              # Helper metadata & JSON-LD
├── messages/
│   ├── en.json                             # Dictionary EN (namespace per halaman/section)
│   └── id.json                             # Dictionary ID
├── middleware.ts                           # next-intl routing + UTM capture
└── i18n/                                   # Konfigurasi next-intl (routing, request)
```

**Prinsip komponen:**
- Satu section = satu komponen dengan satu tanggung jawab. Section menerima konten dari dictionary (via `useTranslations`/`getTranslations`), bukan hardcode.
- Section yang berulang antar halaman produk (Hero produk, "What Makes X Different", How it Works, Testimonials, FAQ, CTA akhir) dibuat sebagai **template di `sections/product/`** dan diberi konten berbeda per halaman — bukan diduplikasi.
- Default Server Component; `"use client"` hanya untuk yang interaktif (accordion FAQ, carousel, form, language switcher, animasi).

## 6. Halaman & Inventaris Section

> Inventaris di bawah diambil dari audit HTML situs live (13 Juli 2026). Detail visual difinalkan lewat review side-by-side saat implementasi.

### 6.1 Homepage — `/` dan `/id`
| # | Section | Konten |
|---|---|---|
| 1 | Navbar | Logo, menu (CRM, Chat, Marketing, Order, Blog, Contact), language switcher, CTA |
| 2 | Hero | Judul "Satu AI untuk Mengelola Chat, CRM, dan Otomatisasi Bisnis" (versi ID), CTA, visual produk |
| 3 | Platform Overview | "Satu Platform untuk Mengelola Semua Percakapan Customer" — omnichannel |
| 4 | Fitur: Jualan Otomatis | "Jualan Otomatis, Langsung dari Chat" |
| 5 | Fitur: Konversi | "Ubah Chat Jadi Penjualan" |
| 6 | Fitur: AI Agent Builder | "Buat AI Agent dalam 5 Menit" |
| 7 | Fitur: AI Agent & Alur Chat | "AI Agent & Alur Chat" |
| 8 | Social Proof / Hasil | "Bukti Nyata dari Bisnis yang Menggunakan Cekat.AI" — testimoni/statistik |
| 9 | CTA Akhir | "Ubah Setiap Percakapan Jadi Penjualan" |
| 10 | Footer | Kolom link produk & halaman legal, sosial media (Instagram, LinkedIn) |

### 6.2 Halaman Produk — `/crm`, `/chat`, `/marketing`, `/order`
Keempat halaman berbagi template section yang sama:

| # | Section | Catatan |
|---|---|---|
| 1 | Hero produk | Judul unik per halaman (lihat tabel di bawah) |
| 2 | Diferensiasi | "What Makes Cekat.AI {Produk} Different" |
| 3 | How it Works | Langkah-langkah (jumlah & isi beda per halaman) |
| 4 | Hasil Nyata | "Real Results for Growing Businesses" — **hanya di CRM & Chat** |
| 5 | FAQ | Accordion |
| 6 | CTA Akhir | Judul unik per halaman |

| Halaman | Judul Hero | Langkah How it Works |
|---|---|---|
| `/crm` | Stop Losing Customers to Your Competitors | Capture & Organize Customers → Track Customer Journey → Filter & Find Faster → Manage Work with Boards |
| `/chat` | Boost Admin Productivity by 10× with an AI Super Agent | Connect Channels → Train Your AI Agent → AI Handles Conversations → Escalate & Sync → Analyze & Improve |
| `/marketing` | Know Which Ads Actually Grow Your Sales | Review All Meta Ads in One Dashboard → Understand Customer Behavior → See What Actually Works → Allocate Budget with Precision → Improve Performance & Lower CAC |
| `/order` | Automate Complex Operations & Scale Your Business without Friction | Conversations Come In from Every Channel → Automation Triggers Instantly → Auto Create Ticket → Automatic Notifications to the Right Team → Full Visibility Across Every Automation Step → End-to-End Operational Efficiency |

CTA akhir per halaman: CRM "Turn Every Customer Interaction Into Your Next Deal"; Chat "Turn Every Chat into a Conversation That Converts"; Marketing "Turn Your Marketing Data Into Real Revenue"; Order "Ready to Put Your Business on Autopilot?".

### 6.3 Contact — `/contact`
- Heading: "Start your free consultation session with our sales team today".
- Form: **Nama Lengkap**, **Email**, **Nomor WhatsApp** (detail di §12).
- Layout dua kolom (copy + form) di desktop, stack di mobile.

### 6.4 Halaman Legal — `/terms-and-conditions`, `/privacy-policy`, `/return-refund-delivery-policy`
- Layout prose sederhana (typography container), konten statis per locale di dictionary/MDX.
- Konten diambil apa adanya dari situs live.

### 6.5 Blog — `/blog`, `/blog/[slug]`
Lihat §11.

### 6.6 Halaman Sistem
- `not-found.tsx` (404) per locale, mengikuti gaya situs.

### Perbaikan dari situs live (ditemukan saat audit)
Situs Framer sekarang punya beberapa cacat yang **tidak** ikut di-clone:
1. **Tidak ada H1** — semua judul hero memakai H2. Rebuild: judul hero = H1, satu per halaman.
2. **Heading duplikat** — Framer merender varian desktop & mobile sebagai elemen terpisah sehingga heading muncul 2–3×. Rebuild: satu komponen responsif.
3. **Link navbar `/demo` mengarah ke 404**. Keputusan tercatat di §18.
4. **Bug form contact**: input nomor telepon memakai `name="Email"` (duplikat). Rebuild: penamaan field benar.

## 7. Aset & Media (Hasil Ekstraksi Situs Live)

Seluruh aset gambar situs live sudah diekstrak (13 Juli 2026) dan tersimpan di repo sebagai bahan implementasi:

```
assets/framer/
├── images/          # 70 file — 52 PNG, 10 JPG, 5 SVG, 3 WebP (resolusi asli, total ±6,2 MB)
└── manifest.json    # pemetaan: URL asal → file lokal → halaman yang memakainya
```

**Proses ekstraksi:**
- Sumber: CDN Framer (`framerusercontent.com`), diambil dari `src`, `srcset`, `poster`, dan `background-image` semua halaman dalam scope.
- URL diunduh **tanpa query parameter resize** Framer (`?scale-down-to=…`) sehingga yang tersimpan adalah resolusi asli.
- `manifest.json` mencatat halaman mana saja yang memakai tiap aset — jadi acuan penempatan aset per section saat implementasi.
- Tidak ditemukan aset video pada halaman yang diaudit.

**Aturan pemakaian saat implementasi:**
- Aset dipindah ke `public/images/<halaman>/…` dengan nama deskriptif (bukan hash Framer), dilayani via `next/image` (konversi AVIF/WebP + responsive sizes otomatis).
- **Produk akhir tidak boleh hotlink ke `framerusercontent.com`** — semua media dilayani dari domain sendiri (kecuali media blog yang dilayani WordPress).
- Inventaris di-refresh per halaman saat implementasi: varian konten EN di root dan halaman `/id/*` dapat membawa aset tambahan yang belum tertangkap audit awal.

**Font:** 95 file `.woff2` (Google Sans Flex & Roboto Flex yang di-serve Framer) **tidak ikut diunduh** — URL-nya tercatat di `manifest.json`, tetapi redistribusi menunggu verifikasi lisensi (§18 item 2). Roboto Flex jelas aman via Google Fonts.

## 8. Internasionalisasi (i18n)

| Aspek | Keputusan |
|---|---|
| Locale | `en` (default), `id` |
| Library | `next-intl` |
| URL | `localePrefix: "as-needed"` — EN tanpa prefix (`/crm`), ID dengan prefix (`/id/crm`) |
| Deteksi otomatis | **Nonaktif** (`localeDetection: false`). Situs Framer sekarang me-redirect berdasar timezone; ini dibuang karena berisiko untuk SEO dan membingungkan crawler. Pengguna berpindah bahasa lewat switcher. |
| Language switcher | Di navbar; berpindah locale dengan mempertahankan path halaman yang sama |
| hreflang | `en` → path root, `id-ID` → path `/id`, `x-default` → path root (meniru situs live) |
| Konten | `messages/en.json` & `messages/id.json`, namespace per halaman/section (mis. `home.hero.title`) |

Semua string UI — termasuk label form, pesan error/sukses, metadata SEO — wajib lewat dictionary. Tidak ada string hardcode di komponen.

## 9. Komponen Bersama

- **Navbar** — sticky, responsive (hamburger + sheet/drawer di mobile), language switcher, CTA. Menu: CRM, Chat, Marketing, Order, Blog, Contact.
- **Footer** — link produk, halaman legal, sosial (Instagram, LinkedIn).
- **Section primitives** — `Container`, `SectionHeading`, `Badge`, `Card`, `Button` (varian sesuai design token), `Accordion` (FAQ), `Avatar`/testimonial card.
- Semua komponen interaktif berbasis shadcn/ui agar aksesibilitas (keyboard, ARIA) gratis dari Radix.

## 10. Design System

Sumber kebenaran: [01-colors.md](01-colors.md), [02-typography.md](02-typography.md), [03-spacing-radius-shadows.md](03-spacing-radius-shadows.md).

- **Warna** dipetakan ke CSS variables lewat Tailwind v4 `@theme` dan theming shadcn: `--primary` = Brand Blue `#1352bf`, skala teks netral, surface, aksen, border sesuai dokumen.
- **Radius & shadow** dipetakan ke token Tailwind (`--radius-*`, `--shadow-card`, `--shadow-inset-highlight`). Nilai pecahan hasil scaling Framer (3.576px, 5.96px, dst.) dinormalisasi ke skala bulat terdekat (4/6/8/10/12px) — dicek visual saat review.
- **Tipografi**: skala sesuai dokumen (heading 36/30px bold, body 18/16px, button 12px semibold).
- **Font**: situs live memakai **Google Sans Flex** (primer) dan **Roboto Flex** (numerik). Roboto Flex tersedia di Google Fonts (via `next/font/google`). Google Sans Flex harus diverifikasi lisensi/ketersediaannya — jika bisa di-self-host, pakai `next/font/local`; jika tidak, pilih pengganti visual terdekat (kandidat: Plus Jakarta Sans, Inter Tight) dengan persetujuan stakeholder. URL file font situs live tercatat di `assets/framer/manifest.json`. **Open item — lihat §18.**

## 11. Blog — Headless WordPress

### Arsitektur
- WordPress berjalan terpisah (instance sendiri); Next.js hanya konsumsi **REST API v2** (`/wp-json/wp/v2/posts?_embed`).
- Client bertipe di `lib/wordpress.ts`: `getPosts({page, perPage})`, `getPostBySlug(slug)`, `getCategories()`.
- **ISR**: `revalidate` 300 detik untuk index & detail. Opsional fase berikut: endpoint `/api/revalidate` (dengan secret) yang dipanggil webhook WP saat publish untuk revalidasi instan.
- Gambar WP dimasukkan `images.remotePatterns` di `next.config` agar lewat `next/image`.
- Konten HTML artikel disanitasi (`sanitize-html`/`rehype-sanitize`) sebelum dirender.

### Halaman
- **`/blog`** — daftar artikel (kartu: cover, judul, tanggal, excerpt), pagination berbasis header `X-WP-TotalPages`.
- **`/blog/[slug]`** — judul, cover, meta (tanggal, author via `_embed`), isi artikel, artikel terkait (opsional fase 2).

### Bahasa
- Artikel existing berbahasa Indonesia dan **belum** multi-bahasa. Untuk saat ini `/blog` dan `/id/blog` menampilkan konten yang sama apa adanya.
- Arsitektur disiapkan untuk masa depan: fungsi fetch menerima parameter `lang` opsional (kompatibel WPML/Polylang `?lang=`), sehingga saat WP mendukung multi-bahasa cukup mengaktifkan parameter tanpa refactor.

### SEO Blog
- Metadata artikel diambil dari field WP (judul, excerpt, featured image). Jika WP memakai plugin SEO (Yoast/RankMath), field-nya dipetakan bila tersedia di API.
- JSON-LD `Article` per post; blog masuk `sitemap.xml`.

## 12. Contact Form & Leads Pipeline

### Form
| Field | Tipe | Validasi |
|---|---|---|
| Nama Lengkap | text | wajib, min. 2 karakter |
| Email | email | wajib, format email valid |
| Nomor WhatsApp | tel | wajib, format Indonesia; dinormalisasi ke `628xxxxxxxxxx` (input `08…`/`+62…`/`62…` diterima) |

- `react-hook-form` + `zod` (schema dipakai ulang di server), komponen Form shadcn.
- Pesan error/sukses per-locale dari dictionary.
- **Anti-spam**: honeypot field tersembunyi (pola yang sama dengan situs live) + rate-limit sederhana di server action (per IP, jendela pendek).
- Setelah sukses: tampilkan pesan sukses inline + push event analytics (§14).

### Alur data
```
Pengunjung tiba (utm_source=... di URL)
   → middleware menangkap utm_*, referrer, landing page
   → simpan cookie first-touch `cekat_attribution` (30 hari, tidak menimpa yang sudah ada)

Submit form
   → Server Action: validasi zod → cek honeypot & rate-limit
   → susun payload Lead
   → LeadsProvider.saveLead(lead)
   → sukses: return state sukses + event `generate_lead` ke dataLayer
```

### Payload Lead
```ts
interface Lead {
  fullName: string;
  email: string;
  whatsapp: string;          // ternormalisasi 628…
  locale: "en" | "id";
  pagePath: string;          // halaman tempat submit
  landingPage: string;       // first-touch
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  submittedAt: string;       // ISO 8601
}
```

### LeadsProvider (mekanisme spreadsheet — PENDING)
```ts
interface LeadsProvider {
  saveLead(lead: Lead): Promise<void>;
}
```
Keputusan mekanisme penyimpanan **belum diambil** (§18). Dua kandidat implementasi, keduanya cukup mengisi interface di atas dan dipilih via env `LEADS_PROVIDER`:
1. **GoogleSheetsProvider** — Google Sheets API + service account (andal, kredensial di env).
2. **AppsScriptProvider** — POST ke webhook Google Apps Script (setup cepat, tanpa service account).

Form dan alur UTM dikerjakan penuh tanpa menunggu keputusan ini; selama pending, dipakai `LogLeadsProvider` (mencatat ke log server) agar alur bisa diuji end-to-end.

## 13. SEO

1. **Metadata per halaman per locale** via `generateMetadata` — title, description, Open Graph, Twitter card dari dictionary. Konten meta menyamai situs live sebagai baseline.
2. **hreflang & canonical** via `alternates` sesuai §8.
3. **`sitemap.xml`** (route `sitemap.ts`): semua halaman statis × 2 locale + seluruh artikel blog. **`robots.txt`** via `robots.ts`.
4. **Structured data (JSON-LD)**: `Organization` + `WebSite` (homepage), `BreadcrumbList` (halaman dalam), `FAQPage` (section FAQ produk), `Article` (blog).
5. **Satu H1 per halaman** (perbaikan dari situs live), hierarki heading logis.
6. **URL parity**: seluruh path sama dengan situs sekarang → tidak butuh migrasi redirect massal. Normalisasi trailing slash (redirect 308 bawaan Next.js).
7. **OG image** per halaman (aset statis; opsional dinamis via `next/og` di fase lanjut).
8. Pasca-launch: verifikasi Google Search Console, submit sitemap, monitor coverage.

## 14. Analytics & Tracking

- **GTM** dipasang sebagai tag container (via `@next/third-parties`), ID dari `NEXT_PUBLIC_GTM_ID`.
- **GA4** dan **Meta Pixel** dikonfigurasi **di dalam GTM** (rekomendasi, satu sumber pengelolaan; menghindari double-counting). Env untuk pemasangan langsung (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) tetap disiapkan sebagai fallback jika suatu saat GTM tidak dipakai — hanya salah satu jalur yang aktif.
- **Event dataLayer** minimal:
  - `generate_lead` — submit form contact sukses (beserta locale & path; tanpa PII).
  - `language_switch` — perpindahan bahasa.
  - `cta_click` — klik CTA utama (label per section).
- SPA pageview ditangani lewat konfigurasi History Change di GTM.

## 15. Performa & Aksesibilitas

- Seluruh halaman marketing **SSG**; blog **ISR** — tidak ada render blocking data fetch di client.
- `next/image` untuk semua gambar (ukuran eksplisit → CLS 0), aset hero di-preload.
- Font self-hosted via `next/font` (`display: swap`), tanpa request pihak ketiga untuk font.
- Animasi hanya `transform`/`opacity`; `prefers-reduced-motion` menonaktifkan animasi non-esensial.
- Komponen interaktif dari Radix (shadcn) → keyboard & ARIA terjamin; target kontras WCAG AA; landmark semantik (`header/main/footer/nav`).
- Script analytics dimuat `afterInteractive` agar tidak menghambat LCP.

## 16. Fase Pengerjaan

| Fase | Deliverable | Kriteria selesai |
|---|---|---|
| **1. Fondasi** | Scaffold Next.js + TS, Tailwind v4 + token design system, shadcn init, next-intl (routing EN/ID), Navbar + Footer, deploy pertama ke Vercel | Kerangka dua locale hidup di preview URL, token warna/tipografi terpasang |
| **2. Homepage** | Semua section homepage (EN & ID) responsif, memakai aset dari `assets/framer/` | Review side-by-side vs situs live disetujui |
| **3. Halaman produk** | Template section produk + 4 halaman (CRM, Chat, Marketing, Order) | 4 halaman lolos review visual, FAQ & animasi berfungsi |
| **4. Contact & legal** | Form contact + validasi + UTM capture + `LeadsProvider` (log provider), 3 halaman legal | Submit form tervalidasi end-to-end, cookie UTM terbukti terkirim di payload |
| **5. Blog** | Integrasi WP REST API, index + detail + pagination, ISR | Artikel WP tampil di kedua locale, revalidate bekerja |
| **6. SEO, analytics & launch** | Metadata lengkap, sitemap/robots, JSON-LD, GTM/GA4/Pixel, audit Lighthouse, cutover DNS | Target §3 tercapai, GSC terverifikasi, form leads memakai provider final |

Dependensi eksternal per fase: Fase 4 butuh keputusan mekanisme spreadsheet (paling lambat sebelum Fase 6); Fase 5 butuh URL & akses WordPress; Fase 6 butuh akses GTM/GA4/Meta & DNS.

## 17. Environment Variables

| Variabel | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL untuk canonical/sitemap/OG |
| `WORDPRESS_API_URL` | Base URL WP REST API |
| `REVALIDATE_SECRET` | Secret webhook revalidasi blog (opsional) |
| `LEADS_PROVIDER` | `log` \| `google-sheets` \| `apps-script` |
| `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_*` | Jika provider Google Sheets (pending) |
| `APPS_SCRIPT_WEBHOOK_URL` | Jika provider Apps Script (pending) |
| `NEXT_PUBLIC_GTM_ID` | Container GTM |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Fallback pemasangan langsung (default nonaktif) |

## 18. Keputusan Terbuka & Risiko

| # | Item | Status / Mitigasi |
|---|---|---|
| 1 | **Mekanisme spreadsheet leads** | PENDING (keputusan user). Interface `LeadsProvider` membuat keputusan ini tidak memblokir development; wajib final sebelum launch (Fase 6). |
| 2 | **Lisensi font Google Sans Flex** | Verifikasi ketersediaan untuk self-host (URL file live tercatat di manifest aset). Jika tidak memungkinkan → usulkan pengganti (Plus Jakarta Sans / Inter Tight) untuk disetujui. |
| 3 | **Link navbar `/demo` (404 di situs live)** | Rekomendasi: arahkan CTA ke `/contact`. Alternatif: buat halaman demo baru (di luar scope saat ini). Butuh keputusan. |
| 4 | **URL & akses WordPress** | Belum tersedia. Selama belum ada, development blog memakai instance/mock WP. |
| 5 | **Blog berbahasa ID tampil di locale EN** | Diterima sebagai kondisi sementara (keputusan §11); disiapkan parameter `lang` untuk masa depan. |
| 6 | **Fidelity konten** | Aset gambar sudah diekstrak lengkap (§7) — risiko tersisa pada copy teks yang diekstrak manual dari Framer. Mitigasi: review side-by-side per halaman di tiap fase. |
| 7 | **Konten EN vs ID** | Situs live menyajikan konten ID di root berdasarkan timezone, sehingga copy EN & ID keduanya sudah ada — keduanya diekstrak saat implementasi (root dengan user-agent/geo non-ID untuk EN, `/id/` untuk ID). |

## 19. Kriteria Penerimaan (ringkas)

- [ ] Semua halaman §6 tersedia dalam EN (root) dan ID (`/id`), responsif, dan lolos review visual.
- [ ] Language switcher berpindah locale dengan path yang dipertahankan.
- [ ] `view-source` tiap halaman: satu H1, meta title/description sesuai locale, hreflang 3 baris (en, id-ID, x-default), canonical benar.
- [ ] Semua gambar dilayani dari domain sendiri via `next/image` — tidak ada hotlink ke `framerusercontent.com`.
- [ ] `sitemap.xml` memuat semua halaman kedua locale + artikel blog; `robots.txt` tersedia.
- [ ] Submit form contact dengan URL ber-UTM → baris data lengkap (termasuk UTM & referrer) tersimpan via provider aktif; honeypot & rate-limit terbukti menolak spam.
- [ ] Artikel baru yang terbit di WordPress muncul di `/blog` ≤ 5 menit (ISR) tanpa deploy.
- [ ] Event `generate_lead` muncul di GTM preview saat submit sukses.
- [ ] Skor Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95 di homepage, satu halaman produk, dan satu artikel blog.
