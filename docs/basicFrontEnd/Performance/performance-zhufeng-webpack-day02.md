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

- 模块ID
  - 不管你是用声明样的路径来加载的，最终莫夸ID统一会变成相对根目录的先对路径
    - index.js -> ./src/index.js
    - title.js -> ./src/title.js
    - JQuery

### 2.2 打包文件手写main.js

```javascript
(() => {
  // webpack 自己读取模块产生
  var modules = {
    './src/title.js': (module) => {
      module.exports = 'title';
    }
  }

  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) { // 先看缓存中有没有已经缓存的模块对象
      return cache[moduleId].exports; // 如果有就直接返回
    }
    // 定义module={ exports: {}}，并将该对象往缓存cache中也缓存一份
    var module = cache[moduleId] = {
      exports: {}
    }
    modules[moduleId](module, module.exports, require); // 从modules中拿出moduleId对应的函数并执行
    return module.exports; // 返回
  }

  // .src/index.js
  (() => {
    let title = require('./src/title.js');
    console.log(title);
  })();
})();
```

## 3. 兼容性实现

- CommonJS： exports/module.exports, require
- ES6: export/export default, import

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
export defult会变成exports.default   
export xxx => exports.default
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
export default 'title_name'; // 默认导出
export const age = 'title_age'; // 批量导出
```
:::
::: tab main.js
```javascript {7-12}
(() => {
  var modules = {
    './src/title.js': (module, exports, require) => {
      // 不管是CommonJS还是es module最后都变成了CommonJS，如果原来是es module的话
      // 就把exports传给r方法处理一下，exports.__esModule = true以后就可以通过这个属性来判断原来是不是es module
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
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      })
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
## 3.3 ES module加载ES module

