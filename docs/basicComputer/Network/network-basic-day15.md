---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 15. cookie增删改查、用户追踪
---

## cookie定义
HTTP Cookie（也叫Web Cookie或者浏览器Cookie）是服务器发送到哟用户浏览器并保存在本地的一小块数据，它会在浏览器下一次向同一服务器发起请求时被携带并发送到服务器上。通常，它用于告知服务器两个请求是否来自同一浏览器，如保持用户的登录状态。因为HTTP协议是无状态的，Cookie使基于无状态的HTTP协议记录稳定的状态信息成为了可能。

## cookie的使用场景
1. 会话状态管理（如用户登录状态、购物车、游戏分数或其他需要记录的信息）
2. 个性化设置（如用户自定义设置，主题等）
3. 浏览器行为跟踪（如跟踪分析用户行为等）

## 跟踪用户的技术
1. 根据分析HTTP headers进行分析（referer）
2. 客户端的IP地址跟踪
3. 用户自助登录
4. cookie

## 查看与操作cookie
### 1. 查看cookie
浏览器打开开发者工具，在Application中找到Cookie，查询当前域名下存储的cookie

<img :src="$withBase('/basicComputer/Network/cookie01.png')" alt="cookie"> 

### 2. cookie字段
1. Name：cookie的名称
2. Value：cookie的值
3. Domain：指定cookie在哪个域下可以被接受，如果不指定domain则默认是当前源（origin），但是不包括子域名。如果指定了domain则一般包含子域名（二级域名，三级域名）
4. Path：指定cookie在当前主机下哪些路径可以接收Cookie，一般设置“/”
5. HttpOnly：设置不能通过document.cookie访问cookie，只能后端操作cookie
6. Max-age：cookie的过期事件
7. secure：标记为secure的Cookie只应通过被HTTPS协议吉阿米果的请求发送给服务端。（通过https创建的Cookie只能通过HTTPS请求将Cookie携带到服务器，通过http无法拿到Cookie）
8. sameSite：首先了解什么事跨站请求？比如有A、B两个网站，其中A站请求会产生Cookie，且后续访问请求需携带回Cookie（身份验证），如果B网站通过链接的形式访问A站资源这个就叫做跨站。这种情况访问成功与否根据Cookie设置的sameSite而定。
   - sameSite：None 浏览器在同站请求，跨域请求都会发送Cookie
   - sameSite：Strict浏览器只会在相同站点下发送Cookie
   - sameSite：Lax与Strict类似，不同的是它可以从外站通过链接导航到该站

### 3. 操作Cookie
设置和删除cookie：
```js
var d = new Date(),
    day = d.getDate();


// 设置cookie
d.setDate(day + 10); // 10天以后
document.cookie = 'name=xiaohong;expores='+d; // 设置cookie
document.cookie = 'age=18'; // 多个cookie需要逐条设置
document.cookie = 'name=xiaolan'; //重复设置，会覆盖前面的

// 删除cookie
d.setDate(day -10);
document.cookie = 'name=xiaoxiao'; // 不会设置成功
```

### 4. 封装Cookie的增删改查
链式调用，cookie查询，回调函数做功能扩展。
```js
var manageCookie = {
    // 增
    set: function(key, value, expTime) {
        document.cookie = key + '=' + value + ';max-age=' + expTime;
        return this; // 链式调用
    },
    // 删
    delete: function(key) {
        return this.set(key, '', -1);
    },
    // 查
    get: function(key, cb) {
        var CookiesArray = document.cookie.split(';');

        for (var i = 0; i < CookiesArray.lenght; i++) {
            var CookieItem = CookiesArray[i],
                CookieItemArray = CookieItem.split('=');
            if (CookieItemArray[0] === key) {
                cb(CookieItemArray[1]);
                return this;
            }

        }
        cb(undefined);
        return this;
    }
}

manageCookie.set('name', 'xiaohong', 2000)
    .set('age', 19, 2000)
    .delete('name')
    .get('age', function(data) {
        console.log(data);
    })
```
