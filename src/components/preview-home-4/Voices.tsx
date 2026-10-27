import { text } from "./content-types";
import { DragRail } from "./DragRail";
import { Eyebrow, Section, Shell, SplitHeading } from "./ui";
import type { Copy4, L } from "./content-types";

const EXTRA_QUOTES: {
  quote: L;
  name: string;
  role: L;
  company: string;
}[] = [
  {
    quote: {
      id: "Dulu satu chat bisa kami balas lebih dari 20 menit. Sekarang di bawah 2 menit.",
      en: "One chat used to take over 20 minutes to answer. Now under two.",
    },
    name: "Gamal",
    role: { id: "Founder & CEO", en: "Founder & CEO" },
    company: "Putiih Skin Clinic",
  },
  {
    quote: {
      id: "Peluang closing-nya sangat tinggi.",
      en: "The closing potential is enormous.",
    },
    name: "Wiji Astuti",
    role: { id: "Head of Customer Experience", en: "Head of Customer Experience" },
    company: "Rumah Zakat",
  },
  {
    quote: {
      id: "Respon pelanggan jadi jauh lebih cepat.",
      en: "Customer responses became much faster.",
    },
    name: "Silcia Brenda",
    role: { id: "CEO & Founder", en: "CEO & Founder" },
    company: "Moir Salon",
  },
];

export function Voices({
  copy,
  locale,
}: {
  copy: Copy4["voices"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section id="voices" tone="paper" rule={true} labelledBy="ph4-voices-title">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">
          <div data-ph4-split={true} className="flex flex-col gap-3">
            <Eyebrow>
              <span className="ph4-mono mr-3 text-[0.625rem]">10</span>
              {text(copy.eyebrow, en)}
            </Eyebrow>
            <SplitHeading
              id="ph4-voices-title"
              as="h2"
              text={copy.heading}
              accent={copy.accent}
              size="display-2"
              className="text-[clamp(1.35rem,2.4vw,1.75rem)]"
            />
          </div>
          <div className="flex flex-col gap-10">
            <figure data-ph4-enter={true} className="flex flex-col gap-6">
              {/* The quote is set at display size, so it gets the same
                  word-by-word reveal as a heading — `size="none"` leaves the
                  scale to `className`, which is the point: a pull quote is
                  typographic, not a heading with different content. */}
              <blockquote>
                <SplitHeading
                  as="p"
                  size="none"
                  text={`“${text(copy.quote, en)}”`}
                  className="ph4-display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1.18] tracking-[-0.03em] text-[var(--ph4-ink)]"
                />
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-[var(--ph4-line)] pt-5">
                <span className="ph4-mono text-[var(--ph4-accent)]">
                  {copy.name}
                </span>
                <span
                  aria-hidden={true}
                  className="h-3 w-px bg-[var(--ph4-line-2)]"
                />
                <span className="text-[0.875rem] text-[var(--ph4-muted)]">
                  {text(copy.role, en)} · {copy.company}
                </span>
              </figcaption>
            </figure>
            <DragRail
              label={text(copy.eyebrow, en)}
              prevLabel={en ? "Previous testimonials" : "Testimoni sebelumnya"}
              nextLabel={en ? "Next testimonials" : "Testimoni berikutnya"}
            >
              {EXTRA_QUOTES.map((q) => (
                <li
                  key={q.name}
                  className="flex flex-col rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-white)] p-5 lg:flex-1"
                >
                  <blockquote className="text-[0.9375rem] leading-[1.55] text-[var(--ph4-muted-2)]">
                    “{text(q.quote, en)}”
                  </blockquote>
                  <footer className="mt-4 border-t border-[var(--ph4-line)] pt-3 text-[0.75rem] text-[var(--ph4-muted-3)]">
                    <span className="font-semibold text-[var(--ph4-ink)]">
                      {q.name}
                    </span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    {text(q.role, en)} · {q.company}
                  </footer>
                </li>
              ))}
            </DragRail>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
