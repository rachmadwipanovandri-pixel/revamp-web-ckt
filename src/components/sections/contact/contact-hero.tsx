import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ContactForm } from "./contact-form";
import { ContactSupport } from "./contact-support";

export function ContactHero() {
  const t = useTranslations("contact");

  return (
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

          <ContactForm />

          <div className="my-8 border-t border-dashed border-border" />

          <ContactSupport />
        </div>
      </Container>
    </section>
  );
}
