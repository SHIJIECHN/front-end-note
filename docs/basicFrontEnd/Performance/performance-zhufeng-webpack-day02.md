---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack工作流
---

## 1. 预备知识

### 1.1 Symbol.toStringTag

- Symbol.toStringTag是一个内置Symbol，通常作为对象的键使用，对应的属性值应该为字符串类型，这个字符串用来标识该对象的自定义类型标签，通常只有内置的Object.prototype.toString()方法会去读取这个标签并把它包含在自己的返回值里。

```javascript
console.log(Object.prototype.toString.call('foo')); // [object String]
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call(1)); // [object Number]
console.log(Object.prototype.toString.call(true)); // [object Boolean]
console.log(Object.prototype.toString.call(null)); // [object Null]
console.log(Object.prototype.toString.call(undefined)); // [object Undefined]

const myExports = {};
console.log(Object.prototype.toString.call(myExports)); // [object Object]
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
// myExports[Symbol.toStringTag] = 'Module'
console.log(Object.prototype.toString.call(myExports)); // [object Module]
```

## 2. 打包的文件分析

```javascript
npm init -y
// 安装依赖
npm i webpack@5.9.0 webpack-cli@4.2.0 html-webpack-plugin@4.5.0 clean-webpack-plugin@3.0.0 -D
```

- 去掉注释正则： `(\/\*)[\s\S]*?\*\/`
- 去掉空白行：`^\s*(?=\r?$)\n`

### 2.1 初始化配置打包

:::: tabs 

::: tab webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBiuldPatterns: ['**/*'] }),
  ],
}
```
:::   
::: tab package.json
```json {7,8}
{
  "name": "02-bundle",
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
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.5.0",
    "webpack": "^5.9.0",
    "webpack-cli": "^4.2.0"
  }
}
```
:::   
::: tab index.js
```javascript
let title = require('./title.js');
console.log(title);
```
:::  
::: tab title.js
```javascript
module.exports = 'title';
```
:::
::: tab index.html
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5</title>
</head>
<body>
</body>
</html>
```
:::   
::: tab 打包后的文件
```javascript
var __webpack_modules__ = ({
  "./src/title.js":
    ((module) => {
      module.exports = 'title';
    })
});
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  if (__webpack_module_cache__[moduleId]) {
    return __webpack_module_cache__[moduleId].exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}
(() => {
  let title = __webpack_require__("./src/title.js");
  console.log(title);
})();
;
```
:::   
::::

- 模块ID：不管你是用什么样的路径来加载的，最终莫夸ID统一会变成相对根目录的相对路径
  - index.js -> ./src/index.js
  - title.js -> ./src/title.js
  - JQuery

### 2.2 打包文件手写main.js

```javascript
(() => {
  // 1. webpack 自己读取模块产生
  var modules = {
    './src/title.js': (module) => {
      module.exports = 'title';
    }
  }

  var cache = {}; // 缓存对象
  function require(moduleId) { // moduleId = './src/title.js'
    if (cache[moduleId]) { // 先看缓存中有没有已经缓存的模块对象
      return cache[moduleId].exports; // 如果有就直接返回
    }
    // 定义变量module，默认为{ exports: {}}，并将该对象往缓存cache中也缓存一份：moduleId:{ exports: {} }
    var module = cache[moduleId] = {
      exports: {}
    }
    // module为{exports: {} }, module.exports为空对象{}, require是一个函数
    modules[moduleId](module, module.exports, require); // 从modules中拿出moduleId对应的函数并执行
    return module.exports; // 返回
  }

  // 2. .src/index.js
  (() => {
    let title = require('./src/title.js');
    console.log(title);
  })();
})();
```

1. webpack首先是一个自行执行函数，webpack自己读取模块产生 modules
2. 在函数中，使用require函数加载模块内容，所有的操作都在require函数中进行

## 3. 兼容性实现

