---
autoGroup-4: Webpack
sidebarDepth: 3
title: 3. Babel
---


## babel处理ES6代码

### 1. babel-loader与@babel/core
1. 使用`babel-loader`建立与`webpack`的联系，使用`@babel/preset-env`将`ES6`代码转换成`ES5`的语法
2. 使用`@babel/polyfill`添加`ES6`新特性的实现

安装`babel-loader`和`@babel/core`: `npm install --save-dev babel-loader @babel/core`  
```javascript
//babel-loader:是建立起babel与webpack沟通的桥梁
npm install --save-dev babel-loader @babel/core

//babel/preset-env:是将ES6转成ES5
npm install @babel/preset-env --save-dev
``` 

添加配置
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/  // 排除node_modules里面的代码
            }
        ]
    }
}
```
因为`babel-loader`不能将`ES6`翻译成`ES5`代码，`babel-loader`仅仅是将`babel`与`webpack`建立起联系，而代码转换是`@babel/preset-env`负责
 

### 2. @babel/preset-env
安装`@babel/preset-env`: `npm install @babel/preset-env --save-dev` 
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            }
        ]
    }
}
```
问题: 低版本浏览器中`ES6`的对象，如`Promise`，并没有实现的。解决方法：polyfill。

### 3. 全局使用polyfill
安装`@babel/polyfill`：`npm install @babel/polyfill --save`    
直接导入使用
```javascript
// index.js
import '@babel/polyfill'; // 引用所有
```
使用`@babel/polyfill`是为了打一个补丁，就是希望代码里面出现的`Promise`，`map`等这些低版本浏览器不存在的特性，需要通过`@babel/polyfill`打一个补丁去写一段用`ES5`原生的代码实现`Promise`，`map`等。`corejs`就是这样产生的，但是`corejs`缺少对`generator`的支持，所以又出现了`regenerator`，它包含了对`generator`函数的实现。`corejs+regenerator=@babel/polyfill`两者结合对所有新特性的支持。
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env']
                    ]
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            }
        ]
    }
}
```


### 4. polyfill按需加载
打包后`main.js`会变得很大，因为它把`ES6`新特性的实现全部加入了，因此我们可以设置按需引入。
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage', 
                            // 查看源代码中使用了哪些ES6的新特性，polyfill把使用到的新特性的代码实现加入
                        }]
                    ]
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            }
        ]
    }
}
```
再次打包出现警告：`WARNING (@babel/preset-env): We noticed you're using the 'useBuiltIns' option without declaring a core-js version. `  

```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage', // 查看源代码中使用了哪些ES6的新特性，polyfill把使用到的新特性的代码实现加入
                            //*************新增***************
                            corejs: 3, // corejs版本号
                        }]
                    ]
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            }
        ]
    }
}
```
删除`index.js`中引入的`@babel/polyfill`。
再次打包报错：`Module not found: Error: Can't resolve 'core-js/modules/es.array.map.js' in ...`     


安装`corejs`：`npm install --save core-js@3.8.3`   
`@babel/polyfill`会污染全局环境，使用`transform-runtime`。  

安装：
```javascript
npm install --save-dev @babel/plugin-transform-runtime

npm install --save @babel/runtime
```
```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    // 不需要@babel/preset-env配置，否则会有冲突。
                    // 避免全局环境污染
                    plugins: [
                        ['@babel/plugin-transform-runtime',
                            {
                                "absoluteRuntime": false,
                                "corejs": 3, // 修改，另外需要安装npm install --save @babel/runtime-corejs3
                                "helpers": true,
                                "regenerator": true,
                                "version": "7.0.0-beta.0"
                            }
                        ]
                    ]
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            }
        ]
    }
}
```

