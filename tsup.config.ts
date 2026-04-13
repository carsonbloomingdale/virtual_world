import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/ChronoVirtual.tsx",
    "src/PreText.tsx",
    "src/ImageHeightContext.tsx",
    "src/geometry.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: false,
  external: ["react", "react-dom"],
});
