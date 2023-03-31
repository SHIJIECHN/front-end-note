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

### 1. vm执行环境分析：

```javascript
const vm = require('vm');
global.a = 100;
vm.runInThisContext('console.log(a)'); // 100
vm.runInNewContext('console.log(a)');//  a is not defined
```

1. 有一个全局上下文，global.a就定义在全局上下文中，全局上下文的执行相当于创建了一个函数function(exports, module,require, __dirname, __filename){}
2. runInThisContext创建一个新的上下文，与上面的函数同级，所以可以访问a，但是这个上下文不会产生函数
3. runInNewContext 创建一个新的环境，与全局上下文同级。所以不能访问global中的变量

### 2. require的实现

1. 读取文件
2. 读取后给文件包装一个函数
3. 通过runInThisContext 将它变成js语法

