import type { Metadata } from "next";
import { InboxLive } from "@/components/preview-inbox/InboxLive";

export const metadata: Metadata = {
  title: "Live Inbox — Cekat.AI",
  description:
    "Sample inbox view: chats arriving from WhatsApp, Instagram, TikTok and Telegram, answered in seconds.",
  // Draft: never indexed, never followed.
  robots: { index: false, follow: false },
};

/**
 * /preview-inbox — the readme.com request-log element, re-drawn as a Cekat.AI
 * inbox feed. Standalone draft route (no site chrome), same pattern as the
 * other preview-* pages.
 */
export default async function PreviewInboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <InboxLive locale={locale} />;
}
