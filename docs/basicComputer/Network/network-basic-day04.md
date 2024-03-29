---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 4. HTTP状态码、Accept、Content-Type
---

## HTTP常用状态码
1. `1xx`：信息，服务器收到请求，需要请求者继续执行操作。 
2. `2xx`：成功，操作被成功接收并处理。
3. `3xx`：重定向，需要进一步的操作以完成操作。
4. `4xx`：客户端错误，请求包含语法错误或无法完成请求。
5. `5xx`：服务器错误，服务器在处理的过程中发生错误。

## 常见的重要状态码
### 1. 304 重定向   
1. `Etag`：服务端资源唯一标识（优先级高于`Last Modified`，即同时设置ETag和`Last Modified`，会优先校验ETag）（与请求头中的`If-None-Match`相同）
2. `Last Modified`：资源在服务器最后修改的时间（精确到秒），如果短时间内资源发生了改变，Last-Modified 并不会发生变化，所以需要唯一标识符。（与请求头中的`If-Modified-Match`相同）
3. `If-Modified-Match`：上一次服务器端返回来的Last-modified值。
   - 是标准的HTTP请求头标签，在发送HTTP请求时，把浏览器缓存页面的最后修改时间一起发送到服务器去，服务器会把这个时间与服务器上实际文件的最后修改时间进行比较。
   - 如果时间一致，那么返回HTTP状态码304（不返回文件内容），客户端接到之后，就直接把本地缓存文件显示到浏览器上。
   - 如果时间不一致，就返回HTTP状态码200和新的文件内容，客户端接到之后，会丢弃旧文件，把新文件缓存起来，并显示到浏览器中。
4. `If-None-Match`：上一次服务端返回来的html资源在服务器上的唯一标识。
   - 用于指定`If-None-Match`字段值的实体标记（`ETag`）值与请求资源的`ETag`不一致时，它就告知服务器处理该请求。

流程图：
<img :src="$withBase('/basicComputer/Network/304.png')" alt="304"> 

 1. 第一次访问`index.html`(响应头) - `200 OK`
      服务端向客户端返回的响应头中有`Etag`和`Last-Modified`，告诉客户端这个资源的唯一标识和最后修改时间。
 2. 第二次访问`index.html`(请求头）- `304 Not Modified`。
      客户端请求头会把`If-None-Match`和`If-Modified-Match`发送给服务端，服务端拿这两个标识的值进行对比。如果之前有过则直接到缓存中获取。
 3. 修改`index.html`第三次访问（响应头）- `200 OK`

### 2. 302 重定向
服务端程序重定向（跳转`demo.html`) 返回`302 Found`

### 3. 404 页面错误
访问页面不存在。

### 4. 403 服务器拒绝请求`forbidden`
服务器关闭、没有权限

### 5. 500 `Internal Server Error` 
服务器发生不可预测的错误

### 6. 503 `Server Unavailable` 
服务器当前不能处理客户端请求（关闭应用程序池、程序标识出错或者程序池队列已满）


## Accept
1. Accept定义：存在（请求头）中，代表客户端希望接收的数据类型。
2. q：相对品质因子，权重，它是从0-1的范围指定有限的顺序，没有指定，质量值默认为“q=1”，如果赋值为0，则提醒服务器该类型不被浏览器接受。
3. 相对品质因子格式：type;q=value,type;q=value
4. 下面的写法代表:浏览器最希望接收的是text/html，appliction/xhtml+xml，其次是application/xml，再其次是任意数据类型。   
Accept(请求头): text/html,application/xhtm + xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8

## Accept-Language
1. Accept-Language定义：存在请求头中，代表浏览器支持的语言。
2. 下面的写法代表: 浏览器支持的语法是简体中文,其次是美国英语,再其次是其他形式的英语。    
Accept-Language: zh-CN,en-US;q=0.8,en;q=0.6

## Accept-Encoding
1. Accept-Encoding定义：存在（请求头）中，代表浏览器可以接收资源编码格式（压缩格式）
2. Accept-Encoding: gzip,defalte,br

## Content-Type
1. Content-Type定义：存在（响应头）中，代表返回资源的类型与编码
2. Content-Type：text/html;charset=UTF-8

## Content-Language
1. Content-Language: 存在(响应头)中,代表返回的资源语言类型
2. Content-Language: zh-CN

## Content-Encoding
1.  Content-Encoding: 存在(响应头)中,表示返回的资源的编码格式(压缩格式,优化传输内容的大小)
2.   Content-Encoding:gzip


## 附件：HTTP状态码大全
### 1. 临时响应
**1xx：表示临时响应并需要请求者继续执行操作的状态码。**
- 100(继续)请求者应当继续提出请求。服务器返回此代码表示已收到请求的第一部分，正在等待其余部分。
- 101(切换协议)请求者已要求服务器切换协议，服务器已确认并准备切换。只有在切换新的协议更有好处的时候才应该采取类似措施。
- 102 Processing由WebDAV（RFC 2518）扩展的状态码，代表处理将被继续执行。

### 2. 成功
**2xx：表示成功处理了请求的状态码。**
- 200(成功)服务器已成功处理了请求。通常，这表示服务器提供了请求的网页。如果是对您的robots.txt 文件显示此状态码，则表示 Googlebot 已成功检索到该文件
- 201(已创建)请求成功并且服务器创建了新的资源。
- 202(已接受)服务器已接受请求，但尚未处理。
- 203(非授权信息)服务器已成功处理了请求，但返回的信息可能来自另一来源。
- 204(无内容)服务器成功处理了请求，但没有返回任何内容。
- 205(重置内容)服务器成功处理了请求，但没有返回任何内容。与 204 响应不同，此响应要求请求者重置文档视图(例如，清除表单内容以输入新内容)。
- 206(部分内容)服务器成功处理了部分 GET 请求。

