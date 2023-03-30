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

theo 配置文件 webpack.config.js
- `entry`：配置入口文件的地址。默认值是`./src/index.js`，但是可以通过`entry`属性，来制定一个（或多个）不同的入口起点。
- `output`：配置出口文件地址。主要输出文件默认值是`./dist/main.js`，其他文件默认值放置在`./dist`文件夹中。
- `mode`：开发模式。
- `module`：配置模块，主要用来配置不同文件的加载器。`webpack`只能理解`JavaScript`和`JSON`文件，`loader`让`webpack`能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。
- `plugins`：配置插件。包括：打包优化、资源管理、注入环境变量等。
::: 

  
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
|devServer|publicPath  |表示打包生成的静态文件所在的位置（若DevServer里面的publicPath没有设置，则认为是output里面设置的publicPath的值|
|devServer|static| 用于配置提供额外静态文件内容的目录|

theo path的区别和联系

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
    publicPath: '/',
    proxy: { // 配置代理服务器
      '/api': {
        target: 'http://localhost:3001/', // 代理服务器
        pathRewrite: {
          '^/api': '', // 重写路径
        },
        secure: true, // 允许在HTTPS上运行后端服务器
        changeOrigin: true, // 修改主机来源
      },
    },
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

theo 引入图片的方式
1. 手动引入：放在静态文件根目录里，通过`html`的`img`直接引用，需要配置`devServer.contentBase`；`HTML`中直接引入相对路径
2. `JS`文件引入：通过 `require import` 引入
3. `CSS`中引入：可以在`CSS`中通过 `url` 引入图片 `css-loader`来进行处理
:::

```javascript
npm install file-loader@6.2.0 url-loader@4.1.1 html-loader@1.3.2 -D
```

### 5.1. 手动引入
```html
// 1.放在静态文件(static)根目录里，通过html的img直接引用
<img src="/logo.png" alt="logo.png">
// 2. HTML中直接引入相对路径
<img src="./images/logo.png" alt="logo.png">
```

- `file-loader`：打包时将图片拷贝到`dist`目录下，并重命名文件名。文件的名字可以通过`options`配置。

```javascript
modeul.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp)$/, 
        use: [{
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

`esModule`的配置说明：

```javascript
// require一个图片的话，会返回图片的新路径
// esModel=true或者默认情况下logo.default来取到新的路径，false的话就可以直接用
let logo = require('./images/logo.png')
// esModuel = true
logo.default; // 图片路径
// esModule = false
logo; // 图片路径
```

- `url-loader`：是对`file-laoder`的增强。多一个参数`limit`。

判断图片的大小是否小于`limit`，如果大于的话就把工作交给`file-loader`处理。如果小于的话，就转成`base64`字符串内嵌到`HTML`中。

```javascript {6,10}
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

- `html-loader`：解决`html`中引入图片的相对路径

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

