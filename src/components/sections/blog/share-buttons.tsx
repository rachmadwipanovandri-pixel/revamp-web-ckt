"use client";

import { useState } from "react";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp, mdiLinkedin, mdiLinkVariant } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ShareButtons({
  url,
  title,
  shareLabel,
  copyLabel,
  copiedLabel,
}: {
  url: string;
  title: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: "WhatsApp",
      icon: mdiWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: mdiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const btn =
    "flex size-10 items-center justify-center rounded-full border border-foreground/12 bg-white text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary";

  return (
    <div>
      <p className="eyebrow-rule mb-1 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-primary uppercase">
        {shareLabel}
      </p>
      <div className="mt-3 flex gap-2">
        {targets.map((t) => (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.label}
            className={btn}
          >
            <Icon icon={t.icon} className="size-5" />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? copiedLabel : copyLabel}
          className={cn(
            btn,
            copied && "border-primary/40 bg-primary/5 text-primary",
          )}
        >
          <Icon icon={mdiLinkVariant} className="size-5" />
        </button>
      </div>
      {copied && (
        <p className="mt-2 font-numeric text-xs text-primary">{copiedLabel}</p>
      )}
    </div>
  );
}
