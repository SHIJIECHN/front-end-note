---
autoGroup-1: Node基础
sidebarDepth: 3
title:  3. commonJS、后端的分层
---

## 前置知识
- CPU 密集：压缩，解压，加密，解密（图形计算）
- I/O密集： 文件操作；http的网络操作；数据库操作

## 分层
刚开始分层：    
- Controller：处理用户请求和相关逻辑。
- Model：操作数据库。  

业务需求越来越大，请求越来越多，当请求多时，需要一个统一处理的过程，从controller中分出一层view。
- view：视图。
- Controller：控制器。   
- Model：数据库。  

1. web层（controller）：直接喝用户交互：用户权限校验、数据封装、数据正确或者错误的用户提示。
2. 业务逻辑层（server层， 具体的就是：LoginService）：处理后端的业务。
3. DAO（data access object，数据进入对象）：数据进入数据库前的数据操作，对象转为数据，数据转为对象。
   1. 读取：数据转换成对象，发给前端
   2. 写入：对象转换成数据，写入数据库
4. 持久层：数据库。管理数据间的对应关系。关系型：mySql、Oracle、DB2。非关系型：MongoDB，Redis，HBase

### 1. 案例：用户登录
LoginServer
   1. web层（LoginController）：获取到用户名和密码，传入逻辑层中进行比对。
   2. 逻辑层LoginService：比对web层和DAO层传入的用户名和密码
   3. DAO：取出用户名和密码，放到逻辑层中进行比对。


## CommonJS
1. 一个文件就是一个模块，拥有单独的作用域；（kiss原则）
2. 普通方式定义的变量、函数、对象，都属于模块内部
3. require()引入模块
4. exports，module.exports导出相应模块

### 1. 全局对象global
每个文件时一个模块。这个文件是js文件，一个文件就是一个函数，同时也是一个模块，拥有自己单独的作用域。可以理解为，一个文件是一个模块，同时包裹在函数的内部。
```javascript
var a = 100;
console.log(global.a); // undefined
console.log(arguments);

// 相当于
(function(exports, require, module, __filename, __dirname){
    var a = 100;
    console.log(global.a);
    console.log(arguments);
})
```

### 2. require引入模块
#### 核心模块与文件模块。
```javascript
// 核心模块
const fs = require('fs');
// 文件模块
const foo = require('./foo.js'); // 缓存
const foo2 = require('./foo.js'); //不再去加载，直接使用
```
总结：
1. 核心模块在Node源代码编译的过程中，就已经编译成二进制文件，在Node启动的时候，就已经引入了，它也是在内存中，所以速度最快。
2. 文件模块：./ 当前目录（相对目录）； / 根目录（绝对路径）。
3. 多次加载，只会加载一次，因为有缓存。


#### 模块循环依赖加载(自己写的模块)
main.js，modA.js，modB.js
```js
// main.sj
const modA = require('./modA.js'); // 引入modA

const modB = require('./modB.js'); // 引入modB

// modA.js
module.exports.test = 'a';

const modB = require('./modB.js');

console.log('modA: ' + modB.test);
module.exports.test = 'aa'

// modB.js
module.exports.test = 'b';

// 输出已经加载的部分，还未执行的部分不会输出
const modA = require('./modA.js');

console.log('modB: ' + modA.test);
module.exports.test = 'bb'
```
执行结果
```md
modB: a
modA: bb
```
总结：
1. main.js加载const modA = require('./modA.js')，在加载modA时，发现modA中还有依赖要加载，即const modB = require('./modB.js')，于是先去记在modB，并执行modB中的代码，会输出modB: a。
2. 执行modB结束，又会执行modA中剩下没有执行的代码，又输出modA: bb。

#### 引入核心模块
```js
const {readFile} = require('fs');

readFile('./main.js', 'utf-8', (err, data) => {
  console.log(data);
})
```

#### 引入安装的模块
安装chalk模块：npm i chalk 
```js
const chalk = require('chalk');

console.log(chalk.red('hello world'));
```
require是如何解析的呢？(全局对象和模块化开发(CommonJS))

### 3. exports与module.exports
#### exports直接导出
```js
// modA.js
exports.a = 100; 

console.log(module.exports === exports); // true

// 相当于
// (function(exports, require, module, __filename, __dirname){
//   exports = module.exports
// })

// main.js
const modA = require('./modA.js'); // 引入modA
console.log(modA.a); // 100
```
总结：exports与module.exports指向同一个引用。

#### exports导出引用值
```js
// modA.js
exports = {
   'a': 1
} 

// main.js
const modA = require('./modA.js'); // 引入modA
console.log(modA.a); // undefined
```
总结：exports重新赋值给了一个对象，引用被改写了，此时exports与module.exports没有联系了。而require默认导入的是module.exports。

