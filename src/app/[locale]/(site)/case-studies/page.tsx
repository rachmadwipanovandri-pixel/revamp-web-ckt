import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonld";
import {
  CASE_STUDIES,
  CASE_STUDY_INDUSTRIES,
  filterCaseStudies,
  getCaseStudyIndustry,
  localizeCaseStudy,
} from "@/lib/case-studies";
import { metaSnippet, metaTitle, alternates, SITE_URL } from "@/lib/seo";

const COPY = {
  en: {
    eyebrow: "Customer case studies",
    title: "Real businesses, real results with Cekat.AI",
    lead: "See how teams across industries use Cekat.AI to respond faster, convert more, and run leaner operations.",
    businesses: "businesses running on Cekat.AI",
    response: "faster response time",
    conversion: "average conversion lift",
    conversations: "conversations automated daily",
    trust: "Trusted by 3,000+ businesses across Asia",
    tokens: "tokens processed daily",
    chatBubbles: "chat bubbles processed daily",
    filterLabel: "Filter by industry",
    allIndustries: "All industries",
    caseStudies: "case studies",
    readCase: "Read case study",
    noResults: "No case studies match this industry.",
    breadcrumb: "Case Studies",
  },
  id: {
    eyebrow: "Studi kasus pelanggan",
    title: "Bisnis nyata, hasil nyata bersama Cekat.AI",
    lead: "Lihat bagaimana tim lintas industri menggunakan Cekat.AI untuk merespons lebih cepat, meningkatkan konversi, dan menjalankan operasional dengan lebih efisien.",
    businesses: "bisnis menggunakan Cekat.AI",
    response: "respons lebih cepat",
    conversion: "rata-rata peningkatan konversi",
    conversations: "percakapan terotomatisasi per hari",
    trust: "Dipercaya oleh 3.000+ bisnis di Asia",
    tokens: "token diproses setiap hari",
    chatBubbles: "pesan chat diproses setiap hari",
    filterLabel: "Filter berdasarkan industri",
    allIndustries: "Semua industri",
    caseStudies: "studi kasus",
    readCase: "Baca studi kasus",
    noResults: "Belum ada studi kasus untuk industri ini.",
    breadcrumb: "Studi Kasus",
  },
  jp: {
    eyebrow: "導入事例",
    title: "Cekat.AIと歩む、企業の成長ストーリー",
    lead: "さまざまな業界のチームがCekat.AIを活用し、迅速な顧客対応、コンバージョンの向上、効率的な業務運営を実現した事例をご紹介します。",
    businesses: "社がCekat.AIを利用",
    response: "応答時間を短縮",
    conversion: "平均コンバージョン向上率",
    conversations: "1日に自動化される会話数",
    trust: "アジアの3,000社以上に選ばれています",
    tokens: "1日に処理されるトークン数",
    chatBubbles: "1日に処理されるチャット数",
    filterLabel: "業界で絞り込む",
    allIndustries: "すべての業界",
    caseStudies: "件の導入事例",
    readCase: "事例を読む",
    noResults: "この業界の導入事例はまだありません。",
    breadcrumb: "導入事例",
  },
  kr: {
    eyebrow: "고객 사례",
    title: "Cekat.AI와 함께 만든 실제 고객 성과",
    lead: "다양한 업계의 팀이 Cekat.AI로 더 빠르게 응대하고 전환을 높이며 운영을 효율화한 사례를 확인해 보세요.",
    businesses: "Cekat.AI를 사용하는 기업",
    response: "더 빠른 응답",
    conversion: "평균 전환율 개선",
    conversations: "하루 자동화된 대화",
    trust: "아시아 3,000개 이상의 기업이 신뢰합니다",
    tokens: "매일 처리되는 토큰",
    chatBubbles: "매일 처리되는 채팅 메시지",
    filterLabel: "업종별 필터",
    allIndustries: "전체 업종",
    caseStudies: "개 고객 사례",
    readCase: "사례 보기",
    noResults: "해당 업종의 고객 사례가 없습니다.",
    breadcrumb: "고객 사례",
  },
  cn: {
    eyebrow: "客户案例",
    title: "真实团队，真实成效：Cekat.AI 客户案例",
    lead: "了解不同行业的团队如何借助 Cekat.AI 更快响应客户、提升转化，并提高运营效率。",
    businesses: "家企业正在使用 Cekat.AI",
    response: "响应速度提升",
    conversion: "平均转化率提升",
    conversations: "每日自动化处理的对话",
    trust: "服务亚洲 3,000 多家企业",
    tokens: "每日处理的 token 数",
    chatBubbles: "每日处理的聊天消息",
    filterLabel: "按行业筛选",
    allIndustries: "全部行业",
    caseStudies: "个客户案例",
    readCase: "查看案例",
    noResults: "暂无符合该行业的客户案例。",
    breadcrumb: "客户案例",
  },
} as const;

