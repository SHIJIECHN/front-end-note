---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: day10
---

## 目标
- for in， hasOwnProperty，in，instanceOf

## 对象属性遍历
实现链式调用
```js
var sched = {
  wakeup: function(){
    console.log('Running');
    return this; // *************
  },
  morning: function(){
    console.log('Going shopping');
    return this;
  },
  noon: function(){
    console.log('Having a rest');
    return this;
  },
  afternoon: function(){
    console.log('studying');
    return this;
  },
  evening: function(){
    console.log('Walking');
    return this;
  },
  night: function(){
    console.log('Sleeping');
    return this;
  }
}
sched().wakeup().morning().noon().afternoon().evening().night();
```
在方法中return this，实现链式调用

```js
var myLang = {
  No1: 'HTML',
  No2: 'CSS',
  Mo3: 'JavaScript',
  myStudyingLang: function(num){
    console.log(this['No' + num])
  }
}
myLang.myStudying(1); // HTML
```
对象属性访问


### for in
对象枚举属性 -> 遍历
```js
var arr = [1, 2, 3, 4, 5];
for(var i = 0; i < arr.length; i++){

}

var car = {
  brand: 'Benz',
  color: 'res',
  displacement: '3.0',
  lang: '5',
  width: '2.5'
}
for(var key in car){
  console.log(key + ':' + car[key]);
  //car.key => car['key'] => undefined
}

for(var i in arr){
  console.log(arr[i]);
}
```
for in 既可以遍历对象，也可以遍历数组

### hasOwnProperty
```js
var obj = {
  name: 'Tom',
  age: 20
}

function Car(){
  this.brand = 'Benz',
  this.color = 'red',
  this.displacement = '3.0'
}

Car.prototype = {
  lang: 5,
  width: 2.5
}

Object.prototype.name = 'Object';

var car = new Car();
console.log(car)

for(var key in car){
  if(car.hasOwnProperty(key)){
    console.log(key + ':' + car[key])
  }
}
```
for in 只要是自己定义的属性，即使在原型链上也能打印出来。
hasOwnProperty找对象自身的属性，排除自定义的原型链上的属性
```js
var car = {
  brand: 'Benz',
  color: 'red'
}
console.log('displacement' in car); // false

function Car(){
  this.brand = 'Benz',
  this.color = 'red',
}
Car.prototype = {
  displacment: '3.0'
}
var car = new Car();
console.log('displacement' in car); // true
```
### instanceOf
判断这个对象是不是该构造函数实例化出来的
```js
function Car(){}
var car = new Car();
console.log(car instanceOf Car); // true
console.log(car instanceOf Object); // true

function Person(){}
var p = new Person()

console.log([] instanceOf Array);// true
console.log([] instanceOf Object);// true
console.log({} instanceOf Object);// true

```
A对象的原型里有没有B的原型
### 判断数组
```js
var a = [] || {};
console.log(a.constructor); // f Array()
console.log(a instanceOf Array); // true

var str = Object.prototype.toString.call(a);
console.log(str); // [object Array]

Object.prototype = {
  toString: function(){
    this.toString()
  }
}
```
分析[object Array]
```js
var arr = new Array(1, 2, 3);
// 用数组自身的toString方法
console.log(arr.toString()); // 1,2,3
console.log(arr);

// 调用Object.prototype上的toString方法
console.log(Object.prototype.toString.call(arr)); //[object Array]
```
::: tip 判断数组的方法
- arr.constructor -> f Array()
- arr instanceOf Array -> true
- Object.prototype.toString.call(arr) -> [object Array]
:::

## this
函数内部的this，指向谁？
```js
function test(b){
  this.d = 3; // window.d = 3
  var a = 1; 
  function c(){}
}

test(123);

console.log(d);
console.log(window.d);
console.log(this.d);
/**
AO = {
  arguments: [1,2,3]
  this: window,
  b: undefined -> 123,
  a: undefined,
  c: function c(){}
}
*/
```
在全局中的this 
在函数内部的this 


