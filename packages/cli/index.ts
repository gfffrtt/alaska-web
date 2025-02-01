import { createNewFolder } from "./src/create-new-repo";
import { getInputs } from "./src/get-inputs";

const main = async () => {
  const { repoName, templateType } = await getInputs();

  await createNewFolder(repoName, templateType);
};

main();
