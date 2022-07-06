---
autoGroup-2: ES6
sidebarDepth: 3
title: 2. 块级作用域与嵌套、let、暂时性死区
---


## 预解析的基本回顾
### 1.全局作用域
全局作用域下的预解析步骤：GO对象（函数执行前一刻产生）
1. 寻找变量声明
2. 寻找函数声明
3. 执行

### 2. 函数作用域
函数作用域下的预解析步骤：AO对象（函数执行前一刻产生）
1. 寻找函数声明与形式参数
2. 实际参数给形参
3. 寻找函数声明
4. 函数执行

## let与会计作用域的产生
ES5中存在var变量声明提升问题，随之带来重复声明变量覆盖问题，ES5通常通过立即执行函数，产生独立的作用域链解决这个问题；针对这种问题ES6中推出let、块级作用域语法，并且遵循kiss原则（keep it simple, stupid）。

## let与块级作用域的关系，以及let的特点
1. let语法产生了块级作用域，let的本质就是为js增加一个会计作用域
2. let所在的地方，就是块级作用域在的地方。let所在的块，会有块级作用域；let在全局，全局就是快；let在函数，函数就是块；let在for的不同位置，也会有不同的块。
3. 块级作用域：if(){}, for(let i = 0; i < 10; i++)

### 1. let不能在同一个作用域下重复声明
1. 在全局作用域或者函数作用域中，利用var声明变量，重复声明变量的话，后面声明的变量将覆盖之前声明的变量。
```js
var a = 1;
var a = 2;
console.log(a); // 2

function fn() {
	var a = 1;
	var a = 2;
	console.log(a); // 2
}
fn();
```
2. 如果是用let进行变量声明的话，程序会抛出异常，SyntaxError: Identifier 'a' has already been declared

```js
let a = 1;
let a = 2;
console.log(a); // SyntaxError: Identifier 'a' has already been declared

function fn() {
	let a = 1;
	let a = 2;
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}
fn();
```

3. 如果是var声明变量与let声明变量同时存在同一作用域下，程序也会抛出异常SyntaxError: Identifier 'a' has already been declared，var首先声明变量a，但是又通过let进行声明变量a，而在同一作用域下，let是不允许重复声明同一个变量的。
```js
var a = 1;
let a = 2;
console.log(a); // SyntaxError: Identifier 'a' has already been declared

function fn() {
	var a = 1;
	let a = 2;
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}
```

4. 如果在函数内部，let声明形式参数，此时程序也会抛出异常；因为形参a在函数fn内部相当于一个临时变量，在函数预解析的时候，已经定义过形参a，当前let是不允许在同一个作用域下声明同一个变量
```js
function fn(a) {
	let a = 2;
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}
fn();

	
function fn(a) {
	var a = undefined;
	let a = 2;
	console.log(a); // SyntaxError: Identifier 'a' has already been declared
}
fn();
```

5. 如果不在同一个作用域下，就不会产生重复声明变量的问题
```js
function test(a) {
	{
		let a = 10;
	}
	console.log(a); // undefined 因为作用域的问题,打印的是形式参数a的值
}
test(); 


function test(a) {
	{
		let a = 10;
		console.log(a); // 10 打印的是let声明变量a的值
	}
}
test();
```
### 2. let不会声明提升，它会产生一个临时性死区的概念
let声明的变量不会有声明提升的现象，它会产生一个临时性死区的概念（let声明的变量被所在当前的位置，之前的无法访问到此变量）
1. 通常var声明的变量出现声明替身的现象
```js
var a = a;
console.log(a); // undefined

/**
 * 理解：
 * 在全局环境中，预解析时首先寻找变量a，并且赋值为undefined，
 * 其次执行代码，将a的值赋值给变量a，此时a的值是undefined，
 * 所以打印的值是undefined
 * 
 * GO = {
 *  a: undefined
 *    --> a --> undefined
 * }
*/
```
2. let声明的变量不存在声明提升的现象，程序抛出异常ReferenceError: Cannot access 'b' before initialization，初始化之前无法访问b变量

```js
let b = b;
console.log(b); // ReferenceError: Cannot access 'b' before initialization
```

3. 在函数参数默认值赋值的时候，形式参数不存在变量提升的问题，相当于形式参数是let声明
```js
function test(x = y, y = 2){
  console.log(x, y); // // ReferenceError: Cannot access 'y' before initialization
}
test();

// 而下面这个例子就是首先定义形式参数x,并且赋值,之后再定义y赋值给y
function test(x = 2, y = x) {
	console.log(x, y); // 2 2
}
test();
```

4. 利用typeof尝试let暂时性死区的问题，抛出异常ReferenceError: Cannot access 'b' before initialization
```js
console.log(typeof a); // undefined

console.log(typeof b); // ReferenceError: Cannot access 'b' before initialization
let b = 2; 
/**
 * 此时let声明的变量，被let所在当前行，不能变量提升
 * 而且被typeof运算符判断时会直接抛出异常
*/
```

