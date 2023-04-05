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

## 手写一个终端命令

要求：在命令行中输入http-server则启动一个http服务，以执行命令文件夹为根路径，展示当前文件夹内容，如果是目录则展示目录文件，如果是文件，则展示文件内容。

目录结构：
```javascript
├── bin
│   ├── config.js
│   └── www.js
├── package-lock.json
├── package.json
└── src
    ├── index.js
    ├── template.html
    ├── util.js
    └── 你好
```

## 浏览器缓存

- 缓存指的是静态文件的缓存
- 缓存分为强缓存和协商缓存
  - 强缓存：就是本地缓存，浏览器首次获取缓存的header信息，然后根据Cache-Control和Expires来判断资源在本地缓存是否过期，若没有过期则直接从本地缓存中获取资源信息，浏览器不再向服务器重新请求资源，如果过期则需要重新发送请求，重新缓存资源，更新缓存时间。缓存的类型disk cache或memory cache，代码无法控制，浏览器自己控制。
    - Cache-Control: max-age=相对时间。res.setHeaders('Cache-Control', 'max-age=10')
    - Expires是绝对时间。res.setHeaders('Expires', new Date(Date.now() + 10 *1000).toGMTString())
    - 设置两者过期时间为10秒后
  - 协商缓存：需要向服务器发起请求返回文件，并将文件与本地的缓存文件进行对比，确定本地缓存资源是否可用。header中的字段：
    - ETag和If-None-Match。有先级高。
    - LastModified和If-Modified-Since
- 强制缓存就是减少请求，协商缓存就是保证服务器的内容和缓存中的内容一致。

浏览器缓存比对过程：
```javascript
cacheFile(req, res, requestFile, statObj) {
  // 先设置强制缓存 ，在执行强制缓存的时候 默认是不会执行对比的缓存的
  res.setHeader('Cache-Control', 'max-age=10');
  res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());

  const lastMidfied = statObj.ctime.toGMTString();
  const etag = crypto.createHash('md5').update(readFileSync(requestFile)).digest('base64');

  res.setHeader('Last-Modified', lastMidfied);
  res.setHeader('Etag', etag);

  let ifModifiedSince = req.headers['if-modified-since'];
  let ifNoneMatch = req.headers['if-none-match'];
  // 如果文件 修改时间都不一样了，那就直接走新的就好了
  if (lastMidfied !== ifModifiedSince) { // 有可能时间一样但是 内容不一样
      return false;
  }
  if (ifNoneMatch !== etag) { // 一般情况 指纹的生成不会全量根据文件生成
      return false;
  }
  return true;
}
```

## crypto

- crypto是我们node中提供好的用于加密的包，各种摘要算法和加密算法
- md5算法：hash算法、摘要算法 （md5无法反解）。特点：
  - 不可逆
  - 相同的内容摘要出的结果相同
  - 摘要的内容不同 结果完全不同
  - 摘要不同的内容，长度时相同的
- 加盐算法：需要盐值和秘钥。
  
```javascript
const crypto = require('crypto');
// crypto.createHash创建一个摘要算法
// 逻辑运算：md5 , 把abc进行摘要，摘要的结果是base64 或 16进制。update('abc')摘要的内容，digest('base64')摘要的个数
let r1 = crypto.createHash('md5').update('abc').digest('base64');
console.log(r1);
// 可以多次update，多次摘要       
let r2 = crypto.createHash('md5').update('a').update('b').update('c').digest('base64');
console.log(r2); // r1等于r2

// 2.加盐算法（盐值sha256, 秘钥zf1）
let r3 = crypto.createHmac('sha256', 'zf1').update('abc').digest('base64');
console.log(r3)
```

## gzip文件压缩   

- 前端优化方案：缓存、压缩。
- zlib内置包

```javascript
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.resolve(__dirname, '1.txt'))

// 读一点文件就gzip一下，再把内容写会去
// 前端webpack来做、服务端可以做gzip
// gzip不适合重复率的低的内容，gzip核心就是相同替换的方案

// 要根据后缀做 gzip
zlib.gzip('abc', function (err, data) {
  console.log(data);
})
```

```javascript
// 浏览器会给我一个accept-encoding的字段，我要看一下浏览器支持什么压缩
gzipFile(req, res, requestFile, statObj) { 
  let encodings = req.headers['accept-encoding'];
  if (encodings) { // 浏览器支持
    if (encodings.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip'); // 浏览器要知道服务器的压缩类型
      return zlib.createGzip(); // gzip
    } else if (encodings.includes('deflate')) {
      res.setHeader('Content-Encoding', 'deflate');
      return zlib.createDeflate(); // defalte
    }
  }
  return false;// 浏览器不支持压缩
}

// 使用gzip压缩文件
let createGzip = this.gzipFile(req, res, requestFile, statObj);
if (createGzip) { // 看一下支不支持压缩，如果支持，就返回一个压缩流
  return createReadStream(requestFile).pipe(createGzip).pipe(res); // 转化流
}
```

