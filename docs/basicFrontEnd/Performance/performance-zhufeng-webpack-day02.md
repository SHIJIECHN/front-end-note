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

- 去掉注释正则： `\/\*[\s\S]*\*\/|\/\/.*`
- 去掉空白行：`^\s*(?=\r?$)\n`

初始化配置打包

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

```
:::   
::::