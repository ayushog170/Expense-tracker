import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/auth/(google|me|logout|login|signup|config|preferences)": "http://localhost:5000",
      "/expenses": "http://localhost:5000",
      "/summary": "http://localhost:5000",
      "/predict-category": "http://localhost:5000",
    },
  },
});
