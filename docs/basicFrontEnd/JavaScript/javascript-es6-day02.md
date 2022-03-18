---
autoGroup-2: ES6
sidebarDepth: 3
title: day02
---

## 默认参数
第一种方式
```js
function foo(x, y) {
    x = x || 1;
    y = y || 2;
    console.log(x + y);
}
foo(); // 3
foo(5, 6);// 11
foo(5);// 7 
foo(null, 6); // 7
foo(0, 5); // 6  0被判为假值
```
第二种方式
```js
function foo(x, y) {
    x = typeof(arguments[0]) !== 'undefined' ? arguments[0] : 1;
    y = typeof(arguments[1]) !== 'undefined' ? arguments[1] : 2;

    console.log(x + y);
}
foo(); // 3
foo(5, 6); // 11
foo(5); // 7 
foo(null, 6); // 6 null值判断不正确
foo(0, 5); // 5  0被判为假值
```
ES6的写法
```js
function foo(x = 1, y = 2) {
    console.log(x + y);
}
foo(); // 3
foo(5, 6); // 11
foo(5); // 7 
foo(null, 6); // 6 
foo(0, 5); // 5  
```
采用ES6的写法与第二种写法类似。

## 作用域
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
   
```js
let x = 1;
function foo(x, y = x){
    console.log(y);
}
foo(2); // 2
```
参数y的默认值等于变量x。调用函数foo时，参数形成一个单独的作用域。在这个作用域里面，默认值变量x指向第一个参数x，而不是全局变量x。

```js
let x = 1;

function foo(y = x) {
    let x = 2;
    console.log(y); // 1
}
foo();
```
函数foo调用时，参数y = x形成一个单独的作用域。这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x。函数调用时，函数体内部的局部变量x影响不到默认值变量x。    
如果此时，全局变量x不存在，就会报错
```js
function foo(y = x){ // ReferenceError: x is not defined
    let x = 2;
    console.log(y);
}
foo(); 
```
同理，下面也会报错
```js
let x = 1;
function foo(x = x){ // Cannot access 'x' before initialization
    console.log(x);
}
foo();
```
参数x = x形成一个单独作用域。实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错。
```js
let x = 1
function foo(x = x) {
    let x = 2; // Identifier 'x' has already been declared
    console.log(x);
}
foo();
```
报错顺序：先判断函数内部，参数变量是默认声明的，所以不能用let或const再次声明；如果没有错误，再对函数形成判断。
```js
function foo(x = 2) {
    let x = 1; // Identifier 'x' has already been declared
    console.log(x);
}
foo();
```
foo(x = 2)相当于声明了let x = 2。

参数默认值是惰性求值的。参数默认值不是传值的，而是每次都重新计算默认值表达式的值。
```js
let x = 99;
function foo(p = x + 1){
    console.log(p);
}
foo();// 100
x = 100;
foo(); // 101
```

