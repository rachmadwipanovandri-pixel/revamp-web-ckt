"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import type { IconifyIcon } from "@iconify/react/offline";
import { Button } from "@/components/ui/button";
import {
  lucideAlertCircle,
  mdiAccountMultipleOutline,
  mdiCheckDecagramOutline,
  mdiDomain,
  mdiEmailOutline,
  mdiPhone,
  mdiWhatsapp,
} from "@/lib/icons";
import {
  COMPANY_SIZE_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY_DIAL,
  digitsOnly,
  type CountryDial,
} from "@/lib/contact-sales";
import { WHATSAPP_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * Icons come from the iconify offline bundle (src/lib/icons.ts) rather than
 * lucide-react, so this client component does not pull a second icon library
 * into the bundle.
 */
const FIELD_ICONS = {
  email: mdiEmailOutline,
  companySize: mdiAccountMultipleOutline,
  company: mdiDomain,
  phone: mdiPhone,
} as const;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Why a field was rejected. Kept as a kind rather than a ready-made string so
 * the copy lives in the message catalog and stays bilingual.
 */
type ErrorKind = "required" | "email" | "phone";

const ERROR_MESSAGE_KEY: Record<ErrorKind, string> = {
  required: "errorRequired",
  email: "errorEmail",
  phone: "errorPhone",
};

/** Everything the form collects, before validation. */
interface FormState {
  email: string;
  companySize: string;
  firstName: string;
  lastName: string;
  company: string;
  countryCode: CountryDial;
  phone: string;
}

const INITIAL: FormState = {
  email: "",
  companySize: "",
  firstName: "",
  lastName: "",
  company: "",
  countryCode: DEFAULT_COUNTRY_DIAL,
  phone: "",
};

/**
 * Native `required` alone is not enough here: the field names are what the API
 * echoes back on a 400, and the browser's own bubble cannot say which of six
 * identical-looking boxes the server actually rejected.
 */
function validate(
  state: FormState,
): Partial<Record<keyof FormState, ErrorKind>> {
  const errors: Partial<Record<keyof FormState, ErrorKind>> = {};

  // Free-mail domains are NOT blocked — a founder on gmail is still a real lead.
  // Only the shape is checked, never the domain.
  if (!state.email.trim()) errors.email = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim())) {
    errors.email = "email";
  }

  if (!state.companySize) errors.companySize = "required";
  if (!state.firstName.trim()) errors.firstName = "required";
  if (!state.lastName.trim()) errors.lastName = "required";
  if (!state.company.trim()) errors.company = "required";

  const digits = digitsOnly(state.phone);
  if (digits.length > 0 && digits.length < 6) errors.phone = "phone";

  return errors;
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: ErrorKind;
  optional?: string;
  /** Shown in the label, so the six inputs stay visually distinguishable. */
  icon?: IconifyIcon;
  children: React.ReactNode;
}) {
  const t = useTranslations("contactSales.form");
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 flex items-baseline justify-between gap-2 font-numeric text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-1.5">
          {icon ? (
            <Icon
              icon={icon}
              className="size-4 shrink-0 self-center text-muted-foreground"
            />
          ) : null}
          {label}
          {/*
            The asterisk is aria-hidden and the required-ness is carried by the
            inputs' own `required`, so a screen reader does not announce the
            same thing twice on every one of the five fields.
          */}
          <span aria-hidden className="text-destructive">
            {" *"}
          </span>
        </span>
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            {optional}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="mt-1.5 flex items-start gap-1 text-xs font-medium text-destructive"
        >
          <Icon icon={lucideAlertCircle} className="mt-px size-3.5 shrink-0" />
          {t(ERROR_MESSAGE_KEY[error])}
        </p>
      ) : null}
    </div>
  );
}

