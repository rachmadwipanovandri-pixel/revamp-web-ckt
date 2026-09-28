import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type {
  EventItem,
  FaqSection,
  HeroSection,
  ProblemsSection,
  RegisterSection,
  SpeakersSection,
  StatsSection,
  TakeawaysSection,
} from "@/lib/events/types";
import { RegisterForm } from "./register-form";

/** Small uppercase eyebrow used above every section heading. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-numeric text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
      {children}
    </p>
  );
}

function SectionHead({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  if (!eyebrow && !heading && !intro) return null;
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {heading && (
        <h2 className="mt-3 text-2xl leading-tight font-bold text-foreground sm:text-3xl">
          {heading}
        </h2>
      )}
      {intro && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}
    </div>
  );
}

function HeroSectionView({ section, event }: { section: HeroSection; event: EventItem }) {
  const meta = [
    event.dateLabel && `📅 ${event.dateLabel}`,
    event.timeLabel && `🕑 ${event.timeLabel}`,
    event.locationLabel && `💻 ${event.locationLabel}`,
    event.priceLabel && `🎟️ ${event.priceLabel}`,
  ].filter(Boolean) as string[];

  return (
    <section className="relative overflow-hidden bg-ink-void pt-28 text-white lg:pt-32">
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]" />
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="animate-orb-drift absolute top-[15%] right-[8%] h-80 w-80 rounded-full bg-primary/35 blur-[110px]"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-24">
        <div>
          {section.eyebrow && (
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur">
              <span aria-hidden className="animate-pulse-soft size-1.5 rounded-full bg-sky-300" />
              {section.eyebrow}
            </p>
          )}

          {section.quote && (
            <p className="mb-3 text-lg font-semibold text-sky-300 italic">
              {section.quote}
            </p>
          )}

          <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
            {section.headline || event.title}
          </h1>

          {(section.body || event.excerpt) && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-50/85 lg:text-lg">
              {section.body || event.excerpt}
            </p>
          )}

          {meta.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-2">
              {meta.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-numeric text-[0.72rem] font-semibold tracking-[0.08em] text-sky-100 uppercase backdrop-blur"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}

          <a
            href="#daftar"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f45a3]"
          >
            {section.ctaLabel || "Daftar Sekarang"}
          </a>
        </div>

        {section.image && (
          <div className="relative aspect-3/2 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src={section.image}
              alt={section.imageAlt || event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white" />
    </section>
  );
}

function ProblemsSectionView({ section }: { section: ProblemsSection }) {
  if (section.items.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <div className="grid gap-5 sm:grid-cols-2">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              {item.icon && (
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/8 text-xl">
                  <span aria-hidden>{item.icon}</span>
                </div>
              )}
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TakeawaysSectionView({ section }: { section: TakeawaysSection }) {
  if (section.items.length === 0) return null;
  return (
    <section className="bg-surface-subtle py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <ol className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {section.items.map((item, index) => (
            <li key={item.id} className="flex gap-5 p-6">
              <span className="font-numeric text-2xl font-bold text-primary/30 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SpeakersSectionView({ section }: { section: SpeakersSection }) {
  if (section.items.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={section.eyebrow} heading={section.heading} intro={section.intro} />
        <div className="flex flex-wrap justify-center gap-8">
          {section.items.map((speaker) => (
            <div key={speaker.id} className="w-56 text-center">
              <div className="relative mx-auto size-40 overflow-hidden rounded-full bg-surface-muted ring-4 ring-primary/10">
                {speaker.photo ? (
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-muted-foreground">
                    {speaker.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{speaker.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{speaker.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSectionView({ section }: { section: StatsSection }) {
  if (section.items.length === 0) return null;
  return (
    <section className="relative isolate bg-ink-void py-16 text-white lg:py-20">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {section.eyebrow && (
            <p className="font-numeric text-[11px] font-semibold tracking-[0.16em] text-sky-300 uppercase">
              {section.eyebrow}
            </p>
          )}
          {section.heading && (
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{section.heading}</h2>
          )}
        </div>
        <div className="grid gap-8 text-center sm:grid-cols-3">
          {section.items.map((stat) => (
            <div key={stat.id}>
              <p className="text-4xl font-bold text-sky-300 lg:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-sky-50/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSectionView({ section }: { section: FaqSection }) {
  if (section.items.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
        <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
          {section.items.map((item) => (
            <details key={item.id} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegisterSectionView({ section, event }: { section: RegisterSection; event: EventItem }) {
  return (
    <section id="daftar" className="scroll-mt-24 bg-surface-subtle py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {section.quote && (
            <p className="mb-6 text-center text-lg font-semibold text-primary italic">
              {section.quote}
            </p>
          )}
          <RegisterForm event={event} section={section} />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders an event's sections in the stored order — the admin's drag & drop
 * simply rewrites that array.
 */
export function EventLanding({ event }: { event: EventItem }) {
  return (
    <article>
      {event.sections
        .filter((section) => section.visible)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <HeroSectionView key={section.id} section={section} event={event} />;
            case "problems":
              return <ProblemsSectionView key={section.id} section={section} />;
            case "takeaways":
              return <TakeawaysSectionView key={section.id} section={section} />;
            case "speakers":
              return <SpeakersSectionView key={section.id} section={section} />;
            case "stats":
              return <StatsSectionView key={section.id} section={section} />;
            case "faq":
              return <FaqSectionView key={section.id} section={section} />;
            case "register":
              return (
                <RegisterSectionView key={section.id} section={section} event={event} />
              );
          }
        })}
      {/* Fallback when nothing visible is left: still offer a way back. */}
      {!event.sections.some((s) => s.visible && s.type === "hero") && (
        <section className="pt-28 pb-8">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
            <Link
              href="/events"
              className="mt-4 inline-block text-sm font-semibold text-primary"
            >
              ← Kembali ke daftar event
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
