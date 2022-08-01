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

### 1. resolve回调函数参数是原始值
```javascript
const MyPromise = require('./MyPromise.js')

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('p1 resolve');
    }, 1000);
})

MyPromise.resolve(p1)
    .then(res => console.log(res, 'success'),
        err => console.log(err, 'fail'))

// p1 reject fail
```

```javascript
class MyPromise{
    // ...
    static resolve(value) {
        return new MyPromise((resolve, reject) => {
            resolve(value);
        })
    }
}
```

### 2. resolve回调函数参数是Promise对象
```javascript
const MyPromise = require('./MyPromise.js')

const p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(new MyPromise((resolve, reject) => {
            resolve(1);
        }));
    }, 1000);
})

MyPromise.resolve(p1)
    .then(res => console.log(res, 'success'),
        err => console.log(err, 'fail'))

// Promise { 1 } fail
```
```javascript
const resolve = (value) => {
    // value 是Promise实例对象的情况下，需要将then方法取出来
    if (value instanceof MyPromise) {
        value.then(x => resolve(x), e => reject(e));
        return;
    }
    // 成功回调函数控制Promise实例对象成功的状态和参数
    if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 发布。执行异步操作成功的回调函数
        this.onFulfilledCallbacks.forEach(fn => fn())
    }
}
static resolve(value) {
    return new MyPromise((resolve, reject) => {
        resolve(value);
    })
}
```

## Promise.reject()
1. Promise.reject方法的参数只能是普通纸，不能是一个Promise对象
2. Promise.reject方法返回一个失败状态的Promise对象

```javascript
static reject(value){
    return new MyPromise((resolve, reject)=>{
        reject(value)
    })
}
```

## Promise.all()
1. 将回调函数的返回值放入数组的时候，需要按照索引值进行存放
2. 无论返回值是普通值还是Promise对象，都要按照参数的序列放；通过数组的下标进行存放
3. 什么时间return数组呢？用计步器的机制，判断参数promise的长度等于数组arr的长度时，将数组return出去。
4. 有一个promise对象错误，就直接执行catch，直接返回。

```javascript
static all(promiseArr) {
    let resArr = [],
        idx = 0; // 计步

    return new MyPromise((resolve, reject) => {
        promiseArr.map((promise, index) => {
            if (isPromise(promise)) {
                promise.then((res) => {
                    // 收集成功的结果
                    formatResArr(res, index, resolve);
                }, reject) // 失败的结果直接执行reject
            } else {
                formatResArr(promise, index, resolve);
            }
        })
    })

    function formatResArr(value, index, resolve) {
        resArr[index] = value;

        // 出现 [ <2 empty items>, 1 ]的情况
        // if (resArr.length === promiseArr.length) {
        //     resolve(resArr);
        // }

        // 如果idx === promiseArr.length说明全部完成，
        if (++idx === promiseArr.length) {
            resolve(resArr);
        }
    }

    function isPromise(x) {
        if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
            let then = x.then;

            return typeof then === 'function';
        }
        return false;
    }
}
```

## Promise.allSettled
1. 成功和错误的结果都返回，返回格式
```javascript
[
    { status: 'fulfilled', value: xxx},
    { status: 'rejected', value: xxx}
]
```
2. 等到所有promise执行结束再返回结果。

```javascript
static allSettled(promiseArr) {
    let resArr = [],
        idx = 0;

    // 不是迭代对象，即null，undefined和没有Symbol(Symbol.iterator)属性
    if (!isIterable(promiseArr)) {
        throw new TypeError('MyError: ' + promiseArr + ' is not iterable (cannot read property Symbol(Symbol.iterator)) at Function.allSettled');
    }

    return new MyPromise((resolve, reject) => {
        // 如果promiseArr = []
        if (promiseArr.length === 0) {
            this.resolve([])
        }

        promiseArr.map((promise, index) => {
            if (isPromise(promise)) {
                promise.then((value) => {
                    // 收集成功的结果
                    formatResArr('fulfilled', value, index, resolve);
                }, reason => {
                    // 收集失败的结果
                    formatResArr('rejected', reason, index, resolve);
                })
            } else {
                formatResArr('fulfilled', promise, index, resolve);
            }
        })
    })

    function formatResArr(status, value, index, resolve) {
        switch (status) {
            case 'fulfilled':
                resArr[index] = {
                    status,
                    value
                }
                break;
            case 'rejected':
                resArr[index] = {
                    status,
                    reason: value
                }
                break;
            default:
                break;
        }
        if (++idx === promiseArr.length) {
            resolve(resArr)
        }
    }
}

// 判断 value 是否是迭代对象
function isIterable(value) {
    return value !== null && value !== undefined && typeof value[Symbol.iterator] === 'function';
}

// 判断 x 是否是 Promise 对象
function isPromise(x) {
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let then = x.then;

        return typeof then === 'function';
    }
    return false;
}

```

