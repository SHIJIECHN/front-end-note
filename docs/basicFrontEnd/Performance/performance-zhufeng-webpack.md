---
autoGroup-4: Webpack
sidebarDepth: 3
title: webpack(珠峰)
---

## webpack学习的顺序
- 实战使用
- webpack优化
- webpack工作流，AST抽象语法树
- loader
- plugin tapable
- hmr 手写实现原理

## 1.  webpack基础知识

### 1.1. 初始化项目
```javascript
// 1. 初始化package.json
npm init -y
// 2. 配置webpack
npm install webpack webpack-cli -D
// 3. 创建src目录
mkdir src
// 4. 创建dist目录
mkdir dist
```

### 1.2. webpack核心概念
- Entry：入口，Webpack执行构建的第一步就是从Entry开始
- Output: 输出结果，在Webpack经过一系列处理并得出最终想要的代码后输出结果
- Module：模块，在webpack里一切皆是模块，一个模块对应这一个文件。Webpack会从配置的Entry开始递归找出所有依赖的模块
- Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并于分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容
- Plugin：扩展插件，在Webpack构建流程中的特定时机扩展逻辑来改变结果或做你想要做的事请
- Context：context即是项目打包的路径上下文，如果指定了context，那么entry和output都是湘桂于上下文路径的，context必须是一个绝对路径

Webpack启动后会从entry里配置的Module开始递归解析entry依赖的所有module。没找到一个Module，就会根据配置的Loader去找对应的转换规则，对Module进行转换后，再解析出当前Module依赖的Module。这些模块会以entry为单位进行分组，一个entry和其所有的Module被分到一个组，也就是一个Chunk。最后Webpack会把所有Chunk转换成文件输出，在整个流程中，webpack会在惬当的时机执行Plugin里定义的逻辑。

### 1.3. 基本配置文件

- 配置文件webpack.config.js
  - entry：配置入口文件的地址
  - output：配置出口文件地址
  - mode：开发模式。
  - module：配置模块，主要用来配置不同文件的加载器
  - plugins：配置插件

```javascript
const { resolve } = require('path');

module.exports = {
  mode: 'development', // 开发模式：开发环境、生产环境、不指定环境
  entry: './src/index.js', // 入口
  output: {
    path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径，__dirname 当前文件所在的目录
    filename: 'main.js', // 输出的文件名
    publicPath: '/', // 打包后文件的前缀，
  },
  module: {},
  plugins: []
}
```

- publicPath: 默认情况下插入index.html文件中的script文件路径为：src="./main.js", 如果设置了这个参数publicPath: './assets'，则打包后文件变成：src="./assets/main.js"。与devServer中的publicPath相同。两者的区别是：output/publicPath 配置线上目录。devServer/publicPath 配置开发目录。
- 当你把打包后文件插入到index.html文件里的时候，src如何写的？publicPath + filename。
  - publicPath: './assets'
  - filename: '/js/main.js'
  - 最终结果：'./assets/js/main.js'

### 1.4. 创建index.html文件
在src目录下创建index.html模板，并安装html-webpack-plugin插件，以src/index.html为模板，用来自动生成最终index.html放到dist目录中。
```javascript
npm install html-webpack-plugin
```
webpack.config.js添加插件配置
```javascript
// other import
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 导入插件

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({ // 插件配置
      template: './src/index.html'
    })
  ]
}
```

## 2. 开发服务器配置
安装webpack-dev-server
```javascript
npm install webpack-dev-server
```
webapck.config.js配置devServer：
- contentBase：配置开发服务运行时的文件根目录
- writeToDisk：打包后写入磁盘
- port：开发服务器监听的端口
- open：自动打开浏览器
- publicPath：开发服务器

```javascript
module.exports = {
  // ...
  // devServer会启动一个HTTP开发服务器，把一个文件夹作为静态根目录
  // 为了提高性能，使用内存文件系统
  devServer: {
    contentBase: resolve(__dirname, 'static'), 
    writeToDisk: true, // 如果指定此选项，也会把打包后的文件写入磁盘一份，也就是说会在项目下创建dist文件夹
    port: 8080, // 指定HTTP服务器的端口号
    open: false // true 自动打开浏览器
    publicPath: '/'
  },
}
```

contenBase讨论：
- 通常情况下，服务访问output目录下的输出的文件夹，当output中没有要访问的文件，则会到contentBase对应的文件夹下访问。

## 3. 支持CSS
- css-loader：处理import、url等
- style-loader：将样式变成脚本插入到页面中。
- less-loader: less变成css
- sass-loader：sass变成css


