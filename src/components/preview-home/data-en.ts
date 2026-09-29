/*
 * English variant of the preview homepage DATA (locale "en", served at /en/preview-home).
 * Structure must stay aligned with data.ts; links use the /en prefix and the
 * EN pathnames/slugs from src/i18n/routing.ts + src/lib/registry.
 */
export const DATA_EN = {
  nav: {
    brand: { name: "Cekat.AI", href: "/en" },
    links: [
      {
        id: "fitur", label: "Features", kind: "cats",
        categories: [
          { id: "chat", title: "AI Sales Chat", desc: "Reply, qualify, and close 24/7", items: [
            { t: "Live Chat", d: "Every channel in one inbox", href: "/en/features/embedded-live-chat" },
            { t: "Team Inbox", d: "Your whole team on one screen", href: "/en/features/whatsapp-multi-agent" },
            { t: "WhatsApp Auto Reply", d: "Replies in seconds, on autopilot", href: "/en/features/whatsapp-auto-reply" },
            { t: "Omnichannel", d: "WA, IG, TikTok, Telegram, email", href: "/en/features/omnichannel-application" },
            { t: "Ticketing System", d: "Every request tracked to done", href: "/en/features/ticketing-management-system" },
            { t: "Complaint Management", d: "Never miss a complaint", href: "/en/features/complaint-management" }
          ]},
          { id: "ai", title: "AI Agent", desc: "AI trained on your business data", items: [
            { t: "AI Agent Builder", d: "Build an AI agent in 5 minutes", href: "/en/features/no-code-ai-agent-builder" },
            { t: "Knowledge Base", d: "Turn SOPs into accurate answers", href: "/en/features/knowledge-base" },
            { t: "Chat Flow Designer", d: "Drag-and-drop conversation flows", href: "/en/features/visual-chat-flow-builder" },
            { t: "AI Working Hours", d: "AI on duty after hours", href: "/en/features/ai-working-hours" },
            { t: "Multilingual AI", d: "Serve customers in any language", href: "/en/features/multilingual-ai-agent" },
            { t: "AI Evaluation", d: "Correct the AI — it listens", href: "/en/features/ai-evaluation" }
          ]},
          { id: "crm", title: "CRM & Data", desc: "Pipeline that fills itself from chat", items: [
            { t: "Lead Management", d: "Leads captured automatically", href: "/en/features/lead-management" },
            { t: "Pipeline Management", d: "See every deal move in real time", href: "/en/features/pipeline-management" },
            { t: "Customer Stages", d: "Segment buyers by journey stage", href: "/en/features/customer-journey-stages" },
            { t: "Customer Segmentation", d: "Group customers automatically", href: "/en/features/customer-segmentation" },
            { t: "Customer Data", d: "One complete profile per person", href: "/en/features/customer-data-management" },
            { t: "Follow-up Automation", d: "On-time follow-ups, always", href: "/en/features/automated-follow-up" }
          ]},
          { id: "mkt", title: "Marketing & Attribution", desc: "From ad spend to closed deals", items: [
            { t: "Meta Ads Integration", d: "Send chat conversions to Meta", href: "/en/features/meta-ads-integration" },
            { t: "Conversion API", d: "Stop losing pixel data", href: "/en/features/conversion-api-integration" },
            { t: "Marketing Analytics", d: "ROAS and campaign performance", href: "/en/features/marketing-analytics-roas" },
            { t: "WhatsApp Broadcast", d: "Segmented, never spammy", href: "/en/features/whatsapp-broadcast" },
            { t: "TikTok Ads Integration", d: "Attribute TikTok ads to DMs", href: "/en/features/tiktok-ads-integration" },
            { t: "UTM Generator", d: "Keep traffic sources tidy", href: "/en/features/utm-generator" }
          ]},
          { id: "order", title: "Order & Automation", desc: "Orders run from inside the chat", items: [
            { t: "Order Automation", d: "Orders created from conversation", href: "/en/features/order-automation" },
            { t: "Shipping Cost Check", d: "Instant shipping quotes in chat", href: "/en/features/shipping-cost-automation" },
            { t: "Payment Automation", d: "Payment links & QR sent automatically", href: "/en/features/payment-automation" },
            { t: "Workflow Automation", d: "Multi-step ops without code", href: "/en/features/workflow-automation" }
          ]},
          { id: "int", title: "Integrations", desc: "Connect your whole stack", items: [
            { t: "Open API", d: "Wire up your internal systems", href: "/en/features/open-api" },
            { t: "Website Tracker", d: "See activity on your website", href: "/en/features/website-tracker" },
            { t: "Instagram Automation", d: "DMs and comments handled by AI", href: "/en/features/instagram-api" },
            { t: "AI Function Calling", d: "AI that acts: orders, payments, your API", href: "/en/features/ai-function-calling" }
          ]}
        ],
        featured: { icon: "phone", t: "WhatsApp Call AI", d: "Every call summarized by AI — key points and next steps, automatically.", href: "/en/features/whatsapp-call-ai-summary", cta: "Explore feature" }
      },
      {
        id: "solusi", label: "Solutions", kind: "cols",
        columns: [
          { title: "By role", items: [
            { t: "Business Owners", d: "Chat, sales & ads in one dashboard", href: "/en/solutions" },
            { t: "Customer Service", d: "Replies under 2 minutes, 24/7", href: "/en/solutions" },
            { t: "Marketing", d: "Attribution from ads to closing", href: "/en/solutions" },
            { t: "Sales", d: "Never miss a follow-up again", href: "/en/solutions" },
            { t: "Operations", d: "Orders & flows without code", href: "/en/solutions" }
          ]},
          { title: "By need", items: [
            { t: "Reply faster", d: "AI answers, your team closes", href: "/en/solutions" },
            { t: "Close on autopilot", d: "Qualify and book meetings 24/7", href: "/en/solutions" },
            { t: "Ads you can measure", d: "Know your ROAS per campaign", href: "/en/solutions" },
            { t: "Lighter operations", d: "Shipping, payments, orders on auto", href: "/en/solutions" }
          ]}
        ]
      },
      {
        id: "industri", label: "Industries", kind: "grid",
        intro: "Every industry has its own conversation patterns — Cekat.AI already knows them.",
        items: [
          { t: "Food & Beverage", href: "/en/industries/food-beverage" }, { t: "Retail & E-commerce", href: "/en/industries/retail-ecommerce" },
          { t: "Beauty & Wellness", href: "/en/industries/beauty-wellness" }, { t: "Real Estate", href: "/en/industries/property" },
          { t: "Education", href: "/en/industries/education" }, { t: "Clinics", href: "/en/industries/clinics" },
          { t: "Healthcare", href: "/en/industries/healthcare" }, { t: "Tour & Travel", href: "/en/industries/tour-travel" },
          { t: "Automotive", href: "/en/industries/automotive" }, { t: "Logistics", href: "/en/industries/logistics" },
          { t: "SaaS & Tech", href: "/en/industries/saas" }, { t: "Financial Services", href: "/en/industries/financial-services" }
        ],
        more: { t: "All industries", href: "/en/industries" }
      },
      { id: "blog", label: "Blog", href: "/en/blog" },
      { id: "harga", label: "Pricing", href: "/en/pricing" }
    ],
    login: { label: "Log in", href: "https://chat.cekat.ai/login" },
    cta: { label: "Free Trial", href: "https://chat.cekat.ai/register" },
    mobileGroups: ["fitur", "solusi", "industri"]
  },

  hero: {
    pill: { badge: "New", text: "WhatsApp Call AI — every call summarized automatically", href: "/en/features/whatsapp-call-ai-summary" },
    title: "From Leads to {accent:Lifetime Customer}.",
    sub: "Use AI agents, CRM, and automated follow-ups to turn more conversations into sales — and know exactly which ads end in a closed deal.",
    form: { placeholder: "Work email or WhatsApp number", cta: "Try Free for 14 Days" },
    note: "10-minute setup · No credit card · Chat with us on WhatsApp right away",
    trust: [
      { icon: "star", t: "Trusted by 3,000+ businesses in Asia" },
      { icon: "shield", t: "Official Meta Business Partner" },
      { icon: "clock", t: "10-minute setup, 14-day trial" }
    ],
    window: {
      url: "app.cekat.ai / inbox",
      side: ["Inbox", "Customer CRM", "Marketing", "Orders", "Reports"],
      title: "Incoming conversations · WhatsApp",
      chats: [
        { ava: "RA", color: "#1352BF", who: "Rani — Instagram DM", msg: "\"Hi, is the navy color in stock? What's the discount for 2?\"", chip: "● AI replied in 8 seconds" },
        { ava: "BS", color: "#22C55E", who: "Bagus — WhatsApp", msg: "\"How much is shipping to Bandung? Can I pay by QRIS?\"", chip: "● Shipping calculated + payment link sent" },
        { ava: "DW", color: "#B64ABF", who: "Dewi — TikTok", msg: "\"I've transferred, please check\"", chip: "● Order created in OMS automatically" }
      ],
      stats: [
        { v: "1.8 sec", l: "average AI reply" },
        { v: "92%", l: "chats answered automatically", spark: true },
        { v: "+34%", l: "closes this week" }
      ]
    }
  },

  /** Floating cards copy for the hero loop animation. Structure must match data.ts. */
  loop: {
    chat: {
      q: "Hi! Is the navy size L still available?",
      a: "Yes! I'll lock the stock for you — shall I create the order?",
      cta1: "Create order",
      cta2: "View catalog"
    },
    oms: {
      status: "NEW",
      nm: "Linen Shirt",
      pr: "Rp 350,000",
      rows: [["Subtotal", "Rp 350,000"], ["Shipping", "Free"], ["Total", "Rp 350,000"]],
      paid: "Payment received",
      rail: ["Created", "Paid", "Shipped"]
    },
    crm: {
      rl: "Returning customer · Bandung",
      ads: "Instagram Ads",
      stats: [["7", "Orders"], ["Rp 480k", "AOV"], ["2m", "Last seen"]]
    },
    mini: {
      lbl: "Mini Agent · Website widget",
      s: "Answers site visitors 24/7",
      q: "Any other colors besides navy?",
      a: "Yes! Sage and Sand are still in stock — I'll send you the pictures.",
      p1: "Sage Shirt",
      p2: "Sand Shirt",
      pr: "Rp 350k",
      cta: "Add to cart"
    },
    cons: {
      s: "Weekly recommendations for your store",
      badge: "Weekly",
      callout: "Linen category {b:up 24%} three weeks running — but Navy stock is down to {b:4 pcs}.",
      items: [
        "Restock {b:Navy ×40} before the weekend",
        "Activate {b:bundling promo} Saturday 10am–2pm",
        "Broadcast to {b:212 VIP customers} who haven't bought in 30 days"
      ],
      chart: "Orders / day",
      days: ["S", "M", "T", "W", "T", "F", "S"],
      cta: "Apply suggestions"
    },
    mkt: {
      s: "Automated broadcasts & campaigns",
      run: "Running",
      sub: "2,480 customers · VIP + cart abandon",
      stats: [["2,480", "Sent"], ["18%", "Opened"], ["312", "Clicks"]],
      num: "4.8×",
      roas: "ROAS · 30 days",
      foot: ["Revenue from ads", "Rp 8.4M"]
    }
  },

  logos: {
    eyebrow: "Social proof",
    heading: "They left the old way behind",
    lead: "Every story starts the same — slow replies, scattered data, missed follow-ups — and how Cekat.AI fixed it.",
    more: "…and thousands more businesses across Indonesia, Singapore, and Malaysia",
    items: [
      { src: "/images/home/logos/jago.png", alt: "Jago", caption: "Switched from manual replies that only covered office hours" },
      { src: "/images/home/logos/siloam.webp", alt: "Siloam Hospitals", caption: "From appointment spreadsheets rebuilt every night" },
      { src: "/images/home/logos/pln.png", alt: "PLN", caption: "From 3 separate tools for chat, CRM, and broadcast" },
      { src: "/images/home/logos/tiki-logo.png", alt: "TiKi", caption: "From delivery follow-ups that kept slipping through" },
      { src: "/images/home/logos/yupi.png", alt: "Yupi", caption: "From mass broadcasts that were opened but never answered" },
      { src: "/images/home/logos/realfood.png", alt: "Realfood", caption: "From orders retyped one by one" },
      { src: "/images/home/logos/kb-insurance.png", alt: "KB Insurance", caption: "From ad leads gone cold because outreach came too late" },
      { src: "/images/home/logos/telkom-university.png", alt: "Telkom University", caption: "From the same applicant questions repeating daily" }
    ]
  },

  proof: {
    items: [
      { v: "10,000,000,000+", count: 10000000000, suffix: "+", l: "tokens processed daily" },
      { v: "2,000,000+", count: 2000000, suffix: "+", l: "conversations processed daily" },
      { v: "3,000+", count: 3000, suffix: "+", l: "businesses in Asia" }
    ]
  },

  signals: {
    eyebrow: "Customer signals",
    title: "Never miss a {em:important moment} again",
    lead: "Every signal from chat, ads, and orders is caught automatically — your team knows exactly when to act, without watching every channel.",
    cta: { label: "See how signals work →", href: "/en" },
    rows: [
      [
        { c: "#B64ABF", t: "Customer asked price in Instagram DM" }, { c: "#22C55E", t: "Cart abandoned 2 hours ago" },
        { c: "#0EA5E9", t: "Ad lead not followed up yet" }, { c: "#13A8BF", t: "Chat arrived after hours" },
        { c: "#F59E0B", t: "Past customer back after 6 months" }, { c: "#EC4899", t: "Promo ends tomorrow, not reminded" }
      ],
      [
        { c: "#F59E0B", t: "Order unpaid for 1 day" }, { c: "#EC4899", t: "Broadcast opened but unanswered" },
        { c: "#1352BF", t: "Prospect asked shipping to 3 cities" }, { c: "#22C55E", t: "Tomorrow's booking confirmed by AI" },
        { c: "#EF4444", t: "Delay complaint routed to CS" }, { c: "#0EA5E9", t: "50 chats came in from Meta ads today" }
      ],
      [
        { c: "#22C55E", t: "Auto follow-up sent on day+1" }, { c: "#B64ABF", t: "Customer upgraded to premium plan" },
        { c: "#13A8BF", t: "Demo rescheduled" }, { c: "#0EA5E9", t: "AI recommended products to 128 customers" },
        { c: "#F59E0B", t: "Average order value up 2×" }, { c: "#EC4899", t: "Story views 500, link clicks 40" }
      ]
    ]
  },

  products: {
    eyebrow: "Platform",
    heading: "Four products, one platform",
    lead: "See how AI handles every part of your business — from sales to operations.",
    doodle: "click me!",
    items: [
      { title: "AI Sales Chat", dot: "#1352BF",
        headline: "Replies in seconds, not hours",
        body: "AI answers chats, qualifies buyers, and hands over to your team when they're ready to close. Every channel in one inbox — running 24/7 without a backlog.",
        pills: ["All channels, one inbox", "Auto-handoff to team", "Runs 24/7"],
        cta: { label: "Explore AI Sales Chat →", href: "/en/chat" },
        img: "/images/home/feature-chat-inbox.png", alt: "Cekat.AI chat inbox screen" },
      { title: "CRM & Customer Data", dot: "#22C55E",
        headline: "Clean data without manual entry",
        body: "Every conversation, purchase, and pipeline stage records itself from chat. No more end-of-day admin — the whole team sees the same data.",
        pills: ["Filled automatically from chat", "Real-time pipeline", "Complete history per customer"],
        cta: { label: "Explore CRM →", href: "/en/crm" },
        img: "/images/home/feature-crm-pipeline.png", alt: "Cekat.AI CRM pipeline screen" },
      { title: "Marketing & Broadcast", dot: "#B64ABF",
        headline: "Know which ads actually close",
        body: "Segmented broadcasts, automated follow-ups, and attribution that ties ad spend to real revenue — from ad click to chat to order.",
        pills: ["Segmented broadcast", "ROAS dashboard", "CAPI integration"],
        cta: { label: "Explore Marketing →", href: "/en/marketing" },
        img: "/images/home/feature-marketing-loop.png", alt: "Cekat.AI marketing dashboard screen" },
      { title: "Order & Automation", dot: "#F59E0B",
        headline: "Orders run straight from chat",
        body: "AI calculates shipping, sends payment links, and runs the follow-up flow — no code, from conversation to fulfilled order.",
        pills: ["Instant shipping quotes", "QR payments", "No code"],
        cta: { label: "Explore Orders →", href: "/en/order" },
        img: "/images/home/feature-oms-orders.png", alt: "Cekat.AI order automation screen" }
    ]
  },

  personas: {
    eyebrow: "Solutions by role",
    heading: "Built for people like you",
    lead: "One platform, five viewpoints — pick your role and see the outcomes and numbers that matter to you.",
    tabs: [
      { id: "owner", name: "Owners", icon: "home" },
      { id: "cs", name: "Customer Service", icon: "chat" },
      { id: "mkt", name: "Marketing", icon: "send" },
      { id: "sales", name: "Sales", icon: "chart" },
      { id: "ops", name: "Operations", icon: "grid" }
    ],
    panels: {
      owner: { h: "Know exactly which ads actually close",
        sub: "One dashboard for chat, sales, and ad performance — stop guessing and start deciding on numbers.",
        cta: { label: "See Owner solutions →", href: "/en/solutions" },
        kpis: [
          { n: "+50%", h: "Revenue up after close rate improved", p: "Nature Craft Indonesia — close rate from under 20% to over 40%." },
          { n: "1 dashboard", h: "Every channel and ad side by side", p: "WhatsApp, Instagram, TikTok, and Meta Ads in one view." }
        ]},
      cs: { h: "Replies in under 2 minutes, even after hours",
        sub: "AI handles repetitive questions, pulls customer context from the CRM, and hands chats to your team only when they're ready to close.",
        cta: { label: "See CS solutions →", href: "/en/solutions" },
        kpis: [
          { n: "+90%", h: "Response rate improved", p: "Multimedia Nusantara Polytechnic — from slow replies to near-instant." },
          { n: "< 1 min", h: "Answered 24 hours", p: "Never lose a lead at night — AI minds the inbox." }
        ]},
      mkt: { h: "From ad spend to real revenue",
        sub: "CAPI attribution ties every ad rupiah to a close, and segmented broadcasts reach the right people with the right message.",
        cta: { label: "See Marketing solutions →", href: "/en/solutions" },
        kpis: [
          { n: "4.8x", h: "ROAS measured in real time", p: "Chat conversions are sent back to ad platforms automatically." },
          { n: "CAPI", h: "Meta & TikTok integration", p: "Complete ad events — the pixel stops losing data." }
        ]},
      sales: { h: "Follow-ups that never slip",
        sub: "The pipeline fills itself from conversations, and AI reminds you when it's time to reach out to warm prospects.",
        cta: { label: "See Sales solutions →", href: "/en/solutions" },
        kpis: [
          { n: "20→28%", h: "Lead conversion up", p: "Wall Street English — low-quality leads filtered by AI first." },
          { n: "automatic", h: "Pipeline fills from chat", p: "No more deals lost to forgotten notes." }
        ]},
      ops: { h: "Orders run themselves, no code",
        sub: "Shipping calculated, payments sent, and order flows running automatically inside the conversation — all drag & drop.",
        cta: { label: "See Operations solutions →", href: "/en/solutions" },
        kpis: [
          { n: "QRIS", h: "Pay right in chat", p: "Payment links and receipts recorded on the order automatically." },
          { n: "0 code", h: "Drag & drop order flows", p: "Validate, decrement stock, update the customer — on its own." }
        ]}
    }
  },

  results: {
    eyebrow: "Real results",
    heading: "Real results from businesses running Cekat.AI",
    lead: "Big numbers, real names, real faces — straight from our customers in recorded interviews.",
    cards: [
      { type: "metric", bg: "bg-blue", big: "+50%", what: "revenue, after close rate went from under 20% to over 40%", co: "Nature Craft Indonesia" },
      { type: "quote", q: "“Our response rate improved by 90%.”",
        ava: { initials: "H", color: "#1352BF" }, nm: "Hargyo", rl: "Director · Multimedia Nusantara Polytechnic", logo: "MNP" },
      { type: "metric", bg: "bg-green", big: "20→28%", what: "lead conversion, after low-quality leads were filtered by AI first", co: "Wall Street English" },
      { type: "metric", bg: "bg-purple", big: "+30-40%", what: "revenue, as reply times dropped from 20 minutes to under 2", co: "Putiih Skin Clinic" },
      { type: "metric", bg: "bg-amber", big: "~+50%", what: "sales growth from midnight leads that used to be missed", co: "Threeland Property" },
      { type: "quote", q: "“Our First Contact team had hit a ceiling. With Cekat AI, low-quality leads are filtered first — and our conversion went from about 20% to 28%.”",
        ava: { initials: "B", color: "#22C55E" }, nm: "Bayu", rl: "Head of Digital Marketing", logo: "Wall Street" },
      { type: "full", q: "“Our contact center used to be Monday–Friday, 8 to 5. Now AMIRA answers 24 hours in under a minute. We don't lose donors.”",
        ava: { initials: "W", color: "#B64ABF" }, nm: "Wiji Astuti", rl: "Customer Experience Dept. Head · Rumah Zakat" }
    ]
  },

  videos: {
    eyebrow: "Customer stories",
    heading: "Hear it straight from them",
    lead: "Thirty seconds from business owners living it — no script, no drama.",
    note: "Click any video to play.",
    items: [
      { src: "/videos/angelcakery.webm", co: "Angel Cakery", who: "Customer story" },
      { src: "/videos/dariustour.webm", co: "Darius Tour", who: "Customer story" },
      { src: "/videos/gamal.webm", co: "Putiih Skin Clinic", who: "Gamal · Founder & CEO" },
      { src: "/videos/orangedental.webm", co: "Orange Dental", who: "Customer story" }
    ]
  },

  love: {
    eyebrow: "Testimonials",
    title: "Love from our {em:customers}",
    lead: "Hundreds of businesses across Indonesia, Singapore, and Malaysia — here's what they say.",
    columns: [
      { spd: "48s", dir: "up", cards: [
        { q: "“Customer responses got so much faster”",
          ava: { initials: "S", color: "#1352BF" }, nm: "Silcia Brenda", rl: "CEO & Founder · Moir Salon" },
        { q: "“I used to stay up replying to prospects. Now I sleep well — and wake up to a queue of survey requests. Sales up nearly 50%.”",
          ava: { initials: "A", color: "#F59E0B" }, nm: "Adam Sulaiman", rl: "President Director · Threeland Property" }
      ]},
      { spd: "56s", dir: "down", cards: [
        { q: "“Our close rate used to be under 20%. Now it's over 40%… and because it climbed, revenue jumped to 50%.”",
          ava: { initials: "H", color: "#22C55E" }, nm: "Hariyudi", rl: "Director · Nature Craft Indonesia" },
        { q: "“A single chat used to take over 20 minutes to answer… now under 2 minutes, set to 30 seconds. Revenue up 30–40%.”",
          ava: { initials: "G", color: "#B64ABF" }, nm: "Gamal", rl: "Founder & CEO · Putiih Skin Clinic" }
      ]},
      { spd: "50s", dir: "up", cards: [
        { q: "“Closing opportunities are very high”",
          ava: { initials: "W", color: "#0EA5E9" }, nm: "Wiji Astuti", rl: "Head of Customer Experience · Rumah Zakat" },
        { q: "“With Cekat AI, low-quality leads are filtered first, and conversion rose from about 20% to 28%.”",
          ava: { initials: "B", color: "#13A8BF" }, nm: "Bayu", rl: "Head of Digital Marketing · Wall Street English" }
      ]},
      { spd: "60s", dir: "down", cards: [
        { q: "“Our response rate improved by 90%.”",
          ava: { initials: "H", color: "#6366F1" }, nm: "Hargyo", rl: "Director · Multimedia Nusantara Polytechnic" },
        { q: "“Now AMIRA answers 24 hours in under a minute. We don't lose donors — and the closing opportunity is huge.”",
          ava: { initials: "W", color: "#EC4899" }, nm: "Wiji Astuti", rl: "Customer Experience Dept. Head · Rumah Zakat" }
      ]}
    ]
  },

  midcta: {
    eyebrow: "Start now",
    title: "Try it free for 14 days — {em:right from here}",
    sub: "Reply faster, follow up automatically, and close more — without growing the team.",
    form: { placeholder: "Email or WhatsApp number", cta: "Try Free for 14 Days" },
    trust: ["10-minute setup", "1-on-1 consultation", "Cancel anytime"]
  },

  blog: {
    eyebrow: "Learn",
    heading: "Sharpen your team's skills",
    cta: { label: "All articles", href: "/en/blog" },
    posts: [
      { cls: "t1", tt: "WHATSAPP<br/>BUSINESS API<br/>FOR SMBs", meta: "Guide · 12 min read",
        title: "How to set up WhatsApp Business API for a small business, step by step", href: "/en/blog" },
      { cls: "t2", tt: "7 REASONS SLOW<br/>CHATS<br/>KILL CLOSES", meta: "Conversion · 8 min read",
        title: "Why slow chat replies send buyers to your competitor", href: "/en/blog" },
      { cls: "t3", tt: "WHAT IS<br/>META CAPI?", meta: "Marketing · 10 min read",
        title: "Why chat conversions should be sent back to your Meta ads", href: "/en/blog" }
    ]
  },

  footer: {
    about: "AI Agent & Omnichannel CRM for businesses in Indonesia — reply faster, follow up automatically, close more.",
    partner: "Official Meta Business Partner",
    officeTitle: "Our Offices",
    apps: [
      { t: "Google Play", href: "https://play.google.com/store/apps/details?id=com.cekatmobile" },
      { t: "App Store", href: "https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id" }
    ],
    countries: [
      { key: "id", label: "Indonesia", offices: [
        { city: "Jakarta Office", addr: "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, South Jakarta 12190" },
        { city: "Tangerang Office", addr: "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810" }
      ]},
      { key: "sg", label: "Singapore", offices: [
        { city: "Cekat Pte. LTD.", addr: "101 Upper Cross Street, 05-16, People's Park Centre, Singapore, 058357" }
      ]},
      { key: "my", label: "Malaysia", offices: [
        { city: "CekatAI Sdn. Bhd.", addr: "Level 7, Mercu 3, No.1, Jalan Bangsar, KL Eco City 59200, Kuala Lumpur W.P. Kuala Lumpur Malaysia" }
      ]}
    ],
    cols: [
      { h: "Product", links: [
        { t: "AI Sales Chat", href: "/en/chat" }, { t: "CRM & Customer Data", href: "/en/crm" },
        { t: "Marketing & Broadcast", href: "/en/marketing" }, { t: "Order & Automation", href: "/en/order" },
        { t: "Open API & Integrations", href: "/en/integrations" }, { t: "Pricing", href: "/en/pricing" }
      ]},
      { h: "Features", links: [
        { t: "Live Chat", href: "/en/features/embedded-live-chat" }, { t: "Team Inbox", href: "/en/features/whatsapp-multi-agent" },
        { t: "WhatsApp Auto Reply", href: "/en/features/whatsapp-auto-reply" }, { t: "Omnichannel", href: "/en/features/omnichannel-application" },
        { t: "WhatsApp Broadcast", href: "/en/features/whatsapp-broadcast" }, { t: "Marketing Analytics", href: "/en/features/marketing-analytics-roas" }
      ]},
      { h: "Solutions", links: [
        { t: "For Owners", href: "/en/solutions" }, { t: "For Customer Service", href: "/en/solutions" },
        { t: "For Marketing", href: "/en/solutions" }, { t: "For Sales", href: "/en/solutions" },
        { t: "For Operations", href: "/en/solutions" }, { t: "All solutions", href: "/en/solutions" }
      ]},
      { h: "Industries", links: [
        { t: "Food & Beverage", href: "/en/industries/food-beverage" }, { t: "Retail", href: "/en/industries/retail-ecommerce" },
        { t: "Beauty & Wellness", href: "/en/industries/beauty-wellness" }, { t: "Real Estate", href: "/en/industries/property" },
        { t: "Education", href: "/en/industries/education" }, { t: "All industries", href: "/en/industries" }
      ]},
      { h: "Company", links: [
        { t: "Blog", href: "/en/blog" }, { t: "Events", href: "/en/events" },
        { t: "Contact", href: "/en/contact" }, { t: "Integrations", href: "/en/integrations" },
        { t: "Compare", href: "/en/comparison" }, { t: "Download the app", href: "https://play.google.com/store/apps/details?id=com.cekatmobile" }
      ]},
      { h: "Legal", links: [
        { t: "Privacy Policy", href: "/en/privacy-policy" },
        { t: "Terms of Service", href: "/en/terms-and-conditions" },
        { t: "Returns, Refunds & Delivery", href: "/en/return-refund-delivery-policy" }
      ]}
    ],
    copyright: "© 2025 PT Teknologi Cekat Indonesia · All rights reserved.",
    socials: ["Instagram", "LinkedIn", "YouTube"]
  },

  /** "Read the story" CTA on the logo cards and the results bento. */
  readMore: "Read the story",

  order: ["hero", "logos", "proof", "signals", "products", "personas", "results", "videos", "love", "midcta", "blog"]
};
