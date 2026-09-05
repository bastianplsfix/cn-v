import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

// This consumer has no Tailwind plugin and imports only built package exports.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
});
