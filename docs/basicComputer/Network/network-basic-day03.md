---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 3. HTTP报文、请求方式、GET与POST
---

## HTTP报文
### 1. HTTP报文前言
1. `HTTP`基于`TCP/IP`通信协议来传递数据。    
2. `HTTP`基于客户端/服务端（`C/S`）架构模型（浏览器、服务器）。    
3. 通过一个可靠的连接来交换信息，是一个无状态的请求/响应协议（没有记忆）。 
4. （传统的http请求）限制每次连接只处理一个请求与。服务器处理完客户的请求，并受到客户的应答后，断开连接。采用这种方式节省传输时间。  
5. 只要客户端和服务器知道如何处理的数据内容，任何类型的数据都可以通过http发送。客户端以及服务器指定使用合适的MIME-type内容类型。
6. MIME-type(Multipurpose Internet Mail Extensions type)多用途互联网邮件扩展类型。

### 2. HTTP报文定义
在客户端与服务器之间发送的数据块。这些数据块以一些文本的元信息（meta-information）开头，描述了报文的内容及含义，后面跟着可选的数据部分，这些报文在客户端、服务器和代理之间流动。所以HTTP报文的发送也叫报文流。

1. 每条HTTP报文包含一个客户端请求和服务端响应。
2. 请求报文Request和响应报文Response。


### 3. HTTP报文组成部分
1. 对报文进行描述的起始行
2. 包含属性的首部/头部（header）
3. 包含数据的主体（body）

## 请求方式
### 1. 8种请求方式
1. GET/POST
2. OPTIONS：返回服务器针对特定资源所支持的HTTP请求方法。
3. HEAD：返回与GET请求相一致的响应，响应体被返回。
4. PUT：向指定资源位置上传其最新内容（form表单不支持）。
5. DELETE：请求服务器删除Request-URI标识的资源（form表单不支持）。
6. TRACE：回显服务器收到的请求，主要用于测试或者诊断。
7. CONNECT：连接改为管道方式的代理服务器。

### 2. 常见4种
1. `put`： 上传资源，`form`表单不支持、提交即存储的原则（无验证机制，安全漏洞）、需配置服务器支持`put`方式转发给后端操作。
2. `delete`：删除资源，`form`表单不支持、提交即存储的原则（无验证机制，安全漏洞）、需配置服务器支持`delete`方式转发给后端操作。
3. `post`：修改资源。参数形式Form Data。
4. `get`：获取资源。参数形式Query String Parameters。

## GET/POST请求方式

### 1. GET/POST请求方式的作用
1. `GET`主要用于请求数据。    
2. `GET`的数据在请求体中是查询字符串参数形式（`Query String Parameters`）。    
3. `POST`主要用于传输数据到后端进行增加、删除、更新数据、提交表单。     
4. `POST`的数据在请求体中是表单数据形式（`Form Data`）。    

GET/POST：view source中仍然是url参数键值对形式 a=1&b=2

### 2. `GET/POST`请求方式的区别   
1. `POST`更安全：不会作为`url`的一部分、不会缓存、保存在服务器日志和浏览器记录中
2. `POST`发送的数据量更大（`GET`有`url`长度限制）
   - IE（2083字节） 
   - firefox(65536字符)   
   - chrome(8182字符)   
   - safari(80000字符)   
   - opera(190000字符)
3. `POST`能发送更多的数据类型，`GET`只能发送`ASCII`码字符
4. `POST`比`GET`速度慢：
   - `POST`请求包含更多的请求头
   - `POST`接受数据之前会先将请求头发送给服务器确认，然后发送数据：   
      `POST`过程：
      1. 第三次握手后，浏览器确认并发送`post`请求头
      2. 服务器返回状态码`100`后，`continue`响应
      3. 浏览器开始发送数据
      4. 服务器返回`200`响应  
  
      `GET`过程：
      1. 第三次握手后，浏览器确认并发送请求头和数据。
      2. 服务器返回`200`响应

   - `GET`会进行数据缓存，`POST`不会
    <img :src="$withBase('/basicComputer/Network/get.png')" alt="get"> 

   - `POST`不能进行管道化传输
      1. 串行连接：请求一次就连接一次，等待响应回来，断开连接。下一次请求再次连接。
      2. 持久化连接（`connection：keep-alive`）：（`HTTP/1.0`、`HTTP/1.1`）连接不会关闭。只连接一次，不需要重复连接。
      3. 管道化持久连接（`HTTP/1.1`）把所有请求放到发送队列里，不等响应，一个一个发送请求的同时接受响应的响应。

      串行传输：
      <img :src="$withBase('/basicComputer/Network/serail-connection.png')" alt="serail-connection"> 

      持久化连接：
      <img :src="$withBase('/basicComputer/Network/persistent-connection.png')" alt="persistent-connection"> 

      管道化持久连接：
      <img :src="$withBase('/basicComputer/Network/pipelined-and-lasting-connection.png')" alt="pipelined-and-lasting-connection"> 

## GET/POST请求方式中的幂等性
1. 数学中幂等：x^y = x; x = 0 || 1;

2. 幂等性：一个`HTTP`请求中，不会对数据或状态做修改，并且每次请求都会返回相同的结果。（只要获取数据，就具有幂等性） 
3. 必要性：
   - 1. `GET`请求必须遵守幂等性，从`HTTP`请求上来看，`GET`只能获取数据。
   - 2. `POST`请求一般做增删改的操作，所以一般不遵守幂等性。    


4. 管道化传输不可以用非幂等性请求的原因：  
假设：10个请求，9个成功，1个失败，那么得重新请求，所以就不能做增删改的请求。    
所以：post请求不管是幂等性还是非幂等性的请求都不能进行管道化传输的。oprea浏览器支持管道化传输之外，其他的浏览器需要服务器配置。基本上其他的浏览器都是持久化连接。



