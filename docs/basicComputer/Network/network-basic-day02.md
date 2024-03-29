---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 2. WWW、DNS、IP、TCP/UDP、HTTP/HTTPS、三次握手 
---
## 万维网
www: world wide web(万维网)   
DNS为什么需要解析www呢？    
因为中国用户的习惯，是输入网址之前加入www，其实可以不需要解析 www 的。

## DNS
### 1. DNS定义与解析
1. `DNS`（`Domain Name Server`）域名服务器。  
2. 作用：域名与对应的`IP`转换的服务器。   
3. 特征：
   - `DNS`中保存了一张域名与对应的`IP`地址的表。
   - 一个域名对应一个`IP`地址，一个`IP`地址可以对应多个域名。   
4. `gTLD`：`generic Top-Level DNS Serve`顶级域名服务器。为所有`com`、`net`...后缀做域名解析的服务器。

### 2. DNS解析图解
`DNS`解析流程：
 <img :src="$withBase('/basicComputer/Network/DNS.png')" alt="DNS">    

地址栏输入网址之后，敲回车：（递归搜索，后面有补充） 
1. 向**本地DNS解析器**查询是否存在baidu.com的ip，如果有，取本地缓存。如果没有，则向DNS根服务器查询。
2. DNS本地服务器向**根服务器**发起DNS解析请求，根域名服务器返回顶级域名服务器地址（.com或者.cn或者其他），同时DNS本地服务器会将顶级域名服务器地址缓存起来。
3. 向**com域服务器**发起解析请求。基本上不会找到，因为它仅仅只解析了一部分.com的域名，主要是做管理用的。得到baidu.com二级域名服务器地址。
4. 向**baidu.com域服务器**发起解析请求，这个时候会有两种情况：第一种情况是，DNS本地服务器没有baidu.com的域服务器地址；第二种是存的有baidu.com的域服务器。一般来说，在DNS本地服务器中，只要是.com的，对应的服务器运行商的IP地址都可能有。如果有，本地DNS故武器就会缓存这个IP地址，然后返回给客户端浏览器。

## IP地址

### 1. IP介绍
1. 英文：Internet Protocol Address
2. 中文：互联网协议地址、IP地址
3. 作用：分配给用户上网使用的互联网协议。（通过IP地址可以获取响应的互联网服务）
4. 分类：IPV4 IPV6
5. 形式： 192.168.0.1（长度32位（4个字节）十进制表示）
6. v: version；4或6：版本号
7. IPV6的优势：
   - IPV6地址空间更大（8组（128位），十六进制）
   - 路由表更小
   - 组播支持已经对流支持增强
   - 对自动配置的支持
   - 更高的安全性
   - 例子：ABCD:EF01:2345:6789:ABCD:EF01:2345:6789

### 2. `IP`端口号`PORT`
1. 每一个端口对应的是一个服务器的一个业务，访问一个服务器的不同端口相当于访问不同的业务。   
2. 端口号范围：`0 - 65535`   
3. 默认端口：`http`协议下（`80`）、`https`协议下（`443`）、`FTP`协议下（`20`、`21`）    
4. `node`展示端口不同，服务端不同的业务。   
5. IP:上海市浦东新区   域名：上海迪士尼乐园     端口：乐园海盗船的入口  


## TCP/UDP

### 1. TCP
1. `TCP`（`Transmission Control Protocol`）传输控制协议。  
2. 特点：面向连接（收发数据前，必须建立可靠的连接）。   
3. 建立连接基础：三次握手。   
4. 应用场景：数据必须准确无误的收发   
   - `HTTP`请求
   - `FTP`文件传输
   - 邮件收发

5. 优点：稳定、重传机制、拥塞控制机制、断开连接。
6. 缺点：速度慢、效率低、占用资源、容易被攻击（三次握手-> `DOS`, `DDOS`攻击）
7. `TCP/IP`协议组：提供点对点的连接机制，制定了数据封装、定址、传输、路由、数据接受的标准。

### 2. UDP（喇叭叫人）
1. `UDP`（`User Data Protocol`）用户数据包协议   
2. 特点：无连接（不可靠的协议，无状态传输机制）。无连接信息发送机制。  
3. 应用场景：无需确保通讯质量且要求速度快、无需确保信息完整。   
   - 消息收发
   - 语音通话
   - 直播（QQ）

