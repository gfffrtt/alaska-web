import { tasks } from "@clack/prompts";
import { execSync } from "child_process";
import fs from "fs/promises";

export const cloneRepoWithNewName = async (
  repoName: string,
  pathToTemplate: string
) => {
  await tasks([
    {
      title: "Cloning template",
      task: async () => {
        execSync(
          `git clone --depth=1 https://github.com/gfffrtt/alaska-web.git`
        );
      },
    },
    {
      title: "Creating new repository",
      task: async () => {
        execSync(`mkdir ${repoName}`);
      },
    },
    {
      title: "Copying template",
      task: async () => {
        try {
          await fs.cp(`alaska-web/${pathToTemplate}`, repoName, {
            recursive: true,
          });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "Cleaning up",
      task: async () => {
        try {
          await fs.rm("alaska-web", { recursive: true });
        } catch (error) {
          console.error(error);
        }
      },
    },
  ]);
};
