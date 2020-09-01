const path = require('path')

const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins.push(new CompressionPlugin({
    test: /\.js$|\.html$|\.css/, // 对识别到的文件进行压缩
    threshold: 10240, // 对超过10k的数据压缩
    deleteOriginalAssets: false // 不删除源文件，如果nginx开启了gzip可以删除
  }))
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  devServer: {
    port: 4000,
    proxy: {
      '/': {
        target: process.env.VUE_APP_BASE_API,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  configureWebpack: {
    plugins,
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      ]
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('assets', resolve('./src/assets'))
      .set('components', resolve('./src/components'))
      .set('views', resolve('./src/views'))
      
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugins.delete('prefetch')
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                antdUI: {
                  name: 'chunk-antdUI',
                  priority: 20,
                  // 此处得注意，我是因为用的 adtdv，路径如此，如果用其他UI框架请看 node_modules 中该UI组件库是啥路径
                  test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
