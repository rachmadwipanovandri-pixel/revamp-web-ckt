import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  COMPARISON_TABLES,
  VENDORS,
  type ComparisonTable,
} from "@/lib/comparison";
import { ComparisonCell, VendorHeaderCell } from "./comparison-cell";
import { cn } from "@/lib/utils";

/**
 * One capability table. Scrolls horizontally rather than wrapping: nine columns
 * cannot be made legible on a phone, and a table that reflows into stacked
 * cards loses the row-by-row comparison that is the whole point.
 */
async function Table({
  table,
  locale,
}: {
  table: ComparisonTable;
  locale: Locale;
}) {
  const t = await getTranslations(`comparison.tables.${table.key}`);

  return (
    <section className="mt-14 first:mt-0">
      <h2 className="font-numeric text-xl font-semibold text-foreground">
        {t("heading")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {t("intro")}
      </p>

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-surface-subtle p-4 text-sm font-semibold text-foreground"
              >
                {t("heading")}
              </th>
              {VENDORS.map((vendor) => (
                <th
                  key={vendor.id}
                  scope="col"
                  className={cn(
                    "p-4 text-center align-middle",
                    vendor.isUs && "bg-primary/10",
                  )}
                >
                  <VendorHeaderCell
                    name={vendor.name}
                    logo={vendor.logo}
                    isUs={vendor.isUs}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-border last:border-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white p-4 text-sm font-normal text-foreground"
                >
                  {t(`rows.${row.key}`)}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={VENDORS[index].id}
                    className={cn(
                      "p-4 text-center align-middle",
                      VENDORS[index].isUs && "bg-primary/[0.06]",
                    )}
                  >
                    <ComparisonCell cell={cell} locale={locale} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export async function ComparisonMatrix({ locale }: { locale: Locale }) {
  return (
    <>
      {COMPARISON_TABLES.map((table) => (
        <Table key={table.key} table={table} locale={locale} />
      ))}
    </>
  );
}