4. 优点：安全、快速、漏洞少（`UDP flood`攻击）。
5. 缺点：不可靠、不稳定、容易丢包。  
6. 总结：只要目的源地址、端口号、地址、端口号确定，则可以直接发送信息报文，但不能保证一定能收到或收到完整的数据

### 3. TCP与UDP比较
TCP和UDP两者都位于传输层。
 <img :src="$withBase('/basicComputer/Network/TCP.png')" alt="TCP"> 

 1. TCP是面向连接的协议，建立连接3次握手、断开连接四次握手，UDP是面向无连接，数据传输前后不连接，发送端只负责将数据发送到网络，接收端从消息队列读取。
 2. TCP提供可靠的服务，传输过程采用流量控制、编号与确认、计时器等手段确保数据无差错、不丢失。UDP则尽可能传递数据，但不保证传递交付给对方。
 3. TCP面向字节流，将应用层报文看成一串无结构的字节流，分解为多个TCP报文段传输后，在目的站重新装配。UDP协议面向报文，不拆分应用层报文，只保留报文边界，一次发送一个报文，接收方去除报文首部后，原封不动将报文交给上层应用。
 4. TCP只能点对点全双工通信。UDP支持一对一、一对多、多对一和多对多的交互通信。

|<div style="width: 100px;"></div>|TCP|UDP|
|---|:--|:--|
|1.有无连接|面向连接的协议,建立三次握手连接, 四次挥手断开连接|面向无连接,数据传输不需要连接,发送端只负责将数据发送到网络，接收端从消息队列读取|
|2.数据传输有无差错|提供可靠的服务，传输过程采用流量控制、编号与确认、计时器等手段确保数据无差错、不丢失|尽可能传递数据，但不保证传递交付给对方|
|3.传输方式|面向字节流，将应用层报文看成一串无结构的字节流，分解为多个TCP报文段传输后，在目的站重新装配|面向报文，不拆分应用层报文，只保留报文边界，一次发送一个报文，接收方去除报文首部后，原封不动将报文交给上层应用|
|4.通信方式|点对点全双工通信|支持一对一、一对多、多对一和多对多的交互通信|


## HTTP/HTTPS
### 1. HTTP/HTTPS介绍
1. HTTP：Hyper Text Transfer Protocol 超文本传输协议
2. 定义：客户端和服务器请求和应答的标准，用于从WEB服务器传输超文本到本地浏览器的传输协议
3. HTTP请求：按照协议规则先向WEB服务器发送的将文本传输到本地浏览器的请求
4. HTTPS：HyperText Transfer Protocol Secure 超文本传输安全协议
5. 定义：HTTP的安全版（安全基础是SSL/TLS)
6. SSL: Secure Sockets Layer 安全套接层
7. TLS：Transport Layer Security 传输层安全，为网络通信提供安全及数据完整性的一种安全协议，对网络连接进行加密。

### 2. HTTP/HTTPS的区别
1. HTTP是不安全的（监听和中间人攻击等手段。获取网站账户信息和敏感信息），HTTPS可防止被攻击。（什么是中间人攻击？HTTPS如何做到防止攻击？）
2. HTTP协议的传输内容都是明文，直接在TCP连接上运行，客户端和服务器都无法验证对方身份。
3. HTTPS协议的传输内容都被SSL/TLS加密，且运行在SSL/TLS上，SSL/TLS运行在TCP连接上，所以数据传输是安全的。


## 三次握手

### 1. 建立TCP连接的前奏
1. 标志位：数据包
   - `SYN`：`Synchronize Sequence Numbers`同步序列编号
   - `ACK`：`Achnowledgment` 确认字符

2. 状态：  
   - `LISTEN`：侦听`TCP`端口的连接请求（我等着你发送连接请求呢）
   - `SYN-SENT`：在发送连接请求后等待匹配的连接请求（我发送了连接请求，我等你回复哈）
   - `SYN-RECEIVED`：在收到和发送一个连接请求后等待对连接请求的确认（我收到你的连接请求了哈，我等你回复我）
   - `ESTABLISHED`：代表一个打开的连接，数据可以传送给用户（建立连接了哈，我跟你说一下）

