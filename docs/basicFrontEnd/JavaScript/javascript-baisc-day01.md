---
autoGroup-1: JavaScript基础篇
sidebarDepth: 3
title: 1.发展史、ECMA、编程语言、变量、JS值
---
## 目标
- 掌握变量的声明和使用方法
- 理解数据类型的概念
- 掌握不同的数据类型的书写和区别
- 掌握不同数据类型之间的转化方式

## 发展史
### 五大主流浏览器
| <div style="width: 200px;">浏览器</div>| <div style="width: 200px;">内核</div>|
| :--------:   | :------: |
| IE| Trident|
|Chrome|Webkit Blink
|Safari| Webkit|
|Firefox|Gecko|
|Opera|Presto|

### 浏览器的历史
1. **1990** 蒂姆·博纳斯·李（超文本分享资讯的人），他开发了一个真正意义上的浏览器“world wid web”，这个浏览器原来不是用C写的，后来把它移植到C里面去了，改了个名字叫“libwww”，后来经过一些变迁又改成了nexus。
2. **1993** 美国伊利诺大学有一个NCSA的阻止，这个组织的成员马克·安德森开发了一个叫MOSIC的浏览器，它是一款真正意义上的图形化浏览器（可以显示图片）。
3. **1994** 马克·安德森和吉姆·克拉克（硅图SGI）成立了一个公司，叫“MOSICA communications corporation”，中间出现了一点下插曲（MOSICA有商标权的是 -> 伊利诺大学 -> 把商标权转给了 spy glass公司 -> 所以最后改名为Netscape comm），后来又改名为“Netscape communications corporation（网景公司）”，这个公司开发了一个浏览器，叫“Netscape Navigator（导航者）”。
4. **1996** 微软的公司收购spy glass，立马开发了“IE Internet explore 1.0”，然后这一年同时也发布了IE3，IE3的诞生出现了第一个script脚本，叫做“JScript”。然后网景公司的Brendan eich在Netscape Navigator的基础上开发了一个脚本，叫“livescript”。这一年Java（SUN公司）火起来了，网景公司的livescript不温不火，所以网景公司和SUN公司商量合作推广和宣传产品，于是livescript就更名为JavaScript。
5. **2001** 
   IE6 XP诞生
   JS引擎出现
6. **2003** mozilla公司firfox根据 -> Netscape Navigator改的
7. **2008** google基于WEBKIT BLINK GEARS -> chrome -> V8引擎 -> JS引擎
   1. 直接翻译机器码
   2. 独立于浏览器运行
8. **2009** 甲骨文oracle收购了SUN公司。JS的所有权给了甲骨文。

## ECMA
European Computer Manufactures Association欧洲计算机制造联合会  
ECMA是一个评估、开发、认可电信与计算机标准的联合会。里面有很多的标准规范清单，其中ECMA-262就是脚本语言的规范（ECMAScript），比如ES5、ES6（规范化脚本语言）。

## 编程语言
编程语言分为编译型和解释型。
- 编译型：源码 -> 编译器 -> 机器语言 -> 可执行的文件
- 解释型：源码 -> 解释器 -> 解释一行就执行一行

优缺点：
- 解释型语言：不需要根据不同的系统平台进行移植。
- 编译型语言：需要移植。

脚本语言：一定有脚本引擎，写好的脚本代码通过引擎的解释器解析了以后才能执行。  
前端、后端都有脚本语言，比如：前端就是JavaScript、后端就是php。他们的不同就在于JavaScript是客户端脚本语言，而php是服务端的脚本语言。

## JavaScript
三大部分：
1. ECMAScript：语法、变量、关键字、保留字、值、原始类型、引用类型运算、对象、继承、函数
2. DOM： document object model（W3C规范）
3. BOM： browser object model （没有规范）

单线程：只能在两个程序当中运行一个程序，不能同时运行两个程序。   
多线程：两个线程都可以同时运行。  
JS引擎是单线程的。单线程 -> 模拟多线程。采用轮转时间片，短时间之内轮流执行多个任务的片段。过程：
1. 任务1 任务2
2. 切分任务1 任务2
3. 随机排列这些任务片段，组成队列
4. 按照这个队列顺序将任务片段送进JS进程
5. JS线程执行一个又一个的任务片段
   