|模块类型    |导出模块     | 导入模块 |
| -------|:-----------|:-----------|
|CommonJS|exports、module.exports|require|
|ES6|export、export default|import|

### 3.1 CommonJS加载CommonJS

:::: tabs 
::: tab index.js
```javascript
// CommonJS模块
let title = require('./title.js');
console.log(title.name);
console.log(title.age);
```
:::   

::: tab title.js
```javascript
// CommonJS 模块
exports.name = "title_name";
exports.age = "title_age";
```
:::   

::: tab main.js
```javascript
(() => { 
  var modules__ = ({
    "./src/title.js":
      ((module, exports) => {
        exports.name = "title_name";
        exports.age = "title_age";
      })
  });
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    };
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  (() => {
    let title = require("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  })();
})();
```
:::   
:::: 

### 3.2 CommonJS加载ES6模块

::: theorem 如果原来是es module，如何变成CommonJS？
export defult => exports.default   
export xxx => exports xxx
:::

:::: tabs
::: tab index.js
```javascript
let title = require('./title.js');
console.log(title.name); //Module = { age: 'title_age', default: 'title_name'}
console.log(title.age); // title_age

/**
 * CommonJS导入ES6。title有两个属性:
 * {
 *    default: 'title_name', // 默认导出放在default属性上
 *    age: 'title_age', 
 * }
 */
```
:::   
::: tab title.js
```javascript
// ES6模块
export default 'title_name'; // 默认导出
export const age = 'title_age'; // 批量导出
```
:::
::: tab main.js
```javascript
(() => {
  var modules = {
    // module为{exports:{}}, exports为空对象{}, require为函数
    './src/title.js': (module, exports, require) => {
      // 不管是CommonJS还是es module最后都变成了CommonJS，如果原来是es module的话
      // 就把exports传给r方法处理一下：exports.__esModule = true，以后就可以通过这
      // 个属性来判断原来是不是es module

      // 将es module转成CommonJS
      require.r(exports);
      require.d(exports, {
        default: () => DEFAULT_EXPORT, // getter 
        age: () => age
      })
      const DEFAULT_EXPORT = 'title_name'; // 默认导出
      const age = 'title_age'; // age
    }
  }

  /**
    经过处理后exports为：
    exports: {
      default: () => DEFAULT_EXPORT,
      age: () => age,
      Symbol.toStringTag: 'Module',
      __esModul: true
    }
 */

  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }

  require.r = (exports) => { // r方法作用是添加属性：添加Symbol.toStringTag和__esModule属性给exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }

  require.d = (exports, definition) => { // definition就是导出的内容，包括{defualt:xx, age:xx}
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }

  // .src/index.js
  (() => {
    let title = require('./src/title.js');
    console.log(title);
  })();
})();
```
:::
::::


为什么 DEFAULT_EXPORT 可以拿到值？

```javascript
function fn() {
  let getValue = () => value; // getValue是个函数，并没有执行，也没有尝试去获取value的值
  let value = 'hello';
  return getValue;
}

let getValue = fn();
console.log(getValue());// hello
```
### 3.3 ES module加载ES module

webpack如何知道这是个es module还是commonjs
如果代码里面有了import 或者export webpack就认为这是一个es module 不管有没有require exports

:::: tabs 
::: tab index.js
```javascript
// ES6 模块
import name, { age } from './title';
console.log(name);
console.log(age);
```
:::   
::: tab title.js
```javascript
// ES6 模块
export default 'title_name'; // 默认导出
export const age = 'title_age'; // 批量导出
```
:::   

::: tab main.js
```javascript
(() => {
  var modules = {
    "./src/index.js": // 因为index.js也是一个ES6模块，所以也需要转换成CommonJS
      ((module, exports, require) => {
        require.r(exports);
        var title = require("./src/title.js");
        console.log(title.default);
        console.log(title.age);
      }),
    './src/title.js': (module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        default: () => DEFAULT_EXPORT, // getter 
        age: () => age
      })
      const DEFAULT_EXPORT = 'title_name'; // 默认导出
      const age = 'title_age'; // age

    }
  }

  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }

  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }

  // .src/index.js
  (() => {
    require("./src/index.js");
  })();
})();
```
:::   
::::

