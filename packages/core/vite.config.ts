import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { sync } from "glob";

const entries: Record<string, string> = {};
sync("**/*.tsx").forEach((file) => {
  entries[`js/${file.replace(".tsx", "").split("/").pop()}`] = file;
});

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      name: "web",
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        chunkFileNames: "[name].js",
        format: "es",
      },
    },
    outDir: "assets",
    emptyOutDir: false,
    minify: true,
  },
});
