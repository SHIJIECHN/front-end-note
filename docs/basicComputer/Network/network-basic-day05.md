---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 5. 浏览器缓存、长短链接、Content-Length、referrer
---

## 浏览器缓存

### 1. 定义
把已请求并返回的`WEB`资源（`HTML`页面、图片、`JS`文件、`CSS`文件、数据等）复制成一个副本存储在浏览器的缓存中。

缓存的好处：
- 1. 减少网络带宽的消耗
- 2. 降低服务器压力
- 3. 减少网络延迟

### 2. Pragma: no-cache
`Pragma`: `no-cache`(响应头)。指示浏览器忽略资源缓存副本，每次访问需要到服务器获取。`http1.0`中字段，`http1.1`用`Cache-Control`替代（`http`协议向下兼容，所以很多网站依旧有这个字段）。    

### 3. Cache-Control
`Cache-Control` 缓存控制（响应头）：
1. `no-cache`：指示浏览器忽略资源缓存副本，强制到服务器获取资源（浏览器依然缓存）。
2. `no-store`：强制缓存在任何情况下都不要保留任何副本。
3. `max-age=31536000`：指示缓存副本的有效时长，从请求时间开始到过期时间的秒数。
4. `public`：表明响应可以被任何对象（包括：发送请求的客户端，代理服务器等等）缓存。
5. `private`：表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。     


### 4. Expires
`Expires： Mon, 15 Aug 2016 03:56:47 GMT`(`Cache-Control`更高)    
启用缓存和定义缓存的时间。告诉浏览器资源缓存过期时间，如果还没有过该时间点则不发请求。     
在`http1.1`开始，使用`Cache-Control:max-age=`秒替代。

### 5. 浏览器缓存的图解
浏览器获取缓存资源流程：
 <img :src="$withBase('/basicComputer/Network/http-cache.png')" alt="http-cache"> 

1. 当浏览器有缓存，查看是否过期，如果没有过期(`Cache-Control:max-age=31536000`)，直接从缓存中读取，并返回`200 OK(from disk cache)`。
2. 如果过期了，将`Etag`和`Last-Modified`数值分别通过`If-None-Match`和`If-Modified-Since`通过请求头发送到服务器。
3. 服务器端通过对`If-None-Match`和`If-Modified-Since`字段进行校验，如果服务器没有修正，就会返回304重定向，浏览器进行读取缓存。
4. 服务端资源如果已经修改，就重新从服务端拉取资源，并返回200。

## Connection: Keep-alive
Connection:Keep-alive(存在请求头中), 只是普通的连接，跟管道化持久化连接并不是相同的东西。

`HTTP` 短连接与长连接：
- 短连接（串行连接）：就是每次请求一个资源就建立连接，请求完成后连接立马关闭。
- 长连接：只建立一次连接，多次资源请求都复用该连接，完成后关闭。


1. 早期`HTTP1.0` 每个`HTTP`请求都要创建一个`TCP/IP`连接，也就是串行连接（短连接）
2. 后期`HTTP1.0` 在请求头中添加`Connection：keep-alive`   
3. `HTTP1.1`默认开启：`Connection：keep-alive`。如需关闭：`Connection：close`。  
注意:Connection:keep-alive在大多数浏览器中默认使用HTTP/1.1。服务器也须由相应的支持才能达到C/S协议进行长连接。

短连接示意图：
<img :src="$withBase('/basicComputer/Network/short-connection.png')" alt="short-connection"> 

长连接示意图：
<img :src="$withBase('/basicComputer/Network/long-connection.png')" alt="long-connection"> 

## Content-Length
用户描述`HTTP`消息实体的传输长度。   
`GET`请求：请求头没有`content-length`，响应头带`content-length`。     
`POST`请求：请求头与响应头都带有`content-length`。


## Referer
`Referer`（`referrer`：来源域名）：`Referer`是`request header`的一部分，当浏览器向`web`服务器发送请求的时候，一般会带上`Referer`，告诉服务器我是从哪个页面链接过来的。   
好处： 可通过`Referer`分析不同渠道的流量分布、用户搜索的关键词。

### 1. 案例一：
不发送`Referer`信息：\<meta name="referrer" content="no-referrer">    
`Referrer Policy: no-referrer`    
无`referrer`字段    

### 2. 案例二：   
只发送`Referer: origin`信息： \<meta name="referrer" content="origin">    
`Referrer Policy: origin`   
`Referer: http://localhost`   

### 3. 案例三：    
发送`Referer`信息：    
`Referrer Policy: no-referrer-when-downgrade`    
仅当协议降级（如`HTTPS`页面引入`HTTP`资源）时发送`Referrer`信息。是大部分浏览器默认策略。

### 4. 应用场景
1. 资源防止盗链：服务器拉取资源之前判断referer是否是自己的域名或者IP,如果不是就拦截,如果是则拉取资源。通过七牛云可以设置referer的黑白域名,只能让允许的域名获取资源,但是也不是100%的能够阻止盗取行为

2. 时间戳防盗链：通过时间戳和签名规则生成密钥,根据密钥和资源一起发给服务器,服务器判断密钥是否过期和密钥是否匹配,如果都通过的话返回资源。任意一项不通过,阻止获取资源。