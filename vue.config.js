const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9090,
    proxy: {
      '/vhcl': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
