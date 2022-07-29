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
```javascript
let promise = new MyPromise((resolve, reject) => { // executor
    setTimeout(() => {
        resolve('Success')
    }, 2000)
});

promise.then((value) => {
    console.log('Fulfilled1: ' + value);
}, (reason) => {
    console.log('Rejected1: ', reason);
});
promise.then((value) => {
    console.log('Fulfilled2: ' + value);
}, (reason) => {
    console.log('Rejected2: ', reason);
});
```
1. Promise构造器中executor是同步代码，首先执行setTimeout，由于setTimeout是同步接口，它会在WebApis注册一个异步的计时回调函数；异步回调函数代码会在WebApis中进行挂起，等待执行；promise.then方法实行，此时Promise实例的对象状态并没有发生改变，当异步回调函数执行后，resolve('success')才会执行，此时才会改变Pro貌似额实例对象状态，所以当promise.then执行时，promise实例对象的状态应该为默认pending状态。
2. then()方法中设置Promise实例对象为pending状态的逻辑，处理异步代码执行的逻辑；通过发布订阅和修饰器的思想进行处理：由于不确定异步函数回调的具体执行的时间，name我们可以先将其收集起来**此时注意，不能够直接将回调函数push进入数组找那个，因为会丢失参数，需要push入一个函数，在函数中执行传入的异步回调函数**，当需要执行的时候（promise状态改变的时候）再拿出来执行。
3. 因为resolve()方法，reject()方法可以改变Promise实例对象状态，所以需要在该函数内部进行执行异步回调函数。
4. 利用数组储存异步回调函数，并且在执行的时候循环遍历执行每一个异步回调函数，解决了同一实例对象多次调用then方法的问题。

```javascript
// 设置异步操作成功的回调函数
this.resolvedPromiseCallbacks = [];
// 设置异步操作失败的回调函数
this.rejectedPromiseCallbacks = [];

// 设置成功回调函数
const resolve = (value) => {
    if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 发布。执行异步操作成功的回调函数
        this.onFulfilledCallbacks.forEach(fn => fn())
    }
}

// 设置失败回调函数
const reject = (reason) => {
    if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 发布。执行异步操作失败的回调函数
        this.onRejectedCallbacks.forEach(fn => fn())
    }
}

then(onFulfilled, onRejected) {
    if (this.status === PENDING) {
        // 订阅
        this.onFulfilledCallbacks.push(() => {
            onFulfilled(this.value)
        });
        this.onRejectedCallbacks.push(() => {
            onRejected(this.reason);
        })
    }
}
```

## then方法链式调用
链式调用的特点
1. 通过return来传递结果
2. 通过新的promise resolve结果
3. 通过新的promise reject原因
4. then走了失败的回调函数后，再走then
5. then中使用throw new Error
6. 用catch捕获异常

```javascript
let promise = new Promise((resolve, reject) => {
    resolve('First resolve');
})

// 1.通过return来传递结果
promise.then(res => {
        return res; // 普通值
    })
    .then(res => {
        console.log(res); // First resolve
    });

// 2.通过新的promise resolve结果
promise.then(res => {
        return res; // 普通值
    })
    .then(res => {
        return new Promise((resolve, reject) => {
            // resolve(res);
            // 当 new Promise的时候，里面不管有没有异步，只要是resolve了结果，就走then的onFulfilled的回调
            setTimeout(() => {
                resolve(res);
            }, 2000)
        })
    })
    .then(res => {
        console.log(res); // First resolve
    });

// 3.通过新的promise reject
promise.then(value => {
        return value; // 普通值
    })
    .then(value => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('Error');
            }, 2000)
        })
    })
    .then(value => {
        console.log(value);
    }, reason => {
        console.log('Rejected: ', reason); // Rejected:  Error
    })

// 4.then走了失败的回调函数后，再走then
promise.then(value => {
        return value; // 普通值
    })
    .then(value => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('Error');
            }, 2000)
        })
    })
    .then(value => {
        console.log(value);
    }, reason => {
        console.log('Rejected: ', reason); // Rejected:  Error
        //默认 return undefined
    })
    .then(value => {
        console.log(value); // undefined
        console.log('Fulfilled: ', value); // Fulfilled:  undefined
    }, reason => {
        console.log('Rejected: ', reason);
    })

// 5.then中使用throw new Error
promise.then(value => {
        return value; // 普通值
    })
    .then(value => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('Error');
            }, 2000)
        })
    })
    .then(value => {
        console.log(value);
    }, reason => {
        console.log('Rejected: ', reason); // Rejected:  Error
        //默认 return undefined
    })
    .then(value => {
        throw new Error('Throw Error');
    })
    .then(value => {
        console.log(value);
    }, reason => {
        console.log('Exeption: ', reason); // Exeption:  Error: Throw Error
    })

// 6.用catch捕获异常
promise.then(value => {
        return value; // 普通值
    })
    .then(value => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('Error');
            }, 2000)
        })
    })
    .then(value => {
        console.log(value);
    }, reason => {
        console.log('Rejected: ', reason); // Rejected:  Error
        //默认 return undefined
    })
    .then(value => {
        throw new Error('Throw Error');
    })
    .then(value => {
            console.log(value);
        },
        // reason =>{
        //     console.log('Then: ', reason);
        // }
    )
    .catch(err => {
        console.log('Catch: ', err); // Catch:  Error: Throw Error
        return 'Catch Error';
    })
    .then(value => {
        console.log('Then: ', value); // Then:  Catch Error
    })
```
catch在Promise的源码层面上就是一个then，catch也是遵循then的运行原则    
成功的条件：
1. then return普通JavaScript value
2. then return新的promise成功态的结果 value    

