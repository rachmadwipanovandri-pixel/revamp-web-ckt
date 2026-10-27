import { Ico } from "./Icon";
import { text } from "./content-types";
import { solar_arrow_right_up_bold } from "./icons";
import { Section, SectionHead, Shell } from "./ui";
import Image from "next/image";
import Link from "next/link";
import type { Copy4 } from "./content-types";
export function CaseGrid({
  copy,
  locale,
}: {
  copy: Copy4["cases"];
  locale: string;
}) {
  const en = locale === "en";
  const [featured, ...rest] = copy.items;
  return (
    <Section id="cases" tone="paper" rule={true} labelledBy="ph4-cases-title">
      <Shell>
        <SectionHead
          id="ph4-cases-title"
          index="05"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          accent={copy.accent}
          body={text(copy.body, en)}
        />
        <article
          data-ph4-enter={true}
          className="ph4-case mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        >
          <div className="flex flex-col justify-center gap-2 bg-[var(--ph4-surface)] p-8 lg:p-12">
            <p className="ph4-mono text-[0.625rem] text-[var(--ph4-muted-3)]">
              {text(featured.valueLabel, en)}
            </p>
            <p
              data-ph4-count={text(featured.value, en)}
              className="ph4-display ph4-num text-[clamp(3rem,6vw,4.5rem)]"
            >
              {text(featured.value, en)}
            </p>
            <p className="text-[1.0625rem] font-medium tracking-[-0.012em]">
              {text(featured.result, en)}
            </p>
          </div>
          <div className="flex flex-col gap-5 p-8 lg:p-12">
            <div className="flex items-center gap-3">
              <Image
                src={featured.photo}
                alt={text(featured.alt, en)}
                width={96}
                height={96}
                sizes="48px"
                className="ph4-face ph4-face-lg"
              />
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em]">
                  {featured.name}
                </p>
                <p className="mt-0.5 truncate text-[0.8125rem] text-[var(--ph4-muted)]">
                  {text(featured.role, en)} · {featured.company}
                </p>
              </div>
            </div>
            <blockquote className="ph4-quote">
              “{text(featured.quote, en)}”
            </blockquote>
            <Link
              href={text(featured.href, en)}
              className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[var(--ph4-accent)]"
            >
              {en ? "Read the story" : "Baca ceritanya"}
              <Ico
                icon={solar_arrow_right_up_bold}
                size={14}
                className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </article>
        <div
          data-ph4-stagger={true}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rest.map((entry) => (
            <article
              key={entry.name}
              data-ph4-spot={true}
              className="ph4-case ph4-spot"
            >
              <div className="ph4-case-figure">
                <p className="ph4-mono mb-1.5 text-[0.5625rem] text-[var(--ph4-muted-3)]">
                  {text(entry.valueLabel, en)}
                </p>
                <p
                  data-ph4-count={text(entry.value, en)}
                  className="ph4-display ph4-num text-[clamp(1.75rem,3.2vw,2.35rem)]"
                >
                  {text(entry.value, en)}
                </p>
              </div>
              <div className="ph4-case-body">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={entry.photo}
                    alt={text(entry.alt, en)}
                    width={80}
                    height={80}
                    sizes="40px"
                    className="ph4-face"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[0.875rem] font-semibold tracking-[-0.01em]">
                      {entry.name}
                    </p>
                    <p className="mt-0.5 truncate text-[0.75rem] text-[var(--ph4-muted)]">
                      {text(entry.role, en)} · {entry.company}
                    </p>
                  </div>
                </div>
                <p className="text-[0.9375rem] font-medium tracking-[-0.012em]">
                  {text(entry.result, en)}
                </p>
                <blockquote className="flex-1 text-[0.875rem] leading-[1.6] text-[var(--ph4-muted)]">
                  “{text(entry.quote, en)}”
                </blockquote>
                <Link
                  href={text(entry.href, en)}
                  className="group inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-[var(--ph4-accent)]"
                >
                  {en ? "Read the story" : "Baca ceritanya"}
                  <Ico
                    icon={solar_arrow_right_up_bold}
                    size={14}
                    className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
