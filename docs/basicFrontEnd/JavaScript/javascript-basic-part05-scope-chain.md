---
autoGroup-3: JavaScript基础
title: 作用域与作用域链
---

## 作用域
函数也是一种对象类型，即引用类型。
```js
function test(a, b){}
```
有属性`test.name`, `test.length`, `test.prototype`等。对象有一些属性是我们无法访问的，也就是JS引擎内部固有隐式属性。

### `[[scope]]`
1. 函数创建时，生成的一个JS内部隐式属性
2. 函数存储作用域链的容器
   - AO/GO
   - AO，函数的执行期上下文
   - GO，全局的执行期上下文
   - 函数执行完成以后，AO是要销毁的
   - AO是一个即时的存储容器

```js
function a(){
    function b(){
        var b  =2;
    }
    var a = 1;
    b();
}
var c = 3;
a();
```

分步分析上面函数作用域链之间的关系：
1. 当函数`a`被定义时
```js
function a(){}
var c = 3
```
**当函数`a`被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局执行期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`a`和全局变量`c`。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain01.png')" alt="scope-chain01"> 

2. 当`a`函数被执行时（前一刻）
```js
function a(){
    function b(){}
    var a = 1;
}
var c = 3;
a();
```
**当`a`函数被执行时（前一刻）**，作用域链的顶端（第`0`位）存储a函数生成的函数执行期上下文`AO`，同时第`1`位存储`GO`。查找变量是到`a`函数存储的作用域链中从顶端开始依次向下查找。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain02.png')" alt="scope-chain02"> 

**当`b`函数被定义时**，是在`a`函数环境下，所以`b`函数这时的作用域链就是`a`函数被执行期的作用域链。

3. 当`b`函数被执行时（前一刻）
```js
function a(){
    function b(){
        var b  =2;
    }
    var a = 1;
    b();            
}
var c = 3;
a();
```

**当`b`函数被执行时（前一刻）**，生成函数`b`的`[[scope]]`，存储函数`b`的作用域链，顶端第`0`位存储`b`函数的`AO`，`a`函数的`AO`和全局的`GO`依次向下排列。

**当`b`函数被执行结束后**，`b`函数的`AO`被销毁，回归被定义时的状态。

**当`a`函数被执行结束时**，`a`函数的`AO`被销毁的同时，`b`函数的`[[scope]]`也将不存在。`a`函数回归到被定义时的状态。

1. 全局执行的前一刻，就生成GO，函数声明已经定义，当函数被定义的时候已经形成作用域链[[scope] -> scope chain -> GO， 在函数执行的时候才会生成AO。
2. 全局执行


## 练习
```js
function a(){
    function b(){
        function c(){}
        c();
    }
    b();
}
a();
/**
 * a定义：a.[[scope]] -> 0: GO
 * a执行：a.[[scope]] -> 0: a -> AO
 *                      1: GO
 * b定义：b.[[scope]] -> 0: a -> AO
 *                      1: GO
 * b执行：b.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * c定义：c.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * c执行：c.[[scope]] -> 0: c -> AO
 *                      1: b -> AO
 *                      2: a -> AO
 *                      3: GO
 * c结束：c.[[scope]] -> 0: b -> AO
 *                      1: a -> AO
 *                      2: GO
 * b结束：b.[[scope]] -> 0: a -> AO
 *                      1: GO
 *       c.[[scope]] X
 * a结束：a.[[scope]] -> 0: GO
 *       b.[[scope]] X
*/
```