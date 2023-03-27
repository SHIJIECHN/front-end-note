---
autoGroup-4: JavaScript碎片知识
sidebarDepth: 3
title: Event Loop（浏览器）
---

## Event Loop

<img :src="$withBase('/basicFrontEnd/JavaScript/EventLoop.png')" alt="EventLoop" />

- 执行栈：所有代码都会放到这里执行；
- 微任务：语言标准提供的API运行，Promise，MutationObserve、process.nextTick、setImediate；
- GUI渲染：渲染DOM；
- 宏任务：宿主提供的异步方法和任务，setTimeout、setInterval、script、UI渲染、ajax、DOM事件；

### 1. 例子1
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Loop</title>
</head>
<body>
  <div id="J_wrapper" style="width: 200px; height: 30px; background: orange"></div>

  <script src="./1.js"></script>
</body>
</html>
```
1.js
```javascript
const oWrapper = document.querySelector('#J_wrapper')

console.log('start')

oWrapper.style.background = 'blue'

Promise.resolve().then(() => {
  console.log(1)
  for (let i = 1; i < 10000000000; i++) {
    let a = 1
  }
})
setTimeout(() => {
  console.log(2)
}, 0)

console.log('end')
```
结合事件循环图分析一下流程：
<img :src="$withBase('/basicFrontEnd/JavaScript/EventLoop02.gif')" alt="EventLoop" />

最终我们可以看到浏览器中输出的结果:
```Markdown
start
end
1
2
```
并且可以看到在输出1之后，会有一段等待 for 循环执行过程，之后才会把 div 的颜色变成蓝色。

### 2. 例子2
```javascript
console.log(1);
// setTimeout1
setTimeout(() => {
  console.log(2)
  // Promise1.then
  Promise.resolve().then(() => {
    console.log(3)
  })
}, 0);
// Promise2
new Promise((resolve, reject) => {
  console.log(4)
  // setTimeout2
  setTimeout(() => {
    console.log(5)
    resolve(6);
  }, 0);
  // Promise2.then1
}).then((res) => {
  console.log(7);
  // setTimeout3
  setTimeout(() => {
    console.log(res)
  }, 0);
  // Promise2.then2
}).then(() => {
  console.log(8);
  // Promise2.then3
}).then(() => {
  console.log(9);
});
```
1. script执行
```md
<执行栈>
<微任务>
<GUI渲染>
<宏任务>
```
2. console.log(1)放入执行栈
```md
<执行栈>
1
<微任务>
<GUI渲染>
<宏任务>
```
3. setTimeout1放入执行栈，回调被放入宏任务队列
```md
<执行栈>
1
<微任务>
<GUI渲染>
<宏任务>
setTimeout1
```
4. Promise2放入执行栈，Executor中的代码是同步执行的，所以console.log(4)会执行，输出4，之后setTimeout2执行，回调被放入宏任务队列
```md
<执行栈>
1
4
<微任务>
<GUI渲染>
<宏任务>
setTimeout1
setTimeout2
```
5. 因为Promise2中的状态没有变成Fullfilled，所以他很还不会被执行。
6. 执行栈空闲，微任务为空，GUI渲染为空，取一个宏任务setTimeout1的回调放入执行栈，输出2，之后Promise.then1回调放入微任务队列：
```md
<执行栈>
1
4
2
<微任务>
Promise1.then
<GUI渲染>
<宏任务>
setTimeout2
```
7. 继续下一轮循环，取出所有微任务回调放入执行栈，console.log(3)执行，输出3
```md
<执行栈>
1
4
2
3
<微任务>
<GUI渲染>
<宏任务>
setTimeout2
```
8. GUI为空，取出宏任务setTimeout2的回调执行，console.log(5)执行，输出5，之后Promise2的状态变成Fullfilled，Promise2.then1的回调被放入微任务队列：
```md
<执行栈>
1
4
2
3
5
<微任务>
Promise2.then1
<GUI渲染>
<宏任务>
```
1. 继续下一轮，清空当前所有的微任务；Promise.then1中的console.log(7)执行，输出7；之后，setTimeout3中的回调被放入宏任务队列；Promise.then2的回调放入微任务队列
```md
<执行栈>
1
4
2
3
5
7
<微任务>
Promise2.then2
<GUI渲染>
<宏任务>
setTimeout3
```
10. 继续执行Promise2.then2的回调，console.log(8)，输出8；Promise2.then3的回调被放入微任务队列
```md
<执行栈>
1
4
2
3
5
7
8
<微任务>
Promise2.then3
<GUI渲染>
<宏任务>
setTimeout3
```
11. 继续执行Promise2.then3的回调console.log(9)，输出9；至此，本轮所有微任务被清空完毕
```md
<执行栈>
1
4
2
3
5
7
8
9
<微任务>
<GUI渲染>
<宏任务>
setTimeout3
```
12. 没有 GUI渲染，取宏任务 setTimeout3 的回调，console.log(res) 执行，输出6:
```md
<执行栈>
1
4
2
3
5
7
8
9
6
<微任务>
<GUI渲染>
<宏任务>
```
最终输出结果：
```md
1
4
2
3
5
7
8
9
6
```

### 3. 例子3
```javascript
let p = new Promise(resolve => {
  resolve(1);
  Promise.resolve().then(() => console.log(2));
  console.log(4);
}).then(t => console.log(t));
console.log(3);
```
这个题比较有意思。我们需要知道 Promise 中的 Executor 里面的代码是同步执行的，并且在 resolve 之后的代码也还是会继续执行的，并且只有 then 被调用的时候，回调才会被放入微任务队列。
1. Promise的Executor执行，resolve(1):
```md
<执行栈>
<微任务>
<GUI渲染>
<宏任务>
```
2. Promise.resolve().then执行，回调被放入微任务队列；之后console.log(4)执行，输出4；
```md
<执行栈>
4
<微任务>
Promise.resolve().then
<GUI渲染>
<宏任务>
```
3. Promise.then执行，回调t => console.log(t)被放入微任务队列
```md
<执行栈>
4
<微任务>
Promise.resolve().then
Promise.then
<GUI渲染>
<宏任务>
```
4. console.log(3)执行，输出3：
```md
<执行栈>
4
3
<微任务>
Promise.resolve().then
Promise.then
<GUI渲染>
<宏任务>
```
5. 取出当前轮所有微任务回调执行，Promise.resolve().then先执行console.log(2)，输出2；之后Promise.then执行console.log(t)，输出1：
```md
<执行栈>
4
3
2
1
<微任务>
<GUI渲染>
<宏任务>
```
控制台输出：
```md
4
3
2
1
```
这里需要注意到，在 Promise 中，当且仅当状态变更， then 被调用的时候，它的回调才会被放入微任务队列。

### 4. 例子4
```javascript
// setTimeout1
setTimeout(() => {
  console.log('A');
}, 0);
var obj = {
  func: function() {
    // setTimeout2
    setTimeout(function() {
      console.log('B');
    }, 0);
    return new Promise(function(resolve) {
      console.log('C');
      resolve();
    });
  },
};
obj.func().then(function() {
  console.log('D');
});
console.log('E');
```
控制台输出：
```md
C
E
D
A
B
```

### 5. 例子5
```javascript
console.log("script start");

