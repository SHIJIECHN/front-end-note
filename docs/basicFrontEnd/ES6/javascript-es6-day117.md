---
autoGroup-1: ES6
sidebarDepth: 3
title: PromiseA++
---

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

## 实现基本的Promise
原生基本功能
```js
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
实现MyPromise。新建文件MyPromise.js
```js
// MyPromise.js

// 状态
const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'

class MyPromise {
    // 实例化就会执行
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined; // resovle的参数，开始时不明确的
        this.reason = undefined; // reject的参数，开始时不明确的

        // 因为每次实例化MyPromise相当于传入不同的resolve，而声明在constructor外面，相当于写在prototype上
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED; // 更改状态
                this.value = value
            }

        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED; // 更改状态
                this.reason = reason;
            }
        }

        // 捕获throw new Error
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }

        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
    }
}

module.exports = MyPromise;
```


## 异步与多次调用
原生
```js
let promise = new Promise((resolve, reject) => { // executor
    // resolve('success');
    // reject('Error');
    // throw new Error('Exception Error');

    // 异步：
    // 原生是会延迟两秒后输出:
    // Fulfilled1: Success
    // Fulfilled2: Success
    setTimeout(() => {
        resolve('Success'); // 2s以后调用resolve
    }, 2000);
});

// 当有多个promise的时候，是依次按顺序执行then
promise.then((value) => {
    console.log('Fulfilled1: ', value);
}, (reason) => {
    console.log('Rejected1 Error: ', reason);
});

promise.then((value) => {
    console.log('Fulfilled2: ', value);
}, (reason) => {
    console.log('Rejected2 Error: ', reason);
});
```
异步程序setTimeout是new MyPromise执行结束以后才会执行。而new MyPromise执行完毕时，状态还是pending，就会走到then中，此时then需要新增处理pending状态的回调，而且可能会有多个promise.then的调用。可以收集所有promise.then，也就是发布订阅的过程，放到数组中去。什么时候去执行数组中的函数呢？在resolve或reject执行的时候去执行数组中的函数。   
实现：采用发布订阅的模式。
```js
// MyPromise.js
// 状态
const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'

class MyPromise {
    // 实例化就会执行
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined; // resovle的参数，开始时不明确的
        this.reason = undefined; // reject的参数，开始时不明确的

        this.onFulfulledCallbacks = []; // 所有的成功的回调函数
        this.onRejectedCallbacks = []; // 所有的失败的回调函数

        // 因为每次实例化MyPromise相当于传入不同的resolve，而声明在constructor外面，相当于写在prototype上
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED; // 更改状态
                this.value = value
            }

            // 发布
            this.onFulfulledCallbacks.forEach(fn => fn())
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED; // 更改状态
                this.reason = reason;
            }

            // 发布
            this.onRejectedCallbacks.forEach(fn => fn())

        }

        // 捕获throw new Error
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }


    }

    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }

        if (this.status === REJECTED) {
            onRejected(this.reason);
        }

        if (this.status === PENDING) {
            // 发布订阅模式：在pendings时依次收集成功的回调或者失败的回调。设置两个收集容器：onFulfulledCallbacks和onRejectedCallbacks。

            // 订阅
            this.onFulfulledCallbacks.push(() => {
                onFulfilled(this.value); // 把函数依次放到数组中
            });

            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            })

        }
    }
}

module.exports = MyPromise;
```

## 链式调用
原生
```js
// 链式调用的特点
//1. 通过return来传递结果
//2. 通过新的promise resolve结果
//3. 通过新的promisereject原因
//4. then走了失败的回调函数后，再走then
//5. then中使用throw new Error
//6. 用catch捕获异常
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

// 3.通过新的promisereject原因
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

// catch在Promise的源码层面上就是一个then，catch也是遵循then的运行原则
// 成功的条件：
// 1. then return普通JavaScript value
// 2. then return新的promise成功态的结果 value

// 失败的条件：
// 1. then return 新的promise失败态的原因 reason
// 2. then 抛出异常throw new Error

// promise链式调用
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
