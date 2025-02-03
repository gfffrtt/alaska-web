import { router } from "./router/router";

export const server = () => {
  router();
};

export const getProps = <T>(id: string): T =>
  JSON.parse(document.getElementById(id)!.innerText);
