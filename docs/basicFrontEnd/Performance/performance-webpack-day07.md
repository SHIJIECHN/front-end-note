---
autoGroup-1: Webpack
sidebarDepth: 3
title: 7. Loader编写
---

## Loader
Loader就像是一个翻译员，能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译。

Loader的职责：一个Loader的职责是单一的，只需要完成一种转换。只关心输入和输出。

## 基础Loader与options获取
Loader就是一个Node.js模块，这个模块需要导出一个函数。这个导出的函数的工作就是获得处理前的原内容，对内容执行处理后，返回处理后的内容。
```javascript
module.exports = function(source){
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，
  // 相当于该 Loader 没有做任何转换
  return source;
}
```

获得Loader的options
```javascript
const loaderUtils = require('loader-utils');
module.exports = function(source){
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
}
```

## 返回其他结果
上面的Loader都只是返回了原内容转换后的内容，但有些场景下需要返回内容之外的东西。如ES6转换后需要返回ES5代码和source Map。
```javascript
module.exports = function (source){
  // 通过 this.callback 告诉webpack返回的结果
  this.callback(null, source, sourceMaps);
  // 当你使用 this.callback 返回内容时，该 Loader 必须返回 undefined，
  // 以让 Webpack 知道该 Loader 返回的结果在 this.callback 中，而不是 return 中
  return;
}
```
this.callback 是wenpack给Loader注入的API，以方便Loader和webpack之间通信。this.callback 的详细使用如下：
```javascript
this.callback(
    // 当无法转换原内容时，给 Webpack 返回一个 Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于把转换后的内容得出原内容的 Source Map，方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回，
    // 以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    abstractSyntaxTree?: AST
);
```

## 同步与异步
假如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，因此需要使用异步完成。
```javascript
module.exports = function(source){
  // 告诉webpack 本次转换是异步的，Loader 会在callback中回调结果
  var callback = this.async();
  someAsyncOperation(source, function(err, result, sourceMaps, ast){
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast);
  })
}
```

## 处理二进制数据
在默认的情况下，Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串。 但有些场景下 Loader 不是处理文本文件，而是处理二进制文件，例如 file-loader，就需要 Webpack 给 Loader 传入二进制格式的数据
```javascript
module.exports = function (source){
  // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的

  return source;
}

// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;
```
最关键的代码是最后一行 module.exports.raw = true;，没有该行 Loader 只能拿到字符串。

## 本地开发Loader
Npm link 专门用于开发和调试本地 Npm 模块，能做到在不发布模块的情况下，把本地的一个正在开发的模块的源码链接到项目的 node_modules 目录下，让项目可以直接使用本地的 Npm 模块。 由于是通过软链接的方式实现的，编辑了本地的 Npm 模块代码，在项目中也能使用到编辑后的代码。

完成 Npm link 的步骤如下：
1. 确保正在开发的本地 Npm 模块（也就是正在开发的 Loader）的 package.json 已经正确配置好
2. 在本地 Npm 模块根目录下执行 npm link，把本地模块注册到全局；
3. 在项目根目录下执行 npm link loader-name，把第2步注册到全局的本地 Npm 模块链接到项目的 node_moduels 下，其中的 loader-name 是指在第1步中的 package.json 文件中配置的模块名称。

