---
autoGroup-3: Node基础
sidebarDepth: 3
title:  1. 邂逅Node
---

## 浏览器
浏览器内核：
- Gecko： FireFox
- Trident： IE4-IE11， Edge使用Blink
- Webkit：Safari， Chrome（以前用）
- Blink：Webkit的一个分支。Chrome、Edge、Opera

浏览器内核指的是浏览器的排版引擎。   
排版引擎（layout engine），也称为浏览器引擎（browser engine）、页面渲染引擎（rendering engine）或样版引擎。

### 1. 渲染引擎工作过程
1. HTML解析，遇到script标签，就停止解析HTML，而去加载和执行JavaScript代码。
2. 因为JavaScript代码可以操作DOM，所以浏览器希望将HTML解析的DOM和JavaScript操作之后的DOM放到一起生成最终的DOM树，而不用频繁的去生成新的DOM树。
3. JavaScript代码是由JavaScript引擎执行

<img :src="$withBase('/basicComputer/Network/render.png')" alt="render"> 

### 2. JavaScript引擎
1. 为什么需要JavaScript引擎？
代码最终都是被CPU执行的，CPU只认识自己的指令集，所以需要JavaScript引擎帮助我们将JavaScript代码翻译成CPU指令来执行。

2. 常见的JavaScript引擎
   - SpiderMonkey
   - Chakra
   - JavaScriptCore：Webkit中的JavaScript引擎，Apple开发
   - V8：Google开发的JavaScript引擎。Chrome使用

### 3. WebKit内核
组成：
- WebCore：负责HTML解析、布局、渲染等
- JavaScriptCore：解析、执行JavaScript代码

<img :src="$withBase('/operationEnv/Node/webkit.png')" alt="webkit"> 

### 4. V8引擎
<img :src="$withBase('/operationEnv/Node/V8.png')" alt="V8"> 

1. Parse模块：将JavaScript代码转换成AST（抽象语法树）
   - 如果函数没有被调用，则不会被转换

2. Ignitions：解释器。将AST转换成ByteCode（字节码）
   - 收集TurboFan优化所需要的信息（比如函数的参数类型）
   - 如果函数只调用一次，Ignition会解释成ByteCode

3. TurBoFan：编译器。将字节码变编译成CPU可以直接执行的机器码
   - 如果一个函数被多次调用，那么就会被标记为热点函数，那么就会经过TurboFan转换成优化的机器码，提高代码的执行性能。
   - 机器码实际上也会被还原为ByteCode，这是因为如果后续执行函数的过程中，类型发生了变化，之前优化的机器码并不能正确的处理运算，就会逆向的转换成字节码；


## 认识Node
### 1. Node和JavaScript的关系
1. Node.js基于V8 JavaScript引擎的JavaScript运行时的环境。但是不仅仅只有V8引擎。
2. 在Node.js中我们也需要进行一些额外的操作，比如文件系统读/写、网络IO、加密、压缩解压文件等。

### 2. Node和浏览器的区别

浏览器中除了V8之外还有Blink等内核。

<img :src="$withBase('/operationEnv/Node/Node.js.png')" alt="Node.js"> 

### 3. Node.js架构
<img :src="$withBase('/operationEnv/Node/Node-construct.png')" alt="Node-construct"> 

1. 编写的JavaScript代码会经过V8引擎，在通过Node.js的Bindings，将任务放到libuv的事件循环中
2. libuv是使用C语言编写的库
3. libuv提供了事件循环、文件系统读写、网络IO、线程池等


## Node程序执行
1. 执行
```js
node index.js

// index.js
console.log(process.argv); 
/**
 * [ 
 *  'D:\\software\\nodejs\\node.exe', 
 *  'E:\\TODO\\node-test\\index.js' 
 * ]
*/
```
2. 传递参数
```js
node index.js env=development

// index.js

// 获取参数
console.log(process.argv); 
/**
[
  'D:\\software\\nodejs\\node.exe',
  'E:\\TODO\\node-test\\index.js',
  'env=development'
]
*/

// 遍历
process.argv.forEach(arg => {
  console.log(arg);
})

```
