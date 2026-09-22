"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-foreground"
        >
          {t("nameLabel")}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          placeholder={t("namePlaceholder")}
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-foreground"
        >
          {t("emailLabel")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-whatsapp"
          className="text-sm font-medium text-foreground"
        >
          {t("whatsappLabel")}
        </label>
        <input
          id="contact-whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder={t("whatsappPlaceholder")}
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "submitting"}
        size="lg"
        className="w-full justify-center py-4.5"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>

      {status === "success" && (
        <p className="text-sm font-medium text-accent-green-deep">
          {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-destructive">{t("error")}</p>
      )}
    </form>
  );
}
