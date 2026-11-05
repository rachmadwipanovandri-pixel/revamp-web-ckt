import { CASE_STUDIES_JA } from "./case-studies.ja";
import { CASE_STUDIES_KO } from "./case-studies.ko";
import { CASE_STUDIES_ZH } from "./case-studies.zh";
import type { CaseStudyLocalizedCopy } from "./case-studies.ja";

export type CaseStudyIndustry =
  | "healthcare"
  | "food-beverage"
  | "education"
  | "professional-services"
  | "property"
  | "government";

export interface CaseStudyStep {
  title: string;
  body: string;
}

export interface CaseStudyOutcome {
  value: string;
  label: string;
  detail: string;
}

export interface CaseStudy {
  slug: string;
  company: string;
  industry: string;
  industryKey: CaseStudyIndustry;
  useCases: string[];
  title: string;
  summary: string;
  image: string;
  logo: string;
  logoAlt: string;
  featuredOutcome: string;
  outcomes: CaseStudyOutcome[];
  interview: { name: string; role: string };
  about: string[];
  challenge: { paragraphs: string[]; quote: string };
  solutions: { intro: string; quote: string; steps: CaseStudyStep[] };
  results: { intro: string; quote: string };
  profile: { location: string; companySize: string; services: string[] };
}

export const CASE_STUDY_INDUSTRIES: {
  slug: CaseStudyIndustry;
  label: string;
}[] = [
  { slug: "healthcare", label: "Healthcare" },
  { slug: "food-beverage", label: "Food & Beverage" },
  { slug: "education", label: "Education" },
  { slug: "professional-services", label: "Professional Services" },
  { slug: "property", label: "Property" },
  { slug: "government", label: "Government" },
];

