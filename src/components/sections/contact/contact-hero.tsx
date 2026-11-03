import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { ContactForm } from "./contact-form";
import { ContactSupport } from "./contact-support";
import { HighlightedText } from "../shared/highlighted-text";

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
      <section className="contact-studio relative overflow-hidden py-16 lg:py-24">
        <Container className="relative">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div className="lg:pt-8">
            <h1 className="text-[clamp(2.75rem,5vw,4.5rem)] leading-[1.06] font-semibold tracking-[-0.055em] text-balance text-[#09214c]">
              <HighlightedText text={t("heading")} />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-[1.6] text-[#3a4960]">
              {t("intro")}
            </p>

            <div className="mt-10 border-t border-[#ccdaf1] pt-8">
            <ContactSupport />
            </div>
            </div>
            <div className="contact-studio__form rounded-[28px] border border-[#ccdaf1] bg-white p-6 shadow-[0_24px_55px_-35px_rgba(9,33,76,0.24)] sm:p-10 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Offices: real addresses are trust/E-E-A-T substance the ~60-word
          form-only page was missing, and they give the offices a crawlable
          home beyond the footer. */}
      <section className="border-t border-border bg-white">
        <Container className="py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.045em] text-balance text-[#09214c]">
              {t("officesHeading")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("officesBody")}
            </p>
          </div>
           <div className="office-rail mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div
                key={office.name}
                className="rounded-[20px] border border-[#e5e9ef] bg-[#f9fafb] p-7"
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
