import { tasks } from "@clack/prompts";
import { $ } from "bun";

export const cloneRepoWithNewName = async (
  repoName: string,
  pathToTemplate: string
) => {
  await tasks([
    {
      title: "Cloning template",
      task: async () => {
        await $`git clone --depth=1 https://github.com/gfffrtt/alaska-web.git`;
      },
    },
    {
      title: "Creating new repository",
      task: async () => {
        await $`mkdir ${repoName}`;
      },
    },
    {
      title: "Copying template",
      task: async () => {
        await $`cp -r alaska-web/${pathToTemplate}/* ${repoName}`;
      },
    },
    {
      title: "Cleaning up",
      task: async () => {
        await $`rm -rf alaska-web`;
      },
    },
  ]);
};