const INDUSTRY_LABELS_ID: Record<string, string> = {
  Healthcare: "Kesehatan",
  "Food & Beverage": "Makanan & Minuman",
  Education: "Pendidikan",
  "Professional Services": "Layanan Profesional",
  Property: "Properti",
  Government: "Pemerintahan",
};

const INDUSTRY_LABELS_JP: Record<string, string> = {
  Healthcare: "ヘルスケア",
  "Food & Beverage": "飲食・ホスピタリティ",
  Education: "教育",
  "Professional Services": "専門サービス",
  Property: "不動産",
  Government: "政府・公共サービス",
};

const INDUSTRY_LABELS_KR: Record<string, string> = {
  Healthcare: "헬스케어",
  "Food & Beverage": "식음료·엔터테인먼트",
  Education: "교육",
  "Professional Services": "전문 서비스",
  Property: "부동산",
  Government: "정부·공공 서비스",
};

const INDUSTRY_LABELS_CN: Record<string, string> = {
  Healthcare: "医疗健康",
  "Food & Beverage": "餐饮与娱乐",
  Education: "教育",
  "Professional Services": "专业服务",
  Property: "房地产",
  Government: "政府与公共服务",
};

function copyFor(locale: string) {
  if (locale === "id") return COPY.id;
  if (locale === "jp") return COPY.jp;
  if (locale === "kr") return COPY.kr;
  if (locale === "cn") return COPY.cn;
  return COPY.en;
}

function industryLabel(locale: string, label: string) {
  if (locale === "id") return INDUSTRY_LABELS_ID[label] ?? label;
  if (locale === "jp") return INDUSTRY_LABELS_JP[label] ?? label;
  if (locale === "kr") return INDUSTRY_LABELS_KR[label] ?? label;
  if (locale === "cn") return INDUSTRY_LABELS_CN[label] ?? label;
  return label;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const copy = copyFor(locale);
  const title = metaTitle(`${copy.breadcrumb} — Cekat.AI`);
  const description = metaSnippet(copy.lead, 158);
  const { canonical, languages } = alternates(locale, "/case-studies");

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale:
        locale === "id"
          ? "id_ID"
          : locale === "jp"
            ? "ja_JP"
            : locale === "kr"
              ? "ko_KR"
              : locale === "cn"
                ? "zh_CN"
                : "en_US",
      type: "website",
      images: [
        { url: "/graph-image.jpg", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/graph-image.jpg"],
    },
  };
}