### 5. 优化babel
`babel`配置非常多，造成`webpack`臃肿。项目根目录下创建`.babelrc`文件。
```javascript
// .babelrc
{
    // 一般业务代码使用。react，vue
    // "presets": [
    //     [
    //         "@babel/preset-env",
    //         {
    //             "useBuiltIns": "usage", // 按需加载引用polyfill
    //             "corejs": 3 // corejs版本号为3
    //         }
    //     ]        
    // ],
    // 只有开发库才会使用plugin-transform-runtime，避免全局污染
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime": false,
                "corejs": 3,
                "helpers": true,
                "regenerator": true,
                "version": "7.0.0-beta.0"
            }
        ]
    ]
}
```
这样就可以不在`webpack.config.js`文件中设置`babel-loader`的`options`配置项了。

## babel处理react/vue代码
解析`react`。
安装`react`：`npm install react react-dom`   
安装jxs语法解析：`npm install --save-dev @babel/preset-react`
```javascript
//.babelrc
{
    // 一般业务代码使用。react，vue。从下往上执行
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ],
        "@babel/preset-react" // react代码预设  react -> ES6      
    ]
}
```
解析`vue`   
安装`vue`和`vue-loader`: `npm install vue@2.6.14 vue-loader@^15.0.0  vue-template-compiler@2.6.14 `
```javascript
// webpack.config.js
const { VueLoaderPlugin } = require('vue-loade');

module.exports = {
    module: {
        rules: [
            // 处理vue
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 样式css
            {
                test: /\.css$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    // 'style-loader', // 插入到style标签中
                    'vue-style-loader', // 新增。处理vue文件中的样式style
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin() // vue文件各个区块能够被相应的loader处理，如template，script，style分别采用相应的规则处理
    ]
}
```

