import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { demoRouting } from "./scripts/demoRouting.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), demoRouting()],
  // Shared registry source sits beside a second React workspace; use one runtime.
  resolve: { dedupe: ["react", "react-dom", "lucide-react"] },
  server: {
    proxy: {
      "/demos": {
        target: "http://127.0.0.1:3000",
        changeOrigin: false,
        ws: true,
      },
    },
  },
  preview: {
    proxy: {},
  },
});
