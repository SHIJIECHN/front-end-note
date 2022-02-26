---
autoGroup-3: JavaScript基础
sidebarDepth: 3
title: day01 
---
## 目标
- 掌握变量的声明和使用方法
- 理解数据类型的概念
- 掌握不同的数据类型的书写和区别
- 掌握不同数据类型之间的转化方式

## 五大主流浏览器
| 浏览器       | 内核   |
| --------   | ------- |
| IE| Trident|
|Chrome|Webkit Blink
|Safari| Webkit|
|Firefox|Gecko|
|Opera|Presto|

## 编程语言
分为编译型和解释型。
- 编译型：源码 -> 编译器 -> 机器语言 -> 可执行的文件
- 解释型：源码 -> 解释器 -> 解释一行就执行一行

优缺点：
- 解释型语言：不需要根据不同的系统平台进行移植。
- 编译型语言: 需要移植。

## JavaScript
三大部分：
1. ECMAScript
2. DOM： document object model
3. BOM： browser object model 

JS引擎是单线程的。单线程 -> 模拟多线程。采用轮转时间片，短时间之内轮流执行多个任务的片段。
1. 任务1 任务2
2. 切分任务1 任务2
3. 随机排列这些任务片段，组成队列
4. 按照这个队列顺序将任务片段送进JS进程
5. JS线程执行一个又一个的任务片段
   
## 变量
1. 同时声明多个变量，用逗号隔开
2. 声明变量的特殊情况
```js
var a; // 声明变量
a = 3; // 变量赋值
var a = 3; // 变量声明并赋值
// 两个部分组成：
// 声明变量 变量赋值
// = 赋值
```
命名规范：不能以数字开头，不能关键字和保留字；能字母_$开头，语义化
```js
var x = 3,
    y = 4;
var z  = x + y;
// 运算 > 赋值 
```
## JavaScript的值
JavaScript有两种类型值：原始值和引用值

### 1. 原始值（基本类型）
5种：Number、String、Boolean、undefined、null。
```js
var a = 1;
var a  = 3.14;

var str = '我爱编程';

var a = true;
var a = false;

var a = undefined;
var a;
console.log(a);

// null 空值，初始化组件，函数，占位等
```
原始值存储
```js
var a = 3; 
// 两步：
// 1、声明变量a；
// 2、在空间存一个值为3
var b = a; 
// 声明一个变量b，并将a的值3，复制一份，放入到空间中
a = 1 
// 将原来声明是变量a清掉，还原为1008，再声明变量a，在空间存一个值1。1008对应空间中的值是不会清除的，再次使用只会覆盖
console.log(b) // 3
```
<img :src="$withBase('/basicFrontEnd/JavaScript/origin-type-storage.png')" alt="origin-type-storage">

### 2.引用值
object，array，function，data， RegExp
```js
var arr1 = [1, 2, 3, 4]; 
// 1、在堆内存中开辟一个空间存1,2,3,4；
// 2、声明变量arr1；
// 3、arr1栈内存空间存储堆内存地址
var arr2 = arr1; // 声明变量arr2，栈内存空间存储arr1的堆内存地址
arr1.push(5) // arr2也会发生改变
arr1 = [1,2] 
// 1、在堆内存中开辟一个空间存储1,2；
// 2、将原来声明是变量arr1清掉，还原为1008并断开堆内存的指向，再声明变量arr1；
// 3、arr1栈内存空间存储堆内存地址
console.log(arr2)
```
 <img :src="$withBase('/basicFrontEnd/JavaScript/quote-type-storage.png')" alt="quote-type-storage"> 
