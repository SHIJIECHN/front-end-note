---
autoGroup-1: Node基础
sidebarDepth: 3
title:  8. net模块
---

## net模块
五层网络协议：
1. 应用层：http（80）、FTP（21）、SCTP（邮件的发送，25）、POP3（邮件接收，110）、DNS（域名解析系统）
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
<img :src="$withBase('/operationEnv/Node/net.png')" alt="net"> 

## 简单实现一个客户端和服务器的通信
server事件：
1. listening：监听端口后触发的事件
2. connection：当有客户端请求连接的时候触发。参数socket，客户端发送的是一个socket，服务端收到的也是socket。
3. close：不常用，服务器关闭的时候触发。为什么不常用？因为我们关闭服务器的方式通常采用杀线程的方式来关闭服务。
4. error：不常用，服务器出现错误的时候触发

server方法：
1. listen：server监听的端口
2. close 关闭服务器的方法
3. address：在回调中查看主机的IP

Socket事件：
1. connect：连接到服务器时触发
2. data：当接受到数据时触发，一般是做参数
3. end：写入数据完成以后调用
4. timeout 超时后触发
5. error
6. close：socket关闭的是时候触发

Socket属性：
1. remoteAddress：远程（服务器）的地址
2. remotePort：远程的端口
3. localAddress：本地地址
4. localPort：本地端口

Socket方法：
1. setTimeout：设置超时时间
2. write：socket中写入数据
3. end：写入结束

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
var net = require('net');
var server = net.createServer();
server.listen(12306, '127.0.0.1');
```
### 2. client.js
```js
var net = require('net');

var socket = net.connect(12306, '127.0.0.1');
// 设置超时2000ms
socket.setTimeout(2000);
socket.on('connect', () => {
  console.log('已经连接到服务器');
});

// 监听超时事件触发
socket.on('timeout', ()=> {
  console.log('超时2000ms');
})
```

## 浏览器与服务器接收数据的区别
启动服务器
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
### 1. 浏览器
浏览器访问：127.0.0.1:12306    
服务端打印的是报文：
<img :src="$withBase('/operationEnv/Node/net01.png')" alt="net"> 

### 2. Node环境
client.js
```js
const net = require('net');

const socket = net.connect(12306, '127.0.0.1');
// 客户端连接成功触发的事件
socket.on('connect', ()=> {
  console.log('客户端已经连接到服务端了');
})

//客户端向服务端发送数据
socket.write('hello server');
```
服务端打印数据：
<img :src="$withBase('/operationEnv/Node/net02.png')" alt="net"> 

### 3. 服务端返回响应报文
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
    socket.write('HTTP 200OK\r\nContent-Type:text/html\r\n\r\n<html><body>Hello Browser</body></html>');
    socket.end();
  })
})
```
浏览器访问127.0.0.1:12306   
<img :src="$withBase('/operationEnv/Node/net03.png')" alt="net">


## demo