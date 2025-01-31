import { router } from "./router/router";

export const render = () => {
  router();
  console.log("Client attached");
};
