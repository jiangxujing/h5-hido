'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/hido-core/**': {
        target: 'http://192.168.199.66:8080',
        secure: false,
        changeOrigin: false,
      },
      '/user/**': {
        target: 'http://192.168.199.60:8080',
        secure: false,
        changeOrigin: false,
      },
       '/collections-web/**': {
        target: 'http://192.168.199.65:8080',
        secure: false,
        changeOrigin: false,
      },
       '/sns/**': {
        target: 'https://api.weixin.qq.com', // 通过code换取网页授权openId的域名测试用
        secure: false,
        changeOrigin: false,
      }, 
      '/pay/**': { 

        target: 'https://api.mch.weixin.qq.com', // 服务端调取微信API统一下单接口测试用
        secure: false,
        changeOrigin: false,
      }, 
      '/mch/**': { 
        target: 'https://wxpay.wxutil.com', // 获取到后台返回的h5支付链接测试用h5支付
        secure: false,
        changeOrigin: false,
      }, 
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps 
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
