---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 9.构造函数及实例化原理、包装类
---

## 构造函数实例化原理

### 1. 构造函数实例化对象
```js
function Car(color, brand){
    this.color = color;
    this.brand = brand;
    this.drive = function(){
        console.log("I am running");
    }
}
var car = new Car('red', 'Mazda');
console.log(car.color);// red
```

### 2. this指向
只定义构造函数，没有执行`this`不存在。  
当执行
```js
Car();  // 执行函数
```
函数执行，可以在作用域链中找到函数`AO`，`AO`里面保存了`this`对象，`this`指向`window`。  
`this`什么时候存在呢？   
如果不实例化构造函数，`this`指向`window`。当实例化构造函数后，`this`的指向发生改变，指向实例化的对象。
```js
var car = new Car() // this = car 实例化构造函数
console.log(car.color); // 实际上访问的是这份对象里的color
```

总结：
1. 没有执行的时候，没有意义。
2. 执行了this就存在，没有实例化的时候，this指向window，this.color = 'red'等于window.color = 'red'。
3. 实例化构造函数以后this指向实例化的对象。

### 3. this在不同的实例里面指向不同
```javascript
function Car(color,brand) {
  this.color = color;
  this.brand = brand;
}
var car1 = new Car('red','Benz');
var car2 = new Car('black','Mazda'); 
console.log(car1.color); // red
console.log(car2.color); // black
```
总结：
1. 被实例化出来的对象里的this一定是指向对象的，一定不是指向构造函数本身的。
2. 它必须是需要通过new这个关键字实例化的对象它才会去指向我们实例化的对象。
3. 如果不实例化的话它就指向window。
4. car1.color, car2.color是同一个构造函数出来的东西。

### 4. `new`一个对象发生了什么  

当构造函数被实例化时，相当于`Car()`执行了，一旦要执行就会有AO，AO产生后自动默认保存`this`
```js
Ao = {
    this：{}
}
```
`this`保存为空对象，当`new`对象时，相当于把`Car()`中的内容都跑完了
```js
Ao = {
    this：{
        color: color,
        brand: brand
    }
}
```

总结：`new` 时相当于系统帮你把`this`指向实例化对象
- 1. 保存一个空的`this`对象
- 2. 执行构造函数内容，将 `[this.属性]` 赋给`this`
- 3. 隐式在最后`return this`

```js
/**
 *分析GO AO
GO = {
    Car: (function),
    car: {
        color: 'red',
        brand: 'Benz'
    }
}

AO = {
    this: {
        color: color,
        brand: brand
    }
}
*/
function Car(){
    /** 隐式
    this: {
        color: color,
        brand: brand
    }
    */
    this.color = color;
    this.brand = brand;
    // 隐式
    // return this;
}

var car1 = new Car('red', 'Benz');
```
模拟`new`操作：
```js
function Car(color, brand){
    var me = {};
    me.color = color;
    me.brand = brand;
    return me;
}
var car = Car('red', 'Mazda');
```
模拟实现`new`
1. 创建一个空对象，作为将要返回的对象
2. 将空对象的原型指向构造函数的prototype属性。这一步是让这个对象能沿着原型链去使用构造函数中的prototype上的方法
3. 将空对象赋值给构造函数内部的this。这一步作用是让构造器中设置再this上的属性最终设置再这个对象上。
4. 返会这个对象
```javascript
/**
 * var o = _new(F, 'a', 30) 与new F('a', 30)效果相同
 * 1. arguments获取调用_nw式传入的实参。并不是真正的数组
 * 2. 调用_new 时，传入的第一个参数就是构造器
 * 3. shift的作用：取出数组的第一个元素（构造器），同时会修改原arguments数组
 * 4. 保持原型链
 * 5. 调用构造器，并将内部的this用obj来替代，此时arguments是取出第一个元素后的部分
 * 6. 兼容返回值
 */
function _new(fn,) {
  var obj = {};
  var co = [].shift.call(arguments);
  obj.__proto__ = co.prototype;
  var rs = co.apply(obj, arguments);
  return typeof rs === 'object' ? rs : obj;
}
```


### 5. 构造函数return问题
```js
function Car(color, brand){
    this.color = color;
    this.brand = brand;

    //return 123; // 依旧是return this
    return {}; // {} []
}
var car = new Car('red', 'Benz');
```
构造函数里面，原本是隐式`return this`。
- 如果`return`引用值，构造函数的返回值就是引用值
- 如果`return`原始值，构造函数的返回值不会改变还是`return this`。


## 包装类

### 1. 案例一
```js
var a = 1; // 原始值
console.log(a); // 1

// new Number()是一个内置的方法，当一个数字经过new Number()之后
// 实例化了一个对象，叫数字对象
var b = new Number(a);
b.len = 1;
b.add = function(){
  console.log(1);
}
console.log(b); // Number{1, len: 1, add: f}
// 经过new Number()包装后再参与运算的时候又返回到原始值
var d = b + 1;
console.log(d); // 2 参与运算，返回的是原始值
```
总结：
1. 原始值没有自己的方法和属性
2. new Number()是一个系统内置的构造方法，当一个数字经过new Number()之后实例化了一个对象，叫数字对象。
3. 经过new Number()包装后再参与运算的时候又返回到原始值。

系统内置的构造函数有三种：
- `new Number`
- `new String`
- `new Boolean`

