---
autoGroup-3: JavaScript基础
title: 预编译
---
## 暗示全局变量
```js
var a = 1
b = 2
console.log(window.a) // a -> window.a
                      // b -> window.b

window = {
  a: 1,
  b: 2
}
```
未声明就赋值的变量就是全局变量，在全局域中声明的变量也是全局变量，它们都归`window`所有。在全局域中`a`等于`window.a`，`b`等于`window.b`。

```js
function test(){
  var a = b = 1
}
test();
console.log(window.b)

```
在函数内部没有声明变量而直接给变量赋值的，如`b`，就提升到全局变量。

## 预编译流程
1. 通篇检查语法错误
2. 预编译
3. 编译一行，执行一行


函数声明整体提升，变量只有声明提升，赋值不提升
```js
console.log(a) // undefined
var a = 10
```
### AO
AO（activation object） 活跃对象，函数上下文

函数预编译过程：
1. 寻找函数的形参和变量声明
2. 把实参的参数值赋值给形参
3. 寻找函数体内的函数声明，并赋值函数体
4. 执行函数

例一
```js
function test(a){
  console.log(a)
  var a = 1
  console.log(a)
  function a(){}
  console.log(a)
  var b = function(){}
  console.log(b)
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

例二
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
### GO
GO（global object） 全局上下文 

全局执行流程：
1. 找变量
2. 找函数声明
3. 函数执行

例一
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
例二
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
例三
```js
function test(){
  var a = b = 1
  console.log(a)
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
例四
```js
var b = 3
console.log(a)
function a(a){
  console.log(a)
  var a = 2
  console.log(a)
  function a(){}
  var b = 5
  console.log(b)
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
 *    a: function a(){}
 * }
 * 
 * AO = {
 *    a: undefined -> 1 -> function a(){} -> 2
 *    b: undefined -> 5
 * }
 * 
*/
```
例五
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

## 练习
例一
```js
function test(){
    return a
    a = 1
    function a(){}
    var a = 2
}
console.log(test())
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

例二
```js
console.log(test())
function test(){
    a = 1;
    function a(){}
    var a = 2;
    return a
}
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
例三
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

总结：
1. 找形参和变量声明
2. 实参值赋给形参
3. 寻找函数声明
4. 执行函数