失败的条件：
1. then return 新的promise失败态的原因 reason
2. then 抛出异常throw new Error

```js
// promise要链式调用
// then return new Promise

// 下面两种情况的区别：
// 情况一
let promise2 = promise.then((value)=>{
    // return 第一次返回的新的promise结果
}).then((value)=>{
    // return 第二次返回的新的promise结果
})
// promise2是两次then后的新的promise结果

// 情况二
let promise2 = promise.then((value)=>{
    // return 第一次返回的新的promise结果
})
// promise2是第一次then返回的新的promise结果
promise2.then(()=>{

})
```
### 1. 回调函数返回原始值
Promise链式调用，我们需要注意，就是当then方法中的resolve、reject函数返回值是原始值的时候，此时返回值会作为下一个then方法中resolve函数的参考值，并且执行resolve
```js
let promise1 = new Promise((resolve, reject)=>{
  resolve('promise1')
})

let promise2 = promise1.then(value => {
  return value + '-> then -> promise2'
})
.then(value=>{
  console.log(value);
})
```
1. then方法的链式调用，有些人可能认为是return this实现链式调用的目的，但是这种情况对于Promise链式调用来说不可取，为什么呢？因为return this，此时的this指代的是上一个Promise实例对象，而下一个then方法与上一次Promise实例对象并没有任何关系；所以then方法返回的是一个全新的Promise实例对象。
2. then方法的链式调用关键点：then方法中resolve，reject回调函数的返回值是下一次Promise实例对象的then方法中resolve，reject的参数值；也就是说，x = onFulfilled(this.value); resolve(x)。
```js
then(onFulfilled, onRejected){
    let promise2 = new Promise((resolve, reject) =>{
      if(this.status === FULFILLED){
          let x = onFulfilled(this.value );
          resolve(x);
      }
      if(this.status === REJECTED){
          let x = onRejected(this.reason);
          resolve(x)
      }
      if(this.status === PENDING){
        this.onFulfilledCallbacks.push(()=>{
            let x = onFulfilled(this.value);
            resolve(x)
        })
        this.onRejectedCallbacks.push(()=>{
            let x = onRejected(this.reason)
            resolve(x)
        })
      }
    })
    return promise2;
  }
```
3. then方法中会抛出错误throw new Error，源码实现使用try...catch捕获异常。
```js
  then(onFulfilled, onRejected){
    let promise2 = new Promise((resolve, reject) =>{
      if(this.status === FULFILLED){
        try{
          let x = onFulfilled(this.value );
        }catch(e){
          reject(e)
        } 
      }
      if(this.status === REJECTED){
        try{
          let x = onRejected(this.reason);
        }catch(e){
          reject(e)
        }
      }
      if(this.status === PENDING){
        this.onFulfilledCallbacks.push(()=>{
          try{
            let x = onFulfilled(this.value);
          }catch(e){
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(()=>{
          try{
          let x = onRejected(this.reason)
          }catch(e){
            reject(e)
          }
        })
      }
    })
    return promise2;
  }
```

### 2. 回调函数返回非原始值
Promise链式调用，我们还需要注意，then方法resolve、reject函数返回的不是原始值，而是Promise对象，此时下一个then方法会根据回调函数返回的这个Promise对象的状态进行调用响应的回调函数。
```js
let promise1 = new Promise((resolve, reject)=>{
  resolve('promise1')
})

let promise2 = promise1.then(value => {
  // 2.
  return Promise.resolve(value + '-> then -> promise2')
  // 3.
  return new Promise((resolve, reject)=>{
    resolve(value + '-> then -> promise2')
  })
})
.then(value=>{
  console.log(value);
})
```
1. 返回值x此时返回的不再是原始值，而是Promise对象之类的数据类型，所以需要执行返回值Promise对象的then方法，获取then方法回调函数中的参数，将参数传递给新创建Promise实例对象then方法中的回调函数当作参数；resolvePromise(newPromise, returnPromise, resolve, reject)。
2. 根据PromiseA+规范，then方法返回的Promise实例对象不能够与then方法中回调函数返回的Promise实例对象相同，也就是newPromise !== returnPromise
3. 在创建resolvePromise方法时遇到两个问题
   1. newPromise作为新创建的Promise实例对象获取不到，程序抛出问题，因为newPromise是作为新创建的实例对象，而在构造器中调用newPromise对象，此时newPromise还没创建完成，又因为newPromise被let进行声明，所以在啊let之前调用变量，出现暂时性死区的问题，解决方式：设置延时器。
   2. 返回值是returnPromise是否也一同newPromise放入延时器中呢？如果不放入延时器中，因为executor函数时同步代码执行，所以返回值此时也是同步执行，而原生是异步执行，所以需要放入延时器。

<img :src="$withBase('/basicFrontEnd/ES6/promise21.png')" alt="promise" />

```js
function resolvePromise(promise2, x, resolve, reject){
  console.log(x); // promise1-> then -> promise2
}

then(onFulfilled, onRejected){
    let promise2 = new MyPromise((resolve, reject) =>{
      if(this.status === FULFILLED){
        setTimeout(()=>{
          try{
            let x = onFulfilled(this.value );
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            console.log(e);
            reject(e)
          }
        }, 0)
      }
  
      if(this.status === REJECTED){
        setTimeout(()=>{
          try{
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e)
          }
        }, 0)
      }
  
      if(this.status === PENDING){
        this.onFulfilledCallbacks.push(()=>{
          try{
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e)
          }
        })
  
        this.onRejectedCallbacks.push(()=>{
          try{
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
          }catch(e){
            reject(e)
          }
        })
      }
    })
    return promise2;
  }
```
