---
autoGroup-4: Webpack
sidebarDepth: 3
title: 4. Tree Shaking
---

## Tree Shaking
代码打包时去除掉没有使用到的源代码    
Tree Shaking只支持ES module模块规范，不支持CommonJS。
- ES module：静态引入-> 编译时引入，写法：import export。代码在没有执行的时候就知道文件是否要引入。
- CommonJS：动态引入 -> 执行时引入，写法：require module.export。代码在执行的时候，才知道文件是否引入。   
  
```javascript
// webpack.config.js
module.exports = {
    // Tree shaking配置
    optimization: {
        usedExports: true, // 如果使用了导出内容，打包就保留下来
    },
}

// package.json
{
     "sizeEffects": ["@babel/polyfill", "*.css"] 
     //导入的模块进行检查，数组中填写的模块不检查。全部都要检查可以写空数组[]或false
}
```
打包后，在main.js中
```javascript
/*! exports provided: add, minus */
/*! exports used: add */
```
在开发环境中，webpack不会删除没有使用的方法。生产环境中，Tree Shaking是自动开启的不需要webpack.，就config.js配置了，但是package.json中sizeEffects属性还是需要写。


## 不同打包模式mode
一般情况下会分开发环境和生产环境，分别写两份不同的配置: webpack.dev.js和webpack.prod.js。两份配置有很多重复内容。需要webpack-merge来处理。  
安装：
```javascript
npm i webpack-merge -D   
```

创建文件webpack.base.js 用来存放重复的内容。
```javascript
// webpack.dev.js
const webpack = require('webpack');
const { merge } = require('webpack-merge');

// 公共的配置
const baseConfig = require('./webpack.base.js');

// 开发环境特有的配置
const devConfig = {
    // 不同开发模式
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://study.jsplusplus.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // Tree shaking配置
    optimization: {
        usedExports: true, // 如果使用了导出内容，打包就保留下来
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

module.exports = merge(baseConfig, devConfig);

// webpack.prod.js
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const prodConfig = {
    // 不同开发模式
    mode: 'production',
    devtool: 'cheap-module-source-map'
}

module.exports = merge(prodConfig, baseConfig);

// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

package.json命令修改
```json
"scripts": {
    "build": "webpack --config webpack.prod.js",
    "dev": "webpack-dev-server --config webpack.dev.js",  // 打包后的文件放到了内存中
    "dev:build": "webpack --config webpack.dev.js" // 可以看到打包后的文件
},
```

移动配置文件的位置，在根目录下创建文件夹build，将webpack.base.js, webpack.dev.js, webpack.prod.js移动到build文件夹下，修改webpack.base.js配置
```javascript
output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'); // 修改
}
```

还需要修改package.json文件打包路径
```json
// package.json
"scripts": {
    "build": "webpack --config ./build/webpack.prod.js",
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "dev:build": "webpack --config ./build/webpack.dev.js"
},
```