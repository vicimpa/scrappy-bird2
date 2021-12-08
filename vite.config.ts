import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import paths from 'vite-tsconfig-paths';

export default defineConfig({
  publicDir: './public',
  base: './',
  plugins: [
    react(),
    paths()
  ]
});
