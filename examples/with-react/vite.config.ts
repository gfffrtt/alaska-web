import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { glob } from "glob";

const files = await glob(["**/*.tsx", "**/*.ts"], {
  ignore: ["node_modules/**", "**/*.d.ts", "**/*.config.*"],
});

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      name: "alaska-web",
      entry: {
        ...Object.fromEntries(
          files.map((file) => [file.split("/").pop()!.split(".")[0], file])
        ),
      },
    },
    outDir: "build",
    emptyOutDir: false,
  },
  define: {
    "process.env": { NODE_ENV: "development" },
  },
});
