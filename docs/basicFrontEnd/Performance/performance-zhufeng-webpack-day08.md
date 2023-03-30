---
autoGroup-2: Webpack5
sidebarDepth: 3
title: Plugin
---

## debugger插件
1. 修改package.json命令
```json
  "scripts": {
    "build": "webpack",
    "debug":"webpack"
  },
```
2. 点击vscode的debugger图标，添加launch.json文件，再点击运行按钮下拉选择，添加配置，选择Launch via NPM
```json
{
 "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "debug"
      ],
      "runtimeExecutable": "npm",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```
3. 点击调试按钮可以调试。


## Plugin中的常见对象

Webpack中有哪些对象可以注册Hook：

- compiler Hook
- compilation Hook
- ContextModuleFactory Hook
- JavascriptParse Hook
- NormalModuleFactory Hook

## 插件的基本构成

Webpack Plugin主要有以下几个方面构成：

- 插件是一个类，也可以是一个函数
- Plugin原型上存在有一个apply方法。当webpack创建compiler对象时会调用各个插件实例上的apply方法并且传入compiler对象作为参数
- 指定一个绑定在compiler对象上的hook，比如compiler.hook.done.tap在传入的compiler对象上监听done事件
- 在Hook的回调中处理自身的逻辑
- 根据Hook的种类，在完成逻辑后通知webpack继续进行

```javascript
class DonePlugin {
  apply(compiler) { // apply方法必须有
    // 调用compiler.hook.done钩子，在构建结束后输出DonePlugin
    compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => { // 钩子done
      console.log('DonePlugin');
      callback();
    });
  }
}

module.exports = DonePlugin;
```

## 插件的构建对象

### 1. compiler对象

在compiler对象中保存着完整的Webpack环境配置，它通经过CLI或者Node API传递的所有选项构建出一个compilation实例。

compiler可以认为是一个单例，每次启动webpack构建时它都是独一无二，仅仅创建一次的对象。

compiler对象存在以下几个主要属性：
- 通过compiler.options可以访问编译过程中webpack的完整配置信息，存储本次启动webpack的时候所有的配置文件，包括Loaders、entry、output、plugin等配置信息
- 通过compiler.inputFileSystem（获取文件相关API）、outputFileSystem（输出文件相关API）可以帮助我们操作实现操作文件
- compiler.hooks中保存了扩展来自tapable的不同种类Hook，监听这些Hook从而可以在compiler生命周期中植入不同的逻辑

### 2. compilation对象

compilation对象代表依次资源的构建，compilation实例能够访问所有的模块和他们的依赖。

一个compilation对象会对构建依赖图中所有模块进行编译。

在compilation对象中可以获取/操作本次编译当前模块资源、编译生成资源、变化的文件以及被追踪的状态信息，同样compilation业绩预tapable扩展了不同时机的hook回调。

compiltion对象的属性：
- modules：一个文件就是一个模块，每个文件都是一个单独的module
- chunks：多个module组成一个chunk代码块。webpack会根据入口文件分析依赖关系，将入口依赖的多个module组成一个大的对象，这个对象就是chunk
- asstes：记录本次打包生成所有文件的结果
- hooks：基于tapable提供的Hook，用于在compilation编译模块阶段进行逻辑添加和修改

```javascript
class DonePlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'Plugin Done',
      (compilation, callback) => {
        console.log(compilation, 'compilation 对象');
      }
    );
  }
}

module.exports = DonePlugin;
```

### 3. ContextModuleFactory Hook

compiler.hooks对象上也存在一个contextModuleFactory。

contextModuleFactory主要用来使用webpack独有API require.context解析文件目录的时候进行处理。

```javascript
class DonePlugin {
  apply(compiler) {
    compiler.hooks.contextModuleFactory.tap(
      'Plugin',
      (contextModuleFactory) => {
        // 在 require.context 解析请求的目录之前调用该 Hook
        // 参数为需要解析的 Context 目录对象
        contextModuleFactory.hooks.beforeResolve.tapAsync(
          'Plugin',
          (data, callback) => {
            console.log(data, 'data');
            callback();
          }
        );
      }
    );
  }
}

module.exports = DonePlugin;
```

### 4. NormalModuleFactory Hook

通过NormalModuleFactory模块生成各类模块。

通过NormalModuleFactory Hook来注入Plugin逻辑从而控制webpack中对于默认引用时的处理，比如ESM，CJS等模块引入前后时注入对应逻辑。

```javascript
class DonePlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      'MyPlugin',
      (NormalModuleFactory) => {
        NormalModuleFactory.hooks.beforeResolve.tap(
          'MyPlugin',
          (resolveData) => {
            console.log(resolveData, 'resolveData');
            // 仅仅解析目录为./src/index.js 忽略其他引入的模块
            return resolveData.request === './src/index.js';
          }
        );
      }
    );
  }
}

module.exports = DonePlugin;
```

