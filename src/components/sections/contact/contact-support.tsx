import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const HELP_CENTRE_HREF = "https://docs.cekat.ai/";
const EMAIL_SUPPORT_HREF = "mailto:support@cekat.ai";
const CONTACT_CENTRE_HREF = "https://wa.me/628786761790";

export function ContactSupport() {
  const t = useTranslations("contact.support");

  return (
    <div>
      <p className="text-base text-foreground lg:text-lg">{t("note")}</p>

      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <Button
          variant="outline-primary"
          nativeButton={false}
          size="lg"
          className="w-full px-5 py-4 text-xs"
          render={
            <a
              href={HELP_CENTRE_HREF}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          {t("helpCentre")}
        </Button>
        <Button
          variant="outline-primary"
          nativeButton={false}
          size="lg"
          className="w-full px-5 py-4 text-xs"
          render={<a href={EMAIL_SUPPORT_HREF} />}
        >
          {t("emailSupport")}
        </Button>
        <Button
          variant="outline-primary"
          nativeButton={false}
          size="lg"
          className="w-full px-5 py-4 text-xs"
          render={
            <a
              href={CONTACT_CENTRE_HREF}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          {t("contactCentre")}
        </Button>
      </div>
    </div>
  );
}
