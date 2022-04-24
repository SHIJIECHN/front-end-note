---
autoGroup-2: ES6
sidebarDepth: 3
title: Promise
---

## Promise
1. 三种状态：
   - 1. pending（进行中）
   - 2. fufilled（resolve）（已成功）
   - 3. reject（已失败）  
  
对象的状态不受外界影响。


2. 状态不可逆。promise固化以后，再对promise对象添加回调，是可以直接拿到这个结果的；如果是事件的话，一旦错过再去监听，是得不到结果的。

```js
const promise = new Promise(function(resolve, reject) {

    if ( /**异步操作成功 */ ) {
        resolve(value);
    } else {
        reject(error)
    }
})
// 用then方法分别执行resolved状态和rejected状态的回调函数。
promise.then((value) => {
    // success
}, (error) => {
    // failure
})
```
Promise新建后会立即执行
```js
const promise = new Promise(function(resolve, reject) {
    console.log(0);
    resolve(1)
})

promise.then((value) => {
    // success
    console.log(value);
}, (error) => {
    // failure
    console.log(error)
})
console.log(2);
/**
 * 0 2 1
 */
```
Promise新建后立即执行，所以首先输出的是0，然后，then方法指定的回调函数，将在当前脚本所有同步任务执行才会执行，所以1最后输出。


扩充：setTimeout与Promise执行顺序。
```js
setTimeout(function() {
    console.log('setTimeout');
}, 30)
const promise = new Promise(function(resolve, reject) {
    console.log(0);
    resolve(1)
})

promise.then((value) => {
    // success
    console.log(value);
}, (error) => {
    // failure
})
console.log(2);
/**
 * 0 2 1 setTimeout
 */
```
setTimeout最后执行。

JS异步：宏任务与微任务。微任务（promise，process.nextTick()），其他都是宏任务。微任务优先级高。
```js
Promise.resolve().then(() => {
    console.log('promise1');
    setTimeout(() => {
        console.log('setTimeout2');
    })
})

setTimeout(() => {
    console.log('setTimeout1');
    Promise.resolve().then(() => {
        console.log('promise2');
    })
})

/**
 * promise1
 * setTimeout1
 * promise2
 * setTimeout2
 */
```

如果调用resolve函数和reject函数时带有参数，那么他们的参数会被传递给回调函数。

```js
const p1 = new Promise(function(resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000);
})

const p2 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve(p1), 1000); // p1返回了reject，导致p2自己的状态无效了
})

p2
    .then(result => console.log(result))
    .catch(error => console.log(error))
    // Error: fail

/*******************************************************/

const promise = new Promise(function(resolve, reject) {
    resolve(a); // 只要在这里抛出错误，那么一定会更改此时promise的状态，此时resolve不起作用
})

promise.then(value => {
    console.log('resovle: ', value);
}, reason => {
    console.log('reject: ', reason); // reject:  ReferenceError: a is not defined
})
```


## Promise.prototype.then()
```js
new Promise((resolve, reject) => {
    resolve(1);
}).then(res => {
    console.log(res); // 1
    return res;
}).then(r => {
    console.log(r); // 1
})
```
第一个回调函数完成以后，会将结果作为参数，传入第二个回调函数。
```js
p.then( val => console.log('fulfilled: ', val))
    .catch( err => console.log('reject: ', err));

// 等同于
p.then( val => console.log('fulfilled: ', val))
    .then( null, err => console.log('reject: ', err));
```
catch相当于then回调中第一个参数为null。

## Promise.prototype.catch()
```js
let p = new Promise((resolve, reject) => {
    //...
});

p.then(res => {
    console.log(res);
}).catch(r => {
    console.log(r);
})
```
p与then回调运行时发生的错误均可被catch()捕获。

```js
const p = new Promise(function(resolve, reject) {
    resolve('ok');
    throw new Error('test');
})

p.then(value => console.log(value))
    .catch(error => console.log(error))
    // ok
```
在resolve语句后面，再次抛出错误，不会被捕获，等于没有抛出，因为Promise的状态一旦改变，就永久保持状态，不会再变了。
```js
const p = new Promise(function(resolve, reject) {
    resolve('ok');
    console.log(1);
})

p.then(value => console.log(value))
    .catch(error => console.log(error))
    // ok
    // 1
```
在resolve后面执行其他语句，还是会执行。但是不应该在resolve或reject后面再进行其他操作，所以，最好在resolve前加上return语句。
```js
const p = new Promise(function(resolve, reject) {
    return resolve('ok');
    // resolve后面不应该进行其他操作，最好加return语句，后面就不会再执行
    console.log(1);
})

p.then(value => console.log(value))
    .catch(error => console.log(error))
    // ok
```

