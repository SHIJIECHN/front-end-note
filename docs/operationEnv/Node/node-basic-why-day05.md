---
autoGroup-3: Node基础
sidebarDepth: 3
title:  5. 浏览器的事件循环
---

## 什么是事件循环
1. 事件循环理解成我们编写的JavaScript和浏览器或者Node之间的一个桥梁。
2. 浏览器的事件循环：是JavaScript代码和浏览器API调用（setTimeout/AJAX/监听事件等）的一个桥梁，桥梁之间他们通过回调函数进行沟通。
3. Node事件循环：JavaScript代码和系统调用（file system、network等）之间的一个桥梁, 桥梁之间他们通过回调函数进行沟通的。

## 进程与线程
### 1. 定义
- 进程(process)：计算机已经运行的程序。
- 线程(thread)：操作系统能够运行运算调用的最小单位。

直观解释：   
- 进程： 启动一个引用程序，就会默认启动一个进程（也可能是多个进程）
- 线程：每一个进程中，都会启动一个线程用来执行程序中的代码，这个线程被称之为主线程。所以我们也可以说进程是线程的容器。

### 2. 多进程多线程开发
CPU的运算很快，它可以快速的在多个进程之间迅速的切换，当我们的进程中的线程获取到时间片时，就可以快速执行我们编写的代码。

## 浏览器与JavaScript
1. JavaScript是但线程的，但是JavaScript线程有自己的容器进程：浏览器或Node。
2. 浏览器是多进程的，当我们打开一个Tab页面时就会开启一个新的进程。这是为了防一个页面卡死造成所有的页面无法响应。
3. 每个进程中有很多线程，其中包括执行JavaScript代码的线程。
4. JavaScript代码是在一个单独的线程中执行的，在同一个时刻只能做一件事情，如果这件事非常耗时，当前的线程就会被阻塞。

JavaScript执行过程：
```js
const name = 'codewhy';
console.log(name);

function sum(num1, num2){
  return num1 + num2;
}

function bar(){
  return sum(20, 30)
}

const result = bar();
console.log(result);
```
执行过程：
1. 定义变量name
2. 执行log函数，函数会被放入到调用栈中执行
3. 调用bar()函数，被压入到调用栈中，但是执行未结束
4. bar因为调用了sum，sum函数被压入到调用栈中，获取到结果后出栈
5. bar获取到结果后出栈，获取到结果result
6. 将log函数压入到调用栈，log被执行，并且出栈

有异步操作：setTimeout。
```js
setTimeout(()=>{
  console.log("setTimeout");
}, 1000);
// 实际上有两个函数：setTimeout函数 和 回调函数timer
```
1. 中间插入一个setTimeout的函数调用
2. 这个函数被放入调用栈中，执行会立即结束，并不会阻塞后续代码执行   
传入的回调函数，什么时候执行？   
setTimeout是调用了web API，在合适的时机，会将回调函数加入到事件队列中。事件队列中的函数，会被放入到调用栈中，在调用栈中被执行。 

## 浏览器的事件循环

<img :src="$withBase('/operationEnv/Node/event_loop_browser.png')" alt="event_loop_browser"> 

## 宏任务与微任务
事件循环中维护两个队列：
1. 宏任务队列(macrotack queue)： AJAX、setTimeout、setInterval、DOM监听、UI Rendering等
2. 微任务队列(microtask queue)：Promise的then回调、Mutation Observer API、queueMicrotask等

宏任务执行之前，必须保证微任务队列是空的，如果不为空，就优先执行微任务队列中的任务（回调）。

### 1. 面试题1 
main script、setTimeout、Promise、then、queueMicrotask
```js
// setTimeout1
setTimeout(() => {
 console.log('set1');
 
 // promise3
 new Promise(function(resolve){
   resolve();
   // then2
 }).then(function(){
  // promise4
   new Promise(function(resolve){
     resolve();
     // then4
   }).then(function(){
     console.log('then4');
   });
   console.log('then2');
 })
});

// promise1
new Promise(function(resolve){
  console.log('pr1');
  resolve();
  // then1
}).then(function(){
  console.log('then1');
})

// setTimeout2
setTimeout(function(){
  console.log('set2');
})

console.log('2');

// queueMicrotask1
queueMicrotask(() => {
  console.log('queueMicrotask1');
});

// promise2
new Promise(function(resolve){
  resolve();
  // then3
}).then(function(){
  console.log('then3');
})
```
执行结果：
```md
pr1
2
then1
queueMicrotask1
then3
set1
then2
then4
set2
```

### 2. 面试题2
main script、setTimeout、Promise、then、queueMicrotask、await、async

async、await是Promise的一个语法糖：
- 可以将await关键字后面执行的代码，看做是包裹在（resolve, reject）= > { 函数执行 }中的代码
- await的下一条语句，可以看做是then(res => { 函数执行 })中的代码

```js
async function async1(){
  console.log('async start');
  await async2();
  console.log('async1 end');
}

async function async2(){
  console.log('async2');
}

console.log('script start');

Promise.resolve().then(()=>{
  console.log('resolve then');
})

setTimeout(function(){
  console.log('setTimeout');
}, 0);

async1();

new Promise(function(resolve){
  console.log('promise1');
  resolve();
}).then(function(){
  console.log('promise2');
})

console.log('script end');
```
执行结果：
```md
script start
async start
async2
promise1
script end
resolve then
async1 end
promise2
setTimeout
```