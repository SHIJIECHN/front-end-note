---
autoGroup-2: ES6
sidebarDepth: 3
title: 8. 函数名/对象拓展、描述符、getter/setter
---

## 函数名扩展
1. 函数表达式的方式声明函数，获取匿名函数名称
```js
var f = function() {
	console.log(arguments.callee.name); // f
	console.log(f.name); // f
}
console.log(f.name); // f
```

2. 函数表达式的方式声明函数，获取函数的名称
```js
var f = function fn() {
	console.log(arguments.callee.name); // fn
	console.log(f.name); // fn
}
console.log(f.name); // fn
```

3. 获取构造函数的函数名称 anonymous 
```js
new Function(); // 构造函数
console.log(new Function().name); // anonymous 
```

## 对象的扩展
### 1. 对象属性的简写形式
当对象的属性名和属性值名称相同时，可以使用简写的方式。

1. 对象中属性与属性值的简写

```js
const foo = "bar";
const bar = {
	foo
}


const bar = {
	foo(属性名):foo(变量)
}
console.log(bar); // {foo: bar}
```

2. 函数形参中，对象的属性与属性值简写

```js
function foo(a, b) {
	console.log({a, b});
}
foo(1, 2);


function foo(a, b) {
	console.log({a(属性名): a(变量), b: b});
}
foo(1, 2);
```

3. 对象中方法与属性的简写

```js
let age = 12;
const person = {
	age: age,
	say:function(){
		console.log(this.age);
	}
}
person.say();


let age = 12;
const person = {
	age,
	say(){
		console.log(this.age);
	}
}
person.say();
```

4. 函数参数默认值与函数属性简写

```js
function foo(a = 1, b = 2) {
	console.log({a, b});
	//
	console.log({a: 1, b: 2})
}
foo();

//

let foo = (a = 1, b = 2) => ( { a, b } );
```

### 2. 对象属性名称的数据类型
对象的属性名称都是以字符串的形式存在，等于对象属性在设置时，利用相应数据类型原型上的toString方法进行包装。字符串包装时存在隐式转换的问题。

#### 1. 对象属性的读取方式
读取对象属性时，中括号语法中，如果参数是变量的话，就自动到上层作用域中寻找变量的引用，如果是普通的数据类型，则会将数据转化为字符串的形式，到对象中进行寻找读取属性值。
1. 对象属性的读取方式示例一

```js
var arr = [1, 23, 34, 45];
console.log(arr["1"]); // 23
console.log(arr[1]); // 23
```

2. 对象属性的读取方式示例二
隐式转换问题：在myObjcet\[myObject]发生了什么？   
首先myObject是变量，需要寻找变量的引用{}，因为对象属性名称是字符串的形式存在的，所以需要将{}转为字符串的形式，就需要调用到Object.prototype.toString()方法，{}转为字符串是[object Object]的形式，所以对象中属性的结构应该是{ ' [object Object] ' : bar }的形式。

```js
var myObject = {};
myObject[true] = 'foo';
myObject[3] = 'bar';
myObject[myObject] = 'baz';
console.log(myObject['true']); // foo
console.log(myObject['3']); // bar
console.og(myObject[myObject]); // baz
```

3. 当然属性名称转为字符串的形式，根据传入的参数数据类型决定调用哪个原型上面的toString方法，如果传入的是对象就调用Object.prototype，如果是数组就是Array.prototype。

#### 2. 对象属性名称的拼接
1. 对象属性名称拼接示例一

```js
let obj = {};
obj.foo = true;
obj['f' + 'o' + 'o'] = false;
console.log(obj); // {foo: false}
```

2. 对象属性名称拼接示例二

```js
let a = 'hello';
let b = 'world';
let obj = {
	[a + b] : true,
	['hello' + b] : 123,
	['hello' + 'world'] : undefined
}
console.log(obj);// { helloworld: undefined }
```

3. 对象属性名称重复，后者属性覆盖前者属性

```js
const a = { a: 1};
const b = {b: 2};
const obj = {
	[a]: 'valueA',
	[b]: 'valueB'
}
console.log(obj); // {[object Object]: "valueB"}
```

#### 3. 对象中方法名称的获取
```js
const person = {
	sayName(){
		console.log('hello');
	}
}
console.log(person.sayName.name); // sayName
```

## 描述符
ES5之前没有提供检测属性特征的方法，检测对象属性的属性描述符；ES5之后提供getOwnPropertyDescriptor方法进行检测对象属性的描述符。

### 1. Object.getOwnPropertyDescriptor
- 参数1：需要检测的对象
- 参数2：需要检测的对象属性
- 返回值：返回一个特定的对象属性的描述对象

```js
let obj = { a: 2 };
console.log(Object.getOwnPropertyDescriptor(obj, 'a')); 
/**
 * { 
 *  value: 2, 
 *  writable: true, 
 *  enumerable: true, 
 *  configurable: true 
 * }
 * */ 
```
属性描述符：
1. value: 属性值
2. writable：属性是否可写，默认false
3. enumerable：属性是否可枚举，默认false
4. configurable：属性是否可配置，主要针对删除属，默认false

### 2. Object.defineProperty
定义属性，能够修改一个已有属性，或者添加一个新的属性
 
1. 属性描述符
Object.defineProperty()方法默认定义的属性，属性描述符配置项默认都是false
- value： 属性值，默认值undefined
- writable：属性是否可写，默认false
- enumerable：属性是否可枚举，默认false
- configurable：属性是否可配置，主要针对删除属性，默认false
- get：属性的getter函数，如果没有getter，则为undefined，当访问属性时，会调用此函数
- set：属性的setter函数，如果没有setter，则为undefined，当属性被修改时，会调用此函数

2. defineProperty创建属性可读，可枚举，可删除
```js
let obj = {}
Object.defineProperty(obj, 'a', {
  value: 2,
  enumerable: true,
  writable: true,
  configurable: true
});
console.log(obj); // {a:2}
```

3. defineProperty创建属性可读，可枚举，不可删除
```js
Object.defineProperty(obj, 'a', {
  value:2,
	enumerable:true,
	writable:true,
	configurable:false 
});
delete obj.a; 
// 无法删除,静默失败 TypeError: Cannot delete property 'a' of #<Object>
console.log(obj);	// {a: 2}
```

4. 静默失败 TypeError: Cannot delete property 'a' of #<Object>
通俗来讲，代码没执行也没报错，这个就是静默失败；但是在严格模式下会抛出异常.

5. defineProperty创建属性只读不可写，可枚举，可删除；
```js
let obj = {};
Object.defineProperty(obj, 'a', {
	value:2,
	enumerable:true,
	writable:false,
	configurable:true
});
obj.a = 3;  // 属性不可写,但是可以通过delete删除;更改属性,静默失败
console.log(obj);	// { a: 2}
```

### 3. Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors()方法用来获取一个对象的所有自身属性的描述符。
1. 基本语法
```js
Object.getOwnPropertyDescriptors(obj)
```