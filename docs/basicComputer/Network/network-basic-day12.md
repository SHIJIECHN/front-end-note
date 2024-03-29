---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 12. JSONP跨域
---

## JSONP
JSONP（JSON with Padding）: 跨域获取JSON数据的一种非官方的使用模式。利用script标签可跨域的特点，在跨域脚本中可以直接回调当前脚本的函数。JSONP请求一定需要对象的服务器支持才可以。  

1. JSON和JSONP不是一个类型
2. JSON是数据交换格式，JSONP是一种跨域获取JSON数据的交互技术
3. JSONP获取的资源并不是直接是JSON数据，而是带有JSON数据参数的函数执行     

客户端期望返回：{"name": "Jacky", "age":18}   
JSONP实际返回：callback({"name": "Jacky", "age":18})    

### 1. 案例一
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

### 2. 案例二    
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

### 3. 案例三
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

        // 回调函数
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

### 4. 案例四     
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

        function test(data) {
            console.log(data);
        }
    </script>
</body>
```

## 封装Ajax增加JSONP功能：
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

## JSONP跨域百度搜索关键字
绑定input事件的事件处理函数，通过JSONP跨域的方式获取返回的数据。

### 1. 功能点1： 利用JSONP跨域获取数据
利用手动或者封装的Ajax进行跨域请求数据
```html
<input type="text"  class="J_searchInput"/>
```
```javascript
;(function(doc){
	var oSearchInput = doc.getElementsByClassName('J_searchInput')[0];
	
	var init = function(){
		bindEvent();
	}
	
	function bindEvent(){
		// 绑定输入框的事件处理函数
		oSearchInput.addEventListener('input', inputType, false);
	}
	
	// inputType函数
	function inputType(){
		var val = _trimSpace(this.value),
				len = val.length;
		// 判断当前输入框输入字符的长度
		if(val) {
			// 通过JSONP跨域请求数据
			getDatas(val, 'setDatas');
		}
	}
	
	// JSONP跨域请求数据
	function getDatas(val, callback){
		// 创建script标签
		var oScript = doc.createElement('script');
		oScript.src = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + val + '&cb' + callback;
		doc.body.appendChild(oScript);
		doc.body.removeChild(oScript);
	}
	
	// 去除输入框空格
	function _trimSpace(str){
		return str.replace(/\s+/g, '');
	}
	
	// 执行JSONP跨域返回的函数
	window.setDatas = function(data) {
		console.log(data);
	}

    
    init();
	
})(document);
```


总结：JSONP与CORS解决跨域都存在一个致命的缺陷，严重依赖后端的协助。因此前端独立就能解决跨域的方案是利用代理或方向代理解决跨域。

## 补充
### 1. 有三个标签允许跨域加载资源
1. \<img src=XXX>
2. \<link href=XXX>
3. \<script src=XXX>

请求跨域了，那么请求到底发出去没有？   
跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。你可能会疑问明明通过表单的方式可以发起跨域请求，为什么 Ajax 就不会?因为归根结底，跨域是为了阻止用户读取到另一个域名下的内容，Ajax 可以获取响应，浏览器认为这不安全，所以拦截了响应。但是表单并不会获取新的内容，所以可以发起跨域请求。同时也说明了跨域并不能完全阻止 CSRF，因为请求毕竟是发出去了。


