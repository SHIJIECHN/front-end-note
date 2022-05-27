---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 语法、规范、错误、运算符
---

## 语法、规范
### 1. 分号结束
```javascript
var a = 10;
```
### 2. 符号两边加空格
```javascript
a + b = 3
```

## 错误
错误大致分为两类：语法错误和通用错误
### 1. 语法错误（SyntaxError）
特点：所有代码都不执行
```javascript
console.log(1);
console.log(2)；
console.log(3);
```
结果：Uncaught SyntaxError: Invalid or unexpected token

### 2. 通用错误（ReferenceError）
特点：中断执行，错误前的代码会执行
```javascript
console.log(1);
console.log(a);
console.log(3);
```
结果：
1 <br>
Uncaught ReferenceError: a is not defined

### 3. 脚本块之间的错误，不会互相影响
```javascript
<script type = "text/javascript">
	console.log(a); // Uncaught ReferenceError: a is not defined
</script>
 
<script type='text/javascript'>
	console.log(1); // 1
</script>
```

## 运算符
### 1. 运算符：+ - * / %
1. ()括号运算符 > 普通运算 > 赋值
```js
// 数字运算符
var a = 1,
    b = 2,
    d = 3;
var c = (a + b) * d
/*
* 1、声明变量c
* 2、变量a的值和变量b的值相加，与变量d的值相乘得到结果
* 3、将结果赋值给变量c
*/

```
2. `+` 加
`+`分为两种：数学运算、字符串拼接。    
数学运算:
```javascript
var a = 1;
    b = 2,
    c;
c = a + b;
console.log(c);  // 3
```
字符串拼接: 任何数据类型的值 + 字符串都是字符串
```javascript
c = 1 + 'str'; // 1str
c = 'str' + undefined; // strundefined
c = 'str' + null; // strnull
c = 'str' + NaN; // strNaN
c = 'str' + 1 + 1;  // str11
c = 1 + 1 + 'str' + ( 1 + 1 ); // 2str2 自左向右
```
3. `/` 除法
```js
var a = 1,
    b = 2,
    c;

c = 0 / 0; // NaN -> not a Number 非数  NaN是数字类型
c = 'a' / 'b'; // NaN
c = 1 / NaN; // NaN

c = 1 / 0 // Infinity 正无穷 数字类型
```
4. `%` 取模 取余
```js
console.log( 4 % 6); // 4
console.log( 0 % 6); // 0
```
### 2. 交换值
```js
var a = 1,
    b = 2;
// a b的值交换

// 方法一
var c = a;
    a = b;
    b = c;

// 方法二
a = a + b; // a = 3
b = a - b; // 3 - 2 = 1
a = a - b; // 3 - 1 = 2
```
### 3. `++`、`--`
```js
// var a = 1; a = a + 1 => a++
var a = 1;
console.log(a++); // 1
// a++ 先参与计算，再自身加1
// ++a 先自身加1，再参与运算

var a = 5
    b;

b = a++ + 1 
console.log(b, a) // 6 6

b = ++a + 1 
console.log(b, a) // 7 6 

b = a-- + --a // b = --a + a--
console.log(b, a) // 8 3

b = --a + --a  // 4 + 3
console.log(b, a) // 7 3

b = --a + a++  // 4 + 4
console.log(b, a) // 8 5 
```
### 4. 比较运算符
<、>、>=、<=、 ==、 ===、 !=、 !==

1. `number`遇到`string`, `string -> number`
```javascript
var bool = 1 > '2';
console.log(bool); // false
```
2. `string` 遇到`string`
字符串相对应的`ASCII`码（字符相对应的十进制代码），多个字符的，从左向右一次对比，直到比较出`ASCII`码的大小为止
```javascript
var bool = '4.5' > '11'; // true
```
2. 相等是不看数据类型，全等是需要看数据类型是否相等
```javascript
var bool = 1 == '1' ; // true
var bool = 1 === '1'; // false
```
3. `NaN`与包括自己在内任何东西都不相等
```javascript
var bool = NaN == NaN ; // false
```
  
### 5. 逻辑运算符
与`&&`、或`||`、非`!`   
六个假值：`undefined`, `null`, `NaN`, `0`, `""`, `false`

```js
console.log(1 && 2) // 2
console.log(1 && 2 && undifined && 10) // undefined
console.log(1 || 2) // 1
console.log(0 || null || 2 || 0) // 2
```
- `&&`
遇到真就往后走，遇到假或走到最后就返回当前的值
- `||`
遇到假就往后走，遇到真或者走到最后就返回当前的值















