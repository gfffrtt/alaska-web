import { appendPartial } from "../dom/append-partial";
import { CONTENT_ELEMENT } from "./constants";
import { fetchPage } from "./fetch-page";
import { resetBody } from "../dom/reset-body";

export const replacePage = async (
  signal: AbortSignal,
  href: string
): Promise<void> => {
  resetBody();

  const domParser = new DOMParser();

  await fetchPage(href, {
    signal,
    onPageLoad: (html) => {
      const content = document.querySelector(CONTENT_ELEMENT);
      if (!content) throw new Error("No content element found");
      content.innerHTML = html;
    },
    onPartialLoad: (html) => {
      const nodes = domParser.parseFromString(html, "text/html");
      nodes.head.childNodes.forEach(appendPartial);
    },
  });
};
