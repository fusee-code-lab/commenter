import { defineConfig } from "tsup";
import { spawn } from "child_process";

export default defineConfig(async (options) => {
  const isProduction = options.env?.NODE_ENV === "production";

  return {
    entryPoints: ["src/main.ts"],
    loader: {
      ".env": "file"
    },
    clean: isProduction,
    minify: isProduction,
    async onSuccess() {
      if (isProduction) return;
      // run dist/main.js by node command
      const process = spawn("node", ["dist/main.js"], { stdio: "inherit" });
      return () => {
        process.kill();
      };
    },
  };
});
