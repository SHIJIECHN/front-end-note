---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Koa
---

## 使用


```javascript
const Koa = require('koa');

// 使用koa就创造一个应用实例
const app = new Koa();

// 中间件
// ctx 当前执行的上下文，每次请求都会产生一个上下文.ctx扩展了请求和响应的方法
// next 
app.use((ctx, next) => {
  // 先理解成 res.end()
  ctx.body = 'hello'

})

app.listen(3000, function () {
  console.log('server start 3000');
});// 监听一个端口号，node中http的listen方法写法一样
```

## 实现

### 1. 基本结构
```javascript
const http = require('http');


class Application {
  use(fn) {
    this.fn = fn; // 订阅 保存用户写的fn
  }

  handleRequest = (req, res) => {
    this.fn(req, res);
  }

  listen(...args) {
    const server = http.createServer(this.handleRequest);
    server.listen(...args)
  }
}

module.exports = Application;
```


- ctx中有四个比较重要的属性
  - app 当前应用实例，我们可以在app上扩展公共方法
  - req res原生node中的req和res
  - request response是koa自己封装的

- Koa对请求和req和res进行了一层抽象，叫request和response，在开发的时候，我们尽量避免原生的req和res的使用

```javascript
// path
console.log(ctx.req.path);// undefined  原生的方法
console.log(ctx.request.path);// / koa自己封装的 相当于pathname，通过url.parse(req.url)后得到的

// url
console.log(ctx.req.url); // / 原生
console.log(ctx.request.req.url);// / 原生

console.log(ctx.request.url);// /  koa 自己封装
console.log(ctx.url);// / 与上面request.url一样
```

### 2. 实现ctx

- 两层ctx包装，第一层是保证每次new创建应用时能够得到全新的上下文，第二层包装主要是为了每次发送一个请求都是一个全新的上下文对象。
- 主要是要注意this的指向
- ctx主要是代理了request和response里面的方法，使方法可以直接通过ctx.url，ctx.body访问，而不需要ctx.request.url这种访问
- ctx.body="hello"能够将信息写入到页面中的实现，与require里面module.exports的实现是一样的，就是将ctx.body传入到函数中，用户可以给ctx.body设置值，然后直接结束后koa可以拿到值，通过判断值的类型，转成string类型，通过res.end(ctx.body)返回给页面。

```javascript
function defineGetter(target, key) { // proxy 也可以使用
  context.__defineGetter__(key, function () {
    return this[target][key];
    // 这个this是：调用这个key的对象。如ctx.request.url，this就是ctx.request。
    // 这个ctx是经过包装过的，和这里的context不相等
  })
}

function defineSetter(target, key) {
  context.__defineSetter__(key, function (value) {
    this[target][key] = value; // ctx.body = ctx.reponse.body = value
  })
}

defineGetter('request', 'query');
defineGetter('request', 'url');
defineGetter('request', 'path');
defineGetter('response', 'body');

defineSetter('response', 'body');
```

## 中间件

- 中间件采用组合的方式，组合成一个大的Promise对象
- 中间件的执行顺序问题需要掌握

```javascript
// 把多个middleware组合一个大的promise
compose(ctx) {
  // 组合是要将数组里的函数一个个执行
  let index = -1; // 控制数组的迭代
  const dispatch = (i) => { // 派发
    // f防止一个next多次调用
    if (i <= index) return Promise.reject('multiple call next()');
    // 如果没有中间件，直接resolve成功即可
    index = i;
    if (this.middlewares.length === index) return Promise.resolve();
    // 保存第一次调用next时的索引
    // 如果不是Promise就转成Promise。一个promise在执行的时候，会等待返回的的promise执行完毕
    return Promise.resolve(this.middlewares[i](ctx, () => dispatch(i + 1)));
  }
  return dispatch(0);
}
```

## 中间件实战

中间件的作用：
1. 可以扩展属性和方法
2. 还可以权限处理，如果有权限做一件事，没权限，做其他的
3. 可以决定是否向下执行

### 1. bodyparse的实现

- 处理请求返回的数据。如post里面的请求
- bodyParse()函数执行后返回一个Promise，为什么这么设计呢？为了方便能够传递自定义的参数到函数中。

:::: tabs
::: tab index.js
```javascript
// 1. 用户默认发送get请求，路径/form，就返回一个表单功能的页面
// 2. 用户提交表单数据post请求到路径/form中, 我们需要将数据在服务端解析好后返回

const Koa = new require('koa');
// const bodyParser = require('./middleware/body-parse.js'); // koa-bodyparser
const bodyParser = require('koa-bodyparser');// 第三方包已经实现了bodyparser的功能

const app = new Koa();

app.use(bodyParser());// 中间件函数，必须要返回一个函数，为了方便传递参数

app.use(async (ctx, next) => {
  if (ctx.method === 'GET' && ctx.path === '/form') {
    ctx.body = `
    <form action="/form" method="POST">
      <input type="text" name="username">
      <input type="text" name="password">
      <button>提交</button>
    </form>
    `
  } else {
    await next();
  }
})

app.use(async (ctx, next) => {
  // 如何解析请求体
  if (ctx.method === 'POST' && ctx.path === '/form') {
    ctx.set('Content-Type', 'text/html;charset=utf-8');
    ctx.body = ctx.request.body;
  }
})

app.listen(3000, function () {
  console.log('server start 3000')
})
```
:::
::: tab body-parse.js
```javascript
function bodyParser() {
  return async (ctx, next) => {
    // 1. 自己定义一个请求体，把promise执行后的结果赋给了ctx.request.body
    ctx.request.body = await new Promise((resolve, reject) => {
      let arr = [];
      ctx.req.on('data', function (chunk) { // post有请求体，会触发
        arr.push(chunk);
      })
      ctx.req.on('end', function () { // get请求没有请求体，直接触发end
        // ctx.res.setHeader('Content-Type', 'text/html;charset=utf-8')
        resolve(Buffer.concat(arr));
      })
    })
    // 2. 执行下一个
    await next();
  }
}
module.exports = bodyParser;
```
:::  
::::

