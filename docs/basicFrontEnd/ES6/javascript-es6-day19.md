---
autoGroup-1: ES6
sidebarDepth: 3
title: 19. Promise
---


## Promise由来
单线程如果遇到数据量大的问题，解决的方案是异步操作，而一步操作通常是通过回调函数的方式进行解决。在JQuery中也是通过Callbacks处理异步操作，而JQuery中的Deferred()方法返回的对象就是一个异步操作的容器对象（引出Promise的），储存异步操作，所以也可以说Promise是阉割版的Deferred()。   

1. Jquery中的Deferred()代码
```js
function  waitHandle(){
  // 创建一个deferred对象
  var dtd = $.Deferred();
  var wait = function(){

    var task = function(){
      console.log('执行完成');
      // 表示异步任务已经完成
      dtd.resolve(); // 引出Promise的概念
    }
    setTimeout(task, 2000);    
  }
  return dtd;
}

// w变量保存异步操作的容器对象
var w = waitHandle();
w.done(function(){
  console.log('ok1')
}).fail(function(){
  console.log('err1')
})
```

2. Promise A+ 是什么呢？   
Promise A+规范：不止JQ利用callback实现promise，还有其他的库实现Promise，但是都是要遵循Promise A+规范进行开发的。

## Promise的作用
1. Promise解决回调地狱的问题   
异步操作通过回调地狱进行解决，但是多层嵌套的回调函数产生回调地狱的问题，导致后期代码维护困难，所以通过Promise解决回调地狱的问题。

2. Promise解决try...catch只能捕获到同步代码的异常   
try...catch只能捕获到同步代码中抛出的异常，而异步操作中的异常并不能够进行捕获。
```js
try{
  // 同步异常
  console.log(a);
  // 异步异常
  setTimeout(function(){
    console.log(a);
  }, 30)
}catch(e){
  console.log(e); // ReferenceError: a is not defined at app.js:3:15
}
```
3. Promise解决同步并发异步代码的问题
