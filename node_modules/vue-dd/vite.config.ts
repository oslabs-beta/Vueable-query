import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts";
import pkg from "./package.json";
import libCss from 'vite-plugin-libcss';

export const vueDocsPlugin = () => ({
  name: "vue-docs",
  transform (code: any, id: any) {
    if (!/vue&type=docs/.test(id)) return;
    return `export default ''`;
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    vue({
      css: true
    }),
    dts({
      cleanVueFileName: true,
    }),
    vueDocsPlugin(),
    libCss()
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "umd"],
      // the name expose in umd mode
      name: pkg.name,
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        },
      },
    },
  },
})
