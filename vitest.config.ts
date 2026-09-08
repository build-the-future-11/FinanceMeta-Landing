import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    pool: "threads",
    fileParallelism: false,
    environmentOptions: {
      jsdom: { url: "https://finance-meta-landing.vercel.app/" },
    },
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test-setup.ts"],
  },
});