### 3. 重定向
**3xx：要完成请求，需要进一步操作。通常，这些状态码用来重定向。Google 建议您在每次请求中使用重定向不要超过5 次。您可以使用网站管理员工具查看一下Googlebot 在抓取重定向网页时是否遇到问题。诊断下的网络抓取页列出了由于重定向错误导致 Googlebot 无法抓取的网址。**
- 300(多种选择)针对请求，服务器可执行多种操作。服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择。
- 301(永久移动)请求的网页已永久移动到新位置。服务器返回此响应(对 GET 或 HEAD 请求的响应)时，会自动将请求者转到新位置。您应使用此代码告诉某个网页或网站已永久移动到新位置。
- 302 Found (临时移动)表示目标资源移动到了另一个URI上.由于重定向是临时发生的,所以客户端再之后的请求中还应该使用原本的URI。服务器会再响应Header的Location字段中放上这个不同的URI.浏览器可以使用Location中的URI进行自动重定向。注意：由于历史原因，用户代理可能会在重定向的请求中把POST方法改为GET方法。如果不想这样，应该使用307状态码。
- 303 See Ohter (查看其他位置)请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。对于除 HEAD 之外的所有请求，服务器会自动转到其他位置。
- 304(未修改)自从上次请求后，请求的网页未修改过。服务器返回此响应时，不会返回网页内容。如果网页自请求者上次请求后再也没有更改过，您应将服务器配置为返回此响应(称为 If-Modified-Since HTTP 标头)。服务器可以告诉 Googlebot 自从上次抓取后网页没有变更，进而节省带宽和开销。
- 305(使用代理)请求者只能使用代理访问请求的网页。如果服务器返回此响应，还表示请求者应使用代理。
- 307 Temporary Redirect(临时重定向)与302一直，区别在于，307状态码不允许浏览器将原来的POST请求重定向到GET请求上。

::: theorem 302、303与307的区别
- 302 允许各种各样的重定向，一般情况下都会实现为到 GET 的重定向，但是不能确保 POST 会重定向为 POST
- 303 只允许任意请求到 GET 的重定向
- 307 和 302 一样，除了不允许 POST 到 GET 的重定向
::: 

### 4. 请求错误
**4xx：这些状态码表示请求可能出错，妨碍了服务器的处理。**
- 400(错误请求)服务器不理解请求的语法。
- 401(未授权)请求要求身份验证。对于登录后请求的网页，服务器可能返回此响应。
- 403(禁止)服务器拒绝请求。如果您在 Googlebot 尝试抓取您网站上的有效网页时看到此状态码(您可以在 Google 网站管理员工具诊断下的网络抓取页面上看到此信息)，可能是您的服务器或主机拒绝了 Googlebot 访问。
- 404(未找到)服务器找不到请求的网页。例如，对于服务器上不存在的网页经常会返回此代码。如果您的网站上没有 robots.txt 文件，而您在 Google 网站管理员工具"诊断"标签的 robots.txt 页上看到此状态码，则这是正确的状态码。但是，如果您有 robots.txt 文件而又看到此状态码，则说明您的 robots.txt 文件可能命名错误或位于错误的位置(该文件应当位于顶级域，名为 robots.txt)。如果对于 Googlebot 抓取的网址看到此状态码(在"诊断"标签的 HTTP 错误页面上)，则表示 Googlebot 跟随的可能是另一个页面的无效链接(是旧链接或输入有误的链接)。
- 405(方法禁用)禁用请求中指定的方法。
- 406(不接受)无法使用请求的内容特性响应请求的网页。
- 407(需要代理授权)此状态码与 401(未授权)类似，但指定请求者应当授权使用代理。如果服务器返回此响应，还表示请求者应当使用代理。
- 408(请求超时)服务器等候请求时发生超时。
- 409(冲突)服务器在完成请求时发生冲突。服务器必须在响应中包含有关冲突的信息。服务器在响应与前一个请求相冲突的 PUT 请求时可能会返回此代码，以及两个请求的差异列表。
- 410(已删除)如果请求的资源已永久删除，服务器就会返回此响应。该代码与 404(未找到)代码类似，但在资源以前存在而现在不存在的情况下，有时会用来替代404代码。如果资源已永久移动，您应使用301 指定资源的新位置。
- 411(需要有效长度)服务器不接受不含有效内容长度标头字段的请求。
- 412(未满足前提条件)服务器未满足请求者在请求中设置的其中一个前提条件。
- 413(请求实体过大)服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。
- 414(请求的 URI 过长)请求的 URI(通常为网址)过长，服务器无法处理。
- 415(不支持的媒体类型)请求的格式不受请求页面的支持。
- 416(请求范围不符合要求)如果页面无法提供请求的范围，则服务器会返回此状态码。
- 417(未满足期望值)服务器未满足"期望"请求标头字段的要求。

### 5. 服务器错误
**5xx：这些状态码表示服务器在处理请求时发生内部错误。这些错误可能是服务器本身的错误，而不是请求出错。**
- 500(服务器内部错误)服务器遇到错误，无法完成请求。
- 501(尚未实施)服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码。
- 502(错误网关)服务器作为网关或代理，从上游服务器收到无效响应。
- 503(服务不可用)服务器目前无法使用(由于超载或停机维护)。通常，这只是暂时状态。
- 504(网关超时)服务器作为网关或代理，但是没有及时从上游服务器收到请求。
- 505(HTTP 版本不受支持)服务器不支持请求中所用的 HTTP 协议版本。


