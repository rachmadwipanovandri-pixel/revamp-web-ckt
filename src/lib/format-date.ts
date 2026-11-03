export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(
    locale === "id"
      ? "id-ID"
      : locale === "cn"
        ? "zh-CN"
        : locale === "jp"
          ? "ja-JP"
          : locale === "kr"
            ? "ko-KR"
            : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(iso));
}
