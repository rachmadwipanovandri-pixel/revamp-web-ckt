import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, metaSnippet, metaTitle, SITE_URL } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import {
  MessageCircle,
  Megaphone,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });

  const title = metaTitle(t("metaTitle"));
  const description = metaSnippet(t("metaDescription"), 158);
  const { canonical, languages } = alternates(locale, "/about");
  const openGraphLocale = {
    id: "id_ID",
    en: "en_US",
    jp: "ja_JP",
    kr: "ko_KR",
    cn: "zh_CN",
  }[locale];

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
      locale: openGraphLocale,
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

const OFFICES = [
  { nameKey: "jakartaOfficeName", addrKey: "jakartaOfficeAddress" },
  { nameKey: "tangerangOfficeName", addrKey: "tangerangOfficeAddress" },
  { nameKey: "singaporeOfficeName", addrKey: "singaporeOfficeAddress" },
  { nameKey: "malaysiaOfficeName", addrKey: "malaysiaOfficeAddress" },
] as const;

const FACTS = ["founding", "businesses", "countries", "partner"] as const;

const TRUST_CARDS = ["pdp", "rbac", "meta", "iso"] as const;

const JOURNEY_STEPS = [
  { key: "conversation", number: "01", icon: MessageCircle },
  { key: "crm", number: "02", icon: UsersRound },
  { key: "order", number: "03", icon: ShoppingBag },
  { key: "marketing", number: "04", icon: Megaphone },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const ts = await getTranslations({ locale, namespace: "agentic.security" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });

  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: t("eyebrow") },
          ]),
        ]}
      />

      <PageHero
        tone="company"
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        subtitle={t("heroSub")}
        split
        visual={
          <div className="evidence-panel">
            <p className="text-sm font-semibold">{t("factsEyebrow")}</p>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10">
              {FACTS.map((fact) => (
                <div key={fact}>
                  <dt className="text-[clamp(1.6rem,3vw,2.5rem)] leading-tight font-semibold tracking-[-0.04em]">
                    {t(`facts.${fact}.v`)}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed">
                    {t(`facts.${fact}.l`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
            href="https://chat.cekat.ai/register"
          >
            {t("trialLabel")}
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/15 bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {t("contactLinkLabel")}
          </Link>
        </div>
      </PageHero>

      {/* Story */}
      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow-rule inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  {t("storyEyebrow")}
                </p>
                <h2 className="mt-4 max-w-[18ch] text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-foreground">
                  {t("storyHeading")}
                </h2>
              </Reveal>
            </div>
            <div className="space-y-5 lg:col-span-7">
              <Reveal delay={60}>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {t("storyP1")}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {t("storyP2")}
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p
                  className="border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground"
                  aria-label={tf("metaPartner")}
                >
                  {tf("metaPartner")}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* One connected customer journey across Cekat.AI's core products. */}
      <section className="about-growth bg-[#f8fafc] py-16 md:py-20">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="eyebrow-rule inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {t("journeyEyebrow")}
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {t("journeyHeading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t("journeySub")}
            </p>
          </Reveal>

          <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STEPS.map(({ key, number, icon: Icon }, index) => (
              <Reveal key={key} delay={index * 60} as="li" className="h-full">
                <article className="about-growth__card h-full rounded-[1.25rem] border border-[#dbe6f1] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#e4ebf9] text-primary">
                      <Icon
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="font-numeric text-xs font-semibold tracking-[0.12em] text-[#64748b]">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.025em] text-foreground">
                    {t(`journey.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">
                    {t(`journey.${key}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Security & compliance — same honest copy as the homepage band. */}
      <section className="bg-ink-void py-16 text-white md:py-20">
        <Container>
          <Reveal>
            <p className="inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-200 uppercase">
              {t("certEyebrow")}
            </p>
            <h2 className="mt-4 text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-white">
              {t("certHeading")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
              {ts("body")}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CARDS.map((card, index) => (
              <Reveal key={card} delay={index * 60} className="h-full">
                <article className="flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6">
                  <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-white/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-numeric text-lg font-semibold tracking-[-0.025em] text-white">
                    {ts(`${card}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.65] text-white/65">
                    {ts(`${card}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80} className="mt-8">
            <p className="max-w-3xl text-xs leading-relaxed text-white/45">
              {ts("note")}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Offices */}
      <section className="bg-slate-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="eyebrow-rule inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {t("officesEyebrow")}
            </p>
            <h2 className="mt-4 max-w-[22ch] text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-foreground">
              {t("officesHeading")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OFFICES.map((office) => (
                <div
                  key={office.nameKey}
                  className="rounded-[1.25rem] border border-foreground/10 bg-white p-5"
                >
                  <p className="font-numeric text-sm font-semibold text-foreground">
                    {tf(office.nameKey)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tf(office.addrKey)}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal
            delay={80}
            className="about-cta mt-14 rounded-[1.5rem] p-8 text-center md:p-10"
          >
            <h2 className="text-[clamp(1.4rem,2.5vw,1.9rem)] font-semibold tracking-[-0.03em] text-white">
              {t("ctaHeading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              {t("ctaSub")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-[#f3f6fd] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                href="https://chat.cekat.ai/register"
              >
                {t("trialLabel")}
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/50 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {t("contactLinkLabel")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
