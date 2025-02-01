import { select, text } from "@clack/prompts";

export const getInputs = async () => {
  const repoName = await text({
    message: "What should the project be called",
    placeholder: "my-app",
  });

  const templateType = await select({
    message: "Pick a template to get started.",
    options: [
      { value: "js", label: "Vanilla JS" },
      { value: "react", label: "React" },
      { value: "solid", label: "Solid" },
      { value: "elm", label: "Elm" },
    ],
  });

  if (typeof repoName !== "string" || typeof templateType !== "string") {
    throw new Error("Invalid input");
  }

  return { repoName, templateType };
};
