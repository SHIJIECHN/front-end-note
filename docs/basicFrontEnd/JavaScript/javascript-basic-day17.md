---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 17. 自定义原型方法、去重、封装typeof方法
---

## 自定义原型unshift方法
### 1. 利用数组的splice方法实现
```js
// 第一种方式
Array.prototype.myUnshift = function(){
  const length = arguments.length;
  // 从后往前遍历 arguments 
  for(var i = length - 1; i >= 0; i--){
    this.splice(0, 0, arguments[i]);
  }
  return this.length;
}

var arr = [1,2,3]
arr.myUnshift(4,5,6);
console.log(arr); // [4,5,6,1,2,3]

// 第二种方式
Array.prototype.myUnshift = function(){
  const length = arguments.length;
  var pos = 0;
  for(var i = 0; i < length; i++){
    this.splice(pos, 0, arguments[i]);
    pos++;
  }
  return this.length;
}

var arr = [1,2,3]
arr.myUnshift(4,5,6);
console.log(arr); // [4,5,6,1,2,3]
```

### 2. 利用数组concat方法实现
```javascript
Array.prototype.myUnshift = function(){
  // 类数组不是数组，所以不具有数据的concat方法，需要转为数组对象
  const arr = Array.prototype.slice.call(arguments);
  return arr.concat(this);
}

var arr = [1,2,3]
var arr1 = arr.myUnshift(4,5,6);
console.log(arr1); // [4,5,6,1,2,3]
```

## 数据类型判断
PS：数组的去重与typeof封装在上一节内容的练习部分
检测数据类型的方法：
1. typeof
2. instanceOf
3. constructor
4. Object.prototype.toString.call

### 1. typeof
```js
typeof 'a';         // 'string'
typeof 1;           // 'number'
typeof true;        // 'boolean'
typeof undefined    // 'undefined'
typeof Symbol('a'); // 'symbol'

typeof null         // 'object'

typeof function(){} // 'function;
typeof []           // 'object'
typeof {}           // 'object'
typeof /a/          // 'object'
typeof new Date()   // 'object'
typeof new Error()  // 'object'
typeof new Map()    // 'object'
typeof new Set()    // 'object'
```
总结：
1. typeof 可以判断除了null以外的原始类型。
2. typeof只能判断对象类型中的Function，其他判断不出来，都为object。

### 2. instanceOf
1. 检测构造函数的prototype属性是否出现在某个实例对象的原型上 
2. a instanceOf B判断的是：a是否为B的实例，即a的原型链上是否存在B的构造函数。
```js
console.log(1 instanceof Number) //false
console.log(new Number(1) instanceof Number) // true

const arr = []
console.log(arr instanceof Array) // true
console.log(arr instanceof Object) // true

const Fn = function() {
  this.name = '构造函数'
}
Fn.prototype = Object.create(Array.prototype)
let a = new Fn()
console.log(a instanceof Array); // true
```
总结：instanceof 可以准确判断对象(引用)类型，但是不能准确检测原始类型。

### 3. constructor
```js
// 需要加上一个小括号，小括号运算符能够把数值转换为对象
(1).constructor // ƒ Number() { [native code] }
// 或者
1..constructor // ƒ Number() { [native code] }

const a = 'a'
console.log(a.constructor) // ƒ String() { [native code] }
console.log(a.constructor === String) // true

const b = 5
console.log(b.constructor) // ƒ Number() { [native code] }
console.log(b.constructor === Number) // true

const c = true
console.log(c.constructor) // ƒ Boolean() { [native code] }
console.log(c.constructor === Boolean) // true

const d = []
console.log(d.constructor) // ƒ Array() { [native code] }
console.log(d.constructor === Array) // true

const e = {}
console.log(e.constructor) // ƒ Object() { [native code] }
console.log(e.constructor === Object) // true

const f = () => 1
console.log(f.constructor) // ƒ Function() { [native code] }
console.log(f.constructor === Function) // true

const g = Symbol('1')
console.log(g.constructor) // ƒ Symbol() { [native code] }
console.log(g.constructor === Symbol) // true

const h = new Date()
console.log(h.constructor) // ƒ Date() { [native code] }
console.log(h.constructor === Date) // true

const i = 11n
console.log(i.constructor) // ƒ BigInt() { [native code] }
console.log(i.constructor === BigInt) // true

const j = /a/
console.log(j.constructor) // ƒ RegExp() { [native code] }
console.log(j.constructor === RegExp) // true


String.prototype.constructor = 'aaa'
console.log(a.constructor === String) // false

const k = null
console.log(k.constructor) // Cannot read property 'constructor' of null

const l = undefined
console.log(l.constructor) // Cannot read property 'constructor' of undefined
```
总结：除了 null 和 undefined，constructor 可以正确检测出原始类型和对象(引用)类型

