---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Express
---

## 基本使用
```javascript
// 内部不是es6的写法，都是构造函数，异步处理、迭代都是通过回调的方式

// express是一个函数，可以调用这个函数创建一个应用
const express = require('express');

const app = express();// 创建应用

// 没有ctx对象，主要靠的是原生的req和res，express直接在上面扩展的
app.get('/', function (req, res) {
  res.end('/')
});

app.get('/hello', function (req, res) {
  res.end('hello')
})

// 都没匹配到，就会执行
app.all('*', function (req, res) {
  res.end('*')
})

app.listen(3000, function () {
  console.log('server start 3000');
})
```

## 第一版

```javascript
const http = require('http');
const url = require('url');
const path = require('path');

// 这个就是express对象

function createApplication() {
  const router = [
    {
      path: '*', method: '*', handler(req, res) {
        res.end(`Cannot ${req.method} ${req.url}`);
      }
    }, // 默认放一条匹配不到的时候，访问的路径
  ]
  return {
    get(path, handler) { // 订阅
      router.push({
        path, method: 'get', handler
      })
    },

    listen() {
      let server = http.createServer(function (req, res) {
        let { pathname } = url.parse(req.url); // 获取请求的路径
        let requestMethod = req.method.toLocaleLowerCase();// 方法
        for (let i = 0; i < router.length; i++) { // 去路由中一次查找
          let { method, path, handler } = router[i]; // 找到后一次执行对应的处理函数
          if (pathname === path && requestMethod === method) {
            return handler(req, res); // 用户的回调
          }
        }
        return router[0].handler(req, res); // 如果找不到则执行默认找的逻辑
      });
      server.listen.apply(server, arguments);
    }
  }
}

module.exports = createApplication;
```

## Router、Layer、Route的逻辑