`file-loader`的实现：
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
loader.raw = true; // 图片的话需要raw为 true
module.exports = loader;
```

## 6. 转义ES6/ES7/JSX

`Babel`是一个编译`JavaScript`的平台，可以把`ES6/ES7`，`React`的`JSX`转义为`ES5`

### 6.1 安装依赖包

theo 

- [babel-loader](https://www.npmjs.com/package/babel-loader)：使用`Babel`和`Webpack`转义`JavaScript`文件
- [@babel/core](https://www.npmjs.com/package/@babel/core)：`Babel`编译的核心包
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)：`Babel`默认只转换最新的`ES`语法，比如箭头函数。这个是所需要插件的集合。
- [@babel/preset-react](https://www.npmjs.com/package/@babel/preset-react): `React`插件的`Babel`预设
- [@babel/plugin-proposal-decorators](https://babeljs.io/docs/babel-plugin-proposal-decorators): 把类和对象装饰器编译成`ES5`
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
          ['@babel/preset-env', { // 默认只转换map set等，不能转换promise，需要配置参数
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

babel-loader @babel/core @babel/preset-env三者之间的关系，也就是babel-loader的实现

theo  babel-loader的实现
1. 先将`ES6`转换成`ES6`语法树（`@babel/core`）
2. 然后调用预设`preset-env`把`ES6`语法树转换成`ES5`语法树（`@babel/preset-env`）
3. 再对`ES5`语法树重新生成`ES5`代码（`@babel/core`）
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

- `eslint`: 核心包
- `eslint-loader`：`webpack loader`
- `babel-eslint`：转换`ES6`的工具

```javascript
npm install eslint@7.14.0 eslint-loader@4.0.2 babel-eslint@10.1.0 -D
```

修改`webpack.config.js`配置，并在根目录下创建 `.eslintrc.js`文件。

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
  include: resolve(__dirname, 'src'), // 只检查src目录里面的文件
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
如果`react`开发不知道如何配置，使用`eslint-config-airbnb`。

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
文件 -> 首选项 -> 设置。 搜索：`codeActionsOnSave`。在`settings.json`中编辑。

```javascript
"editor.codeActionsOnSave": {
  "source.fixAll": true
}
```

## 8. sourcemap

- `sourcemap` 是为了解决开发代码与实际运行代码不一致时，帮助我们`debug`到原始文件代码的技术
- `webpack`通过配置可以自动给我们`source-map`文件，`map`文件是一种对应编辑文件和源文件的方法


|类别    |代码形式<div style="width: 80px"></div>|含义     |
| -------|:-----------|--------|
|`source-map`|原始代码| 最好的`sourcemap`质量有完整的结果，但是会很慢|
|`eval-source-map`|原始代码| 同样道理，但是最高的质量和最低的性能|
|`cheap-module-eval-source-map`|原始代码 |（只有行内）同样道理，但是更高的质量和更低的性能|
|`cheap-eval-source-map`|转换代码 |（行内）每个模块被`eval`执行，并且`sourcemap`作为`eval`的`dataurl`|
|`eval`|生成代码| 每个模块都被`eval`执行，并且存在`@sourceURL`，带`eval`的构建模式能`cache SourceMap`|
|`cheap-source-map`|转换代码| （行内） 生成的`sourcemap`没有列映射，从`loaders`生成的`sourcemap`没有被使用|
|`cheap-module-source-map`|原始代码| （只有行内）与上面一样除了每行特点的从`loader`中进行映射|
|`hidden-source-map`| 隐藏`sourcemap`|

其实只有五个关键字的组合：`eval`、`source-map`、`cheap`、`module`、`inline`。

|类别    |含义     |
| -------|:-----------|
|`eval`|使用`eval`包裹代码|
|`source-map`|产生`.map`文件|
|`cheap`|不包含列信息，也不包含`loader`和`sourcemap`|
|`module`|包含`loader`的`sourcemap`，否则无法定义源文件|
|`inline`|将`.map`作为`DataURI`嵌入，不单独生成`.map`文件|

### 8.1 开发环境

- 对`sourceMap`要求：快(`eval`)、信息全(`module`)
- 由于代码并未压缩，所以不在意列信息(`cheap`)
- `devtool`: `cheap-module-eval-source-map`

### 8.2 正式环境

- 并不希望任何人都可以在浏览器直接看到我们未编译的源码，所以不直接提供sourceMap给浏览器
- `devtool`: `hidden-source-map`


## 9. 打包第三方类库

```javascript
npm install lodash@4.17.20
```

### 9.1 直接引入

把第三方库直接打包到输出文件，特别大。模块内需要引入。

```javascript
import _ from 'lodash';
```

### 9.2 插件引入

- `webpack`配置`ProvidePlugin`后，在使用时将不需要`import`和`require`进行引入，直接使用
- `_ `函数会自动添加到当前模块的上下文，不需要模块内引入
- 这种方式也会将`lodash`打包到输出文件中。

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

- 不需要任何其他插件配合，直接将下面的代码添加到所有`loader之`前
- 还是需要在模块内至少手工引入一次，会把变量挂载全局对象上 `window._`
- 也需要打包的
- 需要模块内引入

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

如果我们想引入一个库，但是又不想让`webpack`打包，并且不影响在程序中以`window`全局等方式进行使用，可以通过`externals`。不需要模块内引入

- 缺点：在`html`文件中需要手动引入`CDN`

:::: tabs 

::: tab index.html
```javascript
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
```
:::

::: tab webpack.config.js

```javascript
module.exports = {
  externals: {
    jquery: '$', // 如果在模块内部引用了jquery这个模块，会从window.$上取值
  },
}
```
:::

::: tab index.js

```javascript
console.log(_.join(['a', 'b', 'c'], '@'));
```
:::

:::: 

### 9.5 html-webpack-externals-plugin

```javascript
npm i html-webpack-externals-plugin@3.8.0 -D
```

:::: tabs

::: tab webpack.config.js
```javascript
plugins: {
  new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: 'lodash', // 模块名
        entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js', // CDN脚本地址
        global: '_', // 全局变量名
      },
    ],
  }),
}
```
:::


::: tab index.js

```javascript
import { join } from 'lodash';

