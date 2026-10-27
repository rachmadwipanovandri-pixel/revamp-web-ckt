import { EN } from "./copy-en";
import { ID } from "./copy-id";
import type { Copy4 } from "./content-types";

export type {
  CaseStudy,
  Copy4,
  L,
  Lang,
  UseCase,
  Voice,
} from "./content-types";

/**
 * The page's copy, picked by locale.
 *
 * `getCopy4` takes the raw segment rather than a validated `Locale`, because
 * /preview-home-4 is a Server Component route under `[locale]` and narrowing the
 * param would mean a cast that hides a real error. Anything that is not `en`
 * gets Indonesian, which is also what the routing default does — so a new
 * locale lands on a complete page rather than on `undefined`.
 */
export function getCopy4(locale: string): Copy4 {
  return locale === "en" ? EN : ID;
}
