---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 18. 错误信息、try_catch、严格模式
---

## 错误信息
JS错误信息类型
1. `SyntaxError` 语法错误
   1. 变量名不规范
    ```js
    var 1 = 1; // Uncaught SyntaxError: Unexpected number
    var 1ab = 1; // Uncaught SyntaxError: Invalid or unexpected token
    ```
   2. 关键字不可赋值
   ```js
   new = 5; // Uncaught SyntaxError: Unexpected token '='
   function = 1; // Uncaught SyntaxError: Unexpected token '='
   ```
   3. 基本的语法错误
   ```js
   var a = 5: // Uncaught SyntaxError: Unexpected token ':'
   function 1test(){} // Uncaught SyntaxError: Invalid or unexpected token
   ```
   4. 给无法被赋值的对象赋值的时候
   ```js
   var a = 1 = 2; // Uncaught SyntaxError: Invalid left-hand side in assignment
   ``` 

2. `ReferenceError` 引用错误
   1. 变量或者函数未被声明
   ```js
   test(); // Uncaught ReferenceError: test1 is not defined
   ```
   2. 给无法被赋值的对象赋值的时候
   ```js
   console.log(1) = 1; // Uncaught ReferenceError: Invalid left-hand side in assignment
   ```

3. `RangeError` 范围错误
   1. 数组长度赋值为负数
   ```js
   var arr = [1,2,3];
   arr.length = -1;
   console.log(arr); // Uncaught RangeError: Invalid array length
   ```
   2. 对象方法参数超出可行范围
   ```js
   var num = new Number(66.66);
   console.log(num.toFixed(-1)); // Uncaught RangeError: toFixed() digits argument must be between 0 and 100
   ```

4. `TypeError` 类型错误
   1. 调用不存在的方法
   ```js
   123(); // Uncaught TypeError: 123 is not a function

   var obj = {};
   obj.say(); // Uncaught TypeError: obj.say is not a function
   ```
   2. 实例化原始值
   ```js
   var a = new 'string'; // Uncaught TypeError: "string" is not a constructor
   ```

5. `URIError` `URI`错误
   ```js
   var url = 'http://www.baidu.com?name=张三';
   var newUrl = enCodeURI(url);
   console.log(newUrl);
   var newNewUrl = deCodeURI(newUrl);
   console.log(newNewUrl);

   var str = deCodeURI('%fdsdf%'); // Uncaught URIError: URI malformed
   ```

6. `EvalError` `eval`函数执行错误

人为抛出错误
```js
var error = new Error('代码错误');
console.log(error);
```

## try catch finally throw
```js
try{
    console.log('正常执行1');
    console.log(a); // 执行报错，后面都不会再执行
    console.log(b); // 不执行
    console.log('正常执行2');
}catch(e){
    console.log(e.name +':'+ e.message);
}finally{
     console.log('正常执行3');
}
 console.log('正常执行4');
```
例一
```js
var jsonStr = '';
try{
    if(jsonStr == ''){
        throw 'JSON字符串为空';
    }
    console.log('我要执行啦！！');
    var json = JSON.parse(jsonStr);
    console.log(json);
}catch(e){
    console.log(e);
    var errorTip = {
        name: '数据传输失败',
        errorCode: '10010'
    }
    console.log(errorTip);
}
```

## `ES5`严格模式
`ECMAScript`：`JavaScript`方法规范
- 1997年 1.0
- 1998年 2.0
- 1999年 3.0 JS通行标准
- 2007年 4.0草案 仅`Mozilla`支持
- 2008年 4.0中止  容易改善3.1->`ECMAScript5`  Harmony
- 2009年 5.0发布，Harmony-> 1/2 JS.NEXT 1/2 JS.next.next
- 2011年 5.1 ISO国际标准
- 2013年 ES6 = JS.NEXT  JS.next.next 7  ES6草案发布
- 2015年 ES6正式发布 ECMAScript2015

`ES5`中分为正常模式和严格模式。`IE9`及以下`IE`不支持严格模式。在3.0的基础上加上了严格模式。严格模式关键字`use strict`。

严格模式的作用
```js
'use strict'
var a = 1;
var pbj = {
    a: 2
}
function test(){
    var a = 3;
    with(window){
        console.log(a); // 报错
    }
}
test();
```
`with`可以改变作用域链，严格模式下不可用。`caller`, `callee`也不能使用。  
严格模式下
- 函数的参数不能重复
```js
'use strict';
function test(a, a){
    console.log(a);
}
test();
// Uncaught SyntaxError: Duplicate parameter name not allowed in this context
```
- 对象的属性名不能重复，但是不报错
```js
'use strict';
var obj = {
    a: 1,
    a: 2
}
console.log(obj.a); // 2 
```
- `eval`
```js
'use strict';
eval('var a = 1; console.log(a);');
console.log(a);
```

## 变量生命周期

## 垃圾回收机制
1. 找出不再使用的变量
2. 释放其占用内存
3. 固定的时间间隔进行