console.log(join(['a', 'b', 'c'], '@'));
```
:::

::::


## 10. watch

当代码发生修改后自动重新编译

```javascript
module.exports = {
  watch: true, // 开启监控模式。默认false,也就是不开启
  watchOptions: { // 只有开启监听模式时，watchOptions才有意义
    ignored: /node_modules/, // 忽略的文件夹
    aggregateTimeout: 300, // 监听到变化后会等300ms再去执行（防抖的优化）
    poll: 1000, // 轮询。每秒问操作系统多少次文件是否变化
  },
}
```

- `webpack` 定时获取文件的更新时间，并跟上次保存的时间进行比对，不一致就表示发生了变化，`poll`就用来配置每秒问多少次
- 当检测文件不再发生改变，会先缓存起来，等待一段时间后在通知监听者，这个等待时间通过`aggregateTimeout`配置
- `webpack`只会监听`entry`依赖的文件
- 我们需要尽可能减少需要监听的文件数量和检查频率，当然频率降低会导致灵敏度下降


## 11. 添加商标

```javascript
plugins: {
  new webpack.BannerPlugin('xxx');
}
```

## 12. 拷贝静态文件

有时项目中没有引用的文件也需要打包到目标目录

```javascript
npm i copy-webpack-plugin@6.3.2 -D
```

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

new CopyWebpackPlugin({
  patterns: [
    {
      from: resolve(__dirname, 'src/design'), // 静态资源目录源地址
      to: resolve(__dirname, 'dist/design'), // 目标地址，相对于output的path目录
    },
  ],
}),
```

## 13. 打包前清空输出目录

```javascript
npm i clean-webpack-plugin@3.0.0 -D
```

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空目录

new CleanWebpackPlugin({ // 在重新打包前先把输出目录清空一下
  cleanOnceBeforeBuildPatters: ['**/*'],
}),
```

## 14. 服务器代理

如果有单独的后端开发服务器`API`，并且希望在同域名下发送`API`请求，那么代理某些`URL`会很有用。

### 14.1 不修改路径

```javascript
proxy: {
  '/api': 'http://localhost:3333',
},
```

### 14.2 修改路径

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3333',
    pathRewrite: {
      '^/api': '',
    },
  },
},
```

### 14.3 before after

`before`在`webpack-dev-server`静态资源中间件处理之前，可以用来拦截部分请求返回特定内容，或者实现简单的数据`mock`。

```javascript {6-15}
devServer: {
  contentBase: resolve(__dirname, 'static'),
  writeToDisk: true, 
  port: 8080, 
  open: false, 
  before(app) { // webpack-dev-server本质是一个express服务器 app
    app.get('/api/users', (req, res) => {
      res.json([{ name: 'zhufeng2', age: 12 }]);
    });
  },
  after(app) { 
    app.get('/api/users', (req, res) => {
      res.json([{ name: 'zhufeng2', age: 12 }]);
    });
  },
},
```

## 15. webpack-dev-middleware

```javascript
npm i webpack-dev-middleware@4.0.2 
```

创建文件`devServer.js`。与`webpack-dev-server`实现效果是一样的。
```javascript
const express = require('express');

const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

// 这个地方可以写业务，放后台业务
app.get('/api/users1', (req, res) => {
  res.json({ data: 'users1' });
});

const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3000);
```

- `webpak-dev-server`的好处是相对简单，直接安装依赖后执行命令即可
- `webpack-dev-middleware`的好处是在既有`express`代码基础上快速添加`webpack-dev-server`的功能，同时利用`express`老根据需求添加更多的功能，如`mock`服务、代理请求等。


## 16. 生产环境配置

### 16.1 提取CSS

因为CSS的下载和S可以并行，当一个`HTML`文件很大的时候，我们可以把`CSS`单独提取出来加载。

- `mini-css-extract-plugin`
- `filename` 打包后文件的名称

```javascript
npm i mini-css-extract-plugin@1.3.1 -D
```

```javascript
// 第一步：引入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独文件
// 第二步：修改loader配置
{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }, // CSS
{ test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] }, // less
{ test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }, // sass
// 第三步：插件使用
plugins:[
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
]
```

### 16.2 指定输出图片和CSS目录

