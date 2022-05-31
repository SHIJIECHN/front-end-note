---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: 5. 参数默认值、递归、预编译、暗示全局变量
---

## 函数参数的默认值
1. 初始化参数，给参数增加默认值
(1) 参数的默认值不设置它就是`undefined`。
```js
function test(a, b) {
  console.log(a); // undefined
  console.log(b); // undefined
}
test();
```
不给 `a` 和 `b` 传入参数，两者默认是 `undefined`

(2) 给a使用默认值，而b传入实参，此时给a传入实参undefined。
```javascript
function test(a = 1, b){
    console.log(a); // 1  形参和实参谁的值不是undefined就取谁的值
    console.log(b); // 2
}
test(undefined, 2);
```
理解arguments实参和形参的关系，`arguments[0]`和形参a，哪个不是undefined，对应的值就是哪个。

(3) 形参和实参谁的值不是undefined就取谁的值
```javascript
function test(a = 1, b){
    console.log(a); // 1  
    console.log(b); // 2

    // a  1
    // arguments[0]  undefined
}
test(1, 2);
```
2. 形参设置默认参数，es6写法
```js
function test(a = 1, b = 2) {
  console.log(a); // 1
  console.log(b); // 2
}
test();
```
有的浏览器不支持默认参数的情况，解决浏览器不支持默认参数的情况， 三种方式：
(1) 使用`||`运算符
```js
function test(a, b) {
  var a = arguments[0] || 1;
  var b = arguments[1] || 2;

  console.log(a + b); // 3
}
test();
```

(2) 使用`typeof`
```js
function test(a, b){
    var a, b;
  if(typeof(arguments[0]) !== 'undefined'){
    a = arguments[0]
  }else {
    a = 1
  }

  if(typeof(arguments[1]) !== 'undefined'){
    b = arguments[1]
  }else{
    b = 2
  }

  console.log(a + b) // 3
}
test()
```
(3) 三元运算符
```javascript
function test(a, b){
  var a = typeof(arguments[0] !== 'undefined' ? arguments[0] : 1);
  var b = typeof(arguments[1] !== 'undefined' ? arguments[0] : 2)
  console.log(a + b); // 3
}
test();
```

## 递归
递归是函数自己调用自己   
n的阶乘 => 不能用for循环 => 用递归    
fact(n):    
1. 规律 : n! = n * fact(n-1)    
2. 出口 : n===1    
n = 5;    
fact(5) = 5 * fact(4) -> 5 * 24   
fact(4) = 4 * fact(3) -> 4 * 6    
fact(3) = 3 * fact(2) -> 3 * 2     
fact(2) = 2 * fact(1) -> 2 * 1   
```javascript
function fact(n) {
  if(n === 1){
    return 1
  }
  return n * fact(n - 1); // 一直等到有结果直返才return出去
}
console.log(fact(5)); // 120
```
总结：递归总是在找到出口（结束递归）后，再一步一步向上计算出结果。递归需要注意两个因素：规律和出口

## 预编译
预编译的过程：
1. 检查通篇的语法错误
2. 预编译的过程
3. 解释一行，执行一行
并不是一来就执行预编译，而是会检查语法错误。

预编译过程：
1. 函数声明整体提升
```javascript
console.log(a); // function a(){...}
function a(){
    var a = 10;
}
```
2. 变量只会声明提升
```javascript
console.log(a) // undefined
var a = 10
```
3. 变量赋值是不会提升的
```javascript
console.log(a); // Uncaught ReferenceError: a is not defined
a = 10;
```
:::tip
函数声明整体提升，变量只有声明提升，赋值不提升
:::

## 暗示全局变量
```js
var a = 1;  // a = window.a 声明了的变量也叫全局变量
b = 2;  // b = window.b  未声明直接赋值的变量叫暗示全局变量
console.log(window.a) // a -> window.a
                      // b -> window.b

/**
window = {
  a: 1,
  b: 2
}
*/
```
未声明就赋值的变量就是全局变量，在全局域中声明的变量也是全局变量，它们都归`window`所有。在全局域中`a`等于`window.a`，`b`等于`window.b`。

在函数内部没有声明变量而直接给变量赋值的，如`b`，就提升到全局变量。
```js
function test(){
  var a = b = 1
}
test();
console.log(window.b); // 1
console.log(windown.a); // undefined 访问对象中不存在的属性
console.log(a); // 报错
```
:::tip
声明了的变量也叫全局变量，未声明直接赋值的变量叫暗示全局变量（window叫全局域）
:::

