---
autoGroup-2: ES6
sidebarDepth: 3
title: 4. 解构赋值、函数默认值、数组解构、对象解构
---
## 暂时性死区
暂时性死区TDZ(Temporal Dead  Zone)，在块级作用域中let声明变量，将变量锁住在当前行，并且将变量捆绑到当前的块级作用域内部。

### 1. 不能在变量声明前初始化
暂时性死区特性导致被let或者const声明的变量不能够在之前初始化。ReferenceError: Cannot access 'x' before initialization
```js
var x  = 1;
{
	let x = x; 
	console.log(x); // ReferenceError: Cannot access 'x' before initialization
}

var x = 1;
{
	console.log(x); // ReferenceError: Cannot access 'x' before initialization
	let x = 2;
	console.log(x); // 2
}

var x = 1;
{
	console.log(x); // 1
	var x = 2;
	console.log(x); // 2
}
```

### 2. 不能重复声明
同一作用域内部不能使用let或者const进行重复声明。SyntaxError: Identifier 'x' has already been declared。
```js
var x = 1;
let x = 2;
console.log(x); // SyntaxError: Identifier 'x' has already been declared
```

## 函数参数默认值的问题
### 1. false(虚值)
falsy虚值，在通过Boolean进行转化的时候，是假的值就是虚值，undefined NaN null  0 false ''(空字符串)。

### 2. 函数参数默认值的写法
1. ES5 函数参数默认值写法。
> 避免传入的参数是0，而取不到传入0原本的值
```js
var a = typeof(arguments[0]) !== 'undefined' ? arguments[0] : 1;
var b = typeof(arguments[0]) !== 'undefined' ? arguments[0] : 2;
```
2. ES6函数参数默认值的基本语法
```js
function foo(x = 1, y = 2) {
	console.log(x + y);  // 1 + 2
}
foo();
```
3. 函数参数默认值生效的条件
> 传入的参数严格等于（===）undefined，函数默认值生效
```js
function foo(x = 1, y = 2){
  console.log(x + y); // 2 + 2
}
foo(2);


function foo(x = 1, y = 2) {
	console.log(x + y); // 2 + 2
}
foo(2, undefined);


function foo(x = 1, y = 2) {
	console.log(x + y); // undefined + 2
}
foo('undefined', undefined);
```

## 函数默认值赋值的时候是否存在块级作用域的问题
1. 如果函数参数已经有了这个变量，那么函数内部就不能够再用let或者const去声明这个变量，因为let和const会认为已经声明过这个变量，就会抛出重复声明的语法错误（SyntaxError: Identifier 'x' has already been declared）；
2. 如果函数参数不存在这个变量，那么函数参数声明时默认会形成块级作用域，此时函数参数相当于被let声明。 

### 1. 函数参数已经声明该变量，函数内部再次声明
验证上述说的，如果函数形式参数已经存在x变量，然后内部又再次利用let或者const进行重新声明，会抛出重复声明的语法错误。
```js
function fn(x = 2) {
	let x = 3;
	console.log(x); // SyntaxError: Identifier 'x' has already been declared
}
fn();


function fn(x = x) {
	let x = 2;
	console.log(x);// SyntaxError: Identifier 'x' has already been declared
}
fn();
```

### 2. 函数参数已经声明该变量，函数内部未声明
验证上述说的，如果函数形式参数已经存在y变量，函数内部没有再次利用let或者const进行重新声明，此时函数参数声明时默认会形成块级作用域，此时函数参数相当于被let声明。
1. 正常的情况 (注意，此时函数形式参数是y，并不是上面例子中的形式参数x)；解释一下：在声明形式参数y时，形成块级作用域并且相当于利用let进行声明形式参数y。
```js
let x = 1;
function foo(y = x) {
	let x = 2;
	console.log(y); // 1
}

// 块级作用域的形成
{
	let x = 1;
	{
		let y = x;
		{
			let x = 2;
			console.log(y); //  1
		}
	}
}
```

2. 可能上个例子并没有清楚的表明在函数形式参数声明时是否产生块级作用域，下面例子为我们展示是否在形式参数声明时产生块级作用域，并且参数声明相当于用let声明。

```js
let x = 1;
function foo(x = x) {
	console.log(x); // ReferenceError: Cannot access 'x' before initialization
}
foo();


// 不存在块级作用域并且没有利用let声明形式参数x
{
	let x = 1;
	{
		var x = x;  // 由于var声明提升到顶层作用域,导致在同一作用域下声明同一变量,抛出异常。
		console.log(x); // SyntaxError: Identifier 'x' has already been declared
	}
}


// 存在块级作用域并且没有利用let声明形式参数x
{
	let x = 1;
	{
		let x = x;
		{
			console.log(x); // ReferenceError: Cannot access 'x' before initialization
		}
	}
}
```
3. 再次利用示例验证函数声明时是否存在作用域以及是否相当于let声明形式参数
```js
var w = 1, z = 2;
function foo(x = w + 1, y = x + 1, z = z + 1) {
	console.log(x, y, z); // ReferenceError: Cannot access 'z' before initialization
}
foo();

// 块级作用域的形成
var w = 1, z = 2;
{
	let x = w + 1 = 2;
	let y = x + 1 = 3;
	let z = z + 1 = 3; // 问题在于z变量被let声明,产生暂时性死区的问题,导致变量z在初始化之前无法访问。
	{
		console.log(x, y, z);
	}
}
```
### 3. 惰性求值
每次需要重新计算表达式，如果函数参数的默认值没有生效，则不会计算 a + 1的值。
```js
let a  = 99;
function foo(b = a + 1) {
	console.log(b);
}
foo(); // 100
a = 100;
foo(); // 101
```