### 5. JavascriptParser Hook

webpack使用parser对每个模块进行解析，我们可以在Plugin中注册JavascriptParser Hook在webpack对于模块解析生成AST节点时添加额外的逻辑。

```javascript
const t = require('@babel/types');
const g = require('@babel/generator').default;
const ConstDependency = require('webpack/lib/dependencies/ConstDependency');

class DonePlugin {
  apply(compiler) {
    // 解析模块时进入
    compiler.hooks.normalModuleFactory.tap('pluginA', (factory) => {
      // 当使用javascript/auto处理模块时会调用该hook
      const hook = factory.hooks.parser.for('javascript/auto');

      // 注册
      hook.tap('pluginA', (parser) => { // 将模块中所有的 statementIf 节点的判断表达式修改称为 false
        parser.hooks.statementIf.tap('pluginA', (statementNode) => {
          const { code } = g(t.booleanLiteral(false));
          const dep = new ConstDependency(code, statementNode.test.range);
          dep.loc = statementNode.loc;
          parser.state.current.addDependency(dep);
          return statementNode;
        });
      });
    });
  }
}

module.exports = DonePlugin;
```

## 实战

### 1. ZipPlugin

在每次打包结束将本次打包生成出的所有资源打包成为一个zip包。

主要用到以下内容：

- [zip](https://stuk.github.io/jszip/)：这是一个JS生成zip压缩包的库，使用这个库来生成zip
- [compiler emit Hook](https://webpack.js.org/api/compiler-hooks/#emit)：emit Hook会在输出asset到output目录之前执行，也就是每次即将打包完成生成文件时会调用该钩子
- [compilation 对象方法](https://webpack.docschina.org/api/compilation-object/#emitasset)：获取本次打包即将生成的资源，可以使用compilation.getAsstes()方法首先获得原始打包生成的资源文件内容以及通过compilation.emitAsstes()输出生成的zip到打包结果中去。

```javascript
class ZipPlugin {
  // 在配置文件中传入的参数会保存在插件实例中
  constructor({ output }) {
    this.output = output;
  }

  apply(compiler) { // emit钩子，输出assets到output目录之前执行
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
        // doSomething
    })
  }
}

module.exports = ZipPlugin;
```

在apply方法中通过compiler.hooks.emit.tapAsync注册了一个时间函数，这个时间函数会在每次即将打包完成生成文件时调用。

:::: tabs
::: tab ZipPlugin.js
```javascript
/**
 * 希望把输出的文件打成一个压缩包做成一个存档文件
 */
const JSZIP = require('jszip');
const { RawSource } = require('webpack-sources');
class ZipPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => { // emit钩子，输出assets到output目录之前执行
      let zip = new JSZIP();// 生成压缩包的实例
      // const assets = compilation.getAssets(); // 数组
      for (let filename in compilation.assets) { // 拿到asstes中所有文件。遍历所有文件拿到文件内容
        let source = compilation.assets[filename].source(); // 获取文件内容
        zip.file(filename, source); // 将文件内容放到压缩包里面。参数1文件名，参数2：文件内容
      }
      // 异步生成压缩包。
      zip.generateAsync({ type: 'nodebuffer' }).then(content => {
        compilation.assets['assets.zip'] = new RawSource(content); // 往asstes中输出一个新的文件名
        // compilation.emitAsset('assets.zip', new RawSource(result));
        callback(); // callback执行代表本次事件函数结束
      })
    })
  }

}
module.exports = ZipPlugin;
```
:::
::: tab webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
let AutoExternalPlugin = require('./plugins/AutoExternalPlugin.js')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  plugins: [
    new ZipPlugin()
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```
:::
::::

- compilation.getAssets()返回的参数，通过asset.source.source()方法即可获得生成的模块源代码
- webpack-sources是一个内置库，内部包含了Source等一系列基于Source的子类对象。
- 通过new RawSource()创建了一个不需要sourceMap映射的资源文件（Source）对象后，通过compilation.emitAsset(name,source)输出对应的资源


### 2. 外链插件

如果我们需要将某些内部依赖莫夸不进行打包而使用externals形式作为CDN进行引入，需要进行以下配置：

1. CDN引入
2. externals配置。即从输出的bundle中排除依赖。

:::: tabs
::: tab webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/entry1.js'),
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  externals: {
    jquery: '$',
    lodash: '_',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
    }),
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
  <title>Document</title>
</head>
<body>
  <!-- 第一步手动引入CDN -->
  <script src="https://cdn.bootcss.com/jquery/3.1.0/jquery.js"></script> 
  <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js"></script>
</body>
</html>
```
:::
::::