### 3. Object.prototype.toString
封装方法的时候注意大小写
```js
Object.prototype.toString({}) // '[object Object]'

Object.prototype.toString.call({}) // '[object Object]'
Object.prototype.toString.call('a') // '[object String]'
Object.prototype.toString.call(1) // '[object Number]'
Object.prototype.toString.call(true) // '[object Boolean]'
Object.prototype.toString.call(null) // '[object Null]'
Object.prototype.toString.call(undefined) // '[object Undefined]'
Object.prototype.toString.call(Symbol('a')) // '[object Symbol]'
Object.prototype.toString.call(11n) // '[object BigInt]'
Object.prototype.toString.call(/a/) // '[object RegExp]'
Object.prototype.toString.call(new Date()) // '[object Date]'
Object.prototype.toString.call([0, 1, 2]) // '[object Array]'
Object.prototype.toString.call(function() {}) // '[object Function]'
Object.prototype.toString.call(new Error()) // '[object Error]'
Object.prototype.toString.call(new Set()) // '[object Set]'
Object.prototype.toString.call(new Map()) // '[object Map]'
```

### 4. 封装检测数据类型通用方法
```js
function getType(obj){
  const type = typeof obj;
  if(type !== 'object'){
    return type;
  }
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

console.log(getType({})) // object
console.log(getType('a')) // string
console.log(getType(1)) // number
console.log(getType(true)) // boolean
console.log(getType(null)) // null
console.log(getType(undefined)) // undefined
console.log(getType(Symbol('a'))) // symbol
console.log(getType(11n)) // bigint
console.log(getType(/a/)) // regexp
console.log(getType(new Date())) // date
console.log(getType([0, 1, 2])) // array
console.log(getType(function() {})) // function
console.log(getType(new Error())) // error
console.log(getType(new Map())) // map
console.log(getType(new Set())) // Set
```

## 扩展

### 1. 闭包
```js
function Test(a, b, c){
    var d = 0;
    this.a = a;
    this.b = b;
    this.c = c;

    function e(){
        d++;
        console.log(d);
    }

    this.f = e;
}

var test1 = new Test();
test1.f(); // 1
test1.f(); // 2

var test2 = new Test();
test2.f(); // 1

/**
 * 1. 当函数Test被定义的时候产生AO
 * AO = {
 *  d: undefined
 * }
 * 2. 当函数被new Test()执行后
 * AO = {
 *  d: 0
 * }
 * 并且隐式创建
 * var this = {
 *  f: function(){}
 * }
 * return this
 */
```

### 2. 数据类型
```js
function test() {
    console.log(typeof(arguments)); // object 类数组
}
test();


var test = function a() {
    return 'a';
}

console.log(typeof(a)); // undefined typeof没有声明的变量就是string类型的undefined
console.log(a); //Uncaught ReferenceError: a is not defined
/**
 * 函数表达式忽略函数名，即外界打印是不存在的，在外界调用a()，会报错，在函数里面可以执行
 */

```
总结：
1. 立即执行函数忽略函数名
2. 表达式忽略函数名

### 3. 数组特性与稀松数组
```js
function test(day) {
    switch (day) {
        case 1:
            console.log('Mon');
            break;
        case 2:
            console.log('Tue');
            break;
        case 3:
            console.log('Wed');
            break;
        case 4:
            console.log('Thu');
            break;
        case 5:
            console.log('Fir');
            break;
        case 6:
            console.log('Sat');
            break;
        case 7:
            console.log('Sun');
            break;
        default:
            console.log('I don\'t kown');
    }
}
// 简化
function test(day) {
    var weekday = ['Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'];
    weekday[day - 1] !== undefined ?
        console.log(weekday[day - 1]) :
        console.log('I don\'t kown');
}
// 去掉day - 1  优化
function test(day) {
    var weekday = [, 'Mon', 'Tue', 'Wed', 'Tue', 'Fri', 'Sat', 'Sun'];
    weekday[day] !== undefined ?
        console.log(weekday[day]) :
        console.log('I don\'t kown');
}
```
