---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Node核心
---

## Node的特点

### 1. 同步与异步

同步和异步关注的是消息通知机制：

- 同步就是发出调用后，没有得到结果之前，该调用不返回，一旦调用但会，就得到返回值了。也就是调用者主动等待这个调用的结果
- 异步就是调用者在发出调用后，就直接返回，不会立即得到结果，而是被调用者通过状态、通知或回调函数处理这个调用

### 2. 阻塞与非阻塞

阻塞和非阻塞关注的是程序在等待返回值时的状态：

- 阻塞是指调用结果返回之前，当前线程被挂起。调用线程只有在得到结果之后才会返回
- 非阻塞是这在不能立即得到结果之前，该调用不会阻塞当前进程

同步异步取决于被调用者，阻塞和非阻塞取决于调用者。


## 模块

默认执行文件使用node来执行，他会把这个文件当成一个模块，此时this是空对象，模块中默认把this给修改了。

```javascript
console.log(this);// {}
```

每个文件都是一个模块，模块化的实现借助的是函数。函数中有参数，参数里面有五个属性：
- exports
- modules
- require
- __dirname
- __filename

```javascript
(function (exports, module, require, __dirname, __filename) {
  // ...
})
```

## Global

在前端中访问变量通过window属性，但是在后端中，想访问全局需要通过global

```javascript
console.log(global);
/**
<ref *1> Object [global] {
  global: [Circular *1],
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  queueMicrotask: [Function: queueMicrotask],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  }
}
 */

// 展示全部属性
console.dir(global, { showHidden: true });
```
全局属性：

- Buffer：node中的二进制对象（最早的时候浏览器不能直接读写文件）
- __dirname：当前文件执行时的目录，绝对路径
- __filename: 文件自己的绝对路径
- process：
  - platform：系统。win
  - chdir：一般不用。修改执行目录
  - cwd：current working directory 当前工作目录。webpack会自动查找运行webpack的目录下查找webpack.config.js。
  - env：执行代码时传入环境。if(process.env.NODE_ENV === 'development')
  - argv：执行代码时传入的参数
  - nextTick：
- setImmediate


## Process

process.args()解析执行代码时传入的参数：

```javascript
console.log(process.argv); // 会根据用户传递的参数来解析，生成对应的功能
// ['执行node所在的exe文件', '当前执行的文件', ...其他参数]

let argv = process.argv.slice(2).reduce((memo, current, index, arr) => {
  if (current.startsWith('--')) {
    memo[current.slice(2)] = arr[index + 1];
  }
  return memo;
}, {});
console.log(argv);
/**
 * 终端执行：node 1.js --port 3000 --info abc
 * 执行结果：{ port: '3000', info: 'abc' }
 */
```

## path

- POSIX路径分隔符：/
- Windows路径分隔符: \

path的属性：
- path.resolve()：解析绝对路径，解析默认采用process.cwd()。如果有路径 / 会回到根目录
- path.join()：仅仅是拼接，不会产生绝对路径
- path.extname()：获取文件扩展名。以path的最后一个 . 为分隔
- path.basename(): 返回path的最后一部分，参第二个参数，表示要删除可选后缀
- path.relative(from, to)：根据路径获取相对路径。根据当前工作目录返回从from到to的相对路径。
- path.dirname()：获取当前路径的父路径。__dirname的实现就是path.dirname
- path.isAbsolute()：确定path是否为绝对路径
- path.posix()：提供对path的POSIX特定实现的访问
- path.win32()：提供对path的Windows特定实现的访问
- path.sep()：提供平台的分隔符

```js
const path = require('path');

console.log(path.resolve('a', 'b', 'c')); // c:\Users\a\b\c
console.log(path.join('a', 'b', 'c', '/'));// a\b\c\
console.log(path.extname('a.min.js')); // .js
console.log(path.basename('a.js', 's')); // a.j
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')); //   '../../impl/bbb'
console.log(path.dirname('/a/b/c');); // /a/b
path.isAbsolute('C:/foo/..');   // true   path='bar/foo' 为false
```

## nextTick

nextTick是node自己实现的，不属于node中的EventLoop，优先级比promise更高。

```javascript
Promise.resolve().then(() => {
  console.log('promise')
})

process.nextTick(() => {
  console.log('nextTick')
})
/**
nextTick
promise
 */
```

## 执行环境

Q：字符串如何变成JS来执行
A：有三种方式：
 1. eval：受执行环境的影响
 2. new Function()：函数中的变量可以获得全局变量，并且变量会污染全局
 3. node中自己实现的vm（沙箱环境）

vm执行环境分析：

```javascript
const vm = require('vm');
global.a = 100;
vm.runInThisContext('console.log(a)'); // 100
vm.runInNewContext('console.log(a)');//  a is not defined
```

