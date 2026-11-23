import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        name: "GTA VI Patch Tracker",
        short_name: "GTA VI Patches",
        description: "Officiële GTA 6 patchnotes van Rockstar Games",
        theme_color: "#101713",
        background_color: "#101713",
        display: "standalone",
        start_url: "./",
        icons: [
          { src: "./icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "./icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
