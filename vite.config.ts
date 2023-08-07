import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  publicDir: '../public',
  root: './src',
  build: {
    outDir: '../build',
    emptyOutDir: true,
    minify: true,
    cssMinify: true,
    assetsInlineLimit: 10000000000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    react({ plugins: [], tsDecorators: true }),
    paths({ projects: ["../tsconfig.json"] }),
    viteSingleFile()
  ]
});