1. 有一个全局上下文，global.a就定义在全局上下文中，全局上下文的执行相当于创建了一个函数function(exports, module,require, __dirname, __filename){}
2. runInThisContext创建一个新的上下文，与上面的函数同级，所以可以访问a，但是这个上下文不会产生函数
3. runInNewContext 创建一个新的环境，与全局上下文同级。所以不能访问global中的变量

## CommonJS规范的实现原理

### 1. 基本流程

1. 读取文件 a.js
2. 读取后给文件包装一个函数并赋给变量a，此时模块中的变量a就与外界的变量隔离开了。
3. 再通过runInThisContext 将变量a字符串变成js语法，执行

:::: tabs
::: tab index.js
```javascript
let a = require('./a.js')
console.log(a);

// 读取到文件后相当于，包裹一个函数
let a = (function (exports, module, require, __dirname, __filename) {
  var a = 100; // 此时a与外面的a就隔离开来了
  module.exports = a // a.js的内容

  return module.exports; // 导出

})(exports, module, require, __dirname, __filename)
```
:::
::: tab a.js
```javascript
var a = 100;
module.exports = function () {

}
```
:::
::::

### 2. 源码实现

源码流程：

1. require方法 -> Module.prototype.require方法
2. Module._load加载模块
3. Module._resolveFilename 方法把传入的路径变成了绝对路径并尝试添加后缀名（.js .json) .node
4. new Module 拿到绝对路径创造一个模块 this.id exports={}
5. module.load 对模块进行加载
6. 根据文件后缀 Module._extension['js']去做策略加载
7. 用的是同步读取文件
8. 增加一个函数的壳子，并且让函数执行，让module.exports作为this
9. 用户会默认拿到了module.exports的返回结果
最终返回的是exports对象


:::: tabs
::: tab req.js
```javascript
const fs = require('fs');
const path = require('path');
const vm = require('vm');
function Module(id) {
  this.id = id;
  this.exports = {}; // 空对象
}
Module._cache = {}
Module._extensions = {
  '.js'(module) { // js是变成一个函数，执行
    // 1. 读取文件
    let script = fs.readFileSync(module.id, 'utf8');
    // 2. 增加函数
    let templateFn = `(function(exports,module,require,__dirname,__filename){${script}})`;
    // 3. 将字符串变成函数，相当于 new Function
    let fn = vm.runInThisContext(templateFn);
    let exports = module.exports;
    let thisValue = exports; // this = module.exports = exports
    let filename = module.id;
    let dirname = path.dirname(filename);
    // 4. 函数执行。函数call的作用：1）改变this指向；2）让函数执行
    fn.call(thisValue, exports, module, require, dirname, filename);// 调用了a模块，module.exports = 100
  },
  '.json'(module) {
    // 加载模块。json是我们自己读到解析。
    let script = fs.readFileSync(module.id, 'utf8');
    module.exports = JSON.parse(script);
  }
}
// 将路径变成绝对路径，并且加后缀
Module._resloveFilename = function (id) {
  let filePath = path.resolve(__dirname, id);// \Users\小石头\Documents\Learning\A05-operationEnv\Node\Node-demo\3.Node-Core\a
  let isExists = fs.existsSync(filePath);// 是否有后缀
  if (isExists) return filePath; // 如果有后缀，就直接返回
  // 尝试添加后缀 .js 
  let keys = Reflect.ownKeys(Module._extensions); // ['.js', '.json'];
  for (let i = 0; i < keys.length; i++) {
    let newPath = filePath + keys[i];
    if (fs.existsSync(newPath)) return newPath; // 查看添加后缀后的文件存不存在，存在就把路径返回
  }
  throw new Error('module not found.')

}

Module.prototype.load = function () {
  let ext = path.extname(this.id);// 获取文件后缀名
  Module._extensions[ext](this); // 调用对应的策略，this是当前模块
}

function req(filename) {
  // 1. 创造一个绝对应用地址，方便后续读取
  filename = Module._resloveFilename(filename); // c:\Users\小石头\Documents\Learning\A05-operationEnv\Node\Node-demo\3.Node-Core\a.js

  // 查看缓存
  let cacheModule = Module._cache[filename];// 获取缓存的模块
  if (cacheModule) return cacheModule.exports; // 直接将上次缓存到的模块返回

  // 2. 根据路径创造一个模块
  const module = new Module(filename);
  Module._cache[filename] = module;// 最终：缓存模块。根据文件名绝对路径来缓存
  // 3. 对模块进行加载
  module.load(); // 就是让用户给module.exports赋值

  return module.exports; // 默认是一个空对象
}

let a = req('./a.js');
a = req('./a.js');
```
:::   
::: tab a.js
```javascript
var a = 100;
console.log('a exec');
console.log(this === module.exports);// true
module.exports = a
```
:::   
::: tab a.json
```json
{
  "name": "zhufeng",
  "age": 10
}
```
:::  
::::