export default async function CaseStudiesIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ locale: rawLocale }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const [tb] = await Promise.all([
    getTranslations({ locale, namespace: "breadcrumb" }),
  ]);
  const copy = copyFor(locale);
  const queryCategory =
    typeof query.category === "string" ? query.category : undefined;
  const activeCategory = getCaseStudyIndustry(queryCategory);
  const studies = filterCaseStudies(queryCategory).map((study) =>
    localizeCaseStudy(study, locale),
  );
  const listPath = getPathname({ href: "/case-studies", locale });
  const url = `${SITE_URL}${listPath}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const categoryLabel = (label: string) => industryLabel(locale, label);
  const filters = [
    { slug: undefined, label: copy.allIndustries },
    ...CASE_STUDY_INDUSTRIES.map((industry) => ({
      slug: industry.slug,
      label: categoryLabel(industry.label),
    })),
  ];

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            url,
            name: `${copy.breadcrumb} — Cekat.AI`,
            description: copy.lead,
            items: CASE_STUDIES.map((study) => ({
              name: study.company,
              url: `${SITE_URL}${getPathname({
                href: {
                  pathname: "/case-studies/[slug]",
                  params: { slug: study.slug },
                },
                locale,
              })}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: copy.breadcrumb },
          ]),
        ]}
      />

      <PageHero
        tone="case-studies"
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.lead}
        align="left"
        className="editorial-index"
      >
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { value: "500+", label: copy.businesses },
            { value: "3×", label: copy.response },
            { value: "40%", label: copy.conversion },
            { value: "10,000+", label: copy.conversations },
          ].map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-[#dce6f5] bg-white/90 px-4 py-4 shadow-[0_1px_2px_rgba(9,33,76,0.04)] sm:px-5"
            >
              <p className="font-numeric text-2xl font-semibold tracking-[-0.04em] text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-[#505f73] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="border-b border-[#e5e9ef] bg-white py-6 md:py-7">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3 sm:items-center">
            <p className="text-base font-semibold tracking-[-0.02em] text-[#09214c]">
              {copy.trust}
            </p>
            <p className="text-sm leading-snug text-[#505f73] sm:border-l sm:border-[#e5e9ef] sm:pl-5">
              <span className="block font-numeric text-lg font-semibold text-primary">
                10,000,000,000+
              </span>
              {copy.tokens}
            </p>
            <p className="text-sm leading-snug text-[#505f73] sm:border-l sm:border-[#e5e9ef] sm:pl-5">
              <span className="block font-numeric text-lg font-semibold text-primary">
                2,000,000+
              </span>
              {copy.chatBubbles}
            </p>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#f9fafb] py-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <div className="flex flex-col gap-5 border-b border-[#e5e9ef] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {copy.filterLabel}
              </p>
              <nav
                aria-label={copy.filterLabel}
                className="flex flex-wrap gap-2"
              >
                {filters.map((filter) => {
                  const selected = filter.slug === activeCategory;
                  const href = filter.slug
                    ? `${listPath}?category=${encodeURIComponent(filter.slug)}`
                    : listPath;

                  return (
                    <a
                      key={filter.slug ?? "all"}
                      href={href}
                      aria-current={selected ? "page" : undefined}
                      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-[#ccdaf1] bg-white text-[#0a3173] hover:border-primary/50 hover:bg-[#f3f6fd]"
                      }`}
                    >
                      {filter.label}
                    </a>
                  );
                })}
              </nav>
            </div>
            <p
              className="font-numeric text-sm font-medium text-[#505f73]"
              aria-live="polite"
            >
              <span className="text-[#09214c]">{studies.length}</span>{" "}
              {copy.caseStudies}
            </p>
          </div>

          {studies.length ? (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, index) => (
                <Reveal key={study.slug} delay={index * 45}>
                  <Link
                    href={{
                      pathname: "/case-studies/[slug]",
                      params: { slug: study.slug },
                    }}
                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e5e9ef] bg-white shadow-[0_1px_2px_rgba(9,33,76,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9eb8e5] hover:shadow-[0_18px_40px_-22px_rgba(9,33,76,0.27)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#eaf0fa]">
                      <Image
                        src={study.image}
                        alt={`${study.company} — ${industryLabel(locale, study.industry)}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                      <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0a3173] shadow-sm">
                        {categoryLabel(study.industry)}
                      </span>
                      <span className="absolute bottom-4 left-4 flex h-11 min-w-14 items-center justify-center rounded-xl border border-white/80 bg-white px-3 shadow-sm">
                        <Image
                          src={study.logo}
                          alt={study.logoAlt}
                          width={120}
                          height={36}
                          className="max-h-7 w-auto object-contain"
                        />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {study.useCases.map((useCase) => (
                          <span
                            key={useCase}
                            className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#505f73]"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl leading-snug font-semibold tracking-[-0.03em] text-[#09214c]">
                        {study.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#505f73]">
                        {study.summary}
                      </p>
                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#e5e9ef] pt-5">
                        <div>
                          <p className="font-numeric text-3xl leading-none font-semibold tracking-[-0.05em] text-primary">
                            {study.featuredOutcome}
                          </p>
                          <p className="mt-2 max-w-[18rem] text-xs leading-snug text-[#505f73]">
                            {study.outcomes[0]?.label}
                          </p>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                          {copy.readCase} <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-[#505f73]">{copy.noResults}</p>
          )}
        </Container>
      </section>
    </>
  );
}
