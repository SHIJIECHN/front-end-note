---
autoGroup-3: Node基础
sidebarDepth: 3
title:  Cookie
---

## 信息存储
localstorage、sessionStorage、cookie、session的区别：

|类型|说明|
|----|:----|
|localstorage|存储到浏览器里，不能跨域，大小5M。如果用户不清空，不会丢失|
|sessionStorage、session会话|会话关闭后，会清空存储。可以使用来记录滚动条的位置，当前页面中需要共享的数据|
|cookie|用来和服务端传输数据（cookie存储大小4K）。不要把数据存到cookie中，可能会导致请求是多发送数据，合理使用cookie（不能存放敏感信息）|


## 设置和获取cookie

```javascript
http.createServer((req, res) => {
  if (req.url === '/read') {
    let cookie = req.headers['cookie'];
    return res.end(cookie);
  }
  if (req.url === '/write') {
    // 设置一个
    // res.setHeader('Set-Cookie', 'name=zf');
    // 设置多个
    // res.setHeader('Set-Cookie', ['name=zf', 'age=10']);

    // 参数：domain，path，max-age，expires，httpOnly
    // domain 只在某个域名下使用cookie，如a.zhufeng.cn。默认是当前域名，.zhufeng.cn一级域名 二级域名可以公用cookie
    // path 当前在某个路径下，可以读取cookie
    // res.setHeader('Set-Cookie', ['name=zf; domain=a.zhufeng.cn; path=/write', 'age=10']);
    // max-age 以秒为单位 expires 绝对事件 设置cookie的存活事件
    // httpOnly 前端不能改变后端的cookie，相对安全一些
    res.setHeader('Set-cookie', ['name=zf; max-age=10', 'age=10; httpOnly=true'])

    return res.end('write ok')
  }
}).listen(3000);
```

封装获取cookie的方法：

```javascript
let querystring = require('querystring');
http.createServer((req, res) => {
  let arr = [];
  res.setCookie = function (key, value, options = {}) {
    let itemArr = [];
    let line = `${key}=${value}`;
    itemArr.push(line);
    if (options.maxAge) {
      itemArr.push(`max-age=${options.maxAge}`);
    }
    if (options.domain) {
      itemArr.push(`domain=${options.domain}`);
    }
    if (options.httpOnly) {
      itemArr.push(`httpOnly=${options.httpOnly}`);
    }

    arr.push(itemArr.join('; '))

    arr.push(`${key}=${value}`);
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = function (key) {
    // cookie之间使用"; "分隔
    let cookie = querystring.parse(req.headers['cookie'], '; ') || {};
    return cookie[key];
  }

  if (req.url === '/read') {
    return res.end(res.getCookie('name') || '没有name');
  }
  if (req.url === '/write') {
    res.setCookie('name', 'zf', { maxAge: 10 });
    res.setCookie('age', '10');

    return res.end('write ok')
  }
}).listen(3000);
```

## cookie的签名

```javascript
let http = require('http');
let querystring = require('querystring');
let secret = 'zhufeng';
const crypto = require('crypto');
http.createServer((req, res) => {
  let arr = [];
  res.setCookie = function (key, value, options = {}) {
    let itemArr = [];
    let line;
    if (options.signedCookie) { // 判断有没有signedCookie
      // 使用crypto生成签名
      const sign = crypto.createHmac('sha256', secret)
        .update(value)
        .digest('base64')
        .replace(/\+|\\/g, '');
      line = `${key}=${value}.${sign}`
      console.log(22)
    } else {
      console.log(11)
      line = `${key}=${value}`;
    }
    itemArr.push(line);
    if (options.maxAge) {
      itemArr.push(`max-age=${options.maxAge}`);
    }
    if (options.domain) {
      itemArr.push(`domain=${options.domain}`);
    }
    if (options.httpOnly) {
      itemArr.push(`httpOnly=${options.httpOnly}`);
    }
    arr.push(itemArr.join('; '))
    console.log(arr)
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = function (key, options = {}) {
    let cookie = querystring.parse(req.headers['cookie'], '; ') || {};
    if (options.signedCookie) {
      let [value, sign] = cookie[key].split('.');
      let newSign = crypto.createHmac('sha256', secret)
        .update(value)
        .digest('base64')
        .replace(/\+|\\/g, '');
      if (sign === newSign) {
        return value;
      } else {
        return ''
      }
    } else {
      return cookie[key].split('.')
    }
  }

  if (req.url === '/read') {
    return res.end(res.getCookie('name', { signedCookie: true }) || '没有name');
  }
  if (req.url === '/write') {
    res.setCookie('name', 'zf', { signedCookie: true });
    res.setCookie('age', '10');

    return res.end('write ok')
  }
}).listen(3000);
```

