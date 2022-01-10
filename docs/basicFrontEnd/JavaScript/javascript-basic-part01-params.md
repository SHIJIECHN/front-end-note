---
autoGroup-3: JavaScript基础
title: JavaScript变量与值
---

## JavaScript的值
JavaScript有两种类型值：原始值和引用值

### 1. 原始值 -> 基本类型
5种：Number、String、Boolean、undefined、null。  
ES6新增Symbol和ES10新增BigInt类型。   
- Symbol代表创建后独一无二且不可变的数据类型。主要是为了解决可能出现全局变量冲突的问题。  
- BigInt是一种数据类型的数据，可以表示任意精度格式的整数。使用BigInt可以安全地存储和操作大整数，即使这个数已经超出了Number能够表示的完全整数范围。


### 2. 引用值
常用：object、array、function、date、RegExp


## 内存存储
两种值的存储方式不同。
- 原始值：存储在栈（stack）中，数据都是永久保存，不可改的
- 引用值：存储在堆（heap）中  


理解下面两种情况，并画出内存图。
### 1.基本值

 ```js
 var a = 3；// 两步：1、声明变量a；2、在空间存一个值为3
 var b = a; // 声明一个变量b，并将a的值3，复制一份，放入到空间中
 a = 1 // 将原来声明是变量a清掉，还原为1008，再声明变量a，在空间存一个值1。1008对应空间中的值是不会清除的，再次使用只会覆盖
 console.log(b) // 3
 ```
 <img :src="$withBase('/basicFrontEnd/JavaScript/origin-type-storage.png')" alt="origin-type-storage"> 



### 2.引用值：
```js
var arr1 = [1,2,3,4]; // 1、在堆内存中开辟一个空间存1,2,3,4；2、声明变量arr1；3、arr1栈内存空间存储堆内存地址
var arr2 = arr1; // 声明变量arr2，栈内存空间存储arr1的堆内存地址
arr1.push(5) // arr2也会发生改变
arr1 = [1,2] // 1、在堆内存中开辟一个空间存储1,2；2、将原来声明是变量arr1清掉，还原为1008并断开堆内存的指向，再声明变量arr1；3、arr1栈内存空间存储堆内存地址
console.log(arr2)
```
 <img :src="$withBase('/basicFrontEnd/JavaScript/quote-type-storage.png')" alt="quote-type-storage"> 

## 操作符

### 一元运算符
+、/、%、++、--
- “+” 
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

// 字符串拼接: 任何数据类型的值 + 字符串都是字符串
c = 1 + 'str' // 1str
c = 'str' + NaN // strNaN
c = 'str' + 1 + 1  // str11
c = 1 + 1 + 'str' + ( 1 + 1 ) // 2str2
```

- “/” 除法
```js
var c = 0 / 0 // NaN
var c = 1 / 0 // Infinity
```

- “%” 取模
```js
var c = 0 % 6 // 0
```

练习：交换值的问题
```js
var a = 1,
    b = 2;

// 方法一
var c = a;
    a = b;
    b = c;

// 方法二
a = a + b; a = 3
b = a - b; // 3 - 2 = 1
a = a - b; // 3 -1 = 2
```

- ++、--
```js
// var a = 1; a = a + 1 => a++
var a = 5
    b;
// *******************
b = a++ + 1 
console.log(b, a) // 6 6
// *******************
b = ++a + 1 
console.log(b, a) // 7 6 
// *******************
b = a-- + --a // b = --a + a--
console.log(b, a) // 8 3
// *******************
b = --a + --a  // 4 + 3
console.log(b, a) // 7 3
// *******************
b = --a + a++  // 4 + 4
console.log(b, a) // 8 5 
```

### 比较运算符
<、>、>=、<=、 ==、 ===、 !=、 !==


### 逻辑运算符（与&&、或||、非!）
假值：undefined, null, NaN, 0, "", false

```js
console.log(1 && 2) // 2
console.log(1 && 2 && undifined && 10) // undefined
console.log(1 || 2) // 1
console.log(0 || null || 2 || 0) // 2
```
- &&
遇到真就往后走，遇到假或走到最后就返回当前的值
- ||
遇到假就往后走，遇到真或者走到最后就返回当前的值
