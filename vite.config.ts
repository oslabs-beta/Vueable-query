import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  root: 'Panel',
  build: {
    rollupOptions: {
      input: {
        panel: "Panel/panel.html"
      },
      output: {
        // file: "../Extension/panel.html",
        dir: 'dist/',
        entryFileNames: "[name].js",
        format: 'iife',
        name: 'app',
        // inlineDynamicImports: false
      }
    }
  
  }
})
