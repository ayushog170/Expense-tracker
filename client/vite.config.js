import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/auth/(google|me|logout|login|signup|config|preferences)": "https://expense-tracker-82l2.onrender.com",
      "/expenses": "https://expense-tracker-82l2.onrender.com",
      "/summary": "https://expense-tracker-82l2.onrender.com",
      "/predict-category": "https://expense-tracker-82l2.onrender.com",
    },
  },
});
