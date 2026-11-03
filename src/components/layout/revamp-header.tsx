"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { getPathname, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { revampHeaderMarkup } from "./revamp-header-markup";
import { localizeIndustryNav } from "@/lib/localize-industry-nav";
import { switchLocaleHref } from "@/lib/locale-switch";

const HEADER_COPY: Record<string, Record<string, string>> = {
  id: {
    Blog: "Blog",
    Products: "Produk",
    Marketing: "Pemasaran",
    Chat: "Chat",
    CRM: "CRM",
    Broadcasts: "Broadcast",
    Automation: "Otomatisasi",
    Analytics: "Analitik",
    Solutions: "Solusi",
    Resources: "Sumber daya",
    Integrations: "Integrasi",
    Pricing: "Harga",
    "Log in": "Masuk",
    "Talk to sales": "Hubungi tim sales",
    "Start free trial": "Mulai uji coba gratis",
    "Know which ads and creators bring revenue.":
      "Ketahui iklan dan kreator yang menghasilkan pendapatan.",
    "Every channel in one inbox, answered by AI.":
      "Semua kanal dalam satu kotak masuk, dijawab oleh AI.",
    "Pipelines that keep every deal moving.":
      "Pipeline yang menjaga setiap peluang tetap berjalan.",
    "Personal messages to the right segment.":
      "Pesan personal untuk segmen yang tepat.",
    "Follow-ups and workflows that run themselves.":
      "Tindak lanjut dan alur kerja yang berjalan otomatis.",
    "See what moves customers, end to end.":
      "Pahami seluruh hal yang mendorong pelanggan bertindak.",
    "Leads by source": "Prospek berdasarkan sumber",
    "Meta ads": "Iklan Meta",
    "Creator links": "Tautan kreator",
    "TikTok ads": "Iklan TikTok",
    Website: "Situs web",
    "Is this still in stock?": "Apakah ini masih tersedia?",
    "Yes! Which size do you need?": "Ada! Anda perlu ukuran berapa?",
    "M, two please": "Ukuran M, dua ya",
    "Done. Shall I send the payment link?":
      "Selesai. Mau saya kirim tautan pembayarannya?",
    Pipeline: "Pipeline",
    New: "Baru",
    "Cafe chain": "Jaringan kafe",
    "Office supply": "Perlengkapan kantor",
    Qualified: "Terkualifikasi",
    "Clinic group": "Grup klinik",
    Won: "Berhasil",
    "Retail restock": "Stok ulang ritel",
    "Broadcast · Serum buyers": "Broadcast · Pembeli serum",
    "Hi Rina, your 3-in-1 serum set is back in stock. Reorder today for free shipping.":
      "Hai Rina, set serum 3-in-1 Anda tersedia kembali. Pesan ulang hari ini untuk mendapat gratis ongkir.",
    "Sent 2,140": "Dikirim 2.140",
    "Opened 68%": "Dibuka 68%",
    "Replied 31%": "Membalas 31%",
    "When an order is paid": "Saat pesanan dibayar",
    "Wait 3 days": "Tunggu 3 hari",
    "Send care tips on WhatsApp": "Kirim tips perawatan via WhatsApp",
    "Add label: Repeat buyer": "Tambahkan label: Pembeli berulang",
    "Remind in 30 days": "Ingatkan dalam 30 hari",
    "This month": "Bulan ini",
    Leads: "Prospek",
    Proposal: "Proposal",
    "Clara, your AI setup agent": "Clara, agen penyiapan AI Anda",
    "By industry": "Berdasarkan industri",
    "Customer stories": "Kisah pelanggan",
    "What's new": "Info terbaru",
    "Help center": "Pusat bantuan",
    Changelog: "Catatan perubahan",
    Healthcare: "Kesehatan",
    "Retail & F&B": "Ritel & F&B",
    "Retail &amp; F&amp;B": "Ritel &amp; F&amp;B",
    "Financial Services": "Layanan keuangan",
    Automotive: "Otomotif",
    Logistics: "Logistik",
    "Travel & Hospitality": "Perjalanan & perhotelan",
    "Travel &amp; Hospitality": "Perjalanan &amp; perhotelan",
    Education: "Pendidikan",
    Property: "Properti",
    "Explore all industries": "Lihat semua industri",
    "Every call summarized by AI, key points and next steps, automatically.":
      "Setiap panggilan diringkas otomatis oleh AI, lengkap dengan poin penting dan langkah berikutnya.",
    "Trusted by 3,000+ businesses in Indonesia":
      "Dipercaya oleh 3.000+ bisnis di Indonesia",
    "Cekat.AI home": "Beranda Cekat.AI",
    Primary: "Navigasi utama",
    "Open menu": "Buka menu",
    "Choose language": "Pilih bahasa",
  },
  cn: {
    Blog: "博客",
    Products: "产品",
    Marketing: "营销",
    Chat: "聊天",
    Broadcasts: "广播",
    Automation: "自动化",
    Analytics: "分析",
    Solutions: "解决方案",
    Resources: "资源",
    Integrations: "集成",
    Pricing: "定价",
    "Log in": "登录",
    "Talk to sales": "联系销售",
    "Start free trial": "开始免费试用",
    "Know which ads and creators bring revenue.":
      "了解哪些广告和创作者带来收入。",
    "Every channel in one inbox, answered by AI.":
      "所有渠道汇入一个由 AI 回复的收件箱。",
    "Pipelines that keep every deal moving.": "让每笔交易持续推进的销售管道。",
    "Personal messages to the right segment.": "向合适客群发送个性化消息。",
    "Follow-ups and workflows that run themselves.": "自动运行的跟进和工作流。",
    "See what moves customers, end to end.": "端到端看清什么推动客户。",
    "Customer stories": "客户案例",
    "What's new": "最新动态",
    "Help center": "帮助中心",
    Changelog: "更新日志",
    Healthcare: "医疗健康",
    "Retail & F&B": "零售与餐饮",
    "Financial Services": "金融服务",
    Automotive: "汽车行业",
    Logistics: "物流",
    "Travel & Hospitality": "旅游与酒店",
    Education: "教育",
    Property: "房地产",
    "Explore all industries": "查看所有行业",
    "Every call summarized by AI, key points and next steps, automatically.":
      "AI 自动总结每通电话，提炼重点并列出后续步骤。",
    "Trusted by 3,000+ businesses in Indonesia": "受到印尼 3,000 多家企业信赖",
    "Cekat.AI home": "Cekat.AI 首页",
    Primary: "主导航",
    "Open menu": "打开菜单",
    "Choose language": "选择语言",
  },
  jp: {
    Blog: "ブログ",
    Products: "プロダクト",
    Marketing: "マーケティング",
    Chat: "チャット",
    Broadcasts: "配信",
    Automation: "自動化",
    Analytics: "分析",
    Solutions: "ソリューション",
    Resources: "リソース",
    Integrations: "連携",
    Pricing: "料金",
    "Log in": "ログイン",
    "Talk to sales": "営業に相談",
    "Start free trial": "無料トライアルを始める",
    "Know which ads and creators bring revenue.":
      "収益を生む広告やクリエイターを把握。",
    "Every channel in one inbox, answered by AI.":
      "すべてのチャネルをAIが回答する1つの受信トレイへ。",
    "Pipelines that keep every deal moving.":
      "商談を前に進め続けるパイプライン。",
    "Personal messages to the right segment.":
      "適切なセグメントへパーソナルなメッセージ。",
    "Follow-ups and workflows that run themselves.":
      "自動で動くフォローアップとワークフロー。",
    "See what moves customers, end to end.":
      "顧客を動かす要因を端から端まで可視化。",
    "Customer stories": "導入事例",
    "What's new": "最新情報",
    "Help center": "ヘルプセンター",
    Changelog: "変更履歴",
    Healthcare: "ヘルスケア",
    "Retail & F&B": "小売・飲食",
    "Financial Services": "金融サービス",
    Automotive: "自動車",
    Logistics: "物流",
    "Travel & Hospitality": "旅行・ホスピタリティ",
    Education: "教育",
    Property: "不動産",
    "Explore all industries": "業界一覧を見る",
    "Every call summarized by AI, key points and next steps, automatically.":
      "すべての通話をAIが自動要約し、要点と次のアクションを整理します。",
    "Trusted by 3,000+ businesses in Indonesia":
      "インドネシアの3,000社以上に選ばれています",
    "Cekat.AI home": "Cekat.AI ホーム",
    Primary: "メインナビゲーション",
    "Open menu": "メニューを開く",
    "Choose language": "言語を選択",
  },
  kr: {
    Blog: "블로그",
    Products: "제품",
    Marketing: "마케팅",
    Chat: "채팅",
    Broadcasts: "브로드캐스트",
    Automation: "자동화",
    Analytics: "분석",
    Solutions: "솔루션",
    Resources: "리소스",
    Integrations: "연동",
    Pricing: "요금제",
    "Log in": "로그인",
    "Talk to sales": "영업팀 문의",
    "Start free trial": "무료 체험 시작",
    "Know which ads and creators bring revenue.":
      "수익을 만드는 광고와 크리에이터를 확인하세요.",
    "Every channel in one inbox, answered by AI.":
      "모든 채널을 AI가 답변하는 하나의 받은 편지함으로.",
    "Pipelines that keep every deal moving.":
      "모든 거래를 계속 움직이는 파이프라인.",
    "Personal messages to the right segment.": "적절한 세그먼트에 맞춤 메시지.",
    "Follow-ups and workflows that run themselves.":
      "스스로 실행되는 후속 조치와 워크플로.",
    "See what moves customers, end to end.":
      "고객을 움직이는 요소를 처음부터 끝까지 확인하세요.",
    "Customer stories": "고객 사례",
    "What's new": "새로운 소식",
    "Help center": "도움말 센터",
    Changelog: "변경 사항",
    Healthcare: "헬스케어",
    "Retail & F&B": "리테일 및 F&B",
    "Financial Services": "금융 서비스",
    Automotive: "자동차",
    Logistics: "물류",
    "Travel & Hospitality": "여행 및 호스피탈리티",
    Education: "교육",
    Property: "부동산",
    "Explore all industries": "모든 산업 보기",
    "Every call summarized by AI, key points and next steps, automatically.":
      "모든 통화를 AI가 자동으로 요약하고 핵심 내용과 다음 단계를 정리합니다.",
    "Trusted by 3,000+ businesses in Indonesia":
      "인도네시아 3,000개 이상의 기업이 신뢰합니다",
    "Cekat.AI home": "Cekat.AI 홈",
    Primary: "주요 탐색 메뉴",
    "Open menu": "메뉴 열기",
    "Choose language": "언어 선택",
  },
};