### 3.4 ES module加载CommonJS

require.n()方法有什么用？解决兼容

:::: tabs 
::: tab index.js
```javascript
// ES6 模块
import name, { age } from './title';
console.log(name);
console.log(age);
```
:::
::: tab title.js
```javascript
// CommonJS模块
module.exports = {
  name: 'title_name',
  age: 'title_age'
}
```
:::   
::: tab mian.js
```javascript
(() => {
  var modules = {
    "./src/index.js":
      ((module, exports, require) => {
        require.r(exports);
        var title = require("./src/title.js"); // {name: 'title_name', age: 'title_age'}
        // n方法有什么用? 在这个地方我根本不知道title.js是es module还是commonJS，
        // 所以需要将两种情况都进行考虑，解决兼容性
        var title_default = require.n(title);
        console.log((title_default())); // 默认值
        console.log(title.age);// age

      }),
    "./src/title.js":
      (module) => {
        module.exports = {
          name: 'title_name',
          age: 'title_age'
        }
      }
  }

  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.n = (exports) => {
    // 如果是es6模块，返回值就是exports default类型，如果是CommonJS模块就返回它自己
    var getter = exports._esModule ? () => exports.default : () => exports;
    return getter;
  };
  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
  // .src/index.js
  (() => {
    require("./src/index.js");
  })();
})();
```
:::   
::::

### 3.5 总结
- common+common 不需要任何处理
- commom+es6  es6需要转成common
- es6+es6 两个es6都要转成common
- ex6+common es6需要转成common


## 4. 异步加载代码块


