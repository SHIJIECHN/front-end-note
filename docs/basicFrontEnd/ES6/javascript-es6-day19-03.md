---
autoGroup-1: ES6
sidebarDepth: 3
title: 19. Promise手写基础
---

## Promise手写结构
1. 同步执行代码
   - resolve回调函数，reject回调函数

2. 异步执行代码
   - 发布订阅、装饰器、收集回调等待执行

3. then方法链式调用
   1. 回调函数返回原始值
        * 回调函数的返回值做为下次then方法中回调函数中的参数
   2. 回调函数返回非原始值
        * 返回值类型：Promise对象、thenable对象、普通对象
        * Promise对象、thenable对象：then方法执行、递归调用then方法中的回调函数
        * 普通对象：执行新then方法中的成功回调函数

## 环境搭建
```js
// 初始化package.json
npm init -y

// 创建index.js和data文件夹
// 全局安装nodemon
npm i -g nodemon

// 启动命令dev。修改package.json文件
"scripts": {
    "dev": "nodemon ./index.js -i ./data/"
}

// 启动
npm run dev
```



## 同步代码
```javascript
let promise = new Promise((resolve, reject) => { // executor
    // resolve('success');
    // reject('Error');
    throw new Error('Exception Error');
});

promise.then((value) => {
    console.log(value);
}, (reason) => {
    console.log('Rejected Error: ', reason);
});
```
1. 首先Promise构造函数中的executor执行者函数是同步执行，执行者作为实际参数传入传入到Promise构造器中，而内部的resolve，reject的函数作为形式参数被传入；所以手写Promise源码的时候，要编写resolve，reject函数与之对应；resolve函数：设置成功状态下的Promise实例对象的状态，成功状态下回调函数携带参数值；reject函数：设置失败状态下的Promise实例对象的状态，失败状态下回调函数携带的参数值。
2. 在Promise.prototype.then(onFulfilled, onRejected)方法需要传入成功状态的回调函数，失败状态的回调函数；根据Promise实例对象的状态进行调用不同的回调函数。
```javascript
const PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        // 设置Promise实例对象的状态，默认pending状态
        this.status = PENDING;
        // 设置Promise实例对象成功回调函数的参数，默认undefined
        this.value = undefined;
        // 设置Promise实例对象失败回调函数的参数，默认undefined
        this.reason = undefined;

        // 设置成功回调函数
        const resolve = (value) => {
            if (this.status === PENDING) {
                // 成功回调函数控制Promise实例对象成功的状态和参数
                this.status = FULFILLED;
                this.value = value;
            }
        }

        // 设置失败回调函数
        const reject = (reason) => {
            if (this.status === PENDING) {
                // 失败回调函数控制Promise实例对象失败的状态和参数
                this.status = REJECTED;
                this.reason = reason;
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }

    }

    // Promise.prototype.then()方法
    then(onFulfilled, onRejected) {
        // 根据Promise实例对象的状态进行调用不同的回调函数
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
    }
}

module.exports = MyPromise
```

## 异步代码


## then方法链式调用
### 1. 回调函数返回原始值

### 2. 回调函数返回非原始值