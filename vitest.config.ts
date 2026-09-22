import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
    exclude: ["**/node_modules/**", ".claude/worktrees/**"],
    server: {
      deps: {
        // next-intl's ESM build imports "next/navigation" without an
        // extension; inline it so Vite resolves the import.
        inline: ["next-intl"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Build-time marker with no runtime behaviour; stub it so server-only
      // modules (e.g. the WordPress client) can be unit-tested.
      "server-only": path.resolve(__dirname, "./src/test/server-only-stub.ts"),
    },
  },
});
