import { SITE_URL } from "@/lib/seo";
import { WHATSAPP_NUMBERS } from "@/lib/links";

/**
 * schema.org JSON-LD builders. Facts stated here must stay accurate:
 * Cekat.AI is UU PDP compliant and an official Meta Business Partner;
 * ISO 27001 is IN PROGRESS, never claim certification.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Cekat.AI",
    alternateName: "CekatAI",
    legalName: "PT. Teknologi Cekat Indonesia",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    foundingDate: "2023-08",
    description:
      "Cekat.AI is an Indonesian AI agent platform that combines AI customer service, omnichannel CRM, automated ordering, and broadcast marketing in one platform, trusted by 3,000+ businesses.",
    sameAs: [
      "https://www.linkedin.com/company/cekatai/",
      "https://www.instagram.com/cekat.ai/",
      "https://www.youtube.com/@cekatai",
      "https://www.facebook.com/p/CekatAI-61551061527910/",
    ],
    // Mirrors the geo-routed WhatsApp CTAs: each regional team's own line.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${WHATSAPP_NUMBERS.id}`,
        availableLanguage: ["id", "en"],
        areaServed: "ID",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${WHATSAPP_NUMBERS.my}`,
        availableLanguage: ["en", "id"],
        areaServed: ["MY", "SG"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${WHATSAPP_NUMBERS.global}`,
        availableLanguage: ["en"],
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress:
          "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD",
        addressLocality: "South Jakarta",
        postalCode: "12190",
        addressCountry: "ID",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "101 Upper Cross Street, 05-16, People's Park Centre",
        addressLocality: "Singapore",
        postalCode: "058357",
        addressCountry: "SG",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Level 7, Mercu 3, No. 3, Jalan Bangsar, KL Eco City",
        addressLocality: "Kuala Lumpur",
        postalCode: "59200",
        addressCountry: "MY",
      },
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Cekat.AI",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "id-ID"],
    // Sitelinks searchbox, backed by the real /blog?q= search.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationJsonLd({
  name,
  description,
  url,
  offers,
}: {
  name: string;
  description: string;
  url: string;
  /**
   * Advertised price range. Deliberately no `aggregateRating`: we hold no
   * review data, and inventing one is exactly the kind of claim this file
   * must never make.
   */
  offers?: { lowPrice: number; highPrice: number; currency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(offers
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: offers.currency,
            lowPrice: offers.lowPrice,
            highPrice: offers.highPrice,
          },
        }
      : {}),
  };
}

export function articleJsonLd({
  headline,
  description,
  url,
  image,
  authorName,
  datePublished,
  dateModified,
  section,
  language,
  keywords,
}: {
  headline: string;
  description: string;
  url: string;
  image?: { url: string; width?: number; height?: number };
  authorName: string;
  datePublished: string;
  dateModified?: string;
  section?: string;
  language?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: image.url,
            ...(image.width ? { width: image.width } : {}),
            ...(image.height ? { height: image.height } : {}),
          },
        }
      : {}),
    ...(section ? { articleSection: section } : {}),
    ...(language ? { inLanguage: language } : {}),
    ...(keywords?.length ? { keywords } : {}),
    // The named byline is the E-E-A-T signal; the company is the publisher.
    author: { "@type": "Person", name: authorName },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished,
    dateModified: dateModified ?? datePublished,
  };
}

export function blogListingJsonLd({
  url,
  name,
  description,
}: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name,
    description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "id-ID"],
  };
}

export function faqPageJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
