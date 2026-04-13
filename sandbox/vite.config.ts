import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.CI && repo ? `/${repo}/` : "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "chrono-virtual": path.resolve(__dirname, "../src/index.ts"),
    },
  },
});
