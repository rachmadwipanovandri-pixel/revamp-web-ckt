"use client";

import { useId, useState, type FormEvent } from "react";
import { appendAdParams } from "@/lib/ad-params";
import { REGISTER_URL } from "@/lib/links";
import { readStoredAdParams } from "@/hooks/use-app-url";
import { cn } from "@/lib/utils";
import type { HomeContent } from "./types";

/** Deliberately loose: a shape check, not a TLD whitelist. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Inline email capture for the hero, following Amplemarket's pattern of a
 * single conversion action rather than two competing buttons.
 *
 * Handles its own validation with an `aria-describedby`-linked error and
 * `role="alert"`, so the failure is announced instead of only turning red.
 * There is no lead backend for the draft, so a valid submit hands the visitor
 * to the register flow carrying the stored ad params — the same contract
 * preview-home's `form.capture` used.
 */
export function HeroForm({ form }: { form: HomeContent["hero"]["form"] }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = value.trim();

    if (!email) {
      setError(form.errorRequired);
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError(form.errorInvalid);
      return;
    }

    setError(null);
    setBusy(true);

    const link = document.createElement("a");
    link.href = appendAdParams(REGISTER_URL, readStoredAdParams());
    link.click();

    // Safety net: if the navigation is blocked, the button must not stick.
    window.setTimeout(() => setBusy(false), 1500);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 w-full max-w-[33rem]">
      <label htmlFor={id} className="sr-only">
        {form.label}
      </label>

      <div
        className={cn(
          "flex flex-col gap-1.5 rounded-[22px] border bg-white p-1.5 transition-[border-color,box-shadow] duration-200 sm:flex-row sm:items-center sm:rounded-full sm:pl-5",
          error
            ? "border-[#BE185D]"
            : "border-border shadow-[0_1px_2px_rgba(11,18,32,0.05),0_24px_48px_-32px_rgba(11,18,32,0.45)] focus-within:border-[#BFDBFE] focus-within:shadow-[0_1px_2px_rgba(11,18,32,0.05),0_24px_48px_-30px_rgba(19,82,191,0.45)]",
        )}
      >
        <input
          id={id}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          placeholder={form.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-note`}
          className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-4 text-[0.95rem] text-[#101828] placeholder:text-[#94A3B8] sm:px-0"
        />

        <button
          type="submit"
          aria-busy={busy || undefined}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-white shadow-[0_12px_26px_-16px_rgba(19,82,191,0.9)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#2563EB] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {form.cta}
        </button>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2.5 text-[0.82rem] font-medium text-[#BE185D]"
        >
          {error}
        </p>
      ) : (
        <p id={`${id}-note`} className="mt-2.5 text-[0.82rem] text-[#64748B]">
          {form.note}
        </p>
      )}
    </form>
  );
}
