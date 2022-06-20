---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 18. 错误信息、try_catch、严格模式
---

## 错误信息
JS错误信息类型
### 1. `SyntaxError` 语法错误
#### 1. 变量名不规范
    ```js
    var 1 = 1; // Uncaught SyntaxError: Unexpected number
    var 1ab = 1; // Uncaught SyntaxError: Invalid or unexpected token
    ```
#### 2. 关键字不可赋值
   ```js
   new = 5; // Uncaught SyntaxError: Unexpected token '='
   function = 1; // Uncaught SyntaxError: Unexpected token '='
   ```
#### 3. 基本的语法错误
   ```js
   var a = 5: // Uncaught SyntaxError: Unexpected token ':'
   function 1test(){} // Uncaught SyntaxError: Invalid or unexpected token
   ```
#### 4. 给无法被赋值的对象赋值的时候
   ```js
   var a = 1 = 2; // Uncaught SyntaxError: Invalid left-hand side in assignment
   ``` 

### 2. `ReferenceError` 引用错误
#### 1. 变量或者函数未被声明
   ```js
   test(); // Uncaught ReferenceError: test1 is not defined
   ```
#### 2. 给无法被赋值的对象赋值的时候
   ```js
   console.log(1) = 1; // Uncaught ReferenceError: Invalid left-hand side in assignment
   ```

### 3. `RangeError` 范围错误
#### 1. 数组长度赋值为负数
   ```js
   var arr = [1,2,3];
   arr.length = -1;
   console.log(arr); // Uncaught RangeError: Invalid array length
   ```
#### 2. 对象方法参数超出可行范围
   ```js
   var num = new Number(66.66);
   console.log(num.toFixed(-1)); // Uncaught RangeError: toFixed() digits argument must be between 0 and 100
   ```

### 4. `TypeError` 类型错误
#### 1. 调用不存在的方法
   ```js
   123(); // Uncaught TypeError: 123 is not a function

   var obj = {};
   obj.say(); // Uncaught TypeError: obj.say is not a function
   ```
#### 2. 实例化原始值
   ```js
   var a = new 'string'; // Uncaught TypeError: "string" is not a constructor
   ```

### 5. `URIError` `URI`错误
   ```js
   var url = 'http://www.baidu.com?name=张三';
   var newUrl = enCodeURI(url);
   console.log(newUrl);
   var newNewUrl = deCodeURI(newUrl);
   console.log(newNewUrl);

   var str = deCodeURI('%fdsdf%'); // Uncaught URIError: URI malformed
   ```

### 6. `EvalError` `eval`函数执行错误
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
总结：
1. catch语句能够捕获到try语句中的错误，并且打印出来，e.name为错误类型，e.message为错误信息。
2. try里面的错误不影响外部代码执行，也不应现finally（一定执行）里的代码程序。
   
### 1. 实例
由于网络影响，可能后端传递的jsonStr未获取到
```js
var jsonStr = '';
try{
    if(jsonStr == ''){
        throw 'JSON字符串为空'; // throw自定义抛出错误信息
        throw new Error(); // 手动抛出错误
    }
    console.log('我要执行啦！！');
    // JSON数据转为JS对象,如果参数为''字符串报错
    // SyntaxError: Unexpected end of JSON input
    var json = JSON.parse(jsonStr); 
    console.log(json);
}catch(e){
    // 捕获throw抛出的错误
    console.log(e); // JSOn字符串为空

    // 错误的结果集合
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

### 1. 声明方式
1. `ES5`中分为正常模式和严格模式。
2. `IE9`及以下`IE`不支持严格模式。在3.0的基础上加上了严格模式。
3. 严格模式关键字`use strict`。
4. 严格模式的作用：按照ES5的羽凡规范执行代码


### 2. with语句
改变作用域链，在作用域链最顶层设置其他AO环境
```js
'use strict'
var a = 1;
var obj = {
    a: 2
}
function test(){
    var a = 3;
    with(window){
        console.log(a); // 报错
    }
}
test();
// 严格模式下报错：
// Uncaught SyntaxError: Strict mode code may not include a with statement
```
with语句：解决多人写作，命名冲突的问题
```javascript
// 命名冲突
var a = 1;
var a = 2;
console.log(a);
function test() {
	console.log(1);
}
function test() {
	console.log(2);
}
test();

// with()解决:
var namespace = {
	header: {
  	Jenny:{
    	a:1,
      b:2
    },
    Ben:{
    	a:1,
      b:2
    }
  }
}

// 正常调用
console.log(namespace.header.Ben.a);
// with
with(namespace.header.Ben) {
	console.log(a);
}

// 现在开发,利用模块化
var initProgarmmer = (function(){
	// ...
})();
```

### 3. 严格模式与非严格模式的场景
```javascript
// 非严格模式下:
function test() {
	console.log(this); // window
}
test.call(1); 
// Number { 1 } test.call()：改变this指向,
// this指向的是对象,所以1被包装类隐式的转换成数字对象的形式。

function test(a, a) {
	console.log(a); // 2
}
test(1, 2);

eval('var a = 1; console.log(a)'); // 1
```
ECMAScript严格模式:
1. with(){}语句不可用,因为改变作用域。
2. callee,caller不可用,但是arguments可以使用。
3. a = 1; 变量必须声明,不然报错 ReferenceError
4. var a = b = 1; 变量必须声明。
5. window环境下,this指向undefined,所以函数默认this也是指向undefined。
6. 函数的参数不能重复声明。
7. eval()函数有自己的作用域,外界此时访问不到内部。
```js
'use strict';
eval('var a = 1; console.log(a);');
console.log(a);
```

