import { cloneRepoWithNewName } from "./clone-repo-with-new-name";
import path from "path";

export const createNewFolder = async (
  repoName: string,
  type: "elm" | "js" | "solid" | "react"
) => {
  switch (type) {
    case "elm":
    case "js":
    case "solid": {
      await cloneRepoWithNewName(repoName, path.join("examples", "with-solid"));
      break;
    }
    case "react": {
      await cloneRepoWithNewName(repoName, path.join("examples", "with-react"));
      break;
    }
  }
};
