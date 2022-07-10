---
autoGroup-3: Node基础
sidebarDepth: 3
title:  2. 全局对象和模块化开发(CommonJS)
---

## 全局对象
- 全局对象可以在模块中任意使用，但是在命令行交互中是不可以使用的
- 包括： __dirname、__filename、module、exports、require()

### 1. __dirname
获取当前文件所在的路径。不包括后面的文件名。
```js
console.log(__dirname); // E:\TODO\node-test
```

### 2. __filename
获取当前文件所在的路径和文件名称。包括后面的文件名称。
```js
console.log(__filename); // E:\TODO\node-test\index.js
```

### 3. process对象
提供Node进程中相关的信息。

### 4. console对象
提供简单的调试控制台。
- console.log
- console.clear：清空控制台
- console.trace()：打印函数的调用栈

### 5. 定时器函数：
- setTimeout(callback, delay[, ...args])：callback在delay毫秒后执行一次
- setInterval(callback, delay[, ...args])：callback每delay毫秒重复执行一次
- setImmediate(callback[, ...args])：callbackI / O事件后的回调的“立即”执行
- process.nextTick(callback[, ...args])：添加到下一次tick队列中
```js
setTimeout(() => {
  console.log("setTimeout");
}, 0);

setInterval(() => {
  console.log("setInterval");
}, 1000);

setImmediate(() => {
  console.log("setImmediate");
});

process.nextTick(() => {
  console.log("process.nextTick");
});
/**
process.nextTick
setTimeout
setImmediate
setInterval
*/
```
### 6. global对象
1. global是一个全局对象。 
<img :src="$withBase('/operationEnv/Node/global.png')" alt="global"> 

2. global和window的区别
  - 在浏览器中，全局变量都是在window上，比如document、setTimeout等。在Node中，全局变量都是在global上。
  - 在浏览器中，全局环境var声明一个属性，默认在window对象上；Node中，var定义一个变量，不会放到全局中，它只是在当前模块中有一个变量。

```js
// 浏览器
var name = 'Tom'
console.log(window.name); // Tom

// Node
var name = 'Jack';
console.log(name); // Jack
console.log(global.name); // undefined
```

## 模块化开发

### 1. JavaScript模块化规范
- CommonJS规范
- AMD规范
- CMD规范
- ES6规范

## CommonJS
### 1. CommonJS的引入
CommonJS是一个规范，最初提出来是在浏览器以外的地方使用，并且当时被命名为ServerJS，后来为了体现它的广泛性，修改为CommonJS，平时我们也会简称为CJS。
1. Node是CommonJS在服务器端一个具有代表性的实现；
2. Browserify是CommonJS在浏览器中的一种实现；
3. webpack打包工具具备对CommonJS的支持和转换；

### 2. Node对CommonJS的支持
Node中对CommonJS进行了支持和实现，在开发node的过程中可以方便的进行模块化开发：
1. 在Node中每一个js文件都是一个单独的模块；
2. 每个模块中包括CommonJS规范的核心变量：exports、module.exports、require。

### 3. 模块化的核心是导出和导入
1. exports和module.exports可以负责对模块中的内容进行导出；
2. require函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容。

#### exports
bar.js
```js
function sayhello(name){
  console.log('Hello ' + name);
}

// 导出
exports.myName = myName;
exports.age = age;
exports.sayhello = sayhello;
```
main.js
```js
const bar = require('./bar.js');
console.log(bar); 
/**
 * { myName: 'Tom', age: 19, sayhello: [Function: sayhello] }
 */
```
总结：
1. exports是一个对象，可以在这个对象中添加很多个属性，添加的属性会导出
2. require导入。此时常量bar等于exports对象。理解成对象的引用赋值。
3. 它们是实际上是一个浅拷贝，bar对象是exports对象的浅拷贝（引用赋值）。
4. 修改exports中属性的值，bar属性也会发生改变。
<img :src="$withBase('/operationEnv/Node/exports.png')" alt="exports"> 

