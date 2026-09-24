import { getTranslations } from "next-intl/server";

const CHARS =
  "7f3a9c2e…encrypt…dataLayer…agent…crm…broadcast…0x4b81…secure…loop…";

/**
 * Evervault-style ciphertext motif band — thin full-bleed marquee of brand
 * tokens between dark chapters. Identity without a new hue.
 */
export async function CipherBand() {
  const t = await getTranslations("agentic.cipherBand");
  const strip = `${CHARS} ${CHARS} ${CHARS}`;

  return (
    <section
      aria-label={t("label")}
      className="relative overflow-hidden border-y border-white/8 bg-ink-void py-3"
    >
      <div aria-hidden className="logo-ticker-mask">
        <div className="flex w-max animate-logo-ticker gap-10 pr-10 motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              className="font-numeric text-[0.7rem] tracking-[0.28em] whitespace-nowrap text-sky-400/35 select-none"
            >
              {strip}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center font-numeric text-[0.6rem] tracking-[0.2em] text-white/35 uppercase">
        {t("caption")}
      </p>
    </section>
  );
}
