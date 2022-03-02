---
autoGroup-1: ECMAScript
sidebarDepth: 3
title: day03
---
## 函数
数学中，函数的基本定义，任意的 `x` 值，都有唯一确定的 `y` 与之对应，`y=f(x)`。函数值是确定的，即有确定性。

计算机中就是函数式编程。

编程的基本原则：高内聚低耦合。

## 函数定义
1. 方式一：函数声明
```javaScript
function test(参数){
  // 执行语句
}
```

1. 方式二：函数字面量

```js
var test = function test1(参数) {
  // 执行语句
  console.log(test.name); // test1
};
console.log(test.name); // test1

test();
```

上面函数名为`test1`，调用函数是`test()`而不是`test1()`，`test1`是自动被忽略的，写与不写对函数执行都没有影响。省略了`test1`的函数为匿名函数表达式，`test1`的作用是可以在函数内部调用函数，也就是递归的使用。

## 函数的参数

函数的参数分为：实参和形参

```js
function test(a, b) {
  console.log(test.length); // 形参的长度 2
  console.log(arguments.length); // 实参的长度 3
}
test(1, 2, 3);
```

`a, b`是函数的形参，起到占位的作用，调用函数传入的参数是函数的实参，即`1,2,3`。   

实参求和
```js
function sum(){
    var s = 0;
    for(var i = 0; i < arguments.length; i++){
        a += arguments[i];
    }
    console.log(a);
}
sum(1,2,3,4,5,6);
```

总结：实参和形参是一一对应的，形参和实参数量可以不相等。`arguments`是传入的实参的值。通过遍历`arguments`可以看到实参的值。

函数里面可以更改实参的值
```js
function test(a, b) {
  a = 3;
  console.log(arguments[0]); // 3 函数内部可以修改实参的值。
}
test(1, 2);

function test2(a, b) {
  b = 3;
  console.log(arguments[1]); // undefined 实参b并没有传入
}
test2(1);
```

函数实参传了值的可以在函数内部修改实参的值，而不传入的实参，函数内部给形参赋值是无效的。`a`和`arguments[0]`不是同一个量，`a`是存在栈内存中的，`arguments`是存储在堆内存中的数值，栈内存中存储指向堆内存的地址。但是两者存在映射的关系。

## return 的问题

```js
function test() {
  console.log("我正在执行");
  return;
  console.log("我是test函数"); // 不执行
}
```

执行`return`后，后面的语句将不会再执行。可以用`return`来终止函数的执行，返回相应的值。

## 变量类型
变量分为：全局变量和局部变量。函数体内部可访问外部的变量，而函数外部不能访问内部变量
```js
// 全局变量 [[scope]]
a = 1;
function test1(){
    // 局部变量
    var b = 2;
    console.log(a);

    function test2(){
        // 局部变量
        var c = 3;
        console.log(b);
    }
    test2();
    console.log(c);// 不能访问 Uncaught ReferenceError: c is not defined
}
```

## 函数参数的默认值

初始化参数，默认值：`undefined`。
```js
function test(a, b) {
  console.log(a); // undefined
  console.log(b); // undefined
}
test();
```
不给 `a` 和 `b` 传入参数，两者默认是 `undefined`

使用默认参数

```js
function test(a = 1, b = 2) {
  console.log(a); // 1
  console.log(b); // 2
}
test();
```
给a使用默认值，而b传入实参，此时给a传入实参undefined。
```js
function test(a = 1, b){
    console.log(a); // 1
    console.log(b); // 2
}
test(undefined, 2);
/*****************************/
function test(a = undefined, b){
    console.log(a); // 1
    console.log(b); // 2
}
test(1, 2); 
```
理解arguments实参和形参的关系，arguments[0]和形参a，哪个不是undefined，对应的值就是哪个。

有的浏览器不支持默认参数的情况，解决浏览器不支持默认参数的情况， 三种方式：

- 1. 使用`||`运算符

```js
function test(a, b) {
  var a = arguments[0] || 1;
  var b = arguments[1] || 2;

  console.log(a + b); // 3
}
test();
```

- 2. 使用`typeof`

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

## 练习
1. n 的阶乘，不使用 for 循环。 -> 递归

```js
// fact(n)
// 规律 : n! = n * fact(n-1)
// 出口 : n===1
function fact(n) {
  if(n === 1){
    return 1
  }
  return n * fact(n - 1);
}
// fact(5) = 5 * fact(4) -> 5 * 24
// fact(4) = 4 * fact(3) -> 4 * 6
// fact(3) = 3 * fact(2) -> 3 * 2
// fact(2) = 2 * fact(1) -> 2 * 1
```

2. 斐波那契数列
```js
// 规律： n3 = n2 + n1
// 出口： n <= 2 
function fb(n){
  if( n <= 2){
    return 1
  }
  return fb(n-1) + fb(n-2) 
}
// fb(5) = fb(4) + fb(3) -> 3 + 2
// fb(4) = fb(3) + fb(2) -> 2 + 1
// fb(3) = fb(2) + fb(1) -> 1 + 1

```

总结：递归总是在找到出口后，再一步一步向上计算出结果。递归需要注意两个因素：规律和出口

