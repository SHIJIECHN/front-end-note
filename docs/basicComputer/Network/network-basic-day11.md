---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 11. 6中跨域的方式
---

## 跨域前奏知识
iframe中的src引入不同网页资源是不受同源策略的阻止，所以下面的几种iframe跨域方案都是利用这种性质实现的不同源网页跨域的问题。  
同源策略只针对浏览器，服务器端不存在同源策略。

### 1. iframe的使用与特性

#### 获取iframe窗口对象
`iframe`加载了一个页面，那么`iframe`就是这个页面的窗口，想获得这个`iframe`的窗口对象`window`：`myIframe.contentWindow`
```html
<!--***********************index.html*******************-->
<body>
    <iframe src="index2.html" id="myIframe"></iframe>
    <script>
        var myIframe = document.getElementById('myIframe');

        myIframe.onload = function() {
            console.log(myIframe.contentWindow.name); // iframeWindow
        }
    </script>
</body>
<!--***********************index2.html*******************-->
<body>
    <script>
        window.name = 'iframeWindow'
    </script>
</body>
```

#### iframe窗口存在父子关系，子窗口获取父级窗口的window.name属性：window.parent.name
```js
window.parent.name
```

#### 同源页面，父子窗口相互获取name属性
父级页面：parent.html
```js
<iframe src="son.html" id="myIframe"></iframe>
var myIframe = document.getElementById('myIframe');
window.name = 'parent.html';
myIframe.onload = function() {
    console.log(myIframe.contentWindow.name); // son.html
}
```
子级页面：son.html
```js
<iframe src="grandson.html" id="iframe"></iframe>
var iframe = document.getElementById('iframe');
window.name = 'son.html';
iframe.onload = function(){
	console.log(window.parent.name); // parent.html
}
```
孙级页面：grandson.html
```js
console.log(window.parent.parent.name); // parent.html
```

### 2. window.name属性共享性问题
window.name是有共享性，一个窗口只有一个name属性，只要不改变不关闭页面，这个窗口就只有唯一的一个name，无论在这个窗口中如何跳转，跳转之后的窗口都可以访问到name属性；在同一个窗口多个页面是共享的，可以随意读写。

#### 同源页面，window.name共享
父级页面parent.html
```js
window.name = 'parent.html'
location.href = 'son.html'
```
子级页面：son.html
```js
console.log(window.name); // parent.html
```

### 3. iframe被同源策略阻止
如果主页面与`iframe`窗口的源不同，主页面无法拿到`iframe`页面的值，并且会报错，也就是受同源策略限制。但是`iframe`内部页面之间的跳转是不受影响的。主页页面与`iframe`的子页面受同源策略影响
> Uncaught DOMException: Blocked a frame with origin "http://localhost" from accessing a cross - origin frame at HTMLFrameElement.iframe.onload

```html
<body>
    <!--index.html-->
    <iframe src="http://test2.jsplusplus.com/index.html" id="myIframe"></iframe>
    <script>
        var myIframe = document.getElementById('myIframe');
        myIframe.onload = function() {
            console.log(myIframe.contentWindow.name);
            // 跨域 Uncaught DOMException: Blocked a frame with origin "http://127.0.0.1:5500" from accessing a cross-origin frame. at HTMLIFrameElement.myIframe.onload (http://127.0.0.1:5500/index.html:20:48)
        }
    </script>
</body>
```

## 跨域请求的方式
### 1. 服务器中转请求

<img :src="$withBase('/basicComputer/Network/cross-domain01.png')" alt="cross-domain"> 

