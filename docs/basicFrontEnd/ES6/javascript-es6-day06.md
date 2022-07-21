---
autoGroup-1: ES6
sidebarDepth: 3
title: 6. this指向、箭头函数基本形式、rest运算符
---

## this指向总结
1. this：当前执行期上下文
2. this是当前执行期上下文的一个属性，也是一个特殊的对象
3. this引用的是函数依据执行是环境对象，非严格模式下指向一个对象，在严格末实现可以是任意值。

:::tip
1. 默认绑定规则，window，严格模式下 "use strict"  指向undefined
2. 隐式绑定：谁调用就指向谁
3. 显示绑定：call() apply() bind() 会转换包装类
4. new 实例化对象
5. 绑定失败，window
:::


## 箭头函数初始
箭头函数的目的用来稳定this指向，箭头函数的内部的this，在箭头函数声明的时候就已经完成了this固化指向。   
为什么说箭头函数不能通过new进行实例化对象的操作呢？   
因为在底层，箭头函数没有\[\[constructor]]属性的，而且箭头函数在声明的时候this已经固化，通过new关键字改变this指向，显然违背了箭头函数的目的，所以箭头函数不能实例化对象。如果通过new关键字对箭头函数进行实例化操作，浏览器会抛出箭头函数不能构造器的程序错误。

### 1. 箭头函数的基本使用
1. 当函数参数只有一个时省略参数（），函数体内只有一条语句，并且返回时，忽略return关键字和 { } 符号
```js
// ES6箭头函数
var f = a => a

-->

// ES5写法
var f = function(a) {
	return a;
}
```

2. 当函数参数不是一个情况的写法
```js
// ES6箭头函数
var f = () => 5;

var f = (a + b) => a + b;


// ES5写法
var f = function() {
	return 5;
}

var f = function(a, b) {
	return a + b;
}
```

3. 箭头函数和解构赋值一起使用

```js
// ES6箭头函数
const full = ( { first, last } = { } ) = > {
	frist + ' ' + last;
}
console.log(full({ frist: 3, last: 4 }));

// ES5写法
function full( {first, last} = { }) {
	return first + ' ' + last;
}
```

### 2. 箭头函数没有arguments
箭头函数中没有arguments，箭头函数中代替arguments的是...rest运算符

1. 箭头函数中不能使用arguments

```js
var sum = (a, b) => {
	console.log(arguments); // Uncaught Reference: arguments is not defined
	return a + b;
}
sum(1, 2);
```

2. 箭头函数的一般形式
```js
var arr = [12312, 31, 23, 1, 4, 124,32,5,3465,3];
var arr1 = arr.sort(
	(a, b) => a - b
);
```

## spread(...)展开运算符和rest运算符
二者用来收集或者展开数据，返回的是一个真正的数组

### 1. rest运算符
由于箭头函数中不能使用arguments，所以利用...rest运算符进行操作函数的参数，返回的数组叫做剩余参数。

1. 基本的使用方式

```js
// ...args剩余参数; args是变量
var sum = (...args) => {  // 收集
	console.log(args);  // [1, 2] 数组，真正的数组
}
sum(1, 2);
```

2. 具体示例
   
```js
let fn = (a, b, ...c) = > {
	console.log(a, b, c); // 1  2  [3, 4, 5, 6, 7]
}
fn(1, 2, 3, 4, 5, 6, 7);


// ES5数组排序
function sortNum() {
	return Array.prototype.slice.call(arguments).sort(function(a, b) {
		return a - b;
	})
}


// ES6数组排序
const sortNum = (...args) = > args.sort((a, b) = > a - b);
```

3. 扩展运算符必须是函数最后一个参数。SyntaxError: Rest parameter must be last formal parameter

```js
// ...rest运算符必须是最后一个参数
let fn = (...c, a, b) => {
	console.log(a, b, c); // SyntaxError: Rest parameter must be last formal parameter
}
fn(1, 2, 3, 4, 5, 6, 7);
```

4. 有函数默认值和rest的操作符就不能通过length访问到形式参数的长度

```js
(function (a) {
}).length   // 1
(function (...a){}).length // 0
(function (b, ...a){}).length // 1
(function (b, c, ...a){}).length // 2
```

### 2. spread(...)运算符
用来展开数组或者类数组对象的数据类型，和数组的concat方法功能相似
1. 基本的使用方式

```js
// ES6展开运算符
function  foo (x, y, z) {
	console.log(x, y, z); // 1 2 3
}
foo(...[1, 2, 3]); // 展开


// ES5模拟
function foo(x, y, z) {
	console.log(x, y, z);
}
foo.apply(null, [1, 2, 3,  4, 5 ]); 
// apply改变this指向,传参以数组的形式进行传递,函数参数接收的时候单一接收
```

2. 展开运算符与数组的concat方法

```js
// ES6展开运算符
let a = [ 2, 3, 4 ];
let b = [ 1, ...a,  5 ];
console.log(b); // [1, 2, 3, 4, 5]

// concat()方法
var a = [2, 3, 4];
console.log([1].concat(a, [5])); // [1, 2, 3, 4, 5]
```