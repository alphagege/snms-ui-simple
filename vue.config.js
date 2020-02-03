// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

process.env.COFRAME_APP_VERSION = '1.0.0'
process.env.COFRAME_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')
console.log(process.env)
module.exports = {
  lintOnSave: true,
  devServer: {
    port: '9999', // 代理端口
    open: true // false不打开，true表示打开
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {}
    }
  },
  chainWebpack: config => {
    /**
         * 删除懒加载模块的 prefetch preload，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
         * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
         */
    config.plugins
      .delete('prefetch')
      .delete('preload')

    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)

    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }
}