## 动态请求

- 前端按钮点击发送一个POST请求，后端接收到请求后处理
- Content-Type客户端设置表示我传过去什么数据类型，服务端设置表示我返回什么数据类型
- xhr.responseType表示要求服务端返回什么类型
- 服务器接收到的数据是流，所以需要使用res.on('data')读取流，res.on('end')监听流读取结束，然后返回

:::: tabs
::: tab server.js
```javascript
const http = require('http');
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

// 如果访问的是文件夹，就加载文件夹下的index.html

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);

  // 客户端发送一个请求，接收客户端的数据

  // 后端路由 restful风格，一般根据请求路径和方法来处理

  if (pathname === '/login' && req.method == 'POST') {
    const buffer = [];
    req.on('data', function (chunk) {
      buffer.push(chunk);
    })
    req.on('end', function () {
      let buf = Buffer.concat(buffer); // 前端传递的数据
      console.log(req.headers['content-type'])

      // http1.0中的特点，为了能识别不同的类型，需要经过请求头来处理
      // 客户端要求返回application/json;charset=utf-8 
      if (req.headers['content-type'].includes('application/json')) {
        let obj = JSON.parse(buf.toString()); // 回显 json
        res.end(JSON.stringify(obj)); // 返回JSON类型
      } else if (req.headers['content-type'] === 'text/plain') {
        res.end(buf.toString()); // 返回文本类型
      }
    })
  } else {
    let filePath = path.join(__dirname, pathname);
    fs.stat(filePath, function (err, statObj) {
      if (err) {
        res.statusCode = 404;
        res.end('NOT FOUND');
      } else {
        if (statObj.isFile()) {
          // 文件
          res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8');
          fs.createReadStream(filePath).pipe(res);
        } else {
          // 目录
          let htmlPath = path.join(filePath, 'index.html');
          fs.access(htmlPath, function (err) {
            if (err) {
              res.statusCode = 404;
              res.end('NOT FOUND');
            } else {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              fs.createReadStream(htmlPath).pipe(res);
            }
          })
        }
      }
    })
  }
})

server.listen(3000, () => {
  console.log('server start 3000')
})
```
:::   
::: tab index.html
```javascript
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button id="btn">点击</button>

  <script>
    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      // 服务器本身不支持 ../../路径 
      xhr.open('POST', '/login', true); // / 服务器根路径，以服务器localhost:3000
      // xhr.setRequestHeader('Content-Type', 'text/plain'); // 1）纯文本
      // 客户端和服务器说我传递的数据类型的格式
      xhr.setRequestHeader('Content-Type', 'application/json'); // 2)
      xhr.responseType = 'json'; // 要求返回的是json
      xhr.onload = function () {
        // 浏览器会根据服务器返回的类型进行解析
        console.log(xhr.response)
      }

      xhr.send('{"name":"zf"}'); // 2) json
      // xhr.send('abc');// 1）纯文本类型

    });

    // ajax默认是同源策略，浏览器的限制。要求发送的域名、协议、接口都得是同一个

  </script>
</body>

</html>
```
:::
::::

## 跨域

### 1. ajax请求

- 跨域请起头部设置：
  - Access-Control-Allow-Origin
  - Access-Control-Allow-Headers
  - Access-Control-Max-Age
  - Access-Control-Allow-Methods
  - Access-Control-Allow-Credentials

- 客户端设置了Content-Type属性自定义了请求头，所以是个复杂请求

```javascript
if (req.headers.origin) { // 当请求头中有origin字段
  // 一般情况下都不会写 * ，因为跨域不允许携带cookie，但是我们可以强制设置携带cookie，
  // 但是设置了允许携带cookie，这个值就不能填 *
  // res.setHeader('Access-Control-Allow-Origin', '*'); 
  // 设置允许跨域
  // 表示谁来访问服务器都可以  
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin); // 允许的源
  // 服务器告诉客户端 我能识别的你自定的header
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token'); // 允许自定义的请求头
  // 告诉浏览器每隔10秒再发预检请求
  res.setHeader('Access-Control-Max-Age', '10'); // 没有设置的话浏览器每次都会发预检请求
  // 服务器可以接受哪些方法请求
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
  // 表示运行携带cookie了
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') { // 预检请求
    return res.end(); // 表示一个试探性请求，不用理会
  }
}
```

### 2. form表单input