:::: tabs
::: tab webpack.config.js
```javascript {12}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].main.js' // 修改模块输出的名称为xxx.main.js，默认是_src_xx_main.js
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin({ cleanOnceBeforeBiuldPatterns: ['**/*'] }),
  ],
}
```
:::   
::: tab index.js
```javascript
// 动态import，并给模块一个名称
import(/* webpackChunkName: "hello" */ './hello.js').then(result => {
  console.log(result.default)
})
```
:::   
::: tab hello.js
```javascript
// ES6 模块
export default 'hello';
```
:::   
::: tab main.js
```javascript
(() => {
  // 存放所有的模块定义，包括懒加载，或者说异步加载过来的模块定义
  var modules = ({});
  var cache = {};
  // 因为在require的时候，只会读取modules里面的模块定义
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.f = {};
  // 如何异步加载额外的代码块 chunkId=hello
  // 2. 创建promise，发起jsonp请求
  require.e = (chunkId) => {
    let promises = [];
    require.f.j(chunkId, promises);
    return Promise.all(promises); // 等着promises数组都成功以后
  }
  require.p = ''; // publicPath资源访问路径 / 或者 ''
  require.u = (chunkId) => { // 参数是代码块的名字，返回值是这个代码块的文件名
    return chunkId + '.main.js'; // hello.main.js
  }
  // 已经安装的代码块 main代码块的名字 0表示已经就绪
  let installedChunks = {
    main: 0,
    // hello: [resolve, reject]
  }
  // 3. 通过JSONP异步加载chunkId，也就是hello这个代码块
  require.f.j = (chunkId, promises) => {
    // 创建一个新的promise，放到了数组中去
    let promise = new Promise((resolve, reject) => {
      installedChunks[chunkId] = [resolve, reject];
    });
    promises.push(promise);
    var url = require.p + require.u(chunkId); // /hello.main.js
    require.l(url); // 加载额外的脚本
  }
  // http://localhost:5500/hello.main.js
  // 4. 通过jsonp请求这个新的地址
  require.l = (url) => {
    let script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script); // 一旦添加到head里，浏览器会立刻发出请求
  }
  // 6. 开始执行回调
  var webpackJsonpCallback = ([chunkIds, moreModules]) => {
    // chunkIds=['hello']
    // let resolves = chunkIds.map(chunkId => installedChunks[chunkId][0]); // resolves数组保存resolve函数
    let resolves = [];
    for (let i = 0; i < chunkIds.length; i++) {
      let chunkData = installedChunks[chunkIds[i]];
      installedChunks[chunkIds[i]] = 0;
      resolves.push(chunkData[0]);
    }
    // 把异步加载回来的额外代码块合并到总的模块定义对象modules上去
    for (let moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId]
    }
    resolves.forEach(resolve => resolve());
  }
  require.r = (exports) => { // r方法作用是添加属性：Symbol.toStringTag和__esModule
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(exports, '__esModule', { value: true }); // __esModule=true 标识
  }
  require.d = (exports, definition) => {
    for (let key in definition) { // 循环definition，将属性赋给exports定义属性
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
  // 0. 把空数组赋给window['webpack5']，然后重写了window['webpack5'].push方法
  var chunkLoadingGlobal = window['webpack5'] = [];
  // 然后重写了window['webpack5'].push = webpackJsonpCallback
  chunkLoadingGlobal.push = webpackJsonpCallback;
  // 异步加载hello代码块，把hello代码块里的模块定义合并到主模块定义里面去
  // 再去加载这个hello.js这个模块，拿到模块的导出结果
  // 1. 准备加载异步代码块hello
  require.e("hello").then(require.bind(require, "./src/hello.js")).then(result => {
    console.log(result.default)
  })
})();
```
:::   
::: tab hello.main.js
```javascript
// window["webpack5"]里面是二维数组
// window["webpack5"] 是什么
// 5. 执行window["webpack"]上的push方法，传递参数[chunkId, moreModules]
(window["webpack5"] = window["webpack5"] || []).push([["hello"], {
  "./src/hello.js":
    ((module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        "default": () => __WEBPACK_DEFAULT_EXPORT__
      });
      const __WEBPACK_DEFAULT_EXPORT__ = ('hello');
    })
}]);
```
:::   
::::

1. 通过requir.e方法将异步模块加载进来
2. e方法中创建promises存在加载后的模块状态

## 5. husky

代码提交规范

http://zhufengpeixun.com/strong/html/114.react+typescript.html#t23.%20git%E8%A7%84%E8%8C%83%E5%92%8Cchangelog

## 6. 抽象语法树

抽象语法树（AST）是源代码语法结构的一种出现表示，它以树状的形式表现编程语言的语法结构，树上每个节点都表示源代码中的一种结构。

通过JavaScript Parser把代码转化为一颗抽象语法树（AST），这棵树定义了代码的结构。

### 1. JavaScript Parse

- JavaScript Parser是把JavaScript源码转化为抽象语法树的解析器
- 浏览器会把JS源码通过解析器转为抽象语法树，在进一步转化为字节码或直接生成机器码
- 一般来说每个JS引擎都会有自己的抽象语法树格式，Chrome的V8引擎，Firefox的SpiderMonkey引擎

#### 1.1 常用的JavaScript Parse
- esprima
- traceur
- acorn
- shift

