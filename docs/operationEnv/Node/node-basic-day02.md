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

### 2. CommonJS
#### CommonJS的引入
CommonJS是一个规范，最初提出来是在浏览器以外的地方使用，并且当时被命名为ServerJS，后来为了体现它的广泛性，修改为CommonJS，平时我们也会简称为CJS。
1. Node是CommonJS在服务器端一个具有代表性的实现；
2. Browserify是CommonJS在浏览器中的一种实现；
3. webpack打包工具具备对CommonJS的支持和转换；

#### Node对CommonJS的支持
Node中对CommonJS进行了支持和实现，在开发node的过程中可以方便的进行模块化开发：
1. 在Node中每一个js文件都是一个单独的模块；
2. 每个模块中包括CommonJS规范的核心变量：exports、module.exports、require。

#### 模块化的核心是导出和导入
1. exports和module.exports可以负责对模块中的内容进行导出；
2. require函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容。

## exports
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

## module.exports
### 1. 与exports的关系
1. CommonJS中是没有module.exports的概念，但是为了实现模块的导入，Node使用的是Module类，每个模块都是Module的实例，也就是module。
2. Node中真正导出的是module.exports。
3. module对象的exports属性是exports对象的一个引用，也就是说module.exports = exports = main中的bar
4. 修改modul.exports的属性，exports属性也会发生改变。
<img :src="$withBase('/operationEnv/Node/module.exports.png')" alt="module.exports"> 

### 2. module.exports导出对象
如果module.exports导出一个新对象，则exports与module.exports失去联系。即通过module.exports = { ... }导出，const bar require('./bar.js')引用的是 module.exports。和exports没有关系。
<img :src="$withBase('/operationEnv/Node/module.exports02.png')" alt="module.exports"> 



 


