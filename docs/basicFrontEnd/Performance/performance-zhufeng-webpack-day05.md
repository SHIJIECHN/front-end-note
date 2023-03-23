---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack loader
---

## loader
- loader只是一个导出为函数的JS模块，它接收一个loader产生的结果或者资源文件(resource file)作为入参。也可以用多个loader函数组成loader chain，最终输出转换后的结果。
- loader chain这样设计的好处是可以保证每个loader的职责单一，同时也方柏霓后期loader的组合和扩展
- compiler需要得到最后一个loader产生的处理结果。这个处理结果应该是string或者Buffer(被转换为一个string)

```javascript
/**
 * 
 * @param {*} source 上一个loader给我这个loader的内容或者原文件内容
 * @param {*} inputSourceMap 上一个loader传递过来的 sourceMap
 * @param {*} data 本loader额外的数据，每个loader都有一个自己的data，相互之间是完全独立的
 */
function loader(source, inputSourceMap, data) { 
 
}
module.exports = loader;
```

## loader-run

[loader-runner](https://github.com/webpack/loader-runner#readme)是一个执行loader链条的模块

### 1. loader执行流程

在loader的运行过程中，如果发现该loader上有pitch属性，会先执行pitch阶段，在执行normal阶段。

<img :src="$withBase('/basicFrontEnd/Performance/loader-runner.png')" alt="loader-runner" />


### 2. loader的类型
- post（后置）
- inline（内联）
- normal（正常）
- pre（前置）

执行顺序：post => inline => normal => pre。

loader的类型和它本身没有关系，而是和配置的enforce属性有关系

```js
module.exports = {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre', // 一定先执行
      use: ['pre-loader1', 'pre-loader2']
    },
    {
      test: /\.js$/, // 默认没有写，是normal
      use: ['normal-loader1', 'normal-loader2']
    },
    {
      test: /\.js$/,
      enforce: 'post', // post webpack保证一定是最后执行的
      use: ['post-loader1', 'post-loader2']
    },
  ]
}

// 行内loader
import xxx from "inline-loader1!inline-loader2!/src/xxx.css";
```

### 3. loader-run执行

目录结构
```javascript

```

:::: tabs
::: tab run-loader.js
```javascript
/** 
 * loader是如何组装和工作的 
 * 1. 为什么说loader的执行是从右向左，从下向上
 * 2. 为什么分成四种loader，loader类型不同决定执行的顺序
 *    因为loader配置是分散的，它可能会有多个配置文件合并而来
 * */
const path = require('path');
const fs = require('fs');
const { runLoaders } = require('loader-runner');
// 源文件的绝对路径 C:/User/src/05.loader/src/index.js
const filePath = path.resolve(__dirname, 'src', 'index.js');
let loaders = [];

// 如何得到 loaders 数组？
// 模拟要加载的资源 require('inline-loader1!inline-loader2!./src/index.js')
const request = `inline-loader1!inline-loader2!${filePath}`; // 行内loader
// 切分，先将前缀去掉，在分割  ['inline-loader1','inline-loader2','入口模块的路径']
const parts = request.replace(/^-?!+/, '').split('!');
// 最后一个元素就是要加载的资源文件 ./src/index.js
const resource = parts.pop();
// 将loader名称变成绝对路径
// loader=inline-loader1 => inline-loader1的绝对路径
// c:/user/05.loader/loaders/inline-loader1.js
const resolveLoader = (loader) => path.resolve(__dirname, 'loaders', loader);
// inlineLoaders = [inline-loader1的绝对路径, inline-loader2的绝对路径]
const inlineLoaders = parts.map(resolveLoader);
// 配置文件rules数组
const rules = [
  {
    test: /\.js$/,
    enforce: 'pre', // 前置loader。一定先执行
    use: ['pre-loader1', 'pre-loader2']
  },
  {
    test: /\.js$/, // 没有设置，默认是normal
    use: ['normal-loader1', 'normal-loader2']
  },
  {
    test: /\.js$/,
    enforce: 'post', // post webpack保证一定是最后执行的
    use: ['post-loader1', 'post-loader2']
  },
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  // 正则匹配上了模块的路径
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') { // enforce: 'pre'
      preLoaders.push(...rule.use)
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use)
    }
  }
}
// 通过loader名字，获得loader绝对路径
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);

if (request.startsWith('!!')) { // 不要pre、post、normal
  loaders = [...inlineLoaders];
} else if (request.startsWith('-!')) { // 不要pre、normal
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith('!')) { // 不要normal
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
console.log(loaders);
/**
 * 1. 读取要加载的资源
 * 2. 把资源传递给loader链条，一一处理，最后得到结果
 */
runLoaders({
  // 加载和转换的资源 可以包含查询字符串
  resource,
  // loader的绝对路径
  loaders,
  // 额外的loader上下文对象
  context: { name: 'zhufeng' },
  // 读取文件的方法
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  console.log(err)
  console.log(result);
  // "console.log('hello index.js');\r\n" + '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
})
```
:::
::: tab index.js
```javascript
console.log('hello index.js');
```
:::   
::: tab webpack.config.js
```javascript
module.exports = {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre', // 一定先执行
      use: ['pre-loader1', 'pre-loader2']
    },
    {
      test: /\.js$/,
      use: ['normal-loader1', 'normal-loader2']
    },
    {
      test: /\.js$/,
      enforce: 'post', // post webpack保证一定是最后执行的
      use: ['post-loader1', 'post-loader2']
    },
  ]
}
```
:::   
::: tab package.json
```javascript
{
  "name": "5.loader",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "start": "webpack serve"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.10.0",
    "webpack-cli": "^4.2.0",
    "webpack-dev-server": "^3.11.0"
  },
  "dependencies": {
    "loader-runner": "^4.3.0",
  }
}
```
:::   
::::

执行run-loader文件，输出结果为：

```javascript
/**
 console.log(loaders);
 [
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\post-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\inline-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\normal-loader2',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader1',
  'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\loaders1\\pre-loader2'
]
 */
/**
 loader里面内容输出：
 post1-pitch
post2-pitch
inline1-pitch
inline2-pitch
normal1-pitch
normal2-pitch
pre1-pitch
pre2-pitch
pre2
pre1
normal2
normal1
inline2
inline1
post2
this.name:  zhufeng
post1
 */

/**
console.log(result);
{
  result: [
    "console.log('hello index.js');\n" +
      '//pre2//pre1//normal2//normal1//inline2//inline1//post2//post1'
  ],
  resourceBuffer: <Buffer 63 6f 6e 73 6f 6c 65 2e 6c 6f 67 28 27 68 65 6c 6c 6f 20 69 6e 64 65 78 2e 6a 73 27 29 3b 0a>,
  cacheable: true,
  fileDependencies: [
    'e:\\A01-basicFrontEnd\\performance\\webpack-demo\\5.loader\\src\\index.js'
  ],
  contextDependencies: [],
  missingDependencies: []
}
 */
```

loader文件夹中，统一写成：
```javascript
function loader(source) {
  console.log('pre1'); // pre2 inline1 inline2...
  return source + '//pre1'
}
loader.pitch = function () {
  console.log('pre1-pitch');
}
module.exports = loader
```

### 4. 特殊配置
|符号|含义|
|----|:----|
|!!|不要后置、普通、前置loader，只要内联loader|
|-!|不要普通、前置loader|
|!|不要普通loader|

### 5. pitch
- a!b!c!module，正常调用顺序是c、b、a，但是真正的调用顺序是a(pitch)、b(pitch)、c(pitch)。
- c、b、a任意其中一个pitch返回了值就相当于它以及右边的loader不再执行。比如如果b返回了字符串"result b"，则只有a会被系统执行，且a的loader接收到的参数result b。
- 根据loader的返回值，可以loader分成两种：
  - 1. 最左边的loader。返回值只能是JS代码，因为它的返回值是给webpack，webpack是要用它生成JS AST
  - 2. 其他的loader。返回值没有要求，可以是任意的内容，但是需要下一个loader能处理

## pitch阶段的参数解析

pitch内部有三个很重要的参数：previousRequest、currentRequest、remainingRequest

<img :src="$withBase('/basicFrontEnd/Performance/pitch.ipg')" alt="pitch" />

- previousRequest代表的是之前执行过pitch阶段的loader：loader1和loader2
- currentRequest代表的是当前正在执行pitch阶段的loader和后面未执行pitch阶段的loader：loader3、loader4、loader5、源文件
- remainingRequest代表未执行过pitch阶段的loader：loader4、loader5、源文件

其中remainingRequest和previosRequest作为pitch函数的默认参数。

```javascript
Loader.pitch = function (remainingRequest, previousRequest, data) {
  console.log(remainingRequest, previousRequest, data)
};
```

data用于传递数据。即在pitch函数中往data对象上添加数据，之后再normal函数里通过this.data的方式读取已添加的数据，也就是注入上下文。

```javascript
function loader(source) {
  console.log(this.data.a); //这里可以拿到值为1
  return source ;
}

loader.pitch = function () {
  this.data.a = 1;//注入参数
  console.log("loader-pitch");
};
```

## 使用自定义loader

在webpack中使用自定义loader主要有三种方式。

### 1. 配置loaderd绝对路径
```javascript
{
  test: /\.js$/,
  use: [
    {
      loader: path.resolve(__dirname, "./loaders/pre-loader1.js"),
      options: {
        /* ... */
      },
    },
  ],
},
```

### 2. 配置resolveLoader.alias配置别名

如果要写好几个自定义loadewr，这里就要配置好几个别名。

```javascript
resolveLoader: {
    alias: {
      "pre-loader1": path.resolve(__dirname, "./loaders/pre-loader1.js"),
    },
},
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: "pre-loader1",
          options: {
            /* ... */
          },
        },
      ],
    },
  ],
},
```

### 3. resolveLoader.modules
```js
resolveLoader: {
  //找loader的时候，先去loaders目录下找，找不到再去node_modules下面找
  modules: ["loaders", "node_modules"],
},
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: "pre-loader1",
          options: {
            /* ... */
          },
        },
      ],
    },
  ],
},
```

## 实战
- babel-loader
- file-loader
- url-loader
- less-loader
- style-loader
- css-loader
- sass-loader


## babel-loader 

环境配置：
```javascript
npm i @babel/core @babel/preset-env
```

babel-laoder只是将loader中的源代码交给babel库处理，拿到值返回。

:::: tabs 
::: tab loaders/babel-loader
```javascript
const core = require('@babel/core');
const path = require('path');
/**
 * @param {*} source 上一个loader给我这个loader的内容或者原文件内容
 * @param {*} inputSourceMap 上一个loader传递过来的 sourceMap
 * @param {*} data 本loader额外的数据，每个loader都有一个自己的data，相互之间是完全独立的
 */
function loader(source, inputSourceMap, data) { // es6
  // this是loaderContext，loader上下文对象，是一个唯一的对象，不管哪个loader或方法里，this都是同一个对象
  // console.log(this); 
  console.log(data.name); // 获取到pitch中设置的data的值
  const options = { // 传递给babel的参数
    presets: ["@babel/preset-env"], // 声明一个预设
    inputSourceMap,// 上一个loader传递过来的 sourceMap
    sourceMaps: true, // 告诉babel我要生成sourceMap
    filename: path.basename(this.resourcePath),
  }
  // 返回值：code=转换后的新代码，map=source map，需要配置devtool. ast=抽象语法树
  const { code, map, ast } = core.transform(source, options); // babel把es6转成es5
  return this.callback(null, code, map, ast); // null=错误原因
  // return code;
  /**
   * 什么时候之间return code，什么时候调用this.callback呢？
   * this.callback是this上自带的函数。
   * 当你需要返回多个值的时候需要使用this.callback来传递多个值
   * 只需要返回一个值，可以直接return code。
   * map什么用？可以让我们进行代码调试，debug的时候可以看到源代码
   * ast什么用？如果你返回了ast给webpack。webpack则直接分析就可以，不需要自己转AST了，节约时间。
   */
}
// data有什么用？
loader.pitch = function (remainingRequest, previousRequest, data) {
  data.name = 'label-loader-pitch';
}
module.exports = loader
```
:::   
::: tab webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve('./loaders/babel-loader.js')],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
:::   
::: tab src/index.js
```javascript
let sum = (a, b) => a + b; // 箭头函数，通过loader转成普通函数
console.log(sum(1, 2))
```
::: 
::: tab package.json
```javascript
{
  "name": "5.loader",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack",
    "start": "webpack serve"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@babel/preset-env": "^7.12.7",
    "webpack": "^5.10.0",
    "webpack-cli": "^4.2.0",
  },
  "dependencies": {
    "loader-runner": "^4.3.0",
    "mime": "^3.0.0",
  }
}
```
:::     
::::