#### 1.2 esprima
- 通过esprima把源码转化为AST
- 通过estraverse遍历并更新AST
- 通过escodegen将AST重新生成源码
- [astexplorer](https://astexplorer.net/)AST的可视化工具

```javascript
npm i esprima@4.0.1 estraverse@5.3.0 escodegen@2.0.0 -S
```

```javascript
let esprima = require('esprima'); // 把源代码转成抽象语法树
let estraverse = require('estraverse');
let escodegen = require('escodegen');
// 原代码就是ascii字符串
let sourceCode = `function ast(){}`;
let ast = esprima.parseModule(sourceCode); // 生成ast
console.log(ast);

/**
 * 遍历语法树，遍历的方式采用的是深度优先的方式
 * 如果一个节点遍历完成后，它同时有儿子和弟弟，如果先遍历弟弟，就是广度，如果先遍历儿子在遍历弟弟就是深度
 */

let indent = 0; // 缩进几个空格
const padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
  enter(node) {
    // 在遍历语法树的时候可以对它进行转换
    console.log(padding() + "进入" + node.type);
    if (node.type === 'FunctionDeclaration') { // 可以做一些修改转换
      node.id.name = 'new' + node.id.name;
    }
    indent += 2
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + "离开" + node.type);
  }
})

/**
进入Program
  进入FunctionDeclaration
    进入Identifier
    离开Identifier
    进入BlockStatement
    离开BlockStatement
  离开FunctionDeclaration
离开Program
 */

/**
 * 重新生成代码
 */
let targetCode = escodegen.generate(ast);
console.log(targetCode);
/**
function newast() {
}
 */
```

### 2. babel插件

- [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md)
- [babel-types](https://babeljs.io/docs/babel-types.html)
- [astexplorer](https://astexplorer.net/)

- 访问者模式Visitor对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同
- visitor的对象定义了用于AST中获取具体节点的方法
- visitor上挂载以节点type命名的方法，当遍历AST的时候，如果匹配上type，就会执行对应的方法
- @babel/core Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse

|属性|说明|
|---|:---|
|path|当前AST节点路径|
|node|当前AST节点|
|parent|父AST节点|
|parentPath|父AST节点路径|
|scope|作用域|
|get(key)|获取某个属性的path|
|set(key,node)|设置某个属性|
|is类型(opts)|判断当前节点是否是某个类型|
|find(callback)|从当前节点一直向上找到根节点（包括自己）|
|findParent(callback)|从当前节点一直向上找到根节点（不包括自己）|
|insertBefore(nodes)|在之前插入节点|
|insertAfter(nodes)|在之后插入节点|
|replaceWith(replacement)|用某个节点替换当前节点|
|replaceWithMultiple(nodes)|用多个节点替换当前节点|
|replaceWithSourceString(replacement)|把源代码转成AST节点再替换当前节点|
|remove()|删除当前节点|
|traverse(visitor,state)|遍历当前节点的子节点，第一个参数是节点，第二个参数是用来传递数据的状态|
|skip()|跳过当前节点子节点的遍历|
|stop()|结束所有的遍历|



#### 2.1 转换箭头函数
[babel-plugin-transform-es2015-arrow-functions](https://www.npmjs.com/package/babel-plugin-transform-es2015-arrow-functions)

```javascript
// 箭头函数
const sum = (a,b)=>a+b;
```
转换后
```javascript
// 转换后
var sum = function sum(a, b) {
  return a + b;
};
```

```javascript
npm i @babel/core@7.21.3 babel-types@6.26.0 -D
```

```javascript
let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a,b)=>{
  console.log(this);
  return a+b
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    // 属性就是节点的类型，babel在找到对应类型的节点的时候会调用此函数
    ArrowFunctionExpression(nodePath) { // 如果是箭头函数，就进入，参数是节点的路径
      let node = nodePath.node; // 获取当前路径上的节点
      // 处理this指针的问题
      const thisBinding = hoistFunctionEnviroment(nodePath); // 提升函数作用域
      node.type = 'FunctionExpression';
    }
  }
}

function findParent(fnPath) {
  do {
    if ((fnPath.isFunction() && !fnPath.isArrowFunctionExpression()) || fnPath.isProgram()) {
      return fnPath;
    }
  } while (fnPath = fnPath.parentPath);
}

/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} fnPath 
 */
function hoistFunctionEnviroment(fnPath) {
  // thisEnvFn=Program节点
  // const thisEnvFn = fnPath.findParent(p => { // 找父节点
  //   // 如果是函数则不能是箭头函数，或者是Program或者是类的属性
  //   return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  // });
  const thisEnvFn = findParent(fnPath);
  // thisPaths就是放着那些地方用到了this
  let thisPaths = getScopeInfoInformation(fnPath); // 找到作用域信息
  let thisBinding = '_this'; // 把this变量重定向的变量名
  // 如果有地方用到了，则需要在thisEnvFn环境上添加一个语句 let _this = this
  if (thisPaths.length > 0) {
    // 表示在this函数环境中添加一个变量id_this=初始值 this为thisExpression
    thisEnvFn.scope.push({
      id: types.identifier('_this'), 
      init: types.thisExpression()
    })
    // 遍历所有使用到this的路径节点，把所有thisExpression全变成_this标识符
    thisPaths.forEach(thisChild => {
      let thisRef = types.identifier(thisBinding);
      thisChild.replaceWith(thisRef);
    })
  }
}
function getScopeInfoInformation(fnPath) {
  let thisPaths = [];
  // 遍历当前的path的所有子节点，看谁的类型是ThisExpression
  fnPath.traverse({
    // 找到ThisExpression类型
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })
  return thisPaths;
}
/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformEs2015ArrowFunctions2]
});
console.log(targetCode.code);
```

#### 2.2 把类编译为Function

```javascript
npm i babel-plugin-transform-es2015-classes
```

```javascript
// 把一个类转成函数
let core = require('@babel/core');
let types = require('babel-types');
let BabelPluginTransformClasses = require('@babel/plugin-transform-classes')
const sourceCode = `
class Person {
  constructor(name) {
    this.name=name;
  }
  getName() {
    return this.name;
  }
}
`;

// babel插件其实是一个对象，它会有一个visitor访问器
/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let BabelPluginTransformClasses2 = {
  // 每个插件都会有自己的访问器
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    //nodePath代表路径，node代表路径上的节点
    ClassDeclaration(nodePath) {
      let { node } = nodePath;
      let { id } = node; // Person标识符 Identifier name:Person
      let classMethods = node.body.body;// 获取原来类上的方法 constructor getName。 Array<MethodDefinition>
      let body = [];
      classMethods.forEach(method => {
        if (method.kind === 'constructor') { // 如果方法的类型是构造函数的话
          // Person [name] this.name=name(body复用) 
          let construcorFunction = types.functionDeclaration(id, method.params, method.body, method.generator, method.async);
          body.push(construcorFunction)
        } else {// 其他的函数属于普通函数，需要放在原型上的
          // method.key=getName
          let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key);
          let right = types.functionExpression(null, method.params, method.body, method.generator, method.async);
          let assignmentExpression = types.assignmentExpression('=', left, right);
          body.push(assignmentExpression)
        }
      })
      // nodePath.replaceWith();// 替换成单节点
      nodePath.replaceWithMultiple(body); // 替换成多节点
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPluginTransformClasses2]
});
console.log(targetCode.code);

/*
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function () {
  return this.name;
}
*/
```

#### 2.3 自动包裹trycatch

```javascript
let core = require('@babel/core');
let types = require('babel-types');
let template = require('@babel/template');
const sourceCode = `
function sum(a,b){
  return a+b+c;
}
`;

/**
 * 编写插件的一般步骤：
 * 1. 仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
 * 2. 想办法把转换前的转成转换后的，并且要尽可能的复用旧节点
 * 老的没有，新的有，就得创建新节点了，可以通过babel-types可以创建新节点
 */
let TryCatchTransformClasses = {
  // 每个插件都会有自己的访问器
  visitor: {
    FunctionDeclaration(nodePath) {
      let { node } = nodePath; // 当前所在的节点
      let { id } = node;
      let blockStatement = node.body;
      // 如果次函数的对个语句已经是一个try语句了，就不要再处理了，否则会死循环
      if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) {
        return;
      }

      // 把一个JS字符串转成一个AST节点
      let catchStatement = template.statement('console.log(error)')();
      let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]));
      // node.body就是原来的函数里的语句，现在要放到try里面
      let tryStatement = types.tryStatement(node.body, catchClause);
      // 新的函数方法名不变sum，参数不变 a,b
      var func = types.functionDeclaration(id, node.params, types.blockStatement([
        tryStatement
      ]), node.generator, node.async);
      nodePath.replaceWith(func);
    }
  }
}

/**
 * babel-core本身只是用来生成语法树，遍历语法树，生成语法树
 * 它本身不负责转换语法树
 */
let targetCode = core.transform(sourceCode, {
  plugins: [TryCatchTransformClasses]
});
console.log(targetCode.code);

/*
function sum(a,b){
  try{
    return a+b+c;
  }catch(error){
    console.log(error);
  }
}
*/
```

总结：插件框架
```javascript
let core = require('@babel/core');
let types = require('babel-types');
const sourceCode = `...`;

let BabelPlugin = {
  visitor: {
    // 处理转换
  }
}
let targetCode = core.transform(sourceCode, {
  plugins: [BabelPlugin]
});
console.log(targetCode.code);
```

#### 2.4 写一个插件可以自动去除代码里的console.log


### 3. webpack babel插件
实现最简单的treeshaking。
```javascript
// 转换前
import { flatten as flat, concat as con } from 'lodash' 

// 转换后
import flat from 'lodash/flatten';
import con from 'lodash/concat';
```
因为下面的这种导入方式体积比较小。写法还是第一种，但是实际导入方式修改了

目录结构：
|-src
  |-index.js
|-babel-plugin-import
  |-babel-plugin-import.js
|-webpack.config.js  

:::: tabs
::: tab babel-plugin-import.js
```javascript
// babel-type是一个用来构建AST节点的工具库
const t = require('babel-types');
/**
 * 把那些importSpecifier变成importDefaultSpecifier
 * visitor.ImportDeclaration={enter(path, state){},leave(){}}
 * 等价于
 * const visitor = { ImportDeclaration(path, state){} }
 */
const visitor = {
  // 捕获ImportDeclaration节点
  ImportDeclaration: {
    // 当进入这个节点的时候，执行此函数 节点的路径path，state是节点的状态
    // opts就是webpack.config.js里面配置的options对象
    enter(path, state = { opts: {} }) { // state的默认值为{opts:{}}
      const { node } = path; // //获取节点
      const { libraryName, libraryDirectory = 'fp' } = state.opts;//获取选项中的支持的库的名称
      const specifiers = node.specifiers; ///获取批量导入声明数组 [ImportSpecifier,ImportSpecifier]
      const source = node.source; // lodash
      //如果当前的节点的模块名称是我们需要的库的名称，并且导入不是默认导入才会进来
      if (libraryName === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        // 把每个specifier变成默认导入 遍历批量导入声明数组specifiers
        const defaultImportDeclaration = specifiers.map(specifier => {
          //导入声明importDefaultSpecifier flatten
          const importDefaultSpecifier = t.importDefaultSpecifier(specifier.local);
          return t.importDeclaration(
            [importDefaultSpecifier],
            //导入模块source lodash/flatten
            t.stringLiteral(libraryDirectory
              ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
              : `${libraryName}/${specifier.imported.name}`
            )
          );
        })
        path.replaceWithMultiple(defaultImportDeclaration);// 替换当前节点
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}
```
:::   
::: tab index.js
```js
import { flatten as flat, concat as con } from 'lodash';
// 将上面的表达式转成下面的形式
// import flat from 'lodash/flatten';
// import con from 'lodash/concat';
console.log(flat([1, [2, [3]]]));
console.log(con([1], [2]))
```
:::   
::: tab webpack.config.js
```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [path.resolve(__dirname, 'babel-plugins/babel-plugin-import.js'), {
                "libraryName": 'lodash',
                "libraryDirectory": 'fp'
              }]
            ]
          }
        }
      }
    ]
  }
}
```
:::   
::::