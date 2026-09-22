import { sanitizePostHtml } from "@/lib/sanitize";

/**
 * Renders sanitized WordPress article HTML with prose styling. Content is
 * cleaned server-side (allowlist) before it is set on the element.
 */
export function PostBody({ html }: { html: string }) {
  return (
    <div
      className={[
        "max-w-none font-numeric text-base leading-relaxed text-foreground",
        "[&_p]:mt-5 [&_p]:text-muted-foreground",
        "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_h4]:mt-6 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground",
        "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_li]:mt-2 [&_li]:text-muted-foreground [&_li]:marker:text-primary",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-dark",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-border",
        "[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-subtle-foreground [&_figure]:my-6",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:text-foreground [&_blockquote]:italic",
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-foreground [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white",
        "[&_code]:rounded [&_code]:bg-surface-subtle [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:my-10 [&_hr]:border-border",
        "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-xl",
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-surface-subtle [&_th]:p-2 [&_th]:text-left",
        "[&_td]:border [&_td]:border-border [&_td]:p-2",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitizePostHtml(html) }}
    />
  );
}
