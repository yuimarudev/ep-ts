import { build } from "esbuild";

await build({
  entryPoints: ["src/**/*"],
  format: "esm",
  platform: "neutral",
  outdir: "dist/",
  sourcemap: "linked"
});