const ID_PATHS: Record<string, string> = {
  "/blog": "/blog",
  "/pricing": "/harga",
  "/features": "/fitur",
  "/industries": "/industri",
  "/integrations": "/integrasi",
  "/solutions": "/solusi",
  "/stories": "/cerita",
  "/contact-sales": "/contact-us",
};

const MENU_LABELS: Partial<Record<Locale, { open: string; close: string }>> = {
  id: { open: "Buka menu", close: "Tutup menu" },
  cn: { open: "打开菜单", close: "关闭菜单" },
  jp: { open: "メニューを開く", close: "メニューを閉じる" },
  kr: { open: "메뉴 열기", close: "메뉴 닫기" },
};

export function localizeRevampHeaderMarkup(markup: string, locale: Locale) {
  const local = (path: string) => {
    const localizedPath = locale === "id" ? (ID_PATHS[path] ?? path) : path;
    const pathname =
      localizedPath === "/contact-sales" ? "/contact-us" : localizedPath;
    return locale === "id"
      ? pathname
      : `/${locale}${pathname === "/" ? "" : pathname}`;
  };
  let next = markup.replace(
    '<li class="mnav__item"><a class="mnav__link" href="/pricing">Pricing</a></li>',
    `<li class="mnav__item"><a class="mnav__link" href="${local("/blog")}">Blog</a></li><li class="mnav__item"><a class="mnav__link" href="/pricing">Pricing</a></li>`,
  );

  for (const path of [
    "/",
    "/marketing",
    "/chat",
    "/crm",
    "/features",
    "/integrations",
    "/industries",
    "/stories",
    "/pricing",
    "/blog",
    "/contact-sales",
  ]) {
    next = next.replaceAll(`href="${path}"`, `href="${local(path)}"`);
  }
  next = localizeIndustryNav(next, locale);
  const sales = local("/contact-sales");
  next = next
    .replaceAll(
      '<button class="btn btn--ghost" type="button" data-demo>Talk to sales</button>',
      `<a class="btn btn--ghost" href="${sales}">Talk to sales</a>`,
    )
    .replaceAll(
      '<button class="btn btn--soft" type="button" data-demo>Talk to sales</button>',
      `<a class="btn btn--soft" href="${sales}">Talk to sales</a>`,
    );
  const copy = HEADER_COPY[locale];
  if (copy) {
    for (const [from, to] of Object.entries(copy)) {
      next = next.replaceAll(`>${from}<`, `>${to}<`);
      next = next.replaceAll(`>${from} `, `>${to} `);
      next = next.replaceAll(`="${from}"`, `="${to}"`);
    }
  }
  return next;
}

