"use client";

import { useId, useState, type FormEvent } from "react";
import { appendAdParams } from "@/lib/ad-params";
import { REGISTER_URL } from "@/lib/links";
import { readStoredAdParams } from "@/hooks/use-app-url";
import type { HomeContent } from "@/components/preview-home-2/types";

/** Deliberately loose: a shape check, not a TLD whitelist. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The hero's single conversion action.
 *
 * Same contract as preview-home-2's `HeroForm` — one field, one button, a
 * validation error wired through `aria-describedby` and `role="alert"` so it is
 * announced rather than only reddened, and a valid submit hands the visitor to
 * the register flow carrying whatever ad params are stored. The draft has no
 * lead backend.
 *
 * It is a separate component rather than a restyled copy because that form's
 * identity is a 22px pill with a soft blue focus bloom — geometry the new design
 * rejects everywhere else, and overriding it from CSS would mean fighting
 * utility classes element by element.
 */
export function HeroForm3({ form }: { form: HomeContent["hero"]["form"] }) {
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
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-[30rem]">
      <label htmlFor={id} className="sr-only">
        {form.label}
      </label>

      {/* Field and button are siblings with a 8px gap — not one fused pill.
          Two separate controls read as two controls. */}
      <div className="ph3-form">
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
          className="ph3-form-input"
        />
        <button
          type="submit"
          aria-busy={busy || undefined}
          className="ph3-btn ph3-btn-solid shrink-0"
        >
          {form.cta}
        </button>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="ph3-form-error mt-2.5 text-[0.8125rem] font-medium"
        >
          {error}
        </p>
      ) : (
        <p
          id={`${id}-note`}
          className="ph3-mono mt-3 text-[0.625rem] leading-[1.6]"
        >
          {form.note}
        </p>
      )}
    </form>
  );
}