## 完整配置文件
1. package.json
```json
{
    "name": "webpackTest",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack",
        "watch": "webpack --watch",
        "dev": "webpack-dev-server"
    },
    "keywords": [],
    "browserslist": [
        "> 1%",
        "last 2 versions"
    ],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@babel/core": "^7.17.9",
        "@babel/plugin-transform-runtime": "^7.17.0",
        "@babel/preset-env": "^7.16.11",
        "@babel/preset-react": "^7.16.7",
        "autoprefixer": "^9.8.8",
        "babel-loader": "^8.2.5",
        "clean-webpack-plugin": "^4.0.0",
        "css-loader": "^5.2.7",
        "file-loader": "^6.2.0",
        "html-webpack-plugin": "^4.5.2",
        "node-sass": "^4.14.1",
        "postcss-loader": "^4.3.0",
        "sass-loader": "^10.2.1",
        "style-loader": "^2.0.0",
        "url-loader": "^4.1.1",
        "webpack": "^4.41.2",
        "webpack-cli": "^3.3.10",
        "webpack-dev-server": "^3.11.3"
    },
    "dependencies": {
        "@babel/polyfill": "^7.12.1",
        "@babel/runtime": "^7.17.9",
        "@babel/runtime-corejs3": "^7.17.9",
        "axios": "^0.27.2",
        "core-js": "^3.8.3",
        "react": "^18.1.0",
        "react-dom": "^18.1.0",
        "vue": "^2.6.14",
        "vue-loader": "^15.0.0",
        "vue-template-compiler": "^2.6.14"
    }
}
```
2. webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin'); // 报错 TypeError: CleanWebpackPlugin is not a constructor 因为是对象里面的属性
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    // 显示设置生成的js文件是否压缩
    mode: 'development',
    // none是关闭sourceMap, eval-source-map打开sourceMap
    devtool: 'cheap-module-eval-source-map',
    // 充当服务器的作用，回启东一个本地的端口，访问这个端口，就会返回打包生成的html内容。只适用于开发环境
    devServer: {
        contentBase: './dist', // 告诉浏览器从哪里提供内容，dist文件夹
        open: true, // 第一次打包完毕自动打开网页
        // 热更新
        hot: true,
        // 请求转发
        proxy: {
            // 如果路径开头是/Yixiantong，那么就要转发到http://study.jsplusplus.com/ 域名下
            '/api': {
                target: 'http://study.jsplusplus.com/',
                // secure: false,
                changeOrigin: true, // http://study.jsplusplus.com/对源做了限制，所以得设置为true才能访问
                // 路径重写
                pathRewrite: {
                    '^/api': '' // 所有以api开头的内容前面包括api都删掉，保留后面的内容
                }
            }
        }
    },
    // npx webpack查找的入口文件
    entry: './src/index.js',
    // 入口为多个文件
    // entry: {
    //     main: './src/index.js',
    //     sub: './src/index.js'
    // },
    // 模块，告诉webpack遇到什么模块应该怎么处理
    module: {
        rules: [
            // 图片loader
            {
                test: /\.(jpg|png\jpe?g|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 最终打包生成的图片名与原图片名相同
                        name: '[name].[ext]',
                        // 生成的图片放到imgs文件夹下
                        outputPath: 'imgs/',
                        // 如果图片大于20kb，就单独生成一个图片文件；如果小于20kb就解析成base64字符串直接设置到img src中
                        limit: 20480 // 20kb 
                    }
                }
            },

            // 样式loader scss
            {
                test: /\.scss$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    'style-loader', // 插入到style标签中
                    {
                        loader: 'css-loader', // // 分析css代码
                        options: {
                            importLoaders: 2, // 还要走前面2个loader，也就是postcss-loader和sass-loader
                            modules: true // css模块化
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            // 样式css
            {
                test: /\.css$/,
                // loader执行顺序：从后往前，从下往上
                use: [
                    // 'style-loader', // 插入到style标签中
                    'vue-style-loader', // 新增。处理vue文件中的样式style
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // 字体文件loader
            {
                test: /\.(eot|svg|ttf|woff)/,
                loader: 'file-loader'
            },
            // 处理js文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    // presets: [
                    //     ['@babel/preset-env', {
                    //         useBuiltIns: 'usage', // 查看源代码中使用了哪些ES6的新特性，polyfill把使用到的新特性的代码实现加入
                    //         corejs: 3, // corejs版本号
                    //     }]
                    // ],
                    // 不需要@babel/preset-env配置，否则会有冲突。
                    // 避免全局环境污染
                    // plugins: [
                    //     ['@babel/plugin-transform-runtime',
                    //         {
                    //             "absoluteRuntime": false,
                    //             "corejs": 3, // 修改，另外需要安装npm install --save @babel/runtime-corejs3
                    //             "helpers": true,
                    //             "regenerator": true,
                    //             "version": "7.0.0-beta.0"
                    //         }
                    //     ]
                    // ]
                },
                exclude: /node_modules/ // 排除node_modules里面的代码
            },
            // vue
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    // 改变生成的目录名字
    output: {
        // publicPath: 'http://cdn.com.cn', // 生成的index.html引入的js文件路径前会加上http://cdn.com.cn
        filename: '[name].js', // 生成的文件名为bundle.js，多个文件分别按照打包前的文件名
        path: path.resolve(__dirname, 'dist') // 输出的文件夹名。路径需要配置成绝对路径，这里需要用到path模块。__dirname是当前webpack.config.js所在的目录的名字，也就是这里的webpackTest文件夹，拼接dist是将bundle.js放到dist文件夹下。
    },
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板的位置
        }),
        new CleanWebpackPlugin(), // 清空dist文件夹
        // 热更新插件
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin() // vue文件各个区块能够被相应的loader处理，如template，script，style分别采用相应的规则处理
    ]
}
```
3. postcss.config.js
```javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
4. .babelrc
```javascript
{
    // 一般业务代码使用。react，vue。从下往上执行
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ],
        "@babel/preset-react" // react代码预设  react -> ES6      
    ]
    // 只有开发库才会使用
    // "plugins": [
    //     [
    //         "@babel/plugin-transform-runtime",
    //         {
    //             "absoluteRuntime": false,
    //             "corejs": 3,
    //             "helpers": true,
    //             "regenerator": true,
    //             "version": "7.0.0-beta.0"
    //         }
    //     ]
    // ]
}
```