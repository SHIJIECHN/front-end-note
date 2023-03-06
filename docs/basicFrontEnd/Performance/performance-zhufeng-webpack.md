---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack基础知识
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

### 1.4. 自动产出html
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

::: theorem path的区别和联系

1. `publicPath`可以看做是`devServer`对生成目录`dist`设置的虚拟目录，`devServer`首先从`devServer.publicPath`中取值，如果它没有设置，就取`output.publicPath`的值作为虚拟目录，如果它也没有设置，就取默认值`/`。
2. `output.publicPath`不仅可以影响虚拟目录的取值，也影响利用`html-webpack-plugin`插件生成的`index.html`中引用的`js`、`css`、`img`等资源的引用路径。会自动在资源路径前面追加设置的`output.publicPath`
3. 一般情况下要保证`devServer`中的`publicPath`与`output.publicPath`保持一致

:::

`webapck.config.js`配置`devServer`：
- `contentBase`：配置开发服务运行时的文件根目录
- `writeToDisk`：打包后写入磁盘
- `port`：开发服务器监听的端口
- `open`：自动打开浏览器
- `publicPath`：开发服务器

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

## 4. loader的三种写法

### 4.1 loader

```javascript
module: {
  rules: [
    { test: /\.css$/, loader: ['style-loader', 'css-loader'] }
  ]
}
```

### 4.2 use

```javascript
module: {
  rules: [
    { test: /\.css$/, use: ['style-loader', 'css-loader'] }
  ]
}
```

### 4.3 use + loader

```javascript
module: {
    rules: [
        {
            test: /\.css$/,
            include: path.resolve(__dirname,'src'),
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader',
                options: {
                    insert:'top'
                }
            },'css-loader']
        }
    ]
}
```

## 5. 图片
引入图片的方式：
1. 手动引入：放在静态文件根目录里，通过html的img直接引用，需要配置devServer.contentBase；HTML中直接引入相对路径
2. JS文件引入：通过 require import 引入
3. CSS中引入：可以在CSS中通过 url 引入图片 css-loader来进行处理

```javascript
npm install file-loader url-loader html-loader -D
```

### 5.1. 手动引入
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

### 5.2 JS中引入图片

#### 5.2.1 JS

```javascript
let logo=require('./images/logo.png');
let img=new Image();
img.src=logo;
document.body.appendChild(img);
```

#### 5.2.2 Webpack.config.js
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

### 5.3 CSS中引入

可以在CSS文件中引入图片。

#### 5.3.1 CSS

```css
#image-container{
  width: 400px;
  height: 103px;
  background-image: url('./images/logo.png');
  border: 1px solid #000;
}
```

#### 5.3.2 HTML
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

## 6. 转义ES6/ES7/JSX

Babel是一个编译JavaScript的平台，可以把ES6/ES7，React的JSX转义为ES5

### 6.1 安装依赖包

::: theorem 

- [babel-loader](https://www.npmjs.com/package/babel-loader)：使用Babel和Webpack转义JavaScript文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)：Babel编译的核心包
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)：Babel默认只转换最新的ES语法，比如箭头函数
- [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react): React插件的Babel预设
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/babel-plugin-proposal-decorators): 把类和对象装饰器编译成ES5
- [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/babel-plugin-proposal-class-properties): 转换静态类属性以及使用属性初始值化语法声明的属性
- [core-js](): 给低版本浏览器提供接口的库，例如：

:::

```javascript
npm i babel-loader@8.2.1 @babel/core@7.12.7 @babel/preset-env@7.12.7  @babel/preset-react@7.12.7  -D
npm i @babel/plugin-proposal-decorators@7.12.1 @babel/plugin-proposal-class-properties@7.12.1 -D
npm i core-js@3.7.0 -D
```

:::: tabs

::: tab webpack.config.js

