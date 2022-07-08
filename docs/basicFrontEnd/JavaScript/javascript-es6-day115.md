---
autoGroup-2: ES6
sidebarDepth: 3
title: 手动实现Promise
---

## 实现Promise
promise是new Promise()出来的对象。    
一般函数写法
```js
doSomething(function(value){
    console.log('Got a value:',value);
})
function doSomething(callback){
    var value = 66;
    callback(value);
}
```
改写成下面的.then的写法
```js
doSomething().then(function(data) {
    console.log('Got a value:', data);
})

function doSomething() {
    return {
        // then接受的是一个函数参数
        then: function(callback) {
            var value = 66;
            callback(value);
        }
    }
}
```
使用myPromise实现
1. 第一步
```js
function myPromise(fn) {
    var callback = null;
    this.then = function(cb) {
        callback = cb
    }

    function resolve(value) {
        callback(value);
    }

    fn(resolve);
}


function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}

/**
 * 1. new myPromise() 相当于执行 fn(resolve)
    fn()就是传入的函数，即
    function(resolve) {
        var value = 66;
        resolve(value);
    }
    执行函数，相当于执行下面代码。
   2. var value = 66;
      resolve(66);

      resolve定义为：
      function resolve(){
          callback(value);
      }
      callback(value);
   3. callback(66);
   实际上new myPromise(...)就是得到callback(value)
 */

doSomething().then(function(data) {
    console.log('Got a value:', data);
});
/**
 * 4. 执行then，接受cb，即
        function() {
            console.log('Got a value:', data);
        }
        在then函数中，将cb赋值给callback。
    5. 此时callback从null变为函数
    6. 在第三步是就需要callback函数了，而callback赋值是在第五步。
 */
```
运行结果会出现错误：Uncaught TypeError: callback is not a function
```js
function myPromise(fn) {
    var callback = null;
    this.then = function(cb) {
        callback = cb
    }

    function resolve(value) {
        // 新增
        setTimeout(() => {
            callback(value);
        }, 1)
    }

    fn(resolve);
}
```
2. 第二步
```js
function myPromise(fn) {
    var state = 'pending'; // pending -> resolved
    var value;
    var callback = null;
    this.then = function(onResolved) {
        handle(onResolved);
    }

    // state状态改变；参数value->newValue
    function resolve(newValue) {
        value = newValue;
        state = 'resolved';
    }

    function handle(onResolved) {
        onResolved(value);
    }

    fn(resolve);
}
let promise = doSomething();
```
执行doSomeThing()实际上就返回一个对象，发生了两件事。
```js
{
    // 1. 属性值发生改变
    value = 66;
    state = 'resolved';
    // 2. 定义了then方法
    then: function(){}
}
```
执行then方法
```js
promise.then(function(data) {
    console.log('Got a value:', data); // Got a value: 66
})
/**
 * 
    then方法：
    function(onResolved) {
        handle(onResolved);
    }

    onResolved就是调用then方法传进去的函数参数，即
    function(data) {
        console.log('Got a value:', data);
    }

    handle是内部定义的函数：
    function handle(onResolved) {
        onResolved(value);
    }

    handle(onResolved)就是执行onResolved(value)；即实行函数
    function(data) {
        console.log('Got a value:', data);
    }

    即then最终就是执行函数：
    function(data) {
        console.log('Got a value:', data);
    }
    参数data就是value，也就是执行doSomething()是修改过的value=66
 */
```
完整代码
```js
function myPromise(fn) {
    var state = 'pending'; // pending -> resolved
    var value;
    var callback = null;
    this.then = function(onResolved) {
        handle(onResolved);
    }

    // state状态改变；参数
    function resolve(newValue) {
        value = newValue;
        state = 'resolved';
    }

    function handle(onResolved) {
        onResolved(value);
    }

    fn(resolve);
}


function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}

doSomething().then(function(data) {
    console.log('Got a value:', data);
});
```

## 实现链式调用
```js
function myPromise(fn) {
    var state = 'pending'; // pending -> resolved
    var value;

    this.then = function(onResolved) {
        // handle(onResolved);
        // 传入resolve来解析
        return new myPromise(function(resolve) {
            handle({
                onResolved,
                resolve
            })
        })
    }

    // state状态改变；参数
    function resolve(newValue) {
        value = newValue;
        state = 'resolved';
    }

    function handle(handler) {
        // then()没有传入参数时
        if(!handler.onResolved){
            handler.resolve(value);
            return;
        }
        let returnValue = handler.onResolved(value)
        handler.resolve(returnValue);
    }

    fn(resolve);
}


function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}


doSomething().then(function(data) {
    console.log('Got a value:', data);
    return 88;
}).then(function(secondResult) {
    console.log('Got second value:', secondResult);
});
/**
    then返回promise对象
    let promise1 = doSomeThing();相当于执行下面函数
    function doSomething() {
        return new myPromise(function(resolve) {
            var value = 66;
            resolve(value);
        })
    }

    let promise2 = promise1.then();相当于执行下面函数
    this.then = function(onResolved) {
        return new myPromise(function(resolve) {
            handle({
                onResolved,
                resolve
            })
        })
    }

    promise1是一个myPromise对象，传入的参数
    fn: function(resolve) {
            var value = 66;
            resolve(value);
        }
    
    promise2是一个myPromise对象， 传入的参数
    fn: function(resolve) {
            handle({
                onResolved,
                resolve
            })
        }
    

    promise1和promise2虽然传入的参数不一样，但是都是myPromise构造函数的实例对象，因此对象的属性和方法是一模一样的。

    promise1.then = function(onResolve){
        return new myPromise(function(resolve) {
            handle({
                onResolved: function(secondResult){
                    console.log('Got second value:', secondResult);
                },
                resolve: function(newValue) {
                    value = newValue;
                    state = 'resolved';
                }
            })
        })
    }

    handle(handler)就是执行：
        let returnValue = handler.onResolved(value)
        handler.resolve(returnValue);

    执行
    handler.onResolved = function(value){
        console.log('Got second value:', value);
    }
    handler.resolve = function(newValue) {
        value = newValue;
        state = 'resolved';
    }
 */
```

## 返回值为myPromise的处理
```js
function myPromise(fn) {
    var state = 'pending'; // pending -> resolved
    var value;
    var callback = null;
    this.then = function(onResolved) {
        // handle(onResolved);
        // 传入resolve来解析
        return new myPromise(function(resolve) {
            handle({
                onResolved,
                resolve
            })
        })
    }

    // state状态改变；参数
    function resolve(newValue) {
        if (newValue && typeof newValue.then === 'function') {
            newValue.then(resolve);
            return;
        }
        value = newValue;
        state = 'resolved';
    }

    function handle(handler) {
        // then()没有传入参数时
        if (!handler.onResolved) {
            handler.resolve(value);
            return;
        }
        let returnValue = handler.onResolved(value)
        handler.resolve(returnValue);
    }

    fn(resolve);
}


function doSomething() {
    return new myPromise(function(resolve) {
        var value = 66;
        resolve(value);
    })
}

function doSomethingElse(value) {
    return new Promise(function(resolve) {
        resolve('did something else with ', value)
    })
}


doSomething().then(function(data) {
    console.log('Got a value:', data);
    return doSomethingElse(data);
}).then(function(secondResult) {
    console.log('Got second value:', secondResult);
});
```