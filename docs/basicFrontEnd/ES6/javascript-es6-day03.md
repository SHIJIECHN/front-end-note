---
autoGroup-1: ES6
sidebarDepth: 3
title: 3. let进阶、const、全局变量与顶层对象
---

## let进阶知识，以及块级作用域的产生

### 1. ES6转为ES5时块级作用域的产生
1. let与for的（）产生块级作用域，而for的 {} 本身也是块级作用域，所以一共产生两个块级作用域
```js
for(let i = 0; i < 10; i++) {
	i = 'a';
	console.log(i);
}

// 分析
	
{
  let i = 0;
  {
    i = 'a';
    console.log(i);
  }
}
```
2. let与for的（）产生块级作用域，而for的 {} 本身也是块级作用域，在for的（）块级作用域中声明变量let i，而在for的 {} 块级作用域内声明变量var i，从而形成父子块级作用域；但是var存在变量提升的问题，所以变量提升到上层块级作用域内，导致在同一个作用域内部重复声明变量，则会抛出异常 SyntaxError: Identifier 'i' has already been declared

```js
for(let i = 0; i < 10; i++) {
	var i = 'a';
	console.log(i);
}

// 分析
{
	let i = 0;
	{
		var i = 'a'; // var声明存在变量提升的问题
	}
}


{
	let i = 0;
	var i = undefined; // 同一作用域下let重复声明变量
	{
		i = 'a'; 
	}
}
```

3. let与for的（）产生块级作用域，而for的 {} 本身也是块级作用域，在for的（）块级作用域中声明变量let i，而在for的 {} 块级作用域内声明变量 let i，虽然变量i被声明两次，但是每个i变量独立存在不同的块级作用域内部，所以不会抛出异常

```js
for(let i = 0; i < 10; i++) {
	let i = 'a';
	console.log(i);
}

// 分析
{
	let i = 0;
	{
		let i = 'a';
	 	console.log(i); // 'a'
	}
}
```
4. 经典闭包问题，首先通过for循环向数组中存入匿名函数function，此时匿名函数是个闭包函数，那么闭包的特性是什么呢？闭包函数和外界的作用域环境捆绑在一起，所以for循环的每一次都会产生一个闭包函数function，并且这个闭包函数将当前所处的块级作用域一并存入到数组中；第二次for循环执行每一个闭包函数，打印i时，闭包函数就会顺着作用域链中找到保存的块级作用域中的i变量进行打印0-9

```js
var arr = [];
for(let i = 0; i < 10; i++) {
	arr[i] = function() {
		console.log(i); // 0-9
	}
}

for(var k = 0; k < 10; k++){
	arr[k]();
}

// 分析

{
	let i = 0;
	{
		// 整个块级作用域保存在数组中
		arr[i] = function() { // 闭包函数
			console.log(i);
		}
	}
}
```

## 块级作用域中变量声明提升，函数声明提升
var声明的变量不受块级作用域的限制，变量声明会提升到顶层的作用域中。函数声明提升到当前块级作用域的顶端。
1. var 的变量声明提升（块级作用域中）；由于var声明的变量不受块级作用域的限制，所以变量i会提升到最顶层的块级作用域中，导致同一作用域中重复声明同一变量i，程序抛出异常。
```js
{
	let i = 2;
	{
		let c = 3;
		{
			var i = 1;
		}
	}
}
```
2. 虽然在块级作用域内部以函数声明的方式声明函数是不推荐的，但是为了探讨这个问题，我们尝试处理一下；函数声明提升到当前块级作用域的顶端
```js
// 同一块级作用域重复声明变量
{
	let a = 1;
	function a(){
		
	}
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}


// 函数声明提升到当前块级作用域顶端
{
	let a = 1;
	{
		function a(){
		
		}
	}
	console.log(a); // 1
}


// 利用函数的表达式代替函数声明
let a = 1;
{
	var test = function(){
		console.log(10);
	}
}
console.log(a);
```

## const
const定义常量，变量是可变的量，常量就是不可变的量
### 1. const的特性
1. 常量被定义时必须赋值，值是不能被改变的。SyntaxError: Missing initializer in const declaration
```js
const a;
console.log(a); // SyntaxError: Missing initializer in const declaration
```
2. 常量const存在暂时性死区的问题，能够像let一样产生块级作用域。      ReferenceError: Cannot access 'a' before initialization
```js
{
	console.log(a); // ReferenceError: Cannot access 'a' before initialization 初   始化之前无法访问变量a;
  const a = 2;
}
```
3. const也不允许在同一块级作用域内重复声明。SyntaxError: Identifier 'a' has already been declared

```js
{
	const a = 2;
	var a = 3;
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}
```
4. const对于原始值数据类型来讲，因为原始值直接存储在栈内存当中，所以被const声明的原始值数据是不可以再次更改的；而对于引用值来讲，引用值将值存储在堆内存中，而栈内存中存储的是指向值的指针，所以被const声明的引用值，可以说保证的是指针不能改变，而并不是数据内部的结构。
```js
// 改变指针
const obj = {};
obj = [];
console.log(obj); 
// TypeError: Assignment to constant variable. 不能更改一个常量的值。

// 改变内部数据结构
const obj = {}
obj.name = 'zhangsan';
console.log(obj); // {name:'zhangsan'}
```

### 2. 冻结对象
针对const能够改变引用值内部的数据结构问题。如果我们不想让被const声明过的引用值能够改变内部的数据结构，就可以使用冻结对象这种方式，将引用值冻结。    
冻结对象，利用freeze方法，属于Object的静态方法。Object.freeze(obj)
1. 普通冻结
```js
const obj = {}
Object.freeze(obj);
obj.name = 'zhangsan';
console.log(obj); // {}
```
2. 递归冻结封装
```js
function myFreeze(obj){
  Object.freeze(obj);
  for(var key in obj){
    if(typeof(obj[key]) === 'object' && obj[key] !== null){
      Object.freeze(obj[key]);
    }
  }
}
```
## 顶层对象
顶层对象window的属性与全局变量时一种动态的绑定关系
```js
a = 1;
console.log(a); 
console.log(window.a); 
```
总结：
1. function var 声明的变量允许成为全局变量，挂载到window上。
2. let const class 是不允许成为全局变量，不会挂载到window上。
3. 浏览器环境顶层对象是window对象，node环境顶层对象是global。