- 默认表单类型：Content-Type: application/x-www-form-urlencoded
- querystring模块可以将查询字符串转换成对象。即username=123&password=456变成对象：{username: '123',password: '456'}
- Content-Type的类型
  - application/json：JSON对象。{"name":'123'}
  - application/x-www-form-urlencoded：查询字符串。username='123'&password='456'
  - multipart/form-data：
  - text/plain：纯文本。'123'.

```html 
<!-- form表单只有get post请求 -->
<form action="http://localhost:3000/login" method="POST">
  <input type="text" name="username">
  <button>提交</button>
</form>
```

```javascript
req.on('end', function () {
      if (req.headers['content-type'] == 'application/x-www-form-urlencoded') {
        // buf.tostring()是字符串username=123&password=456，希望数据变成对象：{username: '123'}
        let r = querystring.parse(buf.toString(), '&', '='); // 以&分隔，=连接
        res.end(JSON.stringify(r));
      }
    })
```

### 3. 表单上传文件

上传文件，客户端传过来的东西，

```javascript
------WebKitFormBoundaryWzLZ3zk0owbIE7CV  // 第一个分隔线
Content-Disposition: form-data; name="username"  // username字段

1
------WebKitFormBoundaryWzLZ3zk0owbIE7CV
Content-Disposition: form-data; name="avatar"; filename="a.txt" // 上传文件
Content-Type: text/plain  // 文本

abc
------WebKitFormBoundaryWzLZ3zk0owbIE7CV--
```

解析上面的类型，得到结果：
```javascript
{
  "username": "11",
  "avatar": {
    "filename": "4928ab49-8238-40fb-ae10-d8b6f8b0f65e",
    "size": 3
  }
}
```

解析过程：

- 使用boundary将整体内容分隔，注意分割后，头部和尾部也有内容，所以要截取
- 将头部和body分割，使用`\r\n`换行分割
- 判断header里是否包含filenam，有filenam是文件上传，没有filename就是普通字段。
- 文件上传需要将内容读取然后通过fs.writeFileSync写入磁盘中

:::: tabs 
::: tab server.js
```javascript
Buffer.prototype.split = function (sep) { // sep 分隔符
  let len = Buffer.from(sep).length; // 强制将字符串转化成buffer。len为分隔符的长度
  let offset = 0;
  let current;
  let arr = [];
  while (-1 !== (current = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, current));
    offset = current + len;
  }
  arr.push(this.slice(offset)); // 上面没有将最后的 -- 不能放到arr中，所以需要在这里push进去
  return arr;
}
const uploadPath = path.resolve(__dirname, 'upload');

// ......省略

if (req.headers['content-type'].includes('multipart/form-data')) { // 表单二进制格式
  // Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryujpdWLTMwGBMBZQl
  let boundary = req.headers['content-type'].split('=')[1];
  boundary = '--' + boundary;
  // buf没有split方法，手写以boundary为分隔符分隔buf字段
  const lines = buf.split(boundary).slice(1, -1); // 去掉 前面空格 和 后面的--
  const r = {};
  lines.forEach(line => {
    // 把header 和 内容进行拆分
    let [head, body] = line.split(`\r\n\r\n`);
    head = head.toString(); // Content-Disposition: form-data; name="username
    // console.log(body.toString()); // abc 输入框输入的内容和文件里面的内容
    let name = head.match(/name="(.+?)"/)[1]; // ['name="username"', 'username', index:34,...]
    if (head.includes('filename')) {
      // 文件上传  将文件内容上传到服务器的上传文件夹中
      let buffer = line.slice(head.length + 4, -2); // 找到buffer
      let filename = uuid.v4();
      // 你最终创建完名字之后 还会同步到数据库里 ，下次查找数据库，再找到对应的文件名
      fs.writeFileSync(path.join(uploadPath, filename), buffer)
      r[name] = {
        filename,
        size: buffer.length
        // 文件大小 fs.stat
      }
      // 文件名一般都是随机的
    } else { // key:value
      // 直接把信息放到一个对象中即可
      r[name] = body.toString().slice(0, -2);
    }
  })
  res.end(JSON.stringify(r));
  // {
  //   "username": "11",
  //   "avatar": {
  //     "filename": "4928ab49-8238-40fb-ae10-d8b6f8b0f65e",
  //     "size": 3
  //   }
  // }
}
```
:::   
::: tab index.html
```html
<!-- h5的formdata 就是表单的multipart/form-data变体 -->
  <form action="http://localhost:3000/login" method="POST" enctype="multipart/form-data">
    <input type="text" name="username">
    <input type="file" name="avatar">
    <button>提交</button>
  </form>
```
:::   
::::








