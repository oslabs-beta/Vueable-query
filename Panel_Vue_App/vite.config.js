import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        // main: path.resolve(__dirname, "index.html"),
        main: "index.html"
      },
      output: {
        dir: '../Extension/',
        format: 'iife',
        name: 'app'
      }
    },
  }
});
