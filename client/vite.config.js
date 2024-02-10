import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",

    proxy: {
      "/api": {
        target:
          "https://2dc2-2409-40f0-112c-ce7-982f-b036-59b-8d14.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