```javascript {42,43,55}
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝静态文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css到单独文件

module.exports = {
  mode: 'development', 
  devtool: false,
  entry: './src/index.js', 
  output: {
    path: resolve(__dirname, 'dist'), 
    filename: 'main.js', 
    publicPath: '/', 
  },
  devServer: {
    contentBase: resolve(__dirname, 'static'),
    writeToDisk: true,
    port: 8080, 
    open: false, 
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader', 
        options: { fix: true }, 
        enforce: 'pre', 
        include: resolve(__dirname, 'src'), 
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }, // CSS
      { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] }, // less
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }, // sass
      {
        test: /\.(jpg|png|gif|bmp)$/,
        use: [{
          loader: 'url-loader', 
          options: {
            name: '[hash:10].[ext]', 
            esModule: false, 
            limit: 8 * 1024,
            outputPath: 'images', // 默认情况下图片放在dist根目录下，指定写入到输出目录dist/images
            publicPath: '/images', // 使用outputPath时，需要加上publicPath
          },
        }],
      }, // 图片
      { test: /\.html$/, use: ['html-loader'] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CleanWebpackPlugin({ // 在重新打包前先把输出目录清空一下
      cleanOnceBeforeBuildPatters: ['**/*'],
    }),
  ],
};
```

### 16.3 hash、chunkhash和contenthash
- 文件指纹：打包后输出的文件名和后缀
- `hash`一般是结合`CDN`缓存来使用，通过`webpack`构建之后，生成对应文件名自动带上对应的`MD5`值。如果文件内容发生改变的话，那么对应文件哈希值也会改变，对应的`HTML`引用`URL`地址也会改变，触发`CDN`服务器从资源服务器上拉去对应数据，进而更新本地缓存。

|占位符名称    |含义     |
| -------|:-----------|
|`ext`|资源后缀名|
|`name`|文件名称|
|`path`|文件的相对路径|
|`folder`|文件所在的文件夹|
|`hash`|每次`webpack`构建时生成一个唯一的`hash`值|
|`chunkhash`|根据`chunk`生成`hash`值，来源于同一个`chunk`，则`hash`值相同|
|`contenthash`|文件的内容`hash`，文件内容相同`hash`值相同|

创建文件`hash.js`模拟三种`hash`的生成

```javascript
function createHash() {
  return require('crypto').createHash('md5'); // 创建一个hash对象
}

const depModule1 = 'depModule1';
const depModule2 = 'depModule2';

const entry1 = `require("${depModule1}")`; // entry1入口文件，依赖depModule1
const entry2 = `require("${depModule2}")`; // entry2入口文件，依赖depModule2

// 两个入口文件
const entry = {
  entry1,
  entry2,
};

// 如果使用hash，那么它将是工程级别，没修改一个文件，所有的文件名都会发生改变
const hash = createHash()
  .update(entry1)
  .update(entry2)
  .update(depModule1)
  .update(depModule2)
  .digest('hex');

console.log('hash: ', hash); // hash:  f038bdaed39f4d8061b9c99d61c6bb78
// hash 与所有模块都有关系，只要有一个发生改变，hash都会发生改变

// chunkhash 会根据不同的入口文件，进行依赖文件解析，构建对应的hash值
// 修改 depModule1的内容，entry1ChunkHash发生改变，entry2ChunkHash不变
const entry1ChunkHash = createHash()
  .update(entry1)
  .update(depModule1)
  .digest('hex');
console.log('entry1ChunkHash: ', entry1ChunkHash); // entry1ChunkHash:  080984c6466ddb322e070af31ad4aa88

const entry2ChunkHash = createHash()
  .update(entry1)
  .update(depModule1)
  .digest('hex');
console.log('entry2ChunkHash: ', entry2ChunkHash); // entry1ChunkHash:  080984c6466ddb322e070af31ad4aa88

// contenthash 内容hash。只要内容没有改变，hash值就不会变
const file1Content = entry1 + depModule1;
const file1Hash = createHash()
  .update(file1Content)
  .digest('hex');
console.log('file1Hash: ', file1Hash); // file1Hash:  080984c6466ddb322e070af31ad4aa88

const file2Content = entry1 + depModule1;
const file2Hash = createHash()
  .update(file2Content)
  .digest('hex');
console.log('file2Hash: ', file2Hash); // file2Hash:  080984c6466ddb322e070af31ad4aa88
```


#### 16.3.1 hash
- `hash`是整个项目的`hash`值，其根据每次编译内容计算得到，每次编译之后都会生成新的`hash`，即修改任何文件都会导致所有文件的哈数发生修改。

