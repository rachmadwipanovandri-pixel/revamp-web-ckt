import "server-only";

import {
  digitsOnly,
  isCompanySize,
  isCountryDial,
  type ContactSalesLead,
} from "./contact-sales";

/**
 * Deliberately permissive: rejects `no@corp` (no TLD) and anything with a space
 * or a second @, which is what actually shows up in junk submissions. Stricter
 * RFC checks reject valid addresses at this scale.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Long enough for a real complaint, short enough that nobody pastes a CV. */
const MAX_FIELD = 200;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates an untrusted JSON body into a lead, or names the first field that
 * cannot be one.
 *
 * Returning the FIELD NAME rather than a message is deliberate: the client
 * highlights that exact input, so a visitor who skipped the company size sees
 * the company-size box shake instead of an unexplained "invalid payload".
 */
export function parseLead(
  body: unknown,
): { ok: true; lead: ContactSalesLead } | { ok: false; field: string } {
  if (typeof body !== "object" || body === null)
    return { ok: false, field: "" };
  const raw = body as Record<string, unknown>;

  const email = asString(raw.email).toLowerCase();
  if (!email || email.length > MAX_FIELD || !EMAIL_RE.test(email)) {
    return { ok: false, field: "email" };
  }

  const companySize = asString(raw.companySize);
  if (!isCompanySize(companySize)) return { ok: false, field: "companySize" };

  const firstName = asString(raw.firstName);
  if (!firstName || firstName.length > MAX_FIELD) {
    return { ok: false, field: "firstName" };
  }

  const lastName = asString(raw.lastName);
  if (!lastName || lastName.length > MAX_FIELD) {
    return { ok: false, field: "lastName" };
  }

  const company = asString(raw.company);
  if (!company || company.length > MAX_FIELD)
    return { ok: false, field: "company" };

  // Only codes we publish are accepted, so a hand-crafted payload cannot make
  // the emailed row claim a country we never offered.
  const countryCode = asString(raw.countryCode);
  if (!isCountryDial(countryCode)) return { ok: false, field: "countryCode" };

  // Phone is optional on the form, so empty is legitimate — but a non-empty
  // value must still be digits somebody can dial.
  const phone = digitsOnly(asString(raw.phone));
  if (phone.length > 20) return { ok: false, field: "phone" };

  return {
    ok: true,
    lead: {
      email,
      companySize,
      firstName,
      lastName,
      company,
      countryCode,
      phone,
      locale: asString(raw.locale) === "en" ? "en" : "id",
      page: asString(raw.page).slice(0, 300),
    },
  };
}

/** One line for the sheet and the email subject: "Rachmad Wipa — AcmeMart". */
export function leadDisplayName(lead: ContactSalesLead): string {
  return `${lead.firstName} ${lead.lastName}`.trim();
}

/** Full international number, or an em dash when the phone was left blank. */
export function leadPhoneDisplay(lead: ContactSalesLead): string {
  return lead.phone ? `${lead.countryCode}${lead.phone}` : "—";
}