## Promise.all()
```js
const p = Promise.all([p1, p2, p3]);
p.then(res => {
    console.log(res); // p1, p2,p3返回值组成的一个数组
}).catch(e => {
    console.log(e); // 第一个被reject的实例的返回值
})
```
p的状态由p1、p2、p3决定。三个都是fulfilled，p的状态才会变成fulfilled；三者中只要有一状态为rejected，p的状态就是rejected。   
如果p1、p2、p3自己定义了catch方法，那么一旦被rejected，并不会触发Promise.all()的catch方法。

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p1: 1000ms')
        reject('p1: 1000ms')
    }, 1000)
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p2: 1000ms')
        reject('p2: 1000ms')
    }, 2000)
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p3: 3000ms')
        reject('p3: 3000ms')
    }, 3000)
});

let p = Promise.all([p1, p2, p3]);
p.then(res => console.log(res)) // ['p1: 1000ms', 'p2: 1000ms', 'p3: 3000ms']
    .catch(e => console.log(e)) // p1: 1000ms
```

## Promise.race()
任意一个发生改变，p状态就跟着改变。
```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p1: resolve 1000ms')
        reject('p1: reject 1000ms')
    }, 1000)
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p2: resolve 2000ms')
        reject('p2: reject 1000ms')
    }, 2000)
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve('p3: resolve 3000ms')
        reject('p3: reject 3000ms')
    }, 3000)
});

let p = Promise.race([p1, p2, p3]);
p.then(res => console.log(res)) // p1: resolve 1000ms
    .catch(e => console.log(e)) // p1: reject 1000ms
```

## Promise.resolve()
参数
1. 参数是thenable   
具有then方法的对象
```js
let thenable = {
    then: function(resolve, reject) {
        resolve('reject')
    }
}

let p1 = Promise.resolve(thenable);

p1.then(value => console.log(value)) // 42
    .catch(e => console.log(e))
```
2. 参数不具有then方法的对象，或根本不是对象
Promise.resolve()方法返回一个新的Promise对象，状态为resolved
```js
const p = Promise.resolve('Hello');

p.then(value => console.log(value)) // Hello
```

立即resolve()的Promise对象，是在本轮“事件循环”的结束时执行，而不是在下一轮“事件循环”的开始时。
```js
setTimeout(() => {
    console.log('three');
}, 0);

Promise.resolve().then(() => {
    console.log('two');
})

console.log('one');
/**
 * one two three
 */
```

## 练习
```js
import { readFile } from 'fs';

readFile('./test1.txt', 'utf-8', (err, data) => {
    if (data) {
        readFile(data, 'utf-8', (err, data) => {
            if (data) {
                readFile(data, 'utf-8', (err, data) => {
                    console.log(data);
                })
            }
        })
    }
})

// 采用Promise方式
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        readFile(path, 'utf-8', (err, data) => {
            if (data) {
                resolve(data);
            }
        })
    })
}

readFilePromise('./test1.txt').then(data => {
    return readFilePromise(data);
}).then(data => {
    return readFilePromise(data);
}).then(data => {
    console.log(data);
})
```
将函数变成Promise
```js
function myPromisify(func) {
    return function(...arg) {
        return new Promise((resolve, reject) => {
            func(...arg, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}

let readFilePromisify = myPromisify(readFile)

readFilePromisify('./test1.txt', 'utf-8').then(data => {
    return readFilePromisify(data, 'utf-8');
}).then(data => {
    return readFilePromisify(data, 'utf-8');
}).then(data => {
    console.log(data);
})
```
Node提供了promisify函数可以直接使用
```js
let readFilePromisify = promisify(readFile); // utils.promisify();
```

将fs模块上面的方法转成Promise
```js
function myPromisifyAll(obj) {
    for (let [key, fn] of Object.entries(obj)) {
        if (typeof fn === 'function') {
            obj[key + 'Async'] = myPromisify(fn);
        }
    }
}

myPromisifyAll(fs);
fs.readFileAsync('./test1.txt', 'utf-8').then(data => {
    return fs.readFileAsync(data, 'utf-8');
}).then(data => {
    return fs.readFileSync(data, 'utf-8');
}).then(data => {
    console.log(data);
})
```