---
autoGroup-2: Webpack5
sidebarDepth: 3
title: webpack工作流程
---

## 如何调试webpack

### 1. 项目初始化
```javascript
npm init -y
npm i webpack webpack-cli -D
```

webpack.config.js配置文件。

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

```javascript {12}
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

```javascript {8}
const runCli = cli => {
	const path = require("path");
  // 文件路径cli.package为 webpack-cli
	const pkgPath = require.resolve(`${cli.package}/package.json`); 
	// eslint-disable-next-line node/no-missing-require
	const pkg = require(pkgPath);
	// eslint-disable-next-line node/no-missing-require
	require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName])); 
  // 加载这个文件：webpack-cli/package.json 文件中的
  // "bin": {
  //   "webpack-cli": "bin/cli.js"
  // },
  // 最终结果是执行：webpack-cli/bin/cli.js文件
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
      "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js" // 这里修改成自己当前环境下 webpack.cmd运行的文件
    }
  ]
}
```

### 4. debugger.js

在根目录创建文件debugger.js

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

## webpack 

Webpack本质上是一个函数，它接受配置信息作为参数，执行后返回一个compiler对象，调用compiler对象中的run方法就会启动编译。run方法接受一个回调，可以用来查看编译过程中的错误信息或编译信息。

webpack 打包流程可以分成三个阶段：

- 打包前，如参数合并、插件加载
- 打包过程中，也就是编译阶段
- 打包结束，包括打包成功和打包失败

compiler就是个大管家，它代表上面说的三个阶段，在它上面挂载各种生命周期函数。而compilation就是专门负责编译相关的工作，也就是打包过程中这个阶段。

<img :src="$withBase('/basicFrontEnd/Performance/webpack-flow1.jpg')" alt="工作流" />


## 编译流程
  
1. 初始化参数：从配置文件和Shell语句中读取并合并参数，得到最终的配置结果
2. 用上一步得到的参数初始化Compiler对象
3. 加载所有配置的插件
4. 执行对象的run方法开始执行编译
5. 根据配置中的entry找到入口文件
6. 从入口文件出发，调用所有配置的loader对模块进行编译
7. 再找到该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
9. 再把每个Chunk转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果.

<img :src="$withBase('/basicFrontEnd/Performance/webpack-flow.jpg')" alt="工作流" />


## 流程总结

目录结构：
```javascript
├── debugger.js
├── loaders
│   ├── logger-loader.js
│   └── logger1-loader.js
├── plugins
│   ├── done-plugin.js
│   ├── readme-plugin.js
│   └── run-plugin.js
├── src
│   ├── index.js
│   ├── name.js
│   ├── page1.js
│   ├── page2.js
│   └── title.js
├── webpack
│   ├── Compiler.js
│   └── index.js
├── package.json
└── webpack.config.js
```

### 1. 全局设置
:::: tabs
::: tab webpack.config.js
```javascript
const path = require('path');
const DonePlugin = require('./plugins/done-plugin.js');
const RunPlugin = require('./plugins/run-plugin.js');
const ReadmePlugin = require('./plugins/readme-plugin.js')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: process.cwd(), // 根目录 current working directory
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // path.resolve(__dirname, 'loaders', 'logger-loader.js'),
          // path.resolve(__dirname, 'loaders', 'logger1-loader.js'),
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
    new ReadmePlugin(),
  ]
}
```
:::   
::: tab webpack/index.js
```javascript

let Compiler = require('./Compiler')

/**
 * process.argv 命令行参数
 * @param {*} options 
 */
function webpack(options) {
  // 1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
  // 数组。包含输入的命令行参数。
  // process.argv[0]: webpack.config.js文件的绝对路径。process.argv[1]:webpack/index.js 文件路径。后面都是命令行的输入内容
  console.log(process.argv); 
  // shell 命令行参数对象
  const shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item; // item 为 --mode=development
    shellConfig[key.slice(2)] = value; // {mode: development}
    return shellConfig;
  }, {});
  const finalOptions = { ...options, ...shellConfig }; // 得到最终配置对象

  // 2. 用上一步得到的参数初始化 Compiler 对象
  let compiler = new Compiler(finalOptions);

  // 3.加载所有配置的插件
  // finalOptions.plugins.forEach()
  if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
    for (let plugin of finalOptions.plugins) { // 循环插件数组
      // 刚开始的时候，就会执行所有插件实例的apply方法，并传递compiler实例
      console.log(plugin);
      // 所以说插件是在webpack开始编译之前全部挂载的
      // 要到插件关注的钩子触发的时候才执行
      plugin.apply(compiler); // 执行插件上的apply方法
    }
  }
  return compiler;
}

module.exports = webpack;
```
:::   
::: tab webpack/Compiler.js
```javascript
let { SyncHook } = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser');// 解析器，把源代码转成ast
const { entry } = require('../webpack.config.js');
const traverse = require('@babel/traverse').default; // 遍历语法树
const generate = require('@babel/generator').default; // 把ast重新生成代码

