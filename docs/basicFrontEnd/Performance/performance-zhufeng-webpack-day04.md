---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack基本原理
---

## 如何调试webpack

### 1. 项目初始化
```javascript
npm init -y
npm i webpack webpack-cli -D
```
```javascript
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {},
}
```

### 2. npm run build执行什么
```json
{
  "script": {
    "build": "webpack"
  }
}
```
npm run build 实际上执行的webpack，在/node_modules/.bin中，有webpack.cmd，查看文件

```javascript
@ECHO off
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

"%_prog%"  "%dp0%\..\webpack\bin\webpack.js" %* // 这就是具体执行的文件
ENDLOCAL
EXIT /b %errorlevel%
:find_dp0
SET dp0=%~dp0
EXIT /b
```

具体执行/node_module/webpack/bin/webpack.js文件，在webpack.js文件中：

```javascript
//....
const runCli = cli => {
	const path = require("path");
	const pkgPath = require.resolve(`${cli.package}/package.json`); // 文件路径cli.package为 webpack-cli
	// eslint-disable-next-line node/no-missing-require
	const pkg = require(pkgPath);
	// eslint-disable-next-line node/no-missing-require
	require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName])); 
  // 加载这个文件：webpack-cli/package.json 文件中的
  // "bin": {
  //   "webpack-cli": "bin/cli.js"
  // },
  // 最终结果是：webpack-cli/bin/cli.js文件
};
```

总结：npm run build命令执行webpack/bin/webpack.js文件，并加载webpack-cli/bin/cli.js文件。

### 3. 通过执行命令调试

- 打开工程目录，点击调试按钮，再点击小齿轮的配置按钮，系统就会生成launch.json配置文件
- 在文件中debugger，点击运行就可以启动调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug webpack",
      "cwd": "${workspaceFolder}", 
      "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.j" // 这里修改成自己当前环境下 webpack.cmd运行的文件
    }
  ]
}
```

### 4. debugger.js

- 在根目录创建文件debugger.js

```javascript
// 1. 引入核心模块
const webpack = require('./webpack');
// 2. 加载配置文件
const options = require('./webpack.config.js');
// 3. 执行webpack得到编译对象Compiler，就是一个大管家，是核心编译对象
const compiler = webpack(options);
// 4. 调用它的run方法开始启动编译
compiler.run((err, stats) => {
  // 编译完成后执行回调
  console.log(err); // 错误信息
  // stats是编译结果的描述对象
  console.log(JSON.stringify(stats.toJson({ // 在webpack4里面都是数组，在webpack5中都是Set
    assets: true, // 产出的资源 main.js
    chunks: true, // 代码块 main
    modules: true, // 模块 ['./src/index.js','./src/title.js']
    entries: true, // 入口 ./src/index.js
  }), null, 2))
})
// namedChunkGroups是命名的代码块的组，这个概念是webpack4引入的，是为了实现代码分割 splitChunks
```

## tapable.js

- tapable.js 是一个类似于Node.js中的EventEmitter的库，但更专注于自定义事件的触发和处理

### 1. 一个SyncHook实例
```javascript
let { SyncHook } = require('tapable');

let syncHook = new SyncHook(['name']); // 这里的name可以是任意字符，不一定是name
// tap类似我么以前学的event库中的on 监听事件
syncHook.tap('这个名字没有声明，只是给程序员看', (name) => {
  console.log(name, '这是一个回调'); // zhufeng 这是一个回调
})
syncHook.call('zhufeng'); // 触发监听
```

### 2. 多个SyncHook实例

- 不同的事件需要创建不同的hook
- aHook.call只有aHook.tap能监听到。

```javascript
// 不同的事件需要创建不同的hook
// 参数：需要给构造函数传给一个形参数组，它将决定在call的时候要接收多少个参数
let aHook = new SyncHook(['a']);
let bHook = new SyncHook(['b']);
// tap类似我么以前学的event库中的on 监听事件
aHook.tap('这个名字没有声明，只是给程序员看', (name) => {
  console.log(name, '这是一个回调'); // zhufeng 这是一个回调
})
aHook.call('zhufeng'); // 触发监听

bHook.tap('这个名字没有声明，只是给程序员看', (name) => {
  console.log(name, '这是一个回调'); // zhufeng 这是一个回调
})
bHook.call('zhufeng'); // 触发监听
```

### 3. 与EventEmitter的比较

- 优点就是结构比较清晰
- webpack事件大概有四五百种，有好几百个钩子，各干各的监听和触发，互不干扰
  
```javascript
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on('a', () => console.log('a'));
eventEmitter.on('b', () => console.log('b'));
eventEmitter.emit('a');
eventEmitter.emit('b');
```

## webpack 编译流程
  
1. 初始化参数：从配置文件和Shell语句中读取并合并参数，得到最终的配置结果
2. 用上一步得到的参数初始化COmpiler对象
3. 加载所有配置的插件
4. 执行对象的run方法开始执行编译
5. 根据配置中的entry找到入口文件
6. 从入口文件触发，调用所有配置的loader对模块进行编译
7. 再找到该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
9. 再把每个Chunk转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