@babel.core负责把源代码转成AST抽象语法树，然后遍历语法树，生成新的代码。但@babel/core并不认识具体的方法，也不会转换任何语法，它需要依赖babel插件。比如@babel/plugin-transfor-arrow-funcyions，可以识别箭头函数语法，并且把箭头函数转换成普通函数。

但是语法太多，每个语法都需要插件，我们需要把多个插件打包在一起形成预设，@babel/preset-env就是这样诞生的。

npm run build 错误：   
Function has non-object prototype 'null' in instanceof check。

解决：node版本，使用node 16.12.0可以解决。


## file-loader

file-loader用于处理图片。

:::: tabs
::: tab loaders/file-loader.js
```javascript
const { getOptions, interpolateName } = require('loader-utils');// 工具模块
/**
 * file-loader负责打包加载图片，
 * 原理就是将原始文件复制一份到目标目录dist里，然后返回新的文件名
 * 1. 把此文件内容拷贝到目标目录中
 * @param {*} content  
 */
function loader(content) {
  // this=loaderContext
  let options = getOptions(this) || {};// 获取我们在loader中配置的参数对象
  // 获得文件名
  let filename = interpolateName(this, options.name || "[hash].[ext]", { content }); // content文件内容
  // 其实就是想输出目录里多输出一个文件，文件名叫filename，content是内容
  this.emitFile(filename, content); // this.assets[filename]=content
  if (typeof options.esModule === 'undefined' || options.esModule) {
    return `export default "${filename}"`; // es modules输出方式
  } else {
    return `module.exports="${filename}"`; // commonJS输出
  }
}
loader.raw = true;
module.exports = loader;

/**
 * 为什么返回的都是字符串？
 * 最左边的loader 返回值只能是JS代码，因为它的返回值是给webpack，webpack是要用它生成JS AST。
 */
```
:::   
::: tab webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: [{
          loader: path.resolve('./loaders/file-loader.js'),
          options: {
            name: '[hash:8].[ext]',
            esModule: false,
          }
        }],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