## 变量
变量是一个存储数据的容器，方便后续使用。
1. 同时声明多个变量，用逗号隔开
2. 声明变量的特殊情况
```js
var a; // 声明变量
a = 3; // 变量赋值
var a = 3; // 变量声明并赋值
// 两个部分组成：
// 声明变量 变量赋值
// = 赋值

var x = 1,
    y = 2;


```
命名规范：
1. 不能以数字开头
2. 不能关键字和保留字；
3. 能字母_$开头；
4. 可以包含字母_$数字；
5. 命名最好用有意义的名词，要有语义化、结构化；
6. 变量名用小驼峰，构造函数用大驼峰；
7. 尽量用英文或看得懂的英文缩写；
8. 不要用拼音或者拼音缩写；
```js
var x = 3,
    y = 4;
var z  = x + y;
// 声明 > 运算 > 赋值 
```
## JavaScript的值
JavaScript有两种类型值：原始值和引用值。JavaScript是通过值来判断数据的类型。

### 1. 原始值（基本类型）
5种：Number、String、Boolean、undefined、null。
```javascript
var a = 1;
var a  = 3.14;

// String
var str = '我爱编程';

// Boolean
var a = true;
var a = false;

// undefined
var a = undefined;
var a;
console.log(a); // undefined

// null 空值，初始化组件，函数，占位等
```
原始值存储
```javascript
var a = 3; 
var b = a; 
a = 1; 
// 将原来声明是变量a清掉，还原为地址为1008，
// 再开辟一个新的空间，声明变量a，在空间存一个值1。
// 1008地址对应空间中的值是不会清除的，再次使用只会覆盖
console.log(b) // 3
```
解释：
1. 声明变量a；在空间中存一个值为3。
2. 声明一个变量b，并将a的值3，复制一份，放入到空间中。
3. 重新开辟一个新的空间，存入新的值。

a赋值给b，其实就是把a的值拷贝给b，重新赋值其实就是开辟了一个新的空间，存入新的值，原来的名称给新的空间，但值会保留下来。

<img :src="$withBase('/basicFrontEnd/JavaScript/origin-type-storage.png')" alt="origin-type-storage">

原始值和引用值都有地址，这个地址叫内存地址，地址一般用一个二进制表示，这里简化了所以用的是一个数字。

### 2.引用值
object，array，function，data， RegExp
```js
// 报一个变量赋值给另一个变量
var arr1 = [1, 2, 3, 4]; 
var arr2 = arr1; 
arr1.push(5) // arr2也会发生改变 
console.log(arr1, arr2); // [1,2,3,4,5], [1,2,3,4,5]

// 把原来的变量重新赋值
arr1 = [1,2]; // 数组重新赋值就和原来的没有关系了
console.log(arr1, arr2); // [1,2], [1,2,3,4,5] 
```
解释：
1. 在堆内存中开辟一个空间存1,2,3,4；声明变量arr1；arr1栈内存空间存储堆内存地址。
2. 声明变量arr2，栈内存空间存储arr1的堆内存地址。
3. 在堆内存中开辟一个空间存储1,2；将原来声明是变量arr1清掉，还原为1008并断开堆内存的指向，再声明变量arr1；arr1栈内存空间存储堆内存地址。
   
arr1和arr2都是数组，把arr1赋值给arr2的时候，只是把地址赋值给了arr2，指向的是堆内相同的数据，所以在改变arr1的数据的时候，堆内数据改变了，但是arr1和arr2地址指针相同，所以输出的都是\[1,2,3,4,5]。<br>
当arr1重新赋值的时候，堆内存会开辟一个新的空间，存入新的值，栈内存也会开辟一个新的空间，存入新的值，把原来的名称销毁了之后再把它赋给新的空间，保留原来的地址。
 <img :src="$withBase('/basicFrontEnd/JavaScript/quote-type-storage.png')" alt="quote-type-storage"> 
