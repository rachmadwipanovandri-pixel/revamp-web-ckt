import Script from "next/script";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { revampHomeMarkup } from "@/components/sections/revamp-home-markup";
import { localizeIndustryNav } from "@/lib/localize-industry-nav";
import {
  localizeRevampHomeMarkup,
  localizeRevampHomeRoutes,
} from "@/components/sections/revamp-home-i18n";
import type { Locale } from "@/i18n/routing";

/**
 * Direct Next.js migration of the approved revamp artifact.
 *
 * The reference HTML is rendered in this route (not an iframe), while its
 * original stylesheet and interaction file remain local public assets. Keeping
 * the markup intact is deliberate: it preserves the approved visual design
 * and all interaction hooks during the first migration pass.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // The reference document uses English canonical paths. Swap only the routes
  // whose Indonesian pathname differs, keeping all menu items on real pages.
  const localeCode = locale as Locale;
  const hero = await getTranslations({ locale, namespace: "home.hero" });
  const finalCta = await getTranslations({
    locale,
    namespace: "home.finalCta",
  });
  const markup = localizeRevampHomeMarkup(
    localizeIndustryNav(
      localizeRevampHomeRoutes(revampHomeMarkup, localeCode),
      locale,
    ),
    localeCode,
  )
    .replaceAll("From Leads to Lifetime Customer.", hero("title"))
    .replaceAll("Dari Leads Jadi Pelanggan Seumur Hidup", hero("title"))
    .replaceAll(
      "Use AI agents, CRM, and automated follow-ups to turn more conversations into sales, know exactly which ads end in a closed deal, and keep customers coming back.",
      hero("subtitle"),
    )
    .replaceAll("#1 AI-powered revenue technology", hero("eyebrow"))
    .replaceAll(
      "Ready for a more connected revenue journey?",
      finalCta("heading"),
    )
    // The homepage's standalone reference markup has a compact legacy footer.
    // Remove it so SiteChrome can render the same localized Footer as every page.
    .replace(/<footer class="foot">[\s\S]*?<\/footer>/, "");
  const languageLabel = {
    en: "Choose language",
    id: "Pilih bahasa",
    cn: "选择语言",
    jp: "言語を選択",
    kr: "언어 선택",
  }[localeCode];
  const languageMenu = `
    <details class="nav__languages">
      <summary aria-label="${languageLabel}">${locale.toUpperCase()}<svg class="nav__language-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5"></path></svg></summary>
      <div class="nav__language-menu" role="menu">
        <a href="/en" data-locale="en" role="menuitem">English <small>EN</small></a>
        <a href="/id" data-locale="id" role="menuitem">Indonesia <small>ID</small></a>
        <a href="/kr" data-locale="kr" role="menuitem">한국어 <small>KR</small></a>
        <a href="/jp" data-locale="jp" role="menuitem">日本語 <small>JP</small></a>
        <a href="/cn" data-locale="cn" role="menuitem">中文 <small>CN</small></a>
      </div>
    </details>`;

  return (
    <>
      {/* The approved legacy stylesheet is deliberately kept as an isolated
          public asset while its selectors are migrated to scoped CSS. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/revamp-web-cekat/styles.css" />
      <style>{`.nav__language-menu{position:absolute!important;top:100%!important;right:0!important;width:170px!important;z-index:2147483000!important}.nav__languages:hover>.nav__language-menu,.nav__languages:focus-within>.nav__language-menu,.nav__languages[open]>.nav__language-menu{display:block!important}`}</style>
      <div
        className="reference-home"
        data-locale={localeCode}
        dangerouslySetInnerHTML={{
          __html: markup.replace(
            '<div class="nav__actions">',
            `<div class="nav__actions">${languageMenu}`,
          ),
        }}
      />
      <Script src="/revamp-web-cekat/main.js" strategy="afterInteractive" />
    </>
  );
}
