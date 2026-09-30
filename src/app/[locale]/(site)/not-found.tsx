import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="bg-background">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-numeric text-sm font-semibold text-primary">404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {t("description")}
        </p>
        <Button
          size="lg"
          className="mt-8 px-5 py-4 text-xs"
          nativeButton={false}
          render={<Link href="/" />}
        >
          {t("backHome")}
        </Button>
      </Container>
    </section>
  );
}
