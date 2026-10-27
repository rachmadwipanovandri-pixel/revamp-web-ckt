import { text } from "./content-types";
import { Action, Eyebrow, Section, Shell, SplitHeading } from "./ui";
import { Fragment } from "react";
import type { Copy4 } from "./content-types";
/**
 * The API band.
 *
 * Three of the six references carry a code block — aira's `GET /v1/companies/{id}`,
 * synthesia's `POST /v2/videos`, vapi's integration grid — and the pattern they
 * share is that the snippet is *short, real and copyable*. It is not a screenshot
 * of a console and it is not a decorative terminal: it is the call, the three
 * fields that matter, and a link out.
 *
 * The endpoint below is illustrative and labelled as such in the note beneath it.
 * Shipping a fictional endpoint as if it were documented would be a small lie in
 * a page whose whole argument is that its numbers are real, and it would be the
 * one thing on the page a developer would actually test.
 */ const SNIPPET = [
  {
    method: "POST",
    tone: "accent",
    path: "/v1/messages",
  },
  {
    body: "token",
    tone: "plain",
    value: "{ to, channel, text }",
  },
  {
    body: "body",
    tone: "plain",
    value: '"to": "+6281…",',
  },
  {
    body: "body",
    tone: "plain",
    value: '"channel": "whatsapp",',
  },
  {
    body: "body",
    tone: "plain",
    value: '"text": "Halo Kak, navy size L ready?"',
  },
  {
    body: "return",
    tone: "accent",
    value: "201 · queued · 8s first reply",
  },
];
export function ApiBand({
  copy,
  locale,
}: {
  copy: Copy4["api"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section id="api" tone="console" rule={true} labelledBy="ph4-api-title">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div data-ph4-enter={true} className="flex flex-col gap-4">
            <Eyebrow tone="light">{text(copy.eyebrow, en)}</Eyebrow>
            <SplitHeading
              id="ph4-api-title"
              as="h2"
              text={copy.heading}
              accent={copy.accent}
              size="display-2"
              className="text-[clamp(1.75rem,4vw,2.75rem)] text-[var(--ph4-on-console)] [&_span_span]:!text-[var(--ph4-on-console)]"
            />
            <p className="max-w-[34rem] text-[0.9375rem] leading-[1.6] text-[var(--ph4-on-console-2)]">
              {text(copy.body, en)}
            </p>
            <p className="ph4-mono text-[0.5625rem] leading-[1.6] text-[var(--ph4-on-console-3)]">
              {text(copy.note, en)}
            </p>
            <div className="pt-1">
              <Action
                href={en ? "/en/integrations" : "/integrasi"}
                variant="ghost-invert"
                arrow={true}
              >
                {text(copy.cta, en)}
              </Action>
            </div>
          </div>
          <div
            data-ph4-enter={true}
            className="overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-console-line)] bg-[var(--ph4-console-2)]"
          >
            <div className="flex items-center gap-2 border-b border-[var(--ph4-console-line)] px-4 py-2.5">
              <span aria-hidden={true} className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
              </span>
              <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
                api.cekat.ai · {en ? "illustrative" : "ilustrasi"}
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 text-[0.75rem] leading-[1.75]">
              <code className="ph4-mono block text-left normal-case tracking-normal">
                {SNIPPET.map((line, i) => (
                  <span key={i} className="block">
                    {line.method ? (
                      <>
                        <span className="text-[var(--ph4-on-console-3)]">
                          {line.method}{" "}
                        </span>
                        <span className="text-[var(--ph4-accent)]">
                          {line.path}
                        </span>
                      </>
                    ) : line.body === "token" ? (
                      <span className="text-[var(--ph4-on-console-3)]">
                        {line.value}
                      </span>
                    ) : line.body === "return" ? (
                      <span className="text-[var(--ph4-accent)]">
                        → {line.value}
                      </span>
                    ) : (
                      <span className="text-[var(--ph4-on-console-2)]">
                        {line.value}
                      </span>
                    )}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
