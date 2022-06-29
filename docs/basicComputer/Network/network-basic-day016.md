---
autoGroup-1: 网络基础
sidebarDepth: 3
title: JSONP跨域
---

## JSONP
JSONP（JSON with Padding）: 跨域获取JSON数据的一种非官方的使用模式  

1. JSON和JSONP不是一个类型
2. JSON树数据交换格式，JSONP是一种跨域获取JSON数据的交互技术
3. JSONP获取的资源并不是直接是JSON数据，而是带有JSON数据参数的函数执行     

客户端期望返回：{"name": "Jacky", "age":18}   
JSONP实际返回：callback({"name": "Jacky", "age":18})    

1. 案例一
```html
<!--http://test2.jsplusplus.com/index.html-->
<body>
    <script src="/textjavascript">
        function test(str) {
            console.log(str);
        }
    </script>
    <!--引用不同源的资源-->
    <script src="http://test.jsplusplus.com/jsonp/jsonp.js"></script> 
</body>
```
请求数据
```js
// http://test.jsplusplus.com/jsonp/jsonp.js
var $ = (function() {
    // 封装的ajax
})();

$.ajax({
    url: 'http://test.jsplusplus.com/server/getCourses.php',
    type: 'POST',
    data: {
        status: 1
    },
    success: function(data) {
        test(data); // 在这里调用test函数
    }
})
```

2. 案例二：     
script标签不管文件是什么，只会把返回的内容当做脚本来执行。如果返回的内容执行有错误，也只会按照正常执行的错误输出。
```html
<body>
    <!--http://test2.jsplusplus.com/index.html-->
    <script src="/textjavascript">
        function test(str) {
            console.log(str);
        }
    </script>
    <!--当有多个数据时，就需要多个script标签-->
    <script src="http://test.jsplusplus.com/jsonp/jsonp.php?cb=test"></script>
</body>
```
后端jsonp.php文件
```php
// [http://](http://test.jsplusplus.com/jsonp/jsonp.php)
<?php
    $cb = $_GET['cb'];
    echo $cb.'("JS++")';
```
可以在控制台中输出：JS++。

3. 案例三
```html
<!--http://test2.jsplusplus.com/index.html-->
<body>
    <button id="btn">获取资源</button>
    <script src="/textjavascript">
        var oBtn = document.getElementById('btn');

        oBtn.onclick = function(){
            oScript = document.createElement('script');
            oScript.src = 'http://test.jsplusplus.com/jsonp/jsonp.php?cb=test';
            document.body.appendChild(oScript);
            document.body.removeChild(oScript); // 不需要延迟删除，因为appendChild只是让脚本执行，在src的时候已经响应了
        }

        function test(data) {
            console.log(data);
        }
    </script>
</body>
```
后端jsonp.php文件
```php
// [http://](http://test.jsplusplus.com/jsonp/jsonp.php)
<?php
    $cb = $_GET['cb'];
    echo $cb.'("JS++")';
```
可以在控制台中输出：JS++。

JSONP跨域百度搜索关键字

4. 案例四     
jQuery是如何使用JSONP实现跨域的？
```html
<!--http://test2.jsplusplus.com/index.html-->
<body>
    <button id="btn">获取资源</button>
    <script src="https://lib.baomitu.com/jquery/3.6.0/jquery.min.js"></script>
    <script src="/textjavascript">
        var oBtn = document.getElementById('btn');

        oBtn.onclick = function() {
            $.ajax({
                url: 'http://test.jsplusplus.com/jsonp/jsonp.php',
                type: 'GET', // jsonp不支持post请求
                dataType: 'JSONP',
                jsonp: 'cb',
                jsonpCallback: 'test', // 不写，则会设置默认值
                success: function(data) {
                    console.log(data);
                }
            })
        }

        function text(data) {
            console.log(data);
        }
    </script>
</body>
```

封装Ajax增加JSONP功能：
```js
var xhr = (function() {

    function _doAjax(opt) {
        var o = window.XMLHttpRequest ?
            new XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');
        var t = null; // 设置超时

        if (!o) {
            throw new Error('您的浏览器不支持异步发起HTTP请求')
        }

        var opt = opt || {},
            type = (opt.type || 'GET').toUpperCase(),
            async = '' + opt.async === 'false' ? false : true,
            dataType = opt.dataType || 'JSON',
            jsonp = opt.jsonp || 'cb',
            jsonpCallback = opt.jsonpCallback || 'jQuery' + randomNum() + '_' + new Date().getTime(),
            url = opt.url,
            data = opt.data || null,
            timeout = opt.timeout || 30000,
            error = opt.error || function() {},
            success = opt.success || function() {},
            complete = opt.complete || function() {}

        if (!url) {
            throw new Error('您没有填写url')
        }

        if (dataType.toUpperCase() === 'JSONP' && type !== 'GET') {
            throw new Error('如果dataType为JSONP，请您将type设置为GET');
        }

        if (dataType.toUpperCase() === 'JSONP') {
            var oScript = document.createElement('script');
            // 有问号？，说明url后有其他参数，则使用&，将jsonp拼接到url后。
            oScript.src = url.indexOf('?') === -1 ?
                url + '?' + jsonp + '=' + jsonpCallback :
                url + '&' + jsonp + '=' + jsonpCallback;

            document.body.appendChild(oScript);
            document.body.removeChild(oScript);

            //****************重点********************
            window[jsonpCallback] = function(data) {
                success(data);
            }
            return;
        }

        o.onreadystatechange = function() {
            if (o.readyState === 4) {
                if ((o.status >= 200 && o.status < 300) || o.status === 304) {
                    switch (dataType.toUpperCase()) {
                        case 'JSON':
                            success(JSON.parse(o.responseText));
                            break;
                        case 'TEXT':
                            success(o.responseText);
                            break;
                        case 'XML':
                            success(o.responseXML);
                            break;
                        default:
                            success(JSON.parse(o.responseText));
                    }
                } else {
                    error();
                }
                complete();
                clearTimeout(t);
                t = null;
                o = null;
            }
        }

        o.open(type, url, async);
        type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        o.send(type === 'GET' ? null : formatDatas(data));
        t = setTimeout(function() {
            o.abort();
            clearTimeout(t);
            t = null;
            o = null;
            complete();
            throw new Error('请求超时')
        }, timeout);
    }

    function formatDatas(obj) {
        var str = '';
        for (var key in obj) {
            str += key + '=' + obj[key] + '&';
        }
        return str.replace(/&$/, '');
    }

    // 随机数生成
    function randomNum() {
        var num = '';
        for (var i = 0; i < 20; i++) {
            num += Math.floor(Math.random() * 10)
        }
        return num;
    }

    return {
        ajax: function(opt) {
            _doAjax(opt);
        },
        post: function(url, data, dataType, successCB, errorCB, completeCB) {
            _doAjax({
                type: 'POST',
                url: url,
                data: data,
                dataType: dataType,
                success: csuccessCB,
                error: errorCB,
                complete: completeCB
            });
        },

        get: function(url, dataType, successCB, errorCB, completeCB) {
            _doAjax({
                type: 'GET',
                url: url,
                dataType: dataType,
                success: csuccessCB,
                error: errorCB,
                complete: completeCB
            })
        }
    }
}())
```