```javascript {5,6,10,17}
module.exports = {
  mode: 'development', 
  devtool: false,
  entry: {
    main: './src/index.js',
    vendor: ['lodash'], // 第三方
  },
  output: {
    path: resolve(__dirname, 'dist'), 
    filename: '[name].[hash:8].js', 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
    }),
    new CleanWebpackPlugin({ 
      cleanOnceBeforeBuildPatters: ['**/*'],
    }),
  ],
};
```

#### 16.3.2 chunkhash
- 采用`hash`计算的话，每次构建后生成的`hash`值都不一样，即使文件内容没有改变，这种方式无法实现缓存效果，因此我们需要另一种哈希值计算方式，即`chunkhash`。
- `chunkhash`与`hash`不同，它根据不同入口文件（`entry`）进行依赖文件解析、构建对应的`chunk`，生成对应的哈希值。我们生产环境中会把一些公共库和程序入口文件区分开，单独打包构建，接着采用`chunkhash`的方式生成哈希值，只要我们不改动公共库的代码，就可以保证其哈希值不会受影响

```javascript {10,17}
module.exports = {
  mode: 'development', 
  devtool: false,
  entry: {
    main: './src/index.js',
    vendor: ['lodash'], // 第三方
  },
  output: {
    path: resolve(__dirname, 'dist'), 
    filename: '[name].[chunkhash:8].js', 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css',
    }),
    new CleanWebpackPlugin({ 
      cleanOnceBeforeBuildPatters: ['**/*'],
    }),
  ],
};
```


#### 16.3.3 contenthash

- 使用`chunkhash`存在一个问题，就是当在一个`JS`文件中引入`CSS`文件，编译后它们的哈希值是相同的，而且只要`JS`文件发生改变，关联的`CSS`文件`hash`也会发生改变，这个时候可以在`mini-css-extract-plugin`里使用`contenthash`值，保证即使`CSS`文件所在的模块里其他内容发生改变，直到`CSS`文件内容不变，那么就不会重复构建

```javascript {17}
module.exports = {
  mode: 'development', 
  devtool: false,
  entry: {
    main: './src/index.js',
    vendor: ['lodash'], // 第三方
  },
  output: {
    path: resolve(__dirname, 'dist'), 
    filename: '[name].[chunkhash:8].js', 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new CleanWebpackPlugin({ 
      cleanOnceBeforeBuildPatters: ['**/*'],
    }),
  ],
};
```

### 16.4 CSS兼容性

- postcss-loader
- postcss-preset-env：把现代的CSS转换为大多数浏览器能理解的
- postcss-preset-env 已经包含了autoprefixer和browsers选项

```javascript
npm i postcss-loader@4.1.0 postcss-preset-env@6.7.0 -D
```

根目录下创建postcss.config.js文件。注意：package.json与postcss.config.js两者只要配置一个即可。

:::: tabs
::: tab webpack.config.js
```javascript {6,10,14}
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: [  MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
      },
      { 
        test: /\.less$/, 
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
      },
      { 
        test: /\.scss$/, 
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
    ],
  },
}
```
:::

::: tab package.json
```json
"browserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "production": [
    ">0.2%"
  ]
}
```
:::

::: tab postcss.config.js
```javascript
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssPresetEnv({
      browsers: 'last 5 version',
    }),
  ],
};
```
:::
::::

### 16.5 压缩JS、CSS和HTML

- optimize-css-assets-webpack-plugin是一个优化和压缩CSS自愿的插件
- terser-webpack-plugin是一个优化和压缩JS的插件

```javascript
npm i optimize-css-assets-webpack-plugin@5.0.4 terser-webpack-plugin@5.0.3 -D
```

```javascript {1,2,6-8,16,17,23}
const TerserPlugin = require('terser-webpack-plugin'); // 压缩JS
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩CSS

module.exports = {
  optimization: {
    minimize: true, // 启用最小化
    minimizer: [ // 使用哪些插件
      new TerserPlugin(), // 以前使用UglifyJS（不支持ES6），TerserPlugin支持ES6。压缩JS
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: { // 压缩HTML
        collapseWhitespace: true, // 去掉空格
        removeComments: true, // 去掉注释
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩CSS
  ]
}
```

### 16.6 px自动转成rem

- px2rem 处理css，转px为rem
- lib-flexible：自动计算 rem等于多少像素

```javascript
npm i px2rem-loader@0.1.9 lib-flexible@0.3.2 -D
```

