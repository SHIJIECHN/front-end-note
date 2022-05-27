---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 4.函数基础与种类、形实参及映射、变量类型
---

## 函数基础与种类
### 1.函数组成
数学中，函数的基本定义，任意的 `x` 值，都有唯一确定的 `y` 与之对应，`y=f(x)`。函数值是确定的，即有确定性。

函数的组成： function函数名 参数 返回值。   
```javascript
function test(a, b, c){
  // ...
}
```
**耦合**：代码的重复性太高了<br>
**高内聚，低耦合**：（有强的功能性，有高的独立性） => 模块的单一责任制<br>
**解耦合**：解耦合的最好方法是基于函数的<br>
**高内聚**：开发的一个功能，我们称之为模块，它的代码相关性强，也就是说它内部的代码紧密联系度比较强，它的联系度相关性强的话就会让这个模块（功能）的独立性就强，我们希望一个模块去独立地完成一个任务，而这个任务完成的好坏，是跟高内聚有关系的。<br>
**低耦合**：耦合就是指各个代码块里面的重复的代码。我们希望把重复的代码给抽象出来（提取出来），成为一个独立的功能体*模块）去完成一个特定的功能。<br>
**解耦合**：就是把代码里面的重复的代码抽象出来，而函数可以很好的解耦合<br>
**模块的单一责任制**：我们希望一个功能的代码它是单一责任制的，也就是说把它负责的模块做好就行，尽量避免依赖其他模块<br>
**高内聚，低耦合的目的**：就会让一个功能体（代码块、模块），它有强的功能性，有高的独立性。

### 2.函数声明
```javaScript
function test(参数){
  // 执行语句
}
```
### 3.函数调用
调用多少次，执行多少次，不调用不会执行
```javascript
function test(){
  console.log('前端学习');
}
test();
test();
```

### 4.命名规则
1. 不能数字开头
2. 字母 _ $
3. 包含数字
4. 小驼峰命名法 复合单词myWonderfulTest


### 5.函数声明的方法
```javascript
function test(){
  var a = b = 1;
  console.log(a, b); // 1 1
}
test();
console.log(a); // 报错
console.log(b); // 1
```

### 6.表达式
函数表达式 => 也叫函数字面量
```javascript
var test = function test1() {
    var a = 1,
        b = 2;
    console.log(a,b);
    // test1();    // function后面的名字是可以在函数体内部去调用的,但是外部不可见
}
console.log(test.name); // test1
// test1(); // Uncaught ReferenceError: test1 is not defined
test();  // 1 2
```
上面函数名为`test1`，调用函数是`test()`而不是`test1()`，`test1`是自动被忽略的，写与不写对函数执行都没有影响。省略了`test1`的函数为匿名函数表达式，`test1`的作用是可以在函数内部调用函数，也就是递归的使用。

### 7.匿名函数
1. 匿名函数表达式也叫函数字面量
2. 用表达式定义一个函数的时候，它其实是匿名函数
```javascript
var test = function() { // -> 匿名函数
    var a = 1,
        b = 2;
    console.log(a,b);
}
test();
```

## 函数的参数
### 1.参数可以在函数被调用时赋值
形参：形式上的占位，需要等到函数执行的时候传进来。 
实参：实际传递到函数的参数，它有实际的值。
```javascript
var aa = Number(window.prompt('a'));
var bb = Number(window.prompt('b'));

function test(a, b) { // a,b形参（形式参数）=> 形式上的占位
    console.log(a, b);
}

test(aa, bb);// 实参（实际参数）
```
### 2.形参和实参数量可不相等
1. 形参与实参是一一对应的
2. 参数是什么数据类型都可以传递进去
3. 形参与实参数量不一致不会报错
4. 形参 > 实参，没有传值的形参的值是undefined
5. 实参 > 形参，只按照位置一一对应。多出来的就不赋值，但是存在。
```javascript
function test(a, b, c){
  console.log(a, b, c);
}
test(1, 2); // 1 2 undefined
```
### 3.实参与形参的长度
`arguments`是传入的实参的值。通过遍历`arguments`可以看到实参的值。
```js
function test(a, b) {
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]); // 1 2 3
  }
  console.log(test.length); // 形参的长度 2
  console.log(arguments.length); // 实参的长度 3
}
test(1, 2, 3);
```

`a, b`是函数的形参，起到占位的作用，调用函数传入的参数是函数的实参，即`1,2,3`。   

### 4.例题
1. 一个函数被调用时累加它的实参值
```js
function sum(){
    var s = 0;
    for(var i = 0; i < arguments.length; i++){
        a += arguments[i];
    }
    console.log(a);
}
sum(1,2,3,4,5,6);
```

2. 实参里面传了值，函数里面可以更改实参的值。
```js
function test(a, b) {
  a = 3;
  console.log(arguments[0]); // 3 函数内部可以修改实参的值。
}
test(1, 2);

function test2(a, b) {
  b = 3;
  console.log(arguments[1]); // undefined 实参b并没有传入
}
test2(1);
```

1. 函数实参传了值的可以在函数内部修改实参的值，而不传入的实参，函数内部给形参赋值是无效的。
2. `a`和`arguments[0]`不是同一个量，`a`是存在栈内存中的，`arguments`是存储在堆内存中的数值，栈内存中存储指向堆内存的地址。
3. 虽然不是一个变量，但是系统内部有映射关系。
4. 无论你的实参怎么赋值，你的形参都会跟着变。但是一定是一一对应参会有映射关系。