/** Current published case studies from cekat.ai/case-study. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "euromedica",
    company: "Euromedica Group",
    industry: "Healthcare",
    industryKey: "healthcare",
    useCases: ["CRM"],
    title: "How Euromedica Reached a 25–30% Booking Rate",
    summary:
      "From TikTok leads to clinic bookings, Euromedica Group connects conversations, AI assistance, and CRM with Cekat.AI.",
    image: "/images/case-studies/euromedica.webp",
    logo: "/images/case-studies/euromedica-logo.webp",
    logoAlt: "Euromedica",
    featuredOutcome: ">5×",
    outcomes: [
      {
        value: ">5×",
        label: "reported rise in booking rate",
        detail:
          "Renny linked the increase to AI replies outside business hours and CRM support for lead management and nurturing. This is a group-level increase, not a percentage-point change.",
      },
      {
        value: "25–30%",
        label: "Euromedica Group booking rate",
        detail:
          "Renny shared this as the group's booking rate at the time of the interview. The fivefold figure describes its reported growth; this range describes its current level.",
      },
      {
        value: "~3×",
        label: "reported rise in click-through rate",
        detail:
          "According to Renny, the stronger CTR helped the team keep cost per lead under control. The interview gives an approximate multiplier, not starting and ending CTR percentages.",
      },
      {
        value: "32%",
        label: "reported conversion rate",
        detail:
          "Renny shared this as a separate conversion measure alongside the booking rate. The interview gives no baseline or calculation method for this measure.",
      },
    ],
    interview: {
      name: "Renny Hasibuan",
      role: "GM Marketing, Euromedica Group",
    },
    about: [
      "Euromedica Group runs a network of beauty and aesthetic clinics with 121 business units across Indonesia. Its brands include Skin+ Slim+ Clinic and Yeuu Hair Lab, which incorporates Korean hair-care technology.",
      "For Euromedica, TikTok is a lead-generation channel, not only a place to publish content. The marketing team needs to turn online interest into conversations and clinic visits, then understand which leads progress to a booking.",
    ],
    challenge: {
      paragraphs: [
        "For Euromedica Group, TikTok leads matter when conversations turn into bookings and clinic visits. A high volume of leads needs equally strong responses so online interest does not stop at the DM.",
        "The AI Agent and human team need to handle many leads at once, including questions about skin concerns and different promotions. Marketing also needs to see where prospective customers drop off before booking.",
      ],
      quote: "From that volume, we can also get good-quality leads.",
    },
    solutions: {
      intro:
        "The approach for Euromedica Group combines connected workflows, from the first conversation through team follow-up.",
      quote: "The AI Agent must be able to consult and show empathy.",
      steps: [
        {
          title: "Bring TikTok DMs and other lead conversations into one inbox",
          body: "Euromedica uses one workspace to access conversations from different channels, including TikTok direct messages. Its agents can engage a lead without switching between separate channel inboxes. The shared view helps human agents manage engagement and conversion alongside the AI Agent, even when many leads arrive at once.",
        },
        {
          title:
            "Answer treatment questions with empathy and calculate each promotion",
          body: "The AI Agent handles early questions with an empathetic, consultative tone rather than quoting a treatment price immediately. It also supports digital payments and calculates discounts across different campaigns. For customers asking about a skin concern, the AI can respond in a more consultative way and account for campaign discounts and payment details.",
        },
        {
          title: "Use a configurable CRM tracker to find where leads drop off",
          body: "A configurable CRM tracker shows how leads move through the acquisition flow and where they drop off. The team can customize the stages it measures, see where a lead stops progressing, and decide when follow-up or retention work is needed.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote: "Our conversion rate is now at 32%.",
    },
    profile: {
      location: "Indonesia",
      companySize: "121 business units",
      services: ["Omnichannel Inbox", "AI Agent", "CRM"],
    },
  },
  {
    slug: "holywings",
    company: "HolyWings",
    industry: "Food & Beverage",
    industryKey: "food-beverage",
    useCases: ["Chat"],
    title: "How HolyWings Keeps Funnel Visibility Above 90% Across Every Brand",
    summary:
      "Running multiple restaurant and entertainment brands meant customer conversations were scattered, with no shared view of what was actually converting.",
    image: "/images/case-studies/holywings.webp",
    logo: "/images/case-studies/holywings-logo.webp",
    logoAlt: "HolyWings",
    featuredOutcome: "6–10%",
    outcomes: [
      {
        value: "6–10%",
        label: "conversion rate",
        detail:
          "The case material records a 6–10% conversion range across the engagement flow. It is the outcome recorded for the tracked flow, not a figure for every brand independently.",
      },
      {
        value: "<3 min",
        label: "average response time",
        detail:
          "The reported average response stayed under three minutes, shortening the wait after a customer first reached out.",
      },
      {
        value: "<15%",
        label: "lead drop-off rate",
        detail:
          "Fewer than 15% of leads dropped off along the tracked journey, giving the team a way to inspect where inquiries stop progressing.",
      },
      {
        value: ">90%",
        label: "funnel visibility, per brand",
        detail:
          "Brand-level tracking lets the group see most of the funnel without losing each brand's context. The source does not claim this visibility for every brand independently.",
      },
    ],
    interview: { name: "Michelle Tan", role: "Head of Brand Operations" },
    about: [
      "HolyWings operates a multi-brand hospitality and restaurant ecosystem. Customer messages may relate to different brands and outlets, so the team needs a way to respond quickly while retaining visibility into each brand's conversion path.",
      "Messages from prospective guests do not all belong to the same team. The case centers on brand-aware routing and seeing the path from an incoming inquiry to a qualified lead.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, HolyWings managed customer engagement across its multi-brand restaurant ecosystem with limited end-to-end visibility.",
        "When conversations were scattered across brands, the team could not easily see which inquiry had been answered, qualified, or passed to the right people. That left room for slow replies and leads dropping out of the journey.",
      ],
      quote:
        "With several brands, it was easy to lose sight of which team needed to pick up a particular conversation.",
    },
    solutions: {
      intro:
        "The approach for HolyWings connects workflows from the first conversation through team follow-up.",
      quote:
        "We needed a shared view of incoming chats while keeping each brand's context clear for the team handling it.",
      steps: [
        {
          title: "See conversations across brands without mixing their context",
          body: "An omnichannel inbox gives the group a consolidated place to review conversations while preserving the brand context of each inquiry. Managers can notice unanswered questions while the specific outlet or brand remains visible to the responder.",
        },
        {
          title: "Reply quickly when a guest asks about an outlet",
          body: "The chat system supports timely first responses and a consistent path for customers asking about the group's offerings. A timely first answer preserves the customer's interest and makes the next conversation step clear.",
        },
        {
          title: "Send each qualified inquiry to the right brand team",
          body: "Incoming leads can be qualified and directed to the relevant brand team instead of remaining in an undifferentiated message queue. Routing prevents a lead from sitting in a general queue after the team knows which brand should handle it.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote:
        "The team can now look at response and lead progress per brand instead of treating all messages as one queue.",
    },
    profile: {
      location: "Nationwide branches, Indonesia (HW Group)",
      companySize: "501–1,000 employees",
      services: ["Omnichannel Inbox", "Chat System", "Lead Routing"],
    },
  },
  {
    slug: "sparks-sports-academy",
    company: "Sparks Sports Academy",
    industry: "Education",
    industryKey: "education",
    useCases: ["AI"],
    title:
      "How Sparks Sports Academy Cut New-Agent Onboarding Time by Up to 50%",
    summary:
      "Bringing new customer-service agents up to speed took long, inconsistent manual coaching, and conversations still varied batch to batch.",
    image: "/images/case-studies/sparks-sports-academy.webp",
    logo: "/images/case-studies/sparks-sports-academy-logo.webp",
    logoAlt: "Sparks Sports Academy",
    featuredOutcome: "30–50%",
    outcomes: [
      {
        value: "20–30%",
        label: "agent conversion rate with AI-assisted guidance",
        detail:
          "The reported conversion range applies to agents using AI-assisted guidance in the chat-to-booking flow, not to every academy conversation.",
      },
      {
        value: "30–50%",
        label: "faster new-agent onboarding time",
        detail:
          "A more structured learning path shortened the time required to bring new agents into the workflow, helping new team members reach live conversations earlier.",
      },
      {
        value: "80–90%",
        label: "training completion quality score",
        detail:
          "The recorded quality score reflects how well agents completed the supported training process, rather than a customer satisfaction score.",
      },
      {
        value: "Standardized",
        label: "training quality across every batch",
        detail:
          "Shared guidance reduced variation in training quality between batches. The source does not give a separate percentage for this qualitative outcome.",
      },
    ],
    interview: {
      name: "Bagas Hidayat",
      role: "Customer Service Training Lead",
    },
    about: [
      "Sparks Sports Academy relies on customer service agents to guide families from an initial chat toward a suitable sports-program booking. As new agents join, the quality of those conversations depends on how quickly they can learn and apply the right guidance.",
      "The case is about the agent learning process as much as the customer conversation. The academy needed a way to prepare new staff while maintaining a consistent standard for answering course and booking inquiries.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, Sparks Sports Academy relied on conventional onboarding and manual coaching to prepare customer service agents. As training demand grew, the team struggled to improve chat-to-booking conversion, shorten the learning curve, and keep training quality consistent across every onboarding batch.",
        "Conventional onboarding took time from experienced team members. Training could vary between batches, while newer agents still had to answer real customer questions and help convert inquiries into bookings.",
      ],
      quote:
        "Every new batch needed coaching, but we also had to keep the quality of live customer chats consistent.",
    },
    solutions: {
      intro:
        "The approach for Sparks Sports Academy connects agent guidance with a repeatable onboarding process.",
      quote:
        "Guidance during the chat gives a newer agent a clearer way to answer without waiting for a coach to review every message.",
      steps: [
        {
          title: "Guide agents while they handle a real booking inquiry",
          body: "Agents receive assistance while handling inquiries, helping them respond with a more relevant next step toward booking. The agent can use the suggested next step in the moment while still owning the final response to the family.",
        },
        {
          title: "Give new staff a repeatable route through onboarding",
          body: "New agents can practice and learn from a more structured process instead of depending entirely on one-to-one manual coaching. A shared learning flow reduces dependence on the availability and habits of one experienced coach.",
        },
        {
          title: "Keep response standards consistent between training batches",
          body: "Shared guidance establishes a common baseline for handling customer questions across onboarding batches. The same guidance helps the team compare readiness between batches instead of relying only on informal impressions.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote:
        "The value is in both parts: agents become ready sooner, and customers still receive a more consistent conversation.",
    },
    profile: {
      location: "Jakarta Utara, Indonesia",
      companySize: "51–200 employees",
      services: ["AI-Assisted Agent Guidance", "Onboarding Automation"],
    },
  },
  {
    slug: "kb-insurance",
    company: "KB Insurance Indonesia",
    industry: "Professional Services",
    industryKey: "professional-services",
    useCases: ["Chat"],
    title: "How KB Insurance Became a 24/7 Always-On Contact Center",
    summary:
      "Long wait times and a cluttered knowledge base meant inconsistent answers, and frequent complaints.",
    image: "/images/case-studies/kb-insurance.webp",
    logo: "/images/case-studies/kb-insurance-logo.webp",
    logoAlt: "KB Insurance Indonesia",
    featuredOutcome: "24/7",
    outcomes: [
      {
        value: "24/7",
        label: "always-on contact center availability",
        detail:
          "Customers can reach the contact center at any time, including outside staffed service hours. Availability describes the contact channel, not a promise that every complex claim is settled automatically.",
      },
      {
        value: "More accurate",
        label: "answers from a centralized knowledge base",
        detail:
          "Answers became more accurate as the response flow used one managed knowledge source. The case material describes this qualitatively and gives no accuracy percentage.",
      },
      {
        value: "More consistent",
        label: "responses across every inquiry",
        detail:
          "A shared source reduces conflicting answers to the same type of inquiry, especially when customers return with follow-up questions.",
      },
      {
        value: "Fewer complaints",
        label: "overall",
        detail:
          "Faster, clearer handling accompanied the reported reduction in complaints; the source does not specify a before-and-after complaint count.",
      },
    ],
    interview: { name: "Intan Maharani", role: "Customer Care Manager" },
    about: [
      "KB Insurance Indonesia handles customer questions that range from everyday policy information to urgent support. A useful contact center needs to be available when customers reach out and draw from the same knowledge across every response.",
      "The contact journey includes both common requests and situations needing closer attention. This case focuses on maintaining a common answer source so customers receive a reliable first response at any hour.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, KB Insurance customers faced long waiting times and inconsistent responses, often navigating a cluttered knowledge base that led to confusion and frequent complaints.",
        "Long waits and a cluttered knowledge base made service harder for both customers and agents. When similar questions received different answers, confusion could turn into repeat contacts and complaints.",
      ],
      quote:
        "A long wait was one problem; getting different answers to similar questions made the experience even harder.",
    },
    solutions: {
      intro:
        "The approach for KB Insurance Indonesia combines a shared service view, maintained knowledge, and an always-available first response.",
      quote:
        "Putting the knowledge in one place helps the team answer consistently, even when a question arrives outside normal hours.",
      steps: [
        {
          title: "Bring customer questions into one service view",
          body: "Customer inquiries enter one service flow, giving the team a clearer view of open issues and where they should go next. A shared case view also helps agents pick up an issue without asking the customer to reconstruct earlier contact.",
        },
        {
          title: "Answer from the same maintained knowledge source",
          body: "Automated responses draw from a shared knowledge base so recurring policy and support questions are answered more consistently. Maintaining one reference reduces the chance that a policy question is answered differently simply because it reached another agent.",
        },
        {
          title: "Offer a dependable first response at any hour",
          body: "A reliable first-response layer keeps the channel available for general questions and emergency support before any needed human follow-up. Common requests can be handled promptly while issues requiring judgment remain available for human review.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote:
        "Customers now have a clearer place to start, and the team has a common reference when a case needs further handling.",
    },
    profile: {
      location: "Jakarta, Indonesia",
      companySize: "51–200 employees",
      services: ["Omnichannel Contact Center", "Knowledge Base Automation"],
    },
  },
  {
    slug: "asuransi-simas-insurtech",
    company: "Asuransi Simas Insurtech",
    industry: "Professional Services",
    industryKey: "professional-services",
    useCases: ["Order"],
    title: "How Asuransi Simas Insurtech Sped Up Response Time 5x",
    summary:
      "Fragmented systems made it hard to handle inquiries and complaints efficiently, while manual checks slowed down insurance pricing.",
    image: "/images/case-studies/asuransi-simas-insurtech.webp",
    logo: "/images/case-studies/asuransi-simas-insurtech-logo.webp",
    logoAlt: "Asuransi Simas Insurtech",
    featuredOutcome: "5×",
    outcomes: [
      {
        value: "24/7",
        label: "availability across every channel",
        detail:
          "Customers can start an inquiry at any hour through the unified contact system, even when a specialist is not immediately available to finish a complex case.",
      },
      {
        value: "5×",
        label: "faster response time",
        detail:
          "The reported response-time improvement reflects fewer manual steps between an incoming question and the first useful answer. It should not be read as a claim about every individual request.",
      },
      {
        value: "Higher conversion",
        label: "with a unified, always-on contact system",
        detail:
          "A consistent contact route supports conversion by reducing friction during information and pricing requests; the source gives no conversion percentage.",
      },
      {
        value: "Fewer complaints",
        label: "after consolidating systems into one",
        detail:
          "Consolidated handling gives the team a clearer path to resolve issues, alongside the reported reduction in complaints. The source does not specify a complaint count.",
      },
    ],
    interview: {
      name: "Rizky Mahendra",
      role: "Customer Operations Manager",
    },
    about: [
      "Asuransi Simas Insurtech serves customers who need timely answers about policies, pricing, and claims. The contact experience depends on multiple internal systems, so information needs to be available in one workflow when customers reach out.",
      "The case examines both responding to customer questions and processing vehicle information for insurance-pricing requests. These tasks previously involved different tools and manual checks.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, Simas Insurtech operated across fragmented systems, making it difficult to handle customer inquiries and complaints efficiently, while manual processes slowed down insurance pricing checks.",
        "Agents had to move between disconnected systems while handling questions and complaints. Manual vehicle-document checks added another step to pricing requests, extending the time between first contact and a useful answer.",
      ],
      quote:
        "An agent could be answering a customer while still looking for the information in another system.",
    },
    solutions: {
      intro:
        "The approach for Asuransi Simas Insurtech connects contact handling, document processing, and first assistance.",
      quote:
        "Once the contact flow and document reading were connected, we could move from a question to a useful answer with fewer manual steps.",
      steps: [
        {
          title: "Handle questions and complaints in one contact flow",
          body: "Customer conversations and relevant system information are brought into one contact flow so inquiries and complaints can be followed end to end. The same workflow preserves context as it moves from an initial answer to a more involved service case.",
        },
        {
          title: "Read vehicle documents without retyping every detail",
          body: "Vehicle documents can be read with OCR to reduce repetitive data entry during insurance-pricing checks. The team can still review exceptions while reducing the handoff between seeing a document and using its information.",
        },
        {
          title: "Keep first assistance available beyond service hours",
          body: "Automated first responses keep the contact channel available while complex insurance questions can still move through the appropriate service workflow. Cases needing policy-specific judgment remain part of the service process.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote:
        "What changed for the team was the speed of getting the right context in front of the person handling the inquiry.",
    },
    profile: {
      location: "Jakarta, Indonesia",
      companySize: "51–100 employees",
      services: ["Unified Contact Solution", "OCR Document Automation"],
    },
  },
  {
    slug: "asri-agung-sedayu",
    company: "ASRI (Agung Sedayu Group)",
    industry: "Property",
    industryKey: "property",
    useCases: ["Marketing"],
    title: "How ASRI Increased Inbound Engagement by 500% Across Its Malls",
    summary:
      "Multiple WhatsApp numbers across malls nationwide meant fragmented data and low customer engagement.",
    image: "/images/case-studies/asri-agung-sedayu.webp",
    logo: "/images/case-studies/asri-agung-sedayu-logo.webp",
    logoAlt: "ASRI",
    featuredOutcome: "500%",
    outcomes: [
      {
        value: "1.5×",
        label: "increase in customer satisfaction (CSAT)",
        detail:
          "The reported CSAT lift indicates that a more connected service journey translated into a better customer experience.",
      },
      {
        value: "500%",
        label: "more engagement in inbound customer chat",
        detail:
          "Inbound chat engagement increased as customers had a clearer, more consistent channel to reach the business. The case does not break this increase down by location.",
      },
      {
        value: "24/7",
        label: "availability across every mall",
        detail:
          "The shared channel can receive and assist inquiries beyond individual mall operating hours. Availability is an entry point for inquiries, not a claim that every case is automatically resolved.",
      },
      {
        value: "Higher loyalty",
        label: "activation across malls nationwide",
        detail:
          "Centralized context makes loyalty activation easier to coordinate across locations. The source does not specify a numeric lift for this outcome.",
      },
    ],
    interview: {
      name: "Nadia Pratama",
      role: "Head of Customer Experience",
    },
    about: [
      "ASRI manages customer relationships across a nationwide mall network. A shopper may interact with different malls, campaigns, and loyalty programs, but the service team needs a connected view of those conversations to keep each interaction relevant.",
      "This case focuses on the contact experience across malls: how shoppers reach ASRI, how their conversations are recorded, and how those contacts support loyalty activity in more than one location.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, ASRI managed multiple WhatsApp numbers across malls nationwide, resulting in fragmented databases, inefficient loyalty touchpoints, and low customer engagement.",
        "Separate WhatsApp numbers meant a conversation at one mall did not naturally inform the next. Customer records and loyalty touchpoints were scattered, making follow-up harder to coordinate and limiting the value of inbound engagement.",
      ],
      quote:
        "We had conversations coming in from many malls, but the customer context stayed in separate places.",
    },
    solutions: {
      intro:
        "The approach for ASRI connects customer conversations, location context, and loyalty follow-up.",
      quote:
        "The important change was having one place to continue a conversation, whichever mall a customer contacted first.",
      steps: [
        {
          title: "Bring every mall conversation into one WhatsApp channel",
          body: "Consolidating mall conversations into a single AI-powered contact channel gives the team a shared starting point for inquiries and service. A common entry point also makes it easier to establish who is responsible for the next response.",
        },
        {
          title: "Keep customer context connected between locations",
          body: "Centralized conversation data lets the team see customer context across touchpoints instead of working from isolated mall-level records. Earlier inquiries remain useful when a visitor returns through another campaign or asks about a different mall.",
        },
        {
          title: "Turn follow-up into a coordinated loyalty workflow",
          body: "Marketing automation supports more relevant follow-ups and loyalty messages without requiring each mall to manage the workflow manually. The team can plan a consistent follow-up sequence using information gathered from each conversation.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. Their scope follows the available data.",
      quote:
        "When the contact history is connected, our team has a much clearer starting point for serving returning visitors.",
    },
    profile: {
      location: "Jakarta, Indonesia",
      companySize: "201–500 employees",
      services: ["Omnichannel WhatsApp", "Marketing Automation", "Loyalty CRM"],
    },
  },
  {
    slug: "bpjs-ketenagakerjaan",
    company: "BPJS Ketenagakerjaan (BPJS TK)",
    industry: "Government",
    industryKey: "government",
    useCases: ["Order"],
    title: "How BPJS Ketenagakerjaan Doubled On-Time Payment Compliance",
    summary:
      "One of its largest branches relied on manual payment reminders, leaving outstanding balances and cluttered records.",
    image: "/images/case-studies/bpjs-ketenagakerjaan.webp",
    logo: "/images/case-studies/bpjs-ketenagakerjaan-logo.webp",
    logoAlt: "BPJS Ketenagakerjaan",
    featuredOutcome: "2×",
    outcomes: [
      {
        value: "2×",
        label: "improvement in on-time payment compliance",
        detail:
          "The pilot reported twice the on-time payment compliance after reminders became more systematic. This is a reported outcome from the branch pilot.",
      },
      {
        value: "Fewer complaints",
        label: "with higher customer satisfaction",
        detail:
          "Clearer communication and records accompanied fewer complaints and higher reported satisfaction. The source does not give complaint or satisfaction counts.",
      },
      {
        value: "Lower cost",
        label: "per reminder broadcast than before",
        detail:
          "Automating reminder broadcasts reduced the cost per reminder compared with the previous process. The case does not provide the old and new rupiah amounts.",
      },
      {
        value: "One",
        label: "single point of contact for every inquiry",
        detail:
          "Members have one contact route for questions instead of navigating separate follow-up channels. That shared route helps identify the responsible team and continue a conversation after a reminder.",
      },
    ],
    interview: {
      name: "Dimas Saputra",
      role: "Branch Service Manager",
    },
    about: [
      "BPJS Ketenagakerjaan administers employment social-security services. This case study covers a pilot at its largest branch, where payment reminders and member inquiries place a significant administrative load on the team.",
      "The pilot concentrated on routine communication with members: reminders, records, and the route for inquiries. Its reported results are branch-pilot outcomes, not a claim that the same workflow has already been deployed nationally.",
    ],
    challenge: {
      paragraphs: [
        "Before Cekat.AI, BPJS Ketenagakerjaan's largest branch relied on manual payment reminders, leading to outstanding balances, cluttered records, and low revenue absorption.",
        "A manual reminder process made it harder to reach members consistently and keep payment records current. Outstanding balances and scattered follow-up notes also obscured which cases needed attention next.",
      ],
      quote:
        "Sending reminders manually made it difficult to know which members had already been contacted and which still needed follow-up.",
    },
    solutions: {
      intro:
        "The approach for BPJS Ketenagakerjaan combines payment reminders, organized member records, and a shared contact route.",
      quote:
        "We needed reminders and inquiry records to be part of the same process, so the team could spend less time sorting messages.",
      steps: [
        {
          title: "Make payment reminders timely and repeatable",
          body: "Automated broadcasts replace repetitive manual reminders and give members a more predictable payment prompt. Scheduling the message sequence removes the need to rebuild each reminder manually and helps maintain a consistent cadence.",
        },
        {
          title: "Label member cases so the next action stays clear",
          body: "Member conversations and payment-related cases are labeled to keep records easier to sort and follow up. Labels make it easier to distinguish a pending payment question from a case that has already moved to the next step.",
        },
        {
          title: "Give every inquiry one shared contact route",
          body: "A single point of contact and guided workflow help the branch route incoming questions while reducing repetitive administrative work. The team can review a member's inquiry alongside the reminder history instead of treating each message as a new case.",
        },
      ],
    },
    results: {
      intro:
        "These outcomes reflect the figures recorded in the client's case-study material. The reported results are for the branch pilot.",
      quote:
        "The most useful change was being able to follow the payment reminder process with records that stay organized.",
    },
    profile: {
      location: "336 service offices nationwide, Indonesia",
      companySize: "336 branch and regional offices nationwide",
      services: ["Automated Payment Reminders", "Workflow Automation"],
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

/** Return locale-specific editorial content while retaining shared source facts and assets. */
export function localizeCaseStudy(study: CaseStudy, locale: string): CaseStudy {
  const localizedCopy: Record<
    string,
    Record<string, CaseStudyLocalizedCopy>
  > = {
    cn: CASE_STUDIES_ZH,
    jp: CASE_STUDIES_JA,
    kr: CASE_STUDIES_KO,
  };
  const copy = localizedCopy[locale]?.[study.slug];
  return copy ? { ...study, ...copy } : study;
}

export function getCaseStudyIndustry(
  category: string | undefined,
): CaseStudyIndustry | undefined {
  return CASE_STUDY_INDUSTRIES.find((industry) => industry.slug === category)
    ?.slug;
}

export function filterCaseStudies(category: string | undefined): CaseStudy[] {
  const industry = getCaseStudyIndustry(category);
  return industry
    ? CASE_STUDIES.filter((study) => study.industryKey === industry)
    : CASE_STUDIES;
}
