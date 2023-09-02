import { readFile, writeFile } from "node:fs/promises";

const source = await readFile(
  "node_modules/@swc-node/register/lib/register.js",
  "utf-8"
);
const patched = source.replaceAll("            return sourcecode;", "");

await writeFile("node_modules/@swc-node/register/lib/register.js", patched);
