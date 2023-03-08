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