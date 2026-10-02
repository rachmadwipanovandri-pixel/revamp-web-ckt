/**
 * Open roles at Cekat.AI.
 *
 * Two deliberate boundaries:
 *
 * - **Facts live here, copy lives in `messages/`.** A posting's title and city
 *   are proper nouns and stay identical across locales; the team headings,
 *   employment-type labels and seniority bands are UI copy and are translated
 *   like any other string. That is why nothing in this file is bilingual data.
 * - **There is no detail route.** Every row links straight to the LinkedIn
 *   posting that is the actual application — the same call fun.xyz makes — so a
 *   role can never go stale here while remaining live over there. Adding a
 *   local detail page later would mean mirroring `description`,
 *   `datePosted` and `validThrough` for `JobPosting` structured data; today that
 *   data does not exist on this site, and inventing it would be worse than
 *   having none.
 *
 * Sourced from the company's LinkedIn postings. When a role closes, delete the
 * entry — the empty state on the page handles the list going to zero.
 */

/** Which team a role belongs to. Groups the list, fun.xyz-style. */
export type CareersTeam = "product" | "growth" | "people";

export type CareerRole = {
  /** Stable id, used as the React key and the translations namespace suffix. */
  id: string;
  team: CareersTeam;
  /** The LinkedIn posting that is the real application. */
  url: string;
  /** Position title exactly as posted. */
  title: string;
  /** City / province as posted. */
  location: string;
  /**
   * Employment type key, resolved against `careers.type.*` in the messages.
   * Only full-time is published at the moment, which is exactly why it is a
   * key rather than a string: the next contract role needs no new plumbing.
   */
  type: "fullTime";
  /**
   * Seniority band key, resolved against `careers.seniority.*`. Omitted where
   * the posting states none — an unstated band is better left unstated than
   * guessed at.
   */
  seniority?: "associate";
};

export const OPEN_ROLES: readonly CareerRole[] = [
  {
    id: "consulting-marketing-growth",
    team: "growth",
    url: "https://id.linkedin.com/jobs/view/business-development-consultant-at-cekat-ai-4467493928",
    title: "Consulting - Marketing & Growth Strategy",
    location: "Jakarta Raya, Indonesia",
    type: "fullTime",
    seniority: "associate",
  },
  {
    id: "product-manager",
    team: "product",
    url: "https://www.linkedin.com/jobs/view/4468897176/",
    title: "Product Manager",
    location: "Tangerang, Banten, Indonesia",
    type: "fullTime",
  },
  {
    id: "product-designer",
    team: "product",
    url: "https://id.linkedin.com/jobs/view/product-designer-at-cekat-ai-4472478866",
    title: "Product Designer",
    location: "Tangerang, Indonesia",
    type: "fullTime",
    seniority: "associate",
  },
  {
    id: "human-resources-specialist",
    team: "people",
    url: "https://id.linkedin.com/jobs/view/human-resources-specialist-at-cekat-ai-4469516106",
    title: "Human Resources Specialist",
    location: "Jakarta Raya, Indonesia",
    type: "fullTime",
    seniority: "associate",
  },
];

/**
 * Team order, which is also the section order. `product` leads because it is
 * where most candidates come from, and the list reads top-down: build the
 * thing, then grow it, then staff it.
 */
export const CAREERS_TEAM_ORDER: readonly CareersTeam[] = [
  "product",
  "growth",
  "people",
];

/** Roles grouped by team, in `CAREERS_TEAM_ORDER`, with empty teams dropped. */
export function groupRolesByTeam(
  roles: readonly CareerRole[] = OPEN_ROLES,
): { team: CareersTeam; roles: CareerRole[] }[] {
  return CAREERS_TEAM_ORDER.map((team) => ({
    team,
    roles: roles.filter((role) => role.team === team),
  })).filter((group) => group.roles.length > 0);
}
