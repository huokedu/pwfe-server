/**
 * Created by chkui on 2017/6/22.
 */

require('babel-polyfill')
require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime', 'add-module-exports']
})

const init = require('./lib/common/init'),
    log = require('./lib/common/log'),
    deleteDir = require('./lib/common/deleteDir'),
    path = require('path')

/**
 * 构建服务器运行的包。
 * 1）服务器的包会使用webpack打包生产适用于生产运行的包。
 * 2）打包后会生成如下结构
 *      --[dist]
 *      ----[client]
 *      ------.js file
 *      ------.html file
 *      ----[server]
 *      ------.js file
 *      ------.html file
 *    [dist]由 path.resolve(workDir, outPath)确定
 *    [client]由 path.resolve(workDir, outPath, clientPath)确定
 *    [server]由 path.resolve(workDir, outPath, serverPath)确定
 * 3）打包完成后会生成在[dist][server]文件夹生成一个 [server.js] 文件(由serverEntryName参数指定名称)
 * 4）直接运行[server.js]文件即可启动服务器: $ node [dist][server][server.js]
 * @param {object} options {
 *     //options的配置详见 {./config/context}
 * }
 * @param cb 打包完成后的回调函数，如果没有则不执行 cb:()=>{}
 */
const builder = function (options, cb) {
    log("building file!")
    process.env.NODE_ENV = 'production'

    options = options || {}
    options.isProd = true

    //初始化环境参数
    const opts = init(options),
        env = opts.getEnv()
    //清空打包文件夹
    log('remove dist file')
    deleteDir(path.resolve(env.workDir, env.outPath), false)

    var webpack = require('webpack'),
        config = require('./lib/scripts/webpack.ser'),
        compiler = webpack(config)
    compiler.run(function(err, stats) {
        err ? (()=>{
            log('build error! info:', err)
            process.exit(0)
        })() : (()=>{
            log("build success")
            cb ? cb() : process.exit(0)
        ;})()
    });
}

module.exports = builder