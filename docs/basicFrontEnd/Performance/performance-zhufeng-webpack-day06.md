---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack css-loader
---

## css-loader

css-loader可以把@import和url()翻译成import/require

依赖安装：
```javascript
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader css-selector-tokenizer file-loader less less-loader postcss style-loader to-string-loader -D
```

:::: tabs
::: tab webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  resolveLoader: {
    // 先找loaders里面的模块，没有再找node_modules
    modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "to-string-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,//是否解析url()
              import: true,//是否解析@import语法
              esModule: false,//不包装成ES MODULE，默认是common.js导出
              importLoaders: 0//在处理导入的CSS的时候(@import)，要经过几个前置loader的处理
            }
          },
        ],
        include: path.resolve('src')
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ]
}
```
:::   
::: tab src/index.js
```javascript
const css = require('./global.css');
console.log(css);
```
:::   
::: tab src/global.css
```js
body{
  background-color: green;
}
```
:::   
::: tab loaders/to-string-loader.js
```javascript
function loader(sourceCode) {
  // 使用JSON.stringify是因为sourceCode需要导出为："...."，双引号
  return `module.exports=${JSON.stringify(sourceCode)}`; 
}
module.exports = loader;
```
:::   
::: tab main.js
```javascript
(() => {
  var __webpack_modules__ = {
    "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css": (
        module, __unused_webpack_exports, __webpack_require__) => {
      var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
      var EXPORT = ___CSS_LOADER_API_IMPORT___(function (i) {
        return i[1];
      });
      EXPORT.push([module.id, "body {\r\n  background-color: green;\r\n}", ""]);
      module.exports = EXPORT;
    },
    "./node_modules/css-loader/dist/runtime/api.js": module => {
      "use strict";
      module.exports = function (cssWithMappingToString) {
        var list = [];
        list.toString = function toString() {
          return this.map(function (item) {
            var content = cssWithMappingToString(item);
            if (item[2]) {
              return "@media ".concat(item[2], " {").concat(content, "}");
            }
            return content;
          }).join("");
        };
        list.i = function (modules, mediaQuery, dedupe) {
          if (typeof modules === "string") {
            modules = [[null, modules, ""]];
          }
          var alreadyImportedModules = {};
          if (dedupe) {
            for (var i = 0; i < this.length; i++) {
              var id = this[i][0];
              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }
          for (var _i = 0; _i < modules.length; _i++) {
            var item = [].concat(modules[_i]);
            if (dedupe && alreadyImportedModules[item[0]]) {
              continue;
            }
            if (mediaQuery) {
              if (!item[2]) {
                item[2] = mediaQuery;
              } else {
                item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
              }
            }
            list.push(item);
          }
        };
        return list;
      };
    },
    "./src/global.css": (module, __unused_webpack_exports, __webpack_require__) => {
      var result = __webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css");
      if (result && result.__esModule) {
        result = result.default;
      }
      if (typeof result === "string") {
        module.exports = result;
      } else {
        module.exports = result.toString();
      }
    }
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
      id: moduleId,
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  var __webpack_exports__ = {};
  (() => {
    const css = __webpack_require__("./src/global.css");
    console.log(css);
  })();
})();
```
:::   

::::

## 实现main.js

### 1. 第一版
```javascript
(() => {
  var modules = {
    // 模块
    './src/global.css': (module, exports, require) => {
      // 导出字符串
      module.exports = "body{\r\nbackground-color: green;\r\n}"
    }
  };

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
  // 加载模块
  const css = require('./src/global.css');
  console.log(css);// 就是module.exports导出来的字符串
})()
  ;
```