### 2. 案例二
```js
// undefined 和 null 是可以经过包装的
consoole.log(new Number(undefined)); // 对象 NaN
consoole.log(new Number(null)); // 0

console.log(new String(undefined)); // "undefined"
console.log(new String(null)); // "null"

// undefined 和 null 是不可以设置任何属性和方法的。
console.log(undefined.length); // Uncaught TypeError: Cannot read properties of undefined
console.log(null.length); // Uncaught TypeError: Cannot read properties of null
```
总结：
1. `undefined` 和 `null` 是可以经过包装的
2. `undefined` 和 `null` 是不可以设置任何属性和方法的。

### 3. 案例三
```js
var a = 123;
a.len = 1;
// new Number(123).len = 3 保存不了，所以又删除
console.log(a.len);// undefined 原始值没有属性和方法
```
当给原始值a加上属性len的时候，系统会使用newNumber(a)包装下，然后把len属性放到new Number(a)上，但是系统没有保存new Number(a).len，所以就删除了这个属性。

### 4. 案例四：string的length属性
```javascript
var str = 'abc';
console.log(str.length);
```
为什么`string`可以有`length`？-->通过包装类来访问（或者说字符对象即`new String()`, 有这个属性）
```js
var str = 'abc';

str.length = 1; // 原始值，new String(str).length = 1; (执行后发现没地方保存)
//delete 

// 又重新包装了一次  new String(str).length 经过包装类来访问
console.log(str.length);
```

### 5. 案例五：数组的截断
数组可以通过`length`属性来截断
```js
var arr = [1, 2, 3, 4, 5];
arr.length = 3;
console.log(arr); // [1, 2, 3]

arr.length = 6;
console.log(arr); // [1, 2, 3, empty, empty, empty]
```

### 练习
### 1. 例一（笔试题）
```js
var name = 'languiji';
name += 10;  // languiji10

var type = typeof(name); // 'string'
if(type.length === 6){
  type.text = 'string'; // type是原始值，那你是顾客你要求的所以只能给你操作一遍
  // new String(type).text = 'string'; 执行完之后发现没有地方储存，所以自动删除
  // delete
}

console.log(type.text); // undefined
```
偏要让你输出type.text，怎么办？
```js
var type = new String(typeof(name));
```

### 2. 例二
```js
function Car(brand, brand){
  this.brand = 'Benz';
  this.color = 'red';
}

var car = new Car('Mazda', 'blank');
console.log(car); // Car {brand: 'Benz', color: 'red'}  没有把参数赋值，所以还是原来写好的值
```

### 3. 例三（笔试题）
```js
function Test(a, b, c){
  var d = 1;
  this.a = a;
  this.b = b;
  this.c = c;

  function f(){
    d++;
    console.log(d); // 先d++再打印的d, 所以加了1
  }

  this.g = f;
  // return this; -> 闭包。把Test构造函数的AO带出去了
}

var test1 = new Test();
test1.g(); // 2
test1.g(); // 3

var test2 = new Test();
test2.g(); // 2
```
### 4. 例四（预编译）
```js
var x = 1,
    y = z = 0;
function add(n){
  return n = n + 1;
}

y = add(x);

function add(n){
  return n = n + 3;
}

z = add(x);

console.log(x, y, z); // 1  4  4

/**
GO = {
  x: undefined -> 1,
  y: undefined -> 0 -> 4,
  add: function add(){n+1} -> function add(){n+3},
  z: 0 -> 4,
}

AO = {
  n: undefined -> 1
}
*/
```

### 5. 例五（立即执行函数）：下列函数哪个能输出1,2,3,4,5
```js
function foo1(x){
  console.log(arguments); 
  return x;
}
foo1(1,2,3,4,5)

function foo2(x){
  console.log(arguments); 
  return x;
}(1,2,3,4,5); // 这个函数没有执行，被看成函数声明 和 一个表达式(1,2,3,4,5)
// function foo2(x){
//   console.log(arguments); 
//   return x;
// } 
// (1,2,3,4,5)

(function foo3(x){
  console.log(arguments); 
  return x;
})(1,2,3,4,5)
```
foo1和foo3
> arguments存储传递的所有实参，不管你形参有几个，你实参传了几个都会被存储进去

### 6. 例六（参数的映射关系）
```js
function b(x, y, a){
  a = 10;
  console.log(arguments[2]); // 实参

  // 另一种
  arguments[2] = 10;
  console.log(a); // 映射关系
}
b(1,2,3); // 10
```
### 7. 例七（ASCII码）

- ASCII码：表1（0 - 127），表2（128 - 255） 所有字符都是1个字节 byte
- Unicode码 涵盖ASCII码  256以后是2个字节.  

打印在Unicode中的位置`charCodeAt`方法：
```js
var str = 'a'
var pos = str.charCodeAt(0);
console.log(pos); // 97
```

## 作业
### 1. 写一个函数，接受任意一个字符串，算出这个字符串的总字节数
```js
function calculateByte(str){
  var totalByte = 0;
  for(var i = 0; i < str.length; i++){
    var pos = str.charCodeAt(i)
    if(pos < 256){
      totalByte += 1;
    }else {
      totalByte += 2;
    }
  }
  return totalByte;
}
console.log(calculateByte('123456是'))

// 老师写
function getBytes(str){
  var bytes = str.length;
  for(var i = 0; i < str.length; i++){
    var pos = str.charCodeAt(i);
    if(pos > 255){
      bytes++
    }
  }
  return bytes;
}

console.log(getBytes("你好，世界！Hello world!"))
```
结论：一个中文符是两个字节

