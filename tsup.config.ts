import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/cli.ts",
    "examples/basic-server.ts",
    "examples/tools-server.ts",
    "examples/resources-server.ts",
    "examples/http-server.ts",
    "bin/*.js",
  ],
  format: ["esm"],
  clean: true,
  dts: true,
  outExtension: () => ({ js: ".js" }),
  sourcemap: true,
  target: "node16",
  shims: true,
  treeshake: true,
  external: ["@modelcontextprotocol/sdk", "express", "cors", "zod"],
  splitting: true,
  bundle: true,
});