## AO
AO（activation object） 活跃对象，函数上下文

函数预编译过程：
1. 寻找函数的形参和变量声明
2. 把实参的参数值赋值给形参
3. 寻找函数体内的函数声明，并赋值函数体
4. 执行函数

### 例一
```js
function test(a){
  console.log(a);  // f a(){}
  var a = 1;
  console.log(a); // 1
  function a(){}
  console.log(a); // 1
  var b = function(){}
  console.log(b); // f (){}
  function d(){}
}

test(2)

// AO = {
//   a: undefined ->
//     2 ->
//     function a(){} ->
//     1,
//   b: undefined -> function(){},
//   d: function d(){}
// }
```

### 例二
```js
function test(a, b){
  console.log(a) 
  c = 0
  var c;
  a = 5
  b = 6
  console.log(b)
  function b(){}
  function d(){}
  console.log(b)
}
test(1)
/**
 * 运行结果：
 * 1
 * 6
 * 6
*/
/** 分析
AO ={
  a: undefined ->
    1 ->
    5,
  b: undefined ->
    function b(){} ->
    6,
  c: undefined ->
    0,
  d: function d(){}
}
**/
```
## GO
GO（global object） 全局上下文 

全局执行流程：
1. 找变量
2. 找函数声明
3. 函数执行

### 例一
```js
var a = 1 
function a(){
  console.log(a)
}
console.log(a)
/**
 * 运行结果：
 * 1
*/

/** 分析
 * GO = {
 *  a: undefined ->
 *    function a(){} ->
 *    1,
 * }
 * 
 * GO === window
*/
```
### 例二
```js
console.log(a, b)
function a(){}
var b = function(){}
/**
 * 运行结果
 * ƒ a(){}  undefined
*/
/** 分析
 * GO ={
 *    b: undefined,
 *    a: function a(){}
 * }
*/
```
### 例三
```js
function test(){
  var a = b = 1
  console.log(b)
}
test()
/**
 * 运行结果：
 * 1
*/
/**
 * GO = {
 *    b: 1
 * }
 * 
 * AO ={
 *    a: undefined -> 1
 * }
*/
```
### 例四
```js
var b = 3;
console.log(a);
function a(a){
  console.log(a);
  var a = 2;
  console.log(a);
  function a(){};
  var b = 5;
  console.log(b);
}
a(1)

/**
 * 运行结果：
 * ƒ a(a){
    console.log(a)
    var a = 2
    console.log(a)
    function a(){}
    var b = 5
    console.log(b)
  }
  ƒ a(){}
  2
  5
*/
/**
 * GO = {
 *    b: undefined -> 3
 *    a: function a(){...}
 * }
 * 
 * AO = {
 *    a: undefined -> 1 -> function a(){} -> 2
 *    b: undefined -> 5
 * }
 * 
*/
```
### 例五
```js
a = 1 
function test(){
  console.log(a)
  a = 2
  console.log(a)
  var a = 3
  console.log(a)
}
test()
var a;
console.log(a)
/**
 * 运行结果：
 * undefined
 * 2
 * 3
 * 1
*/
/**
 * GO = {
 *    a: undefined ->1
 *    test: function test(){...}
 * }
 * 
 * AO = {
 *    a: undefined -> 2 -> 3
 * }
*/
```
### 例六
```js
function test(){
    console.log(b);
    if(a){
        var b = 2;
    }
    c = 3;
    console.log(c);
}

var a;
test();
a = 1;
console.log(a);
/**
运行结果：
undefined,
3,
1
*/

/**
GO = {
    a: undefined -> 1,
    test: function test(){...},
    c: 3
}

AO = {
    b: undefined
}
*
```

## 面试题
### 题一
```js
var a = false + 1;
console.log(a); // 1
/**
有加号，所以false会转换为数字类型0
*/
```
### 题二
```javascript
var b = false == 1;
console.log(b); // false
```
### 题三
```javascript
if(typeof(a) && (-true) + (+undefined) + ''){
    console.log('通过了'); // 通过了
}else{
     console.log('没通过');
}
/**
typeof(a)返回'undefined'，是字符串'undefined'，是真
(-true) 转为 -1，是真
+undefined 转为NaN
(-true) + (+undefined) + '' => 字符串的NaN => 为真
*/
```
### 题四
```javascript
if(1 + 5 * '3' === 16){
    console.log('通过了'); // 通过了
}else{
    console.log('没通过');
}
/**
5 * '3' 时，'3'要转换为数字类型3
*/
```
### 题五
```javascript
console.log(!!' ' + !!'' - !!false || '没通过'); // 1
/**
!!' ' 不是空字符串，是有一个空格
!!' ' + !!'' - !!false 执行结果为 1
*/
```

