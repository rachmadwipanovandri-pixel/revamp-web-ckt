import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes WordPress `content.rendered` before it is dangerouslySet into the
 * article body. Allows the tags a typical WP post uses (headings, lists,
 * tables, figures, code) plus safe iframe embeds (YouTube/Vimeo), and strips
 * everything else.
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
      img: ["src", "srcset", "alt", "width", "height", "loading"],
      iframe: [
        "src", "width", "height", "title", "frameborder",
        "allow", "allowfullscreen",
      ],
      h2: ["id"],
      h3: ["id"],
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
    },
  });
}