:::   
::: tab src/index.js
```javascript
let logo = require('./images/kf.jpg');
let image = new Image();
image.src = logo;
document.body.appendChild(image);
```
:::
::::

## url-loader

url-loader与file-loader相似，url-loader可以设置一个阈值limit，当图片大于阈值时采用file-loader处理，输出文件。当图片大小小于阈值时，使用url-loader输出base64格式的字符串。

:::: tabs
::: tab url-loader.js
```javascript
const mime = require('mime');
const { getOptions } = require('loader-utils');// 工具模块

function loader(content) {
  // content 默认格式是字符串
  let options = getOptions(this) || {};
  // limit默认值8K
  let { limit = 8 * 1204, fallback = "file-loader" } = options;
  const mimeType = mime.getType(this.resourcePath); // image/jpeg
  if (content.length < limit) {
    let base64Str = `data:${mimeType};base64,${content.toString('base64')}`; // 固定格式
    // stringify 要让他是一个字符串，而非变量
    return `module.exports=${JSON.stringify(base64Str)}`;
  } else {
    // 大于阈值就是用file-loader
    let fileLoader = require(fallback);
    return fileLoader.call(this, content);
  }

}
// 如果你不希望webpack帮你把内容转成字符串的话，loader.raw=true，
// 这样的话content就是一个二进制Buffer
loader.raw = true;
module.exports = loader;
```
:::   
::: tab webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: [{
          loader: path.resolve('./loaders/url-loader.js'),
          options: {
            name: '[hash:8].[ext]',
            esModule: false,
            limit: 40 * 1024,
            fallback: path.resolve('./loaders/file-loader.js')
          }
        }],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
