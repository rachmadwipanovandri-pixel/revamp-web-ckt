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

type L10n = Partial<Record<Locale, string>> & { en: string; id: string };

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
    title: {
      id: "Channel Percakapan",
      en: "Conversation Channels",
      cn: "对话渠道",
      jp: "会話チャネル",
      kr: "대화 채널",
    },
    body: {
      id: "Setiap channel tempat pelangganmu chat, masuk ke satu inbox dengan riwayat yang menyatu.",
      en: "Every channel your customers message on, landing in one inbox with a single shared history.",
      cn: "客户发消息的每个渠道都汇入一个收件箱，共享完整历史记录。",
      jp: "お客様からのメッセージをすべてのチャネルから1つの受信トレイに集約し、履歴を共有します。",
      kr: "고객이 메시지를 보내는 모든 채널을 하나의 받은 편지함으로 모아 전체 기록을 공유합니다.",
    },
    items: [
      {
        id: "whatsapp",
        name: { id: "WhatsApp Business API", en: "WhatsApp Business API" },
        icon: logosWhatsappIcon,
        note: {
          id: "Nomor bisnismu yang sekarang, plus centang hijau bila lolos verifikasi Meta",
          en: "Your existing business number, with the green tick once Meta verification passes",
          cn: "使用现有企业号码，Meta 验证通过后即可显示绿色认证标记",
          jp: "既存のビジネス番号を使い、Metaの認証後は緑のチェックが表示されます",
          kr: "기존 비즈니스 번호를 사용하며 Meta 인증을 통과하면 초록색 인증 표시가 붙습니다",
        },
      },
      {
        id: "instagram",
        name: { id: "Instagram", en: "Instagram" },
        icon: logosInstagramIcon,
        note: {
          id: "DM dan komentar",
          en: "DMs and comments",
          cn: "私信和评论",
          jp: "DMとコメント",
          kr: "DM 및 댓글",
        },
      },
      {
        id: "tiktok",
        name: { id: "TikTok", en: "TikTok" },
        icon: logosTiktokIcon,
        note: {
          id: "DM dan komentar",
          en: "DMs and comments",
          cn: "私信和评论",
          jp: "DMとコメント",
          kr: "DM 및 댓글",
        },
      },
      {
        id: "messenger",
        name: { id: "Facebook Messenger", en: "Facebook Messenger" },
        icon: logosMessenger,
        note: {
          id: "Pesan halaman bisnis",
          en: "Business page messages",
          cn: "企业主页消息",
          jp: "ビジネスページのメッセージ",
          kr: "비즈니스 페이지 메시지",
        },
      },
      {
        id: "telegram",
        name: { id: "Telegram", en: "Telegram" },
        icon: logosTelegram,
        note: {
          id: "Chat pribadi dan grup",
          en: "Direct and group chats",
          cn: "私聊和群聊",
          jp: "個人・グループチャット",
          kr: "개인 및 그룹 채팅",
        },
      },
      {
        id: "livechat",
        name: { id: "Live chat website", en: "Website live chat" },
        icon: mdiMessageText,
        note: {
          id: "Widget yang dipasang di halaman mana pun",
          en: "A widget you can drop on any page",
          cn: "可放置在任意页面上的小组件",
          jp: "どのページにも設置できるウィジェット",
          kr: "어느 페이지에나 추가할 수 있는 위젯",
        },
      },
      {
        id: "email",
        name: { id: "Email", en: "Email" },
        icon: mdiEmail,
        note: {
          id: "Masuk ke inbox yang sama",
          en: "Into the same inbox",
          cn: "进入同一个收件箱",
          jp: "同じ受信トレイに集約",
          kr: "같은 받은 편지함으로 통합",
        },
      },
    ],
  },
  {
    id: "ads",
    title: {
      id: "Platform Iklan",
      en: "Ad Platforms",
      cn: "广告平台",
      jp: "広告プラットフォーム",
      kr: "광고 플랫폼",
    },
    body: {
      id: "Konversi nyata dari chat dikirim balik ke platform iklan lewat Conversion API, jadi optimasi berdiri di atas penjualan, bukan klik.",
      en: "Real conversions from chat flow back to the ad platforms through the Conversion API, so optimization stands on sales rather than clicks.",
      cn: "通过 Conversion API 将聊天产生的真实转化回传广告平台，让优化依据销售而不是点击。",
      jp: "Conversion APIを通じてチャットからの実際のコンバージョンを広告プラットフォームへ返し、クリックではなく売上を基準に最適化します。",
      kr: "Conversion API를 통해 채팅에서 발생한 실제 전환을 광고 플랫폼으로 보내 클릭이 아닌 매출을 기준으로 최적화합니다.",
    },
    items: [
      {
        id: "meta-ads",
        name: { id: "Meta", en: "Meta" },
        icon: logosMetaIcon,
        note: {
          id: "Conversions API, plus Click-to-WhatsApp Ads",
          en: "Conversions API, plus Click-to-WhatsApp Ads",
          cn: "Conversions API，以及点击进入 WhatsApp 的广告",
          jp: "Conversions APIとClick-to-WhatsApp広告",
          kr: "Conversions API 및 WhatsApp 연결 광고",
        },
      },
      {
        id: "tiktok-ads",
        name: { id: "TikTok", en: "TikTok" },
        icon: logosTiktokIcon,
        note: {
          id: "Events API untuk konversi chat",
          en: "Events API for chat conversions",
          cn: "用于聊天转化的 Events API",
          jp: "チャットコンバージョン向けEvents API",
          kr: "채팅 전환을 위한 Events API",
        },
      },
    ],
  },
  {
    id: "systems",
    title: {
      id: "Sistem Milikmu Sendiri",
      en: "Your Own Systems",
      cn: "你的自有系统",
      jp: "自社システム",
      kr: "자체 시스템",
    },
    body: {
      id: "Stack yang sudah kamu pakai tetap dipakai. AI bisa membaca dan bertindak di sistemmu saat percakapan berlangsung.",
      en: "The stack you already run stays in place. The AI can read from and act in your systems while a conversation is happening.",
      cn: "保留你正在使用的技术栈。对话进行时，AI 可以读取并操作你的系统。",
      jp: "現在のスタックをそのまま使えます。会話中にAIがシステムを読み取り、操作できます。",
      kr: "현재 사용하는 스택을 그대로 유지하세요. 대화 중 AI가 시스템을 읽고 작업할 수 있습니다.",
    },
    items: [
      {
        id: "open-api",
        name: { id: "Open API", en: "Open API" },
        icon: mdiApi,
        note: {
          id: "Hubungkan ERP, sistem gudang, atau database internal",
          en: "Connect an ERP, warehouse system, or internal database",
          cn: "连接 ERP、仓储系统或内部数据库",
          jp: "ERP、倉庫システム、社内データベースを接続",
          kr: "ERP, 창고 시스템 또는 내부 데이터베이스 연결",
        },
      },
      {
        id: "webhook",
        name: { id: "Webhook", en: "Webhook" },
        icon: mdiWebhook,
        note: {
          id: "Kirim event keluar begitu sesuatu terjadi",
          en: "Push events out the moment something happens",
          cn: "事件发生时立即向外推送",
          jp: "何かが起きた瞬間にイベントを外部へ送信",
          kr: "이벤트가 발생하는 즉시 외부로 전송",
        },
      },
      {
        id: "channel-api",
        name: { id: "API Channel", en: "Channel API" },
        icon: mdiMessageText,
        note: {
          id: "Bawa channel apa pun ke inbox terpadu",
          en: "Bring any channel into the unified inbox",
          cn: "将任意渠道接入统一收件箱",
          jp: "あらゆるチャネルを統合受信トレイへ",
          kr: "모든 채널을 통합 받은 편지함으로 연결",
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