:::: tabs 
::: tab webpack.config.js
```javascript {8-11}
{
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    {
      loader: 'px2rem-loader',
      options: {
        remUnit: 75, // 一个rem是多少个像素
        remPrecision: 8, // 计算rem的单位，保留几位小数，设置精度
      },
    },
  ],
}
```
:::
::: tab index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5</title>
  <script>
    // 这部分实际上就是 lib-flexible的源码实现
    let docElement = document.documentElement;
    // 设置根元素font-size的大小
    function setRemUni(){
      // 把根元素的大小设置为宽度的十分之一
      // 屏幕宽750px font-size为75
      // iphone6 宽为375 font-size=37.5 10rem = 375px
      docElement.style.fontSize = document.clientWidth / 10;  // 屏幕的宽度/10 + 'px'
    }
    setRemUni();
    window.addEventListener('resize', setRemUni());// 监听resize事件
  </script>
</head>
```
:::
::: tab index.css
```css
#root{
  width: 750px;
  height: 750px;
  border: 1px solid red;
}
```
:::
::::


## 17. polyfill

theo 三个概念
- 最新ES语法：比如，箭头函数
- 最新ES API：比如，promise
- 最新ES实例方法：比如，String.prototype.includes
:::

### 17.1 @babel/polyfill

- Babel默认只转换新的JavaScript语法，而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象。以及一些在全局对象上的方法（比如Object.assign、Array.from）都不会转码。如果想要运行这些语法，需要@babel/polyfill来转换。
- @babel/polyfill：是通过向全局对象和内置对象的prototype上添加方法来实现的。比如运行环境中不支持Array.prototype.find方法，引入polyfill，就可以使用es6方法来编写，但是缺点是会造成全局空间污染
- @babel/preset-env为每个环境的预设。默认支持语法转换，需要开始useBuiltIns配置才能转化API和实例方法
- @babel/preset-env：会根据预设的浏览器兼容列表从stage-4选取必须的plugin，也就是说，不引入别的stage-x。ES语法分为stage-0、stage-1、stage-2、stage-3、stage-4。@babel/preset-env将只支持stage-4。

```javascript
npm i @babel/polyfill@7.12.1
```

#### 17.1.1 useBuiltIns: "false"

- useBuiltIns可选值包括：usage | entry | false，默认为false，表示不对polyfill处理，这个配置是引入polyfill的关键
- 如果引入@babel/polyfill，则无视配置的浏览器兼容，引入所有的polyfill


:::: tabs

::: tab webpack.config.js
```javascript {10}
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: false, 
          }],
          '@babel/preset-react', // 可以转换JSX语法
        ],
        // 插件
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
          ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
        ],
      },
    },
  ],
},
```
:::

::: tab index.js
```javascript
import '@babel/polyfill';
```
:::

::::

useBuiltIns：false，并且引入 import '@babel/polyfill'。打包大小为464K。全量引入@babel/polyfill不考虑兼容的浏览器（也就是package.json中的browserslist配置的浏览器）。

#### 17.1.2 useBuiltIns: "entry"

- 在项目入口引入一次（多次引入会报错）
- useBuiltIns: "entry" 会根据配置的浏览器兼容，当浏览器不兼容时，再引入polyfill。需要再入口文件手动添加 import '@babel/polyfill'。
- 同时需要指定core-js的版本。如果"corejs":3，则import '@babel/polyfill'需要改成import 'core-js/stable';
import 'regenerator-runtime/runtime';
- corejs默认是2。需要手动导入import '@babel/polyfill'

:::: tabs

::: tab webpack.config.js
```javascript {10,11}
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: 'entry',
            corejs: 2, // 指定corejs的版本号 2或者3
          }],
          '@babel/preset-react', // 可以转换JSX语法
        ],
        // 插件
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
          ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
        ],
      },
    },
  ],
},
```
:::

::: tab index.js
```javascript
import '@babel/polyfill';
```
:::

::::

- useBuiltIns: 'entry' 
- corejs:2
- 不是全量引入了，而是会考虑要支持的浏览器

如果要使用corejs:3,则需要安装依赖
```javascript
npm i core-js@3.7.0
```
:::: tabs

::: tab webpack.config.js
```javascript {11}
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: 'entry',
            corejs: 3, 
          }],
          '@babel/preset-react', // 可以转换JSX语法
        ],
        // 插件
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
          ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
        ],
      },
    },
  ],
},
```
:::

::: tab index.js
```javascript
import 'core-js/stable'
```
:::

::::


严格按照浏览器的要求来引入polyfill，和项目是否用到没有关系。

#### 17.1.3 useBuiltIns: "usage"

- 根据配置的浏览器兼容，以及代码中用到的API来进行引入polyfill，实现按需添加
- 当使用usage时，polyfill会自动按需添加，不在需要手动引入

```javascript {10}
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3, 
          }],
          '@babel/preset-react', // 可以转换JSX语法
        ],
        // 插件
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
          ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
        ],
      },
    },
  ],
},
```

### 17.2 babel-runtime

- Babel为了解决全局空间污染的问题，提供了单独的包babel-runtime用以提供编译模块的工具函数
- 简单的说babel-runtime更像是一种按需加载的实现，比如哪里需要使用Promise，只要再这个文件头部import Promise from 'babel-runtime/core-js/promise'就行了

```javascript
npm i babel-runtime@6.26.0 
```

```javascript
import Promise from 'babel-runtime/core-js/promise';

