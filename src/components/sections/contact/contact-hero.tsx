import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ContactForm } from "./contact-form";
import { ContactSupport } from "./contact-support";

export function ContactHero() {
  const t = useTranslations("contact");
  const tf = useTranslations("footer");

  // Same offices the footer lists — one source of truth, no second copy of
  // the addresses to drift out of sync.
  const offices = [
    { name: tf("jakartaOfficeName"), address: tf("jakartaOfficeAddress") },
    {
      name: tf("singaporeOfficeName"),
      address: `${tf("singaporeCompanyName")} · ${tf("singaporeOfficeAddress")}`,
    },
    {
      name: tf("malaysiaOfficeName"),
      address: `${tf("malaysiaCompanyName")} · ${tf("malaysiaOfficeAddress")}`,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <Image
          src="/images/contact/hero-background.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <Container className="relative lg:px-0">
          <div className="mx-auto max-w-xl bg-white p-6 sm:p-10">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              {t("heading")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>

            <div className="mt-6">
              <ContactForm />
            </div>

            <div className="my-8 border-t border-dashed border-border" />

            <ContactSupport />
          </div>
        </Container>
      </section>

      {/* Offices: real addresses are trust/E-E-A-T substance the ~60-word
          form-only page was missing, and they give the offices a crawlable
          home beyond the footer. */}
      <section className="border-t border-border bg-white">
        <Container className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {t("officesHeading")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("officesBody")}
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div
                key={office.name}
                className="rounded-2xl border border-border bg-surface-muted p-6"
              >
                <h3 className="font-numeric text-base font-semibold text-foreground">
                  {office.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {office.address}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