/**
 * The approved revamp navigation is intentionally retained as its original
 * markup and class names. This makes secondary pages use the same navigation
 * system as the migrated homepage instead of a Tailwind approximation.
 */
export function RevampHeader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>() ?? {};

  const markup = useMemo(() => {
    const currentLocale = locale as Locale;
    const languageHref = (targetLocale: Locale) =>
      getPathname({
        href: switchLocaleHref(pathname, slug, currentLocale, targetLocale),
        locale: targetLocale,
      });
    const indonesiaHref = languageHref("id");
    const explicitIndonesiaHref =
      indonesiaHref === "/" ? "/id" : `/id${indonesiaHref}`;

    let next = localizeRevampHeaderMarkup(revampHeaderMarkup, currentLocale);
    const copy = HEADER_COPY[locale];
    const languageMenu = `
      <details class="nav__languages">
        <summary aria-label="${copy?.["Choose language"] ?? "Choose language"}">${locale.toUpperCase()}<svg class="nav__language-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5"></path></svg></summary>
        <div class="nav__language-menu" role="menu">
          <a href="${languageHref("en")}" data-locale="en" role="menuitem">English <small>EN</small></a>
          <a href="${explicitIndonesiaHref}" data-locale="id" role="menuitem">Indonesia <small>ID</small></a>
          <a href="${languageHref("kr")}" data-locale="kr" role="menuitem">한국어 <small>KR</small></a>
          <a href="${languageHref("jp")}" data-locale="jp" role="menuitem">日本語 <small>JP</small></a>
          <a href="${languageHref("cn")}" data-locale="cn" role="menuitem">中文 <small>CN</small></a>
        </div>
      </details>`;
    next = next.replace(
      '<div class="nav__actions">',
      `<div class="nav__actions">${languageMenu}`,
    );
    return next;
  }, [locale, pathname, slug]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nav = root.querySelector<HTMLElement>(".nav");
    const row = root.querySelector<HTMLElement>(".nav__row");
    const toggle = root.querySelector<HTMLButtonElement>(".nav__toggle");
    const links = root.querySelector<HTMLElement>("#nav-links");
    const popover = root.querySelector<HTMLElement>(".mpop-bg");
    const languagePicker = root.querySelector<HTMLElement>(".nav__languages");
    const languageSummary =
      languagePicker?.querySelector<HTMLElement>("summary");
    const languageMenu = root.querySelector<HTMLElement>(".nav__language-menu");
    const triggers = [
      ...root.querySelectorAll<HTMLButtonElement>(".mnav__trigger"),
    ];
    if (!nav || !row || !toggle || !links || !popover) return;

    let openIndex = -1;
    const menuOf = (trigger: HTMLButtonElement) =>
      root.querySelector<HTMLElement>(
        `#${trigger.getAttribute("aria-controls")}`,
      );
    const wide = window.matchMedia("(min-width: 1101px)");

    const closeMenu = () => {
      if (openIndex < 0) return;
      const trigger = triggers[openIndex];
      menuOf(trigger)?.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      popover.classList.remove("is-open");
      openIndex = -1;
    };
    const openMenu = (index: number) => {
      if (index === openIndex) return closeMenu();
      closeMenu();
      const trigger = triggers[index];
      const menu = menuOf(trigger);
      if (!menu) return;
      triggers.forEach((item, itemIndex) =>
        item.setAttribute("aria-expanded", String(itemIndex === index)),
      );
      if (wide.matches) {
        const rowBox = row.getBoundingClientRect();
        const triggerBox = trigger.getBoundingClientRect();
        const left = Math.max(
          0,
          Math.min(
            triggerBox.left - rowBox.left - 10,
            rowBox.width - menu.offsetWidth,
          ),
        );
        Object.assign(popover.style, {
          left: `${left}px`,
          width: `${menu.offsetWidth}px`,
          height: `${menu.offsetHeight}px`,
        });
        menu.style.left = `${left}px`;
        popover.classList.add("is-open");
      }
      menu.classList.add("is-open");
      openIndex = index;
    };
    const onScroll = () =>
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    const onToggle = () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      const labels = MENU_LABELS[locale as Locale];
      toggle.setAttribute(
        "aria-label",
        open ? (labels?.close ?? "Close menu") : (labels?.open ?? "Open menu"),
      );
      links.classList.toggle("is-open", open);
    };
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!row.contains(target)) closeMenu();
      if (languagePicker && !languagePicker.contains(target)) {
        languagePicker.removeAttribute("open");
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        languagePicker?.removeAttribute("open");
        if (links.classList.contains("is-open")) toggle.click();
      }
    };
    const onResize = () => closeMenu();
    const onRowLeave = () => {
      if (wide.matches) closeMenu();
    };
    const onRowFocusOut = (event: FocusEvent) => {
      if (wide.matches && !row.contains(event.relatedTarget as Node | null)) {
        closeMenu();
      }
    };
    const openLanguageOnHover = () => {
      if (languagePicker) languagePicker.setAttribute("open", "");
    };
    const closeLanguageOnLeave = () => {
      // Keep the native details menu open while the pointer moves from the
      // summary into its links; CSS handles the visual hover state.
      if (languagePicker && !languagePicker.matches(":focus-within")) {
        languagePicker.removeAttribute("open");
      }
    };
    const toggleLanguageOnClick = (event: MouseEvent) => {
      // Native <details> toggling is reliable, but explicitly keeping the
      // state here makes click behavior consistent with the hover behavior.
      event.stopPropagation();
      event.preventDefault();
      if (languagePicker?.hasAttribute("open")) {
        languagePicker.removeAttribute("open");
      } else {
        languagePicker?.setAttribute("open", "");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    toggle.addEventListener("click", onToggle);
    row.addEventListener("mouseleave", onRowLeave);
    row.addEventListener("focusout", onRowFocusOut);
    languagePicker?.addEventListener("mouseenter", openLanguageOnHover);
    languageMenu?.addEventListener("mouseenter", openLanguageOnHover);
    languagePicker?.addEventListener("mouseleave", closeLanguageOnLeave);
    languageSummary?.addEventListener("click", toggleLanguageOnClick);
    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => openMenu(index));
      trigger.addEventListener("mouseenter", () => {
        if (wide.matches) openMenu(index);
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      toggle.removeEventListener("click", onToggle);
      row.removeEventListener("mouseleave", onRowLeave);
      row.removeEventListener("focusout", onRowFocusOut);
      languagePicker?.removeEventListener("mouseenter", openLanguageOnHover);
      languageMenu?.removeEventListener("mouseenter", openLanguageOnHover);
      languagePicker?.removeEventListener("mouseleave", closeLanguageOnLeave);
      languageSummary?.removeEventListener("click", toggleLanguageOnClick);
    };
  }, [locale, markup]);

  return (
    <div ref={rootRef} className="revamp-site-header" data-locale={locale}>
      {/* The stylesheet is the canonical visual system supplied with the approved revamp. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/revamp-web-cekat/styles.css" />
      <style>{`.nav{position:sticky!important;top:0!important;z-index:100!important}.nav__language-menu{position:absolute!important;top:calc(100% + 6px)!important;right:0!important;width:170px!important;z-index:2147483000!important}.nav__languages:hover>.nav__language-menu,.nav__languages:focus-within>.nav__language-menu,.nav__languages[open]>.nav__language-menu{display:grid!important}`}</style>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