// setTimeout1
setTimeout(function() {
  console.log("setTimeout---0");
}, 0);

// setTimeout2
setTimeout(function() {
  console.log("setTimeout---200");
  // setTimeout3
  setTimeout(function() {
    console.log("inner-setTimeout---0");
  });
  // Promise1.then
  Promise.resolve().then(function() {
    console.log("promise5");
  });
}, 0);

// Promise2
Promise.resolve()
  // Promise2.then1
  .then(function() {
    console.log("promise1");
  })
  // Promise2.then2
  .then(function() {
    console.log("promise2");
  });
// Promise3.then
Promise.resolve().then(function() {
  console.log("promise3");
});
console.log("script end");
```
控制台输出：
```md
script start
script end
promise1
promise3
promise2
setTimeout---0
setTimeout---200
promise5
innner-setTimeout---0
```

#### 例子5-1
```javascript
console.log('start')

// Promise1
Promise.resolve()
  // Promise1.then1
  .then(() => {
    console.log(1)

    // setTimeout1
    setTimeout(() => {
      console.log(2)
    })
  })
  // Promise1.then2
  .then(() => {
    console.log(3)

    // setTimeout2
    setTimeout(() => {
      console.log(4)
    })
  })
  // Promise1.then3
  .then(() => {
    console.log(5)

    // setTimeout3
    setTimeout(() => {
      console.log(6)
    })
  })