##### module.exports与exports的关系
1. CommonJS中是没有module.exports的概念，但是为了实现模块的导入，Node使用的是Module类，每个模块都是Module的实例，也就是module。
2. Node中真正导出的是module.exports。
3. module对象的exports属性是exports对象的一个引用，也就是说module.exports = exports = main中的bar
4. 修改modul.exports的属性，exports属性也会发生改变。
<img :src="$withBase('/operationEnv/Node/module.exports.png')" alt="module.exports"> 

####  module.exports导出对象
如果module.exports导出一个新对象，则exports与module.exports失去联系。即通过module.exports = { ... }导出，const bar require('./bar.js')引用的是 module.exports。和exports没有关系。
<img :src="$withBase('/operationEnv/Node/module.exports02.png')" alt="module.exports"> 

#### require导入文件
require引入一个文件（模块）中导入的对象。

### 4. 模块加载过程
1. 模块在被第一次加载时，模块中的js代码会被运行一次
2. 模块被多次引入时，会缓存，最终只加载（运行）一次
3. 循环引入，采用深度优先算法。

### 5. CommonJS特点
1. CommonJS加载模块时同步的。
2. 只有等待模块加载完毕，当前模块中的内容才会被执行。

 
## AMD规范
1. AMD（异步模块定义），它采用异步加载模块
2. 常用AMD实现库require.js和curl.js