### 2. koa-static

- 返回静态文件。如果能处理就返回文件，如果不能处理就执行next()

:::: tabs 
::: tab index.js
```javascript
const Koa = new require('koa');
const path = require('path');
// const bodyParser = require('./middleware/body-parse.js'); // koa-bodyparser
const bodyParser = require('koa-bodyparser'); // 第三方包
// const static = require('./middleware/koa-static');
const static = require('koa-static');// 第三方包

const app = new Koa();

app.use(bodyParser());// 中间件函数，必须要返回一个函数，为了方便传递参数

// 指定多个静态服务路径
app.use(static(path.resolve(__dirname, 'public')));
app.use(static(path.resolve(__dirname, 'koa')));

app.use(async (ctx, next) => {
  // 如何解析请求体
  if (ctx.method === 'POST' && ctx.path === '/form') {
    ctx.set('Content-Type', 'text/html;charset=utf-8');
    ctx.body = ctx.request.body;
  }
})

app.listen(3000, function () {
  console.log('server start 3000')
})
```
:::   
::: tab koa-static.js
```javascript
const path = require('path');
const fs = require('fs').promises;
const mime = require('mime');

function static(dirname) {
  return async (ctx, next) => {
    let filePath = path.join(dirname, ctx.path);
    // 如果文件路径不是文件的话就不能处理了，需要调用下一个中间件
    // 如果自己能处理，就不要向下处理了
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isDirectory()) {
        // 是文件夹，需要拼接路径 xx/xx/index.html
        filePath = path.join(filePath, 'index.html');
      }
      ctx.set('Content-Type', mime.getType(filePath) + ';charset=utf-8')
      ctx.body = await fs.readFile(filePath);// 读取文件
    } catch (e) {
      // 自己处理不了的向下执行
      await next();
    }
  }
}

module.exports = static;
```
:::   
:::: 


### 3. 路由koa-router

:::: tabs
::: tab index.js
```javascript
const Koa = new require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser'); // 第三方包
const static = require('koa-static');// 第三方包
const Router = require('./middleware/koa-router');
const router = new Router();

const app = new Koa();
app.use(bodyParser());

app.use(static(path.resolve(__dirname, 'public')));
app.use(static(path.resolve(__dirname, 'koa')));

app.use(router.routes());

router.get('/user/add', async (ctx, next) => {
  ctx.body = '/user/add';
})

router.get('/user/remove', async (ctx, next) => {
  ctx.body = '/user/remove1'
  console.log(1)
  // next()// 路由基本上不再调用next
})

router.get('/user/remove', async (ctx, next) => {
  ctx.body = '/user/remove2';
  console.log(2)
  // next();
})

app.use(function (ctx, next) {
  ctx.body = 'end';
})

app.listen(3000, function () {
  console.log('server start 3000')
})
```
:::   
::: tab koa-router.js
```javascript
class Layer {
  constructor(method, pathname, callback) {
    this.method = method;
    this.pathname = pathname;
    this.callback = callback;
  }

  // 匹配当前请求的路径和方法，如果匹配返回true
  match(requestPath, requestMethod) {
    return this.pathname === requestPath && this.method === requestMethod
  }
}

class Router {
  constructor() {
    this.stack = [];// 存放路由设置函数
  }

  get(pathname, callback) {
    // 调用get就是来维护映射关系的
    let layer = new Layer('GET', pathname, callback); //订阅一个路由
    this.stack.push(layer); // 放入stack中
  }

  compose(matchLayers, ctx, next) {
    let dispatch = (index) => {
      // 如果走到最后，就从路由中间件出去，或者一个没有匹配到也出去
      if (index === matchLayers.length) return next()
      return Promise.resolve(matchLayers[index].callback(ctx, () => dispatch(index + 1)));
    }
    return dispatch(0);
  }

  routes() {
    return async (ctx, next) => {
      // 请求到来时会调用此方法
      let requestPath = ctx.path; // 当有请求时，拿到请求的路径
      let requestMethod = ctx.method; // 拿到请求的方法

      // 去栈中筛选出这个路径和方法下的。matchLayers为这个路径下的回调函数
      let matchLayers = this.stack.filter(layer => layer.match(requestPath, requestMethod))
      // 组合
      this.compose(matchLayers, ctx, next);
    }
  }
}

module.exports = Router;
```
:::   
::::




## 总结
1. 支持中间件的写法use（组合）
2. 监听错误（对错误的监听）
3. 扩展了req和res中的属性和方法