:::   
:::

## less-loader & style-loader

在开发环境下，.less文件解析一般会用到三个loader：less-loader、css-loader、style-loader

:::: tabs
::: tab loaders/less-loader.js
```javascript
/**
 * 把Less变成css
 */
let less = require('less');
function loader(content) {
  // 通过调用this.async方法可以返回一个函数，它会把loader的执行变成异步的，不会直接往下执行了，
  // 什么时候继续执行？调用callback。
  // 默认情况下loader执行是同步的
  console.log('this.resource', this.resource);
  // this.callback===callback 后面会将它的实现
  let callback = this.async();
  // 把less转成css
  less.render(content, { filename: this.resource }, (err, output) => {
    // 会让loader继续往下执行
    callback(err, output.css);
  })
}
module.exports = loader;
```
:::   
::: tab loaders/style-loader.js
```javascript
/**
 * 把css变成一个JS脚本
 * 脚本就是动态创建一个style标签，并且把这个style标签插入到HTML里header
 */

function loader(content) {
  return `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(content)};
    document.head.appendChild(style);
  `;
}
module.exports = loader;
```
:::   
::: tab webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [path.resolve('./loaders/style-loader.js'), path.resolve('./loaders/less-loader.js')],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
:::   
::::

## loader-run的实现

loader-run执行的整体思路：
1. runLoader方法执行
2. 执行pitch阶段的loader
3. 处理源文件
4. 执行normal阶段的loader
5. 执行运行成功后的回调函数
6. 执行外部传入的回调函数

