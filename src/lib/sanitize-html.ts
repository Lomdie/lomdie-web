import sanitizeHtml from "sanitize-html";
import { cacheLife } from "next/cache";

const allowedTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "mark",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "pre",
  "code",
  "span",
  "div",
  "oembed",
  "iframe",
];

export async function sanitizeContentHtml(html: string): Promise<string> {
  "use cache";
  cacheLife("max");

  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      "*": ["class", "style"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "srcset"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
      oembed: ["url"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder"],
    },
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: {
      img: ["https", "data"],
    },
    allowedStyles: {
      "*": {
        color: [/^.*$/],
        "background-color": [/^.*$/],
        "text-align": [/^.*$/],
        "font-size": [/^.*$/],
        "font-family": [/^.*$/],
      },
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
