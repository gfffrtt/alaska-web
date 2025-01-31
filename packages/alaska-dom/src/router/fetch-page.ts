import { getPageUrl } from "./get-page-url";

export const fetchPage = async (
  href: string,
  {
    signal,
    onPageLoad,
    onPartialLoad,
  }: {
    signal: AbortSignal;
    onPageLoad: (html: string) => void;
    onPartialLoad: (html: string) => void;
  }
): Promise<void> => {
  const url = getPageUrl(href);

  try {
    const response = await fetch(url, { signal });

    if (!response.body) throw new Error("No response body found");

    let isFirtChunk = false;
    const decoder = new TextDecoder();
    for await (const chunk of response.body) {
      const html = decoder.decode(chunk);
      if (!isFirtChunk) {
        onPageLoad(html);
        isFirtChunk = true;
      } else {
        onPartialLoad(html);
      }
    }
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
  }
};