/** 路径 \ 变成 /  */
// path.posix.sep /  不同系统的路径分隔符
// window是\，Unix是/
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, path.posix.sep);
}

const baseDir = toUnixPath(process.cwd());// 根目录，当前工作目录
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      emit: new SyncHook(), // 会在将要写入文件的时候触发
      done: new SyncHook(), // 会结束编译的时候触发
    };
    this.entries = []; // 这个数组存放的所有的入口模块
    this.modules = []; // 这里存放着所有的模块
    this.chunks = []; // 代码块 webpack5 this.chunks = new Set()
    this.assets = {}; // 输出列表，存放着将要产出的资源文件
    this.files = []; // 表示本次编译的所有产出的文件名
  }

  // 4. 执行Compiler对象的 run 方法开始执行编译
  run(callback) {
    // SyncHook 实例有call、tap方法
    // 这里先触发run钩子，再触发done钩子
    // 在调用run方法的时候会触发run这个钩子，进而执行它的回调函数
    this.hooks.run.call(); 

    // 5. 根据配置中的entry找出入口文件，得到entry的绝对路径
    // C:\Users\04.flow\src\index.js
    // 打包后的文件，所有的路径都是\ 变成 /
    let entry = {};
    // 多入口时entry是对象，单个入口entry是字符串
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry; // {main: './src/index.js'}
    } else {
      entry = this.options.entry; // {page1: './src/page1.js', page2:'./src/page2.js'}
    }

    // 6. 从入口文件出发,调用所有配置的Loader对模块进行编译
    for (let entryName in entry) {
      // 统一路径分隔符
      let entryPath = toUnixPath(path.join(this.options.context, entry[entryName]));
      // entryModule = { id: moduleId, dependencies: [], name, _source }
      let entryModule = this.buildModule(entryName, entryPath);
      // this.modules.push(entryModule); // 入口模块
      // 中间就是编译过程...
      console.log(this.modules);

      // 8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
      let chunk = { name: entryName, entryModule, modules: this.modules.filter(module => module.name === entryName) }
      this.chunks.push(chunk);
      this.entries.push(chunk); // 也是入口代码块
    }

    // 9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
    // 一个chunk会成为this.assets对象的一个key value
    // 一个chunk对应this.assets的一个属性，而每个assets属性会对应一个文件file
    this.chunks.forEach(chunk => {
      // 输出的文件名 根据chunk名字
      let filename = this.options.output.filename.replace('[name]', chunk.name);
      // key是文件名，value是打包后的文件内容
      this.assets[filename] = getSource(chunk); // main.js文件的内容
    })
    this.hooks.emit.call();
    // 10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
    this.files = Object.keys(this.assets); // 文件名数组 ['main.js']
    // 存放本次边柜输出的目标文件路径
    for (let file in this.assets) {
      let targetPath = path.join(this.options.output.path, file); // page1.js page2.js
      fs.writeFileSync(targetPath, this.assets[file])
    }

    this.hooks.done.call();
    callback(null, {
      toJson: () => {
        return {  // 此对象stats统计信息，表示本次编译结果的描述信息对象
          assets: this.assets, // 产出的资源 main.js
          chunks: this.chunks, // 代码块 main
          modules: this.modules, // 模块 ['./src/index.js','./src/title.js']
          entries: this.entries, // 入口 ./src/index.js
          files: this.files
        }
      }
    }
    )
  }

  /** 编译模块 1. 读取模块内容 */
  // name为模块名称./src/index.js，
  // modulePath为模块的绝对路径C:/User/04.flow/src/index.js
  buildModule = (name, modulePath) => {
    // 先读取原始源代码
    let targetSourceCode, originalSourceCode;
    targetSourceCode = originalSourceCode = fs.readFileSync(modulePath, 'utf8');
    // 查找此模块对应的loader对代码进行转换
    const rules = this.options.module.rules;
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      // 正则匹配上了模块的路径
      if (rules[i].test.test(modulePath))
        loaders = [...loaders, ...rules[i].use];
    }
    // loaders执行是从右往左的
    for (let i = loaders.length - 1; i >= 0; i--) {
      let loader = loaders[i];
      // 模块经过loader处理后的源代码
      targetSourceCode = require(loader)(targetSourceCode);
    }
    // 现在我们已经得到了转换后的代码 targetSourceCode：babel-loader es6=>es5
    // 当前模块id ./src/index.js
    let moduleId = './' + path.posix.relative(baseDir, modulePath); 
    // webpack最核心的几个概念：module，module中有模块ID、模块依赖数组
    let module = { id: moduleId, dependencies: [], name }
    
    // 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理（入口模块）
    // { sourceType: 'module' }表示原代码是一个模块。模块就是里面有module.exports、 exports
    let astTree = parser.parse(targetSourceCode, { sourceType: 'module' });
    // 遍历语法树，并找出require节点
    traverse(astTree, {
      CallExpression: ({ node }) => { // node 节点
        if (node.callee.name === 'require') { // 是require
          // 问题：1. 这里是相对路径 2. 相对于当前模块  
          // 我们希望 1. 拿到绝对路径
          let moduleName = node.arguments[0].value; // ./title
          // 要判断一下moduleName绝对还是相对，相对路径才需要下面的处理
          // let depModulePath;
          // if (path.isAbsolute(moduleName)) {
          //   depModulePath = moduleName;
          //   // 获取当前路径所有的目录
          //   let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          //   depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径
          // }
          // 简化版本只考虑相对路径
          // modulePath = 'C:/Users/04.flow/src/index.js'
          // dirname = C:/Users/04.flow/src 模块所在文件的目录
          let dirname = path.posix.dirname(modulePath); // 加上posix分隔符全部统一为 /
          // C:/Users/04.flow/src/title' 模块路径
          let depModulePath = path.posix.join(dirname, moduleName); // 依赖的模块路径
          // 加后缀
          let extensions = this.options.resolve.extensions;
          // depModulePath = C:/Users/04.flow/src/title.js 完整路径
          depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirname);
          // 模块ID的问题，每个打包的模块都会有一个moduleId
          // path.posix.relative 获取相对路径  
          // depModulePath=C:/Users/04.flow/src/title.js, baseDir=C:/Users/04.flow   relative=title.js
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath); // ./src/title.js
          //修改抽象语法树 改变参数：./title.js 变成 ./src/title/js 
          // require('./title.js') => require('./src/title.js')
          node.arguments = [types.stringLiteral(depModuleId)]; 
          module.dependencies.push(depModulePath);// 添加依赖
        }
      }
    })

    // 根据新的语法树，生成新代码
    let { code } = generate(astTree);
    // 转换后的代码。目前为止，module上有三个属性了：
    // moduleId, dependencies, _source
    module._source = code; 

    // 7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理（入口模块所依赖的模块）
    module.dependencies.forEach(dependency => {
      let dependencyModule = this.buildModule(name, dependency);
      this.modules.push(dependencyModule)
    })
    return module; // {dependencies:[], _source:'', moduleId: ''}
  }

}

