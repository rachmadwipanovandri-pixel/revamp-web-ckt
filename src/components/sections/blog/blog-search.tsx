"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { lucideSearch, lucideX } from "@/lib/icons";

/**
 * Blog search box. Submits to /blog?q=… so results are server-rendered and the
 * URL is shareable — which is also what the WebSite SearchAction advertises.
 */
export function BlogSearch({
  initialQuery = "",
  placeholder,
  label,
  clearLabel,
}: {
  initialQuery?: string;
  placeholder: string;
  label: string;
  clearLabel: string;
}) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  function submit(query: string) {
    const trimmed = query.trim();
    router.push(
      trimmed ? { pathname: "/blog", query: { q: trimmed } } : "/blog",
    );
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
      className="relative w-full sm:max-w-xs"
    >
      <Icon
        icon={lucideSearch}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label={label}
        placeholder={placeholder}
        className="w-full rounded-full border border-foreground/12 bg-white py-2.5 pr-10 pl-10 font-numeric text-sm text-foreground shadow-[0_10px_28px_-24px_rgba(16,24,40,0.5)] transition-all outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:shadow-[0_14px_32px_-24px_rgba(19,82,191,0.55)]"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => {
            setValue("");
            submit("");
          }}
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <Icon icon={lucideX} className="size-4" />
        </button>
      )}
    </form>
  );
}
