export const getPageUrl = (href: string): URL => {
  const url = new URL(href);
  url.searchParams.set("page", "true");
  return url;
};