### 3. module.exports、exports、this

- 默认情况下。module.exports、exports、this指向同一个对象
- 如果有多个方法，需要一个个导出，可以采用exports
- 文件导出的方式：
  - module.exports
  - exports
  - global（不建议使用）

```javascript
// this指代的是当前模块的导出对象
console.log(module.exports === exports, this === module.exports); // true true 三者相等
module.exports = 'hello'; // 内部会将module.exports直接导出
```

#### 情况一：使用exports导出。

```javascript
exports = 'hello'; // 无效结果，外面拿不到
/**
 * 模块中使用 exports = 'hello'导出，与使用 module.exports = 'hello'导出结果不一样。
 * 说明：
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports
 *  exports = 'hello'; // 将exports值改为 hello。module.exports不受影响
 *  return module.exports;
 * }
 */
```

#### 情况二：exports.a导出属性导出

```javascript
exports.a = 'hello';
exports.b = 'world';

/**
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports，指向同一个对象
 *  exports.a = 'hello'; // 增加属性 a
 *  exports.b = 'hello'; // 增加属性 b
 *  return module.exports;
 * }
 */

// 也可以使用下面的方式导出
this.a = 'hello';
this.b = 'world';
```

分析下面导出的结果：

```javascript
// 下面导出方式最终导出什么结果
module.exports = 'hello'; // 最终导出。更改module.exports优先级是最高的，因为最终会将module.exports直接导出
exports.a = 'world';
this.a = '.'

/**
 * function(){
 *  let exports = module.exports; // 将module.exports赋给exports，指向同一个对象
 *  module.exports = 'hello; // 将module.exports指向hello
 *  exports.a = 'hello'; // 增加属性 a 为world。这是在原来的对象上加属性
 *  return module.exports; 
 * }
 */
```

## Module

- 核心模块、内置模块。node自带
- 文件模块，引用都是相对路径
- 第三方模块

### 1. 文件模块的查找规范

判断路径是不是核心模块，是核心模块就不会做下面的事了，看下是不是第三方，如果不是在继续下面步骤：
 * 1. 最新版本Node 默认先查找同名文件，如果没找到尝试添加查找.js和.json文件
 * 2. 如果没有，就查找到同名文件夹（当成一个包），先查找package.json
 * 3. 如果没有就找文件夹中的index.js，如果还没有就报错

### 2. 第三方模块（引用没有相对路径）

第三方模块分为：1. 全局模块。2. 代码中的第三方模块。

代码中的第三方：
 * 1. 默认会沿着当前目录向上查找，查找node_modules下的同名文件，
 * 根据package.json中的main，如果没有对应文件，就查找index.json。
 * 2. 如果没找到，就向上找，找上级的node_modules，如果到根路径了还没有找到，就报错了

#### 全局模块

全局模块：安装到电脑中的npm（node package manager）。

第一种：全局安装只能在命令行里用。自己实现全局包：
 * 1. 需要配置bin命令
 * 2. 添加执行命令 #! /user/bin/env node
 * 3. 将次包放到npm下（可以全局安装）临时做一个npm link

主要使用场景：工具类的使用全局包。

第三方模块写法：
```javascript
1. 创建global_module文件夹
2. npm init -y 创建package.json
3. 创建bin文件夹，创建bin/www.js 
4. 修改package.json，添加字符段：
    "bin": {
       "gm": "./bin/www"
    }
5. 在global_module下执行命令npm link，就是将当前文件link到node_modules下
6. 修改www文件，添加类型： #! /user/bin/env node
7. 命令行中输入gm
```

第二种：本地安装，在代码中使用
 * 依赖关系：开发依赖、生成依赖、同等依赖、打包依赖、可选依赖

## 模板引擎的实现

模板引擎主要通过new Function + with来实现的。

### 1. 基本使用
:::: tabs
::: tab index.js
```javascript
const ejs = require('ejs');

(async function () {
  let r = ejs.renderFile('template.html', { name: 'zf', age: 10 });
  console.log(r);
})()
```
:::   
::: tab template.js
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
  <%=name%><%=age%>
</body>
</html>
```
:::   
::::

### 2. 实现

- 先直到要拼接的字符串形式，再进行代码拼接

```javascript
const fs = require('fs');
const util = require('util');
const read = util.promisify(fs.readFile);

let ejs = {
  async renderFile(filename, options) {
    let content = await read(filename, 'utf-8');
    content = content.replace(/<%=(.+?)%>/g, function (_, $1) {
      return options[$1]; // 获取对应的内容并替换
    })
    console.log(content);
  }
};

(async function () {
  let r = ejs.renderFile('template.html', { name: 'zf', age: 10 });
  // console.log(r);
})()
```