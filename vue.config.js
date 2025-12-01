const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/todos': {
        target: 'http://localhost:7070',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
