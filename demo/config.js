/**
 * Created by chkui on 2017/6/22.
 */
const reducerDemo = require('./src/reducer'),
    routes = require('./src/routes'),
    App = require('./src/app'),

    //通用配置，用于打包和服务器运行
    config = {
        workDir: __dirname,
        entry: './src/demo',
        app: ()=> {
            return require('./src/app') //异步加载app
        },
        appPath: './src/app',
        serverEntry: './myProServer',
        serverModule: '../node_modules',
        reducer: {reducerDemo},
        routes: routes,
        define: {
            runMode: "SITE",
            localRun: false,
        }
    }

module.exports = config