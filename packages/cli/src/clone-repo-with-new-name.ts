import { $ } from "bun";

export const cloneRepoWithNewName = async (
  repoName: string,
  pathToTemplate: string
) => {
  await $`git clone --depth=1 https://github.com/gfffrtt/alaska-web.git`;
  await $`mkdir ${repoName}`;
  await $`cp -r alaska-web/${pathToTemplate}/* ${repoName}`;
  await $`rm -rf alaska-web`;
};
