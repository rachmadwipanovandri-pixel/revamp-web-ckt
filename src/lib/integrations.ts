import type { IconifyIcon } from "@iconify/react/offline";
import type { Locale } from "@/i18n/routing";
import {
  logosInstagramIcon,
  logosMessenger,
  logosMetaIcon,
  logosTelegram,
  logosTiktokIcon,
  logosWhatsappIcon,
  mdiApi,
  mdiEmail,
  mdiMessageText,
  mdiWebhook,
} from "@/lib/icons";

type L10n = Record<Locale, string>;

export type Integration = {
  id: string;
  /** Brand names repeat across locales; only generic labels differ. */
  name: L10n;
  /**
   * Third-party marks come from the `logos` set and carry their own colours;
   * our own capabilities (live chat, email, API, webhook) are `mdi` glyphs
   * drawn in currentColor, so a surface can tint them to the brand and the
   * vendor logos stay untouched. That difference is the point: a viewer can
   * tell what belongs to someone else from what belongs to us.
   */
  icon: IconifyIcon;
  note: L10n;
};

export type IntegrationGroup = {
  id: string;
  title: L10n;
  body: L10n;
  items: Integration[];
};

/**
 * What Cekat.AI connects to. Deliberately shorter than a logo wall: every
 * entry here is something the site already claims elsewhere, in the comparison
 * matrix's channel rows, the CAPI feature page, or the Open API page. Vendors
 * we do not integrate with stay off the list, however good they would look in
 * a grid, because a logo on this page reads as a promise.
 */
export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    id: "channels",
    title: { id: "Channel Percakapan", en: "Conversation Channels" },
    body: {
      id: "Setiap channel tempat pelangganmu chat, masuk ke satu inbox dengan riwayat yang menyatu.",
      en: "Every channel your customers message on, landing in one inbox with a single shared history.",
    },
    items: [
      {
        id: "whatsapp",
        name: { id: "WhatsApp Business API", en: "WhatsApp Business API" },
        icon: logosWhatsappIcon,
        note: {
          id: "Nomor bisnismu yang sekarang, plus centang hijau bila lolos verifikasi Meta",
          en: "Your existing business number, with the green tick once Meta verification passes",
        },
      },
      {
        id: "instagram",
        name: { id: "Instagram", en: "Instagram" },
        icon: logosInstagramIcon,
        note: { id: "DM dan komentar", en: "DMs and comments" },
      },
      {
        id: "tiktok",
        name: { id: "TikTok", en: "TikTok" },
        icon: logosTiktokIcon,
        note: { id: "DM dan komentar", en: "DMs and comments" },
      },
      {
        id: "messenger",
        name: { id: "Facebook Messenger", en: "Facebook Messenger" },
        icon: logosMessenger,
        note: { id: "Pesan halaman bisnis", en: "Business page messages" },
      },
      {
        id: "telegram",
        name: { id: "Telegram", en: "Telegram" },
        icon: logosTelegram,
        note: { id: "Chat pribadi dan grup", en: "Direct and group chats" },
      },
      {
        id: "livechat",
        name: { id: "Live chat website", en: "Website live chat" },
        icon: mdiMessageText,
        note: {
          id: "Widget yang dipasang di halaman mana pun",
          en: "A widget you can drop on any page",
        },
      },
      {
        id: "email",
        name: { id: "Email", en: "Email" },
        icon: mdiEmail,
        note: { id: "Masuk ke inbox yang sama", en: "Into the same inbox" },
      },
    ],
  },
  {
    id: "ads",
    title: { id: "Platform Iklan", en: "Ad Platforms" },
    body: {
      id: "Konversi nyata dari chat dikirim balik ke platform iklan lewat Conversion API, jadi optimasi berdiri di atas penjualan, bukan klik.",
      en: "Real conversions from chat flow back to the ad platforms through the Conversion API, so optimization stands on sales rather than clicks.",
    },
    items: [
      {
        id: "meta-ads",
        name: { id: "Meta", en: "Meta" },
        icon: logosMetaIcon,
        note: {
          id: "Conversions API, plus Click-to-WhatsApp Ads",
          en: "Conversions API, plus Click-to-WhatsApp Ads",
        },
      },
      {
        id: "tiktok-ads",
        name: { id: "TikTok", en: "TikTok" },
        icon: logosTiktokIcon,
        note: {
          id: "Events API untuk konversi chat",
          en: "Events API for chat conversions",
        },
      },
    ],
  },
  {
    id: "systems",
    title: { id: "Sistem Milikmu Sendiri", en: "Your Own Systems" },
    body: {
      id: "Stack yang sudah kamu pakai tetap dipakai. AI bisa membaca dan bertindak di sistemmu saat percakapan berlangsung.",
      en: "The stack you already run stays in place. The AI can read from and act in your systems while a conversation is happening.",
    },
    items: [
      {
        id: "open-api",
        name: { id: "Open API", en: "Open API" },
        icon: mdiApi,
        note: {
          id: "Hubungkan ERP, sistem gudang, atau database internal",
          en: "Connect an ERP, warehouse system, or internal database",
        },
      },
      {
        id: "webhook",
        name: { id: "Webhook", en: "Webhook" },
        icon: mdiWebhook,
        note: {
          id: "Kirim event keluar begitu sesuatu terjadi",
          en: "Push events out the moment something happens",
        },
      },
      {
        id: "channel-api",
        name: { id: "API Channel", en: "Channel API" },
        icon: mdiMessageText,
        note: {
          id: "Bawa channel apa pun ke inbox terpadu",
          en: "Bring any channel into the unified inbox",
        },
      },
    ],
  },
];

/** Flat list for the homepage teaser, which shows marks rather than groups. */
export const TEASER_INTEGRATIONS: Integration[] = [
  ...INTEGRATION_GROUPS[0].items,
  ...INTEGRATION_GROUPS[1].items.filter((item) => item.id !== "tiktok-ads"),
  ...INTEGRATION_GROUPS[2].items.filter((item) => item.id !== "channel-api"),
];
