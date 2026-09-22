import type { FeatureEntry } from "./types";

/**
 * Feature landing pages, deck-grounded inventory (see docs/PRD and the
 * approved SEO plan). Every entry pairs with content files in
 * src/content/features/<id>/, the registry integrity test enforces the
 * pairing in both directions. Entries with `switcherFallbackId` are
 * single-locale keyword twins of a canonical page.
 *
 * `nav.megaMenu: true` marks the CURATED set shown in the desktop mega menu
 * and mobile nav (a balanced handful per category). Every page, curated or
 * not, still appears on the /features hub, the footer, and the sitemap.
 */
export const FEATURES: readonly FeatureEntry[] = [
  // ── Chat / Inbox ──────────────────────────────────────────────────────
  {
    id: "ai-agent",
    category: "chat",
    slugs: { en: "ai-chatbot", id: "chatbot" },
    title: { en: "AI Chatbot", id: "Chatbot AI" },
    tagline: {
      en: "Human-like AI that closes sales",
      id: "AI humanis yang closing, bukan cuma bales",
    },
    icon: "Bot",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "whatsapp-chatbot",
    category: "chat",
    slugs: { en: "whatsapp-chatbot", id: "chatbot-ai-whatsapp" },
    title: { en: "WhatsApp Chatbot", id: "Chatbot AI WhatsApp" },
    tagline: {
      en: "AI that sells on WhatsApp 24/7",
      id: "AI yang jualan di WhatsApp 24/7",
    },
    icon: "MessageCircle",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "whatsapp-bot",
    category: "chat",
    slugs: { id: "whatsapp-bot" },
    title: { id: "WhatsApp Bot" },
    tagline: {
      en: "A WhatsApp bot that understands people",
      id: "Bot WA yang paham bahasa manusia",
    },
    icon: "MessageCircle",
    switcherFallbackId: "whatsapp-chatbot",
  },
  {
    id: "whatsapp-business-api",
    category: "chat",
    slugs: { en: "whatsapp-business-api", id: "whatsapp-business-api" },
    title: { en: "WhatsApp Business API", id: "WhatsApp Business API" },
    tagline: {
      en: "Official API for your whole team",
      id: "API resmi untuk seluruh tim",
    },
    icon: "BadgeCheck",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "whatsapp-bisnis",
    category: "chat",
    slugs: { id: "whatsapp-bisnis" },
    title: { id: "WhatsApp Bisnis" },
    tagline: {
      en: "Outgrow the free WhatsApp Business app",
      id: "Naik kelas dari WhatsApp Business biasa",
    },
    icon: "BadgeCheck",
    switcherFallbackId: "whatsapp-business-api",
  },
  {
    id: "whatsapp-auto-reply",
    category: "chat",
    slugs: { en: "whatsapp-auto-reply", id: "auto-reply-whatsapp" },
    title: { en: "WhatsApp Auto Reply", id: "Auto Reply WhatsApp" },
    tagline: {
      en: "Instant answers, even after hours",
      id: "Balasan instan, bahkan di luar jam kerja",
    },
    icon: "Zap",
    nav: { order: 4 },
  },
  {
    id: "instagram-automation",
    category: "chat",
    slugs: { en: "instagram-api", id: "instagram-bot" },
    title: { en: "Instagram API", id: "Instagram Bot" },
    tagline: {
      en: "Auto-reply every Instagram DM",
      id: "Auto-reply setiap DM Instagram",
    },
    icon: "MousePointerClick",
    nav: { order: 5 },
  },
  {
    id: "facebook-messenger",
    category: "chat",
    slugs: {
      en: "facebook-messenger-automation",
      id: "bot-facebook-messenger",
    },
    title: { en: "Facebook Messenger", id: "Bot Facebook Messenger" },
    tagline: {
      en: "Answer Messenger in one inbox",
      id: "Jawab Messenger dalam satu inbox",
    },
    icon: "MessageCircle",
    nav: { order: 6 },
  },
  {
    id: "live-chat",
    category: "chat",
    slugs: { en: "embedded-live-chat", id: "live-chat-website" },
    title: { en: "Embedded Live Chat", id: "Live Chat Website" },
    tagline: {
      en: "AI live chat on your website",
      id: "Live chat AI di website kamu",
    },
    icon: "MessageCircle",
    nav: { order: 7 },
  },
  {
    id: "omnichannel",
    category: "chat",
    slugs: { en: "omnichannel-application", id: "aplikasi-omnichannel" },
    title: { en: "Omnichannel Application", id: "Aplikasi Omnichannel" },
    tagline: {
      en: "Every channel in one inbox",
      id: "Semua channel dalam satu inbox",
    },
    icon: "Layers",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "team-inbox",
    category: "chat",
    slugs: { en: "whatsapp-multi-agent", id: "multichat-wa" },
    title: { en: "WhatsApp Multi-Agent", id: "Multichat WA" },
    tagline: {
      en: "One number, your whole team",
      id: "Satu nomor, seluruh tim",
    },
    icon: "Users",
    nav: { order: 9 },
  },
  {
    id: "whatsapp-multi-device",
    category: "chat",
    slugs: { id: "whatsapp-multi-device" },
    title: { id: "WhatsApp Multi-Device" },
    tagline: {
      en: "Your business number, on any device",
      id: "Akses WhatsApp bisnis dari mana saja",
    },
    icon: "Users",
    switcherFallbackId: "team-inbox",
  },
  {
    id: "whatsapp-call-ai",
    category: "chat",
    slugs: { en: "whatsapp-call-ai-summary", id: "whatsapp-call-ai" },
    title: { en: "WhatsApp Call AI", id: "WhatsApp Call AI" },
    tagline: {
      en: "Every call summarized by AI",
      id: "Setiap telepon dirangkum AI",
    },
    icon: "PhoneCall",
    nav: { megaMenu: true, order: 5 },
  },
  {
    id: "multilingual-ai",
    category: "ai",
    slugs: { en: "multilingual-ai-agent", id: "ai-multi-bahasa" },
    title: { en: "Multilingual AI Agent", id: "AI Multi-Bahasa" },
    tagline: {
      en: "Serve customers in any language",
      id: "Layani customer dalam bahasa apa pun",
    },
    icon: "Globe",
    nav: { order: 11 },
  },
  {
    id: "agentic-ai",
    category: "ai",
    slugs: { en: "agentic-ai", id: "agentic-ai" },
    title: { en: "Agentic AI", id: "Agentic AI" },
    tagline: {
      en: "AI that takes action, not just talks",
      id: "AI yang bertindak, bukan cuma bicara",
    },
    icon: "Sparkle",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "ai-agent-builder",
    category: "ai",
    slugs: { en: "no-code-ai-agent-builder", id: "buat-ai-agent" },
    title: { en: "No-Code AI Builder", id: "Buat AI Agent" },
    tagline: {
      en: "Build an AI agent in 5 minutes",
      id: "Buat AI agent dalam 5 menit",
    },
    icon: "Wand",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "chat-flow-designer",
    category: "chat",
    slugs: { en: "visual-chat-flow-builder", id: "desain-alur-chat" },
    title: { en: "Visual Chat Flow Builder", id: "Desain Alur Chat" },
    tagline: {
      en: "Route chats with drag-and-drop",
      id: "Atur alur chat drag-and-drop",
    },
    icon: "GitBranch",
    nav: { order: 14 },
  },
  {
    id: "knowledge-base",
    category: "ai",
    slugs: { en: "knowledge-base", id: "knowledge-base" },
    title: { en: "Knowledge Base", id: "Knowledge Base" },
    tagline: {
      en: "Paste your SOPs, AI answers accurately",
      id: "Tempel SOP, AI jawab akurat",
    },
    icon: "Database",
    nav: { order: 15 },
  },

  // ── CRM ───────────────────────────────────────────────────────────────
  {
    id: "crm-application",
    category: "crm",
    slugs: { en: "crm-application", id: "aplikasi-crm" },
    title: { en: "CRM Application", id: "Aplikasi CRM" },
    tagline: {
      en: "A CRM built for conversations",
      id: "CRM yang dibangun untuk percakapan",
    },
    icon: "LayoutGrid",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "customer-data-management",
    category: "crm",
    slugs: { en: "customer-data-management", id: "manajemen-data-pelanggan" },
    title: { en: "Customer Data Management", id: "Manajemen Data Pelanggan" },
    tagline: {
      en: "Every customer detail in one profile",
      id: "Semua data customer dalam satu profil",
    },
    icon: "Database",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "manajemen-kontak",
    category: "crm",
    slugs: { id: "manajemen-kontak" },
    title: { id: "Manajemen Kontak" },
    tagline: {
      en: "Unify scattered customer contacts",
      id: "Satukan kontak customer yang berserakan",
    },
    icon: "Contact",
    switcherFallbackId: "customer-data-management",
  },
  {
    id: "lead-management",
    category: "crm",
    slugs: { en: "lead-management", id: "manajemen-lead" },
    title: { en: "Lead Management", id: "Manajemen Lead" },
    tagline: {
      en: "Capture and qualify leads automatically",
      id: "Tangkap & kualifikasi leads otomatis",
    },
    icon: "UserPlus",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "pipeline-management",
    category: "crm",
    slugs: { en: "pipeline-management", id: "manajemen-pipeline" },
    title: { en: "Pipeline Management", id: "Manajemen Pipeline" },
    tagline: {
      en: "See every deal move in real time",
      id: "Lihat setiap deal bergerak real-time",
    },
    icon: "Columns3",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "complaint-management",
    category: "crm",
    slugs: { en: "complaint-management", id: "manajemen-komplain" },
    title: { en: "Complaint Management", id: "Manajemen Komplain" },
    tagline: {
      en: "Turn complaints into tracked tickets",
      id: "Ubah komplain jadi tiket terlacak",
    },
    icon: "LifeBuoy",
    nav: { megaMenu: true, order: 5 },
  },
  {
    id: "crm-automation",
    category: "crm",
    slugs: { en: "crm-automation", id: "crm-otomatis" },
    title: { en: "CRM Automation", id: "CRM Otomatis" },
    tagline: {
      en: "CRM records that update themselves",
      id: "Catatan CRM yang update sendiri",
    },
    icon: "Zap",
    nav: { order: 6 },
  },
  {
    id: "customer-stages",
    category: "crm",
    slugs: { en: "customer-journey-stages", id: "tahapan-customer" },
    title: { en: "Customer Journey Stages", id: "Tahapan Customer" },
    tagline: {
      en: "Track Visitor to Lead to Buyer",
      id: "Lacak Visitor ke Lead ke Buyer",
    },
    icon: "GitBranch",
    nav: { order: 7 },
  },
  {
    id: "ticketing-system",
    category: "crm",
    slugs: { en: "ticketing-management-system", id: "sistem-manajemen-tiket" },
    title: { en: "Ticketing Management System", id: "Sistem Manajemen Tiket" },
    tagline: {
      en: "Never miss a high-priority request",
      id: "Tidak ada permintaan penting terlewat",
    },
    icon: "LifeBuoy",
    nav: { order: 8 },
  },

  // ── Marketing ─────────────────────────────────────────────────────────
  {
    id: "whatsapp-blast",
    category: "marketing",
    slugs: { en: "whatsapp-blast", id: "wa-blast" },
    title: { en: "WhatsApp Blast", id: "WA Blast" },
    tagline: {
      en: "Reach thousands in one send",
      id: "Jangkau ribuan sekali kirim",
    },
    icon: "Megaphone",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "whatsapp-bulk",
    category: "marketing",
    slugs: { id: "whatsapp-bulk" },
    title: { id: "WhatsApp Bulk" },
    tagline: {
      en: "Bulk messaging on the official route",
      id: "Pesan massal lewat jalur resmi",
    },
    icon: "Megaphone",
    switcherFallbackId: "whatsapp-blast",
  },
  {
    id: "whatsapp-broadcast",
    category: "marketing",
    slugs: { en: "whatsapp-broadcast", id: "aplikasi-broadcast-whatsapp" },
    title: { en: "WhatsApp Broadcast", id: "Aplikasi Broadcast WhatsApp" },
    tagline: {
      en: "Turn customer data into repeat sales",
      id: "Ubah data customer jadi repeat order",
    },
    icon: "Radio",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "customer-segmentation",
    category: "marketing",
    slugs: { en: "customer-segmentation", id: "segmentasi-pelanggan" },
    title: { en: "Customer Segmentation", id: "Segmentasi Pelanggan" },
    tagline: {
      en: "Target the right customers every time",
      id: "Sasar customer yang tepat setiap saat",
    },
    icon: "Users",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "follow-up-automation",
    category: "marketing",
    slugs: { en: "automated-follow-up", id: "follow-up-otomatis" },
    title: { en: "Automated Follow-Up", id: "Follow-Up Otomatis" },
    tagline: {
      en: "Never forget a follow-up again",
      id: "Tidak ada follow-up yang terlupa",
    },
    icon: "Send",
    nav: { order: 4 },
  },
  {
    id: "ads-conversion-api",
    category: "marketing",
    slugs: { en: "conversion-api-integration", id: "integrasi-capi" },
    title: { en: "Conversion API (CAPI)", id: "Integrasi CAPI" },
    tagline: {
      en: "Feed real conversions to your ads",
      id: "Suapi iklan dengan konversi nyata",
    },
    icon: "Target",
    nav: { megaMenu: true, order: 5 },
  },
  {
    id: "marketing-analytics",
    category: "marketing",
    slugs: { en: "marketing-analytics-roas", id: "dashboard-roas" },
    title: { en: "Marketing Analytics & ROAS", id: "Dashboard ROAS" },
    tagline: {
      en: "Know which campaigns make money",
      id: "Tahu campaign mana yang menghasilkan",
    },
    icon: "ChartColumn",
    nav: { megaMenu: true, order: 6 },
  },

  // ── Order / Automation ────────────────────────────────────────────────
  {
    id: "order-automation",
    category: "order",
    slugs: { en: "order-automation", id: "otomatisasi-order" },
    title: { en: "Order Automation", id: "Otomatisasi Order" },
    tagline: {
      en: "AI creates orders from chat",
      id: "AI bikin order dari chat",
    },
    icon: "ShoppingCart",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "shipping-cost-check",
    category: "order",
    slugs: { en: "shipping-cost-automation", id: "cek-ongkir-otomatis" },
    title: { en: "Shipping Cost Automation", id: "Cek Ongkir Otomatis" },
    tagline: {
      en: "Instant shipping quotes in chat",
      id: "Cek ongkir instan di chat",
    },
    icon: "Truck",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "payment-automation",
    category: "order",
    slugs: { en: "payment-automation", id: "pembayaran-qr-otomatis" },
    title: { en: "Payment Automation", id: "Pembayaran QR Otomatis" },
    tagline: {
      en: "Payment QR and reminders, automatic",
      id: "QR pembayaran & reminder otomatis",
    },
    icon: "QrCode",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "ai-working-hours",
    category: "order",
    slugs: { en: "ai-working-hours", id: "jam-kerja-ai" },
    title: { en: "AI Working Hours", id: "Jam Kerja AI" },
    tagline: {
      en: "AI covers you after hours",
      id: "AI jaga di luar jam kerja",
    },
    icon: "Clock",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "workflow-automation",
    category: "order",
    slugs: { en: "workflow-automation", id: "automasi-workflow" },
    title: { en: "Workflow Automation", id: "Automasi Workflow" },
    tagline: {
      en: "Automate multi-step operations, no code",
      id: "Otomasi operasi multi-langkah tanpa coding",
    },
    icon: "Workflow",
    nav: { megaMenu: true, order: 5 },
  },
  {
    id: "open-api",
    category: "order",
    slugs: { en: "open-api", id: "open-api" },
    title: { en: "Open API", id: "Open API" },
    tagline: {
      en: "Connect Cekat.AI to your stack",
      id: "Hubungkan Cekat.AI ke sistemmu",
    },
    icon: "Rocket",
    nav: { order: 6 },
  },
  {
    id: "ai-function-calling",
    category: "ai",
    slugs: { en: "ai-function-calling", id: "function-calling" },
    title: { en: "AI Function Calling", id: "Function Calling" },
    tagline: {
      en: "AI acts: orders, payments, your API",
      id: "AI bertindak: order, pembayaran, API-mu",
    },
    icon: "Zap",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "ai-agent-settings",
    category: "ai",
    slugs: { en: "ai-agent-settings", id: "pengaturan-ai" },
    title: { en: "Advanced AI Settings", id: "Pengaturan Lanjutan AI" },
    tagline: {
      en: "Tune memory, tone, and guardrails",
      id: "Atur memori, gaya jawab, dan batasan",
    },
    icon: "Wand",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "ai-evaluation",
    category: "ai",
    slugs: { en: "ai-evaluation", id: "ai-feedback" },
    title: { en: "AI Feedback & Evaluation", id: "AI Feedback & Evaluasi" },
    tagline: {
      en: "Correct the AI, it stays corrected",
      id: "Koreksi jawaban AI, langsung nurut",
    },
    icon: "BadgeCheck",
    nav: { megaMenu: true, order: 5 },
  },
  {
    id: "meta-ads-integration",
    category: "marketing",
    slugs: { en: "meta-ads-integration", id: "integrasi-meta-ads" },
    title: { en: "Meta Ads Integration", id: "Integrasi Meta Ads" },
    tagline: {
      en: "CTWA leads land attributed to their ad",
      id: "Leads CTWA masuk beratribusi iklannya",
    },
    icon: "MousePointerClick",
    nav: { order: 21 },
  },
  {
    id: "tiktok-ads-integration",
    category: "marketing",
    slugs: { en: "tiktok-ads-integration", id: "integrasi-tiktok-ads" },
    title: { en: "TikTok Ads Integration", id: "Integrasi TikTok Ads" },
    tagline: {
      en: "TikTok Ads into DM or WhatsApp",
      id: "TikTok Ads ke DM atau WhatsApp",
    },
    icon: "Clapperboard",
    nav: { order: 22 },
  },
  {
    id: "website-tracker",
    category: "marketing",
    slugs: { en: "website-tracker", id: "website-tracker" },
    title: { en: "Cekat Tracker", id: "Cekat Tracker" },
    tagline: {
      en: "Know where every visit and chat began",
      id: "Tahu asal tiap kunjungan dan chat",
    },
    icon: "Radio",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "utm-generator",
    category: "marketing",
    slugs: { en: "utm-generator", id: "utm-generator" },
    title: { en: "UTM & wa.me Generator", id: "UTM & wa.me Generator" },
    tagline: {
      en: "Build trackable UTM and wa.me links",
      id: "Bikin link UTM dan wa.me yang kelacak",
    },
    icon: "Target",
    nav: { order: 23 },
  },
] as const;
