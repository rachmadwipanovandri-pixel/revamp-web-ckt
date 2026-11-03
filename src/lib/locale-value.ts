import type { Locale } from "@/i18n/routing";

/** Read localized registry copy with an explicit English/Indonesian fallback. */
export function localeValue<T>(
  values: {
    en?: T;
    id?: T;
    cn?: T;
    jp?: T;
    kr?: T;
  },
  locale: Locale,
): T | undefined {
  return values[locale] ?? values.en ?? values.id;
}
