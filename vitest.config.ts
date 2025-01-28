import { defineConfig } from "vitest/config";
import { jest } from "@jest/globals";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup.js",
  },
});
