---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 13. 对象属性遍历、this、caller_callee
---

## 对象属性遍历
### 1. 实现链式调用
```js
// 1. 写一个sched对象
var sched = {
  // 2. 对象里面写方法
  wakeup: function(){
    console.log('Running');
    // 这个this指向sched
    // 每一个里面都return this的原因：
    // 执行这个方法把对象return出去，只要对象return出去了以后下面可以继续用点语法。
    return this; // *******返回this******
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

### 2. 对象的处理
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

// var obj = {
//     name: '123'
// }
// console.log(obj['name']); // 123
```
总结：
1. 最早的JS引擎对对象的处理都是`obj['name']`。
2. 有.语法以后`obj.name` --> `obj['name']`。


## 对象的枚举
### 1. 遍历数组
```javascript
var arr = [1, 2, 3, 4, 5];
for(var i = 0; i < arr.length; i++){
    console.log(i);
}
```
总结：
1. 一组有共同特征的集合叫枚举，JavaScript实际上就是对象。
2. 有枚举就一定有遍历。
3. JavaScript当中数组是特殊的对象，数组是引用值，对象本身也是引用值。

### 2. for in遍历对象
对象枚举属性 -> 遍历
```js
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
```
### 3. for in遍历数组
```javascript
var arr = [1, 2, 3, 4, 5];
for(var i in arr){
  console.log(arr[i]); // 1 2 3 4 5 
}
```
`for in` 既可以遍历对象，也可以遍历数组。

### 4. hasOwnProperty排除原型属性
```js
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
/**
brand:Benz 
color:red 
displacement:3.0 
*/
```
`for in`只要是自己定义的属性，即使在原型链上也能打印出来。
`hasOwnProperty`找对象自身的属性，排除自定义的原型链上的属性。

### 5. in判断属性是否在对象内
#### 案例一
```js
var car = {
  brand: 'Benz',
  color: 'red'
}
// 隐式的找car['displacement']
console.log('displacement' in car); // false

```

#### 案例二
```javascript
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
### 6. instanceOf
判断这个对象是不是该构造函数实例化出来的
```js
function Car(){}
var car = new Car();
console.log(car instanceOf Car); // true
console.log(car instanceOf Object); // true car的原型链上有Object.prototype

function Person(){}
var p = new Person()

console.log([] instanceOf Array);// true 
console.log([] instanceOf Object);// true []的原型链上有Object.prototype
console.log({} instanceOf Object);// true
```
`A instanceof B` : `A`对象的原型里到底有没有`B`的原型。在原型链上面，只要他们重合的都是true。

#### 判断数组
```js
var a = [] || {};
// 方法一
console.log(a.constructor); // f Array()
// 方法二
console.log(a instanceOf Array); // true
// 方法三
var str = Object.prototype.toString.call(a);
console.log(str); // [object Array]
if(str === '[object Array]'){
    console.log('是数组');
}else {
    console.log('不是数组');
}

// Object.prototype = {
//   toString: function(){
//     this.toString(); // this指向对象本身 a.toString
//   }
// }
```
::: tip 判断数组的方法
- 1. `arr.constructor` -> `f Array()`
- 2. `arr instanceOf Array` -> `true`
- 3. `Object.prototype.toString.call(arr)` -> `[object Array]`
:::

#### 原型方法的重写
```js
var arr = new Array(1, 2, 3);
// 用数组自身的toString方法
console.log(arr.toString()); // 1,2,3
console.log(arr); // [1, 2, 3]

// 调用Object.prototype上的toString方法
console.log(Object.prototype.toString.call(arr)); //[object Array]
```


## this指向问题
1. 全局`this` -> `window`
2. 预编译函数`this` -> `window`
3. `apply/call` -> 改变`this`指向
4. 构造函数的`this` -> 实例化对象

### 1. 函数内部的this和全局this
```js
function test(b){
  this.d = 3; // this.d = 3--> window.d = 3
  var a = 1; 
  function c(){}
}

test(123);

console.log(d);
console.log(window.d);
console.log(this.d); // 全局的this 指向window
/**
AO = {
  arguments: [123]
  this: window,
  b: undefined -> 123,
  a: undefined,
  c: function c(){}
}
*/
```
总结：
1. 在普通函数内部只要你没有实例化这个函数，这个函数的this是默认指向window的。
2. 这个this在全局范围内也是指向window的。

### 2. 构造函数的AO
构造函数的`this`
```js
function Test(){
//   var this = {
//     __proto__: Test.prototype
//   }
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

### 3. `call`和`apply`
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

:::

## callee与caller
### 1. callee
```js
function test(a, b, c){
  // callee返回正在被执行的函数
  console.log(arguments.callee); // f test(){}  函数test本身
  console.log(arguments.callee.length); // 3 与test.length
  console.log(test.length); // 3 形参的长度
  console.log(arguments.length); // 2 实参长度
}
test(1, 2);
```
总结：
1. `arguments.callee`返回正在被执行的函数对象，也就是`arguments`所指向的函数是谁就返回谁。
2. 实参列表`arguments`所对应的函数是谁就返回那个函数。


#### callee使用
自执行函数没有函数名，就可以使用callee。  
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
### 2. caller
```js
test1();
function test1(){
  test2();
}
function test2(){
  console.log(test2.caller); // f test1(){}
}
```
总结：
1. `test2.caller`返回调用当前函数的函数，也就是谁当前调用了`test2`，就返回谁。
2. 严格模式下报错。

## 练习
### 1. 例一：改变this指向
```js
function foo(){
  bar.apply(null, arguments);
}
function bar(){
  console.log(arguments); // 1,2,3,4,5
}
foo(1, 2, 3, 4, 5);
```
`bar.apply()`与`bar.call()`是一样的，所有的函数执行`bar()`，都有`bar.call()`执行的过程。

> bar() -> bar.call(arguments) -> bar(arguments)

`bar.call(arguments)`实际上执行的相当于`bar`(arguments)执行
```js
function foo(){
  bar(arguments); // 也即 console.log(arguments)
}
```

### 2. 例二：typeof
`js`的`typeof`可能返回的值有哪些？
- `object` (包含了`null`)
- `boolean`
- `number`
- `string`
- `undefined`
- `function`

### 3. 例三：参数映射
```js
function b(x, y, a){
  arguments[2] = 10;
  console.log(a); // 10
}
b(1,2,3);


function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 10
}
b(1,2,3)

```

### 4. 例四：逗号运算符+typeof
```javascript
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

### 5. 例五
```js
console.log(undefined == null); // true
console.log(undefined === null); // false
console.log(isNaN(100)); // false
console.log(parseInt('1a') == 1); // true
```
实现`isNaN`
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

### 6. 例六
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

### 7. 例七
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
// 因为test()执行的时候this.a->window.a->，所以在最后打印的输出是3

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
/**
分析：
1. test()
AO = {
    this:window,
    a:undefined -> 0
}
GO = {
    a: undefinde -> 5
}

2. new test()
AO = {
    a: undefined -> 0,
    this: {
        // 没有属性
    }
}
GO = {
    a: undefined -> 5
}
*/
```