```javascript
const { runLoaders } = require('./loader-runner');

runLoaders({
  // 加载和转换的资源绝对路径，可以包含查询字符串
  resource,
  // loader的绝对路径
  loaders,
  // loader上下文对象
  context: { name: 'zhufeng' },
  // 读取文件的方法
  readResource: fs.readFile.bind(fs)
}, function (err, result) {
  console.log(err)
  console.log(result);
})
```

### 1. run-loader的基本结构

定义一些基本的数据提供后续使用
```js
/** 拆分url中的：path、query、锚点 */
let PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
    path: result[1], // 路径名 c:/src/index.js
    query: result[2], // 查询字符串 ?name=zhufeng
    fragment: result[3], // 片段 锚点 #top
  }
}
/** 根据loader模块的绝对路径得到loader对象 */
function createLoaderObject(request) {
  let loaderObj = {
    path: '', // loader的绝对路径
    query: '',
    fragment: '',
    normal: null, // loader函数本身
    pitch: null, // pitch函数
    raw: false, // 是否需要转成字符串，默认是转的。如果raw为true，那么normal的参数就是Buffer
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过了
    normalExecuted: false, // normal函数是否已经执行过了
  }

  // loader的路径
  Object.defineProperty(loaderObj, 'request', {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment
    },
    set(loaderAbsPath) {
      let splittedResource = parsePathQueryFragment(loaderAbsPath);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    }
  })
  loaderObj.request = request;
  let normal = require(loaderObj.path);//拿到normal阶段的函数
  loaderObj.normal = normal;
  loaderObj.raw = normal.raw;
  let pitch = normal.pitch; // pitch阶段的函数
  loaderObj.pitch = pitch;
  return loaderObj;
}

function runLoaders(options, finalCallback) {
  let resource = options.resource || '';// 要加载的资源 c:/src/index.js?name=zhufeng#top
  let loaders = options.loaders || []; // loader绝对路径的数组
  let loaderContext = options.context || {};// 这个是一个对象，它将成为loader函数执行时候的上下文对象this
  let readResource = options.readResource || readFile; // 读取文件的方法
  let splittedResource = parsePathQueryFragment(resource);// 拆分url的path、query和锚点
  let resourcePath = splittedResource.path;
  let resourceQuery = splittedResource.query;
  let resourceFragment = splittedResource.fragment;
  let contextDirctory = path.dirname(resourcePath);// 要加载的资源所在的目录 c:/src

  let loadersObject = loaders.map(createLoaderObject); // 是一个数组，放着每个loader的各种信息

  loaderContext.content = contextDirctory;
  loaderContext.path = resourcePath;
  loaderContext.query = resourceQuery;
  loaderContext.fragment = resourceFragment;
  loaderContext.readResource = readResource;
  // 当前正在执行loader的索引，先执行pitch再执行normal阶段，都是靠索引控制的，
  // 先递增再递减，比如pitch阶段：0-1-2-3，到了normal阶段就是：3-2-1-0
  loaderContext.loaderIndex = 0; // 就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loadersObject;// 存放着所有的loader

  loaderContext.callback = null; // 调用callback可以让当前的loader执行结束,并且向后续的loader传递多个参数
  loaderContext.async = null; // 它是一个函数，可以把loader的执行同步变成异步

  // 下面定义属性
  // 要加载的资源resource c://src/index.js?name=zhufeng#top 包含loader
  Object.defineProperty(loaderContext, 'resource', {
    get() {
      // 也可以return resource
      return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment;
    }
  })
  // 要加载的资源resource c://src/index.js?name=zhufeng#top 包含loader
  // loader1.js!loader2.js!loader3.js!loader4.js!loader5.js!c:/src/index.js
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    }
  });
  // 剩余的请求
  Object.defineProperty(loaderContext, 'remainingRequest', { // loaderIndex=2时 loader4.js!loader5.js!c:/src/index.js
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).concat(loaderContext.resource).join('!')
    }
  });
  // 当前的请求
  Object.defineProperty(loaderContext, 'currentRequest', { // loader3!loader4.js!loader5.js!c:/src/index.js
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex).concat(loaderContext.resource).join('!')
    }
  });
  // 之前的请求
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex).join('!');
    }
  });
  // 当前loader的query
  Object.defineProperty(loaderContext, 'query', {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    }
  });
  // 当前loader的data,各个loader上单独定义的参数
  Object.defineProperty(loaderContext, 'data', {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    }
  });

  // 处理选项
  let processOptions = {
    resourceBuffer: null,// 存放要加载的模块的原始内容,默认为空,等文件加载后会赋值
  }

  // 开始从左向右遍历执行loader的pitch方法
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    finalCallback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer
    })
  })
}
exports.runLoaders = runLoaders;
```

