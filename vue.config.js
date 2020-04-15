const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  baseUrl: BASE_URL,
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '^/platform': { // platform后台框架 接口代理
        target: 'http://beta.admanage.scloud.gome.inc',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/platform': '/platform'
        }
      },
      '^/ad': {
        // http://10.115.138.6:8886
        target: 'http://beta.admanage.scloud.gome.inc',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/ad': '/ad'
        }
      },
      '^/upgrade': { // 设备分组数据 接口代理
        target: 'http://app-upgrade.admin',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/upgrade': '/upgrade'
        }
      }
    }
  }
}
