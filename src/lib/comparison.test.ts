import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  COMPARISON_TABLES,
  VENDORS,
  pillarCoverage,
  standoutRows,
} from "./comparison";

const PUBLIC_ROOT = path.resolve(__dirname, "../../public");

describe("comparison matrix", () => {
  it("gives every row a cell for every vendor", () => {
    // A short row silently shifts every claim after it onto the wrong company.
    for (const table of COMPARISON_TABLES) {
      for (const row of table.rows) {
        expect(row.cells.length, `${table.key}.${row.key} cell count`).toBe(
          VENDORS.length,
        );
      }
    }
  });

  it("points every competitor logo at a file that exists", () => {
    for (const vendor of VENDORS) {
      if (!vendor.logo) continue;
      expect(
        fs.existsSync(path.join(PUBLIC_ROOT, vendor.logo)),
        `${vendor.name} logo ${vendor.logo}`,
      ).toBe(true);
    }
  });

  it("puts us first, and only us", () => {
    expect(VENDORS.filter((vendor) => vendor.isUs)).toHaveLength(1);
    expect(VENDORS[0].isUs).toBe(true);
  });

  it("counts pillar coverage from the rows the table renders", () => {
    const { total, ours, best, usLeads } = pillarCoverage();
    const pillarRows = COMPARISON_TABLES.filter((table) =>
      ["channels", "marketing", "crm"].includes(table.key),
    ).reduce((sum, table) => sum + table.rows.length, 0);

    expect(total).toBe(pillarRows);
    expect(ours).toBeLessThanOrEqual(total);
    expect(best).toBe(ours);
    expect(usLeads).toBe(true);
  });

  it("does not support a claim that rivals cover only one pillar", () => {
    // The brief for the /perbandingan diagram read "most platforms stop at
    // one". This is the evidence against it: every vendor listed ticks at
    // least one row in all three pillars, so the copy claims depth instead.
    // If that ever stops being true, this test fails and the headline can be
    // revisited on purpose rather than by accident.
    const pillars = ["channels", "marketing", "crm"] as const;
    for (const [index, vendor] of VENDORS.entries()) {
      const covered = pillars.filter((key) => {
        const table = COMPARISON_TABLES.find((entry) => entry.key === key)!;
        return table.rows.some((row) => row.cells[index]?.kind === "yes");
      });
      expect(covered, `${vendor.name} pillars covered`).toHaveLength(3);
    }
  });

  it("only calls a row a standout when half the field misses it", () => {
    for (const { table: tableKey, key } of standoutRows()) {
      const table = COMPARISON_TABLES.find((entry) => entry.key === tableKey)!;
      const row = table.rows.find((entry) => entry.key === key)!;
      const [ours, ...others] = row.cells;
      expect(ours.kind).toBe("yes");
      expect(
        others.filter((cell) => cell.kind === "no").length,
      ).toBeGreaterThanOrEqual(others.length / 2);
    }
  });
});