// Promise2
Promise.resolve()
  // Promise2.then1
  .then(() => {
    console.log(7)

    // setTimeout4
    setTimeout(() => {
      console.log(8)
    })
  })
  // Promise2.then2
  .then(() => {
    console.log(9)

    // setTimeout5
    setTimeout(() => {
      console.log(10)
    })
  })
  // Promise2.then3
  .then(() => {
    console.log(11)

    // setTimeout6
    setTimeout(() => {
      console.log(12)
    })
  })

console.log('end')
```
控制台输出：
```md
1
7
3
9
5
11
2
8
4
10
6
12
```

### 6. 例子6
```javascript
// setTimeout1
setTimeout(function () {
  console.log('timeout1');
}, 1000);

console.log('start');

// Promise1.then
Promise.resolve().then(function () {
  console.log('promise1');
  // Promise2.then
  Promise.resolve().then(function () {
    console.log('promise2');
  });
  // setTimeout2
  setTimeout(function () {
    // Promise3.then
    Promise.resolve().then(function () {
      console.log('promise3');
    });
    console.log('timeout2')
  }, 0);
});
console.log('done');
```
1. script执行
```md
<执行栈>
<微任务>
<宏任务>
```
2. setTimeout1执行，回调放入宏任务队列
```md
<执行栈>
<微任务>
<宏任务>
setTimeout1(延时1000)
```
3. console.log('start')输出start
```md
<执行栈>
start
<微任务>
<宏任务>
setTimeout1(延时1000)
```
4. Promise1.then执行，回调放入微任务队列
```md
<执行栈>
start
<微任务>
Promise1.then
<宏任务>
setTimeout1(延时1000)
```
5. console.log('done')输出done
```md
<执行栈>
start
done
<微任务>
Promise1.then
<宏任务>
setTimeout1(延时1000)
```
6. 清空微任务，Promise1.then的回调执行，console.log('promise1')，输出promise1；Promise2.then执行，回调放入微任务队列，setTimeout2执行，回调放入宏任务队列
```md
<执行栈>
start
done
promise1
<微任务>
Promise2.then
<宏任务>
setTimeout1(延时1000)
setTimeout2(延时0)
```
7. 继续本轮微任务，Promise2.then的回调执行console.log('promise2'),输出promise2
```md
<执行栈>
start
done
promise1
promise2
<微任务>
<宏任务>
setTimeout1(延时1000)
setTimeout2(延时0)
```
8. 取出一个宏任务回调执行，注意是延时已到了的执行，所以是setTimeout2的回调执行，Promise3.then执行，回调放入微任务队列，console.log('timeout2')执行，输出timeout2
```md
<执行栈>
start
done
promise1
promise2
timeout2
<微任务>
Promise3.then
<宏任务>
setTimeout1(延时1000)
```
9. 下一轮，清空微任务，Promise3.then的回调执行console.log('promise3')，输出promise3
```md
<执行栈>
start
done
promise1
promise2
timeout2
promise3
<微任务>
<宏任务>
setTimeout1(延时1000)
```
10. 等待1000ms延时过后，取出setTimeout1的回调执行console.log('timeout1')，输出timeout1
```md
<执行栈>
start
done
promise1
promise2
timeout2
promise3
timeout1
<微任务>
<宏任务>
```

控制台输出：
```md
start
done
promise1
promise2
timeout2
promise3
timeout1
```

### 7. 例子7
据说是一道头条的面试题。
```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1()
new Promise((resolve) => {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')
```

### async/await
async/await是一个promise的语法糖，一个函数，加上async关键字，那么它的返回值必须是一个Promise。await后面的语句，它也必定是个Promise，如果不是，将会被Promise.resolve()包裹。
```js
async function test () {
  console.log(1)
  await 2
  console.log(3)
}
// => 相当于
function test(){
  console.log(1);
  Promise.resolve(1).then(()=>{
    console.log(3)
  })
}

async function test1(){
  console.log(1);
  await test2();
  console.log(2);
}
async function test2(){
  console.log(3);
}
// => 相当于
function test1(){
  console.log(1);
  new Promise((resolve, reject)=>{
    console.log(3);
    resolve();
  }).then(()=>{
    console.log(2);
  })
}
```
分析下面题目
```js
function async1 () {
  console.log('async1 start')
  // Promise1
  new Promise((resolve, reject) => {
    async2()
    resolve()
  })
    // Promise1.then
    .then(() => {
      console.log('async1 end')
    })
}
function async2 () {
  console.log('async2')
}
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1()
// Promise2
new Promise((resolve) => {
  console.log('promise1')
  resolve()
})
  // Promise2.then
  .then(function () {
    console.log('promise2')
  })
console.log('script end')
```
1. script执行
```md
<执行栈>
<微任务>
<宏任务>
```

2. async1、async2函数声明，console.log('script start')执行，输出script start
```md
<执行栈>
script start
<微任务>
<宏任务>
```
3. setTimeout执行，回调放入宏任务队列
```md
<执行栈>
script start
<微任务>
<宏任务>
setTimeout
```
4. async1()执行，console.log('async1 start')执行，输出async1 start；Promise1的Executor内部代码执行，async2()执行，console.log('async2')执行，输出async2，Promise1.then的回调放入微任务队列
```md
<执行栈>
script start
async1 start
async2
<微任务>
Promise1.then
<宏任务>
setTimeout
```
5. Promise2的Executor内部代码执行console.log('promise1')，输出promise1；Promise2.then的回调放入微任务队列
```md
<执行栈>
script start
async1 start
async2
promise1
<微任务>
Promise1.then
Promise2.then
<宏任务>
setTimeout
```
6. console.log('script end') 执行，输出 script end
```md
<执行栈>
script start
async1 start
async2
promise1
script end
<微任务>
Promise1.then
Promise2.then
<宏任务>
setTimeout
```
7. 清空微任务；Promise1.then 的回调执行console.log('async1 end') ，输出 async1 end；Promise2.then 的回调执行console.log('promise2') ，输出 promise2
```md
<执行栈>
script start
async1 start
async2
promise1
script end
async1 end
promise2
<微任务>
<宏任务>
setTimeout
```
8. 取一个宏任务setTimeout1 的回调执行，输出 setTimeout
```md
<执行栈>
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
<微任务>
<宏任务>
```

### 8. 例子8
```js
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 2000);

Promise.resolve()
  .then(function() {
    console.log('promise1');
  })
  .then(function() {
    console.log('promise2');
  });


async function foo() {
  await bar()
  console.log('async1 end')
}
foo()

async function errorFunc () {
  try {
    await Promise.reject('error!!!')
  } catch(e) {
    console.log(e)
  }
  console.log('async1');
  return Promise.resolve('async1 success')
}
errorFunc().then(res => console.log(res))

function bar() {
  console.log('async2 end') 
}

console.log('script end');
```

### try/catch
```js
console.log(a) // 报错：Uncaught ReferenceError: a is not defined
```
如果使用try...catch包裹上面代码
```js
try{
  console.log(a);
}catch(e){
  console.log(a); // // 控制台输出：'Syntax Error: `a` is not defined'
}
```
看下Promise的情况
```js
async function test(){
  await Promise.reject('Error'); // 报错：Uncaught (in promise) Error
}
test();
```
使用try...catch包裹Promise的时候，如果Promise的状态变成Reject，那么会执行catch里面的代码
```js
async function test(){
  try{
    await Promise.reject('Error');
  }catch(e){
    console.log(e) // 控制台输出：'Error'
  }
  console.log('1');
}
test()

// 相当于
function test(){
  return new Promise((_, reject) => {
    reject('Error')
  }).then(() => {
    console.log('1');
  }).catch((e) => {
    console.log(e);
    console.log('1');
  })
}
```
如果Promise的状态变成Fullfilled，那么catch里面的代码不会执行
```js
async function test () {
  try {
    await Promise.resolve(1)
  } catch (e) {
    console.log(e)
  }
}
test()
```
注意：try...catch 并不会捕获 Promise.prototype.reject 出来的错误
```js
try {
  Promise.reject('Error') // 控制台报错：Uncaught (in promise) Error
} catch (e) {
  console.log(e)
}
```
但是加上了 await 之后，后续的代码执行完毕，会由 Generator.prototype.throw 来抛出一个错误，从而被 catch 捕捉到。   

并且，try...catch 不会阻止后面的代码执行。   
分析下面情况：
```js
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 2000);

