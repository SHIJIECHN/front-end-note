---
autoGroup-1: 网络基础
sidebarDepth: 3
title: 10. AJAX版本、响应状态、超时设置、同步与异步
---

## AJAX版本


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