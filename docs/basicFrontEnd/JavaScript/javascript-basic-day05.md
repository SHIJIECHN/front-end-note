---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 5. 参数默认值、递归、预编译、暗示全局变量
---

## 函数参数的默认值
1. 初始化参数，给参数增加默认值
(1) 参数的默认值不设置它就是`undefined`。
```js
function test(a, b) {
  console.log(a); // undefined
  console.log(b); // undefined
}
test();
```
不给 `a` 和 `b` 传入参数，两者默认是 `undefined`

(2) 给a使用默认值，而b传入实参，此时给a传入实参undefined。
```javascript
function test(a = 1, b){
    console.log(a); // 1  形参和实参谁的值不是undefined就取谁的值
    console.log(b); // 2
}
test(undefined, 2);
```
理解arguments实参和形参的关系，`arguments[0]`和形参a，哪个不是undefined，对应的值就是哪个。

(3) 形参和实参谁的值不是undefined就取谁的值
```javascript
function test(a = 1, b){
    console.log(a); // 1  
    console.log(b); // 2

    // a  1
    // arguments[0]  undefined
}
test(1, 2);
```
2. 形参设置默认参数，es6写法
```js
function test(a = 1, b = 2) {
  console.log(a); // 1
  console.log(b); // 2
}
test();
```
有的浏览器不支持默认参数的情况，解决浏览器不支持默认参数的情况， 三种方式：
(1) 使用`||`运算符
```js
function test(a, b) {
  var a = arguments[0] || 1;
  var b = arguments[1] || 2;

  console.log(a + b); // 3
}
test();
```

(2) 使用`typeof`
```js
function test(a, b){
    var a, b;
  if(typeof(arguments[0]) !== 'undefined'){
    a = arguments[0]
  }else {
    a = 1
  }

  if(typeof(arguments[1]) !== 'undefined'){
    b = arguments[1]
  }else{
    b = 2
  }

  console.log(a + b) // 3
}
test()
```
(3) 三元运算符
```javascript
function test(a, b){
  var a = typeof(arguments[0] !== 'undefined' ? arguments[0] : 1);
  var b = typeof(arguments[1] !== 'undefined' ? arguments[0] : 2)
  console.log(a + b); // 3
}
test();
```

## 递归
递归是函数自己调用自己   
n的阶乘 => 不能用for循环 => 用递归    
fact(n):    
1. 规律 : n! = n * fact(n-1)    
2. 出口 : n===1    
n = 5;    
fact(5) = 5 * fact(4) -> 5 * 24   
fact(4) = 4 * fact(3) -> 4 * 6    
fact(3) = 3 * fact(2) -> 3 * 2     
fact(2) = 2 * fact(1) -> 2 * 1   
```javascript
function fact(n) {
  if(n === 1){
    return 1
  }
  return n * fact(n - 1); // 一直等到有结果直返才return出去
}
console.log(fact(5)); // 120
```
总结：递归总是在找到出口（结束递归）后，再一步一步向上计算出结果。递归需要注意两个因素：规律和出口

## 预编译
预编译的过程：
1. 检查通篇的语法错误
2. 预编译的过程
3. 解释一行，执行一行
并不是一来就执行预编译，而是会检查语法错误。

预编译过程：
1. 函数声明整体提升
```javascript
console.log(a); // function a(){...}
function a(){
    var a = 10;
}
```
2. 变量只会声明提升
```javascript
console.log(a) // undefined
var a = 10
```
3. 变量赋值是不会提升的
```javascript
console.log(a); // Uncaught ReferenceError: a is not defined
a = 10;
```
:::tip
函数声明整体提升，变量只有声明提升，赋值不提升
:::

## 暗示全局变量
```js
var a = 1;  // a = window.a 声明了的变量也叫全局变量
b = 2;  // b = window.b  未声明直接赋值的变量叫暗示全局变量
console.log(window.a) // a -> window.a
                      // b -> window.b

/**
window = {
  a: 1,
  b: 2
}
*/
```
未声明就赋值的变量就是全局变量，在全局域中声明的变量也是全局变量，它们都归`window`所有。在全局域中`a`等于`window.a`，`b`等于`window.b`。

在函数内部没有声明变量而直接给变量赋值的，如`b`，就提升到全局变量。
```js
function test(){
  var a = b = 1
}
test();
console.log(window.b); // 1
console.log(windown.a); // undefined 访问对象中不存在的属性
console.log(a); // 报错
```
:::tip
声明了的变量也叫全局变量，未声明直接赋值的变量叫暗示全局变量（window叫全局域）
:::

## AO
AO（activation object） 活跃对象，函数上下文

函数预编译过程：
1. 寻找函数的形参和变量声明
2. 把实参的参数值赋值给形参
3. 寻找函数体内的函数声明，并赋值函数体
4. 执行函数

### 例一
```js
function test(a){
  console.log(a);  // f a(){}
  var a = 1;
  console.log(a); // 1
  function a(){}
  console.log(a); // 1
  var b = function(){}
  console.log(b); // f (){}
  function d(){}
}

test(2)

// AO = {
//   a: undefined ->
//     2 ->
//     function a(){} ->
//     1,
//   b: undefined -> function(){},
//   d: function d(){}
// }
```

