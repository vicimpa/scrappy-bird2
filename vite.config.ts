import react from "@vitejs/plugin-react";
import htmlMinifier from "rollup-plugin-html-minifier";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import paths from "vite-tsconfig-paths";

import { isPWA, outDir } from "./config";

export default defineConfig({
  publicDir: isPWA ? './public' : 'myFakeDir',
  base: './',
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: 10000000000,
    rollupOptions: {
      plugins: [
        htmlMinifier({
          options: {
            collapseWhitespace: true,
            removeComments: true
          }
        })
      ],
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    react(),
    paths(),
    viteSingleFile()
  ]
});