### 2. 设置基础域名（domain）+iframe
核心思想：通过document.domain获取当前服务器域名，设置当前服务器域名，前提是两个网页的基础域名必须一致，再在主页面中通过iframe窗口获取子页面中的ajax，利用子页面与api同源，发起请求。实际上，`iframe`窗口被引入，父级页面就可以获得`iframe`窗口对象：`contentWindow`，此时`iframe`页面也就可以使用`$.ajax`向服务器发送请求。    
父级页面：index.html (http://test2.jsplusplus.com/index.html)
```html
<body>
    <script>
        document.domain = 'jsplusplus.com'; //document.domain返回当前文档的服务器域名。也可以被设置。

        var iframe = document.createElement('iframe');
        iframe.src = 'http://test.jsplusplus.com/index.html';
        iframe.id = 'myIframe';
        iframe.style.display = 'none';
        iframe.onload = function() {
            var $$ = document.getElementById('myIframe').contentWindow.$;
            $$.post('http://test.jsplusplus.com/server/getCourses.php', {
                status: 1,
                flag: 2
            }, function(data) {
                console.log(data);
            })
        }
        document.body.appendChild(iframe);
    </script>
</body>
```
子级页面：index.html (http://test.jsplusplus.com/index.html)
```html
<body>
    <script src="js/utils.js"></script>
    <script>
        document.domain = 'jsplusplus.com';
    </script>
</body>
```
**封装AJAXDomain跨域函数**    
封装的核心思想：利用上述父级页面的逻辑进行Domain函数的封装。   
不同源客户端浏览器之间需要设置相同的基础域名，这样能够解决iframe不同源之间获取数据被同源策略阻止，而通过引入子窗口中ajax进行同域的请求数据。
<img :src="$withBase('/basicComputer/Network/cross-domain02.png')" alt="cross-domain"> 

```js
var ajaxDomain = (function() {
    // 创建 iframe 元素
    function createIframe(frameId, frameUrl) {
        var frame = document.createElement('iframe');
        frame.src = frameUrl;
        frame.id = frameId;
        frame.style.display = 'none';

        return frame;
    }
    // 实现跨域
    return function(opt) {
        // 设置当前服务器的域名
        document.domain = opt.basicDomain;
        var iframe = createIframe(opt.frameId, opt.frameUrl);
        iframe.onload = function() {
            // 获取与api同源子级页面中的ajax
            var $$ = document.getElementById(opt.frameId).contentWindow.$;
            // // 请求数据
            $$.ajax({
                url: opt.url,
                type: opt.type,
                data: ipt.data,
                success: opt.success,
                error: opt.error
            })
        }
        document.body.appendChild(iframe);
    }
})();

ajaxDomain({
    basicDomain: 'jsplusplus.com',
    frameUrl: 'http://test.jsplusplus.com/index.html',
    url: 'http://test.jsplusplus.com/server/getCourses.php',
    type: 'POST',
    frameId:'iframe',
    date: {
        status: 1
    },
    success: function(data){
        console.log(data);
    },
    error: function(){
        console.log('error');
    }
})
```

### 3. Window.name + iframe方式
核心思想：因为父级与子级窗口不同源，所以父级获取不到子级窗口的window.name属性，于是当子级页面加载完成ajax请求并将数据保存在window.name属性时，将父级页面中iframe子级窗口进行跳转，跳转到与父级页面同源的窗口下，跳转后子级窗口与父级页面同源窗口共享window.name属性。    
先让iframe中的页面程序保存window.name，然后跳转与父级窗口同源的另一个页面，父级页面可以从当前的iframe拿到该页面的window.name。

#### window.name特点
1. 每个浏览器窗口都有一个全局变量`window`（包含`iframe`框架contentWindow）
2. 每个window对象都有一个name属性（注意：一个窗口只有一个name属性）
3. 该窗口被关闭前（生命周期内），所有页面共享一个name属性并有读写的权限
4. 无论该窗口在被关闭前，载入什么页面，都不会改变name的值
5. 存储约为2M的字符串
6. 如果父级窗口地址源和iframe的地址源不同，父级无法通过iframe.contentWindow.name获取值，但iframe内部无论怎么跳转都不受该规则限制,共享window.name属性。

#### 不同源窗口获取数据受到同源策略阻止
> Uncaught DOMException: Blocked a frame with origin "http://test2.jsplusplus.com" from accessing a cross - origin frame.at HTMLFrameElement.myIframe.onload; 

父级页面：index.html（http://test2.jsplusplus.com/index.html）
```html
<body>
    <script>
      var iframe = document.createElement('iframe');
      iframe.src = 'http://test.jsplusplus.com/index.html';
      iframe.onload = function(){
        console.log(iframe.contentWindow.name);
      }
      document.body.appendChild(iframe);
    </script>
</body>
```
子级页面：index.html （http://test.jsplusplus.com/index.html）
```html
<body>
  <script src="js/utils.js"></script>
  <script>
    $.post('http://test.jsplusplus.com/get_courses.php',{
      status:1
    },function(data){
      window.name = JSON.stringify(data);
    })
  </script>
</body>
```

#### 解决方案
父级页面：index.html（http://test2.jsplusplus.com/index.html）
```html
<body>
    <script>
        var flag = false;
        var iframe = document.createElement('iframe');

        var getDatas = function() {
            if (flag) {
                var data = iframe.contentWindow.name;
                console.log(JSON.parse(data));
            } else {
                flag = true;
                setTimeout(function() {
                    iframe.contentWindow.location = 'index2.html'
                }, 500)
            }
        }
        iframe.src = 'http://test.jsplusplus.com/index.html'
        if (iframe.attachEvent) {
            iframe.attachEvent('onload', getDatas);
        } else {
            iframe.onload = getDatas
        }
        document.body.appendChild(iframe);
    </script>
</body>
```
父级同源空页面：index2.html (http://test2.jsplusplus.com/index2.html)
> 父级同源空页面无需任何操作。

子级页面：index.html (http://test.jsplusplus.com/window_name/index2.html)
```html
<body>
    <script>
        $.post('http://test.jsplusplus.com/get_Courses.php', {
            status: 1
        }, function(data) {
            window.name = JSON.stringify(data);
        })
    </script>
</body>
```
当创建了一个`iframe`的时候，先把`iframe`引用进去，引进去的`iframe`进行了`ajax`请求，把请求过来的数据放到`window.name`中，这样做的优点就是`iframe`中的窗口无论页面如何跳转都共享一份`window.name`，而且大家都能获取得到，唯独父级获取不到。设置好后让`iframe`跳转，跳转到`test2`同源的页面去，这个页面与父级页面是同源关系，那父级就可以通过程序去获取到`iframe`当前的`window.name`。    
给一个标识`flag`初始值为`false`，因为`iframe`在`onload`的时候实际上已经加载完了，也就是执行了下面程序
```js
iframe.src = 'http://test.jsplusplus.com/index.html'
```
`iframe`中的`ajax`请求已经执行，`window.name`已经设置好了。父级页面第一次加载的时候`flag`是`false`，进入`else`后修改为`true`，由于`ajax`请求需要时间，所以设置了延迟。我们监听了`onload`事件，每当`iframe`加载完毕的时候，都会触发`onload`。延迟时间到了`iframe`就跳转到父级同源页面，这时`iframe`又要加载，但是此时父级页面的`flag=true`了，就会走`if`分支，此时就可以获得`window.name`。

### 3. postMessage+iframe方式
核心思想：接收方利用postMessage方法和onmessage事件，进行跨域。   
#### 缺点
1. 伪造数据端漏洞
2. xss攻击
3. 兼容性问题


#### 语法：    
变量参数：`otherWindow.postMessage(message, targetOrigin)`   
`otherWindow`: 接收方的引用   
`message`：要发送到接受方的数据   
`targetOrigin`：接收方的源，还有必须要有监听`message`事件

#### 使用
父级(接收方)页面：index.html (http://test2.jsplusplus.com/index.html)
```javascript
<iframe src="http://test2.jsplusplus.com/index.html" id="iframe"></iframe>

window.onmessage = function(e) {
	var e = e || window.event;
	console.log(e.data);
}
```
子级(发送方)页面：index.html (http://test.jsplusplus.com/index.html)
```javascript
$.post('http://test.jsplusplus.com/index.html',{
	status:1
},function(data){
	window.parent.postMessage(
        JSON.stringify(data),
        'http://test2.jsplusplus.com'
    );
})
```

### 4. hash+iframe方式
核心思想：零url的hash值#xxx来传递数据，利用location.hash

#### 使用
父级页面：index.html (http://test2.jsplusplus.com/hash/index.html)
```javascript
<iframe src="http://test2.jsplusplus.com/hash/index.html" id="iframe"></iframe>
var oBtn = document.getElementById('btn');
oBnt.onclick = function(){
	console.log(JSON.parse(decodeURI(location.hash.substring(1))));
}
```
子级页面：index.html (http://test.jsplusplus.com/index.html)
```javascript
<iframe src="http://test2.jsplusplus.com/hash/index2.html"></iframe>
var hash = location.hash.substring(1);
switch(hash){
	case: 'getCourses':
	$.post('http://test.jsplusplus.com/get_courses.php',{
		status:1
	},function(data){
		var str = JSON.stringify(data);
		iframe.src = 'http://test2.jsplusplus.com/hash/index2.html#' + str;
	})
}
```
孙级页面：index.html (http://test2.jsplusplus.com/hash/index2.html)
```javascript
setTimeout(function(){
	window.parent.parent.location.has = self.location.hash.substring(1);
},300);
```

### 6. CORS跨域
“跨域资源共享”（`Cross-origin resource sharing`）：服务器设置HTTP响应头中Access-Control-Allow-Origin值，解除跨域限制。   
1. 任意域名： `header("Access-Control-Allow-Origin: *")`;
2. 单域名：`header("Access-Control-Allow-Origin: http://test2.jsplusplus.com")`;
3. 多域名：
`$allowed_origin = array('http://test2.jsplusplus.com', 'http://test3.jsplusplus.com');header("Access-Control-Allow-Origin: $allowed_origin");`
4. 通知服务器在真正请求中采用哪种`HTTP`方法：`header("Access-Control-Request-Methods: GET, POST")`;

通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别是简单请求和复杂请求。

#### 简单请求
只要同时满足以下两大条件，就属于简单请求
条件1：使用下列方法之一：
- GET
- HEAD
- POST

条件2：Content-Type 的值仅限于下列三者之一：
- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

#### 复杂请求
不符合以上条件的请求就肯定是复杂请求了。 复杂请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求,该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。