## 用户访问次数

```javascript
let http = require('http');
let querystring = require('querystring');
let secret = 'zhufeng';
const crypto = require('crypto');
http.createServer((req, res) => {
  let arr = [];
  res.setCookie = function (key, value, options = {}) {
    let itemArr = [];
    let line;
    if (options.signedCookie) { // 判断有没有signedCookie
      // 使用crypto生成签名
      const sign = crypto.createHmac('sha256', secret)
        .update(value + '') // value必须是字符串
        .digest('base64')
        .replace(/\+|\\/g, '');
      line = `${key}=${value}.${sign}`
    } else {
      line = `${key}=${value}`;
    }
    itemArr.push(line);
    if (options.maxAge) {
      itemArr.push(`max-age=${options.maxAge}`);
    }
    if (options.domain) {
      itemArr.push(`domain=${options.domain}`);
    }
    if (options.httpOnly) {
      itemArr.push(`httpOnly=${options.httpOnly}`);
    }
    arr.push(itemArr.join('; '))
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = function (key, options = {}) {
    let cookie = querystring.parse(req.headers['cookie'], '; ') || {};
    if (options.signedCookie) {
      if (cookie[key]) {
        let [value, sign] = cookie[key].split('.');
        let newSign = crypto.createHmac('sha256', secret)
          .update(value + '') // value必须是字符串
          .digest('base64')
          .replace(/\+|\\/g, '');
        if (sign === newSign) {
          return value;
        } else {
          return ''
        }
      } else { // 没有cookie
        return ''
      }

    } else {
      return cookie[key] && cookie[key].split('.')
    }
  }

  if (req.url === '/read') {
    return res.end(res.getCookie('name', { signedCookie: true }) || '没有name');
  }
  if (req.url === '/write') {

    res.setCookie('name', 'zf', { signedCookie: true });

    return res.end('write ok')
  }
  if (req.url === '/visit') {
    let visit = res.getCookie('visit', { signedCookie: true });
    if (visit) {
      let v = ++visit;
      res.setCookie('visit', v, { signedCookie: true });
      res.end(`${v} come`);
    } else {
      res.setCookie('visit', 1, { signedCookie: true });
      res.end('first come');
    }
  }
}).listen(3000);
```

## session

cookie不是很安全。

session是基于cookie的 

```javascript
let http = require('http');
let querystring = require('querystring');
let uuid = require('uuid');// 第三方模块

let session = {};// 用来存储客户端和服务端的数据
const CARD_ID = 'connect.sid'; // 当前是哪家店铺

http.createServer((req, res) => {
  // 当客户端访问服务端时，需要获取当前用户是否来过
  if (req.url === '/favicon.ico') return res.end(); // 屏蔽
  // cookie是以"; "分隔
  let cookies = querystring.parse(req.headers.cookie, '; ') || {}
  let cardNumber = cookies[CARD_ID];// 取到对应的卡号

  if (cardNumber && session[cardNumber]) {
    session[cardNumber].mny -= 10;
  } else {
    // 创建卡号
    cardNumber = uuid.v4(); // 申请卡号
    session[cardNumber] = { mny: 100 };// 存钱
    res.setHeader(`Set-Cookie`, `${CARD_ID}=${cardNumber}`);
  }
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end(`当前您的账户上有：${session[cardNumber].mny}`)

}).listen(3000)
```

## session的缺点

登录的时候，有可能服务器重启，丢失了session。所以session一般都保存在redis中。

cookie+session做客户端服务端同构

spa应用，如React、vue，都是使用token jwt。给用户token，用户token正确 就是正确 服务端不存储信息，直接加盐把内容返回去，客户端拿到后使用（秘钥丢失可以伪造用户）