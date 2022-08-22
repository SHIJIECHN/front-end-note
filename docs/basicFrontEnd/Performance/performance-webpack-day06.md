---
autoGroup-4: Webpack
sidebarDepth: 3
title: 性能优化
---

## webpack4 vs webpack5
版本号：npm info webpack versions  
webpack-cli: npm info webpack-cli versions   

## 优化打包构建速度
1. babel-loader代码缓存
```javascript
// webpack.base.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, 
                    // 1.将babel（es6->es5）编译好的es5代码缓存到文件夹里面，下次使用时先去
                    // 缓存文件夹中查看有没有编译好的代码，如果有就直接从文件夹中拿出编译好的代码
                },
                exclude: /node_modules/, 
                // 2. path.resolve(__dirname, 'node_modules) 排除不进行编译的模块
                // node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
            }
        ]
    }
}
```

2. IgnorPlugin
moment是js时间库。直接import就把所有国家的语言包都导入了，而我们只需要中文。
```javascript
// webpack.base.js
module.exports = {
    noParse: [/vue\.min\.js$/], // 告诉vue.min.js文件不需要进行打包和解析的
    plugins: [
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
         // 忽略moment库的locale文件夹。这里面包含所有国家的语言包。再导入需要的语言包：
        //  import 'moment/locale/zh-cn', 只引入了中文
    ]
}
```
区别：IgnorePlugin不引入相应的代码，最终打包生成的代码没有代码；noParse不做打包，最终生成的代码有代码。

3. 多进程打包（HappyPack）
JS单线程->NodeJS基于JS 单线程 -> Webpack基于NodeJS 单线程 开启多进程打包。多核CPU适合多进程打包。   
happyPack  
```javascript
// webpack.prod.js
const HappyPack = require('happyPack');
const ParalleUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports ={
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'], 
                // 把js文件的处理交给id=babel的happypack的实例，这个实例在plugins中声明
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use:ExtractTextPlugin.extract({
                    use: ['happypack/loader?id=css']
                })
            }
        ],
        plugins: [
            // 创建id为babel的实例
            new HappyPack({
                id: 'babel',
                // 如何处理 .js 文件，用法和 Loader 配置中一样
                loaders: ['babel-loader?cacheDirectory'], // 使用缓存的另一种写法
            }),
            new  HappyPack({
                id: 'css',
                 // 如何处理 .css 文件，用法和 Loader 配置中一样
                loaders: ['css-loader']
            })
            // 开启多进程压缩js
            new ParalleUglifyPlugin({
                uglifyJS:{
                    output: {
                        beautify: false, // 输出的代码压缩
                        comment: false // 去掉注释
                    }
                }
            }),
            new ExtractTextPlugin({
                filename: `[name].css`,
            }), 
        ]
    }
}
```
项目大时开启多进程打包。
注意：
1. 在Loader配置中，所有文件的处理都交给了happypack/loader去处理，使用紧跟其后的queryString?id=babel去告诉happypack/loader去选择哪个HappyPack实例去处理文件。
2. 在Plugin配置中，新增了两个人HappyPack实例分别用于告诉happypack/loader去如何处理.js 和 .css 文件。选项中的id属性值和上面的?id=babel相对应，选项中的loaders属性和Loader配置中一样。


## 优化产出代码体积