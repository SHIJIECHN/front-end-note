---
autoGroup-4: Webpack
sidebarDepth: 3
title: webpack(珠峰)
---

## webpack学习的顺序
- 实战使用
- `webpack`优化
- `webpack`工作流，`AST`抽象语法树
- `loader`
- `plugin` `tapable`
- `hmr` 手写实现原理

## 1. webpack基础知识

### 1.1. 初始化项目
```javascript
// 1. 初始化package.json
npm init -y
// 2. 配置webpack
npm install webpack@5.6.0 webpack-cli@4.2.0 -D
// 3. 创建src目录
mkdir src
// 4. 创建dist目录
mkdir dist
```

### 1.2. webpack核心概念
- `Entry`：入口，`webpack`执行构建的第一步就是从`Entry`开始
- `Output`: 输出结果，在`webpack`经过一系列处理并得出最终想要的代码后输出结果
- `Module`：模块，在`webpack`里一切皆是模块，一个模块对应这一个文件。`webpack`会从配置的`Entry`开始递归找出所有依赖的模块
- `Chunk`：代码块，一个`Chunk`由多个模块组合而成，用于代码合并于分割。
- `Loader`：模块转换器，用于把模块原内容按照需求转换成新内容
- `Plugin`：扩展插件，在Webpack构建流程中的特定时机扩展逻辑来改变结果或做你想要做的事请
- `Context`：`context`即是项目打包的路径上下文，如果指定了`context`，那么`Entry`和`Output`都是基于上下文路径的，`context`必须是一个绝对路径

`webpack`启动后会从`entry`里配置的`module`开始递归解析`entry`依赖的所有`module`。每找到一个`module`，就会根据配置的`loader`去找对应的转换规则，对`module`进行转换后，再解析出当前`module`依赖的`module`。这些模块会以`entry`为单位进行分组，一个`entry`和其所有的`module`被分到一个组，也就是一个`chunk`。最后`webpack`会把所有`chunk`转换成文件输出，在整个流程中，`webpack`会在恰当的时机执行`plugin`里定义的逻辑。

### 1.3. 基本配置文件

- 配置文件`webpack.config.js`
  - `entry`：配置入口文件的地址。默认值是`./src/index.js`，但是可以通过`entry`属性，来制定一个（或多个）不同的入口起点。
  - `output`：配置出口文件地址。主要输出文件默认值是`./dist/main.js`，其他问价默认值放置在`./dist`文件夹中。
  - `mode`：开发模式。
  - `module`：配置模块，主要用来配置不同文件的加载器。`webpack`只能理解`JavaScript`和`JSON`文件，`loader`让`webpack`能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。
  - `plugins`：配置插件。包括：打包优化、资源管理、注入环境变量等。

```js 
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

- `publicPath`: 默认情况下插入`index.html`文件中的`script`文件路径为：`src="./main.js"`, 如果设置了这个参数`publicPath: './assets'`，则打包后文件变成：`src="./assets/main.js"`。与`devServer`中的`publicPath`相同。两者的区别是：`output/publicPath` 配置线上目录。`devServer/publicPath` 配置开发目录。
- 当你把打包后文件插入到`index.html`文件里的时候，`src`如何写的？`publicPath + filename`。
  - `publicPath: './assets'`
  - `filename: '/js/main.js'`
  - 最终结果：`'./assets/js/main.js'`

### 1.4. 创建index.html文件
在`src`目录下创建`index.html`模板，并安装`html-webpack-plugin`插件，以`src/index.html`为模板，用来自动生成最终`index.html`放到`dist`目录中。
```javascript
npm install html-webpack-plugin@5.5.0 -D
```
`webpack.config.js`添加插件配置:
```javascript {2,7-9}
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

### 2.1 安装服务器

```javascript
npm install webpack-dev-server@3.11.0 -D
```

### 2.2 publicPath

|类别    |配置名称     |描述   |
| -------|:-----------|:------|
|output|path   |指定输出到硬盘上的目录|
|output|publickPath  |表示打包生成的index.html文件里面引用资源的前缀|
|DevServer|publicPath  |表示打包生成的静态文件所在的位置（若DevServer里面的publicPath没有设置，则认为是output里面设置的publicPath的值|
|devServer|static| 用于配置提供额外静态文件内容的目录|

webapck.config.js配置devServer：
- contentBase：配置开发服务运行时的文件根目录
- writeToDisk：打包后写入磁盘
- port：开发服务器监听的端口
- open：自动打开浏览器
- publicPath：开发服务器

::: theorem Newton's First Law

In an inertial frame of reference, an object either remains at rest or continues to move at a constant velocity, unless acted upon by a force.

