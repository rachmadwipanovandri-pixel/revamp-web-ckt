import { Fragment } from "react";

/**
 * Blue text-marquee band after the hero: the product's vocabulary drifting
 * past in one line. The list is rendered twice inside a single track so a
 * `-50%` loop joins seamlessly; the duplicate half is `aria-hidden` so
 * assistive tech reads the keywords once.
 */
const ID_WORDS = [
  "WhatsApp Business API",
  "Instagram DM",
  "TikTok Shop",
  "Omnichannel CRM",
  "AI Agent 24/7",
  "Broadcast Tersegmentasi",
  "Katalog & Order",
  "Pembayaran QRIS",
  "Meta Business Partner",
];

const EN_WORDS = [
  "WhatsApp Business API",
  "Instagram DMs",
  "TikTok Shop",
  "Omnichannel CRM",
  "24/7 AI Agent",
  "Segmented Broadcasts",
  "Catalog & Orders",
  "QRIS Payments",
  "Meta Business Partner",
];

export function MarqueeBand({ locale }: { locale: string }) {
  const words = locale === "en" ? EN_WORDS : ID_WORDS;
  const halves = [false, true];
  return (
    <div className="ph4-marquee-band">
      <div className="ph4-marquee-track">
        {halves.map((hidden) => (
          <div
            key={hidden ? "b" : "a"}
            aria-hidden={hidden || undefined}
            className="ph4-marquee-group"
          >
            {words.map((word) => (
              <Fragment key={word}>
                <span className="ph4-marquee-word">{word}</span>
                <span aria-hidden="true" className="ph4-marquee-dot" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
