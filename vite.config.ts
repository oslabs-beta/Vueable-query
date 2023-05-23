import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  root: 'Panel_TS_Vue_App',
  build: {
    rollupOptions: {
      input: {
        panel: "Panel_TS_Vue_App/panel.html"
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