const p = new Promise();
```

这种方式比较麻烦，需要自己引入。

### 17.3 babel-plugin-transform-runtime

主要是为了解决：
- 多个文件重复引用相同helper（帮助函数） -> 提取到运行时
- 新API方法全局污染 -> 局部引入

```javascript
npm i @babel/plugin-transform-runtime@7.12.1 @babel/runtime-corejs3 --save-dev
```

```javascript {14-17}
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        // 预设（插件的集合）
        presets: [
          ['@babel/preset-env'], // 只转换语法，不转换API和方法
          '@babel/preset-react', 
        ],
        // 插件
        plugins: [
          ['@babel/plugin-transform-runtime', {
            corejs: 3, // 配置corejs 可以转换API和方法
            helpers: false,
            regenerator: false,
          }],
          ['@babel/plugin-proposal-decorators', { legacy: true }], // 使用装饰器语法
          ['@babel/plugin-proposal-class-properties', { loose: true }], // 类属性
        ],
      },
    },
  ],
},
```

#### 17.3.1 corejs: 3

当我们使用ES6的静态事件或内置对象时自动引入 babel/runtime-corejs3。和preset配置的模块core-js@3不一样。

```javascript
// =  __webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/promise */
const p = new Promise(() => { });
console.log(p);
```

#### 17.3.1 helper: true

- 移除内联babel helper并替换使用@babel/runtime-corejs3/helpers
- 避免内联的helper代码再多个文件重复出现

#### 17.3.2 regenerator: true

- 是否开启generator函数转换成使用regenerator runtime来避免污染全局域


### 17.4 最佳实践

如何选择最适合的配置
- babel-runtime适合再组件和类库中使用。局部引入，不污染全局环境。
- babel-polyfill适合在业务项目中使用

#### 17.4.1 类库开发

- 类库开发尽量不适用污染全局环境的polyfill，因此@babel-preset-env之发挥语法转换的功能
- polyfill由 @babel/plugin-transform-runtime 来处理，推荐使用core-js@3

```javascript
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": {
                    "version": 3
                }
            }
        ]
    ]
}
```

#### 17.4.2 项目开发

- "useBuiltIns": "usage"
- @babel/plugin-transform-runtime" 只使用其内联复用的辅助函数的特性，减少打包体积

```javascript
{
  "presets": [
      [
          "@babel/preset-env",
          {
              "useBuiltIns": "usage",
              "corejs": 3
          }
      ]
  ],
  "plugins": [
      [
          "@babel/plugin-transform-runtime",
          {
              "corejs": false
          }
      ]
  ]
}
```

### 17.5 polyfill-service
- [polyfill.io](https://polyfill.io/v3/) 自动化的JavaScript polyfill服务
- 通过分析请求头信息中的 UserAgent 实现自动加载浏览器所需的 polyfills

```html
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
```


总结：
1. babel-polyfill 为什么有
2. preset-env
3. useBuiltIns
   false import babel/polyfill
   entry 只能入口引用一次，所有地方都能用
       corejs2 import babel-polyfill
       corejs3 import corejs generator
   usage 按需引入
      不需要自己引入模块，会根据你使用了哪些功能，自动引入哪些功能不定
babel-runtime 需要手动引入
babel-plugin-transform-runtime 可以实现自动分析，使用了哪些功能，局部引入对应补丁

两个效果基本相同：都是局部引入，按需引入
1. preset-env useBuiltIns usage
2. preset-env + babel-plugin-transform-runtime

## 18. 多入口配置

在src目录先创建pages文件夹，pages下创建page1.js、page2.js。以page1.js和page2.js为两个入口。

:::: tabs 
::: tab webpack.config.js
```javascript
const { resolve, join, basename } = require('path');