## 练习
### 例一
```js
function test(){
    return a
    a = 1
    function a(){}
    var a = 2
}
console.log(test())
```
::: details 点击查看结果
```javascript
/**
 * 运行结果：
 * ƒ a(){}
*/
/**
 * AO = {
 *      a: undefined -> function a(){}
 * }
*/
```
:::

### 例二
```js
console.log(test())
function test(){
    a = 1;
    function a(){}
    var a = 2;
    return a
}
```
::: details 点击查看结果
```javascript
/**
 * 运行结果：
 * 2
*/
/**
 * AO = {
 *      a: undefined -> function a(){} -> 1 -> 2
 * }
*/
```
:::
### 例三
```js
a = 1
function test(e){
    function e(){}
    arguments[0] = 2
    console.log(e)
    if(a){
        var b = 3
    }
    var c;
    a = 4
    var a;
    console.log(b);
    f = 5
    console.log(c);
    console.log(a);
}
var a;
test(1);
console.log(a);
console.log(f);
```
::: details 点击查看结果
```js
/**
 * 运行结果：
 * 2
 * undefined
 * undefined
 * 4
 * 1
 * 5
*/
/**
 * GO = {
 *      a: undefined -> 1,
 *      test: function test(){...},
 *      f: 5
 * }
 * AO = {
 *      e: undefined -> 1 -> function e(){} -> 2,
 *      b: undefined,
 *      c: undefined,
 *      a: undefined -> 4
 * }
*/
```
:::

总结：
1. 找形参和变量声明
2. 实参值赋给形参
3. 寻找函数声明
4. 执行函数









## 作用域
函数也是一种对象类型，即引用类型。
```js
function test(a, b){}
```
有属性`test.name`, `test.length`, `test.prototype`等。对象有一些属性是我们无法访问的，也就是JS引擎内部固有隐式属性。

### `[[scope]]`
`[[scope]]`是什么？
1. 函数创建时，生成的一个JS内部隐式属性
2. 函数存储作用域链的容器
   - AO/GO
   - AO，函数的执行期上下文
   - GO，全局的执行期上下文
   - 函数执行完成以后，AO是要销毁的。再次执行函数时会生成新的AO，而老的AO在函数执行完毕后就销毁了。
   - AO是一个即时的存储容器。作用域链就是将这些AO从上到下排列起来，形成一个链式关系。

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
1. 全局执行
```js
function a(){}
var c = 3
```
**当函数`a`被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局执行期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`a`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain01.png')" alt="scope-chain01"> 

2. `a`函数执行
```js
function a(){
    function b(){}
    var a = 1;
}
var c = 3;
a(); // 执行
```
**当`a`函数被执行时（前一刻）**，作用域链的顶端（第`0`位）存储`a`函数生成的函数执行期上下文`AO`，同时第`1`位存储`GO`。查找变量是到`a`函数存储的作用域链中从顶端开始依次向下查找。  
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain02.png')" alt="scope-chain02">   
在`a`函数执行时，`b`函数被定义。  
**当`b`函数被定义时**，是在`a`函数环境下，所以`b`函数这时的作用域链就是`a`函数被执行期的作用域链。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain03.png')" alt="scope-chain03"> 

3. `b`函数执行
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
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain04.png')" alt="scope-chain04"> 

4. `b`函数执行结束   
   
**当`b`函数被执行结束后**，`b`函数的`AO`被销毁，回归被定义时的状态。下图展示`b`函数的`AO`被销毁。
<img :src="$withBase('/basicFrontEnd/JavaScript/scope-chain05.png')" alt="scope-chain05"> 

1. `a`函数执行结束  
**当`a`函数被执行结束时**，`a`函数的`AO`被销毁的同时，`b`函数的`[[scope]]`也将不存在。`a`函数回归到被定义时的状态。

问题：
1. b函数执行时包含的a的AO，和a函数执行时a的AO，是不是同一个AO？   
    是同一个AO，访问的是同一个地址。
2. 当函数b执行完成后会发生什么？函数a执行完成后发生什么？   
   当函数b执行完成后，b作用域链里面自己的AO会被销毁，执行上下文没有了，这种状态就回到了b函数被定义时的状态。a函数执行完成以后，它自己的AO也会被销毁，但是a函数里面存了b函数，当整个a的AO销毁后，b函数就不存在了，即b函数的`[[scope]]` 不存在了，作用域链不存在了。