## Promise.race()
1. 返回第一个成功或者失败的Promise对象

```javascript
static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
        promiseArr.map((promise) => {
            if (isPromise(promise)) {
                promise.then(resolve, reject)
            } else {
                resolve(promise);
            }
        })
    })
}
```

## Promise.prototype.finally()
1. 只存在一个参数（回调函数），不管成功或者失败，都会走的这个函数，但是回调函数拿不到上次返回的值。
2. 如果回调函数返回Promise对象，会等到Promise执行，resolve成功函数是没有返回值的，reject失败函数有返回值。

```javascript
// 1. 外层是resolve，finally里面也是resolve。返回外层的resolve值
Promise.resolve('promise success').finally(() => {
    console.log('finally');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('new Promise success')
        }, 1000)

    })
}).then(res => {
    console.log('success', res);
}, err => {
    console.log('error', err);
})

/**
finally
success promise success
 */

// 2. 外层是resolve，finally里面是reject，返回里面reject值
Promise.resolve('promise success').finally(() => {
    console.log('finally');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('new Promise success')
        }, 1000)

    })
}).then(res => {
    console.log('success', res);
}, err => {
    console.log('error', err);
})

/**
finally
error new Promise success
 */

// 3. 外层是reject，finally里面是resolve，返回外层reject值
Promise.reject('promise success').finally(() => {
    console.log('finally');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('new Promise success')
        }, 1000)

    })
}).then(res => {
    console.log('success', res);
}, err => {
    console.log('error', err);
})

/**
finally
error promise success
 */

// 4. 外层reject，finally里面是reject，返回里面reject值
Promise.reject('promise success').finally(() => {
    console.log('finally');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('new Promise success')
        }, 1000)

    })
}).then(res => {
    console.log('success', res);
}, err => {
    console.log('error', err);
})

/**
finally
error new Promise success
 */
```
总结：
1. 如果两个都是成功，取外面的结果
2. 如果外面是成功，里面是失败，取里面的结果（失败）
3. 如果外面是失败，里面是成功，取外面的结果（失败）
4. 如果外面是失败，里面是失败，取里面的结果（失败）

```javascript
finally(finallyCallback) {
    return this.then(value => {
        return MyPromise.resolve(finallyCallback()).then(() => value);
    }, reason => {
        return MyPromise.resolve(finallyCallback()).then(() => {
            throw reason
        })
    })
}
```

## promisify
工具函数utils.js
```javascript
module.exports = {
    promisify(fn) {
        return function(...args) {
            return new MyPromise((resolve, reject) => {
                // fn -> fs.readFile
                fn(...args, (error, data) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(data);
                })
            })

        }
    },
    promisifyAll(fns) {
        Object.keys(fns).map(fnName => {
            if (typeof fns[fnName] === 'function') {
                fns[fnName + 'Async'] = this.promisify(fns[fnName]);
            }
        });
        return fns;
    }
}
```
测试
```javascript
const fs = require('fs').promises;

const util = require('./util.js');
const readFile = util.promisify(fs.readFile);

fs.readFile('./data/user.json', 'utf8').then(res => {
    console.log(res);
}, err => {
    console.log(err);
})
```

## promisifyAll