```javascript
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          //'@babel/preset-env', // 可以转换JS语法
          ['@babel/preset-env', { // 可默认只转换map set等，不能转换promise，需要配置参数
            useBuiltIns: 'usage', //按加载polyfill
            corejs: { version: 3 }, // 指定corejs的版本号 2或者3 polyfill
            targets: { // 指定要兼容哪些浏览器
              chrome: '60'
            }
          }],
          '@babel/preset-react', // 可以转换JSX语法
        ],
        // 插件
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }], // 使用装饰器语法
          ["@babel/plugin-proposal-class-properties", { loose: true }], // 类属性
        ]
      }
    }
  ]
}
```
:::

::: tab index.js

```javascript
/**
 * 装饰器
 * @param {*} target 装饰的目标
 * @param {*} key 装饰的key PI
 * @param {*} description 属性描述
 */
function readonly(target, key, description) {

}

class Person {
  @readonly PI = 3.14
}

let p = new Person();
p.PI = 3.15;
console.log(p);
```
::: 

::::

### 6.2 babel-loader的实现

babel-loader @babel/core @babel/preset-env三者之间的关系解析：

::: theorem  babel-loader的实现
1. 先将ES6转换成ES6语法树（@babel/core）
2. 然后调用预设preset-env把ES6语法树转换成ES5语法树（@babel/preset-env）
3. 再对ES5语法树重新生成ES5代码（@babel/core）
:::

```javascript
const babelCore = require('@babel/core');
const presetEnv = require('@babel/preset-env');

/**
 * 实现babel-loader，babel-loader作用就是调用@babel/core
 * @babel/core 本身只是提供一个管理功能
 *    把源代码转成抽象语法树，进行遍历和生成，它本身也并不知道具体转换什么语法，以及语法如何转换
 * @param {*} source 源文件内容  let sum = (a, b) => a + b;

 */
function loader(source) {
  let es5 = babelCore.transform(source, {
    presets: ['@babel/preset-env'] // 具体如何转换靠preset
  }); // 使用@babel/core转换代码
  return es5;
}

```


## 7. ESLint代码校验

### 7.1 安装依赖

- eslint: 核心包
- eslint-loader：webpack loader
- babel-eslint：转换ES6的工具

```javascript
npm install eslint@7.14.0 eslint-loader@4.0.2 babel-eslint@10.1.0 -D
```

修改webpack.config.js配置，并在根目录下创建 .eslintrc.js文件。

:::: tabs

::: tab webpack.config.js

```js
{
  test: /\.jsx?$/,
  use: [{
    loader: 'eslint-loader',
    options: { fix: true }, // 启动自动修复
  }], // 先进行代码校验，再进行编译代码
  enforce: 'pre', // 强制指定顺序 pre 之前。pre normal inline pos
  // exclude: /node_modules/, // 不需要检查node_modules里面的代码
  include: resolve(__dirname, 'src'), // 只减产src目录里面的文件
},
```

:::   

::: tab .eslintrc.js

```js
module.exports = {
  root: true, // 根配置文件
  parser: "babel-eslint", // 需要一个parser解析器，帮我们把源代码转成抽象语法树
  //指定解析器选项
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015
  },
  //指定脚本的运行环境
  env: {
    browser: true,
  },
  // 启用的规则及其各自的错误级别
  rules: {
    "indent": "off",//缩进风格
    "quotes": "off",//引号类型 
    "no-console": "error",//禁止使用console
  }
}
```

::::

### 7.2 最佳实践：airbnb
如果react开发不知道如何配置，使用eslint-config-airbnb。