### 1. require.js
1. [下载地址](https://github.com/requirejs/requirejs)
2. 定义HTML的script标签引入require.js和定义入口文件。data-main属性的作用时在加载完src的文件后加载执行该文件。

目录结构：
<img :src="$withBase('/operationEnv/Node/AMD.png')" alt="AMD"> 

#### index.html
```html
 <script src="lib/require.js" data-main="index.js"></script>
```
#### index.js
```js
(function(){
  // 全局对象
  require.config({
    // 根据baseUrl查找路径
    baseUrl: '',
    // 路径：所有模块的对应映射关系。不能加后缀名
    paths: {
      'bar': './modules/bar',
      'foo': './modules/foo'
    }
  })

  // 模块加载
  require(['foo'], function(){ })
})();
```
#### foo.js
```js
// 导入
define(['bar'], function(bar){
  console.log(bar.name);
  console.log(bar.age);
  bar.sayHello('kobe')
})
```
#### bar.js
```js
// 定义模块
define(function(){
  const name = 'Tom';
  const age = 19;
  const sayHello = function(name){
    console.log('你好, '+ name);
  }

  // return一个对象
  return {
    name,
    age,
    sayHello
  }
})
```

## CMD规范
1. CMD（通用模块定义），它采用异步加载模块。它将CommonJS的有点吸收过来了。
2. 常用CMD实现库SeaJS

### SeaJS
1. [下载地址](https://github.com/seajs/seajs)
2. 引入sea.js和使用主入口文件。seajs是指定主入口文件的

目录结构：
<img :src="$withBase('/operationEnv/Node/CMD.png')" alt="CMD"> 

#### index.html
```html
  <script src="./lib/sea.js"></script>
  <script>
    // 指定主入口文件
    seajs.use('./index.js')
  </script>
```
#### index.js
```js
define(function(require, exports, module){
  // 导入
  const foo = require('./modules/foo');

  console.log(foo.name);
  console.log(foo.name);
  foo.sayHello('Jack')
})
```
#### foo.js
```js
define(function(require, exports, module){
  const name = 'Tom';
  const age = 20;
  const sayHello = function(name){
    console.log('你好, '+ name);
  }

  // 导出
  module.exports = {
    name, 
    age, 
    sayHello
  }
})
```

## ES Module
1. 使用关键字import和export来实现模块化。
2. export负责将模块内的内容导出
3. module负责将内容导入
4. 采用ES Module将自动采用严格模式：use strict

### 1. export
将内容导出三种方式：
1. 方式一：在语句声明的前面直接加上export关键字
2. 方式二：将所有需要导出的标识符，放到export后面的{}中，{}里面不是ES6的对象字面量的增强写法，{}也不是表示一个对象。所以export {name: name}是错误的写法。
3. 导出时给标识符起一个别名

### 2. import
#### 导入内容有三种方式：
1. 方式一：import {标识符列表} from '模块'
2. 方式二：导出时给标识符起别名
3. 通过 * 将模块功能放到一个模块功能对象上

#### 动态加载模块（import函数）
通过import加载一个模块，是不可以将其放在逻辑代码中的。如果希望动态的加载某一个模块，可以使用import()函数根据模块路径来动态加载。
```js
// 错误写法
if(true){
  improt sub from './modules/bar.js'
}

// 正确写法
let flag = true
if(falg){
  // 返回promise
  import('./modules/a.js').then(()=>{})
}else{
  import('./modules/b.js').then(()=>{})
}
```

### 3. 浏览器演示ES6的模块开发
index.html
```html
<script src="./index.js" type="module"></script>
```
index.js
```js
// 常见的导入方式

// 方式一:import {} from '路径'
// import { name, age, sayHello } from './modules/foo.js'

// 方式二：导出变量起别名
// import {name as wName, age as wAge, sayHello as wSayHello} from './modules/foo.js'

// 方式三：* as foo
import * as foo from './modules/foo.js'

console.log(foo.name);
console.log(foo.age);
foo.sayHello('Jack')
```
foo.js
```javascript
const name = "Tom";
const age = 18;
const sayHello = function(name) {
    console.log('hello, ' + name);
}

// 第一种方式
// export const name = "Tom";
// export const age = 18;
// export const sayHello = function(name) {
//     console.log('hello, ' + name);
// }

// 第二种方式
export {
    name,
    age,
    sayHello
}

// 第三种方式
// export {
//     name as fName,
//     age as fAge,
//     sayHello as fSayHello
// }
```

### 4. export 和 import结合使用
```js
export {sum as barSum} from './bar.js'

// 相当于
import { sum } from './bar.js'
export { sum }
```

### 5. export default 默认导出
1. 默认导出export时不需要指定名字
2. 在导入时不需要使用{}，并且可以自己指定名字
3. 方便与先用的CommonJS等规范相互操作
4. 在一个模块中，只能有一个默认导出（default export）


### 6. CommonJS与 ES Module加载过程比较
#### CommonJS 
1. CommonJS 模块加载js文件的过程是运行时加载的，并且是同步的。意味着js引擎在执行js代码的过程中加载模块，前面文件没有加载结束之前，后面的代码都不会执行。
2. CommonJS通过module.exports导出的是一个对象。可以将这个对象的引用用在其他模块中赋值给其他变量。最终他们指向是都是同一个对象，任何地方发生修改，其他变量属性也发生变化。

#### ES Module
1. ES Module加载js文件的过程是编译（解析）时加载的，并且是异步的。
   - import不能和运行时相关的内容放在一起使用
   - 比如form后面路径需要动摇加载、不能将import放在if语句中

2. JS引擎在遇到import时会去获取这个js文件，但是获取的过程是异步的，并不会阻塞主线程继续执行。
   - 设置了type="module"的代码，相当于在script标签上加上了async属性
   - 后面的script标签代码不会受到阻塞

```html
<script src="./index.js" type="module"></script>
<!-- 这个js文件的代码不会被阻塞执行 -->
<script src="./normal.js"></script>
```

3. ES Module通过export导出的是变量本身的引用，引用的地方不能修改。如果导出的是对象，其他地方可以修改对象的属性值。

### 7. Node对ES Module的支持
支持ES Module需要配置：
1. 方式一：在package.json中配置type：module
2. 方式二：.js文件修改为以.mjs结尾，表示使用的是ES Module

示例采用.mjs结尾：
<img :src="$withBase('/operationEnv/Node/Node_ESModules.png')" alt="Node_ESModules"> 

```javascript
node index.mjs
```


### 8. ES Modules 与 CommonJS结合操作

foo.js
```javascript
const name = "why";
const age = 18;

// 导出
module.exports = { name, age }
```
index.mjs
```javascript
// 需要加后缀.js 
import foo from './modules/foo.js'

console.log(foo.name);
```
总结：ES Module在加载CommonJS时，会将其module.exports导出的内容作为default导出方式来使用。
