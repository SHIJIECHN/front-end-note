---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 跨域
---

## iframe
1. 案例一：iframe加载了一个页面，那么iframe就是这个页面的窗口，想获得这个iframe的窗口对象：myiframe.contentWindow。
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
2. 案例二：子孙窗口获取主窗口的值
```html
<!--***********************index.html*******************-->
<body>
    <!--index.html-->
    <iframe src="index2.html" id="myIframe"></iframe>
    <script>
        var myIframe = document.getElementById('myIframe');

        window.name = 'mainWindow';

        myIframe.onload = function() {
            console.log(myIframe.contentWindow.name);
        }
    </script>
</body>
<!--***********************index2.html*******************-->
<body>
    <!--index2.html-->
    <iframe src="index3.html" id="myIframe"></iframe>
    <script>
        window.name = 'iframeWindow';

        var iframe = document.getElementById('myIframe');
        iframe.onload = function() {
            console.log(window.parent.name); // 打印主窗口
        }
    </script>
</body>
<!--***********************index3.html*******************-->
<body>
    <!--index3.html-->
    <script>
        // 获取mainWindow
        console.log(window.parent.parent.name);
    </script>
</body>
```
3. 案例三：   
window.name有共享的特性，也就是说一个窗口只有一个name，只要不改变它不关闭它，这个窗口只有一个name，在这个窗口中，无论怎么跳转都只有一个name。所以在index.html页面设置了window.name，跳转到index2.html页面同样也能输出同样的值。
```html
<!--***********************index.html*******************-->
<body>
    <!--index.html-->
    <script>
        window.name = 'window';
        location.href = 'index2.html'
    </script>
</body>
<!--***********************index2.html*******************-->
<body>
    <!--index2.html-->
    <script>
        console.log(window.name);
    </script>
</body>
```

4. 案例四：如果主页面与iframe窗口的源不同，主页面无法拿到iframe页面的值，并且会报错，也就是受同源策略限制。但是iframe内部页面之间的跳转是不受影响的。主页页面与iframe的子页面受同源策略影响。
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

## 跨域
源http://test2.jsplusplus.com/向源http://test.jsplusplus.com/获取资源。

### 第一种方法：服务器中转请求  
说明：同源策略只针对浏览器（客户端）    
客户端发送请求到同源服务端，同源服务端再发送请求到不同源的服务端。

```html
<body>
    <!--http://test2.jsplusplus.com/index.html-->
    <script>
        $ajax({
            url: 'http://test2.jsplusplus.com/server/getCourse.php',
            type: 'GET',
            success: function(data) {
                console.log(data);
            }
        })
    </script>
</body>
```
中转程序：http://test2.jsplusplus.com/server/getCourse.php，中转程序再请求。
```php
<?php
    $url = 'http://test.jsplusplus.com/server/getCourse.php';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETUENTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    $data = curl_exec($ch);
    curl_close($ch);
    echo $data;
>
```

### 第二种方法：设置基础域名+iframe   
说明：前提是基础域名(document.domain)必须一致   
客服端可以增加iframe引入不同源的页面，两个页面分别设置基础域名同源，也就是document.domain="jsplusplus.com"。通过在两个不同源页面设置相同的基础域名，实现跨域。实际上，iframe窗口被引入，父级页面就可以iframe窗口对象：contentWindow，此时iframe页面也就可以使用$.ajax向服务器发送请求。
```html
<!--http://test2.jsplusplus.com/index.html-->
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

<!--http://test.jsplusplus.com/index.html-->
<body>
    <script src="js/utils.js"></script>
    <script>
        document.domain = 'jsplusplus.com';
    </script>
</body>
```

