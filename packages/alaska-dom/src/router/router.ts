import { pushToHistory } from "./push-to-history";
import { replacePage } from "./replace-page";

export const router = () => {
  let popStateAbortController: AbortController | null = null;
  window.addEventListener("popstate", async (event) => {
    if (popStateAbortController) popStateAbortController.abort();
    const task = new AbortController();
    popStateAbortController = task;
    const { signal } = task;
    event.preventDefault();
    const path = window.location.href;
    replacePage(signal, path).finally(() => {
      if (popStateAbortController !== task) return;
      popStateAbortController = null;
    });
  });

  let clickAbortController: AbortController | null = null;
  window.addEventListener("click", async (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      if (clickAbortController) clickAbortController.abort();
      const task = new AbortController();
      clickAbortController = task;
      const { signal } = task;
      event.preventDefault();
      const path = event.target.href;
      replacePage(signal, path).finally(() => {
        if (clickAbortController !== task) return;
        clickAbortController = null;
        pushToHistory(path);
      });
    }
  });
};
