import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from "rollup-plugin-visualizer";
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 等子路径部署时由 CLI --base 覆盖，例如 /AR-Admin-Panel-Demo/
  base: process.env.VITE_BASE || '/',
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        })
      ],
    }),
    svgLoader(),
    VueI18nPlugin({
      allowDynamic:true,
      include: [path.resolve(__dirname, './src/i18n/locales/**')],
    }),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 全局变量注入（可选）
        // additionalData: `@import "@/styles/variables.less";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (/node_modules\/aieditor/.test(id)) {
            return "aieditor";
          }
          if (/node_modules\/(echarts|vue-echarts)(?:\/|$)/.test(id)) {
            return "echarts"
          }
          if (/node_modules\/lodash-es(?:\/|$)/.test(id)) {
            return "lodash"
          }
          if (/node_modules\/@ant-design\/icons-vue(?:\/|$)/.test(id)) {
            return "ant-design"
          }
          if (/node_modules\/(ant-design-vue)(?:\/|$)/.test(id)) {
            return "ant-design-vue"
          }
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0]
          }
        }
      }
    }

  },
  server: {
    port: 4173,
    host: '0.0.0.0',
    proxy: {
      '/ar-auth': {
        target: 'https://gateway-manager-sit.35456462.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ar-manager': {
        target: 'https://adminapidev.35456462.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