封装iframe：
```js
var ajaxDomain = (function() {
    function createIframe(frameId, frameUrl) {
        var frame = document.createElement('iframe');
        frame.src = frameUrl;
        frame.id = frameId;
        frame.style.display = 'none';

        return frame;
    }

    return function(opt) {
        document.domain = opt.basicDomain;
        var frame = createIframe(opt.frameId, opt.frameUrl);
        frame.onload = function() {
            var $$ = document.getElementById(opt.frameId).contentWindow.$;
            $$.ajax({
                url: opt.url,
                type: opt.type,
                data: ipt.data,
                success: opt.success,
                error: opt.error
            })
        }
        document.body.appendChild(frame);
    }
})();

ajaxDomain({
    basicDomain: 'jsplusplus.com',
    frameUrl: 'http://test.jsplusplus.com/index.html',
    url: 'http://test.jsplusplus.com/server/getCourses.php',
    type: 'POST',
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

### 第三种方法：`window.name + iframe`   
window.name的特点：   
1. 每个浏览器窗口都有一个全局变量window（包含iframe框架contentWindow）
2. 每个window对象都有一个name属性（注意：一个窗口只有一个name属性）
3. 该窗口被关闭前（生命周期内），所有页面共享一个name属性并有读写的权限
4. 无论该窗口在被关闭前，载入什么页面，都不会改变name的值
5. 存储约为2M的字符串
6. 如果父级窗口地址源和iframe的地址源不同，父级无法通过iframe.contentWindow.name获取值，但iframe内部不受该规则限制

解决方案：先让`iframe`中的页面程序保存`window.name`，然后跳转与父级窗口同源的另一个页面，父级页面可以从当前的iframe拿到该页面的`window.name`
```html
 <!--http://test2.jsplusplus.com/index.html-->
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

<!--http://test.jsplusplus.com/window_name/index2.html-->
<body>
    <script>
        $.post('http://test.jsplusplus.com/get_Courses.php', {
            status: 1
        }, function(data) {
            window.name = JSON.stringify(iframe);
        })
    </script>
</body>
```
当创建了一个iframe的时候，先把iframe引用进去，引进去的iframe进行了ajax请求，把请求过来的数据放到window.name中，优点就是iframe中的窗口无论页面如何跳转都共享一份window.name，而且大家都能获取得到，唯独父级获取不到。设置好后让iframe跳转，跳转到test2同源的页面去，这个页面与父级页面是同源关系，那父级就可以通过程序去获取到iframe当前的window.name。    
给一个标识flag初始值为false，因为iframe只要onload的时候实际上已经加载完了，也就是执行了下面程序
```js
iframe.src = 'http://test.jsplusplus.com/index.html'
```
iframe中的ajax请求已经执行，window.name已经设置好了。父级页面第一次加载的时候flag是false，进入else后修改为true，由于ajax请求需要时间，所以设置了延迟。我们监听了onload事件，每当iframe加载完毕的时候，都会触发onload。延迟时间到了iframe就跳转到父级同源页面，这时iframe又要加载，但是此时父级页面的flag=true了，就会走if分支，此时就可以获得window.name。

### 第四种方法：postMessage+iframe
不常用原因：
1. 伪造数据端漏洞
2. xss攻击
3. 兼容性问题


变量参数：otherWindow.postMessage(message, targetOrigin)   
otherWindow: 接收方的引用   
message：要发送到接受方的数据   
targetOrigin：接收方的源，还有必须要有监听message事件


### 第五种方法：hash+iframe
基本原理：利用url的hash值#xxx来传递数据
基础工具：location.hash

### 第六种方法：CORS跨域
“跨域资源共享”（Cross-origin resource sharing）   
任意域名： header("Access-Control-Allow-Origin: *");
单域名：header("Access-Control-Allow-Origin: http://test2.jsplusplus.com");
多域名：
`$allowed_origin = array('http://test2.jsplusplus.com', 'http://test3.jsplusplus.com');header("Access-Control-Allow-Origin: $allowed_origin");`


通知服务器在真正请求中采用那种HTTP方法：header("Access-Control-Request-Methods: GET, POST");