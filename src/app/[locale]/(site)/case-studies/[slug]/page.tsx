import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  CASE_STUDIES,
  getCaseStudy,
  localizeCaseStudy,
  type CaseStudy,
} from "@/lib/case-studies";
import { metaSnippet, metaTitle, SITE_URL } from "@/lib/seo";

const COPY = {
  en: {
    back: "All case studies",
    interview: "Interview with",
    about: "About",
    challenge: "The challenge",
    solutions: "Cekat.AI solutions for",
    results: "Results",
    company: "Company",
    location: "Location",
    industry: "Industry",
    companySize: "Company size",
    services: "Services used",
    ctaTitle: "Want results like this for your business?",
    ctaBody: "Talk to our team and see how Cekat.AI fits your workflow.",
    ctaAction: "Talk to sales",
    more: "More case studies",
    read: "Read case study",
  },
  id: {
    back: "Semua studi kasus",
    interview: "Wawancara dengan",
    about: "Tentang",
    challenge: "Tantangan",
    solutions: "Solusi Cekat.AI untuk",
    results: "Hasil",
    company: "Perusahaan",
    location: "Lokasi",
    industry: "Industri",
    companySize: "Ukuran perusahaan",
    services: "Layanan yang digunakan",
    ctaTitle: "Ingin mendapatkan hasil seperti ini untuk bisnis Anda?",
    ctaBody:
      "Bicarakan kebutuhan Anda dengan tim kami dan lihat bagaimana Cekat.AI cocok dengan alur kerja bisnis Anda.",
    ctaAction: "Hubungi tim sales",
    more: "Studi kasus lainnya",
    read: "Baca studi kasus",
  },
  jp: {
    back: "導入事例一覧へ",
    interview: "インタビュー",
    about: "企業紹介",
    challenge: "導入前の課題",
    solutions: "導入したCekat.AIのソリューション",
    results: "導入後の成果",
    company: "企業情報",
    location: "所在地",
    industry: "業界",
    companySize: "企業規模",
    services: "利用サービス",
    ctaTitle: "貴社でも同様の成果を目指しませんか？",
    ctaBody:
      "チームにご相談ください。Cekat.AIがお客様の業務にどう活用できるかをご案内します。",
    ctaAction: "営業チームに相談",
    more: "その他の導入事例",
    read: "事例を読む",
  },
  kr: {
    back: "전체 고객 사례 보기",
    interview: "인터뷰",
    about: "회사 소개",
    challenge: "과제",
    solutions: "Cekat.AI 도입 솔루션",
    results: "도입 성과",
    company: "기업 정보",
    location: "위치",
    industry: "업종",
    companySize: "기업 규모",
    services: "사용 서비스",
    ctaTitle: "귀사에도 비슷한 성과를 만들어 보세요",
    ctaBody:
      "팀과 상담해 Cekat.AI가 귀사의 업무 흐름에 어떻게 적용되는지 알아보세요.",
    ctaAction: "영업팀에 문의",
    more: "다른 고객 사례",
    read: "사례 읽기",
  },
  cn: {
    back: "查看全部客户案例",
    interview: "访谈",
    about: "公司简介",
    challenge: "面临的挑战",
    solutions: "Cekat.AI 解决方案",
    results: "实践成果",
    company: "公司信息",
    location: "所在地",
    industry: "行业",
    companySize: "公司规模",
    services: "使用的服务",
    ctaTitle: "也希望为您的团队实现类似成效？",
    ctaBody: "欢迎与我们的团队沟通，了解 Cekat.AI 如何融入您的工作流程。",
    ctaAction: "联系销售团队",
    more: "更多客户案例",
    read: "阅读案例",
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

function industryLabel(locale: string, industry: string) {
  if (locale === "id") return INDUSTRY_LABELS_ID[industry] ?? industry;
  if (locale === "jp") return INDUSTRY_LABELS_JP[industry] ?? industry;
  if (locale === "kr") return INDUSTRY_LABELS_KR[industry] ?? industry;
  if (locale === "cn") return INDUSTRY_LABELS_CN[industry] ?? industry;
  return industry;
}

function imageAlt(locale: string, company: string, industry: string) {
  if (locale === "jp") return `${company}の${industry}導入事例`;
  if (locale === "kr") return `${company} ${industry} 고객 사례`;
  if (locale === "cn") return `${industry}客户案例：${company}`;
  if (locale === "id") return `Studi kasus ${industry} — ${company}`;
  return `${company} ${industry} case study`;
}

function caseStudyForLocale(study: CaseStudy, locale: string) {
  return localizeCaseStudy(study, locale);
}

function pathFor(locale: Locale, slug: string) {
  return getPathname({
    href: { pathname: "/case-studies/[slug]", params: { slug } },
    locale,
  });
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const sourceStudy = getCaseStudy(slug);
  if (!sourceStudy) return { robots: { index: false, follow: false } };
  const study = caseStudyForLocale(sourceStudy, locale);

  const title = metaTitle(`${study.title} — Cekat.AI`);
  const description = metaSnippet(study.summary, 158);
  const canonical = `${SITE_URL}${pathFor(locale, study.slug)}`;
  const languages = {
    en: `${SITE_URL}${pathFor("en", study.slug)}`,
    id: `${SITE_URL}${pathFor("id", study.slug)}`,
    cn: `${SITE_URL}${pathFor("cn", study.slug)}`,
    jp: `${SITE_URL}${pathFor("jp", study.slug)}`,
    kr: `${SITE_URL}${pathFor("kr", study.slug)}`,
    "x-default": `${SITE_URL}${pathFor("id", study.slug)}`,
  };

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
      type: "article",
      images: [{ url: study.image, alt: study.company }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [study.image],
    },
  };
}

function RelatedCard({
  study,
  label,
  industry,
  locale,
}: {
  study: CaseStudy;
  label: string;
  industry: string;
  locale: string;
}) {
  return (
    <Link
      href={{ pathname: "/case-studies/[slug]", params: { slug: study.slug } }}
      className="group overflow-hidden rounded-2xl border border-[#e5e9ef] bg-white transition-all hover:-translate-y-0.5 hover:border-[#9eb8e5] hover:shadow-[0_18px_40px_-22px_rgba(9,33,76,0.27)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transform-none"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#eaf0fa]">
        <Image
          src={study.image}
          alt={imageAlt(locale, study.company, industry)}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-primary">{industry}</p>
        <h3 className="mt-2 text-lg leading-snug font-semibold text-[#09214c]">
          {study.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {label} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const sourceStudy = getCaseStudy(slug);
  if (!sourceStudy) notFound();
  const study = caseStudyForLocale(sourceStudy, locale);
  setRequestLocale(locale);

  const [tb] = await Promise.all([
    getTranslations({ locale, namespace: "breadcrumb" }),
  ]);
  const copy = copyFor(locale);
  const localizedIndustry = industryLabel(locale, study.industry);
  const currentPath = pathFor(locale, study.slug);
  const url = `${SITE_URL}${currentPath}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const listUrl = `${SITE_URL}${getPathname({ href: "/case-studies", locale })}`;
  const relatedStudies = CASE_STUDIES.filter((item) => item.slug !== study.slug)
    .slice(0, 3)
    .map((item) => caseStudyForLocale(item, locale));
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#case-study`,
      url,
      headline: study.title,
      description: study.summary,
      image: `${SITE_URL}${study.image}`,
      inLanguage:
        locale === "id"
          ? "id-ID"
          : locale === "jp"
            ? "ja-JP"
            : locale === "kr"
              ? "ko-KR"
              : locale === "cn"
                ? "zh-CN"
                : "en",
      about: { "@type": "Organization", name: study.company },
      author: { "@type": "Person", name: study.interview.name },
      publisher: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${listUrl}#collection` },
    },
    breadcrumbJsonLd([
      { name: tb("home"), url: homeUrl },
      { name: copy.back, url: listUrl },
      { name: study.company },
    ]),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        tone="case-study"
        eyebrow={localizedIndustry}
        title={study.title}
        subtitle={study.summary}
        chips={[study.company, ...study.useCases]}
        align="left"
        split
        visual={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#ccdaf1] bg-[#eaf0fa] shadow-[0_24px_60px_-36px_rgba(9,33,76,0.4)]">
            <Image
              src={study.image}
              alt={imageAlt(locale, study.company, study.industry)}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-[#071a38]/85 via-[#071a38]/30 to-transparent p-5 sm:p-7">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-white/75 uppercase">
                  {copy.interview}
                </p>
                <p className="mt-1 font-semibold text-white">
                  {study.interview.name}
                </p>
                <p className="text-sm text-white/80">{study.interview.role}</p>
              </div>
              <span className="flex h-12 min-w-16 shrink-0 items-center justify-center rounded-xl bg-white px-3 shadow-sm">
                <Image
                  src={study.logo}
                  alt={study.logoAlt}
                  width={120}
                  height={36}
                  className="max-h-8 w-auto object-contain"
                />
              </span>
            </div>
          </div>
        }
      >
        <Link
          href="/case-studies"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#ccdaf1] bg-white px-5 text-sm font-semibold text-[#0a3173] transition-colors hover:border-primary/50 hover:bg-[#f3f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden>←</span> {copy.back}
        </Link>
      </PageHero>

      <section className="border-b border-[#e5e9ef] bg-white py-8 md:py-10">
        <Container>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {study.outcomes.map((outcome) => (
              <div
                key={`${outcome.value}-${outcome.label}`}
                className="rounded-2xl border border-[#e5e9ef] bg-[#f9fafb] p-4 sm:p-5"
              >
                <p className="font-numeric text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-semibold tracking-[-0.05em] text-primary">
                  {outcome.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-[#3a4960]">
                  {outcome.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#f9fafb] py-14 md:py-20">
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <article className="min-w-0 lg:col-span-8">
              <Reveal>
                <section aria-labelledby="about-heading">
                  <h2
                    id="about-heading"
                    className="text-2xl font-semibold tracking-[-0.035em] text-[#09214c] sm:text-3xl"
                  >
                    {copy.about} {study.company}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[#3a4960]">
                    {study.about.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </Reveal>

              <Reveal delay={60}>
                <section
                  aria-labelledby="challenge-heading"
                  className="mt-12 border-t border-[#dce3ed] pt-10"
                >
                  <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    {copy.challenge}
                  </p>
                  <h2
                    id="challenge-heading"
                    className="text-2xl leading-tight font-semibold tracking-[-0.035em] text-[#09214c] sm:text-3xl"
                  >
                    {copy.challenge}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[#3a4960]">
                    {study.challenge.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <blockquote className="mt-7 rounded-r-2xl border-l-4 border-[#00b4c8] bg-white px-6 py-5 text-lg leading-relaxed font-medium text-[#09214c] shadow-[0_1px_2px_rgba(9,33,76,0.04)]">
                    “{study.challenge.quote}”
                  </blockquote>
                </section>
              </Reveal>

              <Reveal delay={90}>
                <section
                  aria-labelledby="solutions-heading"
                  className="mt-12 border-t border-[#dce3ed] pt-10"
                >
                  <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    Cekat.AI
                  </p>
                  <h2
                    id="solutions-heading"
                    className="text-2xl leading-tight font-semibold tracking-[-0.035em] text-[#09214c] sm:text-3xl"
                  >
                    {copy.solutions} {study.company}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-[#3a4960]">
                    {study.solutions.intro}
                  </p>
                  <blockquote className="mt-6 border-l-4 border-primary/35 pl-5 text-base leading-relaxed font-medium text-[#3a4960]">
                    “{study.solutions.quote}”
                  </blockquote>
                  <ol className="mt-7 space-y-4">
                    {study.solutions.steps.map((step, index) => (
                      <li
                        key={step.title}
                        className="rounded-2xl border border-[#e5e9ef] bg-white p-5 sm:p-6"
                      >
                        <div className="flex items-start gap-4">
                          <span
                            aria-hidden
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eaf0fa] font-numeric text-sm font-semibold text-primary"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="text-lg leading-snug font-semibold text-[#09214c]">
                              {step.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#505f73]">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>

              <Reveal delay={120}>
                <section
                  aria-labelledby="results-heading"
                  className="mt-12 border-t border-[#dce3ed] pt-10"
                >
                  <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    {copy.results}
                  </p>
                  <h2
                    id="results-heading"
                    className="text-2xl font-semibold tracking-[-0.035em] text-[#09214c] sm:text-3xl"
                  >
                    {copy.results}
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-[#505f73]">
                    {study.results.intro}
                  </p>
                  <blockquote className="mt-5 border-l-4 border-[#00b4c8] pl-5 text-lg leading-relaxed font-medium text-[#09214c]">
                    “{study.results.quote}”
                  </blockquote>
                  <div className="mt-7 space-y-4">
                    {study.outcomes.map((outcome) => (
                      <div
                        key={`result-${outcome.label}`}
                        className="grid gap-2 rounded-2xl border border-[#e5e9ef] bg-white p-5 sm:grid-cols-[minmax(9rem,0.34fr)_1fr] sm:gap-6 sm:p-6"
                      >
                        <div>
                          <p className="font-numeric text-2xl font-semibold tracking-[-0.04em] text-primary">
                            {outcome.value}
                          </p>
                          <h3 className="mt-1 text-sm leading-snug font-semibold text-[#09214c]">
                            {outcome.label}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-[#505f73]">
                          {outcome.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            </article>

            <aside className="space-y-5 lg:col-span-4">
              <Reveal delay={90}>
                <div className="rounded-[20px] border border-[#e5e9ef] bg-white p-6 shadow-[0_1px_2px_rgba(9,33,76,0.04)]">
                  <h2 className="text-lg font-semibold text-[#09214c]">
                    {copy.company}
                  </h2>
                  <dl className="mt-5 space-y-4">
                    {[
                      [copy.company, study.company],
                      [copy.location, study.profile.location],
                      [copy.industry, localizedIndustry],
                      [copy.companySize, study.profile.companySize],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs font-semibold tracking-[0.12em] text-[#717b91] uppercase">
                          {label}
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed font-medium text-[#3a4960]">
                          {value}
                        </dd>
                      </div>
                    ))}
                    <div>
                      <dt className="text-xs font-semibold tracking-[0.12em] text-[#717b91] uppercase">
                        {copy.services}
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {study.profile.services.map((service) => (
                          <span
                            key={service}
                            className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-medium text-[#3a4960]"
                          >
                            {service}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="rounded-[20px] border border-[#ccdaf1] bg-[#f3f6fd] p-6 sm:p-7">
                  <p className="text-lg leading-snug font-semibold tracking-[-0.025em] text-[#09214c]">
                    {copy.ctaTitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#3a4960]">
                    {copy.ctaBody}
                  </p>
                  <Link
                    href="/contact-sales"
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {copy.ctaAction}{" "}
                    <span className="ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                </div>
              </Reveal>
            </aside>
          </div>

          <Reveal delay={90} className="mt-16 border-t border-[#dce3ed] pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  Cekat.AI
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[#09214c]">
                  {copy.more}
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {copy.back} <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {relatedStudies.map((related) => (
                <RelatedCard
                  key={related.slug}
                  study={related}
                  label={copy.read}
                  industry={industryLabel(locale, related.industry)}
                  locale={locale}
                />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