安装依赖：[eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
```javascript
npm i eslint-config-airbnb@18.2.1 eslint-loader@4.0.2 eslint@7.14.0 eslint-plugin-import@2.22.1 eslint-plugin-react@7.21.5 eslint-plugin-react-hooks@4.2.0 and eslint-plugin-jsx-a11y@6.4.1 -D
```

.eslintrc.js 

```javascript {4}
module.exports = {
  root: true, // 根配置文件
  parser: "babel-eslint", // 需要一个parser解析器，帮我们把源代码转成抽象语法树
  extends: 'airbnb',
  // 指定解析器选项
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015,
  },
  // 指定脚本的运行环境
  env: {
    browser: true,
  },
  // 启用的规则及其各自的错误级别
  rules: {
    "linebreak-style": "off",
    indent: "off", // 缩进风格
    quotes: "off", // 引号类型
    "no-console": "error", // 禁止使用console
  },
};
```

### 7.3 自动修复
文件 -> 首选项 -> 设置。 搜索：codeActionsOnSave。在settings.json中编辑。

```javascript
"editor.codeActionsOnSave": {
  "source.fixAll": true
}
```

## 8. sourcemap

- sourcemap 是为了解决开发代码与实际运行代码不一致时，帮助我们debug到原始文件代码的技术
- webpack通过配置可以自动给我们source-map文件，map文件是一种对应编辑文件和源文件的方法


|类别    |代码形式<div style="width: 80px"></div>|含义     |
| -------|:-----------|--------|
|source-map|原始代码| 最好的sourcmap质量有完整的结果，但是会很慢|
|eval-source-map|原始代码| 同样道理，但是最高的质量和最低的性能|
|cheap-module-eval-source-map|原始代码 |（只有行内）同样道理，但是更高的质量和更低的性能|
|cheap-eval-source-map|转换代码 |（行内）每个模块被eval执行，并且sourcemap作为eval的dataurl|
|eval|生成代码| 每个模块都被eval执行，并且存在@sourceURL，带eval的构建模式能cache SourceMap|
|cheap-source-map|转换代码| （行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用|
|cheap-module-source-map|原始代码| （只有行内）与上面一样除了每行特点的葱loader中进行映射|

其实只有五个关键字的组合：eval、source-map、cheap、module、inline。

|类别    |含义     |
| -------|:-----------|
|eval|使用eval包裹代码|
|source-map|产生.map文件|
|cheap|不包含列信息，也不包含loader和sourcemap|
|module|包含loader的sourcemap，否则无法定义源文件|
|inline|将.map作为DataURI嵌入，不单独生成.map文件|


## 9. 打包第三方类库

```javascript
npm install lodash@4.17.20
```

### 9.1 直接引入
```javascript

```

### 9.2 插件引入

- webpack配置ProvidePlugin后，在使用时将不需要import和require进行引入，直接使用
- _ 函数会自动添加到当前模块的上下文，无需显示声明
- 这种方式也会将lodash打包到输出文件中。

:::: tabs

::: tab webpack.config.js

```javascript
import {ProvidePlugin} from 'webpack'

module.exports = {
  plugins: [
    // 会自动向模块内部注入lodash模块, 在模块内部可以通过 _ 引用
    new ProvidePlugin({
      _: 'lodash',
    }),
  ],
}
```
:::   

::: tab index.js

```javascript
// 直接使用
console.log(_.join(['a', 'b', 'c'], '@'));
```
:::

::::

### 9.3 expose-loader

- 不需要任何其他插件配合，质押将下面的代码添加到所有loader之前
- 还是需要在模块内至少手工引入一次，会把变量挂载全局对象上 window._
- 也需要打包的

```javascript
npm install expose-loader@1.0.1 -D
```

```javascript
{
  test: require.resolve('lodash'),
  loader: 'expose-loader',
  options: {
    globalName: '_',
    override: true,
  },
}
```

### 9.4 externals
如果我们向引入一个库，但是又不想让webpack打包，并且不影响在程序中以window全局等方式进行使用，可以通过externals。

- 缺点：在html文件中需要手动引入CDN

:::: tabs 

::: tabs index.html
```javascript
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
```
:::

::: tabs webpack.config.js

```javascript
module.exports = {
  externals: {
    jquery: '$', // 如果在模块内部引用了jquery这个模块，会从window.$上取值
  },
}
```
:::

::: tabs index.js

```javascript
 const jQuery = require("jquery");
 import jQuery from 'jquery';
```
:::

:::: 

### 9.5 html-webpack-externals-plugin

```javascript
npm i html-webpack-externals-plugin@3.8.0 -D
```

```javascript

```