```js
function Test(){
  var this = {
    __proto__: Test.prototype
  }
  this.name = '123'
}
var test = new Test();
/**
预编译
AO ={
  this: window
}

GO = {
  Test: function Test(){},
  test: {}
}
在new Test时，会在Test内部形成this，就会覆盖原来的this。
AO ={
  this: {
    name: '123',
    __proto__: Test.prototype,
  }
}
this就指向了实例化对象，test = new Test() 就相当于把this给了全局的test
GO = {
  Test: function Test(){},
  test: {
    name: '123',
    __proto__: Test.prototype,
  }
}
*/
```

call和apply
```js
function Person(){
  this.name = 'zhangsan',
  this.age = 18
}

function Programmer(){
  Person.apply(this);
  this.work = 'Programmer'
}
var p = new Programmer();
console.log(p);
```

::: tip
1. 全局this -> window
2. 预编译函数this -> window
3. apply/call -> 改变this指向
4. 构造函数的this -> 实例化对象
:::

## callee、caller
### callee
```js
function test(a, b, c){
  console.log(arguments.callee); // f test(){}  函数test本身
  console.log(arguments.callee.length); // 3 与test.length
  console.log(test.length); // 3 形参的长度
  console.log(arguments.length); // 2 实参长度
}
test(1, 2);
```
arguments.callee返回正在被执行的函数对象，也就是arguments所指向的函数是谁就返回谁。
实参列表arguments所对应的函数是谁就返回那个函数。

```js
function test1(){
  console.log(arguments.callee);
  function test2(){
    console.log(arguments.callee);
  }
}
```
应用：用递归的方式累加n位数
```js
function sum(n){
  if(n <= 1){
    return 1;
  }
  return n + sum(n - 1);
}
var res = sum(10);
console.log(res)
```
模块化实现
```js
var sum = (function(n){
  if(n <= 1){
    return 1;
  }
  return n + arguments.callee(n -1) // 找到的是函数，加括号执行
})(10);
console.log(sum)
```
### caller
```js
test1();
function test1(){
  test2();
}
function test2(){
  console.log(test2.caller);
}
```
test2.caller返回调用当前函数的函数，也就是谁当前调用了test2，就返回谁。严格模式下报错。

## 练习
1. 例一（笔试）
```js
function foo(){
  bar.apply(null, arguments);
}
function bar(){
  console.log(arguments); // 1,2,3,4,5
}
foo(1, 2, 3, 4, 5);
```
bar.apply()与bar.call()是一样的，所有的函数执行bar()，都有bar.call()执行的过程。

> bar() -> bar.call(arguments) -> bar(arguments)

bar.call(arguments)实际上执行的相当于bar(arguments)执行
```js
function foo(){
  bar(arguments);
}
```

2. 例二
js的typeof可能返回的值有哪些？
- object (包含了null)
- boolean
- number
- string
- undefined
- function
```js
function b(x, y, a){
  arguments[2] = 10;
  console.log(a); // 10
}
b(1,2,3);

/************************/
function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 10
}
b(1,2,3)

/************************/
var f = (
  function f(){
    return '1';
  },
  function g(){
    return 2;
  }
);
console.log(typeof f); // function 
console.log(typeof f()); // number
```

4. 例四
```js
console.log(undefined == null); // true
console.log(undefined === null); // false
console.log(isNaN(100)); // false
console.log(parseInt('1a') == 1); // true
```
实现isNaN
```js
function isNaN1(num){
  var res = Number(num) + '';
  if(res == 'NaN'){
    return true;
  }else {
    return false;
  }
}
console.log(isNaN1('abc')); // true
```

5. 例五
```js
console.log({} == {}); // false 
```
为什么？引用值存储在不同的空间里。   
如何相等？
```js
var obj1 = {};
var obj2 = obj1;
console.log(obj2 == obj1); // true
```
6. 例六
```js
var a = '1';
function test(){
  var a = '2';
  this.a = '3';
  console.log(a);
}
test(); // 2
new test(); // 2
console.log(a)// 3
/**
test(): 
GO = {
  a: '1',
  test: function test()
}
AO = {
  this: window,
  a: undefined -> '2'
}
*/

/************************/
var a = 5;
function test(){
  a = 0;
  console.log(a)
  console.log(this.a);
  var a;
  console.log(a);
}
test(); // 0 5 0
new test(); // 0 undifined 0  因为实例化后this指向实例，但是没有给实例a属性，所以为undefined

```