### 例二
```js
function test(a, b){
  console.log(a) 
  c = 0
  var c;
  a = 5
  b = 6
  console.log(b)
  function b(){}
  function d(){}
  console.log(b)
}
test(1)
/**
 * 运行结果：
 * 1
 * 6
 * 6
*/
/** 分析
AO ={
  a: undefined ->
    1 ->
    5,
  b: undefined ->
    function b(){} ->
    6,
  c: undefined ->
    0,
  d: function d(){}
}
**/
```
## GO
GO（global object） 全局上下文 

全局执行流程：
1. 找变量
2. 找函数声明
3. 函数执行
  

### 例一
```js
var a = 1 
function a(){
  console.log(a)
}
console.log(a)
/**
 * 运行结果：
 * 1
*/

/** 分析
 * GO = {
 *  a: undefined ->
 *    function a(){} ->
 *    1,
 * }
 * 
 * GO === window
*/
```
### 例二
```js
console.log(a, b)
function a(){}
var b = function(){}
/**
 * 运行结果
 * ƒ a(){}  undefined
*/
/** 分析
 * GO ={
 *    b: undefined,
 *    a: function a(){}
 * }
*/
```
### 例三
```js
function test(){
  var a = b = 1
  console.log(b)
}
test()
/**
 * 运行结果：
 * 1
*/
/**
 * GO = {
 *    b: 1
 * }
 * 
 * AO ={
 *    a: undefined -> 1
 * }
*/
```
### 例四
```js
var b = 3;
console.log(a);
function a(a){
  console.log(a);
  var a = 2;
  console.log(a);
  function a(){};
  var b = 5;
  console.log(b);
}
a(1)

/**
 * 运行结果：
 * ƒ a(a){
    console.log(a)
    var a = 2
    console.log(a)
    function a(){}
    var b = 5
    console.log(b)
  }
  ƒ a(){}
  2
  5
*/
/**
 * GO = {
 *    b: undefined -> 3
 *    a: function a(){...}
 * }
 * 
 * AO = {
 *    a: undefined -> 1 -> function a(){} -> 2
 *    b: undefined -> 5
 * }
 * 
*/
```
### 例五
```js
a = 1 
function test(){
  console.log(a)
  a = 2
  console.log(a)
  var a = 3
  console.log(a)
}
test()
var a;
console.log(a)
/**
 * 运行结果：
 * undefined
 * 2
 * 3
 * 1
*/
/**
 * GO = {
 *    a: undefined ->1
 *    test: function test(){...}
 * }
 * 
 * AO = {
 *    a: undefined -> 2 -> 3
 * }
*/
```
### 例六
预编译不看语句判断，只看有没有变量声明和函数声明
```js
function test(){
    console.log(b);
    if(a){
        var b = 2;
    }
    c = 3;
    console.log(c);
}

var a;
test();
a = 1;
console.log(a);
/**
运行结果：
undefined,
3,
1
*/

/**
GO = {
    a: undefined -> 1,
    test: function test(){...},
    c: 3
}

AO = {
    b: undefined
}
*
```

## 面试题
### 题一
```js
var a = false + 1;
console.log(a); // 1
/**
有加号，所以false会转换为数字类型0
*/
```
### 题二
```javascript
var b = false == 1;
console.log(b); // false
```
### 题三
```javascript
if(typeof(a) && (-true) + (+undefined) + ''){
    console.log('通过了'); // 通过了
}else{
     console.log('没通过');
}
/**
typeof(a)返回'undefined'，是字符串'undefined'，是真
(-true) 转为 -1，是真
+undefined 转为NaN
(-true) + (+undefined) + '' => 字符串的NaN => 为真
*/
```
### 题四
```javascript
if(1 + 5 * '3' === 16){
    console.log('通过了'); // 通过了
}else{
    console.log('没通过');
}
/**
5 * '3' 时，'3'要转换为数字类型3
*/
```
### 题五
```javascript
console.log(!!' ' + !!'' - !!false || '没通过'); // 1
/**
!!' ' 不是空字符串，是有一个空格
!!' ' + !!'' - !!false 执行结果为 1
*/
```

## 练习
### 例一
```js
function test(){
    return a
    a = 1
    function a(){}
    var a = 2
}
console.log(test())
```
::: details 点击查看结果
```javascript
/**
 * 运行结果：
 * ƒ a(){}
*/
/**
 * AO = {
 *      a: undefined -> function a(){}
 * }
*/
```
:::

### 例二
```js
console.log(test())
function test(){
    a = 1;
    function a(){}
    var a = 2;
    return a
}
```
::: details 点击查看结果
```javascript
/**
 * 运行结果：
 * 2
*/
/**
 * AO = {
 *      a: undefined -> function a(){} -> 1 -> 2
 * }
*/
```
:::
### 例三
```js
a = 1
function test(e){
    function e(){}
    arguments[0] = 2
    console.log(e)
    if(a){
        var b = 3
    }
    var c;
    a = 4
    var a;
    console.log(b);
    f = 5
    console.log(c);
    console.log(a);
}
var a;
test(1);
console.log(a);
console.log(f);
```
::: details 点击查看结果
```js
/**
 * 运行结果：
 * 2
 * undefined
 * undefined
 * 4
 * 1
 * 5
*/
/**
 * GO = {
 *      a: undefined -> 1,
 *      test: function test(){...},
 *      f: 5
 * }
 * AO = {
 *      e: undefined -> 1 -> function e(){} -> 2,
 *      b: undefined,
 *      c: undefined,
 *      a: undefined -> 4
 * }
*/
```
:::

总结：
1. 找形参和变量声明
2. 实参值赋给形参
3. 寻找函数声明
4. 执行函数
