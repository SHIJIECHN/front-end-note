---
autoGroup-1: 网络基础
sidebarDepth: 3
title: AJAX
---

## AJAX
浏览器与服务器之间的通信基础是`HTTP`协议。

`AJAX`：`Asynchronous JavaScript and XML` 异步的`JavaScript`和`XML`

原生`XMLHttpRequest`对象与`ActiveX`对象：   
作用：`JS`脚本`HTTP`请求的发起必须通过`XMLHttpRequest`对象，也是通过`AJAX`进行浏览器与服务器通信的接口，不局限于`XML`，可以发送任何格式的数据。

### 创建xhr
所有`XMLHttpRequest`对象都需要被实例化：`var xhr = new XMLHttpRequest()`;

兼容性：`IE5/IE6`使用`ActiveX`对象   
`var xhr = new ActiveXObject('Microsoft.XMLHTTP');`


### 发送HTTP请求
1. `open`方法（发送设置）   
参数列表：    
   - `method`：请求方式
   - `url`：请求发送的地址
   - `async`：`true`异步 `false`同步   
2. `send`方法（发送请求）
参数：发送`POST`请求体数据用，`GET`不填写

### 接收请求
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


### 服务器响应
`responseText`：获取字符串数据    
`responseXML`：获取XML数据

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

    if (!o) {
        throw new Error('您的浏览器不支持异步发起HTTP请求')
    }

    function _doAjax(opt) {
        var opt = opt || {},
            type = (opt.type || 'GET').toUpperCase(),
            async = ''+ opt.async === 'false'? false : true,
            url = opt.url,
            data = opt.data || null,
            timeout = opt.timeout || 30000,
            error = opt.error || function() {},
            success = opt.success || function() {},
            complete = opt.complete || function() {}

        if (!url) {
            throw new Error('您没有填写url')
        }
        
        o.onreadystatechange = function() {
            if (o.readyState === 4) {
                if((o.status >= 200 && o.status < 300) || o.status === 304){
                    success(JSON.parse(o.responseText));
                }else{
                    error();
                }   
            }
            complete();
            clearTimeout(t);
            t = null;
            o = null;
        }

        o.open(type, url, async);
        type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www.form-urlencoded');
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
        var str = '';
        for (var key in obj) {
            str += key + '=' + obj[key] + '&';
        }
        return str.replace(/&$/, '');
    }

    return {
        ajax: function(opt) {
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

## 练习
腾讯课堂评论模块

## AJAX状态码
`xhr.status/xhr.status.Text`：服务器回应的`HTTP`状态码/服务器发送的状态提示    

五个事件：
1. `xhr.onloadstart`：绑定`HTTP`请求发出的监听函数
2. `xhr.onerror`：绑定请求失败完成的监听函数（修改封装的`AJAX`）
3. `xhr.onload`：绑定请求成功完成的监听函数
4. `xhr.onabort`：绑定请求终止（调用了`abort()`方法）的监听函数
5. `xhr.onloadend`：绑定请求完成（不管成功与失败、终止）的监听函数

顺序：`loadstart` -> `readyState === 4` -> `load/error/abort/` -> `loadend`


请求超时：   
`xhr.timeout`：多少毫秒后，如果请求仍然没有得到结果，结汇自动终止，如果该属性等于`0`表示没有事件限制    
`xhr.ontimeout`：绑定请求超时一个监听函数，如果发生`timeout`事件，就会执行这个监听函数    

```js
var t = null;
xhr.onreadystatechange = function() {
    if ((o.status >= 200 && o.status < 300) || o.status === 304) {
        clearTimeout(t);
        t = null;
    }
}

t = setTimeout(function(){
    xhr.abort();
    clearTimeout(t);
    t = null;
    xhr = null;
}, 30000);
```

## 异步与同步
`async`的值：   
异步（默认）（`async=true`）：`Ajax`异步发送请求时，不影响页面加载、用户操作以及`AJAX`程序后的程序执行。   
同步（`async=false`）：`Ajax`同步发送请求时，浏览器必须等到请求完成并响应成功后，`AJAX`程序后续的程序才会执行。    
解决同步异步的配置问题：   
成功的回调函数给全局作用域上的变量赋值的案例
```js
var datas = null;

$.ajax({
    url: 'url',
    type: 'POST',
    data: {
        state: 1,
        flag: 2
    },
    async: true,
    success: function(data) {
        console.log(1);
        datas = data;
    }
});
console.log(2);
console.log('datas: ' + datas);

/**
 * 2
 * datas: null
 * 1
 * 实际上在输出2的时候，请求也是执行的，只是执行到success的比较慢，所以输出在后面
 */
```