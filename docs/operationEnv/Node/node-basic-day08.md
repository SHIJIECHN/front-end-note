---
autoGroup-3: Node基础
sidebarDepth: 3
title:  8. net模块
---

## net模块
1. 应用层：http（80）、FTP（21）、SCTP（邮件的发送，25）、POP3（110）、DNS
2. 传输层： TCP、UDP
3. 网络层：IP、ICMP
4. 数据链路层：PPT、SLIP
5. 物理层： ISO2110规范

## 简单的启动一个服务器
```js
var net = require('net');

var server = net.createServer();

server.listen(12306, '127.0.0.1');

server.on('listening', () => {
  console.log('服务器已经启动了');
})

server.on('connection', socket => {
  console.log('有新的链接');

  socket.on('data', data => {
    console.log(data.toString());
  })
})
```

## 简单实现一个客户端和服务器的通信
### 1. server.js
```js
const net = require('net');

// 创建一个服务端
const server = net.createServer();
// 创建服务端的端口号和IP地址
server.listen(12306, '127.0.0.1');
// 服务器启动的时候的监听事件
server.on('listening', ()=> {
  console.log('服务器已经启动了');
  // 打印服务端地址
  console.log(server.address());
})
// 当客户端向服务端发起请求时，服务端的监听连接事件
server.on('connection', socket => {
  console.log('有新的连接');

  // 服务端接收客户端传来的数据
  socket.on('data', data => {
    console.log(data.toString());
  })

  // 服务端向客户端发送数据
  socket.write('hello client');
  socket.write('hello client');
  socket.write('hello client'); 
})
```

### 2. client.js
```js
const net = require('net');

// 客户端连接服务端的端口号和IP地址
const socket = net.connect(12306, '127.0.0.1');
// 客户端连接成功触发的事件
socket.on('connect', ()=> {
  console.log('客户端已经连接到服务端了');
  //服务器地址
  console.log(socket.remoteAddress);
  //服务器端口号
  console.log(socket.remotePort);
  //本地地址
  console.log(socket.localAddress);
  //本地端口号
  console.log(socket.localPort);
})

//客户端向服务端发送数据
socket.write('hello server');
//客户端监听从服务端传来的数据
socket.on('data', data => {
  console.log(data.toString());
  //关闭连接
  socket.end();
})

//关闭连接时的监听事件
socket.on('close', ()=> {
  console.log('连接已关闭');
})
```

## 连接超时设置
### 1. server.js
```js

```