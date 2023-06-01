import { fileURLToPath, URL } from 'node:url';
import copy from 'rollup-plugin-copy'
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
  root: 'Extension',
  build: {
    rollupOptions: {
      input: {
        devtools: "Extension/devtools.html",
        content: 'Extension/content.ts',
        background: 'Extension/background.ts',
        script: 'Extension/script.ts'
      },
      output: {
        // file: "../Extension/panel.html",
        dir: 'dist/',
        entryFileNames: "[name].js",
        name: 'app',
      },
      plugins: [
        copy({
          targets: [
            { src: 'Extension/manifest.json', dest: 'dist' },
            { src: 'Extension/assets/*', dest: 'dist/assets'}
          ]
        })
      ]
    }
  
  }
})