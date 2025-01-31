export const resetBody = () => {
  // Get node that stores all the content of the page with templates and scripts
  const main = document.querySelector("main");
  if (!main) throw new Error("No main element found");
  // Replace the body to only contain the main content
  document.body.innerHTML = main.outerHTML;
};
