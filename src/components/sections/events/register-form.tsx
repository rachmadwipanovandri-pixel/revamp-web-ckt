"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { EventItem, FormField, RegisterSection } from "@/lib/events/types";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Registration form for one event. Submits to /api/events/register, which
 * forwards the row to the sheet webhook the marketing team configured.
 */
export function RegisterForm({
  event,
  section,
}: {
  event: EventItem;
  section: RegisterSection;
}) {
  const t = useTranslations("events");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setStatus("submitting");

    const form = formEvent.currentTarget;
    const values: Record<string, string> = {};
    for (const field of section.fields) {
      const el = form.elements.namedItem(field.name);
      if (el && "value" in el) values[field.name] = el.value;
    }

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: event.slug, values }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        throw new Error(data?.error || t("register.errorFallback"));
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : t("register.errorFallback"),
      );
    }
  }

  if (status === "success") {
    return (
      <div className="py-6 text-center" role="status">
        <div
          aria-hidden
          className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-2xl"
        >
          ✅
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {section.successTitle}
        </h3>
        {section.successBody && (
          <p className="mt-2 text-sm text-muted-foreground">
            {section.successBody}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {section.fields.map((field) => (
        <FieldInput key={field.id} field={field} />
      ))}

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full justify-center py-4.5"
      >
        {status === "submitting"
          ? t("register.submitting")
          : section.submitLabel || "Daftar Sekarang"}
      </Button>

      {section.disclaimer && (
        <p className="text-center text-xs text-muted-foreground">
          {section.disclaimer}
        </p>
      )}
    </form>
  );
}

function FieldInput({ field }: { field: FormField }) {
  const t = useTranslations("events");
  const id = `reg-${field.name}`;
  const sharedClass =
    "mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 focus:outline-none";

  if (field.type === "select") {
    const options = field.options
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return (
      <div>
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </label>
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue=""
          className={sharedClass}
        >
          <option value="" disabled>
            {t("register.choose")}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      <input
        id={id}
        name={field.name}
        type={field.type}
        required={field.required}
        className={sharedClass}
      />
    </div>
  );
}