### 3. let只能在当前的块级作用域下生效
let只能在当前的块级作用域下生效，let声明会在内存中开辟一个新的作用域为块级作用域
1. let只能在当前块级作用域下生效的示例
```js
{
	let a = 2;
}
console.log(a); // ReferenceError: a is not defined

function fn() {
	let a = 2;
}
console.log(a); // ReferenceError: a is not defined

if(1) {
	let a = 2;
}
console.log(a); // ReferenceError: a is not defined

```
总结：let声明的变量a只存在于当前的块级作用域中,并不会像var声明的变量一样进行变量提升的现象,所以在块级作用域之外访问变量a是访问不到的。

2. 死循环的程序，会影响之后的程序，let也不例外

```js
for(; 1 ;) {
	let a = 1; 
}
console.log(a); // 不执行,因为上述代码是死循环,程序执行不到这行代码。
```
3. for语句与let形成块级作用域，实际上for(let i = 0; i <1 10; i++){}也是一个块级作用域，所以在全局作用域下访问变量i访问不到
```js
for(let i = 0; i < 10; i++) {
}
console.log(i); // ReferenceError: i is not defined
```

4. 面的例子为什么输出0-9，首先进行for循环，通过var声明的i变量可以看作是全局作用域下的一个变量，通过for循环向数组中存入匿名函数function，但是此时全局作用域下的i成为10，但是接下来的for循环又将变量i赋值为0，导致每次匿名函数执行的时候，输出0 - 9

```js
var arr = [];
for(var i = 0; i < 10; i++) {
	arr[i] = function(){
		console.log(i);
	}
}
for(var i = 0; i < 10; i++) {
	arr[i](); // 0 - 9
}	

// 分析
var arr = [];
var i = 0;
for(; i < 10; ) {
	arr[i] = function(){
		console.log(i);
	}
	i++;
}
var i = 0;
for(; i < 10;) {
	arr[i]();
	i++;
}

```

5. 这又为什么输出10个10呢？因为第一次for循环的时候，通过var声明的变量i可以看做全局作用域下的一个变量，通过for循环向数组中添加匿名函数function，在进行第二次for循环的时候，全局作用域下的i变量值为10，所以在执行匿名函数时，打印的其实是全局作用域下面i变量的值10
```js
var arr = [];
for(var i = 0; i < 10; i++) {
	arr[i] = function(){
		console.log(i); // 10个10
	}
}

for(var k = 0; k < 10; k ++) {
	arr[k]();
}

// 分析

var arr = [];
var i = 0;
for(; i < 10 ;) {
	arr[i] = function(){
		console.log(i);
	}
	i++;
}
// i == 10
var k = 0;
for(; k < 10 ;){
	arr[k]();
	k++;
}
```

6. 那这下面例子为什么又输出0-9了呢？因为在for循环中变量i是被let声明，所以每一次循环的时候，因为let的原因产生块级作用域，而匿名函数function此时作为一个闭包函数被存入数组中，存入的不仅仅是匿名函数，还存入当前匿名函数所处的环境（包含每次循环i的值），所以在第二次for循环时，执行匿名函数时，匿名函数都能够拿到当时的i值0-9

```js
var arr = [];
for(let i = 0; i < 10; i++) {
	arr[i] = function(){
		console.log(i); // 0-9
	}
}

for(var k = 0; k < 10; k++){
	arr[k]();
}
```

7. 判断for循环中，（）和 {} 是否是同一个作用域，下面例子（）与  {} 看似是在同一个作用域下
```js
for(var i = 0; i < 10; i++) {
	i = 'a';
	console.log(i); // 'a'
}

for(let i = 0; i < 10; i++) {
	i = 'a';
	console.log(i); // 'a'
}

for(let i = 0; i < 10; i++) {
	var i = 'a';
	console.log(i); // SyntaxError: Identifier 'i' has already been declared
}
```

8. 由于let产生的块级作用域原因，导致for循环的（）与  {} 不是同一个作用域
```js
for(let i = 0; i < 10; i++) {
	let i = 'a';
	console.log(i); // 10个a
}
```

9. if语法中块级作用域以及类似立即执行函数的块级作用域
```js
if(1) {
	let a = 1;
	{
		let a = 10;
		console.log(a); // 10
	}
	console.log(a); // 1
}

// 此时是块级作用域,但是有点像立即执行函数,但是本身并不一样
if(1) {
	let a = 1;
	(function(){
		let a = 10;
		console.log(a); // 10
	})();
	console.log(a); // 1
}
```

## 块级作用域中函数声明的方式
ES5规定函数只能够在顶层作用域和函数作用域中生成，不建议在块级作用域当中用函数声明的方式来声明函数，而用函数表达式。
```js
// ES5
function test(){} 合法
function test(){  合法
	function test1(){}
}

// ES6
{
	function fn(){} // 浏览器能够解析,但是不推荐
}

if(1) {
	function test(){} // 浏览器能够解析,但是不推荐
}

try {
	function fn(){}  // 浏览器能够解析,但是不推荐
}catch(e) {
	function test(){}
}

// 如果需要在块级作用域中声明函数,利用函数表达式替换

try {
	var test1 = function(){}
}catch(e) {
	var test2 = function(){}
}
```

## 块级作用域的返回值
块级作用域是没有返回值的，目前do{}的语法可以让块级作用域有返回值，但是只是草案

## 函数的块级作用域并不是命名函数的立即调用
一个是作用域，一个是函数立即执行，你能够通过块级作用域模拟函数立即执行，但完全不是等效的