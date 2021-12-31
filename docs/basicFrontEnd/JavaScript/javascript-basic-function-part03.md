---
autoGroup-3: JavaScript基础(小野森森)
title: 函数
---

## 函数
数学中，函数的基本定义，任意的x值，都有唯一确定的y与之对应，y=f(x)。函数值是确定的，即有确定性。

计算机中就是函数式编程。

编程的基本原则：高内聚低耦合。

### 函数定义
方式一：函数声明
```javaScript
function test(参数){
  // 执行语句
}
```

方式二：函数字面量
```js
var test = function test1(参数){
  // 执行语句
  console.log(test.name) // test1
}

test()
```
上面函数名为`test1`，调用函数是`test()`而不是`test1()`，省略了`test1`的函数为匿名函数表达式，`test1`的作用是可以在函数内部调用函数，也就是递归的使用。

### 函数的参数
函数的参数分为：实参和形参
```js
function test(a, b){
  console.log(test.length) // 形参的长度
  console.log(arguments.length) // 实参的长度
}

test(1, 2, 3)
```
`a, b`是函数的形参，起到占位的作用，调用函数传入的参数是函数的实参。

函数的里面可以更改实参的值
```js
function test(a, b){
  a = 3
  console.log(arguments[0]) // 3
}

test(1, 2)

function test2(a, b){
  b = 3
  console.log(arguments[1]) // undefined
}

test2(1)
```

函数实参传了值的可以在函数内部修改实参的值，而不传入的实参，函数内部给形参赋值