// let chunk = { name: 'main', entryModule, modules: this.modules }
function getSource(chunk) {
  return `
  (() => {
    var modules = ({
      ${chunk.modules.map(module => `
        "${module.id}": (module, exports, require)=>{
          ${module._source}
        }`).join(',')
    }
    });
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = cache[moduleId] = {
        exports: {}
      };
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    (() => {
      ${chunk.entryModule._source}
    })();
  })()
    ;  
  `;
}

/**
 * 给文件加后缀，看看文件是否存在，如果存在就返回，如果没有找到就抛出错误
 * @param {*} modulePath 模块的绝对路径（没有后缀）....../04.flow/src/title
 * @param {*} extensions 扩展名：['.js', '.jsx', '.json']
 * @param {*} originalModulePath  // 模块的导入名 ./title
 * @param {*} moduleContext // 模块上下文目录 ....../04.flow/src
 * @returns 
 */
function tryExtensions(modulePath, extensions, originalModulePath, moduleContext) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i]
    }
  }
  throw new Error(`Module not found: Error: can't resolve '${originalModulePath}' in '${moduleContext}'`)
}
module.exports = Compiler;
```
:::   
::::

### 2. plugin文件夹
:::: tabs 
::: tab run-plugin.js
```javascript
class RunPlugin {
  constructor(options) {
    this.options = options;
  }

  // 每个插件定死了有一个apply方法
  apply(compiler) {
    // 监听感兴趣的钩子
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('RUN~~~~~~~~~~~~~~~~~~~~~')
    })
  }
}
module.exports = RunPlugin;
```
:::    
::: tab done-plugin.js
```javascript
class DonePlugin {
  constructor(options) {
    this.options = options;
  }

  // 每个插件定死了有一个apply方法
  apply(compiler) {
    // 监听感兴趣的钩子
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('DONE~~~~~~~~~~~~~~~~~~~~~')
    })
  }
}
module.exports = DonePlugin;
```
:::    
::: tab readme-plugin.js
```javascript
class ReadmePlugin {
  constructor(options) {
    this.options = options;
  }

  // 每个插件定死了有一个apply方法
  apply(compiler) {
    // 监听感兴趣的钩子
    compiler.hooks.emit.tap('ReadmePlugin', () => {
      // 可以在插件里改变输出的结果
      compiler.assets['README.md'] = '读我读我';
    })
  }
}
module.exports = ReadmePlugin;
```
:::    
::::

### 3. loaders文件夹

:::: tabs
::: tab logger-loader.js
```javascript
function loader(source) {
  console.log('logger loader');
  return source;
}
module.exports = loader;
```
:::   
::: tab logger1-loader.js
```javascript
function loader(source) {
  console.log('logger1 loader');
  return source;
}
module.exports = loader;
```
:::   
:::: 