3. 为什么外面无法访问到内部的变量？   
   因为外部函数没有内部函数执行时的AO环境，但是内部函数在执行的时候引用了外部函数的AO上下文。   

总结：
1. 全局执行的前一刻，就生成GO，函数声明已经定义，当函数被定义的时候已经形成作用域链[[scope] -> scope chain -> GO， 在函数执行的时候才会生成AO。
2. 外层函数执行时，里层函数被定义。


### 练习
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
## 闭包
理解闭包：
1. 一个作用域可以访问另外一个函数的局部变量
2. 当内部函数被返回到外部并保存时，一定会产生闭包，闭包会使原来的作用域链不释放，过渡的闭包可能会导致内存泄漏，或加载过慢。

```js
function test1(){
  function test2(){
    var b  =2;
    cosnole.log(a)
  }
  var a  = 1;
  return test2
}
var c = 3
var test3 = test1()
test3()
```
逐步分析上面执行过程：
- 1. 全局执行
```js
function test1(){}
var c = 3
var test3 = test1()
```

**当`test1`函数被定义时**，系统生成`[[scope]]`属性，`[[scope]]`保存该函数的作用域链，该作用域链的第`0`位存储当前环境下的全局期上下文`GO`，`GO`里存储全局下的所有对象，其中包含函数`test1`、`test3`和全局变量`c`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure01.png')" alt="closure01"> 

- 2. `test1`函数执行
```js
function test1(){
  function test2(){}
  var a = 1
  return test2
}
var c = 3
var test3 = test1() // 执行
```

**当`test1`函数被执行时（前一刻）**，函数`test2`被定义，`test2`的`[[scope]]`生成，放的是和`test1`执行期一模一样的作用域链。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure02.png')" alt="closure02">

- 3. `test1`执行结束
```js
function test1(){
  function test2(){
    var b  =2;
    cosnole.log(a)
  }
  var a  = 1;
  return test2 // 执行
}
var c = 3
var test3 = test1()
test3()
```
**当`test1`被执行结束时**，因为`test2`被返回到外部，且被全局变量`test3`接收，这时`test1`的AO并没有销毁，只是把线剪断了，`test2`的作用域链还连着`test1`的`AO`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure03.png')" alt="closure03">

- 4. `test3`执行
```js
function test1(){
  function test2(){
    var b = 2;
    console.log(a);
  }
  var a = 1;
  return test2
}
var c = 3;
var test3 = test1();
test3(); // 执行
```

**当`test3`执行**，`test2`的作用域链增加自己的`AO`，当打印`a`的时候，在自己的`AO`上没有查找到，则向`test1`的`AO`查找，再次执行`test3`的时候，实际操作的仍然是`test1`的`AO`。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure04.png')" alt="closure04">

- 5. `test3`执行结束   
    
**当`test3`执行结束后**，`test2`的`AO`被销毁，但是原来`test1`的`AO`仍然存在且被`test2`连着。  
<img :src="$withBase('/basicFrontEnd/JavaScript/closure05.png')" alt="closure05">

问题：
1. 当再次执行test3的时候，会重新生成test2的AO，而test1的AO还是原来的AO。

## 练习
1. 例一
```js
function test(){
  var n = 1;
  function add(){
    n++;
    console.log(n);
  }

  function reduce(){
    n--;
    console.log(n)
  }

  return [add, reduce];
}
var arr = test()
arr[0](); // 101
arr[1](); // 100
```
test的AO被返回到全局中

2. 例二
```js
function breadMgr(num){
  var breadNum = arguments[0] || 10;

  function supply(){
    breadNum += 10;
    console.log(breadNum);
  }

  function sale(){
    breadNum --;
    console.log(breadNum)
  }

  return [supply, sale];
}

var breadMgr = breadMgr(50);
breadMgr[0](); // 60
breadMgr[1](); // 59
breadMgr[1](); // 58
breadMgr[1](); // 57
```

3. 例三
```js
function sunSched(){
  var sunSched = '';

  var operation = {
    setSched: function(thing){
      sunSched = thing
    },
    showSched: function(){
      console.log('My schedule on sunday is '+ sunSched)
    }
  }

  return operation;
}

var sunSched = sunSched();

sunSched.setSched('studying');
sunSched.showSched() // My schedule on sunday is studying

```