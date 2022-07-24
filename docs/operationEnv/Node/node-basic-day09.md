---
autoGroup-1: Node基础
sidebarDepth: 3
title:  9. http模块
---

## 创建服务器
```javascript
const http = require('http');
// 创建方式一
function reqListener(req, res) {}
http.createServer(reqListener);

// 使用匿名函数
http.createServer(function(req, res) {})

// 使用箭头函数
http.createServer((req, res) => {})
```

### 案例一
启动服务器node app.js，在浏览器中访问localhost:3000.
```javascript
// app.js
const http = require('http');

// createServer 返回server
const server = http.createServer((req, res) => {
    // 请求
    // console.log(req.url, req.method, req.headers);

    // 响应
    res.setHeader('Content-Type', 'text/html'); // 响应头
    res.write('<html>');
    res.write('<head><meta charset="utf-8"></meta><title>我的页面</title></head>');
    res.write('<body><h1>你好，NodeJS！</h1></body>');
    res.write('</html>');
    res.end();
});

// 开启一个进程，让js不会立即结束。
server.listen(3000);
```

## 响应数据与请求数据
```javascript
const fs = require('fs');
const http = require('http');

// createServer 返回server
const server = http.createServer((req, res) => {
    // 请求
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html'); // 响应头
        res.write('<html>');
        res.write('<head><meta charset="utf-8"></meta><title>请输入你的内容</title></head>');
        res.write(`
        <body>
            <form action="/message" method="POST">
                <input type="text" name="message"/>
                <button type="submit">发送</button>
            </form>
        </body>`);
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        // 注册data事件监听器
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        })

        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            fs.writeFileSync('msg.txt', message);
        })
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html'); // 响应头
    res.write('<html>');
    res.write('<head><meta charset="utf-8"></meta><title>我的页面</title></head>');
    res.write('<body><h1>你好，NodeJS！</h1></body>');
    res.write('</html>');
    res.end();
});

// 开启一个进程，让js不会立即结束。
server.listen(3000);
```
