import type { SolutionEntry } from "./types";

/**
 * Role landing pages: who inside the customer's company the platform serves.
 * Structure mirrors the Qontak /solusi pages; copy is ours. Each entry pairs
 * with content files in src/content/solutions/<id>/.
 */
export const SOLUTIONS: readonly SolutionEntry[] = [
  {
    id: "sales",
    category: "role",
    slugs: { en: "sales", id: "sales" },
    title: { en: "Sales", id: "Sales" },
    tagline: {
      en: "Reply first, qualify, and close more deals",
      id: "Balas duluan, kualifikasi, closing lebih banyak",
    },
    icon: "Target",
    nav: { megaMenu: true, order: 1 },
  },
  {
    id: "customer-service",
    category: "role",
    slugs: { en: "customer-service", id: "customer-service" },
    title: { en: "Customer Service", id: "Customer Service" },
    tagline: {
      en: "Every channel answered 24/7, humans on the hard ones",
      id: "Semua channel terjawab 24/7, manusia pegang yang sulit",
    },
    icon: "Headphones",
    nav: { megaMenu: true, order: 2 },
  },
  {
    id: "marketing",
    category: "role",
    slugs: { en: "marketing", id: "marketing" },
    title: { en: "Marketing", id: "Marketing" },
    tagline: {
      en: "Campaigns you can trace to actual sales",
      id: "Campaign yang kelacak sampai penjualan",
    },
    icon: "Megaphone",
    nav: { megaMenu: true, order: 3 },
  },
  {
    id: "human-resources",
    category: "role",
    slugs: { en: "human-resources", id: "hrd" },
    title: { en: "Human Resources", id: "HRD" },
    tagline: {
      en: "Candidate and employee questions, one inbox",
      id: "Pertanyaan kandidat & karyawan, satu inbox",
    },
    icon: "Users",
    nav: { megaMenu: true, order: 4 },
  },
  {
    id: "operations",
    category: "role",
    slugs: { en: "operations", id: "operasional" },
    title: { en: "Operations", id: "Operasional" },
    tagline: {
      en: "Orders, tickets, and handoffs that run themselves",
      id: "Order, tiket, dan serah terima jalan sendiri",
    },
    icon: "Workflow",
    nav: { megaMenu: true, order: 5 },
  },
] as const;
