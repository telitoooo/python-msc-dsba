import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Chemins relatifs : le dossier `dist/` peut être servi depuis n'importe quel sous-dossier.
  base: "./",
  plugins: [react(), tailwindcss()],
  worker: {
    format: "es",
  },
  build: {
    // CodeMirror + react-markdown pèsent ~1,2 Mo non compressé (≈ 380 Ko gzip) : acceptable ici.
    chunkSizeWarningLimit: 1500,
  },
});
