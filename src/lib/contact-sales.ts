/**
 * Shared contract for the /contact-sales lead form.
 *
 * Client-safe on purpose: the form imports COMPANY_SIZE_OPTIONS and
 * COUNTRY_OPTIONS from here to render its inputs, and the API route imports
 * them to validate the same payload. Declaring them once is what keeps the
 * rendered options and the accepted values from drifting apart — the usual
 * cause of "the form submitted fine but the sheet column was blank".
 *
 * The validator itself is server-only and lives in ./contact-sales.server.ts.
 * The Apps Script that receives these payloads reads the same field names; see
 * scripts/contact-sales-apps-script.gs.
 */

/** Lead payload for the /contact-sales page. */
export interface ContactSalesLead {
  email: string;
  companySize: string;
  firstName: string;
  lastName: string;
  company: string;
  /** Dial code chosen in the country picker, e.g. "+62". */
  countryCode: string;
  /** Digits only, as typed. Empty when the visitor skipped the optional phone. */
  phone: string;
  /** Which language the form was filled in. */
  locale: "id" | "en";
  /** Landing page the enquiry came from. */
  page: string;
}

/**
 * Company-size buckets — the qualification sales actually routes on. Stored as
 * neutral ids so the backend never receives localized copy.
 */
export const COMPANY_SIZE_OPTIONS = [
  "1-15",
  "15-49",
  "50-199",
  "200-1999",
  "2000-4999",
  "5000+",
] as const;

export type CompanySize = (typeof COMPANY_SIZE_OPTIONS)[number];

/**
 * Country dial codes, trimmed to the markets this sales team serves. Intercom's
 * picker carries 240+ entries; that is noise beside a six-field form.
 *
 * `name` is the Indonesian label and `nameEn` the English one — the form picks
 * by locale instead of shipping a 20-entry translation tree.
 */
export const COUNTRY_OPTIONS = [
  { dial: "+62", name: "Indonesia", nameEn: "Indonesia" },
  { dial: "+60", name: "Malaysia", nameEn: "Malaysia" },
  { dial: "+65", name: "Singapura", nameEn: "Singapore" },
  { dial: "+1", name: "Amerika Serikat", nameEn: "United States" },
  { dial: "+61", name: "Australia", nameEn: "Australia" },
  { dial: "+63", name: "Filipina", nameEn: "Philippines" },
  { dial: "+84", name: "Vietnam", nameEn: "Vietnam" },
  { dial: "+66", name: "Thailand", nameEn: "Thailand" },
  { dial: "+91", name: "India", nameEn: "India" },
  { dial: "+86", name: "Tiongkok", nameEn: "China" },
  { dial: "+81", name: "Jepang", nameEn: "Japan" },
  { dial: "+82", name: "Korea Selatan", nameEn: "South Korea" },
  { dial: "+852", name: "Hong Kong", nameEn: "Hong Kong" },
  { dial: "+886", name: "Taiwan", nameEn: "Taiwan" },
  { dial: "+971", name: "Uni Emirat Arab", nameEn: "UAE" },
  { dial: "+966", name: "Arab Saudi", nameEn: "Saudi Arabia" },
  { dial: "+31", name: "Belanda", nameEn: "Netherlands" },
  { dial: "+49", name: "Jerman", nameEn: "Germany" },
  { dial: "+44", name: "Inggris Raya", nameEn: "United Kingdom" },
] as const;

export type CountryDial = (typeof COUNTRY_OPTIONS)[number]["dial"];

/** Indonesia first and selected by default: the primary market. */
export const DEFAULT_COUNTRY_DIAL: CountryDial = "+62";

/**
 * Strips everything but digits, so "+62 (812) 3456-7890" and "0812 3456 7890"
 * both reach the sheet as digits. The dial code is stored separately, so a
 * visitor who already typed their own country code still produces one clean
 * number.
 */
export function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isCompanySize(value: unknown): value is CompanySize {
  return COMPANY_SIZE_OPTIONS.includes(value as CompanySize);
}

export function isCountryDial(value: unknown): value is CountryDial {
  return COUNTRY_OPTIONS.some((c) => c.dial === value);
}