### 2. 建立TCP连接图解
 <img :src="$withBase('/basicComputer/Network/three-times-handshake.png')" alt="three-times-handshake"> 

### 3. 建立TCP连接的口述
1. 首先服务器端打开监听，处于Listen的监听状态
2. 客户端向服务器发送SYNJ数据包进行连接请求，并且处于SYN_SEND状态，等待连接。
3. 服务端收到客户端发送的SYNJ数据包，向客户端发送SYNK数据请求包，并且发送ACKJ+1的确认数据包，服务器处于SYN_RECEIVED状态。
4. 客户端接收到服务器发送的确认包ACKJ+1，并且接收到SYNK请求数据包，向服务端发送ACKK+1的数据包，并且处于ESTABLISHED的连接建立状态。
5. 服务端接收ACKK+1的确认包，服务器进入连接已建立状态。

### 4. 建立TCP的三次握手总结
1. 第一次握手：客户端向服务器发送`SYN`标志位（序号是`J`），并进入`SYN_SEND`状态（等待服务器确认状态）。    
2. 第二次握手：服务器收到来自客户端的`SYN J`，服务端会确认该数据包已收到并发送`ACK`标志位（序号是`J+1`）和`SYN`标志位（序号是`K`），服务器进入`SYN_REVD`（请求接受并等待客户端确认状态）。    
3. 第三次握手：客户端进入连接建立状态后，向服务端发送`ACK`标志位（序号是`K+1`）确认客户端已收到建立连接确认，服务端收到`ACK`标志位后，服务端进入连接已建立状态。


## 附录补充
### 1. DNS域名解析过程
浏览器缓存 -> 系统缓存 -> 路由缓存 -> 本地域名服务器 -> 递归搜索
#### 第1步，查找浏览器缓存
浏览器会检查缓存中有没有这个域名对应的解析过的IP地址，如果缓存中有，这个解析过程就将结束。浏览器缓存域名也是有限制的，不仅浏览器缓存大小有限制，而且缓存的时间也有限制，通常情况下为几分钟到几小时不等。这个缓存时间太长和太短都不好，如果缓存时间太长，一旦域名被解析到的IP有变化，会导致被客户端缓存的域名无法解析到变化后的IP地址，以致该域名不能正常解析，这段时间内有可能会有一部分用户无法访问网站。如果时间设置太短，会导致用户每次访问网站都要重新解析一次域名。
#### 第2步，查找系统缓存
如果用户的浏览器缓存中没有，浏览器会查找操作系统缓存中是否有这个域名对应的DNS解析结果。其实操作系统也会有一个域名解析的过程，在Windows中可以通过C:\Windows\System32\drivers\etc\hosts文件来设置，你可以将任何域名解析到任何能够访问的IP地址。如果你在这里指定了一个域名对应的IP地址，那么浏览器会首先使用这个IP地址。例如，我们在测试时可以将一个域名解析到一台测试服务器上，这样不用修改任何代码就能测试到单独服务器上的代码的业务逻辑是否正确。正是因为有这种本地DNS解析的规程，所以黑客就有可能通过修改你的域名解析来把特定的域名解析到它指定的IP地址上，导致这些域名被劫持。
#### 第3步，查找路有缓存
如果系统缓存中也找不到，那么查询请求就会发向路由器，它一般会有自己的DNS缓存。
#### 第4步，查找本地域名服务器
#### 第5步，递归搜索

### 2. DNS有关的网络性能优化
1. 减少DNS查找，避免重定向。浏览器DNS缓存 、计算机DNS缓存、 服务器DNS缓存、使用Keep-Alive特性 来减少DNS查找。
2. DNS的预解析
   - 可以通过用meta信息来告知浏览器, 我这页面要做DNS预解析
   ```html
      <meta http-equiv="x-dns-prefetch-control" content="on" />
   ```
   - 以使用link标签来强制对DNS做预解析:
   ```html
      <link rel="dns-prefetch" href="http://ke.qq.com/" />
   ```

### HTTPS
