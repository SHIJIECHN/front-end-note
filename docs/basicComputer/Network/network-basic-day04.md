---
autoGroup-1: 网络基础
sidebarDepth: 3
title: AJAX
---

## AJAX
浏览器与服务器之间的通信基础是HTTP协议。

AJAX：Asynchronous JavaScript and XML 异步的JavaScript和XML

原生XMLHttpRequest对象与ActiveX对象：   
作用：JS脚本HTTP请求的发起必须通过XMLHttpRequest对象，也是通过AJAX进行浏览器与服务器通信的接口，不局限于XML，可以发送任何格式的数据。

### 创建xhr
所有XMLHttpRequest对象都需要被实例化：var xhr = new XMLHttpRequest();

兼容性：IE5/IE6使用ActiveX对象   
var xhr = new ActiveXObject('Microsoft.XMLHTTP');


### 发送HTTP请求
1. open方法（发送设置）   
参数列表：    
   - method：请求方式
   - url：请求发送的地址
   - async：true异步 false同步   
2. send方法（发送请求）
参数：发送POST请求体数据用，GE不填写

### 接收请求
onreadystatechange事件：挂载到XMLHttpRequest对象上的事件   
状态码：
1. readyState状态：通过XMLHttpRequest对象发送HTTP请求的各个阶段状态码（0-4）   
2. status状态：服务器响应的状态码（200 OK、404未找到页面）   

当readyState变化时，将触发onreadystatechange事件执行其回调函数  
   - 0：请求未初始化
   - 1：服务器连接已建立
   - 2：请求已接收
   - 3：请求处理中
   - 4：请求已完成，且响应已就绪

注意：readyState仅仅是针对请求的状态码，获取资源是否成功取决于statue的状态


### 服务器响应
responseText：获取字符串数据    
responseXML：获取XML数据

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
PSOT请求方式下，send方法参数中的格式：a=1&b=2&c=3  
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');   
PSOT请求方式必须设置这个请求头信息，目的是将请求体中的数据转换为键值对，这样后端接收到a=1&b=2&c=3这样的数据才知道，这是一个POST方式传来的数据。