## 解构赋值
模式匹配或解构化赋值，数组与数组匹配解构，对象与对象解构
```js
let [a, b, c] = [1, 2, 3];
let [d, [e], [f]] = [1, [2], [3]];
let [a, [b, c], [d, [e, f, [g] ] ] ] = [1, [2, 3], [4, [5, 6, [7] ] ] ]
```

### 1. 解构失败
变量多了，对应解构的值少了，导致undefined进行填充。
```js
let [a, [b, c], [d, [e, f, [g] ] ] ] = [1, [2, 3], [, [, 6, [7] ] ] ]

console.log(a, b, c, d, e, f, g); // 1 2 3 undefined undefined 6 7
```
### 2. 不完全解构
值多了，变量少了
```js
let [a, [b, c], [, [, , [g] ] ] ] = [1, [2, 3], [4, [5, 6, [7] ] ] ]
console.log(a, b, c, g); // 1 2 3 7
```

### 3. 解构的默认值
传入的参数严格等于undefined时，默认值才会生效，所以存在惰性求值的问题
```js
let [ a = 6 ]  = [ 1 ] ;       a = 1
let [ a, b = 2] = [ 1 ];    a = 1, b =  2
let [ a, b = 2] = [ 1, undefined ];  a =  1, b = 2
let [ a, b = 2] = [ 1, null ];  a = 1, b = null
```

### 4. 默认值给函数
```js
function test() {
	console.log(1);
}
let [ x = test() ] = [ 1 ];    x = 1;
let [ x = test() ] = [ ];  x = undefined

// 默认值是变量，存在暂时性死区
let [ x =  y,  y =  1 ] = [ ];
console.log(x, y);   // ReferenceError: Cannot access 'y' before initialization
```

### 5. 解构时不存在块级作用域的问题
```js
let x = 5;
let [ x =  1,  y =  x ] = [ ]；
console.log(x, y);   // SyntaxError: Identifier 'x' has already been declared

let [ x = 1, y = x] = [ 2 ] ;
console.log(2,  2);

let [ x = 1, y = x ] = [ 1,  2 ];
console.log(1, 2);

let [ x = y,  y = 1] = [ ];
console.log(x, y);  // ReferenceError: Cannot access 'y' before initialization
```

## 对象解构
可以通过解构进行变量赋值
### 1. ES6对象的增强
属性名与属性值相同时，可以简写；对象的方法简写；属性的拼接。
1. 属性名与属性值相同时，可以简写；对象的方法简写；
```js
// ES5
var name = "zhangsan",
		age = 14;
var person = {
	name: name,
	age: age,
	sex: 'male'，
	eat: function() {
		console.log(1);
	}
}

// ES6
var person = {
	name,
	age,
	sex: 'male',
	eat() {
	}
}
```
2. 属性的拼接，中括号的语法进行拼接
```js
let firstName = 'ai';
let secondName = '小野';
let name = 'ai xiaoye';
let person =  {
	[ fristName + secondName] : name
}
```

### 2. 对象解构
完全一样的两个对象，可以通过解构进行变量赋值；a(属性名)：a(变量)
```js
let  { a：a, b：b, c：c } = { a：1, b：2, c：3 };
console.log( a, b, c); // 1 2 3

// 简写：
let  { a, b, c } = { a：1, b：2, c：3 };
console.log(a, b, c);
```

1. 不完全解构，嵌套默认值
```js
let { a = 2, b, c} = { a：1, b：2, c：3, e：4, f：5};
console.log(a, b, c); // 2 2 3
```

2. 解构失败
```js
let { a = 2, b, c, d, e, f, g, h} = { b：2, c：3, e：4, f：5};
console.log(a, b, c, d, e, f, g);  // 2  2  3  undefined 4 5 undefined undefined
```

3. 数组的解构是存在一个顺序的问题，对象的解构是不存在顺序的

```js
let { a, b, c } = { c：3, b：2, a：1};
console.log(a, b, c); // 1 2 3

let [ a, b, c ] = [ 3, 1, 2 ];
console.log(a, b, c); // 3 1 2
```

4. 对象解构赋值重命名，a(属性名)：a(变量)

```js
let { a: e, b: f, c: g } = { a: 1, b: 2, c: 3 };
console.log(e, f, g); // 1 2 3


var person = {
		name : "zhangsan"，
		age：50，
		son：{
		name："lisi",
		age: 30,
		son: {
		name:"wangwu"，
		age：12
		}
	}
}
var { son：{ son：son1 } } = person;
console.log(son1); // { name:"wangwu", age：12 }
```