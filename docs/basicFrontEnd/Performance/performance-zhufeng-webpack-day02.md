---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack模块加载
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
::: tab main.js
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

- 模块ID：不管你是用什么样的路径来加载的，最终模块ID统一会变成相对根目录的相对路径
  - index.js -> ./src/index.js
  - title.js -> ./src/title.js

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

webpack如何知道这是个es module还是commonjs？
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

