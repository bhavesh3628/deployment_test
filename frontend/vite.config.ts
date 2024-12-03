import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test:{
    ...configDefaults,
    globals:true,
    environment:"jsdom",
    setupFiles:"./setupTests.ts"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
