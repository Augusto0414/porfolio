import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import svgr from "vite-plugin-svgr";
// import vercel from '@astrojs/vercel';
//import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: "https://augusto0414.github.io",
  base: "/porfolio/",
  integrations: [
    svelte(),
    tailwindcss({
      applyBaseStyles: true,
      configFile: "./tailwind.config.mjs",
    }),
    svgr(),
  ],
  vite: {
    plugins: [
      tailwindcss({
        applyBaseStyles: true,
        configFile: "./tailwind.config.mjs",
      }),
      svgr(),
    ],
    build: {
      rollupOptions: {
        output: {
          // Añade hash a todos los archivos JS
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          // Añade hash a CSS, imágenes, fonts, etc.
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
    },
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
});
