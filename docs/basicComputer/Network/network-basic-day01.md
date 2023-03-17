---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 1. 网络初探、URL、客户端与服务器、域名操作 
---

## 网络初探
 <img :src="$withBase('/basicComputer/Network/web-request-process.png')" alt="web-request-process"> 

### 1. 浏览器请求一个网页的流程
1. 客户端：Client，用户所用的程序（浏览器、应用程序）
2. 服务端：Server，提供数据
3. 输入网址，回车之后，发生了什么？
   - 客户端发起：对网址进行DNS解析，解析成一个IP地址，在进行TCP/IP三次握手，与服务器建立TCP连接，发起HTTP请求；
   - 服务器响应：浏览器得到HTML代码，就会开始请求静态资源（包括img，js...），然后开始渲染页面，渲染完成了，四次挥手，中断连接请求。

## URI
### 1. `URI`：`Uniform Resource Identifier`
   - 即同一资源标识符，用来唯一的标识一个资源。
### 2. `URL`：`Uniform Resource Locator`
   - 统一资源定位符。`URL`可以用来标识一个资源，而且还指明了如何定位这个资源用地址定义一个资源。
   - 用地址定义一个资源。
   - https默认端口号443，http默认端口号80（MySQL默认端口号3306）
### 3. `URN`：`Uniform Resource Name`
   - 统一资源命名。即通过名字来表示资源。
   - 用名称定位一个资源。
   
`URL`肯定是一个`URI`，`URI`并不一定是`URL`，也有可能是`URN`。三者关系如下图：
 <img :src="$withBase('/basicComputer/Network/uri-url-urn.png')" alt="uri-url-urn"> 

### 4. URI、URL、URN三者的区别
`URI`只是资源标识。   
`URL`：
- 1. 资源标识。
- 2. 具有定位资源的功能（资源的具体位置）
- 3. 指明了获取资源所采用的协议
- 4. 协议名称+主机名称+端口号+路径+文件+查询所需字符串。（http://jsplusplus.com:80/Index/index.html?a=1&b=2#d））
     
`URN`: 主机名称+端口号+路径+文件+查询所需字符串。如jsplusplus.com:80/index/index.html?a=1&b=2#d
表示资源的总称就是`URI`，具体定位某个资源的位置就是`URL`，一个资源是什么的时候就是`URN`。  

## 客户端与服务端
客户端：`Client`，客户所使用的电脑中的应用程序。

服务端：`Server`，存放网页、客户端程序、数据处理程序、数据库的电脑。

## 域名（`Domain Name`）
### 1. 域名介绍
1. 相当于访问互联网某一户人家的地址；
2. 域名与服务器绑定以后，域名与服务器对应的`IP`是映射关系；
3. 域名比`IP`方便记忆；
4. `IP`可以对应多个域名，所以不同的域名可以访问一个或多个`WEB`网页；
5. 域名解析：解析就是将域名与服务器ip映射的过程，由DNS服务器来完成域名与IP对应的记录，将域名指向到服务器上；
6. A记录：Address
7. CNAME记录：别名记录，将多个名字映射到另一个域名

### 2. 域名分类
| <div style="width: 200px;">通用类(展示中文域名-万网)  </div>| <div style="width: 200px;">国家地区类</div>|
| :--------:   | :------: |
|  .com: 工商金融等企业 | cn: 中国    .中国|
|.com.cn    .公司|ca: 加拿大|
|.gov: 政府机构  .gov.cn | uk: 英国|
|.net: 提供互联网网络服务机构 |jp: 日本|
|.net.cn    .网络|kr: 韩国|
|.org:各类组织机构 |hk: 中国香港地区|
|.ac: 科研机构    .ac.cn   |tw: 中国台湾地区|
|.edu：教育机构    .edu.cn  | |

### 3. 域名级别
- 顶级域名（一级域名）：jsplusplus.com
- 二级域名：www.jsplusplus.com study.jsplusplus.com
- 三级域名：qianduan.study.jsplusplus.com

### 4. 根域名服务器
#### 根域名服务器介绍
1. 主根服务器：1个  美国
2. 辅根服务器：12个   美国9个    英国瑞典各1个  日本1个
3. 管理机构：国际互联网名称与数字地址分配机构ICANN（美国授权）
   - 作用：负责全球互联网域名根服务器、域名体系和Ip地址的管理。
4. 前管理机构：商务部下属的国家通信与信息管理局（NTIA）外包给ICANN管理

#### 如果美国给中国断网，中国还能上网吗？
1. 网民一般不会去访问根域名服务器，通过DNS域名服务器来查询域名（递归域名服务器：运营商处设立）
2. 根域名服务器实际只记录了1000多个顶级域名信息，常用的非常少
3. DNS域名服务器会缓存根域名服务器的记录
4. 中国有根服务器的镜像（克隆服务器）
结果：国外访问不到部分中国的网站，国内访问国内的网站不受影响




