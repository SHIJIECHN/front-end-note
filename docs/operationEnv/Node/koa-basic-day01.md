---
autoGroup-1: Koa
sidebarDepth: 3
title:  Koa入门、深入理解async/await
---

## Koa创建服务器
在Node之前，JavaScript只能运行在浏览器。NodeJS给我们提供了让JavaScript具有脱离浏览器运行的能力。

```javascript
npm init -y
npm i koa -S
npm i nodemon 
```
nodemon 帮助自动执行JS文件。

启动一个koa服务器
```javascript
const Koa = require('koa');
const app = new Koa(); // 应用程序对象
// 访问端口
app.listen(3111);
```

## 中间件
常规服务器：浏览器发送一个HTTP请求，服务器接收请求。

> 如何在服务器接收到HTTP请求后处理请求（如返回数据）呢？

需要中间件。中间件本质就是一个函数。

> 如何让一个test函数成为中间件呢？

将函数传入app.use(test)中。test函数就变成了一个中间件。这个过程也叫注册中间件。
```javascript
app.use((ctx, next)=>{
  //...
})
```

> 中间件有什么作用呢？

正常调用函数，函数会直接执行。而中间件是在有浏览器请求放过来时会执行，没有请求就不执行。

> 同时注册多个中间件，如何执行呢？

可以通过传参的方式让中间件执行，没有参数默认只执行第一个。

中间件函数会传入参数两个参数：
- 参数1：ctx。函数上下文。
- 参数2：next。下一个中间件函数。next()执行，表示执行下一个中间件。

> 什么是洋葱模型?

<img :src="$withBase('/operationEnv/Node/koa-middleware.jpg')" alt="" />

下面程序的输出：
```javascript
 app.use((ctx, next) => {
  console.log(1);
  next();
  console.log(2);
})

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
})
 *
 * 1 3 4 2
 */
```

## 中间件的返回值
中间件函数执行的结果都是Promise。

> next()没有返回值时

```javascript
app.use((ctx, next) => {
  console.log(1);
  const result = next();
  console.log('result', result); // result Promise { undefined }
  console.log(2);
})

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
})

// 执行结果：1 3 4 result Promise { undefined } 2
```

> next()有返回值时，如何直接拿到结果？

```javascript
app.use(async (ctx, next) => {
  console.log(1);
  const resultPromise = next();
  resultPromise.then(res => {
    console.log(res);
  })
  console.log(2);
})

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
  return 'hello';
})

// 执行结果：1 3 4 2  hello
```

执行结果发生了变换，因为Promise是异步操作，第二个中间件的结果 hello 最后输出。如何使执行结果为 1 3 4 hello 2呢？

使用async await。

```javascript
app.use(async (ctx, next) => {
  console.log(1);
  const result = await next();
  console.log('result: ' + result);
  console.log(2);
})

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
  return 'hello';
})

// 执行结果： 1 3 4 hello 2  
```

总结await的作用：
1. 求值Promise表达式
2. 阻塞线程

> 什么是阻塞线程？

异步操作。如对资源的操作、读写数据库、发送http请求。都会造成阻塞线程。

如果next前面没有使用await ，并且next()中包含异步代码，会破坏洋葱模型。

```javascript
app.use(async (ctx, next) => {
  console.log(1);
  const result = await next();
  console.log('result: ' + result);
  console.log(2);
})

app.use((ctx, next) => {
  console.log(3);
  next();
  console.log(4);
  return 'hello';
})

// 执行结果：1 3 4 hello 2
```
