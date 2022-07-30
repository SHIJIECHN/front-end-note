---
autoGroup-1: ES6
sidebarDepth: 3
title: 19. Promise方法的重写
---

## promise.prototype.catch()
catch方法重写的注意事项：
1. catch方法能够捕获Promise对象抛出的异常，相当于是then方法的变种，promise.then(null, err=>{});
2. catch方法也能够返回Promise对象，并且实现Promise的链式调用

```javascript
catch(onRejected){
    return this.then(null, onRejeted);
}
```

## Promise.resolve()
1. 参数是普通值的时候，返回一个成功状态的Promise
2. 参数是Promise对象的时候，会直接返回原本的Promise，然后会对原本的Promise进行解析，获取到成功或者失败回调的参数值。