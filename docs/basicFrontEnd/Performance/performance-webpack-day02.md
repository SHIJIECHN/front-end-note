---
autoGroup-4: Webpack
sidebarDepth: 3
title: Plugin/SourceMap/WebpackDevServer/热更新
---

## plugin
`HTMLWebpackPlugin`：生成一个`HTML`文件。直接`npm run build`生成的`index.html`文档没有`app`，要使用自己的模板。   
安装：`npm install --save-dev html-webpack-plugin@4.5.2`
```javascript
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板的位置
        })
    ]
}
```

`clean-webpack-plugin`：在打包之前，将`dist`目录清空，再进行打包，将打包生成的文件放到`dist`目录。
安装：`npm install --save-dev clean-webpack-plugin@^4.0.0`   
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin'); // 报错 TypeError: CleanWebpackPlugin is not a constructor 因为是对象里面的属性
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板的位置
        }),
         new CleanWebpackPlugin()
    ]
}
```

多个入口文件  
```javascript
// webapck.config.js
const path = require('path');

module.exports = {
    // entry: './src/index.js',
    // 完整写法
    entry: {
        main: './index.js' // 如果改为test：'./src/index.js' 那么生成的文件默认就是test.js
    },
    output: {
        filename: 'bundle.js', // 如果没有默认是main.js
        path: path.resolve(__dirname, 'dist') 
    }
}
```
如果有多个入口文件，我们希望生成的文件按照自定义的文件名
```javascript
module.exports = {
    entry: {
        main: './src/index.js',
        sub: './src/index.js'
    },
    output: {
        filename: 'bundle.js', // 报错 
        path: path.resolve(__dirname, 'dist')
    }
}
```
报错： `ERROR in chunk sub [entry] bundle.js. Conflict: Multiple chunks emit assets to the same filename bundle.js (chunks main and sub).`  
```javascript
// webpack.config.js
module.exports = {
    entry: {
        main: './src/index.js',
        sub: './src/index.js'
    },
    output: {
        filename: '[name].js',  
        path: path.resolve(__dirname, 'dist')
    }
}
```

如果`index.html`引入的`js`文件不是直接放在服务器上面的，而是放在`CDN`域名下。需要配置。
```javascript
// webpack.config.js
module.exports = {
    output: {
        publicPath: 'http://cdn.com.cn', // 生成的index.html引入的js文件路径前会加上http://cdn.com.cn
        filename: '[name].js',  
        path: path.resolve(__dirname, 'dist')
    }
}
```
生成的`index.html`为
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app"></div>
    <!--引入的js文件路径前会加上http://cdn.com.cn-->
<script src="http://cdn.com.cn/main.js"></script><script src="http://cdn.com.cn/sub.js"></script></body>

</html>
```

## sourceMap
帮助调试代码，当源代码出错，可以定位错误到源代码的具体位置。
```javascript
// webpack.config.js
module.exports = {
    mode: 'development',
    // none是关闭sourceMap
    devtool: 'cheap-module-eval-source-map'
}
```
在开发环境(`development`)使用：`cheap-module-eval-source-map`   
在生产环境(`production`)使用：`cheap-module-source-map`   
- `inline`: `Source map`转换为`DataUrl`后添加到`bundle`中.
- `cheap`: 提示代码是哪一行错了，但是哪一列得自己找。忽略`loader`和第三方模块。    
- `module`: 将`loader`和第三方模块的错误也会提示出来


## WebpackDevServer
每次修改了源代码，都需要重新执行`npm run build`进行打包，再刷新页面才能看到最新的源代码执行的结果。`WebpackDevServer`可以优化流程。  
安装：`npm install webpack-dev-server@3.11.3 --save-dev` 
```javascript
// webpack.confi.js
module.exports = {
    // 充当服务器的作用，会启东一个本地的端口，访问这个端口，就会返回打包生成的html内容。只适用于开发环境
    devServer: {
        contentBase: './dist', // 告诉浏览器从哪里提供内容，dist文件夹
        open: true, // 第一次打包完毕自动打开网页
    }
}

// package.json
"scripts": {
    "build": "webpack",
    "watch": "webpack --watch", // 监听源代码的变化，发现源代码变了就打包。webpack自带的监听功能，打包出来的文件没有index.html，需要手动添加index.html
    "dev": "webpack-dev-server" // 监听源代码的变化
}
```
修改源代码，直接就看到了最新的源代码执行结果。

请求转发   
```javascript
// webpack.config.js
module.exports = {
    devServer: {
        contentBase: './dist', 
        open: true,
        // 请求转发
        proxy: {
            // 如果路径开头是/Yixiantong，那么就要转发到http://study.jsplusplus.com/ 域名下
            '/Yixiantong': {
                target: 'http://study.jsplusplus.com/',
                changeOrigin: true, // http://study.jsplusplus.com/对源做了限制，所以得设置为true才能访问

            }
        }
    },
}
```
请求
```javascript
// index.js
axios.get('/Yixiantong/getHomeDatas').then(res => {
    console.log(res.data);
})
```
`webpackDevServer`帮我们进行转发。   
当我们在请求路径上加了`api`
```javascript
// index.js
axios.get('/api/Yixiantong/getHomeDatas').then(res => {
    console.log(res.data);
})
```
转发配置增加：`pathRewrite`
```javascript
// webpack.config.js
module.exports = {
    devServer: {
        contentBase: './dist',
        open: true, 
        proxy: {
            '/api/Yixiantong': {
                target: 'http://study.jsplusplus.com/',
                changeOrigin: true, 
                // 路径重写
                pathRewrite: {
                    '^/api': '' // 所有以api开头的内容前面包括api都删掉，保留后面的内容
                }

            }
        }
    },
}
```

如果转发的路径是以`https`开头，就需要加配置`secure: false`.
```javascript
// webpack.config.js
module.exports = {
    devServer: {
        contentBase: './dist',
        open: true, 
        proxy: {
            '/api/Yixiantong': {
                target: 'https://study.jsplusplus.com/',
                secure: false, // 新增
                changeOrigin: true, 
                pathRewrite: {
                    '^/api': ''
                }

            }
        }
    },
}
```

## 热更新HMR
`css`热更新：源代码`css`文件发生改变，网页中的状态、路由、输入框、变量都不会消失。`css`修改的样式发生改变。
```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    devServer: {
        // 热更新
        hot: true
    },
    plugin: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
`css`实现`HMR`的`loader`：`style-loader`帮助实现`HMR`功能。

`JS`中的热更新   
```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    devServer: {
        // 热更新
        hot: true
    },
    plugin: [
        new webpack.HotModuleReplacementPlugin()
    ]
}

// index.js
// 如果开启了热更新
if (module.hot) {
    // 设置监听的文件(numbre文件)，如果监听的文件里面发生改变，就执行回调回调函数的内容。
    module.hot.accept('./number', () => {
        const oldDiv = document.getElementById('number');
        document.body.removeChild(oldDiv);
        number();
    })
}
```

如果要实现热更新，都是需要写`if(module.hot){...}`的，只是有的框架里面已经帮助写好了。   
`vue` -> `vue-loader`;   
`react` -> `babel-preset`; 