## return
执行`return`后，后面的语句将不会再执行。可以用`return`来终止函数的执行，返回相应的值。
### 1.终止函数的执行
```js
function test() {
  console.log("我正在执行");
  return;
  console.log("我是test函数"); // 不执行
}
```

### 2.可以返回值
返回相应的值也终止函数的执行
1. 使用if条件语句判断
```javascript
function test(name) {
    if(!name) {
        return '您没有填写姓名!';
    }
    return name;
}
console.log(test()); // 你没有填写姓名!
```
2. 或||运算和return配合使用
```javascript
function test(name){
  return name || '您没有填写姓名'
}
console.log('Tom');
```

## 变量类型
1. 如果变量未被定义直接打印这个变量的名称，报引用错误，用typeof()的时候不报错。
```javascript
b = 2;
function test() {
    var a = 1;
    console.log(b); // 2
}
test();
console.log(a); // Uncaught ReferenceError: a is not defined
console.log(typeof(a)); // undefined
```

2. 变量分为：全局变量和局部变量。函数体内部可访问外部的变量，而函数外部不能访问内部变量
```js
// 全局变量 [[scope]]
a = 1;
function test1(){
    // 局部变量
    var b = 2;
    console.log(a);

    function test2(){
        // 局部变量
        var c = 3;
        console.log(b);
    }
    test2();
    console.log(c);// 不能访问 Uncaught ReferenceError: c is not defined
}
```

## 函数参数的默认值

初始化参数，默认值：`undefined`。
```js
function test(a, b) {
  console.log(a); // undefined
  console.log(b); // undefined
}
test();
```
不给 `a` 和 `b` 传入参数，两者默认是 `undefined`

使用默认参数

```js
function test(a = 1, b = 2) {
  console.log(a); // 1
  console.log(b); // 2
}
test();
```
给a使用默认值，而b传入实参，此时给a传入实参undefined。
```js
function test(a = 1, b){
    console.log(a); // 1
    console.log(b); // 2
}
test(undefined, 2);
/*****************************/
function test(a = undefined, b){
    console.log(a); // 1
    console.log(b); // 2
}
test(1, 2); 
```
理解arguments实参和形参的关系，arguments[0]和形参a，哪个不是undefined，对应的值就是哪个。

有的浏览器不支持默认参数的情况，解决浏览器不支持默认参数的情况， 三种方式：

- 1. 使用`||`运算符

```js
function test(a, b) {
  var a = arguments[0] || 1;
  var b = arguments[1] || 2;

  console.log(a + b); // 3
}
test();
```

- 2. 使用`typeof`

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

## 练习
1. n 的阶乘，不使用 for 循环。 -> 递归

```js
// fact(n)
// 规律 : n! = n * fact(n-1)
// 出口 : n===1
function fact(n) {
  if(n === 1){
    return 1
  }
  return n * fact(n - 1);
}
// fact(5) = 5 * fact(4) -> 5 * 24
// fact(4) = 4 * fact(3) -> 4 * 6
// fact(3) = 3 * fact(2) -> 3 * 2
// fact(2) = 2 * fact(1) -> 2 * 1
```

2. 斐波那契数列
```js
// 规律： n3 = n2 + n1
// 出口： n <= 2 
function fb(n){
  if( n <= 2){
    return 1
  }
  return fb(n-1) + fb(n-2) 
}
// fb(5) = fb(4) + fb(3) -> 3 + 2
// fb(4) = fb(3) + fb(2) -> 2 + 1
// fb(3) = fb(2) + fb(1) -> 1 + 1

```

总结：递归总是在找到出口后，再一步一步向上计算出结果。递归需要注意两个因素：规律和出口
















## 预编译流程
1. 通篇检查语法错误
2. 预编译
3. 编译一行，执行一行


函数声明整体提升，变量只有声明提升，赋值不提升
```js
console.log(a) // undefined
var a = 10

/*******************************/
console.log(a); // function a(){...}
function a(){
    var a = 10;
    var a = function(){}
}
var a = 1;
```

## 暗示全局变量
```js
var a = 1
b = 2
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

```js
function test(){
  var a = b = 1
}
test();
console.log(window.b); // 1
console.log(windown.a); // undefined 访问对象中不存在的属性
console.log(a); // 报错
```
在函数内部没有声明变量而直接给变量赋值的，如`b`，就提升到全局变量。

## AO
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
## GO
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
例四
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
例六
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

面试题：
```js
var a = false + 1;
console.log(a); // 1
/**
有加号，所以false会转换为数字类型0
*/

/***********************/
var b = false == 1;
console.log(false);
/***********************/
if(typeof(a) && (-true) + (+undefined) + ''){
    console.log('通过了');
}else{
     console.log('没通过');
}
/**
typeof(a)返回'undefined' 
(-true) 转为 -1
+undefined 转为NaN
*/
/***********************/
if(1 + 5 * '3' === 16){
    console.log('通过了');
}else{
    console.log('没通过');
}
/**
5 * '3' 时，'3'要转换为数字类型3
*/
/***********************/
console.log(!!' ' + !!'' - !!false || '没通过');
/**
!!' ' 不是空字符串，是有一个空格
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




