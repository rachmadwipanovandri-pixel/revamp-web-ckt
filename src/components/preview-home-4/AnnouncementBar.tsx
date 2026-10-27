import { Ico } from "./Icon";
import { text } from "./content-types";
import { solar_arrow_right_up_bold } from "./icons";
import Link from "next/link";
import type { Copy4 } from "./content-types";
export function AnnouncementBar({
  copy,
  locale,
}: {
  copy: Copy4["announcement"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <div className="ph4-announce bg-[var(--ph4-console)]">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-center gap-2.5 px-5 py-2 sm:px-8 lg:px-10">
        <span className="ph4-mono shrink-0 rounded-[var(--ph4-r-xs)] bg-[var(--ph4-accent)] px-1.5 py-0.5 text-[0.5625rem] text-white">
          {text(copy.label, en)}
        </span>
        <span className="min-w-0 truncate text-[0.8125rem] text-[var(--ph4-on-console-2)]">
          {text(copy.text, en)}
        </span>
        <Link
          href={text(copy.href, en)}
          className="group inline-flex shrink-0 items-center gap-1 text-[0.8125rem] font-medium text-[var(--ph4-on-console)] hover:text-[var(--ph4-accent)]"
        >
          {text(copy.cta, en)}
          <Ico
            icon={solar_arrow_right_up_bold}
            size={12}
            className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </div>
  );
}
