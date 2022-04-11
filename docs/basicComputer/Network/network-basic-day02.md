---
autoGroup-1: 网络基础
sidebarDepth: 3
title: HTTP报文 
---

## HTTP报文
`HTTP`基于`TCP/IP`通信协议来传递数据。    
`HTTP`基于客户端/服务端（`C/S`）架构模型（浏览器、服务器）。    
通过一个可靠的连接来交换信息，是一个无状态的请求/响应协议（没有记忆）。   


## 请求方式：    
1. `put`： 上传资源，`form`表单不支持、提交即存储的原则（无验证机制，安全漏洞）、需配置服务器支持`put`方式转发给后端操作。
2. `delete`：删除资源，`form`表单不支持、提交即存储的原则（无验证机制，安全漏洞）、需配置服务器支持`delete`方式转发给后端操作。
3. `post`：修改资源。
4. `get`：获取资源。


`GET`主要用于请求数据。    
`GET`的数据在请求体中是查询字符串参数形式（`Query String Parameters`）。    
`POST`主要用于传输数据到后端进行增加、删除、更新数据、提交表单。     
`POST`的数据在请求体中是表单数据形式（`Form Data`）。    


`GET/POST`区别：   
1. `POST`更安全：不会作为`url`的一部分、不会缓存、保存在服务器日志和浏览器记录中
2. `POST`发送的数据量更大（`GET`有`url`长度限制）
3. `POST`能发送更多的数据类型，`GET`只能发送`ASCII`码字符
4. `POST`比`GET`速度慢：
   1. `POST`接受数据之前会先将请求头发送给服务器确认，然后发送数据：   
      `POST`过程：
      1. 第三次握手后，浏览器确认并发送`post`请求头
      2. 服务器返回状态码`100`后，`continue`响应
      3. 浏览器开始发送数据
      4. 服务器返回`200`响应  
  
        `GET`过程：
      1. 第三次握手后，浏览器确认并发送请求头和数据。
      2. 服务器返回`200`响应
   2. `GET`会进行数据缓存，`POST`不会
   3. `POST`不能进行管道化传输
      1. 串行传输：请求一次就连接一次，等待响应回来，断开连接。下一次请求再次连接。
      2. 持久化连接（`connection：keep-alive`）：（`HTTP/1.0`、`HTTP/1.1`）连接不会关闭。只连接一次，不需要重复连接。
      3. 管道化持久连接（`HTTP/1.1`）把所有请求放到发送队列里，不等响应，一个一个发送请求的同时接受响应的响应。



幂等性：一个`HTTP`请求中，不会对数据或状态做修改，并且每次请求都会返回相同的结果。   
必要性：
- 1. `GET`请求必须遵守幂等性，从`HTTP`请求上来看，`GET`只能获取数据。
- 2. `POST`请求一般做增删改的操作，所以一般不遵守幂等性。    


管道化传输不可以用非幂等性请求的原因：  
假设一个管道中由10个请求，发送了9个，但是连接关闭了，即使收到了9个响应，这9个响应内容也将被清空，那么客户端将会重新发起这9个请求，但是9个响应收到就证明服务器已经做了响应的操作，如果是非幂等的请求，则会出现操作的错误（如支付、增删改数据等），所以管道化传输不支持非幂等的请求，POST是幂等或非幂等的，管道化传输都不支持。

## 状态码
1. `1xx`：信息，服务器收到请求，需要请求者继续执行操作。 
2. `2xx`：成功，操作被成功接收并处理。
3. `3xx`：重定向，需要进一步的操作以完成操作。
4. `4xx`：客户端错误，请求包含语法错误或无法完成请求。
5. `5xx`：服务器错误，服务器在处理的过程中发生错误。



`304`重定向：   
`Etag`：服务端资源唯一标识（优先级高于`Last Modified`）（与请求头中的`If-None-Match`相同）
`Last Modified`：资源在服务器最后修改的时间（精确到秒），所以需要唯一标识符。（与请求头中的`If-Modified-Match`相同）
   1. 第一次访问`index.html`(响应头) - `200 OK`
        服务端向客户端返回的响应头中有`Etag`和`Last-Modified`，告诉客户端这个资源的唯一标识和最后修改时间。
   2. 第二次访问`index.html`(请求头）- `304 Not Modified`。
        客户端请求头会把`If-None-Match`和`If-Modified-Match`发送给服务端，服务端拿这两个标识的值进行对比。如果之前有过则直接到缓存中获取。
   3. 修改`index.html`第三次访问（响应头）- `200 OK`


`302`重定向：服务端程序重定向（跳转`demo.html`) 返回`302 Found`


