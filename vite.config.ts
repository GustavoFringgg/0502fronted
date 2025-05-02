/// <reference types="vitest" />

import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import pkg from "./package.json";
import pages from "vite-plugin-pages";
import layouts from "vite-plugin-vue-layouts";
import AutoImport from 'unplugin-auto-import/vite'
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

process.env.VITE_APP_VERSION = pkg.version;
if (process.env.NODE_ENV === "production") {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString();
}

export default defineConfig({
  plugins: [
    vue({
      script: {
        refSugar: true,
      },
    }),
    pages(),
    layouts(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts",
      resolvers: [ElementPlusResolver()],
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    vueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, "locales/**")],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4443,
    https: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
