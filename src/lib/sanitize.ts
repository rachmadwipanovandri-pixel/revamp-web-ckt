import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes WordPress `content.rendered` before it is dangerouslySet into the
 * article body. Allows the tags a typical WP post uses (headings, lists,
 * tables, figures, code) plus safe iframe embeds (YouTube/Vimeo), and strips
 * everything else.
 *
 * Also enforces on-page SEO hygiene on the body itself:
 * - `h1` is demoted to `h2` (the page title is the only H1)
 * - images get `decoding="async"` and lazy-load once past the first image
 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "a", "ul", "ol", "li", "blockquote", "figure", "figcaption",
      "img", "strong", "em", "b", "i", "u", "s", "code", "pre", "hr", "br",
      "span", "div", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      "iframe",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: [
        "src",
        "srcset",
        "sizes",
        "alt",
        "title",
        "width",
        "height",
        "loading",
        "decoding",
      ],
      iframe: [
        "src", "width", "height", "title", "frameborder",
        "allow", "allowfullscreen",
      ],
      // buildToc stamps ids on h2–h4 for jump links / scroll-spy.
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      "*": ["class"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    transformTags: {
      // Open external links safely in a new tab.
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href?.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        },
      }),
      // Safety net if a post still carries an h1 after buildToc demotion.
      h1: (tagName, attribs) => ({
        tagName: "h2",
        attribs,
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          alt: (attribs.alt ?? "").trim(),
          decoding: attribs.decoding ?? "async",
          // Cover / first image can stay eager; everything else defers so the
          // article cover remains the clear LCP candidate.
          loading: attribs.loading ?? "lazy",
        },
      }),
    },
  });
}