`403` 服务器拒绝请求`forbidden`：服务器关闭、没有权限

`500 Internal Server Error` 服务器发生不可预测的错误

`503 Server Unavailable` 服务器当前不能处理客户端请求（关闭应用程序池、程序标识出错或者程序池队列已满）

## 浏览器缓存
把已请求并返回的`WEB`资源（`HTML`页面、图片、`JS`文件、`CSS`文件、数据等）复制成一个副本存储在浏览器的缓存中。

缓存的好处：
- 1. 减少网络带宽的消耗
- 2. 降低服务器压力
- 3. 减少网络延迟

`Pragma`: `no-cache`(响应头)。指示浏览器忽略资源缓存副本，每次访问需要到服务器获取。`http1.0`中字段，`http1.1`用`Cache-Control`替代（`http`协议向下兼容，所以很多网站依旧有这个字段）。    


`Cache-Control` 缓存控制（响应头）：
- `no-cache`：指示浏览器忽略资源缓存副本，强制到服务器获取资源（浏览器依然缓存）。
- `no-store`：强制缓存在任何情况下都不要保留任何副本。
- `max-age=31536000`：指示缓存副本的有效时长，从请求事件开始到过期事件的秒数。
- `public`：表明响应可以被任何对象（包括：发送请求的客户端，代理服务器等等）缓存。
- `private`：表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。     


`Expires： Mon, 15 Aug 2016 03:56:47 GMT`(`Cache-Control`更高)    
启用缓存和定义缓存的时间。告诉浏览器资源缓存过期时间，如果还没有过该事件点则不发请求。     
在`http1.1`开始，使用`Cache-Control:max-age=`秒替代。

浏览器获取缓存资源流程：
 <img :src="$withBase('/basicComputer/Network/http-cache.png')" alt="http-cache"> 

当浏览器有缓存，查看是否过期，如果没有过期(`Cache-Control:max-age=31536000`)，直接从缓存中读取，并返回`200 OK(from disk cache)`。如果过期了，将`Etag`和`Last-Modified`数值分别通过`If-None-Match`和`If-Modified-Since`通过请求头发送到服务器，有两种可能，一种是服务端的文件没有修改过，那么就会返回304重定向，到缓存中获取。另一种是服务端资源已经修改过来，就返回200，重新从服务端拉取资源。

## Accept & Content-type
`Accept`（请求头）客户端希望或支持返回的数据类型。   
`Content-type`（响应头）：`text/html;charset=UTF-8`；(`Accept-Charset`)返回的资源类型与编码。 

`Accept-Language`：浏览器支持的语言。   
`Content-Language`：说明返回资源的语言类型。   

`Accept-Encoding: gzip,deflate,br`。 浏览器可以接受的资源编码格式（压缩格式）。   
`Content-Encoding: gzip`。服务器返回的资源格式（压缩格式，优化传输内容的大小）。

## Connection: Keep-alive
`HTTP` 短连接与长连接：
- 短连接：就是每次请求一个资源就建立连接，请求完成后连接立马关闭。
- 长连接：只建立一次连接，多次资源请求都复用该连接，完成后关闭。


1. 早起`HTTP1.0` 每个`HTTP`请求都要创建一个`TCP/IP`连接，也就是串行连接（短连接）
2. 后期`HTTP1.0` 在请求头中添加`Connection：keep-alive`   
3. `HTTP1.1`默认开启：`Connection：keep-alive`。如需关闭：`Connection：close`。  

## Content-Length
用户描述`HTTP`消息实体的传输长度。   
`GET`请求：请求头没有`content-length`，响应头带`content-length`。     
`POST`请求：请求头与响应头都带有`content-length`。


## Referer
`Referer`（`referrer`：来源域名）：`Referer`是`request header`的一部分，当浏览器向`web`服务器发送请求的时候，一般会带上`Referer`，告诉服务器我是从哪个页面链接过来的。   
好处： 可通过`Referer`分析不同渠道的流量分布、用户搜索的关键词。   
案例一：
不发送`Referer`信息：\<meta name="referrer" content="no-referrer">    
`Referrer Policy: no-referrer`    
无`referrer`字段    

案例二：   
只发送`Referer: origin`信息： \<meta name="referrer" content="origin">    
`Referrer Policy: origin`   
`Referer: http://localhost`   

案例三：    
发送`Referer`信息：    
`Referrer Policy: no-referrer-when-downgrade`    
仅当协议降级（如`HTTPS`页面引入`HTTP`资源）时发送`Referrer`信息。是大部分浏览器默认策略。 
应用：资源防止盗链
