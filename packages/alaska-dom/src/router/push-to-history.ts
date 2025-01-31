export const pushToHistory = (href: string) => {
  window.history.pushState({ href }, "", href);
};
