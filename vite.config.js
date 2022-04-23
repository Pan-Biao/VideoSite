import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      // 'BASE_API': "http://120.76.134.60:2333",
      // 'BASE_API': "http://192.168.10.50:2333",
      'BASE_API': "http://localhost:2333",
    }
  },
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
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ],
    },
  },
  build: {
    sourcemap: false,
    outDir: 'dist', //指定输出路径
    assetsDir: 'static', // 指定生成静态资源的存放路径
    minify: 'terser', // esbuild / terser混淆器，terser构建后文件体积更小
    validate: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            str = id.toString().split('node_modules/')[1].split('/')[0].toString()
            switch (str) {
              case "vxe-table":
                return "vxe-table"
              case "dplayer":
                return "dplayer"
              case "naive-ui":
                return "naive-ui"
              default:
                return "vendor"
            }
            // return id
            //   .toString()
            //   .split('node_modules/')[1]
            //   .split('/')[0]
            //   .toString();
          }
        },
        chunkFileNames: `static/js/[name].[hash].js`,
        assetFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          const suffix = name.substring(name.lastIndexOf(".") + 1)
          if (suffix == "css") {
            return `static/css/[name].[hash].css`;
          } else {
            return `static/js/[name].[hash].js`;
          }
        }
      },
    }
  }
})
