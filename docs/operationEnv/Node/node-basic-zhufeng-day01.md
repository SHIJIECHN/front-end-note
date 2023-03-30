---
autoGroup-4: Node基础(珠峰)
sidebarDepth: 3
title:  1. 高阶函数
---

## 高阶函数的概念

- 1. 一个函数返回一个函数
- 2. 一个函数参数可以接受一个函数

这两个条件满足任何一个均可，promise内部肯定也是回调函数（内部包含着高阶函数）。

扩展方法，会用到高阶函数

```javascript
function core(...args) {
  console.log('core', args);
}
// 问题：给core函数增加一些额外的逻辑，但是不能更改核心代码

Function.prototype.before = function (cb) {
  // this = core 谁调的before，this就指向谁
  return (...args) => { // newCore 剩余运算符可以把多个参数转化成数组
    cb();
    this(...args); // core()执行
  }
}

// before就是一个高阶函数
let newCore = core.before(() => {
  console.log('before')
});

newCore('a', 'b');
/**
before
core [ 'a', 'b' ]
 */
```

高阶函数的应用：

1. 如果我们想给函数进行扩展，可以使用高阶函数

## 函数柯里化

多个参数的传入，把它转化成n的函数，可以暂存变量。

一般柯里化参数要求，都是一个个的传，正规的叫偏函数。

### 1. 一般判断类型的写法

判断一个变量的类型（代码的实现，类型的基本条件）
1. typeof 我们用于判断基础类型
2. instanceof xxx是谁的实例 原理
3. Object.prototype.toString.call 判断具体类型，返回的是一个字符串
4. constructor

```javascript
function isType(val, typing) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}

console.log(isType('abc', 'String'))
```
减少用户的输入错误几率

```javascript
function isString(typing) {
  return function (val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`;
  }
}
let myIsString = isString('String');
console.log(myIsString('abc'));
console.log(myIsString(123));
```

### 2. 柯里化的引入

柯里化：让函数变得更具体一些。反柯里化：让函数范围变得更大一些。

问题：实现相加
```js
function sum(a, b, c, d) {
  return a + b + c + d
}
sum(1,2,3,4)
```

使用柯里化思路：我要记录每次调用时传入的参数，并且和函数的参数个数进行比较，如果不满足总个数，就返回新函数，如果传入的个数和参数一致，执行原来的函数。

```javascript
function currying(fn) {
  // fn.length; // 函数参数的个数
  // 1. 存储每次调用的时候传入的变量
  const inner = (args = []) => { // args存储每次调用时传入的参数

    if (args.length >= fn.length) {
      return fn(...args); // 原来的函数执行，也就是sum执行
    } else {
      // userArgs是每次传入的参数
      return (...userArgs) => inner([...args, ...userArgs]); // 返回inner，并且参数拼接
    }
  }
  return inner();
}

function sum(a, b, c, d) {
  return a + b + c + d
}

let sum1 = currying(sum);
let sum2 = sum1(1);
let sum3 = sum2(2, 3);
let result = sum3(4);

console.log(result)
```

### 3. 使用柯里化优化类型判断

```javascript
function currying(fn) {
  // 1. 存储每次调用的时候传入的变量
  const inner = (args = []) => { // args存储每次调用时传入的参数

    if (args.length >= fn.length) {
      return fn(...args); // 原来的函数执行
    } else {
      // userArgs是每次传入的参数
      return (...userArgs) => inner([...args, ...userArgs]); // 返回inner，并且参数拼接
    }
  }
  return inner();
}


function isType(typing, val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}

let isString = currying(isType)('String');
console.log(isString('abc'));
```

### 4. 生成工具类

```javascript
function currying(fn) {
  // 1. 存储每次调用的时候传入的变量
  const inner = (args = []) => { // args存储每次调用时传入的参数

    if (args.length >= fn.length) {
      return fn(...args); // 原来的函数执行
    } else {
      // userArgs是每次传入的参数
      return (...userArgs) => inner([...args, ...userArgs]); // 返回inner，并且参数拼接
    }
  }
  return inner();
}


function isType(typing, val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}

let util = {};
['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach(type => {
  util['is' + type] = currying(isType)(type);
})

console.log(util.isString('abc')); // true
console.log(util.isString(123)); // false
```

## 并发问题

```javascript
const fs = require('fs');

// 读取两个结果
let arr = [];

function out() {
  if (arr.length === 2) {
    console.Console.log(arr);
  }
}

fs.readFile('./a.txt', 'UTF8', function (err, data) {
  arr.push(data);
  out(); // 每次执行完，通知我
})
fs.readFile('./b.txt', 'UTF8', function (err, data) {
  arr.push(data);
  out();
})
// 问题：全局污染，多人写作会冲突
```

调整。只有最后了才会触发回调得到结果。
```javascript
const fs = require('fs');

function after(times, callback) {// 高阶函数
  let arr = [];// 目前我们不关心顺序
  return (data) => {
    arr.push(data);// 保证顺序，可以使用索引
    if (--times === 0) { // 多个请求并发，需要计数器实现
      callback(arr)
    }
  }
}

let out = after(2, (arr) => {
  console.log(arr);// [ 'a', 'b' ]
})

fs.readFile('./Promise/a.txt', 'utf-8', function (err, data) {
  out(data); // 每次执行完，通知我
});
fs.readFile('./Promise/b.txt', 'utf-8', function (err, data) {
  out(data);
})
```

优化：发布订阅模式

订阅 -> 发布。每次完成一个都能都能获得结果。

```javascript
const fs = require('fs');
// 发布订阅模式核心就是把多个方法先暂存起来，最后一次执行，
// 主要解决的问题是解耦。可以把订阅的逻辑分散到各个类中

// 事件中心
let events = {
  _events: [],

  on(fn) {
    this._events.push(fn)
  },
  emit(data) {
    this._events.forEach(fn => fn(data));
  }
}

// 订阅有顺序
events.on(() => {
  console.log('每读一次，就触发一次');
});

let arr = [];
events.on((data) => {
  arr.push(data);
});

events.on((data) => {
  if (arr.length === 2) { // 最终结果还是计数器
    console.log('读取完毕')
  }
});


fs.readFile('./a.txt', 'UTF8', function (err, data) {
  events.emit(data);
})
fs.readFile('./b.txt', 'UTF8', function (err, data) {
  events.emit(data);
})

/**
每读一次，就触发一次
每读一次，就触发一次
读取完毕
 */
```

观察者模式（vue2）
- 基于发布订阅的（发布订阅之间是没有依赖关系的）。对于我们的观察者模式，有观察者、被观察者
- 观察者模式基于类
- 观察者模式多了依赖关系，发布订阅是先订阅好，主动的去发布，观察者模式只要被观察者发生改变，就主动通知观察者