// Promise1
Promise.resolve()
  // Promise1.then1
  .then(function() {
    console.log('promise1');
  })
  // Promise1.then2
  .then(function() {
    console.log('promise2');
  });


function foo() {
  // Promise2
  new Promise((resolve, reject) => {
    bar()
    resolve()
  })
    // Promise2.then
  	.then(() => {
  		console.log('async1 end')
  	})
}
foo()

function errorFunc () {
  // Promise3
  return new Promise((_, reject) => {
    reject('error!!!')
  })
    // Promise3.then
  	.then(
      () => {
        console.log('async1')
        return Promise.resolve('async1 success')
      },
      e => {
        console.log(e)
        console.log('async1')
        return Promise.resolve('async1 success')
      })
}

errorFunc().then(res => console.log(res))

function bar() {
  console.log('async2 end') 
}

console.log('script end');
```
1. 执行script
```md
<执行栈>
<微任务>
<宏任务>
```
2. console.log('script start') 执行，输出 script start
```md
<执行栈>
script start
<微任务>
<宏任务>
```
3. setTimeout 执行，回调放入宏任务队列
```md
<执行栈>
script start
<微任务>
<宏任务>
setTimeout(延时2000)
```
4. Promise1 执行，Promise1.then1 的回调放入微任务队列
```md
<执行栈>
script start
<微任务>
Promise1.then1
<宏任务>
setTimeout(延时2000)
```
5. foo() 执行，Promise2 的 Executor 执行，bar() 执行console.log('async2 end') ，输出 async2 end；Promise2.then 的回调放入微任务队列
```md
<执行栈>
script start
async2 end
<微任务>
Promise1.then1
Promise2.then
<宏任务>
setTimeout(延时2000)
```
6. errorFunc() 执行，Promise3 的 Executor 执行，Promise3.then 的回调放入微任务队列
```md
<执行栈>
script start
async2 end
<微任务>
Promise1.then1
Promise2.then
Promise3.then
<宏任务>
setTimeout(延时2000)
```
7. console.log('script end') 执行，输出 script end
```md
<执行栈>
script start
async2 end
script end
<微任务>
Promise1.then1
Promise2.then
Promise3.then
<宏任务>
setTimeout(延时2000)
```
8. 清空本轮微任务，Promise1.then1 的回调执行，输出 promise1；Promise1.then2 的回调放入微任务队列
```md
<执行栈>
script start
async2 end
script end
promise1
<微任务>
Promise2.then
Promise3.then
Promise1.then2
<宏任务>
setTimeout(延时2000)
```
9. Promise2.then 的回调执行，输出 async1 end
```md
<执行栈>
script start
async2 end
script end
promise1
async1 end
<微任务>
Promise3.then
Promise1.then2
<宏任务>
setTimeout(延时2000)
```
10. Promise3.then 的回调执行，因为它是一个 Rejected 的状态，所以会执行 then 中的第二个参数回调，输出 error!!!。console.log('async1') 执行，输出 async1; 同时返回一个 Fulfilled 状态的新 Promise；errorFunc().then 放入微任务队列
```md
<执行栈>
script start
async2 end
script end
promise1
async1 end
error!!!
async1
<微任务>
Promise1.then2
errorFunc().then 
<宏任务>
setTimeout(延时2000)
```
11. Promise1.then2 的回调执行，输出 promise2
```md
<执行栈>
script start
async2 end
script end
promise1
async1 end
error!!!
async1
promise2
<微任务>
errorFunc().then 
<宏任务>
setTimeout(延时2000)
```
12. errorFunc().then 的回调被执行，输出 async1 success；至此，本轮微任务被清空完毕
```md
<执行栈>
script start
async2 end
script end
promise1
async1 end
error!!!
async1
promise2
async1 success
<微任务>
<宏任务>
setTimeout(延时2000)
```
13. 延时 2000ms 之后，取 setTimeout 的回调执行，输出 setTimeout
```md
<执行栈>
script start
async2 end
script end
promise1
async1 end
error!!!
async1
promise2
async1 success
setTimeout
<微任务>
<宏任务>
```

### 9. 例子9
```js
console.log('start')

let i = 0

let t = setInterval(() => {
  if (i > 2) {
    clearInterval(t)
    t = null
    return
  }

  // Promise1.then
  Promise.resolve().then(() => {
    console.log('promise')
  })

  setTimeout(() => {
    // Promise2.then
    Promise.resolve().then(() => {
      console.log('setTimeout Promise')
    })
    console.log('setTimeout')
  })

  console.log('setInterval')

  i++
}, 50)

console.log('end')
```