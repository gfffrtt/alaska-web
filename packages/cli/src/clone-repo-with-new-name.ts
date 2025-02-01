import { $ } from "bun";

export const cloneRepoWithNewName = async (
  repoName: string,
  pathToTemplate: string
) => {
  await $`git clone --depth=1 --filter=blob:none --no-checkout --sparse https://github.com/gfffrtt/alaska-web.git ${repoName}`;
  await $`cd ${repoName} && git sparse-checkout set ${pathToTemplate} && git checkout`;
};
