import { describe, expect, it } from "vitest";
import {
  localizeRevampHomeMarkup,
  localizeRevampHomeRoutes,
} from "./revamp-home-i18n";
import { revampHomeMarkup } from "./revamp-home-markup";

describe("revamp homepage localization", () => {
  it("reserves space for homepage images and defers below-the-fold assets", () => {
    const images = [...revampHomeMarkup.matchAll(/<img\b[^>]*>/g)].map(
      ([image]) => image,
    );
    const customerLogos = images.filter((image) =>
      image.includes("/assets/logos/"),
    );
    const integrationIcons = images.filter((image) =>
      image.includes("/assets/integrations/"),
    );

    expect(images.length).toBeGreaterThan(0);
    expect(
      images.every(
        (image) => /\bwidth="\d+"/.test(image) && /\bheight="\d+"/.test(image),
      ),
    ).toBe(true);
    expect(customerLogos.length).toBeGreaterThan(0);
    expect(
      customerLogos.every((image) => image.includes('loading="lazy"')),
    ).toBe(true);
    expect(integrationIcons.length).toBeGreaterThan(0);
    expect(
      integrationIcons.every((image) => image.includes('loading="lazy"')),
    ).toBe(true);
    expect(revampHomeMarkup).toContain("/assets/logos/rumah-zakat.webp");
    expect(revampHomeMarkup).toContain("/assets/stories/lumina.webp");
  });

  it("localizes split hero nodes, including the animated word", () => {
    const markup =
      '<h1><span class="sr-only">#1 AI-powered revenue technology</span><span aria-hidden="true">#1 AI-powered <span class="rot"><span class="rot__word">revenue</span></span> technology</span></h1>';

    const localized = localizeRevampHomeMarkup(markup, "cn");

    expect(localized).toContain("领先的 AI 收入增长技术");
    expect(localized).toContain("领先的 AI 驱动 ");
    expect(localized).toContain("收入</span></span> 技术");
    expect(localized).not.toContain("revenue");
    expect(localized).not.toContain("technology");
  });

  it("keeps static homepage links in the active locale", () => {
    const markup =
      '<a href="/pricing">Pricing</a><a href="/features">Features</a><a href="/blog">Blog</a><a href="/contact-us">Talk to sales</a><a href="/">Home</a>';

    expect(localizeRevampHomeRoutes(markup, "jp")).toBe(
      '<a href="/jp/pricing">Pricing</a><a href="/jp/features">Features</a><a href="/jp/blog">Blog</a><a href="/jp/contact-us">Talk to sales</a><a href="/jp">Home</a>',
    );
    expect(localizeRevampHomeRoutes(markup, "id")).toBe(
      '<a href="/harga">Pricing</a><a href="/fitur">Features</a><a href="/blog">Blog</a><a href="/contact-us">Talk to sales</a><a href="/">Home</a>',
    );
  });

  it.each([
    ["en", "/en/blog", "/en/contact-us", "Blog", "Talk to sales"],
    ["id", "/blog", "/contact-us", "Blog", "Hubungi tim sales"],
    ["cn", "/cn/blog", "/cn/contact-us", "博客", "联系销售"],
    ["jp", "/jp/blog", "/jp/contact-us", "ブログ", "営業に相談"],
    ["kr", "/kr/blog", "/kr/contact-us", "블로그", "영업팀 문의"],
  ] as const)(
    "adds localized Blog and Contact Us links to the homepage header in %s",
    (locale, blogHref, contactHref, blogLabel, salesLabel) => {
      const markup = localizeRevampHomeMarkup(
        localizeRevampHomeRoutes(revampHomeMarkup, locale),
        locale,
      );
      const header = markup.match(/<header class="nav"[\s\S]*?<\/header>/)?.[0];

      expect(header).toBeDefined();
      expect(header).toContain(
        `<a class="mnav__link" href="${blogHref}">${blogLabel}</a>`,
      );
      expect(header).toContain(
        `<a class="btn btn--soft" href="${contactHref}">${salesLabel}</a>`,
      );
      expect(header).toContain(
        `<a class="btn btn--ghost" href="${contactHref}">${salesLabel}</a>`,
      );
      expect(header).not.toContain("data-demo>Talk to sales</button>");
    },
  );

  it("localizes Indonesian header previews and industry navigation", () => {
    const localized = localizeRevampHomeMarkup(revampHomeMarkup, "id");
    const header = localized.match(
      /<header class="nav"[\s\S]*?<\/header>/,
    )?.[0];

    expect(header).toBeDefined();
    for (const translated of [
      "Ketahui iklan dan kreator yang menghasilkan pendapatan.",
      "Apakah ini masih tersedia?",
      "Perlengkapan kantor",
      "Kirim tips perawatan via WhatsApp",
      "Kesehatan",
      "Perjalanan &amp; perhotelan",
      "Hubungi tim sales",
    ]) {
      expect(header).toContain(translated);
    }
    for (const source of [
      "Know which ads and creators bring revenue.",
      "Is this still in stock?",
      "Office supply",
      "Send care tips on WhatsApp",
      "Healthcare",
      "Travel &amp; Hospitality",
      "Talk to sales",
    ]) {
      expect(header).not.toContain(source);
    }
  });

  it.each([
    ["id", "Sumber prospek", "Pelanggan baru"],
    ["cn", "潜在客户来源", "新客户"],
    ["jp", "リードの流入元", "新規顧客"],
    ["kr", "리드 유입 경로", "신규 고객"],
  ] as const)(
    "localizes the homepage proof and hero illustration in %s",
    (locale, leadSources, newCustomer) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      expect(localized).toContain(leadSources);
      expect(localized).toContain(newCustomer);
      expect(localized).not.toContain("Lead sources");
      expect(localized).not.toContain("New customer");
      expect(localized).not.toContain("conversations processed every day");
      expect(localized).not.toContain("Cost per booking, by source");
      expect(localized).not.toContain(
        'aria-label="Illustration of the revenue loop',
      );
      expect(localized).not.toContain('aria-label="Primary"');
      expect(localized).not.toContain('aria-label="Open menu"');
    },
  );

  it.each([
    [
      "id",
      "Setiap alat menjalankan fungsinya, tetapi tidak berbagi konteks pelanggan.",
      "Pemasaran Anda mungkin mendatangkan prospek.",
      "Tim Anda mungkin membalas chat.",
      "CRM Anda mungkin melacak deal.",
      "Kesenjangan",
      "Setiap serah terima menghilangkan konteks",
      "Iklan mana yang mendatangkan mereka? Tidak tercatat",
    ],
    [
      "cn",
      "每个工具都各司其职，却没有共享客户信息。",
      "营销或许能带来潜在客户。",
      "团队或许会回复客户消息。",
      "CRM 或许能追踪商机。",
      "信息断层",
      "每次交接都会丢失上下文",
      "哪则广告带来了客户？未记录",
    ],
    [
      "jp",
      "各ツールは機能していても、顧客情報は共有されていません。",
      "マーケティングでリードを獲得できても、",
      "チームがチャットに返信しても、",
      "CRMで案件を管理できても、",
      "情報の断絶",
      "引き継ぎのたびに情報が失われ",
      "どの広告から来たかは未記録",
    ],
    [
      "kr",
      "각 도구는 제 역할을 하지만 고객 정보는 서로 공유되지 않습니다.",
      "마케팅으로 잠재 고객을 확보해도",
      "팀에서 채팅에 답변하더라도",
      "CRM에서 거래를 관리해도",
      "정보 단절",
      "인계할 때마다 맥락이 사라져",
      "어떤 광고에서 왔는지 기록되지 않았습니다",
    ],
  ] as const)(
    "localizes the revenue-leak cards and interactive mockups in %s",
    (
      locale,
      heading,
      marketing,
      chat,
      crm,
      gapTitle,
      handoffSummary,
      adAttribution,
    ) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      for (const translated of [
        heading,
        marketing,
        chat,
        crm,
        gapTitle,
        handoffSummary,
      ]) {
        expect(localized).toContain(translated);
      }
      expect(localized).toContain(adAttribution);

      for (const source of [
        "Every tool does its job. None of them share the customer.",
        "Your marketing may generate leads.",
        "Your team may answer chats.",
        "Your CRM may track deals.",
        "The gap",
        "Which ad brought them? Not recorded",
        "Chats spread across team phones",
        "Attribution overview · last 7 days",
        "from Instagram ad",
        "source?",
        "history?",
        "Every handoff drops context, so each team starts from zero.",
        "See how Cekat connects them",
      ]) {
        expect(localized).not.toContain(source);
      }
    },
  );

  it.each([
    [
      "id",
      "Pahami pemasaran yang benar-benar menghasilkan pendapatan",
      "Hubungkan aktivitas iklan dengan data pelanggan, konversi, dan pendapatan",
      "Perjalanan pengunjung",
    ],
    [
      "cn",
      "了解哪些营销真正带来收入",
      "将广告活动与后续客户、转化和收入数据关联起来",
      "访客旅程",
    ],
    [
      "jp",
      "実際に収益を生み出すマーケティングを把握",
      "広告活動をクリック数やリード数だけでなく、その後の顧客・コンバージョン・売上データにつなげます",
      "訪問者の行動",
    ],
    [
      "kr",
      "실제로 매출을 만드는 마케팅을 파악하세요",
      "광고 활동을 클릭이나 잠재 고객 수에 그치지 않고 이후의 고객, 전환, 매출 데이터와 연결하세요",
      "방문자 여정",
    ],
  ] as const)(
    "localizes the customer-journey panel in %s",
    (locale, heading, description, visitorJourney) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      expect(localized).toContain(heading);
      expect(localized).toContain(description);
      expect(localized).toContain(visitorJourney);
      expect(localized).not.toContain(
        "Connect advertising activity with downstream customer",
      );
      expect(localized).not.toContain("Track customer behavior and conversion");
      expect(localized).not.toContain("Visitor journey");
      expect(localized).not.toContain("With Cekat, your team can:");
    },
  );

  it.each(["id", "cn", "jp", "kr"] as const)(
    "localizes every journey panel and preserves product names in %s",
    (locale) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      for (const source of [
        "Keep every customer conversation fast, connected, and actionable",
        "Manage customer conversations across connected channels",
        "Keep every opportunity visible until the next action",
        "Stay relevant beyond the first conversion",
        "See what moves customers, and what slows revenue down",
        "Identify pipeline and customer journey leakage",
        "Follow each campaign from click to chat to paid order",
        "Unified inbox",
        "Quantity:",
        "Automation rules",
        "is probably running low. Reorder today",
      ]) {
        expect(localized).not.toContain(source);
      }

      for (const productName of [
        "Cekat Marketing",
        "Cekat Chat",
        "Cekat CRM",
        "Cekat Broadcasts",
        "Cekat Automation",
        "Cekat Analytics",
      ]) {
        expect(localized).toContain(productName);
      }
    },
  );

  it.each([
    [
      "id",
      "Clara membantu menyiapkan semuanya. Anda bisa fokus pada bisnis.",
      "Bagikan tautan situs web Anda",
      "Hari pertama",
      "Melatih agen AI Anda",
      "Profil bisnis",
      "Tips dari Clara",
      "Mulai uji coba gratis",
      "Ingin menggunakan agen AI sendiri?",
      "Hubungkan ke Cekat melalui MCP server kami",
      "Klien MCP apa pun",
      'aria-label="Ilustrasi: Claude',
    ],
    [
      "cn",
      "Clara 负责完成设置，您专注于自己的业务。",
      "分享您的网站链接",
      "第 1 天",
      "训练您的 AI 助手",
      "企业资料",
      "Clara 提示",
      "开始免费试用",
      "想使用自己的 AI 助手吗？",
      "通过我们的 MCP 服务器将其连接到 Cekat",
      "任意 MCP 客户端",
      'aria-label="插图：Claude',
    ],
    [
      "jp",
      "Claraが設定を担当。あなたはビジネスに集中できます。",
      "Webサイトのリンクを共有すると",
      "初日",
      "AIエージェントをトレーニング中",
      "ビジネスプロフィール",
      "Claraからのヒント",
      "無料トライアルを始める",
      "自分のAIエージェントを使いたいですか？",
      "MCPサーバーでCekatに接続",
      "任意のMCPクライアント",
      'aria-label="イラスト：Claude',
    ],
    [
      "kr",
      "Clara가 설정을 맡아드립니다. 여러분은 비즈니스에 집중하세요.",
      "웹사이트 링크를 공유하면",
      "첫째 날",
      "AI 에이전트를 학습시키는 중",
      "비즈니스 프로필",
      "Clara의 팁",
      "무료 체험 시작",
      "자체 AI 에이전트를 사용하고 싶으신가요?",
      "Cekat MCP 서버에 연결하세요",
      "모든 MCP 클라이언트",
      'aria-label="일러스트: Claude',
    ],
  ] as const)(
    "localizes Clara onboarding copy, illustration, and CTA in %s",
    (
      locale,
      headline,
      body,
      firstStep,
      illustrationLabel,
      setupLabel,
      tipLabel,
      cta,
      mcpKicker,
      mcpHeading,
      mcpClient,
      mcpAriaLabel,
    ) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      for (const translated of [
        "Clara",
        headline,
        body,
        firstStep,
        illustrationLabel,
        setupLabel,
        tipLabel,
        cta,
        mcpKicker,
        mcpHeading,
        mcpClient,
        mcpAriaLabel,
      ]) {
        expect(localized).toContain(translated);
      }

      for (const source of [
        "Clara handles the setup. You focus on your business.",
        "Share your website link and Clara sets up your AI agent",
        "Day 1",
        "Training your AI agent",
        "Business profile",
        "Connect WhatsApp Business",
        "18 chats waited over an hour last night.",
        "Illustrative example",
        "Prefer your own AI agent?",
        "Connect it to Cekat with our MCP server",
        "Your chats, CRM, campaigns and reports are right there.",
        "Any MCP client",
      ]) {
        expect(localized).not.toContain(source);
      }
      expect(localized).toContain(mcpAriaLabel);
      expect(localized).not.toContain(
        'aria-label="Illustration: Claude, ChatGPT, Gemini and other AI assistants',
      );
    },
  );

  it("localizes Korean hero, industry, customer story, and integration copy", () => {
    const localized = localizeRevampHomeMarkup(revampHomeMarkup, "kr");
    const section = (className: string) =>
      localized.match(
        new RegExp(`<section class="${className}"[\\s\\S]*?<\\/section>`),
      )?.[0] ?? "";
    const industries = section("industries");
    const stories = section("stories");
    const integrations = section("integrations");

    expect(localized).toContain(
      "마케팅, 고객 대화, CRM, 자동화와 성과 데이터를 하나의 연결된 매출 생태계로 통합하세요.",
    );
    for (const translated of [
      "고객 여정은 산업마다 다릅니다.",
      "환자와의 모든 대화가 자연스럽게 이어지도록 하세요.",
      "구매 전후의 모든 고객 대화를 하나로 연결하세요.",
      "복잡한 고객 여정을 체계적으로 관리하고 추적하세요.",
      "문의하기",
      "헬스케어 관련 문의",
      "업무 방식에 대해 문의하기",
      "Cekat은 뷰티·웰니스, 이커머스, 비영리 단체에서도 활용되고 있습니다.",
    ]) {
      expect(industries).toContain(translated);
    }
    expect(industries).not.toContain("Make every patient conversation");
    expect(industries).not.toContain("Talk to us");
    expect(industries).not.toContain("Customer journeys look different");
    expect(industries).toContain('data-industry="Healthcare"');
    expect(industries).toContain('data-industry="Retail &amp; F&amp;B"');

    for (const translated of [
      "연결된 고객 여정은 무엇을 바꿀까요?",
      "Lumina Clinic은 구매 의사가 높은 환자를 고객 여정 전반에서 놓치지 않습니다",
      "적격 잠재 고객 비율",
      "첫 응답 시간",
      "고객 만족도",
      "레이아웃 검토용 임시 브랜드, 데이터 및 사진으로 구성된 사례입니다.",
    ]) {
      expect(stories).toContain(translated);
    }
    expect(stories).not.toContain("What changes when the journey is connected");
    expect(stories).not.toContain("Lumina Clinic keeps high-intent patients");
    expect(stories).not.toContain("Qualified lead rate");
    expect(stories).not.toContain("Show Lumina Clinic");
    expect(stories).not.toContain("Sample stories with placeholder brands");

    for (const translated of [
      "이미 사용하는 도구와 Cekat을 연결하세요",
      "팀에서 매일 사용하는 앱은 물론, 채널, 광고 플랫폼, 스토어와 결제 수단까지 연결하세요.",
      "연동에 대해 문의하기",
      "일부 연동은 Cekat Automation을 통해 제공됩니다.",
    ]) {
      expect(integrations).toContain(translated);
    }
    expect(integrations).not.toContain("Your channels, ad platforms");
    expect(integrations).not.toContain("Ask about an integration");
    expect(integrations).not.toContain("Some integrations run through");
  });

  it.each([
    [
      "id",
      "Perjalanan pelanggan berbeda di setiap industri.",
      "Arahkan setiap pertanyaan ke langkah berikutnya.",
      "Perubahan saat perjalanan pelanggan saling terhubung",
      "Hubungkan kanal, platform iklan, toko, pembayaran",
      "Tanyakan tentang integrasi",
      "Terbaru dari Cekat",
      "Satukan pemasaran, percakapan, data pelanggan",
    ],
    [
      "cn",
      "每个行业的客户旅程都不一样。",
      "让每一条咨询都顺利进入下一步。",
      "客户旅程连贯后，会带来什么改变？",
      "连接您的沟通渠道、广告平台、商店和支付方式",
      "咨询集成方案",
      "Cekat 最新动态",
      "将营销、客户对话、客户数据、销售流程和业绩分析整合",
    ],
    [
      "jp",
      "顧客の体験は業界ごとに異なります。",
      "すべての問い合わせを、次のアクションにつなげます。",
      "顧客体験がつながると、何が変わるのか",
      "チャネル、広告プラットフォーム、ストア、決済手段",
      "連携について相談する",
      "Cekatの最新情報",
      "マーケティング、顧客対応、顧客データ、営業ワークフロー",
    ],
    [
      "kr",
      "고객 여정은 산업마다 다릅니다.",
      "모든 문의가 다음 단계로 이어지도록 하세요.",
      "연결된 고객 여정은 무엇을 바꿀까요?",
      "채널, 광고 플랫폼, 스토어와 결제 수단",
      "연동에 대해 문의하기",
      "Cekat의 최신 소식",
      "마케팅, 고객 대화, 고객 데이터, 영업 워크플로",
    ],
  ] as const)(
    "localizes every remaining homepage section in %s",
    (
      locale,
      industryIntro,
      industryCard,
      storyHeading,
      integrationsIntro,
      integrationsCta,
      releasesHeading,
      finalCtaBody,
    ) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      for (const translated of [
        industryIntro,
        industryCard,
        storyHeading,
        integrationsIntro,
        integrationsCta,
        releasesHeading,
        finalCtaBody,
      ]) {
        expect(localized).toContain(translated);
      }

      for (const source of [
        "Customer journeys look different across industries.",
        "Make every patient conversation easier to continue.",
        "What changes when the journey is connected",
        "Your channels, ad platforms, store and payments",
        "Latest from Cekat",
        "Bring your marketing, conversations, customer data",
      ]) {
        expect(localized).not.toContain(source);
      }
    },
  );

  it.each([
    [
      "id",
      "Ceritakan sedikit tentang bisnis Anda.",
      "Mulai uji coba gratis 14 hari",
      "Nama lengkap",
      "Email kerja",
      "Kirim ke tim sales",
      "Permintaan diterima",
      "Formulir ini masih berupa prototipe",
      "tanpa kartu kredit.",
    ],
    [
      "cn",
      "请简单介绍一下您的业务。",
      "开始 14 天免费试用",
      "姓名",
      "工作邮箱",
      "发送给销售团队",
      "已收到您的申请",
      "此表单目前为原型",
      "无需信用卡。",
    ],
    [
      "jp",
      "ビジネスについて簡単にお聞かせください。",
      "14日間の無料トライアルを始める",
      "氏名",
      "勤務先メールアドレス",
      "営業チームに送信",
      "お問い合わせを受け付けました",
      "このフォームは試作版のため",
      "クレジットカードは不要です。",
    ],
    [
      "kr",
      "비즈니스에 대해 간단히 알려주세요.",
      "14일 무료 체험 시작",
      "이름",
      "업무용 이메일",
      "영업팀에 보내기",
      "요청이 접수되었습니다",
      "이 양식은 프로토타입이며",
      "카드 정보가 필요하지 않습니다.",
    ],
  ] as const)(
    "localizes the homepage sales dialog in %s",
    (locale, ...copy) => {
      const localized = localizeRevampHomeMarkup(revampHomeMarkup, locale);

      for (const translated of copy) {
        expect(localized).toContain(translated);
      }

      for (const source of [
        "Tell us a little about your business.",
        "Start a 14-day free trial",
        "Full name",
        "Work email",
        "Send to sales",
        "Request received",
        "Prototype: this form is not connected",
        "no credit card required.",
      ]) {
        expect(localized).not.toContain(source);
      }
    },
  );
});
