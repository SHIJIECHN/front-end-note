---
autoGroup-2: ES6
sidebarDepth: 3
title: 5. 隐式转换、函数参数解构、解构本质、()用法
---

## 表达式 () 的用法
1. var或者let声明变量遇见表达式（）就会报错。
```js
(var a = 3); // 语法错误
(let a = 3); // 语法错误
var (a = 2); // 语法错误
```
2. ReferenceError: let is not defined
表达式（）错误使用的另一种错误
```js
let (a = 3); // ReferenceError: let is not defined
let (a) = 3; // ReferenceError: let is not defined
```
3. 解构赋值中运用表达式（）的情况
- {} 在解析代码时，ES6认为{}是块级作用域，而不是解构赋值的操作，一个块级作用域赋值给另一个块级作用域，当然会抛出语法错误，此时运用表达式（）
```js
{a: a, b: b} = {a: 1, b: 2}; // 语法错误

// 正确写法
({a: a, b: b} = {a: 1, b: 2});
console.log(a, b); // 1 2
```
- 解构赋值中，先声明变量，然后再使用的方式
```js
// 正常语法
let {a: a} = {a: 1};
console.log(a); // 1


// 先声明,后使用
let a;
({a} = {a: 1});


let a = [1, 2, 3], 
		obj = {};
// [] = [] ES6是可以解析的,不用利用表达式()进行改造
[obj.a, obj.b, obj.c] = a; 
console.log(obj.a, obj.b, obj.c);
```

## 对象和数组之间的解构赋值
数组也是对象的一种形式，所以也可以进行解构赋值的操作

### 1. 数组也是特殊对象，可以进行解构赋值

