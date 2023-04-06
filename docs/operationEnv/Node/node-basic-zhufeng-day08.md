---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  Cookie和Session
---

## 前端存储
localstorage、sessionStorage、cookie、session的区别：

|类型|说明|
|----|:----|
|localstorage|存储到浏览器里，不能跨域，大小5M。如果用户不清空，不会丢失|
|sessionStorage、session会话|会话关闭后，会清空存储。可以使用来记录滚动条的位置，当前页面中需要共享的数据|
|cookie|用来和服务端传输数据（cookie存储大小4K）。不要把数据存到cookie中，可能会导致请求是多发送数据，合理使用cookie（不能存放敏感信息）|


## 设置和获取cookie

客户端第一次访问服务器的时候，服务器通过响应头向客户端发送Cookie，属性之间用分好空格分隔

- 设置cookie：`res.setHeader('Set-cookie', 'name=zf')`
- 获取cookie：`req.headers['cookie']`


cookie可设置的属性值：
- domain：表示只在某个域名下使用cookie，如a.domain.cn表示当前的cookie只能在这个域名下使用，一级域名和二级域名可以共用cookie
- path：表示当前在某个路径下可以读取cookie
- max-age：表示设置cookie的存活时间，以秒为单位。expires也是设置存活时间，是以绝对时间
- httpOnly：为true表示前端不能通过document.cookie改变后端的cookie。但不是绝对安全，前端还是可以通过浏览器开发者工具修改
- secure：当secure值为true时，cookie在HTTP中无效，在HTTPS中才有效


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

- querystring：node内置工具，可以通过querystring.parse()方法解析cookie成对象的形式

```javascript
let querystring = require('querystring');
http.createServer((req, res) => {
  let arr = [];
  res.setCookie = function (key, value, options = {}) {
    let itemArr = [];// ["name=zf",'max-age=100']
    let line = `${key}=${value}`;
    itemArr.push(line);
    if (options.maxAge) { // 如果设置了maxAge
      itemArr.push(`max-age=${options.maxAge}`);
    }
    if (options.domain) { // 如果设置了domain
      itemArr.push(`domain=${options.domain}`);
    }
    if (options.httpOnly) { // 如果设置了httpOnly
      itemArr.push(`httpOnly=${options.httpOnly}`);
    }

    arr.push(itemArr.join('; '));// 使用join拼接数组后在push。arr为['name=zf; max-age=100','age=10']
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

- crypto：具有加密功能。通过crypto生成签名。
  - crypto.createHmac('sha256', secret)：创建给定的算法sha256和key的Hmac对象。
  - hmac.update(value)：使用给定的value更新Hmac内容。
  - hmac.digest('base64')：计算使用hmac.update()传入的所有数据的HMAC摘要。返回值的编码是base64.
- cookie验证：服务器获取到客户端带的cookie后，将值使用原来加密的方式获得新的签名，比较签名是否和原来的相等，如果相等就说明，cookie没有被篡改。

```javascript {10-19,36-49, 53,56,57}
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

访问路由/visit，cookie中设置字段visit记录客户端的访问次数

```javascript {65-74}
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
  if (req.url === '/visit') { // 访问记录
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

## cookie使用注意事项

- 可能被客户端篡改，使用前验证合法性
- 不要存储敏感数据，比如用户密码，账户余额
- 使用httpOnly保证安全
- 尽量减少cookie的体积
- 设置正确的domain和path，减少数据传输

## session

session是基于cookie的。

session的实现：
1. 在服务端生成全局唯一标识符connect.sid
2. 在服务器内存里开辟次connect.sid对一个的数据存储空间
3. 将connect.sid作为全局唯一标识符通过cookie发送给客户端
4. 以后客户端再次访问服务器时会把connect.sid通过请求头中的cookie发送给服务器
5. 服务器在通过connect.sid把此标识符在服务器端的数据取出

- uuid：第三方模块。让所有元素都能有唯一标识。
- session以对象的形式存储信息

```javascript
let http = require('http');
let querystring = require('querystring');
let uuid = require('uuid');// 第三方模块

let session = {};// 用来存储客户端和服务端的数据，key为卡号，value就是卡号对应的数据对象
const CARD_ID = 'connect.sid'; // 以connect.sid为key

http.createServer((req, res) => {
  // 当客户端访问服务端时，需要获取当前用户是否来过
  if (req.url === '/favicon.ico') return res.end(); // 屏蔽
  // 1. 取出cookie，cookie是以"; "分隔
  let cookies = querystring.parse(req.headers.cookie, '; ') || {}
  let cardNumber = cookies[CARD_ID];// 2. 取到对应的卡号
  // 3. 如果有卡号的，也就是有ID的，老顾客
  if (cardNumber && session[cardNumber]) {
    session[cardNumber].mny -= 10; // 获取此卡号对应的信息，然后操作
  } else {
    // 4. 如果是新客户，创建卡号
    cardNumber = uuid.v4(); // 申请卡号
    session[cardNumber] = { mny: 100 };// 存钱
    res.setHeader(`Set-Cookie`, `${CARD_ID}=${cardNumber}`);// 将卡号发给客户
  }
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end(`当前您的账户上有：${session[cardNumber].mny}`)

}).listen(3000)
```

session的缺点：登录的时候，有可能服务器重启，丢失了session。所以session一般都保存在redis中。

cookie+session做客户端服务端同构。

spa应用，如React、vue，都是使用token jwt。给用户token，用户token正确 就是正确 服务端不存储信息，直接加盐把内容返回去，客户端拿到后使用（秘钥丢失可以伪造用户）