### 2. 执行pitch阶段的loaders

核心思想:
1. 如果loaderIndex已经大于等于loader的长度了,代表pitch阶段执行完了,可以开始读取文件了.loaderIndex是当前正在执行loader的索引，先执行pitch再执行normal阶段，都是靠索引控制的，先递增再递减，比如pitch阶段：0-1-2-3，到了normal阶段就是：3-2-1-0.
2. 拿到当前的loader,如果当前的pitch阶段已经执行过了,就可以让当前的索引加1,执行下一个loader的pitch阶段
3. 拿到pitch函数,如果当前loader的pitch函数没有,则执行下一个loader的pitch函数
4. 如果pitchFunction有值,以同步或者异步调用pitchFunction函数,以loaderContext为this指针
5. 如果pitchFunction的运行结果不为undefined,则需要掉头执行前一个loader的normal阶段
6. 如果pitchFunction的运行结果为undefined,则需要执行下一个loader的pitch阶段

```javascript
/**
 * 执行loader的pitch方法
 * @param {*} processOptions {resourceBuffer:{}}
 * @param {*} loaderContext  loader里的this，就是所谓的上下文对象loaderContext
 * @param {*} finalCallback loader全部执行完全执行此回调
 */
function iteratePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 如果已经越界了，读取到最右边一个loader的右边,代表pitch阶段执行完了,开始读取文件
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finalCallback);// 读取文件
  }
  // 拿到当前的loader
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  // 如果当前的pitch已经执行过了,就可以让当前的索引加1,执行下一个loader的pitch
  if (currentLoaderObject.pitchExecuted) { // 执行过了
    loaderContext.loaderIndex++;
    // 执行下一个
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  }
  // 没有执行过,拿到pitch函数
  let pitchFunction = currentLoaderObject.pitch; // pitch方法
  currentLoaderObject.pitchExecuted = true; // 不管pitch有没有,豆要标记pitch函数已经执行过了
  if (!pitchFunction) { // 如果此loader没有提供pitch方法,则执行下一个loader的pitch
    return iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
  }
  // 如果pitchFunction有值,以同步或者异步方式调用pitchFunction,以loaderContext为this指针
  runSyncOrAsync(pitchFunction, loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data
    ], // 这里是给pitchFunction传的参数
    (err, ...values) => {
      // 判断有没有返回值,values就是返回值,如果有返回值就需要掉头执行前一个loader的normal阶段
      if (values.length > 0 && !!values[0]) {
        loaderContext.loaderIndex--; // 索引减一
        iterateNormalLoaders(processOptions, loaderContext, values, finalCallback);// 回到上一个loader，执行上一个loader的normal方法
      } else {
        // 如果没有return 就执行下一个loader的pitch
        iteratePitchingLoaders(processOptions, loaderContext, finalCallback);
      }
    })
}

/**
 * 每次loader函数的执行同步异步都是独立的
 * @param {*} pitchFn 要执行的函数
 * @param {*} loaderContext loaderContext
 * @param {*} args 参数数组
 * @param {*} runCallback 
 */
function runSyncOrAsync(pitchFn, loaderContext, args, runCallback) {
  let isSync = true; // 是否是同步，默认是的
  let isDone = false; // 是否fn已经执行完成，默认是false
  // 定义一个innerCallback,与loaderContext.callback是同一个函数
  const innerCallback = loaderContext.callback = function (err, ...args) {
    isDone = true;
    isSync = false;
    runCallback.apply(err, ...args); // 如果是异步执行，需要调用callback继续执行
  }
  loaderContext.async = function () {
    isSync = false; // 把同步标志设置为false 意思就是改为异步
    // this.async()返回的结果就是this.callback,它们是一样的
    return innerCallback
  }
  // 就是执行pitch函数，pitch的返回值可有可无
  let result = pitchFn.apply(loaderContext, args);
  // 如果是同步的，由本方法直接调用runCallback，用来执行下一个loader
  if (isSync) {
    isDone = true; // 直接完成
    return runCallback(null, result); // 执行回调
  }
  //如果是异步的，需要自己手动出发callback 也就是runCallback
}
```