export function ContactSalesForm() {
  const t = useTranslations("contactSales.form");
  const locale = useLocale();
  const uid = useId();

  const [state, setState] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, ErrorKind>>
  >({});
  const [status, setStatus] = useState<Status>("idle");

  const id = (name: keyof FormState) => `${uid}-${name}`;
  const invalid = (name: keyof FormState) => Boolean(errors[name]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error the moment it is touched: leaving a stale red box
    // next to a value the visitor has already fixed reads as "still broken".
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validate(state);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users are
      // not left guessing which box turned red.
      const first = Object.keys(found)[0];
      if (first) document.getElementById(id(first as keyof FormState))?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...state,
          locale,
          // Lets sales see which page the enquiry came from; the sheet and the
          // email both carry it.
          page: typeof window === "undefined" ? "" : window.location.pathname,
        }),
      });

      if (response.status === 400) {
        // The API names the field it rejected (see parseLead), so the exact box
        // is flagged instead of a blanket "something went wrong".
        const body = (await response.json().catch(() => null)) as {
          field?: string;
        } | null;
        if (body?.field && body.field in INITIAL) {
          setErrors({
            [body.field]: "required",
          } as Partial<Record<keyof FormState, ErrorKind>>);
        }
        setStatus("error");
        return;
      }

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setState(INITIAL);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-6 sm:p-8"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-accent-green text-white">
          <Icon icon={mdiCheckDecagramOutline} className="size-6" />
        </span>
        <h3 className="mt-4 font-numeric text-xl font-semibold text-foreground">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("successBody")}
        </p>

        {/*
          A WhatsApp escape hatch on the one screen where the visitor has
          already been told to wait. Sales cannot reply to an enquiry that never
          arrived, so this is the only route left if the email bounces.
        */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Icon icon={mdiWhatsapp} className="size-4.5" />
          {t("whatsappCta")}
        </a>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-ring/25 focus:outline-none";

  // Chevron for the two <select>s, inlined as a data URI. A native select keeps
  // the platform picker on mobile — worth far more here than a custom listbox
  // that would need JS to open at all.
  const SELECT_CHEVRON =
    "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M2.5%204.5L6%208l3.5-3.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field
        label={t("emailLabel")}
        htmlFor={id("email")}
        error={errors.email}
        icon={FIELD_ICONS.email}
      >
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={state.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-invalid={invalid("email")}
          aria-describedby={
            invalid("email") ? `${id("email")}-error` : undefined
          }
          className={cn(inputClass, invalid("email") && "border-destructive")}
        />
      </Field>

      <Field
        label={t("companySizeLabel")}
        htmlFor={id("companySize")}
        error={errors.companySize}
        icon={FIELD_ICONS.companySize}
      >
        {/* A native <select> rather than the custom listbox: it gets the
            platform picker on mobile, which is most of the traffic on a
            six-field lead form, and needs no JS to open. */}
        <select
          id={id("companySize")}
          name="companySize"
          required
          value={state.companySize}
          onChange={(e) => update("companySize", e.target.value)}
          aria-invalid={invalid("companySize")}
          aria-describedby={
            invalid("companySize") ? `${id("companySize")}-error` : undefined
          }
          className={cn(
            inputClass,
            SELECT_CHEVRON,
            !state.companySize && "text-muted-foreground",
            invalid("companySize") && "border-destructive",
          )}
        >
          <option value="">{t("companySizePlaceholder")}</option>
          {COMPANY_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size} className="text-foreground">
              {size}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("firstNameLabel")}
          htmlFor={id("firstName")}
          error={errors.firstName}
        >
          <input
            id={id("firstName")}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={state.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder={t("firstNamePlaceholder")}
            aria-invalid={invalid("firstName")}
            className={cn(
              inputClass,
              invalid("firstName") && "border-destructive",
            )}
          />
        </Field>

        <Field
          label={t("lastNameLabel")}
          htmlFor={id("lastName")}
          error={errors.lastName}
        >
          <input
            id={id("lastName")}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={state.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder={t("lastNamePlaceholder")}
            aria-invalid={invalid("lastName")}
            className={cn(
              inputClass,
              invalid("lastName") && "border-destructive",
            )}
          />
        </Field>
      </div>

      <Field
        label={t("companyLabel")}
        htmlFor={id("company")}
        error={errors.company}
        icon={FIELD_ICONS.company}
      >
        <input
          id={id("company")}
          name="company"
          type="text"
          autoComplete="organization"
          required
          value={state.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder={t("companyPlaceholder")}
          aria-invalid={invalid("company")}
          className={cn(inputClass, invalid("company") && "border-destructive")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("countryLabel")}
          htmlFor={id("countryCode")}
          error={errors.countryCode}
        >
          <select
            id={id("countryCode")}
            name="countryCode"
            value={state.countryCode}
            onChange={(e) =>
              update("countryCode", e.target.value as CountryDial)
            }
            className={cn(inputClass, SELECT_CHEVRON)}
          >
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country.dial} value={country.dial}>
                {country.dial} ·{" "}
                {locale === "en" ? country.nameEn : country.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label={t("phoneLabel")}
          htmlFor={id("phone")}
          error={errors.phone}
          optional={t("optional")}
          icon={FIELD_ICONS.phone}
        >
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            value={state.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder={`${state.countryCode} ${t("phonePlaceholder")}`}
            aria-invalid={invalid("phone")}
            aria-describedby={
              invalid("phone") ? `${id("phone")}-error` : undefined
            }
            className={cn(inputClass, invalid("phone") && "border-destructive")}
          />
        </Field>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("consent")}
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="h-12 w-full text-sm font-semibold"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </Button>

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/[0.06] px-4 py-3 text-sm font-medium text-destructive"
        >
          {t("error")}
          <span className="mt-0.5 block font-normal text-muted-foreground">
            {t("errorBody")}
          </span>
        </p>
      ) : null}
    </form>
  );
}
