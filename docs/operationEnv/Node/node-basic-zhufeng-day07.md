---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Http
---

## 介绍
- http是node内置模块，可以直接使用
- http 内部基于socket将其分割出request response 底层实现还是要基于socket
- 底层用socket来通信，http会增加一些header信息，请求来了之后需要在socket中读取数据，并解析成请求

## 创建一个服务

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // 处理请求与响应
})

// 监听方式一
server.listen(3000, function () {
  console.log('server start 3000')
});

// 监听方式二。两者是一样的，使用其中一种方式即可
server.on('request', function () { // 监听成功后的回调
  console.log('client come on')
})
```


## 请求参数

### 1. url

- url：由多部分组成。http://username:password@www.zufeng.com:80/a?a=1#aaa

```javascript
console.log(url.parse(`http://username:password@www.zufeng.com:80/a?a=1#aaa`))

/**
Url {
  protocol: 'http:',
  slashes: true,
  search: '?a=1',
  query: 'a=1',
  pathname: '/a',
  path: '/a?a=1',
  href: 'http://username:password@www.zufeng.com:80/a?a=1#aaa'
}
 */

// 如果希望query是一个对象，可以传入参数 true
console.log(url.parse(`http://username:password@www.zufeng.com:80/a?a=1#aaa`, true))
/**
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'username:password',
  host: 'www.zufeng.com:80',
  port: '80',
  hostname: 'www.zufeng.com',
  hash: '#aaa',
  search: '?a=1',
  query: [Object: null prototype] { a: '1' },
  pathname: '/a',
  path: '/a?a=1',
  href: 'http://username:password@www.zufeng.com:80/a?a=1#aaa'
}
 */
```

### 2. 其他参数

- req.method：请求方法，大写的。POST，GET
- req.url：请求路径，从路径开始到hash的情面，默认没写路径就是 /, 代表的是服务端根路径
- pathname：查询路径 /a
- query：查询参数。使用工具url.parse(req,url,true)，可以将查询路径与参数分开
- req.headers：请求头。node中所有的请求头都是小写的
- req.on('data',function(){...})获得请求体。是以流的方式返回的。
- res,statusCode：响应状态码
- res.statusMessage：响应信息
- res.setHeader()：设置响应头
- res.write(): 响应体
- res.end(): 断开

```javascript
const server = http.createServer((req, res) => {
  // 先获取请求行 请求方法 请求路径 版本号
  console.log('请求行---------start----------')
  console.log(req.method);// 请求方法是大写的
  console.log(req.url);// 请求路径是从路径开始，到hash的前面，默认没写路径就是 /，代表的是服务端根路径
  const { pathname, query } = url.parse(req.url, true); // 把查询路径与参数分开
  console.log(pathname, query);
  console.log('请求行---------end----------')
  console.log('请求体---------start----------')
  console.log(req.headers);// 获取浏览器的请求头，node中所有的请求头都是小写的
  console.log('请求体---------end----------')

  // post和put请求有请求体，req是可读流。模拟curl --data "a=1" -v http://localhost:3000
  // 大文件上传需要分片，或者客户端上传
  let chunk = [];
  console.log('读取请求体---------start----------')
  req.on('data', function (data) { // 可读流读取的数据都是buffer类型
    chunk.push(data); // 因为服务福安接收到的数据可能是分段传输的，我们需要自己将传输的数据拼接起来
    // console.log(data); 
  })
  req.on('end', function () {// 将浏览器发送的数据全部读取完毕
    console.log(Buffer.concat(chunk).toString());
    console.log('读取请求体---------end----------')
  })

  // 响应状态码，可以自己设定一般情况不设定
  res.statusCode = 333; // 更改浏览器的响应状态
  res.statusMessage = 'my define';

  res.setHeader('MyHeader', 1);// 设置响应头

  res.write('hello'); // 响应体，如果是路径，那就把响应内容返回给页面，如果是ajax中的响应体。
  res.end('ok'); //断开，写完了

})
```