:::

:::: tabs

::: tab webpack.config.js
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
:::


::: tab package.json

```json {4}
{
  "scripts": {
    "build": "webpack",
    "start": "webpack server"
  }
}
```
:::

::::

contenBase讨论：
- 通常情况下，服务访问output目录下的输出的文件夹，当output中没有要访问的文件，则会到contentBase对应的文件夹下访问。

## 3.支持CSS、Less、Sass
- css-loader：处理@import、url
- style-loader：将样式变成脚本插入到页面中。
- less-loader: less变成css
- sass-loader：sass变成css

```javascript
modeul.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // CSS
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, //less
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // sass
    ]
  }
}
```

## 4. 图片
引入图片的方式：
1. 手动引入：放在静态文件根目录里，通过html的img直接引用，需要配置devServer.contentBase；HTML中直接引入相对路径
2. JS文件引入：通过 require import 引入
3. CSS中引入：可以在CSS中通过 url 引入图片 css-loader来进行处理

```javascript
npm install file-loader url-loader html-loader -D
```

### 4.1. 手动引入
```javascript
// 1.放在静态文件根目录里，通过html的img直接引用
<img src="/logo.png" alt="logo.png">
// 2. HTML中直接引入相对路径
<img src="./images/logo.png" alt="logo.png">
```

- file-loader：打包时将图片拷贝到dist目录下，并重命名文件名。文件的名字可以通过options配置。

```javascript
modeul.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp)$/, use: [{
          loader: 'file-loader', // 打包时将图片拷贝到dist目录下，并重命名文件名
          options: {
            name: '[hash:10].[ext]', //指定文件名
            esModule: false, // 默认导入图片后{default：...}, default后面才是真正的文件。为false表示包装成ES6模块
          }
        }]
      }
    ]
  }
}
```
esModule的配置说明：
```javascript
// require一个图片的话，会返回图片的新路径
// esModel=true或者默认情况下logo.default来取到新的路径，false的话就可以直接只用
let logo = require('./images/logo.png')
// esModuel = true
logo.default; // 图片路径
// esModule = false
logo; // 图片路径
```

- url-loader：是对file-laoder的增强。多一个参数limit。

判断图片的带下是否小于limit，如果大于的话就把工作交给file-loader处理。如果小于的话，就转成base64字符串内嵌到HTML中

```javascript
modeul.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp)$/, use: [{
          loader: 'url-loader', 
          options: {
            name: '[hash:10].[ext]',
            esModule: false, 
            limit: 8 * 1024, // 如果文件的体积小于limit，小于8K的话，就转成base64字符串内嵌到HTML中，否则就和file-loader相同。
          }
        }]
      }
    ]
  }
}
```

- html-loader：解决html中引入图片的相对路径（方式2）

```javascript
modeul.exports = {
  module: {
    rules: [
      { test: /\.html$/, use: ['html-loader'] },
    ]
  }
}
```

### 4.2 JS中引入图片

#### 4.2.1 JS

```javascript
let logo=require('./images/logo.png');
let img=new Image();
img.src=logo;
document.body.appendChild(img);
```

#### 4.2.2 Webpack.config.js
```javascript
{
  test: /\.(jpg|png|gif|bmp)$/, use: [{
    loader: 'url-loader', 
    options: {
      name: '[hash:10].[ext]',
      esModule: false, 
      limit: 8 * 1024
    }
  }]
}
```

### 4.3 CSS中引入

可以在CSS文件中引入图片。

#### 4.3.1 CSS

```css
#image-container{
  width: 400px;
  height: 103px;
  background-image: url('./images/logo.png');
  border: 1px solid #000;
}
```

#### 4.3.2 HTML
```javascript
<div id="image-container">image-container</div>
```


file-loader的实现：
```javascript
/**
 * loader.raw = true的话loader得到的是一个二进制的Buffer；false的话loader得到的是一个utf8字符串
 * @param {*} source 文件内容
 */
function loader(source) {
  // 1. 生成文件名
  let filename = "f0a12b17c9.png"
  // 2. 向输出目录写入一个文件 this.emitFile

  // 3. 返回igeJS脚本
  return `module.exports = "${filename}"`

}
loader.war = true; // 图片的话需要raw为 true
module.exports = loader;
```

## 5. 转义ES6/ES7/JSX


### 5.1 安装依赖包
- [babel-loader](https://www.npmjs.com/package/babel-loader)：使用Babel和Webpack转义JavaScript文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)：Babel编译的核心包
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)：
```javascript
npm i babel-loader @babel/core @babel/preset-env  @babel/preset-react  -D
```