## MyPromise源码
```javascript
const PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected';

function resolvePromise(promise2, x, resolve, reject) {
    /**
     * 此时存在三个问题：
     * 1. 根据PromiseA++的规范，如果回调函数返回引用值，此时then方法返回
     * 的PromiseU币能与回调函数返回的Promise实例相同。
     * 2. 此时获取不到promise2实例对象，因为promise2作为Promise实例对象，
     * 此时构造函数并未执行完成，而在内部获取promise2肯定是获取不到的，又
     * 因为promise2被let声明，所以此时产生暂时性死区的问题-->通过setTimeout
     * 解决。
     * 3. 返回值x需不需要设置延迟的问题，如果不给返回值设置延时，此时
     * promise2的executor函数是同步执行，此时x返回值会立即出结果，与全局同步
     * 代码执行发生bug，所以也需要定时执行。
     */
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>]'));
    }

    // 为了让每一次then方法中的回调函数执行一次，所以可以设置一把锁
    let called = false;

    // 判断当前返回值x是promise对象、thenable对象、普通对象、普通值
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 判断对象类型
        // 获取对象的then方法，此时then方法不存在，抛出异常，进行捕获
        try {
            let then = x.then; // throw error
            if (typeof then === 'function') { // Promise，或者是thenable对象
                // 改变promise对象回调函数，所以需要改变当前then方法中的this指向
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) => {
                    if (called) return;
                    called = true;
                    reject(r);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            // 普通对象，执行promise2成功的回调函数
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class MyPromise {
    // const isPromise = value => typeof value.then === 'function';
    // 构造器
    constructor(executor) {
        // 设置Promise实例对象的状态，默认pending状态
        this.status = PENDING;
        // 设置Promise实例对象成功回调函数的参数，默认undefined
        this.value = undefined;
        // 设置Promise实例对象失败回调函数的参数，默认undefined
        this.reason = undefined;

        // 设置异步操作成功的回调函数
        this.onFulfilledCallbacks = [];
        // 设置异步操作失败的回调函数
        this.onRejectedCallbacks = [];

        // 设置成功回调函数
        const resolve = (value) => {
            // value 是Promise实例对象的情况下，需要将then方法取出来
            if (value instanceof MyPromise) {
                value.then(x => resolve(x), e => reject(e));
                return;
            }
            // 成功回调函数控制Promise实例对象成功的状态和参数
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                // 发布。执行异步操作成功的回调函数
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }

        // 设置失败回调函数
        const reject = (reason) => {
            // value 是Promise实例对象的情况下，需要将then方法取出来
            if (reason instanceof MyPromise) {
                reason.then(data => resolve(data), err => reject(err));
                return;
            }

            // 失败回调函数控制Promise实例对象失败的状态和参数
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                // 发布。执行异步操作失败的回调函数
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        // executor执行者函数执行
        try {
            /**
             * 1. try...catch语句包裹因为executor函数执行可能存在异常，所以需要
             * 捕获.
             * 2. resolve，reject是形式参数还是实例参数，因为executor是作为实例
             * 参数进行传递的，而resolve，reject是形式参数，那么形式参数要与实际
             * 参数做对应。
             */
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }

    }

    // Promise.prototype的then方法，存在成功的回调，失败的回调
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
            /**
             * 1. then()方法的链式调用的入口在哪里？有人可能认为then方法返回
             * this即可，但是返回this，此时当前的this指代的上一个Promise实例
             * 对象，而下一个then方法与上一个Promise实例对象并没有关系，所以
             * 每次调用then方法都会返回一个全新的Promise对象
             * 2. 链式调用的关键在哪呢？也就是说上一次then方法中的成功或者失败
             * 回调函数的返回值是下一次then方法成功或者失败回调函数的参数（针
             * 对原始值）
             */
        let promise2 = new MyPromise((resolve, reject) => {
            // 根据Promise实例对象的状态进行调用不同的回调函数
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    // 因为resolvePromise可能出现失败的情况，所以要try...catch
                    try {
                        let x = onFulfilled(this.value);
                        /**
                         * Promsie链式调用代码操作（成功或者失败函数返回引用值）
                         * 的入口在哪呢？就是上一次成功或者失败函数返回值的判断：
                         * 判断x是否是原始值还是引用值。
                         */
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        console.log(e);
                        reject(e)
                    }
                }, 0)
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }

            /**
             * Promsie异步操作的入口在哪呢？setTimeout是同步接口，会在WebAPIS中
             * 注册回调函数（异步），而promise.then是同步操作，此时promise的状态
             * 必须等到回调函数执行才能够确定，所以此时promise的状态是pending，
             * 所以Promise实例对象还存在一个pending状态
             */
            if (this.status === PENDING) {

                /**
                 * 通过哪种方式可以确定什么时间执行回调函数呢？利用发布订阅和装饰器
                 * 的思想，先将回调函数保存，等到Promise实例对象状态确定之后再去
                 * 执行。
                 * 为什么不直接操作呢？因为如果直接保存成功或者失败的回调函数，此时
                 * 回调函数的参数会丢失。
                 */
                this.onFulfilledCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })

                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2;
    }

    // catch方法，实际上就是then方法传入失败的回调
    catch (errorCallback) {
        return this.then(null, errorCallback);
    } finally(finallyCallback) {
        return this.then(value => {
            return MyPromise.resolve(finallyCallback()).then(() => value);
        }, reason => {
            return MyPromise.resolve(finallyCallback()).then(() => {
                throw reason
            })
        })
    }


    static resolve(value) {
        return new MyPromise((resolve, reject) => {
            resolve(value);
        })
    }

    static reject(value) {
        return new MyPromise((resolve, reject) => {
            reject(value)
        })
    }

    static all(promiseArr) {
        let resArr = [],
            idx = 0; // 计步

        return new MyPromise((resolve, reject) => {
            promiseArr.map((promise, index) => {
                if (isPromise(promise)) {
                    promise.then((res) => {
                        formatResArr(res, index, resolve);
                    }, reject)
                } else {
                    formatResArr(promise, index, resolve);
                }
            })
        })

        function formatResArr(value, index, resolve) {
            resArr[index] = value;

            // 出现 [ <2 empty items>, 1 ]的情况
            // if (resArr.length === promiseArr.length) {
            //     resolve(resArr);
            // }

            // 如果idx === promiseArr.length说明全部完成，
            if (++idx === promiseArr.length) {
                resolve(resArr);
            }
        }


    }

    static allSettled(promiseArr) {
        let resArr = [],
            idx = 0;

        if (!isIterable(promiseArr)) {
            throw new TypeError('MyError: ' + promiseArr + ' is not iterable (cannot read property Symbol(Symbol.iterator)) at Function.allSettled');
        }

        return new MyPromise((resolve, reject) => {
            // 如果promiseArr = []
            if (promiseArr.length === 0) {
                this.resolve([])
            }

            promiseArr.map((promise, index) => {
                if (isPromise(promise)) {
                    promise.then((value) => {
                        formatResArr('fulfilled', value, index, resolve);
                    }, reason => {
                        formatResArr('rejected', reason, index, resolve);
                    })
                } else {
                    formatResArr('fulfilled', promise, index, resolve);
                }
            })
        })

        function formatResArr(status, value, index, resolve) {
            switch (status) {
                case 'fulfilled':
                    resArr[index] = {
                        status,
                        value
                    }
                    break;
                case 'rejected':
                    resArr[index] = {
                        status,
                        reason: value
                    }
                    break;
                default:
                    break;
            }
            if (++idx === promiseArr.length) {
                resolve(resArr)
            }
        }
    }

    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            promiseArr.map((promise) => {
                if (isPromise(promise)) {
                    promise.then(resolve, reject)
                } else {
                    resolve(promise);
                }
            })
        })
    }
}

// 判断value是否是迭代对象
function isIterable(value) {
    return value !== null && value !== undefined && typeof value[Symbol.iterator] === 'function';
}

function isPromise(x) {
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let then = x.then;

        return typeof then === 'function';
    }
    return false;
}

MyPromise.defer = MyPromise.deferred = function() {
    let deferred = {};
    deferred.promise = new MyPromise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

module.exports = MyPromise
```

