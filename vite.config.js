import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Components({
      resolvers: [
        // naive ui 的自动引入，只需要这一句
        NaiveUiResolver()
      ]
    }),
    createStyleImportPlugin({
      resolves: [
        VxeTableResolve(),

      ]
    })
  ],
  base: "./",
  define: {
    'process.env': {
      // 'BASE_API': "http://120.76.134.60:2333",
      // 'BASE_API': "http://192.168.10.50:2333",
      'BASE_API': "http://localhost:2333",
    }
  },
})
