---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 8. 同步与异步请求、混编模式、AJAX、原生AJAX封装
---

## 同步与异步请求和混编模式
### 1. AJAX的前奏
1. 浏览器与服务器之间的通信基础是`HTTP`协议。
2. 用户通过网址或者表单向服务器提交请求,服务器向浏览器发送相应的响应。

### 2. 混编模式
在没有AJAX出现之前,通常的编程都是前端(HTML)代码和后端(PHP)代码写在同一个文件中,前端的代码负责页面的结构,而后端的代码用于获取数据处理业务逻辑。以前的这种编写代码的方式就叫做混编模式。

缺点：
1. 难以维护
2. 同步请求数据

### 3. 同步与异步请求
1. 同步请求:例如,通过混编模式下php代码直接向服务器发送请求,当获取数据完成之后,重新更新和渲染页面的全部内容。
2. 异步请求:例如,通过AJAX向服务器发送请求,拿到数据,整理数据,局部的渲染页面部分内容。


异步请求解决了什么问题呢?
在不重新加载整个页面的前提下,能获取到新的网页所需要的数据,并且局部的更新页面的部分内容。

## AJAX
### 1. 定义
`AJAX`：`Asynchronous JavaScript and XML` 异步的`JavaScript`和`XML`。

AJAX是什么? JavaScript脚本发起HTTP请求

JavaScript异步通信: 请求服务器返回XML文档,前端从XML文档中获取数据,再在不刷新整个页面的基础上,渲染到页面相应的位置。

### 2. 原生AJAX
1. 原生AJAX的创建：原生`XMLHttpRequest`对象与`ActiveX`对象   
2. 作用：
   1. `JS`脚本`HTTP`请求的发起必须通过`XMLHttpRequest`对象
   2. 也是通过`AJAX`进行浏览器与服务器通信的接口
   3. 不局限于`XML`，可以发送任何格式的数据。
3. XMLHttpRequest本身是一个js引擎内置的构造函数，
所有`XMLHttpRequest`对象都需要被实例化：`var xhr = new XMLHttpRequest()`;

4. 兼容性：`IE5/IE6`使用`ActiveX`对象   
`var xhr = new ActiveXObject('Microsoft.XMLHTTP');`

```js
if(window.XMLHttpRequest) {
	xhr = new XMLHttpRequest();
} else {
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
}
```
### 3. 原生AJAX的实现方法、事件和属性
#### 原生AJAX的方法
1. `open`方法（发送设置）   
参数列表：    
   - `method`：请求方式
   - `url`：请求发送的地址
   - `async`：`true`异步 `false`同步   
2. `send`方法（发送请求）
参数：发送`POST`请求体数据用，`GET`不填写

#### 原生AJAX的事件
`onreadystatechange`事件：挂载到`XMLHttpRequest`对象上的事件   
状态码：
1. `readyState`状态：通过`XMLHttpRequest`对象发送`HTTP`请求的各个阶段状态码（`0-4`）   
2. `status`状态：服务器响应的状态码（`200 OK`、`404`未找到页面）   

当`readyState`变化时，将触发`onreadystatechange`事件执行其回调函数  
   - `0`：请求未初始化
   - `1`：服务器连接已建立
   - `2`：请求已接收
   - `3`：请求处理中
   - `4`：请求已完成，且响应已就绪

注意：`readyState`仅仅是针对请求的状态码，获取资源是否成功取决于`statue`的状态


#### 原生AJAX属性
1. `responseText`：返回JSON数据的JSON字符串    
2. `responseXML`：获取XML数据


#### 原生AJAX基础实现
```js
var xhr;

// 创建xhr
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

console.log(xhr.readyState); // 0 1 在发送请求前，可以检测到0和1状态

// 发送HTTP请求
xhr.open('GET', 'url');
xhr.send();

console.log(xhr.readyState);// 2 3 4
// 接收请求
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.statue === 200) {
        // 接收响应
        console.log(JSON.parse(xhr.responseText));
    }
}
```

POST方式
```js
// 发送HTTP请求
xhr.open('POST', 'url');
// 使用POST必须要加
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('status=1'); // 参数
```
`PSOT`请求方式下，`send`方法参数中的格式：`a=1&b=2&c=3 ` 
`xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');`   
`PSOT`请求方式必须设置这个请求头信息，目的是将请求体中的数据转换为键值对，这样后端接收到`a=1&b=2&c=3`这样的数据才知道，这是一个`POST`方式传来的数据。


## AJAX封装
```js
var $ = (function() {
    var o = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP');
    var t = null; // 设置超时

    // 如果浏览器不支持AJAX请求
    if (!o) {
        throw new Error('您的浏览器不支持异步发起HTTP请求')
    }

    function _doAjax(opt) {
        var opt = opt || {},
            // 请求方法，繁殖用户传入小写，强制转为大写
            type = (opt.type || 'GET').toUpperCase(),
            // 同步 or 异步
            async = ''+ opt.async === 'false'? false : true,
            // 请求地址
            url = opt.url,
            // 请求参数
            data = opt.data || null,
            // 超时设置
            timeout = opt.timeout || 30000,
            // 失败后的回调
            error = opt.error || function() {},
            // 成功后的回调
            success = opt.success || function() {},
            // 无论失败还是成功都会执行的complete函数
            complete = opt.complete || function() {}

        // 未传入url
        if (!url) {
            throw new Error('您没有填写url')
        }
        
        // AJAX绑定事件监听处理函数
        o.onreadystatechange = function() {
            if (o.readyState === 4) {
                if((o.status >= 200 && o.status < 300) || o.status === 304){
                    // 请求成功回调
                    success(JSON.parse(o.responseText));
                }else{
                    // 请求失败回调
                    error();
                }   
            }
            // 最后执行complete
            complete();
            clearTimeout(t);
            t = null;
            o = null;
        }

        // 处理AJAX请求的逻辑
        o.open(type, url, async);
        // POST 请求设置请求头数据的格式类型
        type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www.form-urlencoded');
        // 处理请求数据中的data的格式
        o.send(type === 'GET' ? null : formatDatas(data));
        t = setTimeout(function(){
            o.abort();
            clearTimeout(t);
            t = null;
            o = null;
            complete();
            throw new Error('请求超时')
        }, timeout);
    }

    function formatDatas(obj) {
        // {'name':'Tom','sex':'male'} ---> 'name=Tom&sex=male'
        var str = '';
        for (var key in obj) {
            str += key + '=' + obj[key] + '&';
        }
        return str.replace(/&$/, '');
    }

    return {
        ajax: function(opt) {
            // 处理传入的参数问题,抽离函数,能够让所有方法能够在Ajax方法外处理
            _doAjax(opt);
        },
        post: function(url, data, callback) {
            _doAjax({
                type: 'POST',
                url: url,
                data: data,
                success: callback
            });
        },
        get: function(url, callback){
            _doAjax({
                type: 'GET',
                url: url,
                success: callback
            })
        }
    }
}())

// ajax
$.ajax({
    type: 'POST',
    url: '12',
    data: {
        status: 1,
        flag: 2
    },
    success: function(data) {
        console.log(data);
    }
})

// post
$.post('url', {
    status: 1,
    flag: 2
}, function(data) {
    console.log(data);
})

// get
$.get('url?status=1&flag=2', function(data) {
    console.log(data);
})

```

