const {
    defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: 'static', //静态资源目录
    productionSourceMap: false,
    devServer: {
        host: 'localhost',
        port: 8089, //前端项目端口设置
        proxy: { //设置代理
            '/api': { //将域名映射到/api,请求时url以/api开头
                target: 'http://localhost:9002', //后端请求服务域名和端口
                changeOrigin: true, //设置是否允许跨域，默认为false
                pathRewrite: {
                    // 重写路径，比如/api/aaa/ccc重写为/aaa/ccc，若后端为/aaa/ccc前端，
                    // 发送请求为/api/aaa/ccc才能被代理到
                    '^/api': '/'
                }
                
            }
        }
    }
})