// 自动读取入口文件
const pagesRoot = resolve(__dirname, 'src', 'pages'); // 页面所在的根路径
const pages = fs.readdirSync(pagesRoot); // 读取pages下的所有文件
const entry = pages.reduce((entry, filename) => {
  // entry[page1] = '...'
  entry[basename(filename, '.js')] = join(pagesRoot, filename);
  return entry;
}, {});

console.log(entry);
/**
 * {
 *  page1: 'C:\\Users\\webpack-demo\\01-basic\\src\\pages\\page1.js',
 *  page2: 'C:\\Users\\webpack-demo\\01-basic\\src\\pages\\page2.js'
 * }
 */
module.exports = {
  entry: entry，
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page1.html', // 生成的html文件名
      chunks: ['page1'], // page1.html 应用 page1 的资源
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page2.html',
      chunks: ['page2'],
    }),
  ]
}
```
:::
::: tab page1.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5</title>
<script defer src="/page1.js"></script></head>
<body></body>
</html>
```
:::
::: tab page2.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5</title>
<script defer src="/page2.js"></script></head>
<body></body>
</html>
```
:::
::::

优化webpack.config.js
```javascript
const pagesRoot = resolve(__dirname, 'src', 'pages'); // 页面所在的根路径
const pages = fs.readdirSync(pagesRoot); // 读取pages下的所有文件
const htmlWebpackPlugins = [];
const entry = pages.reduce((entry, filename) => {
  // entry[page1] = '...'
  const entryname = basename(filename, '.js');
  entry[entryname] = join(pagesRoot, filename);
  htmlWebpackPlugins.push(new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: `${entryname}.html`, // html文件名
    chunks: [entryname], // page1.html 应用 page1 的资源
  }));
  return entry;
}, {});

module.exports = {
  entry: entry，
  plugins: [
    ...htmlWebpackPlugins,
  ]
}
```


## 19. 基础知识总结
1. webpack核心概念：Entry、Output、Module、Chunk、Loader、Plugin、Context。
2. 基本配置：
   1. entry：入口文件
   2. output：输出文件
   3. mode：运行环境
   4. module：模块配置
   5. plugins：插件配置
   6. devServer：开发环境配置
   7. optimize：优化配置
   8. external：第三方类库
   9. watch：打开监控模式。watchOptions配置：ignore忽略的文件、aggregateTimeout防抖优化、poll轮询
3. loader的相关：
   1. css-loader：处理import、url
   2. style-loader：将样式变成脚本插入到页面中
   3. less-loader：less变成css
   4. sass-loader：sass变成css
   5. file-loader：打包时将图片拷贝到`dist`目录下，并重命名文件名
   6. url-loader：与file-loader相比，只增加了limit参数配置
   7. html-loader：解决`html`中引入图片的相对路径

4. plugin相关：
   1. html-webpack-plugin：自动生成index.html文件
   2. clean-webpack-plugin: 打包钱清空目录。
   3. mini-css-extract-plugin：提取css到单独的文件
   
5. css、less、sass处理：style-loader、css-loader、less-loader、sass-loader
6. 图片的处理：file-loader、url-loader、html-loader
7. babel-loader：转换JS代码。babel-loader作用就是调用@babel/core，@babe/core将源码转成抽象语法树，具体如何转换语法使用preset-env。
8. ESLint代码校验配置：eslint-loader， fix 启动自动修复。enforce 强制执行顺序。
9.  sourceMap五个关键字
   1. eval：使用eval包裹，最快
   2. source-map：.map文件
   3. cheap：不包含类信息和loader的sourcemap
   4. module：包含loader的sourcemap，但是无法定义到源文件
   5. inline：不单独生成map文件
10. 打包第三方库：
    1.  直接引入：import 
    2.  插件引入：webpack.ProvidePlugin
    3.  expose-loader: + import
    4.  externals+html引入CDN
    5.  html-webpack-externals-plugin
11. 添加商标: webpack.BannerPlugin
12. 服务器代理配置：devServer.proxy，可以使用before、after
13. webpack-dev-middleware: webpack-dev-server 与express的结合使用
14. 提取css。mini-css-extract-plugin插件可以提取css到单独的文件中，filename设置文件名
15. 三种哈希值：
    1.  hash: 与所有模块都有关系，只要有一个发生改变，hash都会发生改变
    2.  chunkhash: 会根据不同的入口文件，进行依赖文件解析，构建对应的hash值
    3.  contenthash：内容hash。只要内容没有改变，hash值就不会变
16. css兼容性