### 3. 处理源文件0

核心思想:拿到源文件后将其传给normal阶段的第一个loader.

```javascript
/**
 * 读取文件
 * @param {*} processOptions 
 * @param {*} loaderContext 
 * @param {*} finalCallback 
 */
function processResource(processOptions, loaderContext, finalCallback) {
  loaderContext.loaderIndex--; // 重置索引。当前索引等于最后一个loader的索引
  let resourcePath = loaderContext.path;// c:/src/index.js 
  // 读取文件内容,拿到源文件的buffer
  loaderContext.readResource(resourcePath, (err, resourceBuffer) => {
    if (err) finalCallback(err);
    processOptions.resourceBuffer = resourceBuffer;// 放的是资源的原始内容
    // 执行normal阶段的loader
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], finalCallback);
  })
}
```

### 4. 执行normal阶段的loader
核心思想:遍历执行normal阶段的函数,如果loaderContext.loaderIndex < 0,代表normal阶段的loader已经全部执行完成,开始执行成功的回调.

```javascript
// 执行normal阶段的loader
function iterateNormalLoaders(processOptions, loaderContext, args, finalCallback) {
  // 如果索引已经小于0了，表示所有的normal执行完成了
  if (loaderContext.loaderIndex < 0) {
    return finalCallback(null, args);
  }
  // 获取当前正在执行的loader
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.normalExecuted) { // 执行过了
    loaderContext.loaderIndex--;
    // 执行下一个
    return iterateNormalLoaders(processOptions, loaderContext, args, finalCallback);
  }
  // 没有执行过,拿到normal函数
  let normalFunction = currentLoaderObject.normal; // normal方法
  currentLoaderObject.normalExecuted = true;
  // 转换资源
  // 一般loader里面拿到的source都是字符串,但是如果要加载一些图片字体之类的,它需要接收一个buffer,
  // 这个时候用户可以自定义接收的数据类型是string还是buffer，默认是string
  // loader.raw=true 这么设置代表需要的是buffer数据类型
  converArgs(args, currentLoaderObject.raw);
  runSyncOrAsync(normalFunction, loaderContext, args, (err, ...values) => {
    if (err) finalCallback(err);
    iterateNormalLoaders(processOptions, loaderContext, values, finalCallback);
  })
}

function converArgs(args, raw) {
  // 想要Buffer但现在不是Buffer，则转成Buffer
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0]);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    // 想要字符串，但是现在是Buffer，则转成字符串
    args[0] = args[0].toString('utf8');
  }
}
```
